import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { getStripe } from "@/lib/stripe";
import { rateLimit, rateLimitStrict, getClientIp } from "@/lib/rate-limit";
import { calculateFees } from "@/lib/fees";
import { CPT_CONFIG } from "@/lib/culture-pour-tous";
import { getFrictionLevel, SCORE_TTL_MS } from "@/lib/behavior";
import {
  acquireCheckoutLock,
  attachSessionToLock,
  releaseCheckoutLock,
  DuplicateCheckoutError,
} from "@/lib/pending-checkout";

function validateVisitDate(input: unknown, eventStart: Date, eventEnd: Date | null): Date | null {
  if (!input || typeof input !== "string") return null;
  const d = new Date(input);
  if (isNaN(d.getTime())) return null;
  const lo = new Date(eventStart); lo.setHours(0, 0, 0, 0);
  const hi = new Date(eventEnd || eventStart); hi.setHours(23, 59, 59, 999);
  return d >= lo && d <= hi ? d : null;
}

export async function POST(request: Request) {
  let pendingLockIdForRelease: string | null = null;
  try {
    const ip = getClientIp(request);
    const rl = rateLimit(`cpt-checkout:${ip}`, { limit: 10, windowSec: 60 });
    if (!rl.success) {
      return NextResponse.json({ error: "Trop de tentatives. Réessayez." }, { status: 429 });
    }

    const { eventId, tier, quantity, firstName, lastName, email, phone, visitDate, sessionLabel, depositPerTicket } =
      await request.json();

    const trimmedFirstName = firstName?.trim();
    const trimmedLastName = lastName?.trim();
    const trimmedEmail = email?.trim().toLowerCase();
    const trimmedPhone = phone?.trim();

    if (!trimmedFirstName || !trimmedLastName || !trimmedEmail || !trimmedPhone) {
      return NextResponse.json({ error: "Nom, prénom, email et téléphone sont obligatoires." }, { status: 400 });
    }

    const qty = Math.min(Math.max(Number(quantity) || 1, 1), 10);
    if (!eventId || !tier) {
      return NextResponse.json({ error: "Données invalides." }, { status: 400 });
    }

    const user = await prisma.user.upsert({
      where: { email: trimmedEmail },
      update: {},
      create: {
        email: trimmedEmail,
        name: `${trimmedFirstName} ${trimmedLastName}`,
        phone: trimmedPhone,
      },
    });

    const event = await prisma.event.findUnique({
      where: { id: eventId },
      include: { _count: { select: { tickets: true } } },
    });
    if (!event) return NextResponse.json({ error: "Événement introuvable." }, { status: 404 });

    if (new Date() > new Date(event.date)) {
      return NextResponse.json({ error: "L'événement est passé." }, { status: 400 });
    }

    const customTiers = event.tiers as Array<{ id: string; name: string; price: number; quota?: number; isCulturePourTous?: boolean; onSiteOnly?: boolean }> | null;
    const cptEnabled = Array.isArray(customTiers) && customTiers.some((t) => t.isCulturePourTous);
    if (!cptEnabled) {
      return NextResponse.json({ error: "Culture pour Tous n'est pas activé pour cet événement." }, { status: 400 });
    }
    const matched = Array.isArray(customTiers) ? customTiers.find((t) => t.id === tier) : null;
    if (!matched || matched.isCulturePourTous || matched.onSiteOnly || Number(matched.price) <= 0) {
      return NextResponse.json({ error: "Ce tier n'est pas éligible à Culture pour Tous." }, { status: 400 });
    }

    // Validate visitDate against event range
    const safeVisitDate = validateVisitDate(visitDate, new Date(event.date), event.endDate);
    if (visitDate && !safeVisitDate) {
      return NextResponse.json({ error: "Date de visite invalide." }, { status: 400 });
    }

    // Check per-tier quota (parent tier) — CPT consumes the parent tier's stock
    if (matched.quota != null) {
      const tierSold = await prisma.ticket.count({ where: { eventId: event.id, tier } });
      const tierRemaining = matched.quota - tierSold;
      if (tierRemaining < qty) {
        return NextResponse.json(
          { error: tierRemaining <= 0
            ? `Plus de places disponibles pour "${matched.name}".`
            : `Seulement ${tierRemaining} place(s) restante(s) pour "${matched.name}".` },
          { status: 400 },
        );
      }
    }

    const targetPrice = Number(matched.price);
    // Validate custom deposit: >= CPT_CONFIG.depositAmount, <= targetPrice (capped at full price)
    const rawDeposit = Number(depositPerTicket);
    const validDeposit = Number.isFinite(rawDeposit) && rawDeposit >= CPT_CONFIG.depositAmount
      ? Math.min(Math.round(rawDeposit * 100) / 100, targetPrice)
      : CPT_CONFIG.depositAmount;
    const depositUnit = validDeposit;
    const deposit = depositUnit * qty;
    const { fees } = calculateFees(deposit);

    const remaining = event.capacity - event._count.tickets;
    if (remaining < qty) {
      return NextResponse.json({ error: `Seulement ${remaining} place(s) restante(s).` }, { status: 400 });
    }

    const MAX_PER_EMAIL = 5;
    // DB-backed concurrent-purchase guard (serverless-safe across instances)
    const lockStrict = await rateLimitStrict(`cap:${trimmedEmail}:${event.id}`, { limit: 1, windowSec: 10 });
    if (!lockStrict.success) {
      return NextResponse.json(
        { error: "Un achat est déjà en cours pour ce billet. Patientez quelques secondes." },
        { status: 429 },
      );
    }
    const existing = await prisma.ticket.count({ where: { email: trimmedEmail, eventId: event.id } });
    if (existing + qty > MAX_PER_EMAIL) {
      return NextResponse.json({ error: `Limite de ${MAX_PER_EMAIL} billets par email.` }, { status: 400 });
    }

    // Duplicate-payment detection (5-min window)
    const recentSession = await prisma.ticket.findFirst({
      where: {
        email: trimmedEmail,
        eventId: event.id,
        tier,
        purchasedAt: { gte: new Date(Date.now() - 5 * 60 * 1000) },
      },
    });
    if (recentSession) {
      return NextResponse.json(
        { error: "Un paiement récent a déjà été détecté pour ce billet. Vérifiez votre email." },
        { status: 409 },
      );
    }

    /* ── Distributed lock: block concurrent Stripe session creation ── */
    let pendingLockId: string;
    try {
      const lock = await acquireCheckoutLock({ email: trimmedEmail, eventId: event.id, tier });
      pendingLockId = lock.id;
      pendingLockIdForRelease = lock.id;
    } catch (lockErr) {
      if (lockErr instanceof DuplicateCheckoutError) {
        if (lockErr.existingStripeSessionId) {
          try {
            const existingSession = await getStripe().checkout.sessions.retrieve(lockErr.existingStripeSessionId);
            if (existingSession.status === "open" && existingSession.url) {
              return NextResponse.json({ url: existingSession.url });
            }
          } catch (e) {
            console.warn("Resume existing Stripe session failed:", e);
          }
        }
        return NextResponse.json({ error: lockErr.message }, { status: 409 });
      }
      throw lockErr;
    }

    // Behavioral friction check (bot / abuse protection)
    const clientFp = request.headers.get("x-behavior-fp") || "";
    const fingerprint = `${clientFp}:${ip}`;
    const behaviorRecord = await prisma.behaviorScore.findUnique({ where: { fingerprint } });
    const scoreAge = behaviorRecord ? Date.now() - behaviorRecord.updatedAt.getTime() : 0;
    const effectiveScore = behaviorRecord && scoreAge < SCORE_TTL_MS ? behaviorRecord.score : 0;
    const friction = getFrictionLevel(effectiveScore);
    if (friction === "block") {
      return NextResponse.json(
        { error: "Trop de tentatives inhabituelles détectées. Réessayez plus tard ou contactez-nous." },
        { status: 403 },
      );
    }
    const paymentMethods: ("card" | "paypal")[] = friction === "card_only" ? ["card"] : ["card", "paypal"];

    const stripe = getStripe();
    const productName = `${event.title} — ${matched.name}`;
    const lineItems: Array<{ price_data: { currency: string; unit_amount: number; product_data: { name: string; description?: string } }; quantity: number }> = [
      {
        price_data: {
          currency: "eur",
          unit_amount: Math.round(depositUnit * 100),
          product_data: {
            name: `Acompte Culture pour Tous — ${productName}`,
            description: depositUnit >= targetPrice
              ? `Paiement complet de ${targetPrice}€ via Culture pour Tous.`
              : `Acompte de ${depositUnit}€ sur ${targetPrice}€. Complétez à votre rythme jusqu'à la veille de l'événement.`,
          },
        },
        quantity: qty,
      },
    ];
    if (fees > 0) {
      lineItems.push({
        price_data: {
          currency: "eur",
          unit_amount: Math.round(fees * 100),
          product_data: { name: "Frais de gestion (3%)" },
        },
        quantity: 1,
      });
    }

    const checkoutSession = await stripe.checkout.sessions.create({
      mode: "payment",
      payment_method_types: paymentMethods,
      customer_email: trimmedEmail,
      line_items: lineItems,
      metadata: {
        type: "culture_pour_tous",
        eventId: event.id,
        userId: user.id,
        tier,
        quantity: String(qty),
        targetPrice: String(targetPrice),
        deposit: String(deposit),
        firstName: trimmedFirstName,
        lastName: trimmedLastName,
        email: trimmedEmail,
        phone: trimmedPhone,
        ...(safeVisitDate && { visitDate: safeVisitDate.toISOString() }),
        ...(sessionLabel && { sessionLabel }),
      },
      success_url: `${process.env.NEXT_PUBLIC_APP_URL}/cpt/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${process.env.NEXT_PUBLIC_APP_URL}/culture-pour-tous/${event.slug}`,
    });

    await attachSessionToLock(pendingLockId, checkoutSession.id);
    return NextResponse.json({ url: checkoutSession.url });
  } catch (error) {
    console.error("CPT checkout error:", error);
    if (pendingLockIdForRelease) {
      await releaseCheckoutLock(pendingLockIdForRelease).catch(() => {});
    }
    return NextResponse.json({ error: "Erreur lors du checkout." }, { status: 500 });
  }
}

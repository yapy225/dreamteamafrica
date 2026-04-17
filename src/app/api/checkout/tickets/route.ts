import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { getStripe } from "@/lib/stripe";
import QRCode from "qrcode";
import { uploadBuffer } from "@/lib/bunny";
import { sendTicketConfirmationEmail } from "@/lib/email";
import { sendTicketConfirmationWhatsApp } from "@/lib/whatsapp";
import { rateLimit, rateLimitStrict, getClientIp } from "@/lib/rate-limit";
import { getFrictionLevel, SCORE_TTL_MS } from "@/lib/behavior";
import { calculateFees } from "@/lib/fees";
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
    const rl = rateLimit(`checkout:${ip}`, { limit: 10, windowSec: 60 });
    if (!rl.success) {
      return NextResponse.json(
        { error: "Trop de tentatives. Réessayez dans quelques minutes." },
        { status: 429 },
      );
    }

    const { eventId, tier, quantity, sessionLabel, firstName, lastName, email, phone, visitDate, installments, promotionCode } =
      await request.json();

    // Validate required nominative fields
    const trimmedFirstName = firstName?.trim();
    const trimmedLastName = lastName?.trim();
    const trimmedEmail = email?.trim().toLowerCase();
    const trimmedPhone = phone?.trim();

    if (!trimmedFirstName || !trimmedLastName || !trimmedEmail || !trimmedPhone) {
      return NextResponse.json(
        { error: "Nom, prénom, email et téléphone sont obligatoires." },
        { status: 400 },
      );
    }

    if (!eventId || !tier || !quantity || quantity < 1 || quantity > 10) {
      return NextResponse.json(
        { error: "Données invalides." },
        { status: 400 },
      );
    }

    // Upsert user by email
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

    if (!event) {
      return NextResponse.json(
        { error: "Événement introuvable." },
        { status: 404 },
      );
    }

    // Validate visitDate against event range (prevent arbitrary dates)
    const safeVisitDate = validateVisitDate(visitDate, new Date(event.date), event.endDate);
    if (visitDate && !safeVisitDate) {
      return NextResponse.json({ error: "Date de visite invalide." }, { status: 400 });
    }

    // Resolve price: custom tiers JSON > legacy price fields
    let unitPrice: number;
    let tierName: string;

    const customTiers = event.tiers as Array<{ id: string; name: string; price: number; quota?: number }> | null;
    const matchedTier = Array.isArray(customTiers)
      ? customTiers.find((t) => t.id === tier)
      : null;

    const legacyTiers = ["EARLY_BIRD", "STANDARD", "VIP"];

    if (matchedTier) {
      // CPT tiers must go through /api/checkout/culture-pour-tous — reject here
      if ((matchedTier as { isCulturePourTous?: boolean }).isCulturePourTous) {
        return NextResponse.json(
          { error: "Ce tier nécessite le parcours Culture pour Tous." },
          { status: 400 },
        );
      }
      unitPrice = matchedTier.price;
      tierName = matchedTier.name;

      // Check tier-level quota
      if (matchedTier.quota != null) {
        const tierSold = await prisma.ticket.count({
          where: { eventId: event.id, tier },
        });
        const tierRemaining = matchedTier.quota - tierSold;
        if (tierRemaining < quantity) {
          return NextResponse.json(
            { error: tierRemaining <= 0
              ? `Plus de places disponibles pour "${tierName}".`
              : `Seulement ${tierRemaining} place(s) restante(s) pour "${tierName}".` },
            { status: 400 },
          );
        }
      }
    } else if (legacyTiers.includes(tier)) {
      const priceMap: Record<string, number> = {
        EARLY_BIRD: event.priceEarly,
        STANDARD: event.priceStd,
        VIP: event.priceVip,
      };
      const labelMap: Record<string, string> = {
        EARLY_BIRD: "Early Bird",
        STANDARD: "Standard",
        VIP: "VIP",
      };
      unitPrice = priceMap[tier];
      tierName = labelMap[tier];
    } else {
      return NextResponse.json(
        { error: "Tier invalide." },
        { status: 400 },
      );
    }

    const remaining = event.capacity - event._count.tickets;
    if (remaining < quantity) {
      return NextResponse.json(
        { error: `Seulement ${remaining} place(s) restante(s).` },
        { status: 400 },
      );
    }

    // Limit per email per event (max 5 tickets)
    const MAX_TICKETS_PER_EMAIL = 5;
    const existingTickets = await prisma.ticket.count({
      where: { email: trimmedEmail, eventId: event.id },
    });
    // DB-backed concurrent-purchase guard (serverless-safe across instances)
    const lockStrict = await rateLimitStrict(`cap:${trimmedEmail}:${event.id}`, { limit: 1, windowSec: 10 });
    if (!lockStrict.success) {
      return NextResponse.json(
        { error: "Un achat est déjà en cours pour ce billet. Patientez quelques secondes." },
        { status: 429 },
      );
    }
    if (existingTickets + quantity > MAX_TICKETS_PER_EMAIL) {
      const left = MAX_TICKETS_PER_EMAIL - existingTickets;
      return NextResponse.json(
        { error: left <= 0
          ? `Vous avez déjà atteint la limite de ${MAX_TICKETS_PER_EMAIL} billets pour cet événement.`
          : `Vous pouvez encore acheter ${left} billet(s) pour cet événement.` },
        { status: 400 },
      );
    }

    /* ── FREE TICKETS: create directly without Stripe ──────────── */
    if (unitPrice === 0) {
      const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "https://dreamteamafrica.com";
      const createdTickets: Array<{ id: string; qrCode: string }> = [];

      const ticketPromises = Array.from({ length: quantity }, async () => {
        const ticketId = crypto.randomUUID();
        const qrUrl = `${baseUrl}/check/${ticketId}`;
        const qrBuffer = await QRCode.toBuffer(qrUrl, { width: 600, margin: 2 });
        const { url: qrCdnUrl } = await uploadBuffer(
          Buffer.from(qrBuffer),
          `qrcodes/tickets/${ticketId}.png`,
        );

        const ticket = await prisma.ticket.create({
          data: {
            id: ticketId,
            eventId: event.id,
            userId: user.id,
            tier,
            price: 0,
            qrCode: qrCdnUrl,
            firstName: trimmedFirstName,
            lastName: trimmedLastName,
            email: trimmedEmail,
            phone: trimmedPhone,
            visitDate: safeVisitDate,
          },
        });
        createdTickets.push({ id: ticket.id, qrCode: qrCdnUrl });
        return ticket;
      });

      await Promise.all(ticketPromises);

      // Send confirmation email
      try {
        await sendTicketConfirmationEmail({
          to: trimmedEmail,
          guestName: `${trimmedFirstName} ${trimmedLastName}`,
          eventTitle: event.title,
          eventVenue: event.venue,
          eventAddress: event.address,
          eventDate: safeVisitDate || event.date,
          eventCoverImage: event.coverImage,
          tier: tierName,
          price: 0,
          quantity,
          tickets: createdTickets,
        });
      } catch (emailErr) {
        console.error("Free ticket confirmation email failed:", emailErr);
      }

      // WhatsApp confirmation disabled — coût Meta trop élevé, email suffit

      // Return first ticket ID for confirmation page
      return NextResponse.json({
        free: true,
        confirmationUrl: `${baseUrl}/saison-culturelle-africaine/confirmation/${createdTickets[0].id}`,
      });
    }

    /* ── Duplicate payment detection ──────────────────────── */
    const recentSession = await prisma.ticket.findFirst({
      where: {
        email: trimmedEmail,
        eventId: event.id,
        tier,
        purchasedAt: { gte: new Date(Date.now() - 5 * 60 * 1000) }, // 5 min window
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
        // Reprise : si la session Stripe existe déjà et est encore ouverte, on renvoie son URL
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

    /* ── BEHAVIORAL FRICTION CHECK (bypass for ADMIN sessions) ──── */
    const session = await auth();
    const isAdmin = session?.user?.role === "ADMIN";
    const clientFp = request.headers.get("x-behavior-fp") || "";
    const fingerprint = `${clientFp}:${ip}`;
    const behaviorRecord = isAdmin
      ? null
      : await prisma.behaviorScore.findUnique({ where: { fingerprint } });

    // Ignore expired scores (older than 24h)
    const scoreAge = behaviorRecord ? Date.now() - behaviorRecord.updatedAt.getTime() : 0;
    const effectiveScore = behaviorRecord && scoreAge < SCORE_TTL_MS ? behaviorRecord.score : 0;
    const friction = isAdmin ? "none" : getFrictionLevel(effectiveScore);

    if (friction === "block") {
      return NextResponse.json(
        { error: "Trop de tentatives inhabituelles détectées. Veuillez réessayer dans quelques heures ou nous contacter." },
        { status: 403 },
      );
    }

    /* ── PAID TICKETS: Stripe checkout ──────────────────────── */
    const productName = `${event.title} — ${tierName}`;
    const nbInstallments = Math.min(Math.max(Number(installments) || 1, 1), 3);
    const totalAmount = unitPrice * quantity;
    const stripe = getStripe();

    // Restrict payment methods based on friction level
    const paymentMethods: ("card" | "paypal")[] =
      friction === "card_only" ? ["card"] : ["card", "paypal"];

    if (nbInstallments === 1) {
      // ── Single full payment ──
      const { fees } = calculateFees(totalAmount);
      const eventDescription = sessionLabel
        ? sessionLabel
        : `${event.venue} — ${new Date(event.date).toLocaleDateString("fr-FR", { day: "numeric", month: "long", year: "numeric" })}`;

      const lineItems: Array<{ price_data: { currency: string; unit_amount: number; product_data: { name: string; description?: string } }; quantity: number }> = [
        {
          price_data: {
            currency: "eur",
            unit_amount: Math.round(unitPrice * 100),
            product_data: { name: productName, description: eventDescription },
          },
          quantity,
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
        ...(promotionCode
          ? { discounts: [{ promotion_code: promotionCode }] }
          : { allow_promotion_codes: true }),
        customer_email: trimmedEmail,
        line_items: lineItems,
        metadata: {
          type: "ticket",
          eventId: event.id,
          userId: user.id,
          tier,
          quantity: String(quantity),
          unitPrice: String(unitPrice),
          firstName: trimmedFirstName,
          lastName: trimmedLastName,
          email: trimmedEmail,
          phone: trimmedPhone,
          installments: "1",
          ...(safeVisitDate && { visitDate: safeVisitDate.toISOString() }),
          ...(sessionLabel && { sessionLabel }),
        },
        success_url: `${process.env.NEXT_PUBLIC_APP_URL}/saison-culturelle-africaine/confirmation/{CHECKOUT_SESSION_ID}`,
        cancel_url: `${process.env.NEXT_PUBLIC_APP_URL}/saison-culturelle-africaine/${event.slug}`,
      });

      await attachSessionToLock(pendingLockId, checkoutSession.id);
      return NextResponse.json({ url: checkoutSession.url });
    } else {
      // ── Deposit (5€/billet) + remaining in (N-1) monthly installments ──
      const depositPerTicket = 5;
      const deposit = depositPerTicket * quantity;
      const remainingBalance = totalAmount - deposit;
      const installmentAmount = Math.ceil((remainingBalance / (nbInstallments - 1)) * 100) / 100;
      const { fees: depositFees } = calculateFees(deposit);

      const depositLineItems: Array<{ price_data: { currency: string; unit_amount: number; product_data: { name: string; description?: string } }; quantity: number }> = [
        {
          price_data: {
            currency: "eur",
            unit_amount: Math.round(deposit * 100),
            product_data: {
              name: `Acompte — ${productName}`,
              description: `Acompte de ${deposit} € sur ${totalAmount} € total. Solde (${remainingBalance} €) en ${nbInstallments - 1} mensualité${nbInstallments - 1 > 1 ? "s" : ""}.`,
            },
          },
          quantity: 1,
        },
      ];
      if (depositFees > 0) {
        depositLineItems.push({
          price_data: {
            currency: "eur",
            unit_amount: Math.round(depositFees * 100),
            product_data: { name: "Frais de gestion (3%)" },
          },
          quantity: 1,
        });
      }

      const checkoutSession = await stripe.checkout.sessions.create({
        mode: "payment",
        payment_method_types: paymentMethods,
        customer_email: trimmedEmail,
        line_items: depositLineItems,
        metadata: {
          type: "ticket_installment",
          eventId: event.id,
          userId: user.id,
          tier,
          quantity: String(quantity),
          unitPrice: String(unitPrice),
          firstName: trimmedFirstName,
          lastName: trimmedLastName,
          email: trimmedEmail,
          phone: trimmedPhone,
          installments: String(nbInstallments),
          deposit: String(deposit),
          remainingBalance: String(remainingBalance),
          installmentAmount: String(installmentAmount),
          ...(safeVisitDate && { visitDate: safeVisitDate.toISOString() }),
          ...(sessionLabel && { sessionLabel }),
        },
        success_url: `${process.env.NEXT_PUBLIC_APP_URL}/saison-culturelle-africaine/confirmation/{CHECKOUT_SESSION_ID}`,
        cancel_url: `${process.env.NEXT_PUBLIC_APP_URL}/saison-culturelle-africaine/${event.slug}`,
      });

      await attachSessionToLock(pendingLockId, checkoutSession.id);
      return NextResponse.json({ url: checkoutSession.url });
    }
  } catch (error) {
    console.error("Checkout error:", error);
    if (pendingLockIdForRelease) {
      await releaseCheckoutLock(pendingLockIdForRelease).catch(() => {});
    }
    return NextResponse.json(
      { error: "Une erreur est survenue lors du paiement. Veuillez réessayer." },
      { status: 500 },
    );
  }
}

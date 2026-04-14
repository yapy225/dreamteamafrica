import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { getStripe } from "@/lib/stripe";
import { rateLimit, getClientIp } from "@/lib/rate-limit";
import { calculateFees } from "@/lib/fees";
import { CPT_CONFIG } from "@/lib/culture-pour-tous";

export async function POST(request: Request) {
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

    const customTiers = event.tiers as Array<{ id: string; name: string; price: number; isCulturePourTous?: boolean; onSiteOnly?: boolean }> | null;
    const cptEnabled = Array.isArray(customTiers) && customTiers.some((t) => t.isCulturePourTous);
    if (!cptEnabled) {
      return NextResponse.json({ error: "Culture pour Tous n'est pas activé pour cet événement." }, { status: 400 });
    }
    const matched = Array.isArray(customTiers) ? customTiers.find((t) => t.id === tier) : null;
    if (!matched || matched.isCulturePourTous || matched.onSiteOnly || Number(matched.price) <= 0) {
      return NextResponse.json({ error: "Ce tier n'est pas éligible à Culture pour Tous." }, { status: 400 });
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
    const existing = await prisma.ticket.count({ where: { email: trimmedEmail, eventId: event.id } });
    if (existing + qty > MAX_PER_EMAIL) {
      return NextResponse.json({ error: `Limite de ${MAX_PER_EMAIL} billets par email.` }, { status: 400 });
    }

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
      payment_method_types: ["card", "paypal"],
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
        ...(visitDate && { visitDate: String(visitDate) }),
        ...(sessionLabel && { sessionLabel }),
      },
      success_url: `${process.env.NEXT_PUBLIC_APP_URL}/cpt/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${process.env.NEXT_PUBLIC_APP_URL}/culture-pour-tous/${event.slug}`,
    });

    return NextResponse.json({ url: checkoutSession.url });
  } catch (error) {
    console.error("CPT checkout error:", error);
    return NextResponse.json({ error: "Erreur lors du checkout." }, { status: 500 });
  }
}

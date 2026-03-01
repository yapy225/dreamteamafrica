import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { getStripe } from "@/lib/stripe";

export async function POST(request: Request) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Non authentifié." }, { status: 401 });
    }

    const { eventId, tier, quantity, sessionLabel } =
      await request.json();

    if (!eventId || !tier || !quantity || quantity < 1 || quantity > 10) {
      return NextResponse.json(
        { error: "Données invalides." },
        { status: 400 },
      );
    }

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

    // Resolve price: custom tiers JSON > legacy price fields
    let unitPrice: number;
    let tierName: string;

    const customTiers = event.tiers as Array<{ id: string; name: string; price: number }> | null;
    const matchedTier = Array.isArray(customTiers)
      ? customTiers.find((t) => t.id === tier)
      : null;

    if (matchedTier) {
      unitPrice = matchedTier.price;
      tierName = matchedTier.name;
    } else {
      const validTiers = ["EARLY_BIRD", "STANDARD", "VIP"];
      if (!validTiers.includes(tier)) {
        return NextResponse.json(
          { error: "Tier invalide." },
          { status: 400 },
        );
      }
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
    }

    const remaining = event.capacity - event._count.tickets;
    if (remaining < quantity) {
      return NextResponse.json(
        { error: `Seulement ${remaining} place(s) restante(s).` },
        { status: 400 },
      );
    }

    const productName = `${event.title} — ${tierName}`;

    // Free ticket: create directly without Stripe
    if (unitPrice === 0) {
      const tickets = await prisma.$transaction(
        Array.from({ length: quantity }, () =>
          prisma.ticket.create({
            data: {
              eventId: event.id,
              userId: session.user.id,
              tier,
              price: 0,
              sessionLabel: sessionLabel || null,
            },
          })
        )
      );
      return NextResponse.json({
        url: `${process.env.NEXT_PUBLIC_APP_URL}/evenements/confirmation/${tickets[0].id}`,
      });
    }

    const checkoutSession = await getStripe().checkout.sessions.create({
      mode: "payment",
      customer_email: session.user.email!,
      line_items: [
        {
          price_data: {
            currency: "eur",
            unit_amount: Math.round(unitPrice * 100),
            product_data: {
              name: productName,
              description: sessionLabel
                ? sessionLabel
                : `${event.venue} — ${new Date(event.date).toLocaleDateString("fr-FR", { day: "numeric", month: "long", year: "numeric" })}`,
            },
          },
          quantity,
        },
      ],
      metadata: {
        type: "ticket",
        eventId: event.id,
        userId: session.user.id,
        tier,
        quantity: String(quantity),
        unitPrice: String(unitPrice),
        ...(sessionLabel && { sessionLabel }),
      },
      success_url: `${process.env.NEXT_PUBLIC_APP_URL}/evenements/confirmation/{CHECKOUT_SESSION_ID}`,
      cancel_url: `${process.env.NEXT_PUBLIC_APP_URL}/evenements/${event.slug}`,
    });

    return NextResponse.json({ url: checkoutSession.url });
  } catch (error) {
    console.error("Checkout error:", error);
    return NextResponse.json({ error: "Erreur interne." }, { status: 500 });
  }
}

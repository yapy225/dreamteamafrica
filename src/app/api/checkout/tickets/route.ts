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

    const { eventId, tier, quantity } = await request.json();

    if (!eventId || !tier || !quantity || quantity < 1 || quantity > 10) {
      return NextResponse.json({ error: "Données invalides." }, { status: 400 });
    }

    const validTiers = ["EARLY_BIRD", "STANDARD", "VIP"];
    if (!validTiers.includes(tier)) {
      return NextResponse.json({ error: "Tier invalide." }, { status: 400 });
    }

    const event = await prisma.event.findUnique({
      where: { id: eventId },
      include: { _count: { select: { tickets: true } } },
    });

    if (!event) {
      return NextResponse.json({ error: "Événement introuvable." }, { status: 404 });
    }

    const remaining = event.capacity - event._count.tickets;
    if (remaining < quantity) {
      return NextResponse.json(
        { error: `Seulement ${remaining} place(s) restante(s).` },
        { status: 400 }
      );
    }

    const priceMap: Record<string, number> = {
      EARLY_BIRD: event.priceEarly,
      STANDARD: event.priceStd,
      VIP: event.priceVip,
    };
    const unitPrice = priceMap[tier];

    const tierLabels: Record<string, string> = {
      EARLY_BIRD: "Early Bird",
      STANDARD: "Standard",
      VIP: "VIP",
    };

    const checkoutSession = await getStripe().checkout.sessions.create({
      mode: "payment",
      customer_email: session.user.email!,
      line_items: [
        {
          price_data: {
            currency: "eur",
            unit_amount: Math.round(unitPrice * 100),
            product_data: {
              name: `${event.title} — ${tierLabels[tier]}`,
              description: `${event.venue} — ${new Date(event.date).toLocaleDateString("fr-FR", { day: "numeric", month: "long", year: "numeric" })}`,
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

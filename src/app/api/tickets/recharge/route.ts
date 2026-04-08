import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { getStripe } from "@/lib/stripe";
import { auth } from "@/lib/auth";
import { rateLimit, getClientIp } from "@/lib/rate-limit";

export async function POST(request: Request) {
  try {
    // 1. Authentication
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Non autorisé." }, { status: 401 });
    }

    // 2. Rate limiting
    const ip = getClientIp(request);
    const rl = rateLimit(`recharge:${session.user.id}`, { limit: 5, windowSec: 60 });
    if (!rl.success) {
      return NextResponse.json(
        { error: "Trop de tentatives. Réessayez dans quelques minutes." },
        { status: 429 },
      );
    }

    const { ticketId, amount } = await request.json();

    // 3. Input validation
    if (!ticketId || typeof ticketId !== "string") {
      return NextResponse.json({ error: "Données invalides." }, { status: 400 });
    }

    const parsedAmount = Number(amount);
    if (!Number.isFinite(parsedAmount) || parsedAmount < 5 || parsedAmount > 10000) {
      return NextResponse.json({ error: "Le montant minimum est de 5€." }, { status: 400 });
    }

    // 4. Fetch ticket
    const ticket = await prisma.ticket.findUnique({
      where: { id: ticketId },
      include: { event: true },
    });

    if (!ticket) {
      return NextResponse.json({ error: "Billet introuvable." }, { status: 404 });
    }

    // 5. Ownership check (IDOR protection)
    if (ticket.userId !== session.user.id) {
      return NextResponse.json({ error: "Accès interdit." }, { status: 403 });
    }

    // 6. Business validation
    const remaining = ticket.price - ticket.totalPaid;
    if (remaining <= 0) {
      return NextResponse.json({ error: "Ce billet est déjà entièrement payé." }, { status: 400 });
    }

    // 6b. Deadline check: no recharge after the event
    if (new Date() > new Date(ticket.event.date)) {
      return NextResponse.json({ error: "L'événement est passé, la recharge n'est plus possible." }, { status: 400 });
    }

    const rechargeAmount = Math.min(Math.round(parsedAmount * 100) / 100, remaining);

    // 7. Stripe checkout
    const stripe = getStripe();
    const checkoutSession = await stripe.checkout.sessions.create({
      mode: "payment",
      payment_method_types: ["card", "paypal"],
      customer_email: session.user.email || ticket.email || undefined,
      line_items: [
        {
          price_data: {
            currency: "eur",
            unit_amount: Math.round(rechargeAmount * 100),
            product_data: {
              name: `Recharge billet — ${ticket.event.title}`,
              description: `Versement de ${rechargeAmount} € sur votre billet`,
            },
          },
          quantity: 1,
        },
      ],
      metadata: {
        type: "ticket_recharge",
        ticketId: ticket.id,
        userId: session.user.id,
        amount: String(rechargeAmount),
      },
      success_url: `${process.env.NEXT_PUBLIC_APP_URL}/mon-espace?success=1`,
      cancel_url: `${process.env.NEXT_PUBLIC_APP_URL}/mon-espace`,
    });

    return NextResponse.json({ url: checkoutSession.url });
  } catch (error) {
    console.error("Recharge error:", error);
    return NextResponse.json(
      { error: "Erreur lors de la recharge." },
      { status: 500 },
    );
  }
}

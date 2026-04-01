import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { getStripe } from "@/lib/stripe";
import { rateLimit, getClientIp } from "@/lib/rate-limit";

export async function POST(request: Request) {
  try {
    const ip = getClientIp(request);
    const rl = rateLimit(`recharge:${ip}`, { limit: 10, windowSec: 60 });
    if (!rl.success) {
      return NextResponse.json(
        { error: "Trop de tentatives. Réessayez dans quelques minutes." },
        { status: 429 },
      );
    }

    const { ticketId, amount, email } = await request.json();

    if (!ticketId || !amount || amount < 1) {
      return NextResponse.json({ error: "Données invalides." }, { status: 400 });
    }

    const ticket = await prisma.ticket.findUnique({
      where: { id: ticketId },
      include: { event: true },
    });

    if (!ticket) {
      return NextResponse.json({ error: "Billet introuvable." }, { status: 404 });
    }

    const remaining = ticket.price - ticket.totalPaid;
    if (remaining <= 0) {
      return NextResponse.json({ error: "Ce billet est déjà entièrement payé." }, { status: 400 });
    }

    const rechargeAmount = Math.min(amount, remaining);

    const stripe = getStripe();
    const checkoutSession = await stripe.checkout.sessions.create({
      mode: "payment",
      payment_method_types: ["card", "paypal"],
      customer_email: email || ticket.email || undefined,
      line_items: [
        {
          price_data: {
            currency: "eur",
            unit_amount: Math.round(rechargeAmount * 100),
            product_data: {
              name: `Recharge billet — ${ticket.event.title}`,
              description: `Versement de ${rechargeAmount} € sur votre billet ${ticket.firstName} ${ticket.lastName}`,
            },
          },
          quantity: 1,
        },
      ],
      metadata: {
        type: "ticket_recharge",
        ticketId: ticket.id,
        amount: String(rechargeAmount),
        email: email || ticket.email || "",
      },
      success_url: `${process.env.NEXT_PUBLIC_APP_URL}/mes-billets?success=1`,
      cancel_url: `${process.env.NEXT_PUBLIC_APP_URL}/mes-billets`,
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

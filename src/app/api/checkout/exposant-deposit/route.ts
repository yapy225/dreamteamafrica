import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { getStripe } from "@/lib/stripe";
import { rateLimit, getClientIp } from "@/lib/rate-limit";

const DEPOSIT_AMOUNT = 5000; // 50 € in cents
const APP_URL = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";

export async function POST(req: NextRequest) {
  try {
    const ip = getClientIp(req);
    const rl = rateLimit(`exposant-deposit:${ip}`, { limit: 10, windowSec: 15 * 60 });
    if (!rl.success) {
      return NextResponse.json(
        { error: "Trop de tentatives. Réessayez dans quelques minutes." },
        { status: 429 },
      );
    }

    const { leadId } = await req.json();

    if (!leadId) {
      return NextResponse.json({ error: "leadId manquant." }, { status: 400 });
    }

    const lead = await prisma.exposantLead.findUnique({ where: { id: leadId } });

    if (!lead) {
      return NextResponse.json({ error: "Demande introuvable." }, { status: 404 });
    }

    if (lead.status === "DEPOSIT_PAID") {
      return NextResponse.json({ error: "Acompte déjà payé." }, { status: 400 });
    }

    const stripe = getStripe();

    const session = await stripe.checkout.sessions.create({
      mode: "payment",
      payment_method_types: ["card", "paypal"],
      customer_email: lead.email,
      line_items: [
        {
          price_data: {
            currency: "eur",
            product_data: {
              name: `Acompte Exposant — ${lead.eventName}`,
              description: `Réservation de stand pour ${lead.brand} (${lead.sector})`,
            },
            unit_amount: DEPOSIT_AMOUNT,
          },
          quantity: 1,
        },
      ],
      metadata: {
        type: "exposant_deposit",
        leadId: lead.id,
        firstName: lead.firstName,
        lastName: lead.lastName,
        brand: lead.brand,
        sector: lead.sector,
        phone: lead.phone,
        email: lead.email,
        eventName: lead.eventName,
      },
      success_url: `${APP_URL}/exposants/confirmation?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${APP_URL}/saison-culturelle-africaine`,
    });

    // Save stripe session ID on lead
    await prisma.exposantLead.update({
      where: { id: leadId },
      data: { stripeSessionId: session.id },
    });

    return NextResponse.json({ url: session.url });
  } catch (error) {
    console.error("[exposant-deposit] Error:", error);
    return NextResponse.json({ error: "Erreur serveur." }, { status: 500 });
  }
}

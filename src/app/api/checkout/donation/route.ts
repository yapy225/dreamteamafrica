import { NextRequest, NextResponse } from "next/server";
import { getStripe } from "@/lib/stripe";

export async function POST(request: NextRequest) {
  try {
    const { amount } = await request.json();
    const cents = Math.round(Number(amount) * 100);

    if (!cents || cents < 100) {
      return NextResponse.json(
        { error: "Le montant minimum est de 1 €." },
        { status: 400 },
      );
    }

    const stripe = getStripe();
    const baseUrl = process.env.NEXT_PUBLIC_APP_URL || "https://dreamteamafrica.com";

    const session = await stripe.checkout.sessions.create({
      mode: "payment",
      payment_method_types: ["card", "paypal"],
      line_items: [
        {
          price_data: {
            currency: "eur",
            product_data: {
              name: "Don — Dream Team Africa",
              description: `Don de ${amount} € pour soutenir la culture africaine`,
            },
            unit_amount: cents,
          },
          quantity: 1,
        },
      ],
      success_url: `${baseUrl}/faire-un-don/merci`,
      cancel_url: `${baseUrl}/faire-un-don`,
      metadata: {
        type: "donation",
        amount: String(amount),
      },
    });

    return NextResponse.json({ url: session.url });
  } catch (error) {
    console.error("Donation checkout error:", error);
    return NextResponse.json({ error: "Erreur interne." }, { status: 500 });
  }
}

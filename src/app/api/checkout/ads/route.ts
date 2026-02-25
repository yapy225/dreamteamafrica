import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { getStripe } from "@/lib/stripe";

const PLAN_PRICES: Record<string, { amount: number; name: string }> = {
  STARTER: { amount: 2900, name: "DTA Ads — Starter" },
  PRO: { amount: 7900, name: "DTA Ads — Pro" },
  PREMIUM: { amount: 14900, name: "DTA Ads — Premium" },
};

export async function POST(request: Request) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Non authentifié." }, { status: 401 });
    }

    const { plan, campaignId } = await request.json();

    if (!plan || !PLAN_PRICES[plan]) {
      return NextResponse.json({ error: "Plan invalide." }, { status: 400 });
    }

    const planInfo = PLAN_PRICES[plan];

    const checkoutSession = await getStripe().checkout.sessions.create({
      mode: "subscription",
      customer_email: session.user.email!,
      line_items: [
        {
          price_data: {
            currency: "eur",
            unit_amount: planInfo.amount,
            recurring: { interval: "month" },
            product_data: {
              name: planInfo.name,
              description: `Abonnement publicitaire mensuel — Plan ${plan}`,
            },
          },
          quantity: 1,
        },
      ],
      metadata: {
        type: "ad_subscription",
        userId: session.user.id,
        plan,
        campaignId: campaignId || "",
      },
      success_url: `${process.env.NEXT_PUBLIC_APP_URL}/dashboard/ads?success=1`,
      cancel_url: `${process.env.NEXT_PUBLIC_APP_URL}/ads`,
    });

    return NextResponse.json({ url: checkoutSession.url });
  } catch (error) {
    console.error("Ad checkout error:", error);
    return NextResponse.json({ error: "Erreur interne." }, { status: 500 });
  }
}

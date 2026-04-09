import { NextResponse } from "next/server";
import { getStripe } from "@/lib/stripe";

export async function POST(request: Request) {
  try {
    const { code } = await request.json();
    if (!code || typeof code !== "string") {
      return NextResponse.json({ error: "Code requis" }, { status: 400 });
    }

    const stripe = getStripe();
    const promotionCodes = await stripe.promotionCodes.list({
      code: code.trim().toUpperCase(),
      active: true,
      limit: 1,
      expand: ["data.coupon"],
    });

    const promo = promotionCodes.data[0];
    if (!promo) {
      return NextResponse.json({ error: "Code promo invalide ou expiré" }, { status: 404 });
    }

    if (promo.max_redemptions && promo.times_redeemed >= promo.max_redemptions) {
      return NextResponse.json({ error: "Ce code promo a atteint sa limite d'utilisation" }, { status: 410 });
    }

    if (promo.expires_at && promo.expires_at * 1000 < Date.now()) {
      return NextResponse.json({ error: "Ce code promo a expiré" }, { status: 410 });
    }

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const coupon = (promo as any).coupon as { name?: string; amount_off?: number; percent_off?: number };

    return NextResponse.json({
      id: promo.id,
      name: coupon.name || code,
      amountOff: coupon.amount_off ?? undefined,
      percentOff: coupon.percent_off ?? undefined,
    });
  } catch {
    return NextResponse.json({ error: "Erreur de validation" }, { status: 500 });
  }
}

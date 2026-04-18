import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { getStripe } from "@/lib/stripe";
import { DEPOSIT_AMOUNT } from "@/lib/exhibitor-events";
import { rateLimit, getClientIp } from "@/lib/rate-limit";

export async function POST(request: Request) {
  try {
    const ip = getClientIp(request);
    const rl = rateLimit(`early-payment:${ip}`, { limit: 5, windowSec: 60 });
    if (!rl.success) {
      return NextResponse.json({ error: "Trop de tentatives." }, { status: 429 });
    }

    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Non authentifié." }, { status: 401 });
    }

    const { bookingId, nbInstallments: rawNb, customAmount } = await request.json();
    if (!bookingId) {
      return NextResponse.json({ error: "bookingId requis." }, { status: 400 });
    }

    const booking = await prisma.exhibitorBooking.findUnique({
      where: { id: bookingId },
      include: { payments: true },
    });

    if (!booking || booking.userId !== session.user.id) {
      return NextResponse.json({ error: "Réservation introuvable." }, { status: 404 });
    }

    if (booking.status === "CONFIRMED") {
      return NextResponse.json({ error: "Réservation déjà entièrement payée." }, { status: 400 });
    }

    // Real remaining balance = totalPrice − sum(ExhibitorPayment)
    // Works even if deposit amount or installments differ from the standard formula.
    const paidAmount = booking.payments.reduce((s, p) => s + Number(p.amount), 0);
    const remainingBalance = Math.max(0, Number(booking.totalPrice) - paidAmount);

    // Keep the installment-based formula for default pricing (when no customAmount provided)
    const stands = booking.stands ?? 1;
    const deposit = Math.min(DEPOSIT_AMOUNT * stands, Number(booking.totalPrice));
    const totalRemaining = Number(booking.totalPrice) - deposit;
    const totalMonths = booking.installments - 1;
    const monthlyAmount = totalMonths > 0
      ? Math.ceil((totalRemaining / totalMonths) * 100) / 100
      : 0;
    const alreadyPaidInstallments = Math.max(0, booking.paidInstallments - 1);
    const remainingInstallments = Math.max(1, totalMonths - alreadyPaidInstallments);

    if (remainingBalance <= 0) {
      return NextResponse.json({ error: "Aucun solde restant." }, { status: 400 });
    }

    // Resolve amountToPay: prefer client-provided customAmount (capped to remainingBalance),
    // otherwise fall back to nbInstallments × monthly.
    const customAmountNum = Number(customAmount);
    const hasCustomAmount = Number.isFinite(customAmountNum) && customAmountNum > 0;
    const nbToPay = Math.max(1, Math.min(Number(rawNb) || 1, remainingInstallments));
    const formulaAmount = nbToPay === remainingInstallments
      ? remainingBalance
      : nbToPay * monthlyAmount;
    const amountToPay = hasCustomAmount
      ? Math.min(customAmountNum, remainingBalance)
      : formulaAmount;

    const stripe = getStripe();

    const checkoutSession = await stripe.checkout.sessions.create({
      mode: "payment",
      payment_method_types: ["card", "paypal"],
      customer_email: booking.email,
      line_items: [
        {
          price_data: {
            currency: "eur",
            unit_amount: Math.round(amountToPay * 100),
            product_data: {
              name: `Paiement anticipé — ${booking.companyName}`,
              description: nbToPay === remainingInstallments
                ? `Solde intégral restant (${nbToPay} mensualité${nbToPay > 1 ? "s" : ""})`
                : `${nbToPay} mensualité${nbToPay > 1 ? "s" : ""} anticipée${nbToPay > 1 ? "s" : ""}`,
            },
          },
          quantity: 1,
        },
      ],
      metadata: {
        type: "exhibitor_early_payment",
        bookingId: booking.id,
        userId: session.user.id,
        nbInstallments: String(nbToPay),
        amount: amountToPay.toFixed(2),
        isFullPayment: amountToPay >= remainingBalance ? "1" : "0",
      },
      success_url: `${process.env.NEXT_PUBLIC_APP_URL}/exposants/confirmation/${booking.id}`,
      cancel_url: `${process.env.NEXT_PUBLIC_APP_URL}/exposants/confirmation/${booking.id}`,
    });

    return NextResponse.json({ url: checkoutSession.url });
  } catch (error) {
    console.error("Early payment checkout error:", error);
    return NextResponse.json({ error: "Erreur interne." }, { status: 500 });
  }
}

import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { getStripe } from "@/lib/stripe";
import { DEPOSIT_AMOUNT } from "@/lib/exhibitor-events";

export async function POST(request: Request) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Non authentifié." }, { status: 401 });
    }

    const { bookingId, nbInstallments: rawNb } = await request.json();
    if (!bookingId) {
      return NextResponse.json({ error: "bookingId requis." }, { status: 400 });
    }

    const booking = await prisma.exhibitorBooking.findUnique({
      where: { id: bookingId },
    });

    if (!booking || booking.userId !== session.user.id) {
      return NextResponse.json({ error: "Réservation introuvable." }, { status: 404 });
    }

    if (booking.status === "CONFIRMED") {
      return NextResponse.json({ error: "Réservation déjà entièrement payée." }, { status: 400 });
    }

    // Calculate remaining balance
    const stands = booking.stands ?? 1;
    const deposit = Math.min(DEPOSIT_AMOUNT * stands, booking.totalPrice);
    const totalRemaining = booking.totalPrice - deposit;
    const alreadyPaidInstallments = Math.max(0, booking.paidInstallments - 1); // minus the deposit
    const totalMonths = booking.installments - 1;
    const monthlyAmount = totalMonths > 0
      ? Math.ceil((totalRemaining / totalMonths) * 100) / 100
      : 0;
    const alreadyPaidAmount = alreadyPaidInstallments * monthlyAmount;
    const remainingBalance = Math.max(0, totalRemaining - alreadyPaidAmount);

    if (remainingBalance <= 0) {
      return NextResponse.json({ error: "Aucun solde restant." }, { status: 400 });
    }

    // How many installments to pay early (default: 1, max: remaining)
    const remainingInstallments = totalMonths - alreadyPaidInstallments;
    const nbToPay = Math.max(1, Math.min(Number(rawNb) || 1, remainingInstallments));
    const amountToPay = nbToPay === remainingInstallments
      ? remainingBalance // pay exact remaining to avoid rounding issues
      : nbToPay * monthlyAmount;

    const stripe = getStripe();

    const checkoutSession = await stripe.checkout.sessions.create({
      mode: "payment",
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

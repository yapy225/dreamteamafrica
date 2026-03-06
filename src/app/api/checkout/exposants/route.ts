import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { getStripe } from "@/lib/stripe";
import {
  EXHIBITOR_EVENTS,
  EXHIBITOR_PACKS,
  calculatePrice,
} from "@/lib/exhibitor-events";

export async function POST(request: Request) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Non authentifié." }, { status: 401 });
    }

    const { pack, events, installments, companyName, contactName, email, phone, sector } =
      await request.json();

    // Validate pack
    const selectedPack = EXHIBITOR_PACKS.find((p) => p.id === pack);
    if (!selectedPack) {
      return NextResponse.json({ error: "Formule invalide." }, { status: 400 });
    }

    // Validate events
    const eventIds: string[] = pack === "SAISON"
      ? EXHIBITOR_EVENTS.map((e) => e.id)
      : events;

    if (!Array.isArray(eventIds) || eventIds.length === 0) {
      return NextResponse.json(
        { error: "Sélectionnez au moins un événement." },
        { status: 400 }
      );
    }

    const validEventIds = EXHIBITOR_EVENTS.map((e) => e.id);
    if (!eventIds.every((id: string) => validEventIds.includes(id))) {
      return NextResponse.json({ error: "Événement invalide." }, { status: 400 });
    }

    // Validate installments
    const nbInstallments = Number(installments);
    if (nbInstallments < 1 || nbInstallments > 10) {
      return NextResponse.json(
        { error: "Nombre d'échéances invalide." },
        { status: 400 }
      );
    }

    // Validate form fields
    if (!companyName?.trim() || !contactName?.trim() || !email?.trim() || !phone?.trim() || !sector?.trim()) {
      return NextResponse.json(
        { error: "Tous les champs sont obligatoires." },
        { status: 400 }
      );
    }

    // Calculate price
    const { totalDays, totalPrice } = calculatePrice(pack, eventIds);
    if (totalPrice <= 0) {
      return NextResponse.json({ error: "Prix invalide." }, { status: 400 });
    }

    const installmentAmount = Math.ceil((totalPrice / nbInstallments) * 100) / 100;

    // Build event description
    const selectedEvents = EXHIBITOR_EVENTS.filter((e) => eventIds.includes(e.id));
    const eventNames = selectedEvents.map((e) => e.title).join(", ");
    const description = `${selectedPack.name} — ${eventNames} (${totalDays} jour${totalDays > 1 ? "s" : ""})`;

    // Create booking in DB
    const booking = await prisma.exhibitorBooking.create({
      data: {
        userId: session.user.id,
        companyName: companyName.trim(),
        contactName: contactName.trim(),
        email: email.trim(),
        phone: phone.trim(),
        sector: sector.trim(),
        pack: pack as "ENTREPRENEUR" | "RESTAURATION" | "SAISON",
        events: eventIds,
        totalDays,
        totalPrice,
        installments: nbInstallments,
        installmentAmount,
        paidInstallments: 0,
        status: "PENDING",
      },
    });

    const stripe = getStripe();

    if (nbInstallments === 1) {
      // Single payment
      const checkoutSession = await stripe.checkout.sessions.create({
        mode: "payment",
        customer_email: email.trim(),
        line_items: [
          {
            price_data: {
              currency: "eur",
              unit_amount: Math.round(totalPrice * 100),
              product_data: {
                name: `Stand Exposant — ${selectedPack.name}`,
                description,
              },
            },
            quantity: 1,
          },
        ],
        metadata: {
          type: "exhibitor",
          bookingId: booking.id,
          userId: session.user.id,
          installments: "1",
        },
        success_url: `${process.env.NEXT_PUBLIC_APP_URL}/exposants/confirmation/${booking.id}`,
        cancel_url: `${process.env.NEXT_PUBLIC_APP_URL}/exposants/reservation?pack=${pack}`,
      });

      await prisma.exhibitorBooking.update({
        where: { id: booking.id },
        data: { stripeSessionId: checkoutSession.id },
      });

      return NextResponse.json({ url: checkoutSession.url });
    } else {
      // Subscription with N installments
      const product = await stripe.products.create({
        name: `Stand Exposant — ${selectedPack.name}`,
        description,
      });

      const price = await stripe.prices.create({
        product: product.id,
        unit_amount: Math.round(installmentAmount * 100),
        currency: "eur",
        recurring: { interval: "month" },
      });

      // Cancel after last installment
      const cancelAt = new Date();
      cancelAt.setMonth(cancelAt.getMonth() + nbInstallments);
      // Add a few days buffer for the last payment to process
      cancelAt.setDate(cancelAt.getDate() + 3);

      const checkoutSession = await stripe.checkout.sessions.create({
        mode: "subscription" as const,
        customer_email: email.trim(),
        line_items: [{ price: price.id, quantity: 1 }],
        subscription_data: {
          metadata: {
            type: "exhibitor_installment",
            bookingId: booking.id,
            userId: session.user.id,
            totalInstallments: String(nbInstallments),
          },
        },
        metadata: {
          type: "exhibitor",
          bookingId: booking.id,
          userId: session.user.id,
          installments: String(nbInstallments),
          cancelAt: String(Math.floor(cancelAt.getTime() / 1000)),
        },
        success_url: `${process.env.NEXT_PUBLIC_APP_URL}/exposants/confirmation/${booking.id}`,
        cancel_url: `${process.env.NEXT_PUBLIC_APP_URL}/exposants/reservation?pack=${pack}`,
      } as Parameters<typeof stripe.checkout.sessions.create>[0]);

      await prisma.exhibitorBooking.update({
        where: { id: booking.id },
        data: { stripeSessionId: checkoutSession.id },
      });

      return NextResponse.json({ url: checkoutSession.url });
    }
  } catch (error) {
    console.error("Exhibitor checkout error:", error);
    return NextResponse.json({ error: "Erreur interne." }, { status: 500 });
  }
}

import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { getStripe } from "@/lib/stripe";
import {
  EXHIBITOR_EVENTS,
  EXHIBITOR_PACKS,
  calculatePrice,
  DEPOSIT_AMOUNT,
  MAX_INSTALLMENTS,
} from "@/lib/exhibitor-events";
import { sendQuoteEmail } from "@/lib/email";
import { randomUUID } from "crypto";

export async function POST(request: Request) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Non authentifié." }, { status: 401 });
    }

    const { pack, events, installments, stands: rawStands, companyName, contactName, email, phone, sector, newsletter } =
      await request.json();

    // Validate stands (1-5)
    const stands = Math.max(1, Math.min(5, Number(rawStands) || 1));

    // Validate pack (support legacy SAISON → ENTREPRENEUR)
    const effectivePackId = pack === "SAISON" ? "ENTREPRENEUR" : pack;
    const selectedPack = EXHIBITOR_PACKS.find((p) => p.id === effectivePackId);
    if (!selectedPack) {
      return NextResponse.json({ error: "Formule invalide." }, { status: 400 });
    }

    // Validate events (SAISON = all events)
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
    if (nbInstallments < 1 || nbInstallments > MAX_INSTALLMENTS) {
      return NextResponse.json(
        { error: "Nombre de mensualités invalide." },
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

    // Calculate price (per stand), then multiply by number of stands
    const { totalDays, totalPrice: unitPrice } = calculatePrice(effectivePackId, eventIds);
    const totalPrice = unitPrice * stands;
    if (totalPrice <= 0) {
      return NextResponse.json({ error: "Prix invalide." }, { status: 400 });
    }

    // ── Payment calculation ──
    // Deposit is paid upfront, remaining balance in N monthly installments
    const deposit = Math.min(DEPOSIT_AMOUNT * stands, totalPrice);
    const remainingBalance = totalPrice - deposit;
    const installmentAmount = nbInstallments > 1 && remainingBalance > 0
      ? Math.ceil((remainingBalance / (nbInstallments - 1)) * 100) / 100
      : 0;

    // Build event description
    const selectedEvents = EXHIBITOR_EVENTS.filter((e) => eventIds.includes(e.id));
    const eventNames = selectedEvents.map((e) => e.title).join(", ");
    const standsLabel = stands > 1 ? ` × ${stands} stands` : "";
    const description = `${selectedPack.name}${standsLabel} — ${eventNames} (${totalDays} jour${totalDays > 1 ? "s" : ""})`;

    // Create booking in DB
    const booking = await prisma.exhibitorBooking.create({
      data: {
        userId: session.user.id,
        companyName: companyName.trim(),
        contactName: contactName.trim(),
        email: email.trim(),
        phone: phone.trim(),
        sector: sector.trim(),
        pack: effectivePackId,
        events: eventIds,
        totalDays,
        totalPrice,
        stands,
        installments: nbInstallments,
        installmentAmount: nbInstallments === 1 ? totalPrice : installmentAmount,
        paidInstallments: 0,
        status: "PENDING",
      },
    });

    // Newsletter subscription
    if (newsletter) {
      try {
        await prisma.newsletterSubscriber.upsert({
          where: { email: email.trim() },
          create: { email: email.trim() },
          update: { isActive: true },
        });
      } catch (nlErr) {
        console.error("Newsletter subscribe failed (non-blocking):", nlErr);
      }
    }

    // Create exhibitor profile for visibility form
    const profileToken = randomUUID();
    try {
      await prisma.exhibitorProfile.create({
        data: {
          bookingId: booking.id,
          userId: session.user.id,
          token: profileToken,
        },
      });
    } catch (profileErr) {
      console.error("Profile creation failed (non-blocking):", profileErr);
    }

    // Send quote email instantly
    try {
      await sendQuoteEmail({
        to: email.trim(),
        contactName: contactName.trim(),
        companyName: companyName.trim(),
        eventTitle: eventNames,
        packName: selectedPack.name,
        totalDays,
        totalPrice,
        installments: nbInstallments,
        installmentAmount: nbInstallments === 1 ? totalPrice : installmentAmount,
        bookingId: booking.id,
        profileToken,
      });
    } catch (emailErr) {
      console.error("Quote email failed (non-blocking):", emailErr);
    }

    const stripe = getStripe();

    if (nbInstallments === 1) {
      // ── Single full payment ──
      const checkoutSession = await stripe.checkout.sessions.create({
        mode: "payment",
        payment_method_types: ["card", "paypal"],
        customer_email: email.trim(),
        line_items: [
          {
            price_data: {
              currency: "eur",
              unit_amount: Math.round(totalPrice * 100),
              product_data: {
                name: `Stand Exposant${standsLabel} — ${selectedPack.name}`,
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
          stands: String(stands),
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
      // ── Deposit (50€) + remaining balance in (N-1) monthly installments ──

      // Step 1: Create Stripe checkout for the deposit only
      const checkoutSession = await stripe.checkout.sessions.create({
        mode: "payment",
        payment_method_types: ["card", "paypal"],
        customer_email: email.trim(),
        line_items: [
          {
            price_data: {
              currency: "eur",
              unit_amount: Math.round(deposit * 100),
              product_data: {
                name: `Acompte de réservation${standsLabel} — ${selectedPack.name}`,
                description: `Acompte ${deposit} € sur ${totalPrice} € total. Solde restant (${remainingBalance} €) en ${nbInstallments - 1} mensualité${nbInstallments - 1 > 1 ? "s" : ""}.`,
              },
            },
            quantity: 1,
          },
        ],
        metadata: {
          type: "exhibitor",
          bookingId: booking.id,
          userId: session.user.id,
          stands: String(stands),
          installments: String(nbInstallments),
          deposit: String(deposit),
          remainingBalance: String(remainingBalance),
          installmentAmount: String(installmentAmount),
        },
        success_url: `${process.env.NEXT_PUBLIC_APP_URL}/exposants/confirmation/${booking.id}`,
        cancel_url: `${process.env.NEXT_PUBLIC_APP_URL}/exposants/reservation?pack=${pack}`,
      });

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

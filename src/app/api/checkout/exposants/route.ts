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
import { rateLimit, getClientIp } from "@/lib/rate-limit";
import { getFrictionLevel, SCORE_TTL_MS } from "@/lib/behavior";

export async function POST(request: Request) {
  try {
    const ip = getClientIp(request);
    const rl = rateLimit(`checkout-exposant:${ip}`, { limit: 5, windowSec: 60 });
    if (!rl.success) {
      return NextResponse.json({ error: "Trop de tentatives, réessayez dans une minute." }, { status: 429 });
    }

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

    // Anti-spam: reject gibberish names (no vowels or too many consecutive consonants)
    const hasVowel = /[aeiouyàâéèêëïîôùûüæœ]/i;
    const tooManyConsonants = /[^aeiouyàâéèêëïîôùûüæœ\s\-'&.]{6,}/i;
    if (!hasVowel.test(companyName) || !hasVowel.test(contactName) ||
        tooManyConsonants.test(companyName) || tooManyConsonants.test(contactName)) {
      return NextResponse.json(
        { error: "Nom invalide." },
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

    // Vérifier si le lead a déjà versé un acompte de 50 €
    let leadDepositCredit = 0;
    try {
      const paidLead = await prisma.exposantLead.findFirst({
        where: { email: email.trim(), status: "DEPOSIT_PAID", bookingId: null },
      });
      if (paidLead) {
        leadDepositCredit = DEPOSIT_AMOUNT;
        // Lier le lead au booking
        await prisma.exposantLead.update({
          where: { id: paidLead.id },
          data: { bookingId: booking.id },
        });
        // Enregistrer l'acompte lead comme paiement sur le booking
        await prisma.exhibitorPayment.create({
          data: {
            bookingId: booking.id,
            amount: DEPOSIT_AMOUNT,
            type: "deposit",
            label: "Acompte pré-inscription (50 €)",
            stripeId: paidLead.stripeSessionId,
          },
        });
        // Mettre à jour le booking
        await prisma.exhibitorBooking.update({
          where: { id: booking.id },
          data: { paidInstallments: 1, status: "PARTIAL" },
        });
      }
    } catch (_) {
      // non bloquant — on continue sans crédit
      leadDepositCredit = 0;
    }

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

    // Behavioral friction (with TTL — expired scores are ignored)
    const clientFp = request.headers.get("x-behavior-fp") || "";
    const bFingerprint = `${clientFp}:${ip}`;
    const bRecord = await prisma.behaviorScore.findUnique({ where: { fingerprint: bFingerprint } });
    const bScoreAge = bRecord ? Date.now() - bRecord.updatedAt.getTime() : 0;
    const bEffectiveScore = bRecord && bScoreAge < SCORE_TTL_MS ? bRecord.score : 0;
    const friction = getFrictionLevel(bEffectiveScore);
    if (friction === "block") {
      return NextResponse.json({ error: "Trop de tentatives inhabituelles détectées. Réessayez dans quelques heures." }, { status: 403 });
    }
    const paymentMethods: ("card" | "paypal")[] =
      friction === "card_only" ? ["card"] : ["card", "paypal"];

    // Montant restant après crédit de l'acompte lead
    const amountDue = totalPrice - leadDepositCredit;

    // Si le lead a déjà payé la totalité (cas rare: prix = 50€)
    if (amountDue <= 0) {
      await prisma.exhibitorBooking.update({
        where: { id: booking.id },
        data: { status: "CONFIRMED", paidInstallments: 1 },
      });
      return NextResponse.json({
        url: `${process.env.NEXT_PUBLIC_APP_URL}/exposants/confirmation/${booking.id}`,
      });
    }

    if (nbInstallments === 1) {
      // ── Single full payment (minus lead credit) ──
      const checkoutSession = await stripe.checkout.sessions.create({
        mode: "payment",
        payment_method_types: paymentMethods,
        customer_email: email.trim(),
        line_items: [
          {
            price_data: {
              currency: "eur",
              unit_amount: Math.round(amountDue * 100),
              product_data: {
                name: `Stand Exposant${standsLabel} — ${selectedPack.name}`,
                description: leadDepositCredit > 0
                  ? `${description} (${leadDepositCredit} € d'acompte déduit)`
                  : description,
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
          leadDepositCredit: String(leadDepositCredit),
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
      // ── Installments: le lead a déjà payé l'acompte, on passe au solde ──
      if (leadDepositCredit >= deposit) {
        // L'acompte lead couvre le dépôt → on crée directement l'abonnement mensuel
        // Le webhook exhibitor_early_payment ou le checkout normal prendra le relais
        // Pour l'instant, redirigeons vers la page de confirmation avec statut PARTIAL
        // Le solde sera géré par les mensualités automatiques configurées par le webhook
        const adjustedRemainingBalance = totalPrice - leadDepositCredit;
        const adjustedInstallmentAmount = nbInstallments > 1 && adjustedRemainingBalance > 0
          ? Math.ceil((adjustedRemainingBalance / (nbInstallments - 1)) * 100) / 100
          : 0;

        // Mettre à jour le montant des mensualités
        await prisma.exhibitorBooking.update({
          where: { id: booking.id },
          data: {
            installmentAmount: adjustedInstallmentAmount,
          },
        });

        // Créer un checkout pour la première mensualité (pas le dépôt, déjà payé)
        const checkoutSession = await stripe.checkout.sessions.create({
          mode: "payment",
          payment_method_types: paymentMethods,
          customer_email: email.trim(),
          line_items: [
            {
              price_data: {
                currency: "eur",
                unit_amount: Math.round(adjustedInstallmentAmount * 100),
                product_data: {
                  name: `1ère mensualité${standsLabel} — ${selectedPack.name}`,
                  description: `Acompte de 50 € déjà versé. Solde restant (${adjustedRemainingBalance} €) en ${nbInstallments - 1} mensualité${nbInstallments - 1 > 1 ? "s" : ""}.`,
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
            deposit: String(leadDepositCredit),
            remainingBalance: String(adjustedRemainingBalance),
            installmentAmount: String(adjustedInstallmentAmount),
            leadDepositCredit: String(leadDepositCredit),
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

      // Pas de crédit lead, checkout normal pour l'acompte
      const checkoutSession = await stripe.checkout.sessions.create({
        mode: "payment",
        payment_method_types: paymentMethods,
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

import { NextResponse } from "next/server";
import { headers } from "next/headers";
import { getStripe, Stripe } from "@/lib/stripe";
import { prisma } from "@/lib/db";
import QRCode from "qrcode";
import { uploadBuffer } from "@/lib/bunny";
import { sendThankYouEmail, sendTicketConfirmationEmail } from "@/lib/email";
import { sendTicketConfirmationWhatsApp, sendWhatsAppText } from "@/lib/whatsapp";
import { generateInvoicePDF, generateInvoiceNumber } from "@/lib/generate-invoice";
import { DEPOSIT_AMOUNT } from "@/lib/exhibitor-events";
import bcrypt from "bcryptjs";
import crypto from "crypto";
import { signQr } from "@/lib/qr-sig";
import { releaseLockBySession } from "@/lib/pending-checkout";
import { sendMetaPurchaseEvent } from "@/lib/meta-capi";

export async function POST(request: Request) {
  const body = await request.text();
  const headersList = await headers();
  const signature = headersList.get("stripe-signature");

  if (!signature) {
    return NextResponse.json({ error: "No signature" }, { status: 400 });
  }

  let event: Stripe.Event;

  try {
    event = getStripe().webhooks.constructEvent(
      body,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET!
    );
  } catch (err) {
    console.error("Webhook signature verification failed:", err);
    return NextResponse.json({ error: "Invalid signature" }, { status: 400 });
  }

  // ── Idempotency: atomic upsert to prevent race conditions ──
  try {
    await prisma.stripeEvent.create({
      data: { id: event.id, type: event.type },
    });
  } catch (e: any) {
    // Unique constraint violation → already processed
    if (e?.code === "P2002") {
      console.log(`[webhook] Event ${event.id} already processed, skipping`);
      return NextResponse.json({ received: true });
    }
    throw e;
  }

  if (event.type === "checkout.session.completed") {
    const session = event.data.object as Stripe.Checkout.Session;
    const metadata = session.metadata;

    if (metadata?.type === "ticket") {
      await handleTicketPurchase(session);
    } else if (metadata?.type === "ticket_installment") {
      // Deprecated flow — CPT replaces this. Ignore to prevent ghost-ticket creation.
      console.warn(`[webhook] ticket_installment flow deprecated — session ${session.id} ignored`);
    } else if (metadata?.type === "ticket_recharge") {
      await handleTicketRecharge(session);
    } else if (metadata?.type === "culture_pour_tous") {
      await handleCulturePourTousPurchase(session);
    } else if (metadata?.type === "order") {
      await handleOrderPurchase(session);
    } else if (metadata?.type === "exhibitor") {
      await handleExhibitorBooking(session);
    } else if (metadata?.type === "exhibitor_early_payment") {
      await handleExhibitorEarlyPayment(session);
    } else if (metadata?.type === "exposant_deposit") {
      await handleExposantDeposit(session);
    } else if (metadata?.type === "ticket_transfer") {
      await handleTicketTransferFinalize(session);
    } else if (metadata?.type === "ticket_listing_purchase") {
      await handleTicketListingPurchase(session);
    } else {
      console.warn(`[webhook] Unknown metadata.type: "${metadata?.type}" for session ${session.id}`);
    }
  } else if (event.type === "invoice.paid") {
    const invoice = event.data.object as Stripe.Invoice;
    await handleExhibitorInstallment(invoice);
  } else if (
    event.type === "checkout.session.expired" ||
    event.type === "checkout.session.async_payment_failed"
  ) {
    // Libérer le verrou PendingCheckout pour permettre au client de retenter
    const session = event.data.object as Stripe.Checkout.Session;
    await releaseLockBySession(session.id).catch(() => {});
  }

  return NextResponse.json({ received: true });
}

async function handleTicketPurchase(session: Stripe.Checkout.Session) {
  const { eventId, userId, tier, quantity, unitPrice, firstName, lastName, email, phone, visitDate } = session.metadata!;
  const qty = parseInt(quantity);

  const event = await prisma.event.findUnique({
    where: { id: eventId },
    select: { title: true, date: true, venue: true, address: true, coverImage: true, tiers: true, priceEarly: true, priceStd: true, priceVip: true },
  });

  if (!event) {
    console.error(`Ticket purchase: event ${eventId} not found`);
    return;
  }

  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: { name: true, email: true, phone: true },
  });

  // Re-validate price from database — NEVER trust metadata for pricing
  const customTiers = event.tiers as Array<{ id: string; name: string; price: number }> | null;
  const matchedTier = Array.isArray(customTiers) ? customTiers.find((t) => t.id === tier) : null;
  const legacyLabelMap: Record<string, string> = { EARLY_BIRD: "Early Bird", STANDARD: "Standard", VIP: "VIP" };
  const tierName = matchedTier?.name || legacyLabelMap[tier] || tier;

  // Resolve price from DB only — never trust client metadata
  let unitPriceNum: number;
  if (matchedTier) {
    unitPriceNum = matchedTier.price;
  } else if (tier === "EARLY_BIRD") {
    unitPriceNum = event.priceEarly;
  } else if (tier === "STANDARD") {
    unitPriceNum = event.priceStd;
  } else if (tier === "VIP") {
    unitPriceNum = event.priceVip;
  } else {
    console.error(`[webhook] Ticket purchase rejected: tier "${tier}" not found in DB for event ${eventId}`);
    return;
  }

  const createdTickets: Array<{ id: string; qrCode: string }> = [];

  const ticketPromises = Array.from({ length: qty }, async () => {
    const ticketId = crypto.randomUUID();
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "https://dreamteamafrica.com";
    // HMAC signature to prevent QR URL guessing
    const sig = signQr(ticketId);
    const qrUrl = `${baseUrl}/check/${ticketId}?sig=${sig}`;

    const qrBuffer = await QRCode.toBuffer(qrUrl, { width: 600, margin: 2 });
    const { url: qrCdnUrl } = await uploadBuffer(
      Buffer.from(qrBuffer),
      `qrcodes/tickets/${ticketId}.png`,
    );

    const ticket = await prisma.ticket.create({
      data: {
        id: ticketId,
        eventId,
        userId,
        tier,
        price: unitPriceNum,
        totalPaid: unitPriceNum,
        qrCode: qrCdnUrl,
        stripeSessionId: session.id,
        firstName: firstName || null,
        lastName: lastName || null,
        email: email || null,
        phone: phone || null,
        visitDate: visitDate ? new Date(visitDate) : null,
      },
    });

    await prisma.ticketPayment.create({
      data: {
        ticketId: ticket.id,
        amount: unitPriceNum,
        type: "full",
        label: `Paiement Stripe — ${tierName}`,
        stripeId: session.id,
      },
    });

    createdTickets.push({ id: ticket.id, qrCode: qrCdnUrl });
    return ticket;
  });

  await Promise.all(ticketPromises);
  console.log(`Created ${qty} ticket(s) for event ${eventId}, user ${userId}`);
  await releaseLockBySession(session.id).catch(() => {});

  // ── NTBC: créditer le montant payé en NTBC dans le wallet ──
  try {
    const { crediterNtbc } = await import("@/lib/ntbc");
    const totalPaid = unitPriceNum * qty;
    await crediterNtbc(userId, totalPaid, `Billet ${tierName} — ${event.title}`);
    console.log(`[NTBC] +${totalPaid} NTBC crédités à ${userId} (billet ${tierName})`);
  } catch (ntbcErr) {
    console.error("[NTBC] Credit failed:", ntbcErr);
  }

  // Send confirmation email
  try {
    if (event) {
      await sendTicketConfirmationEmail({
        to: email || user?.email || "",
        guestName: `${firstName || ""} ${lastName || ""}`.trim() || user?.name || user?.email || "",
        eventTitle: event.title,
        eventVenue: event.venue,
        eventAddress: event.address,
        eventDate: visitDate ? new Date(visitDate) : event.date,
        eventCoverImage: event.coverImage,
        tier: tierName,
        price: unitPriceNum,
        quantity: qty,
        tickets: createdTickets,
      });
    }
  } catch (emailErr) {
    console.error("Ticket confirmation email failed:", emailErr);
  }

  // WhatsApp confirmation disabled — coût Meta trop élevé, email suffit

  // Meta Conversions API — bypass cookie consent, signal direct au pixel
  // eventId = ticketId pour dédupliquer avec l'event browser fbq('track','Purchase',...,{eventID})
  try {
    const firstTicketId = createdTickets[0]?.id;
    if (firstTicketId) {
      await sendMetaPurchaseEvent({
        eventId: firstTicketId,
        value: unitPriceNum * qty,
        contentName: event.title,
        contentIds: createdTickets.map((t) => t.id),
        numItems: qty,
        email: email || user?.email || null,
        phone: phone || user?.phone || null,
        firstName: firstName || null,
        lastName: lastName || null,
        sourceUrl: `https://dreamteamafrica.com/saison-culturelle-africaine/confirmation/${firstTicketId}`,
      });
    }
  } catch (capiErr) {
    console.error("[meta-capi] ticket purchase failed:", capiErr);
  }
}

/**
 * @deprecated Kept for historical sessions. New flow uses "culture_pour_tous" (handleCulturePourTousPurchase).
 * UI no longer offers the installment option — CPT replaces it with free-pace recharges.
 */
async function handleTicketInstallment(session: Stripe.Checkout.Session) {
  const {
    eventId, userId, tier, quantity, unitPrice,
    firstName, lastName, email, phone, visitDate,
    installments, deposit, remainingBalance, installmentAmount,
  } = session.metadata!;

  const qty = Math.min(Math.max(parseInt(quantity) || 1, 1), 10);
  const nbInstallments = Math.min(Math.max(parseInt(installments) || 1, 1), 3);

  const event = await prisma.event.findUnique({
    where: { id: eventId },
    select: { title: true, date: true, venue: true, address: true, coverImage: true, tiers: true, priceEarly: true, priceStd: true, priceVip: true },
  });

  if (!event) {
    console.error(`Ticket installment: event ${eventId} not found`);
    return;
  }

  // Re-validate price from database — never trust metadata
  const customTiers = event.tiers as Array<{ id: string; name: string; price: number }> | null;
  const matchedTier = Array.isArray(customTiers) ? customTiers.find((t) => t.id === tier) : null;
  const legacyLabelMap: Record<string, string> = { EARLY_BIRD: "Early Bird", STANDARD: "Standard", VIP: "VIP" };
  const tierName = matchedTier?.name || legacyLabelMap[tier] || tier;

  // Resolve price from DB only
  let unitPriceNum: number;
  if (matchedTier) {
    unitPriceNum = matchedTier.price;
  } else if (tier === "EARLY_BIRD") {
    unitPriceNum = event.priceEarly;
  } else if (tier === "STANDARD") {
    unitPriceNum = event.priceStd;
  } else if (tier === "VIP") {
    unitPriceNum = event.priceVip;
  } else {
    console.error(`[webhook] Ticket installment rejected: tier "${tier}" not found in DB for event ${eventId}`);
    return;
  }

  // Create tickets (with deposit paid, rest pending via subscription)
  const createdTickets: Array<{ id: string; qrCode: string }> = [];

  const ticketPromises = Array.from({ length: qty }, async () => {
    const ticketId = crypto.randomUUID();

    // Installment: no QR code until fully paid — prevents usage before payment
    const ticket = await prisma.ticket.create({
      data: {
        id: ticketId,
        eventId,
        userId,
        tier,
        price: unitPriceNum,
        totalPaid: 0,
        qrCode: null,
        stripeSessionId: session.id,
        firstName: firstName || null,
        lastName: lastName || null,
        email: email || null,
        phone: phone || null,
        visitDate: visitDate ? new Date(visitDate) : null,
      },
    });

    createdTickets.push({ id: ticket.id, qrCode: "" });
    return ticket;
  });

  await Promise.all(ticketPromises);
  console.log(`Created ${qty} installment ticket(s) for event ${eventId} (${nbInstallments}x)`);

  // Create Stripe subscription for remaining balance
  if (nbInstallments > 1) {
    try {
      const stripe = getStripe();
      const customerEmail = email || "";

      // Find or create Stripe customer
      const customers = await stripe.customers.list({ email: customerEmail, limit: 1 });
      let customer: Stripe.Customer;
      if (customers.data.length > 0) {
        customer = customers.data[0];
      } else {
        customer = await stripe.customers.create({
          email: customerEmail,
          name: `${firstName || ""} ${lastName || ""}`.trim(),
          metadata: { userId },
        });
      }

      // Attach payment method from checkout session
      if (session.payment_intent) {
        const pi = await stripe.paymentIntents.retrieve(session.payment_intent as string);
        if (pi.payment_method) {
          await stripe.paymentMethods.attach(pi.payment_method as string, { customer: customer.id });
          await stripe.customers.update(customer.id, {
            invoice_settings: { default_payment_method: pi.payment_method as string },
          });
        }
      }

      const monthlyAmountNum = parseFloat(installmentAmount);
      const remainingMonths = nbInstallments - 1;

      // Create product + price for monthly installments
      const product = await stripe.products.create({
        name: `Mensualité billet — ${event?.title || "Événement"}`,
        metadata: { eventId, userId },
      });

      const price = await stripe.prices.create({
        product: product.id,
        unit_amount: Math.round(monthlyAmountNum * 100),
        currency: "eur",
        recurring: { interval: "month" },
      });

      // Create subscription that auto-cancels after remaining months
      const cancelAt = new Date();
      cancelAt.setMonth(cancelAt.getMonth() + remainingMonths + 1);

      await stripe.subscriptions.create({
        customer: customer.id,
        items: [{ price: price.id }],
        cancel_at: Math.floor(cancelAt.getTime() / 1000),
        metadata: {
          type: "ticket_installment",
          eventId,
          userId,
          ticketIds: createdTickets.map((t) => t.id).join(","),
        },
      });

      console.log(`Created subscription for ${remainingMonths} monthly payments of ${monthlyAmountNum}€`);
    } catch (subErr) {
      console.error("Failed to create ticket installment subscription:", subErr);
    }
  }

  // Send confirmation email
  try {
    if (event) {
      const depositNum = parseFloat(deposit);
      await sendTicketConfirmationEmail({
        to: email || "",
        guestName: `${firstName || ""} ${lastName || ""}`.trim(),
        eventTitle: event.title,
        eventVenue: event.venue,
        eventAddress: event.address,
        eventDate: visitDate ? new Date(visitDate) : event.date,
        eventCoverImage: event.coverImage,
        tier: tierName,
        price: unitPriceNum,
        quantity: qty,
        tickets: createdTickets,
      });
    }
  } catch (emailErr) {
    console.error("Ticket installment confirmation email failed:", emailErr);
  }

  // Send WhatsApp confirmation
  try {
    const whatsappPhone = phone;
    const customerName = `${firstName || ""} ${lastName || ""}`.trim().replace(/[\n\r]/g, " ");
    if (whatsappPhone && event) {
      const depositNum = parseFloat(deposit);
      const monthlyNum = parseFloat(installmentAmount);
      const remainingMonths = nbInstallments - 1;
      const totalRemaining = unitPriceNum * qty - depositNum;
      await sendWhatsAppText(whatsappPhone,
        `Bonjour ${customerName},\n\nMerci pour votre reservation !\n\nVotre acompte de ${depositNum} EUR a ete recu. Vos ${qty} billet(s) pour ${event.title} sont confirmes.\n\nSolde restant : ${totalRemaining} EUR\n\nCulture pour Tous : rechargez a votre rythme des 1 EUR depuis votre espace billets :\nhttps://dreamteamafrica.com/dashboard/tickets\n\nA tres bientot !\n\nL'equipe Dream Team Africa`
      );
    }
  } catch (waErr) {
    console.error("WhatsApp ticket installment confirmation failed:", waErr);
  }
}

async function handleTicketRecharge(session: Stripe.Checkout.Session) {
  const { ticketId, userId, amount } = session.metadata!;
  const rechargeAmount = parseFloat(amount);

  // Verify ticket exists and belongs to user
  const ticket = await prisma.ticket.findUnique({ where: { id: ticketId } });
  if (!ticket || (userId && ticket.userId !== userId)) {
    console.error(`Recharge rejected: ticket ${ticketId} ownership mismatch`);
    return;
  }

  // Prevent duplicate payment (defense in depth — idempotency also checked globally)
  const existingPayment = await prisma.ticketPayment.findFirst({
    where: { ticketId, stripeId: session.id },
  });
  if (existingPayment) {
    console.log(`Recharge already processed for ticket ${ticketId}, session ${session.id}`);
    return;
  }

  // Prevent overpayment
  const remaining = ticket.price - ticket.totalPaid;
  const safeAmount = Math.min(rechargeAmount, remaining);
  if (safeAmount <= 0) {
    console.log(`Ticket ${ticketId} already fully paid, skipping recharge`);
    return;
  }

  await prisma.ticketPayment.create({
    data: {
      ticketId,
      amount: safeAmount,
      type: "recharge",
      label: `Recharge +${safeAmount} €`,
      stripeId: session.id,
    },
  });

  const updatedTicket = await prisma.ticket.update({
    where: { id: ticketId },
    data: { totalPaid: { increment: safeAmount } },
  });

  // ── NTBC: créditer la recharge en NTBC ──
  try {
    const { crediterNtbc } = await import("@/lib/ntbc");
    await crediterNtbc(ticket.userId, safeAmount, `Recharge billet +${safeAmount} €`);
    console.log(`[NTBC] +${safeAmount} NTBC crédités à ${ticket.userId} (recharge billet)`);
  } catch (ntbcErr) {
    console.error("[NTBC] Recharge credit failed:", ntbcErr);
  }

  // If now fully paid → generate QR code
  if (updatedTicket.totalPaid >= updatedTicket.price && !updatedTicket.qrCode) {
    try {
      const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "https://dreamteamafrica.com";
      const sig = signQr(ticketId);
      const qrUrl = `${baseUrl}/check/${ticketId}?sig=${sig}`;
      const qrBuffer = await QRCode.toBuffer(qrUrl, { width: 600, margin: 2 });
      const { url: qrCdnUrl } = await uploadBuffer(Buffer.from(qrBuffer), `qrcodes/tickets/${ticketId}.png`);
      await prisma.ticket.update({
        where: { id: ticketId },
        data: { qrCode: qrCdnUrl },
      });
      console.log(`Ticket ${ticketId} fully paid → QR generated: ${qrCdnUrl}`);
    } catch (qrErr) {
      console.error(`Failed to generate QR for ticket ${ticketId}:`, qrErr);
    }
  }

  console.log(`Ticket ${ticketId} recharged +${safeAmount}€ (user: ${userId})`);
}

async function handleCulturePourTousPurchase(session: Stripe.Checkout.Session) {
  const { eventId, userId, tier, quantity, targetPrice, deposit, firstName, lastName, email, phone, visitDate } = session.metadata!;
  const qty = Math.min(Math.max(parseInt(quantity) || 1, 1), 10);
  const depositPerTicket = parseFloat(deposit) / qty;
  const targetPriceNum = parseFloat(targetPrice);

  const event = await prisma.event.findUnique({
    where: { id: eventId },
    select: { title: true, date: true, venue: true, address: true, coverImage: true, tiers: true, slug: true },
  });
  if (!event) {
    console.error(`CPT purchase: event ${eventId} not found`);
    return;
  }

  // Re-validate price from DB — never trust metadata.
  // CPT can apply to ANY paid tier of an event that has CPT enabled (any tier with isCulturePourTous=true).
  const customTiers = event.tiers as Array<{ id: string; name: string; price: number; isCulturePourTous?: boolean; onSiteOnly?: boolean }> | null;
  const cptEnabled = Array.isArray(customTiers) && customTiers.some((t) => t.isCulturePourTous);
  const matched = Array.isArray(customTiers) ? customTiers.find((t) => t.id === tier) : null;
  if (!cptEnabled || !matched || matched.isCulturePourTous || matched.onSiteOnly || Number(matched.price) <= 0) {
    console.error(`CPT purchase rejected: tier "${tier}" not eligible for event ${eventId}`);
    return;
  }
  const verifiedPrice = Number(matched.price);
  if (verifiedPrice !== targetPriceNum) {
    console.error(`CPT price mismatch: metadata=${targetPriceNum}, db=${verifiedPrice}`);
  }

  const { signTicketToken, buildMagicLink } = await import("@/lib/cpt-token");
  const { sendCptWelcomeEmail } = await import("@/lib/email");

  const created: Array<{ id: string; magicLink: string }> = [];
  for (let i = 0; i < qty; i++) {
    const ticketId = crypto.randomUUID();
    await prisma.$transaction([
      prisma.ticket.create({
        data: {
          id: ticketId,
          eventId,
          userId,
          tier,
          price: verifiedPrice,
          totalPaid: depositPerTicket,
          qrCode: null, // QR only when fully paid
          stripeSessionId: session.id,
          firstName: firstName || null,
          lastName: lastName || null,
          email: email || null,
          phone: phone || null,
          visitDate: visitDate ? new Date(visitDate) : null,
        },
      }),
      prisma.ticketPayment.create({
        data: {
          ticketId,
          amount: depositPerTicket,
          type: "cpt_deposit",
          label: `Acompte Culture pour Tous`,
          stripeId: session.id,
        },
      }),
    ]);
    created.push({ id: ticketId, magicLink: buildMagicLink(ticketId) });
  }
  console.log(`Created ${qty} CPT ticket(s) for event ${eventId}`);
  await releaseLockBySession(session.id).catch(() => {});

  // Welcome email with magic link
  try {
    await sendCptWelcomeEmail({
      to: email || "",
      firstName: firstName || "",
      eventTitle: event.title,
      eventDate: event.date,
      eventVenue: event.venue,
      targetPrice: verifiedPrice,
      deposit: depositPerTicket,
      tickets: created,
    });
  } catch (emailErr) {
    console.error("CPT welcome email failed:", emailErr);
  }

  // Meta Conversions API — Purchase (CPT acompte = achat confirmé)
  try {
    const firstTicketId = created[0]?.id;
    if (firstTicketId) {
      await sendMetaPurchaseEvent({
        eventId: firstTicketId,
        value: depositPerTicket * qty,
        contentName: event.title,
        contentIds: created.map((t) => t.id),
        numItems: qty,
        email: email || null,
        phone: phone || null,
        firstName: firstName || null,
        lastName: lastName || null,
        sourceUrl: `https://dreamteamafrica.com/saison-culturelle-africaine/confirmation/${firstTicketId}`,
      });
    }
  } catch (capiErr) {
    console.error("[meta-capi] CPT purchase failed:", capiErr);
  }
}

async function handleOrderPurchase(session: Stripe.Checkout.Session) {
  const { userId, items: itemsJson } = session.metadata!;
  const items = JSON.parse(itemsJson) as Array<{
    productId: string;
    quantity: number;
    price: number;
  }>;

  // Atomic transaction: re-validate stock from DB, create order, decrement stock
  await prisma.$transaction(async (tx) => {
    // Re-validate prices and stock from database (never trust metadata)
    const products = await tx.product.findMany({
      where: { id: { in: items.map((i) => i.productId) } },
    });
    const productMap = new Map(products.map((p) => [p.id, p]));

    let dbTotal = 0;
    for (const item of items) {
      const product = productMap.get(item.productId);
      if (!product) {
        console.error(`[webhook] Order rejected: product ${item.productId} not found`);
        return;
      }
      if (product.stock < item.quantity) {
        console.error(`[webhook] Order rejected: insufficient stock for ${product.name} (${product.stock} < ${item.quantity})`);
        return;
      }
      dbTotal += product.price * item.quantity;
    }

    const order = await tx.order.create({
      data: {
        userId,
        status: "PAID",
        total: dbTotal,
        stripeSessionId: session.id,
        items: {
          create: items.map((item) => ({
            productId: item.productId,
            quantity: item.quantity,
            price: productMap.get(item.productId)!.price,
          })),
        },
      },
    });

    // Decrement stock atomically within same transaction
    for (const item of items) {
      await tx.product.update({
        where: { id: item.productId },
        data: { stock: { decrement: item.quantity } },
      });
    }

    console.log(`Created order ${order.id} for user ${userId}, total: ${dbTotal}€`);
  });
}

async function handleExhibitorBooking(session: Stripe.Checkout.Session) {
  const { bookingId, installments, remainingBalance, installmentAmount, leadDepositCredit } = session.metadata!;
  if (!bookingId) return;

  const nbInstallments = parseInt(installments || "1");
  const isOneTime = nbInstallments === 1;
  const leadCredit = parseFloat(leadDepositCredit || "0");

  // Get booking to calculate amounts
  const bookingData = await prisma.exhibitorBooking.findUnique({
    where: { id: bookingId },
    select: { totalPrice: true, stands: true, paidInstallments: true },
  });
  const stands = bookingData?.stands ?? 1;
  const deposit = Math.min(DEPOSIT_AMOUNT * stands, bookingData?.totalPrice ?? 0);
  // Si le lead avait déjà payé un acompte, paidInstallments est déjà à 1
  const currentPaid = bookingData?.paidInstallments ?? 0;

  if (isOneTime) {
    // Full payment — confirm immediately
    // Le montant Stripe est totalPrice - leadCredit
    const stripeAmount = (bookingData?.totalPrice ?? 0) - leadCredit;

    await prisma.exhibitorBooking.update({
      where: { id: bookingId },
      data: {
        stripeSessionId: session.id,
        paidInstallments: currentPaid + 1,
        status: "CONFIRMED",
      },
    });

    // Record payment (montant réellement payé via Stripe)
    await prisma.exhibitorPayment.create({
      data: {
        bookingId,
        amount: stripeAmount,
        type: "full_payment",
        label: leadCredit > 0
          ? `Paiement intégral (${leadCredit} € d'acompte déduit)`
          : "Paiement intégral",
        stripeId: session.id,
      },
    });

    // Generate invoice
    await generateInvoiceOnCompletion(bookingId);
    console.log(`Exhibitor booking ${bookingId}: CONFIRMED (full payment, lead credit: ${leadCredit}€)`);
  } else {
    // Deposit or installment paid — update booking
    const newPaid = currentPaid + 1;
    await prisma.exhibitorBooking.update({
      where: { id: bookingId },
      data: {
        stripeSessionId: session.id,
        paidInstallments: newPaid,
        status: "PARTIAL",
      },
    });

    // Record payment (montant réellement débité via Stripe)
    const stripeDeposit = leadCredit >= deposit
      ? parseFloat(installmentAmount || "0")  // 1ère mensualité, pas le dépôt
      : deposit;
    const paymentLabel = leadCredit >= deposit
      ? "1ère mensualité"
      : "Acompte de réservation";

    await prisma.exhibitorPayment.create({
      data: {
        bookingId,
        amount: stripeDeposit,
        type: leadCredit >= deposit ? "installment" : "deposit",
        label: paymentLabel,
        stripeId: session.id,
      },
    });

    console.log(`Exhibitor booking ${bookingId}: PARTIAL (${newPaid}/${nbInstallments}, lead credit: ${leadCredit}€)`);

    // Create subscription for remaining installments
    const balance = parseFloat(remainingBalance || "0");
    const monthlyAmount = parseFloat(installmentAmount || "0");
    const remainingMonths = nbInstallments - 1;

    if (balance > 0 && monthlyAmount > 0 && remainingMonths > 0) {
      try {
        const stripe = getStripe();

        // Get or create customer from checkout session
        const customerEmail = session.customer_email || session.customer_details?.email;
        let customerId = session.customer as string | null;
        if (!customerId && customerEmail) {
          const customers = await stripe.customers.list({ email: customerEmail, limit: 1 });
          if (customers.data.length > 0) {
            customerId = customers.data[0].id;
          } else {
            const customer = await stripe.customers.create({ email: customerEmail });
            customerId = customer.id;
          }
        }

        if (customerId) {
          const booking = await prisma.exhibitorBooking.findUnique({
            where: { id: bookingId },
            select: { companyName: true, pack: true },
          });

          const product = await stripe.products.create({
            name: `Solde Stand Exposant — ${booking?.companyName || "Exposant"}`,
            description: `${remainingMonths} mensualité${remainingMonths > 1 ? "s" : ""} de ${monthlyAmount} €`,
          });

          const price = await stripe.prices.create({
            product: product.id,
            unit_amount: Math.round(monthlyAmount * 100),
            currency: "eur",
            recurring: { interval: "month" },
          });

          const cancelAt = new Date();
          cancelAt.setMonth(cancelAt.getMonth() + remainingMonths);
          cancelAt.setDate(cancelAt.getDate() + 3);

          const subscription = await stripe.subscriptions.create({
            customer: customerId,
            items: [{ price: price.id }],
            cancel_at: Math.floor(cancelAt.getTime() / 1000),
            metadata: {
              type: "exhibitor_installment",
              bookingId,
              totalInstallments: String(nbInstallments),
            },
          });

          await prisma.exhibitorBooking.update({
            where: { id: bookingId },
            data: { stripeSubscriptionId: subscription.id },
          });

          console.log(`Exhibitor ${bookingId}: subscription ${subscription.id} created (${remainingMonths} months × ${monthlyAmount} €)`);
        }
      } catch (subErr) {
        console.error(`Failed to create subscription for ${bookingId}:`, subErr);
      }
    }
  }

  // Send thank you email with profile link
  const booking = await prisma.exhibitorBooking.findUnique({
    where: { id: bookingId },
    include: { profile: { select: { token: true } } },
  });
  if (booking) {
    try {
      await sendThankYouEmail({
        to: booking.email,
        contactName: booking.contactName,
        companyName: booking.companyName,
        totalPrice: booking.totalPrice,
        installments: booking.installments,
        isFullyPaid: isOneTime,
        profileToken: booking.profile?.token,
      });
    } catch (emailErr) {
      console.error("Thank you email failed:", emailErr);
    }

    // Sync to L'Officiel d'Afrique directory (non-blocking)
    try {
      const { syncExhibitorToDirectory } = await import("@/lib/exhibitor-directory-sync");
      await syncExhibitorToDirectory(bookingId);
    } catch (dirErr) {
      console.error("Directory sync failed:", dirErr);
    }
  }
}

async function handleExhibitorEarlyPayment(session: Stripe.Checkout.Session) {
  const { bookingId, nbInstallments, amount: metaAmount, isFullPayment } = session.metadata!;
  if (!bookingId) return;

  const nbPaid = parseInt(nbInstallments || "1");

  const booking = await prisma.exhibitorBooking.findUnique({
    where: { id: bookingId },
    include: { payments: true },
  });
  if (!booking) return;

  // Determine amount: prefer explicit metadata amount (captures customAmount flow); fall back to formula.
  const metaAmountNum = Number(metaAmount);
  const hasMetaAmount = Number.isFinite(metaAmountNum) && metaAmountNum > 0;

  const stands = booking.stands ?? 1;
  const dep = Math.min(DEPOSIT_AMOUNT * stands, Number(booking.totalPrice));
  const totalRemaining = Number(booking.totalPrice) - dep;
  const totalMonths = booking.installments - 1;
  const monthly = totalMonths > 0 ? Math.ceil((totalRemaining / totalMonths) * 100) / 100 : 0;
  const paidMonths = Math.max(0, booking.paidInstallments - 1);
  const remainingInst = totalMonths - paidMonths;
  const formulaAmount = nbPaid === remainingInst
    ? Math.max(0, totalRemaining - paidMonths * monthly)
    : nbPaid * monthly;
  const amount = hasMetaAmount ? metaAmountNum : formulaAmount;

  // Status: use real paid sum to decide CONFIRMED, not installment counter.
  const alreadyPaid = booking.payments.reduce((s, p) => s + Number(p.amount), 0);
  const newPaidAmount = alreadyPaid + amount;
  const isComplete = isFullPayment === "1" || newPaidAmount + 0.005 >= Number(booking.totalPrice);
  const newPaid = Math.min(booking.paidInstallments + nbPaid, booking.installments);

  await prisma.exhibitorBooking.update({
    where: { id: bookingId },
    data: {
      paidInstallments: newPaid,
      status: isComplete ? "CONFIRMED" : "PARTIAL",
    },
  });

  // Record payment
  await prisma.exhibitorPayment.create({
    data: {
      bookingId,
      amount,
      type: "early_payment",
      label: isComplete
        ? "Solde intégral"
        : `Paiement anticipé (${nbPaid} mensualité${nbPaid > 1 ? "s" : ""})`,
      stripeId: session.id,
    },
  });

  // If fully paid, cancel the Stripe subscription (no more automatic charges)
  if (isComplete && booking.stripeSubscriptionId) {
    try {
      const stripe = getStripe();
      await stripe.subscriptions.cancel(booking.stripeSubscriptionId);
      console.log(`Exhibitor ${bookingId}: subscription ${booking.stripeSubscriptionId} cancelled (fully paid early)`);
    } catch (cancelErr) {
      console.error(`Failed to cancel subscription for ${bookingId}:`, cancelErr);
    }
  }

  // Generate invoice on completion
  if (isComplete) {
    await generateInvoiceOnCompletion(bookingId);
  }

  console.log(
    `Exhibitor early payment ${bookingId}: +${nbPaid} → ${newPaid}/${booking.installments} ${isComplete ? "→ CONFIRMED" : ""}`
  );
}

async function handleExhibitorInstallment(invoice: Stripe.Invoice) {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const subscription = (invoice as any).subscription as string | null;
  if (!subscription) return;

  // Find booking by subscription ID
  const booking = await prisma.exhibitorBooking.findFirst({
    where: { stripeSubscriptionId: subscription },
  });

  if (!booking) return;

  const newPaid = booking.paidInstallments + 1;
  const isComplete = newPaid >= booking.installments;
  const installmentIndex = newPaid - 1; // minus deposit
  const totalMonths = booking.installments - 1;

  await prisma.exhibitorBooking.update({
    where: { id: booking.id },
    data: {
      paidInstallments: newPaid,
      status: isComplete ? "CONFIRMED" : "PARTIAL",
    },
  });

  // Record payment
  await prisma.exhibitorPayment.create({
    data: {
      bookingId: booking.id,
      amount: booking.installmentAmount,
      type: "installment",
      label: `Mensualité ${installmentIndex}/${totalMonths}`,
      stripeId: invoice.id,
    },
  });

  // Generate invoice on completion
  if (isComplete) {
    await generateInvoiceOnCompletion(booking.id);
  }

  console.log(
    `Exhibitor installment ${booking.id}: ${newPaid}/${booking.installments} ${isComplete ? "→ CONFIRMED" : ""}`
  );
}

/**
 * Generate invoice number and send invoice email when booking is fully paid
 */
async function generateInvoiceOnCompletion(bookingId: string) {
  try {
    const invoiceNumber = await generateInvoiceNumber();
    await prisma.exhibitorBooking.update({
      where: { id: bookingId },
      data: { invoiceNumber },
    });

    // Pre-generate the PDF to validate it works (actual download via API)
    await generateInvoicePDF(bookingId);

    const booking = await prisma.exhibitorBooking.findUnique({
      where: { id: bookingId },
      select: { email: true, contactName: true, companyName: true, invoiceNumber: true },
    });

    if (booking) {
      console.log(
        `[INVOICE] ${booking.invoiceNumber} generated for ${booking.companyName} (${bookingId})`
      );
    }
  } catch (err) {
    console.error(`[INVOICE] Failed to generate for ${bookingId}:`, err);
  }
}

/* ── Ticket listing purchase (bourse publique) ─────────────── */
async function handleTicketListingPurchase(session: Stripe.Checkout.Session) {
  const metadata = session.metadata || {};
  const transferId = metadata.transferId;
  const buyerEmail = metadata.buyerEmail;
  if (!transferId || !buyerEmail) {
    console.error("[webhook] ticket_listing_purchase: missing metadata");
    return;
  }
  try {
    const { finalizeListing } = await import("@/lib/listing-finalize");
    const res = await finalizeListing({
      transferId,
      buyerEmail,
      buyerFirstName: metadata.buyerFirstName || null,
      buyerLastName: metadata.buyerLastName || null,
      buyerPhone: metadata.buyerPhone || null,
      stripeSessionId: session.id,
    });
    if (!res.ok) {
      console.error(`[webhook] ticket_listing_purchase finalize failed: ${res.reason}`);
    }
  } catch (err) {
    console.error(`[webhook] ticket_listing_purchase error for ${transferId}:`, err);
  }
}

/* ── Ticket transfer finalization (AT_COST mode) ─────────── */
async function handleTicketTransferFinalize(session: Stripe.Checkout.Session) {
  const transferId = session.metadata?.transferId;
  if (!transferId) {
    console.error("[webhook] ticket_transfer: missing transferId in metadata");
    return;
  }
  try {
    const { finalizeTransfer } = await import("@/lib/transfer-finalize");
    const res = await finalizeTransfer(transferId);
    if (!res.ok) {
      console.error(`[webhook] ticket_transfer finalize failed: ${res.reason}`);
    }
  } catch (err) {
    console.error(`[webhook] ticket_transfer finalize error for ${transferId}:`, err);
  }
}

/* ── Exposant Deposit (50 €) ────────────────────────────── */
async function handleExposantDeposit(session: Stripe.Checkout.Session) {
  const metadata = session.metadata!;
  const leadId = metadata.leadId;

  const lead = await prisma.exposantLead.findUnique({ where: { id: leadId } });
  if (!lead) {
    console.error(`[exposant-deposit] Lead ${leadId} not found`);
    return;
  }

  if (lead.status === "DEPOSIT_PAID") {
    console.log(`[exposant-deposit] Lead ${leadId} already processed`);
    return;
  }

  // Generate a random password
  const rawPassword = crypto.randomBytes(8).toString("hex"); // 16 chars, 64 bits
  const hashedPassword = await bcrypt.hash(rawPassword, 10);

  // Upsert user account
  const user = await prisma.user.upsert({
    where: { email: lead.email },
    create: {
      email: lead.email,
      name: `${lead.firstName} ${lead.lastName}`,
      phone: lead.phone,
      password: hashedPassword,
    },
    update: {
      // Don't overwrite existing password if user already has one
      name: `${lead.firstName} ${lead.lastName}`,
      phone: lead.phone,
    },
  });

  // Check if user already had a password (existing account)
  const existingUser = await prisma.user.findUnique({
    where: { email: lead.email },
    select: { password: true },
  });
  const isNewAccount = !existingUser?.password || existingUser.password === hashedPassword;

  // Update lead status
  await prisma.exposantLead.update({
    where: { id: leadId },
    data: {
      status: "DEPOSIT_PAID",
      depositPaidAt: new Date(),
    },
  });

  // Sync to L'Officiel d'Afrique directory (non-blocking)
  try {
    const existing = await prisma.directoryEntry.findFirst({
      where: { OR: [{ email: lead.email }, { companyName: lead.brand }] },
    });
    const entryData = {
      companyName: lead.brand,
      contactName: `${lead.firstName} ${lead.lastName}`.trim(),
      category: "Exposant",
      city: "Paris",
      country: "France",
      phone: lead.phone || null,
      email: lead.email || null,
      description: `${lead.brand} — ${lead.sector || "Exposant Foire d'Afrique Paris 2026"}`,
      event: "Foire d'Afrique Paris 2026",
      published: true,
    };
    if (existing) {
      await prisma.directoryEntry.update({ where: { id: existing.id }, data: entryData });
    } else {
      await prisma.directoryEntry.create({ data: entryData });
    }
  } catch (dirErr) {
    console.error(`[exposant-deposit] Directory sync failed:`, dirErr);
  }

  const appUrl = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";

  // Send WhatsApp with credentials
  try {
    const lines = [
      `Bonjour ${lead.firstName} !`,
      ``,
      `Votre acompte de 50 € pour "${lead.eventName}" a bien été reçu. Merci !`,
      ``,
      ...(isNewAccount
        ? [
            `Votre espace client a été créé :`,
            `Email : ${lead.email}`,
            `Mot de passe : ${rawPassword}`,
            `Connexion : ${appUrl}/login`,
            ``,
          ]
        : [
            `Connectez-vous avec votre compte existant : ${appUrl}/login`,
            ``,
          ]),
      `✨ Bonne nouvelle : votre marque est désormais référencée dans L'Officiel d'Afrique — notre annuaire professionnel de la diaspora africaine à Paris !`,
      `👉 ${appUrl}/lofficiel-dafrique/annuaire`,
      ``,
      `Nous vous enverrons votre devis personnalisé très rapidement.`,
      ``,
      `L'équipe Dream Team Africa`,
    ];

    await sendWhatsAppText(lead.phone, lines.join("\n"));
  } catch (err) {
    console.error(`[exposant-deposit] WhatsApp send failed for ${lead.phone}:`, err);
  }

  console.log(`[exposant-deposit] Lead ${leadId} processed — user ${user.id} — deposit paid`);
}

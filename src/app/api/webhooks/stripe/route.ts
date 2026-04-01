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

  if (event.type === "checkout.session.completed") {
    const session = event.data.object as Stripe.Checkout.Session;
    const metadata = session.metadata;

    if (metadata?.type === "ticket") {
      await handleTicketPurchase(session);
    } else if (metadata?.type === "ticket_installment") {
      await handleTicketInstallment(session);
    } else if (metadata?.type === "ticket_recharge") {
      await handleTicketRecharge(session);
    } else if (metadata?.type === "order") {
      await handleOrderPurchase(session);
    } else if (metadata?.type === "exhibitor") {
      await handleExhibitorBooking(session);
    } else if (metadata?.type === "exhibitor_early_payment") {
      await handleExhibitorEarlyPayment(session);
    } else if (metadata?.type === "exposant_deposit") {
      await handleExposantDeposit(session);
    }
  }

  if (event.type === "invoice.paid") {
    const invoice = event.data.object as Stripe.Invoice;
    await handleExhibitorInstallment(invoice);
  }

  return NextResponse.json({ received: true });
}

async function handleTicketPurchase(session: Stripe.Checkout.Session) {
  const { eventId, userId, tier, quantity, unitPrice, firstName, lastName, email, phone, visitDate } = session.metadata!;
  const qty = parseInt(quantity);
  const unitPriceNum = parseFloat(unitPrice);

  const event = await prisma.event.findUnique({
    where: { id: eventId },
    select: { title: true, date: true, venue: true, address: true, coverImage: true },
  });

  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: { name: true, email: true, phone: true },
  });

  // Resolve tier name for email
  const eventFull = await prisma.event.findUnique({ where: { id: eventId }, select: { tiers: true } });
  const customTiers = eventFull?.tiers as Array<{ id: string; name: string }> | null;
  const matchedTier = Array.isArray(customTiers) ? customTiers.find((t) => t.id === tier) : null;
  const legacyLabelMap: Record<string, string> = { EARLY_BIRD: "Early Bird", STANDARD: "Standard", VIP: "VIP" };
  const tierName = matchedTier?.name || legacyLabelMap[tier] || tier;

  const createdTickets: Array<{ id: string; qrCode: string }> = [];

  const ticketPromises = Array.from({ length: qty }, async () => {
    const ticketId = crypto.randomUUID();
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "https://dreamteamafrica.com";
    const qrUrl = `${baseUrl}/check/${ticketId}`;

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
        qrCode: qrCdnUrl,
        stripeSessionId: session.id,
        firstName: firstName || null,
        lastName: lastName || null,
        email: email || null,
        phone: phone || null,
        visitDate: visitDate ? new Date(visitDate) : null,
      },
    });

    createdTickets.push({ id: ticket.id, qrCode: qrCdnUrl });
    return ticket;
  });

  await Promise.all(ticketPromises);
  console.log(`Created ${qty} ticket(s) for event ${eventId}, user ${userId}`);

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

  // Send WhatsApp confirmation if user has a phone number
  try {
    const whatsappPhone = phone || user?.phone;
    const customerName = `${firstName || ""} ${lastName || ""}`.trim() || user?.name || "Client";
    if (whatsappPhone && event) {
      await sendTicketConfirmationWhatsApp({
        phone: whatsappPhone,
        customerName,
        eventTitle: event.title,
        tier,
        quantity: qty,
        totalPrice: unitPriceNum * qty,
        eventDate: new Intl.DateTimeFormat("fr-FR", { weekday: "long", day: "numeric", month: "long", year: "numeric" }).format(visitDate ? new Date(visitDate) : event.date),
        eventVenue: event.venue,
      });
    }
  } catch (waErr) {
    console.error("WhatsApp ticket confirmation failed:", waErr);
  }
}

async function handleTicketInstallment(session: Stripe.Checkout.Session) {
  const {
    eventId, userId, tier, quantity, unitPrice,
    firstName, lastName, email, phone, visitDate,
    installments, deposit, remainingBalance, installmentAmount,
  } = session.metadata!;

  const qty = parseInt(quantity);
  const unitPriceNum = parseFloat(unitPrice);
  const nbInstallments = parseInt(installments);

  const event = await prisma.event.findUnique({
    where: { id: eventId },
    select: { title: true, date: true, venue: true, address: true, coverImage: true, tiers: true },
  });

  // Resolve tier name
  const customTiers = event?.tiers as Array<{ id: string; name: string }> | null;
  const matchedTier = Array.isArray(customTiers) ? customTiers.find((t) => t.id === tier) : null;
  const legacyLabelMap: Record<string, string> = { EARLY_BIRD: "Early Bird", STANDARD: "Standard", VIP: "VIP" };
  const tierName = matchedTier?.name || legacyLabelMap[tier] || tier;

  // Create tickets (with deposit paid, rest pending via subscription)
  const createdTickets: Array<{ id: string; qrCode: string }> = [];

  const ticketPromises = Array.from({ length: qty }, async () => {
    const ticketId = crypto.randomUUID();
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "https://dreamteamafrica.com";
    const qrUrl = `${baseUrl}/check/${ticketId}`;
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
        qrCode: qrCdnUrl,
        stripeSessionId: session.id,
        firstName: firstName || null,
        lastName: lastName || null,
        email: email || null,
        phone: phone || null,
        visitDate: visitDate ? new Date(visitDate) : null,
      },
    });

    createdTickets.push({ id: ticket.id, qrCode: qrCdnUrl });
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
    const customerName = `${firstName || ""} ${lastName || ""}`.trim();
    if (whatsappPhone && event) {
      const depositNum = parseFloat(deposit);
      const monthlyNum = parseFloat(installmentAmount);
      const remainingMonths = nbInstallments - 1;
      await sendWhatsAppText(whatsappPhone,
        `Bonjour ${customerName},\n\nMerci pour votre reservation !\n\nVotre acompte de ${depositNum} EUR a ete recu. Vos ${qty} billet(s) pour ${event.title} sont confirmes.\n\nSolde restant : ${remainingMonths}x ${monthlyNum} EUR/mois (prelevement automatique).\n\nA tres bientot !\n\nL'equipe Dream Team Africa`
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

  await prisma.ticket.update({
    where: { id: ticketId },
    data: { totalPaid: { increment: safeAmount } },
  });

  console.log(`Ticket ${ticketId} recharged +${safeAmount}€ (user: ${userId})`);
}

async function handleOrderPurchase(session: Stripe.Checkout.Session) {
  const { userId, items: itemsJson, total } = session.metadata!;
  const items = JSON.parse(itemsJson) as Array<{
    productId: string;
    quantity: number;
    price: number;
  }>;

  const order = await prisma.order.create({
    data: {
      userId,
      status: "PAID",
      total: parseFloat(total),
      stripeSessionId: session.id,
      items: {
        create: items.map((item) => ({
          productId: item.productId,
          quantity: item.quantity,
          price: item.price,
        })),
      },
    },
  });

  // Decrement stock
  await Promise.all(
    items.map((item) =>
      prisma.product.update({
        where: { id: item.productId },
        data: { stock: { decrement: item.quantity } },
      })
    )
  );

  console.log(`Created order ${order.id} for user ${userId}, total: ${total}€`);
}

async function handleExhibitorBooking(session: Stripe.Checkout.Session) {
  const { bookingId, installments, remainingBalance, installmentAmount } = session.metadata!;
  if (!bookingId) return;

  const nbInstallments = parseInt(installments || "1");
  const isOneTime = nbInstallments === 1;

  // Get booking to calculate amounts
  const bookingData = await prisma.exhibitorBooking.findUnique({
    where: { id: bookingId },
    select: { totalPrice: true, stands: true },
  });
  const stands = bookingData?.stands ?? 1;
  const deposit = Math.min(DEPOSIT_AMOUNT * stands, bookingData?.totalPrice ?? 0);

  if (isOneTime) {
    // Full payment — confirm immediately
    await prisma.exhibitorBooking.update({
      where: { id: bookingId },
      data: {
        stripeSessionId: session.id,
        paidInstallments: 1,
        status: "CONFIRMED",
      },
    });

    // Record payment
    await prisma.exhibitorPayment.create({
      data: {
        bookingId,
        amount: bookingData?.totalPrice ?? 0,
        type: "full_payment",
        label: "Paiement intégral",
        stripeId: session.id,
      },
    });

    // Generate invoice
    await generateInvoiceOnCompletion(bookingId);
    console.log(`Exhibitor booking ${bookingId}: CONFIRMED (full payment)`);
  } else {
    // Deposit paid — create subscription for remaining balance
    await prisma.exhibitorBooking.update({
      where: { id: bookingId },
      data: {
        stripeSessionId: session.id,
        paidInstallments: 1,
        status: "PARTIAL",
      },
    });

    // Record deposit payment
    await prisma.exhibitorPayment.create({
      data: {
        bookingId,
        amount: deposit,
        type: "deposit",
        label: "Acompte de réservation",
        stripeId: session.id,
      },
    });

    console.log(`Exhibitor booking ${bookingId}: PARTIAL (deposit paid, 1/${nbInstallments})`);

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
  }
}

async function handleExhibitorEarlyPayment(session: Stripe.Checkout.Session) {
  const { bookingId, nbInstallments } = session.metadata!;
  if (!bookingId) return;

  const nbPaid = parseInt(nbInstallments || "1");

  const booking = await prisma.exhibitorBooking.findUnique({
    where: { id: bookingId },
  });
  if (!booking) return;

  const newPaid = booking.paidInstallments + nbPaid;
  const isComplete = newPaid >= booking.installments;

  // Calculate amount paid
  const stands = booking.stands ?? 1;
  const dep = Math.min(DEPOSIT_AMOUNT * stands, booking.totalPrice);
  const totalRemaining = booking.totalPrice - dep;
  const totalMonths = booking.installments - 1;
  const monthly = totalMonths > 0 ? Math.ceil((totalRemaining / totalMonths) * 100) / 100 : 0;
  const paidMonths = Math.max(0, booking.paidInstallments - 1);
  const remainingInst = totalMonths - paidMonths;
  const amount = nbPaid === remainingInst
    ? Math.max(0, totalRemaining - paidMonths * monthly)
    : nbPaid * monthly;

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
      label: nbPaid === remainingInst
        ? `Solde intégral (${nbPaid} mensualité${nbPaid > 1 ? "s" : ""})`
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
  const rawPassword = crypto.randomBytes(4).toString("hex"); // 8 chars
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

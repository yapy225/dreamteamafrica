import { NextResponse } from "next/server";
import { headers } from "next/headers";
import { getStripe, Stripe } from "@/lib/stripe";
import { prisma } from "@/lib/db";
import QRCode from "qrcode";

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
    } else if (metadata?.type === "order") {
      await handleOrderPurchase(session);
    } else if (metadata?.type === "ad_subscription") {
      await handleAdSubscription(session);
    }
  }

  return NextResponse.json({ received: true });
}

async function handleTicketPurchase(session: Stripe.Checkout.Session) {
  const { eventId, userId, tier, quantity, unitPrice } = session.metadata!;
  const qty = parseInt(quantity);
  const price = parseFloat(unitPrice);

  const ticketPromises = Array.from({ length: qty }, async (_, i) => {
    const ticketId = crypto.randomUUID();
    const qrData = JSON.stringify({
      ticketId,
      eventId,
      userId,
      tier,
      sessionId: session.id,
      seq: i + 1,
    });

    const qrCode = await QRCode.toDataURL(qrData, {
      width: 300,
      margin: 2,
      color: { dark: "#1A1A1A", light: "#FBF8F4" },
    });

    return prisma.ticket.create({
      data: {
        id: ticketId,
        eventId,
        userId,
        tier: tier as "EARLY_BIRD" | "STANDARD" | "VIP",
        price,
        qrCode,
        stripeSessionId: session.id,
      },
    });
  });

  await Promise.all(ticketPromises);
  console.log(`Created ${qty} ticket(s) for event ${eventId}, user ${userId}`);
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

async function handleAdSubscription(session: Stripe.Checkout.Session) {
  const { campaignId } = session.metadata!;

  if (!campaignId) {
    console.error("Ad subscription webhook: missing campaignId");
    return;
  }

  await prisma.adCampaign.update({
    where: { id: campaignId },
    data: {
      active: true,
      stripeSubId: session.subscription as string,
    },
  });

  console.log(`Activated ad campaign ${campaignId}, subscription: ${session.subscription}`);
}

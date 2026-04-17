import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { auth } from "@/lib/auth";
import { getStripe } from "@/lib/stripe";
import { sendListingSoldEmailToSeller } from "@/lib/email";

/**
 * Admin-only endpoint to retry a seller refund that failed during the initial
 * finalizeListing. Idempotent via the same Stripe idempotency key as the original
 * attempt — calling this multiple times never creates duplicate refunds.
 */
export async function POST(
  _request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Non autorisé." }, { status: 401 });
  }
  if (session.user.role !== "ADMIN") {
    return NextResponse.json({ error: "Accès admin requis." }, { status: 403 });
  }

  const { id: transferId } = await params;

  const listing = await prisma.ticketTransfer.findUnique({
    where: { id: transferId },
    include: {
      ticket: { select: { id: true, price: true, stripeSessionId: true } },
    },
  });

  if (!listing) {
    return NextResponse.json({ error: "Listing introuvable." }, { status: 404 });
  }
  if (listing.status !== "ACCEPTED") {
    return NextResponse.json(
      { error: `Le listing doit être ACCEPTED pour rattraper le refund (actuel: ${listing.status}).` },
      { status: 400 },
    );
  }
  if (listing.stripeRefundId) {
    return NextResponse.json(
      { error: "Ce listing a déjà un stripeRefundId — aucun rattrapage nécessaire.", stripeRefundId: listing.stripeRefundId },
      { status: 400 },
    );
  }
  if (!listing.ticket.stripeSessionId) {
    return NextResponse.json(
      { error: "Pas de session Stripe sur le ticket original — refund manuel requis (virement bancaire + dashboard Stripe)." },
      { status: 400 },
    );
  }

  const stripe = getStripe();
  const originalSession = await stripe.checkout.sessions.retrieve(listing.ticket.stripeSessionId);
  const paymentIntentId = (originalSession.payment_intent as string | null) ?? null;
  if (!paymentIntentId) {
    return NextResponse.json(
      { error: "Pas de PaymentIntent sur la session originale — refund manuel requis." },
      { status: 400 },
    );
  }

  const refundPrice = typeof listing.ticket.price === "number"
    ? listing.ticket.price
    : Number(listing.ticket.price);

  try {
    const refund = await stripe.refunds.create(
      {
        payment_intent: paymentIntentId,
        amount: Math.round(refundPrice * 100),
        metadata: { type: "ticket_listing_refund_seller_retry", ticketId: listing.ticket.id, transferId },
      },
      { idempotencyKey: `listing-refund-seller:${transferId}` },
    );

    await prisma.ticketTransfer.update({
      where: { id: transferId },
      data: { stripeRefundId: refund.id },
    });

    if (listing.fromEmail) {
      const eventInfo = await prisma.ticketTransfer.findUnique({
        where: { id: transferId },
        include: { ticket: { include: { event: { select: { title: true } } } } },
      });
      try {
        await sendListingSoldEmailToSeller({
          to: listing.fromEmail,
          fromFirstName: listing.fromFirstName || "",
          eventTitle: eventInfo?.ticket.event.title || "votre événement",
          refundAmount: refundPrice,
        });
      } catch (err) {
        console.error("[retry-refund] seller email failed:", err);
      }
    }

    return NextResponse.json({ ok: true, stripeRefundId: refund.id, amount: refundPrice });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Erreur Stripe inconnue";
    console.error(`[retry-refund] Stripe refund failed for ${transferId}:`, err);
    return NextResponse.json({ error: `Refund Stripe échoué : ${message}` }, { status: 500 });
  }
}

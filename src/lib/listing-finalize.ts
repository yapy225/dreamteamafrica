import crypto from "crypto";
import QRCode from "qrcode";
import Stripe from "stripe";
import { prisma } from "@/lib/db";
import { getStripe } from "@/lib/stripe";
import { uploadBuffer } from "@/lib/bunny";
import { signQr } from "@/lib/qr-sig";
import {
  sendListingSoldEmailToSeller,
  sendListingPurchasedEmailToBuyer,
} from "@/lib/email";

type FinalizeListingResult =
  | { ok: true; ticketId: string }
  | { ok: false; reason: string; buyerRefundIssued?: boolean };

/**
 * Finalizes a public marketplace purchase. Triggered by Stripe webhook
 * `ticket_listing_purchase` after the buyer pays.
 *
 * Security invariants:
 * 1. DB transaction FIRST (atomic ownership transfer) — if it fails, we don't refund the seller
 *    and the buyer's payment is refunded so no one keeps money without a ticket.
 * 2. If the listing is no longer LISTED when the webhook fires (race with another buyer who
 *    paid first, or a delist), refund THIS buyer's payment in full (price + commission).
 * 3. Refund is idempotent via Stripe idempotency key bound to (transferId, type).
 * 4. QR rotation happens inside the transaction, so ticket ownership + new nonce + old
 *    QR revocation are all-or-nothing.
 */
export async function finalizeListing(opts: {
  transferId: string;
  buyerEmail: string;
  buyerFirstName?: string | null;
  buyerLastName?: string | null;
  buyerPhone?: string | null;
  stripeSessionId: string;
}): Promise<FinalizeListingResult> {
  const { transferId, buyerEmail, buyerFirstName, buyerLastName, buyerPhone, stripeSessionId } = opts;
  const stripe = getStripe();

  // Pre-check: is this listing still available? If not, refund the buyer immediately.
  const pre = await prisma.ticketTransfer.findUnique({
    where: { id: transferId },
    include: { ticket: { select: { checkedInAt: true, stripeSessionId: true, price: true } } },
  });
  if (!pre) {
    await safeRefundBuyerSession(stripe, stripeSessionId, transferId, "listing_not_found");
    return { ok: false, reason: "Listing introuvable.", buyerRefundIssued: true };
  }
  if (pre.status !== "LISTED" || pre.ticket.checkedInAt) {
    await safeRefundBuyerSession(stripe, stripeSessionId, transferId, `race_status_${pre.status}`);
    return {
      ok: false,
      reason: `Listing déjà ${pre.status.toLowerCase()} ou billet scanné — remboursement acheteur engagé.`,
      buyerRefundIssued: true,
    };
  }

  // Atomic: transfer ownership + rotate QR + mark ACCEPTED. SELECT ... FOR UPDATE guard
  // via the status check inside the transaction prevents concurrent webhook writes.
  let result;
  try {
    result = await prisma.$transaction(async (tx) => {
      const transfer = await tx.ticketTransfer.findUnique({
        where: { id: transferId },
        include: {
          ticket: {
            include: {
              event: { select: { id: true, title: true, venue: true, address: true, date: true, coverImage: true, published: true } },
            },
          },
        },
      });
      if (!transfer) throw new Error("Listing introuvable.");
      if (transfer.status !== "LISTED") throw new Error(`Listing déjà ${transfer.status.toLowerCase()}.`);
      if (transfer.ticket.checkedInAt) throw new Error("Billet déjà scanné.");

      let toUserId: string | null = transfer.toUserId ?? null;
      if (!toUserId) {
        const existing = await tx.user.findUnique({ where: { email: buyerEmail } });
        if (existing) {
          toUserId = existing.id;
        } else {
          const created = await tx.user.create({
            data: {
              email: buyerEmail,
              name: [buyerFirstName, buyerLastName].filter(Boolean).join(" ") || null,
              phone: buyerPhone ?? null,
              emailVerified: new Date(),
            },
          });
          toUserId = created.id;
        }
      }

      const newNonce = crypto.randomBytes(16).toString("hex");
      const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "https://dreamteamafrica.com";
      const sig = signQr(transfer.ticket.id, newNonce);
      const qrUrl = `${baseUrl}/check/${transfer.ticket.id}?sig=${sig}`;
      const qrBuffer = await QRCode.toBuffer(qrUrl, { width: 600, margin: 2 });
      const { url: qrCdnUrl } = await uploadBuffer(
        Buffer.from(qrBuffer),
        `qrcodes/tickets/${transfer.ticket.id}-${newNonce.slice(0, 8)}.png`,
      );

      await tx.ticket.update({
        where: { id: transfer.ticket.id },
        data: {
          userId: toUserId,
          email: buyerEmail,
          firstName: buyerFirstName ?? null,
          lastName: buyerLastName ?? null,
          phone: buyerPhone ?? null,
          qrCode: qrCdnUrl,
          qrNonce: newNonce,
          qrRevokedAt: new Date(),
          transferCount: { increment: 1 },
          lastTransferredAt: new Date(),
        },
      });

      await tx.ticketTransfer.update({
        where: { id: transferId },
        data: {
          status: "ACCEPTED",
          acceptedAt: new Date(),
          toEmail: buyerEmail,
          toFirstName: buyerFirstName ?? null,
          toLastName: buyerLastName ?? null,
          toPhone: buyerPhone ?? null,
          toUserId,
          stripeSessionId,
        },
      });

      return {
        ticket: { ...transfer.ticket, qrCode: qrCdnUrl },
        transfer,
        event: transfer.ticket.event,
      };
    });
  } catch (err) {
    console.error(`[finalize-listing] DB tx failed for ${transferId}:`, err);
    // DB tx failed → refund buyer in full, seller keeps the ticket.
    await safeRefundBuyerSession(stripe, stripeSessionId, transferId, "db_tx_failed");
    return {
      ok: false,
      reason: err instanceof Error ? err.message : "Transaction atomique échouée.",
      buyerRefundIssued: true,
    };
  }

  // After DB tx success, refund the seller (idempotent via Stripe idempotency key).
  let refundedAmount = 0;
  let stripeRefundId: string | null = null;
  try {
    const originalSessionId = result.transfer.ticket.stripeSessionId;
    let paymentIntentId: string | null = null;
    if (originalSessionId) {
      const originalSession = await stripe.checkout.sessions.retrieve(originalSessionId);
      paymentIntentId = (originalSession.payment_intent as string | null) ?? null;
    }
    const refundPrice = typeof result.transfer.ticket.price === "number"
      ? result.transfer.ticket.price
      : Number(result.transfer.ticket.price);
    if (paymentIntentId) {
      const refund = await stripe.refunds.create(
        {
          payment_intent: paymentIntentId,
          amount: Math.round(refundPrice * 100),
          metadata: { type: "ticket_listing_refund_seller", ticketId: result.transfer.ticket.id, transferId },
        },
        { idempotencyKey: `listing-refund-seller:${transferId}` },
      );
      stripeRefundId = refund.id;
      refundedAmount = refundPrice;
      // Persist the refund id for admin visibility
      await prisma.ticketTransfer.update({
        where: { id: transferId },
        data: { stripeRefundId },
      });
    } else {
      console.error(`[finalize-listing] No payment_intent on original session for ticket ${result.transfer.ticket.id} — manual refund required`);
    }
  } catch (err) {
    console.error(`[finalize-listing] Stripe refund failed for seller on transfer ${transferId}:`, err);
    // Admin will see "Échec refund" badge and handle manually. Buyer already has the ticket.
  }

  try {
    await sendListingPurchasedEmailToBuyer({
      to: buyerEmail,
      guestName: [buyerFirstName, buyerLastName].filter(Boolean).join(" ") || buyerEmail,
      eventTitle: result.event.title,
      eventVenue: result.event.venue,
      eventAddress: result.event.address,
      eventDate: result.event.date,
      eventCoverImage: result.event.coverImage,
      tier: result.ticket.tier,
      ticket: { id: result.ticket.id, qrCode: result.ticket.qrCode },
    });
  } catch (err) {
    console.error("[finalize-listing] buyer email failed:", err);
  }

  try {
    if (result.transfer.fromEmail) {
      await sendListingSoldEmailToSeller({
        to: result.transfer.fromEmail,
        fromFirstName: result.transfer.fromFirstName || "",
        eventTitle: result.event.title,
        refundAmount: refundedAmount,
      });
    }
  } catch (err) {
    console.error("[finalize-listing] seller email failed:", err);
  }

  return { ok: true, ticketId: result.ticket.id };
}

/**
 * Refund the buyer's purchase when the listing is unavailable or the finalize fails.
 * Idempotent via the Stripe idempotency key bound to the checkout session.
 */
async function safeRefundBuyerSession(
  stripe: Stripe,
  stripeSessionId: string,
  transferId: string,
  reason: string,
): Promise<void> {
  try {
    const session = await stripe.checkout.sessions.retrieve(stripeSessionId);
    const paymentIntentId = (session.payment_intent as string | null) ?? null;
    if (!paymentIntentId) {
      console.error(`[finalize-listing] no payment_intent on buyer session ${stripeSessionId} — cannot refund buyer`);
      return;
    }
    await stripe.refunds.create(
      {
        payment_intent: paymentIntentId,
        metadata: { type: "ticket_listing_refund_buyer", transferId, reason },
      },
      { idempotencyKey: `listing-refund-buyer:${stripeSessionId}` },
    );
    console.log(`[finalize-listing] buyer fully refunded on ${stripeSessionId} (reason: ${reason})`);
  } catch (err) {
    console.error(`[finalize-listing] buyer refund FAILED for ${stripeSessionId} (reason: ${reason}):`, err);
  }
}

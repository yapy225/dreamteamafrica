import crypto from "crypto";
import QRCode from "qrcode";
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
  | { ok: false; reason: string };

/**
 * Finalizes a public marketplace purchase. Triggered by Stripe webhook
 * `ticket_listing_purchase` after the buyer pays. Refunds the seller,
 * rotates the QR, transfers ownership, and sends both emails.
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

  const pre = await prisma.ticketTransfer.findUnique({
    where: { id: transferId },
    include: {
      ticket: {
        include: {
          payments: { where: { stripeId: { not: null } }, orderBy: { paidAt: "asc" } },
        },
      },
    },
  });
  if (!pre) return { ok: false, reason: "Listing introuvable." };
  if (pre.status !== "LISTED") return { ok: false, reason: `Listing déjà ${pre.status.toLowerCase()}.` };
  if (pre.ticket.checkedInAt) return { ok: false, reason: "Billet déjà scanné." };

  let refundedAmount = 0;
  let stripeRefundId: string | null = null;
  try {
    const stripe = getStripe();
    const originalSessionId = pre.ticket.stripeSessionId;
    let paymentIntentId: string | null = null;
    if (originalSessionId) {
      const originalSession = await stripe.checkout.sessions.retrieve(originalSessionId);
      paymentIntentId = (originalSession.payment_intent as string | null) ?? null;
    }
    const refundPrice = typeof pre.ticket.price === "number" ? pre.ticket.price : Number(pre.ticket.price);
    if (paymentIntentId) {
      const refund = await stripe.refunds.create({
        payment_intent: paymentIntentId,
        amount: Math.round(refundPrice * 100),
        metadata: { type: "ticket_listing_refund", ticketId: pre.ticket.id, transferId },
      });
      stripeRefundId = refund.id;
      refundedAmount = refundPrice;
    } else {
      console.error(`[finalize-listing] No payment_intent on original session for ticket ${pre.ticket.id} — skipping refund`);
    }
  } catch (err) {
    console.error(`[finalize-listing] Stripe refund failed for transfer ${transferId}:`, err);
  }

  const result = await prisma.$transaction(async (tx) => {
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
        stripeRefundId,
      },
    });

    return {
      ticket: { ...transfer.ticket, qrCode: qrCdnUrl },
      transfer,
      event: transfer.ticket.event,
    };
  });

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

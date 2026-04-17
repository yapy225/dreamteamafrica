import crypto from "crypto";
import QRCode from "qrcode";
import { prisma } from "@/lib/db";
import { uploadBuffer } from "@/lib/bunny";
import { signQr } from "@/lib/qr-sig";
import {
  sendTransferAcceptedEmailToCedant,
  sendTransferredTicketEmail,
} from "@/lib/email";

type FinalizeResult =
  | { ok: true; ticketId: string }
  | { ok: false; reason: string };

/**
 * Finalizes a ticket transfer atomically. Called either directly (FREE_GIFT)
 * or from the Stripe webhook (AT_COST). Invalidates the previous QR by rotating
 * the ticket's qrNonce and regenerating the QR image bound to the new nonce.
 */
export async function finalizeTransfer(transferId: string): Promise<FinalizeResult> {
  const refundAmount = 0;

  const result = await prisma.$transaction(async (tx) => {
    const transfer = await tx.ticketTransfer.findUnique({
      where: { id: transferId },
      include: {
        ticket: {
          include: {
            event: { select: { id: true, title: true, venue: true, address: true, date: true, coverImage: true, published: true } },
            payments: true,
          },
        },
      },
    });

    if (!transfer) throw new Error("Transfert introuvable.");
    if (transfer.status !== "PENDING") throw new Error(`Transfert déjà ${transfer.status.toLowerCase()}.`);
    if (transfer.expiresAt < new Date()) throw new Error("Invitation expirée.");
    if (transfer.ticket.checkedInAt) throw new Error("Le billet a déjà été scanné à l'entrée.");

    let toUserId: string | null = transfer.toUserId ?? null;
    if (!toUserId) {
      const existingUser = await tx.user.findUnique({ where: { email: transfer.toEmail } });
      if (existingUser) {
        toUserId = existingUser.id;
      } else {
        const created = await tx.user.create({
          data: {
            email: transfer.toEmail,
            name: [transfer.toFirstName, transfer.toLastName].filter(Boolean).join(" ") || null,
            phone: transfer.toPhone ?? null,
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
        email: transfer.toEmail,
        firstName: transfer.toFirstName ?? null,
        lastName: transfer.toLastName ?? null,
        phone: transfer.toPhone ?? null,
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
        toUserId,
      },
    });

    return {
      ticket: { ...transfer.ticket, qrCode: qrCdnUrl },
      transfer: { ...transfer, toUserId },
      event: transfer.ticket.event,
    };
  });

  try {
    await sendTransferredTicketEmail({
      to: result.transfer.toEmail,
      guestName: [result.transfer.toFirstName, result.transfer.toLastName].filter(Boolean).join(" ") || result.transfer.toEmail,
      fromFirstName: result.transfer.fromFirstName || "un membre Dream Team Africa",
      eventTitle: result.event.title,
      eventVenue: result.event.venue,
      eventAddress: result.event.address,
      eventDate: result.event.date,
      eventCoverImage: result.event.coverImage,
      tier: result.ticket.tier,
      ticket: { id: result.ticket.id, qrCode: result.ticket.qrCode },
    });
  } catch (err) {
    console.error("[transfer-finalize] sendTransferredTicketEmail failed:", err);
  }

  try {
    await sendTransferAcceptedEmailToCedant({
      to: result.transfer.fromEmail,
      fromFirstName: result.transfer.fromFirstName || "",
      toEmail: result.transfer.toEmail,
      eventTitle: result.event.title,
      refundAmount: refundAmount > 0 ? refundAmount : undefined,
    });
  } catch (err) {
    console.error("[transfer-finalize] sendTransferAcceptedEmailToCedant failed:", err);
  }

  return { ok: true, ticketId: result.ticket.id };
}

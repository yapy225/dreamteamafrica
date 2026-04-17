import { verifyCronAuth } from "@/lib/cron-auth";
import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { sendTransferExpiredEmailToCedant } from "@/lib/email";

export const maxDuration = 60;

/**
 * CRON: expire pending ticket transfers past expiresAt.
 * Does NOT touch LISTED entries (those expire on event date and don't need email).
 */
export async function GET(request: Request) {
  const authError = verifyCronAuth(request);
  if (authError) return authError;

  const now = new Date();
  const toExpire = await prisma.ticketTransfer.findMany({
    where: { status: "PENDING", expiresAt: { lt: now } },
    include: { ticket: { include: { event: { select: { title: true } } } } },
  });

  let expired = 0;
  let emailErrors = 0;

  for (const transfer of toExpire) {
    try {
      await prisma.ticketTransfer.update({
        where: { id: transfer.id },
        data: { status: "EXPIRED" },
      });
      expired++;

      if (transfer.fromEmail) {
        try {
          await sendTransferExpiredEmailToCedant({
            to: transfer.fromEmail,
            fromFirstName: transfer.fromFirstName || "",
            toEmail: transfer.toEmail || "",
            eventTitle: transfer.ticket.event.title,
          });
        } catch (err) {
          emailErrors++;
          console.error(`[cron/expire-transfers] email failed for ${transfer.id}:`, err);
        }
      }
    } catch (err) {
      console.error(`[cron/expire-transfers] update failed for ${transfer.id}:`, err);
    }
  }

  return NextResponse.json({ ok: true, expired, emailErrors });
}

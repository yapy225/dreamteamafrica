/**
 * Expire pending ticket transfers past their expiresAt.
 * Run via cron: `tsx scripts/expire-pending-transfers.ts`
 */
import { prisma } from "@/lib/db";
import { sendTransferExpiredEmailToCedant } from "@/lib/email";

async function main() {
  const now = new Date();
  const toExpire = await prisma.ticketTransfer.findMany({
    where: { status: "PENDING", expiresAt: { lt: now } },
    include: { ticket: { include: { event: { select: { title: true } } } } },
  });

  if (toExpire.length === 0) {
    console.log("[expire-transfers] Nothing to expire.");
    return;
  }

  console.log(`[expire-transfers] Expiring ${toExpire.length} transfer(s)…`);

  for (const transfer of toExpire) {
    try {
      await prisma.ticketTransfer.update({
        where: { id: transfer.id },
        data: { status: "EXPIRED" },
      });
      if (transfer.fromEmail) {
        await sendTransferExpiredEmailToCedant({
          to: transfer.fromEmail,
          fromFirstName: transfer.fromFirstName || "",
          toEmail: transfer.toEmail,
          eventTitle: transfer.ticket.event.title,
        }).catch((err) => console.error(`[expire-transfers] email failed for ${transfer.id}:`, err));
      }
      console.log(`[expire-transfers] ${transfer.id} → EXPIRED`);
    } catch (err) {
      console.error(`[expire-transfers] failed for ${transfer.id}:`, err);
    }
  }
}

main()
  .catch((err) => {
    console.error(err);
    process.exit(1);
  })
  .finally(() => process.exit(0));

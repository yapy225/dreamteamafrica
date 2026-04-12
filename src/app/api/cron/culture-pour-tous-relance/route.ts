import { verifyCronAuth } from "@/lib/cron-auth";
import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { sendCptRelanceEmail } from "@/lib/email";
import { buildMagicLink } from "@/lib/cpt-token";
import { CPT_CONFIG } from "@/lib/culture-pour-tous";

export const maxDuration = 120;

/**
 * CRON: CPT Relance — runs daily.
 * Envoie email aux porteurs de billets CPT non soldés à J-7, J-3, J-1.
 */
export async function GET(request: Request) {
  const authError = verifyCronAuth(request);
  if (authError) return authError;

  const now = new Date();
  const results: Array<{ daysLeft: number; sent: number; errors: number }> = [];

  for (const daysLeft of CPT_CONFIG.reminders) {
    const targetStart = new Date(now);
    targetStart.setDate(targetStart.getDate() + daysLeft);
    targetStart.setHours(0, 0, 0, 0);
    const targetEnd = new Date(targetStart);
    targetEnd.setHours(23, 59, 59, 999);

    // Find CPT tickets (identified by TicketPayment of type 'cpt_deposit')
    // for events happening on target day, not fully paid
    const tickets = await prisma.ticket.findMany({
      where: {
        event: { date: { gte: targetStart, lte: targetEnd }, published: true },
        payments: { some: { type: "cpt_deposit" } },
        email: { not: null },
      },
      include: {
        event: { select: { title: true, date: true } },
      },
    });

    let sent = 0, errors = 0;
    for (const t of tickets) {
      const price = Number(t.price);
      const paid = Number(t.totalPaid);
      const remaining = price - paid;
      if (remaining <= 0) continue;

      try {
        await sendCptRelanceEmail({
          to: t.email!,
          firstName: t.firstName || "",
          eventTitle: t.event.title,
          eventDate: t.event.date,
          remaining,
          daysLeft,
          magicLink: buildMagicLink(t.id),
          ticketId: t.id,
        });
        sent++;
      } catch (err) {
        console.error(`[cpt-relance] Failed for ${t.id}:`, err);
        errors++;
      }
    }

    results.push({ daysLeft, sent, errors });
    console.log(`[cpt-relance] J-${daysLeft}: ${sent} sent, ${errors} errors`);
  }

  return NextResponse.json({ ok: true, results });
}

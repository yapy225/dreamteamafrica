import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { sendEventReminderWhatsApp } from "@/lib/whatsapp";

/**
 * CRON: Event Reminders — runs daily at 10 AM
 * Sends WhatsApp reminders to ticket holders for events happening tomorrow.
 */

export const maxDuration = 60;

export async function GET(request: Request) {
  // Verify cron secret
  const authHeader = request.headers.get("authorization");
  if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const now = new Date();
  const tomorrowStart = new Date(now);
  tomorrowStart.setDate(tomorrowStart.getDate() + 1);
  tomorrowStart.setHours(0, 0, 0, 0);

  const tomorrowEnd = new Date(tomorrowStart);
  tomorrowEnd.setHours(23, 59, 59, 999);

  // Find events happening tomorrow
  const events = await prisma.event.findMany({
    where: {
      date: { gte: tomorrowStart, lte: tomorrowEnd },
      published: true,
    },
    select: {
      id: true,
      title: true,
      date: true,
      venue: true,
      address: true,
      tickets: {
        select: {
          user: {
            select: { name: true, phone: true },
          },
        },
      },
    },
  });

  let sent = 0;
  let failed = 0;

  for (const event of events) {
    const eventDate = new Intl.DateTimeFormat("fr-FR", {
      weekday: "long",
      day: "numeric",
      month: "long",
      year: "numeric",
    }).format(event.date);

    // Deduplicate by phone number
    const seen = new Set<string>();

    for (const ticket of event.tickets) {
      const phone = ticket.user.phone;
      if (!phone || seen.has(phone)) continue;
      seen.add(phone);

      try {
        await sendEventReminderWhatsApp({
          phone,
          customerName: ticket.user.name ?? "Client",
          eventTitle: event.title,
          eventDate,
          eventVenue: event.venue,
          eventAddress: event.address,
        });
        sent++;
      } catch (err) {
        console.error(`Reminder failed for ${phone}:`, err);
        failed++;
      }
    }
  }

  console.log(`Event reminders: ${sent} sent, ${failed} failed, ${events.length} events tomorrow`);

  return NextResponse.json({
    ok: true,
    events: events.length,
    sent,
    failed,
  });
}

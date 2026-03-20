import { prisma } from "../src/lib/db";
import { sendTicketConfirmationEmail } from "../src/lib/email";

async function main() {
  const sinceDate = new Date("2026-03-16T00:00:00.000Z");

  const tickets = await prisma.ticket.findMany({
    where: {
      purchasedAt: { gte: sinceDate },
      email: { not: null },
    },
    include: { event: true },
    orderBy: { purchasedAt: "asc" },
  });

  // Group by email + visitDate (one email per purchase group)
  const groups = new Map<string, typeof tickets>();
  for (const t of tickets) {
    const key = t.stripeSessionId || `${t.email}_${t.visitDate?.toISOString()}`;
    if (!groups.has(key)) groups.set(key, []);
    groups.get(key)!.push(t);
  }

  console.log(
    `Found ${tickets.length} tickets in ${groups.size} purchases since ${sinceDate.toISOString()}\n`,
  );

  let sent = 0;
  let failed = 0;

  for (const [, groupTickets] of groups) {
    const first = groupTickets[0];
    const event = first.event;
    const email = first.email!;
    const name = `${first.firstName || ""} ${first.lastName || ""}`.trim();

    const customTiers = event.tiers as
      | Array<{ id: string; name: string }>
      | null;
    const matchedTier = Array.isArray(customTiers)
      ? customTiers.find((t) => t.id === first.tier)
      : null;
    const legacyMap: Record<string, string> = {
      EARLY_BIRD: "Early Bird",
      STANDARD: "Standard",
      VIP: "VIP",
    };
    const tierName = matchedTier?.name || legacyMap[first.tier] || first.tier;

    try {
      await sendTicketConfirmationEmail({
        to: email,
        guestName: name || email,
        eventTitle: event.title,
        eventVenue: event.venue,
        eventAddress: event.address,
        eventDate: first.visitDate || event.date,
        eventCoverImage: event.coverImage,
        tier: tierName,
        price: first.price,
        quantity: groupTickets.length,
        tickets: groupTickets.map((t) => ({ id: t.id, qrCode: t.qrCode })),
      });

      sent++;
      console.log(
        `✓ ${email} — ${groupTickets.length} billet(s) — ${name}`,
      );

      await new Promise((r) => setTimeout(r, 500));
    } catch (err) {
      failed++;
      const msg = err instanceof Error ? err.message : String(err);
      console.error(`✗ ${email} — ERREUR: ${msg}`);
    }
  }

  console.log(`\nTerminé: ${sent} envoyés, ${failed} échoués`);
  await prisma.$disconnect();
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});

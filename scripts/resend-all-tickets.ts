import { prisma } from "../src/lib/db";
import { sendTicketConfirmationEmail } from "../src/lib/email";

async function main() {
  // Get all paid tickets (with stripeSessionId = paid via Stripe)
  const tickets = await prisma.ticket.findMany({
    where: {
      stripeSessionId: { not: null },
      email: { not: null },
    },
    include: { event: true },
    orderBy: { purchasedAt: "asc" },
  });

  // Group by stripeSessionId (= one purchase)
  const groups = new Map<
    string,
    typeof tickets
  >();
  for (const t of tickets) {
    const key = t.stripeSessionId!;
    if (!groups.has(key)) groups.set(key, []);
    groups.get(key)!.push(t);
  }

  console.log(`Found ${groups.size} purchases to resend\n`);

  let sent = 0;
  let failed = 0;

  for (const [sessionId, groupTickets] of groups) {
    const first = groupTickets[0];
    const event = first.event;
    const email = first.email!;
    const name = `${first.firstName || ""} ${first.lastName || ""}`.trim();

    // Resolve tier name
    const customTiers = event.tiers as Array<{ id: string; name: string }> | null;
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
        `✓ ${email} — ${groupTickets.length} billet(s) — ${event.title}`,
      );

      // Small delay to avoid rate limiting
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

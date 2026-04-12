/**
 * One-shot migration: reconcile Roger MASSELA TALA MAKU's ticket.
 *
 * Context: Roger paid 5,50€ (5€ deposit + 0,50€ fees) via ticket_installment
 * but his ticket was created with totalPaid=0 and no TicketPayment (bug).
 * Stripe also started a monthly subscription for the 5€ balance.
 *
 * This script:
 *   1. Finds his Stripe customer + any active subscriptions → cancels them
 *   2. Updates his ticket: totalPaid = 5, creates TicketPayment type=cpt_deposit
 *   3. Sends him a fresh CPT welcome email with magic link
 *
 * Run: npx tsx scripts/migrate-roger-to-cpt.ts
 */
import { prisma } from "../src/lib/db";
import { getStripe } from "../src/lib/stripe";
import { buildMagicLink } from "../src/lib/cpt-token";
import { sendCptWelcomeEmail } from "../src/lib/email";

const ROGER_EMAIL = "viba.ntima226@gmail.com";
const TICKET_ID = "7a69c72c-681e-4473-a392-317e8ff2b833";
const DEPOSIT_PAID = 5;
const STRIPE_SESSION_ID = "cs_live_b1991nGWoWwEfgSHnAgMv3wOjLpb8QCAhyo0xwCJNfNXD8UPUKscYRK0Yx";

async function main() {
  const stripe = getStripe();

  console.log("🔍 Looking up Stripe customer for", ROGER_EMAIL);
  const customers = await stripe.customers.list({ email: ROGER_EMAIL, limit: 5 });
  console.log(`   Found ${customers.data.length} customer(s)`);

  let cancelledCount = 0;
  for (const c of customers.data) {
    const subs = await stripe.subscriptions.list({ customer: c.id, status: "all", limit: 10 });
    for (const s of subs.data) {
      if (["active", "trialing", "past_due", "unpaid"].includes(s.status)) {
        console.log(`   Cancelling subscription ${s.id} (status=${s.status})`);
        await stripe.subscriptions.cancel(s.id);
        cancelledCount++;
      } else {
        console.log(`   Skipping subscription ${s.id} (status=${s.status})`);
      }
    }
  }
  console.log(`✅ Cancelled ${cancelledCount} active subscription(s)`);

  console.log("🎫 Updating ticket", TICKET_ID);
  const ticket = await prisma.ticket.findUnique({ where: { id: TICKET_ID } });
  if (!ticket) {
    console.error("❌ Ticket not found");
    process.exit(1);
  }

  if (Number(ticket.totalPaid) >= DEPOSIT_PAID) {
    console.log("⚠️ Ticket already has totalPaid >= 5€, skipping payment create");
  } else {
    await prisma.$transaction([
      prisma.ticketPayment.upsert({
        where: { id: `migrate-roger-${TICKET_ID}` },
        update: {},
        create: {
          id: `migrate-roger-${TICKET_ID}`,
          ticketId: TICKET_ID,
          amount: DEPOSIT_PAID,
          type: "cpt_deposit",
          label: "Acompte Culture pour Tous (migration)",
          stripeId: STRIPE_SESSION_ID,
        },
      }),
      prisma.ticket.update({
        where: { id: TICKET_ID },
        data: { totalPaid: DEPOSIT_PAID },
      }),
    ]);
    console.log("✅ Ticket updated: totalPaid=5€, TicketPayment created");
  }

  console.log("📧 Sending CPT welcome email");
  const event = await prisma.event.findUnique({
    where: { id: ticket.eventId },
    select: { title: true, date: true, venue: true },
  });
  if (!event) {
    console.error("❌ Event not found");
    process.exit(1);
  }

  await sendCptWelcomeEmail({
    to: ROGER_EMAIL,
    firstName: ticket.firstName || "Roger",
    eventTitle: event.title,
    eventDate: event.date,
    eventVenue: event.venue,
    targetPrice: Number(ticket.price),
    deposit: DEPOSIT_PAID,
    tickets: [{ id: TICKET_ID, magicLink: buildMagicLink(TICKET_ID) }],
  });
  console.log("✅ Email sent");
  console.log(`🔗 Magic link: ${buildMagicLink(TICKET_ID)}`);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});

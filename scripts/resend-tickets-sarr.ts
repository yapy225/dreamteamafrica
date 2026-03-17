import { prisma } from "../src/lib/db";
import { sendTicketConfirmationEmail } from "../src/lib/email";

async function main() {
  const tickets = await prisma.ticket.findMany({
    where: { email: "sarrdorothee@gmail.com" },
    include: { event: true },
    orderBy: { purchasedAt: "asc" },
  });

  if (tickets.length === 0) {
    console.log("Aucun billet trouvé");
    return;
  }

  console.log(`Trouvé ${tickets.length} billets pour ${tickets[0].email}`);

  const event = tickets[0].event;
  const tierName = tickets[0].tier === "EARLY_BIRD" ? "Early Bird" : tickets[0].tier;

  await sendTicketConfirmationEmail({
    to: "sarrdorothee@gmail.com",
    guestName: `${tickets[0].firstName || ""} ${tickets[0].lastName || ""}`.trim(),
    eventTitle: event.title,
    eventVenue: event.venue,
    eventAddress: event.address,
    eventDate: tickets[0].visitDate || event.date,
    eventCoverImage: event.coverImage,
    tier: tierName,
    price: tickets[0].price,
    quantity: tickets.length,
    tickets: tickets.map((t) => ({ id: t.id, qrCode: t.qrCode })),
  });

  console.log("Email envoyé avec succès à sarrdorothee@gmail.com !");
  await prisma.$disconnect();
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});

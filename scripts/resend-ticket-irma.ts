import "dotenv/config";
import { PrismaClient } from "@prisma/client";
import { sendTicketConfirmationEmail } from "../src/lib/email";
import { sendWhatsAppText } from "../src/lib/whatsapp";

const prisma = new PrismaClient();

async function main() {
  // Find Irma's tickets
  const tickets = await prisma.ticket.findMany({
    where: {
      OR: [
        { phone: { contains: "664485063" } },
        { lastName: { contains: "Barbutsa", mode: "insensitive" } },
        { firstName: { contains: "Irma", mode: "insensitive" } },
      ],
    },
    include: { event: true },
    orderBy: { purchasedAt: "desc" },
  });

  if (tickets.length === 0) {
    console.log("Aucun billet trouvé pour Irma Barbutsa.");
    return;
  }

  console.log(`Trouvé ${tickets.length} billet(s) pour Irma:`);
  for (const t of tickets) {
    console.log(`  - ID: ${t.id} | ${t.firstName} ${t.lastName} | ${t.email} | tier: ${t.tier} | qrCode: ${t.qrCode}`);
  }

  // Resend email
  const first = tickets[0];
  const event = first.event;
  const name = `${first.firstName || ""} ${first.lastName || ""}`.trim();

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

  await sendTicketConfirmationEmail({
    to: first.email!,
    guestName: name,
    eventTitle: event.title,
    eventVenue: event.venue,
    eventAddress: event.address,
    eventDate: first.visitDate || event.date,
    eventCoverImage: event.coverImage,
    tier: tierName,
    price: first.price,
    quantity: tickets.length,
    tickets: tickets.map((t) => ({
      id: t.id,
      qrCode: t.qrCode,
    })),
  });

  console.log(`\n✓ Email renvoyé à ${first.email}`);

  // Send WhatsApp notification
  const whatsappMessage = `Bonjour Irma,

Suite a votre demande, nous venons de vous renvoyer vos billets par email a l'adresse ${first.email}.

Si vous ne les trouvez pas, pensez a verifier vos spams.

N'hesitez pas si vous avez besoin d'aide !

L'equipe Dream Team Africa`;

  await sendWhatsAppText("+33664485063", whatsappMessage);
  console.log("✓ WhatsApp envoyé à +33664485063");
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());

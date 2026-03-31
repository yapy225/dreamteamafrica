import "dotenv/config";
import { PrismaClient } from "@prisma/client";
import { sendWhatsAppText } from "../src/lib/whatsapp";

const prisma = new PrismaClient();

async function main() {
  // 1. Find Sabrina's ticket(s)
  const tickets = await prisma.ticket.findMany({
    where: {
      phone: { contains: "620184579" },
    },
    include: { event: true },
  });

  if (tickets.length === 0) {
    console.log("Aucun billet trouvé pour ce numéro.");
    return;
  }

  console.log(`Trouvé ${tickets.length} billet(s) pour Sabrina:`);
  for (const t of tickets) {
    console.log(`  - ID: ${t.id} | ${t.firstName} ${t.lastName} | visitDate: ${t.visitDate} | tier: ${t.tier}`);
  }

  // 2. Update visitDate to May 2nd 2026
  const newDate = new Date("2026-05-02");

  for (const t of tickets) {
    await prisma.ticket.update({
      where: { id: t.id },
      data: { visitDate: newDate },
    });
    console.log(`  ✓ Billet ${t.id} mis à jour → 2 mai 2026`);
  }

  console.log("\nBase de données mise à jour.");
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());

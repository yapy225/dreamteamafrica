import "dotenv/config";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  const tickets = await prisma.ticket.findMany({
    where: {
      OR: [
        { phone: { contains: "753803077" } },
        { lastName: { contains: "Faye", mode: "insensitive" }, firstName: { contains: "Alioune", mode: "insensitive" } },
      ],
    },
    include: { event: true },
  });

  if (tickets.length === 0) {
    console.log("Aucun billet trouvé pour Alioune Faye.");
    return;
  }

  console.log(`Trouvé ${tickets.length} billet(s):`);
  for (const t of tickets) {
    console.log(`  - ID: ${t.id} | ${t.firstName} ${t.lastName} | visitDate: ${t.visitDate} | tier: ${t.tier}`);
  }

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

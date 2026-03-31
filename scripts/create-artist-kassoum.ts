import "dotenv/config";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  // Check if already exists
  const existing = await prisma.artistApplication.findFirst({
    where: { email: "kanlolo@hotmail.fr" },
  });

  if (existing) {
    console.log("Fiche artiste déjà existante:", existing.id);
    return;
  }

  const artist = await prisma.artistApplication.create({
    data: {
      firstName: "Kassoum",
      lastName: "Diallo",
      email: "kanlolo@hotmail.fr",
      phone: "+33650395533",
      discipline: "Musique / Percussion",
      groupName: "RAS Kastro et les soldats de Jah",
      status: "PENDING",
      event: "Saison Culturelle Africaine 2026",
    },
  });

  console.log("✓ Fiche artiste créée:", artist.id);
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());

import "dotenv/config";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  const existing = await prisma.artistApplication.findFirst({
    where: { email: "musiquemandingue.keita17@gmail.com" },
  });

  if (existing) {
    console.log("Fiche artiste déjà existante:", existing.id);
    return;
  }

  const artist = await prisma.artistApplication.create({
    data: {
      firstName: "Med Dani",
      lastName: "KEITA",
      email: "musiquemandingue.keita17@gmail.com",
      phone: "+33658101806",
      discipline: "Musique / Percussion",
      groupName: "Med musique kora",
      country: "Guinée Conakry",
      description: "Artiste chanteur, musicien, comédien et conteur. Projet afro-acoustique World entre traditions Africaines et chansons modernes avec des influences comme Salif KEITA, Youssouf N'Dour et Vianney. Instruments : GONGOMA, KRIN, BOLON, KORA, DJEMBE. Ancien membre de la troupe Kaloum Lolé et des Ballets Africains de Guinée.",
      instagram: "med_musique_kora_",
      facebook: "https://www.facebook.com/share/15i3t4oQP5/",
      videoUrl: "https://youtu.be/RuSJ3SJ01IU",
      status: "PENDING",
      event: "Saison Culturelle Africaine 2026",
    },
  });

  console.log("✓ Fiche artiste créée:", artist.id);
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());

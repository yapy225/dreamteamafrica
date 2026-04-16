import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  // Check if CARAF already exists
  const existing = await prisma.directoryEntry.findFirst({
    where: {
      OR: [
        { companyName: { contains: "CARAF", mode: "insensitive" } },
        { companyName: { contains: "Akyé", mode: "insensitive" } },
        { companyName: { contains: "Akye", mode: "insensitive" } },
      ],
    },
  });

  if (existing) {
    console.log(`Fiche existante trouvée: ${existing.companyName} (id=${existing.id})`);
    console.log(`État actuel: email=${existing.email || "-"} | phone=${existing.phone || "-"} | published=${existing.published}`);
    const updated = await prisma.directoryEntry.update({
      where: { id: existing.id },
      data: { phone: "+33652176640", published: true },
    });
    console.log(`✓ Mise à jour: phone=${updated.phone} published=${updated.published}`);
  } else {
    const created = await prisma.directoryEntry.create({
      data: {
        companyName: "LA CARAF — Confédération des Associations des Régions Akyé en France",
        contactName: "CARAF",
        category: "Association",
        country: "France",
        city: "Aubervilliers",
        phone: "+33652176640",
        description:
          "Confédération fondée en 1993 regroupant 32 associations de la communauté Akyé (Côte d'Ivoire) en France. Objectifs : solidarité entre membres, jumelage franco-ivoirien, insertion des cadres ivoiriens, micro-projets de développement. Waldec W931000183. Siège : Boulevard Félix Faure, 93300 Aubervilliers.",
        published: true,
      },
    });
    console.log(`✓ Créée: ${created.companyName}`);
    console.log(`  id=${created.id} | phone=${created.phone} | published=${created.published}`);
  }

  await prisma.$disconnect();
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});

import "dotenv/config";
import { PrismaClient } from "@prisma/client";
import OpenAI from "openai";

const prisma = new PrismaClient();
const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

async function rewriteDescription(
  companyName: string,
  contactName: string,
  category: string,
  currentDesc: string,
): Promise<string> {
  const response = await openai.chat.completions.create({
    model: "gpt-4o-mini",
    max_tokens: 150,
    temperature: 0.7,
    messages: [
      {
        role: "system",
        content:
          "Tu rédiges des descriptions professionnelles courtes (3-4 lignes, max 200 caractères) pour un annuaire professionnel de la diaspora africaine à Paris. Ton chaleureux et valorisant. En français. Pas de guillemets. Pas de markdown.",
      },
      {
        role: "user",
        content: `Réécris cette description en 3-4 lignes professionnelles :
Entreprise : ${companyName}
Contact : ${contactName}
Secteur : ${category}
Description actuelle : ${currentDesc}`,
      },
    ],
  });

  return response.choices[0]?.message?.content?.trim() || currentDesc;
}

async function main() {
  const entries = await prisma.directoryEntry.findMany({
    where: {
      published: true,
    },
    select: {
      id: true,
      companyName: true,
      contactName: true,
      category: true,
      description: true,
    },
    orderBy: { companyName: "asc" },
  });

  const toRewrite = entries.filter(
    (e) => !e.description || e.description.length < 80,
  );

  console.log(`Total fiches : ${entries.length}`);
  console.log(`À réécrire : ${toRewrite.length}`);
  console.log("");

  let updated = 0;
  let failed = 0;

  for (const entry of toRewrite) {
    try {
      const newDesc = await rewriteDescription(
        entry.companyName || "",
        entry.contactName,
        entry.category,
        entry.description || "",
      );

      await prisma.directoryEntry.update({
        where: { id: entry.id },
        data: { description: newDesc },
      });

      updated++;
      console.log(`✓ ${entry.companyName || entry.contactName}`);
      console.log(`  ${newDesc.slice(0, 80)}...`);
      console.log("");

      await new Promise((r) => setTimeout(r, 300));
    } catch (err: unknown) {
      failed++;
      const msg = err instanceof Error ? err.message : String(err);
      console.error(`✗ ${entry.companyName}: ${msg}`);
    }
  }

  console.log(`\nTerminé : ${updated} réécrites, ${failed} échouées`);
  await prisma.$disconnect();
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});

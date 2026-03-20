import "dotenv/config";
import OpenAI from "openai";
import { PrismaClient } from "@prisma/client";
import { generateCoverImage } from "../src/lib/generate-cover-image";

const prisma = new PrismaClient();
const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

async function main() {
  // 1. Générer le contenu
  console.log("Génération du contenu via GPT-4o...");
  const response = await openai.chat.completions.create({
    model: "gpt-4o",
    messages: [
      {
        role: "user",
        content: `Tu es journaliste pour L'Afropéen, le journal de Dream Team Africa.

Rédige un article sur : "Foire d'Afrique Paris 2026 : 20 exposants prêts à faire vibrer l'Espace MAS les 1er et 2 mai"

L'article doit :
- Être en français, ton journalistique engagé et valorisant
- 4-5 paragraphes en HTML (utilise <p>, <h2>, <strong>, <em>, <blockquote>)
- Mentionner la diversité des exposants (mode, cosmétiques, gastronomie, artisanat, jeux)
- Parler de la scène masterclass
- Donner envie aux visiteurs de venir
- Mentionner les billets Early Bird à 5€

Réponds UNIQUEMENT en JSON valide :
{
  "title": "titre accrocheur",
  "excerpt": "résumé en 2 lignes",
  "content": "contenu HTML",
  "category": "CULTURE",
  "tags": ["tag1", "tag2"],
  "metaDescription": "description SEO 155 chars max"
}`,
      },
    ],
    max_tokens: 2000,
    temperature: 0.8,
  });

  const raw = response.choices[0]?.message?.content || "";
  const jsonMatch = raw.match(/\{[\s\S]*\}/);
  if (!jsonMatch) throw new Error("GPT: JSON invalide");
  const article = JSON.parse(jsonMatch[0]);

  console.log("Titre:", article.title);
  console.log("");

  // 2. Slug
  const slug = article.title
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "")
    .slice(0, 80);

  const existing = await prisma.article.findUnique({ where: { slug } });
  const finalSlug = existing ? slug + "-" + Date.now().toString(36) : slug;

  // 3. Cover image via Pexels
  console.log("Génération cover image via Pexels...");
  const coverImage = await generateCoverImage(
    article.title,
    article.category,
    finalSlug,
  );
  console.log("Cover:", coverImage);
  console.log("");

  // 4. Admin user
  const admin = await prisma.user.findFirst({ where: { role: "ADMIN" } });
  if (!admin) throw new Error("Admin user not found");

  // 5. Créer l'article
  const created = await prisma.article.create({
    data: {
      title: article.title,
      slug: finalSlug,
      excerpt: article.excerpt,
      content: article.content,
      category: article.category,
      tags: article.tags || [],
      coverImage,
      metaDescription: article.metaDescription || null,
      authorId: admin.id,
      status: "PUBLISHED",
      position: "UNE",
      source: "manual",
      authorType: "humain",
    },
  });

  console.log("=== ARTICLE PUBLIÉ ===");
  console.log("Titre:", created.title);
  console.log("Cover:", created.coverImage);
  console.log("URL: https://dreamteamafrica.com/lafropeen/" + created.slug);

  await prisma.$disconnect();
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});

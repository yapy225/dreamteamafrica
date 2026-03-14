import { PrismaClient } from "@prisma/client";
import OpenAI from "openai";
import { generateCoverImage } from "../src/lib/generate-cover-image";

const prisma = new PrismaClient();

function slugify(str: string) {
  return str
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

async function main() {
  // Prendre le premier exposant sans article
  const entry = await prisma.directoryEntry.findFirst({
    where: { published: true },
    orderBy: { createdAt: "desc" },
  });

  if (!entry) {
    console.log("Aucun exposant trouvé");
    return;
  }

  const companyName = entry.companyName || entry.contactName;
  console.log(`\nGénération article pour : ${companyName}`);
  console.log(`Secteur: ${entry.category}`);
  console.log(`Description: ${entry.description?.slice(0, 100)}...`);

  // Vérifier doublon
  const existing = await prisma.article.findFirst({
    where: { isSponsored: true, sponsorName: companyName },
  });
  if (existing) {
    console.log(`Article déjà existant: /lafropeen/${existing.slug}`);
    return;
  }

  // Trouver un admin pour authorId
  const admin = await prisma.user.findFirst({ where: { role: "ADMIN" } });
  if (!admin) {
    console.log("Aucun admin trouvé en base");
    return;
  }

  // Générer le contenu
  console.log("\n1. Génération du contenu avec GPT-4o...");
  const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

  const completion = await openai.chat.completions.create({
    model: "gpt-4o",
    messages: [
      {
        role: "system",
        content: `Tu es un journaliste du magazine L'Afropéen, spécialisé dans la promotion des entrepreneurs africains et afro-descendants en France. Tu écris des articles sponsorisés chaleureux, authentiques et valorisants. Écris en HTML (balises <p>, <h2>, <strong>, <em>, <blockquote>). Pas de balises <html>, <head> ou <body>.`,
      },
      {
        role: "user",
        content: `Écris un article sponsorisé pour l'exposant suivant :

Entreprise : ${companyName}
Contact : ${entry.contactName}
Secteur : ${entry.category}
Description : ${entry.description}
${entry.instagram ? `Instagram : ${entry.instagram}` : ""}
${entry.facebook ? `Facebook : ${entry.facebook}` : ""}
${entry.website ? `Site web : ${entry.website}` : ""}

L'article doit :
- Avoir un titre accrocheur (première ligne, sans balise)
- Un chapô/excerpt de 2 lignes (deuxième ligne, sans balise)
- Un corps de 4-5 paragraphes en HTML
- Mettre en valeur l'histoire, le savoir-faire et la passion de l'entrepreneur
- Mentionner comment les retrouver (réseaux sociaux, événements)
- Être dans le ton du magazine L'Afropéen : authentique, valorisant, professionnel

Format de réponse :
TITRE: [titre]
EXCERPT: [excerpt]
CONTENT:
[contenu HTML]`,
      },
    ],
    max_tokens: 1500,
  });

  const text = completion.choices[0]?.message?.content || "";
  console.log("\nRéponse GPT-4o reçue.");

  const titleMatch = text.match(/TITRE:\s*(.+)/);
  const excerptMatch = text.match(/EXCERPT:\s*(.+)/);
  const contentMatch = text.match(/CONTENT:\s*([\s\S]+)/);

  const title = titleMatch?.[1]?.trim() || `${companyName} — Portrait d'entrepreneur`;
  const excerpt = excerptMatch?.[1]?.trim() || `Découvrez ${companyName}, un acteur incontournable de la scène entrepreneuriale africaine.`;
  const content = contentMatch?.[1]?.trim() || `<p>${entry.description}</p>`;

  console.log(`\nTitre: ${title}`);
  console.log(`Excerpt: ${excerpt}`);

  let slug = slugify(title);
  const slugExists = await prisma.article.findUnique({ where: { slug } });
  if (slugExists) slug = `${slug}-${Date.now().toString(36)}`;

  // Générer la cover
  console.log("\n2. Génération de la cover avec DALL-E...");
  let coverImage: string | null = null;
  try {
    coverImage = await generateCoverImage(title, entry.category || "BUSINESS", slug);
    console.log(`Cover: ${coverImage}`);
  } catch (err) {
    console.error("Cover generation failed:", err);
  }

  // Créer l'article
  console.log("\n3. Création de l'article...");
  const article = await prisma.article.create({
    data: {
      title,
      slug,
      excerpt,
      content,
      category: "BUSINESS",
      coverImage,
      gradientClass: coverImage ? null : "g3",
      isSponsored: true,
      sponsorName: companyName,
      authorType: "sponsorise",
      readingTimeMin: Math.max(1, Math.ceil(content.split(/\s+/).length / 200)),
      status: "PUBLISHED",
      position: "UNE",
      dayCount: 1,
      publishedAt: new Date(),
      authorId: admin.id,
      seoKeywords: [companyName, entry.category || "", "entrepreneur africain", "made in africa"].filter(Boolean),
      metaTitle: `${companyName} — L'Afropéen`,
      metaDescription: excerpt,
    },
  });

  console.log(`\n✅ Article publié !`);
  console.log(`   Titre: ${article.title}`);
  console.log(`   URL: /lafropeen/${article.slug}`);
  console.log(`   Cover: ${article.coverImage || "gradient"}`);
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());

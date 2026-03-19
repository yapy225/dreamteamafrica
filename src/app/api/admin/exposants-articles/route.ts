import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { slugify } from "@/lib/utils";
import { generateCoverImage } from "@/lib/generate-cover-image";
import OpenAI from "openai";

function getOpenAI() {
  return new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
}

// GET: liste les exposants avec leur statut article
export async function GET() {
  const session = await auth();
  if (!session?.user?.id || session.user.role !== "ADMIN") {
    return NextResponse.json({ error: "Non autorisé" }, { status: 403 });
  }

  const entries = await prisma.directoryEntry.findMany({
    where: { published: true },
    orderBy: { createdAt: "desc" },
  });

  // Trouver les articles sponsorisés existants
  const sponsoredArticles = await prisma.article.findMany({
    where: { isSponsored: true },
    select: { sponsorName: true, slug: true, coverImage: true, id: true },
  });

  const sponsoredMap = new Map(
    sponsoredArticles.map((a) => [a.sponsorName?.toLowerCase(), a])
  );

  const result = entries.map((e) => ({
    id: e.id,
    companyName: e.companyName || e.contactName,
    contactName: e.contactName,
    category: e.category,
    email: e.email,
    phone: e.phone,
    description: e.description,
    instagram: e.instagram,
    facebook: e.facebook,
    hasArticle: sponsoredMap.has((e.companyName || e.contactName).toLowerCase()),
    articleSlug: sponsoredMap.get((e.companyName || e.contactName).toLowerCase())?.slug,
  }));

  return NextResponse.json({
    entries: result,
    total: result.length,
    withArticle: result.filter((r) => r.hasArticle).length,
    withoutArticle: result.filter((r) => !r.hasArticle).length,
  });
}

// POST: générer un article sponsorisé pour un exposant
export async function POST(request: Request) {
  const session = await auth();
  if (!session?.user?.id || session.user.role !== "ADMIN") {
    return NextResponse.json({ error: "Non autorisé" }, { status: 403 });
  }

  const { entryId } = await request.json();
  if (!entryId) {
    return NextResponse.json({ error: "entryId requis" }, { status: 400 });
  }

  const entry = await prisma.directoryEntry.findUnique({ where: { id: entryId } });
  if (!entry) {
    return NextResponse.json({ error: "Exposant introuvable" }, { status: 404 });
  }

  const companyName = entry.companyName || entry.contactName;

  // Vérifier si un article existe déjà
  const existing = await prisma.article.findFirst({
    where: { isSponsored: true, sponsorName: companyName },
  });
  if (existing) {
    return NextResponse.json({ error: "Article déjà existant", slug: existing.slug }, { status: 409 });
  }

  // Générer le contenu de l'article avec GPT-4o
  const openai = getOpenAI();
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

  // Parser la réponse
  const titleMatch = text.match(/TITRE:\s*(.+)/);
  const excerptMatch = text.match(/EXCERPT:\s*(.+)/);
  const contentMatch = text.match(/CONTENT:\s*([\s\S]+)/);

  const title = titleMatch?.[1]?.trim() || `${companyName} — Portrait d'entrepreneur`;
  const excerpt = excerptMatch?.[1]?.trim() || `Découvrez ${companyName}, un acteur incontournable de la scène entrepreneuriale africaine.`;
  const content = contentMatch?.[1]?.trim() || `<p>${entry.description}</p>`;

  // Générer le slug
  let slug = slugify(title);
  const slugExists = await prisma.article.findUnique({ where: { slug } });
  if (slugExists) slug = `${slug}-${Date.now().toString(36)}`;

  // Générer la cover image avec DALL-E
  let coverImage: string | null = null;
  try {
    coverImage = await generateCoverImage(
      title,
      entry.category || "BUSINESS",
      slug,
    );
  } catch (err) {
    console.error(`[SPONSORED] Cover generation failed for ${companyName}:`, err);
  }

  // Créer l'article
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
      authorId: session.user.id,
      seoKeywords: [companyName, entry.category || "", "entrepreneur africain", "made in africa"].filter(Boolean),
      metaTitle: `${companyName} — L'Afropéen`,
      metaDescription: excerpt,
    },
  });

  return NextResponse.json({
    success: true,
    article: { id: article.id, slug: article.slug, title: article.title, coverImage: article.coverImage },
  });
}

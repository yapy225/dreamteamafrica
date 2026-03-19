import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { slugify } from "@/lib/utils";
import { generateCoverImage } from "@/lib/generate-cover-image";
import OpenAI from "openai";

const BATCH_SIZE = 6;

export async function GET(request: Request) {
  // Vérifier le secret CRON
  const authHeader = request.headers.get("authorization");
  const cronSecret = process.env.CRON_SECRET;
  if (!cronSecret || authHeader !== `Bearer ${cronSecret}`) {
    return NextResponse.json({ error: "Non autorisé" }, { status: 401 });
  }

  const admin = await prisma.user.findFirst({ where: { role: "ADMIN" } });
  if (!admin) {
    return NextResponse.json({ error: "Aucun admin" }, { status: 500 });
  }

  // Récupérer les noms d'entreprises qui ont déjà un article sponsorisé
  const existingArticles = await prisma.article.findMany({
    where: { isSponsored: true },
    select: { sponsorName: true },
  });
  const existingNames = new Set(
    existingArticles.map((a) => a.sponsorName?.toLowerCase()).filter(Boolean)
  );

  // Récupérer les exposants publiés sans article
  const allEntries = await prisma.directoryEntry.findMany({
    where: { published: true },
    orderBy: { createdAt: "asc" },
  });

  const toProcess = allEntries.filter(
    (e) => !existingNames.has((e.companyName || e.contactName).toLowerCase())
  );

  const batch = toProcess.slice(0, BATCH_SIZE);

  if (!batch.length) {
    return NextResponse.json({ message: "Tous les articles sont générés", remaining: 0 });
  }

  const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
  const results: Array<{ company: string; slug: string; success: boolean; error?: string }> = [];

  for (const entry of batch) {
    const companyName = entry.companyName || entry.contactName;
    try {
      // Générer le contenu
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
      const titleMatch = text.match(/TITRE:\s*(.+)/);
      const excerptMatch = text.match(/EXCERPT:\s*(.+)/);
      const contentMatch = text.match(/CONTENT:\s*([\s\S]+)/);

      const title = titleMatch?.[1]?.trim() || `${companyName} — Portrait d'entrepreneur`;
      const excerpt = excerptMatch?.[1]?.trim() || `Découvrez ${companyName}, acteur de la scène entrepreneuriale africaine.`;
      const content = contentMatch?.[1]?.trim() || `<p>${entry.description}</p>`;

      let slug = slugify(title);
      const slugExists = await prisma.article.findUnique({ where: { slug } });
      if (slugExists) slug = `${slug}-${Date.now().toString(36)}`;

      // Cover DALL-E
      let coverImage: string | null = null;
      try {
        coverImage = await generateCoverImage(title, entry.category || "BUSINESS", slug);
      } catch {}

      await prisma.article.create({
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

      results.push({ company: companyName, slug, success: true });
      console.log(`[CRON EXPOSANTS] ✅ ${companyName} → /lafropeen/${slug}`);
    } catch (err: any) {
      results.push({ company: companyName, slug: "", success: false, error: err.message });
      console.error(`[CRON EXPOSANTS] ❌ ${companyName}:`, err.message);
    }
  }

  return NextResponse.json({
    generated: results.filter((r) => r.success).length,
    failed: results.filter((r) => !r.success).length,
    remaining: toProcess.length - batch.length,
    results,
  });
}

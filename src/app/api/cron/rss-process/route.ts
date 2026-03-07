import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import OpenAI from "openai";
import { marked } from "marked";
import { generateCoverImage } from "@/lib/generate-cover-image";

/**
 * CRON: RSS Processing (Redac II + III)
 * - Score PENDING articles with GPT-4o-mini
 * - If score >= 5: rewrite with GPT-4o-mini
 * - Auto-publish to journal
 *
 * Should run every 2-4 hours, after rss-detect.
 */

export const maxDuration = 300;

function getOpenAI() {
  return new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
}

const SCORE_SYSTEM_PROMPT = `Role : Analyste de tendances pour le media "L'Afropeen".
Mission : Evaluer le POTENTIEL THEMATIQUE d'un sujet a partir d'un signal faible (resume RSS).

Consigne de notation (1-10) :

Note le SUJET, pas la redaction. Si le resume est court mais traite d'un sujet strategique (Tech, Finance, Diaspora, Culture, Innovation en Afrique), donne une note elevee.

9-10 (Strategique) : Levees de fonds, Licornes africaines, geopolitique majeure, succes eclatants de la diaspora.
7-8 (Pertinent) : Initiatives locales innovantes, tendances culturelles fortes, nouveaux marches.
5-6 (Moyen mais exploitable) : Actualite economique ou politique classique qui necessite un angle "Afropeen" pour devenir interessante.
1-4 (A ecarter) : Faits divers, sport pur, meteo, depeches sans analyse possible.

Format de sortie : {"score": X, "topic_potential": "explication en 5 mots"}`;

const REWRITE_PROMPT_TEMPLATE = (title: string, summary: string) => `Tu es journaliste expert pour L'Afropeen, media specialise Afrique, diaspora, economie emergente et innovation culturelle.

Redige un article expert structure SEO a partir des elements suivants :

Titre : ${title}
Resume RSS : ${summary}

Structure obligatoire en Markdown :
- Premiere ligne : le titre optimise SEO (sans prefixe, sans #)
- Un paragraphe d'introduction (sans sous-titre "Introduction")
- 3 a 4 sections avec des sous-titres ## evocateurs et journalistiques (JAMAIS de titres generiques comme "Introduction contextualisee", "Analyse strategique", "Conclusion prospective", "Enjeux pour la diaspora")
- Un dernier paragraphe de conclusion avec un sous-titre ## accrocheur (PAS "Conclusion prospective")

Apres l'article, ajoute sur des lignes separees :
META: [meta description de 155 caracteres max]
KEYWORDS: [5 mots-cles SEO separes par des virgules]

Important :
- Utilise le format Markdown : ## pour les sous-titres, **gras**, *italique*. Ne mets JAMAIS "h2", "h:2" ou du HTML brut.
- Ne pas inventer de donnees chiffrees.
- Ne pas halluciner des faits.
- Ajouter de la profondeur strategique.
- Style professionnel, credible et analytique.
- Redige en francais.`;

const VALID_CATEGORIES = [
  "ACTUALITE", "CULTURE", "DIASPORA", "BUSINESS", "LIFESTYLE", "OPINION",
] as const;

const CATEGORY_MAP: Record<string, string> = {
  "ACTUALITE GENERALE": "ACTUALITE",
  "ECONOMIE & TECH": "BUSINESS",
  "DIASPORA & CULTURE": "CULTURE",
  "INSTITUTIONNEL": "ACTUALITE",
  "TECHNOLOGIE": "BUSINESS",
  "SPORT": "LIFESTYLE",
  "MUSIQUE": "CULTURE",
  "MODE": "LIFESTYLE",
  "POLITIQUE": "ACTUALITE",
  "ENQUETE & ANALYSE": "OPINION",
};

function resolveCategory(raw: string): string {
  const upper = raw.toUpperCase().trim();
  if (VALID_CATEGORIES.includes(upper as any)) return upper;
  return CATEGORY_MAP[upper] || "ACTUALITE";
}

function generateSlug(title: string): string {
  return title
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "");
}

function sanitizeHtml(dirty: string): string {
  return dirty
    .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, "")
    .replace(/<style\b[^<]*(?:(?!<\/style>)<[^<]*)*<\/style>/gi, "")
    .replace(/\son\w+\s*=\s*["'][^"']*["']/gi, "")
    .replace(/\son\w+\s*=\s*[^\s>]*/gi, "")
    .replace(/javascript\s*:/gi, "")
    .replace(/data\s*:/gi, "")
    .trim();
}

function computeReadingTime(html: string): number {
  const text = html.replace(/<[^>]*>/g, "");
  const words = text.split(/\s+/).filter(Boolean).length;
  return Math.max(1, Math.ceil(words / 200));
}

export async function GET(request: Request) {
  const authHeader = request.headers.get("authorization");
  const cronSecret = process.env.CRON_SECRET;

  if (!cronSecret || authHeader !== `Bearer ${cronSecret}`) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    // Process up to 5 articles per run to stay within timeout
    const pending = await prisma.detectedArticle.findMany({
      where: { status: "PENDING" },
      orderBy: { createdAt: "asc" },
      take: 5,
    });

    let scored = 0;
    let published = 0;
    let ignored = 0;
    let errored = 0;

    for (const article of pending) {
      try {
        // --- Step 1: Score ---
        await prisma.detectedArticle.update({
          where: { id: article.id },
          data: { status: "SCORED" },
        });

        const scoreResponse = await getOpenAI().chat.completions.create({
          model: "gpt-4o-mini",
          messages: [
            { role: "system", content: SCORE_SYSTEM_PROMPT },
            {
              role: "user",
              content: `Note cet article pour L'Afropeen sur 10.

Regles de scoring (obligatoires) :
- 1-3 : hors ligne editoriale / faible interet
- 4-6 : moyen / pas prioritaire
- 7-8 : bon / interessant
- 9-10 : excellent / tres prioritaire (impact diaspora + potentiel viral)

Interdiction : ne reponds PAS 7 par defaut.
Important: 7 doit etre rare. Utilise 5,6 pour "moyen" et 8,9 pour "fort".
Si l'info est trop vague, mets 4 ou 5.
Si c'est tres pertinent, monte a 8-10.

Titre : ${article.title}
Resume : ${article.summary || "Pas de resume disponible"}

Reponds uniquement sous ce format exact :
{"score": X, "topic_potential": "explication en 5 mots"}`,
            },
          ],
          max_tokens: 100,
          temperature: 1,
        });

        const scoreText = scoreResponse.choices[0]?.message?.content || "";
        const scoreMatch = scoreText.match(/"score"\s*:\s*(\d+)/);
        const score = scoreMatch ? parseInt(scoreMatch[1], 10) : 0;
        const topicMatch = scoreText.match(/"topic_potential"\s*:\s*"([^"]+)"/);
        const scoreReason = topicMatch?.[1] || scoreText;

        scored++;

        if (score < 5) {
          await prisma.detectedArticle.update({
            where: { id: article.id },
            data: { score, scoreReason, status: "IGNORED" },
          });
          ignored++;
          continue;
        }

        // --- Step 2: Rewrite ---
        await prisma.detectedArticle.update({
          where: { id: article.id },
          data: { score, scoreReason, status: "REWRITING" },
        });

        const rewriteResponse = await getOpenAI().chat.completions.create({
          model: "gpt-4o-mini",
          messages: [
            {
              role: "user",
              content: REWRITE_PROMPT_TEMPLATE(article.title, article.summary || ""),
            },
          ],
          max_tokens: 1500,
          temperature: 0.7,
        });

        const rewrittenRaw = rewriteResponse.choices[0]?.message?.content || "";

        // Parse the output
        const lines = rewrittenRaw.split("\n");
        const metaLine = lines.find((l) => l.startsWith("META:"));
        const keywordsLine = lines.find((l) => l.startsWith("KEYWORDS:"));

        const meta = metaLine?.replace("META:", "").trim() || "";
        const keywords = keywordsLine
          ? keywordsLine.replace("KEYWORDS:", "").trim().split(",").map((k) => k.trim()).filter(Boolean)
          : [];

        // Remove META/KEYWORDS lines from content
        const contentLines = lines.filter(
          (l) => !l.startsWith("META:") && !l.startsWith("KEYWORDS:")
        );

        // First non-empty line is the title
        const rewrittenTitle = contentLines.find((l) => l.trim())?.replace(/^#+\s*/, "").trim() || article.title;
        const contentBody = contentLines.slice(contentLines.indexOf(contentLines.find((l) => l.trim())!) + 1).join("\n").trim();

        // Convert markdown to HTML
        const contentHtml = marked.parse(contentBody) as string;

        // Generate excerpt from first paragraph
        const excerptMatch = contentBody.match(/^[^#\n].+/m);
        const excerpt = excerptMatch?.[0]?.trim().slice(0, 300) || meta || article.summary?.slice(0, 300) || "";

        await prisma.detectedArticle.update({
          where: { id: article.id },
          data: {
            rewrittenTitle,
            rewrittenContent: contentHtml,
            rewrittenExcerpt: excerpt,
            rewrittenMeta: meta,
            rewrittenKeywords: keywords,
            status: "REWRITTEN",
          },
        });

        // --- Step 3: Publish ---
        const category = resolveCategory(article.sourceCategory || "ACTUALITE");
        let slug = generateSlug(rewrittenTitle);

        // Generate cover image via DALL-E
        const coverImage = await generateCoverImage(
          rewrittenTitle,
          category,
          slug,
          article.sourceImageUrl
        );

        // Ensure slug is unique
        const existingSlug = await prisma.article.findUnique({
          where: { slug },
          select: { id: true },
        });
        if (existingSlug) {
          slug = `${slug}-${Date.now().toString(36)}`;
        }

        // Find admin author
        const admin = await prisma.user.findFirst({
          where: { role: "ADMIN" },
          select: { id: true },
        });

        if (!admin) {
          throw new Error("No ADMIN user found for article attribution");
        }

        const publishedArticle = await prisma.article.create({
          data: {
            title: rewrittenTitle,
            slug,
            excerpt,
            content: sanitizeHtml(contentHtml),
            category: category as any,
            coverImage: coverImage || null,
            tags: keywords,
            readingTimeMin: computeReadingTime(contentHtml),
            metaTitle: rewrittenTitle,
            metaDescription: meta || excerpt.slice(0, 155),
            sourceUrl: article.sourceUrl,
            authorType: "ia",
            source: "rss_auto",
            status: "PUBLISHED",
            position: "UNE",
            dayCount: 1,
            publishedAt: new Date(),
            authorId: admin.id,
          },
        });

        await prisma.detectedArticle.update({
          where: { id: article.id },
          data: {
            status: "PUBLISHED",
            publishedArticleId: publishedArticle.id,
          },
        });

        published++;
      } catch (articleError: any) {
        console.error(`[rss-process] Error processing ${article.id}:`, articleError);
        await prisma.detectedArticle.update({
          where: { id: article.id },
          data: {
            status: "ERROR",
            errorMessage: articleError.message?.slice(0, 500),
          },
        });
        errored++;
      }
    }

    const result = {
      pending: pending.length,
      scored,
      published,
      ignored,
      errored,
      timestamp: new Date().toISOString(),
    };

    console.log("[CRON rss-process]", result);
    return NextResponse.json(result);
  } catch (error: any) {
    console.error("[CRON rss-process ERROR]", error);
    return NextResponse.json({ error: "Internal error" }, { status: 500 });
  }
}

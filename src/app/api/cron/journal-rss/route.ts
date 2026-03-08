export const runtime = "nodejs";

import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import Parser from "rss-parser";
import OpenAI from "openai";
import { marked } from "marked";
import { generateCoverImage } from "@/lib/generate-cover-image";

/**
 * CRON: Journal RSS — runs once per day at 6 AM
 * Combines: rss-detect + rss-process (score, rewrite, publish)
 * Processes up to 5 new articles per run.
 */

export const maxDuration = 300;

const parser = new Parser({
  timeout: 10000,
  headers: { "User-Agent": "LAfropeen-Bot/1.0" },
});

function getOpenAI() {
  return new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
}

// ── Scoring prompt ──
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
  "ACTUALITE", "CULTURE", "CINEMA", "MUSIQUE", "SPORT", "DIASPORA", "BUSINESS", "LIFESTYLE", "OPINION",
] as const;

const CATEGORY_MAP: Record<string, string> = {
  "ACTUALITE GENERALE": "ACTUALITE",
  "ECONOMIE & TECH": "BUSINESS",
  "DIASPORA & CULTURE": "CULTURE",
  "INSTITUTIONNEL": "ACTUALITE",
  "TECHNOLOGIE": "BUSINESS",
  "SPORT": "SPORT",
  "FOOTBALL": "SPORT",
  "MUSIQUE": "MUSIQUE",
  "CINEMA": "CINEMA",
  "FILM": "CINEMA",
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

function extractImageFromHtml(html: string): string | null {
  const match = html.match(/<img[^>]+src=["']([^"']+)["']/i);
  return match?.[1] || null;
}

export async function GET(request: Request) {
  const authHeader = request.headers.get("authorization");
  const cronSecret = process.env.CRON_SECRET;

  if (!cronSecret || authHeader !== `Bearer ${cronSecret}`) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    // ══════════════════════════════════════════════
    // PHASE 1: RSS DETECTION
    // ══════════════════════════════════════════════
    const feeds = await prisma.rssFeed.findMany({ where: { active: true } });
    const cutoff = new Date(Date.now() - 48 * 60 * 60 * 1000); // 48h window
    let totalDetected = 0;
    let totalSkipped = 0;
    const detectErrors: string[] = [];

    for (const feed of feeds) {
      try {
        const rss = await parser.parseURL(feed.url);
        const items = (rss.items || []).slice(0, 10);

        for (const item of items) {
          const link = item.link || item.guid;
          if (!link) continue;

          const pubDate = item.pubDate ? new Date(item.pubDate) : null;
          if (pubDate && pubDate < cutoff) continue;

          const existing = await prisma.detectedArticle.findUnique({
            where: { sourceUrl: link },
            select: { id: true },
          });

          if (existing) {
            totalSkipped++;
            continue;
          }

          const imageUrl =
            item.enclosure?.url ||
            (item as any)["media:content"]?.$.url ||
            extractImageFromHtml(item.content || item["content:encoded"] || "") ||
            null;

          await prisma.detectedArticle.create({
            data: {
              title: (item.title || "Sans titre").trim(),
              sourceUrl: link,
              summary: (item.contentSnippet || item.content || item.summary || "").trim().slice(0, 2000),
              sourceCategory: feed.category,
              sourceName: feed.name,
              sourceImageUrl: imageUrl,
              sourcePubDate: pubDate,
              status: "PENDING",
              feedId: feed.id,
            },
          });
          totalDetected++;
        }

        await prisma.rssFeed.update({
          where: { id: feed.id },
          data: { lastFetchedAt: new Date() },
        });
      } catch (feedError: any) {
        detectErrors.push(`${feed.name}: ${feedError.message}`);
      }
    }

    // ══════════════════════════════════════════════
    // PHASE 2: SCORE + REWRITE + PUBLISH
    // ══════════════════════════════════════════════
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
        // Score
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

        // Rewrite
        await prisma.detectedArticle.update({
          where: { id: article.id },
          data: { score, scoreReason, status: "REWRITING" },
        });

        const rewriteResponse = await getOpenAI().chat.completions.create({
          model: "gpt-4o-mini",
          messages: [
            { role: "user", content: REWRITE_PROMPT_TEMPLATE(article.title, article.summary || "") },
          ],
          max_tokens: 1500,
          temperature: 0.7,
        });

        const rewrittenRaw = rewriteResponse.choices[0]?.message?.content || "";
        const lines = rewrittenRaw.split("\n");
        const metaLine = lines.find((l) => l.startsWith("META:"));
        const keywordsLine = lines.find((l) => l.startsWith("KEYWORDS:"));

        const meta = metaLine?.replace("META:", "").trim() || "";
        const keywords = keywordsLine
          ? keywordsLine.replace("KEYWORDS:", "").trim().split(",").map((k) => k.trim()).filter(Boolean)
          : [];

        const contentLines = lines.filter(
          (l) => !l.startsWith("META:") && !l.startsWith("KEYWORDS:")
        );

        const rewrittenTitle = contentLines.find((l) => l.trim())?.replace(/^#+\s*/, "").trim() || article.title;
        const contentBody = contentLines.slice(contentLines.indexOf(contentLines.find((l) => l.trim())!) + 1).join("\n").trim();
        const contentHtml = marked.parse(contentBody) as string;

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

        // Publish
        const category = resolveCategory(article.sourceCategory || "ACTUALITE");
        let slug = generateSlug(rewrittenTitle);

        const coverImage = await generateCoverImage(
          rewrittenTitle, category, slug, article.sourceImageUrl
        );

        const existingSlug = await prisma.article.findUnique({
          where: { slug },
          select: { id: true },
        });
        if (existingSlug) {
          slug = `${slug}-${Date.now().toString(36)}`;
        }

        const admin = await prisma.user.findFirst({
          where: { role: "ADMIN" },
          select: { id: true },
        });

        if (!admin) throw new Error("No ADMIN user found for article attribution");

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
            seoKeywords: keywords,
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
          data: { status: "PUBLISHED", publishedArticleId: publishedArticle.id },
        });

        published++;
      } catch (articleError: any) {
        console.error(`[journal-rss] Error processing ${article.id}:`, articleError);
        await prisma.detectedArticle.update({
          where: { id: article.id },
          data: { status: "ERROR", errorMessage: articleError.message?.slice(0, 500) },
        });
        errored++;
      }
    }

    const result = {
      detection: { feeds: feeds.length, detected: totalDetected, skipped: totalSkipped, errors: detectErrors.length },
      processing: { pending: pending.length, scored, published, ignored, errored },
      timestamp: new Date().toISOString(),
    };

    console.log("[CRON journal-rss]", result);
    return NextResponse.json(result);
  } catch (error: any) {
    console.error("[CRON journal-rss ERROR]", error);
    return NextResponse.json({ error: "Internal error" }, { status: 500 });
  }
}

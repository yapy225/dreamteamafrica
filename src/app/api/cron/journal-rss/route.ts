export const runtime = "nodejs";

import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import Parser from "rss-parser";
import { generateCoverImage } from "@/lib/generate-cover-image";
import { publishToSocialMedia } from "@/lib/social-media";
import {
  getOpenAI,
  SCORE_SYSTEM_PROMPT,
  buildScoreUserPrompt,
  buildRewritePrompt,
  parseScoreResponse,
  parseRewriteResponse,
  resolveCategory,
  generateSlug,
  sanitizeHtml,
  computeReadingTime,
  extractImageFromHtml,
  MIN_SCORE,
  ARTICLES_PER_RUN,
  DETECTION_WINDOW_HOURS,
  CLEANUP_DAYS,
} from "@/lib/rss-pipeline";

/**
 * CRON: Journal RSS — runs 3x/day (7h, 13h, 19h)
 * 1. Detect new articles from RSS feeds
 * 2. Score, rewrite, and publish top articles (3 per run)
 * 3. Cleanup old IGNORED articles (>30 days)
 */

export const maxDuration = 300;

const parser = new Parser({
  timeout: 10000,
  headers: { "User-Agent": "LAfropeen-Bot/1.0" },
});

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
    const cutoff = new Date(Date.now() - DETECTION_WINDOW_HOURS * 60 * 60 * 1000);
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
      take: ARTICLES_PER_RUN,
    });

    let scored = 0;
    let published = 0;
    let ignored = 0;
    let errored = 0;

    const openai = getOpenAI();

    for (const article of pending) {
      try {
        // ── Score ──
        const scoreResponse = await openai.chat.completions.create({
          model: "gpt-4o-mini",
          messages: [
            { role: "system", content: SCORE_SYSTEM_PROMPT },
            { role: "user", content: buildScoreUserPrompt(article.title, article.summary || "") },
          ],
          max_tokens: 100,
          temperature: 1,
        });

        const { score, reason } = parseScoreResponse(
          scoreResponse.choices[0]?.message?.content || ""
        );
        scored++;

        if (score < MIN_SCORE) {
          await prisma.detectedArticle.update({
            where: { id: article.id },
            data: { score, scoreReason: reason, status: "IGNORED" },
          });
          ignored++;
          continue;
        }

        // ── Rewrite ──
        const rewriteResponse = await openai.chat.completions.create({
          model: "gpt-4o-mini",
          messages: [
            { role: "user", content: buildRewritePrompt(article.title, article.summary || "") },
          ],
          max_tokens: 1500,
          temperature: 0.7,
        });

        const rewritten = parseRewriteResponse(
          rewriteResponse.choices[0]?.message?.content || "",
          article.title,
          article.summary || ""
        );

        // ── Publish ──
        const category = resolveCategory(article.sourceCategory || "ACTUALITE");
        let slug = generateSlug(rewritten.title);

        const coverImage = await generateCoverImage(
          rewritten.title, category, slug, article.sourceImageUrl
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
            title: rewritten.title,
            slug,
            excerpt: rewritten.excerpt,
            content: sanitizeHtml(rewritten.contentHtml),
            category: category as any,
            coverImage: coverImage || null,
            tags: rewritten.keywords,
            readingTimeMin: computeReadingTime(rewritten.contentHtml),
            metaTitle: rewritten.title,
            metaDescription: rewritten.meta || rewritten.excerpt.slice(0, 155),
            seoKeywords: rewritten.keywords,
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
            score,
            scoreReason: reason,
            rewrittenTitle: rewritten.title,
            rewrittenContent: rewritten.contentHtml,
            rewrittenExcerpt: rewritten.excerpt,
            rewrittenMeta: rewritten.meta,
            rewrittenKeywords: rewritten.keywords,
            status: "PUBLISHED",
            publishedArticleId: publishedArticle.id,
          },
        });

        // Social media (non-blocking)
        try {
          const socialResult = await publishToSocialMedia({
            id: publishedArticle.id,
            title: publishedArticle.title,
            slug: publishedArticle.slug,
            excerpt: publishedArticle.excerpt,
            category: publishedArticle.category,
            coverImage: publishedArticle.coverImage,
            tags: rewritten.keywords,
            seoKeywords: rewritten.keywords,
          });
          console.log(`[journal-rss] Social: ${socialResult.posted} posted, ${socialResult.failed} failed`);
        } catch (socialErr: any) {
          console.error(`[journal-rss] Social error (non-blocking):`, socialErr.message);
        }

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

    // ══════════════════════════════════════════════
    // PHASE 3: CLEANUP OLD IGNORED ARTICLES
    // ══════════════════════════════════════════════
    const cleanupCutoff = new Date(Date.now() - CLEANUP_DAYS * 24 * 60 * 60 * 1000);
    const { count: cleaned } = await prisma.detectedArticle.deleteMany({
      where: {
        status: "IGNORED",
        createdAt: { lt: cleanupCutoff },
      },
    });

    const result = {
      detection: { feeds: feeds.length, detected: totalDetected, skipped: totalSkipped, errors: detectErrors.length },
      processing: { pending: pending.length, scored, published, ignored, errored },
      cleanup: { removed: cleaned },
      timestamp: new Date().toISOString(),
    };

    console.log("[CRON journal-rss]", result);
    return NextResponse.json(result);
  } catch (error: any) {
    console.error("[CRON journal-rss ERROR]", error);
    return NextResponse.json({ error: "Internal error" }, { status: 500 });
  }
}

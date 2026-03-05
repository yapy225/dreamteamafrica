export const runtime = "nodejs";

import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import Parser from "rss-parser";

/**
 * CRON: RSS Detection (Redac I)
 * - Fetch all active RSS feeds
 * - Parse articles from last 24h
 * - Deduplicate by sourceUrl
 * - Insert new DetectedArticle with status PENDING
 *
 * Should run every 2-4 hours via Vercel CRON.
 */

export const maxDuration = 60;

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
    const feeds = await prisma.rssFeed.findMany({
      where: { active: true },
    });

    const cutoff = new Date(Date.now() - 24 * 60 * 60 * 1000);
    let totalDetected = 0;
    let totalSkipped = 0;
    const errors: string[] = [];

    for (const feed of feeds) {
      try {
        const rss = await parser.parseURL(feed.url);
        const items = (rss.items || []).slice(0, 10);

        for (const item of items) {
          const link = item.link || item.guid;
          if (!link) continue;

          // Filter by date if available
          const pubDate = item.pubDate ? new Date(item.pubDate) : null;
          if (pubDate && pubDate < cutoff) continue;

          // Deduplicate
          const existing = await prisma.detectedArticle.findUnique({
            where: { sourceUrl: link },
            select: { id: true },
          });

          if (existing) {
            totalSkipped++;
            continue;
          }

          // Extract image from content, enclosure, or media
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

        // Update lastFetchedAt
        await prisma.rssFeed.update({
          where: { id: feed.id },
          data: { lastFetchedAt: new Date() },
        });
      } catch (feedError: any) {
        errors.push(`${feed.name} (${feed.url}): ${feedError.message}`);
      }
    }

    const result = {
      feeds: feeds.length,
      detected: totalDetected,
      skipped: totalSkipped,
      errors: errors.length,
      errorDetails: errors.slice(0, 5),
      timestamp: new Date().toISOString(),
    };

    console.log("[CRON rss-detect]", result);
    return NextResponse.json(result);
  } catch (error: any) {
    console.error("[CRON rss-detect ERROR]", error);
    return NextResponse.json(
      { error: "Internal error", detail: error?.message, stack: error?.stack?.split("\n").slice(0, 5) },
      { status: 500 }
    );
  }
}

function extractImageFromHtml(html: string): string | null {
  const match = html.match(/<img[^>]+src=["']([^"']+)["']/i);
  return match?.[1] || null;
}

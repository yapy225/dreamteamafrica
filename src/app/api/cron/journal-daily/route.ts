import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";

/**
 * CRON: Journal Daily — runs once per day at 3 AM
 * Combines: advance-articles + boost-views
 */

export const maxDuration = 60;

const POSITION_SCHEDULE: Array<{
  maxDay: number;
  position: "UNE" | "FACE_UNE" | "PAGES_4_5" | "PAGES_6_7" | "PAGES_8_9" | "PAGES_10_11" | "PAGES_12_13" | "ARCHIVES";
}> = [
  { maxDay: 3, position: "UNE" },
  { maxDay: 6, position: "FACE_UNE" },
  { maxDay: 8, position: "PAGES_4_5" },
  { maxDay: 10, position: "PAGES_6_7" },
  { maxDay: 12, position: "PAGES_8_9" },
  { maxDay: 16, position: "PAGES_10_11" },
  { maxDay: 21, position: "PAGES_12_13" },
];

function getPositionForDay(day: number) {
  for (const rule of POSITION_SCHEDULE) {
    if (day <= rule.maxDay) return rule.position;
  }
  return "ARCHIVES" as const;
}

const VIEW_RANGES: Record<string, [number, number]> = {
  UNE: [15, 45],
  FACE_UNE: [8, 25],
  PAGES_4_5: [5, 15],
  PAGES_6_7: [3, 10],
  PAGES_8_9: [2, 7],
  PAGES_10_11: [1, 5],
  PAGES_12_13: [1, 3],
  ARCHIVES: [0, 2],
};

function randomBetween(min: number, max: number): number {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

export async function GET(request: Request) {
  const authHeader = request.headers.get("authorization");
  const cronSecret = process.env.CRON_SECRET;

  if (!cronSecret || authHeader !== `Bearer ${cronSecret}`) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    // ── 1. Advance article positions ──
    const activeArticles = await prisma.article.findMany({
      where: { position: { not: "ARCHIVES" } },
    });

    let advanced = 0;
    let archived = 0;

    for (const article of activeArticles) {
      const newDayCount = article.dayCount + 1;
      const newPosition = getPositionForDay(newDayCount);

      if (newPosition !== article.position || newDayCount !== article.dayCount) {
        await prisma.article.update({
          where: { id: article.id },
          data: { dayCount: newDayCount, position: newPosition },
        });
        if (newPosition === "ARCHIVES") archived++;
        else advanced++;
      }
    }

    // ── 2. Boost views ──
    const allPublished = await prisma.article.findMany({
      where: { status: "PUBLISHED" },
      select: { id: true, position: true, views: true },
    });

    let boosted = 0;
    for (const article of allPublished) {
      const range = VIEW_RANGES[article.position] || [0, 1];
      const increment = randomBetween(range[0], range[1]);
      if (increment > 0) {
        await prisma.article.update({
          where: { id: article.id },
          data: { views: article.views + increment },
        });
        boosted++;
      }
    }

    const result = {
      lifecycle: { processed: activeArticles.length, advanced, archived },
      views: { articles: allPublished.length, boosted },
      timestamp: new Date().toISOString(),
    };

    console.log("[CRON journal-daily]", result);
    return NextResponse.json(result);
  } catch (error: any) {
    console.error("[CRON journal-daily ERROR]", error);
    return NextResponse.json({ error: "Internal error" }, { status: 500 });
  }
}

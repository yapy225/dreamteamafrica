import { verifyCronAuth } from "@/lib/cron-auth";
import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";

/**
 * CRON: Boost article views progressively.
 * Articles in prominent positions get more views.
 * Runs every hour via Vercel CRON.
 */

const VIEW_RANGES: Record<string, [number, number]> = {
  UNE:         [15, 45],
  FACE_UNE:    [8, 25],
  PAGES_4_5:   [5, 15],
  PAGES_6_7:   [3, 10],
  PAGES_8_9:   [2, 7],
  PAGES_10_11: [1, 5],
  PAGES_12_13: [1, 3],
  ARCHIVES:    [0, 2],
};

function randomBetween(min: number, max: number): number {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

export async function GET(request: Request) {
  const authError = verifyCronAuth(request);
  if (authError) return authError;

  try {
    const articles = await prisma.article.findMany({
      where: { status: "PUBLISHED" },
      select: { id: true, position: true, views: true },
    });

    let boosted = 0;

    for (const article of articles) {
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

    return NextResponse.json({
      articles: articles.length,
      boosted,
      timestamp: new Date().toISOString(),
    });
  } catch (error: any) {
    console.error("[CRON boost-views ERROR]", error);
    return NextResponse.json({ error: "Internal error" }, { status: 500 });
  }
}

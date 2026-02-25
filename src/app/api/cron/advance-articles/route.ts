import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";

/**
 * CRON endpoint: Advances article positions through the 21-day lifecycle.
 *
 * Position schedule:
 *   J1-3:   UNE           (days 1-3)
 *   J4-6:   FACE_UNE      (days 4-6)
 *   J7-8:   PAGES_4_5     (days 7-8)
 *   J9-10:  PAGES_6_7     (days 9-10)
 *   J11-12: PAGES_8_9     (days 11-12)
 *   J13-16: PAGES_10_11   (days 13-16)
 *   J17-21: PAGES_12_13   (days 17-21)
 *   J22+:   ARCHIVES
 *
 * Should be called daily via Vercel CRON or external scheduler.
 * Protected by CRON_SECRET env var.
 */

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

export async function GET(request: Request) {
  // Verify CRON secret
  const authHeader = request.headers.get("authorization");
  const cronSecret = process.env.CRON_SECRET;

  if (cronSecret && authHeader !== `Bearer ${cronSecret}`) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    // Get all non-archived articles
    const articles = await prisma.article.findMany({
      where: { position: { not: "ARCHIVES" } },
    });

    let advanced = 0;
    let archived = 0;

    for (const article of articles) {
      const newDayCount = article.dayCount + 1;
      const newPosition = getPositionForDay(newDayCount);

      if (newPosition !== article.position || newDayCount !== article.dayCount) {
        await prisma.article.update({
          where: { id: article.id },
          data: {
            dayCount: newDayCount,
            position: newPosition,
          },
        });

        if (newPosition === "ARCHIVES") {
          archived++;
        } else {
          advanced++;
        }
      }
    }

    const result = {
      processed: articles.length,
      advanced,
      archived,
      timestamp: new Date().toISOString(),
    };

    console.log("CRON advance-articles:", result);
    return NextResponse.json(result);
  } catch (error) {
    console.error("CRON advance-articles error:", error);
    return NextResponse.json({ error: "Internal error" }, { status: 500 });
  }
}

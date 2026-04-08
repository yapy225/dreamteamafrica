import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { BEHAVIOR_WEIGHTS, SCORE_TTL_MS } from "@/lib/behavior";
import { headers } from "next/headers";
import { rateLimit, getClientIp } from "@/lib/rate-limit";

export async function POST(request: Request) {
  // Rate limit: 30 signals/min per IP (generous — beacon sends often)
  const ip = getClientIp(request);
  const rl = rateLimit(`behavior:${ip}`, { limit: 30, windowSec: 60 });
  if (!rl.success) {
    return NextResponse.json({ ok: true }); // silent — don't reveal rate limiting
  }

  try {
    const { signal, fp } = await request.json();

    if (!signal || !fp || typeof signal !== "string" || typeof fp !== "string") {
      return NextResponse.json({ ok: true });
    }

    const weight = BEHAVIOR_WEIGHTS[signal];
    if (!weight) {
      return NextResponse.json({ ok: true }); // unknown signal or zero-weight, ignore
    }

    // Build fingerprint from client FP + IP for harder spoofing
    const fingerprint = `${fp}:${ip}`;

    // Upsert behavior score
    const existing = await prisma.behaviorScore.findUnique({
      where: { fingerprint },
    });

    if (existing) {
      // Reset score if older than TTL (24h)
      const isExpired = Date.now() - existing.updatedAt.getTime() > SCORE_TTL_MS;

      if (isExpired) {
        await prisma.behaviorScore.update({
          where: { fingerprint },
          data: {
            score: weight,
            signals: { [signal]: 1 },
            flagged: false,
          },
        });
      } else {
        const signals = (existing.signals as Record<string, number>) || {};
        signals[signal] = (signals[signal] || 0) + 1;
        const newScore = existing.score + weight;

        await prisma.behaviorScore.update({
          where: { fingerprint },
          data: {
            score: newScore,
            signals,
            flagged: newScore >= 30,
          },
        });
      }
    } else {
      await prisma.behaviorScore.create({
        data: {
          fingerprint,
          score: weight,
          signals: { [signal]: 1 },
          flagged: weight >= 30,
        },
      });
    }

    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ ok: true }); // never leak errors
  }
}

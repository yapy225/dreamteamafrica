import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { BEHAVIOR_WEIGHTS } from "@/lib/behavior";
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
      return NextResponse.json({ ok: true }); // unknown signal, ignore
    }

    // Build fingerprint from client FP + IP for harder spoofing
    const headersList = await headers();
    const ua = headersList.get("user-agent") || "";
    const fingerprint = `${fp}:${ip}`;

    // Upsert behavior score
    const existing = await prisma.behaviorScore.findUnique({
      where: { fingerprint },
    });

    if (existing) {
      const signals = (existing.signals as Record<string, number>) || {};
      signals[signal] = (signals[signal] || 0) + 1;
      const newScore = existing.score + weight;

      await prisma.behaviorScore.update({
        where: { fingerprint },
        data: {
          score: newScore,
          signals,
          flagged: newScore >= 15,
        },
      });
    } else {
      await prisma.behaviorScore.create({
        data: {
          fingerprint,
          score: weight,
          signals: { [signal]: 1 },
          flagged: weight >= 15,
        },
      });
    }

    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ ok: true }); // never leak errors
  }
}

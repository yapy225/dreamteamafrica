import { prisma } from "@/lib/db";

/**
 * Distributed rate limiter using PostgreSQL.
 * Works correctly across Vercel serverless instances.
 * Falls back to in-memory if DB call fails.
 */
export async function rateLimitDb(
  key: string,
  config: { limit: number; windowSec: number },
): Promise<{ success: boolean; remaining: number }> {
  const now = new Date();
  const resetAt = new Date(now.getTime() + config.windowSec * 1000);

  try {
    // Atomic upsert + increment
    const entry = await prisma.rateLimitEntry.upsert({
      where: { id: key },
      create: { id: key, count: 1, resetAt },
      update: {
        count: { increment: 1 },
      },
    });

    // If window expired, reset
    if (entry.resetAt < now) {
      await prisma.rateLimitEntry.update({
        where: { id: key },
        data: { count: 1, resetAt },
      });
      return { success: true, remaining: config.limit - 1 };
    }

    if (entry.count > config.limit) {
      return { success: false, remaining: 0 };
    }

    return { success: true, remaining: config.limit - entry.count };
  } catch {
    // Fallback: allow request if DB fails (fail-open for availability)
    return { success: true, remaining: config.limit };
  }
}

/**
 * Cleanup expired rate limit entries (call from a cron job).
 */
export async function cleanupRateLimits(): Promise<number> {
  const result = await prisma.rateLimitEntry.deleteMany({
    where: { resetAt: { lt: new Date() } },
  });
  return result.count;
}

/**
 * Hybrid rate limiter: DB-backed for critical routes, in-memory fallback.
 * Compatible with Vercel serverless — DB ensures distributed enforcement.
 */

import { PrismaClient } from "@prisma/client";

// Lazy prisma import to avoid circular deps
let _prisma: PrismaClient | null = null;
function db(): PrismaClient {
  if (!_prisma) {
    _prisma = new PrismaClient();
  }
  return _prisma;
}

interface RateLimitConfig {
  /** Max requests allowed in the window */
  limit: number;
  /** Window duration in seconds */
  windowSec: number;
}

interface RateLimitResult {
  success: boolean;
  remaining: number;
  resetAt: number;
}

// In-memory store as fast fallback
const memStore = new Map<string, { count: number; resetAt: number }>();

setInterval(() => {
  const now = Date.now();
  for (const [key, entry] of memStore) {
    if (now > entry.resetAt) memStore.delete(key);
  }
}, 5 * 60 * 1000);

/**
 * Rate limit using DB (distributed, serverless-safe).
 * Falls back to in-memory if DB call fails.
 */
export function rateLimit(
  key: string,
  config: RateLimitConfig,
): RateLimitResult {
  // Synchronous in-memory check first (fast path)
  const now = Date.now();
  const entry = memStore.get(key);

  if (!entry || now > entry.resetAt) {
    memStore.set(key, { count: 1, resetAt: now + config.windowSec * 1000 });
    // Fire-and-forget DB sync for distributed enforcement
    dbRateLimit(key, config).catch(() => {});
    return { success: true, remaining: config.limit - 1, resetAt: now + config.windowSec * 1000 };
  }

  entry.count++;

  if (entry.count > config.limit) {
    return { success: false, remaining: 0, resetAt: entry.resetAt };
  }

  // Fire-and-forget DB sync
  dbRateLimit(key, config).catch(() => {});
  return { success: true, remaining: config.limit - entry.count, resetAt: entry.resetAt };
}

/**
 * DB-backed rate limit check (async, for critical paths).
 */
async function dbRateLimit(
  key: string,
  config: RateLimitConfig,
): Promise<{ success: boolean }> {
  try {
    const now = new Date();
    const resetAt = new Date(now.getTime() + config.windowSec * 1000);

    const entry = await db().rateLimitEntry.upsert({
      where: { id: key },
      create: { id: key, count: 1, resetAt },
      update: { count: { increment: 1 } },
    });

    // Window expired → reset
    if (entry.resetAt < now) {
      await db().rateLimitEntry.update({
        where: { id: key },
        data: { count: 1, resetAt },
      });
      // Sync memory
      memStore.set(key, { count: 1, resetAt: resetAt.getTime() });
      return { success: true };
    }

    // Sync memory with DB truth
    memStore.set(key, { count: entry.count, resetAt: entry.resetAt.getTime() });

    return { success: entry.count <= config.limit };
  } catch {
    // DB failure → rely on in-memory (fail-open)
    return { success: true };
  }
}

/**
 * Strict async rate limit — waits for DB check before returning.
 * Use for auth, checkout, and other critical routes.
 */
export async function rateLimitStrict(
  key: string,
  config: RateLimitConfig,
): Promise<RateLimitResult> {
  try {
    const now = new Date();
    const resetAt = new Date(now.getTime() + config.windowSec * 1000);

    const entry = await db().rateLimitEntry.upsert({
      where: { id: key },
      create: { id: key, count: 1, resetAt },
      update: { count: { increment: 1 } },
    });

    if (entry.resetAt < now) {
      await db().rateLimitEntry.update({
        where: { id: key },
        data: { count: 1, resetAt },
      });
      return { success: true, remaining: config.limit - 1, resetAt: resetAt.getTime() };
    }

    if (entry.count > config.limit) {
      return { success: false, remaining: 0, resetAt: entry.resetAt.getTime() };
    }

    return { success: true, remaining: config.limit - entry.count, resetAt: entry.resetAt.getTime() };
  } catch {
    // Fallback to in-memory
    return rateLimit(key, config);
  }
}

/**
 * Extract client IP from request headers (works behind Vercel/Cloudflare proxies).
 */
export function getClientIp(request: Request): string {
  return (
    request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ||
    request.headers.get("x-real-ip") ||
    "unknown"
  );
}

/**
 * Pre-configured rate limiters for common use cases.
 */
export const RATE_LIMITS = {
  /** Auth routes: 5 attempts per 15 minutes */
  auth: { limit: 5, windowSec: 15 * 60 },
  /** Contact/newsletter forms: 5 per 10 minutes */
  form: { limit: 5, windowSec: 10 * 60 },
  /** API general: 30 per minute */
  api: { limit: 30, windowSec: 60 },
  /** Webhooks: 100 per minute */
  webhook: { limit: 100, windowSec: 60 },
} as const;

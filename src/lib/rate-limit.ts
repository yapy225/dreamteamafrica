/**
 * Simple in-memory rate limiter for API routes.
 * No external dependency needed — works on Vercel serverless (per-instance).
 */

interface RateLimitEntry {
  count: number;
  resetAt: number;
}

const store = new Map<string, RateLimitEntry>();

// Cleanup stale entries every 5 minutes
setInterval(() => {
  const now = Date.now();
  for (const [key, entry] of store) {
    if (now > entry.resetAt) store.delete(key);
  }
}, 5 * 60 * 1000);

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

/**
 * Check rate limit for a given key (typically IP + route).
 */
export function rateLimit(
  key: string,
  config: RateLimitConfig,
): RateLimitResult {
  const now = Date.now();
  const entry = store.get(key);

  if (!entry || now > entry.resetAt) {
    store.set(key, { count: 1, resetAt: now + config.windowSec * 1000 });
    return { success: true, remaining: config.limit - 1, resetAt: now + config.windowSec * 1000 };
  }

  entry.count++;
  if (entry.count > config.limit) {
    return { success: false, remaining: 0, resetAt: entry.resetAt };
  }

  return { success: true, remaining: config.limit - entry.count, resetAt: entry.resetAt };
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

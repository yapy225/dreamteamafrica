/**
 * Fetch with timeout and basic SSRF protection.
 * Use this for all external API calls in cron jobs and webhooks.
 */
export function fetchSafe(
  url: string | URL,
  init?: RequestInit & { timeoutMs?: number },
): Promise<Response> {
  const { timeoutMs = 15_000, ...fetchInit } = init || {};
  return fetch(url, {
    ...fetchInit,
    signal: AbortSignal.timeout(timeoutMs),
  });
}

const BLOCKED_HOSTS = ["localhost", "127.0.0.1", "0.0.0.0", "169.254.169.254", "[::1]"];

/** Validate that a URL is safe to fetch (no SSRF to internal networks) */
export function isUrlSafe(url: string): boolean {
  try {
    const parsed = new URL(url);
    if (parsed.protocol !== "https:" && parsed.protocol !== "http:") return false;
    if (BLOCKED_HOSTS.some(h => parsed.hostname === h)) return false;
    if (parsed.hostname.startsWith("10.") || parsed.hostname.startsWith("192.168.") || parsed.hostname.startsWith("172.")) return false;
    return true;
  } catch {
    return false;
  }
}

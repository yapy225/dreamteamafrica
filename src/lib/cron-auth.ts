import { timingSafeEqual } from "crypto";
import { NextResponse } from "next/server";

/**
 * Verify cron job authorization using timing-safe comparison.
 * Returns null if authorized, or a NextResponse error if not.
 */
export function verifyCronAuth(request: Request): NextResponse | null {
  const cronSecret = process.env.CRON_SECRET;
  if (!cronSecret) {
    return NextResponse.json({ error: "CRON_SECRET not configured" }, { status: 500 });
  }

  const authHeader = request.headers.get("authorization") || "";
  const expected = `Bearer ${cronSecret}`;

  try {
    const a = Buffer.from(authHeader);
    const b = Buffer.from(expected);
    if (a.length !== b.length || !timingSafeEqual(a, b)) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
  } catch {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  return null; // Authorized
}

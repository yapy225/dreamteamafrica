import crypto from "crypto";

function getSecret(): string {
  const s = process.env.CPT_TOKEN_SECRET || process.env.NEXTAUTH_SECRET;
  if (!s) throw new Error("CPT_TOKEN_SECRET or NEXTAUTH_SECRET required");
  return s;
}

function b64url(buf: Buffer): string {
  return buf.toString("base64").replace(/=/g, "").replace(/\+/g, "-").replace(/\//g, "_");
}

export function signTicketToken(ticketId: string): string {
  const sig = crypto.createHmac("sha256", getSecret()).update(ticketId).digest();
  return b64url(sig);
}

export function verifyTicketToken(ticketId: string, token: string): boolean {
  if (!ticketId || !token) return false;
  const expected = signTicketToken(ticketId);
  const a = Buffer.from(expected);
  const b = Buffer.from(token);
  if (a.length !== b.length) return false;
  return crypto.timingSafeEqual(a, b);
}

export function buildMagicLink(ticketId: string): string {
  // Prefer canonical production URL; fall back to APP_URL only if explicitly public
  let base = process.env.NEXT_PUBLIC_BASE_URL || process.env.NEXT_PUBLIC_APP_URL || "https://dreamteamafrica.com";
  if (base.includes("localhost") || base.includes("127.0.0.1")) {
    base = "https://dreamteamafrica.com";
  }
  return `${base}/cpt/${ticketId}?t=${signTicketToken(ticketId)}`;
}

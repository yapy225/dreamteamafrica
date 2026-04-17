import crypto from "crypto";

function getSecret(): string {
  const s = process.env.CPT_TOKEN_SECRET || process.env.NEXTAUTH_SECRET;
  if (!s) throw new Error("CPT_TOKEN_SECRET or NEXTAUTH_SECRET required");
  return s;
}

function b64url(buf: Buffer): string {
  return buf.toString("base64").replace(/=/g, "").replace(/\+/g, "-").replace(/\//g, "_");
}

export function signTransferToken(transferId: string): string {
  const sig = crypto.createHmac("sha256", getSecret()).update(`transfer:${transferId}`).digest();
  return b64url(sig);
}

export function verifyTransferToken(transferId: string, token: string): boolean {
  if (!transferId || !token) return false;
  const expected = signTransferToken(transferId);
  const a = Buffer.from(expected);
  const b = Buffer.from(token);
  if (a.length !== b.length) return false;
  return crypto.timingSafeEqual(a, b);
}

export function buildTransferLink(transferId: string): string {
  let base = process.env.NEXT_PUBLIC_BASE_URL || process.env.NEXT_PUBLIC_APP_URL || "https://dreamteamafrica.com";
  if (base.includes("localhost") || base.includes("127.0.0.1")) {
    base = "https://dreamteamafrica.com";
  }
  return `${base}/transfer/${transferId}?t=${signTransferToken(transferId)}`;
}

export function buildInvitationHash(transferId: string): string {
  return crypto.createHmac("sha256", getSecret()).update(`invitation:${transferId}`).digest("hex");
}

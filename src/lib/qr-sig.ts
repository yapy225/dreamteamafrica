import crypto from "crypto";

function getQrSecret(): string {
  const s = process.env.QR_SIG_SECRET || process.env.NEXTAUTH_SECRET;
  if (!s) throw new Error("QR_SIG_SECRET or NEXTAUTH_SECRET required");
  return s;
}

// Legacy secret path — used only as a fallback verifier so already-issued QRs keep working
// during a secret migration (set QR_SIG_LEGACY_SECRET to the old value temporarily).
function getLegacyQrSecret(): string | null {
  return process.env.QR_SIG_LEGACY_SECRET || process.env.NEXTAUTH_SECRET || null;
}

/** Generate a 32-char hex HMAC signature (128-bit) for a ticket QR URL. */
export function signQr(ticketId: string): string {
  return crypto.createHmac("sha256", getQrSecret()).update(ticketId).digest("hex").slice(0, 32);
}

/** Verify a QR signature against the current and legacy secrets, accepting 16-char legacy length. */
export function verifyQrSig(ticketId: string, sig: string | null): boolean {
  if (!sig) return false;
  const len = sig.length === 32 ? 32 : sig.length === 16 ? 16 : 0;
  if (!len) return false;

  const candidates: string[] = [];
  const current = crypto.createHmac("sha256", getQrSecret()).update(ticketId).digest("hex");
  candidates.push(current.slice(0, len));
  const legacy = getLegacyQrSecret();
  if (legacy && legacy !== getQrSecret()) {
    const legacyHex = crypto.createHmac("sha256", legacy).update(ticketId).digest("hex");
    candidates.push(legacyHex.slice(0, len));
  }
  for (const expected of candidates) {
    try {
      if (crypto.timingSafeEqual(Buffer.from(sig), Buffer.from(expected))) return true;
    } catch { /* length mismatch — ignore */ }
  }
  return false;
}

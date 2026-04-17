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

/** Generate a 32-char hex HMAC signature (128-bit) for a ticket QR URL.
 *  When a nonce is provided, it's bound into the signature — used after a transfer
 *  to invalidate the previous holder's PDF/QR. */
export function signQr(ticketId: string, nonce?: string | null): string {
  const material = nonce ? `${ticketId}:${nonce}` : ticketId;
  return crypto.createHmac("sha256", getQrSecret()).update(material).digest("hex").slice(0, 32);
}

/** Verify a QR signature against the current and legacy secrets, accepting 16-char legacy length.
 *  If `nonce` is provided (tickets that went through at least one transfer), only the
 *  nonce-bound signature is accepted — the pre-transfer QR is rejected. */
export function verifyQrSig(ticketId: string, sig: string | null, nonce?: string | null): boolean {
  if (!sig) return false;
  const len = sig.length === 32 ? 32 : sig.length === 16 ? 16 : 0;
  if (!len) return false;

  const material = nonce ? `${ticketId}:${nonce}` : ticketId;
  const candidates: string[] = [];
  const current = crypto.createHmac("sha256", getQrSecret()).update(material).digest("hex");
  candidates.push(current.slice(0, len));
  const legacy = getLegacyQrSecret();
  if (legacy && legacy !== getQrSecret()) {
    const legacyHex = crypto.createHmac("sha256", legacy).update(material).digest("hex");
    candidates.push(legacyHex.slice(0, len));
  }
  for (const expected of candidates) {
    try {
      if (crypto.timingSafeEqual(Buffer.from(sig), Buffer.from(expected))) return true;
    } catch { /* length mismatch — ignore */ }
  }
  return false;
}

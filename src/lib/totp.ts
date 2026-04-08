import crypto from "crypto";

const TOTP_PERIOD = 30; // seconds
const TOTP_DIGITS = 6;
const TOTP_WINDOW = 1; // allow 1 step before/after

/**
 * Generate a random base32-encoded secret.
 */
export function createTotpSecret(bytes = 20): string {
  const buffer = crypto.randomBytes(bytes);
  return base32Encode(buffer);
}

/**
 * Generate a TOTP URI for QR code scanning.
 */
export function getTotpUri(email: string, secret: string, issuer = "DreamTeamAfrica"): string {
  const label = encodeURIComponent(`${issuer}:${email}`);
  return `otpauth://totp/${label}?secret=${secret}&issuer=${encodeURIComponent(issuer)}&algorithm=SHA1&digits=${TOTP_DIGITS}&period=${TOTP_PERIOD}`;
}

/**
 * Verify a TOTP token against a secret.
 * Allows a window of ±1 time step.
 */
export function verifyTotp(token: string, secret: string): boolean {
  if (!token || token.length !== TOTP_DIGITS) return false;

  const now = Math.floor(Date.now() / 1000);

  for (let i = -TOTP_WINDOW; i <= TOTP_WINDOW; i++) {
    const counter = Math.floor((now + i * TOTP_PERIOD) / TOTP_PERIOD);
    const expected = generateTotpCode(secret, counter);
    if (timingSafeCompare(token, expected)) return true;
  }

  return false;
}

/**
 * Generate a TOTP code for a given counter.
 */
function generateTotpCode(secret: string, counter: number): string {
  const key = base32Decode(secret);

  // Counter to 8-byte big-endian buffer
  const buffer = Buffer.alloc(8);
  for (let i = 7; i >= 0; i--) {
    buffer[i] = counter & 0xff;
    counter = counter >> 8;
  }

  // HMAC-SHA1
  const hmac = crypto.createHmac("sha1", key);
  hmac.update(buffer);
  const hash = hmac.digest();

  // Dynamic truncation
  const offset = hash[hash.length - 1] & 0x0f;
  const code =
    ((hash[offset] & 0x7f) << 24) |
    ((hash[offset + 1] & 0xff) << 16) |
    ((hash[offset + 2] & 0xff) << 8) |
    (hash[offset + 3] & 0xff);

  return (code % 10 ** TOTP_DIGITS).toString().padStart(TOTP_DIGITS, "0");
}

function timingSafeCompare(a: string, b: string): boolean {
  if (a.length !== b.length) return false;
  try {
    return crypto.timingSafeEqual(Buffer.from(a), Buffer.from(b));
  } catch {
    return false;
  }
}

// ── Base32 encoding/decoding (RFC 4648) ──

const BASE32_CHARS = "ABCDEFGHIJKLMNOPQRSTUVWXYZ234567";

function base32Encode(buffer: Buffer): string {
  let result = "";
  let bits = 0;
  let value = 0;

  for (const byte of buffer) {
    value = (value << 8) | byte;
    bits += 8;
    while (bits >= 5) {
      bits -= 5;
      result += BASE32_CHARS[(value >> bits) & 0x1f];
    }
  }

  if (bits > 0) {
    result += BASE32_CHARS[(value << (5 - bits)) & 0x1f];
  }

  return result;
}

function base32Decode(encoded: string): Buffer {
  const cleaned = encoded.toUpperCase().replace(/[^A-Z2-7]/g, "");
  const bytes: number[] = [];
  let bits = 0;
  let value = 0;

  for (const char of cleaned) {
    const idx = BASE32_CHARS.indexOf(char);
    if (idx === -1) continue;
    value = (value << 5) | idx;
    bits += 5;
    if (bits >= 8) {
      bits -= 8;
      bytes.push((value >> bits) & 0xff);
    }
  }

  return Buffer.from(bytes);
}

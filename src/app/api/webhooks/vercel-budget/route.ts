/**
 * Webhook Vercel Spend Management
 * Déclenché quand le budget on-demand (20$) est atteint.
 * Envoie une alerte WhatsApp immédiate.
 */
import { NextResponse } from "next/server";
import { sendWhatsAppText } from "@/lib/whatsapp";
import crypto from "crypto";

const WEBHOOK_SECRET = process.env.VERCEL_WEBHOOK_SECRET;
const ALERT_PHONE = process.env.ALERT_PHONE_NUMBER || "";

function verifySignature(body: string, signature: string | null): boolean {
  if (!signature) return false;
  const hmac = crypto.createHmac("sha256", WEBHOOK_SECRET!);
  hmac.update(body);
  const expected = hmac.digest("hex");
  try {
    return crypto.timingSafeEqual(Buffer.from(signature), Buffer.from(expected));
  } catch {
    return false;
  }
}

export async function POST(request: Request) {
  const body = await request.text();
  const signature = request.headers.get("x-vercel-signature");

  // Always require signature verification — never skip
  if (!WEBHOOK_SECRET || !verifySignature(body, signature)) {
    return NextResponse.json({ error: "Invalid signature" }, { status: 401 });
  }

  console.log("[vercel-budget] ALERTE BUDGET ATTEINT");

  if (!ALERT_PHONE) {
    console.error("[vercel-budget] ALERT_PHONE_NUMBER not configured");
    return NextResponse.json({ error: "No alert phone configured" }, { status: 500 });
  }

  try {
    await sendWhatsAppText(
      ALERT_PHONE,
      `ALERTE VERCEL - Budget on-demand atteint (20$) !\n\nLes crons risquent de depasser le budget.\n\nActions a faire :\n1. Verifier la conso sur vercel.com/dashboard\n2. Reduire les crons si necessaire\n3. Le budget se reinitialise au prochain cycle\n\nDate : ${new Date().toLocaleString("fr-FR", { timeZone: "Europe/Paris" })}\n\nDream Team Africa - Alerte automatique`,
    );

    return NextResponse.json({ ok: true, action: "whatsapp_alert_sent" });
  } catch (error) {
    console.error("[vercel-budget] WhatsApp failed:", error);
    return NextResponse.json({ error: "Alert delivery failed" }, { status: 500 });
  }
}

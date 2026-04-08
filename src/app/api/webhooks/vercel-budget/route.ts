/**
 * Webhook Vercel Spend Management
 * Déclenché quand le budget on-demand (10$) est atteint.
 * Envoie une alerte WhatsApp immédiate.
 */
import { NextResponse } from "next/server";
import { sendWhatsAppText } from "@/lib/whatsapp";
import crypto from "crypto";

const WEBHOOK_SECRET = process.env.VERCEL_WEBHOOK_SECRET;
const ALERT_PHONE = "+33782801852";

function verifySignature(body: string, signature: string | null): boolean {
  if (!WEBHOOK_SECRET || !signature) return false;
  const hmac = crypto.createHmac("sha256", WEBHOOK_SECRET);
  hmac.update(body);
  return signature === hmac.digest("hex");
}

export async function POST(request: Request) {
  const body = await request.text();
  const signature = request.headers.get("x-vercel-signature");

  if (WEBHOOK_SECRET && !verifySignature(body, signature)) {
    return NextResponse.json({ error: "Invalid signature" }, { status: 401 });
  }

  console.log("[vercel-budget] ALERTE BUDGET ATTEINT");

  try {
    await sendWhatsAppText(
      ALERT_PHONE,
      `ALERTE VERCEL - Budget on-demand atteint (10$) !\n\nLes crons risquent de depasser le budget.\n\nActions a faire :\n1. Verifier la conso sur vercel.com/dashboard\n2. Reduire les crons si necessaire\n3. Le budget se reinitialise au prochain cycle\n\nDate : ${new Date().toLocaleString("fr-FR", { timeZone: "Europe/Paris" })}\n\nDream Team Africa - Alerte automatique`,
    );

    return NextResponse.json({ ok: true, action: "whatsapp_alert_sent" });
  } catch (error) {
    console.error("[vercel-budget] WhatsApp failed:", error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Unknown" },
      { status: 500 },
    );
  }
}

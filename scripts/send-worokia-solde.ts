/**
 * Envoie à Worokia Samake le récap budget + lien de paiement du solde.
 * Email via Resend + tentative WhatsApp free-form (échoue hors fenêtre 24h,
 * ce n'est pas bloquant).
 *
 * Usage : npx tsx scripts/send-worokia-solde.ts
 */
import "dotenv/config";
import { Resend } from "resend";
import { sendWhatsAppText } from "../src/lib/whatsapp";

const TO_EMAIL = "worokia.samake@gmail.com";
const TO_PHONE = "+33667922502";
const FIRST_NAME = "Worokia";
const DASHBOARD_URL = "https://dreamteamafrica.com/dashboard/mon-stand";

const html = `
<!DOCTYPE html>
<html lang="fr">
<head><meta charset="utf-8"></head>
<body style="font-family: Georgia, serif; color: #1a1a1a; max-width: 600px; margin: 0 auto; padding: 20px;">
  <div style="border-bottom: 3px solid #8B6F4E; padding-bottom: 16px; margin-bottom: 24px;">
    <h1 style="margin: 0; font-size: 24px; color: #8B6F4E;">Dream Team Africa</h1>
    <p style="margin: 4px 0 0; font-size: 12px; text-transform: uppercase; letter-spacing: 2px; color: #999;">Foire d'Afrique Paris 2026 — Solde exposante</p>
  </div>

  <p>Bonjour <strong>${FIRST_NAME}</strong>,</p>

  <p>Ton dossier exposante pour la <strong>Foire d'Afrique Paris 2026</strong> (1 &amp; 2 mai — Espace MAS, 75013) est &agrave; jour :</p>

  <div style="background: #FBF8F2; border-radius: 12px; padding: 20px; margin: 24px 0;">
    <table style="width: 100%; border-collapse: collapse; font-family: Helvetica, Arial, sans-serif;">
      <tr>
        <td style="padding: 6px 0; font-size: 13px; color: #888;">Pack</td>
        <td style="padding: 6px 0; font-size: 14px; color: #1a1a1a; text-align: right;">Entrepreneur 2 jours &times; 2 stands (4 m²)</td>
      </tr>
      <tr>
        <td style="padding: 6px 0; font-size: 13px; color: #888;">Budget total</td>
        <td style="padding: 6px 0; font-size: 14px; font-weight: 600; color: #1a1a1a; text-align: right;">640,00 €</td>
      </tr>
      <tr>
        <td style="padding: 6px 0; font-size: 13px; color: #888;">Déjà versé</td>
        <td style="padding: 6px 0; font-size: 14px; color: #16a34a; text-align: right;">121,50 € (70 € + 51,50 €) ✓</td>
      </tr>
      <tr style="border-top: 1px solid #e5e5e5;">
        <td style="padding: 10px 0 6px; font-size: 14px; font-weight: 700; color: #1a1a1a;">Solde à régler</td>
        <td style="padding: 10px 0 6px; font-size: 16px; font-weight: 700; color: #8B6F4E; text-align: right;">518,50 €</td>
      </tr>
    </table>
  </div>

  <p>Tu peux régler le solde directement depuis ton espace exposant (CB ou PayPal) :</p>

  <p style="margin: 32px 0; text-align: center;">
    <a href="${DASHBOARD_URL}" style="background-color: #8B6F4E; color: white; padding: 14px 28px; text-decoration: none; border-radius: 6px; font-weight: bold;">Payer mon solde (518,50 €)</a>
  </p>

  <p style="font-size: 13px; color: #666;">
    Connecte-toi avec ton email <strong>${TO_EMAIL}</strong> puis clique sur <em>"Tout solder — 518,50 €"</em>.
  </p>

  <p>Une fois le paiement effectué, ta réservation passera en <strong>"Confirmée"</strong> et tu recevras ta facture par email.</p>

  <p>À très vite à la Foire !</p>

  <p>Cordialement,<br><strong>L'équipe Dream Team Africa</strong></p>

  <div style="margin-top: 32px; padding-top: 16px; border-top: 1px solid #e5e5e5; font-size: 12px; color: #999;">
    <p>Dream Team Africa — Foire d'Afrique Paris 2026</p>
    <p>contact@dreamteamafrica.com</p>
  </div>
</body>
</html>`;

const whatsappText = `Bonjour ${FIRST_NAME} 👋

Ton dossier exposante pour la *Foire d'Afrique Paris 2026* (1 & 2 mai — Espace MAS 75013) est à jour :

• Pack Entrepreneur 2 jours × *2 stands* (4 m²)
• Budget total : *640 €*
• Déjà versé : *121,50 €* (70 € + 51,50 €) ✅
• *Solde à régler : 518,50 €*

Tu peux régler le solde depuis ton espace exposant :
👉 ${DASHBOARD_URL}

(connecte-toi avec ${TO_EMAIL} puis clique sur "Tout solder — 518,50 €")

Une fois payé, ta réservation passera en "Confirmée" et tu recevras ta facture. À très vite !
— L'équipe Dream Team Africa`;

async function main() {
  const resend = new Resend(process.env.RESEND_API_KEY);

  console.log("→ Envoi email à", TO_EMAIL);
  const { data, error } = await resend.emails.send({
    from: process.env.EMAIL_FROM ?? "Dream Team Africa <hello@dreamteamafrica.com>",
    to: TO_EMAIL,
    subject: "Ton solde exposante — 518,50 € à régler (Foire d'Afrique Paris 2026)",
    html,
  });

  if (error) {
    console.error("  ✗ Email erreur :", error);
  } else {
    console.log("  ✓ Email envoyé :", data?.id);
  }

  console.log("→ Tentative WhatsApp à", TO_PHONE);
  try {
    await sendWhatsAppText(TO_PHONE, whatsappText);
    console.log("  ✓ WhatsApp envoyé");
  } catch (e: unknown) {
    const msg = e instanceof Error ? e.message : String(e);
    console.log("  ⚠ WhatsApp KO (probable hors fenêtre 24h) :", msg.substring(0, 200));
  }
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});

/**
 * Envoie le devis exposant à Niouma SACKO (Nioumiart) par email (Resend) + WhatsApp.
 * Événement : Salon Made In Africa — 11 & 12 décembre 2026, Espace MAS Paris 13e
 *
 * Usage : npx tsx scripts/send-devis-nioumiart.ts
 */
import "dotenv/config";
import { Resend } from "resend";
import { generateDevisExposant } from "../src/lib/generate-devis-exposant";
import { sendWhatsAppText } from "../src/lib/whatsapp";

const resend = new Resend(process.env.RESEND_API_KEY);
const FROM = process.env.EMAIL_FROM ?? "Dream Team Africa <hello@dreamteamafrica.com>";

const TO_EMAIL = "nioumiart@gmail.com";
const TO_PHONE = "+33781260606";
const FIRST_NAME = "Niouma";
const COMPANY = "Nioumiart";
const SECTOR = "Art déco";

async function main() {
  const buffer = await generateDevisExposant({
    name: "Niouma SACKO",
    company: COMPANY,
    email: TO_EMAIL,
    phone: "+33 7 81 26 06 06",
    eventSlug: "salon-made-in-africa",
    pack: "ENTREPRENEUR",
    totalDays: 2,
    pricePerDay: 160,
    totalPrice: 320,
  });

  const html = `<!DOCTYPE html>
<html lang="fr">
<head><meta charset="utf-8"></head>
<body style="font-family: Georgia, serif; color: #1a1a1a; max-width: 600px; margin: 0 auto; padding: 20px;">
  <div style="border-bottom: 3px solid #8B6F4E; padding-bottom: 16px; margin-bottom: 24px;">
    <h1 style="margin: 0; font-size: 24px; color: #8B6F4E;">Dream Team Africa</h1>
    <p style="margin: 4px 0 0; font-size: 12px; text-transform: uppercase; letter-spacing: 2px; color: #999;">Devis Exposant</p>
  </div>

  <p>Bonjour <strong>${FIRST_NAME}</strong>,</p>

  <p>Merci pour votre candidature ! <strong>${COMPANY}</strong> dans le secteur de l'${SECTOR.toLowerCase()}, c'est exactement le type de marque que nos visiteurs adorent découvrir au <strong>Salon Made In Africa</strong> — l'artisanat africain à l'honneur.</p>

  <p>Veuillez trouver ci-joint votre devis.</p>

  <table style="width: 100%; border-collapse: collapse; margin: 24px 0;">
    <tr style="border-bottom: 1px solid #e5e5e5;">
      <td style="padding: 10px 0; color: #666;">Événement</td>
      <td style="padding: 10px 0; font-weight: bold; text-align: right;">Salon Made In Africa 2026</td>
    </tr>
    <tr style="border-bottom: 1px solid #e5e5e5;">
      <td style="padding: 10px 0; color: #666;">Formule</td>
      <td style="padding: 10px 0; font-weight: bold; text-align: right;">Pack Entrepreneur 2 jours</td>
    </tr>
    <tr style="border-bottom: 1px solid #e5e5e5;">
      <td style="padding: 10px 0; color: #666;">Dates</td>
      <td style="padding: 10px 0; font-weight: bold; text-align: right;">11 &amp; 12 Décembre 2026 — 12h à 22h</td>
    </tr>
    <tr style="border-bottom: 1px solid #e5e5e5;">
      <td style="padding: 10px 0; color: #666;">Lieu</td>
      <td style="padding: 10px 0; font-weight: bold; text-align: right;">Espace MAS — 10 rue des Terres au Curé, 75013 Paris</td>
    </tr>
    <tr style="border-bottom: 2px solid #8B6F4E;">
      <td style="padding: 10px 0; color: #666;">Total</td>
      <td style="padding: 10px 0; font-weight: bold; text-align: right; font-size: 20px; color: #8B6F4E;">320 €</td>
    </tr>
    <tr>
      <td style="padding: 10px 0; color: #666;">Paiement</td>
      <td style="padding: 10px 0; text-align: right;">Acompte de 50 € — solde en mensualités</td>
    </tr>
  </table>

  <div style="text-align: center; margin: 32px 0;">
    <a href="https://dreamteamafrica.com/resa-exposants/salon-made-in-africa" style="display: inline-block; background: #8B6F4E; color: #fff; text-decoration: none; padding: 14px 32px; border-radius: 6px; font-weight: bold; font-size: 14px;">Réserver mon stand</a>
  </div>

  <p style="font-size: 14px;">Vous pouvez aussi réserver par WhatsApp : <a href="https://wa.me/33782801852" style="color: #8B6F4E; font-weight: bold;">+33 7 82 80 18 52</a></p>

  <p style="font-size: 14px;">Une fois votre réservation confirmée, remplissez ce <a href="https://tally.so/r/31GKbl" style="color: #8B6F4E;">formulaire</a> pour créer votre capsule vidéo promotionnelle (diffusée sur +28 pages réseaux sociaux).</p>

  <p style="font-size: 13px; color: #888;">Les places sont limitées — réservez rapidement !</p>

  <div style="margin-top: 32px; padding-top: 16px; border-top: 1px solid #e5e5e5; font-size: 12px; color: #999;">
    <p>Dream Team Africa — Saison Culturelle Africaine 2026</p>
    <p>Yvylee KOFFI — hello@dreamteamafrica.com — dreamteamafrica.com</p>
  </div>
</body>
</html>`;

  console.log("→ Envoi email à", TO_EMAIL);
  const { data, error } = await resend.emails.send({
    from: FROM,
    to: TO_EMAIL,
    subject: "Devis Exposant — Salon Made In Africa 2026 — Nioumiart",
    html,
    attachments: [
      {
        filename: "Devis-Nioumiart-Salon-Made-In-Africa-2026.pdf",
        content: buffer,
      },
    ],
  });

  if (error) {
    console.error("  ✗ Email erreur :", error);
  } else {
    console.log("  ✓ Email envoyé :", data?.id);
  }

  const whatsappText = `Bonjour ${FIRST_NAME} 👋

Merci pour ta demande d'exposer à *Nioumiart* au *Salon Made In Africa 2026* — l'artisanat africain à l'honneur !

📅 *Dates* : 11 & 12 décembre 2026 (12h–22h)
📍 *Lieu* : Espace MAS, 10 rue des Terres au Curé, 75013 Paris

*Pack Entrepreneur 2 jours*
• Stand 2 m² • 1 table (1,50 m × 0,60 m)
• 2 chaises • 2 badges exposants
• Tarif : *320 €* (160 €/jour)

💳 Paiement : acompte de 50 € + solde en mensualités

Ton devis détaillé t'arrive par email à ${TO_EMAIL} (PDF joint).

👉 Réserver ton stand : https://dreamteamafrica.com/resa-exposants/salon-made-in-africa

Les places sont limitées — à très vite !
— L'équipe Dream Team Africa`;

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

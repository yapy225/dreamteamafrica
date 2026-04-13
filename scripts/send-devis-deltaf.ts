/**
 * Envoie le devis exposant à Cathy Mare (DELT'AF) par email avec PDF en pièce jointe.
 * Usage : npx tsx scripts/send-devis-deltaf.ts
 */
import "dotenv/config";
import { Resend } from "resend";
import { generateDevisExposant } from "../src/lib/generate-devis-exposant";

const resend = new Resend(process.env.RESEND_API_KEY);
const FROM = process.env.EMAIL_FROM ?? "Dream Team Africa <hello@dreamteamafrica.com>";

async function main() {
  const buffer = await generateDevisExposant({
    name: "Cathy MARE",
    company: "DELT'AF",
    email: "cathymare08@gmail.com",
    phone: "+33 6 67 78 18 55",
    eventSlug: "foire-dafrique-paris",
    pack: "ENTREPRENEUR",
    totalDays: 2,
    pricePerDay: 160,
    totalPrice: 320,
  });

  const { data, error } = await resend.emails.send({
    from: FROM,
    to: "cathymare08@gmail.com",
    subject: "Devis Exposant — Foire d'Afrique Paris 2026 — DELT'AF",
    html: `<!DOCTYPE html>
<html lang="fr">
<head><meta charset="utf-8"></head>
<body style="font-family: Georgia, serif; color: #1a1a1a; max-width: 600px; margin: 0 auto; padding: 20px;">
  <div style="border-bottom: 3px solid #8B6F4E; padding-bottom: 16px; margin-bottom: 24px;">
    <h1 style="margin: 0; font-size: 24px; color: #8B6F4E;">Dream Team Africa</h1>
    <p style="margin: 4px 0 0; font-size: 12px; text-transform: uppercase; letter-spacing: 2px; color: #999;">Devis Exposant</p>
  </div>

  <p>Bonjour <strong>Cathy</strong>,</p>

  <p>Merci pour votre candidature ! <strong>DELT'AF</strong> dans le secteur alimentaire, c'est exactement le type de marque que nos visiteurs adorent découvrir.</p>

  <p>Veuillez trouver ci-joint votre devis pour la <strong>Foire d'Afrique Paris 2026</strong>.</p>

  <table style="width: 100%; border-collapse: collapse; margin: 24px 0;">
    <tr style="border-bottom: 1px solid #e5e5e5;">
      <td style="padding: 10px 0; color: #666;">Événement</td>
      <td style="padding: 10px 0; font-weight: bold; text-align: right;">Foire d'Afrique Paris 2026</td>
    </tr>
    <tr style="border-bottom: 1px solid #e5e5e5;">
      <td style="padding: 10px 0; color: #666;">Formule</td>
      <td style="padding: 10px 0; font-weight: bold; text-align: right;">Pack Entrepreneur 2 jours</td>
    </tr>
    <tr style="border-bottom: 1px solid #e5e5e5;">
      <td style="padding: 10px 0; color: #666;">Dates</td>
      <td style="padding: 10px 0; font-weight: bold; text-align: right;">1er &amp; 2 Mai 2026 — 12h à 22h</td>
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
    <a href="https://dreamteamafrica.com/resa-exposants/foire-dafrique-paris" style="display: inline-block; background: #8B6F4E; color: #fff; text-decoration: none; padding: 14px 32px; border-radius: 6px; font-weight: bold; font-size: 14px;">Réserver mon stand</a>
  </div>

  <p style="font-size: 14px;">Vous pouvez aussi réserver par WhatsApp : <a href="https://wa.me/33782801852" style="color: #8B6F4E; font-weight: bold;">+33 7 82 80 18 52</a></p>

  <p style="font-size: 14px;">Une fois votre réservation confirmée, remplissez ce <a href="https://tally.so/r/31GKbl" style="color: #8B6F4E;">formulaire</a> pour créer votre capsule vidéo promotionnelle (diffusée sur +28 pages réseaux sociaux).</p>

  <p style="font-size: 13px; color: #888;">Les places sont limitées — réservez rapidement !</p>

  <div style="margin-top: 32px; padding-top: 16px; border-top: 1px solid #e5e5e5; font-size: 12px; color: #999;">
    <p>Dream Team Africa — Saison Culturelle Africaine 2026</p>
    <p>Yvylee KOFFI — hello@dreamteamafrica.com — dreamteamafrica.com</p>
  </div>
</body>
</html>`,
    attachments: [
      {
        filename: "Devis-DELTAF-Foire-Afrique-2026.pdf",
        content: buffer,
      },
    ],
  });

  if (error) {
    console.error("✗ Erreur :", error);
    process.exit(1);
  }

  console.log(`✓ Email envoyé à cathymare08@gmail.com — ID: ${data?.id}`);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});

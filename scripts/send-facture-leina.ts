/**
 * Envoie la facture Salon Made In Africa à Leina (Les Jeux Izika / CLMA).
 * Usage : npx tsx scripts/send-facture-leina.ts
 */
import "dotenv/config";
import fs from "fs";
import path from "path";
import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);
const FROM = process.env.EMAIL_FROM ?? "Dream Team Africa <hello@dreamteamafrica.com>";
const TO = "leinakwa@icloud.com";
const PDF_PATH = path.join(__dirname, "..", "Facture-CLMA-JeuxIzika-SalonMadeInAfrica-2025.pdf");

async function main() {
  const buffer = fs.readFileSync(PDF_PATH);

  const { data, error } = await resend.emails.send({
    from: FROM,
    to: TO,
    subject: "Facture Salon Made In Africa — CLMA / Les Jeux Izika",
    html: `<!DOCTYPE html>
<html lang="fr">
<head><meta charset="utf-8"></head>
<body style="font-family: Georgia, serif; color: #1a1a1a; max-width: 600px; margin: 0 auto; padding: 20px;">
  <div style="border-bottom: 3px solid #C4704B; padding-bottom: 16px; margin-bottom: 24px;">
    <h1 style="margin: 0; font-size: 24px; color: #C4704B;">Dream Team Africa</h1>
    <p style="margin: 4px 0 0; font-size: 12px; text-transform: uppercase; letter-spacing: 2px; color: #999;">Facture — Salon Made In Africa</p>
  </div>

  <p>Bonjour Leina,</p>

  <p>Merci encore pour votre participation au <strong>Salon Made In Africa</strong> du 19 décembre 2025.</p>

  <p>Toutes mes excuses pour ce retard — veuillez trouver ci-joint la <strong>facture n° FA-2025-SMIA-002</strong> correspondant à votre paiement de 150 € du 9 décembre 2025.</p>

  <table style="width: 100%; border-collapse: collapse; margin: 24px 0;">
    <tr style="border-bottom: 1px solid #e5e5e5;">
      <td style="padding: 10px 0; color: #666;">Facturé à</td>
      <td style="padding: 10px 0; font-weight: bold; text-align: right;">CLMA — Les Jeux Izika</td>
    </tr>
    <tr style="border-bottom: 1px solid #e5e5e5;">
      <td style="padding: 10px 0; color: #666;">Événement</td>
      <td style="padding: 10px 0; font-weight: bold; text-align: right;">Salon Made In Africa — 19 décembre 2025</td>
    </tr>
    <tr style="border-bottom: 1px solid #e5e5e5;">
      <td style="padding: 10px 0; color: #666;">Lieu</td>
      <td style="padding: 10px 0; font-weight: bold; text-align: right;">Espace MAS — Paris 13e</td>
    </tr>
    <tr style="border-bottom: 2px solid #C4704B;">
      <td style="padding: 10px 0; color: #666;">Total TTC</td>
      <td style="padding: 10px 0; font-weight: bold; text-align: right; font-size: 20px; color: #16A34A;">150,00 € — Payée</td>
    </tr>
  </table>

  <p>N'hésitez pas à me recontacter si vous avez besoin de quoi que ce soit. Au plaisir de vous retrouver pour la prochaine édition !</p>

  <p>Bien à vous,<br/>
  <strong>Dream Team Africa</strong></p>

  <div style="margin-top: 32px; padding-top: 16px; border-top: 1px solid #e5e5e5; font-size: 12px; color: #999;">
    <p>Dream Team Africa — Association Loi 1901</p>
    <p>16 rue du Révérend Père Lucien Aubry, 94120 Fontenay-sous-Bois</p>
    <p>hello@dreamteamafrica.com — 07 82 80 18 52 — dreamteamafrica.com</p>
    <p>TVA non applicable — Art. 293 B du CGI</p>
  </div>
</body>
</html>`,
    attachments: [
      {
        filename: "Facture-CLMA-JeuxIzika-SalonMadeInAfrica-2025.pdf",
        content: buffer,
      },
    ],
  });

  if (error) {
    console.error("✗ Erreur :", error);
    process.exit(1);
  }

  console.log(`✓ Email envoyé à ${TO} — ID: ${data?.id}`);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});

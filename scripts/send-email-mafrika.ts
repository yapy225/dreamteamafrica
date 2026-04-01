import "dotenv/config";
import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

const html = `
<!DOCTYPE html>
<html lang="fr">
<head><meta charset="utf-8"></head>
<body style="font-family: Georgia, serif; color: #1a1a1a; max-width: 600px; margin: 0 auto; padding: 20px;">
  <div style="border-bottom: 3px solid #8B6F4E; padding-bottom: 16px; margin-bottom: 24px;">
    <h1 style="margin: 0; font-size: 24px; color: #8B6F4E;">Dream Team Africa</h1>
    <p style="margin: 4px 0 0; font-size: 12px; text-transform: uppercase; letter-spacing: 2px; color: #999;">Devis Exposant</p>
  </div>

  <p>Bonjour,</p>

  <p>Merci pour votre intérêt pour la Foire d'Afrique Paris - 6ème Édition ! Nous serions ravis de vous accueillir parmi nos exposants.</p>

  <p><strong>🌍 Foire d'Afrique Paris - 6ème Édition</strong><br>
  📅 Dates : 1er & 2 mai 2026<br>
  🕛 Horaires : 12h - 22h<br>
  📍 Lieu : Espace MAS, 10 rue des Terres au Curé, 75013 Paris</p>

  <hr style="border: none; border-top: 1px solid #e5e5e5; margin: 24px 0;">

  <table style="width: 100%; border-collapse: collapse; margin: 24px 0;">
    <tr style="border-bottom: 1px solid #e5e5e5;">
      <td style="padding: 10px 0; font-weight: bold;">Pack Entrepreneur 1 jour</td>
      <td style="padding: 10px 0; font-weight: bold; text-align: right; color: #8B6F4E; font-size: 18px;">190 €</td>
    </tr>
    <tr><td colspan="2" style="padding: 4px 0 10px; color: #666; font-size: 14px;">Stand de 2 m² · 1 table (1,50 m x 0,60 m) · 2 chaises · 2 badges exposants</td></tr>
    <tr style="border-bottom: 1px solid #e5e5e5;">
      <td style="padding: 10px 0; font-weight: bold;">Pack Entrepreneur 2 jours</td>
      <td style="padding: 10px 0; font-weight: bold; text-align: right; color: #8B6F4E; font-size: 18px;">320 € <span style="font-size: 12px; color: #999;">(160 €/jour)</span></td>
    </tr>
    <tr><td colspan="2" style="padding: 4px 0 10px; color: #666; font-size: 14px;">Stand de 2 m² · 1 table (1,50 m x 0,60 m) · 2 chaises · 2 badges exposants</td></tr>
  </table>

  <p><strong>Modalités de paiement :</strong></p>
  <ul>
    <li>Acompte de 50 € pour confirmer</li>
    <li>Solde payable en mensualités (jusqu'à 10 fois)</li>
  </ul>

  <p style="margin: 32px 0; text-align: center;">
    <a href="https://dreamteamafrica.com/resa-exposants/foire-dafrique-paris" style="background-color: #8B6F4E; color: white; padding: 14px 28px; text-decoration: none; border-radius: 6px; font-weight: bold;">Réserver en ligne</a>
  </p>

  <p>N'hésitez pas si vous avez des questions !</p>

  <p>Cordialement,<br><strong>L'équipe Dream Team Africa</strong></p>

  <div style="margin-top: 32px; padding-top: 16px; border-top: 1px solid #e5e5e5; font-size: 12px; color: #999;">
    <p>Dream Team Africa — Saison Culturelle Africaine 2026</p>
    <p>contact@dreamteamafrica.com</p>
  </div>
</body>
</html>`;

async function main() {
  const { error } = await resend.emails.send({
    from: process.env.EMAIL_FROM ?? "Dream Team Africa <onboarding@resend.dev>",
    to: "mafrikagalerie@gmail.com",
    subject: "Devis Exposant — Foire d'Afrique Paris 6ème Édition",
    html,
  });

  if (error) {
    console.error("ERREUR:", error);
  } else {
    console.log("OK - Email envoyé à mafrikagalerie@gmail.com");
  }
}

main();

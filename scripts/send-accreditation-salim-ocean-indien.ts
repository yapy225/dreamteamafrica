/**
 * Confirme l'accréditation presse de Salim Nujeerallee (OCEAN INDIEN RADIO-TV)
 * pour la Foire d'Afrique Paris 2026 (1-2 mai 2026, Espace MAS, Paris 13e).
 *
 * Badge retiré à l'accueil sur présentation d'une pièce d'identité.
 *
 * Usage : npx tsx scripts/send-accreditation-salim-ocean-indien.ts
 */
import "dotenv/config";
import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);
const FROM = process.env.EMAIL_FROM ?? "Dream Team Africa <hello@dreamteamafrica.com>";

const TO_EMAIL = "radiotvoceanindien@gmail.com";
const FIRST_NAME = "Salim";
const FULL_NAME = "Salim Nujeerallee";
const MEDIA = "OCEAN INDIEN (RADIO-TV)";

async function main() {
  const html = `<!DOCTYPE html>
<html lang="fr"><head><meta charset="utf-8"></head>
<body style="font-family: Georgia, serif; color: #1a1a1a; max-width: 600px; margin: 0 auto; padding: 20px;">
  <div style="border-bottom: 3px solid #8B6F4E; padding-bottom: 16px; margin-bottom: 24px;">
    <h1 style="margin: 0; font-size: 24px; color: #8B6F4E;">Dream Team Africa</h1>
    <p style="margin: 4px 0 0; font-size: 12px; text-transform: uppercase; letter-spacing: 2px; color: #999;">Accréditation Presse</p>
  </div>

  <p>Bonjour <strong>${FIRST_NAME}</strong>,</p>

  <p>Nous avons bien reçu votre demande d'accréditation presse pour la <strong>Foire d'Afrique Paris 2026 — 6ᵉ Édition</strong>.</p>

  <p>Nous confirmons votre accréditation pour <strong>${MEDIA}</strong>. Un <strong>badge presse à votre nom</strong> sera disponible à l'<strong>accueil de l'événement</strong> sur présentation d'une pièce d'identité.</p>

  <table style="width: 100%; border-collapse: collapse; margin: 24px 0;">
    <tr style="border-bottom: 1px solid #e5e5e5;">
      <td style="padding: 10px 0; color: #666;">Événement</td>
      <td style="padding: 10px 0; font-weight: bold; text-align: right;">Foire d'Afrique Paris 2026</td>
    </tr>
    <tr style="border-bottom: 1px solid #e5e5e5;">
      <td style="padding: 10px 0; color: #666;">Dates</td>
      <td style="padding: 10px 0; font-weight: bold; text-align: right;">1er &amp; 2 Mai 2026 — 12h à 22h</td>
    </tr>
    <tr style="border-bottom: 1px solid #e5e5e5;">
      <td style="padding: 10px 0; color: #666;">Lieu</td>
      <td style="padding: 10px 0; font-weight: bold; text-align: right;">Espace MAS — 10 rue des Terres au Curé, 75013 Paris</td>
    </tr>
    <tr style="border-bottom: 1px solid #e5e5e5;">
      <td style="padding: 10px 0; color: #666;">Accrédité</td>
      <td style="padding: 10px 0; font-weight: bold; text-align: right;">${FULL_NAME}</td>
    </tr>
    <tr>
      <td style="padding: 10px 0; color: #666;">Média</td>
      <td style="padding: 10px 0; font-weight: bold; text-align: right;">${MEDIA}</td>
    </tr>
  </table>

  <p>Pour faciliter votre reportage, n'hésitez pas à nous transmettre en amont :</p>
  <ul>
    <li>L'angle de votre reportage (thématique, durée de diffusion)</li>
    <li>Les exposants ou temps forts que vous souhaitez couvrir</li>
    <li>Vos créneaux de présence souhaités</li>
  </ul>

  <p>Un espace presse sera aménagé sur place. Notre équipe sera disponible pour vous accompagner et organiser d'éventuelles interviews avec nos exposants et artistes.</p>

  <p>À très bientôt !</p>

  <div style="margin-top: 32px; padding-top: 16px; border-top: 1px solid #e5e5e5; font-size: 12px; color: #999;">
    <p>Dream Team Africa — Saison Culturelle Africaine 2026</p>
    <p>Yvylee KOFFI — hello@dreamteamafrica.com — dreamteamafrica.com</p>
  </div>
</body></html>`;

  console.log("→ Envoi email à", TO_EMAIL);
  const { data, error } = await resend.emails.send({
    from: FROM,
    to: TO_EMAIL,
    subject: "Accréditation presse confirmée — Foire d'Afrique Paris 2026",
    html,
  });

  if (error) {
    console.error("  ✗ Email erreur :", error);
    process.exit(1);
  }
  console.log("  ✓ Email envoyé :", data?.id);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});

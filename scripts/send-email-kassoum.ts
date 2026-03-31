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
    <p style="margin: 4px 0 0; font-size: 12px; text-transform: uppercase; letter-spacing: 2px; color: #999;">Candidature Artiste</p>
  </div>

  <p>Bonjour <strong>Kassoum</strong>,</p>

  <p>Merci pour votre candidature et pour les éléments envoyés (press book, fiche technique, lien TikTok). Nous avons bien pris note de la situation concernant vos comptes Facebook et Instagram.</p>

  <p>Votre fiche artiste a été enregistrée. Afin de la compléter avec toutes les informations nécessaires (description, liens vidéo, pays d'origine, etc.), nous vous invitons à remplir le formulaire suivant :</p>

  <p style="margin: 32px 0; text-align: center;">
    <a href="https://dreamteamafrica.com/artistes" style="background-color: #8B6F4E; color: white; padding: 14px 28px; text-decoration: none; border-radius: 6px; font-weight: bold;">Compléter ma fiche artiste</a>
  </p>

  <p>Ces informations nous permettront de mieux vous présenter dans la communication officielle de l'événement.</p>

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
    to: "kanlolo@hotmail.fr",
    subject: "Complétez votre fiche artiste — Foire d'Afrique Paris 2026",
    html,
  });

  if (error) {
    console.error("ERREUR:", error);
  } else {
    console.log("OK - Email envoyé à kanlolo@hotmail.fr");
  }
}

main();

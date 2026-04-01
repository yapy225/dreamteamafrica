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
    <p style="margin: 4px 0 0; font-size: 12px; text-transform: uppercase; letter-spacing: 2px; color: #999;">Espace Exposant</p>
  </div>

  <p>Bonjour <strong>Lucie</strong>,</p>

  <p>Votre espace exposant a été créé. Voici vos identifiants de connexion :</p>

  <div style="background: #FBF8F2; border-radius: 12px; padding: 20px; margin: 24px 0;">
    <table style="width: 100%; border-collapse: collapse;">
      <tr>
        <td style="padding: 6px 0; font-size: 13px; color: #888;">Email</td>
        <td style="padding: 6px 0; font-size: 14px; font-weight: 600; color: #1a1a1a;">lucie.sangare95@gmail.com</td>
      </tr>
      <tr>
        <td style="padding: 6px 0; font-size: 13px; color: #888;">Mot de passe temporaire</td>
        <td style="padding: 6px 0; font-size: 14px; font-weight: 600; color: #1a1a1a;">bcb04ce9</td>
      </tr>
    </table>
  </div>

  <p style="margin: 32px 0; text-align: center;">
    <a href="https://dreamteamafrica.com/connexion" style="background-color: #8B6F4E; color: white; padding: 14px 28px; text-decoration: none; border-radius: 6px; font-weight: bold;">Se connecter</a>
  </p>

  <p>Pensez à modifier votre mot de passe dans vos paramètres après votre première connexion.</p>

  <p>Concernant votre demande de positionnement en extrémité pour votre portant, nous en prenons bonne note et ferons notre possible pour vous placer au mieux.</p>

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
    from: process.env.EMAIL_FROM ?? "Dream Team Africa <hello@dreamteamafrica.com>",
    to: "lucie.sangare95@gmail.com",
    subject: "Votre espace exposant — Foire d'Afrique Paris 2026",
    html,
  });

  if (error) {
    console.error("ERREUR:", error);
  } else {
    console.log("OK - Email envoyé à lucie.sangare95@gmail.com");
  }
}

main();

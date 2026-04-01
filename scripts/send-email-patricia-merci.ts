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
  </div>

  <p>Bonjour Patricia,</p>

  <p>Merci infiniment pour votre générosité ! Votre don de 3 € à l'association Dream Team Africa est précieux et contribue directement à la promotion de la culture africaine en France.</p>

  <p>Au plaisir de vous accueillir les 1er et 2 mai !</p>

  <p>Chaleureusement,<br><strong>L'équipe Dream Team Africa</strong></p>

  <div style="margin-top: 32px; padding-top: 16px; border-top: 1px solid #e5e5e5; font-size: 12px; color: #999;">
    <p>Dream Team Africa — Saison Culturelle Africaine 2026</p>
    <p>contact@dreamteamafrica.com</p>
  </div>
</body>
</html>`;

async function main() {
  const { error } = await resend.emails.send({
    from: process.env.EMAIL_FROM ?? "Dream Team Africa <hello@dreamteamafrica.com>",
    to: "p.adonai06@free.fr",
    subject: "Re: Un geste pour vous — Foire d'Afrique Paris 2026",
    html,
  });

  if (error) {
    console.error("ERREUR:", error);
  } else {
    console.log("OK - Email envoyé à p.adonai06@free.fr");
  }
}

main();

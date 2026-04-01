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

  <p>Bonjour Mariame,</p>

  <p>Bien reçu, nous procédons au remboursement de 9 €.</p>

  <p>Pourriez-vous nous envoyer votre RIB (IBAN) afin que nous puissions effectuer le virement ?</p>

  <p>Merci encore pour votre soutien aux artisans africains et au plaisir de vous accueillir les 1er et 2 mai !</p>

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
    to: "mariamedoury@outlook.fr",
    subject: "Re: Un geste pour vous — Foire d'Afrique Paris 2026",
    html,
  });

  if (error) {
    console.error("ERREUR:", error);
  } else {
    console.log("OK - Email envoyé à mariamedoury@outlook.fr");
  }
}

main();

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

  <p>Bonjour Nelly,</p>

  <p>Nous avons bien pris note de votre demande d'annulation pour la Foire d'Afrique Paris. Nous comprenons tout à fait et espérons que tout va bien de votre côté.</p>

  <p>Bonne nouvelle : votre acompte de 160 € déjà versé peut être transféré sur un autre événement de la Saison Culturelle Africaine 2026, selon votre choix :</p>

  <ul>
    <li><strong>Juste Une Danse</strong> — 31 octobre 2026 (Espace MAS, Paris 13e)</li>
    <li><strong>Festival du Conte Africain</strong> — 11 novembre 2026 (Espace MAS, Paris 13e)</li>
    <li><strong>Salon Made In Africa</strong> — 11 & 12 décembre 2026 (Espace MAS, Paris 13e)</li>
  </ul>

  <p>Dites-nous quel événement vous intéresse et nous transférerons votre réservation.</p>

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
    to: "possinelly@gmail.com",
    subject: "Re: Foire d'Afrique Paris 2026 — Remplissez votre fiche exposant",
    html,
  });

  if (error) {
    console.error("ERREUR:", error);
  } else {
    console.log("OK - Email envoyé à possinelly@gmail.com");
  }
}

main();

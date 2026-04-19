/**
 * Réponse à Keshia Koutekissa qui pense que le site est fermé.
 * Site opérationnel (HTTP 200 vérifié) — probablement un problème de cache/session.
 * Annonce un appel demain dans la journée.
 *
 * Usage : npx tsx scripts/reply-keshia-miturila.ts
 */
import "dotenv/config";
import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);
const FROM = process.env.EMAIL_FROM ?? "Dream Team Africa <hello@dreamteamafrica.com>";

const TO_EMAIL = "miturila@gmail.com";
const FIRST_NAME = "Keshia";

async function main() {
  const html = `<!DOCTYPE html>
<html lang="fr"><head><meta charset="utf-8"></head>
<body style="font-family: Georgia, serif; color: #1a1a1a; max-width: 600px; margin: 0 auto; padding: 20px;">
  <div style="border-bottom: 3px solid #8B6F4E; padding-bottom: 16px; margin-bottom: 24px;">
    <h1 style="margin: 0; font-size: 24px; color: #8B6F4E;">Dream Team Africa</h1>
    <p style="margin: 4px 0 0; font-size: 12px; text-transform: uppercase; letter-spacing: 2px; color: #999;">Assistance Connexion</p>
  </div>

  <p>Bonjour <strong>${FIRST_NAME}</strong>,</p>

  <p>Merci pour votre message — et rassurez-vous, le site <strong>est bien ouvert et opérationnel</strong> ! 👍</p>

  <p>Vous avez peut-être rencontré un souci ponctuel de session ou de cache navigateur. Voici les liens directs pour aider votre collègue à devenir exposante :</p>

  <div style="background: #FBF8F2; border-radius: 12px; padding: 20px; margin: 24px 0;">
    <p style="margin: 0 0 10px; font-size: 14px;"><strong>🔐 Connexion / Inscription</strong><br>
    <a href="https://dreamteamafrica.com/auth/signin" style="color: #8B6F4E;">https://dreamteamafrica.com/auth/signin</a></p>

    <p style="margin: 10px 0 0; font-size: 14px;"><strong>🏷️ Réservation stand exposant — Foire d'Afrique Paris 2026</strong><br>
    <a href="https://dreamteamafrica.com/resa-exposants/foire-dafrique-paris" style="color: #8B6F4E;">https://dreamteamafrica.com/resa-exposants/foire-dafrique-paris</a></p>
  </div>

  <p><strong>Conseils si le souci persiste :</strong></p>
  <ul style="font-size: 14px;">
    <li>Essayez en <em>navigation privée</em> (Ctrl+Shift+N ou Cmd+Shift+N)</li>
    <li>Videz le cache du navigateur (Ctrl+F5 / Cmd+Shift+R)</li>
    <li>Testez depuis un autre appareil (mobile/PC)</li>
  </ul>

  <p>📞 <strong>Je vous rappelle demain dans la journée</strong> pour vous accompagner directement et aider votre collègue à finaliser sa réservation. Pourriez-vous m'envoyer votre <strong>numéro de téléphone</strong> en réponse à ce mail ?</p>

  <p>À très vite !</p>

  <div style="margin-top: 32px; padding-top: 16px; border-top: 1px solid #e5e5e5; font-size: 12px; color: #999;">
    <p>Dream Team Africa — Saison Culturelle Africaine 2026</p>
    <p>Yvylee KOFFI — hello@dreamteamafrica.com — dreamteamafrica.com</p>
  </div>
</body></html>`;

  console.log("→ Envoi email à", TO_EMAIL);
  const { data, error } = await resend.emails.send({
    from: FROM,
    to: TO_EMAIL,
    subject: "Site opérationnel — je vous rappelle demain pour vous accompagner",
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

import "dotenv/config";
import { sendWhatsAppText } from "../src/lib/whatsapp";
import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);
const FROM_EMAIL = process.env.EMAIL_FROM ?? "Dream Team Africa <onboarding@resend.dev>";

async function main() {
  // 1. WhatsApp à NDIAYE Michel Gallo
  try {
    await sendWhatsAppText("+33767323993", `Bonjour Michel,

Nous pouvons vous mettre en place une *accreditation media* pour la Foire d'Afrique Paris - 6eme Edition (1er & 2 mai 2026).

Pourriez-vous nous confirmer votre venue sur l'evenement afin que nous puissions finaliser votre accreditation ?

L'equipe Dream Team Africa`);
    console.log("OK - WhatsApp envoyé à NDIAYE Michel Gallo (+33767323993)");
  } catch (err) {
    console.error("ERREUR WhatsApp NDIAYE:", err);
  }

  // 2. Email à Armand IRE
  try {
    const { error } = await resend.emails.send({
      from: FROM_EMAIL,
      to: "sionkmou@yahoo.fr",
      subject: "Accréditation Média — Foire d'Afrique Paris 6ème Édition",
      html: `
<!DOCTYPE html>
<html lang="fr">
<head><meta charset="utf-8"></head>
<body style="font-family: Georgia, serif; color: #1a1a1a; max-width: 600px; margin: 0 auto; padding: 20px;">
  <div style="border-bottom: 3px solid #8B6F4E; padding-bottom: 16px; margin-bottom: 24px;">
    <h1 style="margin: 0; font-size: 24px; color: #8B6F4E;">Dream Team Africa</h1>
  </div>

  <p>Bonjour Armand,</p>

  <p>Merci pour votre intérêt et celui du <strong>Média Citoyen</strong> pour la Foire d'Afrique Paris — 6ème Édition !</p>

  <p>Nous serions ravis de collaborer avec vous pour la couverture de l'événement.</p>

  <p>Nous pouvons vous mettre en place une <strong>accréditation média</strong> pour les <strong>1er &amp; 2 mai 2026</strong> à l'Espace MAS, Paris 13e.</p>

  <p>Pourriez-vous nous confirmer votre venue afin que nous puissions finaliser votre accréditation ?</p>

  <p>Cordialement,<br>L'équipe Dream Team Africa</p>

  <div style="margin-top: 32px; padding-top: 16px; border-top: 1px solid #e5e5e5; font-size: 12px; color: #999;">
    <p>Dream Team Africa — Saison Culturelle Africaine 2026</p>
    <p>contact@dreamteamafrica.com</p>
  </div>
</body>
</html>`,
    });
    if (error) throw error;
    console.log("OK - Email envoyé à Armand IRE (sionkmou@yahoo.fr)");
  } catch (err) {
    console.error("ERREUR Email Armand:", err);
  }
}

main();

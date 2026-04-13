/**
 * Email exposants — Sondage choix de stand + envoi accueil PDF
 * Boutons WhatsApp pré-remplis : OUI (reçoit le PDF accueil) / NON (reçoit la marche à suivre)
 * Usage : npx tsx scripts/send-exposants-sondage-stand.ts --send
 */
import "dotenv/config";
import { PrismaClient } from "@prisma/client";
import { Resend } from "resend";
import fs from "fs";

const prisma = new PrismaClient();
const resend = new Resend(process.env.RESEND_API_KEY);
const FROM = process.env.EMAIL_FROM ?? "Dream Team Africa <hello@dreamteamafrica.com>";
const SEND = process.argv.includes("--send");

const accueilPdf = fs.readFileSync("/Users/yaps225/Documents/Projets/dreamteamafrica/accueil-exposants-foire-2026.pdf");

function buildHtml(contactName: string, companyName: string) {
  const firstName = contactName.split(" ")[0] || "Bonjour";

  const waOui = `https://wa.me/33782801852?text=${encodeURIComponent(`✅ Oui, j'ai réservé mon stand pour la Foire d'Afrique Paris.\n\nNom : ${contactName}\nMarque : ${companyName}\n\nMerci de m'envoyer le guide d'accueil exposant.`)}`;
  const waNon = `https://wa.me/33782801852?text=${encodeURIComponent(`❌ Non, je n'ai pas encore réservé mon stand.\n\nNom : ${contactName}\nMarque : ${companyName}\n\nPouvez-vous m'aider à finaliser ma réservation ?`)}`;

  return `<div style="font-family: Helvetica Neue, Arial, sans-serif; max-width: 600px; margin: 0 auto; color: #2d2d2d;">
  <div style="text-align: center; padding: 24px 0; background: #ffffff;">
    <img src="https://dreamteamafricamedia.b-cdn.net/logo/logo-saison-culturelle-africaine-2026.jpg" alt="Saison Culturelle Africaine Paris 2026" style="max-width: 320px; width: 70%; height: auto;" />
  </div>
  <div style="background: #1a1a1a; padding: 28px 32px; text-align: center;">
    <p style="color: #E8A020; font-size: 11px; text-transform: uppercase; letter-spacing: 0.15em; font-weight: 600; margin: 0 0 10px;">Foire d'Afrique Paris &mdash; 1er &amp; 2 mai 2026</p>
    <h1 style="font-family: Georgia, serif; font-size: 22px; color: #ffffff; line-height: 1.3; margin: 0;">Choisissez votre emplacement<br/><span style="color: #E8A020;">J-23</span></h1>
  </div>
  <div style="background: #ffffff; padding: 32px; border: 1px solid #e8e4df; border-top: none;">

    <p style="font-size: 15px; line-height: 1.7; margin: 0 0 16px;">Bonjour <strong>${firstName}</strong>,</p>

    <p style="font-size: 14px; line-height: 1.7; color: #444; margin: 0 0 16px;">La Foire d'Afrique Paris est dans <strong>23 jours</strong> ! Il est temps de <strong>choisir votre emplacement</strong> sur le plan interactif.</p>

    <!-- ÉTAPES -->
    <div style="background: #FAF8F4; border-radius: 12px; padding: 20px; margin: 20px 0;">
      <p style="margin: 0 0 12px; font-size: 14px; font-weight: bold; color: #8B6F4E;">Comment choisir votre stand :</p>
      <table style="width: 100%; border-collapse: collapse;">
        <tr>
          <td style="padding: 8px 12px; vertical-align: top; width: 30px; font-size: 18px;">1️⃣</td>
          <td style="padding: 8px 0; font-size: 13px; color: #555;">Connectez-vous sur <a href="https://dreamteamafrica.com/dashboard/mon-stand" style="color: #C4704B; font-weight: bold;">dreamteamafrica.com/dashboard/mon-stand</a></td>
        </tr>
        <tr>
          <td style="padding: 8px 12px; vertical-align: top; font-size: 18px;">2️⃣</td>
          <td style="padding: 8px 0; font-size: 13px; color: #555;">Consultez le <strong>plan interactif</strong> de l'Espace MAS</td>
        </tr>
        <tr>
          <td style="padding: 8px 12px; vertical-align: top; font-size: 18px;">3️⃣</td>
          <td style="padding: 8px 0; font-size: 13px; color: #555;">Cliquez sur le <strong>stand de votre choix</strong> (les stands disponibles sont en vert)</td>
        </tr>
        <tr>
          <td style="padding: 8px 12px; vertical-align: top; font-size: 18px;">4️⃣</td>
          <td style="padding: 8px 0; font-size: 13px; color: #555;"><strong>Confirmez</strong> — c'est fait !</td>
        </tr>
      </table>
    </div>

    <!-- CTA DASHBOARD -->
    <div style="text-align: center; margin: 24px 0;">
      <a href="https://dreamteamafrica.com/dashboard/mon-stand" style="display: inline-block; background: #A0522D; color: #fff; padding: 14px 36px; border-radius: 10px; font-weight: 700; font-size: 15px; text-decoration: none;">Choisir mon emplacement</a>
    </div>

    <!-- SONDAGE -->
    <div style="border: 2px solid #E8DFD3; border-radius: 12px; padding: 24px; margin: 28px 0; text-align: center;">
      <p style="margin: 0 0 6px; font-size: 16px; font-weight: bold; color: #1a1a1a;">Avez-vous r&eacute;serv&eacute; votre stand ?</p>
      <p style="margin: 0 0 20px; font-size: 12px; color: #999;">R&eacute;pondez en un clic via WhatsApp</p>
      <table style="margin: 0 auto;" cellspacing="12">
        <tr>
          <td>
            <a href="${waOui}" style="display: inline-block; background: #25D366; color: #fff; padding: 14px 32px; border-radius: 10px; font-weight: 700; font-size: 14px; text-decoration: none;">✅ Oui</a>
          </td>
          <td>
            <a href="${waNon}" style="display: inline-block; background: #dc2626; color: #fff; padding: 14px 32px; border-radius: 10px; font-weight: 700; font-size: 14px; text-decoration: none;">❌ Pas encore</a>
          </td>
        </tr>
      </table>
    </div>

    <div style="background: #f0fdf4; border: 1px solid #bbf7d0; border-radius: 10px; padding: 14px 18px; text-align: center; margin-top: 16px;">
      <p style="margin: 0; font-size: 13px; color: #166534;">&#x1F4CE; Le <strong>guide d'accueil exposant</strong> complet est en pi&egrave;ce jointe de cet email.</p>
    </div>

    <p style="margin-top: 24px; font-size: 13px; color: #888; text-align: center;">Chaleureusement,<br/><strong style="color: #2d2d2d;">L'&eacute;quipe Dream Team Africa</strong></p>
  </div>
  <div style="text-align: center; padding: 20px 0; font-size: 11px; color: #999;">
    Dream Team Africa &mdash; hello@dreamteamafrica.com
  </div>
</div>`;
}

async function main() {
  console.log(SEND ? "🚀 MODE ENVOI RÉEL\n" : "🔍 MODE DRY RUN (ajoutez --send)\n");

  const bookings = await prisma.exhibitorBooking.findMany({
    select: { contactName: true, email: true, companyName: true },
  });

  const valid = bookings.filter(
    (b) => b.email && !b.email.includes("@exposant.temp") && b.email.includes("@"),
  );

  console.log(`Exposants à contacter: ${valid.length}\n`);

  let sent = 0;
  let errors = 0;

  for (const b of valid) {
    const subject = `📍 ${b.companyName} — Choisissez votre stand + Guide d'accueil exposant`;

    if (!SEND) {
      if (sent < 5) console.log(`  [DRY] ${b.email} — ${b.companyName}`);
      sent++;
      continue;
    }

    try {
      await resend.emails.send({
        from: FROM,
        to: b.email,
        replyTo: "hello@dreamteamafrica.com",
        subject,
        html: buildHtml(b.contactName, b.companyName),
        attachments: [
          {
            filename: "Accueil-Exposants-Foire-Afrique-2026.pdf",
            content: accueilPdf,
          },
        ],
      });
      sent++;
      console.log(`  ✓ ${b.companyName} (${b.email})`);
      await new Promise((r) => setTimeout(r, 200));
    } catch (err: any) {
      errors++;
      console.error(`  ✗ ${b.email}: ${err?.message || err}`);
    }
  }

  console.log(`\n=== TERMINÉ ===`);
  console.log(`Envoyés: ${sent}`);
  console.log(`Erreurs: ${errors}`);

  await prisma.$disconnect();
}

main().catch((e) => { console.error(e); process.exit(1); });

/**
 * Relance exposants — Demande de visuels via formulaire Tally
 * Envoie un email individuel à chaque exposant pour qu'il soumette logo + photos.
 * Usage : npx tsx scripts/send-exposants-tally-reminder.ts --send
 */
import "dotenv/config";
import { PrismaClient } from "@prisma/client";
import { Resend } from "resend";

const prisma = new PrismaClient();
const resend = new Resend(process.env.RESEND_API_KEY);
const FROM = process.env.EMAIL_FROM ?? "Dream Team Africa <hello@dreamteamafrica.com>";
const SEND = process.argv.includes("--send");
const TALLY_URL = "https://tally.so/r/31GKbl";
const WA_LINK = "https://wa.me/33782801852";

function buildHtml(contactName: string, companyName: string) {
  const firstName = contactName.split(" ")[0] || "Bonjour";
  return `<div style="font-family: Helvetica Neue, Arial, sans-serif; max-width: 600px; margin: 0 auto; color: #2d2d2d;">
  <div style="text-align: center; padding: 24px 0; background: #ffffff;">
    <img src="https://dreamteamafricamedia.b-cdn.net/logo/logo-saison-culturelle-africaine-2026.jpg" alt="Saison Culturelle Africaine Paris 2026" style="max-width: 320px; width: 70%; height: auto;" />
  </div>
  <div style="background: #1a1a1a; padding: 28px 32px; text-align: center;">
    <p style="color: #E8A020; font-size: 11px; text-transform: uppercase; letter-spacing: 0.15em; font-weight: 600; margin: 0 0 10px;">Foire d'Afrique Paris &mdash; 1er &amp; 2 mai 2026</p>
    <h1 style="font-family: Georgia, serif; font-size: 22px; color: #ffffff; line-height: 1.3; margin: 0;">Envoyez vos visuels pour<br/>votre <span style="color: #E8A020;">capsule vid&eacute;o promo</span></h1>
  </div>
  <div style="background: #ffffff; padding: 32px; border: 1px solid #e8e4df; border-top: none;">
    <p style="font-size: 15px; line-height: 1.7; margin: 0 0 16px;">Bonjour <strong>${firstName}</strong>,</p>
    <p style="font-size: 14px; line-height: 1.7; color: #444; margin: 0 0 16px;">La Foire d'Afrique Paris approche ! Pour pr&eacute;parer votre <strong>capsule vid&eacute;o promotionnelle personnalis&eacute;e</strong> (diffus&eacute;e sur +28 pages r&eacute;seaux sociaux Dream Team Africa), nous avons besoin de vos visuels.</p>

    <div style="background: #FBF8F2; border-radius: 12px; padding: 20px; margin: 20px 0;">
      <p style="margin: 0 0 12px; font-size: 14px; font-weight: bold; color: #8B6F4E;">Ce dont nous avons besoin :</p>
      <ul style="margin: 0; padding-left: 18px; font-size: 13px; color: #555; line-height: 2;">
        <li><strong>Votre logo</strong> (format PNG ou JPG)</li>
        <li><strong>3 photos de vos produits</strong> (haute qualit&eacute;)</li>
        <li><strong>Une pr&eacute;sentation</strong> de votre marque <strong>${companyName}</strong></li>
        <li>Une vid&eacute;o courte (optionnel)</li>
      </ul>
    </div>

    <p style="font-size: 14px; line-height: 1.7; color: #444; margin: 0 0 20px;">Remplissez le formulaire ci-dessous en <strong>2 minutes</strong> &mdash; nous nous occupons du reste !</p>

    <div style="text-align: center; margin: 28px 0;">
      <a href="${TALLY_URL}" style="display: inline-block; background: #A0522D; color: #fff; padding: 16px 40px; border-radius: 10px; font-weight: 700; font-size: 15px; text-decoration: none;">Envoyer mes visuels</a>
    </div>

    <div style="background: #fef2f2; border: 1px solid #fecaca; border-radius: 10px; padding: 14px 18px; text-align: center;">
      <p style="margin: 0; font-size: 13px; color: #991b1b; font-weight: 500;">&#x26A0;&#xFE0F; Sans vos visuels, nous ne pourrons pas cr&eacute;er votre capsule vid&eacute;o &agrave; temps</p>
    </div>

    <div style="background: #f0fdf4; border: 1px solid #bbf7d0; border-radius: 10px; padding: 14px 18px; text-align: center; margin-top: 20px;">
      <p style="margin: 0 0 8px; font-size: 14px; color: #166534; font-weight: 500;">Besoin d'aide ?</p>
      <a href="${WA_LINK}" style="display: inline-block; background: #25D366; color: #fff; padding: 10px 24px; border-radius: 8px; font-weight: 600; font-size: 13px; text-decoration: none;">&#x1F4AC; Nous &eacute;crire sur WhatsApp</a>
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
    select: { contactName: true, email: true, companyName: true, status: true },
  });

  // Exclure les emails temporaires
  const valid = bookings.filter(
    (b) => b.email && !b.email.includes("@exposant.temp") && b.email.includes("@"),
  );

  console.log(`Exposants à contacter: ${valid.length}\n`);

  let sent = 0;
  let errors = 0;

  for (const b of valid) {
    const subject = `📸 ${b.companyName} — Envoyez vos visuels pour votre capsule vidéo promo`;

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

main().catch((e) => {
  console.error(e);
  process.exit(1);
});

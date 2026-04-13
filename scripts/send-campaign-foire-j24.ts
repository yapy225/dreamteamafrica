/**
 * Campagne Foire d'Afrique J-24 — "Places à 10€ avant passage à 15€"
 * Envoi individuel à tous les contacts (newsletter + leads) sauf acheteurs existants.
 * Usage :
 *   npx tsx scripts/send-campaign-foire-j24.ts --dry-run   (par défaut)
 *   npx tsx scripts/send-campaign-foire-j24.ts --send       (envoi réel)
 */
import "dotenv/config";
import { PrismaClient } from "@prisma/client";
import { Resend } from "resend";

const prisma = new PrismaClient();
const resend = new Resend(process.env.RESEND_API_KEY);
const FROM = process.env.EMAIL_FROM ?? "Dream Team Africa <hello@dreamteamafrica.com>";
const SEND = process.argv.includes("--send");

const html = `<div style="font-family: Helvetica Neue, Arial, sans-serif; max-width: 600px; margin: 0 auto; color: #2d2d2d;">
  <div style="text-align: center; padding: 24px 0; background: #ffffff;">
    <img src="https://dreamteamafricamedia.b-cdn.net/logo/logo-saison-culturelle-africaine-2026.jpg" alt="Saison Culturelle Africaine Paris 2026" style="max-width: 360px; width: 80%; height: auto;" />
  </div>
  <div style="position: relative; overflow: hidden; border-radius: 16px 16px 0 0;">
    <img src="https://dreamteamafricamedia.b-cdn.net/campaigns/foire-afrique-danseuse-j24.png" alt="Foire d'Afrique Paris 2026" width="600" style="width: 100%; max-width: 600px; height: auto; display: block;" />
    <div style="position: absolute; inset: 0; background: linear-gradient(to bottom, rgba(0,0,0,0.5) 0%, rgba(0,0,0,0) 40%, rgba(0,0,0,0) 60%, rgba(0,0,0,0.6) 100%);"></div>
    <div style="position: absolute; bottom: 16px; left: 0; right: 0; text-align: center;">
      <div style="display: inline-block; background: rgba(26,36,54,0.92); border-radius: 10px; padding: 14px 24px;">
        <div style="font-family: Impact, Arial Black, sans-serif; font-size: 28px; color: #ffffff; letter-spacing: 2px; line-height: 1.1;">FOIRE D'AFRIQUE</div>
        <div style="font-family: Arial, sans-serif; font-size: 12px; margin-top: 4px;">
          <span style="color: #ffffff; font-weight: bold;">PARIS</span>
          <span style="background: #000; color: #fff; padding: 2px 6px; border-radius: 3px; font-weight: bold; margin-left: 4px;">2026</span>
          <span style="color: rgba(255,255,255,0.7); margin-left: 8px;">6&egrave;me &Eacute;dition</span>
        </div>
        <div style="border-top: 2px solid #E8A020; margin-top: 8px; padding-top: 6px;">
          <span style="font-family: Arial, sans-serif; font-size: 10px; color: #E8A020; letter-spacing: 3px; text-transform: uppercase; font-weight: bold;">Afrique &bull; Culture &bull; H&eacute;ritage</span>
        </div>
      </div>
    </div>
  </div>
  <div style="background: #1a1a1a; padding: 32px; text-align: center;">
    <p style="color: #E8A020; font-size: 12px; text-transform: uppercase; letter-spacing: 0.15em; font-weight: 600; margin: 0 0 14px;">Saison Culturelle Africaine pr&eacute;sente</p>
    <h1 style="font-family: Georgia, serif; font-size: 26px; color: #ffffff; line-height: 1.3; margin: 0 0 12px;">Places encore disponibles<br/>au tarif de <span style="color: #E8A020;">10 &euro;</span></h1>
    <p style="color: rgba(255,255,255,0.75); font-size: 14px; margin: 0;">Foire d'Afrique Paris &mdash; 6&egrave;me &Eacute;dition</p>
  </div>
  <div style="background: #ffffff; padding: 32px; border-radius: 0 0 16px 16px; border: 1px solid #e8e4df; border-top: none;">
    <p style="font-size: 15px; line-height: 1.7; margin: 0 0 20px;"><strong>La Foire d'Afrique Paris revient dans 24 jours.</strong></p>
    <p style="font-size: 14px; line-height: 1.7; color: #444; margin: 0 0 20px;">Les tarifs Early Bird &agrave; 5&euro; et Last Chance &agrave; 7&euro; sont <strong>&eacute;puis&eacute;s</strong> &mdash; plus de 348 billets vendus. Il reste encore des <strong>places &agrave; 10&euro;</strong>.</p>
    <p style="font-size: 14px; line-height: 1.7; color: #444; margin: 0 0 24px;">Profitez-en avant &eacute;puisement et <strong>passage au tarif de 15&euro;</strong>.</p>
    <div style="background: #FBF8F2; border-radius: 12px; padding: 20px; margin-bottom: 24px;">
      <table style="width: 100%; border-collapse: collapse;">
        <tr><td style="padding: 6px 0; font-size: 13px; color: #888; width: 80px;">&#x1F4C5; Dates</td><td style="padding: 6px 0; font-size: 14px; font-weight: 600; color: #1a1a1a;">1er et 2 mai 2026</td></tr>
        <tr><td style="padding: 6px 0; font-size: 13px; color: #888;">&#x1F552; Horaires</td><td style="padding: 6px 0; font-size: 14px; font-weight: 600; color: #1a1a1a;">12h &ndash; 22h</td></tr>
        <tr><td style="padding: 6px 0; font-size: 13px; color: #888;">&#x1F4CD; Lieu</td><td style="padding: 6px 0; font-size: 14px; font-weight: 600; color: #1a1a1a;">Espace MAS, 10 rue des Terres au Cur&eacute;, Paris 13e</td></tr>
      </table>
    </div>
    <p style="font-size: 14px; color: #444; text-align: center; margin: 0 0 24px;"><strong>+60 exposants confirm&eacute;s</strong> &bull; Gastronomie &bull; Mode &amp; artisanat &bull; Culture &amp; musique live</p>
    <div style="background: #C4704B; border-radius: 14px; padding: 24px; text-align: center; margin-bottom: 24px;">
      <div style="color: rgba(255,255,255,0.8); font-size: 12px; text-transform: uppercase; letter-spacing: 0.1em; margin-bottom: 8px;">Tarif en cours</div>
      <table style="margin: 0 auto;"><tr><td style="font-family: Georgia, serif; font-size: 42px; font-weight: 700; color: #fff; padding-right: 12px;">10 &euro;</td><td style="font-size: 16px; color: rgba(255,255,255,0.6); text-decoration: line-through; vertical-align: middle;">15 &euro;</td></tr></table>
      <div style="color: rgba(255,255,255,0.8); font-size: 12px; margin-top: 6px;">avant passage &agrave; 15&euro; &mdash; &eacute;conomisez 33%</div>
    </div>
    <div style="text-align: center; margin-bottom: 24px;">
      <a href="https://dreamteamafrica.com/saison-culturelle-africaine/foire-dafrique-paris" style="display: inline-block; background: #dc2626; color: #fff; padding: 16px 40px; border-radius: 10px; font-weight: 700; font-size: 15px; text-decoration: none;">Je prends mon billet &agrave; 10&euro;</a>
    </div>
    <div style="background: #fef2f2; border: 1px solid #fecaca; border-radius: 10px; padding: 14px 18px; text-align: center;">
      <p style="margin: 0; font-size: 13px; color: #991b1b; font-weight: 500;">&#x26A0;&#xFE0F; Prochain palier : <strong>15&euro;</strong> &mdash; profitez du tarif &agrave; 10&euro; avant &eacute;puisement</p>
    </div>
    <div style="background: #f0fdf4; border: 1px solid #bbf7d0; border-radius: 10px; padding: 14px 18px; text-align: center; margin-top: 20px;">
      <p style="margin: 0 0 8px; font-size: 14px; color: #166534; font-weight: 500;">Une question ? &Eacute;crivez-nous sur WhatsApp</p>
      <a href="https://wa.me/33782801852?text=Bonjour%2C%20je%20suis%20int%C3%A9ress%C3%A9(e)%20par%20la%20Foire%20d'Afrique%20Paris" style="display: inline-block; background: #25D366; color: #fff; padding: 10px 24px; border-radius: 8px; font-weight: 600; font-size: 13px; text-decoration: none;">&#x1F4AC; Nous &eacute;crire sur WhatsApp</a>
    </div>
    <p style="margin-top: 24px; font-size: 13px; color: #888; text-align: center;">Chaleureusement,<br/><strong style="color: #2d2d2d;">L'&eacute;quipe Dream Team Africa</strong></p>
  </div>
  <div style="text-align: center; padding: 20px 0; font-size: 11px; color: #999;">
    Dream Team Africa &mdash; hello@dreamteamafrica.com<br/>
    <a href="https://dreamteamafrica.com/unsubscribe" style="color: #999; text-decoration: underline;">Se d&eacute;sinscrire</a>
  </div>
</div>`;

async function main() {
  console.log(SEND ? "🚀 MODE ENVOI RÉEL" : "🔍 MODE DRY RUN (ajoutez --send pour envoyer)\n");

  // 1. Collecter tous les emails (newsletter + leads)
  const [subscribers, leads] = await Promise.all([
    prisma.newsletterSubscriber.findMany({
      where: { isActive: true },
      select: { email: true },
    }),
    prisma.lead.findMany({
      select: { email: true },
    }),
  ]);

  const allEmails = new Set<string>();
  for (const s of subscribers) allEmails.add(s.email.toLowerCase().trim());
  for (const l of leads) allEmails.add(l.email.toLowerCase().trim());

  // 2. Exclure les acheteurs existants
  const tickets = await prisma.ticket.findMany({
    where: { eventId: "cmm767c1m0005ti794z61tzux" },
    select: { email: true },
  });
  const buyers = new Set(tickets.filter((t) => t.email).map((t) => t.email!.toLowerCase().trim()));

  // 3. Exclure test emails
  const toSend = [...allEmails].filter(
    (e) => !buyers.has(e) && !e.includes("test@") && !e.includes("dreamteamafrica") && e.includes("@"),
  );

  console.log(`Newsletter: ${subscribers.length}`);
  console.log(`Leads Facebook: ${leads.length}`);
  console.log(`Total uniques: ${allEmails.size}`);
  console.log(`Acheteurs exclus: ${buyers.size}`);
  console.log(`À envoyer: ${toSend.length}\n`);

  if (!SEND) {
    console.log("Premiers destinataires:");
    toSend.slice(0, 5).forEach((e) => console.log(`  ${e}`));
    console.log(`  ... et ${toSend.length - 5} autres`);
    await prisma.$disconnect();
    return;
  }

  // 4. Envoi individuel
  let sent = 0;
  let errors = 0;

  for (const email of toSend) {
    try {
      await resend.emails.send({
        from: FROM,
        to: email,
        subject: "🎪 Places à 10€ — Foire d'Afrique Paris — Avant passage à 15€",
        html,
        headers: {
          "List-Unsubscribe": `<https://dreamteamafrica.com/unsubscribe?email=${encodeURIComponent(email)}>`,
          "List-Unsubscribe-Post": "List-Unsubscribe=One-Click",
        },
        tags: [
          { name: "campaign_id", value: "foire_j24_10eur" },
          { name: "type", value: "campaign" },
        ],
      });
      sent++;
      if (sent % 100 === 0) console.log(`  ✓ ${sent}/${toSend.length} envoyés...`);
      await new Promise((r) => setTimeout(r, 200));
    } catch (err: any) {
      errors++;
      if (errors <= 10) console.error(`  ✗ ${email}: ${err?.message || err}`);
      if (err?.statusCode === 429) {
        console.log("  ⏳ Rate limited, pause 3s...");
        await new Promise((r) => setTimeout(r, 3000));
      }
    }
  }

  console.log(`\n=== TERMINÉ ===`);
  console.log(`Envoyés: ${sent}`);
  console.log(`Erreurs: ${errors}`);
  console.log(`Total: ${toSend.length}`);

  await prisma.$disconnect();
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});

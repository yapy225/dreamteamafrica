import "dotenv/config";
import fs from "fs";
import { prisma } from "../src/lib/db";
import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);
const FROM = process.env.EMAIL_FROM ?? "Dream Team Africa <hello@dreamteamafrica.com>";

const html = `<div style="font-family: Helvetica Neue, Arial, sans-serif; max-width: 600px; margin: 0 auto; color: #2d2d2d;">
  <div style="text-align: center; padding: 24px 0;">
    <img src="https://dreamteamafricamedia.b-cdn.net/logo/dream-team-africa-logo.png" alt="Dream Team Africa" style="height: 60px;" />
  </div>
  <img src="https://dreamteamafricamedia.b-cdn.net/saisonculturelleafricaine/foiredafriqueparis/foiredafriqueparis.png" alt="Foire d Afrique Paris" width="600" style="width: 100%; max-width: 600px; height: auto; display: block; border-radius: 16px 16px 0 0;" />
  <div style="background: #1a1a1a; padding: 32px; text-align: center;">
    <p style="color: #E8A020; font-size: 12px; text-transform: uppercase; letter-spacing: 0.15em; font-weight: 600; margin: 0 0 14px;">Saison Culturelle Africaine presente</p>
    <h1 style="font-family: Georgia, serif; font-size: 26px; color: #ffffff; line-height: 1.3; margin: 0 0 12px;">30 places supplementaires<br/>au tarif de <span style="color: #E8A020;">7 EUR</span></h1>
    <p style="color: rgba(255,255,255,0.75); font-size: 14px; margin: 0;">Foire d'Afrique Paris — 6eme Edition</p>
  </div>
  <div style="background: #ffffff; padding: 32px; border-radius: 0 0 16px 16px; border: 1px solid #e8e4df; border-top: none;">
    <p style="font-size: 15px; line-height: 1.7; margin: 0 0 20px;"><strong>L'engouement a parle.</strong></p>
    <p style="font-size: 14px; line-height: 1.7; color: #444; margin: 0 0 20px;">La promo Last Chance de la Foire d'Afrique Paris s'est envolee en quelques jours. Face a la demande, nous ouvrons <strong>30 places supplementaires a 7 EUR</strong>.</p>
    <p style="font-size: 14px; line-height: 1.7; color: #444; margin: 0 0 24px;">C'est votre <strong>toute derniere chance</strong> avant le passage au tarif de 10 EUR.</p>
    <div style="background: #FBF8F2; border-radius: 12px; padding: 20px; margin-bottom: 24px;">
      <table style="width: 100%; border-collapse: collapse;">
        <tr><td style="padding: 6px 0; font-size: 13px; color: #888; width: 80px;">Dates</td><td style="padding: 6px 0; font-size: 14px; font-weight: 600; color: #1a1a1a;">1er et 2 mai 2026</td></tr>
        <tr><td style="padding: 6px 0; font-size: 13px; color: #888;">Horaires</td><td style="padding: 6px 0; font-size: 14px; font-weight: 600; color: #1a1a1a;">12h - 22h</td></tr>
        <tr><td style="padding: 6px 0; font-size: 13px; color: #888;">Lieu</td><td style="padding: 6px 0; font-size: 14px; font-weight: 600; color: #1a1a1a;">Espace MAS, 10 rue des Terres au Cure, Paris 13e</td></tr>
      </table>
    </div>
    <p style="font-size: 14px; color: #444; text-align: center; margin: 0 0 24px;"><strong>+60 exposants</strong> - Gastronomie - Mode et artisanat - Culture et musique</p>
    <div style="background: #C4704B; border-radius: 14px; padding: 24px; text-align: center; margin-bottom: 24px;">
      <div style="color: rgba(255,255,255,0.8); font-size: 12px; text-transform: uppercase; letter-spacing: 0.1em; margin-bottom: 8px;">Tarif exceptionnel</div>
      <table style="margin: 0 auto;"><tr><td style="font-family: Georgia, serif; font-size: 42px; font-weight: 700; color: #fff; padding-right: 12px;">7 EUR</td><td style="font-size: 16px; color: rgba(255,255,255,0.6); text-decoration: line-through; vertical-align: middle;">10 EUR</td></tr></table>
      <div style="color: rgba(255,255,255,0.8); font-size: 12px; margin-top: 6px;">au lieu de 10 EUR - economisez 30%</div>
    </div>
    <div style="text-align: center; margin-bottom: 24px;">
      <a href="https://dreamteamafrica.com/saison-culturelle-africaine/foire-dafrique-paris" style="display: inline-block; background: #dc2626; color: #fff; padding: 16px 40px; border-radius: 10px; font-weight: 700; font-size: 15px; text-decoration: none;">Je prends mon billet a 7 EUR</a>
    </div>
    <div style="background: #fef2f2; border: 1px solid #fecaca; border-radius: 10px; padding: 14px 18px; text-align: center;">
      <p style="margin: 0; font-size: 13px; color: #991b1b; font-weight: 500;">Seulement 30 places disponibles - une fois ecoulees, le tarif passe a 10 EUR</p>
    </div>
    <div style="background: #f0fdf4; border: 1px solid #bbf7d0; border-radius: 10px; padding: 14px 18px; text-align: center; margin-top: 20px;">
      <p style="margin: 0 0 8px; font-size: 14px; color: #166534; font-weight: 500;">Une question ? Ecrivez-nous sur WhatsApp</p>
      <a href="https://wa.me/33623914142?text=Bonjour%2C%20je%20suis%20interesse%20par%20les%2030%20places%20a%207EUR%20pour%20la%20Foire%20d%20Afrique%20Paris" style="display: inline-block; background: #25D366; color: #fff; padding: 10px 24px; border-radius: 8px; font-weight: 600; font-size: 13px; text-decoration: none;">Nous ecrire sur WhatsApp</a>
    </div>
    <p style="margin-top: 24px; font-size: 13px; color: #888; text-align: center;">Chaleureusement,<br/><strong style="color: #2d2d2d;">L'equipe Dream Team Africa</strong></p>
  </div>
  <div style="text-align: center; padding: 20px 0; font-size: 11px; color: #999;">
    Dream Team Africa - hello@dreamteamafrica.com<br/>
    <a href="https://dreamteamafrica.com/unsubscribe" style="color: #999; text-decoration: underline;">Se desinscrire</a>
  </div>
</div>`;

async function main() {
  // 1. Parse CSV leads
  const csv = fs.readFileSync("/Users/yaps225/Downloads/Leads_FoireAfrique_EarlyBird - Feuille 1 (1).csv", "utf-8");
  const lines = csv.trim().split("\n").slice(1);

  const csvLeads = lines.map((line) => {
    const cols = line.split(",");
    return { email: (cols[14] || "").trim().toLowerCase() };
  }).filter((l) => l.email && l.email.includes("@") && !l.email.includes("test@"));

  // 2. Get newsletter subscribers from DB
  const subs = await prisma.newsletterSubscriber.findMany({
    where: { isActive: true },
    select: { email: true },
  });
  const dbLeads = subs.map((s) => ({ email: s.email.toLowerCase() }));

  // 3. Merge + dedupe
  const seen = new Set<string>();
  const allLeads: { email: string }[] = [];
  for (const l of [...csvLeads, ...dbLeads]) {
    if (seen.has(l.email)) continue;
    seen.add(l.email);
    allLeads.push(l);
  }

  // 4. Exclude existing buyers
  const tickets = await prisma.ticket.findMany({
    where: { eventId: "cmm767c1m0005ti794z61tzux" },
    select: { email: true },
  });
  const buyers = new Set(tickets.map((t) => t.email.toLowerCase()));

  const toSend = allLeads.filter((l) => !buyers.has(l.email));

  console.log(`CSV: ${csvLeads.length} | BDD: ${dbLeads.length}`);
  console.log(`Fusionnes uniques: ${allLeads.length}`);
  console.log(`Acheteurs exclus: ${allLeads.length - toSend.length}`);
  console.log(`A envoyer: ${toSend.length}`);

  // 3. Check --dry-run flag
  if (process.argv.includes("--dry-run")) {
    console.log("\n--dry-run: pas d'envoi.");
    await prisma.$disconnect();
    return;
  }

  // 4. Send individually
  let sent = 0;
  let errors = 0;

  for (const lead of toSend) {
    try {
      await resend.emails.send({
        from: FROM,
        to: lead.email,
        subject: "30 dernieres places a 7 EUR — Foire d'Afrique Paris",
        html,
        headers: {
          "List-Unsubscribe": `<https://dreamteamafrica.com/unsubscribe?email=${encodeURIComponent(lead.email)}>`,
          "List-Unsubscribe-Post": "List-Unsubscribe=One-Click",
        },
        tags: [
          { name: "campaign_id", value: "foire_lastchance_30places" },
          { name: "type", value: "campaign" },
        ],
      });
      sent++;
      if (sent % 50 === 0) console.log(`Envoyé: ${sent}/${toSend.length}`);
      // Rate limit: 200ms between emails
      await new Promise((r) => setTimeout(r, 200));
    } catch (err: any) {
      errors++;
      console.error(`ERREUR ${lead.email}:`, err?.message || err);
      // If rate limited, wait 2 seconds
      if (err?.statusCode === 429) {
        await new Promise((r) => setTimeout(r, 2000));
      }
    }
  }

  console.log(`\nTermine: ${sent} envoyes, ${errors} erreurs sur ${toSend.length}`);
  await prisma.$disconnect();
}

main();

import "dotenv/config";
import fs from "fs";
import { Resend } from "resend";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();
const resend = new Resend(process.env.RESEND_API_KEY);
const FROM = process.env.EMAIL_FROM || "Dream Team Africa <hello@dreamteamafrica.com>";
const APP_URL = "https://dreamteamafrica.com";
const WA_LINK = "https://wa.me/33782801852";
const AFFICHE = "https://dreamteamafricamedia.b-cdn.net/foiredafriqueparis/affiche/affiche-foiredafriqueparis-carre.png";

const header = `<div style="position:relative;height:280px;overflow:hidden;"><img src="${AFFICHE}" alt="Foire d'Afrique Paris 2026" style="width:100%;height:280px;object-fit:cover;display:block;" /><div style="position:absolute;inset:0;background:linear-gradient(to bottom,rgba(0,0,0,0.3),rgba(0,0,0,0.8));"></div><div style="position:absolute;bottom:0;left:0;right:0;padding:24px 32px;"><h1 style="margin:0;color:#d4af37;font-size:24px;font-weight:bold;">Dream Team Africa</h1><p style="margin:6px 0 0;font-size:13px;text-transform:uppercase;letter-spacing:2px;color:rgba(255,255,255,0.8);">Foire d'Afrique Paris &mdash; 1er &amp; 2 mai 2026</p></div></div>`;

const footer = `<div style="border-top:1px solid #eee;padding-top:20px;margin-top:24px;text-align:center;"><p style="margin:0 0 12px;font-size:13px;color:#666;">Une question ? R&eacute;pondez par WhatsApp :</p><a href="${WA_LINK}" style="display:inline-block;background:#25D366;color:#fff;text-decoration:none;padding:10px 24px;border-radius:8px;font-size:13px;font-weight:bold;">&#x1F4AC; Nous &eacute;crire sur WhatsApp</a></div><div style="border-top:1px solid #eee;padding-top:16px;margin-top:20px;text-align:center;"><p style="margin:0 0 8px;font-size:12px;color:#999;">Suivez-nous pour ne rien manquer</p><p style="margin:0;font-size:13px;"><a href="https://www.facebook.com/FoiredAfriqueParis" style="color:#1877F2;text-decoration:none;margin:0 8px;">Facebook</a> <a href="https://www.instagram.com/foire_dafrique_paris" style="color:#E4405F;text-decoration:none;margin:0 8px;">Instagram</a> <a href="https://www.tiktok.com/@dreamteamafrica" style="color:#000;text-decoration:none;margin:0 8px;">TikTok</a></p></div>`;

function wrap(body: string) {
  return `<div style="max-width:560px;margin:40px auto;background:#fff;border-radius:16px;overflow:hidden;box-shadow:0 4px 20px rgba(0,0,0,0.08);font-family:Arial,sans-serif;">${header}<div style="padding:32px;">${body}${footer}</div><div style="background:#FAF8F5;padding:16px 32px;text-align:center;border-top:1px solid #E8DFD3;"><p style="margin:0;color:#999;font-size:11px;">&copy; 2026 Dream Team Africa &mdash; hello@dreamteamafrica.com</p></div></div>`;
}

function visiteurEmail(firstName: string) {
  return {
    subject: `🎪 ${firstName}, 2ème vague Early Bird — 80 billets à 5€ !`,
    html: wrap(`
<p style="margin:0 0 16px;font-size:16px;color:#1A1A1A;">Bonjour <strong>${firstName}</strong>,</p>
<p style="margin:0 0 16px;font-size:15px;line-height:1.6;color:#444;">Bonne nouvelle ! La premi&egrave;re vague de <strong>100 billets Early Bird</strong> s'est &eacute;coul&eacute;e en quelques jours. Suite &agrave; ce succ&egrave;s, nous avons d&eacute;cid&eacute; de lancer une <strong>2&egrave;me vague exceptionnelle de 100 billets &agrave; 5&euro;</strong> !</p>
<div style="background:#FEF2F2;border:1px solid #FECACA;border-radius:10px;padding:16px;margin:20px 0;text-align:center;">
  <p style="margin:0;font-size:20px;font-weight:bold;color:#DC2626;">&#x1F525; D&eacute;j&agrave; 120 billets vendus</p>
  <p style="margin:6px 0 0;font-size:13px;color:#991B1B;">Il ne reste que <strong>80 billets Early Bird</strong> &agrave; 5&euro; &mdash; ne tardez pas !</p>
</div>
<div style="background:#F0FDF4;border:1px solid #BBF7D0;border-radius:10px;padding:16px;margin:20px 0;">
  <p style="margin:0;font-size:14px;color:#166534;font-weight:bold;">Ce qui vous attend :</p>
  <ul style="margin:8px 0 0;padding-left:18px;font-size:13px;color:#166534;line-height:2;">
    <li><strong>+60 exposants</strong> &mdash; Mode, bijoux, cosm&eacute;tiques, gastronomie, artisanat, jeux</li>
    <li><strong>Sc&egrave;ne Masterclass</strong> &mdash; Pitchs d'entrepreneurs (48 places)</li>
    <li><strong>Espace Restauration</strong> &mdash; 4 traiteurs africains</li>
    <li><strong>Espace MAS</strong> &mdash; Paris 13e, 12h-22h</li>
  </ul>
</div>
<div style="text-align:center;margin:28px 0;">
  <a href="${APP_URL}/saison-culturelle-africaine/foire-dafrique-paris" style="display:inline-block;background:#A0522D;color:#fff;text-decoration:none;padding:16px 40px;border-radius:10px;font-weight:bold;font-size:16px;">R&eacute;server mon billet &agrave; 5&euro;</a>
</div>
<p style="margin:0;font-size:13px;color:#999;text-align:center;">Places limit&eacute;es &mdash; premier arriv&eacute;, premier servi</p>`),
  };
}

function exposantEmail(firstName: string) {
  return {
    subject: `🏪 ${firstName}, réservez votre stand — seulement 50€ d'acompte`,
    html: wrap(`
<p style="margin:0 0 16px;font-size:16px;color:#1A1A1A;">Bonjour <strong>${firstName}</strong>,</p>
<p style="margin:0 0 16px;font-size:15px;line-height:1.6;color:#444;">Vous avez manifest&eacute; votre int&eacute;r&ecirc;t pour exposer &agrave; la Foire d'Afrique Paris. <strong>Il ne reste que 37 stands sur 60</strong> &mdash; r&eacute;servez le v&ocirc;tre !</p>
<div style="background:#FDF8F0;border:1px solid #E8DFD3;border-radius:10px;padding:16px;margin:20px 0;">
  <p style="margin:0 0 8px;font-size:14px;font-weight:bold;color:#8B6F4E;">Nos tarifs :</p>
  <ul style="margin:0;padding-left:18px;font-size:13px;color:#555;line-height:2;">
    <li>Pack Entrepreneur 1 jour : <strong>190 &euro;</strong></li>
    <li>Pack Entrepreneur 2 jours : <strong>320 &euro;</strong></li>
    <li>Acompte : <strong>seulement 50 &euro;</strong></li>
    <li>Paiement en <strong>5 fois sans frais</strong></li>
  </ul>
</div>
<div style="background:#F0FDF4;border:1px solid #BBF7D0;border-radius:10px;padding:16px;margin:20px 0;">
  <p style="margin:0;font-size:14px;color:#166534;font-weight:bold;">Inclus :</p>
  <ul style="margin:8px 0 0;padding-left:18px;font-size:13px;color:#166534;line-height:2;">
    <li>Stand 2m&sup2; &eacute;quip&eacute; (table + chaises + badges)</li>
    <li>Promotion sur <strong>7 plateformes</strong></li>
    <li>Plan interactif &mdash; <strong>choisissez votre emplacement</strong></li>
    <li>+20 exposants d&eacute;j&agrave; confirm&eacute;s</li>
  </ul>
</div>
<div style="text-align:center;margin:28px 0;">
  <a href="${APP_URL}/resa-exposants/foire-dafrique-paris" style="display:inline-block;background:#A0522D;color:#fff;text-decoration:none;padding:16px 40px;border-radius:10px;font-weight:bold;font-size:16px;">R&eacute;server &mdash; 50&euro; d'acompte</a>
</div>
<p style="text-align:center;margin:0 0 20px;"><a href="${APP_URL}/billetterie-exposants" style="color:#A0522D;font-weight:bold;font-size:13px;">Voir tous les &eacute;v&eacute;nements 2026</a></p>`),
  };
}

function artisteEmail(firstName: string) {
  return {
    subject: `🎤 ${firstName}, proposez votre candidature — Saison 2026`,
    html: wrap(`
<p style="margin:0 0 16px;font-size:16px;color:#1A1A1A;">Bonjour <strong>${firstName}</strong>,</p>
<p style="margin:0 0 16px;font-size:15px;line-height:1.6;color:#444;">Merci pour votre int&eacute;r&ecirc;t pour notre programmation artistique ! Notre pr&eacute;sidente <strong>Yvylee KOFFI</strong> et son comit&eacute; de s&eacute;lection examinent toutes les candidatures.</p>
<div style="background:#F5F0FF;border:1px solid #DDD6FE;border-radius:10px;padding:16px;margin:20px 0;">
  <p style="margin:0 0 8px;font-size:14px;font-weight:bold;color:#7C3AED;">&Eacute;v&eacute;nements ouverts aux artistes :</p>
  <ul style="margin:0;padding-left:18px;font-size:13px;color:#555;line-height:2;">
    <li><strong>Festival de l'Autre Culture</strong> &mdash; 27 juin 2026</li>
    <li><strong>Fashion Week Africa</strong> &mdash; 3 octobre 2026</li>
    <li><strong>Juste Une Danse</strong> &mdash; 29 octobre 2026</li>
    <li><strong>Festival du Conte Africain</strong> &mdash; 11 novembre 2026</li>
    <li><strong>Foire d'Afrique Paris</strong> &mdash; Masterclass</li>
  </ul>
</div>
<p style="margin:0 0 16px;font-size:15px;line-height:1.6;color:#444;">Envoyez votre dossier artistique (bio, photos, liens vid&eacute;os, r&eacute;seaux sociaux) &agrave; :</p>
<div style="text-align:center;margin:28px 0;">
  <a href="mailto:hello@dreamteamafrica.com?subject=Candidature%20artistique%20-%20Saison%202026" style="display:inline-block;background:#7C3AED;color:#fff;text-decoration:none;padding:16px 40px;border-radius:10px;font-weight:bold;font-size:16px;">Envoyer mon dossier</a>
</div>
<p style="margin:0;font-size:13px;color:#666;text-align:center;">&Agrave; l'attention de <strong>Yvylee KOFFI</strong>, Pr&eacute;sidente &amp; Comit&eacute; de s&eacute;lection</p>`),
  };
}

async function main() {
  const csv = fs.readFileSync(
    "/Users/yaps225/Downloads/Leads_FoireAfrique_EarlyBird - Feuille 1.csv",
    "utf-8",
  );
  const lines = csv.trim().split("\n");
  const header = lines[0].split(",");

  const leads = lines
    .slice(1)
    .filter((l) => !l.includes("test lead"))
    .map((l) => {
      const cols = l.split(",");
      return {
        name: cols[header.indexOf("full_name")] || "",
        email: cols[header.indexOf("email")] || "",
        phone: cols[header.indexOf("whatsapp_number")] || "",
        type: cols[header.indexOf("vous_êtes_?")] || "visiteur",
      };
    });

  console.log(`Total leads: ${leads.length}`);
  console.log("");

  let sent = 0;
  let failed = 0;
  const stats = { visiteur: 0, exposant: 0, artiste: 0, autre: 0 };

  for (const lead of leads) {
    const firstName = lead.name.split(" ")[0] || "Bonjour";
    const type = lead.type.toLowerCase();

    let emailContent: { subject: string; html: string };

    if (type === "exposant") {
      emailContent = exposantEmail(firstName);
      stats.exposant++;
    } else if (type === "artiste") {
      emailContent = artisteEmail(firstName);
      stats.artiste++;
    } else {
      emailContent = visiteurEmail(firstName);
      if (type === "autre") stats.autre++;
      else stats.visiteur++;
    }

    try {
      await resend.emails.send({
        from: FROM,
        to: lead.email,
        replyTo: "hello@dreamteamafrica.com",
        subject: emailContent.subject,
        html: emailContent.html,
      });

      await prisma.lead.upsert({
        where: { fbLeadId: lead.email },
        create: {
          name: lead.name,
          email: lead.email,
          phone: lead.phone,
          source: "facebook_leads",
          profile: type === "exposant" ? "Exposant" : type === "artiste" ? "Artiste" : "Visiteur",
          converted: false,
        },
        update: {},
      });

      sent++;
      if (sent % 50 === 0) console.log(`  ...${sent} envoyés`);

      await new Promise((r) => setTimeout(r, 150));
    } catch (err: unknown) {
      failed++;
      if (failed <= 5) {
        const msg = err instanceof Error ? err.message : String(err);
        console.error(`✗ ${lead.email}: ${msg}`);
      }
    }
  }

  console.log("");
  console.log("=== RÉSULTAT ===");
  console.log(`Envoyés: ${sent}`);
  console.log(`Échoués: ${failed}`);
  console.log(`Visiteurs: ${stats.visiteur}`);
  console.log(`Exposants: ${stats.exposant}`);
  console.log(`Artistes: ${stats.artiste}`);
  console.log(`Autres: ${stats.autre}`);

  await prisma.$disconnect();
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});

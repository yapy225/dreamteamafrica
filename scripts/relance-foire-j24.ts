/**
 * Campagne de relance J-24 — Foire d'Afrique Paris 2026
 * Cible : leads Facebook non convertis (table Lead, converted = false)
 * Usage : npx tsx scripts/relance-foire-j24.ts
 */
import "dotenv/config";
import { Resend } from "resend";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();
const resend = new Resend(process.env.RESEND_API_KEY);
const FROM = process.env.EMAIL_FROM || "Dream Team Africa <hello@dreamteamafrica.com>";
const APP_URL = "https://dreamteamafrica.com";
const WA_LINK = "https://wa.me/33782801852";
const AFFICHE = "https://dreamteamafricamedia.b-cdn.net/foiredafriqueparis/affiche/affiche-foiredafriqueparis-carre.png";

const header = `<div style="position:relative;height:280px;overflow:hidden;"><img src="${AFFICHE}" alt="Foire d'Afrique Paris 2026" style="width:100%;height:280px;object-fit:cover;display:block;" /><div style="position:absolute;inset:0;background:linear-gradient(to bottom,rgba(0,0,0,0.3),rgba(0,0,0,0.8));"></div><div style="position:absolute;bottom:0;left:0;right:0;padding:24px 32px;"><h1 style="margin:0;color:#d4af37;font-size:24px;font-weight:bold;">Dream Team Africa</h1><p style="margin:6px 0 0;font-size:13px;text-transform:uppercase;letter-spacing:2px;color:rgba(255,255,255,0.8);">Foire d'Afrique Paris &mdash; 1er &amp; 2 mai 2026</p></div></div>`;

const footer = `<div style="border-top:1px solid #eee;padding-top:20px;margin-top:24px;text-align:center;"><p style="margin:0 0 12px;font-size:13px;color:#666;">Une question ? R&eacute;pondez par WhatsApp :</p><a href="${WA_LINK}" style="display:inline-block;background:#25D366;color:#fff;text-decoration:none;padding:10px 24px;border-radius:8px;font-size:13px;font-weight:bold;">&#x1F4AC; Nous &eacute;crire sur WhatsApp</a></div><div style="border-top:1px solid #eee;padding-top:16px;margin-top:20px;text-align:center;"><p style="margin:0 0 8px;font-size:12px;color:#999;">Suivez-nous</p><p style="margin:0;font-size:13px;"><a href="https://www.facebook.com/FoiredAfriqueParis" style="color:#1877F2;text-decoration:none;margin:0 8px;">Facebook</a> <a href="https://www.instagram.com/foire_dafrique_paris" style="color:#E4405F;text-decoration:none;margin:0 8px;">Instagram</a> <a href="https://www.tiktok.com/@dreamteamafrica" style="color:#000;text-decoration:none;margin:0 8px;">TikTok</a></p></div>`;

function wrap(body: string) {
  return `<div style="max-width:560px;margin:40px auto;background:#fff;border-radius:16px;overflow:hidden;box-shadow:0 4px 20px rgba(0,0,0,0.08);font-family:Arial,sans-serif;">${header}<div style="padding:32px;">${body}${footer}</div><div style="background:#FAF8F5;padding:16px 32px;text-align:center;border-top:1px solid #E8DFD3;"><p style="margin:0;color:#999;font-size:11px;">&copy; 2026 Dream Team Africa &mdash; hello@dreamteamafrica.com</p></div></div>`;
}

function visiteurEmail(firstName: string) {
  return {
    subject: `⏰ J-24 — Foire d'Afrique Paris — Dernières places à 7€`,
    html: wrap(`
<p style="margin:0 0 16px;font-size:16px;color:#1A1A1A;">Bonjour <strong>${firstName}</strong>,</p>
<p style="margin:0 0 16px;font-size:15px;line-height:1.6;color:#444;">Vous aviez manifest&eacute; votre int&eacute;r&ecirc;t pour la <strong>Foire d'Afrique Paris</strong>. L'&eacute;v&eacute;nement approche &agrave; grands pas &mdash; <strong>plus que 24 jours</strong> !</p>

<div style="background:#FEF2F2;border:1px solid #FECACA;border-radius:10px;padding:16px;margin:20px 0;text-align:center;">
  <p style="margin:0;font-size:22px;font-weight:bold;color:#DC2626;">&#x1F525; 348 billets d&eacute;j&agrave; vendus</p>
  <p style="margin:8px 0 0;font-size:14px;color:#991B1B;">Les tarifs Early Bird &agrave; 5&euro; sont <strong>&eacute;puis&eacute;s</strong></p>
  <p style="margin:4px 0 0;font-size:14px;color:#991B1B;">Tarif <strong>Last Chance &agrave; 7&euro;</strong> encore disponible</p>
</div>

<div style="background:#F0FDF4;border:1px solid #BBF7D0;border-radius:10px;padding:16px;margin:20px 0;">
  <p style="margin:0;font-size:14px;color:#166534;font-weight:bold;">&#x1F389; Le programme :</p>
  <ul style="margin:8px 0 0;padding-left:18px;font-size:13px;color:#166534;line-height:2;">
    <li><strong>+60 exposants confirm&eacute;s</strong> &mdash; Mode, bijoux, cosm&eacute;tiques, gastronomie, artisanat</li>
    <li><strong>Sc&egrave;ne Masterclass</strong> &mdash; Pitchs d'entrepreneurs africains</li>
    <li><strong>Espace Restauration</strong> &mdash; Traiteurs africains &amp; carib&eacute;ens</li>
    <li><strong>Musique live</strong> &mdash; DJ sets &amp; concerts</li>
  </ul>
</div>

<div style="background:#FDF8F0;border:1px solid #E8DFD3;border-radius:10px;padding:16px;margin:20px 0;text-align:center;">
  <p style="margin:0;font-size:13px;color:#8B6F4E;">&#x1F4CD; <strong>Espace MAS</strong> &mdash; 10 rue des Terres au Cur&eacute;, Paris 13e</p>
  <p style="margin:4px 0 0;font-size:13px;color:#8B6F4E;">&#x1F4C5; <strong>1er &amp; 2 Mai 2026</strong> &mdash; 12h &agrave; 22h</p>
</div>

<div style="text-align:center;margin:28px 0;">
  <a href="${APP_URL}/saison-culturelle-africaine/foire-dafrique-paris" style="display:inline-block;background:#A0522D;color:#fff;text-decoration:none;padding:16px 40px;border-radius:10px;font-weight:bold;font-size:16px;">R&eacute;server mon billet &agrave; 7&euro;</a>
</div>
<p style="margin:0;font-size:13px;color:#999;text-align:center;">Apr&egrave;s cette vague, le tarif passera &agrave; <strong>10&euro;</strong></p>`),
  };
}

function exposantEmail(firstName: string) {
  return {
    subject: `⏰ J-24 — Plus que 37 stands disponibles — Foire d'Afrique Paris`,
    html: wrap(`
<p style="margin:0 0 16px;font-size:16px;color:#1A1A1A;">Bonjour <strong>${firstName}</strong>,</p>
<p style="margin:0 0 16px;font-size:15px;line-height:1.6;color:#444;">Vous aviez manifest&eacute; votre int&eacute;r&ecirc;t pour exposer &agrave; la Foire d'Afrique Paris. L'&eacute;v&eacute;nement est dans <strong>24 jours</strong> et les stands partent vite !</p>

<div style="background:#FEF2F2;border:1px solid #FECACA;border-radius:10px;padding:16px;margin:20px 0;text-align:center;">
  <p style="margin:0;font-size:20px;font-weight:bold;color:#DC2626;">&#x1F525; Plus que 37 stands sur 60</p>
  <p style="margin:6px 0 0;font-size:13px;color:#991B1B;">23 exposants d&eacute;j&agrave; confirm&eacute;s &mdash; r&eacute;servez maintenant !</p>
</div>

<div style="background:#FDF8F0;border:1px solid #E8DFD3;border-radius:10px;padding:16px;margin:20px 0;">
  <p style="margin:0 0 8px;font-size:14px;font-weight:bold;color:#8B6F4E;">Tarifs exposant :</p>
  <ul style="margin:0;padding-left:18px;font-size:13px;color:#555;line-height:2;">
    <li>Pack Entrepreneur 2 jours : <strong>320 &euro;</strong></li>
    <li>Acompte : <strong>seulement 50 &euro;</strong> pour confirmer</li>
    <li>Solde en <strong>mensualit&eacute;s jusqu'&agrave; 10 fois</strong></li>
  </ul>
</div>

<div style="background:#F0FDF4;border:1px solid #BBF7D0;border-radius:10px;padding:16px;margin:20px 0;">
  <p style="margin:0;font-size:14px;color:#166534;font-weight:bold;">Inclus dans votre stand :</p>
  <ul style="margin:8px 0 0;padding-left:18px;font-size:13px;color:#166534;line-height:2;">
    <li>Stand 2m&sup2; &eacute;quip&eacute; (table + chaises + badges)</li>
    <li>Capsule vid&eacute;o promo sur +28 pages r&eacute;seaux sociaux</li>
    <li>R&eacute;f&eacute;rencement dans L'Officiel d'Afrique</li>
    <li>+348 visiteurs d&eacute;j&agrave; inscrits</li>
  </ul>
</div>

<div style="text-align:center;margin:28px 0;">
  <a href="${APP_URL}/resa-exposants/foire-dafrique-paris" style="display:inline-block;background:#A0522D;color:#fff;text-decoration:none;padding:16px 40px;border-radius:10px;font-weight:bold;font-size:16px;">R&eacute;server mon stand &mdash; 50&euro; d'acompte</a>
</div>
<p style="margin:0;font-size:13px;color:#999;text-align:center;">&#x1F4C5; 1er &amp; 2 Mai 2026 &mdash; Espace MAS, Paris 13e</p>`),
  };
}

// ── DRY RUN par défaut — passer --send pour envoyer réellement ──
const DRY_RUN = !process.argv.includes("--send");

async function main() {
  if (DRY_RUN) {
    console.log("🔍 MODE DRY RUN — aucun email ne sera envoyé");
    console.log("   Ajoutez --send pour envoyer réellement\n");
  }

  // Leads Foire d'Afrique non convertis (formId null = import initial)
  const leads = await prisma.lead.findMany({
    where: {
      converted: false,
      formId: null, // leads Foire d'Afrique (import initial sans formId)
    },
    orderBy: { createdAt: "asc" },
  });

  // Exclure les leads test
  const validLeads = leads.filter(
    (l) => !l.email.includes("test@") && !l.email.includes("dreamteamafrica"),
  );

  console.log(`Total leads à relancer: ${validLeads.length}`);

  const stats = { visiteur: 0, exposant: 0, skipped: 0, sent: 0, failed: 0 };

  for (const lead of validLeads) {
    const firstName = lead.name.split(" ")[0] || "Bonjour";
    const profile = lead.profile.toLowerCase();

    // Skip artistes (déjà contactés séparément)
    if (profile === "artiste") {
      stats.skipped++;
      continue;
    }

    let emailContent: { subject: string; html: string };
    if (profile === "exposant") {
      emailContent = exposantEmail(firstName);
      stats.exposant++;
    } else {
      emailContent = visiteurEmail(firstName);
      stats.visiteur++;
    }

    if (DRY_RUN) {
      stats.sent++;
      if (stats.sent <= 3) {
        console.log(`  [DRY] ${lead.email} — ${emailContent.subject}`);
      }
      continue;
    }

    try {
      await resend.emails.send({
        from: FROM,
        to: lead.email,
        replyTo: "hello@dreamteamafrica.com",
        subject: emailContent.subject,
        html: emailContent.html,
      });
      stats.sent++;
      if (stats.sent % 50 === 0) console.log(`  ...${stats.sent} envoyés`);
      await new Promise((r) => setTimeout(r, 150));
    } catch (err: unknown) {
      stats.failed++;
      if (stats.failed <= 5) {
        const msg = err instanceof Error ? err.message : String(err);
        console.error(`  ✗ ${lead.email}: ${msg}`);
      }
    }
  }

  console.log("\n=== RÉSULTAT ===");
  console.log(`Envoyés: ${stats.sent}`);
  console.log(`Échoués: ${stats.failed}`);
  console.log(`Visiteurs: ${stats.visiteur}`);
  console.log(`Exposants: ${stats.exposant}`);
  console.log(`Artistes ignorés: ${stats.skipped}`);

  await prisma.$disconnect();
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});

import "dotenv/config";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

// ─── Long-lived user token ───
const USER_TOKEN = process.env.META_LONG_LIVED_TOKEN!;
const IMAGE_URL = "https://dreamteamafrica.com/foire-afrique.jpg";

// ─── Messages rotatifs (un différent à chaque diffusion) ───
const FB_MESSAGES = [
  `🌍 FOIRE D'AFRIQUE PARIS 2026 — 6ème Édition\n\n🔥 Billets Last Chance à 7€ — Dépêchez-vous, il n'en reste presque plus !\n\nMode • Artisanat • Gastronomie • Bijoux\n\n🗓 1er & 2 Mai 2026 · 12h-22h\n📍 Espace MAS — Paris 13e\n\n👉 Toutes les infos sur notre page officielle`,
  `✨ Le Grand Marché Africain revient à Paris !\n\n+60 exposants vous attendent pour célébrer la culture africaine.\n\nTextiles wax, bogolan, bijoux en or, gastronomie...\n\n🗓 1er & 2 Mai 2026\n📍 Espace MAS — Paris 13e\n🎟 Billetterie : saisonculturelleafricaine.fr`,
  `🎉 J-40 avant la Foire d'Afrique Paris 2026 !\n\nVenez vivre une expérience unique : défilés, dégustations, artisanat africain...\n\n🗓 1er & 2 Mai 2026 · 12h-22h\n📍 Espace MAS — 10 rue des Terres au Curé, 75013 Paris\n\n🎟 Derniers Last Chance à 7€ !`,
  `🌍 La diaspora africaine se retrouve à Paris !\n\nFoire d'Afrique 2026 — 6ème édition\nMode, artisanat, gastronomie, bijoux, spectacles\n\n+60 exposants · +150 billets vendus\n\n🗓 1er & 2 Mai 2026 · Espace MAS Paris\n👉 saisonculturelleafricaine.fr`,
  `💎 Bijoux, textiles, saveurs d'Afrique...\n\nTout ça à la Foire d'Afrique Paris — 6ème Édition !\n\n🗓 1er & 2 Mai 2026\n🕐 12h — 22h\n📍 Espace MAS — Paris 13e\n\n🎟 Billets à partir de 7€\n👉 saisonculturelleafricaine.fr`,
  `🔥 L'événement incontournable de la diaspora africaine à Paris !\n\nFoire d'Afrique 2026 : le Grand Marché Africain\n\n+60 exposants · Mode · Artisanat · Gastronomie · Bijoux\n\n🗓 1er & 2 Mai 2026\n📍 Espace MAS, Paris 13e\n🎟 saisonculturelleafricaine.fr`,
];

const IG_CAPTIONS = [
  `🌍 FOIRE D'AFRIQUE PARIS 2026 — 6ème Édition\n\n🔥 Billets Last Chance à 7€ — Dépêchez-vous !\n\nRetrouvez toutes les infos sur @foiredafriqueparis\n\n🗓 1er & 2 Mai 2026 · 12h-22h\n📍 Espace MAS Paris 13e\n\n#FoiredAfrique #Paris2026 #CultureAfricaine #Afrique #DiasporaAfricaine #Wax #Artisanat`,
  `✨ Le Grand Marché Africain revient !\n\n+60 exposants • Mode • Artisanat • Gastronomie • Bijoux\n\n@foiredafriqueparis\n\n🗓 1er & 2 Mai 2026\n📍 Espace MAS Paris\n\n#FoiredAfrique #Paris2026 #MadeInAfrica #Bogolan #BijouxAfricains #GastronomieAfricaine`,
  `🎉 Rendez-vous les 1er & 2 mai !\n\nFoire d'Afrique Paris — 6ème Édition\nL'Afrique en plein Paris 🌍\n\n@foiredafriqueparis\n📍 Espace MAS — Paris 13e\n🎟 saisonculturelleafricaine.fr\n\n#FoiredAfrique #Paris2026 #SaisonCulturelleAfricaine #Afrique #Culture #EspaceMAS`,
  `💎 Bijoux, textiles wax, gastronomie africaine...\n\nTout ça à la Foire d'Afrique Paris 2026 !\n\n@foiredafriqueparis\n🗓 1er & 2 Mai · 12h-22h\n📍 Paris 13e\n\n#FoiredAfrique #Paris2026 #Wax #BijouxAfricains #Artisanat #DiasporaAfricaine #fyp`,
  `🌍 La diaspora se retrouve à Paris !\n\nFoire d'Afrique 2026 — +60 exposants\n\n@foiredafriqueparis\n🗓 1er & 2 Mai 2026\n🎟 Billets à partir de 7€\n\n#FoiredAfrique #Paris2026 #CultureAfricaine #GrandMarcheAfricain #Afrique #MadeInAfrica`,
  `🔥 L'événement incontournable !\n\nFoire d'Afrique Paris — 6ème Édition\nMode • Artisanat • Gastronomie • Bijoux\n\n@foiredafriqueparis\n📍 Espace MAS Paris 13e\n👉 saisonculturelleafricaine.fr\n\n#FoiredAfrique #Paris2026 #SaisonCulturelleAfricaine #EarlyBird #Afrique`,
];

const LINKEDIN_MESSAGES = [
  `Foire d'Afrique Paris 2026 — 6ème Édition\n\nLe Grand Marché Africain réunit plus de 60 entrepreneurs et artisans de la diaspora africaine.\n\nMode, artisanat, gastronomie, bijouterie.\n\nDates : 1er et 2 Mai 2026\nLieu : Espace MAS, Paris 13e\n\nsaisonculturelleafricaine.fr`,
  `L'entrepreneuriat africain à l'honneur à Paris\n\nLa 6ème édition de la Foire d'Afrique rassemble +60 exposants de la diaspora africaine.\n\nUn événement qui valorise le savoir-faire et les talents africains en France.\n\n1er et 2 Mai 2026 — Espace MAS, Paris\n\nsaisonculturelleafricaine.fr`,
];

// ─── All pages config ───
interface PageConfig {
  fbPageId: string;
  name: string;
  igAccountId?: string;
}

const ALL_PAGES: PageConfig[] = [
  { fbPageId: "100771645843324", name: "Foire d'Afrique Paris", igAccountId: "17841451573905367" },
  { fbPageId: "758857223971003", name: "Saison Culturelle Africaine", igAccountId: "17841476132573046" },
  { fbPageId: "103237448423568", name: "L'Afropéen", igAccountId: "17841463617635776" },
  { fbPageId: "2102035170082738", name: "Dream Team Media", igAccountId: "17841463915374380" },
  { fbPageId: "115115284984783", name: "Fashion Week Africa", igAccountId: "17841460868610001" },
  { fbPageId: "1400649140241791", name: "Salon Made In Africa", igAccountId: "17841443647743654" },
  { fbPageId: "681998191664292", name: "Festival Du Conte", igAccountId: "17841475396377414" },
  { fbPageId: "759497097244387", name: "Les Précieux d'Afrique", igAccountId: "17841476404526271" },
  { fbPageId: "761767393680796", name: "LeBonMaterielPro", igAccountId: "17841476351397215" },
  { fbPageId: "101332929473139", name: "Service At Home", igAccountId: "17841475626714555" },
  { fbPageId: "717159181488560", name: "Évasion Paris" },
  { fbPageId: "109396695434333", name: "Église Méthodiste" },
  { fbPageId: "578051505668347", name: "L'Officiel d'Afrique" },
  { fbPageId: "817148755109623", name: "Ferme Artisanale" },
  { fbPageId: "106862708522725", name: "La Plante" },
  { fbPageId: "476817895519225", name: "AUTO 4" },
];

// ─── Get page tokens ───
async function getPageTokens(): Promise<Map<string, string>> {
  const res = await fetch(
    `https://graph.facebook.com/v23.0/me/accounts?limit=50&access_token=${USER_TOKEN}`,
  );
  const data = await res.json();
  const tokens = new Map<string, string>();
  for (const page of data.data || []) {
    tokens.set(page.id, page.access_token);
  }
  return tokens;
}

// ─── Get rotation index based on current time ───
function getRotationIndex(total: number): number {
  const hour = new Date().getHours();
  // Every 4 hours = 0,4,8,12,16,20 → index 0-5
  return Math.floor(hour / 4) % total;
}

// ─── Post to Facebook ───
async function postFacebook(pageId: string, token: string, message: string, link?: string) {
  const params = new URLSearchParams({ message });
  if (link) params.append("link", link);

  const res = await fetch(`https://graph.facebook.com/v23.0/${pageId}/feed`, {
    method: "POST",
    headers: { Authorization: `Bearer ${token}` },
    body: params,
  });
  return res.json();
}

// ─── Post to Instagram ───
async function postInstagram(igId: string, token: string, caption: string) {
  // Create container
  const params = new URLSearchParams({ image_url: IMAGE_URL, caption });
  const containerRes = await fetch(`https://graph.facebook.com/v23.0/${igId}/media?${params}`, {
    method: "POST",
    headers: { Authorization: `Bearer ${token}` },
  });
  const container = await containerRes.json();
  if (!container.id) return container;

  // Wait for processing
  await new Promise((r) => setTimeout(r, 5000));

  // Publish
  const pubRes = await fetch(
    `https://graph.facebook.com/v23.0/${igId}/media_publish?creation_id=${container.id}`,
    { method: "POST", headers: { Authorization: `Bearer ${token}` } },
  );
  return pubRes.json();
}

// ─── Post to LinkedIn ───
async function postLinkedIn(message: string) {
  const accessToken = process.env.LINKEDIN_ACCESS_TOKEN;
  const memberId = process.env.LINKEDIN_MEMBER_ID;
  if (!accessToken || !memberId) return { error: "LinkedIn not configured" };

  const res = await fetch("https://api.linkedin.com/v2/ugcPosts", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${accessToken}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      author: `urn:li:person:${memberId}`,
      lifecycleState: "PUBLISHED",
      specificContent: {
        "com.linkedin.ugc.ShareContent": {
          shareCommentary: { text: message },
          shareMediaCategory: "ARTICLE",
          media: [
            {
              status: "READY",
              originalUrl: "https://saisonculturelleafricaine.fr",
              title: { text: "Foire d'Afrique Paris 2026" },
            },
          ],
        },
      },
      visibility: { "com.linkedin.ugc.MemberNetworkVisibility": "PUBLIC" },
    }),
  });
  return res.json();
}

// ─── Main ───
async function main() {
  const idx = getRotationIndex(FB_MESSAGES.length);
  const fbMessage = FB_MESSAGES[idx];
  const igCaption = IG_CAPTIONS[idx];
  const liMessage = LINKEDIN_MESSAGES[idx % LINKEDIN_MESSAGES.length];

  console.log(`\n=== Auto-post rotation #${idx + 1}/${FB_MESSAGES.length} — ${new Date().toLocaleString("fr-FR")} ===\n`);

  const tokens = await getPageTokens();
  let fbOk = 0, igOk = 0;

  for (const page of ALL_PAGES) {
    const token = tokens.get(page.fbPageId);
    if (!token) { console.log(`⚠ Pas de token pour ${page.name}`); continue; }

    // Facebook — main page gets full post, others share link
    if (page.fbPageId === "100771645843324") {
      const fb = await postFacebook(page.fbPageId, token, fbMessage);
      console.log(`FB ${page.name}: ${fb.id ? "✓" : "✗ " + JSON.stringify(fb).slice(0, 80)}`);
    } else {
      const fb = await postFacebook(
        page.fbPageId,
        token,
        `🌍 La Foire d'Afrique Paris revient ! ${fbMessage.split("\n")[2] || ""}\n\n👉 Retrouvez toutes les infos sur notre page officielle`,
        "https://www.facebook.com/100771645843324",
      );
      console.log(`FB ${page.name}: ${fb.id ? "✓" : "✗ " + JSON.stringify(fb).slice(0, 80)}`);
    }
    if (fb) fbOk++;

    // Instagram
    if (page.igAccountId) {
      const ig = await postInstagram(page.igAccountId, token, igCaption);
      console.log(`IG ${page.name}: ${ig.id ? "✓" : "✗ " + JSON.stringify(ig).slice(0, 80)}`);
      if (ig.id) igOk++;
    }
  }

  // LinkedIn (1 seul post)
  const li = await postLinkedIn(liMessage);
  console.log(`LinkedIn: ${li.id ? "✓" : "✗ " + JSON.stringify(li).slice(0, 80)}`);

  console.log(`\n=== Résultat: ${fbOk} FB + ${igOk} IG + 1 LinkedIn ===\n`);

  await prisma.$disconnect();
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});

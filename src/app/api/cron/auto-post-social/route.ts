import { NextResponse } from "next/server";

const USER_TOKEN = process.env.META_LONG_LIVED_TOKEN!;
const IMAGE_URL = "https://dreamteamafrica.com/foire-afrique.jpg";
const CRON_SECRET = process.env.CRON_SECRET;

const FB_MESSAGES = [
  `🌍 FOIRE D'AFRIQUE PARIS 2026 — 6ème Édition\n\n🔥 Billets Last Chance à 7€ — Plus que 50 places !\n\nMode • Artisanat • Gastronomie • Bijoux\n\n🗓 1er & 2 Mai 2026 · 12h-22h\n📍 Espace MAS — Paris 13e\n\n👉 Toutes les infos sur notre page officielle`,
  `✨ Le Grand Marché Africain revient à Paris !\n\n+60 exposants vous attendent pour célébrer la culture africaine.\n\nTextiles wax, bogolan, bijoux en or, gastronomie...\n\n🗓 1er & 2 Mai 2026\n📍 Espace MAS — Paris 13e\n🎟 Billetterie : saisonculturelleafricaine.fr`,
  `🎉 Bientôt la Foire d'Afrique Paris 2026 !\n\nVenez vivre une expérience unique : défilés, dégustations, artisanat africain...\n\n🗓 1er & 2 Mai 2026 · 12h-22h\n📍 Espace MAS — 10 rue des Terres au Curé, 75013 Paris\n\n🎟 Billets Last Chance à 7€ — Places limitées !`,
  `🌍 La diaspora africaine se retrouve à Paris !\n\nFoire d'Afrique 2026 — 6ème édition\nMode, artisanat, gastronomie, bijoux, spectacles\n\n+60 exposants\n\n🗓 1er & 2 Mai 2026 · Espace MAS Paris\n👉 saisonculturelleafricaine.fr`,
  `💎 Bijoux, textiles, saveurs d'Afrique...\n\nTout ça à la Foire d'Afrique Paris — 6ème Édition !\n\n🗓 1er & 2 Mai 2026\n🕐 12h — 22h\n📍 Espace MAS — Paris 13e\n\n🎟 Billets à partir de 7€\n👉 saisonculturelleafricaine.fr`,
  `🔥 L'événement incontournable de la diaspora africaine à Paris !\n\nFoire d'Afrique 2026 : le Grand Marché Africain\n\n+60 exposants · Mode · Artisanat · Gastronomie · Bijoux\n\n🗓 1er & 2 Mai 2026\n📍 Espace MAS, Paris 13e\n🎟 saisonculturelleafricaine.fr`,
];

const IG_CAPTIONS = [
  `🌍 FOIRE D'AFRIQUE PARIS 2026 — 6ème Édition\n\n🔥 Billets Last Chance à 7€ — Plus que 50 places !\n\nRetrouvez toutes les infos sur @foiredafriqueparis\n\n🗓 1er & 2 Mai 2026 · 12h-22h\n📍 Espace MAS Paris 13e\n\n#FoiredAfrique #Paris2026 #CultureAfricaine #Afrique #DiasporaAfricaine #Wax #Artisanat`,
  `✨ Le Grand Marché Africain revient !\n\n+60 exposants • Mode • Artisanat • Gastronomie • Bijoux\n\n@foiredafriqueparis\n\n🗓 1er & 2 Mai 2026\n📍 Espace MAS Paris\n\n#FoiredAfrique #Paris2026 #MadeInAfrica #Bogolan #BijouxAfricains #GastronomieAfricaine`,
  `🎉 Rendez-vous les 1er & 2 mai !\n\nFoire d'Afrique Paris — 6ème Édition\nL'Afrique en plein Paris 🌍\n\n@foiredafriqueparis\n📍 Espace MAS — Paris 13e\n🎟 saisonculturelleafricaine.fr\n\n#FoiredAfrique #Paris2026 #SaisonCulturelleAfricaine #Afrique #Culture #EspaceMAS`,
  `💎 Bijoux, textiles wax, gastronomie africaine...\n\nTout ça à la Foire d'Afrique Paris 2026 !\n\n@foiredafriqueparis\n🗓 1er & 2 Mai · 12h-22h\n📍 Paris 13e\n\n#FoiredAfrique #Paris2026 #Wax #BijouxAfricains #Artisanat #DiasporaAfricaine`,
  `🌍 La diaspora se retrouve à Paris !\n\nFoire d'Afrique 2026 — +60 exposants\n\n@foiredafriqueparis\n🗓 1er & 2 Mai 2026\n🎟 Billets à partir de 7€\n\n#FoiredAfrique #Paris2026 #CultureAfricaine #GrandMarcheAfricain #Afrique #MadeInAfrica`,
  `🔥 L'événement incontournable !\n\nFoire d'Afrique Paris — 6ème Édition\nMode • Artisanat • Gastronomie • Bijoux\n\n@foiredafriqueparis\n📍 Espace MAS Paris 13e\n👉 saisonculturelleafricaine.fr\n\n#FoiredAfrique #Paris2026 #SaisonCulturelleAfricaine #EarlyBird #Afrique`,
];

const LINKEDIN_MESSAGES = [
  `Foire d'Afrique Paris 2026 — 6ème Édition\n\nLe Grand Marché Africain réunit plus de 60 entrepreneurs et artisans de la diaspora africaine.\n\nMode, artisanat, gastronomie, bijouterie.\n\nDates : 1er et 2 Mai 2026\nLieu : Espace MAS, Paris 13e\n\nsaisonculturelleafricaine.fr`,
  `L'entrepreneuriat africain à l'honneur à Paris\n\nLa 6ème édition de la Foire d'Afrique rassemble +60 exposants de la diaspora africaine.\n\nUn événement qui valorise le savoir-faire et les talents africains en France.\n\n1er et 2 Mai 2026 — Espace MAS, Paris\n\nsaisonculturelleafricaine.fr`,
];

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

function getRotationIndex(total: number): number {
  const hour = new Date().getHours();
  const dayOfYear = Math.floor(
    (Date.now() - new Date(new Date().getFullYear(), 0, 0).getTime()) / 86400000,
  );
  return (dayOfYear * 6 + Math.floor(hour / 4)) % total;
}

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

export async function GET(request: Request) {
  // Verify cron secret
  const authHeader = request.headers.get("authorization");
  if (CRON_SECRET && authHeader !== `Bearer ${CRON_SECRET}`) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const idx = getRotationIndex(FB_MESSAGES.length);
    const fbMessage = FB_MESSAGES[idx];
    const igCaption = IG_CAPTIONS[idx];
    const liMessage = LINKEDIN_MESSAGES[idx % LINKEDIN_MESSAGES.length];

    const tokens = await getPageTokens();
    const results: string[] = [];
    let fbOk = 0;
    let igOk = 0;

    for (const page of ALL_PAGES) {
      const token = tokens.get(page.fbPageId);
      if (!token) continue;

      // Facebook
      try {
        const params = new URLSearchParams();
        if (page.fbPageId === "100771645843324") {
          params.append("message", fbMessage);
        } else {
          params.append(
            "message",
            `🌍 La Foire d'Afrique Paris revient !\n\n👉 Retrouvez toutes les infos sur notre page officielle`,
          );
          params.append("link", "https://www.facebook.com/100771645843324");
        }

        const fbRes = await fetch(
          `https://graph.facebook.com/v23.0/${page.fbPageId}/feed`,
          {
            method: "POST",
            headers: { Authorization: `Bearer ${token}` },
            body: params,
          },
        );
        const fb = await fbRes.json();
        if (fb.id) {
          fbOk++;
          results.push(`FB ${page.name}: OK`);
        } else {
          results.push(`FB ${page.name}: ${JSON.stringify(fb).slice(0, 60)}`);
        }
      } catch (e) {
        results.push(`FB ${page.name}: error`);
      }

      // Instagram
      if (page.igAccountId) {
        try {
          const containerParams = new URLSearchParams({
            image_url: IMAGE_URL,
            caption: igCaption,
          });
          const containerRes = await fetch(
            `https://graph.facebook.com/v23.0/${page.igAccountId}/media?${containerParams}`,
            { method: "POST", headers: { Authorization: `Bearer ${token}` } },
          );
          const container = await containerRes.json();

          if (container.id) {
            await new Promise((r) => setTimeout(r, 5000));
            const pubRes = await fetch(
              `https://graph.facebook.com/v23.0/${page.igAccountId}/media_publish?creation_id=${container.id}`,
              { method: "POST", headers: { Authorization: `Bearer ${token}` } },
            );
            const pub = await pubRes.json();
            if (pub.id) {
              igOk++;
              results.push(`IG ${page.name}: OK`);
            } else {
              results.push(`IG ${page.name}: ${JSON.stringify(pub).slice(0, 60)}`);
            }
          }
        } catch {
          results.push(`IG ${page.name}: error`);
        }
      }
    }

    // LinkedIn
    let liOk = false;
    try {
      const liAccessToken = process.env.LINKEDIN_ACCESS_TOKEN;
      const liMemberId = process.env.LINKEDIN_MEMBER_ID;
      if (liAccessToken && liMemberId) {
        const liRes = await fetch("https://api.linkedin.com/v2/ugcPosts", {
          method: "POST",
          headers: {
            Authorization: `Bearer ${liAccessToken}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            author: `urn:li:person:${liMemberId}`,
            lifecycleState: "PUBLISHED",
            specificContent: {
              "com.linkedin.ugc.ShareContent": {
                shareCommentary: { text: liMessage },
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
            visibility: {
              "com.linkedin.ugc.MemberNetworkVisibility": "PUBLIC",
            },
          }),
        });
        const li = await liRes.json();
        liOk = !!li.id;
        results.push(`LinkedIn: ${li.id ? "OK" : JSON.stringify(li).slice(0, 60)}`);
      }
    } catch {
      results.push("LinkedIn: error");
    }

    console.log(
      `[auto-post] rotation #${idx + 1} — FB: ${fbOk}, IG: ${igOk}, LI: ${liOk ? 1 : 0}`,
    );

    return NextResponse.json({
      ok: true,
      rotation: idx + 1,
      facebook: fbOk,
      instagram: igOk,
      linkedin: liOk ? 1 : 0,
      details: results,
    });
  } catch (error) {
    console.error("[auto-post] error:", error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Unknown error" },
      { status: 500 },
    );
  }
}

import { NextResponse } from "next/server";
import { verifyCronAuth } from "@/lib/cron-auth";

const USER_TOKEN = process.env.META_LONG_LIVED_TOKEN!;
const IMAGE_URL = "https://dreamteamafricamedia.b-cdn.net/campaigns/foire-afrique-danseuse-j24.png";
const EVENT_URL = "https://dreamteamafrica.com/saison-culturelle-africaine/foire-dafrique-paris";
const CRON_SECRET = process.env.CRON_SECRET;

// ── Mentions exposants (cachées en bas des posts) ──
// Rotation de 3 groupes pour ne pas surcharger chaque post
const IG_EXPOSANT_GROUPS = [
  // Groupe 1 — Mode & Accessoires
  "@sanaacreation_ @famashop78 @jabcollectionwax @by_kemi @cbk_planner @olgstyle @makakreation @beghabyrina @evra_hodna @mossane_pagne_tisse @dieynissa_fashion @anna_kate_pro @admundo_concept",
  // Groupe 2 — Cosmétiques & Bien-être
  "@maisonnimba @edeniquecoffee @lesfondantsdeGrace @mila_2585 @el.glorious.7 @asili_le_soin @samhatchad @queenyemuna @okosmetik18 @darna_senteurs @retour_aux_sources_by_ad @bijoo_bijoo",
  // Groupe 3 — Art, Food & Culture
  "@conficulture_afro_quiz @rentavoyage @le_comptoir_d_acraa @orange_zulucrown @izikaofficiel @nanse3d @yohel.france @kelima_ @abidjanis.art @cnergysolar @maison.dalla @lessecretsdobama @artaidani",
];

function getExposantMentions(): string {
  const idx = Math.floor(Date.now() / 86400000) % IG_EXPOSANT_GROUPS.length;
  return IG_EXPOSANT_GROUPS[idx];
}

const IG_MENTIONS = `\n\n.\n.\n.\nNos exposants :\n${getExposantMentions()}`;

// ── Messages mis à jour : 10€ prévente, passage à 15€ ──

const FB_MESSAGES = [
  `🌍 FOIRE D'AFRIQUE PARIS 2026 — 6ème Édition\n\n🔥 Prévente en ligne à 10€ — Avant passage à 15€ sur place !\n\nMode • Artisanat • Gastronomie • Bijoux\n+60 exposants\n\n🗓 1er & 2 Mai 2026 · 12h-22h\n📍 Espace MAS — Paris 13e\n\n🎟 ${EVENT_URL}`,
  `✨ Le Grand Marché Africain revient à Paris !\n\n+60 exposants vous attendent pour célébrer la culture africaine.\n\nTextiles wax, bogolan, bijoux, gastronomie...\n\n🎟 Billets à 10€ en prévente (15€ sur place)\n\n🗓 1er & 2 Mai 2026\n📍 Espace MAS — Paris 13e\n\n👉 ${EVENT_URL}`,
  `🎉 Plus que quelques jours avant la Foire d'Afrique Paris 2026 !\n\nDéjà 348 billets vendus. Profitez du tarif prévente à 10€ avant le passage à 15€.\n\n🗓 1er & 2 Mai 2026 · 12h-22h\n📍 Espace MAS — 10 rue des Terres au Curé, 75013 Paris\n\n🎟 ${EVENT_URL}`,
  `🌍 La diaspora africaine se retrouve à Paris !\n\nFoire d'Afrique 2026 — 6ème édition\nMode, artisanat, gastronomie, bijoux, musique live\n\n+60 exposants • DJ sets • Masterclass\n\n🎟 Prévente 10€ (tarif plein 15€)\n🗓 1er & 2 Mai 2026 · Espace MAS Paris\n\n👉 ${EVENT_URL}`,
  `💎 Bijoux, textiles, saveurs d'Afrique...\n\nTout ça à la Foire d'Afrique Paris — 6ème Édition !\n\n🗓 1er & 2 Mai 2026\n🕐 12h — 22h\n📍 Espace MAS — Paris 13e\n\n🎟 Billets à 10€ en prévente\n👉 ${EVENT_URL}`,
  `🔥 L'événement incontournable de la diaspora africaine à Paris !\n\nFoire d'Afrique 2026 : le Grand Marché Africain\n\n+60 exposants · Mode · Artisanat · Gastronomie · Bijoux\n\n🎟 10€ en prévente — 15€ sur place\n🗓 1er & 2 Mai 2026\n📍 Espace MAS, Paris 13e\n\n👉 ${EVENT_URL}`,
];

const IG_CAPTIONS = [
  `🌍 FOIRE D'AFRIQUE PARIS 2026 — 6ème Édition\n\n🔥 Prévente en ligne à 10€ — Avant passage à 15€ sur place !\n\n+60 exposants · Mode · Artisanat · Gastronomie · Bijoux\n\n🗓 1er & 2 Mai 2026 · 12h-22h\n📍 Espace MAS Paris 13e\n\n🔗 Lien en bio\n\n#FoiredAfrique #Paris2026 #CultureAfricaine #Afrique #DiasporaAfricaine #Wax #Artisanat #MadeInAfrica${IG_MENTIONS}`,
  `✨ Le Grand Marché Africain revient !\n\n+60 exposants • Mode • Artisanat • Gastronomie • Bijoux\n\n🎟 Prévente 10€ (15€ sur place)\n🗓 1er & 2 Mai 2026\n📍 Espace MAS Paris\n\n🔗 Lien en bio\n\n#FoiredAfrique #Paris2026 #MadeInAfrica #Bogolan #BijouxAfricains #GastronomieAfricaine${IG_MENTIONS}`,
  `🎉 Compte à rebours lancé !\n\nFoire d'Afrique Paris — 6ème Édition\nDéjà 348 billets vendus 🔥\n\n🎟 10€ en prévente\n📍 Espace MAS — Paris 13e\n🗓 1er & 2 Mai 2026\n\n🔗 Lien en bio\n\n#FoiredAfrique #Paris2026 #SaisonCulturelleAfricaine #Afrique #Culture #EspaceMAS${IG_MENTIONS}`,
  `💎 Bijoux, textiles wax, gastronomie africaine...\n\nTout ça à la Foire d'Afrique Paris 2026 !\n\n🎟 10€ en prévente (15€ sur place)\n🗓 1er & 2 Mai · 12h-22h\n📍 Paris 13e\n\n🔗 Lien en bio\n\n#FoiredAfrique #Paris2026 #Wax #BijouxAfricains #Artisanat #DiasporaAfricaine${IG_MENTIONS}`,
  `🌍 La diaspora se retrouve à Paris !\n\nFoire d'Afrique 2026 — +60 exposants\nMusique live • DJ sets • Masterclass\n\n🎟 Billets 10€ en prévente\n🗓 1er & 2 Mai 2026\n\n🔗 Lien en bio\n\n#FoiredAfrique #Paris2026 #CultureAfricaine #GrandMarcheAfricain #Afrique #MadeInAfrica${IG_MENTIONS}`,
  `🔥 L'événement incontournable !\n\nFoire d'Afrique Paris — 6ème Édition\nMode • Artisanat • Gastronomie • Bijoux\n\n🎟 Prévente 10€ — Tarif plein 15€\n📍 Espace MAS Paris 13e\n🗓 1er & 2 Mai 2026\n\n🔗 Lien en bio\n\n#FoiredAfrique #Paris2026 #SaisonCulturelleAfricaine #Afrique${IG_MENTIONS}`,
];

const LINKEDIN_MESSAGES = [
  `Foire d'Afrique Paris 2026 — 6ème Édition\n\nLe Grand Marché Africain réunit plus de 60 entrepreneurs et artisans de la diaspora africaine.\n\nMode, artisanat, gastronomie, bijouterie, masterclass.\n\nDates : 1er et 2 Mai 2026\nLieu : Espace MAS, Paris 13e\nBillets : 10€ en prévente (15€ sur place)\n\n${EVENT_URL}`,
  `L'entrepreneuriat africain à l'honneur à Paris\n\nLa 6ème édition de la Foire d'Afrique rassemble +60 exposants de la diaspora africaine.\n\nUn événement qui valorise le savoir-faire et les talents africains en France.\n\n1er et 2 Mai 2026 — Espace MAS, Paris\nPrévente : 10€\n\n${EVENT_URL}`,
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
  // Rotation toutes les 4h : 6 slots par jour
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
  const authError = verifyCronAuth(request);
  if (authError) return authError;

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

      // Facebook — page principale : message complet, autres : lien vers la page
      try {
        const params = new URLSearchParams();
        if (page.fbPageId === "100771645843324") {
          params.append("message", fbMessage);
          params.append("link", EVENT_URL);
        } else {
          params.append(
            "message",
            `🌍 La Foire d'Afrique Paris revient les 1er & 2 Mai !\n\nBillets 10€ en prévente (15€ sur place)\n+60 exposants · Mode · Artisanat · Gastronomie\n\n👉 ${EVENT_URL}`,
          );
          params.append("link", EVENT_URL);
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
          results.push(`FB ${page.name}: ${JSON.stringify(fb).slice(0, 80)}`);
        }
      } catch (e) {
        results.push(`FB ${page.name}: error`);
      }

      // Instagram — image + caption
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
            await new Promise((r) => setTimeout(r, 2000));
            const pubRes = await fetch(
              `https://graph.facebook.com/v23.0/${page.igAccountId}/media_publish?creation_id=${container.id}`,
              { method: "POST", headers: { Authorization: `Bearer ${token}` } },
            );
            const pub = await pubRes.json();
            if (pub.id) {
              igOk++;
              results.push(`IG ${page.name}: OK`);
            } else {
              results.push(`IG ${page.name}: ${JSON.stringify(pub).slice(0, 80)}`);
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
                    originalUrl: EVENT_URL,
                    title: { text: "Foire d'Afrique Paris 2026 — Billets à 10€" },
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
        results.push(`LinkedIn: ${li.id ? "OK" : JSON.stringify(li).slice(0, 80)}`);
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

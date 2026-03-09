import OpenAI from "openai";
import * as crypto from "crypto";

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

const events = [
  {
    title: "Festival International du Cinéma Africain (FICA) — 1ère Édition 2026",
    slug: "festival-international-du-cinema-africain",
    date: "20 avril 2026",
    venue: "Cinéma Le Kosmos, Fontenay-sous-Bois",
    capacity: 300,
    description: "Festival de cinéma africain avec projections, débats et rencontres avec les réalisateurs.",
  },
  {
    title: "Foire D'Afrique Paris",
    slug: "foire-dafrique-paris",
    date: "1-2 mai 2026",
    venue: "Espace Mas, Paris",
    capacity: 500,
    description: "Grande foire dédiée à l'artisanat, la gastronomie et la culture africaine à Paris.",
  },
  {
    title: "Évasion Paris",
    slug: "evasion-paris",
    date: "13 juin 2026",
    venue: "La Seine, Paris",
    capacity: 150,
    description: "Soirée exclusive sur la Seine, croisière et ambiance afro-urbaine.",
  },
  {
    title: "Festival de l'Autre Culture",
    slug: "festival-de-lautre-culture",
    date: "27 juin 2026",
    venue: "Parc des Épivans",
    capacity: 1000,
    description: "Grand festival en plein air célébrant la diversité culturelle africaine. Musique, danse, gastronomie.",
  },
  {
    title: "Juste Une Danse",
    slug: "juste-une-danse",
    date: "31 octobre 2026",
    venue: "Espace Mas, Paris",
    capacity: 400,
    description: "Festival des danses traditionnelles africaines. Spectacles, ateliers et battle de danse.",
  },
  {
    title: "Festival du Conte Africain — Sous l'arbre à Palabre",
    slug: "festival-conte-africain",
    date: "11 novembre 2026",
    venue: "Espace Mas, Paris",
    capacity: 350,
    description: "Festival de conte et tradition orale africaine. Conteurs, griots et spectacles pour tous.",
  },
  {
    title: "Salon Made In Africa",
    slug: "salon-made-in-africa",
    date: "11-12 décembre 2026",
    venue: "Espace Mas, Paris",
    capacity: 600,
    description: "Salon dédié à l'artisanat et au savoir-faire africain. Exposants, défilés et networking.",
  },
];

const baseUrl = "https://dreamteamafrica.com/saison-culturelle-africaine";

// ── Twitter OAuth 1.0a ──
async function postTweet(text: string) {
  const apiKey = process.env.TWITTER_API_KEY!;
  const apiSecret = process.env.TWITTER_API_SECRET!;
  const accessToken = process.env.TWITTER_ACCESS_TOKEN!;
  const accessSecret = process.env.TWITTER_ACCESS_TOKEN_SECRET!;

  const url = "https://api.twitter.com/2/tweets";
  const timestamp = Math.floor(Date.now() / 1000).toString();
  const nonce = crypto.randomBytes(16).toString("hex");

  const oauthParams: Record<string, string> = {
    oauth_consumer_key: apiKey,
    oauth_nonce: nonce,
    oauth_signature_method: "HMAC-SHA1",
    oauth_timestamp: timestamp,
    oauth_token: accessToken,
    oauth_version: "1.0",
  };

  const paramString = Object.keys(oauthParams).sort()
    .map(k => `${encodeURIComponent(k)}=${encodeURIComponent(oauthParams[k])}`)
    .join("&");

  const baseString = `POST&${encodeURIComponent(url)}&${encodeURIComponent(paramString)}`;
  const signingKey = `${encodeURIComponent(apiSecret)}&${encodeURIComponent(accessSecret)}`;
  const signature = crypto.createHmac("sha1", signingKey).update(baseString).digest("base64");
  oauthParams.oauth_signature = signature;

  const authHeader = "OAuth " + Object.keys(oauthParams).sort()
    .map(k => `${encodeURIComponent(k)}="${encodeURIComponent(oauthParams[k])}"`)
    .join(", ");

  const res = await fetch(url, {
    method: "POST",
    headers: { Authorization: authHeader, "Content-Type": "application/json" },
    body: JSON.stringify({ text }),
  });

  const data = await res.json();
  return { status: res.status, id: data.data?.id };
}

// ── Facebook ──
async function postFacebook(message: string, link: string) {
  const pageId = process.env.FB_PAGE_ID!;
  const token = process.env.FB_PAGE_ACCESS_TOKEN!;

  const res = await fetch(`https://graph.facebook.com/v23.0/${pageId}/feed`, {
    method: "POST",
    body: new URLSearchParams({ access_token: token, message, link }),
  });

  const data = await res.json();
  return { status: res.status, id: data.id };
}

// ── Instagram ──
async function postInstagram(caption: string, imageUrl: string) {
  const igId = process.env.IG_BUSINESS_ACCOUNT_ID!;
  const token = process.env.FB_PAGE_ACCESS_TOKEN!;

  const containerRes = await fetch(`https://graph.facebook.com/v23.0/${igId}/media`, {
    method: "POST",
    body: new URLSearchParams({ access_token: token, image_url: imageUrl, caption }),
  });
  const container = await containerRes.json();

  if (!container.id) return { status: containerRes.status, error: container.error?.message };

  const pubRes = await fetch(`https://graph.facebook.com/v23.0/${igId}/media_publish`, {
    method: "POST",
    body: new URLSearchParams({ access_token: token, creation_id: container.id }),
  });
  const pub = await pubRes.json();
  return { status: pubRes.status, id: pub.id };
}

// ── LinkedIn ──
async function postLinkedIn(text: string, articleUrl: string) {
  const token = process.env.LINKEDIN_ACCESS_TOKEN!;
  const memberId = process.env.LINKEDIN_MEMBER_ID!;

  const body = {
    author: `urn:li:person:${memberId}`,
    lifecycleState: "PUBLISHED",
    specificContent: {
      "com.linkedin.ugc.ShareContent": {
        shareCommentary: { text },
        shareMediaCategory: "ARTICLE",
        media: [{ status: "READY", originalUrl: articleUrl, title: { text: text.split("\n")[0].slice(0, 200) } }],
      },
    },
    visibility: { "com.linkedin.ugc.MemberNetworkVisibility": "PUBLIC" },
  };

  const res = await fetch("https://api.linkedin.com/v2/ugcPosts", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
      "X-Restli-Protocol-Version": "2.0.0",
    },
    body: JSON.stringify(body),
  });

  const data = await res.text();
  return { status: res.status, id: res.headers.get("x-restli-id") };
}

// ── Main ──
async function main() {
  // Image par défaut pour Instagram (JPEG publique)
  const defaultImage = "https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?w=1080&q=80";

  for (const event of events) {
    const url = `${baseUrl}/${event.slug}`;
    console.log(`\n═══ ${event.title} ═══`);

    // Générer le contenu
    const response = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [{
        role: "user",
        content: `Tu es community manager pour la Saison Culturelle Africaine de Paris 2026.

Génère les publications pour cet événement :
Événement : ${event.title}
Date : ${event.date}
Lieu : ${event.venue}
Capacité : ${event.capacity} places
Description : ${event.description}
URL : ${url}

JSON uniquement (pas de backticks) :
{
  "twitter": "Tweet max 260 chars. Date, lieu, 2-3 hashtags.",
  "facebook": "Post Facebook 4-6 lignes. Date, lieu, CTA. Hashtags.",
  "instagram": "Légende Instagram 4-6 lignes. Emojis. 10-15 hashtags.",
  "linkedin": "Post LinkedIn pro 5-7 lignes. Date, lieu. 3-5 hashtags."
}`
      }],
      max_tokens: 800,
      temperature: 0.8,
    });

    const raw = response.choices[0]?.message?.content || "";
    const jsonMatch = raw.match(/\{[\s\S]*\}/);
    if (!jsonMatch) {
      console.log("  ERROR: pas de JSON");
      continue;
    }

    const content = JSON.parse(jsonMatch[0]);

    // Twitter
    try {
      const tweetText = `${content.twitter}\n\n${url}`;
      const tw = await postTweet(tweetText);
      console.log(`  Twitter: ${tw.status} ${tw.status === 201 ? "✓" : "✗"} ${tw.id || ""}`);
    } catch (e: any) {
      console.log(`  Twitter: ERROR ${e.message}`);
    }

    // Facebook
    try {
      const fb = await postFacebook(content.facebook, url);
      console.log(`  Facebook: ${fb.status} ${fb.status === 200 ? "✓" : "✗"} ${fb.id || ""}`);
    } catch (e: any) {
      console.log(`  Facebook: ERROR ${e.message}`);
    }

    // Instagram
    try {
      const ig = await postInstagram(content.instagram, defaultImage);
      console.log(`  Instagram: ${ig.status} ${ig.status === 200 ? "✓" : "✗"} ${ig.id || ""}`);
    } catch (e: any) {
      console.log(`  Instagram: ERROR ${e.message}`);
    }

    // LinkedIn
    try {
      const li = await postLinkedIn(content.linkedin, url);
      console.log(`  LinkedIn: ${li.status} ${li.status === 201 ? "✓" : "✗"} ${li.id || ""}`);
    } catch (e: any) {
      console.log(`  LinkedIn: ERROR ${e.message}`);
    }

    // Pause entre les événements pour éviter le rate limiting
    await new Promise(r => setTimeout(r, 3000));
  }

  console.log("\n═══ DIFFUSION TERMINÉE ═══");
}

main().catch(console.error);

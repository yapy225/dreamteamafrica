// ============================================================
// lib/social-media.ts
// Publication automatique sur les réseaux sociaux
// X (Twitter) · Facebook · Instagram · LinkedIn · TikTok
// ============================================================

import { prisma } from "@/lib/db";
import OpenAI from "openai";

// ── Types ──────────────────────────────────────────────────

interface ArticleForSocial {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  category: string;
  coverImage: string | null;
  tags: string[];
  seoKeywords?: string[];
}

interface SocialContent {
  twitter: string;
  facebook: string;
  instagram: string;
  linkedin: string;
  tiktok: string;
  hashtags: string[];
}

// ── OpenAI (lazy) ──────────────────────────────────────────

let _openai: OpenAI | null = null;
function getOpenAI() {
  if (!_openai) _openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
  return _openai;
}

// ── Génération du contenu social via GPT-4o-mini ───────────

const SOCIAL_PROMPT = (title: string, excerpt: string, url: string, category: string, tags: string[]) =>
  `Tu es community manager pour L'Afropéen, média digital spécialisé Afrique, diaspora et culture.

Génère les publications pour chaque réseau social à partir de cet article :

Titre : ${title}
Résumé : ${excerpt}
URL : ${url}
Catégorie : ${category}
Tags : ${tags.join(", ")}

Réponds UNIQUEMENT en JSON valide (pas de markdown, pas de backticks) :
{
  "twitter": "Tweet de max 260 caractères (laisser place au lien). Accrocheur, informatif. Inclure 2-3 hashtags dans le texte.",
  "facebook": "Post Facebook de 3-5 lignes. Engageant, avec question ou appel à l'action. Hashtags à la fin.",
  "instagram": "Légende Instagram de 3-5 lignes. Storytelling, emojis modérés. 10-15 hashtags à la fin.",
  "linkedin": "Post LinkedIn professionnel de 4-6 lignes. Analyse, insight. 3-5 hashtags à la fin.",
  "tiktok": "Texte court et punchy pour TikTok. 2-3 lignes max. Hashtags viraux.",
  "hashtags": ["hashtag1", "hashtag2", "hashtag3"]
}`;

async function generateSocialContent(article: ArticleForSocial): Promise<SocialContent> {
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL?.includes("localhost")
    ? "https://dreamteamafrica.com"
    : process.env.NEXT_PUBLIC_APP_URL || "https://dreamteamafrica.com";
  const url = `${baseUrl}/lafropeen/${article.slug}`;

  const response = await getOpenAI().chat.completions.create({
    model: "gpt-4o-mini",
    messages: [
      {
        role: "user",
        content: SOCIAL_PROMPT(
          article.title,
          article.excerpt,
          url,
          article.category,
          [...article.tags, ...(article.seoKeywords || [])],
        ),
      },
    ],
    max_tokens: 800,
    temperature: 0.8,
  });

  const raw = response.choices[0]?.message?.content || "";
  // Extraire le JSON même si entouré de backticks
  const jsonMatch = raw.match(/\{[\s\S]*\}/);
  if (!jsonMatch) {
    throw new Error("GPT n'a pas renvoyé de JSON valide pour le contenu social");
  }

  return JSON.parse(jsonMatch[0]) as SocialContent;
}

// ── Helper: convertir URL image pour Instagram (JPEG requis) ──

function getInstagramImageUrl(imageUrl: string | null): string | null {
  if (!imageUrl) return null;
  // Bunny CDN: convertir webp/png → JPEG via query param
  if (imageUrl.includes("b-cdn.net")) {
    const base = imageUrl.replace(/\.(webp|png)$/i, ".jpg");
    return base.includes("?") ? `${base}&format=jpg` : `${base}?format=jpg`;
  }
  return imageUrl;
}

// ── Adaptateurs par plateforme ─────────────────────────────

async function postToTwitter(content: string, articleUrl: string, imageUrl: string | null): Promise<{ postId: string; postUrl: string }> {
  const apiKey = process.env.TWITTER_API_KEY;
  const apiSecret = process.env.TWITTER_API_SECRET;
  const accessToken = process.env.TWITTER_ACCESS_TOKEN;
  const accessSecret = process.env.TWITTER_ACCESS_TOKEN_SECRET;

  if (!apiKey || !apiSecret || !accessToken || !accessSecret) {
    throw new Error("Twitter API credentials manquantes");
  }

  // OAuth 1.0a HMAC-SHA256 signing
  const { createHmac, randomBytes } = await import("crypto");

  const tweetText = `${content}\n\n${articleUrl}`;

  // Upload media if image exists
  let mediaId: string | undefined;
  if (imageUrl) {
    try {
      const imageResponse = await fetch(imageUrl);
      const imageBuffer = Buffer.from(await imageResponse.arrayBuffer());
      const base64Image = imageBuffer.toString("base64");

      const uploadParams = new URLSearchParams({
        media_data: base64Image,
        media_category: "tweet_image",
      });

      const uploadResult = await twitterRequest(
        "POST",
        "https://upload.twitter.com/1.1/media/upload.json",
        { media_data: base64Image, media_category: "tweet_image" },
        apiKey, apiSecret, accessToken, accessSecret,
        createHmac, randomBytes,
        true,
      );
      mediaId = uploadResult.media_id_string;
    } catch {
      // Continue sans image
    }
  }

  // Post tweet via v2 API
  const body: Record<string, unknown> = { text: tweetText };
  if (mediaId) {
    body.media = { media_ids: [mediaId] };
  }

  const result = await twitterRequest(
    "POST",
    "https://api.twitter.com/2/tweets",
    body,
    apiKey, apiSecret, accessToken, accessSecret,
    createHmac, randomBytes,
    false,
  );

  const tweetId = result.data?.id;
  // Récupérer le username depuis le token
  const username = process.env.TWITTER_USERNAME || "LAfropeen";

  return {
    postId: tweetId,
    postUrl: `https://x.com/${username}/status/${tweetId}`,
  };
}

// Helper OAuth 1.0a pour Twitter
async function twitterRequest(
  method: string,
  url: string,
  body: Record<string, unknown>,
  apiKey: string,
  apiSecret: string,
  accessToken: string,
  accessSecret: string,
  createHmac: typeof import("crypto").createHmac,
  randomBytes: typeof import("crypto").randomBytes,
  isFormEncoded: boolean,
): Promise<any> {
  const timestamp = Math.floor(Date.now() / 1000).toString();
  const nonce = randomBytes(16).toString("hex");

  const oauthParams: Record<string, string> = {
    oauth_consumer_key: apiKey,
    oauth_nonce: nonce,
    oauth_signature_method: "HMAC-SHA1",
    oauth_timestamp: timestamp,
    oauth_token: accessToken,
    oauth_version: "1.0",
  };

  // Build signature base string
  const allParams = { ...oauthParams };
  if (isFormEncoded) {
    for (const [k, v] of Object.entries(body)) {
      allParams[k] = String(v);
    }
  }

  const paramString = Object.keys(allParams)
    .sort()
    .map((k) => `${encodeURIComponent(k)}=${encodeURIComponent(allParams[k])}`)
    .join("&");

  const baseString = `${method}&${encodeURIComponent(url)}&${encodeURIComponent(paramString)}`;
  const signingKey = `${encodeURIComponent(apiSecret)}&${encodeURIComponent(accessSecret)}`;
  const signature = createHmac("sha1", signingKey).update(baseString).digest("base64");

  oauthParams.oauth_signature = signature;

  const authHeader =
    "OAuth " +
    Object.keys(oauthParams)
      .sort()
      .map((k) => `${encodeURIComponent(k)}="${encodeURIComponent(oauthParams[k])}"`)
      .join(", ");

  const headers: Record<string, string> = { Authorization: authHeader };
  let fetchBody: string | undefined;

  if (isFormEncoded) {
    headers["Content-Type"] = "application/x-www-form-urlencoded";
    fetchBody = new URLSearchParams(body as Record<string, string>).toString();
  } else {
    headers["Content-Type"] = "application/json";
    fetchBody = JSON.stringify(body);
  }

  const res = await fetch(url, { method, headers, body: fetchBody });
  if (!res.ok) {
    const text = await res.text();
    throw new Error(`Twitter API ${res.status}: ${text}`);
  }
  return res.json();
}

async function postToFacebook(content: string, articleUrl: string, imageUrl: string | null): Promise<{ postId: string; postUrl: string }> {
  const pageId = process.env.FB_PAGE_ID;
  const accessToken = process.env.FB_PAGE_ACCESS_TOKEN;

  if (!pageId || !accessToken) {
    throw new Error("Facebook API credentials manquantes");
  }

  const message = `${content}\n\n🔗 ${articleUrl}`;

  let endpoint: string;
  const params = new URLSearchParams({ access_token: accessToken, message });

  if (imageUrl) {
    endpoint = `https://graph.facebook.com/v23.0/${pageId}/photos`;
    params.set("url", imageUrl);
  } else {
    endpoint = `https://graph.facebook.com/v23.0/${pageId}/feed`;
    params.set("link", articleUrl);
  }

  const res = await fetch(endpoint, {
    method: "POST",
    body: params,
  });

  if (!res.ok) {
    const text = await res.text();
    throw new Error(`Facebook API ${res.status}: ${text}`);
  }

  const data = await res.json();
  const postId = data.id || data.post_id;

  return {
    postId,
    postUrl: `https://www.facebook.com/${postId}`,
  };
}

async function postToInstagram(content: string, articleUrl: string, imageUrl: string | null): Promise<{ postId: string; postUrl: string }> {
  const igAccountId = process.env.IG_BUSINESS_ACCOUNT_ID;
  const accessToken = process.env.FB_PAGE_ACCESS_TOKEN; // Même token que FB

  if (!igAccountId || !accessToken) {
    throw new Error("Instagram API credentials manquantes");
  }

  const igImage = getInstagramImageUrl(imageUrl);
  if (!igImage) {
    throw new Error("Instagram nécessite une image pour publier");
  }

  const caption = `${content}\n\n🔗 Lien en bio\n📰 ${articleUrl}`;

  // Step 1: Create media container
  const containerRes = await fetch(
    `https://graph.facebook.com/v23.0/${igAccountId}/media`,
    {
      method: "POST",
      body: new URLSearchParams({
        access_token: accessToken,
        image_url: igImage,
        caption,
      }),
    },
  );

  if (!containerRes.ok) {
    const text = await containerRes.text();
    throw new Error(`Instagram Container ${containerRes.status}: ${text}`);
  }

  const { id: containerId } = await containerRes.json();

  // Step 2: Publish the container
  const publishRes = await fetch(
    `https://graph.facebook.com/v23.0/${igAccountId}/media_publish`,
    {
      method: "POST",
      body: new URLSearchParams({
        access_token: accessToken,
        creation_id: containerId,
      }),
    },
  );

  if (!publishRes.ok) {
    const text = await publishRes.text();
    throw new Error(`Instagram Publish ${publishRes.status}: ${text}`);
  }

  const { id: mediaId } = await publishRes.json();

  return {
    postId: mediaId,
    postUrl: `https://www.instagram.com/p/${mediaId}/`,
  };
}

async function getLinkedInCredentials(): Promise<{ accessToken: string; memberId: string }> {
  // Priorité : base de données, puis variables d'env
  const cred = await prisma.socialCredential.findUnique({ where: { platform: "LINKEDIN" } });

  if (cred?.accessToken && cred?.memberId) {
    // Vérifier expiration
    if (cred.expiresAt && cred.expiresAt < new Date()) {
      throw new Error("LinkedIn token expiré — renouveler via /api/admin/social/linkedin/authorize");
    }
    // Alerte si expire dans moins de 7 jours
    if (cred.expiresAt) {
      const daysLeft = Math.floor((cred.expiresAt.getTime() - Date.now()) / 86400000);
      if (daysLeft < 7) {
        console.warn(`[SOCIAL] ⚠️ LinkedIn token expire dans ${daysLeft} jours — renouveler bientôt !`);
      }
    }
    return { accessToken: cred.accessToken, memberId: cred.memberId };
  }

  // Fallback sur les variables d'env
  const accessToken = process.env.LINKEDIN_ACCESS_TOKEN;
  const memberId = process.env.LINKEDIN_MEMBER_ID;
  if (accessToken && memberId) return { accessToken, memberId };

  throw new Error("LinkedIn API credentials manquantes");
}

async function postToLinkedIn(content: string, articleUrl: string, imageUrl: string | null): Promise<{ postId: string; postUrl: string }> {
  const { accessToken, memberId } = await getLinkedInCredentials();

  const author = `urn:li:person:${memberId}`;
  const text = `${content}\n\n📰 ${articleUrl}`;

  const body: Record<string, unknown> = {
    author,
    lifecycleState: "PUBLISHED",
    specificContent: {
      "com.linkedin.ugc.ShareContent": {
        shareCommentary: { text },
        shareMediaCategory: imageUrl ? "ARTICLE" : "ARTICLE",
        media: [
          {
            status: "READY",
            originalUrl: articleUrl,
            ...(imageUrl ? { thumbnails: [{ url: imageUrl }] } : {}),
            title: { text: content.split("\n")[0].slice(0, 200) },
          },
        ],
      },
    },
    visibility: {
      "com.linkedin.ugc.MemberNetworkVisibility": "PUBLIC",
    },
  };

  const res = await fetch("https://api.linkedin.com/v2/ugcPosts", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${accessToken}`,
      "Content-Type": "application/json",
      "X-Restli-Protocol-Version": "2.0.0",
    },
    body: JSON.stringify(body),
  });

  if (!res.ok) {
    const text = await res.text();
    throw new Error(`LinkedIn API ${res.status}: ${text}`);
  }

  const data = await res.json();
  const postUrn = data.id || res.headers.get("x-restli-id") || "";
  const activityId = postUrn.split(":").pop() || "";

  return {
    postId: postUrn,
    postUrl: `https://www.linkedin.com/feed/update/${postUrn}`,
  };
}

async function postToTikTok(content: string, _articleUrl: string, imageUrl: string | null): Promise<{ postId: string; postUrl: string }> {
  // TikTok Content Posting API — nécessite une app approuvée
  const accessToken = process.env.TIKTOK_ACCESS_TOKEN;

  if (!accessToken) {
    throw new Error("TikTok API credentials manquantes");
  }

  if (!imageUrl) {
    throw new Error("TikTok nécessite une image/vidéo pour publier");
  }

  // TikTok photo post via Content Posting API
  const res = await fetch("https://open.tiktokapis.com/v2/post/publish/content/init/", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${accessToken}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      post_info: {
        title: content.slice(0, 150),
        privacy_level: "PUBLIC_TO_EVERYONE",
        disable_comment: false,
        auto_add_music: true,
      },
      source_info: {
        source: "PULL_FROM_URL",
        photo_cover_index: 0,
        photo_images: [imageUrl],
      },
      post_mode: "DIRECT_POST",
      media_type: "PHOTO",
    }),
  });

  if (!res.ok) {
    const text = await res.text();
    throw new Error(`TikTok API ${res.status}: ${text}`);
  }

  const data = await res.json();

  return {
    postId: data.data?.publish_id || "pending",
    postUrl: "", // TikTok ne renvoie pas l'URL directement
  };
}

// ── Orchestrateur principal ────────────────────────────────

type Platform = "TWITTER" | "FACEBOOK" | "INSTAGRAM" | "LINKEDIN" | "TIKTOK";

const PLATFORM_POSTERS: Record<Platform, (content: string, url: string, image: string | null) => Promise<{ postId: string; postUrl: string }>> = {
  TWITTER: postToTwitter,
  FACEBOOK: postToFacebook,
  INSTAGRAM: postToInstagram,
  LINKEDIN: postToLinkedIn,
  TIKTOK: postToTikTok,
};

// Variables d'env requises par plateforme
const PLATFORM_ENV_KEYS: Record<Platform, string[]> = {
  TWITTER: ["TWITTER_API_KEY", "TWITTER_API_SECRET", "TWITTER_ACCESS_TOKEN", "TWITTER_ACCESS_TOKEN_SECRET"],
  FACEBOOK: ["FB_PAGE_ID", "FB_PAGE_ACCESS_TOKEN"],
  INSTAGRAM: ["IG_BUSINESS_ACCOUNT_ID", "FB_PAGE_ACCESS_TOKEN"],
  LINKEDIN: ["LINKEDIN_ACCESS_TOKEN", "LINKEDIN_MEMBER_ID"],
  TIKTOK: ["TIKTOK_ACCESS_TOKEN"],
};

function isPlatformConfigured(platform: Platform): boolean {
  return PLATFORM_ENV_KEYS[platform].every((key) => !!process.env[key]);
}

export async function publishToSocialMedia(article: ArticleForSocial): Promise<{
  generated: number;
  posted: number;
  failed: number;
  details: { platform: string; status: string; postUrl?: string; error?: string }[];
}> {
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL?.includes("localhost")
    ? "https://dreamteamafrica.com"
    : process.env.NEXT_PUBLIC_APP_URL || "https://dreamteamafrica.com";
  const articleUrl = `${baseUrl}/lafropeen/${article.slug}`;

  // 1. Générer le contenu social via GPT
  let socialContent: SocialContent;
  try {
    socialContent = await generateSocialContent(article);
  } catch (err: any) {
    console.error("[SOCIAL] Erreur génération contenu:", err.message);
    return { generated: 0, posted: 0, failed: 0, details: [{ platform: "ALL", status: "GENERATION_ERROR", error: err.message }] };
  }

  // 2. Identifier les plateformes configurées
  const platforms = (Object.keys(PLATFORM_POSTERS) as Platform[]).filter(isPlatformConfigured);

  if (platforms.length === 0) {
    console.log("[SOCIAL] Aucune plateforme configurée, skip");
    return { generated: 1, posted: 0, failed: 0, details: [] };
  }

  // 3. Poster sur chaque plateforme
  const details: { platform: string; status: string; postUrl?: string; error?: string }[] = [];
  let posted = 0;
  let failed = 0;

  for (const platform of platforms) {
    const contentKey = platform.toLowerCase() as keyof Omit<SocialContent, "hashtags">;
    const content = socialContent[contentKey] || socialContent.twitter; // fallback
    const poster = PLATFORM_POSTERS[platform];

    try {
      const result = await poster(content, articleUrl, article.coverImage);

      await prisma.socialPost.create({
        data: {
          articleId: article.id,
          platform,
          status: "POSTED",
          postId: result.postId,
          postUrl: result.postUrl || null,
          content,
          hashtags: socialContent.hashtags,
          imageUrl: article.coverImage,
          postedAt: new Date(),
        },
      });

      details.push({ platform, status: "POSTED", postUrl: result.postUrl });
      posted++;
    } catch (err: any) {
      console.error(`[SOCIAL] Erreur ${platform}:`, err.message);

      await prisma.socialPost.create({
        data: {
          articleId: article.id,
          platform,
          status: "FAILED",
          content,
          hashtags: socialContent.hashtags,
          imageUrl: article.coverImage,
          errorMessage: err.message?.slice(0, 500),
        },
      });

      details.push({ platform, status: "FAILED", error: err.message });
      failed++;
    }
  }

  // 4. Sauvegarder le contenu social sur l'article
  await prisma.article.update({
    where: { id: article.id },
    data: {
      socialTwitter: socialContent.twitter,
      socialFacebook: socialContent.facebook,
      socialInstagram: socialContent.instagram,
      socialLinkedin: socialContent.linkedin,
      socialTiktok: socialContent.tiktok,
    },
  });

  // 5. Générer des brouillons d'engagement (non-bloquant)
  if (posted > 0) {
    try {
      const { generateEngagementDrafts } = await import("@/lib/social-drafts");
      await generateEngagementDrafts(article.id);
      console.log(`[SOCIAL] Brouillons d'engagement générés pour ${article.id}`);
    } catch (err: any) {
      console.error("[SOCIAL] Erreur génération brouillons:", err.message);
    }
  }

  return { generated: 1, posted, failed, details };
}

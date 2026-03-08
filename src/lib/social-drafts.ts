// ============================================================
// lib/social-drafts.ts
// Gestion des brouillons d'engagement et promos L'Officiel
// Génération IA, validation admin, publication automatique
// ============================================================

import { prisma } from "@/lib/db";
import OpenAI from "openai";
import type { SocialPlatform, SocialDraftType } from "@prisma/client";

// ── OpenAI (lazy) ──────────────────────────────────────────

let _openai: OpenAI | null = null;
function getOpenAI() {
  if (!_openai) _openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
  return _openai;
}

// ── Types ──────────────────────────────────────────────────

interface GeneratedComment {
  content: string;
  type: SocialDraftType;
}

interface PublishResult {
  success: boolean;
  postId?: string;
  postUrl?: string;
  error?: string;
}

// ── Helpers ────────────────────────────────────────────────

function sectionFromSource(source: string): string {
  switch (source) {
    case "seo":
      return "saison-culturelle";
    case "seo-officiel":
      return "officiel";
    default:
      return "lafropeen";
  }
}

const CONFIGURED_PLATFORMS: SocialPlatform[] = [
  "TWITTER",
  "FACEBOOK",
  "INSTAGRAM",
  "LINKEDIN",
  "TIKTOK",
];

// ── Engagement Drafts ──────────────────────────────────────

const ENGAGEMENT_PROMPT = (
  title: string,
  excerpt: string,
  platform: string,
) => `Tu es community manager pour L'Afropéen / Dream Team Africa.

Génère 3 commentaires d'engagement pour un article publié sur ${platform}.

Article :
- Titre : ${title}
- Résumé : ${excerpt}

Les 3 commentaires doivent être :
1. Une question pertinente sur le sujet de l'article (pour stimuler l'engagement)
2. Un insight complémentaire ou une réaction authentique (pas marketing)
3. Une mention subtile de L'Officiel d'Afrique ou d'un événement à venir (cross-promotion naturelle)

Règles :
- Chaque commentaire doit sembler naturel, comme un vrai lecteur
- Adapte le ton au réseau social (${platform})
- Pas de hashtags dans les commentaires sauf sur Instagram
- Longueur : 1-3 phrases par commentaire
- En français

Réponds UNIQUEMENT en JSON valide (pas de markdown, pas de backticks) :
{
  "comments": [
    { "content": "...", "type": "ENGAGEMENT" },
    { "content": "...", "type": "COMMENT" },
    { "content": "...", "type": "COMMENT" }
  ]
}`;

export async function generateEngagementDrafts(articleId: string): Promise<{
  generated: number;
  drafts: { platform: string; content: string; type: string }[];
}> {
  // 1. Récupérer l'article et ses posts publiés
  const article = await prisma.article.findUnique({
    where: { id: articleId },
    include: {
      socialPosts: {
        where: { status: "POSTED" },
      },
    },
  });

  if (!article) {
    throw new Error(`Article introuvable: ${articleId}`);
  }

  if (article.socialPosts.length === 0) {
    return { generated: 0, drafts: [] };
  }

  const section = sectionFromSource(article.source);
  const results: { platform: string; content: string; type: string }[] = [];

  // 2. Pour chaque plateforme avec un post publié, générer des commentaires
  for (const socialPost of article.socialPosts) {
    try {
      const response = await getOpenAI().chat.completions.create({
        model: "gpt-4o-mini",
        messages: [
          {
            role: "user",
            content: ENGAGEMENT_PROMPT(
              article.title,
              article.excerpt,
              socialPost.platform,
            ),
          },
        ],
        max_tokens: 600,
        temperature: 0.9,
      });

      const raw = response.choices[0]?.message?.content || "";
      const jsonMatch = raw.match(/\{[\s\S]*\}/);
      if (!jsonMatch) {
        console.error(
          `[SOCIAL-DRAFTS] GPT n'a pas renvoyé de JSON valide pour ${socialPost.platform}`,
        );
        continue;
      }

      const parsed = JSON.parse(jsonMatch[0]) as {
        comments: GeneratedComment[];
      };

      if (!Array.isArray(parsed.comments)) {
        console.error(
          `[SOCIAL-DRAFTS] Format inattendu pour ${socialPost.platform}`,
        );
        continue;
      }

      // 3. Sauvegarder chaque brouillon
      for (const comment of parsed.comments) {
        const draftType =
          comment.type === "ENGAGEMENT" ? "ENGAGEMENT" : "COMMENT";

        await prisma.socialDraft.create({
          data: {
            platform: socialPost.platform,
            type: draftType,
            status: "DRAFT",
            content: comment.content,
            targetPostId: socialPost.postId || undefined,
            targetPostUrl: socialPost.postUrl || undefined,
            articleId: article.id,
            section,
          },
        });

        results.push({
          platform: socialPost.platform,
          content: comment.content,
          type: draftType,
        });
      }
    } catch (err: unknown) {
      const message =
        err instanceof Error ? err.message : "Erreur inconnue";
      console.error(
        `[SOCIAL-DRAFTS] Erreur génération engagement ${socialPost.platform}:`,
        message,
      );
    }
  }

  return { generated: results.length, drafts: results };
}

// ── L'Officiel d'Afrique Promo Drafts ──────────────────────

const PROMO_PROMPT = (platform: string) =>
  `Tu es community manager pour Dream Team Africa.

Génère 1 post promotionnel pour L'Officiel d'Afrique 2026 à publier sur ${platform}.

L'Officiel d'Afrique est un annuaire/répertoire gratuit qui met en avant les entrepreneurs, artisans et artistes africains et de la diaspora.

Lien d'inscription : https://dreamteamafrica.com/lofficiel-dafrique

Variations possibles (choisis-en une et développe) :
- Invitation à s'inscrire gratuitement dans L'Officiel d'Afrique 2026
- Mise en avant d'une catégorie (entrepreneur, artisan, artiste)
- Témoignage fictif réaliste d'un membre de la communauté
- Statistiques de la communauté (utilise des chiffres réalistes)

Règles :
- Adapte le ton à ${platform}
- Inclus un appel à l'action clair
- Inclus le lien https://dreamteamafrica.com/lofficiel-dafrique
- En français
- Longueur adaptée au réseau social

Réponds UNIQUEMENT en JSON valide (pas de markdown, pas de backticks) :
{
  "content": "le contenu du post"
}`;

export async function generateOfficielPromoDrafts(): Promise<{
  generated: number;
  drafts: { platform: string; content: string }[];
}> {
  const results: { platform: string; content: string }[] = [];

  for (const platform of CONFIGURED_PLATFORMS) {
    try {
      const response = await getOpenAI().chat.completions.create({
        model: "gpt-4o-mini",
        messages: [
          {
            role: "user",
            content: PROMO_PROMPT(platform),
          },
        ],
        max_tokens: 500,
        temperature: 0.85,
      });

      const raw = response.choices[0]?.message?.content || "";
      const jsonMatch = raw.match(/\{[\s\S]*\}/);
      if (!jsonMatch) {
        console.error(
          `[SOCIAL-DRAFTS] GPT n'a pas renvoyé de JSON valide pour promo ${platform}`,
        );
        continue;
      }

      const parsed = JSON.parse(jsonMatch[0]) as { content: string };

      if (!parsed.content) {
        console.error(
          `[SOCIAL-DRAFTS] Contenu promo vide pour ${platform}`,
        );
        continue;
      }

      await prisma.socialDraft.create({
        data: {
          platform,
          type: "PROMO",
          status: "DRAFT",
          content: parsed.content,
          section: "officiel",
        },
      });

      results.push({ platform, content: parsed.content });
    } catch (err: unknown) {
      const message =
        err instanceof Error ? err.message : "Erreur inconnue";
      console.error(
        `[SOCIAL-DRAFTS] Erreur génération promo ${platform}:`,
        message,
      );
    }
  }

  return { generated: results.length, drafts: results };
}

// ── Publication des brouillons approuvés ───────────────────

async function postTwitterComment(
  content: string,
  targetPostId: string | null,
  isPromo: boolean,
): Promise<PublishResult> {
  const apiKey = process.env.TWITTER_API_KEY;
  const apiSecret = process.env.TWITTER_API_SECRET;
  const accessToken = process.env.TWITTER_ACCESS_TOKEN;
  const accessSecret = process.env.TWITTER_ACCESS_TOKEN_SECRET;

  if (!apiKey || !apiSecret || !accessToken || !accessSecret) {
    return { success: false, error: "Twitter API credentials manquantes" };
  }

  const { createHmac, randomBytes } = await import("crypto");

  const body: Record<string, unknown> = { text: content };

  // Si c'est un commentaire/reply et qu'on a un targetPostId, répondre au tweet
  if (!isPromo && targetPostId) {
    body.reply = { in_reply_to_tweet_id: targetPostId };
  }

  const url = "https://api.twitter.com/2/tweets";
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

  const paramString = Object.keys(oauthParams)
    .sort()
    .map((k) => `${encodeURIComponent(k)}=${encodeURIComponent(oauthParams[k])}`)
    .join("&");

  const baseString = `POST&${encodeURIComponent(url)}&${encodeURIComponent(paramString)}`;
  const signingKey = `${encodeURIComponent(apiSecret)}&${encodeURIComponent(accessSecret)}`;
  const signature = createHmac("sha1", signingKey)
    .update(baseString)
    .digest("base64");

  oauthParams.oauth_signature = signature;

  const authHeader =
    "OAuth " +
    Object.keys(oauthParams)
      .sort()
      .map(
        (k) =>
          `${encodeURIComponent(k)}="${encodeURIComponent(oauthParams[k])}"`,
      )
      .join(", ");

  const res = await fetch(url, {
    method: "POST",
    headers: {
      Authorization: authHeader,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(body),
  });

  if (!res.ok) {
    const text = await res.text();
    return { success: false, error: `Twitter API ${res.status}: ${text}` };
  }

  const data = await res.json();
  const tweetId = data.data?.id;
  const username = process.env.TWITTER_USERNAME || "LAfropeen";

  return {
    success: true,
    postId: tweetId,
    postUrl: `https://x.com/${username}/status/${tweetId}`,
  };
}

async function postFacebookComment(
  content: string,
  targetPostId: string | null,
  isPromo: boolean,
): Promise<PublishResult> {
  const pageId = process.env.FB_PAGE_ID;
  const accessToken = process.env.FB_PAGE_ACCESS_TOKEN;

  if (!pageId || !accessToken) {
    return { success: false, error: "Facebook API credentials manquantes" };
  }

  let endpoint: string;
  const params = new URLSearchParams({
    access_token: accessToken,
  });

  if (isPromo || !targetPostId) {
    // Post autonome sur la page
    endpoint = `https://graph.facebook.com/v23.0/${pageId}/feed`;
    params.set("message", content);
  } else {
    // Commentaire sur un post existant
    endpoint = `https://graph.facebook.com/v23.0/${targetPostId}/comments`;
    params.set("message", content);
  }

  const res = await fetch(endpoint, {
    method: "POST",
    body: params,
  });

  if (!res.ok) {
    const text = await res.text();
    return { success: false, error: `Facebook API ${res.status}: ${text}` };
  }

  const data = await res.json();
  const postId = data.id;

  return {
    success: true,
    postId,
    postUrl: `https://www.facebook.com/${postId}`,
  };
}

async function postInstagramComment(
  content: string,
  targetPostId: string | null,
  isPromo: boolean,
): Promise<PublishResult> {
  // Instagram ne permet pas l'auto-publication de posts via l'API (seulement les commentaires)
  if (isPromo || !targetPostId) {
    return {
      success: false,
      error:
        "Instagram ne supporte pas la publication automatique de posts promotionnels",
    };
  }

  const accessToken = process.env.FB_PAGE_ACCESS_TOKEN;

  if (!accessToken) {
    return { success: false, error: "Instagram API credentials manquantes" };
  }

  const endpoint = `https://graph.facebook.com/v23.0/${targetPostId}/comments`;
  const params = new URLSearchParams({
    access_token: accessToken,
    message: content,
  });

  const res = await fetch(endpoint, {
    method: "POST",
    body: params,
  });

  if (!res.ok) {
    const text = await res.text();
    return { success: false, error: `Instagram API ${res.status}: ${text}` };
  }

  const data = await res.json();

  return {
    success: true,
    postId: data.id,
    postUrl: undefined, // Instagram ne fournit pas d'URL de commentaire directe
  };
}

async function postLinkedInComment(
  content: string,
  targetPostId: string | null,
  targetPostUrl: string | null,
  isPromo: boolean,
): Promise<PublishResult> {
  // Récupérer les credentials LinkedIn (même pattern que social-media.ts)
  const cred = await prisma.socialCredential.findUnique({
    where: { platform: "LINKEDIN" },
  });

  let accessToken: string | undefined;
  let memberId: string | undefined;

  if (cred?.accessToken && cred?.memberId) {
    if (cred.expiresAt && cred.expiresAt < new Date()) {
      return { success: false, error: "LinkedIn token expiré" };
    }
    accessToken = cred.accessToken;
    memberId = cred.memberId;
  } else {
    accessToken = process.env.LINKEDIN_ACCESS_TOKEN;
    memberId = process.env.LINKEDIN_MEMBER_ID;
  }

  if (!accessToken || !memberId) {
    return { success: false, error: "LinkedIn API credentials manquantes" };
  }

  if (isPromo || !targetPostId) {
    // Post autonome
    const author = `urn:li:person:${memberId}`;

    const body = {
      author,
      lifecycleState: "PUBLISHED",
      specificContent: {
        "com.linkedin.ugc.ShareContent": {
          shareCommentary: { text: content },
          shareMediaCategory: "NONE",
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
      return { success: false, error: `LinkedIn API ${res.status}: ${text}` };
    }

    const data = await res.json();
    const postUrn = data.id || res.headers.get("x-restli-id") || "";

    return {
      success: true,
      postId: postUrn,
      postUrl: `https://www.linkedin.com/feed/update/${postUrn}`,
    };
  }

  // Commentaire sur un post existant
  // Le targetPostId devrait être un URN LinkedIn (urn:li:ugcPost:xxx ou urn:li:share:xxx)
  const postUrn = targetPostId;
  const encodedUrn = encodeURIComponent(postUrn);

  const commentBody = {
    actor: `urn:li:person:${memberId}`,
    message: { text: content },
  };

  const res = await fetch(
    `https://api.linkedin.com/v2/socialActions/${encodedUrn}/comments`,
    {
      method: "POST",
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "Content-Type": "application/json",
        "X-Restli-Protocol-Version": "2.0.0",
      },
      body: JSON.stringify(commentBody),
    },
  );

  if (!res.ok) {
    const text = await res.text();
    return {
      success: false,
      error: `LinkedIn Comments API ${res.status}: ${text}`,
    };
  }

  const data = await res.json();

  return {
    success: true,
    postId: data.id || undefined,
    postUrl: targetPostUrl || undefined,
  };
}

// ── Orchestrateur de publication ───────────────────────────

export async function publishApprovedDraft(
  draftId: string,
): Promise<PublishResult> {
  const draft = await prisma.socialDraft.findUnique({
    where: { id: draftId },
  });

  if (!draft) {
    return { success: false, error: `Brouillon introuvable: ${draftId}` };
  }

  if (draft.status !== "APPROVED") {
    return {
      success: false,
      error: `Brouillon non approuvé (statut actuel: ${draft.status})`,
    };
  }

  // Utiliser le contenu édité s'il existe, sinon le contenu original
  const content = draft.editedContent || draft.content;
  const isPromo = draft.type === "PROMO";

  let result: PublishResult;

  try {
    switch (draft.platform) {
      case "TWITTER":
        result = await postTwitterComment(
          content,
          draft.targetPostId,
          isPromo,
        );
        break;

      case "FACEBOOK":
        result = await postFacebookComment(
          content,
          draft.targetPostId,
          isPromo,
        );
        break;

      case "INSTAGRAM":
        result = await postInstagramComment(
          content,
          draft.targetPostId,
          isPromo,
        );
        break;

      case "LINKEDIN":
        result = await postLinkedInComment(
          content,
          draft.targetPostId,
          draft.targetPostUrl,
          isPromo,
        );
        break;

      case "TIKTOK":
        // TikTok ne supporte pas les commentaires via API ni les posts texte
        result = {
          success: false,
          error:
            "TikTok ne supporte pas la publication de commentaires ou posts texte via l'API",
        };
        break;

      default:
        result = {
          success: false,
          error: `Plateforme non supportée: ${draft.platform}`,
        };
    }
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Erreur inconnue";
    result = { success: false, error: message };
  }

  // Mettre à jour le brouillon avec le résultat
  if (result.success) {
    await prisma.socialDraft.update({
      where: { id: draftId },
      data: {
        status: "POSTED",
        postId: result.postId || null,
        postUrl: result.postUrl || null,
        postedAt: new Date(),
      },
    });
  } else {
    await prisma.socialDraft.update({
      where: { id: draftId },
      data: {
        status: "FAILED",
        errorMessage: result.error?.slice(0, 500) || null,
      },
    });
  }

  return result;
}

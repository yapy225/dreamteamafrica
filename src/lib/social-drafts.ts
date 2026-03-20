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

// ── Exposant Visibility Drafts ────────────────────────────

const EXPOSANT_PROMPT = (
  companyName: string,
  sector: string,
  description: string,
  socialLinks: string,
  eventName: string,
  platform: string,
) => `Tu es community manager pour Dream Team Africa.

Génère 1 post promotionnel pour présenter un exposant de la ${eventName}.

Exposant :
- Entreprise : ${companyName}
- Secteur : ${sector}
- Description : ${description}
${socialLinks ? `- Réseaux sociaux : ${socialLinks}` : ""}

Objectif : donner envie aux visiteurs de venir découvrir cet exposant à l'événement.

Règles :
- Adapte le ton à ${platform}
- Commence par une accroche engageante (pas "Découvrez" à chaque fois, varie les formules)
- IDENTIFIE CLAIREMENT l'exposant : mentionne "${companyName}" en MAJUSCULES ou en gras
- Intègre un extrait de la description si pertinent
- IMPORTANT : Tag/identifie OBLIGATOIREMENT les réseaux sociaux de l'exposant dans le post (@ sur Instagram/Twitter/TikTok, tag sur Facebook/LinkedIn)
- Le lecteur doit immédiatement savoir QUI est présenté et CE QU'IL FAIT
- Inclus 3-5 hashtags pertinents dont #FoiredAfrique #DreamTeamAfrica
- En français
- Longueur adaptée au réseau social (court pour Twitter/TikTok, plus détaillé pour LinkedIn/Facebook)

Réponds UNIQUEMENT en JSON valide (pas de markdown, pas de backticks) :
{
  "content": "le contenu du post"
}`;

export async function generateExhibitorDrafts(profileId?: string): Promise<{
  generated: number;
  drafts: { platform: string; content: string; companyName: string }[];
}> {
  // Fetch submitted profiles (with booking info for event names)
  const where: Record<string, unknown> = { submittedAt: { not: null } };
  if (profileId) where.id = profileId;

  const profiles = await prisma.exhibitorProfile.findMany({
    where,
    include: {
      booking: {
        select: { companyName: true, events: true },
      },
    },
  });

  if (profiles.length === 0) {
    // If none submitted, generate for all profiles that have at least a description
    const allProfiles = await prisma.exhibitorProfile.findMany({
      where: profileId
        ? { id: profileId }
        : { OR: [{ description: { not: null } }, { companyName: { not: null } }] },
      include: {
        booking: {
          select: { companyName: true, events: true },
        },
      },
    });

    if (allProfiles.length === 0) {
      return { generated: 0, drafts: [] };
    }

    profiles.push(
      ...allProfiles.filter((p) => !profiles.some((ep) => ep.id === p.id)),
    );
  }

  const results: { platform: string; content: string; companyName: string }[] = [];
  const platforms: SocialPlatform[] = ["TWITTER", "FACEBOOK", "INSTAGRAM", "LINKEDIN", "TIKTOK"];

  for (const profile of profiles) {
    const companyName = profile.companyName || profile.booking.companyName;
    const sector = profile.sector || "";
    const description = profile.description || companyName;
    const eventName = "Foire d'Afrique Paris 2026";

    // Build social links string
    const socialParts: string[] = [];
    if (profile.facebook) socialParts.push(`Facebook: ${profile.facebook}`);
    if (profile.instagram) socialParts.push(`Instagram: ${profile.instagram}`);
    if (profile.twitter) socialParts.push(`X/Twitter: ${profile.twitter}`);
    if (profile.linkedin) socialParts.push(`LinkedIn: ${profile.linkedin}`);
    if (profile.tiktok) socialParts.push(`TikTok: ${profile.tiktok}`);
    const socialLinks = socialParts.join(", ");

    // Pick image URL (first available)
    const imageUrl = profile.image1Url || profile.image2Url || profile.image3Url || profile.logoUrl;

    // Check if drafts already exist for this profile
    const existing = await prisma.socialDraft.count({
      where: {
        section: "exposant",
        content: { contains: companyName },
        status: { in: ["DRAFT", "APPROVED", "POSTED"] },
      },
    });

    if (existing > 0) continue; // Skip if already generated

    // Generate all platforms in parallel for speed
    const platformResults = await Promise.allSettled(
      platforms.map(async (platform) => {
        const response = await getOpenAI().chat.completions.create({
          model: "gpt-4o-mini",
          messages: [
            {
              role: "user",
              content: EXPOSANT_PROMPT(
                companyName,
                sector,
                description,
                socialLinks,
                eventName,
                platform,
              ),
            },
          ],
          max_tokens: 500,
          temperature: 0.85,
        });

        const raw = response.choices[0]?.message?.content || "";
        const jsonMatch = raw.match(/\{[\s\S]*\}/);
        if (!jsonMatch) {
          console.error(`[SOCIAL-DRAFTS] GPT invalid JSON for exposant ${companyName} on ${platform}`);
          return null;
        }

        const parsed = JSON.parse(jsonMatch[0]) as { content: string };
        if (!parsed.content) return null;

        await prisma.socialDraft.create({
          data: {
            platform,
            type: "PROMO",
            status: "DRAFT",
            content: parsed.content,
            imageUrl: imageUrl || null,
            section: "exposant",
          },
        });

        return { platform, content: parsed.content, companyName };
      }),
    );

    for (const r of platformResults) {
      if (r.status === "fulfilled" && r.value) {
        results.push(r.value);
      } else if (r.status === "rejected") {
        console.error(`[SOCIAL-DRAFTS] Erreur exposant ${companyName}:`, r.reason);
      }
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

// ── Option B: Generate + Publish directly for one exhibitor ──

const EXPOSANT_PUBLISH_PROMPT = (
  companyName: string,
  sector: string,
  description: string,
  socialLinks: string,
  eventName: string,
  platform: string,
  allExhibitors: string,
) => `Tu es le community manager de Dream Team Africa.

Rédige 1 post promotionnel pour présenter l'exposant "${companyName}" à la ${eventName} (1er & 2 mai 2026, Espace MAS, Paris 13e).

Exposant mis en avant :
- Entreprise : ${companyName}
- Secteur : ${sector}
- Description : ${description}
${socialLinks ? `- Réseaux sociaux : ${socialLinks}` : ""}

═══ TOUS LES EXPOSANTS DE LA FOIRE ═══
${allExhibitors}

Plateforme cible : ${platform}

RÈGLES STRICTES par plateforme :
${platform === "TWITTER" ? `- Max 280 caractères
- Accroche percutante et directe
- 2-3 hashtags max
- Mentionne @DreamTeamAfrica` : ""}
${platform === "FACEBOOK" ? `- 3-5 lignes engageantes
- Ton chaleureux et communautaire
- Termine par un appel à l'action (venez découvrir...)
- 3-5 hashtags en fin de post
- Mentionne @DreamTeamAfrica
- Mentionne/identifie les autres exposants de la foire quand c'est pertinent` : ""}
${platform === "INSTAGRAM" ? `- Légende engageante de 4-6 lignes
- Emojis pertinents (pas trop)
- 10-15 hashtags séparés par un saut de ligne
- Mentionne @dreamteamafrica
- Mentionne 3-5 autres exposants avec leur @ Instagram` : ""}
${platform === "LINKEDIN" ? `- Post professionnel de 5-8 lignes
- Ton business / networking
- Met en valeur l'expertise et le savoir-faire
- 3-5 hashtags professionnels
- Format storytelling avec accroche forte
- Mentionne que l'exposant rejoint X autres entreprises à la Foire` : ""}
${platform === "TIKTOK" ? `- Légende courte et percutante (2-3 lignes)
- Langage dynamique, jeune
- Emojis et énergie
- 5-8 hashtags tendance dont #FYP #PourToi
- Mentionne @dreamteamafrica` : ""}

Règles générales :
- En français
- IDENTIFIE CLAIREMENT l'exposant principal : mentionne "${companyName}" en MAJUSCULES
- Tag/mentionne OBLIGATOIREMENT les réseaux sociaux de l'exposant
- MENTIONNE aussi les autres exposants de la foire (surtout ceux du même secteur) pour créer une dynamique collective
- Inclus #FoiredAfrique #DreamTeamAfrica
- Ne commence JAMAIS par "Découvrez", varie les accroches
- Le lecteur doit savoir QUI est présenté, CE QU'IL FAIT, et qu'il y a PLEIN D'AUTRES EXPOSANTS à découvrir

Réponds UNIQUEMENT en JSON valide (pas de markdown) :
{
  "content": "le contenu du post"
}`;

export async function generateAndPublishExhibitorPosts(profileId: string): Promise<{
  generated: number;
  published: number;
  failed: number;
  details: Array<{ platform: string; status: string; postUrl?: string; error?: string }>;
}> {
  const profile = await prisma.exhibitorProfile.findUnique({
    where: { id: profileId },
    include: {
      booking: { select: { companyName: true, events: true } },
    },
  });

  if (!profile) {
    throw new Error("Profil introuvable");
  }

  const companyName = profile.companyName || profile.booking.companyName;
  const sector = profile.sector || "";
  const description = profile.description || companyName;
  const eventName = "Foire d'Afrique Paris 2026";

  // Load all exhibitors for cross-promotion
  const allProfiles = await prisma.exhibitorProfile.findMany({
    where: {
      booking: { status: { in: ["PARTIAL", "CONFIRMED"] } },
    },
    include: {
      booking: { select: { companyName: true, sector: true } },
    },
  });

  const allExhibitors = allProfiles
    .map((p) => {
      const name = p.companyName || p.booking.companyName;
      const sec = p.sector || p.booking.sector;
      const socials = [
        p.instagram ? `IG: @${p.instagram.replace(/^@/, "")}` : "",
        p.facebook ? `FB: ${p.facebook}` : "",
        p.tiktok ? `TK: @${p.tiktok.replace(/^@/, "")}` : "",
      ].filter(Boolean).join(", ");
      return `- ${name} (${sec})${socials ? ` — ${socials}` : ""}`;
    })
    .join("\n");

  // Build social links
  const socialParts: string[] = [];
  if (profile.facebook) socialParts.push(`Facebook: ${profile.facebook}`);
  if (profile.instagram) socialParts.push(`Instagram: @${profile.instagram.replace(/^@/, "")}`);
  if (profile.twitter) socialParts.push(`X/Twitter: @${profile.twitter.replace(/^@/, "")}`);
  if (profile.linkedin) socialParts.push(`LinkedIn: ${profile.linkedin}`);
  if (profile.tiktok) socialParts.push(`TikTok: @${profile.tiktok.replace(/^@/, "")}`);
  const socialLinks = socialParts.join(", ");

  const imageUrl = profile.image1Url || profile.image2Url || profile.image3Url || profile.logoUrl;

  // Platforms that support auto-publish
  const publishablePlatforms: Array<{ platform: SocialPlatform; canPublish: boolean }> = [
    { platform: "TWITTER", canPublish: true },
    { platform: "FACEBOOK", canPublish: true },
    { platform: "INSTAGRAM", canPublish: false }, // Instagram doesn't support promo auto-publish
    { platform: "LINKEDIN", canPublish: true },
    { platform: "TIKTOK", canPublish: false }, // TikTok doesn't support text posts
  ];

  const details: Array<{ platform: string; status: string; postUrl?: string; error?: string }> = [];
  let generated = 0;
  let published = 0;
  let failed = 0;

  for (const { platform, canPublish } of publishablePlatforms) {
    try {
      // Generate content via AI
      const response = await getOpenAI().chat.completions.create({
        model: "gpt-4o-mini",
        messages: [
          {
            role: "user",
            content: EXPOSANT_PUBLISH_PROMPT(
              companyName,
              sector,
              description,
              socialLinks,
              eventName,
              platform,
              allExhibitors,
            ),
          },
        ],
        max_tokens: 600,
        temperature: 0.85,
      });

      const raw = response.choices[0]?.message?.content || "";
      const jsonMatch = raw.match(/\{[\s\S]*\}/);
      if (!jsonMatch) {
        failed++;
        details.push({ platform, status: "error", error: "IA: JSON invalide" });
        continue;
      }

      const parsed = JSON.parse(jsonMatch[0]) as { content: string };
      if (!parsed.content) {
        failed++;
        details.push({ platform, status: "error", error: "IA: contenu vide" });
        continue;
      }

      generated++;

      // Create draft with APPROVED status (ready to publish)
      const draft = await prisma.socialDraft.create({
        data: {
          platform,
          type: "PROMO",
          status: canPublish ? "APPROVED" : "DRAFT",
          content: parsed.content,
          imageUrl: imageUrl || null,
          section: "exposant",
        },
      });

      if (canPublish) {
        // Publish directly
        const publishResult = await publishApprovedDraft(draft.id);

        if (publishResult.success) {
          published++;
          // Update ExhibitorPublication
          await prisma.exhibitorPublication.upsert({
            where: { profileId_platform: { profileId, platform: platform.toLowerCase() } },
            create: {
              profileId,
              platform: platform.toLowerCase(),
              status: "POSTED",
              postUrl: publishResult.postUrl || null,
              postedAt: new Date(),
            },
            update: {
              status: "POSTED",
              postUrl: publishResult.postUrl || null,
              postedAt: new Date(),
            },
          });
          details.push({ platform, status: "published", postUrl: publishResult.postUrl });
        } else {
          failed++;
          details.push({ platform, status: "failed", error: publishResult.error });
        }
      } else {
        // Save as draft for manual publishing (Instagram, TikTok)
        details.push({ platform, status: "draft", error: `${platform} ne supporte pas la publication auto — brouillon sauvegardé` });
      }

      // Rate limit between API calls
      await new Promise((r) => setTimeout(r, 500));
    } catch (err) {
      failed++;
      const msg = err instanceof Error ? err.message : String(err);
      details.push({ platform, status: "error", error: msg });
    }
  }

  // Update profile promo status
  if (published > 0) {
    await prisma.exhibitorProfile.update({
      where: { id: profileId },
      data: { promoStatus: "POSTED" },
    });
  }

  return { generated, published, failed, details };
}

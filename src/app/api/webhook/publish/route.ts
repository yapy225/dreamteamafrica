// ============================================================
// app/api/webhook/publish/route.ts
// L'AFROPEEN / DreamTeamAfrica — Webhook Make.com → Publication
//
// Endpoint securise par cle secrete (pas NextAuth, car c'est
// Make.com qui appelle, pas un utilisateur connecte).
// Accepte les champs en camelCase ET snake_case.
// ============================================================

import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { marked } from "marked";
import { generateCoverImage } from "@/lib/generate-cover-image";
import { publishToSocialMedia } from "@/lib/social-media";

// Vercel Pro: timeout 60s pour laisser DALL-E generer l'image
export const maxDuration = 60;

// --- Types (accepte camelCase + snake_case) ---
interface WebhookPayload {
  secret_key: string;

  // Contenu editorial
  title: string;
  slug?: string;
  excerpt: string;
  content?: string;
  content_html?: string;
  category: string;
  coverImage?: string;
  cover_image?: string;
  image_url?: string;
  altText?: string;
  alt_text?: string;
  tags?: string[];
  keywords?: string[];

  // SEO
  metaTitle?: string;
  meta_title?: string;
  metaDescription?: string;
  meta_description?: string;

  // Tracabilite
  sourceUrl?: string;
  source_url?: string;
  authorType?: string;
  author_type?: string;

  // Reseaux sociaux
  social?: {
    twitter?: string;
    instagram?: string;
    linkedin?: string;
    facebook?: string;
    tiktok?: string;
  };

  // Options
  status?: "DRAFT" | "PUBLISHED";
  featured?: boolean;
  source?: string;
  authorId?: string;
  author_id?: string;
}

// --- Helper: resoudre camelCase / snake_case ---
function resolve<T>(camel: T | undefined, snake: T | undefined): T | undefined {
  return camel !== undefined ? camel : snake;
}

// --- Categories valides (enum Prisma ArticleCategory) ---
const VALID_CATEGORIES = [
  "ACTUALITE",
  "CULTURE",
  "CINEMA",
  "MUSIQUE",
  "SPORT",
  "DIASPORA",
  "BUSINESS",
  "LIFESTYLE",
  "OPINION",
] as const;

// --- Mapping categories Airtable → Prisma ---
const CATEGORY_MAP: Record<string, string> = {
  "ACTUALITÉ GÉNÉRALE": "ACTUALITE",
  "ACTUALITE GENERALE": "ACTUALITE",
  "ÉCONOMIE & FINANCE": "BUSINESS",
  "ECONOMIE & FINANCE": "BUSINESS",
  "DIASPORA & CULTURE": "CULTURE",
  "INSTITUTIONNEL": "ACTUALITE",
  "TECHNOLOGIE": "BUSINESS",
  "SPORT": "SPORT",
  "FOOTBALL": "SPORT",
  "MUSIQUE": "MUSIQUE",
  "CINEMA": "CINEMA",
  "FILM": "CINEMA",
  "MODE": "LIFESTYLE",
  "POLITIQUE": "ACTUALITE",
};

// --- Sanitisation HTML ---
function sanitizeHtml(dirty: string): string {
  return dirty
    .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, "")
    .replace(/<style\b[^<]*(?:(?!<\/style>)<[^<]*)*<\/style>/gi, "")
    .replace(/\son\w+\s*=\s*["'][^"']*["']/gi, "")
    .replace(/\son\w+\s*=\s*[^\s>]*/gi, "")
    .replace(/javascript\s*:/gi, "")
    .replace(/data\s*:/gi, "")
    .replace(/<img\s([^>]*?)>/gi, (_, attrs) => {
      if (!attrs.includes("loading=")) attrs += ' loading="lazy"';
      return `<img ${attrs}>`;
    })
    .replace(/<a\s([^>]*?)>/gi, (_, attrs) => {
      if (!attrs.includes("target=")) attrs += ' target="_blank"';
      if (!attrs.includes("rel=")) attrs += ' rel="noopener noreferrer"';
      return `<a ${attrs}>`;
    })
    .trim();
}

// --- Generation de slug ---
function generateSlug(title: string): string {
  return title
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "");
}

// --- Calcul du temps de lecture ---
function computeReadingTime(html: string): number {
  const text = html.replace(/<[^>]*>/g, "");
  const words = text.split(/\s+/).filter(Boolean).length;
  return Math.max(1, Math.ceil(words / 200));
}

// ============================================================
// POST /api/webhook/publish
// ============================================================
export async function POST(request: NextRequest) {
  try {
    // 1. Parser le body (nettoyer les caracteres de controle invalides)
    const rawText = await request.text();
    const cleanText = rawText.replace(/[\x00-\x1F\x7F]/g, (ch) =>
      ch === "\n" || ch === "\r" || ch === "\t" ? ch : ""
    );

    let rawBody: Record<string, unknown>;
    try {
      rawBody = JSON.parse(cleanText);
    } catch {
      return NextResponse.json(
        { success: false, message: "JSON invalide" },
        { status: 400 }
      );
    }

    // Normaliser les cles: "Title" → "title", "Résumé RSS" → "resume_rss", etc.
    const normalized: Record<string, unknown> = {};
    for (const [key, value] of Object.entries(rawBody)) {
      const k = key
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "")
        .toLowerCase()
        .trim()
        .replace(/\s+/g, "_");
      normalized[k] = value;
    }

    // Mapping des noms de champs Airtable francais → champs webhook
    const FIELD_ALIASES: Record<string, string> = {
      titre: "title",
      resume_rss: "excerpt",
      contenu_reecrit_ia: "content",
      categorie_source: "category",
      lien_original: "source_url",
      image_originale_url: "image_url",
      image_ia_url: "cover_image",
      media_source: "source",
      score_ia_pertinence: "_score",
      statut_editorial: "_statut",
      date_publication_source: "_date_source",
      "publie_?": "_publie",
      auteur_interne: "author_id",
      notes_redaction: "_notes",
    };

    const mapped: Record<string, unknown> = {};
    for (const [k, v] of Object.entries(normalized)) {
      const alias = FIELD_ALIASES[k];
      if (alias?.startsWith("_")) continue; // champs ignores
      mapped[alias || k] = v;
    }
    const body = mapped as unknown as WebhookPayload;

    // 2. Verifier la cle secrete
    const SECRET = process.env.WEBHOOK_SECRET_KEY;
    if (!SECRET || body.secret_key !== SECRET) {
      return NextResponse.json(
        { success: false, message: "Unauthorized" },
        { status: 401 }
      );
    }

    // 3. Resoudre les aliases camelCase / snake_case
    const contentInput = resolve(body.content, body.content_html);
    // Convertir Markdown → HTML si le contenu commence par # ou contient des patterns Markdown
    const contentRaw = contentInput && /^#{1,6}\s|^\*\*|^\-\s|\n#{1,6}\s/m.test(contentInput)
      ? (marked.parse(contentInput) as string)
      : contentInput;
    const coverImage = resolve(body.coverImage, body.cover_image) || body.image_url;
    const altText = resolve(body.altText, body.alt_text);
    const tags = body.tags || body.keywords || [];
    const metaTitle = resolve(body.metaTitle, body.meta_title);
    const metaDescription = resolve(body.metaDescription, body.meta_description);
    const sourceUrl = resolve(body.sourceUrl, body.source_url);
    const authorType = resolve(body.authorType, body.author_type) || "ia";
    const authorId = resolve(body.authorId, body.author_id);

    // 4. Valider les champs obligatoires
    if (!body.title || !body.excerpt || !contentRaw || !body.category) {
      return NextResponse.json(
        {
          success: false,
          message:
            "Champs obligatoires manquants : title, excerpt, content (ou content_html), category",
        },
        { status: 400 }
      );
    }

    // 5. Valider la categorie (mapping Airtable → Prisma + enum)
    let category = body.category.toUpperCase().trim();
    // Essayer le mapping Airtable si la categorie n'est pas directement valide
    if (!VALID_CATEGORIES.includes(category as any)) {
      category = CATEGORY_MAP[category] || category;
    }
    if (!VALID_CATEGORIES.includes(category as any)) {
      // Fallback: assigner ACTUALITE plutot que rejeter
      category = "ACTUALITE";
    }

    // 6. Preparer le slug (unique)
    let slug = body.slug ? generateSlug(body.slug) : generateSlug(body.title);

    // 6b. Generer une image de couverture via DALL-E
    // Si une image originale est fournie, DALL-E la reproduit ; sinon, genere depuis le titre
    const originalImageUrl = coverImage || null;
    const resolvedCoverImage = await generateCoverImage(body.title, category, slug, originalImageUrl);

    // Verifier collision et mettre a jour si existant
    const existingBySlug = await prisma.article.findUnique({
      where: { slug },
      select: { id: true },
    });

    if (existingBySlug) {
      const updated = await prisma.article.update({
        where: { slug },
        data: {
          title: body.title.trim(),
          excerpt: body.excerpt.trim(),
          content: sanitizeHtml(contentRaw),
          category: category as any,
          coverImage: resolvedCoverImage || undefined,
          altText: altText?.trim() || undefined,
          tags,
          metaTitle: metaTitle?.trim() || body.title.trim(),
          metaDescription: metaDescription?.trim() || body.excerpt.trim(),
          sourceUrl: sourceUrl || undefined,
          authorType,
          socialTwitter: body.social?.twitter || undefined,
          socialInstagram: body.social?.instagram || undefined,
          socialLinkedin: body.social?.linkedin || undefined,
          socialFacebook: body.social?.facebook || undefined,
          socialTiktok: body.social?.tiktok || undefined,
          readingTimeMin: computeReadingTime(contentRaw),
          source: body.source || "make_webhook",
        },
      });

      return NextResponse.json(
        {
          success: true,
          message: "Article mis a jour",
          article_id: updated.id,
          slug: updated.slug,
        },
        { status: 200 }
      );
    }

    // 7. Trouver l'auteur par defaut (premier ADMIN)
    let resolvedAuthorId = authorId;
    if (!resolvedAuthorId) {
      const adminUser = await prisma.user.findFirst({
        where: { role: "ADMIN" },
        select: { id: true },
      });
      if (!adminUser) {
        return NextResponse.json(
          {
            success: false,
            message: "Aucun utilisateur ADMIN trouve pour l'attribution",
          },
          { status: 500 }
        );
      }
      resolvedAuthorId = adminUser.id;
    }

    // 8. Creer l'article
    const article = await prisma.article.create({
      data: {
        title: body.title.trim(),
        slug,
        excerpt: body.excerpt.trim(),
        content: sanitizeHtml(contentRaw),
        category: category as any,
        coverImage: resolvedCoverImage || null,
        altText: altText?.trim() || null,
        tags,
        readingTimeMin: computeReadingTime(contentRaw),
        metaTitle: metaTitle?.trim() || body.title.trim(),
        metaDescription: metaDescription?.trim() || body.excerpt.trim(),
        sourceUrl: sourceUrl || null,
        authorType,
        socialTwitter: body.social?.twitter || null,
        socialInstagram: body.social?.instagram || null,
        socialLinkedin: body.social?.linkedin || null,
        socialFacebook: body.social?.facebook || null,
        socialTiktok: body.social?.tiktok || null,
        status: (body.status as any) || "PUBLISHED",
        position: "UNE",
        dayCount: 1,
        featured: body.featured || false,
        source: body.source || "make_webhook",
        publishedAt: new Date(),
        authorId: resolvedAuthorId,
      },
    });

    // 9. Publication automatique sur les réseaux sociaux
    let socialResult = null;
    try {
      socialResult = await publishToSocialMedia({
        id: article.id,
        title: article.title,
        slug: article.slug,
        excerpt: article.excerpt,
        category: article.category,
        coverImage: article.coverImage,
        tags: article.tags,
      });
    } catch (socialErr: any) {
      console.error("[WEBHOOK] Social error (non-blocking):", socialErr.message);
    }

    // 10. Reponse succes
    return NextResponse.json(
      {
        success: true,
        message: "Article publie avec succes",
        article_id: article.id,
        slug: article.slug,
        social: socialResult,
      },
      { status: 201 }
    );
  } catch (error: any) {
    console.error("[WEBHOOK PUBLISH ERROR]", error);

    if (error?.code === "P2002") {
      return NextResponse.json(
        { success: false, message: "Un article avec ce slug existe deja" },
        { status: 409 }
      );
    }

    return NextResponse.json(
      {
        success: false,
        message: "Erreur serveur",
        detail:
          process.env.NODE_ENV === "development" ? error.message : undefined,
      },
      { status: 500 }
    );
  }
}

// Bloquer les autres methodes
export async function GET() {
  return NextResponse.json(
    { success: false, message: "POST uniquement" },
    { status: 405 }
  );
}

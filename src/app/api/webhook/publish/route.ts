// ============================================================
// app/api/webhook/publish/route.ts
// L'AFROPEEN / DreamTeamAfrica — Webhook Make.com → Publication
//
// Endpoint securise par cle secrete (pas NextAuth, car c'est
// Make.com qui appelle, pas un utilisateur connecte).
// Utilise Prisma comme le reste du projet.
// ============================================================

import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";

// --- Types ---
interface WebhookPayload {
  secret_key: string;

  // Contenu editorial
  title: string;
  slug?: string;
  excerpt: string;
  content: string;
  category: string;
  coverImage?: string;
  altText?: string;
  tags?: string[];

  // SEO
  metaTitle?: string;
  metaDescription?: string;

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
}

// --- Categories valides (enum Prisma ArticleCategory) ---
const VALID_CATEGORIES = [
  "ACTUALITE",
  "CULTURE",
  "DIASPORA",
  "BUSINESS",
  "LIFESTYLE",
  "OPINION",
] as const;

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
    // 1. Parser le body
    const body: WebhookPayload = await request.json();

    // 2. Verifier la cle secrete
    const SECRET = process.env.WEBHOOK_SECRET_KEY;
    if (!SECRET || body.secret_key !== SECRET) {
      return NextResponse.json(
        { success: false, message: "Unauthorized" },
        { status: 401 }
      );
    }

    // 3. Valider les champs obligatoires
    if (!body.title || !body.excerpt || !body.content || !body.category) {
      return NextResponse.json(
        {
          success: false,
          message:
            "Champs obligatoires manquants : title, excerpt, content, category",
        },
        { status: 400 }
      );
    }

    // 4. Valider la categorie (doit correspondre a l'enum Prisma)
    const category = body.category.toUpperCase();
    if (!VALID_CATEGORIES.includes(category as any)) {
      return NextResponse.json(
        {
          success: false,
          message: `Categorie invalide : ${body.category}. Valides : ${VALID_CATEGORIES.join(", ")}`,
        },
        { status: 400 }
      );
    }

    // 5. Preparer le slug (unique)
    let slug = body.slug ? generateSlug(body.slug) : generateSlug(body.title);

    // Verifier collision et mettre a jour si existant
    const existingBySlug = await prisma.article.findUnique({
      where: { slug },
      select: { id: true },
    });

    if (existingBySlug) {
      // Mettre a jour l'article existant
      const updated = await prisma.article.update({
        where: { slug },
        data: {
          title: body.title.trim(),
          excerpt: body.excerpt.trim(),
          content: sanitizeHtml(body.content),
          category: category as any,
          coverImage: body.coverImage || undefined,
          altText: body.altText?.trim() || undefined,
          tags: body.tags || [],
          metaTitle: body.metaTitle?.trim() || body.title.trim(),
          metaDescription:
            body.metaDescription?.trim() || body.excerpt.trim(),
          socialTwitter: body.social?.twitter || undefined,
          socialInstagram: body.social?.instagram || undefined,
          socialLinkedin: body.social?.linkedin || undefined,
          socialFacebook: body.social?.facebook || undefined,
          socialTiktok: body.social?.tiktok || undefined,
          readingTimeMin: computeReadingTime(body.content),
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

    // 6. Trouver l'auteur par defaut (premier ADMIN)
    let authorId = body.authorId;
    if (!authorId) {
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
      authorId = adminUser.id;
    }

    // 7. Creer l'article
    const article = await prisma.article.create({
      data: {
        title: body.title.trim(),
        slug,
        excerpt: body.excerpt.trim(),
        content: sanitizeHtml(body.content),
        category: category as any,
        coverImage: body.coverImage || null,
        altText: body.altText?.trim() || null,
        tags: body.tags || [],
        readingTimeMin: computeReadingTime(body.content),
        metaTitle: body.metaTitle?.trim() || body.title.trim(),
        metaDescription:
          body.metaDescription?.trim() || body.excerpt.trim(),
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
        authorId,
      },
    });

    // 8. Reponse succes
    return NextResponse.json(
      {
        success: true,
        message: "Article publie avec succes",
        article_id: article.id,
        slug: article.slug,
      },
      { status: 201 }
    );
  } catch (error: any) {
    console.error("[WEBHOOK PUBLISH ERROR]", error);

    // Doublon slug (race condition)
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

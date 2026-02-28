import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { slugify } from "@/lib/utils";

export async function POST(request: Request) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Non authentifié." }, { status: 401 });
    }

    const user = await prisma.user.findUnique({ where: { id: session.user.id } });
    if (!user || (user.role !== "ARTISAN" && user.role !== "ADMIN")) {
      return NextResponse.json({ error: "Accès refusé." }, { status: 403 });
    }

    const {
      title,
      excerpt,
      content,
      category,
      coverImage,
      gradientClass,
      isSponsored,
      sponsorName,
      status,
    } = await request.json();

    if (!title || !excerpt || !content || !category) {
      return NextResponse.json({ error: "Champs requis manquants." }, { status: 400 });
    }

    const validCategories = ["ACTUALITE", "CULTURE", "DIASPORA", "BUSINESS", "LIFESTYLE", "OPINION"];
    if (!validCategories.includes(category)) {
      return NextResponse.json({ error: "Catégorie invalide." }, { status: 400 });
    }

    const readingTimeMin = Math.max(1, Math.ceil(content.split(/\s+/).filter(Boolean).length / 200));

    let slug = slugify(title);
    const existing = await prisma.article.findUnique({ where: { slug } });
    if (existing) {
      slug = `${slug}-${Date.now().toString(36)}`;
    }

    const article = await prisma.article.create({
      data: {
        title,
        slug,
        excerpt,
        content,
        category,
        coverImage: coverImage || null,
        gradientClass: gradientClass || null,
        isSponsored: isSponsored || false,
        sponsorName: sponsorName || null,
        readingTimeMin,
        status: status || "PUBLISHED",
        position: "UNE",
        dayCount: 1,
        publishedAt: new Date(),
        authorId: session.user.id,
      },
    });

    return NextResponse.json(article, { status: 201 });
  } catch (error) {
    console.error("Create article error:", error);
    return NextResponse.json({ error: "Erreur interne." }, { status: 500 });
  }
}

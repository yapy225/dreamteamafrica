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
    if (session.user.role !== "ADMIN") {
      return NextResponse.json({ error: "Accès refusé." }, { status: 403 });
    }

    const body = await request.json();
    const { title, type, content, excerpt, coverImage, category, published } =
      body;

    if (!title || !type || !content || !category) {
      return NextResponse.json(
        { error: "Champs requis manquants." },
        { status: 400 },
      );
    }

    let slug = slugify(title);
    const existing = await prisma.officielContent.findUnique({
      where: { slug },
    });
    if (existing) {
      slug = `${slug}-${Date.now().toString(36)}`;
    }

    const item = await prisma.officielContent.create({
      data: {
        title,
        slug,
        type,
        content,
        excerpt: excerpt || null,
        coverImage: coverImage || null,
        category,
        published: published ?? false,
        authorId: session.user.id,
      },
    });

    return NextResponse.json(item, { status: 201 });
  } catch (error) {
    console.error("Create officiel content error:", error);
    return NextResponse.json({ error: "Erreur interne." }, { status: 500 });
  }
}

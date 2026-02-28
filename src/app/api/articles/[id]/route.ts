import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/db";

export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Non authentifié." }, { status: 401 });
    }

    const { id } = await params;
    const article = await prisma.article.findUnique({ where: { id } });

    if (!article) {
      return NextResponse.json({ error: "Article introuvable." }, { status: 404 });
    }
    if (article.authorId !== session.user.id && session.user.role !== "ADMIN") {
      return NextResponse.json({ error: "Accès refusé." }, { status: 403 });
    }

    const {
      title,
      excerpt,
      content,
      category,
      coverImage,
      featured,
      gradientClass,
      isSponsored,
      sponsorName,
      status,
    } = await request.json();

    const readingTimeMin = content
      ? Math.max(1, Math.ceil(content.split(/\s+/).filter(Boolean).length / 200))
      : undefined;

    const updated = await prisma.article.update({
      where: { id },
      data: {
        ...(title && { title }),
        ...(excerpt && { excerpt }),
        ...(content && { content }),
        ...(category && { category }),
        ...(coverImage !== undefined && { coverImage }),
        ...(featured !== undefined && { featured }),
        ...(gradientClass !== undefined && { gradientClass }),
        ...(isSponsored !== undefined && { isSponsored }),
        ...(sponsorName !== undefined && { sponsorName }),
        ...(status && { status }),
        ...(readingTimeMin !== undefined && { readingTimeMin }),
      },
    });

    return NextResponse.json(updated);
  } catch (error) {
    console.error("Update article error:", error);
    return NextResponse.json({ error: "Erreur interne." }, { status: 500 });
  }
}

export async function DELETE(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Non authentifié." }, { status: 401 });
    }

    const { id } = await params;
    const article = await prisma.article.findUnique({ where: { id } });

    if (!article) {
      return NextResponse.json({ error: "Article introuvable." }, { status: 404 });
    }
    if (article.authorId !== session.user.id && session.user.role !== "ADMIN") {
      return NextResponse.json({ error: "Accès refusé." }, { status: 403 });
    }

    await prisma.article.delete({ where: { id } });
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Delete article error:", error);
    return NextResponse.json({ error: "Erreur interne." }, { status: 500 });
  }
}

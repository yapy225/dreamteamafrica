import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/db";

export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Non authentifié." }, { status: 401 });
    }
    if (session.user.role !== "ADMIN" && session.user.role !== "ARTISAN") {
      return NextResponse.json({ error: "Accès refusé." }, { status: 403 });
    }

    const { id } = await params;
    const item = await prisma.officielContent.findUnique({ where: { id } });
    if (!item) {
      return NextResponse.json(
        { error: "Contenu introuvable." },
        { status: 404 },
      );
    }

    const body = await request.json();

    const updated = await prisma.officielContent.update({
      where: { id },
      data: {
        ...(body.title && { title: body.title }),
        ...(body.type && { type: body.type }),
        ...(body.content && { content: body.content }),
        ...(body.excerpt !== undefined && { excerpt: body.excerpt || null }),
        ...(body.coverImage !== undefined && {
          coverImage: body.coverImage || null,
        }),
        ...(body.category && { category: body.category }),
        ...(body.published !== undefined && { published: body.published }),
      },
    });

    return NextResponse.json(updated);
  } catch (error) {
    console.error("Update officiel content error:", error);
    return NextResponse.json({ error: "Erreur interne." }, { status: 500 });
  }
}

export async function DELETE(
  _request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Non authentifié." }, { status: 401 });
    }
    if (session.user.role !== "ADMIN" && session.user.role !== "ARTISAN") {
      return NextResponse.json({ error: "Accès refusé." }, { status: 403 });
    }

    const { id } = await params;
    const item = await prisma.officielContent.findUnique({ where: { id } });
    if (!item) {
      return NextResponse.json(
        { error: "Contenu introuvable." },
        { status: 404 },
      );
    }

    await prisma.officielContent.delete({ where: { id } });
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Delete officiel content error:", error);
    return NextResponse.json({ error: "Erreur interne." }, { status: 500 });
  }
}

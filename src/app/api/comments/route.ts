import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";

export async function GET() {
  try {
    const comments = await prisma.comment.findMany({
      where: { approved: true },
      orderBy: { createdAt: "desc" },
      take: 20,
    });
    return NextResponse.json(comments);
  } catch (error) {
    console.error("List comments error:", error);
    return NextResponse.json({ error: "Erreur interne." }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const { name, email, rating, message } = await request.json();

    if (!name?.trim() || !email?.trim() || !message?.trim()) {
      return NextResponse.json(
        { error: "Tous les champs sont obligatoires." },
        { status: 400 }
      );
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return NextResponse.json(
        { error: "Adresse email invalide." },
        { status: 400 }
      );
    }

    if (!rating || rating < 1 || rating > 5) {
      return NextResponse.json(
        { error: "La note doit être entre 1 et 5." },
        { status: 400 }
      );
    }

    const comment = await prisma.comment.create({
      data: {
        name: name.trim(),
        email: email.trim(),
        rating: Number(rating),
        message: message.trim(),
      },
    });

    return NextResponse.json(comment, { status: 201 });
  } catch (error) {
    console.error("Create comment error:", error);
    return NextResponse.json({ error: "Erreur interne." }, { status: 500 });
  }
}

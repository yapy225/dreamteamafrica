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
    const {
      title,
      description,
      coverImage,
      venue,
      address,
      date,
      endDate,
      capacity,
      priceEarly,
      priceStd,
      priceVip,
      published,
    } = body;

    if (!title || !description || !venue || !address || !date || !capacity) {
      return NextResponse.json(
        { error: "Champs requis manquants." },
        { status: 400 },
      );
    }

    let slug = slugify(title);
    const existing = await prisma.event.findUnique({ where: { slug } });
    if (existing) {
      slug = `${slug}-${Date.now().toString(36)}`;
    }

    const event = await prisma.event.create({
      data: {
        title,
        slug,
        description,
        coverImage: coverImage || null,
        venue,
        address,
        date: new Date(date),
        endDate: endDate ? new Date(endDate) : null,
        capacity: parseInt(capacity),
        priceEarly: parseFloat(priceEarly) || 0,
        priceStd: parseFloat(priceStd) || 0,
        priceVip: parseFloat(priceVip) || 0,
        published: published ?? false,
      },
    });

    return NextResponse.json(event, { status: 201 });
  } catch (error) {
    console.error("Create event error:", error);
    return NextResponse.json({ error: "Erreur interne." }, { status: 500 });
  }
}

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

    const { name, description, price, images, category, country, stock } = await request.json();

    if (!name || !description || !price || !category || !country) {
      return NextResponse.json({ error: "Champs requis manquants." }, { status: 400 });
    }

    let slug = slugify(name);
    const existing = await prisma.product.findUnique({ where: { slug } });
    if (existing) {
      slug = `${slug}-${Date.now().toString(36)}`;
    }

    const product = await prisma.product.create({
      data: {
        name,
        slug,
        description,
        price: parseFloat(price),
        images: images || [],
        category,
        country,
        stock: parseInt(stock) || 0,
        artisanId: session.user.id,
      },
    });

    return NextResponse.json(product, { status: 201 });
  } catch (error) {
    console.error("Create product error:", error);
    return NextResponse.json({ error: "Erreur interne." }, { status: 500 });
  }
}

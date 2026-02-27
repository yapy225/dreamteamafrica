import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const categorie = searchParams.get("categorie") || undefined;
    const ville = searchParams.get("ville") || undefined;
    const q = searchParams.get("q") || undefined;
    const page = Math.max(1, parseInt(searchParams.get("page") || "1", 10));
    const perPage = 20;

    const where: Record<string, unknown> = {
      status: "VALIDATED",
    };

    if (categorie) {
      where.categorie = categorie;
    }

    if (ville) {
      where.ville = { contains: ville, mode: "insensitive" };
    }

    if (q) {
      where.OR = [
        { entreprise: { contains: q, mode: "insensitive" } },
        { ville: { contains: q, mode: "insensitive" } },
        { description: { contains: q, mode: "insensitive" } },
        { motsCles: { contains: q, mode: "insensitive" } },
      ];
    }

    const [inscriptions, total] = await Promise.all([
      prisma.inscription.findMany({
        where,
        select: {
          id: true,
          entreprise: true,
          categorie: true,
          ville: true,
          pays: true,
          description: true,
          siteWeb: true,
          facebook: true,
          instagram: true,
          tiktok: true,
          linkedin: true,
          youtube: true,
          email: true,
          mobile: true,
        },
        orderBy: { entreprise: "asc" },
        skip: (page - 1) * perPage,
        take: perPage,
      }),
      prisma.inscription.count({ where }),
    ]);

    return NextResponse.json({
      data: inscriptions,
      total,
      page,
      totalPages: Math.ceil(total / perPage),
    });
  } catch (error) {
    console.error("Annuaire fetch error:", error);
    return NextResponse.json(
      { error: "Erreur interne du serveur." },
      { status: 500 }
    );
  }
}

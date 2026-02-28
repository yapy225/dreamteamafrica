import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/db";

export async function GET(request: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user?.id || session.user.role !== "ADMIN") {
      return NextResponse.json({ error: "Non autorisé." }, { status: 403 });
    }

    const { searchParams } = request.nextUrl;
    const status = searchParams.get("status");
    const categorie = searchParams.get("categorie");
    const q = searchParams.get("q")?.trim();
    const page = Math.max(1, parseInt(searchParams.get("page") || "1"));
    const limit = Math.min(50, parseInt(searchParams.get("limit") || "20"));
    const skip = (page - 1) * limit;

    const where: Record<string, unknown> = {};

    if (status && ["PENDING", "VALIDATED", "REJECTED"].includes(status)) {
      where.status = status;
    }

    if (categorie) {
      where.categorie = categorie;
    }

    if (q && q.length >= 2) {
      where.OR = [
        { entreprise: { contains: q, mode: "insensitive" } },
        { directeur: { contains: q, mode: "insensitive" } },
        { email: { contains: q, mode: "insensitive" } },
        { ville: { contains: q, mode: "insensitive" } },
        { description: { contains: q, mode: "insensitive" } },
      ];
    }

    const [inscriptions, total] = await Promise.all([
      prisma.inscription.findMany({
        where,
        orderBy: { createdAt: "desc" },
        skip,
        take: limit,
      }),
      prisma.inscription.count({ where }),
    ]);

    const stats = await prisma.inscription.groupBy({
      by: ["status"],
      _count: true,
    });

    const categories = await prisma.inscription.findMany({
      select: { categorie: true },
      distinct: ["categorie"],
      orderBy: { categorie: "asc" },
    });

    return NextResponse.json({
      inscriptions,
      total,
      page,
      pages: Math.ceil(total / limit),
      stats: {
        total: stats.reduce((acc, s) => acc + s._count, 0),
        pending: stats.find((s) => s.status === "PENDING")?._count ?? 0,
        validated: stats.find((s) => s.status === "VALIDATED")?._count ?? 0,
        rejected: stats.find((s) => s.status === "REJECTED")?._count ?? 0,
      },
      categories: categories.map((c) => c.categorie),
    });
  } catch (error) {
    console.error("List inscriptions error:", error);
    return NextResponse.json({ error: "Erreur interne." }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const session = await auth();
    if (!session?.user?.id || session.user.role !== "ADMIN") {
      return NextResponse.json({ error: "Non autorisé." }, { status: 403 });
    }

    const body = await request.json();

    const {
      entreprise,
      categorie,
      directeur,
      adresse,
      ville,
      codePostal,
      pays,
      mobile,
      telephone,
      email,
      siteWeb,
      facebook,
      instagram,
      tiktok,
      whatsapp,
      youtube,
      linkedin,
      description,
      motsCles,
      newsletter,
      status,
    } = body;

    if (!entreprise || !categorie || !directeur || !ville || !pays || !mobile || !email || !description) {
      return NextResponse.json({ error: "Champs requis manquants." }, { status: 400 });
    }

    const inscription = await prisma.inscription.create({
      data: {
        entreprise,
        categorie,
        directeur,
        adresse: adresse || null,
        ville,
        codePostal: codePostal || null,
        pays,
        mobile,
        telephone: telephone || null,
        email,
        siteWeb: siteWeb || null,
        facebook: facebook || null,
        instagram: instagram || null,
        tiktok: tiktok || null,
        whatsapp: whatsapp || null,
        youtube: youtube || null,
        linkedin: linkedin || null,
        description,
        motsCles: motsCles || null,
        newsletter: newsletter ?? false,
        status: status || "PENDING",
      },
    });

    return NextResponse.json(inscription, { status: 201 });
  } catch (error) {
    console.error("Create inscription error:", error);
    return NextResponse.json({ error: "Erreur interne." }, { status: 500 });
  }
}

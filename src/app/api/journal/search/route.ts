import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = request.nextUrl;
    const q = searchParams.get("q")?.trim();
    const limit = Math.min(parseInt(searchParams.get("limit") || "10"), 20);

    if (!q || q.length < 2) {
      return NextResponse.json([]);
    }

    const articles = await prisma.article.findMany({
      where: {
        status: "PUBLISHED",
        OR: [
          { title: { contains: q, mode: "insensitive" } },
          { excerpt: { contains: q, mode: "insensitive" } },
          { content: { contains: q, mode: "insensitive" } },
        ],
      },
      select: {
        slug: true,
        title: true,
        excerpt: true,
        category: true,
        publishedAt: true,
        author: { select: { name: true } },
      },
      orderBy: { publishedAt: "desc" },
      take: limit,
    });

    return NextResponse.json(articles);
  } catch (error) {
    console.error("Journal search error:", error);
    return NextResponse.json({ error: "Erreur interne." }, { status: 500 });
  }
}

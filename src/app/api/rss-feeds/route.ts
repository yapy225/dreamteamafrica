import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/db";

export async function GET() {
  const session = await auth();
  if (!session || session.user.role !== "ADMIN") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const feeds = await prisma.rssFeed.findMany({
    orderBy: { createdAt: "desc" },
    include: { _count: { select: { detectedArticles: true } } },
  });

  return NextResponse.json(feeds);
}

export async function POST(request: Request) {
  const session = await auth();
  if (!session || session.user.role !== "ADMIN") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { name, url, website, category, language, region, reliability } =
    await request.json();

  if (!name || !url) {
    return NextResponse.json(
      { error: "Nom et URL requis" },
      { status: 400 }
    );
  }

  const existing = await prisma.rssFeed.findUnique({ where: { url } });
  if (existing) {
    return NextResponse.json(
      { error: "Ce flux RSS existe deja" },
      { status: 409 }
    );
  }

  const feed = await prisma.rssFeed.create({
    data: {
      name,
      url,
      website: website || null,
      category: category || "ACTUALITE",
      language: language || "fr",
      region: region || null,
      reliability: reliability || 5,
    },
  });

  return NextResponse.json(feed, { status: 201 });
}

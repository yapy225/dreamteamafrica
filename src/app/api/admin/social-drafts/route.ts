import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/db";

const PAGE_SIZE = 20;

export async function GET(request: NextRequest) {
  const session = await auth();
  if (!session?.user?.id || session.user.role !== "ADMIN") {
    return NextResponse.json({ error: "Non autorisé" }, { status: 403 });
  }

  const { searchParams } = request.nextUrl;
  const status = searchParams.get("status");
  const platform = searchParams.get("platform");
  const section = searchParams.get("section");
  const type = searchParams.get("type");
  const page = Math.max(1, parseInt(searchParams.get("page") || "1", 10));

  const where: Record<string, unknown> = {};
  if (status) where.status = status;
  if (platform) where.platform = platform;
  if (section) where.section = section;
  if (type) where.type = type;

  const [drafts, total, counts] = await Promise.all([
    prisma.socialDraft.findMany({
      where,
      orderBy: { createdAt: "desc" },
      skip: (page - 1) * PAGE_SIZE,
      take: PAGE_SIZE,
      include: { article: { select: { id: true, title: true, slug: true } } },
    }),
    prisma.socialDraft.count({ where }),
    prisma.socialDraft.groupBy({
      by: ["status"],
      _count: true,
    }),
  ]);

  const countMap: Record<string, number> = {};
  for (const c of counts) countMap[c.status] = c._count;

  return NextResponse.json({
    drafts,
    total,
    page,
    pageSize: PAGE_SIZE,
    totalPages: Math.ceil(total / PAGE_SIZE),
    counts: countMap,
  });
}

export async function POST(request: NextRequest) {
  const session = await auth();
  if (!session?.user?.id || session.user.role !== "ADMIN") {
    return NextResponse.json({ error: "Non autorisé" }, { status: 403 });
  }

  const body = await request.json();

  const { platform, type, content, section, targetPostUrl, articleId, imageUrl } = body;

  if (!platform || !content) {
    return NextResponse.json(
      { error: "platform and content are required" },
      { status: 400 }
    );
  }

  const draft = await prisma.socialDraft.create({
    data: {
      platform,
      type: type || "PROMO",
      content,
      section: section || null,
      targetPostUrl: targetPostUrl || null,
      articleId: articleId || null,
      imageUrl: imageUrl || null,
      status: "DRAFT",
    },
  });

  return NextResponse.json(draft, { status: 201 });
}

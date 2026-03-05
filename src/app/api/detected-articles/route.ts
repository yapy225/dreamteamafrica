import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/db";

export async function GET(request: NextRequest) {
  const session = await auth();
  if (!session || session.user.role !== "ADMIN") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const status = request.nextUrl.searchParams.get("status");

  const articles = await prisma.detectedArticle.findMany({
    where: status ? { status: status as any } : {},
    orderBy: { createdAt: "desc" },
    take: 100,
    include: { feed: { select: { name: true } } },
  });

  return NextResponse.json(articles);
}

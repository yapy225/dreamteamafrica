import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/db";

export async function GET() {
  const session = await auth();
  if (!session?.user?.id || session.user.role !== "ADMIN") {
    return NextResponse.json({ error: "Non autorisé" }, { status: 403 });
  }

  const articles = await prisma.article.findMany({
    where: {
      seoKeywords: { isEmpty: false },
    },
    select: {
      id: true,
      title: true,
      slug: true,
      status: true,
      views: true,
      seoKeywords: true,
      publishedAt: true,
    },
    orderBy: { publishedAt: "desc" },
  });

  return NextResponse.json({ articles });
}

import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/db";

/** Reset a detected article to PENDING so it gets re-processed by the cron */
export async function POST(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await auth();
  if (!session || session.user.role !== "ADMIN") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await params;

  const article = await prisma.detectedArticle.update({
    where: { id },
    data: {
      status: "PENDING",
      score: null,
      scoreReason: null,
      rewrittenTitle: null,
      rewrittenContent: null,
      rewrittenExcerpt: null,
      rewrittenMeta: null,
      rewrittenKeywords: [],
      errorMessage: null,
      publishedArticleId: null,
    },
  });

  return NextResponse.json(article);
}

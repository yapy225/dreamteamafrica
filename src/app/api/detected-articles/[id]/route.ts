import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/db";

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await auth();
  if (!session || session.user.role !== "ADMIN") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await params;
  await prisma.detectedArticle.delete({ where: { id } });

  return NextResponse.json({ success: true });
}

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await auth();
  if (!session || session.user.role !== "ADMIN") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await params;
  const body = await request.json();

  // Whitelist allowed fields — prevent mass assignment
  const allowedFields = ["status", "title", "excerpt", "content", "coverImage", "category", "sourceUrl", "errorMessage"] as const;
  const safeData: Record<string, unknown> = {};
  for (const key of allowedFields) {
    if (body[key] !== undefined) safeData[key] = body[key];
  }

  const article = await prisma.detectedArticle.update({
    where: { id },
    data: safeData,
  });

  return NextResponse.json(article);
}

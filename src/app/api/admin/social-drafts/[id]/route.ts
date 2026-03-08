import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/db";

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
  const { status, editedContent, reviewedBy } = body;

  const data: Record<string, unknown> = {};

  if (status) {
    data.status = status;
    if (status === "APPROVED" || status === "REJECTED") {
      data.reviewedAt = new Date();
      data.reviewedBy = reviewedBy || session.user.name || session.user.email;
    }
  }

  if (editedContent !== undefined) {
    data.editedContent = editedContent;
  }

  const draft = await prisma.socialDraft.update({
    where: { id },
    data,
  });

  return NextResponse.json(draft);
}

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await auth();
  if (!session || session.user.role !== "ADMIN") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await params;
  await prisma.socialDraft.delete({ where: { id } });

  return NextResponse.json({ success: true });
}

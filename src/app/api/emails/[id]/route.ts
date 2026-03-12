import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/db";

export const dynamic = "force-dynamic";

/** GET — Single email with full body */
export async function GET(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await auth();
  if (!session || session.user.role !== "ADMIN") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await params;

  const email = await prisma.email.findUnique({ where: { id } });
  if (!email) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  // Auto-mark as read
  if (!email.isRead) {
    await prisma.email.update({
      where: { id },
      data: { isRead: true },
    });
  }

  return NextResponse.json(email);
}

/** PATCH — Update flags (read, archived, starred) */
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

  const data: any = {};
  if (typeof body.isRead === "boolean") data.isRead = body.isRead;
  if (typeof body.isArchived === "boolean") data.isArchived = body.isArchived;
  if (typeof body.isStarred === "boolean") data.isStarred = body.isStarred;

  const updated = await prisma.email.update({ where: { id }, data });
  return NextResponse.json(updated);
}

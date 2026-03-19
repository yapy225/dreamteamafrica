import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/db";

/** PATCH — mark as read/unread */
export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await auth();
  if (!session?.user?.id || session.user.role !== "ADMIN") {
    return NextResponse.json({ error: "Non autorisé" }, { status: 403 });
  }

  const { id } = await params;
  const body = await request.json();

  const allowedStatuses = ["NEW", "READ", "REPLIED", "ARCHIVED"];

  const data: {
    read?: boolean;
    status?: string;
    notes?: string | null;
    draftReply?: string | null;
  } = {};
  if (typeof body.read === "boolean") data.read = body.read;
  if (typeof body.status === "string" && allowedStatuses.includes(body.status)) {
    data.status = body.status;
  }
  if (body.notes !== undefined) data.notes = typeof body.notes === "string" ? body.notes : null;
  if (body.draftReply !== undefined) data.draftReply = typeof body.draftReply === "string" ? body.draftReply : null;

  const updated = await prisma.contactMessage.update({
    where: { id },
    data,
  });

  return NextResponse.json(updated);
}

/** DELETE — delete a contact message */
export async function DELETE(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await auth();
  if (!session?.user?.id || session.user.role !== "ADMIN") {
    return NextResponse.json({ error: "Non autorisé" }, { status: 403 });
  }

  const { id } = await params;
  await prisma.contactMessage.delete({ where: { id } });

  return NextResponse.json({ success: true });
}

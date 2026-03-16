import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/db";

/**
 * PATCH — Archive/unarchive a conversation (all messages from a phone number)
 * Body: { phone: string, archived: boolean }
 */
export async function PATCH(request: NextRequest) {
  const session = await auth();
  if (!session || session.user.role !== "ADMIN") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { phone, archived } = await request.json();
  if (!phone || typeof archived !== "boolean") {
    return NextResponse.json({ error: "phone et archived requis" }, { status: 400 });
  }

  await prisma.whatsAppMessage.updateMany({
    where: { OR: [{ from: phone }, { to: phone, direction: "outbound" }] },
    data: { archived },
  });

  return NextResponse.json({ success: true });
}

/**
 * DELETE — Delete a conversation (all messages from/to a phone number)
 * Body: { phone: string }
 */
export async function DELETE(request: NextRequest) {
  const session = await auth();
  if (!session || session.user.role !== "ADMIN") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { phone } = await request.json();
  if (!phone) {
    return NextResponse.json({ error: "phone requis" }, { status: 400 });
  }

  await prisma.whatsAppMessage.deleteMany({
    where: { OR: [{ from: phone }, { to: phone, direction: "outbound" }] },
  });

  return NextResponse.json({ success: true });
}

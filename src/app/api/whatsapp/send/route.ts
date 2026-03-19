import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { sendWhatsAppText } from "@/lib/whatsapp";

/**
 * POST — Send a WhatsApp reply from the dashboard.
 * If draftId is provided, delete the draft after sending.
 */
export async function POST(request: Request) {
  const session = await auth();
  if (!session?.user?.id || session.user.role !== "ADMIN") {
    return NextResponse.json({ error: "Non autorisé" }, { status: 403 });
  }

  const { to, message, draftId } = await request.json();

  if (!to || !message) {
    return NextResponse.json({ error: "Missing 'to' or 'message'" }, { status: 400 });
  }

  try {
    const result = await sendWhatsAppText(to, message);
    const waMessageId = result.messages?.[0]?.id ?? `out_${Date.now()}`;

    // If sending from a draft, update the draft instead of creating new
    if (draftId) {
      await prisma.whatsAppMessage.update({
        where: { id: draftId },
        data: {
          waMessageId,
          body: message,
          status: "sent",
        },
      });
    } else {
      await prisma.whatsAppMessage.create({
        data: {
          waMessageId,
          from: process.env.WHATSAPP_PHONE_NUMBER_ID!,
          to,
          contactName: "Saison Culturelle Africaine",
          direction: "outbound",
          type: "text",
          body: message,
          status: "sent",
        },
      });
    }

    return NextResponse.json({ success: true, messageId: waMessageId });
  } catch (error) {
    console.error("WhatsApp send error:", error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Send failed" },
      { status: 500 },
    );
  }
}

/**
 * DELETE — Delete a draft message.
 */
export async function DELETE(request: Request) {
  const session = await auth();
  if (!session?.user?.id || session.user.role !== "ADMIN") {
    return NextResponse.json({ error: "Non autorisé" }, { status: 403 });
  }

  const { draftId } = await request.json();

  if (!draftId) {
    return NextResponse.json({ error: "draftId requis" }, { status: 400 });
  }

  try {
    await prisma.whatsAppMessage.delete({
      where: { id: draftId, status: "draft" },
    });
    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ error: "Brouillon introuvable" }, { status: 404 });
  }
}

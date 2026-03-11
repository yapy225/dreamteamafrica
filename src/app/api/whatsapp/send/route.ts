import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { sendWhatsAppText } from "@/lib/whatsapp";

/**
 * POST — Send a WhatsApp reply from the dashboard.
 */
export async function POST(request: Request) {
  const session = await auth();
  if (!session || session.user.role !== "ADMIN") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { to, message } = await request.json();

  if (!to || !message) {
    return NextResponse.json({ error: "Missing 'to' or 'message'" }, { status: 400 });
  }

  try {
    const result = await sendWhatsAppText(to, message);
    const waMessageId = result.messages?.[0]?.id ?? `out_${Date.now()}`;

    // Save outbound message to DB
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

    return NextResponse.json({ success: true, messageId: waMessageId });
  } catch (error) {
    console.error("WhatsApp send error:", error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Send failed" },
      { status: 500 }
    );
  }
}

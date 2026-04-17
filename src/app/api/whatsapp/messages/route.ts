import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { rateLimit } from "@/lib/rate-limit";

export const dynamic = "force-dynamic";

/**
 * GET — Fetch WhatsApp conversations (grouped by phone number).
 */
export async function GET(request: Request) {
  const session = await auth();
  if (!session || session.user.role !== "ADMIN") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const rl = rateLimit(`whatsapp-msgs:${session.user.id}`, { limit: 60, windowSec: 60 });
  if (!rl.success) {
    return NextResponse.json({ error: "Trop de requêtes." }, { status: 429 });
  }

  const url = new URL(request.url);
  const phone = url.searchParams.get("phone");
  const showArchived = url.searchParams.get("archived") === "true";

  if (phone) {
    // Get messages for a specific conversation
    const messages = await prisma.whatsAppMessage.findMany({
      where: { from: phone },
      orderBy: { createdAt: "asc" },
    });

    // Also get outbound messages to this phone
    const outbound = await prisma.whatsAppMessage.findMany({
      where: { to: phone, direction: "outbound" },
      orderBy: { createdAt: "asc" },
    });

    // Mark inbound as read
    await prisma.whatsAppMessage.updateMany({
      where: { from: phone, read: false, direction: "inbound" },
      data: { read: true },
    });

    const allMessages = [...messages, ...outbound].sort(
      (a, b) => a.createdAt.getTime() - b.createdAt.getTime()
    );

    return NextResponse.json(allMessages);
  }

  // Get conversation list (unique senders with last message)
  const conversations = await prisma.$queryRaw`
    SELECT DISTINCT ON (m."from")
      m."from",
      m."contactName",
      m."body",
      m."createdAt",
      m."archived",
      (SELECT COUNT(*) FROM "WhatsAppMessage" WHERE "from" = m."from" AND "read" = false AND "direction" = 'inbound')::int as "unreadCount"
    FROM "WhatsAppMessage" m
    WHERE m."direction" = 'inbound'
      AND m."archived" = ${showArchived}
    ORDER BY m."from", m."createdAt" DESC
  `;

  return NextResponse.json(conversations);
}

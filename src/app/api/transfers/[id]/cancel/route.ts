import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { auth } from "@/lib/auth";
import { rateLimit } from "@/lib/rate-limit";
import { verifyTicketToken } from "@/lib/cpt-token";
import { sendTransferCancelledEmail } from "@/lib/email";

export async function POST(
  request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const { id: transferId } = await params;
    const url = new URL(request.url);
    const magicToken = url.searchParams.get("t");

    const session = await auth();

    const transfer = await prisma.ticketTransfer.findUnique({
      where: { id: transferId },
      include: { ticket: { include: { event: { select: { title: true } } } } },
    });

    if (!transfer) {
      return NextResponse.json({ error: "Invitation introuvable." }, { status: 404 });
    }

    const hasValidMagicToken = typeof magicToken === "string" && verifyTicketToken(transfer.ticketId, magicToken);
    const isCedant = session?.user?.id === transfer.fromUserId;

    if (!hasValidMagicToken && !isCedant) {
      return NextResponse.json({ error: "Accès interdit." }, { status: 403 });
    }

    const rlKey = session?.user?.id || `cpt-token:${transfer.ticketId}`;
    const rl = rateLimit(`transfer-cancel:${rlKey}`, { limit: 5, windowSec: 60 });
    if (!rl.success) {
      return NextResponse.json({ error: "Trop de tentatives. Réessayez dans quelques minutes." }, { status: 429 });
    }

    if (transfer.status !== "PENDING") {
      return NextResponse.json({ error: `Cette invitation n'est plus en attente (${transfer.status.toLowerCase()}).` }, { status: 400 });
    }

    await prisma.ticketTransfer.update({
      where: { id: transferId },
      data: { status: "CANCELLED", cancelledAt: new Date() },
    });

    try {
      await sendTransferCancelledEmail({
        to: transfer.toEmail,
        toFirstName: transfer.toFirstName,
        fromFirstName: transfer.fromFirstName || "le cédant",
        eventTitle: transfer.ticket.event.title,
      });
    } catch (err) {
      console.error("[transfer/cancel] email failed:", err);
    }

    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error("[transfer/cancel] error:", error);
    return NextResponse.json({ error: "Erreur lors de l'annulation." }, { status: 500 });
  }
}

import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { rateLimit } from "@/lib/rate-limit";
import { verifyTransferToken } from "@/lib/transfer-token";
import { sendTransferRefusedEmail } from "@/lib/email";

export async function POST(
  request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const { id: transferId } = await params;
    const url = new URL(request.url);
    const token = url.searchParams.get("t");

    if (!token || !verifyTransferToken(transferId, token)) {
      return NextResponse.json({ error: "Lien invalide ou expiré." }, { status: 401 });
    }

    const rl = rateLimit(`transfer-refuse:${transferId}`, { limit: 5, windowSec: 60 });
    if (!rl.success) {
      return NextResponse.json({ error: "Trop de tentatives. Réessayez dans quelques minutes." }, { status: 429 });
    }

    const transfer = await prisma.ticketTransfer.findUnique({
      where: { id: transferId },
      include: { ticket: { include: { event: { select: { title: true } } } } },
    });

    if (!transfer) {
      return NextResponse.json({ error: "Invitation introuvable." }, { status: 404 });
    }

    if (transfer.status !== "PENDING") {
      return NextResponse.json({ error: `Cette invitation n'est plus en attente (${transfer.status.toLowerCase()}).` }, { status: 400 });
    }

    await prisma.ticketTransfer.update({
      where: { id: transferId },
      data: { status: "REFUSED" },
    });

    try {
      if (transfer.fromEmail && transfer.toEmail) {
        await sendTransferRefusedEmail({
          to: transfer.fromEmail,
          fromFirstName: transfer.fromFirstName || "",
          toEmail: transfer.toEmail,
          eventTitle: transfer.ticket.event.title,
        });
      }
    } catch (err) {
      console.error("[transfer/refuse] email failed:", err);
    }

    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error("[transfer/refuse] error:", error);
    return NextResponse.json({ error: "Erreur lors du refus." }, { status: 500 });
  }
}

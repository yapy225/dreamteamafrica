import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { verifyTransferToken } from "@/lib/transfer-token";

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id: transferId } = await params;
  const url = new URL(request.url);
  const token = url.searchParams.get("t");

  if (!token || !verifyTransferToken(transferId, token)) {
    return NextResponse.json({ error: "Lien invalide ou expiré." }, { status: 401 });
  }

  const transfer = await prisma.ticketTransfer.findUnique({
    where: { id: transferId },
    include: {
      ticket: {
        include: {
          event: {
            select: { title: true, venue: true, address: true, date: true, coverImage: true },
          },
        },
      },
    },
  });

  if (!transfer) {
    return NextResponse.json({ error: "Invitation introuvable." }, { status: 404 });
  }

  let status = transfer.status;
  if (status === "PENDING" && transfer.expiresAt < new Date()) {
    try {
      await prisma.ticketTransfer.update({
        where: { id: transferId },
        data: { status: "EXPIRED" },
      });
    } catch { /* best-effort */ }
    status = "EXPIRED";
  }

  const fromInitial = transfer.fromLastName ? transfer.fromLastName[0].toUpperCase() + "." : "";
  const fromLabel = [transfer.fromFirstName, fromInitial].filter(Boolean).join(" ") || "Un membre Dream Team Africa";

  return NextResponse.json({
    ok: true,
    status,
    mode: transfer.mode,
    expiresAt: transfer.expiresAt,
    message: transfer.message,
    fromLabel,
    toFirstName: transfer.toFirstName,
    toLastName: transfer.toLastName,
    toEmail: transfer.toEmail,
    event: {
      title: transfer.ticket.event.title,
      venue: transfer.ticket.event.venue,
      address: transfer.ticket.event.address,
      date: transfer.ticket.event.date,
      coverImage: transfer.ticket.event.coverImage,
    },
    tier: transfer.ticket.tier,
  });
}

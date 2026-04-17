import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { rateLimit } from "@/lib/rate-limit";
import { verifyTransferToken } from "@/lib/transfer-token";
import { finalizeTransfer } from "@/lib/transfer-finalize";
import { checkTransferEligibility } from "@/lib/transfer-eligibility";

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

    const rl = rateLimit(`transfer-accept:${transferId}`, { limit: 5, windowSec: 60 });
    if (!rl.success) {
      return NextResponse.json({ error: "Trop de tentatives. Réessayez dans quelques minutes." }, { status: 429 });
    }

    const body = await request.json().catch(() => ({}));
    const toFirstName = typeof body.toFirstName === "string" ? body.toFirstName.trim().slice(0, 80) : "";
    const toLastName = typeof body.toLastName === "string" ? body.toLastName.trim().slice(0, 80) : "";
    const toPhone = typeof body.toPhone === "string" ? body.toPhone.trim().slice(0, 30) : "";

    const transfer = await prisma.ticketTransfer.findUnique({
      where: { id: transferId },
      include: {
        ticket: {
          include: {
            event: true,
            transfers: { where: { status: "PENDING" } },
          },
        },
      },
    });

    if (!transfer) {
      return NextResponse.json({ error: "Invitation introuvable." }, { status: 404 });
    }

    if (transfer.status !== "PENDING") {
      return NextResponse.json({ error: `Cette invitation n'est plus active (${transfer.status.toLowerCase()}).` }, { status: 400 });
    }

    if (transfer.expiresAt < new Date()) {
      await prisma.ticketTransfer.update({ where: { id: transferId }, data: { status: "EXPIRED" } }).catch(() => {});
      return NextResponse.json({ error: "Cette invitation a expiré." }, { status: 400 });
    }

    const needsFirst = !transfer.toFirstName && !toFirstName;
    const needsLast = !transfer.toLastName && !toLastName;
    if (needsFirst || needsLast) {
      return NextResponse.json({ error: "Merci de renseigner vos nom et prénom." }, { status: 400 });
    }

    const eligibility = checkTransferEligibility(
      { ...transfer.ticket, transfers: transfer.ticket.transfers.filter((t) => t.id !== transfer.id) },
      transfer.ticket.event,
    );
    if (!eligibility.ok) {
      return NextResponse.json({ error: eligibility.reason }, { status: 400 });
    }

    await prisma.ticketTransfer.update({
      where: { id: transferId },
      data: {
        toFirstName: transfer.toFirstName || toFirstName || null,
        toLastName: transfer.toLastName || toLastName || null,
        toPhone: transfer.toPhone || toPhone || null,
      },
    });

    if (transfer.mode === "AT_COST") {
      return NextResponse.json({ error: "Mode AT_COST non disponible dans cette version." }, { status: 501 });
    }

    const res = await finalizeTransfer(transferId);
    if (!res.ok) {
      return NextResponse.json({ error: res.reason }, { status: 400 });
    }

    return NextResponse.json({ ok: true, ticketId: res.ticketId });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Erreur lors de l'acceptation du transfert.";
    console.error("[transfer/accept] error:", error);
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

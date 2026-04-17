import crypto from "crypto";
import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { auth } from "@/lib/auth";
import { rateLimit } from "@/lib/rate-limit";
import { verifyTicketToken } from "@/lib/cpt-token";
import { buildTransferLink, buildInvitationHash } from "@/lib/transfer-token";
import { checkTransferEligibility } from "@/lib/transfer-eligibility";
import { TRANSFER_CONFIG } from "@/lib/transfer-config";
import {
  sendTransferInvitationEmail,
  sendTransferCedantConfirmationEmail,
} from "@/lib/email";

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export async function POST(
  request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const { id: ticketId } = await params;
    const body = await request.json().catch(() => ({}));
    const url = new URL(request.url);
    const magicToken = url.searchParams.get("t") || body.token;

    const session = await auth();
    const hasValidMagicToken = typeof magicToken === "string" && verifyTicketToken(ticketId, magicToken);

    if (!session?.user?.id && !hasValidMagicToken) {
      return NextResponse.json({ error: "Non autorisé." }, { status: 401 });
    }

    const rlKey = session?.user?.id || `cpt-token:${ticketId}`;
    const rl = rateLimit(`transfer-init:${rlKey}`, { limit: 5, windowSec: 60 });
    if (!rl.success) {
      return NextResponse.json(
        { error: "Trop de tentatives. Réessayez dans quelques minutes." },
        { status: 429 },
      );
    }

    const toEmailRaw = typeof body.toEmail === "string" ? body.toEmail.trim().toLowerCase() : "";
    if (!toEmailRaw || !EMAIL_RE.test(toEmailRaw) || toEmailRaw.length > 254) {
      return NextResponse.json({ error: "Adresse email du destinataire invalide." }, { status: 400 });
    }

    const toFirstName = typeof body.toFirstName === "string" ? body.toFirstName.trim().slice(0, 80) : null;
    const toLastName = typeof body.toLastName === "string" ? body.toLastName.trim().slice(0, 80) : null;
    const message = typeof body.message === "string" ? body.message.trim().slice(0, 500) : null;

    const requestedMode = typeof body.mode === "string" ? body.mode : undefined;
    let mode: "FREE_GIFT" | "AT_COST" = "FREE_GIFT";
    if (TRANSFER_CONFIG.TYPE_CESSION === "BOTH" && requestedMode === "AT_COST") mode = "AT_COST";
    else if (TRANSFER_CONFIG.TYPE_CESSION === "AT_COST") mode = "AT_COST";

    const ticket = await prisma.ticket.findUnique({
      where: { id: ticketId },
      include: {
        event: true,
        transfers: { where: { status: "PENDING" } },
      },
    });

    if (!ticket) {
      return NextResponse.json({ error: "Billet introuvable." }, { status: 404 });
    }

    if (!hasValidMagicToken && ticket.userId !== session?.user?.id) {
      return NextResponse.json({ error: "Accès interdit." }, { status: 403 });
    }

    const eligibility = checkTransferEligibility(ticket, ticket.event);
    if (!eligibility.ok) {
      return NextResponse.json({ error: eligibility.reason }, { status: 400 });
    }

    const cedantEmail = (ticket.email || "").toLowerCase();
    if (cedantEmail && cedantEmail === toEmailRaw) {
      return NextResponse.json({ error: "Vous ne pouvez pas transférer ce billet à vous-même." }, { status: 400 });
    }

    const fromUser = session?.user?.id
      ? await prisma.user.findUnique({ where: { id: session.user.id }, select: { email: true, name: true } })
      : null;
    const fromEmail = ticket.email || fromUser?.email || "";
    const fromFirstName = ticket.firstName || (fromUser?.name?.split(" ")[0] ?? null);
    const fromLastName = ticket.lastName || (fromUser?.name?.split(" ").slice(1).join(" ") || null);

    const expiresAt = new Date(Date.now() + TRANSFER_CONFIG.EXPIRATION_INVIT_H * 3600 * 1000);

    const transferId = `tr_${crypto.randomUUID()}`;
    const invitationHash = buildInvitationHash(transferId);

    const transfer = await prisma.ticketTransfer.create({
      data: {
        id: transferId,
        ticketId: ticket.id,
        fromUserId: ticket.userId,
        fromEmail,
        fromFirstName,
        fromLastName,
        toEmail: toEmailRaw,
        toFirstName,
        toLastName,
        status: "PENDING",
        mode,
        invitationHash,
        message,
        expiresAt,
      },
    });

    try {
      await sendTransferInvitationEmail({
        to: transfer.toEmail,
        fromFirstName: fromFirstName || "un membre Dream Team Africa",
        toFirstName,
        eventTitle: ticket.event.title,
        eventDate: ticket.event.date,
        eventVenue: ticket.event.venue,
        tier: ticket.tier,
        message,
        transferLink: buildTransferLink(transfer.id),
        expiresAt,
      });
    } catch (err) {
      console.error("[transfer/init] invitation email failed:", err);
    }

    try {
      if (fromEmail) {
        const appUrl = process.env.NEXT_PUBLIC_APP_URL || process.env.NEXT_PUBLIC_BASE_URL || "https://dreamteamafrica.com";
        await sendTransferCedantConfirmationEmail({
          to: fromEmail,
          fromFirstName: fromFirstName || "",
          toEmail: transfer.toEmail,
          eventTitle: ticket.event.title,
          expiresAt,
          manageLink: `${appUrl}/mon-espace`,
        });
      }
    } catch (err) {
      console.error("[transfer/init] cedant confirmation email failed:", err);
    }

    return NextResponse.json({ ok: true, transferId: transfer.id });
  } catch (error) {
    console.error("[transfer/init] error:", error);
    return NextResponse.json({ error: "Erreur lors de l'envoi de l'invitation." }, { status: 500 });
  }
}

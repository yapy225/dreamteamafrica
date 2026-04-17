import crypto from "crypto";
import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { auth } from "@/lib/auth";
import { rateLimit } from "@/lib/rate-limit";
import { verifyTicketToken } from "@/lib/cpt-token";
import { buildInvitationHash } from "@/lib/transfer-token";
import { checkListingEligibility } from "@/lib/listing-eligibility";
import { sendListingConfirmationToSeller } from "@/lib/email";

export async function POST(
  request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const { id: ticketId } = await params;
    const url = new URL(request.url);
    const body = await request.json().catch(() => ({}));
    const magicToken = url.searchParams.get("t") || body.token;

    const session = await auth();
    const hasValidMagicToken = typeof magicToken === "string" && verifyTicketToken(ticketId, magicToken);

    if (!session?.user?.id && !hasValidMagicToken) {
      return NextResponse.json({ error: "Non autorisé." }, { status: 401 });
    }

    const rlKey = session?.user?.id || `cpt-token:${ticketId}`;
    const rl = rateLimit(`listing-create:${rlKey}`, { limit: 5, windowSec: 60 });
    if (!rl.success) {
      return NextResponse.json({ error: "Trop de tentatives. Réessayez dans quelques minutes." }, { status: 429 });
    }

    const ticket = await prisma.ticket.findUnique({
      where: { id: ticketId },
      include: {
        event: true,
        transfers: { where: { status: { in: ["PENDING", "LISTED"] } } },
        payments: { where: { stripeId: { not: null } }, orderBy: { paidAt: "asc" } },
      },
    });

    if (!ticket) {
      return NextResponse.json({ error: "Billet introuvable." }, { status: 404 });
    }

    if (!hasValidMagicToken && ticket.userId !== session?.user?.id) {
      return NextResponse.json({ error: "Accès interdit." }, { status: 403 });
    }

    const eligibility = checkListingEligibility(ticket, ticket.event);
    if (!eligibility.ok) {
      return NextResponse.json({ error: eligibility.reason }, { status: 400 });
    }

    const price = typeof ticket.price === "number" ? ticket.price : Number(ticket.price);

    const fromUser = session?.user?.id
      ? await prisma.user.findUnique({ where: { id: session.user.id }, select: { email: true, name: true } })
      : null;
    const fromEmail = ticket.email || fromUser?.email || "";
    const fromFirstName = ticket.firstName || (fromUser?.name?.split(" ")[0] ?? null);
    const fromLastName = ticket.lastName || (fromUser?.name?.split(" ").slice(1).join(" ") || null);

    const transferId = `tl_${crypto.randomUUID()}`;
    const now = new Date();
    const listing = await prisma.ticketTransfer.create({
      data: {
        id: transferId,
        ticketId: ticket.id,
        fromUserId: ticket.userId,
        fromEmail,
        fromFirstName,
        fromLastName,
        toEmail: null,
        status: "LISTED",
        mode: "AT_COST",
        invitationHash: buildInvitationHash(transferId),
        publicPrice: price,
        listedAt: now,
        expiresAt: new Date(ticket.event.date),
      },
    });

    try {
      if (fromEmail) {
        const appUrl = process.env.NEXT_PUBLIC_APP_URL || process.env.NEXT_PUBLIC_BASE_URL || "https://dreamteamafrica.com";
        await sendListingConfirmationToSeller({
          to: fromEmail,
          fromFirstName: fromFirstName || "",
          eventTitle: ticket.event.title,
          eventDate: ticket.event.date,
          price,
          manageLink: `${appUrl}/mon-espace`,
          bourseLink: `${appUrl}/bourse/${listing.id}`,
        });
      }
    } catch (err) {
      console.error("[listing/create] email failed:", err);
    }

    return NextResponse.json({ ok: true, listingId: listing.id });
  } catch (error) {
    console.error("[listing/create] error:", error);
    return NextResponse.json({ error: "Erreur lors de la mise en vente." }, { status: 500 });
  }
}

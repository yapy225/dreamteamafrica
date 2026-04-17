import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { auth } from "@/lib/auth";
import { rateLimit } from "@/lib/rate-limit";
import { verifyTicketToken } from "@/lib/cpt-token";

export async function POST(
  request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const { id: listingId } = await params;
    const url = new URL(request.url);
    const magicToken = url.searchParams.get("t");

    const session = await auth();

    const listing = await prisma.ticketTransfer.findUnique({
      where: { id: listingId },
    });

    if (!listing) {
      return NextResponse.json({ error: "Annonce introuvable." }, { status: 404 });
    }

    const hasValidMagicToken = typeof magicToken === "string" && verifyTicketToken(listing.ticketId, magicToken);
    const isOwner = session?.user?.id === listing.fromUserId;

    if (!hasValidMagicToken && !isOwner) {
      return NextResponse.json({ error: "Accès interdit." }, { status: 403 });
    }

    const rlKey = session?.user?.id || `cpt-token:${listing.ticketId}`;
    const rl = rateLimit(`listing-delist:${rlKey}`, { limit: 5, windowSec: 60 });
    if (!rl.success) {
      return NextResponse.json({ error: "Trop de tentatives. Réessayez dans quelques minutes." }, { status: 429 });
    }

    if (listing.status !== "LISTED") {
      return NextResponse.json({ error: `Cette annonce n'est plus active (${listing.status.toLowerCase()}).` }, { status: 400 });
    }

    await prisma.ticketTransfer.update({
      where: { id: listingId },
      data: { status: "CANCELLED", cancelledAt: new Date() },
    });

    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error("[listing/delist] error:", error);
    return NextResponse.json({ error: "Erreur lors du retrait." }, { status: 500 });
  }
}

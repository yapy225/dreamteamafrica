import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { rateLimit, getClientIp } from "@/lib/rate-limit";

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;
  const ip = getClientIp(request);
  const rl = rateLimit(`listing-detail:${ip}`, { limit: 60, windowSec: 60 });
  if (!rl.success) {
    return NextResponse.json({ error: "Trop de requêtes." }, { status: 429 });
  }

  const listing = await prisma.ticketTransfer.findUnique({
    where: { id },
    include: {
      ticket: {
        include: {
          event: { select: { title: true, slug: true, venue: true, address: true, date: true, coverImage: true, published: true } },
        },
      },
    },
  });

  if (!listing) {
    return NextResponse.json({ error: "Annonce introuvable." }, { status: 404 });
  }

  const fromInitial = listing.fromLastName ? listing.fromLastName[0].toUpperCase() + "." : "";
  const fromLabel = [listing.fromFirstName, fromInitial].filter(Boolean).join(" ") || "Un membre Dream Team Africa";

  return NextResponse.json({
    ok: true,
    id: listing.id,
    status: listing.status,
    price: listing.publicPrice ? Number(listing.publicPrice) : null,
    tier: listing.ticket.tier,
    listedAt: listing.listedAt,
    fromLabel,
    event: listing.ticket.event,
  });
}

import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;

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

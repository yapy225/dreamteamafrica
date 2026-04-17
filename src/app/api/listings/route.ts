import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";

export async function GET(request: Request) {
  const url = new URL(request.url);
  const eventSlug = url.searchParams.get("event");

  const listings = await prisma.ticketTransfer.findMany({
    where: {
      status: "LISTED",
      ticket: {
        checkedInAt: null,
        event: eventSlug ? { slug: eventSlug, published: true } : { published: true },
      },
    },
    include: {
      ticket: {
        include: {
          event: { select: { title: true, slug: true, venue: true, date: true, coverImage: true } },
        },
      },
    },
    orderBy: { listedAt: "desc" },
    take: 100,
  });

  const now = Date.now();
  const active = listings.filter((l) => new Date(l.ticket.event.date).getTime() > now + 24 * 3600 * 1000);

  return NextResponse.json({
    ok: true,
    listings: active.map((l) => ({
      id: l.id,
      price: l.publicPrice ? Number(l.publicPrice) : null,
      tier: l.ticket.tier,
      listedAt: l.listedAt,
      event: l.ticket.event,
    })),
  });
}

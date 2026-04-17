import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { rateLimit, getClientIp } from "@/lib/rate-limit";

export async function GET(request: Request) {
  const ip = getClientIp(request);
  const rl = rateLimit(`listings-browse:${ip}`, { limit: 60, windowSec: 60 });
  if (!rl.success) {
    return NextResponse.json({ error: "Trop de requêtes. Réessayez dans quelques minutes." }, { status: 429 });
  }

  const url = new URL(request.url);
  const eventSlug = url.searchParams.get("event");
  if (eventSlug && !/^[a-z0-9-]{1,80}$/.test(eventSlug)) {
    return NextResponse.json({ error: "Slug invalide." }, { status: 400 });
  }

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

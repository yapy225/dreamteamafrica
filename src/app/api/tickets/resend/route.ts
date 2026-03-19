import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { sendTicketConfirmationEmail } from "@/lib/email";
import { rateLimit, getClientIp } from "@/lib/rate-limit";

export async function POST(request: Request) {
  try {
    // Rate limit: 3 requests per 15 minutes per IP
    const ip = getClientIp(request);
    const rl = rateLimit(`resend-tickets:${ip}`, { limit: 3, windowSec: 15 * 60 });
    if (!rl.success) {
      return NextResponse.json(
        { error: "Trop de tentatives. Réessayez dans quelques minutes." },
        { status: 429 },
      );
    }

    const { email } = await request.json();

    if (!email || typeof email !== "string") {
      return NextResponse.json(
        { error: "Email requis." },
        { status: 400 },
      );
    }

    const trimmedEmail = email.trim().toLowerCase();

    const tickets = await prisma.ticket.findMany({
      where: { email: trimmedEmail },
      include: { event: true },
      orderBy: { purchasedAt: "desc" },
    });

    if (tickets.length === 0) {
      // Don't reveal whether the email exists
      return NextResponse.json({ ok: true });
    }

    // Group tickets by stripeSessionId or by event+visitDate
    const groups = new Map<string, typeof tickets>();
    for (const t of tickets) {
      const key =
        t.stripeSessionId || `${t.eventId}_${t.visitDate?.toISOString()}`;
      if (!groups.has(key)) groups.set(key, []);
      groups.get(key)!.push(t);
    }

    for (const [, groupTickets] of groups) {
      const first = groupTickets[0];
      const event = first.event;
      const name =
        `${first.firstName || ""} ${first.lastName || ""}`.trim() ||
        trimmedEmail;

      const customTiers = event.tiers as Array<{
        id: string;
        name: string;
      }> | null;
      const matchedTier = Array.isArray(customTiers)
        ? customTiers.find((t) => t.id === first.tier)
        : null;
      const legacyMap: Record<string, string> = {
        EARLY_BIRD: "Early Bird",
        STANDARD: "Standard",
        VIP: "VIP",
      };
      const tierName =
        matchedTier?.name || legacyMap[first.tier] || first.tier;

      await sendTicketConfirmationEmail({
        to: trimmedEmail,
        guestName: name,
        eventTitle: event.title,
        eventVenue: event.venue,
        eventAddress: event.address,
        eventDate: first.visitDate || event.date,
        eventCoverImage: event.coverImage,
        tier: tierName,
        price: first.price,
        quantity: groupTickets.length,
        tickets: groupTickets.map((t) => ({
          id: t.id,
          qrCode: t.qrCode,
        })),
      });

      // Rate limiting between sends
      await new Promise((r) => setTimeout(r, 300));
    }

    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error("Resend tickets error:", error);
    return NextResponse.json(
      { error: "Erreur lors de l'envoi." },
      { status: 500 },
    );
  }
}

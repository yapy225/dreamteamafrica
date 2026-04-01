import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { auth } from "@/lib/auth";
import { rateLimit, getClientIp } from "@/lib/rate-limit";

/**
 * POST /api/tickets/lookup
 * Returns tickets for the authenticated user only.
 * Falls back to email lookup with strict rate limiting for unauthenticated /mes-billets.
 */
export async function POST(request: Request) {
  try {
    const ip = getClientIp(request);
    const session = await auth();

    const { email } = await request.json();
    if (!email || typeof email !== "string") {
      return NextResponse.json({ error: "Email requis." }, { status: 400 });
    }

    const trimmedEmail = email.trim().toLowerCase();

    // If authenticated, only allow looking up own tickets
    if (session?.user?.id) {
      if (session.user.email?.toLowerCase() !== trimmedEmail) {
        return NextResponse.json({ error: "Accès interdit." }, { status: 403 });
      }
    } else {
      // Unauthenticated: strict rate limiting (3 per 15 min per IP)
      const rl = rateLimit(`lookup-tickets:${ip}`, { limit: 3, windowSec: 15 * 60 });
      if (!rl.success) {
        return NextResponse.json(
          { error: "Trop de tentatives. Réessayez dans quelques minutes." },
          { status: 429 },
        );
      }
    }

    const tickets = await prisma.ticket.findMany({
      where: { email: trimmedEmail },
      include: {
        event: { select: { title: true, venue: true, address: true, date: true, coverImage: true } },
        payments: { orderBy: { paidAt: "desc" } },
      },
      orderBy: { purchasedAt: "desc" },
    });

    if (tickets.length === 0) {
      return NextResponse.json({ tickets: [] });
    }

    return NextResponse.json({
      tickets: tickets.map((t) => ({
        id: t.id,
        eventTitle: t.event.title,
        venue: t.event.venue,
        address: t.event.address,
        date: t.event.date,
        coverImage: t.event.coverImage,
        visitDate: t.visitDate,
        tier: t.tier,
        price: t.price,
        totalPaid: t.totalPaid,
        installments: t.installments,
        firstName: t.firstName,
        lastName: t.lastName,
        // Only expose QR codes to authenticated users
        qrCode: session?.user?.id ? t.qrCode : null,
        purchasedAt: t.purchasedAt,
        payments: session?.user?.id ? t.payments.map((p) => ({
          id: p.id,
          amount: p.amount,
          type: p.type,
          label: p.label,
          paidAt: p.paidAt,
        })) : [],
      })),
    });
  } catch (error) {
    console.error("Ticket lookup error:", error);
    return NextResponse.json(
      { error: "Erreur lors de la recherche." },
      { status: 500 },
    );
  }
}

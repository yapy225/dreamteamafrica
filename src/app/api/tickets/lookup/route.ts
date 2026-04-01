import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { auth } from "@/lib/auth";
import { rateLimit, getClientIp } from "@/lib/rate-limit";

/**
 * POST /api/tickets/lookup
 * Authenticated: returns full ticket details for own email only.
 * Unauthenticated: returns minimal info (no QR, no payments, no names).
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

    if (session?.user?.id) {
      // Authenticated: only own tickets
      if (session.user.email?.toLowerCase() !== trimmedEmail) {
        return NextResponse.json({ error: "Accès interdit." }, { status: 403 });
      }
    } else {
      // Unauthenticated: strict rate limiting
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
        ...(session?.user?.id ? { payments: { orderBy: { paidAt: "desc" as const } } } : {}),
      },
      orderBy: { purchasedAt: "desc" },
    });

    if (tickets.length === 0) {
      return NextResponse.json({ tickets: [] });
    }

    const isAuthenticated = !!session?.user?.id;

    return NextResponse.json({
      tickets: tickets.map((t) => ({
        id: isAuthenticated ? t.id : undefined,
        eventTitle: t.event.title,
        venue: t.event.venue,
        date: t.event.date,
        tier: t.tier,
        price: t.price,
        totalPaid: t.totalPaid,
        // Sensitive data only for authenticated users
        ...(isAuthenticated ? {
          address: t.event.address,
          coverImage: t.event.coverImage,
          visitDate: t.visitDate,
          installments: t.installments,
          firstName: t.firstName,
          lastName: t.lastName,
          qrCode: t.qrCode,
          purchasedAt: t.purchasedAt,
          payments: (t as any).payments?.map((p: any) => ({
            id: p.id,
            amount: p.amount,
            type: p.type,
            label: p.label,
            paidAt: p.paidAt,
          })) || [],
        } : {
          // Minimal info for unauthenticated
          status: t.totalPaid >= t.price ? "PAID" : "PARTIAL",
        }),
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

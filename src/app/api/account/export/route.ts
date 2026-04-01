import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { rateLimit } from "@/lib/rate-limit";

/**
 * GET /api/account/export
 * RGPD: Export all personal data for the authenticated user.
 */
export async function GET() {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Non autorisé." }, { status: 401 });
  }

  const rl = rateLimit(`export:${session.user.id}`, { limit: 2, windowSec: 3600 });
  if (!rl.success) {
    return NextResponse.json({ error: "Trop de tentatives. Réessayez dans 1 heure." }, { status: 429 });
  }

  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
    select: {
      id: true,
      name: true,
      email: true,
      phone: true,
      role: true,
      createdAt: true,
      tickets: {
        select: {
          id: true,
          tier: true,
          price: true,
          totalPaid: true,
          firstName: true,
          lastName: true,
          purchasedAt: true,
          visitDate: true,
          event: { select: { title: true, date: true } },
          payments: { select: { amount: true, type: true, label: true, paidAt: true } },
        },
      },
      exhibitorBookings: {
        select: {
          id: true,
          companyName: true,
          contactName: true,
          sector: true,
          totalPrice: true,
          status: true,
          createdAt: true,
        },
      },
      orders: {
        select: {
          id: true,
          total: true,
          status: true,
          createdAt: true,
        },
      },
    },
  });

  if (!user) {
    return NextResponse.json({ error: "Utilisateur introuvable." }, { status: 404 });
  }

  const exportData = {
    exportDate: new Date().toISOString(),
    notice: "Export de données personnelles conformément au RGPD (Article 20)",
    user: {
      name: user.name,
      email: user.email,
      phone: user.phone,
      role: user.role,
      memberSince: user.createdAt,
    },
    tickets: user.tickets,
    exhibitorBookings: user.exhibitorBookings,
    orders: user.orders,
  };

  return new NextResponse(JSON.stringify(exportData, null, 2), {
    headers: {
      "Content-Type": "application/json",
      "Content-Disposition": `attachment; filename="export-donnees-${user.email}.json"`,
    },
  });
}

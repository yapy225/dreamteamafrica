import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { rateLimit, getClientIp } from "@/lib/rate-limit";
import { audit } from "@/lib/audit";

export const dynamic = "force-dynamic";

export async function GET(request: Request) {
  const session = await auth();
  if (!session?.user?.id || session.user.role !== "ADMIN") {
    return NextResponse.json({ error: "Non autorisé" }, { status: 403 });
  }

  // Rate limit: 2 exports per 5 minutes
  const ip = getClientIp(request);
  const rl = rateLimit(`export:${ip}`, { limit: 2, windowSec: 300 });
  if (!rl.success) {
    return NextResponse.json({ error: "Trop de tentatives. Réessayez dans quelques minutes." }, { status: 429 });
  }

  await audit({
    userId: session.user.id,
    userEmail: session.user.email,
    action: "admin.export_comptabilite",
    ip: getClientIp(request),
  });

  // Tickets
  const tickets = await prisma.ticket.findMany({
    include: { event: { select: { title: true } } },
    orderBy: { purchasedAt: "desc" },
  });

  // Exhibitor payments
  const payments = await prisma.exhibitorPayment.findMany({
    include: { booking: { select: { companyName: true, email: true, pack: true } } },
    orderBy: { paidAt: "desc" },
  });

  const lines: string[] = [];
  lines.push("Date,Type,Description,Email,Montant,Événement");

  for (const t of tickets) {
    const date = new Date(t.purchasedAt).toLocaleDateString("fr-FR");
    const desc = `Billet ${t.tier} — ${t.firstName || ""} ${t.lastName || ""}`.trim();
    lines.push(`${date},Billet,"${desc}",${t.email || ""},${t.price},${t.event.title}`);
  }

  for (const p of payments) {
    const date = new Date(p.paidAt).toLocaleDateString("fr-FR");
    const desc = `${p.label} — ${p.booking.companyName}`;
    lines.push(`${date},Exposant,"${desc}",${p.booking.email},${p.amount},${p.booking.pack}`);
  }

  const csv = lines.join("\n");
  const bom = "\uFEFF";

  return new NextResponse(bom + csv, {
    headers: {
      "Content-Type": "text/csv; charset=utf-8",
      "Content-Disposition": `attachment; filename="comptabilite-dta-${new Date().toISOString().slice(0, 10)}.csv"`,
    },
  });
}

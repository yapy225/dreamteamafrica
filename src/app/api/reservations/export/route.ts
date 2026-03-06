import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { auth } from "@/lib/auth";

export const dynamic = "force-dynamic";

export async function GET() {
  const session = await auth();
  if (!session?.user || (session.user as { role?: string }).role !== "ADMIN") {
    return NextResponse.json({ error: "Non autorisé" }, { status: 401 });
  }

  const reservations = await prisma.eventReservation.findMany({
    include: { event: { select: { title: true } } },
    orderBy: { createdAt: "desc" },
  });

  const header = "Événement,Prénom,Nom,Email,Téléphone,Places,Statut,Date";
  const rows = reservations.map((r) => {
    const date = new Date(r.createdAt).toLocaleDateString("fr-FR");
    return [
      `"${r.event.title}"`,
      `"${r.firstName}"`,
      `"${r.lastName}"`,
      `"${r.email}"`,
      `"${r.phone}"`,
      r.guests,
      r.status,
      date,
    ].join(",");
  });

  const csv = "\uFEFF" + [header, ...rows].join("\n");

  return new NextResponse(csv, {
    headers: {
      "Content-Type": "text/csv; charset=utf-8",
      "Content-Disposition": `attachment; filename="reservations-${new Date().toISOString().slice(0, 10)}.csv"`,
    },
  });
}

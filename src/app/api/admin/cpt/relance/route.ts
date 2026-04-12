import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { sendCptRelanceEmail } from "@/lib/email";
import { buildMagicLink } from "@/lib/cpt-token";

export async function POST(request: Request) {
  const session = await auth();
  if (!session || session.user.role !== "ADMIN") {
    return NextResponse.json({ error: "Non autorisé." }, { status: 403 });
  }

  const { ticketId } = await request.json();
  if (!ticketId || typeof ticketId !== "string") {
    return NextResponse.json({ error: "ticketId requis." }, { status: 400 });
  }

  const ticket = await prisma.ticket.findUnique({
    where: { id: ticketId },
    include: { event: { select: { title: true, date: true } } },
  });
  if (!ticket || !ticket.email) {
    return NextResponse.json({ error: "Billet ou email introuvable." }, { status: 404 });
  }

  const price = Number(ticket.price);
  const paid = Number(ticket.totalPaid);
  const remaining = price - paid;
  if (remaining <= 0) {
    return NextResponse.json({ error: "Billet déjà soldé." }, { status: 400 });
  }

  const msDay = 86400000;
  const daysLeft = Math.max(1, Math.ceil((new Date(ticket.event.date).getTime() - Date.now()) / msDay));

  await sendCptRelanceEmail({
    to: ticket.email,
    firstName: ticket.firstName || "",
    eventTitle: ticket.event.title,
    eventDate: ticket.event.date,
    remaining,
    daysLeft,
    magicLink: buildMagicLink(ticket.id),
    ticketId: ticket.id,
  });

  return NextResponse.json({ ok: true });
}

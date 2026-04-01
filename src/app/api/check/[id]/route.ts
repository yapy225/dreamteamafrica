import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { rateLimit, getClientIp } from "@/lib/rate-limit";

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const ip = getClientIp(_request);
  const rl = rateLimit(`check-ticket:${ip}`, { limit: 30, windowSec: 60 });
  if (!rl.success) {
    return NextResponse.json({ error: "Trop de tentatives." }, { status: 429 });
  }

  const { id } = await params;

  // Try paid ticket
  const ticket = await prisma.ticket.findUnique({
    where: { id },
    include: {
      event: { select: { title: true, venue: true, address: true, date: true } },
      user: { select: { name: true, email: true } },
    },
  });

  if (ticket) {
    const isPaid = ticket.totalPaid >= ticket.price;
    const paymentPercent = ticket.price > 0 ? Math.round((ticket.totalPaid / ticket.price) * 100) : 100;

    return NextResponse.json({
      type: "TICKET",
      valid: true,
      id: ticket.id,
      eventTitle: ticket.event.title,
      eventVenue: ticket.event.venue,
      eventAddress: ticket.event.address,
      eventDate: ticket.event.date,
      holder: `${ticket.firstName || ""} ${ticket.lastName || ""}`.trim() || ticket.user.name || ticket.user.email,
      tier: ticket.tier,
      price: ticket.price,
      totalPaid: ticket.totalPaid,
      paymentPercent,
      paymentStatus: isPaid ? "PAID" : "PARTIAL",
      checkedIn: ticket.checkedInAt !== null,
      checkedInAt: ticket.checkedInAt,
    });
  }

  // Try free reservation
  const reservation = await prisma.eventReservation.findUnique({
    where: { id },
    include: {
      event: { select: { title: true, venue: true, address: true, date: true } },
    },
  });

  if (reservation) {
    return NextResponse.json({
      type: "RESERVATION",
      valid: true,
      id: reservation.id,
      eventTitle: reservation.event.title,
      eventVenue: reservation.event.venue,
      eventAddress: reservation.event.address,
      eventDate: reservation.event.date,
      holder: `${reservation.firstName} ${reservation.lastName}`,
      guests: reservation.guests,
      paymentStatus: "FREE",
      checkedIn: reservation.checkedInAt !== null,
      checkedInAt: reservation.checkedInAt,
    });
  }

  return NextResponse.json({ valid: false, error: "Billet introuvable" }, { status: 404 });
}

export async function POST(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const ip = getClientIp(_request);
  const rl = rateLimit(`check-in:${ip}`, { limit: 10, windowSec: 60 });
  if (!rl.success) {
    return NextResponse.json(
      { success: false, error: "Trop de tentatives." },
      { status: 429 },
    );
  }

  const { id } = await params;

  // Try check-in paid ticket
  const ticket = await prisma.ticket.findUnique({ where: { id } });
  if (ticket) {
    // FRAUD CHECK: verify payment is complete
    if (ticket.price > 0 && ticket.totalPaid < ticket.price) {
      const remaining = ticket.price - ticket.totalPaid;
      return NextResponse.json({
        success: false,
        error: `Paiement incomplet. Il reste ${remaining.toFixed(2)} € à payer.`,
        paymentStatus: "PARTIAL",
        totalPaid: ticket.totalPaid,
        price: ticket.price,
        remaining,
      }, { status: 402 });
    }

    if (ticket.checkedInAt) {
      return NextResponse.json({
        success: false,
        error: "Ce billet a déjà été scanné",
        checkedInAt: ticket.checkedInAt,
      }, { status: 409 });
    }

    await prisma.ticket.update({
      where: { id },
      data: { checkedInAt: new Date() },
    });
    return NextResponse.json({
      success: true,
      message: "Check-in validé",
      holder: `${ticket.firstName || ""} ${ticket.lastName || ""}`.trim(),
      tier: ticket.tier,
    });
  }

  // Try check-in free reservation
  const reservation = await prisma.eventReservation.findUnique({ where: { id } });
  if (reservation) {
    if (reservation.checkedInAt) {
      return NextResponse.json({
        success: false,
        error: "Cette réservation a déjà été scannée",
        checkedInAt: reservation.checkedInAt,
      }, { status: 409 });
    }
    await prisma.eventReservation.update({
      where: { id },
      data: { checkedInAt: new Date() },
    });
    return NextResponse.json({
      success: true,
      message: "Check-in validé",
      holder: `${reservation.firstName} ${reservation.lastName}`,
    });
  }

  return NextResponse.json({ success: false, error: "Billet introuvable" }, { status: 404 });
}

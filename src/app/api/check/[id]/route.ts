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

    // Mask holder name for privacy (show first letter + last name initial)
    const fullName = `${ticket.firstName || ""} ${ticket.lastName || ""}`.trim() || ticket.user.name || "Visiteur";
    const maskedName = fullName.length > 2
      ? fullName[0] + "***" + (fullName.includes(" ") ? " " + fullName.split(" ").pop()?.[0] + "." : "")
      : fullName;

    return NextResponse.json({
      type: "TICKET",
      valid: isPaid && !ticket.checkedInAt,
      id: ticket.id,
      eventTitle: ticket.event.title,
      holder: maskedName,
      tier: ticket.tier,
      paymentStatus: isPaid ? "PAID" : "PARTIAL",
      admissionAllowed: isPaid && !ticket.checkedInAt,
      checkedIn: ticket.checkedInAt !== null,
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

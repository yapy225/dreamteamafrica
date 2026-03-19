import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/db";

const EVENT_ID = "cmm767c1m0005ti794z61tzux"; // Foire d'Afrique Paris 2026

// GET: get all stands status for the event
export async function GET() {
  // Reserved stands (from bookings)
  const bookings = await prisma.exhibitorBooking.findMany({
    where: {
      events: { has: "foire-dafrique-paris" },
      status: { in: ["PARTIAL", "CONFIRMED"] },
      standNumber: { not: null },
    },
    select: {
      id: true,
      standNumber: true,
      companyName: true,
      status: true,
      userId: true,
    },
  });

  // Blocked stands (by admin)
  const blocked = await prisma.standBlock.findMany({
    where: { eventId: EVENT_ID },
    select: { standNumber: true, reason: true },
  });

  const stands: Record<
    number,
    {
      status: "available" | "reserved" | "blocked";
      companyName?: string;
      bookingId?: string;
      userId?: string;
      reason?: string;
    }
  > = {};

  // Initialize all 45 stands as available
  for (let i = 1; i <= 45; i++) {
    stands[i] = { status: "available" };
  }

  // Mark reserved
  for (const b of bookings) {
    if (b.standNumber) {
      stands[b.standNumber] = {
        status: "reserved",
        companyName: b.companyName,
        bookingId: b.id,
        userId: b.userId,
      };
    }
  }

  // Mark blocked
  for (const bl of blocked) {
    stands[bl.standNumber] = {
      status: "blocked",
      reason: bl.reason || undefined,
    };
  }

  return NextResponse.json({ stands });
}

// POST: reserve a stand for the current user's booking
export async function POST(request: NextRequest) {
  const session = await auth();
  if (!session) {
    return NextResponse.json({ error: "Non autorisé" }, { status: 401 });
  }

  const { standNumber, bookingId } = await request.json();

  if (!standNumber || standNumber < 1 || standNumber > 45) {
    return NextResponse.json({ error: "Numéro de stand invalide" }, { status: 400 });
  }

  // Check if stand is blocked
  const blocked = await prisma.standBlock.findUnique({
    where: { eventId_standNumber: { eventId: EVENT_ID, standNumber } },
  });
  if (blocked) {
    return NextResponse.json({ error: "Ce stand est indisponible" }, { status: 400 });
  }

  // Check if stand is already reserved by someone else
  const existing = await prisma.exhibitorBooking.findFirst({
    where: {
      events: { has: "foire-dafrique-paris" },
      status: { in: ["PARTIAL", "CONFIRMED"] },
      standNumber,
      id: { not: bookingId },
    },
  });
  if (existing) {
    return NextResponse.json({ error: "Ce stand est déjà réservé" }, { status: 400 });
  }

  // Verify booking belongs to user
  const booking = await prisma.exhibitorBooking.findFirst({
    where: {
      id: bookingId,
      userId: session.user.id,
      status: { in: ["PARTIAL", "CONFIRMED"] },
    },
  });
  if (!booking) {
    return NextResponse.json({ error: "Réservation introuvable" }, { status: 404 });
  }

  // Reserve the stand
  await prisma.exhibitorBooking.update({
    where: { id: bookingId },
    data: { standNumber },
  });

  return NextResponse.json({ ok: true, standNumber });
}

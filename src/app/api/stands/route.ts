import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/db";

const EVENT_ID = "cmm767c1m0005ti794z61tzux"; // Foire d'Afrique Paris 2026
const MAX_STAND = 60;

// GET: get all stands status (public — data is not sensitive)
export async function GET() {
  const [bookings, blocked] = await Promise.all([
    prisma.exhibitorBooking.findMany({
      where: {
        events: { has: "foire-dafrique-paris" },
        status: { in: ["PARTIAL", "CONFIRMED"] },
        standNumber: { not: null },
      },
      select: {
        standNumber: true,
        companyName: true,
      },
    }),
    prisma.standBlock.findMany({
      where: { eventId: EVENT_ID },
      select: { standNumber: true, reason: true },
    }),
  ]);

  const stands: Record<
    number,
    {
      status: "available" | "reserved" | "blocked";
      companyName?: string;
      reason?: string;
    }
  > = {};

  for (let i = 1; i <= MAX_STAND; i++) {
    stands[i] = { status: "available" };
  }

  for (const b of bookings) {
    if (b.standNumber) {
      stands[b.standNumber] = {
        status: "reserved",
        companyName: b.companyName,
      };
    }
  }

  for (const bl of blocked) {
    stands[bl.standNumber] = {
      status: "blocked",
      reason: bl.reason || undefined,
    };
  }

  return NextResponse.json({ stands });
}

// POST: reserve a stand (atomic transaction to prevent race conditions)
export async function POST(request: NextRequest) {
  const session = await auth();
  if (!session) {
    return NextResponse.json({ error: "Non autorisé" }, { status: 401 });
  }

  const body = await request.json();
  const standNumber = parseInt(body.standNumber);
  const bookingId = body.bookingId;

  if (!standNumber || !bookingId || standNumber < 1 || standNumber > MAX_STAND) {
    return NextResponse.json({ error: "Données invalides" }, { status: 400 });
  }

  // Atomic transaction to prevent race conditions
  try {
    await prisma.$transaction(async (tx) => {
      // Check blocked
      const blocked = await tx.standBlock.findUnique({
        where: { eventId_standNumber: { eventId: EVENT_ID, standNumber } },
      });
      if (blocked) throw new Error("Ce stand est indisponible");

      // Check already reserved
      const existing = await tx.exhibitorBooking.findFirst({
        where: {
          events: { has: "foire-dafrique-paris" },
          status: { in: ["PARTIAL", "CONFIRMED"] },
          standNumber,
          id: { not: bookingId },
        },
      });
      if (existing) throw new Error("Ce stand est déjà réservé");

      // Verify booking belongs to user
      const booking = await tx.exhibitorBooking.findFirst({
        where: {
          id: bookingId,
          userId: session.user.id,
          status: { in: ["PARTIAL", "CONFIRMED"] },
        },
      });
      if (!booking) throw new Error("Réservation introuvable");

      // Reserve
      await tx.exhibitorBooking.update({
        where: { id: bookingId },
        data: { standNumber },
      });
    });

    return NextResponse.json({ ok: true, standNumber });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Erreur";
    return NextResponse.json({ error: message }, { status: 400 });
  }
}

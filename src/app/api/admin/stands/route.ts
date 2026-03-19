import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/db";

const EVENT_ID = "cmm767c1m0005ti794z61tzux";

// POST: block/unblock a stand (admin only)
export async function POST(request: NextRequest) {
  const session = await auth();
  if (!session || session.user.role !== "ADMIN") {
    return NextResponse.json({ error: "Non autorisé" }, { status: 403 });
  }

  const { standNumber, action, reason } = await request.json();

  if (!standNumber || standNumber < 1 || standNumber > 45) {
    return NextResponse.json({ error: "Numéro de stand invalide" }, { status: 400 });
  }

  if (action === "block") {
    await prisma.standBlock.upsert({
      where: { eventId_standNumber: { eventId: EVENT_ID, standNumber } },
      create: { eventId: EVENT_ID, standNumber, reason },
      update: { reason },
    });
    return NextResponse.json({ ok: true, action: "blocked" });
  }

  if (action === "unblock") {
    await prisma.standBlock.deleteMany({
      where: { eventId: EVENT_ID, standNumber },
    });
    return NextResponse.json({ ok: true, action: "unblocked" });
  }

  // Free a stand (remove from booking)
  if (action === "free") {
    await prisma.exhibitorBooking.updateMany({
      where: {
        events: { has: "foire-dafrique-paris" },
        standNumber,
      },
      data: { standNumber: null },
    });
    return NextResponse.json({ ok: true, action: "freed" });
  }

  return NextResponse.json({ error: "Action invalide" }, { status: 400 });
}

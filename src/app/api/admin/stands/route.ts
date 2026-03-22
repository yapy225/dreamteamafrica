import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/db";

const EVENT_ID = "cmm767c1m0005ti794z61tzux";

// POST: block/unblock/free a stand (admin only)
export async function POST(request: NextRequest) {
  const session = await auth();
  if (!session?.user?.id || session.user.role !== "ADMIN") {
    return NextResponse.json({ error: "Non autorisé" }, { status: 403 });
  }

  const { standNumber, action, reason, confirm } = await request.json();

  if (!standNumber || standNumber < 1 || standNumber > 60) {
    return NextResponse.json({ error: "Numéro de stand invalide" }, { status: 400 });
  }

  if (action === "block") {
    await prisma.standBlock.upsert({
      where: { eventId_standNumber: { eventId: EVENT_ID, standNumber } },
      create: { eventId: EVENT_ID, standNumber, reason },
      update: { reason },
    });
    console.log(`[ADMIN STANDS] ${session.user.email} BLOCKED stand ${standNumber}: ${reason}`);
    return NextResponse.json({ ok: true, action: "blocked" });
  }

  if (action === "unblock") {
    await prisma.standBlock.deleteMany({
      where: { eventId: EVENT_ID, standNumber },
    });
    console.log(`[ADMIN STANDS] ${session.user.email} UNBLOCKED stand ${standNumber}`);
    return NextResponse.json({ ok: true, action: "unblocked" });
  }

  // Free a stand — REQUIRES double confirmation
  if (action === "free") {
    if (confirm !== "CONFIRMER") {
      return NextResponse.json(
        { error: "Action dangereuse. Envoyez confirm: 'CONFIRMER' pour libérer ce stand." },
        { status: 400 },
      );
    }

    // Find who has this stand
    const currentBooking = await prisma.exhibitorBooking.findFirst({
      where: {
        events: { has: "foire-dafrique-paris" },
        standNumber,
      },
      select: { id: true, companyName: true, contactName: true, email: true },
    });

    if (!currentBooking) {
      return NextResponse.json({ error: "Aucun exposant sur ce stand" }, { status: 404 });
    }

    await prisma.exhibitorBooking.update({
      where: { id: currentBooking.id },
      data: { standNumber: null },
    });

    console.log(
      `[ADMIN STANDS] ⚠️ ${session.user.email} FREED stand ${standNumber} from ${currentBooking.companyName} (${currentBooking.email})`,
    );

    return NextResponse.json({
      ok: true,
      action: "freed",
      freedFrom: {
        company: currentBooking.companyName,
        email: currentBooking.email,
      },
    });
  }

  return NextResponse.json({ error: "Action invalide" }, { status: 400 });
}

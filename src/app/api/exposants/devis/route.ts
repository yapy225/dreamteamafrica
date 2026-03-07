import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { EXHIBITOR_EVENTS, EXHIBITOR_PACKS } from "@/lib/exhibitor-events";
import { sendQuoteEmail } from "@/lib/email";

export async function POST(request: Request) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Non authentifié." }, { status: 401 });
    }

    const { bookingId } = await request.json();
    if (!bookingId) {
      return NextResponse.json({ error: "bookingId requis." }, { status: 400 });
    }

    const booking = await prisma.exhibitorBooking.findUnique({
      where: { id: bookingId },
    });
    if (!booking) {
      return NextResponse.json({ error: "Réservation introuvable." }, { status: 404 });
    }

    const pack = EXHIBITOR_PACKS.find((p) => p.id === booking.pack);
    const eventNames = EXHIBITOR_EVENTS.filter((e) =>
      booking.events.includes(e.id)
    )
      .map((e) => e.title)
      .join(", ");

    await sendQuoteEmail({
      to: booking.email,
      contactName: booking.contactName,
      companyName: booking.companyName,
      eventTitle: eventNames || booking.events.join(", "),
      packName: pack?.name ?? booking.pack,
      totalDays: booking.totalDays,
      totalPrice: booking.totalPrice,
      installments: booking.installments,
      installmentAmount: booking.installmentAmount,
      bookingId: booking.id,
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Resend quote error:", error);
    return NextResponse.json({ error: "Erreur interne." }, { status: 500 });
  }
}

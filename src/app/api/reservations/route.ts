import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";

// IDs des événements gratuits
const FREE_EVENT_IDS = [
  "cmm767c1m0008ti7933a7kqoq", // Festival de l'Autre Culture
  "cmm767c1m0007ti79g90z3vdf", // FICA
];

export async function POST(request: NextRequest) {
  try {
    const { eventId, firstName, lastName, email, phone, guests } =
      await request.json();

    if (!eventId || !firstName?.trim() || !lastName?.trim() || !email?.trim() || !phone?.trim()) {
      return NextResponse.json(
        { error: "Tous les champs sont obligatoires." },
        { status: 400 }
      );
    }

    if (!FREE_EVENT_IDS.includes(eventId)) {
      return NextResponse.json(
        { error: "Cet événement ne propose pas de réservation gratuite." },
        { status: 400 }
      );
    }

    const nbGuests = Math.min(Math.max(Number(guests) || 1, 1), 10);

    // Check duplicate
    const existing = await prisma.eventReservation.findFirst({
      where: { eventId, email: email.trim().toLowerCase() },
    });

    if (existing) {
      return NextResponse.json(
        { error: "Une réservation existe déjà avec cet email pour cet événement." },
        { status: 409 }
      );
    }

    const reservation = await prisma.eventReservation.create({
      data: {
        eventId,
        firstName: firstName.trim(),
        lastName: lastName.trim(),
        email: email.trim().toLowerCase(),
        phone: phone.trim(),
        guests: nbGuests,
      },
    });

    return NextResponse.json(
      { id: reservation.id, message: "Réservation confirmée" },
      { status: 201 }
    );
  } catch (error) {
    console.error("Reservation error:", error);
    return NextResponse.json({ error: "Erreur interne." }, { status: 500 });
  }
}

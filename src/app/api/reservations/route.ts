import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import QRCode from "qrcode";
import { uploadBuffer } from "@/lib/bunny";
import { sendFreeTicketEmail } from "@/lib/email";

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

    // Fetch event details
    const event = await prisma.event.findUnique({
      where: { id: eventId },
      select: { title: true, venue: true, address: true, date: true, coverImage: true },
    });

    if (!event) {
      return NextResponse.json(
        { error: "Événement introuvable." },
        { status: 404 }
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

    // Generate QR code — simple URL for reliable scanning
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "https://dreamteamafrica.com";
    const qrData = `${baseUrl}/check/${reservation.id}`;

    // Generate QR as data URL (for frontend display)
    const qrCodeDataUrl = await QRCode.toDataURL(qrData, {
      width: 600,
      margin: 3,
      errorCorrectionLevel: "H",
      color: { dark: "#000000", light: "#FFFFFF" },
    });

    // Generate QR as PNG buffer and upload to Bunny CDN (for email)
    const qrBuffer = await QRCode.toBuffer(qrData, {
      width: 600,
      margin: 3,
      errorCorrectionLevel: "H",
      color: { dark: "#000000", light: "#FFFFFF" },
    });

    let qrCdnUrl: string | null = null;
    try {
      const { url } = await uploadBuffer(
        Buffer.from(qrBuffer),
        `qrcodes/reservations/${reservation.id}.png`,
      );
      qrCdnUrl = url;
    } catch (uploadErr) {
      console.error("QR upload to Bunny failed:", uploadErr);
    }

    // Send confirmation email with ticket
    try {
      await sendFreeTicketEmail({
        to: email.trim().toLowerCase(),
        guestName: `${firstName.trim()} ${lastName.trim()}`,
        eventTitle: event.title,
        eventVenue: event.venue,
        eventAddress: event.address,
        eventDate: event.date,
        eventCoverImage: event.coverImage,
        guests: nbGuests,
        reservationId: reservation.id,
        qrCodeUrl: qrCdnUrl || qrCodeDataUrl,
      });
    } catch (emailErr) {
      console.error("Free ticket email failed:", emailErr);
    }

    return NextResponse.json(
      {
        id: reservation.id,
        message: "Réservation confirmée",
        qrCode: qrCodeDataUrl,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Reservation error:", error);
    return NextResponse.json({ error: "Erreur interne." }, { status: 500 });
  }
}

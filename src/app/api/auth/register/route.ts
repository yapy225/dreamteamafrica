import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { prisma } from "@/lib/db";

export async function POST(request: Request) {
  try {
    const { name, email, password, role } = await request.json();

    if (!name || !email || !password) {
      return NextResponse.json(
        { error: "Tous les champs sont requis." },
        { status: 400 }
      );
    }

    if (password.length < 6) {
      return NextResponse.json(
        { error: "Le mot de passe doit contenir au moins 6 caractères." },
        { status: 400 }
      );
    }

    const existing = await prisma.user.findUnique({ where: { email } });
    if (existing) {
      return NextResponse.json(
        { error: "Un compte existe déjà avec cet email." },
        { status: 409 }
      );
    }

    const hashedPassword = await bcrypt.hash(password, 12);

    // Check if exhibitor bookings exist with this email → auto-assign EXPOSANT role
    const hasExhibitorBookings = await prisma.exhibitorBooking.findFirst({
      where: { email: { equals: email, mode: "insensitive" } },
      select: { id: true },
    });

    const finalRole = hasExhibitorBookings
      ? "EXPOSANT"
      : role === "ARTISAN"
        ? "ARTISAN"
        : role === "EXPOSANT"
          ? "EXPOSANT"
          : "USER";

    const user = await prisma.user.create({
      data: {
        name,
        email,
        password: hashedPassword,
        role: finalRole,
      },
    });

    // Link orphan bookings to this new user
    if (hasExhibitorBookings) {
      await prisma.exhibitorBooking.updateMany({
        where: { email: { equals: email, mode: "insensitive" } },
        data: { userId: user.id },
      });
      await prisma.exhibitorProfile.updateMany({
        where: {
          booking: { email: { equals: email, mode: "insensitive" } },
        },
        data: { userId: user.id },
      });
      console.log(`[REGISTER] Linked exhibitor bookings to new user ${user.id} (${email})`);
    }

    return NextResponse.json(
      { id: user.id, name: user.name, email: user.email },
      { status: 201 }
    );
  } catch (error) {
    console.error("Registration error:", error);
    return NextResponse.json(
      { error: "Erreur interne du serveur." },
      { status: 500 }
    );
  }
}

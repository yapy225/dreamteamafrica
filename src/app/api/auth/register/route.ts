import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { prisma } from "@/lib/db";
import { rateLimit, getClientIp, RATE_LIMITS } from "@/lib/rate-limit";

export async function POST(request: Request) {
  try {
    // Rate limiting — 5 attempts per 15 minutes
    const ip = getClientIp(request);
    const rl = rateLimit(`register:${ip}`, RATE_LIMITS.auth);
    if (!rl.success) {
      return NextResponse.json(
        { error: "Trop de tentatives. Réessayez dans quelques minutes." },
        { status: 429 },
      );
    }

    const { name, email, password, role } = await request.json();

    if (!name || !email || !password) {
      return NextResponse.json(
        { error: "Tous les champs sont requis." },
        { status: 400 }
      );
    }

    if (password.length < 8 || !/[A-Z]/.test(password) || !/[0-9]/.test(password)) {
      return NextResponse.json(
        { error: "Le mot de passe doit contenir au moins 8 caractères, une majuscule et un chiffre." },
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

    // Check if exhibitor bookings exist with this email AND are owned by a placeholder user
    // (no password set — e.g. created by admin before the exposant registered).
    // Do NOT auto-link bookings owned by a real user (with password) — risque de vol
    // de bookings en cas de saisie email incorrecte côté admin.
    const linkableBooking = await prisma.exhibitorBooking.findFirst({
      where: {
        email: { equals: email, mode: "insensitive" },
        user: { password: null },
      },
      select: { id: true },
    });

    // Role is determined server-side only — never trust client input
    const finalRole = linkableBooking ? "EXPOSANT" : "USER";

    const user = await prisma.user.create({
      data: {
        name,
        email,
        password: hashedPassword,
        role: finalRole,
      },
    });

    // Link ghost-user bookings to this new user
    if (linkableBooking) {
      const linkable = await prisma.exhibitorBooking.findMany({
        where: {
          email: { equals: email, mode: "insensitive" },
          user: { password: null },
        },
        select: { id: true },
      });
      const ids = linkable.map((b) => b.id);
      await prisma.exhibitorBooking.updateMany({
        where: { id: { in: ids } },
        data: { userId: user.id },
      });
      await prisma.exhibitorProfile.updateMany({
        where: { bookingId: { in: ids } },
        data: { userId: user.id },
      });
      console.log(`[REGISTER] Linked ${ids.length} ghost-user booking(s) to new user ${user.id} (${email})`);
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

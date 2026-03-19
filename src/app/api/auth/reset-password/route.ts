import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import bcrypt from "bcryptjs";
import crypto from "crypto";
import { rateLimit, getClientIp } from "@/lib/rate-limit";

export async function POST(request: Request) {
  try {
    // Rate limit: 5 requests per 15 minutes per IP
    const ip = getClientIp(request);
    const rl = rateLimit(`reset-pwd:${ip}`, { limit: 5, windowSec: 15 * 60 });
    if (!rl.success) {
      return NextResponse.json(
        { error: "Trop de tentatives. Réessayez dans quelques minutes." },
        { status: 429 },
      );
    }

    const { token, email, password } = await request.json();

    if (!token || !email || !password) {
      return NextResponse.json(
        { error: "Données manquantes." },
        { status: 400 },
      );
    }

    if (typeof token !== "string" || typeof password !== "string") {
      return NextResponse.json(
        { error: "Données invalides." },
        { status: 400 },
      );
    }

    if (password.length < 8) {
      return NextResponse.json(
        { error: "Le mot de passe doit contenir au moins 8 caractères." },
        { status: 400 },
      );
    }

    const trimmedEmail = email.trim().toLowerCase();

    // Hash the incoming token to compare with stored hash
    const tokenHash = crypto.createHash("sha256").update(token).digest("hex");

    // Find and validate token (compare hashed versions)
    const verificationToken = await prisma.verificationToken.findFirst({
      where: {
        identifier: trimmedEmail,
        token: tokenHash,
        expires: { gt: new Date() },
      },
    });

    if (!verificationToken) {
      return NextResponse.json(
        { error: "Lien expiré ou invalide. Veuillez refaire une demande." },
        { status: 400 },
      );
    }

    // Hash new password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Update user password
    await prisma.user.update({
      where: { email: trimmedEmail },
      data: { password: hashedPassword },
    });

    // Delete used token (single-use)
    await prisma.verificationToken.deleteMany({
      where: { identifier: trimmedEmail },
    });

    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error("Reset password error:", error);
    return NextResponse.json(
      { error: "Une erreur est survenue." },
      { status: 500 },
    );
  }
}

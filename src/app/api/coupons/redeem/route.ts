import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { rateLimit, getClientIp } from "@/lib/rate-limit";
import bcrypt from "bcryptjs";

export async function POST(request: Request) {
  const ip = getClientIp(request);
  const rl = rateLimit(`coupon-redeem:${ip}`, { limit: 5, windowSec: 15 * 60 });
  if (!rl.success) {
    return NextResponse.json(
      { error: "Trop de tentatives." },
      { status: 429 },
    );
  }

  const { code, firstName, lastName, email, phone, companyName, sector } =
    await request.json();

  if (!code || !firstName || !lastName || !email || !companyName) {
    return NextResponse.json(
      { error: "Tous les champs sont requis." },
      { status: 400 },
    );
  }

  try {
    // Atomic coupon validation + increment to prevent race conditions
    const trimmedCode = code.trim().toUpperCase();
    const coupon = await prisma.coupon.findUnique({
      where: { code: trimmedCode },
    });

    if (
      !coupon ||
      !coupon.active ||
      coupon.usedCount >= coupon.maxUses ||
      (coupon.expiresAt && coupon.expiresAt < new Date())
    ) {
      return NextResponse.json(
        { error: "Coupon invalide ou expiré." },
        { status: 400 },
      );
    }

    // Atomic increment with condition — prevents double-use race condition
    const { count: updated } = await prisma.coupon.updateMany({
      where: {
        id: coupon.id,
        usedCount: { lt: coupon.maxUses },
      },
      data: { usedCount: { increment: 1 } },
    });
    if (updated === 0) {
      return NextResponse.json(
        { error: "Coupon déjà utilisé." },
        { status: 400 },
      );
    }

    // Create or find user
    const trimmedEmail = email.trim().toLowerCase();
    const { randomBytes } = await import("crypto");
    const rawPassword = randomBytes(8).toString("hex"); // 16 chars, cryptographically secure
    const hashedPassword = await bcrypt.hash(rawPassword, 12);

    const user = await prisma.user.upsert({
      where: { email: trimmedEmail },
      create: {
        email: trimmedEmail,
        name: `${firstName} ${lastName}`,
        phone: phone || null,
        password: hashedPassword,
      },
      update: {},
    });

    // Create booking (free)
    const booking = await prisma.exhibitorBooking.create({
      data: {
        userId: user.id,
        companyName,
        contactName: `${firstName} ${lastName}`,
        email: trimmedEmail,
        phone: phone || "",
        sector: sector || "Association",
        pack: "ENTREPRENEUR",
        events: ["foire-dafrique-paris"],
        totalDays: 2,
        stands: 1,
        totalPrice: 0,
        installments: 1,
        installmentAmount: 0,
        paidInstallments: 1,
        status: "CONFIRMED",
      },
    });

    // Create profile
    const profile = await prisma.exhibitorProfile.create({
      data: {
        bookingId: booking.id,
        userId: user.id,
        companyName,
        sector: sector || "Association",
      },
    });

    // Link coupon to booking (increment already done above atomically)
    await prisma.coupon.update({
      where: { id: coupon.id },
      data: {
        usedBy: trimmedEmail,
        bookingId: booking.id,
      },
    });

    // Record free payment
    await prisma.exhibitorPayment.create({
      data: {
        bookingId: booking.id,
        amount: 0,
        type: "full_payment",
        label: `Coupon gratuit — ${coupon.label}`,
        stripeId: `coupon_${coupon.code}`,
      },
    });

    return NextResponse.json({
      ok: true,
      bookingId: booking.id,
      profileToken: profile.token,
      message: `Stand gratuit confirmé pour ${companyName} ! Complétez votre fiche exposant pour maximiser votre visibilité.`,
    });
  } catch (error) {
    console.error("Coupon redeem error:", error);
    return NextResponse.json(
      { error: "Erreur lors de la réservation." },
      { status: 500 },
    );
  }
}

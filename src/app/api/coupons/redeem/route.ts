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

  const coupon = await prisma.coupon.findUnique({
    where: { code: code.trim().toUpperCase() },
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

  try {
    // Create or find user
    const trimmedEmail = email.trim().toLowerCase();
    const rawPassword = Math.random().toString(36).slice(2, 10);
    const hashedPassword = await bcrypt.hash(rawPassword, 10);

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

    // Mark coupon as used
    await prisma.coupon.update({
      where: { id: coupon.id },
      data: {
        usedCount: { increment: 1 },
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

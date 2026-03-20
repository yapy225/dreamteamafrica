import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { rateLimit, getClientIp } from "@/lib/rate-limit";

export async function POST(request: Request) {
  // Rate limit: 10 attempts per 10 min
  const ip = getClientIp(request);
  const rl = rateLimit(`coupon:${ip}`, { limit: 10, windowSec: 10 * 60 });
  if (!rl.success) {
    return NextResponse.json(
      { error: "Trop de tentatives. Réessayez dans quelques minutes." },
      { status: 429 },
    );
  }

  const { code } = await request.json();

  if (!code || typeof code !== "string") {
    return NextResponse.json({ error: "Code requis." }, { status: 400 });
  }

  const coupon = await prisma.coupon.findUnique({
    where: { code: code.trim().toUpperCase() },
  });

  if (!coupon) {
    return NextResponse.json({ error: "Code invalide." }, { status: 404 });
  }

  if (!coupon.active) {
    return NextResponse.json({ error: "Ce coupon n'est plus actif." }, { status: 400 });
  }

  if (coupon.usedCount >= coupon.maxUses) {
    return NextResponse.json({ error: "Ce coupon a déjà été utilisé." }, { status: 400 });
  }

  if (coupon.expiresAt && coupon.expiresAt < new Date()) {
    return NextResponse.json({ error: "Ce coupon a expiré." }, { status: 400 });
  }

  return NextResponse.json({
    valid: true,
    type: coupon.type,
    value: coupon.value,
    label: coupon.label,
    code: coupon.code,
  });
}

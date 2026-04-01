import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/db";
import * as OTPAuth from "otpauth";
import { rateLimit, getClientIp } from "@/lib/rate-limit";

export async function POST(request: Request) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Non autorisé." }, { status: 401 });
  }

  const ip = getClientIp(request);
  const rl = rateLimit(`totp-verify:${session.user.id}`, { limit: 5, windowSec: 60 });
  if (!rl.success) {
    return NextResponse.json({ error: "Trop de tentatives." }, { status: 429 });
  }

  const { code } = await request.json();

  if (!code || typeof code !== "string" || code.length !== 6) {
    return NextResponse.json({ error: "Code invalide." }, { status: 400 });
  }

  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
    select: { totpSecret: true },
  });

  if (!user?.totpSecret) {
    return NextResponse.json({ error: "2FA non configuré." }, { status: 400 });
  }

  const totp = new OTPAuth.TOTP({
    issuer: "Dream Team Africa",
    label: session.user.email || "",
    algorithm: "SHA1",
    digits: 6,
    period: 30,
    secret: OTPAuth.Secret.fromBase32(user.totpSecret),
  });

  const delta = totp.validate({ token: code, window: 1 });

  if (delta === null) {
    return NextResponse.json({ error: "Code incorrect." }, { status: 400 });
  }

  // Enable 2FA
  await prisma.user.update({
    where: { id: session.user.id },
    data: { totpEnabled: true },
  });

  return NextResponse.json({ success: true });
}

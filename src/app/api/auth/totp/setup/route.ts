import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/db";
import * as OTPAuth from "otpauth";
import QRCode from "qrcode";

export async function POST() {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Non autorisé." }, { status: 401 });
  }

  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
    select: { email: true, totpEnabled: true },
  });

  if (!user) {
    return NextResponse.json({ error: "Utilisateur introuvable." }, { status: 404 });
  }

  if (user.totpEnabled) {
    return NextResponse.json({ error: "Le 2FA est déjà activé." }, { status: 400 });
  }

  // Generate TOTP secret
  const totp = new OTPAuth.TOTP({
    issuer: "Dream Team Africa",
    label: user.email,
    algorithm: "SHA1",
    digits: 6,
    period: 30,
    secret: new OTPAuth.Secret({ size: 20 }),
  });

  // Store secret temporarily (not yet enabled)
  await prisma.user.update({
    where: { id: session.user.id },
    data: { totpSecret: totp.secret.base32 },
  });

  // Generate QR code
  const otpauthUrl = totp.toString();
  const qrDataUrl = await QRCode.toDataURL(otpauthUrl, { width: 256, margin: 2 });

  return NextResponse.json({
    qrCode: qrDataUrl,
    secret: totp.secret.base32,
    otpauthUrl,
  });
}

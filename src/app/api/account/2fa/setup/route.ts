import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { createTotpSecret, getTotpUri } from "@/lib/totp";
import QRCode from "qrcode";
import { encrypt } from "@/lib/crypto";

export async function POST() {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Non autorisé." }, { status: 401 });
  }

  if (session.user.role !== "ADMIN") {
    return NextResponse.json({ error: "Réservé aux administrateurs." }, { status: 403 });
  }

  const secret = createTotpSecret();
  const otpauthUrl = getTotpUri(session.user.email || "admin", secret);
  const qrDataUrl = await QRCode.toDataURL(otpauthUrl);

  await prisma.user.update({
    where: { id: session.user.id },
    data: { totpSecret: encrypt(secret), totpEnabled: false },
  });

  return NextResponse.json({
    qrCode: qrDataUrl,
    secret,
    message: "Scannez le QR code avec votre application d'authentification.",
  });
}

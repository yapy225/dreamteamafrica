import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { verifyTotp } from "@/lib/totp";
import { decrypt } from "@/lib/crypto";

export async function POST(request: Request) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Non autorisé." }, { status: 401 });
  }

  const { code } = await request.json();
  if (!code || typeof code !== "string") {
    return NextResponse.json({ error: "Code requis." }, { status: 400 });
  }

  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
    select: { totpSecret: true, totpEnabled: true },
  });

  if (!user?.totpSecret || !user.totpEnabled) {
    return NextResponse.json({ error: "2FA n'est pas activé." }, { status: 400 });
  }

  const secret = decrypt(user.totpSecret);
  if (!verifyTotp(code, secret)) {
    return NextResponse.json({ error: "Code invalide." }, { status: 400 });
  }

  await prisma.user.update({
    where: { id: session.user.id },
    data: { totpSecret: null, totpEnabled: false },
  });

  return NextResponse.json({ success: true, message: "2FA désactivé." });
}

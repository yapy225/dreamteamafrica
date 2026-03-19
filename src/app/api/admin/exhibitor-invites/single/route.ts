import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { sendExhibitorProfileInviteEmail } from "@/lib/email";

export async function POST(request: Request) {
  const session = await auth();
  if (!session || session.user.role !== "ADMIN") {
    return NextResponse.json({ error: "Non autorisé" }, { status: 403 });
  }

  const { email, contactName, companyName, profileToken } = await request.json();

  if (!email || !contactName || !companyName || !profileToken) {
    return NextResponse.json({ error: "Données manquantes" }, { status: 400 });
  }

  try {
    await sendExhibitorProfileInviteEmail({
      to: email,
      contactName,
      companyName,
      profileToken,
    });
    return NextResponse.json({ ok: true });
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

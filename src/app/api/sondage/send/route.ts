import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { sendSurveyEmail } from "@/lib/email";

export async function POST(request: Request) {
  try {
    const session = await auth();
    if (!session?.user?.id || session.user.role !== "ADMIN") {
      return NextResponse.json({ error: "Non autorisé." }, { status: 403 });
    }

    const { emails } = await request.json();

    if (!Array.isArray(emails) || emails.length === 0) {
      return NextResponse.json({ error: "Aucun email fourni." }, { status: 400 });
    }

    let sent = 0;
    let failed = 0;

    for (const email of emails) {
      try {
        await sendSurveyEmail({ to: email.trim() });
        sent++;
      } catch (err) {
        console.error(`Survey email failed for ${email}:`, err);
        failed++;
      }
    }

    return NextResponse.json({ sent, failed });
  } catch (error) {
    console.error("Send survey error:", error);
    return NextResponse.json({ error: "Erreur interne." }, { status: 500 });
  }
}

import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";

export async function POST(request: Request) {
  try {
    const { answer, days, name, email, phone } = await request.json();

    if (!answer || !name?.trim() || !email?.trim()) {
      return NextResponse.json({ error: "Champs obligatoires manquants." }, { status: 400 });
    }

    if (!["YES", "NO"].includes(answer)) {
      return NextResponse.json({ error: "Réponse invalide." }, { status: 400 });
    }

    if (answer === "YES" && (!Array.isArray(days) || days.length === 0)) {
      return NextResponse.json({ error: "Choisissez au moins un jour." }, { status: 400 });
    }

    const survey = await prisma.exhibitorSurvey.upsert({
      where: { email: email.trim().toLowerCase() },
      create: {
        email: email.trim().toLowerCase(),
        name: name.trim(),
        phone: phone?.trim() || null,
        answer: answer as "YES" | "NO",
        days: answer === "YES" ? days : [],
      },
      update: {
        name: name.trim(),
        phone: phone?.trim() || null,
        answer: answer as "YES" | "NO",
        days: answer === "YES" ? days : [],
      },
    });

    return NextResponse.json({ ok: true, id: survey.id });
  } catch (error) {
    console.error("Survey error:", error);
    return NextResponse.json({ error: "Erreur interne." }, { status: 500 });
  }
}

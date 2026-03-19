import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { rateLimit, getClientIp, RATE_LIMITS } from "@/lib/rate-limit";

export async function POST(request: Request) {
  try {
    // Rate limiting
    const ip = getClientIp(request);
    const rl = rateLimit(`sondage:${ip}`, RATE_LIMITS.form);
    if (!rl.success) {
      return NextResponse.json({ error: "Trop de requêtes. Réessayez plus tard." }, { status: 429 });
    }

    const { answer, days, name, email, phone } = await request.json();

    if (!answer || !name?.trim() || !email?.trim()) {
      return NextResponse.json({ error: "Champs obligatoires manquants." }, { status: 400 });
    }

    // Input validation
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return NextResponse.json({ error: "Adresse email invalide." }, { status: 400 });
    }
    if (name.trim().length > 100) {
      return NextResponse.json({ error: "Le nom ne doit pas dépasser 100 caractères." }, { status: 400 });
    }
    if (phone && phone.trim().length > 20) {
      return NextResponse.json({ error: "Le téléphone ne doit pas dépasser 20 caractères." }, { status: 400 });
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

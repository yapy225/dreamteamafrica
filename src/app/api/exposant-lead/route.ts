import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { rateLimit, getClientIp, RATE_LIMITS } from "@/lib/rate-limit";

export async function POST(req: NextRequest) {
  try {
    // Rate limiting
    const ip = getClientIp(req);
    const rl = rateLimit(`exposant-lead:${ip}`, RATE_LIMITS.form);
    if (!rl.success) {
      return NextResponse.json({ error: "Trop de requêtes. Réessayez plus tard." }, { status: 429 });
    }

    const body = await req.json();
    const { firstName, lastName, brand, sector, phone, email, eventName } = body;

    if (!firstName || !lastName || !brand || !sector || !phone || !email || !eventName) {
      return NextResponse.json({ error: "Tous les champs sont obligatoires." }, { status: 400 });
    }

    // Input validation
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return NextResponse.json({ error: "Adresse email invalide." }, { status: 400 });
    }

    // Anti-spam: reject gibberish names
    const hasVowel = /[aeiouyàâéèêëïîôùûüæœ]/i;
    const tooManyConsonants = /[^aeiouyàâéèêëïîôùûüæœ\s\-'&.]{6,}/i;
    if (!hasVowel.test(firstName) || !hasVowel.test(lastName) ||
        tooManyConsonants.test(firstName) || tooManyConsonants.test(lastName)) {
      return NextResponse.json({ error: "Nom invalide." }, { status: 400 });
    }

    if (firstName.length > 100 || lastName.length > 100) {
      return NextResponse.json({ error: "Le nom ne doit pas dépasser 100 caractères." }, { status: 400 });
    }
    if (brand.length > 200) {
      return NextResponse.json({ error: "La marque ne doit pas dépasser 200 caractères." }, { status: 400 });
    }
    if (sector.length > 200) {
      return NextResponse.json({ error: "Le secteur ne doit pas dépasser 200 caractères." }, { status: 400 });
    }
    if (phone.length > 20) {
      return NextResponse.json({ error: "Le téléphone ne doit pas dépasser 20 caractères." }, { status: 400 });
    }

    const lead = await prisma.exposantLead.create({
      data: { firstName, lastName, brand, sector, phone, email, eventName },
    });

    return NextResponse.json({ id: lead.id });
  } catch (error) {
    console.error("[exposant-lead] Error:", error);
    return NextResponse.json({ error: "Erreur serveur." }, { status: 500 });
  }
}

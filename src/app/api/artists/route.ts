import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { rateLimit, getClientIp } from "@/lib/rate-limit";

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function sanitize(val: unknown, maxLen = 200): string | null {
  if (typeof val !== "string") return null;
  const trimmed = val.trim().slice(0, maxLen);
  return trimmed || null;
}

export async function POST(request: Request) {
  try {
    const ip = getClientIp(request);
    const rl = rateLimit(`artist-apply:${ip}`, { limit: 5, windowSec: 15 * 60 });
    if (!rl.success) {
      return NextResponse.json(
        { error: "Trop de tentatives. Réessayez dans quelques minutes." },
        { status: 429 },
      );
    }

    const body = await request.json();

    // Honeypot
    if (body.website) {
      return NextResponse.json({ success: true });
    }

    const firstName = sanitize(body.firstName);
    const lastName = sanitize(body.lastName);
    const email = sanitize(body.email)?.toLowerCase();
    const phone = sanitize(body.phone, 30);
    const discipline = sanitize(body.discipline, 100);

    if (!firstName || !lastName || !email || !phone || !discipline) {
      return NextResponse.json(
        { error: "Prénom, nom, email, téléphone et discipline sont requis." },
        { status: 400 },
      );
    }

    if (!EMAIL_RE.test(email)) {
      return NextResponse.json({ error: "Adresse email invalide." }, { status: 400 });
    }

    const existing = await prisma.artistApplication.findFirst({ where: { email } });
    if (existing) {
      return NextResponse.json(
        { error: "Une candidature avec cet email existe déjà." },
        { status: 409 },
      );
    }

    await prisma.artistApplication.create({
      data: {
        firstName,
        lastName,
        email,
        phone,
        discipline,
        groupName: sanitize(body.groupName),
        country: sanitize(body.country, 100),
        description: sanitize(body.description, 500),
        videoUrl: sanitize(body.videoUrl, 500),
        instagram: sanitize(body.instagram, 100),
        facebook: sanitize(body.facebook, 200),
        website: sanitize(body.websiteUrl, 500),
        event: sanitize(body.event) || "Saison Culturelle Africaine 2026",
      },
    });

    // Newsletter opt-in
    if (body.newsletter) {
      await prisma.newsletterSubscriber.upsert({
        where: { email },
        create: { email },
        update: {},
      });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Artist application error:", error);
    return NextResponse.json({ error: "Une erreur est survenue." }, { status: 500 });
  }
}

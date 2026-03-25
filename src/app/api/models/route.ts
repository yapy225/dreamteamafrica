import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { auth } from "@/lib/auth";
import { rateLimit, getClientIp } from "@/lib/rate-limit";

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const MAX_LEN = 500;

function sanitize(val: unknown, maxLen = 200): string | null {
  if (typeof val !== "string") return null;
  const trimmed = val.trim().slice(0, maxLen);
  return trimmed || null;
}

// GET — list all applications (admin only)
export async function GET() {
  const session = await auth();
  if (!session || session.user.role !== "ADMIN") {
    return NextResponse.json({ error: "Non autorisé" }, { status: 401 });
  }

  const applications = await prisma.modelApplication.findMany({
    orderBy: { createdAt: "desc" },
  });

  return NextResponse.json({ applications });
}

// POST — public submission (no auth required)
export async function POST(request: Request) {
  try {
    // Rate limit: 5 submissions per 15 minutes per IP
    const ip = getClientIp(request);
    const rl = rateLimit(`model-apply:${ip}`, { limit: 5, windowSec: 15 * 60 });
    if (!rl.success) {
      return NextResponse.json(
        { error: "Trop de tentatives. Réessayez dans quelques minutes." },
        { status: 429 },
      );
    }

    const body = await request.json();

    // Honeypot — if filled, silently reject
    if (body.website) {
      return NextResponse.json({ success: true });
    }

    const firstName = sanitize(body.firstName);
    const lastName = sanitize(body.lastName);
    const email = sanitize(body.email)?.toLowerCase();
    const phone = sanitize(body.phone, 30);

    if (!firstName || !lastName || !email || !phone) {
      return NextResponse.json(
        { error: "Prénom, nom, email et téléphone sont requis." },
        { status: 400 },
      );
    }

    if (!EMAIL_RE.test(email)) {
      return NextResponse.json(
        { error: "Adresse email invalide." },
        { status: 400 },
      );
    }

    // Check duplicate
    const existing = await prisma.modelApplication.findFirst({
      where: { email },
    });
    if (existing) {
      return NextResponse.json(
        { error: "Une candidature avec cet email existe déjà." },
        { status: 409 },
      );
    }

    await prisma.modelApplication.create({
      data: {
        firstName,
        lastName,
        email,
        phone,
        height: sanitize(body.height, 20),
        measurements: sanitize(body.measurements, 50),
        experience: sanitize(body.experience, MAX_LEN),
        instagram: sanitize(body.instagram, 100),
        bookUrl: sanitize(body.bookUrl, 500),
        photo1Url: null,
        photo2Url: null,
        photo3Url: null,
        event: "Fashion Week Africa — Paris 2026",
      },
    });

    // Subscribe to newsletter if opted in
    if (body.newsletter) {
      await prisma.newsletterSubscriber.upsert({
        where: { email },
        create: { email },
        update: {},
      });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Model application error:", error);
    return NextResponse.json(
      { error: "Une erreur est survenue." },
      { status: 500 },
    );
  }
}

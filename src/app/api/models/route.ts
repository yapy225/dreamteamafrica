import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { auth } from "@/lib/auth";

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
    const body = await request.json();

    const { firstName, lastName, email, phone, height, measurements, experience, instagram, bookUrl, photo1Url, photo2Url, photo3Url, event } = body;

    if (!firstName || !lastName || !email || !phone) {
      return NextResponse.json(
        { error: "Prénom, nom, email et téléphone sont requis." },
        { status: 400 },
      );
    }

    const application = await prisma.modelApplication.create({
      data: {
        firstName: firstName.trim(),
        lastName: lastName.trim(),
        email: email.trim().toLowerCase(),
        phone: phone.trim(),
        height: height?.trim() || null,
        measurements: measurements?.trim() || null,
        experience: experience?.trim() || null,
        instagram: instagram?.trim() || null,
        bookUrl: bookUrl?.trim() || null,
        photo1Url: photo1Url?.trim() || null,
        photo2Url: photo2Url?.trim() || null,
        photo3Url: photo3Url?.trim() || null,
        event: event || "Fashion Week Africa — Paris 2026",
      },
    });

    return NextResponse.json({ success: true, id: application.id });
  } catch (error) {
    console.error("Model application error:", error);
    return NextResponse.json(
      { error: "Une erreur est survenue." },
      { status: 500 },
    );
  }
}

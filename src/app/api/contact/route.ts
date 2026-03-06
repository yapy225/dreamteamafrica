import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";

const VALID_CATEGORIES = [
  "EXPOSANT",
  "MANNEQUIN",
  "PRESTATAIRE",
  "PARTENAIRE",
  "INSTITUTION",
  "MEDIA",
  "ARTISTE",
];

export async function POST(request: NextRequest) {
  try {
    const { category, firstName, lastName, email, phone, company, message } =
      await request.json();

    if (
      !category ||
      !VALID_CATEGORIES.includes(category) ||
      !firstName?.trim() ||
      !lastName?.trim() ||
      !email?.trim()
    ) {
      return NextResponse.json(
        { error: "Veuillez remplir tous les champs obligatoires." },
        { status: 400 },
      );
    }

    await prisma.contactMessage.create({
      data: {
        category,
        firstName: firstName.trim(),
        lastName: lastName.trim(),
        email: email.trim().toLowerCase(),
        phone: phone?.trim() || null,
        company: company?.trim() || null,
        message: (message || "").trim(),
      },
    });

    return NextResponse.json({ success: true }, { status: 201 });
  } catch (error) {
    console.error("Contact form error:", error);
    return NextResponse.json({ error: "Erreur interne." }, { status: 500 });
  }
}

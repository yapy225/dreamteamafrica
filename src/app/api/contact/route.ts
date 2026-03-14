import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { sendContactNotificationEmail } from "@/lib/email";

const VALID_CATEGORIES = [
  "EXPOSANT",
  "MANNEQUIN",
  "PRESTATAIRE",
  "PARTENAIRE",
  "INSTITUTION",
  "MEDIA",
  "ARTISTE",
];

const categoryLabels: Record<string, string> = {
  EXPOSANT: "Exposant",
  MANNEQUIN: "Mannequin",
  PRESTATAIRE: "Prestataire",
  PARTENAIRE: "Partenaire",
  INSTITUTION: "Institution",
  MEDIA: "Média",
  ARTISTE: "Artiste",
};

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

    const trimmedEmail = email.trim().toLowerCase();
    const trimmedFirstName = firstName.trim();
    const trimmedLastName = lastName.trim();
    const trimmedPhone = phone?.trim() || null;
    const trimmedCompany = company?.trim() || null;
    const trimmedMessage = (message || "").trim();

    await prisma.contactMessage.create({
      data: {
        category,
        firstName: trimmedFirstName,
        lastName: trimmedLastName,
        email: trimmedEmail,
        phone: trimmedPhone,
        company: trimmedCompany,
        message: trimmedMessage,
      },
    });

    // Send notification email so it appears in the inbox
    try {
      await sendContactNotificationEmail({
        category: categoryLabels[category] || category,
        firstName: trimmedFirstName,
        lastName: trimmedLastName,
        email: trimmedEmail,
        phone: trimmedPhone,
        company: trimmedCompany,
        message: trimmedMessage,
      });
    } catch (emailErr) {
      console.error("Contact notification email failed:", emailErr);
    }

    return NextResponse.json({ success: true }, { status: 201 });
  } catch (error) {
    console.error("Contact form error:", error);
    return NextResponse.json({ error: "Erreur interne." }, { status: 500 });
  }
}

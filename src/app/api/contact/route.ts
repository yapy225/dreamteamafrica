import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { sendContactNotificationEmail } from "@/lib/email";
import { generateDraftReply } from "@/lib/ai-draft";
import { rateLimit, getClientIp, RATE_LIMITS } from "@/lib/rate-limit";

const VALID_CATEGORIES = [
  "EXPOSANT",
  "MANNEQUIN",
  "PRESTATAIRE",
  "PARTENAIRE",
  "INSTITUTION",
  "MEDIA",
  "ARTISTE",
  "ZAOULI_DEVIS",
  "ZAOULI_INTERET",
];

const categoryLabels: Record<string, string> = {
  EXPOSANT: "Exposant",
  MANNEQUIN: "Mannequin",
  PRESTATAIRE: "Prestataire",
  PARTENAIRE: "Partenaire",
  INSTITUTION: "Institution",
  MEDIA: "Média",
  ARTISTE: "Artiste",
  ZAOULI_DEVIS: "Devis Zaouli (cours / spectacle)",
  ZAOULI_INTERET: "Sondage Zaouli — intéressé(e) cours sept. 2026",
};

export async function POST(request: NextRequest) {
  try {
    const ip = getClientIp(request);
    const rl = rateLimit(`contact:${ip}`, RATE_LIMITS.form);
    if (!rl.success) {
      return NextResponse.json(
        { error: "Trop de soumissions. Réessayez dans quelques minutes." },
        { status: 429 },
      );
    }

    const { category, firstName, lastName, email, phone, company, message, newsletter } =
      await request.json();

    if (
      !category ||
      !VALID_CATEGORIES.includes(category) ||
      !firstName?.trim() ||
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
    const trimmedMessage = (message || "").trim().slice(0, 5000);

    const contact = await prisma.contactMessage.create({
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

    // Newsletter opt-in
    if (newsletter && trimmedEmail) {
      await prisma.newsletterSubscriber.upsert({
        where: { email: trimmedEmail },
        create: { email: trimmedEmail },
        update: {},
      });
    }

    // Generate AI draft reply (non-blocking)
    try {
      const draft = await generateDraftReply({
        firstName: trimmedFirstName,
        lastName: trimmedLastName,
        company: trimmedCompany,
        category: categoryLabels[category] || category,
        message: trimmedMessage,
      });
      if (draft) {
        await prisma.contactMessage.update({
          where: { id: contact.id },
          data: { draftReply: draft },
        });
      }
    } catch (draftErr) {
      console.error("AI draft generation failed (non-blocking):", draftErr);
    }

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

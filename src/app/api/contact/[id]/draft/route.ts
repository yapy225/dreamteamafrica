import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { generateDraftReply } from "@/lib/ai-draft";

const categoryLabels: Record<string, string> = {
  EXPOSANT: "Exposant",
  MANNEQUIN: "Mannequin",
  PRESTATAIRE: "Prestataire",
  PARTENAIRE: "Partenaire",
  INSTITUTION: "Institution",
  MEDIA: "Média",
  ARTISTE: "Artiste",
};

export async function POST(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await auth();
  if (!session?.user?.id || (session.user as { role?: string }).role !== "ADMIN") {
    return NextResponse.json({ error: "Non autorisé." }, { status: 403 });
  }

  const { id } = await params;

  const contact = await prisma.contactMessage.findUnique({ where: { id } });
  if (!contact) {
    return NextResponse.json({ error: "Message introuvable." }, { status: 404 });
  }

  const draft = await generateDraftReply({
    firstName: contact.firstName,
    lastName: contact.lastName,
    company: contact.company,
    category: categoryLabels[contact.category] || contact.category,
    message: contact.message,
  });

  await prisma.contactMessage.update({
    where: { id },
    data: { draftReply: draft },
  });

  return NextResponse.json({ draft });
}

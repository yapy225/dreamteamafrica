import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { sendProspectEmail } from "@/lib/email";

export async function POST(request: Request) {
  const session = await auth();
  if (!session?.user?.id || (session.user as { role?: string }).role !== "ADMIN") {
    return NextResponse.json({ error: "Non autorisé." }, { status: 403 });
  }

  const { ids } = await request.json();

  if (!Array.isArray(ids) || ids.length === 0) {
    return NextResponse.json({ error: "Aucun contact sélectionné." }, { status: 400 });
  }

  const contacts = await prisma.contactMessage.findMany({
    where: { id: { in: ids } },
  });

  let sent = 0;
  let errors = 0;

  for (const contact of contacts) {
    try {
      await sendProspectEmail({
        to: contact.email,
        firstName: contact.firstName,
        lastName: contact.lastName,
        company: contact.company,
        category: contact.category,
      });

      // Update status to CONTACTE if still NOUVEAU
      if (contact.status === "NOUVEAU") {
        await prisma.contactMessage.update({
          where: { id: contact.id },
          data: { status: "CONTACTE" },
        });
      }

      sent++;
    } catch (err) {
      console.error(`Failed to send prospect email to ${contact.email}:`, err);
      errors++;
    }
  }

  return NextResponse.json({ sent, errors, total: contacts.length });
}

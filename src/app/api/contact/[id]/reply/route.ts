import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { sendContactReplyEmail } from "@/lib/email";

export async function POST(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await auth();
  if (!session?.user?.id || (session.user as { role?: string }).role !== "ADMIN") {
    return NextResponse.json({ error: "Non autorisé." }, { status: 403 });
  }

  const { id } = await params;
  const { body } = await request.json();

  if (!body?.trim()) {
    return NextResponse.json({ error: "Le message ne peut pas être vide." }, { status: 400 });
  }

  const contact = await prisma.contactMessage.findUnique({ where: { id } });
  if (!contact) {
    return NextResponse.json({ error: "Message introuvable." }, { status: 404 });
  }

  // Send email
  try {
    await sendContactReplyEmail({
      to: contact.email,
      firstName: contact.firstName,
      replyBody: body.trim(),
    });
  } catch (emailErr: unknown) {
    console.error("Erreur envoi email reply:", emailErr);
    const msg = emailErr instanceof Error ? emailErr.message : "Erreur inconnue";
    return NextResponse.json({ error: `Échec de l'envoi : ${msg}` }, { status: 502 });
  }

  // Save reply and mark as read
  const [reply] = await prisma.$transaction([
    prisma.contactReply.create({
      data: {
        messageId: id,
        body: body.trim(),
        sentBy: session.user.id,
      },
    }),
    prisma.contactMessage.update({
      where: { id },
      data: { read: true },
    }),
  ]);

  return NextResponse.json(reply, { status: 201 });
}

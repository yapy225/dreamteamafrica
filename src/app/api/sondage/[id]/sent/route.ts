import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/db";

export async function POST(
  _request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const session = await auth();
    if (!session?.user?.id || session.user.role !== "ADMIN") {
      return NextResponse.json({ error: "Non autorisé." }, { status: 403 });
    }

    const { id } = await params;

    await prisma.exhibitorSurvey.update({
      where: { id },
      data: { sentAt: new Date() },
    });

    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error("Mark sent error:", error);
    return NextResponse.json({ error: "Erreur interne." }, { status: 500 });
  }
}

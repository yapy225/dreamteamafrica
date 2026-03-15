import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { firstName, lastName, brand, sector, phone, email, eventName } = body;

    if (!firstName || !lastName || !brand || !sector || !phone || !email || !eventName) {
      return NextResponse.json({ error: "Tous les champs sont obligatoires." }, { status: 400 });
    }

    const lead = await prisma.exposantLead.create({
      data: { firstName, lastName, brand, sector, phone, email, eventName },
    });

    return NextResponse.json({ id: lead.id });
  } catch (error) {
    console.error("[exposant-lead] Error:", error);
    return NextResponse.json({ error: "Erreur serveur." }, { status: 500 });
  }
}

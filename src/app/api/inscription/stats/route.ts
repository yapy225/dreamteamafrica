import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";

export async function GET() {
  try {
    const stats = await prisma.inscription.groupBy({
      by: ["categorie"],
      where: { status: "VALIDATED" },
      _count: { id: true },
    });

    const result: Record<string, number> = {};
    for (const s of stats) {
      result[s.categorie] = s._count.id;
    }

    return NextResponse.json(result);
  } catch (error) {
    console.error("Stats fetch error:", error);
    return NextResponse.json(
      { error: "Erreur interne du serveur." },
      { status: 500 }
    );
  }
}

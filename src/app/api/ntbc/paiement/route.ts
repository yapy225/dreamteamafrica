import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { executeNtbcTransaction } from "@/lib/ntbc";

// POST /api/ntbc/paiement — Payer un exposant via QR
export async function POST(req: NextRequest) {
  const session = await auth();
  if (!session?.user?.id) return NextResponse.json({ error: "Non connecté" }, { status: 401 });

  const { qrToken, montant, label } = await req.json();

  if (!qrToken || !montant || montant <= 0 || montant > 1000) {
    return NextResponse.json({ error: "qrToken et montant (1-1000) requis" }, { status: 400 });
  }

  // Trouver l'exposant par son QR token
  const exposant = await prisma.user.findUnique({ where: { qrToken } });
  if (!exposant) return NextResponse.json({ error: "QR invalide" }, { status: 404 });

  if (exposant.id === session.user.id) {
    return NextResponse.json({ error: "Auto-paiement interdit" }, { status: 400 });
  }

  if (exposant.role !== "EXPOSANT" && exposant.role !== "ADMIN") {
    return NextResponse.json({ error: "Ce QR n'est pas un exposant" }, { status: 400 });
  }

  const result = await executeNtbcTransaction(session.user.id, exposant.id, montant, label);

  if ("error" in result) {
    return NextResponse.json(result, { status: 400 });
  }

  return NextResponse.json({
    ...result,
    exposant: exposant.name,
  });
}

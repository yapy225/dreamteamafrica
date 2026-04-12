import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { crediterBonus, updateUserTier } from "@/lib/ntbc";
import crypto from "crypto";

const BONUS = 4;

// GET /api/ntbc/parrainage — Mon code + stats
export async function GET() {
  const session = await auth();
  if (!session?.user?.id) return NextResponse.json({ error: "Non connecté" }, { status: 401 });

  const userId = session.user.id;
  let user = await prisma.user.findUniqueOrThrow({ where: { id: userId } });

  // Générer le code si pas encore fait
  if (!user.parrainCode) {
    const code = crypto.randomBytes(4).toString("hex").toUpperCase();
    user = await prisma.user.update({ where: { id: userId }, data: { parrainCode: code } });
  }

  const stats = await prisma.ntbcParrainage.aggregate({
    where: { parrainId: userId },
    _count: true,
    _sum: { bonusNtbc: true },
  });

  const filleuls = await prisma.ntbcParrainage.findMany({
    where: { parrainId: userId },
    include: { filleul: { select: { name: true, createdAt: true } } },
    orderBy: { createdAt: "desc" },
  });

  return NextResponse.json({
    code: user.parrainCode,
    filleuls: filleuls.map((p) => ({ nom: p.filleul.name, date: p.createdAt })),
    totalFilleuls: stats._count,
    ntbcGagnes: stats._sum.bonusNtbc || 0,
  });
}

// POST /api/ntbc/parrainage — Appliquer un code parrain
export async function POST(req: NextRequest) {
  const session = await auth();
  if (!session?.user?.id) return NextResponse.json({ error: "Non connecté" }, { status: 401 });

  const { code } = await req.json();
  if (!code) return NextResponse.json({ error: "Code requis" }, { status: 400 });

  const filleulId = session.user.id;

  const parrain = await prisma.user.findUnique({ where: { parrainCode: code } });
  if (!parrain) return NextResponse.json({ error: "Code invalide" }, { status: 404 });
  if (parrain.id === filleulId) return NextResponse.json({ error: "Auto-parrainage interdit" }, { status: 400 });

  const existing = await prisma.ntbcParrainage.findFirst({ where: { filleulId } });
  if (existing) return NextResponse.json({ error: "Vous avez déjà un parrain" }, { status: 400 });

  await prisma.ntbcParrainage.create({
    data: { parrainId: parrain.id, filleulId, bonusNtbc: BONUS },
  });

  await Promise.all([
    crediterBonus(parrain.id, BONUS),
    crediterBonus(filleulId, BONUS),
  ]);

  return NextResponse.json({
    message: `${BONUS} NTBC bonus crédités !`,
    bonus: BONUS,
  });
}

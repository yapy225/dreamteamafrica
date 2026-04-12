import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/db";
import crypto from "crypto";

// GET /api/ntbc/wallet — Solde, tier, historique récent
export async function GET() {
  const session = await auth();
  if (!session?.user?.id) return NextResponse.json({ error: "Non connecté" }, { status: 401 });

  const userId = session.user.id;

  const user = await prisma.user.findUniqueOrThrow({
    where: { id: userId },
    select: {
      id: true, name: true, email: true, role: true, phone: true,
      soldeNtbc: true, soldeBonus: true, tier: true, qrToken: true,
    },
  });

  // Générer le qrToken si pas encore fait
  if (!user.qrToken) {
    const qrToken = crypto.randomBytes(16).toString("hex");
    await prisma.user.update({ where: { id: userId }, data: { qrToken } });
    user.qrToken = qrToken;
  }

  // 5 dernières transactions
  const transactions = await prisma.ntbcTransaction.findMany({
    where: { OR: [{ emetteurId: userId }, { receveurId: userId }] },
    orderBy: { createdAt: "desc" },
    take: 5,
    include: {
      emetteur: { select: { name: true } },
      receveur: { select: { name: true } },
    },
  });

  return NextResponse.json({
    ...user,
    soldeTotal: user.soldeNtbc + user.soldeBonus,
    transactions: transactions.map((t) => ({
      id: t.id,
      type: t.emetteurId === userId ? "debit" : "credit",
      montant: t.montantNtbc,
      net: t.netNtbc,
      label: t.label,
      contrepartie: t.emetteurId === userId ? t.receveur.name : t.emetteur.name,
      date: t.createdAt,
    })),
  });
}

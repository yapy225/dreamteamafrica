import { redirect } from "next/navigation";
import Link from "next/link";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { Wallet, ArrowUpRight, ArrowDownLeft, QrCode, Gift, ScanLine, Info } from "lucide-react";

export const dynamic = "force-dynamic";

const TIER_CONFIG: Record<string, { emoji: string; label: string; next?: { name: string; min: number } }> = {
  SEMENCE: { emoji: "🌱", label: "Semence", next: { name: "Racine", min: 10 } },
  RACINE: { emoji: "🌿", label: "Racine", next: { name: "Tronc", min: 50 } },
  TRONC: { emoji: "🌳", label: "Tronc", next: { name: "Baobab", min: 200 } },
  BAOBAB: { emoji: "🌴", label: "Baobab" },
};

export default async function WalletPage() {
  const session = await auth();
  if (!session) redirect("/auth/signin");

  const userId = session.user.id;

  const [user, transactions, commissionPayees, fraisBillets] = await Promise.all([
    prisma.user.findUniqueOrThrow({
      where: { id: userId },
      select: { soldeNtbc: true, soldeBonus: true, tier: true, qrToken: true, role: true },
    }),
    prisma.ntbcTransaction.findMany({
      where: { OR: [{ emetteurId: userId }, { receveurId: userId }] },
      orderBy: { createdAt: "desc" },
      take: 10,
      include: {
        emetteur: { select: { name: true } },
        receveur: { select: { name: true } },
      },
    }),
    // Total commission payée (exposant = receveur, commission prélevée)
    prisma.ntbcTransaction.aggregate({
      where: { receveurId: userId },
      _sum: { commissionNtbc: true, montantNtbc: true, netNtbc: true },
      _count: true,
    }),
    // Frais billetterie payés
    prisma.ticketPayment.aggregate({
      where: { ticket: { userId } },
      _sum: { amount: true },
      _count: true,
    }),
  ]);

  const soldeTotal = user.soldeNtbc + user.soldeBonus;
  const isExposant = user.role === "EXPOSANT" || user.role === "ADMIN";
  const totalCommission = commissionPayees._sum.commissionNtbc || 0;
  const totalVendu = commissionPayees._sum.montantNtbc || 0;
  const totalNetRecu = commissionPayees._sum.netNtbc || 0;
  const nbVentes = commissionPayees._count;
  const totalBilletsPaies = Number(fraisBillets._sum.amount || 0);
  const fraisGestion = Math.round(totalBilletsPaies * 0.03 * 100) / 100;
  const tier = TIER_CONFIG[user.tier] || TIER_CONFIG.SEMENCE;

  return (
    <div className="mx-auto max-w-lg space-y-6">
      <h1 className="text-2xl font-bold">Mon Wallet NTBC</h1>

      {/* Solde */}
      <div className="rounded-2xl bg-[#0D2B1E] p-6 text-center">
        <p className="text-sm text-white/60">Mon solde</p>
        <p className="text-5xl font-bold text-[#C9A84C]">
          {soldeTotal} <span className="text-2xl">NTBC</span>
        </p>
        <p className="text-sm text-white/50">= {user.soldeNtbc} EUR</p>

        {user.soldeBonus > 0 && (
          <p className="mt-2 text-xs text-green-300">
            dont {user.soldeBonus} NTBC bonus offerts
          </p>
        )}

        <div className="mt-3 inline-flex items-center gap-1 rounded-full bg-white/10 px-3 py-1">
          <span>{tier.emoji}</span>
          <span className="text-sm text-[#C9A84C]">{tier.label}</span>
        </div>

        {tier.next && (
          <div className="mt-3">
            <div className="mx-auto h-2 w-48 overflow-hidden rounded-full bg-white/20">
              <div
                className="h-full rounded-full bg-[#C9A84C] transition-all"
                style={{ width: `${Math.min(100, (soldeTotal / tier.next.min) * 100)}%` }}
              />
            </div>
            <p className="mt-1 text-xs text-white/40">
              {tier.next.min - soldeTotal} NTBC pour {tier.next.name}
            </p>
          </div>
        )}
      </div>

      {/* Actions */}
      <div className="grid grid-cols-3 gap-2">
        <Link
          href="/dashboard/payer"
          className="flex flex-col items-center gap-1 rounded-xl bg-[#0D2B1E] px-3 py-3 font-semibold text-white hover:bg-[#1a4a35]"
        >
          <QrCode className="h-5 w-5" />
          <span className="text-xs">Payer</span>
        </Link>
        <Link
          href="/dashboard/parrainage"
          className="flex flex-col items-center gap-1 rounded-xl bg-[#C9A84C] px-3 py-3 font-semibold text-[#0D2B1E] hover:bg-[#d4ba6a]"
        >
          <Gift className="h-5 w-5" />
          <span className="text-xs">Parrainage</span>
        </Link>
        <Link
          href="/dashboard/scanner-ntbc"
          className="flex flex-col items-center gap-1 rounded-xl bg-slate-100 px-3 py-3 font-semibold text-slate-700 hover:bg-slate-200"
        >
          <ScanLine className="h-5 w-5" />
          <span className="text-xs">Encaisser</span>
        </Link>
      </div>

      {/* Frais de gestion */}
      <div className="rounded-xl bg-white p-4 shadow-sm">
        <div className="mb-3 flex items-center gap-2">
          <Info className="h-4 w-4 text-slate-400" />
          <h2 className="text-sm font-semibold text-slate-700">Frais de gestion</h2>
        </div>

        {isExposant ? (
          // ── Vue Exposant ──
          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-slate-500">Commission (4%)</span>
              <span className="font-medium text-slate-700">{totalCommission} NTBC</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-500">Total encaisse</span>
              <span className="font-medium">{totalVendu} NTBC</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-500">Net recu</span>
              <span className="font-semibold text-green-600">{totalNetRecu} NTBC</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-500">Nombre de ventes</span>
              <span className="font-medium">{nbVentes}</span>
            </div>
            <div className="mt-2 rounded-lg bg-amber-50 p-2 text-xs text-amber-700">
              4% de commission preleve sur chaque paiement NTBC recu.
              Solde convertible en euros a tout moment (1 NTBC = 1 EUR).
            </div>
          </div>
        ) : (
          // ── Vue Visiteur ──
          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-slate-500">Billets achetes</span>
              <span className="font-medium">{totalBilletsPaies} EUR</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-500">Frais de gestion (3%)</span>
              <span className="font-medium text-slate-700">{fraisGestion} EUR</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-500">NTBC credites</span>
              <span className="font-semibold text-green-600">{soldeTotal} NTBC</span>
            </div>
            <div className="mt-2 rounded-lg bg-blue-50 p-2 text-xs text-blue-700">
              3% de frais de gestion (min 0,50 EUR) sur chaque achat de billet.
              Chaque euro verse = 1 NTBC dans votre wallet pour payer sur place.
            </div>
          </div>
        )}
      </div>

      {/* Historique */}
      <div>
        <h2 className="mb-3 text-lg font-semibold">Dernières transactions</h2>
        {transactions.length === 0 ? (
          <p className="py-8 text-center text-sm text-slate-400">
            Aucune transaction NTBC pour le moment
          </p>
        ) : (
          <div className="space-y-2">
            {transactions.map((t) => {
              const isDebit = t.emetteurId === userId;
              return (
                <div key={t.id} className="flex items-center justify-between rounded-xl bg-white p-3 shadow-sm">
                  <div className="flex items-center gap-3">
                    {isDebit ? (
                      <ArrowUpRight className="h-5 w-5 text-red-500" />
                    ) : (
                      <ArrowDownLeft className="h-5 w-5 text-green-500" />
                    )}
                    <div>
                      <p className="text-sm font-medium">
                        {t.label || (isDebit ? t.receveur.name : t.emetteur.name)}
                      </p>
                      <p className="text-xs text-slate-400">
                        {new Date(t.createdAt).toLocaleDateString("fr-FR")}
                      </p>
                    </div>
                  </div>
                  <span className={`font-semibold ${isDebit ? "text-red-500" : "text-green-600"}`}>
                    {isDebit ? "-" : "+"}{t.montantNtbc} NTBC
                  </span>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}

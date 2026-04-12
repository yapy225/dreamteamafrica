import { redirect } from "next/navigation";
import Link from "next/link";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { Wallet, ArrowUpRight, ArrowDownLeft, QrCode, Gift } from "lucide-react";

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

  const [user, transactions] = await Promise.all([
    prisma.user.findUniqueOrThrow({
      where: { id: userId },
      select: { soldeNtbc: true, soldeBonus: true, tier: true, qrToken: true },
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
  ]);

  const soldeTotal = user.soldeNtbc + user.soldeBonus;
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
      <div className="grid grid-cols-2 gap-3">
        <Link
          href="/dashboard/payer"
          className="flex items-center justify-center gap-2 rounded-xl bg-[#0D2B1E] px-4 py-3 font-semibold text-white hover:bg-[#1a4a35]"
        >
          <QrCode className="h-5 w-5" /> Payer
        </Link>
        <Link
          href="/dashboard/parrainage"
          className="flex items-center justify-center gap-2 rounded-xl bg-[#C9A84C] px-4 py-3 font-semibold text-[#0D2B1E] hover:bg-[#d4ba6a]"
        >
          <Gift className="h-5 w-5" /> Parrainage
        </Link>
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

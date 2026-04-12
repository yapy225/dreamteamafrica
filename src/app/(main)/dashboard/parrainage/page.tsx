import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/db";
import crypto from "crypto";
import { Gift, Users, Coins } from "lucide-react";
import { ParrainageActions } from "./ParrainageActions";

export const dynamic = "force-dynamic";

export default async function ParrainagePage() {
  const session = await auth();
  if (!session) redirect("/auth/signin");

  const userId = session.user.id;

  let user = await prisma.user.findUniqueOrThrow({
    where: { id: userId },
    select: { parrainCode: true, name: true },
  });

  if (!user.parrainCode) {
    const code = crypto.randomBytes(4).toString("hex").toUpperCase();
    await prisma.user.update({ where: { id: userId }, data: { parrainCode: code } });
    user = { ...user, parrainCode: code };
  }

  const [stats, filleuls] = await Promise.all([
    prisma.ntbcParrainage.aggregate({
      where: { parrainId: userId },
      _count: true,
      _sum: { bonusNtbc: true },
    }),
    prisma.ntbcParrainage.findMany({
      where: { parrainId: userId },
      include: { filleul: { select: { name: true, createdAt: true } } },
      orderBy: { createdAt: "desc" },
    }),
  ]);

  const lien = `https://dreamteamafrica.com/invite/${user.parrainCode}`;

  return (
    <div className="mx-auto max-w-lg space-y-6">
      <h1 className="text-2xl font-bold">Parrainage</h1>

      {/* Reward */}
      <div className="rounded-2xl bg-[#0D2B1E] p-6 text-center">
        <Gift className="mx-auto h-10 w-10 text-[#C9A84C]" />
        <p className="mt-2 text-3xl font-bold text-[#C9A84C]">4 NTBC</p>
        <p className="text-sm text-white/60">pour toi et ton ami à chaque inscription</p>
      </div>

      {/* Lien */}
      <div className="rounded-xl bg-white p-4 shadow-sm">
        <p className="mb-2 text-xs text-slate-400">Ton code de parrainage</p>
        <p className="mb-3 rounded-lg bg-slate-50 p-3 text-center font-mono text-lg font-bold tracking-widest text-[#0D2B1E]">
          {user.parrainCode}
        </p>
        <ParrainageActions code={user.parrainCode!} lien={lien} />
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-3">
        <div className="rounded-xl bg-white p-3 text-center shadow-sm">
          <Users className="mx-auto h-5 w-5 text-[#0D2B1E]" />
          <p className="mt-1 text-xl font-bold text-[#0D2B1E]">{stats._count}</p>
          <p className="text-[10px] text-slate-500">Filleuls</p>
        </div>
        <div className="rounded-xl bg-white p-3 text-center shadow-sm">
          <Coins className="mx-auto h-5 w-5 text-[#C9A84C]" />
          <p className="mt-1 text-xl font-bold text-[#C9A84C]">{stats._sum.bonusNtbc || 0}</p>
          <p className="text-[10px] text-slate-500">NTBC gagnés</p>
        </div>
        <div className="rounded-xl bg-white p-3 text-center shadow-sm">
          <Gift className="mx-auto h-5 w-5 text-green-500" />
          <p className="mt-1 text-xl font-bold text-green-500">{stats._count}</p>
          <p className="text-[10px] text-slate-500">Actifs</p>
        </div>
      </div>

      {/* Filleuls */}
      {filleuls.length > 0 && (
        <div>
          <h2 className="mb-3 text-lg font-semibold">Mes filleuls</h2>
          <div className="space-y-2">
            {filleuls.map((p) => (
              <div key={p.id} className="flex items-center justify-between rounded-xl bg-white p-3 shadow-sm">
                <div>
                  <p className="text-sm font-medium">{p.filleul.name}</p>
                  <p className="text-xs text-slate-400">
                    {new Date(p.createdAt).toLocaleDateString("fr-FR")}
                  </p>
                </div>
                <span className="text-sm font-semibold text-green-600">+{p.bonusNtbc} NTBC</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

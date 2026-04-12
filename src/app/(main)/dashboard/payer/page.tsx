import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/db";
import QRCode from "qrcode";
import crypto from "crypto";

export const dynamic = "force-dynamic";

export default async function PayerPage() {
  const session = await auth();
  if (!session) redirect("/auth/signin");

  const userId = session.user.id;

  let user = await prisma.user.findUniqueOrThrow({
    where: { id: userId },
    select: { name: true, qrToken: true, soldeNtbc: true, soldeBonus: true },
  });

  // Générer qrToken si pas encore fait
  if (!user.qrToken) {
    const qrToken = crypto.randomBytes(16).toString("hex");
    await prisma.user.update({ where: { id: userId }, data: { qrToken } });
    user = { ...user, qrToken };
  }

  const qrData = JSON.stringify({ type: "ntbc_visiteur", qrToken: user.qrToken });
  const qrImage = await QRCode.toDataURL(qrData, { width: 400, margin: 2, errorCorrectionLevel: "M" });
  const soldeTotal = user.soldeNtbc + user.soldeBonus;

  return (
    <div className="mx-auto max-w-lg space-y-6 text-center">
      <h1 className="text-2xl font-bold">Mon QR de paiement</h1>

      <div className="inline-block rounded-2xl bg-white p-6 shadow-sm">
        <img src={qrImage} alt="Mon QR NTBC" className="mx-auto h-64 w-64" />
        <p className="mt-4 text-lg font-semibold text-[#0D2B1E]">{user.name}</p>
        <p className="text-sm text-slate-500">{soldeTotal} NTBC</p>
      </div>

      <p className="text-sm text-slate-400">
        Montrez ce QR à l&apos;exposant pour payer avec vos NTBC
      </p>

      <div className="rounded-xl bg-amber-50 p-4 text-sm text-amber-800">
        <p className="font-semibold">Comment ça marche ?</p>
        <p className="mt-1">
          L&apos;exposant scanne votre QR, saisit le montant, et vos NTBC sont
          débités instantanément. Commission 4% prélevée automatiquement.
        </p>
      </div>
    </div>
  );
}

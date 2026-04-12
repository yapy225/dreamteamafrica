import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/db";
import NtbcScannerClient from "./NtbcScannerClient";

export const dynamic = "force-dynamic";
export const metadata = { title: "Scanner NTBC — Encaisser un paiement" };

export default async function ScannerNtbcPage() {
  const session = await auth();
  if (!session) redirect("/auth/signin");

  // Seuls EXPOSANT et ADMIN peuvent encaisser
  if (session.user.role !== "EXPOSANT" && session.user.role !== "ADMIN") {
    redirect("/dashboard");
  }

  const user = await prisma.user.findUniqueOrThrow({
    where: { id: session.user.id },
    select: { soldeNtbc: true, soldeBonus: true, name: true, qrToken: true },
  });

  return (
    <div className="mx-auto max-w-lg">
      <NtbcScannerClient
        soldeNtbc={user.soldeNtbc}
        exposantName={user.name || "Exposant"}
        qrToken={user.qrToken || ""}
      />
    </div>
  );
}

import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import InscriptionsAdmin from "./InscriptionsAdmin";

export const dynamic = "force-dynamic";
export const metadata = { title: "Gestion — L'Officiel d'Afrique 2026" };

export default async function OfficielAfriquePage() {
  const session = await auth();
  if (!session) redirect("/auth/signin");
  if (session.user.role !== "ADMIN") redirect("/dashboard");

  return (
    <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
      <InscriptionsAdmin />
    </div>
  );
}

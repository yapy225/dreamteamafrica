import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import OfficielForm from "../OfficielForm";

export const metadata = { title: "Nouveau contenu — Officiel d'Afrique" };

export default async function NewOfficielPage() {
  const session = await auth();
  if (!session) redirect("/auth/signin");
  if (session.user.role !== "ADMIN" && session.user.role !== "ARTISAN") redirect("/dashboard");

  return (
    <div className="mx-auto max-w-3xl px-4 py-12 sm:px-6 lg:px-8">
      <h1 className="mb-8 font-serif text-3xl font-bold text-dta-dark">
        Nouveau contenu
      </h1>
      <div className="rounded-[var(--radius-card)] bg-white p-6 shadow-[var(--shadow-card)] sm:p-8">
        <OfficielForm />
      </div>
    </div>
  );
}

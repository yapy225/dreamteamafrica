import { redirect } from "next/navigation";
import { Suspense } from "react";
import { auth } from "@/lib/auth";
import NewCampaignContent from "./NewCampaignContent";

export const metadata = { title: "Nouvelle campagne — DTA Ads" };

export default async function NewCampaignPage() {
  const session = await auth();
  if (!session) redirect("/auth/signin");

  return (
    <div className="mx-auto max-w-2xl px-4 py-12 sm:px-6 lg:px-8">
      <h1 className="mb-8 font-serif text-3xl font-bold text-dta-dark">
        Créer une campagne
      </h1>
      <div className="rounded-[var(--radius-card)] bg-white p-6 shadow-[var(--shadow-card)] sm:p-8">
        <Suspense fallback={<div className="py-8 text-center text-sm text-dta-taupe">Chargement...</div>}>
          <NewCampaignContent />
        </Suspense>
      </div>
    </div>
  );
}

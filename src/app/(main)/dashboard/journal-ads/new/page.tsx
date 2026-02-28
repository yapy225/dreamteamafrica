import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import JournalAdForm from "../JournalAdForm";

export const metadata = { title: "Nouvelle publicité" };

export default async function NewJournalAdPage() {
  const session = await auth();
  if (!session) redirect("/auth/signin");
  if (session.user.role !== "ADMIN") redirect("/dashboard");

  return (
    <div className="mx-auto max-w-3xl px-4 py-12 sm:px-6">
      <h1 className="mb-8 font-serif text-3xl font-bold text-dta-dark">
        Nouvelle publicité
      </h1>
      <div className="rounded-[var(--radius-card)] bg-white p-8 shadow-[var(--shadow-card)]">
        <JournalAdForm />
      </div>
    </div>
  );
}

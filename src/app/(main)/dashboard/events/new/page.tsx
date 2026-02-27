import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import EventForm from "../EventForm";

export const metadata = { title: "Créer un événement" };

export default async function NewEventPage() {
  const session = await auth();
  if (!session) redirect("/auth/signin");
  // Accessible à tous les utilisateurs connectés

  return (
    <div className="mx-auto max-w-3xl px-4 py-12 sm:px-6 lg:px-8">
      <h1 className="mb-8 font-serif text-3xl font-bold text-dta-dark">
        Créer un événement
      </h1>
      <div className="rounded-[var(--radius-card)] bg-white p-6 shadow-[var(--shadow-card)] sm:p-8">
        <EventForm />
      </div>
    </div>
  );
}

import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import ReservationForm from "./ReservationForm";

export const metadata = {
  title: "Réservation Stand Exposant | Dream Team Africa",
};

export default async function ReservationPage() {
  const session = await auth();
  if (!session) redirect("/auth/signin");

  return (
    <div className="mx-auto max-w-3xl px-4 py-12 sm:px-6">
      <h1 className="mb-2 font-serif text-3xl font-bold text-dta-dark">
        R&eacute;server votre stand
      </h1>
      <p className="mb-8 text-dta-char/70">
        Remplissez le formulaire ci-dessous pour r&eacute;server votre espace
        exposant.
      </p>
      <ReservationForm />
    </div>
  );
}

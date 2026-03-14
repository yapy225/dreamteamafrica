import { Metadata } from "next";
import SurveyForm from "./SurveyForm";

export const metadata: Metadata = {
  title: "Sondage — Foire d'Afrique Paris 2026 | Dream Team Africa",
  description: "Participez à la 6ème édition de la Foire d'Afrique Paris. Dites-nous si vous êtes intéressé(e) !",
};

export default function SondageFoireAfriquePage() {
  return (
    <div className="mx-auto max-w-xl px-4 py-16 sm:px-6">
      <div className="text-center">
        <p className="text-xs font-semibold uppercase tracking-widest text-dta-accent">
          Sondage
        </p>
        <h1 className="mt-2 font-serif text-3xl font-bold text-dta-dark">
          Foire d&apos;Afrique Paris 2026
        </h1>
        <p className="mt-2 text-sm text-dta-char/70">
          6&egrave;me &eacute;dition &mdash; 1er &amp; 2 mai 2026 &mdash; Espace MAS, Paris 13e
        </p>
      </div>

      <div className="mt-10">
        <SurveyForm />
      </div>
    </div>
  );
}

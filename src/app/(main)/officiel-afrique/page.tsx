import type { Metadata } from "next";
import OfficielClient from "./OfficielClient";

export const metadata: Metadata = {
  title: "L'Officiel d'Afrique 2026 — Inscrivez votre entreprise gratuitement",
  description:
    "Le premier annuaire professionnel de la diaspora africaine à Paris. Référencez votre activité auprès de milliers de professionnels et particuliers.",
  openGraph: {
    title: "L'Officiel d'Afrique 2026",
    description:
      "Le premier annuaire professionnel de la diaspora africaine à Paris. Inscription 100% gratuite.",
    type: "website",
  },
};

export default function OfficielAfriquePage() {
  return <OfficielClient />;
}

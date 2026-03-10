import type { Metadata } from "next";
import OfficielClient from "./OfficielClient";
import DiscoverMore from "@/components/sections/DiscoverMore";

const siteUrl = process.env.NEXT_PUBLIC_APP_URL || "https://dreamteamafrica.com";

export const metadata: Metadata = {
  title: "L'Officiel d'Afrique — Annuaire Diaspora Africaine en France",
  description:
    "Le premier annuaire professionnel de la diaspora africaine à Paris. Inscrivez gratuitement votre entreprise et connectez-vous avec la communauté africaine en France.",
  keywords: [
    "annuaire diaspora africaine",
    "annuaire entreprises africaines France",
    "annuaire professionnel africain",
    "entrepreneur africain France",
    "réseau entrepreneurs africains France",
  ],
  openGraph: {
    title: "L'Officiel d'Afrique — Annuaire Diaspora Africaine",
    description: "Annuaire professionnel de la diaspora africaine à Paris. Inscription 100% gratuite.",
    type: "website",
    url: `${siteUrl}/lofficiel-dafrique`,
  },
  alternates: {
    canonical: `${siteUrl}/lofficiel-dafrique`,
  },
};

export default function OfficielAfriquePage() {
  return (
    <>
      <OfficielClient />
      <DiscoverMore exclude="officiel" />
    </>
  );
}

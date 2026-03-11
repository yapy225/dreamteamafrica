import type { Metadata } from "next";
import OfficielClient from "./OfficielClient";
import DiscoverMore from "@/components/sections/DiscoverMore";
import { prisma } from "@/lib/db";

const siteUrl = process.env.NEXT_PUBLIC_APP_URL || "https://dreamteamafrica.com";

export const metadata: Metadata = {
  title: "L'Officiel d'Afrique — Annuaire Professionnel Diaspora Africaine Paris 2026",
  description:
    "Le premier annuaire professionnel de la diaspora africaine à Paris. Inscrivez gratuitement votre entreprise : artistes, restaurants africains, associations, médias, sport. Plus de 21 catégories.",
  keywords: [
    "annuaire diaspora africaine",
    "annuaire entreprises africaines France",
    "annuaire professionnel africain Paris",
    "entrepreneur africain France",
    "réseau entrepreneurs africains France",
    "annuaire artistes africains",
    "restaurants africains Paris annuaire",
    "associations africaines France",
    "annuaire médias africains",
    "annuaire sport africain France",
    "inscription annuaire gratuit diaspora",
    "officiel d'Afrique 2026",
  ],
  openGraph: {
    title: "L'Officiel d'Afrique — Annuaire Diaspora Africaine Paris",
    description: "Annuaire professionnel de la diaspora africaine à Paris. 21 catégories, inscription 100% gratuite.",
    type: "website",
    url: `${siteUrl}/lofficiel-dafrique`,
  },
  twitter: {
    card: "summary",
    title: "L'Officiel d'Afrique — Annuaire Diaspora Africaine",
    description: "Inscrivez gratuitement votre entreprise dans le premier annuaire de la diaspora africaine à Paris.",
  },
  alternates: {
    canonical: `${siteUrl}/lofficiel-dafrique`,
  },
};

const faqJsonLd = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: [
    {
      "@type": "Question",
      name: "Comment inscrire mon entreprise dans L'Officiel d'Afrique ?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Remplissez le formulaire d'inscription en ligne en moins de 3 minutes. C'est 100% gratuit. Votre fiche sera validée par notre équipe sous 48h puis publiée dans l'annuaire.",
      },
    },
    {
      "@type": "Question",
      name: "L'inscription à l'annuaire est-elle gratuite ?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Oui, l'inscription à L'Officiel d'Afrique est entièrement gratuite. Aucun frais caché. Votre entreprise sera visible dans l'annuaire digital 2026.",
      },
    },
    {
      "@type": "Question",
      name: "Quelles catégories sont disponibles dans l'annuaire ?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "L'annuaire propose 21 catégories : Artistes, Disques, Studios, Médias, Réseaux sociaux, Services, Scènes, Événements, Discothèques, Agents sportifs, Football, Basketball, Rugby, Magasins, Restaurants, Coopérations, Organismes, Ambassades, Associations, Aéroports et Contacts internationaux.",
      },
    },
    {
      "@type": "Question",
      name: "Combien de temps faut-il pour être publié dans l'annuaire ?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Après soumission de votre fiche, notre équipe éditoriale la valide sous 48 heures. Vous recevez un email de confirmation dès la publication.",
      },
    },
    {
      "@type": "Question",
      name: "Qui peut consulter l'annuaire L'Officiel d'Afrique ?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "L'annuaire est accessible gratuitement à tous. Consultez les fiches des professionnels de la diaspora africaine directement sur dreamteamafrica.com/lofficiel-dafrique/annuaire.",
      },
    },
  ],
};

const webPageJsonLd = {
  "@context": "https://schema.org",
  "@type": "WebPage",
  name: "L'Officiel d'Afrique — Annuaire Professionnel Diaspora Africaine",
  description: "Le premier annuaire professionnel de la diaspora africaine à Paris. 21 catégories, inscription gratuite.",
  url: `${siteUrl}/lofficiel-dafrique`,
  publisher: {
    "@type": "Organization",
    name: "Dream Team Africa",
    url: siteUrl,
  },
};

export default async function OfficielAfriquePage() {
  const directoryCount = await prisma.directoryEntry.count({ where: { published: true } });

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(webPageJsonLd) }}
      />
      <OfficielClient directoryCount={directoryCount} />
      <DiscoverMore exclude="officiel" />
    </>
  );
}

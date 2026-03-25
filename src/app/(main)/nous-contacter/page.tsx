import { Mail } from "lucide-react";
import ContactPageForm from "./ContactPageForm";

const siteUrl = process.env.NEXT_PUBLIC_APP_URL || "https://dreamteamafrica.com";

export const metadata = {
  title: "Nous Contacter — Dream Team Africa",
  description:
    "Contactez Dream Team Africa pour devenir exposant, mannequin, prestataire, partenaire ou artiste. Réponse sous 48h.",
  keywords: [
    "contacter Dream Team Africa",
    "devenir exposant Paris",
    "événement culturel africain contact",
    "partenariat diaspora africaine",
  ],
  openGraph: {
    title: "Nous Contacter — Dream Team Africa",
    description: "Exposant, artiste, partenaire, média : contactez-nous pour collaborer.",
    type: "website",
    url: `${siteUrl}/nous-contacter`,
  },
  alternates: {
    canonical: `${siteUrl}/nous-contacter`,
  },
};

const categories = [
  { id: "EXPOSANT", label: "Exposant", desc: "Réserver un stand lors de nos événements" },
  { id: "MANNEQUIN", label: "Mannequin", desc: "Participer à nos défilés et shootings" },
  { id: "PRESTATAIRE", label: "Prestataire", desc: "Proposer vos services (traiteur, technique, etc.)" },
  { id: "PARTENAIRE", label: "Partenaire", desc: "Collaborer avec Dream Team Africa" },
  { id: "INSTITUTION", label: "Institution", desc: "Mairie, association, organisme public" },
  { id: "MEDIA", label: "Média", desc: "Presse, blog, influenceur, journaliste" },
  { id: "ARTISTE", label: "Artiste", desc: "Musicien, danseur, comédien, peintre..." },
];

export default function NousContacterPage() {
  const contactJsonLd = {
    "@context": "https://schema.org",
    "@type": "ContactPage",
    name: "Contacter Dream Team Africa",
    description:
      "Formulaire de contact pour exposants, artistes, partenaires, institutions et médias.",
    url: `${siteUrl}/nous-contacter`,
    mainEntity: {
      "@type": "Organization",
      name: "Dream Team Africa",
      telephone: "+33751443774",
      email: "hello@dreamteamafrica.com",
      address: {
        "@type": "PostalAddress",
        addressLocality: "Paris",
        addressCountry: "FR",
      },
    },
  };

  return (
    <div>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(contactJsonLd) }}
      />

      {/* Hero */}
      <div className="bg-dta-dark py-16">
        <div className="mx-auto max-w-7xl px-4 text-center sm:px-6 lg:px-8">
          <div className="mx-auto mb-5 flex h-14 w-14 items-center justify-center rounded-full bg-dta-accent/20">
            <Mail size={28} className="text-dta-accent" />
          </div>
          <h1 className="font-serif text-4xl font-bold text-white sm:text-5xl">
            Nous contacter
          </h1>
          <p className="mx-auto mt-4 max-w-xl text-base text-dta-sand/70">
            S&eacute;lectionnez votre profil pour nous envoyer votre demande.
            Nous vous r&eacute;pondrons dans les plus brefs d&eacute;lais.
          </p>
        </div>
      </div>

      {/* Formulaire */}
      <div className="bg-dta-bg py-16">
        <div className="mx-auto max-w-2xl px-4 sm:px-6 lg:px-8">
          <ContactPageForm categories={categories} />
        </div>
      </div>
    </div>
  );
}

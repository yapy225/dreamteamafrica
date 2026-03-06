import { Mail } from "lucide-react";
import ContactPageForm from "./ContactPageForm";

export const metadata = {
  title: "Nous Contacter",
  description:
    "Contactez Dream Team Africa — exposant, mannequin, prestataire, partenaire, institution, média ou artiste.",
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
  return (
    <div>
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

import Link from "next/link";
import Image from "next/image";

const footerSections = [
  {
    title: "Découvrir",
    links: [
      { href: "/saison-culturelle-africaine", label: "Saison Culturelle" },
      { href: "/culture-pour-tous", label: "Culture pour Tous — dès 5€" },
      { href: "/danse-zaouli-paris", label: "Danse Zaouli" },
      { href: "/lafropeen", label: "L'Afropéen" },
      { href: "/lofficiel-dafrique", label: "L'Officiel d'Afrique" },
      { href: "/made-in-africa", label: "Made In Africa" },
    ],
  },
  {
    title: "Informations",
    links: [
      { href: "/a-propos", label: "À propos" },
      { href: "/nous-contacter", label: "Nous contacter" },
      { href: "/faire-un-don", label: "Nous soutenir" },
      { href: "/mentions-legales", label: "Mentions légales" },
      { href: "/conditions-generales", label: "CGV" },
      { href: "/conditions-utilisation", label: "CGU" },
      { href: "/politique-cookies", label: "Cookies" },
      { href: "/politique-de-confidentialite", label: "Confidentialité" },
      { href: "/politique-annulation", label: "Annulation & remboursement" },
    ],
  },
  {
    title: "Devenir Exposant",
    links: [
      { href: "/billetterie-exposants", label: "Tous les événements" },
      { href: "/resa-exposants/foire-dafrique-paris", label: "Foire d'Afrique Paris" },
      { href: "/resa-exposants/festival-autre-culture", label: "Festival de l'Autre Culture" },
      { href: "/resa-exposants/festival-cinema-africain", label: "Festival du Cinéma Africain" },
      { href: "/resa-exposants/fashion-week-africa", label: "Fashion Week Africa" },
      { href: "/resa-exposants/juste-une-danse", label: "Juste Une Danse" },
      { href: "/resa-exposants/festival-conte-africain", label: "Festival du Conte Africain" },
      { href: "/resa-exposants/salon-made-in-africa", label: "Salon Made In Africa" },
    ],
  },
  {
    title: "Mon compte",
    links: [
      { href: "/mes-billets", label: "Retrouver mes billets" },
      { href: "/auth/signin", label: "Se connecter" },
      { href: "/auth/forgot-password", label: "Mot de passe oublié" },
      { href: "/dashboard", label: "Espace client" },
    ],
  },
  {
    title: "Professionnels",
    links: [
      { href: "/exposants", label: "Tous les packs exposants" },
      { href: "/auth/signup?role=artisan", label: "Devenir artisan" },
      { href: "/dashboard", label: "Espace pro" },
    ],
  },
  {
    title: "Guides shopping",
    links: [
      { href: "/made-in-africa", label: "Marketplace Made in Africa" },
      { href: "/cosmetique-africaine-paris", label: "Cosmétique africaine" },
      { href: "/beurre-de-karite-paris", label: "Beurre de karité" },
      { href: "/huile-de-chebe-paris", label: "Huile de chebé" },
      { href: "/tissu-wax-paris", label: "Tissu wax" },
      { href: "/epicerie-africaine-paris", label: "Épicerie africaine" },
      { href: "/marche-africain-paris", label: "Marché africain" },
      { href: "/boutique-africaine-paris", label: "Boutiques africaines" },
    ],
  },
  {
    title: "Culture pour Tous",
    accent: true,
    links: [
      { href: "/culture-pour-tous", label: "Comment ça marche" },
      { href: "/reserver-sans-payer-tout-de-suite", label: "Réserver sans tout payer" },
      { href: "/billet-en-plusieurs-fois-evenement", label: "Billet en plusieurs fois" },
      { href: "/culture-accessible-paris", label: "Culture accessible à Paris" },
      { href: "/billet-pas-cher-concert", label: "Billet pas cher" },
      { href: "/sortir-pas-cher-paris", label: "Sortir pas cher à Paris" },
    ],
  },
];

export default function Footer() {
  return (
    <footer aria-label="Pied de page" className="border-t border-dta-sand/50 bg-dta-beige">
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-4 xl:grid-cols-7">
          {/* Brand */}
          <div>
            <Link href="/" className="inline-block">
              <Image
                src="/logo-dta.png"
                alt="Dream Team Africa"
                width={56}
                height={56}
                className="h-14 w-auto"
              />
            </Link>
            <p className="mt-3 text-sm leading-relaxed text-dta-char/70">
              La plateforme de référence pour la promotion de la culture
              africaine à Paris et en Europe.
            </p>
          </div>

          {/* Link sections */}
          {footerSections.map((section) => (
            <div key={section.title}>
              <h3 className={`font-serif text-sm font-semibold uppercase tracking-wider ${
                "accent" in section && section.accent ? "text-green-700" : "text-dta-dark"
              }`}>
                {section.title}
              </h3>
              <ul className="mt-4 space-y-2">
                {section.links.map((link) => (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      className={`text-sm transition-colors duration-200 ${
                        "accent" in section && section.accent
                          ? "text-green-600/70 hover:text-green-700"
                          : "text-dta-char/70 hover:text-dta-accent"
                      }`}
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Bottom bar */}
        <div className="mt-10 border-t border-dta-sand/50 pt-6">
          <p className="text-center text-xs text-dta-taupe">
            &copy; {new Date().getFullYear()} Dream Team Africa. Tous droits
            réservés.
          </p>
        </div>
      </div>
    </footer>
  );
}

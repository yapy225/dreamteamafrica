import Link from "next/link";
import Image from "next/image";

const footerSections = [
  {
    title: "Découvrir",
    links: [
      { href: "/evenements", label: "Événements" },
      { href: "/marketplace", label: "Marketplace" },
      { href: "/journal", label: "L'Afropéen" },
    ],
  },
  {
    title: "Informations",
    links: [
      { href: "/a-propos", label: "À propos" },
      { href: "/contact", label: "Contact" },
      { href: "/mentions-legales", label: "Mentions légales" },
    ],
  },
  {
    title: "Professionnels",
    links: [
      { href: "/auth/signup?role=artisan", label: "Devenir artisan" },
      { href: "/ads", label: "DTA Ads" },
      { href: "/dashboard", label: "Espace pro" },
    ],
  },
];

export default function Footer() {
  return (
    <footer aria-label="Pied de page" className="border-t border-dta-sand/50 bg-dta-beige">
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-4">
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
              <h3 className="font-serif text-sm font-semibold uppercase tracking-wider text-dta-dark">
                {section.title}
              </h3>
              <ul className="mt-4 space-y-2">
                {section.links.map((link) => (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      className="text-sm text-dta-char/70 transition-colors duration-200 hover:text-dta-accent"
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

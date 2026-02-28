import Link from "next/link";

export default function JournalFooter() {
  return (
    <footer className="bg-dta-dark py-8 text-white">
      <div className="mx-auto flex max-w-7xl flex-col items-center gap-4 px-4 sm:flex-row sm:justify-between sm:px-6 lg:px-8">
        {/* Left: Copyright */}
        <p className="text-center text-xs leading-relaxed text-dta-sand sm:text-left">
          &copy; 2026 L&apos;Afrop&eacute;en &mdash; Un m&eacute;dia
          DreamTeamAfrica &middot; 1 article/jour &middot; Cycle de vie :
          21 jours + archives
        </p>

        {/* Right: Links */}
        <nav
          aria-label="Liens l\u00e9gaux"
          className="flex items-center gap-4"
        >
          <Link
            href="/mentions-legales"
            className="text-xs text-dta-sand transition-colors hover:text-white"
          >
            Mentions l&eacute;gales
          </Link>
          <Link
            href="/ads"
            className="text-xs text-dta-sand transition-colors hover:text-white"
          >
            Publicit&eacute; (DTA ADS)
          </Link>
          <Link
            href="/contact"
            className="text-xs text-dta-sand transition-colors hover:text-white"
          >
            Contact
          </Link>
        </nav>
      </div>
    </footer>
  );
}

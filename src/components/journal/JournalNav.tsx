"use client";

import Link from "next/link";
import { useState } from "react";
import { Menu, X, Search } from "lucide-react";

const categories = [
  { label: "Actualit\u00e9s", cat: "ACTUALITE" },
  { label: "Culture", cat: "CULTURE" },
  { label: "Diaspora", cat: "DIASPORA" },
  { label: "Business", cat: "BUSINESS" },
  { label: "Lifestyle", cat: "LIFESTYLE" },
  { label: "Opinion", cat: "OPINION" },
];

export default function JournalNav() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [searchValue, setSearchValue] = useState("");

  return (
    <nav
      aria-label="Navigation du journal"
      className="sticky top-0 z-40 border-b border-dta-sand/50 bg-white/90 backdrop-blur-lg"
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-14 items-center justify-between gap-4">
          {/* Logo */}
          <Link href="/journal" className="flex items-center gap-2 shrink-0">
            <span className="font-serif text-xl font-bold text-dta-dark">
              L&apos;Afro<em className="text-dta-accent">p&eacute;en</em>
            </span>
            <span className="hidden text-xs text-dta-taupe sm:inline">
              | par DreamTeamAfrica
            </span>
          </Link>

          {/* Desktop category links */}
          <div className="hidden items-center gap-5 lg:flex">
            {categories.map((c) => (
              <Link
                key={c.cat}
                href={`/journal?cat=${c.cat}`}
                className="j-nav-link text-sm font-medium text-dta-char transition-colors hover:text-dta-accent"
              >
                {c.label}
              </Link>
            ))}
            <Link
              href="/journal/archives"
              className="j-nav-link text-sm font-medium text-dta-char transition-colors hover:text-dta-accent"
            >
              Archives
            </Link>
          </div>

          {/* Desktop search + subscribe */}
          <div className="hidden items-center gap-3 lg:flex">
            <div className="relative">
              <Search
                size={14}
                className="absolute left-2.5 top-1/2 -translate-y-1/2 text-dta-taupe"
              />
              <input
                type="search"
                placeholder="Rechercher..."
                value={searchValue}
                onChange={(e) => setSearchValue(e.target.value)}
                className="w-[180px] rounded-[var(--radius-input)] border border-dta-sand bg-dta-beige py-1.5 pl-8 pr-3 text-sm text-dta-dark placeholder:text-dta-taupe focus:border-dta-accent focus:outline-none"
              />
            </div>
            <Link
              href="/journal#newsletter"
              className="rounded-[var(--radius-button)] bg-dta-dark px-4 py-1.5 text-sm font-medium text-white transition-colors hover:bg-dta-accent"
            >
              S&apos;abonner
            </Link>
          </div>

          {/* Mobile: subscribe + hamburger */}
          <div className="flex items-center gap-2 lg:hidden">
            <Link
              href="/journal#newsletter"
              className="rounded-[var(--radius-button)] bg-dta-dark px-3 py-1.5 text-xs font-medium text-white transition-colors hover:bg-dta-accent"
            >
              S&apos;abonner
            </Link>
            <button
              onClick={() => setMobileOpen(!mobileOpen)}
              aria-expanded={mobileOpen}
              aria-label={mobileOpen ? "Fermer le menu" : "Ouvrir le menu"}
              className="rounded-[var(--radius-button)] p-2 text-dta-char"
            >
              {mobileOpen ? <X size={20} /> : <Menu size={20} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      {mobileOpen && (
        <div className="border-t border-dta-sand/50 bg-white px-4 pb-4 pt-2 lg:hidden">
          {categories.map((c) => (
            <Link
              key={c.cat}
              href={`/journal?cat=${c.cat}`}
              onClick={() => setMobileOpen(false)}
              className="block rounded-[var(--radius-button)] px-3 py-2.5 text-sm font-medium text-dta-char transition-colors hover:bg-dta-sand/30"
            >
              {c.label}
            </Link>
          ))}
          <Link
            href="/journal/archives"
            onClick={() => setMobileOpen(false)}
            className="block rounded-[var(--radius-button)] px-3 py-2.5 text-sm font-medium text-dta-char transition-colors hover:bg-dta-sand/30"
          >
            Archives
          </Link>
          <div className="mt-3 border-t border-dta-sand/50 pt-3">
            <div className="relative">
              <Search
                size={14}
                className="absolute left-2.5 top-1/2 -translate-y-1/2 text-dta-taupe"
              />
              <input
                type="search"
                placeholder="Rechercher..."
                value={searchValue}
                onChange={(e) => setSearchValue(e.target.value)}
                className="w-full rounded-[var(--radius-input)] border border-dta-sand bg-dta-beige py-2 pl-8 pr-3 text-sm text-dta-dark placeholder:text-dta-taupe focus:border-dta-accent focus:outline-none"
              />
            </div>
          </div>
        </div>
      )}
    </nav>
  );
}

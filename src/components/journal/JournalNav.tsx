"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState, useEffect, useRef, useCallback } from "react";
import { Menu, X, Search } from "lucide-react";

const categories = [
  { label: "Actualit\u00e9s", cat: "ACTUALITE" },
  { label: "Culture", cat: "CULTURE" },
  { label: "Diaspora", cat: "DIASPORA" },
  { label: "Business", cat: "BUSINESS" },
  { label: "Lifestyle", cat: "LIFESTYLE" },
  { label: "Opinion", cat: "OPINION" },
];

interface SearchResult {
  slug: string;
  title: string;
  excerpt: string;
  category: string;
  publishedAt: string;
  author: { name: string | null };
}

function useDebounce(value: string, delay: number) {
  const [debounced, setDebounced] = useState(value);
  useEffect(() => {
    const timer = setTimeout(() => setDebounced(value), delay);
    return () => clearTimeout(timer);
  }, [value, delay]);
  return debounced;
}

function SearchDropdown({
  query,
  onClose,
  inputRef,
}: {
  query: string;
  onClose: () => void;
  inputRef: React.RefObject<HTMLInputElement | null>;
}) {
  const router = useRouter();
  const [results, setResults] = useState<SearchResult[]>([]);
  const [loading, setLoading] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const debouncedQuery = useDebounce(query, 300);

  useEffect(() => {
    if (!debouncedQuery || debouncedQuery.length < 2) {
      setResults([]);
      return;
    }
    setLoading(true);
    fetch(`/api/journal/search?q=${encodeURIComponent(debouncedQuery)}&limit=8`)
      .then((res) => res.json())
      .then((data: SearchResult[]) => {
        if (Array.isArray(data)) setResults(data);
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [debouncedQuery]);

  // Click-outside to close
  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(e.target as Node) &&
        inputRef.current &&
        !inputRef.current.contains(e.target as Node)
      ) {
        onClose();
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [onClose, inputRef]);

  // Keyboard: Enter navigates to first result, Escape closes
  const handleKeyDown = useCallback(
    (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        onClose();
      } else if (e.key === "Enter" && results.length > 0) {
        e.preventDefault();
        router.push(`/journal/${results[0].slug}`);
        onClose();
      }
    },
    [results, router, onClose]
  );

  useEffect(() => {
    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [handleKeyDown]);

  if (!query || query.length < 2) return null;

  return (
    <div
      ref={dropdownRef}
      className="absolute left-0 right-0 top-full z-50 mt-1 max-h-[360px] overflow-y-auto rounded-[var(--radius-card)] border border-dta-sand bg-white shadow-lg"
    >
      {loading && (
        <div className="px-4 py-3 text-sm text-dta-taupe">Recherche...</div>
      )}
      {!loading && results.length === 0 && (
        <div className="px-4 py-3 text-sm text-dta-taupe">
          Aucun r&eacute;sultat pour &laquo;&nbsp;{query}&nbsp;&raquo;
        </div>
      )}
      {results.map((r) => (
        <Link
          key={r.slug}
          href={`/journal/${r.slug}`}
          onClick={onClose}
          className="block border-b border-dta-sand/30 px-4 py-3 transition-colors last:border-0 hover:bg-dta-beige"
        >
          <span className="text-[10px] font-semibold uppercase tracking-wider text-dta-taupe">
            {r.category}
          </span>
          <h4 className="mt-0.5 text-sm font-bold text-dta-dark">
            {r.title}
          </h4>
          <p className="mt-0.5 line-clamp-1 text-xs text-dta-char/60">
            {r.excerpt}
          </p>
        </Link>
      ))}
    </div>
  );
}

export default function JournalNav() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [searchValue, setSearchValue] = useState("");
  const [searchOpen, setSearchOpen] = useState(false);
  const desktopInputRef = useRef<HTMLInputElement>(null);
  const mobileInputRef = useRef<HTMLInputElement>(null);

  const handleSearchChange = (value: string) => {
    setSearchValue(value);
    setSearchOpen(value.length >= 2);
  };

  const closeSearch = useCallback(() => {
    setSearchOpen(false);
  }, []);

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
                ref={desktopInputRef}
                type="search"
                placeholder="Rechercher..."
                value={searchValue}
                onChange={(e) => handleSearchChange(e.target.value)}
                onFocus={() => searchValue.length >= 2 && setSearchOpen(true)}
                className="w-[180px] rounded-[var(--radius-input)] border border-dta-sand bg-dta-beige py-1.5 pl-8 pr-3 text-sm text-dta-dark placeholder:text-dta-taupe focus:border-dta-accent focus:outline-none"
              />
              {searchOpen && (
                <SearchDropdown
                  query={searchValue}
                  onClose={closeSearch}
                  inputRef={desktopInputRef}
                />
              )}
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
                ref={mobileInputRef}
                type="search"
                placeholder="Rechercher..."
                value={searchValue}
                onChange={(e) => handleSearchChange(e.target.value)}
                onFocus={() => searchValue.length >= 2 && setSearchOpen(true)}
                className="w-full rounded-[var(--radius-input)] border border-dta-sand bg-dta-beige py-2 pl-8 pr-3 text-sm text-dta-dark placeholder:text-dta-taupe focus:border-dta-accent focus:outline-none"
              />
              {searchOpen && (
                <SearchDropdown
                  query={searchValue}
                  onClose={closeSearch}
                  inputRef={mobileInputRef}
                />
              )}
            </div>
          </div>
        </div>
      )}
    </nav>
  );
}

"use client";

import Link from "next/link";
import Image from "next/image";
import { useState } from "react";
import { Menu, X, User, ShoppingBag } from "lucide-react";
import { useSession, signOut } from "next-auth/react";
import { useCartStore } from "@/stores/cart";

const navLinks = [
  { href: "/evenements", label: "Événements" },
  { href: "/marketplace", label: "Marketplace" },
  { href: "/journal", label: "L'Afropéen" },
  { href: "/ads", label: "DTA Ads" },
  { href: "/officiel-afrique", label: "L'Officiel" },
];

export default function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const { data: session } = useSession();
  const cartCount = useCartStore((s) => s.totalItems());

  return (
    <nav aria-label="Navigation principale" className="sticky top-0 z-50 bg-dta-bg/80 backdrop-blur-md shadow-[var(--shadow-nav)]">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2">
            <Image
              src="/logo-dta.png"
              alt="Dream Team Africa"
              width={40}
              height={40}
              className="h-10 w-10"
              priority
            />
            <span className="hidden font-serif text-lg font-bold text-dta-dark sm:block">
              Dream Team Africa
            </span>
          </Link>

          {/* Desktop nav */}
          <div className="hidden items-center gap-8 md:flex">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="text-sm font-medium text-dta-char transition-colors duration-200 hover:text-dta-accent"
              >
                {link.label}
              </Link>
            ))}
          </div>

          {/* Desktop actions */}
          <div className="hidden items-center gap-4 md:flex">
            <Link
              href="/cart"
              aria-label={`Panier${cartCount > 0 ? ` (${cartCount} article${cartCount > 1 ? "s" : ""})` : ""}`}
              className="relative rounded-[var(--radius-button)] p-2 text-dta-char transition-colors hover:bg-dta-sand/50"
            >
              <ShoppingBag size={20} />
              {cartCount > 0 && (
                <span className="absolute -right-1 -top-1 flex h-4 w-4 items-center justify-center rounded-full bg-dta-accent text-[10px] font-bold text-white">
                  {cartCount}
                </span>
              )}
            </Link>

            {session ? (
              <div className="flex items-center gap-3">
                <Link
                  href="/dashboard"
                  className="flex items-center gap-2 rounded-[var(--radius-button)] px-4 py-2 text-sm font-medium text-dta-char transition-colors hover:bg-dta-sand/50"
                >
                  <User size={16} />
                  {session.user?.name?.split(" ")[0] || "Mon compte"}
                </Link>
                <button
                  onClick={() => signOut()}
                  className="rounded-[var(--radius-button)] px-4 py-2 text-sm font-medium text-dta-taupe transition-colors hover:text-dta-accent"
                >
                  Déconnexion
                </button>
              </div>
            ) : (
              <Link
                href="/auth/signin"
                className="rounded-[var(--radius-button)] bg-dta-accent px-5 py-2 text-sm font-medium text-white transition-colors duration-200 hover:bg-dta-accent-dark"
              >
                Connexion
              </Link>
            )}
          </div>

          {/* Mobile hamburger */}
          <button
            onClick={() => setMobileOpen(!mobileOpen)}
            aria-expanded={mobileOpen}
            aria-label={mobileOpen ? "Fermer le menu" : "Ouvrir le menu"}
            className="rounded-[var(--radius-button)] p-2 text-dta-char md:hidden"
          >
            {mobileOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      {mobileOpen && (
        <div className="border-t border-dta-sand/50 bg-dta-bg px-4 pb-4 pt-2 md:hidden">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              onClick={() => setMobileOpen(false)}
              className="block rounded-[var(--radius-button)] px-3 py-3 text-sm font-medium text-dta-char transition-colors hover:bg-dta-sand/30"
            >
              {link.label}
            </Link>
          ))}
          <div className="mt-3 border-t border-dta-sand/50 pt-3">
            {session ? (
              <>
                <Link
                  href="/dashboard"
                  onClick={() => setMobileOpen(false)}
                  className="block rounded-[var(--radius-button)] px-3 py-3 text-sm font-medium text-dta-char"
                >
                  Mon compte
                </Link>
                <button
                  onClick={() => {
                    signOut();
                    setMobileOpen(false);
                  }}
                  className="block w-full rounded-[var(--radius-button)] px-3 py-3 text-left text-sm font-medium text-dta-taupe"
                >
                  Déconnexion
                </button>
              </>
            ) : (
              <Link
                href="/auth/signin"
                onClick={() => setMobileOpen(false)}
                className="block rounded-[var(--radius-button)] bg-dta-accent px-3 py-3 text-center text-sm font-medium text-white"
              >
                Connexion
              </Link>
            )}
          </div>
        </div>
      )}
    </nav>
  );
}

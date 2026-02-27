import Link from "next/link";

export default function NotFound() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-dta-bg px-4 font-sans text-center text-dta-dark">
      <p className="text-6xl font-bold text-dta-accent">404</p>
      <h1 className="mt-4 font-serif text-3xl font-bold text-dta-dark">
        Page introuvable
      </h1>
      <p className="mt-3 max-w-md text-dta-char/70">
        La page que vous recherchez n&apos;existe pas ou a été déplacée.
      </p>
      <Link
        href="/"
        className="mt-8 rounded-[var(--radius-button)] bg-dta-accent px-6 py-3 text-sm font-semibold text-white hover:bg-dta-accent-dark"
      >
        Retour à l&apos;accueil
      </Link>
    </div>
  );
}

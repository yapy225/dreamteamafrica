import Link from "next/link";
import { Heart, ArrowLeft } from "lucide-react";

export const metadata = { title: "Merci pour votre don" };

export default function MerciPage() {
  return (
    <div className="flex min-h-[70vh] flex-col items-center justify-center px-4 text-center">
      <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-red-100">
        <Heart size={40} className="text-red-500" />
      </div>
      <h1 className="mt-6 font-serif text-3xl font-bold text-dta-dark">
        Merci pour votre g&eacute;n&eacute;rosit&eacute; !
      </h1>
      <p className="mx-auto mt-4 max-w-md text-sm leading-relaxed text-dta-char/70">
        Votre don contribue directement &agrave; la promotion de la culture
        africaine &agrave; Paris. Gr&acirc;ce &agrave; vous, nous pouvons
        organiser des &eacute;v&eacute;nements, soutenir les artisans et faire
        vivre notre communaut&eacute;.
      </p>
      <Link
        href="/"
        className="mt-8 inline-flex items-center gap-2 rounded-[var(--radius-button)] bg-dta-accent px-6 py-3 text-sm font-semibold text-white transition-colors hover:bg-dta-accent-dark"
      >
        <ArrowLeft size={14} />
        Retour &agrave; l&apos;accueil
      </Link>
    </div>
  );
}

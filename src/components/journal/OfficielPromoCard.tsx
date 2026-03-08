import Link from "next/link";
import { BookOpen, Users, ArrowRight, Building2 } from "lucide-react";

interface OfficielPromoCardProps {
  variant?: "inscription" | "annuaire";
  entryCount?: number;
}

export default function OfficielPromoCard({
  variant = "inscription",
  entryCount,
}: OfficielPromoCardProps) {
  if (variant === "annuaire") {
    return (
      <div className="not-prose my-10 overflow-hidden rounded-[var(--radius-card)] border border-[#8B6F4E]/20 bg-gradient-to-br from-[#8B6F4E]/5 via-white to-dta-beige shadow-[var(--shadow-card)]">
        <div className="flex items-center gap-2 bg-[#8B6F4E]/10 px-5 py-2.5">
          <BookOpen size={14} className="text-[#8B6F4E]" />
          <span className="text-xs font-semibold uppercase tracking-wider text-[#8B6F4E]">
            L&apos;Officiel d&apos;Afrique 2026
          </span>
        </div>

        <div className="p-5 sm:p-6">
          <div className="flex items-start gap-4">
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-[#8B6F4E]/10">
              <Users size={22} className="text-[#8B6F4E]" />
            </div>
            <div>
              <h3 className="font-serif text-xl font-bold text-dta-dark">
                Consultez l&apos;annuaire de la diaspora africaine
              </h3>
              <p className="mt-2 text-sm leading-relaxed text-dta-char/70">
                Trouvez des entreprises, artisans, artistes et professionnels africains en France.
                {entryCount && entryCount > 0 && (
                  <> <strong className="text-[#8B6F4E]">{entryCount}+ entreprises</strong> déjà référencées.</>
                )}
              </p>
            </div>
          </div>

          <div className="mt-4 flex flex-wrap gap-3">
            <Link
              href="/lofficiel-dafrique/annuaire"
              className="inline-flex items-center gap-2 rounded-[var(--radius-button)] bg-[#8B6F4E] px-5 py-2.5 text-sm font-semibold text-white transition-all hover:bg-[#73593D] hover:shadow-md"
            >
              Consulter l&apos;annuaire
              <ArrowRight size={14} />
            </Link>
            <Link
              href="/lofficiel-dafrique#inscription"
              className="inline-flex items-center gap-2 rounded-[var(--radius-button)] border border-[#8B6F4E]/30 px-5 py-2.5 text-sm font-semibold text-[#8B6F4E] transition-all hover:bg-[#8B6F4E]/5"
            >
              Inscrire mon entreprise
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="not-prose my-10 overflow-hidden rounded-[var(--radius-card)] border border-[#8B6F4E]/20 bg-gradient-to-br from-[#8B6F4E]/5 via-white to-dta-beige shadow-[var(--shadow-card)]">
      <div className="flex items-center gap-2 bg-[#8B6F4E]/10 px-5 py-2.5">
        <BookOpen size={14} className="text-[#8B6F4E]" />
        <span className="text-xs font-semibold uppercase tracking-wider text-[#8B6F4E]">
          L&apos;Officiel d&apos;Afrique 2026
        </span>
      </div>

      <div className="p-5 sm:p-6">
        <div className="flex items-start gap-4">
          <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-[#8B6F4E]/10">
            <Building2 size={22} className="text-[#8B6F4E]" />
          </div>
          <div>
            <h3 className="font-serif text-xl font-bold text-dta-dark">
              Référencez votre entreprise gratuitement
            </h3>
            <p className="mt-2 text-sm leading-relaxed text-dta-char/70">
              Rejoignez l&apos;annuaire des professionnels et entreprises de la diaspora africaine en France.
              Inscription 100% gratuite — visibilité garantie auprès de la communauté.
            </p>
          </div>
        </div>

        <div className="mt-4 flex flex-wrap gap-3">
          <Link
            href="/lofficiel-dafrique#inscription"
            className="inline-flex items-center gap-2 rounded-[var(--radius-button)] bg-[#8B6F4E] px-5 py-2.5 text-sm font-semibold text-white transition-all hover:bg-[#73593D] hover:shadow-md"
          >
            S&apos;inscrire gratuitement
            <ArrowRight size={14} />
          </Link>
          <Link
            href="/lofficiel-dafrique/annuaire"
            className="inline-flex items-center gap-2 rounded-[var(--radius-button)] border border-[#8B6F4E]/30 px-5 py-2.5 text-sm font-semibold text-[#8B6F4E] transition-all hover:bg-[#8B6F4E]/5"
          >
            Voir l&apos;annuaire
          </Link>
        </div>
      </div>
    </div>
  );
}

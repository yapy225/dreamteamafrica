"use client";

import { useEffect, useRef, useState } from "react";
import { Star } from "lucide-react";

const testimonials = [
  {
    name: "Sophie Mbemba",
    role: "Éducatrice spécialisée",
    title: "Un rendez-vous à ne pas manquer avant les vacances !",
    text: "Merci à vous tous à Fontenay pour cette belle initiative ! Quel bonheur d'avoir un événement comme celui-ci le dernier week-end avant les vacances. C'est exactement ce qu'il nous faut pour finir la saison en beauté, tous ensemble. Hâte d'y être et de découvrir les artistes sur scène. On sera là !",
    rating: 5,
  },
  {
    name: "Amadou Diallo",
    role: "Responsable associatif",
    title: "Fontenay, terre de culture et de partage",
    text: "Un grand merci à la ville de Fontenay-sous-Bois pour son soutien formidable à la culture et à la diversité. C'est rare de voir une municipalité s'engager autant pour ce type de projet interculturel. Cette première édition promet d'être magnifique. Bravo aux organisateurs, on a besoin de ces espaces de rencontre et de transmission.",
    rating: 5,
  },
  {
    name: "Nathalie Kouassi",
    role: "Infirmière libérale",
    title: "Un festival pour toute la famille ?",
    text: "Bonjour ! Je viens de découvrir le festival et j'adore le concept. Petite question : est-ce qu'on peut venir avec les enfants ? J'ai deux petits de 5 et 8 ans et j'aimerais beaucoup leur faire découvrir les danses traditionnelles et l'artisanat. Si c'est adapté aux familles, on sera au rendez-vous avec plaisir. Vivement cette première édition !",
    rating: 5,
  },
];

function StarRating({ rating }: { rating: number }) {
  return (
    <div className="flex gap-0.5">
      {Array.from({ length: 5 }).map((_, i) => (
        <Star
          key={i}
          className={`h-4 w-4 ${
            i < rating
              ? "fill-dta-accent text-dta-accent"
              : "fill-dta-sand text-dta-sand"
          }`}
        />
      ))}
    </div>
  );
}

function getInitials(name: string) {
  return name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase();
}

export default function Testimonials() {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true);
          observer.disconnect();
        }
      },
      { threshold: 0.1 }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return (
    <section ref={ref} className="bg-dta-beige py-20">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-12 text-center">
          <div className="mx-auto mb-4 h-px w-16 bg-dta-accent" />
          <h2 className="font-serif text-3xl font-bold text-dta-dark sm:text-4xl">
            🎭 Ce que nos visiteurs en disent
          </h2>
          <p className="mt-3 text-sm font-medium text-dta-accent">
            Festival de l&apos;Autre Culture – 1ère Édition
          </p>
        </div>

        {/* Grid */}
        <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
          {testimonials.map((t, i) => (
            <div
              key={t.name}
              className={`rounded-[var(--radius-card)] border border-dta-sand/50 bg-white p-6 shadow-[var(--shadow-card)] transition-all duration-700 hover:shadow-[var(--shadow-card-hover)] ${
                visible
                  ? "translate-y-0 opacity-100"
                  : "translate-y-8 opacity-0"
              }`}
              style={{ transitionDelay: `${i * 150}ms` }}
            >
              <div className="mb-3 flex items-center gap-3">
                {/* Avatar placeholder */}
                <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-dta-accent text-sm font-semibold text-white">
                  {getInitials(t.name)}
                </div>
                <div>
                  <p className="text-sm font-semibold text-dta-dark">
                    {t.name}
                  </p>
                  <p className="text-xs text-dta-taupe">{t.role}</p>
                  <StarRating rating={t.rating} />
                </div>
              </div>
              <h3 className="mb-2 text-sm font-semibold text-dta-dark">
                {t.title}
              </h3>
              <p className="text-sm leading-relaxed text-dta-char/80">
                &ldquo;{t.text}&rdquo;
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

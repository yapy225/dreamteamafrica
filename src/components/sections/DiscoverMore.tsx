import Link from "next/link";
import { Calendar, ShoppingBag, Newspaper, Building2, ArrowRight } from "lucide-react";

const allProjects = [
  {
    id: "evenements",
    href: "/saison-culturelle-africaine",
    label: "Événements",
    description: "Festivals, concerts et rencontres culturelles à Paris",
    icon: Calendar,
    color: "bg-blue-100 text-blue-600",
  },
  {
    id: "marketplace",
    href: "/made-in-africa",
    label: "Marketplace",
    description: "Artisanat africain authentique — mode, déco, bijoux",
    icon: ShoppingBag,
    color: "bg-emerald-100 text-emerald-600",
  },
  {
    id: "journal",
    href: "/lafropeen",
    label: "L'Afropéen",
    description: "Le journal de la diaspora africaine en Europe",
    icon: Newspaper,
    color: "bg-amber-100 text-amber-600",
  },
  {
    id: "officiel",
    href: "/lofficiel-dafrique",
    label: "L'Officiel d'Afrique",
    description: "L'annuaire des professionnels africains à Paris",
    icon: Building2,
    color: "bg-purple-100 text-purple-600",
  },
];

interface DiscoverMoreProps {
  exclude?: string;
  title?: string;
}

export default function DiscoverMore({
  exclude,
  title = "Découvrir aussi",
}: DiscoverMoreProps) {
  const projects = allProjects.filter((p) => p.id !== exclude && p.id !== "marketplace");

  return (
    <div className="bg-dta-bg py-16">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <h2 className="text-center font-serif text-2xl font-bold text-dta-dark">
          {title}
        </h2>
        <div className="mt-10 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {projects.map((p) => (
            <Link
              key={p.id}
              href={p.href}
              className="group flex items-start gap-4 rounded-[var(--radius-card)] bg-white p-5 shadow-[var(--shadow-card)] transition-all duration-200 hover:shadow-[var(--shadow-card-hover)] hover:-translate-y-0.5"
            >
              <div
                className={`flex h-11 w-11 flex-shrink-0 items-center justify-center rounded-[var(--radius-button)] ${p.color}`}
              >
                <p.icon size={20} />
              </div>
              <div className="flex-1">
                <p className="font-serif text-sm font-bold text-dta-dark group-hover:text-dta-accent">
                  {p.label}
                </p>
                <p className="mt-1 text-xs leading-relaxed text-dta-char/60">
                  {p.description}
                </p>
              </div>
              <ArrowRight
                size={14}
                className="mt-1 flex-shrink-0 text-dta-taupe opacity-0 transition-opacity group-hover:opacity-100"
              />
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}

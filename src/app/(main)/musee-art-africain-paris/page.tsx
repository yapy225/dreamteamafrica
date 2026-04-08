import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, Landmark, MapPin, Clock, ExternalLink } from "lucide-react";
import { GetYourGuideWidget } from "@/components/affiliate";

export const metadata: Metadata = {
  title: "Musées d'art africain à Paris — Guide complet 2026",
  description:
    "Découvrez les meilleurs musées d'art africain à Paris : quai Branly, Dapper, Louvre, Institut du Monde Arabe. Horaires, tarifs et billets coupe-file.",
  keywords: [
    "musée art africain paris",
    "musée quai branly",
    "art africain paris",
    "exposition africaine paris 2026",
    "musée afrique paris",
    "art contemporain africain paris",
  ],
  alternates: { canonical: "https://dreamteamafrica.com/musee-art-africain-paris" },
};

const MUSEES = [
  {
    name: "Musée du quai Branly — Jacques Chirac",
    desc: "La référence mondiale pour l'art africain, asiatique et océanien. Plus de 300 000 œuvres dont des masques, sculptures et textiles d'Afrique subsaharienne.",
    adresse: "37 quai Branly, Paris 7e",
    horaires: "Mar-Dim 10h30-19h (jeu jusqu'à 22h)",
    tarif: "14 €",
    highlight: "Collection permanente d'art africain",
  },
  {
    name: "Musée du Louvre — Département des Arts de l'Islam",
    desc: "Le plus grand musée du monde abrite une collection remarquable d'arts de l'Islam et d'Afrique du Nord, avec des pièces datant du VIIe au XIXe siècle.",
    adresse: "Rue de Rivoli, Paris 1er",
    horaires: "Lun, Mer-Dim 9h-18h (ven jusqu'à 21h45)",
    tarif: "22 €",
    highlight: "Antiquités égyptiennes & arts de l'Islam",
  },
  {
    name: "Institut du Monde Arabe",
    desc: "Architecture iconique de Jean Nouvel. Expositions temporaires sur les cultures arabes et africaines. Vue panoramique gratuite depuis la terrasse.",
    adresse: "1 rue des Fossés-Saint-Bernard, Paris 5e",
    horaires: "Mar-Dim 10h-18h",
    tarif: "10 €",
    highlight: "Expositions temporaires",
  },
  {
    name: "Musée d'Orsay",
    desc: "Au-delà des impressionnistes, découvrez les regards d'artistes européens sur l'Afrique et les premières œuvres d'art primitif collectées au XIXe siècle.",
    adresse: "1 rue de la Légion d'Honneur, Paris 7e",
    horaires: "Mar-Dim 9h30-18h (jeu jusqu'à 21h45)",
    tarif: "16 €",
    highlight: "Art & regards sur l'Afrique au XIXe",
  },
];

export default function MuseeArtAfricainParis() {
  return (
    <div className="min-h-screen bg-white">
      <section className="bg-gradient-to-b from-dta-beige/60 to-white px-4 pb-12 pt-20 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-dta-accent">
            <Landmark size={16} />
            Musées & expositions
          </div>
          <h1 className="mt-3 font-serif text-3xl font-bold text-dta-dark sm:text-4xl lg:text-5xl">
            Musées d&apos;art africain à Paris
          </h1>
          <p className="mt-4 max-w-2xl text-base leading-relaxed text-dta-char/80">
            Paris est l&apos;une des capitales mondiales de l&apos;art africain. Du{" "}
            <strong>musée du quai Branly</strong> à l&apos;<strong>Institut du Monde Arabe</strong>, en passant par les galeries du Marais, la ville regorge de lieux où admirer l&apos;art du continent. Complétez votre visite avec la{" "}
            <Link href="/saison-culturelle-africaine" className="font-semibold text-dta-accent underline decoration-dta-accent/30 underline-offset-2 hover:decoration-dta-accent">
              Saison Culturelle Africaine 2026
            </Link>{" "}
            et ses 7 événements dédiés à la culture africaine.
          </p>
        </div>
      </section>

      {/* Liste des musées */}
      <section className="bg-white px-4 py-14 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <h2 className="font-serif text-2xl font-bold text-dta-dark">Les incontournables</h2>
          <div className="mt-8 space-y-5">
            {MUSEES.map((m) => (
              <div key={m.name} className="rounded-[var(--radius-card)] border border-dta-sand/40 bg-white p-6 shadow-[var(--shadow-card)]">
                <div className="flex items-start gap-4">
                  <div className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-xl bg-dta-accent/10">
                    <Landmark size={22} className="text-dta-accent" />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-serif text-lg font-bold text-dta-dark">{m.name}</h3>
                    <span className="mt-0.5 inline-block rounded-full bg-dta-accent/10 px-2.5 py-0.5 text-[10px] font-bold text-dta-accent">{m.highlight}</span>
                    <p className="mt-2 text-sm leading-relaxed text-dta-char/70">{m.desc}</p>
                    <div className="mt-3 flex flex-wrap gap-4 text-xs text-dta-taupe">
                      <span className="flex items-center gap-1"><MapPin size={12} />{m.adresse}</span>
                      <span className="flex items-center gap-1"><Clock size={12} />{m.horaires}</span>
                      <span className="font-semibold text-dta-accent-dark">{m.tarif}</span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Lien événements DTA */}
      <section className="bg-dta-beige/30 px-4 py-12 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl text-center">
          <h2 className="font-serif text-2xl font-bold text-dta-dark">L&apos;art africain vivant</h2>
          <p className="mx-auto mt-2 max-w-xl text-sm text-dta-char/70">
            Au-delà des musées, découvrez l&apos;art africain contemporain lors de nos événements : artisans, créateurs et performances live.
          </p>
          <div className="mt-6 flex flex-wrap justify-center gap-3">
            <Link href="/saison-culturelle-africaine/foire-dafrique-paris" className="inline-flex items-center gap-2 rounded-[var(--radius-button)] bg-dta-accent px-6 py-3 text-sm font-semibold text-white transition-colors hover:bg-dta-accent-dark">
              Foire d&apos;Afrique Paris — 1-2 mai
            </Link>
            <Link href="/saison-culturelle-africaine/salon-made-in-africa-2026" className="inline-flex items-center gap-2 rounded-[var(--radius-button)] border border-dta-accent px-6 py-3 text-sm font-semibold text-dta-accent transition-colors hover:bg-dta-accent hover:text-white">
              Salon Made In Africa — 11-12 déc.
            </Link>
          </div>
        </div>
      </section>

      {/* Widget GYG */}
      <div className="bg-white">
        <GetYourGuideWidget
          city="Paris"
          theme="museums"
          title="Réservez vos billets musées — coupe-file"
          subtitle="Gagnez du temps avec les billets coupe-file et les visites guidées."
          maxItems={4}
          utmSource="seo-musee-africain"
          eventName="la Foire d'Afrique Paris"
          eventSlug="foire-dafrique-paris"
        />
      </div>

      {/* Maillage */}
      <section className="bg-dta-bg px-4 py-14 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <h2 className="font-serif text-2xl font-bold text-dta-dark">À découvrir aussi</h2>
          <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {[
              { title: "Que faire à Paris ce weekend ?", href: "/que-faire-paris-ce-weekend", emoji: "🗼" },
              { title: "Danse Zaouli — cours & spectacles", href: "/danse-zaouli-paris", emoji: "💃" },
              { title: "Spectacles africains à Paris", href: "/spectacle-africain-paris", emoji: "🎭" },
              { title: "Marchés africains à Paris", href: "/marche-africain-paris", emoji: "🏪" },
              { title: "Concerts afro à Paris", href: "/concert-afro-paris", emoji: "🎵" },
              { title: "Art contemporain africain", href: "/lafropeen/art-contemporain-africain-marche-mondial", emoji: "🎨" },
            ].map((item) => (
              <Link key={item.href} href={item.href} className="group flex items-center gap-3 rounded-[var(--radius-card)] border border-dta-sand/40 bg-white p-4 transition-all hover:bg-dta-accent/5 hover:shadow-sm">
                <span className="text-2xl">{item.emoji}</span>
                <span className="text-sm font-semibold text-dta-dark transition-colors group-hover:text-dta-accent">{item.title}</span>
                <ArrowRight size={14} className="ml-auto text-dta-taupe group-hover:text-dta-accent" />
              </Link>
            ))}
          </div>
        </div>
      </section>

      <div className="bg-dta-beige/20 px-4 py-6 sm:px-6 lg:px-8">
        <p className="mx-auto max-w-3xl text-center text-xs leading-relaxed text-dta-taupe">
          Cet article contient des liens affiliés GetYourGuide. Dream Team Africa perçoit une commission de 8% sur chaque réservation via ces liens, sans frais supplémentaires pour vous.
        </p>
      </div>
    </div>
  );
}

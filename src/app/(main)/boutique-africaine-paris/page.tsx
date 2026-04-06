import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, ShoppingBag, Palette, Gem, Store, Globe } from "lucide-react";
import { GetYourGuideWidget } from "@/components/affiliate";

export const metadata: Metadata = {
  title: "Boutiques africaines a Paris — mode, deco & artisanat 2026",
  description:
    "Decouvrez les meilleures boutiques africaines a Paris : mode wax, decoration, artisanat, tissu africain. Shopping en ville et en ligne sur Made in Africa.",
  keywords: [
    "boutique africaine paris",
    "magasin africain paris",
    "mode africaine paris",
    "wax paris",
    "tissu africain paris",
    "artisanat africain paris",
  ],
  alternates: { canonical: "https://dreamteamafrica.com/boutique-africaine-paris" },
};

const CATEGORIES = [
  {
    icon: Palette,
    title: "Mode & pret-a-porter wax",
    desc: "Des creatrice.eur.s qui revisitent le wax, le bogolan et les textiles africains en pieces contemporaines. Robes, chemises, accessoires : la mode africaine s'affirme dans les rues de Paris.",
    quartiers: "Chateau-Rouge, Marais, Strasbourg-Saint-Denis",
    tag: "Mode",
  },
  {
    icon: Gem,
    title: "Bijoux & accessoires",
    desc: "Bijoux en perles, boucles d'oreilles en laiton, bracelets en cuir : les artisans africains excellent dans la creation de pieces uniques, entre tradition et modernite.",
    quartiers: "Marais, Bastille, Saint-Germain",
    tag: "Bijoux",
  },
  {
    icon: Store,
    title: "Decoration & artisanat",
    desc: "Masques, sculptures, tissus d'ameublement, vannerie : l'artisanat africain sublime votre interieur. Trouvez des pieces authentiques dans les boutiques specialisees de Paris.",
    quartiers: "Saint-Germain, Chateau-Rouge, Clignancourt",
    tag: "Deco",
  },
  {
    icon: Globe,
    title: "Made in Africa — La marketplace en ligne",
    desc: "Pas le temps de vous deplacer ? La marketplace Made in Africa reunit les produits de nos exposants : mode, deco, cosmetiques, epicerie fine. Livraison dans toute la France.",
    quartiers: "En ligne",
    tag: "Online",
  },
];

export default function BoutiqueAfricaineParis() {
  return (
    <div className="min-h-screen bg-white">
      {/* Hero */}
      <section className="bg-gradient-to-b from-dta-beige/60 to-white px-4 pb-12 pt-20 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-dta-accent">
            <ShoppingBag size={16} />
            Shopping &amp; artisanat
          </div>
          <h1 className="mt-3 font-serif text-3xl font-bold text-dta-dark sm:text-4xl lg:text-5xl">
            Boutiques africaines a Paris — mode, deco &amp; artisanat
          </h1>
          <p className="mt-4 max-w-2xl text-base leading-relaxed text-dta-char/80">
            Paris abrite une scene vibrante de <strong>mode africaine</strong> et d&apos;<strong>artisanat du continent</strong>.
            Du quartier de Chateau-Rouge au Marais, en passant par les foires de Dream Team Africa, decouvrez ou trouver les plus belles pieces. Explorez aussi la{" "}
            <Link href="/made-in-africa" className="font-semibold text-dta-accent underline decoration-dta-accent/30 underline-offset-2 hover:decoration-dta-accent">
              marketplace Made in Africa
            </Link>{" "}
            et rencontrez nos{" "}
            <Link href="/exposants" className="font-semibold text-dta-accent underline decoration-dta-accent/30 underline-offset-2 hover:decoration-dta-accent">
              exposants
            </Link>{" "}
            lors de la{" "}
            <Link href="/saison-culturelle-africaine" className="font-semibold text-dta-accent underline decoration-dta-accent/30 underline-offset-2 hover:decoration-dta-accent">
              Saison Culturelle Africaine 2026
            </Link>
            .
          </p>
        </div>
      </section>

      {/* Categories */}
      <section className="bg-white px-4 py-14 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <h2 className="font-serif text-2xl font-bold text-dta-dark sm:text-3xl">
            Que trouver dans les boutiques africaines de Paris ?
          </h2>
          <div className="mt-8 grid grid-cols-1 gap-5 sm:grid-cols-2">
            {CATEGORIES.map((cat) => (
              <div
                key={cat.title}
                className="rounded-[var(--radius-card)] border border-dta-sand/40 bg-white p-5 shadow-[var(--shadow-card)] transition-all duration-300 hover:-translate-y-0.5 hover:shadow-[var(--shadow-card-hover)]"
              >
                <div className="flex gap-4">
                  <div className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-xl bg-dta-accent/10 text-dta-accent">
                    <cat.icon size={22} />
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2">
                      <h3 className="font-serif text-base font-bold text-dta-dark">{cat.title}</h3>
                      <span className="rounded-full bg-dta-accent/10 px-2.5 py-0.5 text-[10px] font-bold text-dta-accent">{cat.tag}</span>
                    </div>
                    <p className="mt-1 text-sm text-dta-char/70">{cat.desc}</p>
                    <p className="mt-2 text-xs text-dta-taupe">
                      <strong>Ou :</strong> {cat.quartiers}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Foires */}
      <section className="bg-dta-beige/30 px-4 py-12 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl text-center">
          <h2 className="font-serif text-2xl font-bold text-dta-dark">Les foires : le meilleur du shopping africain</h2>
          <p className="mx-auto mt-2 max-w-xl text-sm text-dta-char/70">
            Les foires et salons de la{" "}
            <Link href="/saison-culturelle-africaine" className="font-semibold text-dta-accent hover:underline">
              Saison Culturelle Africaine
            </Link>{" "}
            reunissent des centaines d&apos;exposants. Mode, deco, cosmetiques, epicerie fine : tout le made in Africa en un seul lieu.
          </p>
          <div className="mt-6 flex flex-wrap justify-center gap-3">
            <Link href="/saison-culturelle-africaine/foire-dafrique-paris" className="inline-flex items-center gap-2 rounded-[var(--radius-button)] bg-dta-accent px-6 py-3 text-sm font-semibold text-white transition-colors hover:bg-dta-accent-dark">
              Foire d&apos;Afrique — 1-2 mai
            </Link>
            <Link href="/saison-culturelle-africaine/salon-made-in-africa-2026" className="inline-flex items-center gap-2 rounded-[var(--radius-button)] border border-dta-accent px-6 py-3 text-sm font-semibold text-dta-accent transition-colors hover:bg-dta-accent hover:text-white">
              Salon Made In Africa — 11-12 dec.
            </Link>
            <Link href="/saison-culturelle-africaine/fashion-week-africa" className="inline-flex items-center gap-2 rounded-[var(--radius-button)] border border-dta-accent px-6 py-3 text-sm font-semibold text-dta-accent transition-colors hover:bg-dta-accent hover:text-white">
              Fashion Week Africa — 3 oct.
            </Link>
          </div>
        </div>
      </section>

      {/* Widget GYG */}
      <div className="bg-white">
        <GetYourGuideWidget
          city="Paris"
          theme="fashion"
          title="Shopping & mode a Paris"
          subtitle="Decouvrez les meilleures experiences shopping et les quartiers tendance de la capitale."
          maxItems={4}
          utmSource="seo-boutique-africaine"
          eventName="la Foire d'Afrique Paris"
          eventSlug="foire-dafrique-paris"
        />
      </div>

      {/* Maillage */}
      <section className="bg-dta-bg px-4 py-14 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <h2 className="font-serif text-2xl font-bold text-dta-dark">A decouvrir aussi</h2>
          <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {[
              { title: "Foires & salons a Paris 2026", href: "/foire-paris-2026", emoji: "\uD83D\uDCC5" },
              { title: "Marches africains a Paris", href: "/marche-africain-paris", emoji: "\uD83C\uDFEA" },
              { title: "Made in Africa marketplace", href: "/made-in-africa", emoji: "\uD83C\uDF0D" },
              { title: "Mode ethique : wax vs fast-fashion", href: "/lafropeen/mode-ethique-wax-fast-fashion", emoji: "\uD83E\uDEB5" },
              { title: "Guide visiteur Fashion Week Africa", href: "/lafropeen/guide-visiteur-fashion-week-africa-paris-2026", emoji: "\uD83D\uDC57" },
              { title: "Nos exposants", href: "/exposants", emoji: "\uD83C\uDFAA" },
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

      {/* Disclosure */}
      <div className="bg-dta-beige/20 px-4 py-6 sm:px-6 lg:px-8">
        <p className="mx-auto max-w-3xl text-center text-xs leading-relaxed text-dta-taupe">
          Cet article contient des liens affilies GetYourGuide. Dream Team Africa percoit une commission de 8% sur chaque reservation effectuee via ces liens, sans frais supplementaires pour vous.
        </p>
      </div>
    </div>
  );
}

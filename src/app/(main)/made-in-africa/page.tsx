import Link from "next/link";
import { ArrowRight } from "lucide-react";
import NewsletterSection from "@/components/sections/NewsletterSection";

const siteUrl = process.env.NEXT_PUBLIC_APP_URL || "https://dreamteamafrica.com";

export const metadata = {
  title: "Made in Africa — Marketplace Artisanat & Produits Naturels Africains",
  description:
    "Bientôt : achetez des produits naturels africains en ligne. Beurre de karité, cosmétiques, artisanat, mode, bijoux. Marketplace Dream Team Africa.",
  keywords: [
    "produits naturels africains",
    "artisanat africain en ligne",
    "beurre de karité pur africain",
    "cosmétiques naturels africains",
    "boutique produits africains en ligne",
    "marketplace africaine Paris",
  ],
  openGraph: {
    title: "Made in Africa — Artisanat & Produits Naturels Africains",
    description:
      "Bientôt : la marketplace de produits naturels et d'artisanat africain authentique.",
    type: "website",
    url: `${siteUrl}/made-in-africa`,
    images: [{ url: `${siteUrl}/foire-afrique.jpg`, width: 1200, height: 630 }],
  },
  alternates: {
    canonical: `${siteUrl}/made-in-africa`,
  },
};

const CATEGORIES = [
  { emoji: "🧴", label: "Cosmétiques naturels" },
  { emoji: "👗", label: "Mode africaine" },
  { emoji: "💎", label: "Bijoux" },
  { emoji: "🎨", label: "Artisanat" },
  { emoji: "🍯", label: "Épicerie fine" },
  { emoji: "🏺", label: "Décoration" },
];

export default function MadeInAfricaPage() {
  return (
    <div>
      {/* Hero */}
      <section className="relative bg-[#0A0A0A] px-4 py-28 sm:py-36">
        <div className="mx-auto max-w-3xl text-center">
          <span className="inline-block rounded-full bg-[#16A34A]/20 px-5 py-2 text-xs font-semibold uppercase tracking-wider text-[#16A34A] mb-6">
            Bient&ocirc;t disponible
          </span>
          <h1 className="font-serif text-5xl font-bold text-white sm:text-6xl">
            Made In Africa
          </h1>
          <p className="mt-6 font-serif text-xl italic text-white/60 leading-relaxed">
            Produits naturels &amp; artisanat africain authentique.
            La marketplace de Dream Team Africa arrive bient&ocirc;t.
          </p>
        </div>
      </section>

      {/* Catégories */}
      <section className="bg-dta-bg px-4 py-16">
        <div className="mx-auto max-w-4xl">
          <h2 className="text-center font-serif text-2xl font-bold text-dta-dark mb-10">
            Ce qui arrive
          </h2>
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-6">
            {CATEGORIES.map((cat) => (
              <div
                key={cat.label}
                className="rounded-2xl border border-dta-sand bg-white p-5 text-center transition-all hover:-translate-y-1 hover:shadow-md"
              >
                <span className="block text-3xl mb-2">{cat.emoji}</span>
                <p className="text-xs font-semibold text-dta-dark">
                  {cat.label}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Inscription */}
      <section className="bg-white px-4 py-16">
        <div className="mx-auto max-w-lg text-center">
          <h2 className="font-serif text-2xl font-bold text-dta-dark mb-3">
            Soyez les premiers inform&eacute;s
          </h2>
          <p className="text-sm text-dta-char/70 mb-8">
            Inscrivez-vous &agrave; notre newsletter pour &ecirc;tre
            pr&eacute;venu du lancement de Made In Africa.
          </p>
          <NewsletterSection />
        </div>
      </section>

      {/* CTA Artisans */}
      <section className="bg-[#0A0A0A] px-4 py-16">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="font-serif text-2xl font-bold text-white mb-3">
            Vous &ecirc;tes artisan ou producteur ?
          </h2>
          <p className="text-sm text-white/60 mb-8">
            Vendez vos cr&eacute;ations sur Made In Africa.
            Rejoignez notre r&eacute;seau d&apos;artisans et touchez
            des milliers de clients en France et en Europe.
          </p>
          <a
            href="mailto:hello@dreamteamafrica.com?subject=Candidature%20artisan%20Made%20In%20Africa"
            className="inline-flex items-center gap-2 rounded-full bg-[#16A34A] px-8 py-4 text-sm font-semibold text-white transition-all hover:bg-[#15803d]"
          >
            Proposer mes produits
            <ArrowRight size={16} />
          </a>
        </div>
      </section>

      {/* Lien vers exposants */}
      <section className="bg-dta-beige px-4 py-12">
        <div className="mx-auto max-w-2xl text-center">
          <p className="text-sm text-dta-char/70 mb-4">
            En attendant, d&eacute;couvrez nos exposants &agrave; la Foire
            d&apos;Afrique Paris &mdash; 1er &amp; 2 mai 2026
          </p>
          <Link
            href="/saison-culturelle-africaine/foire-dafrique-paris"
            className="inline-flex items-center gap-2 rounded-full border border-dta-accent px-6 py-3 text-sm font-semibold text-dta-accent transition-all hover:bg-dta-accent hover:text-white"
          >
            Voir les &eacute;v&eacute;nements
            <ArrowRight size={14} />
          </Link>
        </div>
      </section>
    </div>
  );
}

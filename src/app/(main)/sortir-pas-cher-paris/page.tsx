import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, PiggyBank, Ticket, Music, Sparkles, MapPin } from "lucide-react";

export const metadata: Metadata = {
  title: "Sortir pas cher à Paris — Événements culturels dès 5€ | 2026",
  description:
    "Sortir à Paris sans se ruiner ? Découvrez les événements culturels africains dès 5€ avec Culture pour Tous. Foires, spectacles, concerts — réservez et payez à votre rythme.",
  keywords: [
    "sortir pas cher paris",
    "bon plan sortie paris",
    "événement pas cher paris",
    "sortie culturelle paris pas cher",
    "billet 5 euros paris",
    "culture pour tous paris",
    "foire africaine paris",
    "concert pas cher paris 2026",
  ],
  openGraph: {
    title: "Sortir pas cher à Paris — Dès 5€ avec Culture pour Tous",
    description: "Événements culturels africains à Paris dès 5€. Réservez et payez à votre rythme.",
    url: "https://dreamteamafrica.com/sortir-pas-cher-paris",
    siteName: "Dream Team Africa",
    type: "website",
    locale: "fr_FR",
  },
  alternates: { canonical: "https://dreamteamafrica.com/sortir-pas-cher-paris" },
};

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "WebPage",
  name: "Sortir pas cher à Paris — Événements culturels dès 5€",
  description: "Découvrez les événements culturels africains à Paris dès 5€ avec le programme Culture pour Tous.",
  url: "https://dreamteamafrica.com/sortir-pas-cher-paris",
  publisher: { "@type": "Organization", name: "Dream Team Africa", url: "https://dreamteamafrica.com" },
};

const BONS_PLANS = [
  { icon: Music, title: "Concerts & musique live", desc: "Afrobeat, rumba, jazz mandingue — des concerts à prix accessible toute l'année à Paris." },
  { icon: Ticket, title: "Foires & marchés africains", desc: "Mode, artisanat, gastronomie — la Foire d'Afrique et le Salon Made in Africa dès 5€." },
  { icon: Sparkles, title: "Spectacles & danse", desc: "Danse contemporaine africaine, contes, théâtre — des spectacles vibrants dès 5€." },
  { icon: MapPin, title: "Événements gratuits", desc: "Certains de nos événements sont 100% gratuits. Réservez votre place en ligne." },
];

export default function SortirPasCherParis() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />

      <div className="mx-auto max-w-4xl px-4 py-12 sm:px-6 lg:px-8">
        {/* Hero */}
        <header className="mb-14 text-center">
          <div className="inline-flex items-center gap-2 rounded-full bg-green-100 px-4 py-1.5 text-xs font-bold text-green-700">
            <PiggyBank size={14} />
            Bons plans Paris
          </div>
          <h1 className="mt-4 font-serif text-4xl font-bold leading-tight text-dta-dark sm:text-5xl">
            Sortir pas cher à Paris
          </h1>
          <p className="mt-4 text-lg text-dta-char/70">
            Des événements culturels africains <strong className="text-dta-dark">dès 5&nbsp;&euro;</strong>.<br />
            Réservez maintenant, payez à votre rythme avec{" "}
            <Link href="/culture-pour-tous" className="font-semibold text-green-700 underline underline-offset-2 hover:text-green-900">
              Culture pour Tous
            </Link>.
          </p>
        </header>

        {/* Bons plans */}
        <section className="mb-14">
          <h2 className="mb-8 text-center font-serif text-2xl font-bold text-dta-dark">
            Nos bons plans sorties à Paris
          </h2>
          <div className="grid gap-5 sm:grid-cols-2">
            {BONS_PLANS.map((bp) => (
              <div key={bp.title} className="rounded-2xl border border-dta-sand bg-white p-6">
                <bp.icon size={24} className="text-dta-accent" />
                <h3 className="mt-3 font-serif text-lg font-bold text-dta-dark">{bp.title}</h3>
                <p className="mt-1 text-sm leading-relaxed text-dta-char/70">{bp.desc}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Culture pour Tous */}
        <section className="mb-14 rounded-2xl bg-green-50 border border-green-200 p-8">
          <div className="text-center">
            <h2 className="font-serif text-2xl font-bold text-green-800">
              Culture pour Tous — Le bon plan billetterie
            </h2>
            <p className="mt-3 text-sm text-green-700 max-w-xl mx-auto">
              Réservez votre place pour seulement 5&nbsp;&euro; et rechargez à votre rythme.
              Pas de calendrier imposé, pas de prélèvement automatique.
              Le prix est garanti au moment de la réservation.
            </p>
            <div className="mt-6 flex flex-wrap justify-center gap-3">
              <Link href="/saison-culturelle-africaine" className="inline-flex items-center gap-2 rounded-xl bg-green-600 px-6 py-3 text-sm font-bold text-white hover:bg-green-700">
                Voir les événements <ArrowRight size={14} />
              </Link>
              <Link href="/culture-pour-tous" className="inline-flex items-center gap-2 rounded-xl border border-green-300 px-6 py-3 text-sm font-semibold text-green-700 hover:bg-green-100">
                Comment ça marche ?
              </Link>
            </div>
          </div>
        </section>

        {/* SEO text */}
        <section className="mb-14 prose prose-sm max-w-none text-dta-char/70">
          <h2 className="font-serif text-xl font-bold text-dta-dark">Sortir à Paris sans se ruiner en 2026</h2>
          <p>
            Paris regorge de sorties culturelles accessibles. Avec Dream Team Africa, découvrez la richesse de la culture africaine
            à travers des événements uniques&nbsp;: la <strong>Foire d&apos;Afrique</strong>, le <strong>Salon Made in Africa</strong>,
            <strong>Évasion Paris</strong>, <strong>Juste une Danse</strong> et bien d&apos;autres.
          </p>
          <p>
            Grâce au programme <strong>Culture pour Tous</strong>, chaque événement est accessible dès 5&nbsp;&euro;.
            Vous réservez votre place, vous recevez votre billet, et vous rechargez quand vous voulez.
            C&apos;est le bon plan idéal pour sortir à Paris sans se ruiner.
          </p>
          <p>
            Que vous cherchiez un <strong>concert pas cher à Paris</strong>, une <strong>sortie culturelle en famille</strong>,
            ou un <strong>événement africain ce week-end</strong>, notre saison culturelle a quelque chose pour vous.
          </p>
        </section>

        {/* CTA */}
        <div className="text-center">
          <Link href="/saison-culturelle-africaine" className="inline-block rounded-xl bg-dta-accent px-8 py-4 text-lg font-bold text-white hover:bg-dta-accent-dark">
            Découvrir les événements
          </Link>
        </div>
      </div>
    </>
  );
}

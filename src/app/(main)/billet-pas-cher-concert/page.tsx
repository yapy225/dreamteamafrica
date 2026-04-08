import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, Ticket, Music, CreditCard, CheckCircle } from "lucide-react";

export const metadata: Metadata = {
  title: "Billets pas cher — Concerts & spectacles à Paris dès 5€ | 2026",
  description:
    "Billets de concerts et spectacles à Paris pas cher. Réservez dès 5€ avec Culture pour Tous et payez à votre rythme. Afrobeat, danse, foires culturelles.",
  keywords: [
    "billet pas cher concert",
    "billet concert paris pas cher",
    "place pas cher spectacle paris",
    "billet 5 euros concert",
    "concert afro paris",
    "billet spectacle danse paris",
    "billetterie pas cher paris",
    "réserver concert pas cher",
  ],
  openGraph: {
    title: "Billets pas cher — Concerts & spectacles dès 5€",
    description: "Réservez vos places de concert et spectacle à Paris dès 5€. Payez à votre rythme.",
    url: "https://dreamteamafrica.com/billet-pas-cher-concert",
    siteName: "Dream Team Africa",
    type: "website",
    locale: "fr_FR",
  },
  alternates: { canonical: "https://dreamteamafrica.com/billet-pas-cher-concert" },
};

const AVANTAGES = [
  { icon: Ticket, title: "Dès 5€", desc: "Réservez votre place avec seulement 5€ d'acompte. Le prix est garanti." },
  { icon: CreditCard, title: "Payez à votre rythme", desc: "Rechargez quand vous voulez, dès 1€. Pas de prélèvement automatique." },
  { icon: CheckCircle, title: "Billet immédiat", desc: "Recevez votre billet avec QR code dès le premier versement." },
  { icon: Music, title: "Événements uniques", desc: "Concerts, foires, spectacles — la culture africaine dans toute sa diversité." },
];

export default function BilletPasCherConcert() {
  return (
    <div className="mx-auto max-w-4xl px-4 py-12 sm:px-6 lg:px-8">
      <header className="mb-14 text-center">
        <div className="inline-flex items-center gap-2 rounded-full bg-amber-100 px-4 py-1.5 text-xs font-bold text-amber-700">
          <Ticket size={14} />
          Billetterie
        </div>
        <h1 className="mt-4 font-serif text-4xl font-bold leading-tight text-dta-dark sm:text-5xl">
          Billets pas cher pour concerts et spectacles à Paris
        </h1>
        <p className="mt-4 text-lg text-dta-char/70">
          Concerts, spectacles de danse, foires culturelles — réservez <strong className="text-dta-dark">dès 5&nbsp;&euro;</strong> et payez à votre rythme.
        </p>
      </header>

      <section className="mb-14 grid gap-5 sm:grid-cols-2">
        {AVANTAGES.map((a) => (
          <div key={a.title} className="rounded-2xl border border-dta-sand bg-white p-6">
            <a.icon size={24} className="text-dta-accent" />
            <h2 className="mt-3 font-serif text-lg font-bold text-dta-dark">{a.title}</h2>
            <p className="mt-1 text-sm leading-relaxed text-dta-char/70">{a.desc}</p>
          </div>
        ))}
      </section>

      <section className="mb-14 rounded-2xl bg-gradient-to-r from-dta-dark to-[#2a1a0a] p-8 text-white text-center">
        <h2 className="font-serif text-2xl font-bold">Comment ça marche&nbsp;?</h2>
        <div className="mt-6 grid gap-4 sm:grid-cols-3">
          <div className="rounded-xl bg-white/10 p-5">
            <div className="text-2xl font-bold text-dta-accent">1</div>
            <p className="mt-2 text-sm text-white/80">Choisissez votre événement et réservez avec 5&nbsp;&euro;</p>
          </div>
          <div className="rounded-xl bg-white/10 p-5">
            <div className="text-2xl font-bold text-dta-accent">2</div>
            <p className="mt-2 text-sm text-white/80">Rechargez à votre rythme depuis votre espace personnel</p>
          </div>
          <div className="rounded-xl bg-white/10 p-5">
            <div className="text-2xl font-bold text-green-400">3</div>
            <p className="mt-2 text-sm text-white/80">Présentez votre QR code à l&apos;entrée le jour&nbsp;J</p>
          </div>
        </div>
      </section>

      <section className="mb-14 rounded-2xl bg-green-50 border border-green-200 p-8 text-center">
        <h2 className="font-serif text-2xl font-bold text-green-800">Culture pour Tous</h2>
        <p className="mt-3 text-sm text-green-700 max-w-xl mx-auto">
          Notre programme de billetterie flexible rend la culture accessible à tous.
          Réservez dès 5&nbsp;&euro;, rechargez dès 1&nbsp;&euro;, profitez sans stress.
        </p>
        <div className="mt-6 flex flex-wrap justify-center gap-3">
          <Link href="/saison-culturelle-africaine" className="inline-flex items-center gap-2 rounded-xl bg-green-600 px-6 py-3 text-sm font-bold text-white hover:bg-green-700">
            Voir les billets <ArrowRight size={14} />
          </Link>
          <Link href="/culture-pour-tous" className="inline-flex items-center rounded-xl border border-green-300 px-6 py-3 text-sm font-semibold text-green-700 hover:bg-green-100">
            En savoir plus
          </Link>
        </div>
      </section>

      <section className="mb-14 prose prose-sm max-w-none text-dta-char/70">
        <h2 className="font-serif text-xl font-bold text-dta-dark">Billets de concert pas cher à Paris en 2026</h2>
        <p>
          Vous cherchez des <strong>billets de concert pas cher à Paris</strong>&nbsp;? Dream Team Africa propose
          des événements culturels africains avec une billetterie accessible à tous les budgets.
        </p>
        <p>
          Avec le programme <Link href="/culture-pour-tous" className="text-green-700 font-semibold">Culture pour Tous</Link>,
          réservez votre place pour seulement <strong>5&nbsp;&euro;</strong> et complétez le paiement à votre rythme.
          Que ce soit pour un <strong>concert afrobeat</strong>, un <strong>spectacle de danse africaine</strong>,
          ou la <strong>Foire d&apos;Afrique à Paris</strong>, chaque billet est accessible.
        </p>
        <p>
          Nos événements se déroulent dans les meilleurs lieux parisiens&nbsp;: Cabaret Sauvage,
          salles du nord-est parisien, espaces culturels. Consultez notre{" "}
          <Link href="/saison-culturelle-africaine" className="text-dta-accent font-semibold">calendrier 2026</Link> pour
          trouver votre prochaine sortie.
        </p>
      </section>

      <div className="text-center">
        <Link href="/saison-culturelle-africaine" className="inline-block rounded-xl bg-dta-accent px-8 py-4 text-lg font-bold text-white hover:bg-dta-accent-dark">
          Réserver mes billets
        </Link>
      </div>
    </div>
  );
}

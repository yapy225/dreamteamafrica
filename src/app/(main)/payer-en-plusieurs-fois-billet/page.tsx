import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, CreditCard, Shield, Clock, Sparkles } from "lucide-react";

export const metadata: Metadata = {
  title: "Payer en plusieurs fois son billet — Billetterie flexible dès 5€ | Dream Team Africa",
  description:
    "Payez votre billet de concert ou spectacle en plusieurs fois sans frais. Réservez dès 5€ et rechargez à votre rythme avec Culture pour Tous. Billetterie flexible à Paris.",
  keywords: [
    "payer en plusieurs fois billet",
    "billet paiement échelonné",
    "billetterie paiement flexible",
    "réserver en plusieurs fois concert",
    "billet concert en plusieurs fois",
    "payer billet à son rythme",
    "culture pour tous paiement",
    "acompte billet spectacle",
  ],
  openGraph: {
    title: "Payer son billet en plusieurs fois — Dès 5€",
    description: "Réservez dès 5€ et payez à votre rythme. Billetterie flexible sans prélèvement automatique.",
    url: "https://dreamteamafrica.com/payer-en-plusieurs-fois-billet",
    siteName: "Dream Team Africa",
    type: "website",
    locale: "fr_FR",
  },
  alternates: { canonical: "https://dreamteamafrica.com/payer-en-plusieurs-fois-billet" },
};

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: [
    {
      "@type": "Question",
      name: "Comment payer un billet en plusieurs fois ?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Avec Culture pour Tous, réservez votre place avec 5€ d'acompte. Puis rechargez à votre rythme depuis votre espace personnel, dès 1€ par versement. Le solde est à compléter avant l'événement.",
      },
    },
    {
      "@type": "Question",
      name: "Y a-t-il des intérêts ou des frais de retard ?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Non. Aucun intérêt, aucun frais de retard. Seuls des frais de gestion de 3% (minimum 0,50€) sont appliqués à chaque transaction. Pas de prélèvement automatique.",
      },
    },
    {
      "@type": "Question",
      name: "Mon billet est-il valable avant d'avoir tout payé ?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Oui. Votre billet est valable dès le premier versement de 5€. Si vous n'avez pas soldé avant l'événement, vous payez le complément à l'entrée.",
      },
    },
  ],
};

const ETAPES = [
  { icon: Sparkles, num: "1", title: "Réservez avec 5€", desc: "Choisissez votre événement et bloquez votre place. Vous recevez votre billet immédiatement." },
  { icon: CreditCard, num: "2", title: "Rechargez librement", desc: "Depuis votre espace personnel, rechargez quand vous voulez, du montant que vous voulez. Minimum 1€." },
  { icon: Clock, num: "3", title: "Soldez avant le jour J", desc: "Complétez le solde avant la veille de l'événement. Sinon, le complément est à payer sur place." },
  { icon: Shield, num: "✓", title: "Zéro surprise", desc: "Pas de prélèvement automatique, pas d'intérêts, pas de frais de retard. Le prix est garanti." },
];

export default function PayerEnPlusieursFoisBillet() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />

      <div className="mx-auto max-w-4xl px-4 py-12 sm:px-6 lg:px-8">
        <header className="mb-14 text-center">
          <div className="inline-flex items-center gap-2 rounded-full bg-blue-100 px-4 py-1.5 text-xs font-bold text-blue-700">
            <CreditCard size={14} />
            Paiement flexible
          </div>
          <h1 className="mt-4 font-serif text-4xl font-bold leading-tight text-dta-dark sm:text-5xl">
            Payer son billet en plusieurs fois
          </h1>
          <p className="mt-4 text-lg text-dta-char/70">
            Réservez <strong className="text-dta-dark">dès 5&nbsp;&euro;</strong>, rechargez à votre rythme, profitez le jour&nbsp;J.<br />
            <strong>Zéro intérêt. Zéro prélèvement automatique.</strong>
          </p>
        </header>

        <section className="mb-14 grid gap-5 sm:grid-cols-2">
          {ETAPES.map((e) => (
            <div key={e.title} className="rounded-2xl border border-dta-sand bg-white p-6">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-dta-accent text-sm font-bold text-white">
                  {e.num}
                </div>
                <h2 className="font-serif text-lg font-bold text-dta-dark">{e.title}</h2>
              </div>
              <p className="mt-2 text-sm leading-relaxed text-dta-char/70">{e.desc}</p>
            </div>
          ))}
        </section>

        {/* Comparaison */}
        <section className="mb-14">
          <h2 className="mb-6 text-center font-serif text-2xl font-bold text-dta-dark">
            Culture pour Tous vs paiement classique
          </h2>
          <div className="overflow-hidden rounded-2xl border border-dta-sand">
            <table className="w-full text-sm">
              <thead className="bg-dta-bg">
                <tr>
                  <th className="px-5 py-3 text-left font-medium text-dta-char/70"></th>
                  <th className="px-5 py-3 text-center font-bold text-green-700">Culture pour Tous</th>
                  <th className="px-5 py-3 text-center font-medium text-dta-char/70">Paiement classique</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-dta-sand bg-white">
                <tr>
                  <td className="px-5 py-3 text-dta-char">Montant initial</td>
                  <td className="px-5 py-3 text-center font-bold text-green-700">5&nbsp;&euro;</td>
                  <td className="px-5 py-3 text-center text-dta-char/70">Prix plein</td>
                </tr>
                <tr>
                  <td className="px-5 py-3 text-dta-char">Échéancier imposé</td>
                  <td className="px-5 py-3 text-center font-bold text-green-700">Non — libre</td>
                  <td className="px-5 py-3 text-center text-dta-char/70">Oui (mensualités fixes)</td>
                </tr>
                <tr>
                  <td className="px-5 py-3 text-dta-char">Prélèvement automatique</td>
                  <td className="px-5 py-3 text-center font-bold text-green-700">Non</td>
                  <td className="px-5 py-3 text-center text-dta-char/70">Oui</td>
                </tr>
                <tr>
                  <td className="px-5 py-3 text-dta-char">Intérêts / frais de retard</td>
                  <td className="px-5 py-3 text-center font-bold text-green-700">Aucun</td>
                  <td className="px-5 py-3 text-center text-dta-char/70">Possible</td>
                </tr>
                <tr>
                  <td className="px-5 py-3 text-dta-char">Billet dès le 1er versement</td>
                  <td className="px-5 py-3 text-center font-bold text-green-700">Oui</td>
                  <td className="px-5 py-3 text-center text-dta-char/70">Après paiement complet</td>
                </tr>
                <tr>
                  <td className="px-5 py-3 text-dta-char">Recharge minimum</td>
                  <td className="px-5 py-3 text-center font-bold text-green-700">1&nbsp;&euro;</td>
                  <td className="px-5 py-3 text-center text-dta-char/70">—</td>
                </tr>
              </tbody>
            </table>
          </div>
        </section>

        <section className="mb-14 rounded-2xl bg-green-50 border border-green-200 p-8 text-center">
          <h2 className="font-serif text-2xl font-bold text-green-800">Prêt à réserver&nbsp;?</h2>
          <p className="mt-3 text-sm text-green-700 max-w-xl mx-auto">
            Choisissez votre événement, réservez avec 5&nbsp;&euro; et payez à votre rythme.
            C&apos;est simple, transparent et sans engagement.
          </p>
          <div className="mt-6 flex flex-wrap justify-center gap-3">
            <Link href="/saison-culturelle-africaine" className="inline-flex items-center gap-2 rounded-xl bg-green-600 px-6 py-3 text-sm font-bold text-white hover:bg-green-700">
              Voir les événements <ArrowRight size={14} />
            </Link>
            <Link href="/culture-pour-tous" className="inline-flex items-center rounded-xl border border-green-300 px-6 py-3 text-sm font-semibold text-green-700 hover:bg-green-100">
              Comment ça marche ?
            </Link>
          </div>
        </section>

        <section className="mb-14 prose prose-sm max-w-none text-dta-char/70">
          <h2 className="font-serif text-xl font-bold text-dta-dark">Payer son billet en plusieurs fois en 2026</h2>
          <p>
            De plus en plus de spectateurs cherchent à <strong>payer leurs billets de concert en plusieurs fois</strong>.
            Avec le programme <Link href="/culture-pour-tous" className="text-green-700 font-semibold">Culture pour Tous</Link> de Dream Team Africa,
            c&apos;est possible et sans aucune contrainte.
          </p>
          <p>
            Contrairement aux solutions de paiement fractionné classiques (Alma, Klarna), notre système est
            <strong> sans prélèvement automatique</strong> et <strong>sans intérêts</strong>.
            Vous rechargez quand vous voulez, le montant que vous voulez, depuis votre espace personnel.
          </p>
          <p>
            Ce système est idéal pour les <strong>billets de spectacles à Paris</strong>,
            les <strong>foires culturelles</strong> et les <strong>concerts afro</strong>.
            Réservez dès aujourd&apos;hui et rejoignez les milliers de spectateurs qui profitent déjà de la culture africaine à Paris.
          </p>
        </section>

        <div className="text-center">
          <Link href="/saison-culturelle-africaine" className="inline-block rounded-xl bg-dta-accent px-8 py-4 text-lg font-bold text-white hover:bg-dta-accent-dark">
            Réserver maintenant
          </Link>
        </div>
      </div>
    </>
  );
}

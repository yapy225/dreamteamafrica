import Link from "next/link";
import { Metadata } from "next";
import { prisma } from "@/lib/db";
import { formatPrice } from "@/lib/utils";

export const revalidate = 3600;

export const metadata: Metadata = {
  title: "Billet en plusieurs fois pour événement — Culture pour Tous | Dream Team Africa",
  description:
    "Payez votre billet en plusieurs fois pour les événements culturels africains à Paris. Acompte de 5€, rechargez à votre rythme. Sans engagement, sans prélèvement automatique.",
  keywords: [
    "billet en plusieurs fois",
    "paiement échelonné billet",
    "billet à crédit événement",
    "payer billet en plusieurs fois",
    "billetterie flexible Paris",
    "culture pour tous",
    "événement africain Paris",
  ],
  openGraph: {
    title: "Billet en plusieurs fois — dès 5€",
    description: "Payez votre billet en plusieurs fois. Acompte 5€, rechargez à votre rythme.",
    url: "https://dreamteamafrica.com/billet-en-plusieurs-fois-evenement",
    siteName: "Dream Team Africa",
    type: "website",
    locale: "fr_FR",
  },
  alternates: {
    canonical: "https://dreamteamafrica.com/billet-en-plusieurs-fois-evenement",
  },
};

export default async function BilletPlusieursPage() {
  const events = await prisma.event.findMany({
    where: { published: true, date: { gte: new Date() } },
    orderBy: { date: "asc" },
    select: { id: true, title: true, slug: true, venue: true, date: true, tiers: true, priceStd: true },
  });

  return (
    <div className="mx-auto max-w-3xl px-4 py-12 sm:px-6 lg:px-8">
      <header className="mb-12 text-center">
        <h1 className="font-serif text-3xl font-bold text-dta-dark sm:text-4xl">
          Billet en plusieurs fois pour événement
        </h1>
        <p className="mt-4 text-lg text-dta-char/70">
          Plus besoin de tout payer d&apos;un coup. Avec{" "}
          <Link href="/culture-pour-tous" className="font-semibold text-green-700 underline">Culture pour Tous</Link>,
          payez votre billet <strong className="text-dta-dark">à votre rythme</strong>.
        </p>
      </header>

      <section className="mb-10">
        <h2 className="mb-6 font-serif text-2xl font-bold text-dta-dark">
          Un vrai paiement flexible
        </h2>
        <div className="grid gap-4 sm:grid-cols-3">
          <div className="rounded-xl border border-dta-sand bg-white p-5 text-center">
            <p className="text-3xl font-bold text-green-700">5&nbsp;&euro;</p>
            <p className="mt-1 text-sm text-dta-char/70">Acompte minimum</p>
          </div>
          <div className="rounded-xl border border-dta-sand bg-white p-5 text-center">
            <p className="text-3xl font-bold text-green-700">1&nbsp;&euro;</p>
            <p className="mt-1 text-sm text-dta-char/70">Recharge minimum</p>
          </div>
          <div className="rounded-xl border border-dta-sand bg-white p-5 text-center">
            <p className="text-3xl font-bold text-green-700">0</p>
            <p className="mt-1 text-sm text-dta-char/70">Prélèvement auto</p>
          </div>
        </div>
        <p className="mt-4 text-sm text-dta-char/60 text-center">
          Pas de BNPL, pas de Klarna, pas de vérification de solvabilité. Juste un système simple et transparent.
        </p>
      </section>

      <section className="mb-10">
        <h2 className="mb-4 font-serif text-2xl font-bold text-dta-dark">
          Différences avec le paiement en 3 ou 4 fois classique
        </h2>
        <div className="overflow-hidden rounded-xl border border-dta-sand">
          <table className="w-full text-sm">
            <thead className="bg-dta-beige">
              <tr>
                <th className="px-4 py-3 text-left font-semibold text-dta-dark"></th>
                <th className="px-4 py-3 text-center font-semibold text-green-700">Culture pour Tous</th>
                <th className="px-4 py-3 text-center font-semibold text-dta-char/60">BNPL classique</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-dta-sand bg-white">
              <tr>
                <td className="px-4 py-3 text-dta-char">Acompte</td>
                <td className="px-4 py-3 text-center text-green-700 font-medium">5&nbsp;&euro;</td>
                <td className="px-4 py-3 text-center text-dta-char/60">25-33%</td>
              </tr>
              <tr>
                <td className="px-4 py-3 text-dta-char">Prélèvement auto</td>
                <td className="px-4 py-3 text-center text-green-700 font-medium">Non</td>
                <td className="px-4 py-3 text-center text-dta-char/60">Oui</td>
              </tr>
              <tr>
                <td className="px-4 py-3 text-dta-char">Vérification solvabilité</td>
                <td className="px-4 py-3 text-center text-green-700 font-medium">Non</td>
                <td className="px-4 py-3 text-center text-dta-char/60">Oui</td>
              </tr>
              <tr>
                <td className="px-4 py-3 text-dta-char">Billet immédiat</td>
                <td className="px-4 py-3 text-center text-green-700 font-medium">Oui</td>
                <td className="px-4 py-3 text-center text-dta-char/60">Variable</td>
              </tr>
              <tr>
                <td className="px-4 py-3 text-dta-char">Liberté de versement</td>
                <td className="px-4 py-3 text-center text-green-700 font-medium">Totale</td>
                <td className="px-4 py-3 text-center text-dta-char/60">Fixé</td>
              </tr>
            </tbody>
          </table>
        </div>
      </section>

      {events.length > 0 && (
        <section className="mb-10">
          <h2 className="mb-6 font-serif text-2xl font-bold text-dta-dark">
            Événements disponibles en paiement flexible
          </h2>
          <div className="space-y-3">
            {events.map((event) => {
              const tiers = (event.tiers as Array<{ price: number }>) || [];
              const lowestPrice = tiers.length > 0
                ? Math.min(...tiers.map((t) => t.price).filter((p) => p > 0))
                : event.priceStd;
              return (
                <Link
                  key={event.id}
                  href={`/culture-pour-tous/${event.slug}`}
                  className="flex items-center justify-between rounded-xl border border-dta-sand bg-white p-4 transition-all hover:border-green-300 hover:bg-green-50/50"
                >
                  <div>
                    <p className="font-semibold text-dta-dark">{event.title}</p>
                    <p className="text-xs text-dta-char/60">{event.venue} · {new Date(event.date).toLocaleDateString("fr-FR", { day: "numeric", month: "short" })}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-lg font-bold text-green-700">dès 5&nbsp;&euro;</p>
                    <p className="text-xs text-dta-char/50">au lieu de {formatPrice(lowestPrice)}</p>
                  </div>
                </Link>
              );
            })}
          </div>
        </section>
      )}

      <section className="text-center">
        <Link
          href="/culture-pour-tous"
          className="inline-block rounded-xl bg-green-600 px-8 py-4 text-lg font-bold text-white transition-colors hover:bg-green-700"
        >
          Découvrir Culture pour Tous
        </Link>
      </section>
    </div>
  );
}

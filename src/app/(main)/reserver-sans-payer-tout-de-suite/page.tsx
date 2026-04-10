import Link from "next/link";
import { Metadata } from "next";
import { prisma } from "@/lib/db";
import { formatPrice } from "@/lib/utils";

export const revalidate = 3600;

export const metadata: Metadata = {
  title: "Réserver sans payer tout de suite — Culture pour Tous | Dream Team Africa",
  description:
    "Réservez votre billet pour un événement culturel africain à Paris sans tout payer maintenant. Acompte de 5€, billet immédiat, solde à votre rythme. Programme Culture pour Tous.",
  keywords: [
    "réserver sans payer tout de suite",
    "réserver billet sans payer",
    "billet acompte événement",
    "réservation flexible événement Paris",
    "payer plus tard billet",
    "culture pour tous",
    "Dream Team Africa",
  ],
  openGraph: {
    title: "Réserver sans tout payer — dès 5€",
    description: "Bloquez votre place avec 5€ et payez le reste quand vous voulez.",
    url: "https://dreamteamafrica.com/reserver-sans-payer-tout-de-suite",
    siteName: "Dream Team Africa",
    type: "website",
    locale: "fr_FR",
  },
  alternates: {
    canonical: "https://dreamteamafrica.com/reserver-sans-payer-tout-de-suite",
  },
};

export default async function ReserverSansPayerPage() {
  const events = await prisma.event.findMany({
    where: { published: true, date: { gte: new Date() } },
    orderBy: { date: "asc" },
    select: { id: true, title: true, slug: true, venue: true, date: true, tiers: true, priceStd: true },
  });

  return (
    <div className="mx-auto max-w-3xl px-4 py-12 sm:px-6 lg:px-8">
      <header className="mb-12 text-center">
        <h1 className="font-serif text-3xl font-bold text-dta-dark sm:text-4xl">
          Réserver sans payer tout de suite
        </h1>
        <p className="mt-4 text-lg text-dta-char/70">
          Avec <Link href="/culture-pour-tous" className="font-semibold text-green-700 underline">Culture pour Tous</Link>,
          bloquez votre place avec <strong className="text-dta-dark">seulement 5&nbsp;&euro;</strong> et payez le reste quand vous voulez.
        </p>
      </header>

      <section className="mb-10">
        <h2 className="mb-6 font-serif text-2xl font-bold text-dta-dark">
          Comment ça fonctionne&nbsp;?
        </h2>
        <div className="space-y-4">
          <div className="rounded-xl border border-dta-sand bg-white p-5">
            <h3 className="font-semibold text-dta-dark">1. Choisissez votre événement</h3>
            <p className="mt-1 text-sm text-dta-char/70">Parcourez la Saison Culturelle Africaine 2026 : foires, salons, festivals, concerts...</p>
          </div>
          <div className="rounded-xl border border-dta-sand bg-white p-5">
            <h3 className="font-semibold text-dta-dark">2. Payez 5&nbsp;&euro; d&apos;acompte</h3>
            <p className="mt-1 text-sm text-dta-char/70">Votre billet est réservé immédiatement. Vous recevez un QR code valide par email.</p>
          </div>
          <div className="rounded-xl border border-dta-sand bg-white p-5">
            <h3 className="font-semibold text-dta-dark">3. Complétez quand vous voulez</h3>
            <p className="mt-1 text-sm text-dta-char/70">Rechargez depuis votre espace personnel : 1&nbsp;&euro; minimum par versement, sans calendrier imposé.</p>
          </div>
        </div>
      </section>

      {events.length > 0 && (
        <section className="mb-10">
          <h2 className="mb-6 font-serif text-2xl font-bold text-dta-dark">
            Événements disponibles
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
                    <p className="text-lg font-bold text-green-700">5&nbsp;&euro;</p>
                    <p className="text-xs text-dta-char/50 line-through">{formatPrice(lowestPrice)}</p>
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

import Link from "next/link";
import { Metadata } from "next";
import { prisma } from "@/lib/db";

export const revalidate = 3600;

export const metadata: Metadata = {
  title: "Culture accessible à Paris — Événements africains dès 5€ | Dream Team Africa",
  description:
    "Découvrez la culture africaine à Paris de manière accessible. Foires, salons, festivals, concerts dès 5€ avec Culture pour Tous. Paiement flexible, sans engagement.",
  keywords: [
    "culture accessible Paris",
    "événement pas cher Paris",
    "sortie culturelle accessible",
    "culture africaine Paris",
    "événement africain pas cher",
    "sortir petit budget Paris",
    "culture pour tous Paris",
    "bon plan culture Paris",
  ],
  openGraph: {
    title: "Culture accessible à Paris — dès 5€",
    description: "La culture africaine pour tous les budgets. Événements dès 5€ à Paris.",
    url: "https://dreamteamafrica.com/culture-accessible-paris",
    siteName: "Dream Team Africa",
    type: "website",
    locale: "fr_FR",
  },
  alternates: {
    canonical: "https://dreamteamafrica.com/culture-accessible-paris",
  },
};

export default async function CultureAccessiblePage() {
  const [events, cptCount] = await Promise.all([
    prisma.event.findMany({
      where: { published: true, date: { gte: new Date() } },
      orderBy: { date: "asc" },
      select: { id: true, title: true, slug: true, venue: true, date: true },
    }),
    prisma.ticket.count({ where: { installments: { gt: 1 } } }),
  ]);

  return (
    <div className="mx-auto max-w-3xl px-4 py-12 sm:px-6 lg:px-8">
      <header className="mb-12 text-center">
        <h1 className="font-serif text-3xl font-bold text-dta-dark sm:text-4xl">
          Culture accessible à Paris
        </h1>
        <p className="mt-4 text-lg text-dta-char/70">
          La culture africaine ne devrait pas être un luxe.<br />
          <strong className="text-dta-dark">7 événements à Paris, accessibles dès 5&nbsp;&euro;.</strong>
        </p>
        {cptCount > 0 && (
          <p className="mt-4 inline-flex items-center gap-2 rounded-full bg-green-50 px-5 py-2.5 text-sm font-medium text-green-700">
            <span className="relative flex h-2.5 w-2.5">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-green-400 opacity-75" />
              <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-green-500" />
            </span>
            {cptCount} personne{cptCount > 1 ? "s" : ""} {cptCount > 1 ? "ont" : "a"} déjà profité de Culture pour Tous
          </p>
        )}
      </header>

      <section className="mb-10">
        <h2 className="mb-6 font-serif text-2xl font-bold text-dta-dark">
          Pourquoi la culture doit être accessible
        </h2>
        <div className="space-y-4 text-sm leading-relaxed text-dta-char/80">
          <p>
            Paris regorge d&apos;événements culturels, mais le prix des billets reste souvent un frein.
            Festivals, salons, foires... les tarifs peuvent vite grimper, surtout pour les familles
            et les étudiants.
          </p>
          <p>
            C&apos;est pour ça que <strong>Dream Team Africa</strong> a créé{" "}
            <Link href="/culture-pour-tous" className="font-semibold text-green-700 underline">Culture pour Tous</Link> :
            un programme qui permet de <strong>réserver dès 5&nbsp;&euro;</strong> et de payer le reste
            à son rythme, sans prélèvement automatique, sans vérification de solvabilité.
          </p>
          <p>
            L&apos;objectif est simple : que le budget ne soit plus jamais un obstacle pour découvrir
            la richesse de la culture africaine à Paris.
          </p>
        </div>
      </section>

      <section className="mb-10">
        <h2 className="mb-6 font-serif text-2xl font-bold text-dta-dark">
          La Saison Culturelle Africaine 2026
        </h2>
        <p className="mb-4 text-sm text-dta-char/70">
          7 événements exceptionnels d&apos;avril à décembre 2026, tous accessibles avec Culture pour Tous.
        </p>
        <div className="space-y-3">
          {events.map((event) => (
            <Link
              key={event.id}
              href={`/culture-pour-tous/${event.slug}`}
              className="flex items-center justify-between rounded-xl border border-dta-sand bg-white p-4 transition-all hover:border-green-300 hover:bg-green-50/50"
            >
              <div>
                <p className="font-semibold text-dta-dark">{event.title}</p>
                <p className="text-xs text-dta-char/60">
                  {event.venue} · {new Date(event.date).toLocaleDateString("fr-FR", { day: "numeric", month: "long" })}
                </p>
              </div>
              <span className="rounded-full bg-green-100 px-3 py-1 text-sm font-bold text-green-700">
                dès 5&nbsp;&euro;
              </span>
            </Link>
          ))}
        </div>
      </section>

      <section className="mb-10">
        <h2 className="mb-4 font-serif text-2xl font-bold text-dta-dark">
          Pour qui&nbsp;?
        </h2>
        <div className="grid gap-4 sm:grid-cols-2">
          <div className="rounded-xl border border-dta-sand bg-white p-5">
            <h3 className="font-semibold text-dta-dark">Étudiants</h3>
            <p className="mt-1 text-sm text-dta-char/70">Budget serré ? Réservez avec 5&nbsp;&euro; et complétez quand la bourse tombe.</p>
          </div>
          <div className="rounded-xl border border-dta-sand bg-white p-5">
            <h3 className="font-semibold text-dta-dark">Familles</h3>
            <p className="mt-1 text-sm text-dta-char/70">Réservez pour toute la famille sans exploser le budget du mois.</p>
          </div>
          <div className="rounded-xl border border-dta-sand bg-white p-5">
            <h3 className="font-semibold text-dta-dark">Curieux</h3>
            <p className="mt-1 text-sm text-dta-char/70">Envie de découvrir sans vous engager ? 5&nbsp;&euro; pour tester.</p>
          </div>
          <div className="rounded-xl border border-dta-sand bg-white p-5">
            <h3 className="font-semibold text-dta-dark">Diaspora</h3>
            <p className="mt-1 text-sm text-dta-char/70">Retrouvez la culture africaine à Paris, accessible à tous les budgets.</p>
          </div>
        </div>
      </section>

      <section className="text-center">
        <Link
          href="/culture-pour-tous"
          className="inline-block rounded-xl bg-green-600 px-8 py-4 text-lg font-bold text-white transition-colors hover:bg-green-700"
        >
          Découvrir Culture pour Tous
        </Link>
        <p className="mt-3 text-sm text-dta-char/50">
          La culture africaine pour tous. Dès 5&nbsp;&euro;.
        </p>
      </section>
    </div>
  );
}

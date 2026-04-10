import Link from "next/link";
import Image from "next/image";
import { Metadata } from "next";
import { prisma } from "@/lib/db";
import { formatPrice } from "@/lib/utils";

export const revalidate = 3600;

export const metadata: Metadata = {
  title: "Culture pour Tous — Réservez dès 5€ et payez à votre rythme | Dream Team Africa",
  description:
    "Réservez votre place pour les événements culturels africains à Paris dès 5€. Payez à votre rythme avec le programme Culture pour Tous de Dream Team Africa. Billetterie flexible, sans engagement.",
  keywords: [
    "culture pour tous",
    "billet pas cher",
    "événement africain Paris",
    "paiement en plusieurs fois",
    "billetterie flexible",
    "Dream Team Africa",
    "foire afrique Paris",
    "spectacle africain",
    "sortir pas cher Paris",
  ],
  openGraph: {
    title: "Culture pour Tous — Dès 5€ | Dream Team Africa",
    description:
      "Réservez votre place dès 5€ et payez comme vous pouvez. La culture africaine accessible à tous.",
    url: "https://dreamteamafrica.com/culture-pour-tous",
    siteName: "Dream Team Africa",
    type: "website",
    locale: "fr_FR",
  },
  twitter: {
    card: "summary_large_image",
    title: "Culture pour Tous — Dès 5€",
    description:
      "La culture africaine accessible à tous. Réservez dès 5€, payez à votre rythme.",
  },
  alternates: {
    canonical: "https://dreamteamafrica.com/culture-pour-tous",
  },
};

const howToJsonLd = {
  "@context": "https://schema.org",
  "@type": "HowTo",
  name: "Comment réserver un billet dès 5€ avec Culture pour Tous",
  description: "Réservez votre place pour un événement culturel africain à Paris dès 5€ et payez à votre rythme.",
  totalTime: "PT2M",
  estimatedCost: { "@type": "MonetaryAmount", currency: "EUR", value: "5" },
  step: [
    { "@type": "HowToStep", name: "Choisir un événement", text: "Rendez-vous sur la page de l'événement et sélectionnez votre formule." },
    { "@type": "HowToStep", name: "Payer l'acompte de 5€", text: "Cliquez sur 'Culture pour Tous' et payez 5€. Vous recevez immédiatement votre billet avec QR code." },
    { "@type": "HowToStep", name: "Recharger à votre rythme", text: "Depuis votre espace personnel, rechargez quand vous voulez (minimum 1€ par versement)." },
    { "@type": "HowToStep", name: "Profiter de l'événement", text: "Présentez votre QR code à l'entrée. Le complément éventuel est payable sur place." },
  ],
};

const breadcrumbJsonLd = {
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  itemListElement: [
    { "@type": "ListItem", position: 1, name: "Accueil", item: "https://dreamteamafrica.com" },
    { "@type": "ListItem", position: 2, name: "Culture pour Tous", item: "https://dreamteamafrica.com/culture-pour-tous" },
  ],
};

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "WebPage",
  name: "Culture pour Tous — Dream Team Africa",
  description:
    "Programme de billetterie flexible : réservez dès 5€ et payez à votre rythme pour les événements culturels africains à Paris.",
  url: "https://dreamteamafrica.com/culture-pour-tous",
  publisher: {
    "@type": "Organization",
    name: "Dream Team Africa",
    url: "https://dreamteamafrica.com",
  },
  mainEntity: {
    "@type": "FAQPage",
    mainEntity: [
      {
        "@type": "Question",
        name: "Comment fonctionne Culture pour Tous ?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Réservez votre place avec un acompte de 5€, recevez votre billet immédiatement, puis rechargez à votre rythme. Le solde est à compléter avant la veille de l'événement.",
        },
      },
      {
        "@type": "Question",
        name: "Mon billet est-il valable dès le premier versement ?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Oui ! Dès que vous payez l'acompte de 5€, vous recevez votre billet avec QR code. Vous pouvez entrer à l'événement même si votre billet n'est pas entièrement soldé.",
        },
      },
      {
        "@type": "Question",
        name: "Quel est le montant minimum par recharge ?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "1€ par versement. Vous pouvez recharger autant de fois que vous voulez depuis votre espace personnel.",
        },
      },
      {
        "@type": "Question",
        name: "Que se passe-t-il si je ne solde pas avant l'événement ?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Votre billet reste valable. Vous payez simplement le complément à l'entrée le jour J.",
        },
      },
      {
        "@type": "Question",
        name: "Le prix du billet peut-il changer ?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Non. Le prix est garanti au moment de votre réservation. Même si le tarif augmente ensuite, vous payez le prix initial.",
        },
      },
    ],
  },
};

export default async function CulturePourTousPage() {
  // Compteur global Culture pour Tous (billets en plusieurs fois)
  const [cptCount, events] = await Promise.all([
    prisma.ticket.count({ where: { installments: { gt: 1 } } }),
    prisma.event.findMany({
      where: { published: true, date: { gte: new Date() } },
      orderBy: { date: "asc" },
      select: { id: true, title: true, slug: true, coverImage: true, venue: true, date: true, tiers: true, priceStd: true },
    }),
  ]);

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(howToJsonLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }}
      />

      <div className="mx-auto max-w-3xl px-4 py-12 sm:px-6 lg:px-8">
        {/* HERO */}
        <header className="mb-14 text-center">
          <span className="inline-block rounded-full bg-green-100 px-4 py-1.5 text-xs font-bold uppercase tracking-widest text-green-700">
            Nouveau
          </span>
          <h1 className="mt-4 font-serif text-4xl font-bold leading-tight text-dta-dark sm:text-5xl">
            Culture pour Tous
          </h1>
          <p className="mt-4 text-lg text-dta-char/70">
            La culture africaine accessible à tous, à Paris.<br />
            <strong className="text-dta-dark">
              Réservez votre place dès 5&nbsp;&euro; et payez comme vous pouvez.
            </strong>
          </p>
          {cptCount > 0 && (
            <p className="mt-4 inline-flex items-center gap-2 rounded-full bg-green-50 px-5 py-2.5 text-sm font-medium text-green-700">
              <span className="relative flex h-2.5 w-2.5">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-green-400 opacity-75" />
                <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-green-500" />
              </span>
              {cptCount} personne{cptCount > 1 ? "s" : ""} {cptCount > 1 ? "ont" : "a"} déjà réservé avec Culture pour Tous
            </p>
          )}
          <div className="mt-6 flex flex-wrap justify-center gap-3">
            <Link
              href="/saison-culturelle-africaine"
              className="inline-flex items-center rounded-xl bg-dta-accent px-6 py-3 text-sm font-bold text-white transition-colors hover:bg-dta-accent-dark"
            >
              Voir les événements
            </Link>
            <Link
              href="/mes-billets"
              className="inline-flex items-center rounded-xl border border-dta-sand px-6 py-3 text-sm font-semibold text-dta-char transition-colors hover:border-dta-accent hover:text-dta-accent"
            >
              Mon espace billets
            </Link>
          </div>
        </header>

        {/* COMMENT ÇA MARCHE */}
        <section className="mb-14" aria-labelledby="comment-ca-marche">
          <h2
            id="comment-ca-marche"
            className="mb-8 text-center font-serif text-2xl font-bold text-dta-dark"
          >
            Comment ça marche&nbsp;?
          </h2>

          <ol className="space-y-5">
            <Step num={1} title="Réservez avec 5&nbsp;&euro;">
              Choisissez votre événement et bloquez votre place avec un acompte de seulement
              5&nbsp;&euro;. Vous recevez immédiatement votre billet électronique.
            </Step>
            <Step num={2} title="Payez à votre rythme">
              Depuis votre espace personnel, rechargez votre billet quand vous voulez, du montant
              que vous voulez (minimum 1&nbsp;&euro; par versement). Suivez votre progression en
              temps réel.
            </Step>
            <Step num={3} title="Soldez avant l&apos;événement">
              Complétez le solde restant avant la veille de l&apos;événement. Si vous n&apos;avez
              pas soldé, pas de panique&nbsp;: vous payez le complément à l&apos;entrée le jour&nbsp;J.
            </Step>
            <Step num={4} title="Profitez&nbsp;!" done>
              Présentez votre QR code à l&apos;entrée. Mode, artisanat, gastronomie, musique
              live… la culture africaine vous attend.
            </Step>
          </ol>
        </section>

        {/* AVANTAGES */}
        <section className="mb-14" aria-labelledby="avantages">
          <h2
            id="avantages"
            className="mb-8 text-center font-serif text-2xl font-bold text-dta-dark"
          >
            Pourquoi Culture pour Tous&nbsp;?
          </h2>
          <div className="grid gap-4 sm:grid-cols-3">
            <Advantage emoji="💰" title="Accessible">
              Réservez avec seulement 5&nbsp;&euro;. Le prix est garanti, même si le tarif
              augmente ensuite.
            </Advantage>
            <Advantage emoji="🕐" title="Flexible">
              Payez quand vous voulez, le montant que vous voulez. Pas de calendrier imposé, pas
              de prélèvement automatique.
            </Advantage>
            <Advantage emoji="🎟️" title="Immédiat">
              Votre billet est valable dès le premier versement. QR code, barre de progression,
              historique — tout dans votre espace.
            </Advantage>
          </div>
        </section>

        {/* EXEMPLE CONCRET */}
        <section className="mb-14" aria-labelledby="exemple">
          <div className="overflow-hidden rounded-2xl border border-dta-sand bg-gradient-to-r from-dta-dark to-[#2a1a0a] p-8 text-white">
            <h2 id="exemple" className="mb-6 font-serif text-xl font-bold">
              Exemple concret
            </h2>
            <p className="mb-4 text-sm text-white/70">
              Pour un billet <strong className="text-white">Évasion Paris</strong> à{" "}
              <strong className="text-white">150&nbsp;&euro;</strong>&nbsp;:
            </p>
            <div className="space-y-3">
              <TimelineRow date="15 mars" label="Acompte initial" amount="+5 €" />
              <TimelineRow date="25 mars" label="Recharge" amount="+15 €" />
              <TimelineRow date="2 avril" label="Recharge" amount="+20 €" />
              <TimelineRow date="15 avril" label="Recharge" amount="+50 €" />
              <TimelineRow date="10 juin" label="Solde final" amount="+60 €" />
              <div className="flex items-center justify-between rounded-xl border border-green-500/30 bg-green-500/10 px-4 py-3">
                <span className="text-sm text-green-300">Total</span>
                <span className="text-sm text-green-300">Billet soldé</span>
                <span className="font-bold text-green-400">150&nbsp;&euro;</span>
              </div>
            </div>
            <div className="mt-4">
              <div className="h-3 overflow-hidden rounded-full bg-white/10">
                <div className="h-full w-full rounded-full bg-gradient-to-r from-green-400 to-green-500" />
              </div>
              <p className="mt-1 text-right text-xs text-white/40">
                100&nbsp;% — Billet prêt&nbsp;!
              </p>
            </div>
          </div>
        </section>

        {/* FAQ */}
        <section className="mb-14" aria-labelledby="faq">
          <h2 id="faq" className="mb-6 text-center font-serif text-2xl font-bold text-dta-dark">
            Questions fréquentes
          </h2>
          <div className="space-y-3">
            <Faq
              q="Mon billet est-il valable dès le premier versement ?"
              a="Oui ! Dès que vous payez l'acompte de 5 €, vous recevez votre billet avec QR code. Vous pouvez entrer à l'événement même si votre billet n'est pas entièrement soldé — le complément sera à payer sur place."
            />
            <Faq
              q="Quel est le montant minimum par recharge ?"
              a="1 € par versement. Vous pouvez recharger autant de fois que vous voulez depuis votre espace personnel."
            />
            <Faq
              q="Que se passe-t-il si je ne solde pas avant l'événement ?"
              a="Votre billet reste valable. Vous payez simplement le complément à l'entrée le jour J. Aucune pénalité."
            />
            <Faq
              q="Puis-je me faire rembourser ?"
              a="Conformément à la loi (art. L221-28 du Code de la consommation), les billets de spectacles ne sont ni échangeables ni remboursables. En cas d'annulation de l'événement par l'organisateur, un remboursement intégral est garanti."
            />
            <Faq
              q="Comment suivre mes versements ?"
              a="Connectez-vous sur votre espace personnel pour voir votre solde, votre barre de progression et l'historique de tous vos versements."
            />
            <Faq
              q="Le prix du billet peut-il changer ?"
              a="Non. Le prix est garanti au moment de votre réservation. Même si le tarif augmente ensuite, vous payez le prix initial."
            />
            <Faq
              q="Y a-t-il des frais supplémentaires ?"
              a="Des frais de gestion de 3 % (minimum 0,50 €) sont appliqués à chaque transaction pour couvrir les frais de paiement sécurisé. Les frais sont clairement affichés avant le paiement."
            />
          </div>
        </section>

        {/* ÉVÉNEMENTS DISPONIBLES */}
        {events.length > 0 && (
          <section className="mb-14" aria-labelledby="evenements">
            <h2 id="evenements" className="mb-6 text-center font-serif text-2xl font-bold text-dta-dark">
              Événements disponibles dès 5&nbsp;&euro;
            </h2>
            <div className="grid gap-4 sm:grid-cols-2">
              {events.map((event) => {
                const tiers = (event.tiers as Array<{ price: number }>) || [];
                const lowestPrice = tiers.length > 0
                  ? Math.min(...tiers.map((t) => t.price).filter((p) => p > 0))
                  : event.priceStd;
                const dateStr = new Date(event.date).toLocaleDateString("fr-FR", {
                  day: "numeric",
                  month: "short",
                });
                return (
                  <Link
                    key={event.id}
                    href={`/culture-pour-tous/${event.slug}`}
                    className="group overflow-hidden rounded-xl border border-dta-sand bg-white transition-all hover:border-dta-accent hover:shadow-md"
                  >
                    {event.coverImage && (
                      <div className="relative aspect-[16/7]">
                        <Image
                          src={event.coverImage}
                          alt={event.title}
                          fill
                          className="object-cover transition-transform group-hover:scale-105"
                          sizes="(max-width: 640px) 100vw, 50vw"
                        />
                      </div>
                    )}
                    <div className="p-4">
                      <h3 className="font-serif text-base font-bold text-dta-dark group-hover:text-dta-accent">
                        {event.title}
                      </h3>
                      <p className="mt-1 text-xs text-dta-char/60">
                        {dateStr} · {event.venue}
                      </p>
                      <p className="mt-2 text-sm font-semibold text-green-700">
                        dès 5&nbsp;&euro; <span className="font-normal text-green-600/70">au lieu de {formatPrice(lowestPrice)}</span>
                      </p>
                    </div>
                  </Link>
                );
              })}
            </div>
          </section>
        )}

        {/* CTA FINAL */}
        <section className="text-center">
          <Link
            href="/saison-culturelle-africaine"
            className="inline-block rounded-xl bg-dta-accent px-8 py-4 text-lg font-bold text-white transition-colors hover:bg-dta-accent-dark"
          >
            Découvrir les événements
          </Link>
          <p className="mt-3 text-sm text-dta-char/50">
            La culture africaine pour tous. Dès 5&nbsp;&euro;.
          </p>
        </section>
      </div>
    </>
  );
}

function Step({
  num,
  title,
  children,
  done = false,
}: {
  num: number;
  title: string;
  children: React.ReactNode;
  done?: boolean;
}) {
  return (
    <li className="flex gap-5 rounded-2xl border border-dta-sand bg-white p-6">
      <div
        className={`flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-full text-xl font-bold text-white ${
          done ? "bg-green-500" : "bg-dta-accent"
        }`}
      >
        {done ? "\u2713" : num}
      </div>
      <div>
        <h3
          className="font-serif text-lg font-bold text-dta-dark"
          dangerouslySetInnerHTML={{ __html: title }}
        />
        <p className="mt-1 text-sm leading-relaxed text-dta-char/70">{children}</p>
      </div>
    </li>
  );
}

function Advantage({
  emoji,
  title,
  children,
}: {
  emoji: string;
  title: string;
  children: React.ReactNode;
}) {
  return (
    <div className="rounded-2xl border border-dta-sand bg-white p-5 text-center">
      <span className="text-3xl">{emoji}</span>
      <h3 className="mt-2 font-serif text-base font-bold text-dta-dark">{title}</h3>
      <p className="mt-1 text-xs leading-relaxed text-dta-char/70">{children}</p>
    </div>
  );
}

function TimelineRow({ date, label, amount }: { date: string; label: string; amount: string }) {
  return (
    <div className="flex items-center justify-between rounded-xl bg-white/10 px-4 py-3">
      <span className="text-sm text-white/70">{date}</span>
      <span className="text-sm">{label}</span>
      <span className="font-bold text-green-400">{amount}</span>
    </div>
  );
}

function Faq({ q, a }: { q: string; a: string }) {
  return (
    <details className="group rounded-xl border border-dta-sand bg-white">
      <summary className="flex cursor-pointer list-none items-center justify-between px-6 py-4 text-sm font-semibold text-dta-dark">
        {q}
        <span className="ml-2 text-dta-accent transition-transform group-open:rotate-45">+</span>
      </summary>
      <div className="px-6 pb-4 text-sm leading-relaxed text-dta-char/70">{a}</div>
    </details>
  );
}

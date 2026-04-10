import Link from "next/link";
import Image from "next/image";
import { notFound } from "next/navigation";
import { Metadata } from "next";
import { prisma } from "@/lib/db";
import { formatPrice } from "@/lib/utils";

export const revalidate = 3600; // 1h

const siteUrl = process.env.NEXT_PUBLIC_APP_URL || "https://dreamteamafrica.com";

export async function generateStaticParams() {
  const events = await prisma.event.findMany({
    where: { published: true },
    select: { slug: true },
  });
  return events.map((e) => ({ slug: e.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const event = await prisma.event.findUnique({ where: { slug } });
  if (!event) return { title: "Événement introuvable" };

  const dateStr = new Date(event.date).toLocaleDateString("fr-FR", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });

  const title = `${event.title} dès 5€ — Culture pour Tous | Dream Team Africa`;
  const description = `Réservez votre place pour ${event.title} le ${dateStr} à ${event.venue}, Paris dès 5€ avec Culture pour Tous. Payez à votre rythme, sans engagement. Billet immédiat.`;

  return {
    title,
    description,
    keywords: [
      `${event.title} pas cher`,
      `${event.title} billet`,
      `${event.title} prix`,
      "culture pour tous",
      "billet pas cher événement africain",
      "paiement en plusieurs fois billet",
      "événement culturel africain Paris",
      "sortir pas cher Paris",
      event.venue,
    ],
    openGraph: {
      title: `${event.title} dès 5€ — Culture pour Tous`,
      description,
      url: `${siteUrl}/culture-pour-tous/${slug}`,
      siteName: "Dream Team Africa",
      type: "website",
      locale: "fr_FR",
      ...(event.coverImage && {
        images: [{ url: event.coverImage, width: 1200, height: 630, alt: event.title }],
      }),
    },
    twitter: {
      card: "summary_large_image",
      title: `${event.title} dès 5€`,
      description: `Réservez dès 5€, payez à votre rythme. ${event.venue}, Paris.`,
    },
    alternates: {
      canonical: `${siteUrl}/culture-pour-tous/${slug}`,
    },
  };
}

export default async function CulturePourTousEventPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const event = await prisma.event.findUnique({
    where: { slug },
    include: { _count: { select: { tickets: true } } },
  });

  if (!event) notFound();

  const dateStr = new Date(event.date).toLocaleDateString("fr-FR", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  });

  const tiers = (event.tiers as Array<{ id: string; name: string; price: number }>) || [];
  const lowestPrice = tiers.length > 0
    ? Math.min(...tiers.map((t) => t.price).filter((p) => p > 0))
    : event.priceStd;

  // Count Culture pour Tous tickets (installment tickets)
  const cptCount = await prisma.ticket.count({
    where: { eventId: event.id, installments: { gt: 1 } },
  });

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Event",
    name: event.title,
    description: event.description,
    startDate: new Date(event.date).toISOString(),
    ...(event.endDate && { endDate: new Date(event.endDate).toISOString() }),
    location: {
      "@type": "Place",
      name: event.venue,
      address: { "@type": "PostalAddress", streetAddress: event.address, addressLocality: "Paris", addressCountry: "FR" },
    },
    organizer: {
      "@type": "Organization",
      name: "Dream Team Africa",
      url: siteUrl,
    },
    offers: {
      "@type": "AggregateOffer",
      lowPrice: 5,
      highPrice: lowestPrice,
      priceCurrency: "EUR",
      availability: "https://schema.org/InStock",
      url: `${siteUrl}/saison-culturelle-africaine/${slug}`,
      validFrom: new Date().toISOString(),
    },
    image: event.coverImage || undefined,
    eventStatus: "https://schema.org/EventScheduled",
    eventAttendanceMode: "https://schema.org/OfflineEventAttendanceMode",
  };

  const faqJsonLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: [
      {
        "@type": "Question",
        name: `Comment réserver pour ${event.title} avec seulement 5€ ?`,
        acceptedAnswer: {
          "@type": "Answer",
          text: `Avec Culture pour Tous, réservez votre place pour ${event.title} avec un acompte de 5€. Vous recevez immédiatement votre billet avec QR code. Complétez le paiement quand vous voulez avant l'événement.`,
        },
      },
      {
        "@type": "Question",
        name: `Le billet pour ${event.title} est-il valable dès le premier versement ?`,
        acceptedAnswer: {
          "@type": "Answer",
          text: "Oui, votre billet est valable dès le paiement de l'acompte de 5€. Vous pouvez entrer à l'événement même si votre billet n'est pas entièrement soldé.",
        },
      },
      {
        "@type": "Question",
        name: "Comment payer le reste ?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Depuis votre espace personnel, rechargez quand vous voulez, du montant que vous voulez (minimum 1€). Suivez votre progression en temps réel.",
        },
      },
      {
        "@type": "Question",
        name: "Y a-t-il des frais supplémentaires ?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Des frais de gestion de 3% (minimum 0,50€) sont appliqués à chaque transaction. Les frais sont clairement affichés avant le paiement.",
        },
      },
    ],
  };

  const breadcrumbJsonLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Accueil", item: siteUrl },
      { "@type": "ListItem", position: 2, name: "Culture pour Tous", item: `${siteUrl}/culture-pour-tous` },
      { "@type": "ListItem", position: 3, name: event.title, item: `${siteUrl}/culture-pour-tous/${slug}` },
    ],
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }}
      />

      <div className="mx-auto max-w-3xl px-4 py-12 sm:px-6 lg:px-8">
        {/* Breadcrumb */}
        <nav className="mb-8 text-xs text-dta-char/50" aria-label="Fil d'Ariane">
          <ol className="flex items-center gap-1.5">
            <li><Link href="/" className="hover:text-dta-accent">Accueil</Link></li>
            <li>/</li>
            <li><Link href="/culture-pour-tous" className="hover:text-dta-accent">Culture pour Tous</Link></li>
            <li>/</li>
            <li className="text-dta-dark font-medium">{event.title}</li>
          </ol>
        </nav>

        {/* Hero */}
        <header className="mb-10">
          <span className="inline-block rounded-full bg-green-100 px-4 py-1.5 text-xs font-bold uppercase tracking-widest text-green-700">
            Culture pour Tous
          </span>
          <h1 className="mt-4 font-serif text-3xl font-bold leading-tight text-dta-dark sm:text-4xl">
            {event.title} — dès 5&nbsp;&euro;
          </h1>
          <p className="mt-3 text-base text-dta-char/70">
            Réservez votre place dès <strong className="text-dta-dark">5&nbsp;&euro;</strong> et payez à votre rythme.
            Le prix du billet est garanti, même s&apos;il augmente ensuite.
          </p>

          {cptCount > 0 && (
            <p className="mt-3 inline-flex items-center gap-2 rounded-full bg-green-50 px-4 py-2 text-sm font-medium text-green-700">
              <span className="relative flex h-2.5 w-2.5">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-green-400 opacity-75" />
                <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-green-500" />
              </span>
              {cptCount} personne{cptCount > 1 ? "s" : ""} {cptCount > 1 ? "ont" : "a"} déjà réservé avec Culture pour Tous
            </p>
          )}
        </header>

        {/* Event card */}
        <div className="mb-10 overflow-hidden rounded-2xl border border-dta-sand bg-white shadow-[var(--shadow-card)]">
          {event.coverImage && (
            <div className="relative aspect-[21/9]">
              <Image
                src={event.coverImage}
                alt={`${event.title} — ${event.venue}`}
                fill
                className="object-cover"
                sizes="(max-width: 768px) 100vw, 768px"
              />
            </div>
          )}
          <div className="p-6 sm:p-8">
            <div className="flex flex-wrap gap-4 text-sm text-dta-char/70">
              <span className="flex items-center gap-1.5">
                <span className="text-dta-accent">&#128197;</span> {dateStr}
              </span>
              <span className="flex items-center gap-1.5">
                <span className="text-dta-accent">&#128205;</span> {event.venue}, {event.address}
              </span>
            </div>

            <div className="mt-6 rounded-xl border border-green-200 bg-green-50 p-5">
              <div className="flex items-baseline justify-between">
                <div>
                  <p className="text-sm font-semibold text-green-800">
                    Avec Culture pour Tous
                  </p>
                  <p className="mt-1 text-xs text-green-600">
                    Billet à {formatPrice(lowestPrice)} — payez en commençant par 5&nbsp;&euro;
                  </p>
                </div>
                <span className="font-serif text-3xl font-bold text-green-700">5&nbsp;&euro;</span>
              </div>
              <Link
                href={`/saison-culturelle-africaine/${slug}#billetterie`}
                className="mt-4 flex w-full items-center justify-center rounded-[var(--radius-button)] bg-green-600 px-6 py-3 text-sm font-bold text-white transition-colors hover:bg-green-700"
              >
                Réserver dès 5&nbsp;&euro;
              </Link>
              <p className="mt-2 text-center text-xs text-green-600/70">
                Billet immédiat avec QR code. Solde à compléter avant l&apos;événement.
              </p>
            </div>
          </div>
        </div>

        {/* Comment ça marche */}
        <section className="mb-10" aria-labelledby="comment-ca-marche">
          <h2 id="comment-ca-marche" className="mb-6 font-serif text-2xl font-bold text-dta-dark">
            Comment réserver {event.title} dès 5&nbsp;&euro;&nbsp;?
          </h2>
          <ol className="space-y-4">
            <StepItem num={1} title="Choisissez votre billet">
              Sélectionnez votre formule sur la page de l&apos;événement et cliquez sur
              &ldquo;Culture pour Tous&rdquo;.
            </StepItem>
            <StepItem num={2} title="Payez 5&nbsp;&euro; d&apos;acompte">
              Bloquez votre place avec seulement 5&nbsp;&euro;. Vous recevez immédiatement votre
              billet électronique avec QR code.
            </StepItem>
            <StepItem num={3} title="Rechargez à votre rythme">
              Depuis votre espace personnel, versez ce que vous voulez, quand vous voulez
              (minimum 1&nbsp;&euro;). Suivez votre progression en temps réel.
            </StepItem>
            <StepItem num={4} title="Profitez de l&apos;événement">
              Présentez votre QR code à l&apos;entrée. Si le billet n&apos;est pas soldé,
              payez le complément sur place.
            </StepItem>
          </ol>
        </section>

        {/* Exemple concret */}
        <section className="mb-10" aria-labelledby="exemple">
          <div className="rounded-2xl border border-dta-sand bg-gradient-to-r from-dta-dark to-[#2a1a0a] p-8 text-white">
            <h2 id="exemple" className="mb-4 font-serif text-xl font-bold">
              Exemple : {event.title} à {formatPrice(lowestPrice)}
            </h2>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between rounded-lg bg-white/10 px-4 py-2.5">
                <span className="text-white/70">Acompte initial</span>
                <span className="font-bold text-green-400">5&nbsp;&euro;</span>
              </div>
              <div className="flex justify-between rounded-lg bg-white/10 px-4 py-2.5">
                <span className="text-white/70">Recharge libre</span>
                <span className="font-bold text-green-400">+{Math.floor((lowestPrice - 5) / 2)}&nbsp;&euro;</span>
              </div>
              <div className="flex justify-between rounded-lg bg-white/10 px-4 py-2.5">
                <span className="text-white/70">Solde final</span>
                <span className="font-bold text-green-400">+{Math.ceil((lowestPrice - 5) / 2)}&nbsp;&euro;</span>
              </div>
              <div className="flex justify-between rounded-lg border border-green-500/30 bg-green-500/10 px-4 py-3">
                <span className="text-green-300">Total</span>
                <span className="font-bold text-green-400">{formatPrice(lowestPrice)}</span>
              </div>
            </div>
          </div>
        </section>

        {/* FAQ */}
        <section className="mb-10" aria-labelledby="faq">
          <h2 id="faq" className="mb-6 font-serif text-2xl font-bold text-dta-dark">
            Questions fréquentes — {event.title}
          </h2>
          <div className="space-y-3">
            <Faq
              q={`Comment réserver pour ${event.title} avec seulement 5€ ?`}
              a={`Sur la page de ${event.title}, cliquez sur "Culture pour Tous" sous le bouton Réserver. Payez 5€ d'acompte et recevez votre billet immédiatement.`}
            />
            <Faq
              q="Mon billet est-il valable dès le premier versement ?"
              a="Oui ! Dès le paiement de 5€, vous recevez votre billet avec QR code. Vous pouvez entrer à l'événement même si le solde n'est pas complet."
            />
            <Faq
              q="Quel est le montant minimum par recharge ?"
              a="1€ par versement. Rechargez autant de fois que vous voulez depuis votre espace personnel."
            />
            <Faq
              q="Que se passe-t-il si je ne solde pas avant l'événement ?"
              a="Votre billet reste valable. Vous payez le complément à l'entrée le jour J. Aucune pénalité."
            />
            <Faq
              q="Le prix peut-il augmenter ?"
              a="Non. Le prix est garanti au moment de votre réservation. Même si le tarif augmente ensuite, vous payez le prix initial."
            />
          </div>
        </section>

        {/* CTA final */}
        <section className="text-center">
          <Link
            href={`/saison-culturelle-africaine/${slug}#billetterie`}
            className="inline-block rounded-xl bg-green-600 px-8 py-4 text-lg font-bold text-white transition-colors hover:bg-green-700"
          >
            Réserver {event.title} dès 5&nbsp;&euro;
          </Link>
          <p className="mt-3 text-sm text-dta-char/50">
            {event.venue} — {dateStr}
          </p>
          <p className="mt-6 text-xs text-dta-char/40">
            <Link href="/culture-pour-tous" className="underline hover:text-dta-accent">
              En savoir plus sur Culture pour Tous
            </Link>
            {" · "}
            <Link href="/saison-culturelle-africaine" className="underline hover:text-dta-accent">
              Tous les événements
            </Link>
          </p>
        </section>
      </div>
    </>
  );
}

function StepItem({ num, title, children }: { num: number; title: string; children: React.ReactNode }) {
  return (
    <li className="flex gap-4 rounded-xl border border-dta-sand bg-white p-5">
      <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full bg-green-600 text-sm font-bold text-white">
        {num}
      </div>
      <div>
        <h3 className="font-serif text-base font-bold text-dta-dark" dangerouslySetInnerHTML={{ __html: title }} />
        <p className="mt-1 text-sm text-dta-char/70">{children}</p>
      </div>
    </li>
  );
}

function Faq({ q, a }: { q: string; a: string }) {
  return (
    <details className="group rounded-xl border border-dta-sand bg-white">
      <summary className="flex cursor-pointer list-none items-center justify-between px-5 py-4 text-sm font-semibold text-dta-dark">
        {q}
        <span className="ml-2 text-dta-accent transition-transform group-open:rotate-45">+</span>
      </summary>
      <div className="px-5 pb-4 text-sm leading-relaxed text-dta-char/70">{a}</div>
    </details>
  );
}

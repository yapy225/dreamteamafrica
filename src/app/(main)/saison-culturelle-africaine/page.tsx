import Image from "next/image";
import Link from "next/link";
import { Calendar, MapPin, Users, Ticket, ArrowRight, Newspaper, ShoppingBag, Store } from "lucide-react";
import { prisma } from "@/lib/db";
import { formatDate, formatPrice } from "@/lib/utils";
import ExposantButton from "@/components/ExposantButton";

export const revalidate = 60;

const siteUrl = process.env.NEXT_PUBLIC_APP_URL || "https://dreamteamafrica.com";

export const metadata = {
  title: "Saison Culturelle Africaine 2026 — Événements à Paris",
  description:
    "7 événements culturels africains à Paris d'avril à décembre 2026 : festivals, foires, salons. Cinéma, danse, conte, artisanat, gastronomie. Réservez vos places.",
  keywords: [
    "événements africains Paris",
    "saison culturelle africaine 2026",
    "festival africain Paris",
    "foire Afrique Paris",
    "foire d'Afrique Paris 2026",
    "culture africaine Paris",
    "billetterie événements africains",
    "diaspora africaine Paris",
    "sortir à Paris",
    "salon africain Paris",
    "artisanat africain Paris",
    "gastronomie africaine Paris",
    "mode africaine Paris",
    "cinéma africain Paris",
    "festival culturel Paris 2026",
  ],
  openGraph: {
    title: "Saison Culturelle Africaine 2026 — Paris",
    description: "7 rendez-vous exceptionnels célébrant la culture africaine à Paris. Festivals, foires, salons — d'avril à décembre 2026.",
    type: "website",
    url: `${siteUrl}/saison-culturelle-africaine`,
    images: [{ url: `${siteUrl}/og-saison-culturelle.jpg`, width: 1200, height: 630, alt: "Saison Culturelle Africaine 2026 — 7 événements à Paris d'avril à décembre" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Saison Culturelle Africaine 2026 — Paris",
    description: "7 événements culturels africains à Paris. Réservez vos places.",
  },
  alternates: {
    canonical: `${siteUrl}/saison-culturelle-africaine`,
  },
};

export default async function EvenementsPage() {
  const events = await prisma.event.findMany({
    where: { published: true },
    orderBy: { date: "asc" },
    include: { _count: { select: { tickets: true } } },
  });

  const featuredEvent = events[0];
  const upcomingEvents = events.slice(1);

  const venues = new Set(events.map((e) => e.venue));

  function lowestPrice(e: (typeof events)[number]) {
    return Math.min(e.priceEarly, e.priceStd, e.priceVip);
  }

  function capacityPercent(e: (typeof events)[number]) {
    if (!e.capacity || e.capacity === 0) return 0;
    return Math.round((e._count.tickets / e.capacity) * 100);
  }

  function remainingPlaces(e: (typeof events)[number]) {
    if (!e.capacity) return null;
    return Math.max(0, e.capacity - e._count.tickets);
  }

  // Schema.org EventSeries JSON-LD
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "EventSeries",
    name: "Saison Culturelle Africaine 2026",
    description: "7 événements culturels africains à Paris d'avril à décembre 2026",
    organizer: {
      "@type": "Organization",
      name: "Dream Team Africa",
      url: siteUrl,
      sameAs: [
        "https://www.facebook.com/dreamteamafrica",
        "https://www.instagram.com/dreamteamafrica",
        "https://www.tiktok.com/@dreamteamafrica",
      ],
    },
    location: { "@type": "City", name: "Paris", addressCountry: "FR" },
    startDate: events[0]?.date.toISOString(),
    endDate: events[events.length - 1]?.date.toISOString(),
    subEvent: events.map((e) => ({
      "@type": "Event",
      name: e.title,
      startDate: e.date.toISOString(),
      endDate: e.endDate ? e.endDate.toISOString() : e.date.toISOString(),
      eventStatus: "https://schema.org/EventScheduled",
      eventAttendanceMode: "https://schema.org/OfflineEventAttendanceMode",
      url: `${siteUrl}/saison-culturelle-africaine/${e.slug}`,
      location: { "@type": "Place", name: e.venue, address: { "@type": "PostalAddress", streetAddress: e.address } },
      ...(e.coverImage && { image: e.coverImage }),
      performer: { "@type": "Organization", name: "Dream Team Africa" },
      offers: {
        "@type": "AggregateOffer",
        lowPrice: lowestPrice(e),
        priceCurrency: "EUR",
        url: `${siteUrl}/saison-culturelle-africaine/${e.slug}`,
        validFrom: e.createdAt ? e.createdAt.toISOString() : "2026-01-01T00:00:00Z",
        availability: remaining(e) > 0 ? "https://schema.org/InStock" : "https://schema.org/SoldOut",
      },
    })),
  };

  // Recent articles for cross-linking
  const recentArticles = await prisma.article.findMany({
    where: { status: "PUBLISHED" },
    select: { title: true, slug: true, category: true },
    orderBy: { publishedAt: "desc" },
    take: 4,
  });

  function remaining(e: (typeof events)[number]) {
    if (!e.capacity) return e.capacity;
    return Math.max(0, e.capacity - e._count.tickets);
  }

  return (
    <>
    <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />

    <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
      {/* Breadcrumb */}
      <nav aria-label="Fil d'Ariane" className="mb-8">
        <ol className="flex flex-wrap items-center gap-1.5 text-sm text-dta-taupe" itemScope itemType="https://schema.org/BreadcrumbList">
          <li itemProp="itemListElement" itemScope itemType="https://schema.org/ListItem">
            <Link href="/" itemProp="item" className="hover:text-dta-accent">
              <span itemProp="name">Accueil</span>
            </Link>
            <meta itemProp="position" content="1" />
          </li>
          <li className="text-dta-sand">/</li>
          <li itemProp="itemListElement" itemScope itemType="https://schema.org/ListItem">
            <span itemProp="name" aria-current="page" className="font-medium text-dta-dark">Saison Culturelle Africaine</span>
            <meta itemProp="position" content="2" />
          </li>
        </ol>
      </nav>

      {/* ── A. Page Header ─────────────────────────────── */}
      <div className="mb-14 text-center">
        <h1 className="font-serif text-4xl font-bold text-dta-dark sm:text-5xl">
          Saison Culturelle Africaine
        </h1>
        <h2 className="mt-2 font-serif text-2xl text-dta-accent">
          Paris 2026
        </h2>
        <span className="mt-4 inline-block rounded-[var(--radius-full)] bg-dta-accent/10 px-4 py-1.5 text-sm font-medium text-dta-accent">
          {events.length} événement{events.length > 1 ? "s" : ""} · Avril —
          Décembre 2026
        </span>
        <p className="mx-auto mt-4 max-w-2xl text-lg text-dta-char/70">
          {events.length} rendez-vous exceptionnels célébrant la richesse
          culturelle africaine à Paris. Réservez vos places.
        </p>
      </div>

      {/* ── B. Featured Event Hero + Sidebar ─────────────── */}
      {featuredEvent && (
        <div className="mb-14">
          <div className="group rounded-[var(--radius-card)] bg-white shadow-[var(--shadow-card)] transition-all duration-300 hover:shadow-[var(--shadow-card-hover)]">
            <div className="grid grid-cols-1 md:grid-cols-2">
              {/* Image */}
              <Link href={`/saison-culturelle-africaine/${featuredEvent.slug}`}>
                <div className="relative aspect-square overflow-hidden rounded-t-[var(--radius-card)] bg-gradient-to-br from-dta-accent/20 to-dta-sand md:aspect-auto md:min-h-[400px] md:rounded-l-[var(--radius-card)] md:rounded-tr-none">
                  {featuredEvent.coverImage && (
                    <Image
                      src={featuredEvent.coverImage}
                      alt={featuredEvent.title}
                      fill
                      className="object-cover"
                      sizes="(max-width: 1024px) 100vw, 50vw"
                      priority
                    />
                  )}
                </div>
              </Link>

              {/* Details */}
              <div className="flex flex-col justify-center p-8">
                {/* Date badge */}
                <div className="mb-4 flex items-center gap-3">
                  <span className="rounded-[var(--radius-full)] bg-dta-accent px-3 py-1 text-xs font-semibold text-white">
                    Prochain événement
                  </span>
                  <span className="rounded-[var(--radius-button)] bg-dta-accent/10 px-3 py-2 text-center">
                    <span className="block text-xs font-semibold uppercase text-dta-accent">
                      {new Date(featuredEvent.date).toLocaleDateString("fr-FR", {
                        month: "short",
                      })}
                    </span>
                    <span className="block font-serif text-2xl font-bold text-dta-dark">
                      {new Date(featuredEvent.date).getDate()}
                    </span>
                  </span>
                </div>

                <Link href={`/saison-culturelle-africaine/${featuredEvent.slug}`}>
                  <h2 className="font-serif text-2xl font-bold leading-tight text-dta-dark transition-colors group-hover:text-dta-accent sm:text-3xl">
                    {featuredEvent.title}
                  </h2>
                </Link>

                <p className="mt-3 line-clamp-3 text-sm leading-relaxed text-dta-char/70">
                  {featuredEvent.description}
                </p>

                {/* Metadata */}
                <div className="mt-5 flex flex-wrap items-center gap-4 text-sm text-dta-taupe">
                  <span className="flex items-center gap-1.5">
                    <MapPin size={15} />
                    {featuredEvent.venue}
                  </span>
                  <span className="flex items-center gap-1.5">
                    <Calendar size={15} />
                    {formatDate(featuredEvent.date)}
                  </span>
                </div>

                {/* Price */}
                <p className="mt-5 text-sm text-dta-char/70">
                  À partir de{" "}
                  <span className="font-serif text-lg font-bold text-dta-accent">
                    {formatPrice(lowestPrice(featuredEvent))}
                  </span>
                </p>

                {/* Capacity bar */}
                {featuredEvent.showCapacity && featuredEvent.capacity > 0 && (
                  <div className="mt-4">
                    <div className="mb-1.5 flex items-center justify-between text-xs text-dta-taupe">
                      <span className="flex items-center gap-1">
                        <Users size={13} />
                        {remainingPlaces(featuredEvent)} places restantes
                      </span>
                      <span>{capacityPercent(featuredEvent)}% réservé</span>
                    </div>
                    <div className="h-2 w-full overflow-hidden rounded-[var(--radius-full)] bg-dta-beige">
                      <div
                        className="h-full rounded-[var(--radius-full)] bg-dta-accent transition-all"
                        style={{
                          width: `${Math.min(capacityPercent(featuredEvent), 100)}%`,
                        }}
                      />
                    </div>
                  </div>
                )}

                {/* CTA — side by side */}
                <div className="mt-6 flex items-center gap-3">
                  <Link
                    href={`/saison-culturelle-africaine/${featuredEvent.slug}`}
                    className="inline-flex items-center gap-2 rounded-[var(--radius-button)] bg-dta-accent px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-dta-accent-dark"
                  >
                    Réserver
                    <Ticket size={15} />
                  </Link>
                  <ExposantButton
                    eventName={featuredEvent.title}
                    className="inline-flex items-center gap-2 rounded-[var(--radius-button)] bg-dta-accent px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-dta-accent-dark"
                    size={15}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ── C. Upcoming Events Grid ────────────────────── */}
      {upcomingEvents.length > 0 && (
        <>
          <h3 className="mb-6 font-serif text-2xl font-bold text-dta-dark">
            Prochains événements
          </h3>
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {upcomingEvents.map((event) => (
              <div
                key={event.id}
                className="group rounded-[var(--radius-card)] bg-white shadow-[var(--shadow-card)] transition-all duration-300 hover:-translate-y-1 hover:shadow-[var(--shadow-card-hover)]"
              >
                {/* Cover image with date badge overlay */}
                <Link href={`/saison-culturelle-africaine/${event.slug}`}>
                  <div className="relative aspect-square overflow-hidden rounded-t-[var(--radius-card)] bg-gradient-to-br from-dta-beige to-dta-sand">
                    {event.coverImage && (
                      <Image
                        src={event.coverImage}
                        alt={event.title}
                        fill
                        className="object-cover transition-transform duration-300 group-hover:scale-105"
                        sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                      />
                    )}
                    {/* Date badge on image */}
                    <div className="absolute left-3 top-3 rounded-[var(--radius-button)] bg-white/90 px-3 py-1.5 text-center shadow-sm backdrop-blur-sm">
                      <span className="block text-xs font-semibold uppercase text-dta-accent">
                        {new Date(event.date).toLocaleDateString("fr-FR", {
                          month: "short",
                        })}
                      </span>
                      <span className="block font-serif text-xl font-bold text-dta-dark">
                        {new Date(event.date).getDate()}
                      </span>
                    </div>
                  </div>
                </Link>

                <div className="p-5">
                  <Link href={`/saison-culturelle-africaine/${event.slug}`}>
                    <h3 className="font-serif text-lg font-semibold leading-snug text-dta-dark transition-colors group-hover:text-dta-accent">
                      {event.title}
                    </h3>
                    <p className="mt-2 line-clamp-2 text-sm text-dta-char/70">
                      {event.description}
                    </p>

                    {/* Venue + date */}
                    <div className="mt-3 flex flex-wrap items-center gap-3 text-xs text-dta-taupe">
                      <span className="flex items-center gap-1">
                        <MapPin size={13} />
                        {event.venue}
                      </span>
                      <span className="flex items-center gap-1">
                        <Calendar size={13} />
                        {formatDate(event.date)}
                      </span>
                    </div>

                    {/* Price + remaining */}
                    <div className="mt-4 flex items-center justify-between">
                      <p className="text-xs text-dta-char/70">
                        À partir de{" "}
                        <span className="font-serif text-base font-bold text-dta-accent">
                          {formatPrice(lowestPrice(event))}
                        </span>
                      </p>
                      {event.showCapacity && event.capacity > 0 && (
                        <span className="flex items-center gap-1 rounded-[var(--radius-full)] bg-dta-beige px-2.5 py-1 text-xs font-medium text-dta-char">
                          <Ticket size={12} />
                          {remainingPlaces(event)} places
                        </span>
                      )}
                    </div>

                    {/* Capacity bar */}
                    {event.showCapacity && event.capacity > 0 && (
                      <div className="mt-3 h-1.5 w-full overflow-hidden rounded-[var(--radius-full)] bg-dta-beige">
                        <div
                          className="h-full rounded-[var(--radius-full)] bg-dta-accent/70 transition-all"
                          style={{
                            width: `${Math.min(capacityPercent(event), 100)}%`,
                          }}
                        />
                      </div>
                    )}
                  </Link>

                  {/* Buttons — side by side */}
                  <div className="mt-4 flex items-center gap-2">
                    <Link
                      href={`/saison-culturelle-africaine/${event.slug}`}
                      className="inline-flex flex-1 items-center justify-center gap-1.5 rounded-[var(--radius-button)] bg-dta-accent px-3 py-2 text-xs font-semibold text-white transition-colors hover:bg-dta-accent-dark"
                    >
                      <Ticket size={13} />
                      Réserver
                    </Link>
                    <ExposantButton eventName={event.title} />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </>
      )}

      {/* ── D. Info Strip ──────────────────────────────── */}
      <div className="mt-16 grid grid-cols-1 gap-4 rounded-[var(--radius-card)] bg-dta-beige/50 p-6 sm:grid-cols-3 sm:gap-6 sm:p-8">
        <div className="flex items-center gap-3 text-center sm:flex-col">
          <div className="flex h-10 w-10 items-center justify-center rounded-[var(--radius-full)] bg-dta-accent/10 sm:h-12 sm:w-12">
            <Calendar size={20} className="text-dta-accent" />
          </div>
          <div>
            <p className="font-serif text-2xl font-bold text-dta-dark">
              {events.length}
            </p>
            <p className="text-xs text-dta-taupe">Événements</p>
          </div>
        </div>
        <div className="flex items-center gap-3 text-center sm:flex-col">
          <div className="flex h-10 w-10 items-center justify-center rounded-[var(--radius-full)] bg-dta-accent/10 sm:h-12 sm:w-12">
            <MapPin size={20} className="text-dta-accent" />
          </div>
          <div>
            <p className="font-serif text-2xl font-bold text-dta-dark">
              {venues.size}
            </p>
            <p className="text-xs text-dta-taupe">Lieux à Paris</p>
          </div>
        </div>
        <div className="flex items-center gap-3 text-center sm:flex-col">
          <div className="flex h-10 w-10 items-center justify-center rounded-[var(--radius-full)] bg-dta-accent/10 sm:h-12 sm:w-12">
            <Ticket size={20} className="text-dta-accent" />
          </div>
          <div>
            <p className="font-serif text-2xl font-bold text-dta-dark">
              Avr — Déc
            </p>
            <p className="text-xs text-dta-taupe">Saison 2026</p>
          </div>
        </div>
      </div>

      {/* ── E. Cross-links — Maillage interne ────────── */}
      <div className="mt-16 border-t border-dta-sand pt-12">
        <div className="grid grid-cols-1 gap-8 sm:grid-cols-3">
          {/* Link to exposants */}
          <div>
            <div className="mb-3 flex items-center gap-2">
              <Store size={18} className="text-dta-accent" />
              <h3 className="font-serif text-lg font-bold text-dta-dark">Devenir exposant</h3>
            </div>
            <p className="mb-3 text-sm text-dta-char/70">
              R&eacute;servez votre stand pour la saison 2026. &Agrave; partir de 50&euro; d&apos;acompte.
            </p>
            <Link
              href="/billetterie-exposants"
              className="mt-3 inline-flex items-center gap-1 text-sm font-medium text-dta-accent hover:text-dta-accent-dark"
            >
              Voir les packs exposants <ArrowRight size={14} />
            </Link>
          </div>

          {/* Link to marketplace */}
          <div>
            <div className="mb-3 flex items-center gap-2">
              <ShoppingBag size={18} className="text-dta-accent" />
              <h3 className="font-serif text-lg font-bold text-dta-dark">Made in Africa</h3>
            </div>
            <p className="mb-3 text-sm text-dta-char/70">
              D&eacute;couvrez notre s&eacute;lection d&apos;artisanat africain authentique.
            </p>
            <Link
              href="/made-in-africa"
              className="inline-flex items-center gap-1 text-sm font-medium text-dta-accent hover:text-dta-accent-dark"
            >
              Explorer la marketplace <ArrowRight size={14} />
            </Link>
          </div>

          {/* Link to exposants */}
          <div>
            <div className="mb-3 flex items-center gap-2">
              <Store size={18} className="text-dta-accent" />
              <h3 className="font-serif text-lg font-bold text-dta-dark">Devenir exposant</h3>
            </div>
            <p className="mb-3 text-sm text-dta-char/70">
              R&eacute;servez votre stand pour la Foire d&apos;Afrique Paris et les salons de la saison.
            </p>
            <Link
              href="/exposants"
              className="inline-flex items-center gap-1 text-sm font-medium text-dta-accent hover:text-dta-accent-dark"
            >
              En savoir plus <ArrowRight size={14} />
            </Link>
          </div>
        </div>
      </div>

      {/* ── E2. FAQ — Schema.org FAQPage ──────────────── */}
      {(() => {
        const faqItems = [
          {
            question: "Qu'est-ce que la Saison Culturelle Africaine ?",
            answer: "La Saison Culturelle Africaine est un programme de 7 événements culturels organisés à Paris par Dream Team Africa, d'avril à décembre 2026. Foires, festivals, salons : cinéma, danse, conte, artisanat, gastronomie et mode africaine.",
          },
          {
            question: "Où se déroulent les événements de la Saison Culturelle Africaine ?",
            answer: "Les événements se déroulent dans différents lieux emblématiques de Paris et sa région : Espace MAS (Paris 13e), et d'autres salles parisiennes. Chaque événement a son propre lieu.",
          },
          {
            question: "Comment acheter des billets pour les événements ?",
            answer: "Vous pouvez acheter vos billets directement sur dreamteamafrica.com. Le paiement est sécurisé par Stripe. Vous recevrez une confirmation par e-mail et WhatsApp avec un QR code à présenter à l'entrée.",
          },
          {
            question: "Y a-t-il des événements gratuits ?",
            answer: "Oui, certains événements de la Saison Culturelle Africaine sont gratuits sur réservation. Consultez la page de chaque événement pour connaître les tarifs et réserver votre place.",
          },
          {
            question: "Comment devenir exposant ?",
            answer: "Les artisans, créateurs et marques peuvent réserver un stand lors de la Foire d'Afrique Paris ou du Salon Made In Africa. Rendez-vous sur la page Exposants de dreamteamafrica.com pour découvrir les offres.",
          },
          {
            question: "Comment contacter Dream Team Africa ?",
            answer: "Vous pouvez nous contacter par e-mail à hello@dreamteamafrica.com, par téléphone au +33 7 82 80 18 52, ou via la page Contact de notre site.",
          },
        ];

        const faqJsonLd = {
          "@context": "https://schema.org",
          "@type": "FAQPage",
          mainEntity: faqItems.map((item) => ({
            "@type": "Question",
            name: item.question,
            acceptedAnswer: {
              "@type": "Answer",
              text: item.answer,
            },
          })),
        };

        return (
          <div className="mt-16">
            <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }} />
            <h3 className="mb-6 font-serif text-2xl font-bold text-dta-dark">
              Questions fréquentes
            </h3>
            <dl className="space-y-4">
              {faqItems.map((item, idx) => (
                <div key={idx} className="rounded-[var(--radius-card)] bg-white p-5 shadow-[var(--shadow-card)]">
                  <dt className="text-sm font-semibold text-dta-dark">{item.question}</dt>
                  <dd className="mt-2 text-sm leading-relaxed text-dta-char/70">{item.answer}</dd>
                </div>
              ))}
            </dl>
          </div>
        );
      })()}

      {/* ── F. Footer CTA ─────────────────────────────── */}
      <div className="mt-12 text-center">
        <p className="text-sm text-dta-char/70">
          Des questions ?{" "}
          <Link
            href="/nous-contacter"
            className="font-medium text-dta-accent underline underline-offset-2 hover:text-dta-accent-dark"
          >
            Contactez-nous
          </Link>
        </p>
      </div>

    </div>
    </>
  );
}

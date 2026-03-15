import Image from "next/image";
import Link from "next/link";
import Script from "next/script";
import { notFound } from "next/navigation";
import { Calendar, MapPin, Users, Clock, ArrowLeft, ArrowRight, ExternalLink, Film, Music, Mic2, Newspaper, Store } from "lucide-react";
import { prisma } from "@/lib/db";
import { formatDate, formatPrice } from "@/lib/utils";
import TicketSelector from "./TicketSelector";
import TicketSectionClient from "./TicketSectionClient";
import FreeReservationForm from "@/components/events/FreeReservationForm";
import SocialProofBanner from "./SocialProofBanner";
import ShareButton from "./ShareButton";

const FREE_EVENT_IDS = [
  "cmm767c1m0008ti7933a7kqoq", // Festival de l'Autre Culture
  "cmm767c1m0007ti79g90z3vdf", // FICA
];

export const revalidate = 60;



const siteUrl = process.env.NEXT_PUBLIC_APP_URL || "https://dreamteamafrica.com";

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const event = await prisma.event.findUnique({ where: { slug } });
  if (!event) return { title: "Événement introuvable" };
  const description = event.description.slice(0, 160);
  return {
    title: `${event.title} — Saison Culturelle Africaine 2026`,
    description,
    keywords: [event.title, "événement africain Paris", event.venue, "saison culturelle africaine 2026", "billetterie"],
    openGraph: {
      title: event.title,
      description,
      type: "website",
      url: `${siteUrl}/saison-culturelle-africaine/${slug}`,
      ...(event.coverImage && { images: [{ url: event.coverImage, width: 1200, height: 630, alt: event.title }] }),
    },
    twitter: {
      card: "summary_large_image",
      title: event.title,
      description,
      ...(event.coverImage && { images: [event.coverImage] }),
    },
    alternates: {
      canonical: `${siteUrl}/saison-culturelle-africaine/${slug}`,
    },
  };
}

export default async function EventDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const event = await prisma.event.findUnique({
    where: { slug },
    include: {
      _count: { select: { tickets: true, reservations: true } },
    },
  });

  if (!event) notFound();

  const isFreeEvent = FREE_EVENT_IDS.includes(event.id);
  const soldCount = isFreeEvent ? event._count.reservations + event._count.tickets : event._count.tickets;
  const remaining = event.capacity - soldCount;
  const soldOut = remaining <= 0;
  const progressPercent = Math.min(100, Math.round((soldCount / event.capacity) * 100));

  const customTiers = event.tiers as Array<{ id: string; name: string; price: number; description: string; features: string[]; highlight: boolean; quota?: number; onSiteOnly?: boolean; soldOffset?: number }> | null;

  // Count tickets sold per tier for quota tracking
  const ticketsByTier = await prisma.ticket.groupBy({
    by: ["tier"],
    where: { eventId: event.id },
    _count: true,
  });
  const soldByTier: Record<string, number> = {};
  for (const t of ticketsByTier) {
    soldByTier[t.tier] = t._count;
  }

  const tiers = Array.isArray(customTiers) && customTiers.length > 0
    ? customTiers.map((t) => ({
        id: t.id as "EARLY_BIRD" | "STANDARD" | "VIP",
        name: t.name,
        price: t.price,
        description: t.description,
        features: t.features,
        highlight: t.highlight,
        quota: t.quota ?? null,
        sold: (soldByTier[t.id] ?? 0) + (t.soldOffset ?? 0),
        onSiteOnly: t.onSiteOnly ?? false,
      }))
    : [
        { id: "EARLY_BIRD" as const, name: "Early Bird", price: event.priceEarly, description: "Accès général — Tarif réduit pour les premiers acheteurs", features: ["Accès à l'événement", "Badge nominatif"], highlight: false, quota: null as number | null, sold: soldByTier["EARLY_BIRD"] ?? 0 },
        { id: "STANDARD" as const, name: "Standard", price: event.priceStd, description: "Accès complet à l'événement avec avantages inclus", features: ["Accès à l'événement", "Badge nominatif", "Programme officiel", "Accès au networking"], highlight: true, quota: null as number | null, sold: soldByTier["STANDARD"] ?? 0 },
        { id: "VIP" as const, name: "VIP", price: event.priceVip, description: "L'expérience premium avec accès exclusif et privilèges", features: ["Accès prioritaire", "Badge VIP nominatif", "Programme officiel", "Accès backstage", "Cocktail privé", "Place réservée"], highlight: false, quota: null as number | null, sold: soldByTier["VIP"] ?? 0 },
      ];

  const eventDate = new Date(event.date);
  const endDate = event.endDate ? new Date(event.endDate) : null;
  const multiVenues = event.venues as Array<{ name: string; address: string }> | null;
  const mapsUrl = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(event.venue + " " + event.address)}`;

  // Other events for internal linking
  const otherEvents = await prisma.event.findMany({
    where: { published: true, id: { not: event.id } },
    select: { title: true, slug: true, date: true, venue: true, coverImage: true, priceEarly: true, priceStd: true, priceVip: true },
    orderBy: { date: "asc" },
    take: 4,
  });

  // Related articles for cross-linking
  const relatedArticles = await prisma.article.findMany({
    where: { status: "PUBLISHED" },
    select: { title: true, slug: true },
    orderBy: { views: "desc" },
    take: 3,
  });

  const eventUrl = `${siteUrl}/saison-culturelle-africaine/${event.slug}`;
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Event",
    name: event.title,
    description: event.description,
    startDate: event.date.toISOString(),
    endDate: event.endDate ? event.endDate.toISOString() : event.date.toISOString(),
    eventStatus: "https://schema.org/EventScheduled",
    eventAttendanceMode: "https://schema.org/OfflineEventAttendanceMode",
    url: eventUrl,
    location: Array.isArray(multiVenues) && multiVenues.length > 1
      ? multiVenues.map((v) => ({
          "@type": "Place",
          name: v.name,
          address: { "@type": "PostalAddress", streetAddress: v.address },
        }))
      : {
          "@type": "Place",
          name: event.venue,
          address: { "@type": "PostalAddress", streetAddress: event.address },
        },
    ...(event.coverImage && { image: event.coverImage }),
    performer: { "@type": "Organization", name: "Dream Team Africa" },
    offers: isFreeEvent
      ? {
          "@type": "Offer",
          price: 0,
          priceCurrency: "EUR",
          url: eventUrl,
          validFrom: event.createdAt ? event.createdAt.toISOString() : "2026-01-01T00:00:00Z",
          availability: soldOut ? "https://schema.org/SoldOut" : "https://schema.org/InStock",
        }
      : {
          "@type": "AggregateOffer",
          lowPrice: Math.min(event.priceEarly, event.priceStd, event.priceVip),
          highPrice: Math.max(event.priceEarly, event.priceStd, event.priceVip),
          priceCurrency: "EUR",
          url: eventUrl,
          validFrom: event.createdAt ? event.createdAt.toISOString() : "2026-01-01T00:00:00Z",
          availability: soldOut ? "https://schema.org/SoldOut" : "https://schema.org/InStock",
        },
    organizer: { "@type": "Organization", name: "Dream Team Africa", url: siteUrl },
  };

  return (
    <>
      <Script id="fb-viewcontent" strategy="afterInteractive">{`
        if(typeof fbq==='function'){
          fbq('track','ViewContent',{content_name:'${event.title.replace(/'/g, "\\'")}',content_type:'product',content_ids:['${event.id}'],value:${event.priceEarly},currency:'EUR'});
        }
        window.dataLayer=window.dataLayer||[];
        window.dataLayer.push({event:'view_item',ecommerce:{items:[{item_name:'${event.title.replace(/'/g, "\\'")}',item_category:'Evenement',price:${event.priceEarly}}]}});
      `}</Script>
    <div>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      {/* A — Navigation Bar */}
      <div className="sticky top-0 z-30 border-b border-dta-sand/50 bg-white/80 backdrop-blur-md">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3 sm:px-6 lg:px-8">
          <Link
            href="/saison-culturelle-africaine"
            className="flex items-center gap-2 text-sm font-medium text-dta-char transition-colors hover:text-dta-accent"
          >
            <ArrowLeft size={16} />
            Retour aux événements
          </Link>
          <ShareButton />
        </div>
      </div>

      {/* Breadcrumb */}
      <nav aria-label="Fil d'Ariane" className="mx-auto max-w-7xl px-4 pt-3 sm:px-6 lg:px-8">
        <ol className="flex flex-wrap items-center gap-1.5 text-xs text-dta-taupe" itemScope itemType="https://schema.org/BreadcrumbList">
          <li itemProp="itemListElement" itemScope itemType="https://schema.org/ListItem">
            <Link href="/" itemProp="item" className="hover:text-dta-accent">
              <span itemProp="name">Accueil</span>
            </Link>
            <meta itemProp="position" content="1" />
          </li>
          <li className="text-dta-sand">/</li>
          <li itemProp="itemListElement" itemScope itemType="https://schema.org/ListItem">
            <Link href="/saison-culturelle-africaine" itemProp="item" className="hover:text-dta-accent">
              <span itemProp="name">Saison Culturelle</span>
            </Link>
            <meta itemProp="position" content="2" />
          </li>
          <li className="text-dta-sand">/</li>
          <li itemProp="itemListElement" itemScope itemType="https://schema.org/ListItem">
            <span itemProp="name" className="line-clamp-1 max-w-[200px] font-medium text-dta-dark">
              {event.title}
            </span>
            <meta itemProp="position" content="3" />
          </li>
        </ol>
      </nav>

      {/* B — Immersive Hero */}
      <div className="relative flex min-h-[70vh] items-end bg-dta-dark">
        {event.coverImage ? (
          <Image
            src={event.coverImage}
            alt={event.title}
            fill
            className="object-cover opacity-60"
            priority
          />
        ) : (
          <div className="absolute inset-0 opacity-10">
            <div className="h-full w-full bg-[radial-gradient(ellipse_at_bottom_left,_var(--color-dta-accent)_0%,_transparent_60%)]" />
          </div>
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-dta-dark via-dta-dark/50 to-transparent" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom_left,_var(--color-dta-accent)_0%,_transparent_50%)] opacity-15" />

        <div className="relative w-full px-4 pb-12 pt-24 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-7xl">
            <div className="flex items-end gap-6">
              <div className="hidden flex-shrink-0 rounded-[var(--radius-card)] bg-white/10 px-6 py-5 text-center backdrop-blur-sm sm:block">
                <span className="block text-sm font-bold uppercase tracking-wider text-dta-accent">
                  {eventDate.toLocaleDateString("fr-FR", { month: "short" })}
                </span>
                <span className="block font-serif text-5xl font-bold text-white">
                  {eventDate.getDate()}
                </span>
              </div>
              <div className="flex-1">
                <h1 className="font-serif text-4xl font-bold leading-tight text-white sm:text-5xl lg:text-6xl">
                  {event.title}
                </h1>
                <div className="mt-5 flex flex-wrap gap-x-6 gap-y-2 text-sm text-dta-sand/90">
                  <span className="flex items-center gap-2">
                    <Calendar size={16} className="text-dta-accent" />
                    {formatDate(event.date)}
                    {endDate && ` — ${formatDate(endDate)}`}
                  </span>
                  <span className="flex items-center gap-2">
                    <Clock size={16} className="text-dta-accent" />
                    {eventDate.toLocaleTimeString("fr-FR", { hour: "2-digit", minute: "2-digit" })}
                  </span>
                  {Array.isArray(multiVenues) && multiVenues.length > 1 ? (
                    multiVenues.map((v, idx) => (
                      <span key={idx} className="flex items-center gap-2">
                        <MapPin size={16} className="text-dta-accent" />
                        {v.name}
                      </span>
                    ))
                  ) : (
                    <span className="flex items-center gap-2">
                      <MapPin size={16} className="text-dta-accent" />
                      {event.venue}
                    </span>
                  )}
                  {event.showCapacity && (
                    <span className="flex items-center gap-2">
                      <Users size={16} className="text-dta-accent" />
                      {remaining > 0 ? `${remaining} places restantes` : "Complet"}
                    </span>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* C — Quick-Info Strip */}
      <div className="border-b border-dta-sand/50 bg-white shadow-sm">
        <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-[var(--radius-button)] bg-dta-accent/10">
                <Calendar size={18} className="text-dta-accent" />
              </div>
              <div>
                <p className="text-xs text-dta-taupe">Date</p>
                <p className="text-sm font-medium text-dta-dark">{formatDate(event.date)}</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-[var(--radius-button)] bg-dta-accent/10">
                <Clock size={18} className="text-dta-accent" />
              </div>
              <div>
                <p className="text-xs text-dta-taupe">Heure</p>
                <p className="text-sm font-medium text-dta-dark">
                  {eventDate.toLocaleTimeString("fr-FR", { hour: "2-digit", minute: "2-digit" })}
                </p>
              </div>
            </div>
            {Array.isArray(multiVenues) && multiVenues.length > 1 ? (
              multiVenues.map((v, idx) => (
                <div key={idx} className="flex items-center gap-3">
                  <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-[var(--radius-button)] bg-dta-accent/10">
                    <MapPin size={18} className="text-dta-accent" />
                  </div>
                  <div>
                    <p className="text-xs text-dta-taupe">Lieu {idx + 1}</p>
                    <p className="text-sm font-medium text-dta-dark">{v.name}</p>
                  </div>
                </div>
              ))
            ) : (
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-[var(--radius-button)] bg-dta-accent/10">
                  <MapPin size={18} className="text-dta-accent" />
                </div>
                <div>
                  <p className="text-xs text-dta-taupe">Lieu</p>
                  <p className="text-sm font-medium text-dta-dark">{event.venue}</p>
                </div>
              </div>
            )}
            {event.showCapacity && (
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-[var(--radius-button)] bg-dta-accent/10">
                  <Users size={18} className="text-dta-accent" />
                </div>
                <div>
                  <p className="text-xs text-dta-taupe">Places</p>
                  <p className="text-sm font-medium text-dta-dark">
                    {remaining > 0 ? `${remaining} restantes` : "Complet"}
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* D — Content Body */}
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-10 lg:grid-cols-5">
          {/* Left — About */}
          <div className="lg:col-span-3">
            <div className="rounded-[var(--radius-card)] bg-white p-8 shadow-[var(--shadow-card)]">
              <h2 className="font-serif text-2xl font-bold text-dta-dark">À propos</h2>
              <div className="mt-4 whitespace-pre-line text-sm leading-relaxed text-dta-char/80">
                {event.description}
              </div>
            </div>
          </div>

          {/* Right — Venue */}
          <div className="space-y-6 lg:col-span-2">
            <div className="rounded-[var(--radius-card)] bg-white p-8 shadow-[var(--shadow-card)]">
              <h2 className="font-serif text-2xl font-bold text-dta-dark">
                {Array.isArray(multiVenues) && multiVenues.length > 1 ? "Lieux" : "Lieu"}
              </h2>
              {Array.isArray(multiVenues) && multiVenues.length > 1 ? (
                <div className="mt-4 space-y-5">
                  {multiVenues.map((v, idx) => (
                    <div key={idx} className={idx > 0 ? "border-t border-dta-sand/50 pt-5" : ""}>
                      <p className="font-medium text-dta-dark">{v.name}</p>
                      <p className="mt-1 text-sm text-dta-char/70">{v.address}</p>
                      <a
                        href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(v.name + " " + v.address)}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="mt-3 inline-flex items-center gap-2 rounded-[var(--radius-button)] bg-dta-beige px-4 py-2.5 text-sm font-medium text-dta-dark transition-colors hover:bg-dta-sand"
                      >
                        <ExternalLink size={14} />
                        Google Maps
                      </a>
                    </div>
                  ))}
                </div>
              ) : (
              <div className="mt-4">
                <p className="font-medium text-dta-dark">{event.venue}</p>
                <p className="mt-1 text-sm text-dta-char/70">{event.address}</p>
                <a
                  href={mapsUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-4 inline-flex items-center gap-2 rounded-[var(--radius-button)] bg-dta-beige px-4 py-2.5 text-sm font-medium text-dta-dark transition-colors hover:bg-dta-sand"
                >
                  <ExternalLink size={14} />
                  Voir sur Google Maps
                </a>
              </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* D2 — Programmation */}
      {Array.isArray(event.program) && event.program.length > 0 && (() => {
        const items = event.program as Array<{
          date: string; time: string; venue: string; address: string;
          type: string; title: string; director: string; synopsis: string;
          pricing: string; note: string;
        }>;
        // Group by date
        const grouped = items.reduce<Record<string, typeof items>>((acc, item) => {
          const key = item.date || "other";
          if (!acc[key]) acc[key] = [];
          acc[key].push(item);
          return acc;
        }, {});

        function typeIcon(type: string) {
          if (type.toLowerCase().includes("concert")) return <Music size={18} className="text-dta-accent" />;
          if (type.toLowerCase().includes("conférence") || type.toLowerCase().includes("table")) return <Mic2 size={18} className="text-dta-accent" />;
          return <Film size={18} className="text-dta-accent" />;
        }

        function formatProgramDate(dateStr: string) {
          if (!dateStr) return "";
          const d = new Date(dateStr + "T12:00:00");
          return d.toLocaleDateString("fr-FR", { weekday: "long", day: "numeric", month: "long", year: "numeric" });
        }

        return (
          <div className="bg-dta-bg py-16">
            <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
              <div className="text-center">
                <h2 className="font-serif text-3xl font-bold text-dta-dark">Programmation</h2>
                <p className="mt-2 text-sm text-dta-char/70">
                  Le programme détaillé de l&apos;événement
                </p>
              </div>

              <div className="mt-10 space-y-10">
                {Object.entries(grouped).map(([dateKey, dayItems]) => (
                  <div key={dateKey}>
                    {/* Day header */}
                    <div className="mb-6 flex items-center gap-3">
                      <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-[var(--radius-button)] bg-dta-accent/10">
                        <Calendar size={18} className="text-dta-accent" />
                      </div>
                      <h3 className="font-serif text-xl font-bold capitalize text-dta-dark">
                        {formatProgramDate(dateKey)}
                      </h3>
                    </div>

                    <div className="space-y-6">
                      {dayItems.map((item, idx) => (
                        <div
                          key={idx}
                          className="rounded-[var(--radius-card)] bg-white p-6 shadow-[var(--shadow-card)] sm:p-8"
                        >
                          <div className="flex flex-col gap-6 sm:flex-row">
                            {/* Time badge */}
                            <div className="flex flex-shrink-0 items-start gap-3 sm:flex-col sm:items-center sm:text-center">
                              <div className="flex h-14 w-14 items-center justify-center rounded-[var(--radius-card)] bg-dta-accent/10">
                                {typeIcon(item.type)}
                              </div>
                              <div>
                                <p className="font-serif text-lg font-bold text-dta-dark">
                                  {item.time ? item.time.replace(":", "h") : ""}
                                </p>
                                <p className="text-xs text-dta-taupe">{item.type}</p>
                              </div>
                            </div>

                            {/* Content */}
                            <div className="flex-1">
                              <h4 className="font-serif text-xl font-bold text-dta-dark">
                                {item.title}
                              </h4>
                              {item.director && (
                                <p className="mt-1 text-sm font-medium text-dta-accent">
                                  Réalisé par {item.director}
                                </p>
                              )}

                              {item.synopsis && (
                                <p className="mt-3 text-sm leading-relaxed text-dta-char/80">
                                  {item.synopsis}
                                </p>
                              )}

                              {/* Venue + pricing */}
                              <div className="mt-4 flex flex-wrap gap-x-6 gap-y-2 text-xs text-dta-taupe">
                                {item.venue && (
                                  <span className="flex items-center gap-1.5">
                                    <MapPin size={13} className="text-dta-accent" />
                                    {item.venue}
                                    {item.address && `, ${item.address}`}
                                  </span>
                                )}
                                {item.pricing && (
                                  <span className="rounded-[var(--radius-full)] bg-dta-accent/10 px-3 py-1 font-medium text-dta-accent">
                                    {item.pricing}
                                  </span>
                                )}
                              </div>

                              {item.note && (
                                <p className="mt-3 rounded-[var(--radius-input)] border-l-2 border-dta-accent/30 bg-dta-beige/50 px-4 py-2.5 text-xs italic text-dta-char/70">
                                  {item.note}
                                </p>
                              )}
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        );
      })()}

      {/* E — Tickets / Reservation Section */}
      <div className="bg-dta-beige py-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          {(() => {
            const sectionTitle = isFreeEvent ? "Réservation" : "Billetterie";
            const sectionSubtitle = isFreeEvent
              ? "Entrée gratuite sur réservation — places limitées"
              : Array.isArray(event.program) && event.program.length > 0
                ? "Choisissez votre séance puis votre formule"
                : "Choisissez votre formule et réservez vos places";
            return (
            <>
              <div className="text-center">
                <h2 className="font-serif text-3xl font-bold text-dta-dark">{sectionTitle}</h2>
                <p className="mt-2 text-sm text-dta-char/70">{sectionSubtitle}</p>
              </div>

              {event.showCapacity && (
                <div className="mx-auto mt-8 max-w-md">
                  <div className="flex items-center justify-between text-xs text-dta-taupe">
                    <span>{soldCount} vendus</span>
                    <span>{event.capacity} places</span>
                  </div>
                  <div className="mt-1.5 h-2 overflow-hidden rounded-[var(--radius-full)] bg-dta-sand">
                    <div
                      className="h-full rounded-[var(--radius-full)] bg-dta-accent transition-all duration-500"
                      style={{ width: `${progressPercent}%` }}
                    />
                  </div>
                  <p className="mt-1.5 text-center text-xs font-medium text-dta-char/60">
                    {remaining > 0
                      ? `${remaining} places restantes`
                      : "Complet"}
                  </p>
                </div>
              )}

              {Array.isArray(event.program) && event.program.length > 0 ? (
                <TicketSectionClient
                  eventId={event.id}
                  eventSlug={event.slug}
                  eventTitle={event.title}
                  eventDate={event.date.toISOString()}
                  eventEndDate={event.endDate?.toISOString()}
                  tiers={tiers}
                  soldOut={soldOut}
                  sessions={(event.program as Array<{date:string;time:string;venue:string;address:string;title:string;type:string;pricing:string}>)}
                />
              ) : (
                <>
                {(() => {
                  const eb = tiers.find((t) => t.id === "EARLY_BIRD" && t.quota != null);
                  return eb && eb.quota! - eb.sold > 0 ? (
                    <SocialProofBanner sold={eb.sold} quota={eb.quota!} />
                  ) : null;
                })()}
                <div className="mt-10">
                  {soldOut ? (
                    <div className="mx-auto max-w-md rounded-[var(--radius-card)] bg-white p-8 text-center shadow-[var(--shadow-card)]">
                      <p className="font-serif text-2xl font-bold text-dta-dark">Complet</p>
                      <p className="mt-3 text-sm text-dta-char/70">
                        Cet événement affiche complet. Inscrivez-vous pour être notifié en cas de désistement.
                      </p>
                    </div>
                  ) : (
                    <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
                      {tiers.map((tier) => (
                        <div
                          key={tier.id}
                          className={`rounded-[var(--radius-card)] bg-white p-6 shadow-[var(--shadow-card)] transition-all duration-200 ${
                            tier.highlight
                              ? "ring-2 ring-dta-accent md:scale-105"
                              : ""
                          }`}
                        >
                          {tier.highlight && (
                            <span className="mb-3 inline-block rounded-[var(--radius-full)] bg-dta-accent px-3 py-1 text-xs font-semibold text-white">
                              Populaire
                            </span>
                          )}
                          <div className="flex items-baseline justify-between">
                            <h3 className="font-serif text-lg font-bold text-dta-dark">{tier.name}</h3>
                            <span className="font-serif text-2xl font-bold text-dta-accent">
                              {formatPrice(tier.price)}
                            </span>
                          </div>
                          <p className="mt-1 text-xs text-dta-char/60">{tier.description}</p>
                          <ul className="mt-4 space-y-2">
                            {tier.features.map((f) => (
                              <li key={f} className="flex items-center gap-2 text-xs text-dta-char/70">
                                <span className="h-1.5 w-1.5 flex-shrink-0 rounded-full bg-dta-accent" />
                                {f}
                              </li>
                            ))}
                          </ul>
                          <TicketSelector
                            eventId={event.id}
                            eventSlug={event.slug}
                            tier={tier.id}
                            tierName={tier.name}
                            price={tier.price}
                            highlight={tier.highlight}
                            eventTitle={event.title}
                            eventDate={event.date.toISOString()}
                            eventEndDate={event.endDate?.toISOString()}
                          />
                        </div>
                      ))}
                    </div>
                  )}
                </div>
                </>
              )}
            </>
            );
          })()}
          {/* Bouton Exposant */}
          <div className="mx-auto mt-10 max-w-md text-center">
            <p className="text-sm text-dta-char/70">
              Vous êtes artisan, créateur ou entrepreneur ?
            </p>
            <Link
              href="/exposants/reservation"
              className="mt-3 inline-flex items-center gap-2 rounded-[var(--radius-button)] border-2 border-dta-accent bg-transparent px-6 py-3 text-sm font-semibold text-dta-accent transition-all duration-200 hover:bg-dta-accent hover:text-white"
            >
              <Store size={16} />
              Devenir exposant
            </Link>
          </div>
        </div>
      </div>

      {/* F — Autres événements (maillage interne) */}
      {otherEvents.length > 0 && (
        <div className="bg-dta-bg py-14">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <h2 className="font-serif text-2xl font-bold text-dta-dark">
              Autres &eacute;v&eacute;nements de la saison
            </h2>
            <div className="mt-6 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
              {otherEvents.map((evt) => (
                <Link
                  key={evt.slug}
                  href={`/saison-culturelle-africaine/${evt.slug}`}
                  className="group overflow-hidden rounded-[var(--radius-card)] bg-white shadow-[var(--shadow-card)] transition-all duration-300 hover:-translate-y-1 hover:shadow-[var(--shadow-card-hover)]"
                >
                  <div className="relative aspect-[4/3] overflow-hidden bg-gradient-to-br from-dta-accent/15 to-dta-sand">
                    {evt.coverImage && (
                      <Image
                        src={evt.coverImage}
                        alt={evt.title}
                        fill
                        className="object-cover transition-transform duration-300 group-hover:scale-105"
                        sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                      />
                    )}
                    <div className="absolute left-2 top-2 rounded-[var(--radius-button)] bg-white/90 px-2 py-1 text-center backdrop-blur-sm">
                      <span className="block text-[10px] font-bold uppercase text-dta-accent">
                        {new Date(evt.date).toLocaleDateString("fr-FR", { month: "short" })}
                      </span>
                      <span className="block font-serif text-lg font-bold text-dta-dark">
                        {new Date(evt.date).getDate()}
                      </span>
                    </div>
                  </div>
                  <div className="p-4">
                    <h3 className="line-clamp-2 text-sm font-semibold text-dta-dark transition-colors group-hover:text-dta-accent">
                      {evt.title}
                    </h3>
                    <p className="mt-1.5 flex items-center gap-1 text-xs text-dta-taupe">
                      <MapPin size={11} />
                      {evt.venue}
                    </p>
                    <p className="mt-1 text-xs font-medium text-dta-accent">
                      {Math.min(evt.priceEarly, evt.priceStd, evt.priceVip) === 0
                        ? "Gratuit"
                        : `Dès ${formatPrice(Math.min(evt.priceEarly, evt.priceStd, evt.priceVip))}`}
                    </p>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* G — Cross-links */}
      <div className="bg-white py-12">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-3">
            {/* Journal */}
            <div className="rounded-[var(--radius-card)] border border-dta-sand/50 p-5">
              <div className="mb-2 flex items-center gap-2">
                <Newspaper size={16} className="text-dta-accent" />
                <h3 className="text-sm font-bold text-dta-dark">L&apos;Afropeen</h3>
              </div>
              <ul className="space-y-1">
                {relatedArticles.map((a) => (
                  <li key={a.slug}>
                    <Link href={`/lafropeen/${a.slug}`} className="line-clamp-1 text-xs text-dta-char/70 hover:text-dta-accent">
                      {a.title}
                    </Link>
                  </li>
                ))}
              </ul>
              <Link href="/lafropeen" className="mt-2 inline-flex items-center gap-1 text-xs font-medium text-dta-accent">
                Lire le journal <ArrowRight size={12} />
              </Link>
            </div>

            {/* Exposants */}
            <div className="rounded-[var(--radius-card)] border border-dta-sand/50 p-5">
              <div className="mb-2 flex items-center gap-2">
                <Store size={16} className="text-dta-accent" />
                <h3 className="text-sm font-bold text-dta-dark">Devenir exposant</h3>
              </div>
              <p className="text-xs text-dta-char/70">
                R&eacute;servez un stand pour pr&eacute;senter vos produits lors de nos &eacute;v&eacute;nements.
              </p>
              <Link href="/exposants" className="mt-2 inline-flex items-center gap-1 text-xs font-medium text-dta-accent">
                R&eacute;server un stand <ArrowRight size={12} />
              </Link>
            </div>

            {/* Contact */}
            <div className="rounded-[var(--radius-card)] border border-dta-sand/50 p-5">
              <div className="mb-2 flex items-center gap-2">
                <Calendar size={16} className="text-dta-accent" />
                <h3 className="text-sm font-bold text-dta-dark">Toute la saison</h3>
              </div>
              <p className="text-xs text-dta-char/70">
                D&eacute;couvrez les 7 &eacute;v&eacute;nements de la Saison Culturelle Africaine 2026.
              </p>
              <Link href="/saison-culturelle-africaine" className="mt-2 inline-flex items-center gap-1 text-xs font-medium text-dta-accent">
                Voir le programme <ArrowRight size={12} />
              </Link>
            </div>
          </div>

          <div className="mt-8 text-center">
            <p className="text-sm text-dta-char/60">
              Des questions ?{" "}
              <Link href="/nous-contacter" className="font-medium text-dta-accent hover:text-dta-accent-dark">
                Contactez-nous
              </Link>
            </p>
          </div>
        </div>
      </div>

      {/* H — FAQ Section with Schema.org */}
      {(() => {
        const faqItems = [
          {
            question: `Quand a lieu ${event.title} ?`,
            answer: `${event.title} se tiendra le ${formatDate(event.date)}${endDate ? ` au ${formatDate(endDate)}` : ""} à ${event.venue}, ${event.address}.`,
          },
          {
            question: `Comment se rendre à ${event.venue} ?`,
            answer: `${event.venue} se situe au ${event.address}. Consultez Google Maps pour l'itinéraire.`,
          },
          ...(isFreeEvent
            ? [
                {
                  question: `${event.title} est-il gratuit ?`,
                  answer: `Oui, l'entrée à ${event.title} est gratuite sur réservation. Les places sont limitées, pensez à réserver en avance sur dreamteamafrica.com.`,
                },
              ]
            : [
                {
                  question: `Quel est le prix des billets pour ${event.title} ?`,
                  answer: `Les billets pour ${event.title} sont disponibles à partir de ${formatPrice(Math.min(event.priceEarly, event.priceStd, event.priceVip))}. Plusieurs formules sont proposées : Early Bird, Standard et VIP.`,
                },
                {
                  question: `Comment acheter des billets pour ${event.title} ?`,
                  answer: `Vous pouvez acheter vos billets directement en ligne sur dreamteamafrica.com. Le paiement est sécurisé par Stripe. Vous recevrez votre billet par e-mail et WhatsApp avec un QR code à présenter à l'entrée.`,
                },
              ]),
          {
            question: "Qui organise la Saison Culturelle Africaine ?",
            answer: "La Saison Culturelle Africaine est organisée par Dream Team Africa, association loi 1901 dédiée à la promotion de la culture africaine à Paris. 7 événements sont programmés d'avril à décembre 2026.",
          },
          {
            question: "Puis-je devenir exposant ?",
            answer: "Oui ! Vous pouvez réserver un stand pour présenter vos produits, votre artisanat ou votre marque lors de nos événements. Rendez-vous sur la page Exposants de dreamteamafrica.com.",
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
          <div className="bg-dta-bg py-14">
            <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }} />
            <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
              <h2 className="text-center font-serif text-2xl font-bold text-dta-dark">
                Questions fréquentes
              </h2>
              <dl className="mt-8 space-y-4">
                {faqItems.map((item, idx) => (
                  <div key={idx} className="rounded-[var(--radius-card)] bg-white p-5 shadow-[var(--shadow-card)]">
                    <dt className="text-sm font-semibold text-dta-dark">{item.question}</dt>
                    <dd className="mt-2 text-sm leading-relaxed text-dta-char/70">{item.answer}</dd>
                  </div>
                ))}
              </dl>
            </div>
          </div>
        );
      })()}
    </div>
    </>
  );
}

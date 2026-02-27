import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Calendar, MapPin, Users, Clock, ArrowLeft, ExternalLink } from "lucide-react";
import { prisma } from "@/lib/db";
import { formatDate, formatPrice } from "@/lib/utils";
import TicketSelector from "./TicketSelector";
import ShareButton from "./ShareButton";

export const dynamic = "force-dynamic";

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const event = await prisma.event.findUnique({ where: { slug } });
  if (!event) return { title: "Événement introuvable" };
  const description = event.description.slice(0, 160);
  return {
    title: event.title,
    description,
    openGraph: {
      title: event.title,
      description,
      type: "website",
      ...(event.coverImage && { images: [{ url: event.coverImage, width: 1200, height: 630, alt: event.title }] }),
    },
    twitter: {
      card: "summary_large_image",
      title: event.title,
      description,
      ...(event.coverImage && { images: [event.coverImage] }),
    },
  };
}

export default async function EventDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const event = await prisma.event.findUnique({
    where: { slug },
    include: {
      _count: { select: { tickets: true } },
    },
  });

  if (!event) notFound();

  const soldCount = event._count.tickets;
  const remaining = event.capacity - soldCount;
  const soldOut = remaining <= 0;
  const progressPercent = Math.min(100, Math.round((soldCount / event.capacity) * 100));

  const tiers = [
    {
      id: "EARLY_BIRD" as const,
      name: "Early Bird",
      price: event.priceEarly,
      description: "Accès général — Tarif réduit pour les premiers acheteurs",
      features: ["Accès à l'événement", "Badge nominatif"],
      highlight: false,
    },
    {
      id: "STANDARD" as const,
      name: "Standard",
      price: event.priceStd,
      description: "Accès complet à l'événement avec avantages inclus",
      features: ["Accès à l'événement", "Badge nominatif", "Programme officiel", "Accès au networking"],
      highlight: true,
    },
    {
      id: "VIP" as const,
      name: "VIP",
      price: event.priceVip,
      description: "L'expérience premium avec accès exclusif et privilèges",
      features: [
        "Accès prioritaire",
        "Badge VIP nominatif",
        "Programme officiel",
        "Accès backstage",
        "Cocktail privé",
        "Place réservée",
      ],
      highlight: false,
    },
  ];

  const eventDate = new Date(event.date);
  const endDate = event.endDate ? new Date(event.endDate) : null;
  const mapsUrl = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(event.venue + " " + event.address)}`;

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Event",
    name: event.title,
    description: event.description,
    startDate: event.date.toISOString(),
    ...(event.endDate && { endDate: event.endDate.toISOString() }),
    location: {
      "@type": "Place",
      name: event.venue,
      address: { "@type": "PostalAddress", streetAddress: event.address },
    },
    ...(event.coverImage && { image: event.coverImage }),
    offers: {
      "@type": "AggregateOffer",
      lowPrice: Math.min(event.priceEarly, event.priceStd, event.priceVip),
      highPrice: Math.max(event.priceEarly, event.priceStd, event.priceVip),
      priceCurrency: "EUR",
      availability: soldOut ? "https://schema.org/SoldOut" : "https://schema.org/InStock",
    },
    organizer: { "@type": "Organization", name: "Dream Team Africa" },
  };

  return (
    <div>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      {/* A — Navigation Bar */}
      <div className="sticky top-0 z-30 border-b border-dta-sand/50 bg-white/80 backdrop-blur-md">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3 sm:px-6 lg:px-8">
          <Link
            href="/evenements"
            className="flex items-center gap-2 text-sm font-medium text-dta-char transition-colors hover:text-dta-accent"
          >
            <ArrowLeft size={16} />
            Retour aux événements
          </Link>
          <ShareButton />
        </div>
      </div>

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
                  <span className="flex items-center gap-2">
                    <MapPin size={16} className="text-dta-accent" />
                    {event.venue}
                  </span>
                  <span className="flex items-center gap-2">
                    <Users size={16} className="text-dta-accent" />
                    {remaining > 0 ? `${remaining} places restantes` : "Complet"}
                  </span>
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
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-[var(--radius-button)] bg-dta-accent/10">
                <MapPin size={18} className="text-dta-accent" />
              </div>
              <div>
                <p className="text-xs text-dta-taupe">Lieu</p>
                <p className="text-sm font-medium text-dta-dark">{event.venue}</p>
              </div>
            </div>
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
          <div className="lg:col-span-2">
            <div className="rounded-[var(--radius-card)] bg-white p-8 shadow-[var(--shadow-card)]">
              <h2 className="font-serif text-2xl font-bold text-dta-dark">Lieu</h2>
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
            </div>
          </div>
        </div>
      </div>

      {/* E — Tickets Section */}
      <div className="bg-dta-beige py-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h2 className="font-serif text-3xl font-bold text-dta-dark">Billetterie</h2>
            <p className="mt-2 text-sm text-dta-char/70">
              Choisissez votre formule et réservez vos places
            </p>
          </div>

          {/* Capacity progress bar */}
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

          {/* Ticket tiers */}
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
                      price={tier.price}
                      highlight={tier.highlight}
                    />
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* F — Final CTA */}
      <div className="bg-white py-12">
        <div className="mx-auto max-w-7xl px-4 text-center sm:px-6 lg:px-8">
          <p className="text-sm text-dta-char/60">
            Des questions ?{" "}
            <Link href="/contact" className="font-medium text-dta-accent hover:text-dta-accent-dark">
              Contactez-nous
            </Link>
          </p>
          <Link
            href="/evenements"
            className="mt-3 inline-flex items-center gap-2 text-sm font-medium text-dta-char/50 transition-colors hover:text-dta-accent"
          >
            <ArrowLeft size={14} />
            Voir tous les événements
          </Link>
        </div>
      </div>
    </div>
  );
}

import Image from "next/image";
import { notFound } from "next/navigation";
import { Calendar, MapPin, Users, Clock } from "lucide-react";
import { prisma } from "@/lib/db";
import { formatDate, formatPrice } from "@/lib/utils";
import TicketSelector from "./TicketSelector";

export const dynamic = "force-dynamic";

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const event = await prisma.event.findUnique({ where: { slug } });
  if (!event) return { title: "Événement introuvable" };
  return {
    title: event.title,
    description: event.description.slice(0, 160),
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

  return (
    <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
      {/* Hero banner */}
      <div className="relative mb-10 overflow-hidden rounded-[var(--radius-card)] bg-dta-dark">
        {event.coverImage ? (
          <Image
            src={event.coverImage}
            alt={event.title}
            fill
            className="object-cover opacity-40"
            priority
          />
        ) : (
          <div className="absolute inset-0 opacity-10">
            <div className="h-full w-full bg-[radial-gradient(ellipse_at_bottom_left,_var(--color-dta-accent)_0%,_transparent_60%)]" />
          </div>
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-dta-dark/90 via-dta-dark/60 to-dta-dark/40" />
        <div className="relative px-8 py-16 sm:px-12 sm:py-20">
          <div className="flex items-start gap-6">
            <div className="hidden flex-shrink-0 rounded-[var(--radius-button)] bg-white/10 px-5 py-4 text-center sm:block">
              <span className="block text-sm font-bold uppercase text-dta-accent">
                {eventDate.toLocaleDateString("fr-FR", { month: "short" })}
              </span>
              <span className="block font-serif text-4xl font-bold text-white">
                {eventDate.getDate()}
              </span>
            </div>
            <div className="flex-1">
              <h1 className="font-serif text-3xl font-bold text-white sm:text-4xl lg:text-5xl">
                {event.title}
              </h1>
              <div className="mt-4 flex flex-wrap gap-4 text-sm text-dta-sand">
                <span className="flex items-center gap-1.5">
                  <Calendar size={16} className="text-dta-accent" />
                  {formatDate(event.date)}
                  {endDate && ` — ${formatDate(endDate)}`}
                </span>
                <span className="flex items-center gap-1.5">
                  <Clock size={16} className="text-dta-accent" />
                  {eventDate.toLocaleTimeString("fr-FR", { hour: "2-digit", minute: "2-digit" })}
                </span>
                <span className="flex items-center gap-1.5">
                  <MapPin size={16} className="text-dta-accent" />
                  {event.venue}
                </span>
                <span className="flex items-center gap-1.5">
                  <Users size={16} className="text-dta-accent" />
                  {remaining > 0 ? `${remaining} places restantes` : "Complet"}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-10 lg:grid-cols-3">
        {/* Left — Details */}
        <div className="lg:col-span-2">
          <div className="rounded-[var(--radius-card)] bg-white p-8 shadow-[var(--shadow-card)]">
            <h2 className="font-serif text-2xl font-bold text-dta-dark">À propos</h2>
            <div className="mt-4 whitespace-pre-line text-sm leading-relaxed text-dta-char/80">
              {event.description}
            </div>
          </div>

          <div className="mt-6 rounded-[var(--radius-card)] bg-white p-8 shadow-[var(--shadow-card)]">
            <h2 className="font-serif text-2xl font-bold text-dta-dark">Lieu</h2>
            <div className="mt-4">
              <p className="font-medium text-dta-dark">{event.venue}</p>
              <p className="mt-1 text-sm text-dta-char/70">{event.address}</p>
            </div>
          </div>
        </div>

        {/* Right — Tickets */}
        <div className="space-y-4">
          <h2 className="font-serif text-2xl font-bold text-dta-dark">Billetterie</h2>
          {soldOut ? (
            <div className="rounded-[var(--radius-card)] bg-dta-beige p-6 text-center">
              <p className="font-serif text-xl font-bold text-dta-dark">Complet</p>
              <p className="mt-2 text-sm text-dta-char/70">
                Cet événement affiche complet. Inscrivez-vous pour être notifié en cas de désistement.
              </p>
            </div>
          ) : (
            tiers.map((tier) => (
              <div
                key={tier.id}
                className={`rounded-[var(--radius-card)] bg-white p-6 shadow-[var(--shadow-card)] transition-all duration-200 ${
                  tier.highlight ? "ring-2 ring-dta-accent" : ""
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
                <ul className="mt-3 space-y-1.5">
                  {tier.features.map((f) => (
                    <li key={f} className="flex items-center gap-2 text-xs text-dta-char/70">
                      <span className="h-1 w-1 flex-shrink-0 rounded-full bg-dta-accent" />
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
            ))
          )}
        </div>
      </div>
    </div>
  );
}

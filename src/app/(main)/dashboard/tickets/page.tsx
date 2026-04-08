import { redirect } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { Calendar, MapPin, Ticket } from "lucide-react";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { formatDate, formatPrice } from "@/lib/utils";
import RechargeButton from "./RechargeButton";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "Mes billets",
};

const tierLabels: Record<string, string> = {
  EARLY_BIRD: "Early Bird",
  STANDARD: "Standard",
  VIP: "VIP",
};

const tierBadgeColors: Record<string, string> = {
  EARLY_BIRD: "bg-blue-500",
  STANDARD: "bg-dta-accent",
  VIP: "bg-amber-500",
};

function resolveTierLabel(tierId: string, eventTiers: unknown): string {
  if (tierLabels[tierId]) return tierLabels[tierId];
  const tiers = eventTiers as Array<{ id: string; name: string }> | null;
  const match = Array.isArray(tiers) ? tiers.find((t) => t.id === tierId) : null;
  return match?.name || tierId;
}

const tierGradients: Record<string, string> = {
  EARLY_BIRD: "from-blue-600 to-blue-800",
  STANDARD: "from-dta-accent to-dta-accent-dark",
  VIP: "from-amber-500 to-amber-700",
};

export default async function TicketsPage() {
  const session = await auth();
  if (!session) redirect("/auth/signin");

  const tickets = await prisma.ticket.findMany({
    where: { userId: session.user.id },
    include: { event: true, payments: { orderBy: { paidAt: "asc" } } },
    orderBy: { purchasedAt: "desc" },
  });

  const upcoming = tickets.filter((t) => new Date(t.event.date) >= new Date());
  const past = tickets.filter((t) => new Date(t.event.date) < new Date());

  return (
    <div className="mx-auto max-w-4xl px-4 py-12 sm:px-6 lg:px-8">
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="font-serif text-3xl font-bold text-dta-dark">Mes billets</h1>
          <p className="mt-1 text-sm text-dta-char/70">
            {tickets.length} billet{tickets.length !== 1 ? "s" : ""} au total
          </p>
        </div>
        <Link
          href="/saison-culturelle-africaine"
          className="rounded-[var(--radius-button)] bg-dta-accent px-5 py-2.5 text-sm font-semibold text-white hover:bg-dta-accent-dark"
        >
          Voir les événements
        </Link>
      </div>

      {tickets.length === 0 ? (
        <div className="rounded-[var(--radius-card)] bg-white p-12 text-center shadow-[var(--shadow-card)]">
          <Ticket size={48} className="mx-auto text-dta-taupe" />
          <h2 className="mt-4 font-serif text-xl font-bold text-dta-dark">
            Aucun billet
          </h2>
          <p className="mt-2 text-sm text-dta-char/70">
            Vous n&apos;avez pas encore acheté de billets. Découvrez nos événements culturels !
          </p>
          <Link
            href="/saison-culturelle-africaine"
            className="mt-6 inline-flex items-center rounded-[var(--radius-button)] bg-dta-accent px-6 py-3 text-sm font-semibold text-white hover:bg-dta-accent-dark"
          >
            Explorer les événements
          </Link>
        </div>
      ) : (
        <>
          {/* Upcoming */}
          {upcoming.length > 0 && (
            <section className="mb-10">
              <h2 className="mb-5 font-serif text-xl font-bold text-dta-dark">
                À venir ({upcoming.length})
              </h2>
              <div className="space-y-6">
                {upcoming.map((ticket) => (
                  <VisualTicketCard key={ticket.id} ticket={ticket} userEmail={session.user.email!} />
                ))}
              </div>
            </section>
          )}

          {/* Past */}
          {past.length > 0 && (
            <section>
              <h2 className="mb-5 font-serif text-xl font-bold text-dta-dark">
                Passés ({past.length})
              </h2>
              <div className="space-y-6 opacity-60">
                {past.map((ticket) => (
                  <VisualTicketCard key={ticket.id} ticket={ticket} userEmail={session.user.email!} />
                ))}
              </div>
            </section>
          )}
        </>
      )}
    </div>
  );
}

function VisualTicketCard({
  ticket,
  userEmail,
}: {
  userEmail: string;
  ticket: {
    id: string;
    tier: string;
    price: number;
    totalPaid: number;
    qrCode: string | null;
    purchasedAt: Date;
    payments: Array<{ id: string; amount: number; type: string; label: string; paidAt: Date }>;
    event: {
      title: string;
      slug: string;
      venue: string;
      date: Date;
      coverImage: string | null;
      tiers: unknown;
    };
  };
}) {
  const remaining = Math.max(0, ticket.price - ticket.totalPaid);
  const isPaid = ticket.totalPaid >= ticket.price;
  const paymentPercent = ticket.price > 0 ? Math.min(100, Math.round((ticket.totalPaid / ticket.price) * 100)) : 100;
  const eventDate = new Date(ticket.event.date);

  return (
    <Link
      href={`/saison-culturelle-africaine/${ticket.event.slug}`}
      className="group block overflow-hidden rounded-2xl bg-dta-dark shadow-lg transition-shadow hover:shadow-xl"
    >
      {/* Top: Cover image + event info */}
      <div className="relative flex">
        {/* Cover image — left side */}
        <div className="relative hidden w-40 flex-shrink-0 sm:block">
          {ticket.event.coverImage ? (
            <Image
              src={ticket.event.coverImage}
              alt={ticket.event.title}
              fill
              className="object-cover"
              sizes="160px"
            />
          ) : (
            <div className={`h-full w-full bg-gradient-to-br ${tierGradients[ticket.tier] || tierGradients.STANDARD}`} />
          )}
          <div className="absolute inset-0 bg-gradient-to-r from-transparent to-dta-dark/60" />
        </div>

        {/* Mobile: cover as background */}
        <div className="absolute inset-0 sm:hidden">
          {ticket.event.coverImage ? (
            <Image
              src={ticket.event.coverImage}
              alt=""
              fill
              className="object-cover"
              sizes="100vw"
            />
          ) : (
            <div className={`h-full w-full bg-gradient-to-br ${tierGradients[ticket.tier] || tierGradients.STANDARD}`} />
          )}
          <div className="absolute inset-0 bg-dta-dark/75" />
        </div>

        {/* Event details */}
        <div className="relative flex flex-1 items-center justify-between gap-4 p-4 sm:p-5">
          <div className="min-w-0 flex-1">
            {/* Tier badge */}
            <span className={`inline-block rounded-full px-3 py-1 text-[10px] font-bold uppercase tracking-wider text-white ${tierBadgeColors[ticket.tier] || tierBadgeColors.STANDARD}`}>
              {resolveTierLabel(ticket.tier, ticket.event.tiers)}
            </span>

            <h3 className="mt-2 font-serif text-lg font-bold leading-snug text-white transition-colors group-hover:text-dta-accent sm:text-xl">
              {ticket.event.title}
            </h3>

            <div className="mt-2 flex flex-wrap items-center gap-3 text-xs text-white/60">
              <span className="flex items-center gap-1">
                <Calendar size={12} />
                {formatDate(ticket.event.date)}
              </span>
              <span className="flex items-center gap-1">
                <MapPin size={12} />
                {ticket.event.venue}
              </span>
            </div>
          </div>

          {/* Date badge */}
          <div className="flex-shrink-0 rounded-xl bg-white/10 px-3 py-2 text-center backdrop-blur-sm">
            <span className="block text-[10px] font-bold uppercase text-dta-accent">
              {eventDate.toLocaleDateString("fr-FR", { month: "short" })}
            </span>
            <span className="block font-serif text-2xl font-bold text-white">
              {eventDate.getDate()}
            </span>
          </div>
        </div>
      </div>

      {/* Perforated divider */}
      <div className="relative flex items-center">
        <div className="absolute -left-3 h-5 w-5 rounded-full bg-dta-bg" />
        <div className="w-full border-t-2 border-dashed border-white/10" />
        <div className="absolute -right-3 h-5 w-5 rounded-full bg-dta-bg" />
      </div>

      {/* Bottom: QR + details */}
      <div className="flex items-center gap-4 px-4 py-3 sm:px-5">
        {/* QR Code — visible on ALL screen sizes */}
        {ticket.qrCode && (
          <div className="flex-shrink-0 rounded-lg bg-white p-1.5">
            <img
              src={ticket.qrCode}
              alt="QR Code"
              className="h-16 w-16 sm:h-20 sm:w-20"
            />
          </div>
        )}

        <div className="flex flex-1 flex-col gap-2">
          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <span className="text-xs text-white/40">Prix</span>
                <span className="text-sm font-semibold text-white">{formatPrice(ticket.price)}</span>
              </div>
              <p className="font-mono text-[10px] text-white/30">
                Réf : {ticket.id.slice(0, 8).toUpperCase()}
              </p>
            </div>
            <div className="flex items-center gap-2">
              <span className={`rounded-full px-2.5 py-0.5 text-[10px] font-bold uppercase ${isPaid ? "bg-green-500/20 text-green-400" : "bg-amber-500/20 text-amber-400"}`}>
                {isPaid ? "Soldé" : `${paymentPercent}% payé`}
              </span>
              <span className="text-[10px] uppercase tracking-widest text-white/20">
                DTA 2026
              </span>
            </div>
          </div>

          {/* Payment progress bar */}
          {!isPaid && ticket.price > 0 && (
            <div className="space-y-2">
              <div className="h-1.5 w-full overflow-hidden rounded-full bg-white/10">
                <div
                  className="h-full rounded-full bg-gradient-to-r from-amber-500 to-dta-accent transition-all"
                  style={{ width: `${paymentPercent}%` }}
                />
              </div>
              <div className="flex items-center justify-between text-[10px] text-white/50">
                <span>Payé : {formatPrice(ticket.totalPaid)}</span>
                <span>Reste : {formatPrice(remaining)}</span>
              </div>
              <RechargeButton ticketId={ticket.id} email={userEmail} remaining={remaining} />
            </div>
          )}
        </div>
      </div>
    </Link>
  );
}

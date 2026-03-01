import { redirect } from "next/navigation";
import Link from "next/link";
import { Calendar, MapPin, Ticket } from "lucide-react";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { formatDate, formatPrice } from "@/lib/utils";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "Mes billets",
};

const tierLabels: Record<string, string> = {
  EARLY_BIRD: "Early Bird",
  STANDARD: "Standard",
  VIP: "VIP",
};

const tierColors: Record<string, string> = {
  EARLY_BIRD: "bg-blue-100 text-blue-700",
  STANDARD: "bg-dta-accent/10 text-dta-accent",
  VIP: "bg-amber-100 text-amber-700",
};

function getTierLabel(tier: string, event?: { tiers: unknown }): string {
  if (tierLabels[tier]) return tierLabels[tier];
  const custom = event?.tiers as Array<{ id: string; name: string }> | null;
  const match = Array.isArray(custom) ? custom.find((t) => t.id === tier) : null;
  return match?.name ?? tier;
}

export default async function TicketsPage() {
  const session = await auth();
  if (!session) redirect("/auth/signin");

  const tickets = await prisma.ticket.findMany({
    where: { userId: session.user.id },
    include: { event: true },
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
          href="/evenements"
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
            href="/evenements"
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
              <h2 className="mb-4 font-serif text-xl font-bold text-dta-dark">
                À venir ({upcoming.length})
              </h2>
              <div className="space-y-4">
                {upcoming.map((ticket) => (
                  <TicketCard key={ticket.id} ticket={ticket} />
                ))}
              </div>
            </section>
          )}

          {/* Past */}
          {past.length > 0 && (
            <section>
              <h2 className="mb-4 font-serif text-xl font-bold text-dta-dark">
                Passés ({past.length})
              </h2>
              <div className="space-y-4 opacity-70">
                {past.map((ticket) => (
                  <TicketCard key={ticket.id} ticket={ticket} />
                ))}
              </div>
            </section>
          )}
        </>
      )}
    </div>
  );
}

function TicketCard({
  ticket,
}: {
  ticket: {
    id: string;
    tier: string;
    price: number;
    qrCode: string | null;
    purchasedAt: Date;
    event: {
      title: string;
      slug: string;
      venue: string;
      date: Date;
      tiers: unknown;
    };
  };
}) {
  return (
    <div className="flex items-start gap-4 rounded-[var(--radius-card)] bg-white p-5 shadow-[var(--shadow-card)]">
      {/* QR */}
      {ticket.qrCode && (
        <div className="hidden flex-shrink-0 sm:block">
          <img
            src={ticket.qrCode}
            alt="QR Code"
            className="h-20 w-20 rounded-[var(--radius-input)]"
          />
        </div>
      )}

      {/* Details */}
      <div className="flex-1">
        <div className="flex items-start justify-between">
          <div>
            <Link
              href={`/evenements/${ticket.event.slug}`}
              className="font-serif text-lg font-bold text-dta-dark hover:text-dta-accent"
            >
              {ticket.event.title}
            </Link>
            <div className="mt-1 flex items-center gap-2">
              <span className={`rounded-[var(--radius-full)] px-2.5 py-0.5 text-xs font-semibold ${tierColors[ticket.tier] || "bg-dta-accent/10 text-dta-accent"}`}>
                {getTierLabel(ticket.tier, ticket.event)}
              </span>
              <span className="text-xs text-dta-taupe">
                {formatPrice(ticket.price)}
              </span>
            </div>
          </div>

          {/* Date badge */}
          <div className="flex-shrink-0 rounded-[var(--radius-button)] bg-dta-beige px-3 py-1.5 text-center">
            <span className="block text-xs font-bold uppercase text-dta-accent">
              {new Date(ticket.event.date).toLocaleDateString("fr-FR", { month: "short" })}
            </span>
            <span className="block font-serif text-lg font-bold text-dta-dark">
              {new Date(ticket.event.date).getDate()}
            </span>
          </div>
        </div>

        <div className="mt-2 flex flex-wrap gap-3 text-xs text-dta-taupe">
          <span className="flex items-center gap-1">
            <Calendar size={12} />
            {formatDate(ticket.event.date)}
          </span>
          <span className="flex items-center gap-1">
            <MapPin size={12} />
            {ticket.event.venue}
          </span>
        </div>

        <p className="mt-2 font-mono text-xs text-dta-taupe">
          Réf : {ticket.id.slice(0, 8).toUpperCase()}
        </p>
      </div>
    </div>
  );
}

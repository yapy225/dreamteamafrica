import { redirect } from "next/navigation";
import Link from "next/link";
import { CheckCircle, Calendar, MapPin, Download } from "lucide-react";
import { prisma } from "@/lib/db";
import { auth } from "@/lib/auth";
import { formatDate, formatPrice } from "@/lib/utils";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "Confirmation de réservation",
};

const tierLabels: Record<string, string> = {
  EARLY_BIRD: "Early Bird",
  STANDARD: "Standard",
  VIP: "VIP",
};

function getTierLabel(tier: string, event?: { tiers: unknown }): string {
  if (tierLabels[tier]) return tierLabels[tier];
  const custom = event?.tiers as Array<{ id: string; name: string }> | null;
  const match = Array.isArray(custom) ? custom.find((t) => t.id === tier) : null;
  return match?.name ?? tier;
}

export default async function ConfirmationPage({
  params,
}: {
  params: Promise<{ ticketId: string }>;
}) {
  const session = await auth();
  if (!session) redirect("/auth/signin");

  const { ticketId } = await params;

  // ticketId here is actually the Stripe checkout session ID from the success_url
  const tickets = await prisma.ticket.findMany({
    where: { stripeSessionId: ticketId, userId: session.user.id },
    include: { event: true },
  });

  // If no tickets found via session ID, try direct ticket ID lookup
  const finalTickets =
    tickets.length > 0
      ? tickets
      : await prisma.ticket
          .findMany({
            where: { id: ticketId, userId: session.user.id },
            include: { event: true },
          });

  if (finalTickets.length === 0) {
    return (
      <div className="mx-auto max-w-2xl px-4 py-20 text-center">
        <h1 className="font-serif text-3xl font-bold text-dta-dark">
          Confirmation en cours...
        </h1>
        <p className="mt-4 text-dta-char/70">
          Votre paiement est en cours de traitement. Vos billets apparaîtront dans votre{" "}
          <Link href="/dashboard/tickets" className="font-medium text-dta-accent hover:underline">
            espace billets
          </Link>{" "}
          dans quelques instants.
        </p>
        <Link
          href="/dashboard/tickets"
          className="mt-8 inline-flex items-center rounded-[var(--radius-button)] bg-dta-accent px-6 py-3 text-sm font-semibold text-white hover:bg-dta-accent-dark"
        >
          Voir mes billets
        </Link>
      </div>
    );
  }

  const event = finalTickets[0].event;

  return (
    <div className="mx-auto max-w-2xl px-4 py-12 sm:px-6">
      {/* Success header */}
      <div className="mb-8 text-center">
        <div className="mx-auto mb-4 inline-flex rounded-full bg-green-100 p-3">
          <CheckCircle size={32} className="text-green-600" />
        </div>
        <h1 className="font-serif text-3xl font-bold text-dta-dark">
          Réservation confirmée !
        </h1>
        <p className="mt-2 text-dta-char/70">
          {finalTickets.length > 1
            ? `Vos ${finalTickets.length} billets sont prêts`
            : "Votre billet est prêt"}
        </p>
      </div>

      {/* Event summary */}
      <div className="mb-8 rounded-[var(--radius-card)] bg-white p-6 shadow-[var(--shadow-card)]">
        <h2 className="font-serif text-xl font-bold text-dta-dark">{event.title}</h2>
        <div className="mt-3 flex flex-wrap gap-4 text-sm text-dta-char/70">
          <span className="flex items-center gap-1.5">
            <Calendar size={14} className="text-dta-accent" />
            {formatDate(event.date)}
          </span>
          <span className="flex items-center gap-1.5">
            <MapPin size={14} className="text-dta-accent" />
            {event.venue}
          </span>
        </div>
      </div>

      {/* Tickets */}
      <div className="space-y-4">
        {finalTickets.map((ticket, i) => (
          <div
            key={ticket.id}
            className="rounded-[var(--radius-card)] bg-white p-6 shadow-[var(--shadow-card)]"
          >
            <div className="flex items-start justify-between">
              <div>
                <div className="flex items-center gap-2">
                  <span className="rounded-[var(--radius-full)] bg-dta-accent/10 px-3 py-1 text-xs font-semibold text-dta-accent">
                    {getTierLabel(ticket.tier, event)}
                  </span>
                  {finalTickets.length > 1 && (
                    <span className="text-xs text-dta-taupe">
                      Billet {i + 1}/{finalTickets.length}
                    </span>
                  )}
                </div>
                <p className="mt-2 text-sm text-dta-char/70">
                  Prix : {formatPrice(ticket.price)}
                </p>
                <p className="mt-1 font-mono text-xs text-dta-taupe">
                  Réf : {ticket.id.slice(0, 8).toUpperCase()}
                </p>
              </div>

              {/* QR Code */}
              {ticket.qrCode && (
                <div className="flex-shrink-0">
                  <img
                    src={ticket.qrCode}
                    alt={`QR Code — Billet ${i + 1}`}
                    className="h-24 w-24 rounded-[var(--radius-input)]"
                  />
                </div>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Actions */}
      <div className="mt-8 flex flex-col gap-3 sm:flex-row">
        <Link
          href="/dashboard/tickets"
          className="flex flex-1 items-center justify-center gap-2 rounded-[var(--radius-button)] bg-dta-accent px-6 py-3 text-sm font-semibold text-white hover:bg-dta-accent-dark"
        >
          <Download size={16} />
          Voir tous mes billets
        </Link>
        <Link
          href="/evenements"
          className="flex flex-1 items-center justify-center rounded-[var(--radius-button)] border border-dta-sand px-6 py-3 text-sm font-semibold text-dta-char hover:bg-dta-beige"
        >
          Retour aux événements
        </Link>
      </div>
    </div>
  );
}

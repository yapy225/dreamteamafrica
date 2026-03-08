import { notFound } from "next/navigation";
import { CheckCircle, Calendar, MapPin, Clock, Users } from "lucide-react";
import { prisma } from "@/lib/db";
import { formatDate, formatDateTime } from "@/lib/utils";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "Vérification du billet",
};

export default async function CheckPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  // Try paid ticket first
  const ticket = await prisma.ticket.findUnique({
    where: { id },
    include: { event: true, user: true },
  });

  if (ticket) {
    return (
      <div className="mx-auto max-w-md px-4 py-16 text-center">
        <div className="rounded-2xl bg-white p-8 shadow-lg">
          <div className="mx-auto mb-4 inline-flex rounded-full bg-green-100 p-3">
            <CheckCircle size={32} className="text-green-600" />
          </div>
          <h1 className="font-serif text-2xl font-bold text-dta-dark">
            Billet valide
          </h1>
          <h2 className="mt-4 font-serif text-lg font-bold text-dta-dark">
            {ticket.event.title}
          </h2>
          <div className="mt-4 space-y-3 text-left">
            <div className="flex items-center gap-2 text-sm text-dta-char">
              <Calendar size={16} className="flex-shrink-0 text-dta-accent" />
              <span>{formatDate(ticket.event.date)}</span>
            </div>
            <div className="flex items-center gap-2 text-sm text-dta-char">
              <Clock size={16} className="flex-shrink-0 text-dta-accent" />
              <span>{new Date(ticket.event.date).toLocaleTimeString("fr-FR", { hour: "2-digit", minute: "2-digit" })}</span>
            </div>
            <div className="flex items-center gap-2 text-sm text-dta-char">
              <MapPin size={16} className="flex-shrink-0 text-dta-accent" />
              <span>{ticket.event.venue}</span>
            </div>
            {ticket.event.address && (
              <p className="pl-6 text-sm text-dta-char/70">{ticket.event.address}</p>
            )}
            <div className="mt-4 rounded-lg bg-dta-beige p-4">
              <p className="text-xs uppercase tracking-wider text-dta-taupe">Titulaire</p>
              <p className="mt-1 font-semibold text-dta-dark">
                {ticket.user.name || ticket.user.email}
              </p>
              <p className="mt-2 text-xs uppercase tracking-wider text-dta-taupe">Catégorie</p>
              <p className="mt-1 font-semibold text-dta-accent">{ticket.tier}</p>
              <p className="mt-2 text-xs uppercase tracking-wider text-dta-taupe">Réf.</p>
              <p className="mt-1 font-mono text-xs text-dta-char">{ticket.id.slice(0, 8).toUpperCase()}</p>
            </div>
          </div>
          <TicketTerms />
        </div>
      </div>
    );
  }

  // Try free reservation (gratuit)
  const reservation = await prisma.eventReservation.findUnique({
    where: { id },
    include: { event: true },
  });

  if (reservation) {
    return (
      <div className="mx-auto max-w-md px-4 py-16 text-center">
        <div className="rounded-2xl bg-white p-8 shadow-lg">
          <div className="mx-auto mb-4 inline-flex rounded-full bg-green-100 p-3">
            <CheckCircle size={32} className="text-green-600" />
          </div>
          <h1 className="font-serif text-2xl font-bold text-dta-dark">
            Réservation valide
          </h1>
          <h2 className="mt-4 font-serif text-lg font-bold text-dta-dark">
            {reservation.event.title}
          </h2>
          <div className="mt-4 space-y-3 text-left">
            <div className="flex items-center gap-2 text-sm text-dta-char">
              <Calendar size={16} className="flex-shrink-0 text-dta-accent" />
              <span>{formatDate(reservation.event.date)}</span>
            </div>
            <div className="flex items-center gap-2 text-sm text-dta-char">
              <Clock size={16} className="flex-shrink-0 text-dta-accent" />
              <span>{new Date(reservation.event.date).toLocaleTimeString("fr-FR", { hour: "2-digit", minute: "2-digit" })}</span>
            </div>
            <div className="flex items-center gap-2 text-sm text-dta-char">
              <MapPin size={16} className="flex-shrink-0 text-dta-accent" />
              <span>{reservation.event.venue}</span>
            </div>
            {reservation.event.address && (
              <p className="pl-6 text-sm text-dta-char/70">{reservation.event.address}</p>
            )}
            <div className="mt-4 rounded-lg bg-dta-beige p-4">
              <p className="text-xs uppercase tracking-wider text-dta-taupe">Titulaire</p>
              <p className="mt-1 font-semibold text-dta-dark">
                {reservation.firstName} {reservation.lastName}
              </p>
              <p className="mt-2 text-xs uppercase tracking-wider text-dta-taupe">Places</p>
              <p className="mt-1 flex items-center gap-1 font-semibold text-dta-accent">
                <Users size={14} />
                {reservation.guests} place{reservation.guests > 1 ? "s" : ""}
              </p>
              <p className="mt-2 text-xs uppercase tracking-wider text-dta-taupe">Réf.</p>
              <p className="mt-1 font-mono text-xs text-dta-char">{reservation.id.slice(0, 8).toUpperCase()}</p>
            </div>
          </div>
          <TicketTerms free />
        </div>
      </div>
    );
  }

  notFound();
}

function TicketTerms({ free }: { free?: boolean }) {
  return (
    <div className="mt-6 border-t border-dta-sand pt-4 text-center">
      <p className="text-[11px] leading-relaxed text-dta-taupe">
        {free
          ? "Cette invitation est strictement personnelle et non cessible. L\u2019acc\u00e8s est soumis \u00e0 pr\u00e9sentation de ce QR code."
          : "Ce billet est strictement personnel, non cessible et non remboursable. Toute reproduction ou falsification est passible de poursuites."}
      </p>
      <p className="mt-2 text-[11px] text-dta-taupe">
        Conditions g&eacute;n&eacute;rales d&apos;utilisation sur{" "}
        <a
          href="https://dreamteamafrica.com/cgu"
          target="_blank"
          rel="noopener noreferrer"
          className="font-medium text-dta-accent underline hover:text-dta-accent-dark"
        >
          dreamteamafrica.com
        </a>
      </p>
    </div>
  );
}

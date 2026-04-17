import { redirect } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { Calendar, MapPin, Ticket, CreditCard, QrCode, ChevronRight } from "lucide-react";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { formatDate, formatPrice } from "@/lib/utils";
import RechargeButton from "./RechargeButton";
import TransferButton from "./TransferButton";
import { TRANSFER_CONFIG } from "@/lib/transfer-config";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "Mes billets — Dashboard",
};

const tierLabels: Record<string, string> = {
  EARLY_BIRD: "Early Bird",
  STANDARD: "Standard",
  VIP: "VIP",
  LAST_CHANCE: "Last Chance",
};

const tierColors: Record<string, string> = {
  EARLY_BIRD: "bg-blue-50 text-blue-700 border-blue-200",
  STANDARD: "bg-amber-50 text-amber-700 border-amber-200",
  VIP: "bg-purple-50 text-purple-700 border-purple-200",
  LAST_CHANCE: "bg-red-50 text-red-700 border-red-200",
};

function resolveTierLabel(tierId: string, eventTiers: unknown): string {
  if (tierLabels[tierId]) return tierLabels[tierId];
  const tiers = eventTiers as Array<{ id: string; name: string }> | null;
  const match = Array.isArray(tiers) ? tiers.find((t) => t.id === tierId) : null;
  return match?.name || tierId;
}

export default async function TicketsPage() {
  const session = await auth();
  if (!session) redirect("/auth/signin");

  const tickets = await prisma.ticket.findMany({
    where: { userId: session.user.id },
    include: {
      event: true,
      payments: { orderBy: { paidAt: "asc" } },
      transfers: {
        where: { status: "PENDING" },
        orderBy: { createdAt: "desc" },
      },
    },
    orderBy: { purchasedAt: "desc" },
  });

  const upcoming = tickets.filter((t) => new Date(t.event.date) >= new Date());
  const past = tickets.filter((t) => new Date(t.event.date) < new Date());

  // Stats
  const totalTickets = tickets.length;
  const totalPaid = tickets.reduce((sum, t) => sum + t.totalPaid, 0);
  const totalPrice = tickets.reduce((sum, t) => sum + t.price, 0);
  const totalRemaining = Math.max(0, totalPrice - totalPaid);
  const fullyPaidCount = tickets.filter((t) => t.totalPaid >= t.price).length;

  // Payment history
  const allPayments = tickets
    .flatMap((t) =>
      t.payments.map((p) => ({
        ...p,
        eventTitle: t.event.title,
      }))
    )
    .sort((a, b) => new Date(b.paidAt).getTime() - new Date(a.paidAt).getTime());

  return (
    <div className="mx-auto max-w-4xl px-4 py-8 sm:px-6 lg:px-8">
      {/* Header */}
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="font-serif text-3xl font-bold text-dta-dark">Mes billets</h1>
          <p className="mt-1 text-sm text-dta-char/60">
            Gérez vos réservations et suivez vos paiements
          </p>
        </div>
        <Link
          href="/saison-culturelle-africaine"
          className="hidden items-center gap-1.5 rounded-xl bg-dta-accent px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-dta-accent-dark sm:inline-flex"
        >
          Voir les événements
          <ChevronRight size={14} />
        </Link>
      </div>

      {/* Stats */}
      <div className="mb-8 grid grid-cols-2 gap-4 sm:grid-cols-4">
        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <div className="flex items-center gap-3">
            <div className="rounded-xl bg-blue-50 p-2.5">
              <Ticket size={18} className="text-blue-600" />
            </div>
            <div>
              <p className="text-xs font-medium text-slate-500">Billets</p>
              <p className="font-serif text-2xl font-bold text-slate-900">{totalTickets}</p>
            </div>
          </div>
        </div>
        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <div className="flex items-center gap-3">
            <div className="rounded-xl bg-green-50 p-2.5">
              <CreditCard size={18} className="text-green-600" />
            </div>
            <div>
              <p className="text-xs font-medium text-slate-500">Total versé</p>
              <p className="font-serif text-2xl font-bold text-green-600">{formatPrice(totalPaid)}</p>
            </div>
          </div>
        </div>
        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <div className="flex items-center gap-3">
            <div className="rounded-xl bg-amber-50 p-2.5">
              <QrCode size={18} className="text-amber-600" />
            </div>
            <div>
              <p className="text-xs font-medium text-slate-500">Reste à payer</p>
              <p className="font-serif text-2xl font-bold text-amber-600">{formatPrice(totalRemaining)}</p>
            </div>
          </div>
        </div>
        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <div className="flex items-center gap-3">
            <div className="rounded-xl bg-purple-50 p-2.5">
              <Ticket size={18} className="text-purple-600" />
            </div>
            <div>
              <p className="text-xs font-medium text-slate-500">Soldés</p>
              <p className="font-serif text-2xl font-bold text-purple-600">{fullyPaidCount}/{totalTickets}</p>
            </div>
          </div>
        </div>
      </div>

      {tickets.length === 0 ? (
        <div className="rounded-2xl border border-slate-200 bg-white p-12 text-center shadow-sm">
          <Ticket size={48} className="mx-auto text-slate-300" />
          <h2 className="mt-4 font-serif text-xl font-bold text-slate-900">Aucun billet</h2>
          <p className="mt-2 text-sm text-slate-500">
            Vous n&apos;avez pas encore acheté de billets.
          </p>
          <Link
            href="/saison-culturelle-africaine"
            className="mt-6 inline-flex items-center rounded-xl bg-dta-accent px-6 py-3 text-sm font-semibold text-white hover:bg-dta-accent-dark"
          >
            Explorer les événements
          </Link>
        </div>
      ) : (
        <>
          {/* Upcoming tickets */}
          {upcoming.length > 0 && (
            <section className="mb-10">
              <h2 className="mb-5 flex items-center gap-2 font-serif text-xl font-bold text-slate-900">
                <span className="inline-block h-2 w-2 rounded-full bg-green-500"></span>
                À venir ({upcoming.length})
              </h2>
              <div className="space-y-4">
                {upcoming.map((ticket) => (
                  <TicketCard key={ticket.id} ticket={ticket} userEmail={session.user.email!} />
                ))}
              </div>
            </section>
          )}

          {/* Past tickets */}
          {past.length > 0 && (
            <section className="mb-10">
              <h2 className="mb-5 flex items-center gap-2 font-serif text-xl font-bold text-slate-900">
                <span className="inline-block h-2 w-2 rounded-full bg-slate-300"></span>
                Passés ({past.length})
              </h2>
              <div className="space-y-4 opacity-70">
                {past.map((ticket) => (
                  <TicketCard key={ticket.id} ticket={ticket} userEmail={session.user.email!} />
                ))}
              </div>
            </section>
          )}

          {/* Payment history */}
          {allPayments.length > 0 && (
            <section>
              <h2 className="mb-5 font-serif text-xl font-bold text-slate-900">
                Historique des versements
              </h2>
              <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
                <div className="divide-y divide-slate-100">
                  {allPayments.map((p) => (
                    <div key={p.id} className="flex items-center justify-between px-5 py-4">
                      <div className="flex items-center gap-3">
                        <div className="rounded-lg bg-green-50 p-2">
                          <CreditCard size={14} className="text-green-600" />
                        </div>
                        <div>
                          <p className="text-sm font-medium text-slate-900">{p.label}</p>
                          <p className="text-xs text-slate-500">
                            {p.eventTitle} &middot; {new Date(p.paidAt).toLocaleDateString("fr-FR", { day: "numeric", month: "short", year: "numeric" })}
                          </p>
                        </div>
                      </div>
                      <span className="text-sm font-bold text-green-600">+{formatPrice(p.amount)}</span>
                    </div>
                  ))}
                </div>
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
  userEmail,
}: {
  userEmail: string;
  ticket: {
    id: string;
    tier: string;
    price: number;
    totalPaid: number;
    firstName: string | null;
    lastName: string | null;
    qrCode: string | null;
    purchasedAt: Date;
    checkedInAt: Date | null;
    transferCount: number;
    payments: Array<{ id: string; amount: number; type: string; label: string; paidAt: Date }>;
    transfers: Array<{ id: string; toEmail: string; toFirstName: string | null; expiresAt: Date; createdAt: Date }>;
    event: {
      title: string;
      slug: string;
      venue: string;
      address: string;
      date: Date;
      coverImage: string | null;
      tiers: unknown;
      published: boolean;
    };
  };
}) {
  const remaining = Math.max(0, ticket.price - ticket.totalPaid);
  const isPaid = ticket.totalPaid >= ticket.price;
  const percent = ticket.price > 0 ? Math.min(100, Math.round((ticket.totalPaid / ticket.price) * 100)) : 100;
  const eventDate = new Date(ticket.event.date);
  const tierLabel = resolveTierLabel(ticket.tier, ticket.event.tiers);
  const tierColor = tierColors[ticket.tier] || "bg-slate-50 text-slate-700 border-slate-200";

  const transferDeadline = eventDate.getTime() - TRANSFER_CONFIG.DELAI_LIMITE_H * 3600 * 1000;
  const canTransfer =
    isPaid &&
    !ticket.checkedInAt &&
    ticket.transferCount < TRANSFER_CONFIG.MAX_TRANSFERS &&
    ticket.event.published &&
    Date.now() < transferDeadline;

  return (
    <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm transition-shadow hover:shadow-md">
      {/* Top section */}
      <div className="flex items-start justify-between gap-4 p-5">
        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-2">
            <span className={`inline-block rounded-full border px-2.5 py-0.5 text-[11px] font-semibold ${tierColor}`}>
              {tierLabel}
            </span>
            <span className={`inline-block rounded-full px-2.5 py-0.5 text-[11px] font-semibold ${
              isPaid ? "bg-green-50 text-green-700" : "bg-amber-50 text-amber-700"
            }`}>
              {isPaid ? "Soldé" : `${percent}% payé`}
            </span>
          </div>

          <h3 className="mt-2 font-serif text-lg font-bold text-slate-900">
            <Link href={`/saison-culturelle-africaine/${ticket.event.slug}`} className="hover:text-dta-accent">
              {ticket.event.title}
            </Link>
          </h3>

          <div className="mt-2 flex flex-wrap items-center gap-3 text-xs text-slate-500">
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

        {/* Cover image (top-right) + date badge */}
        <div className="flex flex-shrink-0 items-start gap-3">
          <Link
            href={`/saison-culturelle-africaine/${ticket.event.slug}`}
            className="relative block h-20 w-20 overflow-hidden rounded-xl border border-slate-200 bg-slate-50 sm:h-24 sm:w-24"
          >
            {ticket.event.coverImage ? (
              <Image
                src={ticket.event.coverImage}
                alt={ticket.event.title}
                fill
                className="object-cover"
                sizes="(min-width: 640px) 96px, 80px"
              />
            ) : (
              <div className="h-full w-full bg-gradient-to-br from-dta-accent/20 to-dta-accent/5" />
            )}
          </Link>

          <div className="rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-center">
            <span className="block text-[10px] font-bold uppercase text-dta-accent">
              {eventDate.toLocaleDateString("fr-FR", { month: "short" })}
            </span>
            <span className="block font-serif text-2xl font-bold text-slate-900">
              {eventDate.getDate()}
            </span>
          </div>
        </div>
      </div>

      {/* Payment progress */}
      <div className="border-t border-slate-100 px-5 py-4">
        <div className="flex items-center justify-between text-xs">
          <span className="font-medium text-green-600">{formatPrice(ticket.totalPaid)} versés</span>
          <span className="text-slate-500">sur {formatPrice(ticket.price)}</span>
        </div>
        <div className="mt-2 h-2 overflow-hidden rounded-full bg-slate-100">
          <div
            className={`h-full rounded-full transition-all duration-500 ${
              isPaid ? "bg-green-500" : "bg-gradient-to-r from-amber-400 to-dta-accent"
            }`}
            style={{ width: `${percent}%` }}
          />
        </div>
        {!isPaid && (
          <div className="mt-1.5 flex items-center justify-between text-xs text-slate-500">
            <span>Reste {formatPrice(remaining)}</span>
            <span>{percent}%</span>
          </div>
        )}
      </div>

      {/* Bottom: QR code (soldé) ou recharge (en cours) */}
      <div className="flex items-center justify-between border-t border-slate-100 px-5 py-4">
        <div className="flex items-center gap-3">
          {isPaid && ticket.qrCode ? (
            <div className="rounded-lg border border-green-200 bg-green-50 p-1">
              <img src={ticket.qrCode} alt="QR Code" className="h-14 w-14" />
            </div>
          ) : (
            <div className="flex h-14 w-14 items-center justify-center rounded-lg border border-dashed border-slate-300 bg-slate-50">
              <QrCode size={20} className="text-slate-300" />
            </div>
          )}
          <div>
            <p className="text-xs text-slate-500">
              {ticket.firstName} {ticket.lastName}
            </p>
            {isPaid ? (
              <p className="text-[10px] font-medium text-green-600">QR code actif — présentez-le à l&apos;entrée</p>
            ) : (
              <p className="text-[10px] text-amber-600">Soldez votre billet pour activer le QR code</p>
            )}
            <p className="font-mono text-[10px] text-slate-400">
              Réf : {ticket.id.slice(0, 8).toUpperCase()}
            </p>
          </div>
        </div>

        {!isPaid && (
          <RechargeButton ticketId={ticket.id} email={userEmail} remaining={remaining} />
        )}

        {isPaid && canTransfer && (
          <TransferButton
            ticketId={ticket.id}
            eventTitle={ticket.event.title}
            pendingTransfers={ticket.transfers.map((t) => ({
              id: t.id,
              toEmail: t.toEmail,
              toFirstName: t.toFirstName,
              expiresAt: t.expiresAt.toISOString(),
              createdAt: t.createdAt.toISOString(),
            }))}
          />
        )}
      </div>
    </div>
  );
}

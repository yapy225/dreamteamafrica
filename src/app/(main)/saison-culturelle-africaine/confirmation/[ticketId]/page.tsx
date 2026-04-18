import Link from "next/link";
import Image from "next/image";
import Script from "next/script";
import { CheckCircle, Calendar, MapPin, Download, ArrowLeft, Mail } from "lucide-react";
import { prisma } from "@/lib/db";
import { formatDate, formatPrice } from "@/lib/utils";
import { sendTicketConfirmationEmail } from "@/lib/email";
import { auth } from "@/lib/auth";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "Réservation confirmée — Dream Team Africa",
  description: "Votre billet est prêt. Consultez votre confirmation et présentez votre QR code à l'entrée de l'événement.",
  robots: { index: false, follow: false },
};

const tierLabels: Record<string, string> = {
  EARLY_BIRD: "Early Bird",
  STANDARD: "Standard",
  VIP: "VIP",
};

const tierColors: Record<string, string> = {
  EARLY_BIRD: "from-blue-600 to-blue-800",
  STANDARD: "from-dta-accent to-dta-accent-dark",
  VIP: "from-amber-500 to-amber-700",
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

export default async function ConfirmationPage({
  params,
}: {
  params: Promise<{ ticketId: string }>;
}) {
  const { ticketId } = await params;

  const tickets = await prisma.ticket.findMany({
    where: { stripeSessionId: ticketId },
    include: { event: true },
  });

  const finalTickets =
    tickets.length > 0
      ? tickets
      : await prisma.ticket.findMany({
          where: { id: ticketId },
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
  const totalAmount = finalTickets.reduce((sum, t) => sum + t.price, 0);
  const eventDate = new Date(event.date);
  const holderName = `${finalTickets[0].firstName ?? ""} ${finalTickets[0].lastName ?? ""}`.trim();

  // Access control : full PII/QR shown only to:
  //   (a) visitors redirected from Stripe recently (<15 min after ticket creation)
  //   (b) authenticated owner (session.user.email === ticket.email)
  const session = await auth();
  const ticketAge = Date.now() - new Date(finalTickets[0].purchasedAt).getTime();
  const WINDOW_MS = 15 * 60 * 1000;
  const isOwner = !!session?.user?.email &&
    session.user.email.toLowerCase() === (finalTickets[0].email ?? "").toLowerCase();
  const canShowPII = ticketAge < WINDOW_MS || isOwner;

  if (!canShowPII) {
    return (
      <div className="mx-auto max-w-2xl px-4 py-20 text-center">
        <div className="mx-auto mb-4 inline-flex rounded-full bg-emerald-100 p-3">
          <Mail size={32} className="text-emerald-600" />
        </div>
        <h1 className="font-serif text-3xl font-bold text-dta-dark">Billets déjà envoyés</h1>
        <p className="mt-4 text-dta-char/70">
          Pour protéger vos données, cette page ne s&apos;affiche plus après 15 minutes.
          Vos billets et votre QR code ont été envoyés par email. Retrouvez-les également
          dans votre{" "}
          <Link href="/mon-espace" className="font-medium text-dta-accent hover:underline">
            espace personnel
          </Link>
          {" "}ou{" "}
          <Link href="/mes-billets" className="font-medium text-dta-accent hover:underline">
            via votre email
          </Link>.
        </p>
        <Link
          href="/mes-billets"
          className="mt-8 inline-flex items-center rounded-[var(--radius-button)] bg-dta-accent px-6 py-3 text-sm font-semibold text-white hover:bg-dta-accent-dark"
        >
          Retrouver mes billets
        </Link>
      </div>
    );
  }

  // Backup: send confirmation email only if ticket was purchased within the last 5 minutes
  // This prevents email spam on page refresh while ensuring delivery on first visit
  const recipientEmail = finalTickets[0].email;
  const purchaseAge = Date.now() - new Date(finalTickets[0].purchasedAt).getTime();
  const FIVE_MINUTES = 5 * 60 * 1000;

  if (recipientEmail && purchaseAge < FIVE_MINUTES) {
    const customTiers = event.tiers as Array<{ id: string; name: string }> | null;
    const matched = Array.isArray(customTiers)
      ? customTiers.find((t) => t.id === finalTickets[0].tier)
      : null;
    const legacyMap: Record<string, string> = { EARLY_BIRD: "Early Bird", STANDARD: "Standard", VIP: "VIP" };
    const tierLabel = matched?.name || legacyMap[finalTickets[0].tier] || finalTickets[0].tier;

    sendTicketConfirmationEmail({
      to: recipientEmail,
      guestName: holderName || recipientEmail,
      eventTitle: event.title,
      eventVenue: event.venue,
      eventAddress: event.address,
      eventDate: finalTickets[0].visitDate || event.date,
      eventCoverImage: event.coverImage,
      tier: tierLabel,
      price: finalTickets[0].price,
      quantity: finalTickets.length,
      tickets: finalTickets.map((t) => ({ id: t.id, qrCode: t.qrCode })),
    }).catch((err) => console.error("Backup confirmation email failed:", err));
  }

  return (
    <>
      <Script id="ticket-conversion" strategy="afterInteractive">{`
        window.dataLayer = window.dataLayer || [];
        window.dataLayer.push({
          event: 'purchase',
          ecommerce: {
            transaction_id: ${JSON.stringify(ticketId)},
            value: ${Number(totalAmount) || 0},
            currency: 'EUR',
            items: [{
              item_name: ${JSON.stringify(event.title)},
              item_category: 'Billet',
              price: ${Number(finalTickets[0].price) || 0},
              quantity: ${finalTickets.length}
            }]
          }
        });
        if(typeof fbq==='function'){
          fbq('track','Purchase',{value:${Number(totalAmount) || 0},currency:'EUR',content_name:${JSON.stringify(event.title)},content_type:'product',content_ids:[${JSON.stringify(ticketId)}]}, {eventID: ${JSON.stringify(ticketId)}});
        }
      `}</Script>

      <div className="mx-auto max-w-2xl px-4 py-12 sm:px-6">
        {/* Success header */}
        <div className="mb-10 text-center">
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

        {/* Visual Tickets */}
        <div className="space-y-8">
          {finalTickets.map((ticket, i) => (
            <div
              key={ticket.id}
              className="overflow-hidden rounded-2xl bg-dta-dark shadow-xl"
            >
              {/* Event cover header */}
              <div className="relative h-48 sm:h-56">
                {event.coverImage ? (
                  <Image
                    src={event.coverImage}
                    alt={event.title}
                    fill
                    className="object-cover"
                    sizes="(max-width: 640px) 100vw, 580px"
                  />
                ) : (
                  <div className={`h-full w-full bg-gradient-to-br ${tierColors[ticket.tier] || tierColors.STANDARD}`} />
                )}
                <div className="absolute inset-0 bg-gradient-to-t from-dta-dark via-dta-dark/40 to-transparent" />

                {/* Logo watermark */}
                <div className="absolute left-5 top-5">
                  <Image
                    src="/logo-dta.png"
                    alt="DTA"
                    width={28}
                    height={28}
                    className="opacity-80"
                  />
                </div>

                {/* Tier badge */}
                <div className="absolute right-5 top-5">
                  <span className={`rounded-full px-4 py-1.5 text-xs font-bold uppercase tracking-wider text-white ${tierBadgeColors[ticket.tier] || tierBadgeColors.STANDARD}`}>
                    {resolveTierLabel(ticket.tier, event.tiers)}
                  </span>
                </div>

                {/* Event title overlay */}
                <div className="absolute inset-x-0 bottom-0 p-5 sm:p-6">
                  <h2 className="font-serif text-2xl font-bold leading-tight text-white sm:text-3xl">
                    {event.title}
                  </h2>
                  <div className="mt-2 flex flex-wrap items-center gap-3 text-sm text-white/80">
                    <span className="flex items-center gap-1.5">
                      <Calendar size={14} />
                      {formatDate(event.date)}
                    </span>
                    <span className="flex items-center gap-1.5">
                      <MapPin size={14} />
                      {event.venue}
                    </span>
                  </div>
                </div>
              </div>

              {/* Perforated divider */}
              <div className="relative flex items-center">
                <div className="absolute -left-3 h-6 w-6 rounded-full bg-dta-bg" />
                <div className="w-full border-t-2 border-dashed border-white/20" />
                <div className="absolute -right-3 h-6 w-6 rounded-full bg-dta-bg" />
              </div>

              {/* Ticket info + QR */}
              <div className="flex items-center justify-between gap-4 p-5 sm:p-6">
                <div className="min-w-0 flex-1">
                  {/* Date large */}
                  <div className="flex items-baseline gap-2">
                    <span className="font-serif text-4xl font-bold text-white">
                      {eventDate.getDate()}
                    </span>
                    <div>
                      <span className="block text-sm font-semibold uppercase text-dta-accent">
                        {eventDate.toLocaleDateString("fr-FR", { month: "long" })}
                      </span>
                      <span className="block text-xs text-white/50">
                        {eventDate.toLocaleDateString("fr-FR", { weekday: "long" })} &middot; {eventDate.getFullYear()}
                      </span>
                    </div>
                  </div>

                  {/* Details */}
                  <div className="mt-4 space-y-1.5">
                    <div className="flex items-center justify-between">
                      <span className="text-xs uppercase tracking-wider text-white/40">Prix</span>
                      <span className="font-semibold text-white">{formatPrice(ticket.price)}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-xs uppercase tracking-wider text-white/40">Catégorie</span>
                      <span className="font-semibold text-dta-accent">{resolveTierLabel(ticket.tier, event.tiers)}</span>
                    </div>
                    {finalTickets.length > 1 && (
                      <div className="flex items-center justify-between">
                        <span className="text-xs uppercase tracking-wider text-white/40">Billet</span>
                        <span className="font-semibold text-white">{i + 1} / {finalTickets.length}</span>
                      </div>
                    )}
                    <div className="flex items-center justify-between">
                      <span className="text-xs uppercase tracking-wider text-white/40">Réf.</span>
                      <span className="font-mono text-xs text-white/60">{ticket.id.slice(0, 8).toUpperCase()}</span>
                    </div>
                  </div>
                </div>

                {/* QR Code */}
                {ticket.qrCode && (
                  <div className="flex-shrink-0">
                    <div className="rounded-xl bg-white p-2">
                      <img
                        src={ticket.qrCode}
                        alt={`QR Code — Billet ${i + 1}`}
                        className="h-28 w-28 sm:h-32 sm:w-32"
                      />
                    </div>
                    <p className="mt-1.5 text-center text-[10px] text-white/30">
                      Présentez ce code à l&apos;entrée
                    </p>
                  </div>
                )}
              </div>

              {/* Footer bar */}
              <div className="flex items-center justify-between bg-white/5 px-5 py-3 sm:px-6">
                <span className="text-[10px] uppercase tracking-widest text-white/30">
                  Dream Team Africa &mdash; Saison 2026
                </span>
                <span className="text-[10px] text-white/30">
                  {`${ticket.firstName ?? ""} ${ticket.lastName ?? ""}`.trim() || holderName}
                </span>
              </div>
            </div>
          ))}
        </div>

        {/* Culture pour Tous — solde restant */}
        {totalAmount > 0 && finalTickets.some(t => t.totalPaid < t.price) && (
          <div className="mt-8 rounded-2xl border border-green-200 bg-green-50 p-6">
            <div className="flex items-start gap-3">
              <span className="text-2xl">✨</span>
              <div>
                <h2 className="font-serif text-lg font-bold text-green-800">
                  Culture pour Tous — Rechargez à votre rythme
                </h2>
                <p className="mt-1 text-sm text-green-700">
                  Votre billet est réservé ! Il vous reste{" "}
                  <strong>{formatPrice(finalTickets.reduce((s, t) => s + (t.price - t.totalPaid), 0))}</strong>{" "}
                  à régler avant l&apos;événement. Rechargez quand vous voulez, dès 1&nbsp;&euro;.
                </p>
                <div className="mt-3 flex flex-wrap gap-2">
                  <Link
                    href="/dashboard/tickets"
                    className="inline-flex items-center rounded-lg bg-green-600 px-4 py-2 text-xs font-semibold text-white hover:bg-green-700"
                  >
                    Recharger mon billet
                  </Link>
                  <Link
                    href="/culture-pour-tous"
                    className="inline-flex items-center rounded-lg border border-green-300 px-4 py-2 text-xs font-semibold text-green-700 hover:bg-green-100"
                  >
                    Comment ça marche ?
                  </Link>
                </div>
              </div>
            </div>
          </div>
        )}

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
            href="/saison-culturelle-africaine"
            className="flex flex-1 items-center justify-center gap-2 rounded-[var(--radius-button)] border border-dta-sand px-6 py-3 text-sm font-semibold text-dta-char hover:bg-dta-beige"
          >
            <ArrowLeft size={16} />
            Retour aux événements
          </Link>
        </div>
      </div>
    </>
  );
}

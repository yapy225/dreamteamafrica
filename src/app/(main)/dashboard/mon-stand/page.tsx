import { redirect } from "next/navigation";
import Link from "next/link";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/db";
import {
  EXHIBITOR_EVENTS,
  EXHIBITOR_PACKS,
  DEPOSIT_AMOUNT,
} from "@/lib/exhibitor-events";
import {
  CheckCircle,
  Clock,
  CreditCard,
  CalendarDays,
  Store,
  FileImage,
  ExternalLink,
  AlertCircle,
  Download,
} from "lucide-react";
import ExhibitorProfileClientForm from "./ExhibitorProfileClientForm";
import EarlyPaymentButton from "../../exposants/confirmation/[id]/EarlyPaymentButton";

export const dynamic = "force-dynamic";
export const metadata = { title: "Mon espace exposant | Dashboard" };

export default async function MonStandPage() {
  const session = await auth();
  if (!session) redirect("/auth/signin");

  // Find ALL user's exhibitor bookings
  const bookings = await prisma.exhibitorBooking.findMany({
    where: { userId: session.user.id },
    include: { profile: true, payments: { orderBy: { paidAt: "asc" } } },
    orderBy: { createdAt: "desc" },
  });

  // Active booking (most recent PARTIAL or CONFIRMED)
  const activeBooking = bookings.find((b) =>
    b.status === "PARTIAL" || b.status === "CONFIRMED"
  );

  const formatter = new Intl.NumberFormat("fr-FR", {
    style: "currency",
    currency: "EUR",
  });

  // No booking at all — show CTA to reserve
  if (!bookings.length) {
    return (
      <div className="mx-auto max-w-3xl px-4 py-16 text-center">
        <Store size={48} className="mx-auto text-dta-accent/40" />
        <h1 className="mt-6 font-serif text-3xl font-bold text-dta-dark">
          Mon espace exposant
        </h1>
        <p className="mt-4 text-dta-char/70 max-w-md mx-auto">
          Vous n&apos;avez pas encore de r&eacute;servation de stand.
          R&eacute;servez votre stand pour acc&eacute;der &agrave; votre espace
          exposant complet.
        </p>
        <div className="mt-8 flex flex-col sm:flex-row gap-3 justify-center">
          <Link
            href="/exposants"
            className="rounded-[var(--radius-button)] bg-dta-accent px-6 py-3 text-sm font-semibold text-white hover:bg-dta-accent-dark"
          >
            D&eacute;couvrir les formules
          </Link>
          <Link
            href="/resa-exposants/foire-dafrique-paris"
            className="rounded-[var(--radius-button)] border border-dta-accent px-6 py-3 text-sm font-semibold text-dta-accent hover:bg-dta-accent/5"
          >
            R&eacute;server un stand
          </Link>
        </div>
      </div>
    );
  }

  // Prepare active booking data
  const booking = activeBooking || bookings[0];
  const pack = EXHIBITOR_PACKS.find((p) => p.id === booking.pack);
  const events = EXHIBITOR_EVENTS.filter((e) =>
    booking.events.includes(e.id)
  );

  // Payment calculations
  const stands = booking.stands ?? 1;
  const deposit = Math.min(DEPOSIT_AMOUNT * stands, booking.totalPrice);
  const totalRemaining = booking.totalPrice - deposit;
  const totalMonths = booking.installments - 1;
  const monthlyAmount =
    totalMonths > 0
      ? Math.ceil((totalRemaining / totalMonths) * 100) / 100
      : 0;
  const paidMonths = Math.max(0, booking.paidInstallments - 1);
  const paidAmount = deposit + paidMonths * monthlyAmount;
  const remainingBalance = Math.max(0, booking.totalPrice - paidAmount);
  const remainingInstallments = totalMonths - paidMonths;
  const progressPercent = Math.round(
    (paidAmount / booking.totalPrice) * 100
  );

  // Profile
  let profile = booking.profile;
  if (activeBooking && !profile) {
    const { randomUUID } = await import("crypto");
    profile = await prisma.exhibitorProfile.create({
      data: {
        bookingId: booking.id,
        userId: session.user.id,
        token: randomUUID(),
      },
    });
  }

  return (
    <div className="mx-auto max-w-5xl px-4 py-12 sm:px-6 lg:px-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="font-serif text-3xl font-bold text-dta-dark">
          Mon espace exposant
        </h1>
        <p className="mt-2 text-dta-char/70">
          G&eacute;rez votre r&eacute;servation, suivez vos paiements et
          compl&eacute;tez votre fiche de visibilit&eacute;.
        </p>
      </div>

      {/* Status banner */}
      <div
        className={`mb-8 flex items-center gap-3 rounded-[var(--radius-card)] px-5 py-4 ${
          booking.status === "CONFIRMED"
            ? "bg-green-50 border border-green-200"
            : booking.status === "PARTIAL"
              ? "bg-amber-50 border border-amber-200"
              : booking.status === "CANCELLED"
                ? "bg-red-50 border border-red-200"
                : "bg-gray-50 border border-gray-200"
        }`}
      >
        {booking.status === "CONFIRMED" ? (
          <CheckCircle size={20} className="shrink-0 text-green-600" />
        ) : booking.status === "PARTIAL" ? (
          <Clock size={20} className="shrink-0 text-amber-600" />
        ) : (
          <AlertCircle size={20} className="shrink-0 text-gray-500" />
        )}
        <div>
          <p
            className={`text-sm font-medium ${
              booking.status === "CONFIRMED"
                ? "text-green-800"
                : booking.status === "PARTIAL"
                  ? "text-amber-800"
                  : "text-gray-700"
            }`}
          >
            {booking.status === "CONFIRMED"
              ? "Votre stand est confirmé et entièrement payé"
              : booking.status === "PARTIAL"
                ? `Paiement en cours — ${formatter.format(remainingBalance)} restant`
                : booking.status === "CANCELLED"
                  ? "Réservation annulée"
                  : "En attente de paiement"}
          </p>
          <p className="text-xs text-dta-char/60 mt-0.5">
            R&eacute;f. {booking.id}
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        {/* ── Left column: Reservation + Payment ── */}
        <div className="lg:col-span-2 space-y-6">
          {/* Reservation summary */}
          <div className="rounded-[var(--radius-card)] border border-dta-sand bg-white p-6 shadow-[var(--shadow-card)]">
            <h2 className="flex items-center gap-2 font-serif text-lg font-bold text-dta-dark mb-4">
              <Store size={18} className="text-dta-accent" />
              Ma r&eacute;servation
            </h2>
            <dl className="grid grid-cols-2 gap-x-6 gap-y-3 text-sm">
              <div>
                <dt className="text-dta-taupe">Formule</dt>
                <dd className="font-medium text-dta-dark">{pack?.name}</dd>
              </div>
              <div>
                <dt className="text-dta-taupe">Entreprise</dt>
                <dd className="font-medium text-dta-dark">
                  {booking.companyName}
                </dd>
              </div>
              <div>
                <dt className="text-dta-taupe">Stands</dt>
                <dd className="font-medium text-dta-dark">
                  {stands} stand{stands > 1 ? "s" : ""} ({stands * 2} m&sup2;)
                </dd>
              </div>
              <div>
                <dt className="text-dta-taupe">Dur&eacute;e</dt>
                <dd className="font-medium text-dta-dark">
                  {booking.totalDays} jour{booking.totalDays > 1 ? "s" : ""}
                </dd>
              </div>
            </dl>

            {/* Events list */}
            <div className="mt-4 pt-4 border-t border-dta-sand">
              <h3 className="flex items-center gap-1.5 text-sm font-medium text-dta-dark mb-2">
                <CalendarDays size={14} className="text-dta-accent" />
                &Eacute;v&eacute;nements
              </h3>
              <ul className="space-y-1.5">
                {events.map((e) => (
                  <li
                    key={e.id}
                    className="flex items-center justify-between text-sm"
                  >
                    <span className="text-dta-dark">{e.title}</span>
                    <span className="text-dta-taupe text-xs">
                      {new Date(e.date + "T12:00:00").toLocaleDateString(
                        "fr-FR",
                        { day: "numeric", month: "long" }
                      )}
                      {e.endDate &&
                        ` – ${new Date(
                          e.endDate + "T12:00:00"
                        ).toLocaleDateString("fr-FR", {
                          day: "numeric",
                          month: "long",
                        })}`}
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Payment tracking */}
          <div className="rounded-[var(--radius-card)] border border-dta-sand bg-white p-6 shadow-[var(--shadow-card)]">
            <div className="flex items-center justify-between mb-4">
              <h2 className="flex items-center gap-2 font-serif text-lg font-bold text-dta-dark">
                <CreditCard size={18} className="text-dta-accent" />
                Suivi des paiements
              </h2>
              {booking.invoiceNumber && (
                <a
                  href={`/api/exposants/${booking.id}/invoice`}
                  className="flex items-center gap-1.5 rounded-lg border border-dta-accent/30 bg-dta-accent/5 px-3 py-1.5 text-xs font-medium text-dta-accent hover:bg-dta-accent/10 transition-colors"
                >
                  <Download size={12} />
                  Facture {booking.invoiceNumber}
                </a>
              )}
            </div>

            {/* Progress bar */}
            <div className="mb-4">
              <div className="flex items-baseline justify-between mb-1.5">
                <span className="text-sm text-dta-char/70">
                  {formatter.format(paidAmount)} pay&eacute;
                  {booking.status !== "CONFIRMED" &&
                    ` sur ${formatter.format(booking.totalPrice)}`}
                </span>
                <span className="text-sm font-bold text-dta-dark">
                  {progressPercent}%
                </span>
              </div>
              <div className="h-3 w-full overflow-hidden rounded-full bg-gray-100">
                <div
                  className={`h-full rounded-full transition-all ${
                    progressPercent === 100
                      ? "bg-green-500"
                      : "bg-dta-accent"
                  }`}
                  style={{ width: `${progressPercent}%` }}
                />
              </div>
            </div>

            {/* Payment history table */}
            {booking.payments.length > 0 ? (
              <div className="overflow-hidden rounded-lg border border-dta-sand">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="bg-dta-bg text-left text-xs font-medium uppercase tracking-wider text-dta-taupe">
                      <th className="px-3 py-2">Date</th>
                      <th className="px-3 py-2">Libell&eacute;</th>
                      <th className="px-3 py-2 text-right">Montant</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-dta-sand">
                    {booking.payments.map((p) => (
                      <tr key={p.id}>
                        <td className="px-3 py-2.5 text-dta-char/70 whitespace-nowrap">
                          {new Date(p.paidAt).toLocaleDateString("fr-FR", {
                            day: "numeric",
                            month: "short",
                            year: "numeric",
                          })}
                        </td>
                        <td className="px-3 py-2.5 text-dta-dark">
                          <div className="flex items-center gap-1.5">
                            <CheckCircle size={12} className="shrink-0 text-green-500" />
                            {p.label}
                          </div>
                        </td>
                        <td className="px-3 py-2.5 text-right font-medium text-green-600">
                          {formatter.format(p.amount)}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                  <tfoot>
                    <tr className="bg-dta-bg">
                      <td colSpan={2} className="px-3 py-2.5 font-medium text-dta-char text-sm">
                        Total pay&eacute;
                      </td>
                      <td className="px-3 py-2.5 text-right font-bold text-dta-dark">
                        {formatter.format(
                          booking.payments.reduce((s, p) => s + p.amount, 0)
                        )}
                      </td>
                    </tr>
                    {remainingBalance > 0 && (
                      <tr>
                        <td colSpan={2} className="px-3 py-2 text-sm text-dta-char/70">
                          Solde restant
                        </td>
                        <td className="px-3 py-2 text-right font-medium text-dta-accent">
                          {formatter.format(remainingBalance)}
                        </td>
                      </tr>
                    )}
                  </tfoot>
                </table>
              </div>
            ) : (
              /* Fallback: reconstructed payment lines (for bookings before payment tracking) */
              <div className="space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <div className="flex items-center gap-2">
                    {booking.paidInstallments >= 1 ? (
                      <CheckCircle size={14} className="text-green-500" />
                    ) : (
                      <Clock size={14} className="text-gray-300" />
                    )}
                    <span className="text-dta-char/70">
                      {booking.installments > 1
                        ? "Acompte de réservation"
                        : "Paiement intégral"}
                    </span>
                  </div>
                  <span
                    className={`font-medium ${
                      booking.paidInstallments >= 1
                        ? "text-green-600"
                        : "text-dta-dark"
                    }`}
                  >
                    {formatter.format(
                      booking.installments > 1 ? deposit : booking.totalPrice
                    )}
                  </span>
                </div>

                {booking.installments > 1 &&
                  Array.from({ length: totalMonths }, (_, i) => {
                    const isPaid = i < paidMonths;
                    const date = new Date(booking.createdAt);
                    date.setMonth(date.getMonth() + i + 1);
                    return (
                      <div
                        key={i}
                        className="flex items-center justify-between text-sm"
                      >
                        <div className="flex items-center gap-2">
                          {isPaid ? (
                            <CheckCircle size={14} className="text-green-500" />
                          ) : (
                            <Clock size={14} className="text-gray-300" />
                          )}
                          <span className="text-dta-char/70">
                            Mensualit&eacute; {i + 1} &mdash;{" "}
                            {date.toLocaleDateString("fr-FR", {
                              month: "long",
                              year: "numeric",
                            })}
                          </span>
                        </div>
                        <span
                          className={`font-medium ${
                            isPaid ? "text-green-600" : "text-dta-dark"
                          }`}
                        >
                          {formatter.format(monthlyAmount)}
                        </span>
                      </div>
                    );
                  })}

                <div className="mt-2 flex items-center justify-between border-t border-dta-sand pt-2 text-sm">
                  <span className="font-medium text-dta-char">Total</span>
                  <span className="font-bold text-dta-dark">
                    {formatter.format(booking.totalPrice)}
                  </span>
                </div>
              </div>
            )}

            {/* Early payment CTA */}
            {booking.installments > 1 &&
              booking.status !== "CONFIRMED" &&
              remainingInstallments > 0 &&
              remainingBalance > 0 && (
                <div className="mt-6 rounded-xl border border-dta-accent/30 bg-dta-accent/5 p-5">
                  <EarlyPaymentButton
                    bookingId={booking.id}
                    remainingInstallments={remainingInstallments}
                    monthlyAmount={monthlyAmount}
                    remainingBalance={remainingBalance}
                  />
                </div>
              )}
          </div>
        </div>

        {/* ── Right column: Quick info + Actions ── */}
        <div className="space-y-6">
          {/* Quick stats */}
          <div className="rounded-[var(--radius-card)] border border-dta-sand bg-white p-5 shadow-[var(--shadow-card)]">
            <h3 className="text-sm font-semibold uppercase tracking-wider text-dta-taupe mb-3">
              En un coup d&apos;&oelig;il
            </h3>
            <div className="space-y-3 text-sm">
              <div className="flex justify-between">
                <span className="text-dta-char/70">Statut</span>
                <span
                  className={`rounded-full px-2.5 py-0.5 text-xs font-medium ${
                    booking.status === "CONFIRMED"
                      ? "bg-green-100 text-green-700"
                      : booking.status === "PARTIAL"
                        ? "bg-amber-100 text-amber-700"
                        : "bg-gray-100 text-gray-700"
                  }`}
                >
                  {booking.status === "CONFIRMED"
                    ? "Confirmé"
                    : booking.status === "PARTIAL"
                      ? "En cours"
                      : booking.status === "CANCELLED"
                        ? "Annulé"
                        : "En attente"}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-dta-char/70">Pay&eacute;</span>
                <span className="font-medium text-dta-dark">
                  {formatter.format(paidAmount)}
                </span>
              </div>
              {remainingBalance > 0 && (
                <div className="flex justify-between">
                  <span className="text-dta-char/70">Restant</span>
                  <span className="font-medium text-dta-accent">
                    {formatter.format(remainingBalance)}
                  </span>
                </div>
              )}
              <div className="flex justify-between">
                <span className="text-dta-char/70">Fiche exposant</span>
                <span
                  className={`rounded-full px-2.5 py-0.5 text-xs font-medium ${
                    profile?.submittedAt
                      ? "bg-green-100 text-green-700"
                      : "bg-gray-100 text-gray-500"
                  }`}
                >
                  {profile?.submittedAt ? "Envoyée" : "À compléter"}
                </span>
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="rounded-[var(--radius-card)] border border-dta-sand bg-white p-5 shadow-[var(--shadow-card)]">
            <h3 className="text-sm font-semibold uppercase tracking-wider text-dta-taupe mb-3">
              Actions
            </h3>
            <div className="space-y-2">
              <a
                href="#fiche-exposant"
                className="flex items-center gap-2 rounded-lg px-3 py-2.5 text-sm font-medium text-dta-dark hover:bg-dta-accent/5 transition-colors"
              >
                <FileImage size={16} className="text-dta-accent" />
                {profile?.submittedAt
                  ? "Modifier ma fiche"
                  : "Compléter ma fiche"}
              </a>
              {booking.invoiceNumber && (
                <a
                  href={`/api/exposants/${booking.id}/invoice`}
                  className="flex items-center gap-2 rounded-lg px-3 py-2.5 text-sm font-medium text-dta-dark hover:bg-dta-accent/5 transition-colors"
                >
                  <Download size={16} className="text-dta-accent" />
                  T&eacute;l&eacute;charger ma facture
                </a>
              )}
              <Link
                href="/exposants/listing"
                className="flex items-center gap-2 rounded-lg px-3 py-2.5 text-sm font-medium text-dta-dark hover:bg-dta-accent/5 transition-colors"
              >
                <ExternalLink size={16} className="text-dta-accent" />
                Annuaire des exposants
              </Link>
              <Link
                href="/exposants"
                className="flex items-center gap-2 rounded-lg px-3 py-2.5 text-sm font-medium text-dta-dark hover:bg-dta-accent/5 transition-colors"
              >
                <Store size={16} className="text-dta-accent" />
                R&eacute;server un autre stand
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* ── Profile form section ── */}
      {profile && (
        <div id="fiche-exposant" className="mt-10 scroll-mt-8">
          <div className="mb-6">
            <h2 className="font-serif text-2xl font-bold text-dta-dark">
              Ma fiche de visibilit&eacute;
            </h2>
            <p className="mt-1 text-sm text-dta-char/70">
              Compl&eacute;tez votre fiche pour b&eacute;n&eacute;ficier
              d&apos;une visibilit&eacute; sur nos r&eacute;seaux sociaux et
              supports de communication.
            </p>
            {profile.submittedAt && (
              <div className="mt-3 rounded-lg bg-green-50 border border-green-200 px-4 py-3">
                <p className="text-sm font-medium text-green-800">
                  Fiche envoy&eacute;e le{" "}
                  {new Intl.DateTimeFormat("fr-FR", {
                    day: "numeric",
                    month: "long",
                    year: "numeric",
                    hour: "2-digit",
                    minute: "2-digit",
                  }).format(profile.submittedAt)}
                  {" — "}en attente de validation par notre &eacute;quipe.
                </p>
              </div>
            )}
          </div>

          <ExhibitorProfileClientForm
            token={profile.token}
            booking={{
              companyName: booking.companyName,
              contactName: booking.contactName,
              email: booking.email,
              phone: booking.phone,
              sector: booking.sector,
              pack: booking.pack,
              events: booking.events,
            }}
          />
        </div>
      )}

      {/* Booking history */}
      {bookings.length > 1 && (
        <div className="mt-10">
          <h2 className="font-serif text-xl font-bold text-dta-dark mb-4">
            Historique des r&eacute;servations
          </h2>
          <div className="overflow-hidden rounded-[var(--radius-card)] border border-dta-sand bg-white shadow-[var(--shadow-card)]">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-dta-bg text-left text-xs font-medium uppercase tracking-wider text-dta-taupe">
                  <th className="px-4 py-3">Date</th>
                  <th className="px-4 py-3">Formule</th>
                  <th className="px-4 py-3">Total</th>
                  <th className="px-4 py-3">Statut</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-dta-sand">
                {bookings.map((b) => {
                  const bPack = EXHIBITOR_PACKS.find(
                    (p) => p.id === b.pack
                  );
                  return (
                    <tr key={b.id}>
                      <td className="px-4 py-3 text-dta-char/70">
                        {new Date(b.createdAt).toLocaleDateString("fr-FR", {
                          day: "numeric",
                          month: "short",
                          year: "numeric",
                        })}
                      </td>
                      <td className="px-4 py-3 font-medium text-dta-dark">
                        {bPack?.name || b.pack}
                      </td>
                      <td className="px-4 py-3 text-dta-dark">
                        {formatter.format(b.totalPrice)}
                      </td>
                      <td className="px-4 py-3">
                        <span
                          className={`rounded-full px-2 py-0.5 text-xs font-medium ${
                            b.status === "CONFIRMED"
                              ? "bg-green-100 text-green-700"
                              : b.status === "PARTIAL"
                                ? "bg-amber-100 text-amber-700"
                                : b.status === "CANCELLED"
                                  ? "bg-red-100 text-red-600"
                                  : "bg-gray-100 text-gray-600"
                          }`}
                        >
                          {b.status === "CONFIRMED"
                            ? "Confirmé"
                            : b.status === "PARTIAL"
                              ? "En cours"
                              : b.status === "CANCELLED"
                                ? "Annulé"
                                : "En attente"}
                        </span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}

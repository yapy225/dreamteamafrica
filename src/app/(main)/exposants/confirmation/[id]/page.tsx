import { redirect } from "next/navigation";
import Link from "next/link";
import Script from "next/script";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { CheckCircle, CalendarDays, Building2, CreditCard } from "lucide-react";
import { EXHIBITOR_EVENTS, EXHIBITOR_PACKS, DEPOSIT_AMOUNT } from "@/lib/exhibitor-events";
import EarlyPaymentButton from "./EarlyPaymentButton";

export const metadata = { title: "Confirmation Réservation Exposant" };

export default async function ConfirmationPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const session = await auth();
  if (!session) redirect("/auth/signin");

  const { id } = await params;

  const booking = await prisma.exhibitorBooking.findUnique({
    where: { id },
  });

  if (!booking || booking.userId !== session.user.id) {
    redirect("/exposants");
  }

  const pack = EXHIBITOR_PACKS.find((p) => p.id === booking.pack);
  const events = EXHIBITOR_EVENTS.filter((e) =>
    booking.events.includes(e.id)
  );

  const formatter = new Intl.NumberFormat("fr-FR", {
    style: "currency",
    currency: "EUR",
  });

  return (
    <>
      <Script id="conversion-tracking" strategy="afterInteractive">{`
        window.dataLayer = window.dataLayer || [];
        window.dataLayer = window.dataLayer || [];
        window.dataLayer.push({
          event: 'purchase',
          ecommerce: {
            transaction_id: '${booking.id}',
            value: ${booking.totalPrice},
            currency: 'EUR',
            items: [{
              item_name: '${pack?.name ?? booking.pack}',
              item_category: 'Stand Exposant',
              price: ${booking.totalPrice},
              quantity: 1
            }]
          }
        });
        if(typeof fbq==='function'){
          fbq('track','Purchase',{value:${booking.totalPrice},currency:'EUR',content_name:'Stand Exposant',content_type:'product'});
        }
      `}</Script>
    <div className="mx-auto max-w-2xl px-4 py-16 sm:px-6">
      <div className="text-center">
        <CheckCircle size={48} className="mx-auto text-green-500" />
        <h1 className="mt-4 font-serif text-3xl font-bold text-dta-dark">
          {booking.status === "CONFIRMED"
            ? "Réservation confirmée"
            : "Paiement enregistré"}
        </h1>
        <p className="mt-2 text-dta-char/70">
          {booking.status === "CONFIRMED"
            ? `Merci ${booking.contactName}, votre stand exposant est réservé.`
            : `Merci ${booking.contactName}, votre acompte a bien été reçu. Votre stand sera confirmé après paiement complet.`}
        </p>
      </div>

      <div className="mt-10 space-y-6">
        {/* Récap réservation */}
        <div className="rounded-[var(--radius-card)] border border-dta-sand bg-white p-6 shadow-[var(--shadow-card)]">
          <h2 className="mb-4 flex items-center gap-2 font-serif text-lg font-bold text-dta-dark">
            <Building2 size={18} className="text-dta-accent" />
            Votre r&eacute;servation
          </h2>
          <dl className="space-y-3 text-sm">
            <div className="flex justify-between">
              <dt className="text-dta-taupe">Formule</dt>
              <dd className="font-medium text-dta-dark">{pack?.name}</dd>
            </div>
            <div className="flex justify-between">
              <dt className="text-dta-taupe">Entreprise</dt>
              <dd className="font-medium text-dta-dark">
                {booking.companyName}
              </dd>
            </div>
            <div className="flex justify-between">
              <dt className="text-dta-taupe">Contact</dt>
              <dd className="font-medium text-dta-dark">
                {booking.contactName}
              </dd>
            </div>
            <div className="flex justify-between">
              <dt className="text-dta-taupe">Secteur</dt>
              <dd className="font-medium text-dta-dark">{booking.sector}</dd>
            </div>
            <div className="flex justify-between">
              <dt className="text-dta-taupe">R&eacute;f&eacute;rence</dt>
              <dd className="font-mono text-xs text-dta-dark">{booking.id}</dd>
            </div>
          </dl>
        </div>

        {/* Événements */}
        <div className="rounded-[var(--radius-card)] border border-dta-sand bg-white p-6 shadow-[var(--shadow-card)]">
          <h2 className="mb-4 flex items-center gap-2 font-serif text-lg font-bold text-dta-dark">
            <CalendarDays size={18} className="text-dta-accent" />
            &Eacute;v&eacute;nements ({booking.totalDays} jour
            {booking.totalDays > 1 ? "s" : ""})
          </h2>
          <ul className="space-y-2">
            {events.map((e) => (
              <li
                key={e.id}
                className="flex items-center justify-between text-sm"
              >
                <span className="text-dta-dark">{e.title}</span>
                <span className="text-dta-taupe">
                  {new Date(e.date + "T12:00:00").toLocaleDateString("fr-FR", {
                    day: "numeric",
                    month: "long",
                  })}
                  {e.endDate &&
                    ` – ${new Date(e.endDate + "T12:00:00").toLocaleDateString("fr-FR", {
                      day: "numeric",
                      month: "long",
                    })}`}
                </span>
              </li>
            ))}
          </ul>
        </div>

        {/* Paiement */}
        <div className="rounded-[var(--radius-card)] border border-dta-sand bg-white p-6 shadow-[var(--shadow-card)]">
          <h2 className="mb-4 flex items-center gap-2 font-serif text-lg font-bold text-dta-dark">
            <CreditCard size={18} className="text-dta-accent" />
            Paiement
          </h2>
          <dl className="space-y-3 text-sm">
            <div className="flex justify-between">
              <dt className="text-dta-taupe">Total</dt>
              <dd className="font-bold text-dta-dark">
                {formatter.format(booking.totalPrice)}
              </dd>
            </div>
            {booking.installments > 1 && (() => {
              const deposit = Math.min(50, booking.totalPrice);
              const remaining = booking.totalPrice - deposit;
              const monthlyAmount = Math.ceil((remaining / (booking.installments - 1)) * 100) / 100;
              return (
              <>
                <div className="flex justify-between">
                  <dt className="text-dta-taupe">Acompte vers&eacute;</dt>
                  <dd className="font-medium text-dta-accent">
                    {formatter.format(deposit)}
                  </dd>
                </div>
                <div className="flex justify-between">
                  <dt className="text-dta-taupe">Solde restant</dt>
                  <dd className="font-medium text-dta-dark">
                    {formatter.format(remaining)}
                  </dd>
                </div>
                <div className="flex justify-between">
                  <dt className="text-dta-taupe">Mensualit&eacute;s</dt>
                  <dd className="font-medium text-dta-dark">
                    {booking.installments - 1}x {formatter.format(monthlyAmount)}
                  </dd>
                </div>
                <div className="flex justify-between">
                  <dt className="text-dta-taupe">Pay&eacute;</dt>
                  <dd className="font-medium text-green-600">
                    {booking.paidInstallments}/{booking.installments}
                  </dd>
                </div>
              </>
              );
            })()}
            <div className="flex justify-between">
              <dt className="text-dta-taupe">Statut</dt>
              <dd>
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
                      ? "Paiement en cours"
                      : "En attente"}
                </span>
              </dd>
            </div>
          </dl>
        </div>

        {/* Paiement anticipé — visible si mensualités en cours */}
        {booking.installments > 1 && booking.status !== "CONFIRMED" && (() => {
          const stands = booking.stands ?? 1;
          const dep = Math.min(DEPOSIT_AMOUNT * stands, booking.totalPrice);
          const totalRemaining = booking.totalPrice - dep;
          const totalMonths = booking.installments - 1;
          const monthly = totalMonths > 0 ? Math.ceil((totalRemaining / totalMonths) * 100) / 100 : 0;
          const paidMonths = Math.max(0, booking.paidInstallments - 1);
          const paidAmount = paidMonths * monthly;
          const balance = Math.max(0, totalRemaining - paidAmount);
          const remainingInst = totalMonths - paidMonths;
          if (remainingInst <= 0 || balance <= 0) return null;
          return (
            <div className="rounded-[var(--radius-card)] border border-dta-accent/30 bg-dta-accent/5 p-6 shadow-[var(--shadow-card)]">
              <EarlyPaymentButton
                bookingId={booking.id}
                remainingInstallments={remainingInst}
                monthlyAmount={monthly}
                remainingBalance={balance}
              />
            </div>
          );
        })()}
      </div>

      <div className="mt-8 text-center">
        <Link
          href="/dashboard"
          className="rounded-[var(--radius-button)] bg-dta-accent px-6 py-3 text-sm font-semibold text-white hover:bg-dta-accent-dark"
        >
          Retour au tableau de bord
        </Link>
      </div>
    </div>
    </>
  );
}

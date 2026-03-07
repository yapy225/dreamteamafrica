import { redirect } from "next/navigation";
import Link from "next/link";
import Script from "next/script";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { CheckCircle, CalendarDays, Building2, CreditCard } from "lucide-react";
import { EXHIBITOR_EVENTS, EXHIBITOR_PACKS } from "@/lib/exhibitor-events";

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
          R&eacute;servation confirm&eacute;e
        </h1>
        <p className="mt-2 text-dta-char/70">
          Merci {booking.contactName}, votre stand exposant est
          r&eacute;serv&eacute;.
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
            {booking.installments > 1 && (
              <>
                <div className="flex justify-between">
                  <dt className="text-dta-taupe">Mode</dt>
                  <dd className="font-medium text-dta-dark">
                    {booking.installments}x sans frais
                  </dd>
                </div>
                <div className="flex justify-between">
                  <dt className="text-dta-taupe">&Eacute;ch&eacute;ance</dt>
                  <dd className="font-medium text-dta-dark">
                    {formatter.format(booking.installmentAmount)} /mois
                  </dd>
                </div>
                <div className="flex justify-between">
                  <dt className="text-dta-taupe">Pay&eacute;</dt>
                  <dd className="font-medium text-green-600">
                    {booking.paidInstallments}/{booking.installments}
                  </dd>
                </div>
              </>
            )}
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

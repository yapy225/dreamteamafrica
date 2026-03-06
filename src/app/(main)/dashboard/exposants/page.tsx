import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { EXHIBITOR_EVENTS, EXHIBITOR_PACKS } from "@/lib/exhibitor-events";

export const dynamic = "force-dynamic";
export const metadata = { title: "Gestion Exposants | Dashboard" };

const statusLabels: Record<string, { label: string; cls: string }> = {
  PENDING: { label: "En attente", cls: "bg-gray-100 text-gray-700" },
  PARTIAL: { label: "Paiement en cours", cls: "bg-amber-100 text-amber-700" },
  CONFIRMED: { label: "Confirmé", cls: "bg-green-100 text-green-700" },
  CANCELLED: { label: "Annulé", cls: "bg-red-100 text-red-700" },
};

export default async function ExposantsDashboardPage() {
  const session = await auth();
  if (!session) redirect("/auth/signin");
  if (session.user.role !== "ADMIN") redirect("/dashboard");

  const bookings = await prisma.exhibitorBooking.findMany({
    include: { user: { select: { name: true, email: true } } },
    orderBy: { createdAt: "desc" },
  });

  const stats = {
    total: bookings.length,
    confirmed: bookings.filter((b) => b.status === "CONFIRMED").length,
    partial: bookings.filter((b) => b.status === "PARTIAL").length,
    revenue: bookings
      .filter((b) => b.status !== "CANCELLED")
      .reduce((sum, b) => sum + b.installmentAmount * b.paidInstallments, 0),
    expected: bookings
      .filter((b) => b.status !== "CANCELLED")
      .reduce((sum, b) => sum + b.totalPrice, 0),
  };

  const formatter = new Intl.NumberFormat("fr-FR", {
    style: "currency",
    currency: "EUR",
  });

  return (
    <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
      <h1 className="mb-2 font-serif text-3xl font-bold text-dta-dark">
        Gestion Exposants
      </h1>
      <p className="mb-8 text-dta-char/70">
        Saison Culturelle 2026 — Suivi des r&eacute;servations et paiements
      </p>

      {/* Stats */}
      <div className="mb-8 grid grid-cols-2 gap-4 sm:grid-cols-4">
        <div className="rounded-[var(--radius-card)] bg-white p-5 shadow-[var(--shadow-card)]">
          <p className="text-xs font-medium text-dta-taupe">
            R&eacute;servations
          </p>
          <p className="mt-1 font-serif text-2xl font-bold text-dta-dark">
            {stats.total}
          </p>
        </div>
        <div className="rounded-[var(--radius-card)] bg-white p-5 shadow-[var(--shadow-card)]">
          <p className="text-xs font-medium text-dta-taupe">
            Confirm&eacute;es
          </p>
          <p className="mt-1 font-serif text-2xl font-bold text-green-600">
            {stats.confirmed}
          </p>
        </div>
        <div className="rounded-[var(--radius-card)] bg-white p-5 shadow-[var(--shadow-card)]">
          <p className="text-xs font-medium text-dta-taupe">
            Encaiss&eacute;
          </p>
          <p className="mt-1 font-serif text-2xl font-bold text-dta-dark">
            {formatter.format(stats.revenue)}
          </p>
        </div>
        <div className="rounded-[var(--radius-card)] bg-white p-5 shadow-[var(--shadow-card)]">
          <p className="text-xs font-medium text-dta-taupe">CA attendu</p>
          <p className="mt-1 font-serif text-2xl font-bold text-dta-accent">
            {formatter.format(stats.expected)}
          </p>
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto rounded-[var(--radius-card)] bg-white shadow-[var(--shadow-card)]">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-dta-sand text-left">
              <th className="px-4 py-3 font-medium text-dta-taupe">
                Entreprise
              </th>
              <th className="px-4 py-3 font-medium text-dta-taupe">Pack</th>
              <th className="px-4 py-3 font-medium text-dta-taupe">
                &Eacute;v&eacute;nements
              </th>
              <th className="px-4 py-3 font-medium text-dta-taupe">Total</th>
              <th className="px-4 py-3 font-medium text-dta-taupe">
                Paiement
              </th>
              <th className="px-4 py-3 font-medium text-dta-taupe">Statut</th>
              <th className="px-4 py-3 font-medium text-dta-taupe">Date</th>
            </tr>
          </thead>
          <tbody>
            {bookings.length === 0 && (
              <tr>
                <td
                  colSpan={7}
                  className="px-4 py-8 text-center text-dta-taupe"
                >
                  Aucune r&eacute;servation pour le moment.
                </td>
              </tr>
            )}
            {bookings.map((b) => {
              const pack = EXHIBITOR_PACKS.find((p) => p.id === b.pack);
              const eventNames = EXHIBITOR_EVENTS.filter((e) =>
                b.events.includes(e.id)
              )
                .map((e) => e.title.replace(/^(Foire d'Afrique|Salon Made In Africa|Festival du Conte Africain|Juste Une Danse).*/, "$1"))
                .join(", ");
              const st = statusLabels[b.status] || statusLabels.PENDING;

              return (
                <tr
                  key={b.id}
                  className="border-b border-dta-sand/50 hover:bg-dta-bg/50"
                >
                  <td className="px-4 py-3">
                    <p className="font-medium text-dta-dark">
                      {b.companyName}
                    </p>
                    <p className="text-xs text-dta-taupe">{b.contactName}</p>
                  </td>
                  <td className="px-4 py-3 text-dta-char">
                    {pack?.name.replace("Pack ", "")}
                  </td>
                  <td className="max-w-[200px] px-4 py-3 text-xs text-dta-char/70">
                    {eventNames}
                  </td>
                  <td className="px-4 py-3 font-medium text-dta-dark">
                    {formatter.format(b.totalPrice)}
                  </td>
                  <td className="px-4 py-3">
                    {b.installments === 1 ? (
                      <span className="text-xs text-dta-char">1x</span>
                    ) : (
                      <span className="text-xs text-dta-char">
                        {b.paidInstallments}/{b.installments}x (
                        {formatter.format(b.installmentAmount)}/mois)
                      </span>
                    )}
                  </td>
                  <td className="px-4 py-3">
                    <span
                      className={`rounded-full px-2 py-0.5 text-xs font-medium ${st.cls}`}
                    >
                      {st.label}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-xs text-dta-taupe">
                    {new Date(b.createdAt).toLocaleDateString("fr-FR")}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}

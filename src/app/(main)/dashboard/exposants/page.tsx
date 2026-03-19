import { redirect } from "next/navigation";
import Link from "next/link";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { EXHIBITOR_EVENTS, EXHIBITOR_PACKS } from "@/lib/exhibitor-events";
import ResendQuoteButton from "./ResendQuoteButton";
import GeneratePostsButton from "./GeneratePostsButton";
import ValidateProfileButton from "./ValidateProfileButton";
import CashPaymentButton from "./CashPaymentButton";
import PublicationTracker from "./PublicationTracker";
import SearchFilter from "./SearchFilter";
import SendInviteButton from "./SendInviteButton";
import PublishButton from "./PublishButton";
import { DEPOSIT_AMOUNT } from "@/lib/exhibitor-events";

export const dynamic = "force-dynamic";
export const metadata = { title: "Gestion Exposants | Dashboard" };

const statusLabels: Record<string, { label: string; cls: string }> = {
  PENDING: { label: "En attente", cls: "bg-gray-100 text-gray-700" },
  PARTIAL: { label: "Paiement en cours", cls: "bg-amber-100 text-amber-700" },
  CONFIRMED: { label: "Confirmé", cls: "bg-green-100 text-green-700" },
  CANCELLED: { label: "Annulé", cls: "bg-red-100 text-red-700" },
};

export default async function ExposantsDashboardPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string }>;
}) {
  const session = await auth();
  if (!session) redirect("/auth/signin");
  if (session.user.role !== "ADMIN") redirect("/dashboard");

  const { q } = await searchParams;
  const search = q?.trim().toLowerCase();

  const bookings = await prisma.exhibitorBooking.findMany({
    include: {
      user: { select: { name: true, email: true } },
      profile: {
        select: {
          id: true, token: true, submittedAt: true, logoUrl: true, description: true,
          publications: { select: { platform: true, status: true, postUrl: true } },
        },
      },
    },
    orderBy: [
      { paidInstallments: "desc" },
      { createdAt: "desc" },
    ],
  });

  const filtered = search
    ? bookings.filter((b) =>
        b.companyName.toLowerCase().includes(search) ||
        b.contactName.toLowerCase().includes(search) ||
        b.email.toLowerCase().includes(search) ||
        b.phone.includes(search) ||
        b.sector.toLowerCase().includes(search)
      )
    : bookings;

  const stats = {
    total: bookings.length,
    confirmed: bookings.filter((b) => b.status === "CONFIRMED").length,
    partial: bookings.filter((b) => b.status === "PARTIAL").length,
    revenue: bookings
      .filter((b) => b.status !== "CANCELLED")
      .reduce((sum, b) => {
        if (b.installments === 1) return sum + (b.paidInstallments > 0 ? b.totalPrice : 0);
        const deposit = Math.min(50, b.totalPrice);
        const paidMonths = Math.max(0, b.paidInstallments - 1);
        return sum + (b.paidInstallments > 0 ? deposit : 0) + paidMonths * b.installmentAmount;
      }, 0),
    deposits: bookings
      .filter((b) => b.status !== "CANCELLED" && b.paidInstallments > 0)
      .reduce((sum, b) => sum + Math.min(DEPOSIT_AMOUNT, b.totalPrice), 0),
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
      <div className="mb-8 flex flex-wrap items-center justify-between gap-4">
        <p className="text-dta-char/70">
          Saison Culturelle 2026 &mdash; Suivi des r&eacute;servations et paiements
        </p>
        <div className="flex items-center gap-3">
          <SearchFilter />
          <GeneratePostsButton />
        </div>
      </div>

      {/* Stats */}
      <div className="mb-8 grid grid-cols-2 gap-4 sm:grid-cols-5">
        <div className="rounded-[var(--radius-card)] bg-white p-5 shadow-[var(--shadow-card)]">
          <p className="text-xs font-medium text-dta-taupe">R&eacute;servations</p>
          <p className="mt-1 font-serif text-2xl font-bold text-dta-dark">{stats.total}</p>
        </div>
        <div className="rounded-[var(--radius-card)] bg-white p-5 shadow-[var(--shadow-card)]">
          <p className="text-xs font-medium text-dta-taupe">Confirm&eacute;es</p>
          <p className="mt-1 font-serif text-2xl font-bold text-green-600">{stats.confirmed}</p>
        </div>
        <div className="rounded-[var(--radius-card)] bg-white p-5 shadow-[var(--shadow-card)]">
          <p className="text-xs font-medium text-blue-600">Avances</p>
          <p className="mt-1 font-serif text-2xl font-bold text-blue-600">{formatter.format(stats.deposits)}</p>
        </div>
        <div className="rounded-[var(--radius-card)] bg-white p-5 shadow-[var(--shadow-card)]">
          <p className="text-xs font-medium text-dta-taupe">Encaiss&eacute;</p>
          <p className="mt-1 font-serif text-2xl font-bold text-dta-dark">{formatter.format(stats.revenue)}</p>
        </div>
        <div className="rounded-[var(--radius-card)] bg-white p-5 shadow-[var(--shadow-card)]">
          <p className="text-xs font-medium text-dta-taupe">CA attendu</p>
          <p className="mt-1 font-serif text-2xl font-bold text-dta-accent">{formatter.format(stats.expected)}</p>
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto rounded-[var(--radius-card)] bg-white shadow-[var(--shadow-card)]">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-dta-sand text-left">
              <th className="px-4 py-3 font-medium text-dta-taupe">Entreprise</th>
              <th className="px-4 py-3 font-medium text-dta-taupe">Pack</th>
              <th className="px-4 py-3 font-medium text-dta-taupe">&Eacute;v&eacute;nements</th>
              <th className="px-4 py-3 font-medium text-dta-taupe">Total</th>
              <th className="px-4 py-3 font-medium text-dta-taupe">Paiement</th>
              <th className="px-4 py-3 font-medium text-dta-taupe">Statut</th>
              <th className="px-4 py-3 font-medium text-dta-taupe">Visibilit&eacute;</th>
              <th className="px-4 py-3 font-medium text-dta-taupe">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filtered.length === 0 && (
              <tr>
                <td colSpan={8} className="px-4 py-8 text-center text-dta-taupe">
                  {search ? "Aucun résultat pour cette recherche." : "Aucune réservation pour le moment."}
                </td>
              </tr>
            )}
            {filtered.map((b) => {
              const pack = EXHIBITOR_PACKS.find((p) => p.id === b.pack);
              const eventNames = EXHIBITOR_EVENTS.filter((e) =>
                b.events.includes(e.id)
              )
                .map((e) => e.title.replace(/ 2026$/, ""))
                .join(", ");
              const st = statusLabels[b.status] || statusLabels.PENDING;

              // Payment breakdown
              const deposit = Math.min(DEPOSIT_AMOUNT, b.totalPrice);
              const isFullPayment = b.installments === 1;
              const paidAmount = isFullPayment
                ? (b.paidInstallments > 0 ? b.totalPrice : 0)
                : (b.paidInstallments > 0 ? deposit : 0) + Math.max(0, b.paidInstallments - 1) * b.installmentAmount;
              const remaining = b.totalPrice - paidAmount;
              const progressPct = b.totalPrice > 0 ? Math.round((paidAmount / b.totalPrice) * 100) : 0;

              return (
                <tr key={b.id} className="border-b border-dta-sand/50 hover:bg-dta-bg/50">
                  <td className="px-4 py-3">
                    <p className="font-medium text-dta-dark">{b.companyName}</p>
                    <p className="text-xs text-dta-taupe">{b.contactName}</p>
                    <p className="text-xs text-dta-taupe">{b.email}</p>
                  </td>
                  <td className="px-4 py-3 text-dta-char">
                    {pack?.name.replace("Pack ", "") ?? b.pack}
                  </td>
                  <td className="max-w-[200px] px-4 py-3 text-xs text-dta-char/70">
                    {eventNames || b.events.join(", ")}
                  </td>
                  <td className="px-4 py-3 font-medium text-dta-dark">
                    {formatter.format(b.totalPrice)}
                  </td>

                  {/* ── Paiement avec codes couleurs ── */}
                  <td className="px-4 py-3">
                    <div className="space-y-1.5">
                      {/* Barre de progression */}
                      <div className="h-2 w-full overflow-hidden rounded-full bg-gray-100">
                        <div
                          className={`h-full rounded-full transition-all ${
                            progressPct >= 100
                              ? "bg-green-500"
                              : progressPct > 0
                                ? "bg-amber-400"
                                : "bg-gray-200"
                          }`}
                          style={{ width: `${Math.min(progressPct, 100)}%` }}
                        />
                      </div>

                      {/* Détail par ligne */}
                      {b.status === "CONFIRMED" && b.paidInstallments >= b.installments ? (
                        <span className="inline-flex items-center gap-1 rounded-full bg-green-100 px-2 py-0.5 text-xs font-semibold text-green-700">
                          Soldé — {formatter.format(b.totalPrice)}
                        </span>
                      ) : (
                        <div className="space-y-0.5 text-xs">
                          {/* Avance / Acompte */}
                          {isFullPayment ? (
                            b.paidInstallments > 0 ? (
                              <span className="inline-flex items-center gap-1 rounded-full bg-green-100 px-2 py-0.5 font-medium text-green-700">
                                Payé {formatter.format(b.totalPrice)}
                              </span>
                            ) : (
                              <span className="inline-flex items-center gap-1 rounded-full bg-red-50 px-2 py-0.5 font-medium text-red-600">
                                Non payé
                              </span>
                            )
                          ) : (
                            <>
                              {/* Acompte */}
                              <div className="flex items-center gap-1.5">
                                <span className={`inline-block h-2 w-2 rounded-full ${b.paidInstallments > 0 ? "bg-blue-500" : "bg-gray-300"}`} />
                                <span className={b.paidInstallments > 0 ? "text-blue-700" : "text-gray-400"}>
                                  Acompte {formatter.format(deposit)}
                                  {b.paidInstallments > 0 && " ✓"}
                                </span>
                              </div>

                              {/* Mensualités */}
                              {Array.from({ length: b.installments - 1 }, (_, i) => {
                                const isPaid = b.paidInstallments > i + 1;
                                return (
                                  <div key={i} className="flex items-center gap-1.5">
                                    <span className={`inline-block h-2 w-2 rounded-full ${isPaid ? "bg-amber-500" : "bg-gray-300"}`} />
                                    <span className={isPaid ? "text-amber-700" : "text-gray-400"}>
                                      Éch. {i + 1} — {formatter.format(b.installmentAmount)}
                                      {isPaid && " ✓"}
                                    </span>
                                  </div>
                                );
                              })}

                              {/* Reste à payer */}
                              {remaining > 0 && (
                                <div className="mt-1 flex items-center gap-1.5">
                                  <span className="inline-block h-2 w-2 rounded-full bg-red-400" />
                                  <span className="font-medium text-red-600">
                                    Reste {formatter.format(remaining)}
                                  </span>
                                </div>
                              )}
                            </>
                          )}
                        </div>
                      )}
                    </div>
                  </td>

                  <td className="px-4 py-3">
                    <span className={`rounded-full px-2 py-0.5 text-xs font-medium ${st.cls}`}>
                      {st.label}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    {b.profile ? (
                      <div className="space-y-2">
                        {b.profile.submittedAt ? (
                          <div className="space-y-1.5">
                            <div className="flex items-center gap-1.5">
                              <span className="inline-flex items-center gap-1 rounded-full bg-blue-100 px-2 py-0.5 text-xs font-medium text-blue-700">
                                Fiche soumise
                              </span>
                              <PublishButton profileId={b.profile.id} />
                            </div>
                            <PublicationTracker
                              profileId={b.profile.id}
                              publications={b.profile.publications}
                            />
                          </div>
                        ) : (
                          <span className="inline-flex items-center gap-1 rounded-full bg-amber-100 px-2 py-0.5 text-xs font-medium text-amber-700">
                            Fiche en attente
                          </span>
                        )}
                        <a
                          href={`/exposants/profil/${b.profile.token}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="block text-xs text-dta-accent underline"
                        >
                          Voir fiche
                        </a>
                      </div>
                    ) : (
                      <span className="text-xs text-dta-taupe">&mdash;</span>
                    )}
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex flex-col gap-1.5">
                      {b.profile && !b.profile.submittedAt && (
                        <SendInviteButton
                          email={b.email}
                          contactName={b.contactName}
                          companyName={b.companyName}
                          profileToken={b.profile.token}
                        />
                      )}
                      {b.profile?.submittedAt && (
                        <PublishButton profileId={b.profile.id} />
                      )}
                      <CashPaymentButton
                        bookingId={b.id}
                        paidInstallments={b.paidInstallments}
                        totalInstallments={b.installments}
                        totalPrice={b.totalPrice}
                        installmentAmount={b.installmentAmount}
                        deposit={deposit}
                        status={b.status}
                      />
                      <ResendQuoteButton bookingId={b.id} />
                      <Link
                        href={`/dashboard/exposants/${b.id}/edit`}
                        className="rounded-[var(--radius-button)] border border-dta-sand px-3 py-1.5 text-center text-xs font-medium text-dta-char hover:bg-dta-beige"
                      >
                        Modifier
                      </Link>
                    </div>
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

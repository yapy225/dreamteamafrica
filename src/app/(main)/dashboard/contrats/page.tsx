import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/db";
import {
  CheckCircle,
  Clock,
  AlertCircle,
  XCircle,
  FileText,
  Download,
  Store,
  User,
  Music,
} from "lucide-react";
import InvitationGenerator from "./InvitationGenerator";

export const dynamic = "force-dynamic";
export const metadata = { title: "Contrats | Dashboard" };

const STATUS_CONFIG: Record<string, { label: string; color: string; icon: typeof CheckCircle }> = {
  CONFIRMED: { label: "Confirmé", color: "bg-green-100 text-green-700", icon: CheckCircle },
  PARTIAL: { label: "En cours", color: "bg-amber-100 text-amber-700", icon: Clock },
  PENDING: { label: "En attente", color: "bg-gray-100 text-gray-500", icon: Clock },
  CANCELLED: { label: "Annulé", color: "bg-red-100 text-red-600", icon: XCircle },
  SELECTED: { label: "Sélectionné(e)", color: "bg-green-100 text-green-700", icon: CheckCircle },
  REJECTED: { label: "Refusé(e)", color: "bg-red-100 text-red-600", icon: XCircle },
};

export default async function ContratsPage({
  searchParams,
}: {
  searchParams: Promise<{ tab?: string }>;
}) {
  const session = await auth();
  if (!session) redirect("/auth/signin");
  if (session.user.role !== "ADMIN") redirect("/dashboard");

  const params = await searchParams;
  const tab = params.tab || "exposants";

  const fmt = new Intl.NumberFormat("fr-FR", { style: "currency", currency: "EUR" });

  // Exposants
  const bookings = await prisma.exhibitorBooking.findMany({
    include: { payments: true },
    orderBy: { createdAt: "desc" },
  });
  const activeBookings = bookings.filter((b) => b.status !== "PENDING" || b.totalPrice === 0);

  // Mannequins
  const models = await prisma.modelApplication.findMany({
    orderBy: { createdAt: "desc" },
  });

  // Artistes
  const artists = await prisma.artistApplication.findMany({
    orderBy: { createdAt: "desc" },
  });

  const tabs = [
    { id: "exposants", label: "Exposants", icon: Store, count: activeBookings.length },
    { id: "mannequins", label: "Mannequins", icon: User, count: models.length },
    { id: "artistes", label: "Artistes", icon: Music, count: artists.length },
  ];

  return (
    <div className="mx-auto max-w-6xl px-4 py-12 sm:px-6 lg:px-8">
      <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <h1 className="font-serif text-3xl font-bold text-dta-dark">
            Contrats & Engagements
          </h1>
          <p className="mt-1 text-sm text-dta-char/70">
            Suivi des exposants, mannequins et artistes engag&eacute;s
          </p>
        </div>
        <InvitationGenerator />
      </div>

      {/* Tabs */}
      <div className="mb-6 flex gap-2">
        {tabs.map((t) => (
          <a
            key={t.id}
            href={`/dashboard/contrats?tab=${t.id}`}
            className={`flex items-center gap-2 rounded-full px-5 py-2.5 text-sm font-semibold transition-colors ${
              tab === t.id
                ? "bg-dta-accent text-white"
                : "bg-white border border-dta-sand text-dta-char hover:bg-dta-accent/5"
            }`}
          >
            <t.icon size={16} />
            {t.label} ({t.count})
          </a>
        ))}
      </div>

      {/* ── EXPOSANTS ── */}
      {tab === "exposants" && (
        <div className="rounded-2xl border border-dta-sand bg-white shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-dta-bg text-left text-xs font-medium uppercase tracking-wider text-dta-taupe">
                  <th className="px-4 py-3">Entreprise</th>
                  <th className="px-4 py-3">Contact</th>
                  <th className="px-4 py-3">Pack</th>
                  <th className="px-4 py-3 text-right">Total</th>
                  <th className="px-4 py-3 text-right">Pay&eacute;</th>
                  <th className="px-4 py-3 text-right">Restant</th>
                  <th className="px-4 py-3 text-center">Statut</th>
                  <th className="px-4 py-3 text-center">Facture</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-dta-sand/50">
                {activeBookings.map((b) => {
                  const paid = b.payments.reduce((s, p) => s + p.amount, 0);
                  const remaining = Math.max(0, b.totalPrice - paid);
                  const cfg = STATUS_CONFIG[b.status] || STATUS_CONFIG.PENDING;
                  return (
                    <tr key={b.id} className="hover:bg-dta-bg/50">
                      <td className="px-4 py-3">
                        <p className="font-medium text-dta-dark">{b.companyName}</p>
                        <p className="text-[11px] text-dta-char/50">{b.sector}</p>
                      </td>
                      <td className="px-4 py-3">
                        <p className="text-dta-char/70">{b.email}</p>
                        <p className="text-[11px] text-dta-char/50">{b.phone}</p>
                      </td>
                      <td className="px-4 py-3 text-dta-char/70 whitespace-nowrap">
                        {b.pack === "ENTREPRENEUR_1J"
                          ? "1 jour"
                          : b.pack === "ENTREPRENEUR"
                            ? "2 jours"
                            : b.pack === "RESTAURATION"
                              ? "Restauration"
                              : b.pack}
                      </td>
                      <td className="px-4 py-3 text-right text-dta-dark">{fmt.format(b.totalPrice)}</td>
                      <td className="px-4 py-3 text-right text-green-600">{fmt.format(paid)}</td>
                      <td className="px-4 py-3 text-right font-medium text-amber-600">
                        {remaining > 0 ? fmt.format(remaining) : "—"}
                      </td>
                      <td className="px-4 py-3 text-center">
                        <span className={`inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[10px] font-medium ${cfg.color}`}>
                          <cfg.icon size={10} />
                          {cfg.label}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-center">
                        {b.invoiceNumber ? (
                          <a
                            href={`/api/exposants/${b.id}/invoice`}
                            className="inline-flex items-center gap-1 text-[11px] text-dta-accent hover:underline"
                          >
                            <Download size={10} />
                            {b.invoiceNumber}
                          </a>
                        ) : (
                          <span className="text-[11px] text-dta-char/30">—</span>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
          {activeBookings.length === 0 && (
            <p className="p-8 text-center text-sm text-dta-char/50">Aucun contrat exposant.</p>
          )}
        </div>
      )}

      {/* ── MANNEQUINS ── */}
      {tab === "mannequins" && (
        <div className="rounded-2xl border border-dta-sand bg-white shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-dta-bg text-left text-xs font-medium uppercase tracking-wider text-dta-taupe">
                  <th className="px-4 py-3">Nom</th>
                  <th className="px-4 py-3">Contact</th>
                  <th className="px-4 py-3">Taille</th>
                  <th className="px-4 py-3">Mensurations</th>
                  <th className="px-4 py-3">&Eacute;v&eacute;nement</th>
                  <th className="px-4 py-3">Candidature</th>
                  <th className="px-4 py-3 text-center">Statut</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-dta-sand/50">
                {models.map((m) => {
                  const cfg = STATUS_CONFIG[m.status] || STATUS_CONFIG.PENDING;
                  return (
                    <tr key={m.id} className="hover:bg-dta-bg/50">
                      <td className="px-4 py-3 font-medium text-dta-dark">
                        {m.firstName} {m.lastName}
                      </td>
                      <td className="px-4 py-3">
                        <p className="text-dta-char/70">{m.email}</p>
                        <p className="text-[11px] text-dta-char/50">{m.phone}</p>
                      </td>
                      <td className="px-4 py-3 text-dta-char/70">{m.height || "—"}</td>
                      <td className="px-4 py-3 text-dta-char/70">{m.measurements || "—"}</td>
                      <td className="px-4 py-3 text-[11px] text-dta-char/50">{m.event || "—"}</td>
                      <td className="px-4 py-3 text-[11px] text-dta-char/50">
                        {new Date(m.createdAt).toLocaleDateString("fr-FR")}
                      </td>
                      <td className="px-4 py-3 text-center">
                        <span className={`inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[10px] font-medium ${cfg.color}`}>
                          <cfg.icon size={10} />
                          {cfg.label}
                        </span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
          {models.length === 0 && (
            <p className="p-8 text-center text-sm text-dta-char/50">Aucune candidature mannequin.</p>
          )}
        </div>
      )}

      {/* ── ARTISTES ── */}
      {tab === "artistes" && (
        <div className="rounded-2xl border border-dta-sand bg-white shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-dta-bg text-left text-xs font-medium uppercase tracking-wider text-dta-taupe">
                  <th className="px-4 py-3">Nom</th>
                  <th className="px-4 py-3">Contact</th>
                  <th className="px-4 py-3">Discipline</th>
                  <th className="px-4 py-3">Groupe</th>
                  <th className="px-4 py-3">Pays</th>
                  <th className="px-4 py-3">Candidature</th>
                  <th className="px-4 py-3 text-center">Statut</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-dta-sand/50">
                {artists.map((a) => {
                  const cfg = STATUS_CONFIG[a.status] || STATUS_CONFIG.PENDING;
                  return (
                    <tr key={a.id} className="hover:bg-dta-bg/50">
                      <td className="px-4 py-3 font-medium text-dta-dark">
                        {a.firstName} {a.lastName}
                      </td>
                      <td className="px-4 py-3">
                        <p className="text-dta-char/70">{a.email}</p>
                        <p className="text-[11px] text-dta-char/50">{a.phone}</p>
                      </td>
                      <td className="px-4 py-3 text-dta-accent font-medium">{a.discipline}</td>
                      <td className="px-4 py-3 text-dta-char/70">{a.groupName || "—"}</td>
                      <td className="px-4 py-3 text-dta-char/70">{a.country || "—"}</td>
                      <td className="px-4 py-3 text-[11px] text-dta-char/50">
                        {new Date(a.createdAt).toLocaleDateString("fr-FR")}
                      </td>
                      <td className="px-4 py-3 text-center">
                        <span className={`inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[10px] font-medium ${cfg.color}`}>
                          <cfg.icon size={10} />
                          {cfg.label}
                        </span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
          {artists.length === 0 && (
            <p className="p-8 text-center text-sm text-dta-char/50">Aucune candidature artiste.</p>
          )}
        </div>
      )}
    </div>
  );
}

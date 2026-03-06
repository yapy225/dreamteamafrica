import { prisma } from "@/lib/db";
import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import { CalendarDays, Users, Download } from "lucide-react";
import ExportCSVButton from "./ExportCSVButton";

export const dynamic = "force-dynamic";
export const metadata = { title: "Réservations gratuites" };

export default async function ReservationsAdminPage() {
  const session = await auth();
  if (!session?.user || (session.user as { role?: string }).role !== "ADMIN") {
    redirect("/");
  }

  const reservations = await prisma.eventReservation.findMany({
    include: { event: { select: { title: true, slug: true } } },
    orderBy: { createdAt: "desc" },
  });

  const totalGuests = reservations.reduce((sum, r) => sum + r.guests, 0);
  const byEvent = reservations.reduce<Record<string, number>>((acc, r) => {
    acc[r.event.title] = (acc[r.event.title] || 0) + r.guests;
    return acc;
  }, {});

  return (
    <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-serif text-3xl font-bold text-dta-dark">
            R&eacute;servations gratuites
          </h1>
          <p className="mt-1 text-sm text-dta-char/70">
            {reservations.length} r&eacute;servation{reservations.length > 1 ? "s" : ""} — {totalGuests} place{totalGuests > 1 ? "s" : ""}
          </p>
        </div>
        <ExportCSVButton />
      </div>

      {/* Stats */}
      <div className="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-3">
        <div className="rounded-[var(--radius-card)] bg-white p-6 shadow-[var(--shadow-card)]">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-[var(--radius-button)] bg-dta-accent/10">
              <CalendarDays size={18} className="text-dta-accent" />
            </div>
            <div>
              <p className="text-2xl font-bold text-dta-dark">{reservations.length}</p>
              <p className="text-xs text-dta-taupe">R&eacute;servations</p>
            </div>
          </div>
        </div>
        <div className="rounded-[var(--radius-card)] bg-white p-6 shadow-[var(--shadow-card)]">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-[var(--radius-button)] bg-green-100">
              <Users size={18} className="text-green-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-dta-dark">{totalGuests}</p>
              <p className="text-xs text-dta-taupe">Places r&eacute;serv&eacute;es</p>
            </div>
          </div>
        </div>
        <div className="rounded-[var(--radius-card)] bg-white p-6 shadow-[var(--shadow-card)]">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-[var(--radius-button)] bg-blue-100">
              <CalendarDays size={18} className="text-blue-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-dta-dark">{Object.keys(byEvent).length}</p>
              <p className="text-xs text-dta-taupe">&Eacute;v&eacute;nements</p>
            </div>
          </div>
        </div>
      </div>

      {/* Per-event breakdown */}
      {Object.entries(byEvent).length > 0 && (
        <div className="mt-6 flex flex-wrap gap-3">
          {Object.entries(byEvent).map(([title, count]) => (
            <span
              key={title}
              className="rounded-[var(--radius-full)] bg-dta-accent/10 px-4 py-1.5 text-sm font-medium text-dta-accent"
            >
              {title}: {count} place{count > 1 ? "s" : ""}
            </span>
          ))}
        </div>
      )}

      {/* Table */}
      <div className="mt-8 overflow-x-auto rounded-[var(--radius-card)] bg-white shadow-[var(--shadow-card)]">
        <table className="w-full text-left text-sm">
          <thead className="border-b border-dta-sand bg-dta-bg text-xs uppercase text-dta-taupe">
            <tr>
              <th className="px-4 py-3">&Eacute;v&eacute;nement</th>
              <th className="px-4 py-3">Nom</th>
              <th className="px-4 py-3">Email</th>
              <th className="px-4 py-3">T&eacute;l&eacute;phone</th>
              <th className="px-4 py-3 text-center">Places</th>
              <th className="px-4 py-3">Statut</th>
              <th className="px-4 py-3">Date</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-dta-sand/50">
            {reservations.map((r) => (
              <tr key={r.id} className="hover:bg-dta-bg/50">
                <td className="whitespace-nowrap px-4 py-3 font-medium text-dta-dark">
                  {r.event.title}
                </td>
                <td className="whitespace-nowrap px-4 py-3 text-dta-char">
                  {r.firstName} {r.lastName}
                </td>
                <td className="px-4 py-3 text-dta-char/70">{r.email}</td>
                <td className="whitespace-nowrap px-4 py-3 text-dta-char/70">{r.phone}</td>
                <td className="px-4 py-3 text-center font-medium text-dta-dark">{r.guests}</td>
                <td className="px-4 py-3">
                  <span
                    className={`inline-block rounded-[var(--radius-full)] px-2.5 py-0.5 text-xs font-medium ${
                      r.status === "CONFIRMED"
                        ? "bg-green-100 text-green-700"
                        : "bg-red-100 text-red-700"
                    }`}
                  >
                    {r.status === "CONFIRMED" ? "Confirmé" : "Annulé"}
                  </span>
                </td>
                <td className="whitespace-nowrap px-4 py-3 text-xs text-dta-taupe">
                  {new Date(r.createdAt).toLocaleDateString("fr-FR", {
                    day: "2-digit",
                    month: "short",
                    year: "numeric",
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </td>
              </tr>
            ))}
            {reservations.length === 0 && (
              <tr>
                <td colSpan={7} className="px-4 py-12 text-center text-dta-taupe">
                  Aucune r&eacute;servation pour le moment.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

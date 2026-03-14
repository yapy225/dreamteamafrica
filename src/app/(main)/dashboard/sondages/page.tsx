import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/db";
import SendSurveyButton from "./SendSurveyButton";
import WhatsAppLink from "./WhatsAppLink";

export const dynamic = "force-dynamic";
export const metadata = { title: "Sondages | Dashboard" };

export default async function SondagesDashboardPage() {
  const session = await auth();
  if (!session) redirect("/auth/signin");
  if (session.user.role !== "ADMIN") redirect("/dashboard");

  const responses = await prisma.exhibitorSurvey.findMany({
    orderBy: { createdAt: "desc" },
  });

  const stats = {
    total: responses.length,
    yes: responses.filter((r) => r.answer === "YES").length,
    no: responses.filter((r) => r.answer === "NO").length,
    day1: responses.filter((r) => r.days.includes(1)).length,
    day2: responses.filter((r) => r.days.includes(2)).length,
    withPhone: responses.filter((r) => r.answer === "YES" && r.phone).length,
    contacted: responses.filter((r) => r.sentAt).length,
  };

  return (
    <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
      <h1 className="mb-2 font-serif text-3xl font-bold text-dta-dark">
        Sondage Foire d&apos;Afrique 2026
      </h1>
      <div className="mb-8 flex flex-wrap items-center justify-between gap-4">
        <p className="text-dta-char/70">
          R&eacute;ponses au sondage exposants
        </p>
        <SendSurveyButton />
      </div>

      {/* Stats */}
      <div className="mb-8 grid grid-cols-2 gap-4 sm:grid-cols-4 lg:grid-cols-7">
        <div className="rounded-[var(--radius-card)] bg-white p-4 shadow-[var(--shadow-card)]">
          <p className="text-xs font-medium text-dta-taupe">R&eacute;ponses</p>
          <p className="mt-1 font-serif text-2xl font-bold text-dta-dark">{stats.total}</p>
        </div>
        <div className="rounded-[var(--radius-card)] bg-white p-4 shadow-[var(--shadow-card)]">
          <p className="text-xs font-medium text-green-600">Oui</p>
          <p className="mt-1 font-serif text-2xl font-bold text-green-600">{stats.yes}</p>
        </div>
        <div className="rounded-[var(--radius-card)] bg-white p-4 shadow-[var(--shadow-card)]">
          <p className="text-xs font-medium text-red-500">Non</p>
          <p className="mt-1 font-serif text-2xl font-bold text-red-500">{stats.no}</p>
        </div>
        <div className="rounded-[var(--radius-card)] bg-white p-4 shadow-[var(--shadow-card)]">
          <p className="text-xs font-medium text-dta-taupe">Jour 1</p>
          <p className="mt-1 font-serif text-2xl font-bold text-dta-dark">{stats.day1}</p>
        </div>
        <div className="rounded-[var(--radius-card)] bg-white p-4 shadow-[var(--shadow-card)]">
          <p className="text-xs font-medium text-dta-taupe">Jour 2</p>
          <p className="mt-1 font-serif text-2xl font-bold text-dta-dark">{stats.day2}</p>
        </div>
        <div className="rounded-[var(--radius-card)] bg-white p-4 shadow-[var(--shadow-card)]">
          <p className="text-xs font-medium text-blue-600">WhatsApp</p>
          <p className="mt-1 font-serif text-2xl font-bold text-blue-600">{stats.withPhone}</p>
        </div>
        <div className="rounded-[var(--radius-card)] bg-white p-4 shadow-[var(--shadow-card)]">
          <p className="text-xs font-medium text-dta-accent">Contact&eacute;s</p>
          <p className="mt-1 font-serif text-2xl font-bold text-dta-accent">{stats.contacted}</p>
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto rounded-[var(--radius-card)] bg-white shadow-[var(--shadow-card)]">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-dta-sand text-left">
              <th className="px-4 py-3 font-medium text-dta-taupe">Nom</th>
              <th className="px-4 py-3 font-medium text-dta-taupe">Email</th>
              <th className="px-4 py-3 font-medium text-dta-taupe">T&eacute;l&eacute;phone</th>
              <th className="px-4 py-3 font-medium text-dta-taupe">R&eacute;ponse</th>
              <th className="px-4 py-3 font-medium text-dta-taupe">Jours</th>
              <th className="px-4 py-3 font-medium text-dta-taupe">Date</th>
              <th className="px-4 py-3 font-medium text-dta-taupe">Action</th>
            </tr>
          </thead>
          <tbody>
            {responses.length === 0 && (
              <tr>
                <td colSpan={7} className="px-4 py-8 text-center text-dta-taupe">
                  Aucune r&eacute;ponse pour le moment.
                </td>
              </tr>
            )}
            {responses.map((r) => (
              <tr key={r.id} className="border-b border-dta-sand/50 hover:bg-dta-bg/50">
                <td className="px-4 py-3 font-medium text-dta-dark">{r.name}</td>
                <td className="px-4 py-3 text-xs text-dta-char/70">{r.email}</td>
                <td className="px-4 py-3 text-xs text-dta-char/70">{r.phone || "—"}</td>
                <td className="px-4 py-3">
                  <span
                    className={`rounded-full px-2 py-0.5 text-xs font-medium ${
                      r.answer === "YES"
                        ? "bg-green-100 text-green-700"
                        : "bg-red-100 text-red-600"
                    }`}
                  >
                    {r.answer === "YES" ? "Oui" : "Non"}
                  </span>
                </td>
                <td className="px-4 py-3 text-xs text-dta-char">
                  {r.days.length > 0
                    ? r.days.map((d) => `Jour ${d}`).join(", ")
                    : "—"}
                </td>
                <td className="px-4 py-3 text-xs text-dta-taupe">
                  {new Date(r.createdAt).toLocaleDateString("fr-FR", {
                    day: "numeric",
                    month: "short",
                    year: "numeric",
                  })}
                </td>
                <td className="px-4 py-3">
                  {r.answer === "YES" && r.phone ? (
                    <WhatsAppLink
                      surveyId={r.id}
                      phone={r.phone}
                      name={r.name}
                      days={r.days}
                      sent={!!r.sentAt}
                    />
                  ) : r.answer === "YES" ? (
                    <span className="text-xs text-dta-taupe">Pas de tél.</span>
                  ) : null}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

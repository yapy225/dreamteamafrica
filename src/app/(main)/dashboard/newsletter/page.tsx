import { redirect } from "next/navigation";
import { Mail, Users, Download } from "lucide-react";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/db";
import DeleteSubscriberButton from "./DeleteSubscriberButton";

export const dynamic = "force-dynamic";
export const metadata = { title: "Newsletter - Dashboard" };

export default async function NewsletterPage() {
  const session = await auth();
  if (!session) redirect("/auth/signin");
  if (session.user.role !== "ADMIN") redirect("/dashboard");

  const subscribers = await prisma.newsletterSubscriber.findMany({
    orderBy: { subscribedAt: "desc" },
  });

  const activeCount = subscribers.filter((s) => s.isActive).length;

  // CSV export data
  const csvData = subscribers
    .map((s) => `${s.email},${s.isActive ? "actif" : "inactif"},${s.subscribedAt.toISOString()}`)
    .join("\n");
  const csvContent = `email,statut,date_inscription\n${csvData}`;
  const csvDataUri = `data:text/csv;charset=utf-8,${encodeURIComponent(csvContent)}`;

  return (
    <div className="mx-auto max-w-5xl px-4 py-12 sm:px-6 lg:px-8">
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="font-serif text-3xl font-bold text-dta-dark">
            Newsletter
          </h1>
          <p className="mt-1 text-sm text-dta-char/70">
            {subscribers.length} abonne{subscribers.length !== 1 ? "s" : ""}{" "}
            dont {activeCount} actif{activeCount !== 1 ? "s" : ""}
          </p>
        </div>
        {subscribers.length > 0 && (
          <a
            href={csvDataUri}
            download="newsletter-subscribers.csv"
            className="flex items-center gap-2 rounded-[var(--radius-button)] border border-dta-sand px-4 py-2.5 text-sm font-medium text-dta-char hover:bg-dta-beige"
          >
            <Download size={16} />
            Exporter CSV
          </a>
        )}
      </div>

      {/* Stats cards */}
      <div className="mb-8 grid grid-cols-1 gap-4 sm:grid-cols-3">
        <div className="rounded-[var(--radius-card)] bg-white p-5 shadow-[var(--shadow-card)]">
          <div className="flex items-center gap-3">
            <div className="rounded-[var(--radius-button)] bg-blue-100 p-2.5 text-blue-600">
              <Users size={18} />
            </div>
            <div>
              <p className="text-xs text-dta-taupe">Total</p>
              <p className="font-serif text-2xl font-bold text-dta-dark">
                {subscribers.length}
              </p>
            </div>
          </div>
        </div>
        <div className="rounded-[var(--radius-card)] bg-white p-5 shadow-[var(--shadow-card)]">
          <div className="flex items-center gap-3">
            <div className="rounded-[var(--radius-button)] bg-green-100 p-2.5 text-green-600">
              <Mail size={18} />
            </div>
            <div>
              <p className="text-xs text-dta-taupe">Actifs</p>
              <p className="font-serif text-2xl font-bold text-green-600">
                {activeCount}
              </p>
            </div>
          </div>
        </div>
        <div className="rounded-[var(--radius-card)] bg-white p-5 shadow-[var(--shadow-card)]">
          <div className="flex items-center gap-3">
            <div className="rounded-[var(--radius-button)] bg-amber-100 p-2.5 text-amber-600">
              <Mail size={18} />
            </div>
            <div>
              <p className="text-xs text-dta-taupe">Inactifs</p>
              <p className="font-serif text-2xl font-bold text-amber-600">
                {subscribers.length - activeCount}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Subscriber list */}
      {subscribers.length === 0 ? (
        <div className="rounded-[var(--radius-card)] bg-white p-12 text-center shadow-[var(--shadow-card)]">
          <Mail size={48} className="mx-auto text-dta-taupe" />
          <h2 className="mt-4 font-serif text-xl font-bold text-dta-dark">
            Aucun abonne
          </h2>
          <p className="mt-2 text-sm text-dta-char/70">
            Les abonnes a la newsletter apparaitront ici.
          </p>
        </div>
      ) : (
        <div className="overflow-hidden rounded-[var(--radius-card)] bg-white shadow-[var(--shadow-card)]">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-dta-sand/50 bg-dta-beige/50">
                <th className="px-4 py-3 text-left font-medium text-dta-char">
                  Email
                </th>
                <th className="px-4 py-3 text-left font-medium text-dta-char">
                  Statut
                </th>
                <th className="px-4 py-3 text-left font-medium text-dta-char">
                  Inscription
                </th>
                <th className="px-4 py-3 text-right font-medium text-dta-char">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody>
              {subscribers.map((sub) => (
                <tr
                  key={sub.id}
                  className="border-b border-dta-sand/30 last:border-0"
                >
                  <td className="px-4 py-3 text-dta-dark">{sub.email}</td>
                  <td className="px-4 py-3">
                    <span
                      className={`rounded-[var(--radius-full)] px-2.5 py-0.5 text-xs font-medium ${
                        sub.isActive
                          ? "bg-green-100 text-green-700"
                          : "bg-gray-100 text-gray-600"
                      }`}
                    >
                      {sub.isActive ? "Actif" : "Inactif"}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-dta-taupe">
                    {sub.subscribedAt.toLocaleDateString("fr-FR", {
                      day: "numeric",
                      month: "short",
                      year: "numeric",
                    })}
                  </td>
                  <td className="px-4 py-3 text-right">
                    <DeleteSubscriberButton
                      subscriberId={sub.id}
                      subscriberEmail={sub.email}
                    />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

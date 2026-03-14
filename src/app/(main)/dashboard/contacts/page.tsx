import { prisma } from "@/lib/db";
import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import { Mail } from "lucide-react";

export const dynamic = "force-dynamic";
export const metadata = { title: "Messages de contact" };

const categoryLabels: Record<string, string> = {
  EXPOSANT: "Exposant",
  MANNEQUIN: "Mannequin",
  PRESTATAIRE: "Prestataire",
  PARTENAIRE: "Partenaire",
  INSTITUTION: "Institution",
  MEDIA: "Média",
  ARTISTE: "Artiste",
};

const categoryColors: Record<string, string> = {
  EXPOSANT: "bg-emerald-100 text-emerald-700",
  MANNEQUIN: "bg-pink-100 text-pink-700",
  PRESTATAIRE: "bg-blue-100 text-blue-700",
  PARTENAIRE: "bg-purple-100 text-purple-700",
  INSTITUTION: "bg-amber-100 text-amber-700",
  MEDIA: "bg-red-100 text-red-700",
  ARTISTE: "bg-indigo-100 text-indigo-700",
};

export default async function ContactsAdminPage() {
  const session = await auth();
  if (!session?.user?.id) {
    redirect("/auth/signin");
  }

  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
    select: { role: true },
  });

  if (user?.role !== "ADMIN") {
    redirect("/dashboard");
  }

  const messages = await prisma.contactMessage.findMany({
    orderBy: { createdAt: "desc" },
  });

  const unread = messages.filter((m) => !m.read).length;
  const byCategory = messages.reduce<Record<string, number>>((acc, m) => {
    acc[m.category] = (acc[m.category] || 0) + 1;
    return acc;
  }, {});

  return (
    <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
      <div>
        <h1 className="font-serif text-3xl font-bold text-dta-dark">
          Messages de contact
        </h1>
        <p className="mt-1 text-sm text-dta-char/70">
          {messages.length} message{messages.length > 1 ? "s" : ""}
          {unread > 0 && (
            <span className="ml-2 rounded-[var(--radius-full)] bg-red-100 px-2.5 py-0.5 text-xs font-medium text-red-600">
              {unread} non lu{unread > 1 ? "s" : ""}
            </span>
          )}
        </p>
        <p className="mt-2 flex items-center gap-2 rounded-lg bg-dta-accent/10 px-4 py-2.5 text-sm text-dta-accent">
          <Mail size={16} />
          Les nouveaux messages sont envoyés automatiquement à votre boîte mail.
        </p>
      </div>

      {/* Stats par catégorie */}
      <div className="mt-6 flex flex-wrap gap-3">
        {Object.entries(byCategory).map(([cat, count]) => (
          <span
            key={cat}
            className={`rounded-[var(--radius-full)] px-4 py-1.5 text-sm font-medium ${categoryColors[cat] || "bg-gray-100 text-gray-700"}`}
          >
            {categoryLabels[cat] || cat}: {count}
          </span>
        ))}
      </div>

      {/* Table */}
      <div className="mt-8 overflow-x-auto rounded-[var(--radius-card)] bg-white shadow-[var(--shadow-card)]">
        <table className="w-full text-left text-sm">
          <thead className="border-b border-dta-sand bg-dta-bg text-xs uppercase text-dta-taupe">
            <tr>
              <th className="px-4 py-3">Profil</th>
              <th className="px-4 py-3">Nom</th>
              <th className="px-4 py-3">Email</th>
              <th className="px-4 py-3">Tél.</th>
              <th className="px-4 py-3">Structure</th>
              <th className="px-4 py-3">Message</th>
              <th className="px-4 py-3">Date</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-dta-sand/50">
            {messages.map((m) => (
              <tr
                key={m.id}
                className={m.read ? "hover:bg-dta-bg/50" : "bg-dta-accent/5 hover:bg-dta-accent/10"}
              >
                <td className="whitespace-nowrap px-4 py-3">
                  <span
                    className={`inline-block rounded-[var(--radius-full)] px-2.5 py-0.5 text-xs font-medium ${categoryColors[m.category] || "bg-gray-100 text-gray-700"}`}
                  >
                    {categoryLabels[m.category] || m.category}
                  </span>
                </td>
                <td className="whitespace-nowrap px-4 py-3 font-medium text-dta-dark">
                  {!m.read && (
                    <span className="mr-1.5 inline-block h-2 w-2 rounded-full bg-dta-accent" />
                  )}
                  {m.firstName} {m.lastName}
                </td>
                <td className="px-4 py-3 text-dta-char/70">
                  <a href={`mailto:${m.email}`} className="hover:text-dta-accent hover:underline">
                    {m.email}
                  </a>
                </td>
                <td className="whitespace-nowrap px-4 py-3 text-dta-char/70">
                  {m.phone ? (
                    <a href={`tel:${m.phone}`} className="hover:text-dta-accent hover:underline">
                      {m.phone}
                    </a>
                  ) : "—"}
                </td>
                <td className="px-4 py-3 text-dta-char/70">
                  {m.company || "—"}
                </td>
                <td className="max-w-xs truncate px-4 py-3 text-dta-char/70">
                  {m.message || "—"}
                </td>
                <td className="whitespace-nowrap px-4 py-3 text-xs text-dta-taupe">
                  {new Date(m.createdAt).toLocaleDateString("fr-FR", {
                    day: "2-digit",
                    month: "short",
                    year: "numeric",
                  })}
                </td>
              </tr>
            ))}
            {messages.length === 0 && (
              <tr>
                <td colSpan={7} className="px-4 py-12 text-center text-dta-taupe">
                  Aucun message pour le moment.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

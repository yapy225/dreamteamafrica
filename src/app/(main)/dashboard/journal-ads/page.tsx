import { redirect } from "next/navigation";
import Link from "next/link";
import { Plus, Pencil, Megaphone, BarChart3 } from "lucide-react";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/db";
import DeleteJournalAdButton from "./DeleteJournalAdButton";

export const dynamic = "force-dynamic";
export const metadata = { title: "Publicités Journal" };

const placementLabels: Record<string, string> = {
  BANNER: "Bannière",
  INLINE: "En ligne",
  VIDEO: "Vidéo",
  SIDEBAR: "Barre latérale",
};

const placementColors: Record<string, string> = {
  BANNER: "bg-blue-100 text-blue-700",
  INLINE: "bg-purple-100 text-purple-700",
  VIDEO: "bg-amber-100 text-amber-700",
  SIDEBAR: "bg-green-100 text-green-700",
};

export default async function JournalAdsPage() {
  const session = await auth();
  if (!session) redirect("/auth/signin");
  if (session.user.role !== "ADMIN") redirect("/dashboard");

  const ads = await prisma.journalAd.findMany({
    orderBy: { createdAt: "desc" },
  });

  return (
    <div className="mx-auto max-w-5xl px-4 py-12 sm:px-6 lg:px-8">
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="font-serif text-3xl font-bold text-dta-dark">
            Publicités Journal
          </h1>
          <p className="mt-1 text-sm text-dta-char/70">
            {ads.length} publicité{ads.length !== 1 ? "s" : ""}
          </p>
        </div>
        <Link
          href="/dashboard/journal-ads/new"
          className="flex items-center gap-2 rounded-[var(--radius-button)] bg-dta-accent px-5 py-2.5 text-sm font-semibold text-white hover:bg-dta-accent-dark"
        >
          <Plus size={16} />
          Nouvelle publicité
        </Link>
      </div>

      {ads.length === 0 ? (
        <div className="rounded-[var(--radius-card)] bg-white p-12 text-center shadow-[var(--shadow-card)]">
          <Megaphone size={48} className="mx-auto text-dta-taupe" />
          <h2 className="mt-4 font-serif text-xl font-bold text-dta-dark">
            Aucune publicité
          </h2>
          <p className="mt-2 text-sm text-dta-char/70">
            Créez votre première publicité pour le journal.
          </p>
          <Link
            href="/dashboard/journal-ads/new"
            className="mt-6 inline-flex items-center gap-2 rounded-[var(--radius-button)] bg-dta-accent px-6 py-3 text-sm font-semibold text-white hover:bg-dta-accent-dark"
          >
            <Plus size={16} />
            Créer une publicité
          </Link>
        </div>
      ) : (
        <div className="space-y-3">
          {ads.map((ad) => {
            const ctr =
              ad.impressions > 0
                ? ((ad.clicks / ad.impressions) * 100).toFixed(1)
                : "0.0";

            return (
              <div
                key={ad.id}
                className="rounded-[var(--radius-card)] bg-white p-4 shadow-[var(--shadow-card)]"
              >
                <div className="flex items-center gap-4">
                  <div className="min-w-0 flex-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <h3 className="truncate font-serif text-base font-semibold text-dta-dark">
                        {ad.title}
                      </h3>
                      <span
                        className={`rounded-[var(--radius-full)] px-2 py-0.5 text-xs font-medium ${
                          placementColors[ad.placement] || ""
                        }`}
                      >
                        {placementLabels[ad.placement] || ad.placement}
                      </span>
                      <span
                        className={`rounded-[var(--radius-full)] px-2 py-0.5 text-xs font-medium ${
                          ad.active
                            ? "bg-green-100 text-green-700"
                            : "bg-gray-100 text-gray-500"
                        }`}
                      >
                        {ad.active ? "Active" : "Inactive"}
                      </span>
                    </div>

                    <div className="mt-2 flex flex-wrap items-center gap-4 text-xs text-dta-taupe">
                      <span className="flex items-center gap-1">
                        <Megaphone size={12} />
                        {ad.impressions.toLocaleString("fr-FR")} impressions
                      </span>
                      <span className="flex items-center gap-1">
                        <BarChart3 size={12} />
                        {ad.clicks.toLocaleString("fr-FR")} clics
                      </span>
                      <span className="flex items-center gap-1">
                        <BarChart3 size={12} />
                        CTR {ctr}%
                      </span>
                      <span>&middot;</span>
                      <span>{ad.campaignWeeks} semaine{ad.campaignWeeks !== 1 ? "s" : ""}</span>
                    </div>
                  </div>

                  <div className="flex flex-shrink-0 items-center gap-1">
                    <Link
                      href={`/dashboard/journal-ads/${ad.id}/edit`}
                      className="rounded-[var(--radius-button)] p-2 text-dta-taupe hover:bg-dta-beige hover:text-dta-dark"
                      title="Modifier"
                    >
                      <Pencil size={16} />
                    </Link>
                    <DeleteJournalAdButton adId={ad.id} adTitle={ad.title} />
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

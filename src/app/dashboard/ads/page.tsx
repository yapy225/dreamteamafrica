import { redirect } from "next/navigation";
import Link from "next/link";
import { Plus, Pencil, Eye, BarChart3, MousePointerClick, Megaphone } from "lucide-react";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { formatDate } from "@/lib/utils";
import DeleteCampaignButton from "./DeleteCampaignButton";

export const dynamic = "force-dynamic";
export const metadata = { title: "Mes campagnes — DTA Ads" };

const formatLabels: Record<string, string> = {
  SPONSORED_ARTICLE: "Article sponsorisé",
  BANNER: "Bannière",
  VIDEO: "Vidéo",
};

const planColors: Record<string, string> = {
  STARTER: "bg-blue-100 text-blue-700",
  PRO: "bg-purple-100 text-purple-700",
  PREMIUM: "bg-amber-100 text-amber-700",
};

export default async function DashboardAdsPage() {
  const session = await auth();
  if (!session) redirect("/auth/signin");

  const campaigns = await prisma.adCampaign.findMany({
    where: session.user.role === "ADMIN" ? {} : { userId: session.user.id },
    orderBy: { createdAt: "desc" },
  });

  return (
    <div className="mx-auto max-w-5xl px-4 py-12 sm:px-6 lg:px-8">
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="font-serif text-3xl font-bold text-dta-dark">
            {session.user.role === "ADMIN" ? "Toutes les campagnes" : "Mes campagnes"}
          </h1>
          <p className="mt-1 text-sm text-dta-char/70">
            {campaigns.length} campagne{campaigns.length !== 1 ? "s" : ""}
          </p>
        </div>
        <Link
          href="/dashboard/ads/new"
          className="flex items-center gap-2 rounded-[var(--radius-button)] bg-dta-accent px-5 py-2.5 text-sm font-semibold text-white hover:bg-dta-accent-dark"
        >
          <Plus size={16} />
          Nouvelle campagne
        </Link>
      </div>

      {campaigns.length === 0 ? (
        <div className="rounded-[var(--radius-card)] bg-white p-12 text-center shadow-[var(--shadow-card)]">
          <Megaphone size={48} className="mx-auto text-dta-taupe" />
          <h2 className="mt-4 font-serif text-xl font-bold text-dta-dark">Aucune campagne</h2>
          <p className="mt-2 text-sm text-dta-char/70">
            Créez votre première campagne publicitaire sur DTA Ads.
          </p>
          <Link
            href="/dashboard/ads/new"
            className="mt-6 inline-flex items-center gap-2 rounded-[var(--radius-button)] bg-dta-accent px-6 py-3 text-sm font-semibold text-white hover:bg-dta-accent-dark"
          >
            <Plus size={16} />
            Créer une campagne
          </Link>
        </div>
      ) : (
        <div className="space-y-3">
          {campaigns.map((campaign) => {
            const ctr = campaign.impressions > 0
              ? ((campaign.clicks / campaign.impressions) * 100).toFixed(1)
              : "0.0";

            return (
              <div
                key={campaign.id}
                className="rounded-[var(--radius-card)] bg-white p-4 shadow-[var(--shadow-card)]"
              >
                <div className="flex items-center gap-4">
                  <div className="flex-1 min-w-0">
                    <div className="flex flex-wrap items-center gap-2">
                      <h3 className="truncate font-serif text-base font-semibold text-dta-dark">
                        {campaign.title}
                      </h3>
                      <span className={`rounded-[var(--radius-full)] px-2 py-0.5 text-xs font-medium ${planColors[campaign.plan] || ""}`}>
                        {campaign.plan}
                      </span>
                      <span className="rounded-[var(--radius-full)] bg-dta-beige px-2 py-0.5 text-xs font-medium text-dta-char">
                        {formatLabels[campaign.format] || campaign.format}
                      </span>
                      <span className={`rounded-[var(--radius-full)] px-2 py-0.5 text-xs font-medium ${
                        campaign.active
                          ? "bg-green-100 text-green-700"
                          : "bg-gray-100 text-gray-500"
                      }`}>
                        {campaign.active ? "Active" : "Inactive"}
                      </span>
                    </div>

                    <div className="mt-2 flex flex-wrap items-center gap-4 text-xs text-dta-taupe">
                      <span className="flex items-center gap-1">
                        <Eye size={12} />
                        {campaign.impressions.toLocaleString("fr-FR")} impressions
                      </span>
                      <span className="flex items-center gap-1">
                        <MousePointerClick size={12} />
                        {campaign.clicks.toLocaleString("fr-FR")} clics
                      </span>
                      <span className="flex items-center gap-1">
                        <BarChart3 size={12} />
                        CTR {ctr}%
                      </span>
                      <span>&middot;</span>
                      <span>{formatDate(campaign.createdAt)}</span>
                    </div>
                  </div>

                  <div className="flex flex-shrink-0 items-center gap-1">
                    <Link
                      href={`/dashboard/ads/${campaign.id}/edit`}
                      className="rounded-[var(--radius-button)] p-2 text-dta-taupe hover:bg-dta-beige hover:text-dta-dark"
                      title="Modifier"
                    >
                      <Pencil size={16} />
                    </Link>
                    <DeleteCampaignButton campaignId={campaign.id} campaignTitle={campaign.title} />
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

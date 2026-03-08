import { redirect } from "next/navigation";
import Link from "next/link";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { formatDateTime } from "@/lib/utils";
import { MessageSquare, ExternalLink, FileText } from "lucide-react";
import { DraftActions, QuickActions, BulkApproveButton } from "./SocialDraftActions";

export const dynamic = "force-dynamic";
export const metadata = { title: "Social Drafts - Dashboard" };

const PAGE_SIZE = 20;

/* ───────── Config maps ───────── */

const statusConfig: Record<string, { label: string; color: string }> = {
  DRAFT: { label: "Brouillon", color: "bg-amber-100 text-amber-700" },
  APPROVED: { label: "Approuve", color: "bg-green-100 text-green-700" },
  POSTED: { label: "Publie", color: "bg-blue-100 text-blue-700" },
  REJECTED: { label: "Rejete", color: "bg-red-100 text-red-700" },
  FAILED: { label: "Echoue", color: "bg-red-200 text-red-800" },
};

const platformConfig: Record<
  string,
  { label: string; color: string; bg: string }
> = {
  TWITTER: { label: "Twitter", color: "text-[#1DA1F2]", bg: "bg-[#1DA1F2]/10" },
  FACEBOOK: { label: "Facebook", color: "text-[#1877F2]", bg: "bg-[#1877F2]/10" },
  INSTAGRAM: { label: "Instagram", color: "text-[#E4405F]", bg: "bg-[#E4405F]/10" },
  LINKEDIN: { label: "LinkedIn", color: "text-[#0A66C2]", bg: "bg-[#0A66C2]/10" },
  TIKTOK: { label: "TikTok", color: "text-gray-800", bg: "bg-gray-100" },
};

const typeConfig: Record<string, { label: string }> = {
  COMMENT: { label: "Commentaire" },
  REPLY: { label: "Reponse" },
  PROMO: { label: "Promo" },
  ENGAGEMENT: { label: "Engagement" },
};

const sectionConfig: Record<string, { label: string }> = {
  lafropeen: { label: "L'Afropeen" },
  officiel: { label: "L'Officiel" },
  "saison-culturelle": { label: "Saison Culturelle" },
  marketplace: { label: "Marketplace" },
};

/* ───────── Page ───────── */

export default async function SocialDraftsPage({
  searchParams,
}: {
  searchParams: Promise<{
    status?: string;
    platform?: string;
    section?: string;
    type?: string;
    page?: string;
  }>;
}) {
  const session = await auth();
  if (!session || session.user.role !== "ADMIN") redirect("/dashboard");

  const resolvedParams = await searchParams;
  const statusFilter = resolvedParams.status;
  const platformFilter = resolvedParams.platform;
  const sectionFilter = resolvedParams.section;
  const typeFilter = resolvedParams.type;
  const page = Math.max(1, parseInt(resolvedParams.page || "1", 10));

  const where: Record<string, unknown> = {};
  if (statusFilter) where.status = statusFilter;
  if (platformFilter) where.platform = platformFilter;
  if (sectionFilter) where.section = sectionFilter;
  if (typeFilter) where.type = typeFilter;

  const [drafts, total, counts] = await Promise.all([
    prisma.socialDraft.findMany({
      where,
      orderBy: { createdAt: "desc" },
      skip: (page - 1) * PAGE_SIZE,
      take: PAGE_SIZE,
      include: { article: { select: { id: true, title: true, slug: true } } },
    }),
    prisma.socialDraft.count({ where }),
    prisma.socialDraft.groupBy({
      by: ["status"],
      _count: true,
    }),
  ]);

  const countMap: Record<string, number> = {};
  for (const c of counts) countMap[c.status] = c._count;
  const totalAll = counts.reduce((sum, c) => sum + c._count, 0);
  const totalPages = Math.ceil(total / PAGE_SIZE);

  // Collect DRAFT ids for bulk approve
  const draftIds = drafts
    .filter((d) => d.status === "DRAFT")
    .map((d) => d.id);

  function buildFilterUrl(
    key: string,
    value: string | null
  ): string {
    const params = new URLSearchParams();
    const current: Record<string, string | undefined> = {
      status: statusFilter,
      platform: platformFilter,
      section: sectionFilter,
      type: typeFilter,
    };
    current[key] = value || undefined;
    for (const [k, v] of Object.entries(current)) {
      if (v) params.set(k, v);
    }
    const qs = params.toString();
    return `/dashboard/social-drafts${qs ? `?${qs}` : ""}`;
  }

  return (
    <div className="mx-auto max-w-6xl px-4 py-12 sm:px-6 lg:px-8">
      {/* Header */}
      <div className="mb-8 flex flex-wrap items-start justify-between gap-4">
        <div>
          <h1 className="font-serif text-3xl font-bold text-dta-dark">
            Social Drafts
          </h1>
          <p className="mt-1 text-sm text-dta-char/70">
            Gestion des brouillons sociaux — {totalAll} au total
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          <QuickActions />
          <BulkApproveButton draftIds={draftIds} />
        </div>
      </div>

      {/* Stats bar */}
      <div className="mb-6 grid grid-cols-2 gap-3 sm:grid-cols-5">
        {Object.entries(statusConfig).map(([key, { label, color }]) => (
          <div
            key={key}
            className="rounded-[var(--radius-card)] bg-white p-4 shadow-[var(--shadow-card)]"
          >
            <p className="text-xs font-medium text-dta-taupe">{label}</p>
            <p className="mt-1 text-2xl font-bold text-dta-dark">
              {countMap[key] || 0}
            </p>
            <span
              className={`mt-1 inline-block rounded-[var(--radius-full)] px-2 py-0.5 text-xs font-medium ${color}`}
            >
              {label}
            </span>
          </div>
        ))}
      </div>

      {/* Filter tabs: Status */}
      <div className="mb-4 flex flex-wrap gap-2">
        <Link
          href={buildFilterUrl("status", null)}
          className={`rounded-[var(--radius-full)] px-3 py-1.5 text-xs font-medium transition ${
            !statusFilter
              ? "bg-dta-dark text-white"
              : "bg-dta-beige text-dta-char hover:bg-dta-taupe/20"
          }`}
        >
          Tous ({totalAll})
        </Link>
        {Object.entries(statusConfig).map(([key, { label }]) => (
          <Link
            key={key}
            href={buildFilterUrl("status", key)}
            className={`rounded-[var(--radius-full)] px-3 py-1.5 text-xs font-medium transition ${
              statusFilter === key
                ? "bg-dta-dark text-white"
                : "bg-dta-beige text-dta-char hover:bg-dta-taupe/20"
            }`}
          >
            {label} ({countMap[key] || 0})
          </Link>
        ))}
      </div>

      {/* Filter tabs: Platform */}
      <div className="mb-4 flex flex-wrap gap-2">
        <span className="self-center text-xs font-medium text-dta-taupe">
          Plateforme:
        </span>
        <Link
          href={buildFilterUrl("platform", null)}
          className={`rounded-[var(--radius-full)] px-3 py-1.5 text-xs font-medium transition ${
            !platformFilter
              ? "bg-dta-dark text-white"
              : "bg-dta-beige text-dta-char hover:bg-dta-taupe/20"
          }`}
        >
          Toutes
        </Link>
        {Object.entries(platformConfig).map(([key, { label }]) => (
          <Link
            key={key}
            href={buildFilterUrl("platform", key)}
            className={`rounded-[var(--radius-full)] px-3 py-1.5 text-xs font-medium transition ${
              platformFilter === key
                ? "bg-dta-dark text-white"
                : "bg-dta-beige text-dta-char hover:bg-dta-taupe/20"
            }`}
          >
            {label}
          </Link>
        ))}
      </div>

      {/* Filter tabs: Section */}
      <div className="mb-4 flex flex-wrap gap-2">
        <span className="self-center text-xs font-medium text-dta-taupe">
          Section:
        </span>
        <Link
          href={buildFilterUrl("section", null)}
          className={`rounded-[var(--radius-full)] px-3 py-1.5 text-xs font-medium transition ${
            !sectionFilter
              ? "bg-dta-dark text-white"
              : "bg-dta-beige text-dta-char hover:bg-dta-taupe/20"
          }`}
        >
          Toutes
        </Link>
        {Object.entries(sectionConfig).map(([key, { label }]) => (
          <Link
            key={key}
            href={buildFilterUrl("section", key)}
            className={`rounded-[var(--radius-full)] px-3 py-1.5 text-xs font-medium transition ${
              sectionFilter === key
                ? "bg-dta-dark text-white"
                : "bg-dta-beige text-dta-char hover:bg-dta-taupe/20"
            }`}
          >
            {label}
          </Link>
        ))}
      </div>

      {/* Filter tabs: Type */}
      <div className="mb-6 flex flex-wrap gap-2">
        <span className="self-center text-xs font-medium text-dta-taupe">
          Type:
        </span>
        <Link
          href={buildFilterUrl("type", null)}
          className={`rounded-[var(--radius-full)] px-3 py-1.5 text-xs font-medium transition ${
            !typeFilter
              ? "bg-dta-dark text-white"
              : "bg-dta-beige text-dta-char hover:bg-dta-taupe/20"
          }`}
        >
          Tous
        </Link>
        {Object.entries(typeConfig).map(([key, { label }]) => (
          <Link
            key={key}
            href={buildFilterUrl("type", key)}
            className={`rounded-[var(--radius-full)] px-3 py-1.5 text-xs font-medium transition ${
              typeFilter === key
                ? "bg-dta-dark text-white"
                : "bg-dta-beige text-dta-char hover:bg-dta-taupe/20"
            }`}
          >
            {label}
          </Link>
        ))}
      </div>

      {/* Draft cards */}
      {drafts.length === 0 ? (
        <div className="rounded-[var(--radius-card)] bg-white p-12 text-center shadow-[var(--shadow-card)]">
          <MessageSquare size={48} className="mx-auto text-dta-taupe" />
          <h2 className="mt-4 font-serif text-xl font-bold text-dta-dark">
            Aucun brouillon
          </h2>
          <p className="mt-2 text-sm text-dta-char/70">
            Les brouillons apparaitront ici une fois generes.
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          {drafts.map((draft) => {
            const sc = statusConfig[draft.status] || statusConfig.DRAFT;
            const pc = platformConfig[draft.platform] || platformConfig.TWITTER;
            const tc = typeConfig[draft.type] || { label: draft.type };
            const sec = draft.section
              ? sectionConfig[draft.section] || { label: draft.section }
              : null;

            return (
              <div
                key={draft.id}
                className="rounded-[var(--radius-card)] bg-white p-4 shadow-[var(--shadow-card)]"
              >
                <div className="flex items-start gap-4">
                  <div className="min-w-0 flex-1">
                    {/* Badges row */}
                    <div className="flex flex-wrap items-center gap-2">
                      <span
                        className={`rounded-[var(--radius-full)] px-2 py-0.5 text-xs font-semibold ${pc.bg} ${pc.color}`}
                      >
                        {pc.label}
                      </span>
                      <span className="rounded-[var(--radius-full)] bg-gray-100 px-2 py-0.5 text-xs font-medium text-gray-700">
                        {tc.label}
                      </span>
                      {sec && (
                        <span className="rounded-[var(--radius-full)] bg-dta-beige px-2 py-0.5 text-xs font-medium text-dta-char">
                          {sec.label}
                        </span>
                      )}
                      <span
                        className={`rounded-[var(--radius-full)] px-2 py-0.5 text-xs font-medium ${sc.color}`}
                      >
                        {sc.label}
                      </span>
                    </div>

                    {/* Content */}
                    <p className="mt-2 whitespace-pre-wrap text-sm text-dta-dark">
                      {draft.editedContent || draft.content}
                    </p>

                    {/* Meta row */}
                    <div className="mt-2 flex flex-wrap items-center gap-3 text-xs text-dta-taupe">
                      <span>{formatDateTime(draft.createdAt)}</span>

                      {draft.targetPostUrl && (
                        <>
                          <span>&middot;</span>
                          <a
                            href={draft.targetPostUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-1 text-blue-600 hover:underline"
                          >
                            <ExternalLink size={12} />
                            Post cible
                          </a>
                        </>
                      )}

                      {draft.article && (
                        <>
                          <span>&middot;</span>
                          <span className="inline-flex items-center gap-1">
                            <FileText size={12} />
                            {draft.article.title}
                          </span>
                        </>
                      )}

                      {draft.reviewedBy && (
                        <>
                          <span>&middot;</span>
                          <span>
                            Revu par {draft.reviewedBy}
                          </span>
                        </>
                      )}

                      {draft.errorMessage && (
                        <>
                          <span>&middot;</span>
                          <span className="text-red-600">
                            Erreur: {draft.errorMessage}
                          </span>
                        </>
                      )}
                    </div>
                  </div>

                  <DraftActions
                    draftId={draft.id}
                    status={draft.status}
                    content={draft.content}
                    editedContent={draft.editedContent}
                    postUrl={draft.postUrl}
                  />
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="mt-8 flex items-center justify-center gap-2">
          {page > 1 && (
            <Link
              href={`/dashboard/social-drafts?${new URLSearchParams({
                ...(statusFilter ? { status: statusFilter } : {}),
                ...(platformFilter ? { platform: platformFilter } : {}),
                ...(sectionFilter ? { section: sectionFilter } : {}),
                ...(typeFilter ? { type: typeFilter } : {}),
                page: String(page - 1),
              }).toString()}`}
              className="rounded-[var(--radius-button)] bg-dta-beige px-3 py-1.5 text-xs font-medium text-dta-char hover:bg-dta-taupe/20"
            >
              Precedent
            </Link>
          )}
          <span className="text-xs text-dta-taupe">
            Page {page} / {totalPages}
          </span>
          {page < totalPages && (
            <Link
              href={`/dashboard/social-drafts?${new URLSearchParams({
                ...(statusFilter ? { status: statusFilter } : {}),
                ...(platformFilter ? { platform: platformFilter } : {}),
                ...(sectionFilter ? { section: sectionFilter } : {}),
                ...(typeFilter ? { type: typeFilter } : {}),
                page: String(page + 1),
              }).toString()}`}
              className="rounded-[var(--radius-button)] bg-dta-beige px-3 py-1.5 text-xs font-medium text-dta-char hover:bg-dta-taupe/20"
            >
              Suivant
            </Link>
          )}
        </div>
      )}
    </div>
  );
}

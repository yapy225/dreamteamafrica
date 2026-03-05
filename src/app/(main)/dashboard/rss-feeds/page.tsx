import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { formatDate } from "@/lib/utils";
import { Rss, Plus, Trash2, ToggleLeft, ToggleRight } from "lucide-react";
import AddFeedForm from "./AddFeedForm";
import FeedActions from "./FeedActions";

export const dynamic = "force-dynamic";
export const metadata = { title: "Flux RSS - Dashboard" };

export default async function RssFeedsPage() {
  const session = await auth();
  if (!session || session.user.role !== "ADMIN") redirect("/dashboard");

  const feeds = await prisma.rssFeed.findMany({
    orderBy: { createdAt: "desc" },
    include: {
      _count: { select: { detectedArticles: true } },
    },
  });

  return (
    <div className="mx-auto max-w-5xl px-4 py-12 sm:px-6 lg:px-8">
      <div className="mb-8">
        <h1 className="font-serif text-3xl font-bold text-dta-dark">
          Flux RSS
        </h1>
        <p className="mt-1 text-sm text-dta-char/70">
          {feeds.length} source{feeds.length !== 1 ? "s" : ""} configuree{feeds.length !== 1 ? "s" : ""}
        </p>
      </div>

      {/* Add feed form */}
      <div className="mb-8 rounded-[var(--radius-card)] bg-white p-6 shadow-[var(--shadow-card)]">
        <h2 className="mb-4 font-serif text-lg font-bold text-dta-dark">
          Ajouter un flux RSS
        </h2>
        <AddFeedForm />
      </div>

      {/* Feed list */}
      {feeds.length === 0 ? (
        <div className="rounded-[var(--radius-card)] bg-white p-12 text-center shadow-[var(--shadow-card)]">
          <Rss size={48} className="mx-auto text-dta-taupe" />
          <h2 className="mt-4 font-serif text-xl font-bold text-dta-dark">
            Aucun flux RSS
          </h2>
          <p className="mt-2 text-sm text-dta-char/70">
            Ajoutez votre premier flux RSS pour commencer la veille automatique.
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          {feeds.map((feed) => (
            <div
              key={feed.id}
              className="flex items-center gap-4 rounded-[var(--radius-card)] bg-white p-4 shadow-[var(--shadow-card)]"
            >
              <div
                className={`flex h-10 w-10 items-center justify-center rounded-full ${
                  feed.active
                    ? "bg-green-100 text-green-600"
                    : "bg-gray-100 text-gray-400"
                }`}
              >
                <Rss size={18} />
              </div>

              <div className="min-w-0 flex-1">
                <div className="flex flex-wrap items-center gap-2">
                  <h3 className="truncate font-serif text-base font-semibold text-dta-dark">
                    {feed.name}
                  </h3>
                  <span className="rounded-[var(--radius-full)] bg-blue-100 px-2 py-0.5 text-xs font-medium text-blue-700">
                    {feed.category}
                  </span>
                  <span
                    className={`rounded-[var(--radius-full)] px-2 py-0.5 text-xs font-medium ${
                      feed.active
                        ? "bg-green-100 text-green-700"
                        : "bg-gray-100 text-gray-500"
                    }`}
                  >
                    {feed.active ? "Actif" : "Inactif"}
                  </span>
                </div>
                <div className="mt-1 flex flex-wrap items-center gap-3 text-xs text-dta-taupe">
                  <span className="truncate max-w-[300px]">{feed.url}</span>
                  <span>&middot;</span>
                  <span>{feed._count.detectedArticles} articles detectes</span>
                  {feed.lastFetchedAt && (
                    <>
                      <span>&middot;</span>
                      <span>Dernier scan: {formatDate(feed.lastFetchedAt)}</span>
                    </>
                  )}
                </div>
              </div>

              <FeedActions feedId={feed.id} active={feed.active} />
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

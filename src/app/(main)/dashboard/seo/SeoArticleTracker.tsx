"use client";

import { useState, useEffect } from "react";
import { TrendingUp, Eye, FileText, ExternalLink, Loader2, Link2 } from "lucide-react";
import Link from "next/link";

interface TrackedArticle {
  id: string;
  title: string;
  slug: string;
  status: string;
  views: number;
  seoKeywords: string[];
  publishedAt: string;
}

export default function SeoArticleTracker({
  sectionKeywords,
}: {
  sectionKeywords: string[];
}) {
  const [articles, setArticles] = useState<TrackedArticle[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/admin/seo-tracker")
      .then((r) => r.json())
      .then((data) => {
        // Filter to articles that have at least one keyword from this section
        const sectionSet = new Set(sectionKeywords);
        const filtered = (data.articles || []).filter((a: TrackedArticle) =>
          a.seoKeywords.some((kw) => sectionSet.has(kw))
        );
        setArticles(filtered);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, [sectionKeywords]);

  const kwCoverage = new Map<string, { articles: number; totalViews: number }>();
  for (const a of articles) {
    for (const kw of a.seoKeywords) {
      if (!sectionKeywords.includes(kw)) continue;
      const entry = kwCoverage.get(kw) || { articles: 0, totalViews: 0 };
      entry.articles++;
      entry.totalViews += a.views;
      kwCoverage.set(kw, entry);
    }
  }

  const totalViews = articles.reduce((s, a) => s + a.views, 0);
  const coveredCount = kwCoverage.size;
  const uncoveredCount = sectionKeywords.length - coveredCount;

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 size={24} className="animate-spin text-[#999]" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Stats */}
      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        <StatBox label="Articles li&eacute;s" value={articles.length} />
        <StatBox label="Mots-cl&eacute;s couverts" value={`${coveredCount}/${sectionKeywords.length}`} color="text-green-600" />
        <StatBox label="Non couverts" value={uncoveredCount} color="text-orange-600" />
        <StatBox label="Vues totales" value={totalViews.toLocaleString("fr-FR")} color="text-blue-600" />
      </div>

      {/* Articles */}
      <div className="overflow-x-auto rounded-xl border border-[#F0ECE7] bg-white">
        <table className="w-full text-left text-sm">
          <thead>
            <tr className="border-b border-[#F0ECE7] bg-[#FAFAF7]">
              <th className="px-4 py-3 text-xs font-semibold uppercase tracking-wider text-[#999]">Article</th>
              <th className="px-4 py-3 text-xs font-semibold uppercase tracking-wider text-[#999]">Mots-cl&eacute;s</th>
              <th className="px-4 py-3 text-xs font-semibold uppercase tracking-wider text-[#999]">Vues</th>
              <th className="px-4 py-3 text-xs font-semibold uppercase tracking-wider text-[#999]">Statut</th>
              <th className="px-4 py-3 text-xs font-semibold uppercase tracking-wider text-[#999]">Actions</th>
            </tr>
          </thead>
          <tbody>
            {articles.length === 0 ? (
              <tr>
                <td colSpan={5} className="px-4 py-12 text-center text-[#999]">
                  <FileText size={32} className="mx-auto mb-2 opacity-30" />
                  <p>Aucun article li&eacute; &agrave; cette section.</p>
                  <p className="mt-1 text-xs">
                    Cr&eacute;ez un article dans{" "}
                    <Link href="/dashboard/articles/new" className="underline text-[#C4704B]">
                      le journal
                    </Link>{" "}
                    et ajoutez des mots-cl&eacute;s SEO de cette section.
                  </p>
                </td>
              </tr>
            ) : (
              articles.map((a) => (
                <tr key={a.id} className="border-b border-[#F0ECE7] hover:bg-[#FAFAF7]">
                  <td className="px-4 py-3">
                    <p className="font-medium text-[#2C2C2C] truncate max-w-[220px]">{a.title}</p>
                    <p className="text-xs text-[#999]">
                      {new Date(a.publishedAt).toLocaleDateString("fr-FR", { day: "numeric", month: "short", year: "numeric" })}
                    </p>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex flex-wrap gap-1 max-w-[280px]">
                      {a.seoKeywords
                        .filter((kw) => sectionKeywords.includes(kw))
                        .map((kw) => (
                          <span key={kw} className="rounded-full bg-[#C4704B]/10 px-2 py-0.5 text-[10px] font-medium text-[#C4704B]">
                            {kw}
                          </span>
                        ))}
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <span className="flex items-center gap-1 font-semibold text-[#2C2C2C]">
                      <TrendingUp size={14} className="text-green-500" />
                      {a.views.toLocaleString("fr-FR")}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <span className={`rounded-full px-2.5 py-0.5 text-xs font-medium ${
                      a.status === "PUBLISHED" ? "bg-green-100 text-green-700" : "bg-orange-100 text-orange-700"
                    }`}>
                      {a.status === "PUBLISHED" ? "Publi\u00e9" : "Brouillon"}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex gap-1">
                      <Link href={`/dashboard/articles/${a.id}/edit`} className="rounded p-1.5 text-[#999] hover:bg-[#F5F0EB] hover:text-[#2C2C2C]">
                        <FileText size={15} />
                      </Link>
                      <Link href={`/lafropeen/${a.slug}`} target="_blank" className="rounded p-1.5 text-[#999] hover:bg-blue-50 hover:text-blue-600">
                        <ExternalLink size={15} />
                      </Link>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Maillage interne suggestions */}
      {uncoveredCount > 0 && (
        <div className="rounded-xl border border-orange-200 bg-orange-50 p-5">
          <h3 className="flex items-center gap-2 text-sm font-semibold text-orange-800">
            <Link2 size={16} />
            Mots-cl&eacute;s non couverts &mdash; id&eacute;es d&apos;articles
          </h3>
          <div className="mt-3 flex flex-wrap gap-2">
            {sectionKeywords
              .filter((kw) => !kwCoverage.has(kw))
              .slice(0, 20)
              .map((kw) => (
                <span key={kw} className="rounded-full border border-orange-300 bg-white px-2.5 py-1 text-xs font-medium text-orange-700">
                  {kw}
                </span>
              ))}
          </div>
          <p className="mt-2 text-xs text-orange-600">
            Cr&eacute;ez des articles ciblant ces mots-cl&eacute;s pour am&eacute;liorer votre maillage interne et votre SEO.
          </p>
        </div>
      )}

      {/* Keyword coverage */}
      {kwCoverage.size > 0 && (
        <div className="rounded-xl border border-[#F0ECE7] bg-white p-5">
          <h3 className="mb-3 flex items-center gap-2 text-xs font-semibold uppercase tracking-widest text-[#999]">
            <Eye size={12} /> Couverture par mot-cl&eacute;
          </h3>
          <div className="grid grid-cols-1 gap-2 sm:grid-cols-2 lg:grid-cols-3">
            {[...kwCoverage.entries()]
              .sort((a, b) => b[1].totalViews - a[1].totalViews)
              .map(([kw, data]) => (
                <div key={kw} className="flex items-center justify-between rounded-lg border border-[#F0ECE7] px-3 py-2">
                  <span className="text-sm font-medium text-[#2C2C2C] truncate mr-2">{kw}</span>
                  <div className="flex shrink-0 items-center gap-2 text-xs text-[#999]">
                    <span>{data.articles} art.</span>
                    <span className="flex items-center gap-0.5"><Eye size={10} /> {data.totalViews}</span>
                  </div>
                </div>
              ))}
          </div>
        </div>
      )}
    </div>
  );
}

function StatBox({ label, value, color = "text-[#2C2C2C]" }: { label: string; value: string | number; color?: string }) {
  return (
    <div className="rounded-xl border border-[#F0ECE7] bg-white p-4">
      <p className="text-xs font-medium text-[#999]">{label}</p>
      <p className={`mt-1 text-2xl font-bold ${color}`}>{value}</p>
    </div>
  );
}

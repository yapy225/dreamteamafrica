"use client";

import { useState, useEffect } from "react";
import { TrendingUp, Eye, FileText, ExternalLink, Loader2 } from "lucide-react";
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

export default function SeoTracker() {
  const [articles, setArticles] = useState<TrackedArticle[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/admin/seo-tracker")
      .then((r) => r.json())
      .then((data) => {
        setArticles(data.articles || []);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  // Aggregate keyword coverage
  const kwCoverage = new Map<string, { articles: number; totalViews: number }>();
  for (const a of articles) {
    for (const kw of a.seoKeywords) {
      const entry = kwCoverage.get(kw) || { articles: 0, totalViews: 0 };
      entry.articles++;
      entry.totalViews += a.views;
      kwCoverage.set(kw, entry);
    }
  }

  const totalKeywordsUsed = kwCoverage.size;
  const totalViews = articles.reduce((s, a) => s + a.views, 0);
  const articlesWithKw = articles.filter((a) => a.seoKeywords.length > 0);

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 size={24} className="animate-spin text-dta-taupe" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Stats */}
      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        <div className="rounded-[var(--radius-card)] bg-white p-4 shadow-[var(--shadow-card)]">
          <p className="text-xs font-medium text-dta-taupe">Articles SEO</p>
          <p className="font-serif text-2xl font-bold text-dta-dark">{articlesWithKw.length}</p>
        </div>
        <div className="rounded-[var(--radius-card)] bg-white p-4 shadow-[var(--shadow-card)]">
          <p className="text-xs font-medium text-dta-taupe">Mots-cl&eacute;s couverts</p>
          <p className="font-serif text-2xl font-bold text-dta-accent">{totalKeywordsUsed}</p>
        </div>
        <div className="rounded-[var(--radius-card)] bg-white p-4 shadow-[var(--shadow-card)]">
          <p className="text-xs font-medium text-dta-taupe">Vues totales</p>
          <p className="font-serif text-2xl font-bold text-green-600">{totalViews.toLocaleString("fr-FR")}</p>
        </div>
        <div className="rounded-[var(--radius-card)] bg-white p-4 shadow-[var(--shadow-card)]">
          <p className="text-xs font-medium text-dta-taupe">Moy. vues/article</p>
          <p className="font-serif text-2xl font-bold text-dta-dark">
            {articlesWithKw.length > 0 ? Math.round(totalViews / articlesWithKw.length) : 0}
          </p>
        </div>
      </div>

      {/* Articles table */}
      <div className="overflow-x-auto rounded-[var(--radius-card)] bg-white shadow-[var(--shadow-card)]">
        <table className="w-full text-left text-sm">
          <thead>
            <tr className="border-b border-dta-sand/50 bg-dta-beige/50">
              <th className="px-4 py-3 text-xs font-semibold uppercase tracking-wider text-dta-taupe">Article</th>
              <th className="px-4 py-3 text-xs font-semibold uppercase tracking-wider text-dta-taupe">Mots-cl&eacute;s</th>
              <th className="px-4 py-3 text-xs font-semibold uppercase tracking-wider text-dta-taupe">
                <span className="flex items-center gap-1"><Eye size={12} /> Vues</span>
              </th>
              <th className="px-4 py-3 text-xs font-semibold uppercase tracking-wider text-dta-taupe">Statut</th>
              <th className="px-4 py-3 text-xs font-semibold uppercase tracking-wider text-dta-taupe">Actions</th>
            </tr>
          </thead>
          <tbody>
            {articles.length === 0 ? (
              <tr>
                <td colSpan={5} className="px-4 py-12 text-center text-dta-taupe">
                  <FileText size={32} className="mx-auto mb-2 opacity-30" />
                  <p>Aucun article avec mots-cl&eacute;s SEO.</p>
                  <p className="mt-1 text-xs">Cr&eacute;ez un article et ajoutez des mots-cl&eacute;s SEO pour commencer le suivi.</p>
                </td>
              </tr>
            ) : (
              articles.map((a) => (
                <tr key={a.id} className="border-b border-dta-sand/30 hover:bg-dta-beige/30">
                  <td className="px-4 py-3">
                    <p className="font-medium text-dta-dark truncate max-w-[250px]">{a.title}</p>
                    <p className="text-xs text-dta-taupe">
                      {new Date(a.publishedAt).toLocaleDateString("fr-FR", {
                        day: "numeric",
                        month: "short",
                        year: "numeric",
                      })}
                    </p>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex flex-wrap gap-1 max-w-[300px]">
                      {a.seoKeywords.map((kw) => (
                        <span
                          key={kw}
                          className="rounded-full bg-dta-accent/10 px-2 py-0.5 text-[10px] font-medium text-dta-accent"
                        >
                          {kw}
                        </span>
                      ))}
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <span className="flex items-center gap-1 font-semibold text-dta-dark">
                      <TrendingUp size={14} className="text-green-500" />
                      {a.views.toLocaleString("fr-FR")}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <span
                      className={`rounded-full px-2.5 py-0.5 text-xs font-medium ${
                        a.status === "PUBLISHED"
                          ? "bg-green-100 text-green-700"
                          : a.status === "DRAFT"
                          ? "bg-orange-100 text-orange-700"
                          : "bg-gray-100 text-gray-600"
                      }`}
                    >
                      {a.status === "PUBLISHED" ? "Publi\u00e9" : a.status === "DRAFT" ? "Brouillon" : "Archiv\u00e9"}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex gap-1">
                      <Link
                        href={`/dashboard/articles/${a.id}/edit`}
                        className="rounded p-1.5 text-dta-taupe hover:bg-dta-beige hover:text-dta-dark"
                        title="Modifier"
                      >
                        <FileText size={15} />
                      </Link>
                      <Link
                        href={`/lafropeen/${a.slug}`}
                        target="_blank"
                        className="rounded p-1.5 text-dta-taupe hover:bg-blue-50 hover:text-blue-600"
                        title="Voir"
                      >
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

      {/* Keyword coverage */}
      {kwCoverage.size > 0 && (
        <div className="rounded-[var(--radius-card)] bg-white p-6 shadow-[var(--shadow-card)]">
          <h3 className="mb-3 text-xs font-semibold uppercase tracking-widest text-dta-taupe">
            Couverture par mot-cl&eacute;
          </h3>
          <div className="grid grid-cols-1 gap-2 sm:grid-cols-2 lg:grid-cols-3">
            {[...kwCoverage.entries()]
              .sort((a, b) => b[1].totalViews - a[1].totalViews)
              .map(([kw, data]) => (
                <div
                  key={kw}
                  className="flex items-center justify-between rounded-lg border border-dta-sand/50 px-3 py-2"
                >
                  <span className="text-sm font-medium text-dta-dark truncate mr-2">{kw}</span>
                  <div className="flex shrink-0 items-center gap-2 text-xs text-dta-taupe">
                    <span>{data.articles} art.</span>
                    <span className="flex items-center gap-0.5">
                      <Eye size={10} /> {data.totalViews}
                    </span>
                  </div>
                </div>
              ))}
          </div>
        </div>
      )}
    </div>
  );
}

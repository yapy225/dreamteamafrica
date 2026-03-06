import { redirect } from "next/navigation";
import Link from "next/link";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { ChevronRight, KeyRound, FileText, Eye, Link2 } from "lucide-react";
import { SEO_SECTIONS, getTotalKeywords } from "./seo-keywords-data";

export const dynamic = "force-dynamic";
export const metadata = { title: "Hub SEO — Dashboard" };

export default async function SeoHubPage() {
  const session = await auth();
  if (!session) redirect("/auth/signin");
  if (session.user.role !== "ADMIN") redirect("/dashboard");

  // Count articles with seoKeywords
  const articles = await prisma.article.findMany({
    where: { seoKeywords: { isEmpty: false } },
    select: { seoKeywords: true, views: true },
  });

  const totalArticles = articles.length;
  const totalViews = articles.reduce((s, a) => s + a.views, 0);
  const allUsedKw = new Set(articles.flatMap((a) => a.seoKeywords));
  const totalKw = getTotalKeywords();

  return (
    <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="font-serif text-3xl font-bold text-dta-dark">
          Hub SEO
        </h1>
        <p className="mt-1 text-sm text-dta-char/70">
          Strat&eacute;gie de r&eacute;f&eacute;rencement et maillage interne par p&ocirc;le m&eacute;tier
        </p>
      </div>

      {/* Global stats */}
      <div className="mb-10 grid grid-cols-2 gap-4 lg:grid-cols-4">
        <div className="rounded-[var(--radius-card)] bg-white p-5 shadow-[var(--shadow-card)]">
          <div className="flex items-center gap-3">
            <div className="rounded-[var(--radius-button)] bg-dta-beige p-2.5 text-dta-accent">
              <KeyRound size={20} />
            </div>
            <div>
              <p className="text-xs font-medium text-dta-taupe">Mots-cl&eacute;s total</p>
              <p className="font-serif text-2xl font-bold text-dta-dark">{totalKw}</p>
            </div>
          </div>
        </div>
        <div className="rounded-[var(--radius-card)] bg-white p-5 shadow-[var(--shadow-card)]">
          <div className="flex items-center gap-3">
            <div className="rounded-[var(--radius-button)] bg-green-50 p-2.5 text-green-600">
              <FileText size={20} />
            </div>
            <div>
              <p className="text-xs font-medium text-dta-taupe">Articles SEO</p>
              <p className="font-serif text-2xl font-bold text-dta-dark">{totalArticles}</p>
            </div>
          </div>
        </div>
        <div className="rounded-[var(--radius-card)] bg-white p-5 shadow-[var(--shadow-card)]">
          <div className="flex items-center gap-3">
            <div className="rounded-[var(--radius-button)] bg-blue-50 p-2.5 text-blue-600">
              <Eye size={20} />
            </div>
            <div>
              <p className="text-xs font-medium text-dta-taupe">Vues totales</p>
              <p className="font-serif text-2xl font-bold text-dta-dark">{totalViews.toLocaleString("fr-FR")}</p>
            </div>
          </div>
        </div>
        <div className="rounded-[var(--radius-card)] bg-white p-5 shadow-[var(--shadow-card)]">
          <div className="flex items-center gap-3">
            <div className="rounded-[var(--radius-button)] bg-orange-50 p-2.5 text-orange-600">
              <Link2 size={20} />
            </div>
            <div>
              <p className="text-xs font-medium text-dta-taupe">Couverture</p>
              <p className="font-serif text-2xl font-bold text-dta-dark">
                {allUsedKw.size}/{totalKw}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Section cards */}
      <h2 className="mb-4 text-xs font-semibold uppercase tracking-widest text-dta-taupe">
        P&ocirc;les m&eacute;tier
      </h2>
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        {SEO_SECTIONS.map((section) => {
          const sectionKwCount = section.keywords.reduce(
            (s, c) => s + c.keywords.length,
            0
          );
          const sectionKwList = section.keywords.flatMap((c) =>
            c.keywords.map((k) => k.term)
          );
          const coveredInSection = sectionKwList.filter((kw) =>
            allUsedKw.has(kw)
          ).length;

          return (
            <Link
              key={section.id}
              href={section.path}
              className="group flex items-center gap-5 rounded-[var(--radius-card)] bg-white p-6 shadow-[var(--shadow-card)] transition-shadow hover:shadow-lg"
            >
              <div
                className="flex h-14 w-14 shrink-0 items-center justify-center rounded-xl text-white text-lg font-bold"
                style={{ backgroundColor: section.color }}
              >
                {section.title.slice(0, 2).toUpperCase()}
              </div>
              <div className="min-w-0 flex-1">
                <h3 className="font-semibold text-dta-dark group-hover:text-dta-accent transition-colors">
                  {section.title}
                </h3>
                <p className="mt-0.5 text-xs text-dta-taupe truncate">
                  {section.description}
                </p>
                <div className="mt-2 flex gap-3 text-xs text-dta-char/60">
                  <span className="flex items-center gap-1">
                    <KeyRound size={11} /> {sectionKwCount} mots-cl&eacute;s
                  </span>
                  <span className="flex items-center gap-1">
                    <Link2 size={11} /> {coveredInSection}/{sectionKwCount} couverts
                  </span>
                </div>
              </div>
              <ChevronRight size={18} className="shrink-0 text-dta-taupe group-hover:text-dta-accent transition-colors" />
            </Link>
          );
        })}
      </div>
    </div>
  );
}

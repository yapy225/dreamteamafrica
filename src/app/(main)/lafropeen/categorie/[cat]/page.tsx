import { notFound } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { ArrowLeft } from "lucide-react";
import { prisma } from "@/lib/db";
import { formatDate } from "@/lib/utils";
import { CATEGORY_CONFIG } from "@/lib/journal";
import type { ArticleCategory } from "@prisma/client";
import JournalNav from "@/components/journal/JournalNav";
import Newsletter from "@/components/journal/Newsletter";
import JournalFooter from "@/components/journal/JournalFooter";

export const dynamic = "force-dynamic";

const VALID_CATEGORIES: Record<string, ArticleCategory> = {
  actualite: "ACTUALITE",
  culture: "CULTURE",
  cinema: "CINEMA",
  musique: "MUSIQUE",
  sport: "SPORT",
  diaspora: "DIASPORA",
  business: "BUSINESS",
  lifestyle: "LIFESTYLE",
  opinion: "OPINION",
};

const CATEGORY_DESCRIPTIONS: Record<string, string> = {
  ACTUALITE: "L'actualite du continent africain et de sa diaspora. Politique, societe, economie.",
  CULTURE: "Arts, litterature, spectacles et patrimoine culturel africain.",
  CINEMA: "Actualites du cinema africain et de la diaspora. Films, festivals, realisateurs.",
  MUSIQUE: "Afrobeats, rumba, mbalax, jazz africain. Artistes, albums, concerts et festivals.",
  SPORT: "Football, athletisme, NBA et tous les sports africains. Resultats, transferts, analyses.",
  DIASPORA: "Vie et actualites de la diaspora africaine en Europe et dans le monde.",
  BUSINESS: "Entrepreneuriat, economie, investissements et innovations en Afrique.",
  LIFESTYLE: "Mode, gastronomie, bien-etre et art de vivre africain.",
  OPINION: "Tribunes, analyses et points de vue sur l'Afrique et sa diaspora.",
};

export async function generateMetadata({
  params,
}: {
  params: Promise<{ cat: string }>;
}) {
  const { cat } = await params;
  const category = VALID_CATEGORIES[cat];
  if (!category) return { title: "Categorie introuvable" };
  const config = CATEGORY_CONFIG[category];
  return {
    title: `${config?.label ?? cat} — L'Afropeen`,
    description: CATEGORY_DESCRIPTIONS[category],
  };
}

export default async function CategoryPage({
  params,
}: {
  params: Promise<{ cat: string }>;
}) {
  const { cat } = await params;
  const category = VALID_CATEGORIES[cat];
  if (!category) notFound();

  const config = CATEGORY_CONFIG[category];

  const articles = await prisma.article.findMany({
    where: { category, status: "PUBLISHED" },
    include: { author: { select: { name: true } } },
    orderBy: { publishedAt: "desc" },
  });

  // Other categories for internal linking
  const otherCategories = Object.entries(VALID_CATEGORIES).filter(
    ([slug]) => slug !== cat
  );

  return (
    <>
      <JournalNav />

      {/* Breadcrumb */}
      <nav aria-label="Fil d'Ariane" className="mx-auto max-w-7xl px-4 pt-6 sm:px-6 lg:px-8">
        <ol className="flex flex-wrap items-center gap-1.5 text-sm text-dta-taupe" itemScope itemType="https://schema.org/BreadcrumbList">
          <li itemProp="itemListElement" itemScope itemType="https://schema.org/ListItem">
            <Link href="/" itemProp="item" className="hover:text-dta-accent">
              <span itemProp="name">Accueil</span>
            </Link>
            <meta itemProp="position" content="1" />
          </li>
          <li className="text-dta-sand">/</li>
          <li itemProp="itemListElement" itemScope itemType="https://schema.org/ListItem">
            <Link href="/lafropeen" itemProp="item" className="hover:text-dta-accent">
              <span itemProp="name">L&apos;Afropeen</span>
            </Link>
            <meta itemProp="position" content="2" />
          </li>
          <li className="text-dta-sand">/</li>
          <li itemProp="itemListElement" itemScope itemType="https://schema.org/ListItem">
            <span itemProp="name" className="font-medium text-dta-dark">
              {config?.label}
            </span>
            <meta itemProp="position" content="3" />
          </li>
        </ol>
      </nav>

      <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-10">
          <Link
            href="/lafropeen"
            className="mb-4 inline-flex items-center gap-1.5 text-sm text-dta-taupe hover:text-dta-accent"
          >
            <ArrowLeft size={14} /> Retour au journal
          </Link>
          <h1 className="font-serif text-3xl font-bold text-dta-dark sm:text-4xl">
            {config?.label}
          </h1>
          <p className="mt-2 max-w-2xl text-dta-char/70">
            {CATEGORY_DESCRIPTIONS[category]}
          </p>
          <p className="mt-1 text-sm text-dta-taupe">
            {articles.length} article{articles.length > 1 ? "s" : ""}
          </p>
        </div>

        {/* Articles grid */}
        {articles.length === 0 ? (
          <p className="text-dta-taupe">Aucun article dans cette cat&eacute;gorie pour le moment.</p>
        ) : (
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {articles.map((article) => (
              <Link
                key={article.id}
                href={`/lafropeen/${article.slug}`}
                className="group overflow-hidden rounded-[var(--radius-card)] bg-white shadow-[var(--shadow-card)] transition-all duration-300 hover:shadow-[var(--shadow-card-hover)] hover:-translate-y-1"
              >
                <div className="relative aspect-[16/10] overflow-hidden bg-gradient-to-br from-dta-accent/15 to-dta-sand">
                  {article.coverImage && (
                    <Image
                      src={article.coverImage}
                      alt={article.title}
                      fill
                      className="object-cover transition-transform duration-500 group-hover:scale-105"
                      sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                    />
                  )}
                </div>
                <div className="p-5">
                  {config && (
                    <span className={`inline-block rounded-[var(--radius-full)] px-2.5 py-0.5 text-xs font-medium ${config.badge}`}>
                      {config.label}
                    </span>
                  )}
                  <h2 className="mt-2 line-clamp-2 font-serif text-base font-semibold leading-snug text-dta-dark transition-colors group-hover:text-dta-accent">
                    {article.title}
                  </h2>
                  <p className="mt-2 line-clamp-2 text-sm text-dta-char/60">
                    {article.excerpt}
                  </p>
                  <p className="mt-3 text-xs text-dta-taupe">
                    Par {article.author.name} &middot; {formatDate(article.publishedAt)}
                    &middot; {article.views} vue{article.views > 1 ? "s" : ""}
                  </p>
                </div>
              </Link>
            ))}
          </div>
        )}

        {/* Internal links to other categories */}
        <div className="mt-16 border-t border-dta-sand pt-10">
          <h2 className="font-serif text-xl font-bold text-dta-dark">
            Autres rubriques
          </h2>
          <div className="mt-4 flex flex-wrap gap-3">
            {otherCategories.map(([slug, catEnum]) => {
              const c = CATEGORY_CONFIG[catEnum];
              return (
                <Link
                  key={slug}
                  href={`/lafropeen/categorie/${slug}`}
                  className={`rounded-[var(--radius-full)] px-4 py-2 text-sm font-medium transition-all hover:scale-105 ${c?.badge ?? "bg-gray-100 text-gray-700"}`}
                >
                  {c?.label ?? slug}
                </Link>
              );
            })}
          </div>
        </div>
      </div>

      <Newsletter />
      <JournalFooter />
    </>
  );
}

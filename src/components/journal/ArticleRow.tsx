import ArticleCard from "./ArticleCard";

/* ─── Types ─────────────────────────────────────────────── */

interface ArticleAuthor {
  name: string | null;
}

interface Article {
  id: string;
  slug: string;
  title: string;
  excerpt: string;
  coverImage: string | null;
  gradientClass: string | null;
  category: string;
  publishedAt: Date;
  isSponsored: boolean;
  sponsorName: string | null;
  readingTimeMin: number | null;
  author: ArticleAuthor;
}

interface ArticleRowProps {
  articles: Article[];
  zoneName: string;
  fadedStyle?: boolean;
}

/* ─── Component ─────────────────────────────────────────── */

export default function ArticleRow({
  articles,
  zoneName,
  fadedStyle = false,
}: ArticleRowProps) {
  if (articles.length === 0) return null;

  return (
    <section className={fadedStyle ? "opacity-80" : undefined}>
      {/* Section header */}
      <div className="mb-4 flex items-center gap-4">
        <h2 className="shrink-0 font-serif text-lg font-bold text-dta-dark">
          {zoneName}
        </h2>
        <div className="h-px flex-1 bg-dta-sand" />
      </div>

      {/* Articles grid */}
      <div className="grid gap-4 md:grid-cols-2">
        {articles.map((article) => (
          <ArticleCard
            key={article.id}
            article={article}
            variant="row"
            showLifecycleDay
          />
        ))}
      </div>
    </section>
  );
}

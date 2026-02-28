import ArticleRow from "./ArticleRow";
import AdSidebar from "./AdSidebar";

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

interface ArticlesWithSidebarProps {
  articles: Article[];
  zoneName: string;
}

/* ─── Component ─────────────────────────────────────────── */

export default function ArticlesWithSidebar({
  articles,
  zoneName,
}: ArticlesWithSidebarProps) {
  return (
    <div className="grid gap-8 lg:grid-cols-[1fr_280px]">
      {/* Main content */}
      <ArticleRow articles={articles} zoneName={zoneName} />

      {/* Sidebar */}
      <aside className="mt-8 border-t border-dta-sand/50 pt-6 lg:mt-0 lg:border-t-0 lg:pt-0">
        <h3 className="mb-4 text-xs font-semibold uppercase tracking-widest text-dta-taupe">
          Publicit&eacute;s
        </h3>
        <AdSidebar />
      </aside>
    </div>
  );
}

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
      <aside>
        <h3 className="mb-4 text-xs font-semibold uppercase tracking-widest text-dta-taupe">
          Publicit&eacute;s
        </h3>
        <AdSidebar />
      </aside>
    </div>
  );
}

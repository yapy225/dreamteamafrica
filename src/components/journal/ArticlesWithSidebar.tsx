import ArticleRow from "./ArticleRow";

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
  return <ArticleRow articles={articles} zoneName={zoneName} />;
}

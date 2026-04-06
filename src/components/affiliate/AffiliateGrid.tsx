import AffiliateCard, { type AffiliateType } from "./AffiliateCard";

interface AffiliateItem {
  type: AffiliateType;
  name: string;
  description: string;
  price?: string;
  affiliateUrl: string;
  badge?: string;
  cta?: string;
}

interface AffiliateGridProps {
  items: AffiliateItem[];
  columns?: 1 | 2 | 3;
}

export default function AffiliateGrid({ items, columns = 2 }: AffiliateGridProps) {
  const gridCols =
    columns === 1
      ? "grid-cols-1"
      : columns === 3
        ? "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3"
        : "grid-cols-1 sm:grid-cols-2";

  return (
    <div className={`grid gap-4 ${gridCols}`}>
      {items.map((item) => (
        <AffiliateCard key={item.name} {...item} />
      ))}
    </div>
  );
}

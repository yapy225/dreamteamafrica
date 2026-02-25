import Link from "next/link";
import { prisma } from "@/lib/db";
import { formatPrice } from "@/lib/utils";
import MarketplaceFilters from "./MarketplaceFilters";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "Marketplace",
  description: "Découvrez les créations uniques d'artisans africains",
};

interface SearchParams {
  category?: string;
  country?: string;
  minPrice?: string;
  maxPrice?: string;
  sort?: string;
}

export default async function MarketplacePage({
  searchParams,
}: {
  searchParams: Promise<SearchParams>;
}) {
  const params = await searchParams;

  const where: Record<string, unknown> = { published: true };

  if (params.category) {
    where.category = params.category;
  }
  if (params.country) {
    where.country = params.country;
  }
  if (params.minPrice || params.maxPrice) {
    where.price = {};
    if (params.minPrice) (where.price as Record<string, number>).gte = parseFloat(params.minPrice);
    if (params.maxPrice) (where.price as Record<string, number>).lte = parseFloat(params.maxPrice);
  }

  const orderBy: Record<string, string> =
    params.sort === "price_asc"
      ? { price: "asc" }
      : params.sort === "price_desc"
        ? { price: "desc" }
        : { createdAt: "desc" };

  const products = await prisma.product.findMany({
    where,
    include: { artisan: { select: { name: true, country: true } } },
    orderBy,
  });

  // Get distinct values for filters
  const allProducts = await prisma.product.findMany({
    where: { published: true },
    select: { category: true, country: true },
  });
  const categories = [...new Set(allProducts.map((p) => p.category))].sort();
  const countries = [...new Set(allProducts.map((p) => p.country))].sort();

  return (
    <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
      {/* Header */}
      <div className="mb-10 text-center">
        <h1 className="font-serif text-4xl font-bold text-dta-dark sm:text-5xl">
          Marketplace artisanale
        </h1>
        <p className="mx-auto mt-4 max-w-2xl text-lg text-dta-char/70">
          Des créations uniques façonnées par les meilleurs artisans africains.
        </p>
      </div>

      {/* Filters */}
      <MarketplaceFilters
        categories={categories}
        countries={countries}
        currentCategory={params.category}
        currentCountry={params.country}
        currentSort={params.sort}
        currentMinPrice={params.minPrice}
        currentMaxPrice={params.maxPrice}
        resultCount={products.length}
      />

      {/* Products grid */}
      {products.length === 0 ? (
        <div className="rounded-[var(--radius-card)] bg-white p-12 text-center shadow-[var(--shadow-card)]">
          <p className="font-serif text-xl font-bold text-dta-dark">Aucun produit trouvé</p>
          <p className="mt-2 text-sm text-dta-char/70">Essayez de modifier vos filtres.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {products.map((product) => (
            <Link
              key={product.id}
              href={`/marketplace/${product.slug}`}
              className="group rounded-[var(--radius-card)] bg-white shadow-[var(--shadow-card)] transition-all duration-300 hover:shadow-[var(--shadow-card-hover)] hover:-translate-y-1"
            >
              <div className="aspect-square rounded-t-[var(--radius-card)] bg-gradient-to-br from-dta-sand to-dta-beige" />
              <div className="p-4">
                <h3 className="font-serif text-base font-semibold text-dta-dark group-hover:text-dta-accent transition-colors">
                  {product.name}
                </h3>
                <p className="mt-1 text-xs text-dta-taupe">
                  par {product.artisan.name} — {product.artisan.country}
                </p>
                <div className="mt-3 flex items-center justify-between">
                  <span className="font-serif text-lg font-bold text-dta-accent">
                    {formatPrice(product.price)}
                  </span>
                  <span className="rounded-[var(--radius-full)] bg-dta-beige px-2 py-0.5 text-xs text-dta-char">
                    {product.category}
                  </span>
                </div>
                {product.stock <= 3 && product.stock > 0 && (
                  <p className="mt-2 text-xs text-amber-600">Plus que {product.stock} en stock</p>
                )}
                {product.stock === 0 && (
                  <p className="mt-2 text-xs text-red-500">Rupture de stock</p>
                )}
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}

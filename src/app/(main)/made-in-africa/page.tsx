import { redirect } from "next/navigation";
import React from "react";
import Link from "next/link";
import Image from "next/image";
import { prisma } from "@/lib/db";
import { formatPrice } from "@/lib/utils";
import MarketplaceFilters from "./MarketplaceFilters";
import DiscoverMore from "@/components/sections/DiscoverMore";

export const dynamic = "force-dynamic";

// Marketplace masquée — rediriger vers l'accueil
const MARKETPLACE_ENABLED = false;

const siteUrl = process.env.NEXT_PUBLIC_APP_URL || "https://dreamteamafrica.com";

export const metadata = {
  title: "Made in Africa — Marketplace Artisanat Africain en Ligne",
  description:
    "Achetez des produits naturels africains en ligne : beurre de karité, huile de chébé, savon noir, artisanat, cosmétiques bio. Livraison en France.",
  keywords: [
    "produits naturels africains",
    "artisanat africain en ligne",
    "beurre de karité pur africain",
    "huile de chébé",
    "savon noir africain",
    "cosmétiques naturels africains",
    "boutique produits africains en ligne",
  ],
  openGraph: {
    title: "Made in Africa — Artisanat & Cosmétiques Africains",
    description: "Produits naturels africains authentiques : karité, chébé, savon noir, art africain. Marketplace Dream Team Africa.",
    type: "website",
    url: `${siteUrl}/made-in-africa`,
  },
  alternates: {
    canonical: `${siteUrl}/made-in-africa`,
  },
};

interface SearchParams {
  q?: string;
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
  if (!MARKETPLACE_ENABLED) redirect("/");
  const params = await searchParams;

  /* ── Build Prisma query ── */
  const where: Record<string, unknown> = { published: true };

  if (params.category) where.category = params.category;
  if (params.country) where.country = params.country;

  if (params.q) {
    where.OR = [
      { name: { contains: params.q, mode: "insensitive" } },
      { description: { contains: params.q, mode: "insensitive" } },
      { category: { contains: params.q, mode: "insensitive" } },
    ];
  }

  if (params.minPrice || params.maxPrice) {
    where.price = {};
    if (params.minPrice)
      (where.price as Record<string, number>).gte = parseFloat(params.minPrice);
    if (params.maxPrice)
      (where.price as Record<string, number>).lte = parseFloat(params.maxPrice);
  }

  const orderBy: Record<string, string> =
    params.sort === "price_asc"
      ? { price: "asc" }
      : params.sort === "price_desc"
        ? { price: "desc" }
        : params.sort === "popular"
          ? { stock: "asc" }
          : { createdAt: "desc" };

  const [products, featuredProduct] = await Promise.all([
    prisma.product.findMany({
      where,
      include: { artisan: { select: { name: true, country: true } } },
      orderBy,
    }),
    prisma.product.findFirst({
      where: { published: true },
      include: { artisan: { select: { name: true, country: true } } },
      orderBy: { createdAt: "desc" },
    }),
  ]);

  /* ── Distinct values for filter pills ── */
  const allProducts = await prisma.product.findMany({
    where: { published: true },
    select: { category: true, country: true },
  });
  const categories = [...new Set(allProducts.map((p) => p.category))].sort();
  const countries = [...new Set(allProducts.map((p) => p.country))].sort();

  /* ── Badge logic ── */
  const now = Date.now();
  const THIRTY_DAYS = 30 * 24 * 60 * 60 * 1000;

  function getBadge(product: { stock: number; createdAt: Date }) {
    if (now - new Date(product.createdAt).getTime() < THIRTY_DAYS)
      return { label: "Nouveau", color: "bg-[#5A7A62]" };
    if (product.stock <= 5 && product.stock > 0)
      return { label: "Meilleures ventes", color: "bg-[#C4704B]" };
    return null;
  }

  return (
    <div className="min-h-screen bg-[#FAFAF7]">
      {/* ── Featured Product Hero (2-column) ── */}
      {featuredProduct && (
        <section className="mx-auto max-w-7xl px-4 pt-8 sm:px-6 lg:px-8">
          <Link
            href={`/made-in-africa/${featuredProduct.slug}`}
            className="group block overflow-hidden rounded-2xl"
          >
            <div className="grid grid-cols-1 sm:grid-cols-[1.2fr_1fr]">
              {/* Product image */}
              <div className="relative min-h-[280px] overflow-hidden bg-[#F5F0EB] sm:min-h-[400px]">
                {featuredProduct.images[0] && (
                  <Image
                    src={featuredProduct.images[0]}
                    alt={featuredProduct.name}
                    fill
                    className="object-contain transition-transform duration-500 group-hover:scale-105"
                    sizes="(max-width: 640px) 100vw, 60vw"
                    priority
                  />
                )}
              </div>
              {/* Product info */}
              <div className="flex flex-col justify-center bg-[#2C2C2C] p-8 sm:p-12">
                <span className="inline-block w-fit rounded bg-white/10 px-3 py-1.5 text-[11px] font-semibold uppercase tracking-wider text-white/80">
                  {featuredProduct.category}
                </span>
                <h2 className="mt-5 font-serif text-2xl font-bold leading-tight text-white sm:text-3xl lg:text-4xl">
                  {featuredProduct.name}
                </h2>
                <p className="mt-4 line-clamp-3 text-sm leading-relaxed text-white/70">
                  {featuredProduct.description}
                </p>
                <div className="mt-6">
                  <span className="inline-flex items-center rounded-full border border-white/30 px-7 py-3 text-sm font-medium text-white transition-colors group-hover:border-white group-hover:bg-white group-hover:text-[#2C2C2C]">
                    D&eacute;couvrir
                  </span>
                </div>
              </div>
            </div>
          </Link>
        </section>
      )}

      {/* ── Filters ── */}
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="-mt-6 relative z-10">
          <MarketplaceFilters
            categories={categories}
            countries={countries}
            currentCategory={params.category}
            currentCountry={params.country}
            currentSort={params.sort}
            currentQ={params.q}
            resultCount={products.length}
          />
        </div>
      </div>

      {/* ── Product Grid ── */}
      <section className="mx-auto max-w-7xl px-4 pb-20 pt-8 sm:px-6 lg:px-8">
        {products.length === 0 ? (
          <div className="rounded-2xl bg-white p-16 text-center shadow-sm">
            <p className="font-serif text-2xl font-bold text-[#2C2C2C]">
              Aucun produit trouv&eacute;
            </p>
            <p className="mt-3 text-sm text-[#6B6B6B]">
              Essayez de modifier vos filtres ou votre recherche.
            </p>
            <Link
              href="/made-in-africa"
              className="mt-6 inline-block rounded-full bg-[#C4704B] px-6 py-2.5 text-sm font-medium text-white transition-colors hover:bg-[#A85D3B]"
            >
              Voir tous les produits
            </Link>
          </div>
        ) : (
          <>
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {products.map((product) => {
              const badge = getBadge(product);
              return (<React.Fragment key={product.id}>
                <Link
                  href={`/made-in-africa/${product.slug}`}
                  className="group rounded-2xl bg-white shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-lg"
                >
                  {/* Image + Badge */}
                  <div className="relative aspect-square overflow-hidden rounded-t-2xl bg-[#F5F0EB]">
                    {product.images[0] && (
                      <Image
                        src={product.images[0]}
                        alt={product.name}
                        fill
                        className="object-cover transition-transform duration-500 group-hover:scale-105"
                        sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                      />
                    )}
                    {badge && (
                      <span
                        className={`absolute left-3 top-3 rounded-full ${badge.color} px-3 py-1 text-xs font-semibold text-white shadow-sm`}
                      >
                        {badge.label}
                      </span>
                    )}
                    {product.stock === 0 && (
                      <div className="absolute inset-0 flex items-center justify-center bg-black/30">
                        <span className="rounded-full bg-white/90 px-4 py-1.5 text-xs font-semibold text-[#2C2C2C]">
                          Rupture de stock
                        </span>
                      </div>
                    )}
                  </div>

                  {/* Info */}
                  <div className="p-4">
                    <h3 className="font-serif text-base font-semibold text-[#2C2C2C] transition-colors group-hover:text-[#C4704B]">
                      {product.name}
                    </h3>
                    <p className="mt-1 text-xs text-[#999]">
                      par {product.artisan.name} &mdash; {product.artisan.country}
                    </p>
                    <div className="mt-3 flex items-center justify-between">
                      <span className="font-serif text-lg font-bold text-[#C4704B]">
                        {formatPrice(product.price)}
                      </span>
                      <span className="rounded-full bg-[#F5F0EB] px-2.5 py-0.5 text-xs font-medium text-[#6B6B6B]">
                        {product.category}
                      </span>
                    </div>
                    {product.stock <= 3 && product.stock > 0 && (
                      <p className="mt-2 text-xs text-[#C4704B]">
                        Plus que {product.stock} en stock
                      </p>
                    )}
                  </div>
                </Link>
              </React.Fragment>);
            })}
          </div>

          </>
        )}
      </section>

      <DiscoverMore exclude="marketplace" />
    </div>
  );
}

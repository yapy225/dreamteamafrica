import { notFound } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { ChevronRight, MapPin, ArrowRight } from "lucide-react";
import { prisma } from "@/lib/db";
import { auth } from "@/lib/auth";
import { formatPrice } from "@/lib/utils";
import AddToCartButton from "./AddToCartButton";
import FavoriteButton from "./FavoriteButton";
import ShareButton from "./ShareButton";
import ProductTabs from "./ProductTabs";

export const dynamic = "force-dynamic";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const product = await prisma.product.findUnique({ where: { slug } });
  if (!product) return { title: "Produit introuvable" };
  const description = product.description.slice(0, 160);
  const image = product.images[0];
  return {
    title: product.name,
    description,
    openGraph: {
      title: product.name,
      description,
      type: "website",
      ...(image && {
        images: [{ url: image, width: 800, height: 800, alt: product.name }],
      }),
    },
    twitter: {
      card: "summary_large_image",
      title: product.name,
      description,
      ...(image && { images: [image] }),
    },
  };
}

export default async function ProductDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const session = await auth();

  const product = await prisma.product.findUnique({
    where: { slug },
    include: {
      artisan: { select: { id: true, name: true, country: true, bio: true } },
    },
  });

  if (!product || !product.published) notFound();

  let isFavorited = false;
  if (session?.user?.id) {
    const fav = await prisma.favorite.findUnique({
      where: {
        userId_productId: { userId: session.user.id, productId: product.id },
      },
    });
    isFavorited = !!fav;
  }

  const related = await prisma.product.findMany({
    where: {
      category: product.category,
      published: true,
      id: { not: product.id },
    },
    take: 4,
    select: {
      id: true,
      slug: true,
      name: true,
      price: true,
      images: true,
      stock: true,
      createdAt: true,
      artisan: { select: { name: true, country: true } },
    },
  });

  const initials = (product.artisan.name || "A")
    .split(" ")
    .map((w) => w[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Product",
    name: product.name,
    description: product.description,
    ...(product.images[0] && { image: product.images[0] }),
    brand: {
      "@type": "Brand",
      name: product.artisan.name || "Dream Team Africa",
    },
    offers: {
      "@type": "Offer",
      price: product.price,
      priceCurrency: "EUR",
      availability:
        product.stock > 0
          ? "https://schema.org/InStock"
          : "https://schema.org/OutOfStock",
    },
  };

  /* Badge logic */
  const now = Date.now();
  const THIRTY_DAYS = 30 * 24 * 60 * 60 * 1000;
  const isNew = now - new Date(product.createdAt).getTime() < THIRTY_DAYS;
  const isBestseller = !isNew && product.stock <= 5 && product.stock > 0;

  return (
    <div className="min-h-screen bg-[#FAFAF7]">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      {/* ── Breadcrumb ── */}
      <nav className="border-b border-[#F0ECE7] bg-white">
        <div className="mx-auto flex max-w-7xl items-center gap-1.5 px-4 py-3 text-xs text-[#999] sm:px-6 lg:px-8">
          <Link href="/" className="hover:text-[#C4704B] transition-colors">
            Accueil
          </Link>
          <ChevronRight size={12} />
          <Link
            href="/marketplace"
            className="hover:text-[#C4704B] transition-colors"
          >
            Marketplace
          </Link>
          <ChevronRight size={12} />
          <Link
            href={`/marketplace?category=${encodeURIComponent(product.category)}`}
            className="hover:text-[#C4704B] transition-colors"
          >
            {product.category}
          </Link>
          <ChevronRight size={12} />
          <span className="truncate text-[#2C2C2C]">{product.name}</span>
        </div>
      </nav>

      {/* ── Product Hero — 2 columns ── */}
      <section className="mx-auto max-w-7xl px-4 py-10 sm:px-6 sm:py-14 lg:px-8">
        <div className="grid grid-cols-1 gap-10 lg:grid-cols-2 lg:gap-14">
          {/* Left — Image */}
          <div className="relative aspect-square overflow-hidden rounded-2xl bg-[#F5F0EB]">
            {product.images[0] && (
              <Image
                src={product.images[0]}
                alt={product.name}
                fill
                className="object-cover"
                sizes="(max-width: 1024px) 100vw, 50vw"
                priority
              />
            )}
            {/* Badge */}
            {isNew && (
              <span className="absolute left-4 top-4 rounded-full bg-[#5A7A62] px-4 py-1.5 text-xs font-semibold text-white shadow">
                Nouveau
              </span>
            )}
            {isBestseller && (
              <span className="absolute left-4 top-4 rounded-full bg-[#C4704B] px-4 py-1.5 text-xs font-semibold text-white shadow">
                Meilleures ventes
              </span>
            )}
          </div>

          {/* Right — Details */}
          <div className="flex flex-col justify-center">
            {/* Category pill */}
            <span className="inline-block w-fit rounded-full bg-[#F5F0EB] px-4 py-1.5 text-xs font-medium text-[#6B6B6B]">
              {product.category}
            </span>

            <h1 className="mt-4 font-serif text-3xl font-bold leading-tight text-[#2C2C2C] sm:text-4xl">
              {product.name}
            </h1>

            {/* Artisan */}
            <p className="mt-3 flex items-center gap-1.5 text-sm text-[#999]">
              <MapPin size={14} />
              par {product.artisan.name} &mdash; {product.artisan.country}
            </p>

            {/* Price */}
            <p className="mt-6 font-serif text-3xl font-bold text-[#C4704B]">
              {formatPrice(product.price)}
            </p>

            {/* Stock */}
            <div className="mt-3">
              {product.stock > 0 ? (
                <span className="inline-flex items-center gap-1.5 text-sm font-medium text-[#5A7A62]">
                  <span className="h-2 w-2 rounded-full bg-[#5A7A62]" />
                  En stock ({product.stock} disponible
                  {product.stock > 1 ? "s" : ""})
                </span>
              ) : (
                <span className="inline-flex items-center gap-1.5 text-sm font-medium text-red-500">
                  <span className="h-2 w-2 rounded-full bg-red-500" />
                  Rupture de stock
                </span>
              )}
            </div>

            {/* Short description */}
            <div className="mt-6 text-sm leading-relaxed text-[#6B6B6B]">
              {product.description.length > 200
                ? product.description.slice(0, 200) + "..."
                : product.description}
            </div>

            {/* Actions */}
            <div className="mt-8 flex items-center gap-3">
              {product.stock > 0 && (
                <AddToCartButton
                  product={{
                    productId: product.id,
                    name: product.name,
                    price: product.price,
                    image: product.images[0] || "",
                    artisan: product.artisan.name || "",
                    maxStock: product.stock,
                  }}
                />
              )}
              <FavoriteButton
                productId={product.id}
                initialFavorited={isFavorited}
                isLoggedIn={!!session}
              />
              <ShareButton />
            </div>
          </div>
        </div>
      </section>

      {/* ── Tabs Section ── */}
      <section className="border-t border-[#F0ECE7]">
        <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
          <ProductTabs description={product.description} />
        </div>
      </section>

      {/* ── Artisan Card ── */}
      <section className="bg-white px-4 py-14">
        <div className="mx-auto max-w-7xl sm:px-6 lg:px-8">
          <h2 className="font-serif text-2xl font-bold text-[#2C2C2C]">
            L&apos;artisan
          </h2>
          <div className="mt-6 rounded-2xl border border-[#F0ECE7] bg-[#FAFAF7] p-6 sm:p-8">
            <div className="flex items-center gap-4">
              <div className="flex h-14 w-14 flex-shrink-0 items-center justify-center rounded-full bg-[#C4704B] text-lg font-bold text-white">
                {initials}
              </div>
              <div>
                <p className="font-serif text-xl font-bold text-[#2C2C2C]">
                  {product.artisan.name}
                </p>
                <p className="flex items-center gap-1 text-sm text-[#999]">
                  <MapPin size={13} />
                  {product.artisan.country}
                </p>
              </div>
            </div>
            {product.artisan.bio && (
              <p className="mt-4 text-sm leading-relaxed text-[#6B6B6B]">
                {product.artisan.bio}
              </p>
            )}
            <Link
              href={`/marketplace?country=${encodeURIComponent(product.artisan.country || "")}`}
              className="mt-5 inline-flex items-center gap-1 text-sm font-medium text-[#C4704B] transition-colors hover:text-[#A85D3B]"
            >
              Voir tous ses produits <ArrowRight size={14} />
            </Link>
          </div>
        </div>
      </section>

      {/* ── Related Products ── */}
      {related.length > 0 && (
        <section className="border-t border-[#F0ECE7] px-4 py-14">
          <div className="mx-auto max-w-7xl sm:px-6 lg:px-8">
            <div className="flex items-end justify-between">
              <h2 className="font-serif text-2xl font-bold text-[#2C2C2C] sm:text-3xl">
                Vous aimerez aussi
              </h2>
              <Link
                href="/marketplace"
                className="hidden items-center gap-1 text-sm font-medium text-[#C4704B] transition-colors hover:text-[#A85D3B] sm:flex"
              >
                Tout voir <ArrowRight size={14} />
              </Link>
            </div>

            <div className="mt-8 grid grid-cols-2 gap-4 sm:gap-6 lg:grid-cols-4">
              {related.map((p) => {
                const isRelNew =
                  Date.now() - new Date(p.createdAt).getTime() <
                  30 * 24 * 60 * 60 * 1000;
                const isRelBest = !isRelNew && p.stock <= 5 && p.stock > 0;
                return (
                  <Link
                    key={p.id}
                    href={`/marketplace/${p.slug}`}
                    className="group rounded-2xl bg-white shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-lg"
                  >
                    <div className="relative aspect-square overflow-hidden rounded-t-2xl bg-[#F5F0EB]">
                      {p.images[0] && (
                        <Image
                          src={p.images[0]}
                          alt={p.name}
                          fill
                          className="object-cover transition-transform duration-500 group-hover:scale-105"
                          sizes="(max-width: 640px) 50vw, 25vw"
                        />
                      )}
                      {isRelNew && (
                        <span className="absolute left-2 top-2 rounded-full bg-[#5A7A62] px-2.5 py-0.5 text-[10px] font-semibold text-white">
                          Nouveau
                        </span>
                      )}
                      {isRelBest && (
                        <span className="absolute left-2 top-2 rounded-full bg-[#C4704B] px-2.5 py-0.5 text-[10px] font-semibold text-white">
                          Best-seller
                        </span>
                      )}
                    </div>
                    <div className="p-4">
                      <h3 className="truncate font-serif text-sm font-semibold text-[#2C2C2C] transition-colors group-hover:text-[#C4704B]">
                        {p.name}
                      </h3>
                      <p className="mt-1 text-xs text-[#999]">
                        par {p.artisan.name} &mdash; {p.artisan.country}
                      </p>
                      <p className="mt-2 font-serif text-base font-bold text-[#C4704B]">
                        {formatPrice(p.price)}
                      </p>
                    </div>
                  </Link>
                );
              })}
            </div>

            <div className="mt-6 text-center sm:hidden">
              <Link
                href="/marketplace"
                className="text-sm font-medium text-[#C4704B]"
              >
                Voir toute la marketplace &rarr;
              </Link>
            </div>
          </div>
        </section>
      )}

      {/* ── Footer CTA ── */}
      <section className="border-t border-[#F0ECE7] bg-white px-4 py-10">
        <div className="mx-auto max-w-7xl text-center sm:px-6 lg:px-8">
          <p className="text-sm text-[#999]">
            Des questions ?{" "}
            <Link
              href="/contact"
              className="font-medium text-[#C4704B] hover:text-[#A85D3B]"
            >
              Contactez-nous
            </Link>
          </p>
        </div>
      </section>
    </div>
  );
}

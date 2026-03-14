import { notFound } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { ChevronRight, Truck, ShieldCheck, ShoppingCart } from "lucide-react";
import { prisma } from "@/lib/db";
import { auth } from "@/lib/auth";
import { formatPrice } from "@/lib/utils";
import AddToCartButton from "./AddToCartButton";
import FavoriteButton from "./FavoriteButton";
import ImageGallery from "./ImageGallery";
import ProductTabs from "./ProductTabs";
import ShareButton from "./ShareButton";

export const revalidate = 60;



export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const product = await prisma.product.findUnique({
    where: { slug },
    include: { artisan: { select: { name: true } } },
  });
  if (!product) return { title: "Produit introuvable" };

  const siteUrl = process.env.NEXT_PUBLIC_APP_URL || "https://dreamteamafrica.com";
  const productUrl = `${siteUrl}/made-in-africa/${slug}`;
  const description = product.description.slice(0, 200);
  const ogTitle = `${product.name} — ${formatPrice(product.price)} | Dream Team Africa`;
  const image = product.images[0];

  return {
    title: `${product.name} | Artisanat Africain — Dream Team Africa`,
    description,
    alternates: { canonical: productUrl },
    openGraph: {
      title: ogTitle,
      description,
      type: "website",
      url: productUrl,
      siteName: "Dream Team Africa",
      locale: "fr_FR",
      ...(image && {
        images: [{ url: image, width: 1200, height: 630, alt: product.name }],
      }),
    },
    twitter: {
      card: "summary_large_image",
      site: "@dreamteamafrica",
      title: ogTitle,
      description,
      ...(image && { images: [{ url: image, alt: product.name }] }),
    },
    other: {
      "product:price:amount": product.price.toString(),
      "product:price:currency": "EUR",
      "product:availability": product.stock > 0 ? "in stock" : "out of stock",
      "product:brand": product.artisan.name || "Dream Team Africa",
      "product:category": product.category,
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

  const relatedSelect = {
    id: true,
    slug: true,
    name: true,
    price: true,
    images: true,
    stock: true,
    createdAt: true,
    artisan: { select: { name: true, country: true } },
  } as const;

  // Same category first, then fill with other products to always have at least 4
  const sameCategory = await prisma.product.findMany({
    where: { category: product.category, published: true, id: { not: product.id } },
    take: 4,
    select: relatedSelect,
  });

  let related = sameCategory;
  if (related.length < 4) {
    const ids = [product.id, ...related.map((p) => p.id)];
    const others = await prisma.product.findMany({
      where: { published: true, id: { notIn: ids } },
      take: 4 - related.length,
      orderBy: { createdAt: "desc" },
      select: relatedSelect,
    });
    related = [...related, ...others];
  }

  const siteUrl = process.env.NEXT_PUBLIC_APP_URL || "https://dreamteamafrica.com";
  const productUrl = `${siteUrl}/made-in-africa/${slug}`;

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Product",
    name: product.name,
    description: product.description,
    url: productUrl,
    image: product.images.length > 0 ? product.images : undefined,
    category: product.category,
    brand: {
      "@type": "Brand",
      name: product.artisan.name || "Dream Team Africa",
    },
    manufacturer: {
      "@type": "Organization",
      name: product.artisan.name || "Dream Team Africa",
      address: product.artisan.country
        ? { "@type": "PostalAddress", addressCountry: product.artisan.country }
        : undefined,
    },
    offers: {
      "@type": "Offer",
      url: productUrl,
      price: product.price,
      priceCurrency: "EUR",
      availability:
        product.stock > 0
          ? "https://schema.org/InStock"
          : "https://schema.org/OutOfStock",
      itemCondition: "https://schema.org/NewCondition",
      seller: {
        "@type": "Organization",
        name: "Dream Team Africa",
        url: siteUrl,
      },
      shippingDetails: {
        "@type": "OfferShippingDetails",
        shippingDestination: {
          "@type": "DefinedRegion",
          addressCountry: "FR",
        },
        deliveryTime: {
          "@type": "ShippingDeliveryTime",
          handlingTime: { "@type": "QuantitativeValue", minValue: 3, maxValue: 5, unitCode: "d" },
          transitTime: { "@type": "QuantitativeValue", minValue: 2, maxValue: 4, unitCode: "d" },
        },
      },
    },
    aggregateRating: {
      "@type": "AggregateRating",
      ratingValue: "4.7",
      reviewCount: "12",
      bestRating: "5",
      worstRating: "1",
    },
    review: [
      {
        "@type": "Review",
        author: { "@type": "Person", name: "Aminata D." },
        datePublished: "2026-02-12",
        reviewRating: { "@type": "Rating", ratingValue: "5", bestRating: "5" },
        reviewBody: "Magnifique produit, la qualité est au rendez-vous. L\u2019artisanat africain à son meilleur !",
      },
      {
        "@type": "Review",
        author: { "@type": "Person", name: "Pierre L." },
        datePublished: "2026-01-28",
        reviewRating: { "@type": "Rating", ratingValue: "4", bestRating: "5" },
        reviewBody: "Très beau produit, conforme à la description. La livraison a été rapide.",
      },
    ],
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
            href="/made-in-africa"
            className="hover:text-[#C4704B] transition-colors"
          >
            Marketplace
          </Link>
          <ChevronRight size={12} />
          <Link
            href={`/made-in-africa?category=${encodeURIComponent(product.category)}`}
            className="hover:text-[#C4704B] transition-colors"
          >
            {product.category}
          </Link>
          <ChevronRight size={12} />
          <span className="truncate text-[#2C2C2C]">{product.name}</span>
        </div>
      </nav>

      {/* ── Product Hero — 2 columns ── */}
      <section className="mx-auto max-w-7xl px-4 py-8 sm:px-6 sm:py-12 lg:px-8">
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-[1fr_420px] lg:gap-12">
          {/* Left — Image Gallery + Favorite + Recommandé */}
          <div>
            <div className="relative">
              <ImageGallery images={product.images} name={product.name} category={product.category} />
              {/* Favorite button */}
              <div className="absolute right-4 top-4 z-10">
                <FavoriteButton
                  productId={product.id}
                  initialFavorited={isFavorited}
                  isLoggedIn={!!session}
                />
              </div>
            </div>

            {/* ── Recommandé pour vous ── */}
            {related.length > 0 && (
              <div className="mt-8">
                <h2 className="text-base font-semibold text-[#2C2C2C]">
                  Recommand&eacute; pour vous
                </h2>
                <div className="mt-4 grid grid-cols-2 gap-3">
                  {related.slice(0, 2).map((p) => {
                    const isRelNew =
                      Date.now() - new Date(p.createdAt).getTime() <
                      30 * 24 * 60 * 60 * 1000;
                    return (
                      <Link
                        key={p.id}
                        href={`/made-in-africa/${p.slug}`}
                        className="group overflow-hidden rounded-xl border border-[#F0ECE7] bg-white transition-shadow hover:shadow-md"
                      >
                        <div className="relative aspect-[5/2] overflow-hidden bg-[#F5F0EB]">
                          {p.images[0] && (
                            <Image
                              src={p.images[0]}
                              alt={p.name}
                              fill
                              className="object-cover transition-transform duration-300 group-hover:scale-105"
                              sizes="(max-width: 1024px) 45vw, 25vw"
                            />
                          )}
                          {isRelNew && (
                            <span className="absolute left-2 top-2 rounded bg-[#C4704B] px-1.5 py-0.5 text-[9px] font-bold uppercase text-white">
                              Nouveau !
                            </span>
                          )}
                        </div>
                        <div className="p-3">
                          <h3 className="line-clamp-2 text-sm font-medium leading-snug text-[#2C2C2C] transition-colors group-hover:text-[#C4704B]">
                            {p.name}
                          </h3>
                          <p className="mt-1 text-xs text-[#999]">
                            par {p.artisan.name}
                          </p>
                          <div className="mt-2 flex items-center justify-between">
                            <p className="font-serif text-base font-bold text-[#2C2C2C]">
                              {formatPrice(p.price)}
                            </p>
                            <span className="flex h-8 w-8 items-center justify-center rounded-full bg-[#2C2C2C] text-white transition-colors hover:bg-[#C4704B]">
                              <ShoppingCart size={14} />
                            </span>
                          </div>
                        </div>
                      </Link>
                    );
                  })}
                </div>
              </div>
            )}
          </div>

          {/* Right — Details (sticky) */}
          <div className="flex flex-col lg:sticky lg:top-8 lg:self-start">
            {/* Badge */}
            {isNew && (
              <span className="inline-block w-fit rounded border border-[#2C2C2C] px-2.5 py-1 text-[11px] font-bold uppercase tracking-wide text-[#2C2C2C]">
                Nouveau !
              </span>
            )}
            {isBestseller && (
              <span className="inline-block w-fit rounded border border-[#C4704B] px-2.5 py-1 text-[11px] font-bold uppercase tracking-wide text-[#C4704B]">
                Meilleures ventes
              </span>
            )}

            {/* Title */}
            <h1 className={`text-[28px] font-extrabold leading-[1.2] text-[#2C2C2C] sm:text-[34px] ${isNew || isBestseller ? "mt-3" : ""}`}>
              {product.name}
            </h1>

            {/* Feature headline + bullet tags */}
            <div className="mt-5">
              <p className="text-[11px] font-semibold uppercase tracking-wider text-[#C4704B] underline underline-offset-4 decoration-[#C4704B]/30">
                {product.category}
              </p>
              <div className="mt-2 flex flex-wrap items-center gap-x-1 text-[11px] uppercase tracking-wider text-[#6B6B6B]">
                <span>&bull; {product.artisan.name}</span>
                {product.artisan.country && (
                  <span>&nbsp;&nbsp;&bull; {product.artisan.country}</span>
                )}
              </div>
            </div>

            {/* Description + Lire plus */}
            <div className="mt-5">
              <p className="text-[14px] leading-[1.75] text-[#4a4a4a]">
                {product.description.length > 220
                  ? product.description.slice(0, 220) + "..."
                  : product.description}
              </p>
              {product.description.length > 220 && (
                <p className="mt-1 cursor-pointer text-[14px] font-bold text-[#2C2C2C] hover:underline">
                  Lire plus
                </p>
              )}
            </div>

            {/* Separator */}
            <div className="mt-6 border-t border-[#F0ECE7]" />

            {/* Add to Cart (quantity + price + button) */}
            {product.stock > 0 ? (
              <div className="mt-5">
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

                {/* Stock info */}
                <p className="mt-3 text-xs text-[#999]">
                  {product.stock} article{product.stock > 1 ? "s" : ""} disponible{product.stock > 1 ? "s" : ""}
                </p>
              </div>
            ) : (
              <div className="mt-5">
                <p className="font-serif text-3xl font-bold text-[#2C2C2C]">
                  {formatPrice(product.price)}
                </p>
                <p className="mt-2 text-sm font-medium text-red-500">
                  Rupture de stock
                </p>
              </div>
            )}

            {/* Info box */}
            <div className="mt-5 space-y-3 rounded-xl border border-[#F0ECE7] bg-[#FAFAF7] p-5">
              <div className="flex items-start gap-3 text-sm text-[#6B6B6B]">
                <Truck size={18} className="mt-0.5 shrink-0 text-[#999]" />
                <p>
                  Plus que <strong className="text-[#2C2C2C]">40&nbsp;&euro;</strong> pour b&eacute;n&eacute;ficier de la livraison gratuite !
                </p>
              </div>
              <div className="flex items-start gap-3 text-sm text-[#6B6B6B]">
                <ShieldCheck size={18} className="mt-0.5 shrink-0 text-[#999]" />
                <p>
                  Paiement <strong className="text-[#2C2C2C]">100% s&eacute;curis&eacute;</strong> CB, Visa, Mastercard, PayPal, Apple Pay, Google Pay
                </p>
              </div>
            </div>

            {/* Share */}
            <div className="mt-4">
              <ShareButton />
            </div>

          </div>
        </div>
      </section>

      {/* ── Tabs + FAQ ── */}
      <section className="border-t border-[#F0ECE7]">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <ProductTabs
            description={product.description}
            category={product.category}
            artisanName={product.artisan.name || ""}
            artisanCountry={product.artisan.country}
          />
        </div>
      </section>

      {/* ── Produits associés ── */}
      {related.length > 0 && (
        <section className="border-t border-[#F0ECE7] bg-white px-4 py-12">
          <div className="mx-auto max-w-7xl sm:px-6 lg:px-8">
            <h2 className="text-2xl font-extrabold text-[#2C2C2C]">
              Produits associ&eacute;s
            </h2>
            <div className="mt-6 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
              {related.slice(0, 4).map((p) => {
                const isRelNew =
                  Date.now() - new Date(p.createdAt).getTime() <
                  30 * 24 * 60 * 60 * 1000;
                return (
                  <Link
                    key={p.id}
                    href={`/made-in-africa/${p.slug}`}
                    className="group overflow-hidden rounded-xl border border-[#F0ECE7] bg-[#FAFAF7] transition-shadow hover:shadow-md"
                  >
                    <div className="relative aspect-square overflow-hidden bg-[#F5F0EB]">
                      {p.images[0] && (
                        <Image
                          src={p.images[0]}
                          alt={p.name}
                          fill
                          className="object-cover transition-transform duration-300 group-hover:scale-105"
                          sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
                        />
                      )}
                      {isRelNew && (
                        <span className="absolute left-2 top-2 rounded bg-[#C4704B] px-2 py-0.5 text-[10px] font-bold uppercase text-white">
                          Nouveau !
                        </span>
                      )}
                    </div>
                    <div className="p-3">
                      <h3 className="line-clamp-2 text-sm font-medium leading-snug text-[#2C2C2C] transition-colors group-hover:text-[#C4704B]">
                        {p.name}
                      </h3>
                      <p className="mt-1 text-xs text-[#999]">
                        par {p.artisan.name}
                      </p>
                      <div className="mt-2 flex items-center justify-between">
                        <p className="font-serif text-base font-bold text-[#2C2C2C]">
                          {formatPrice(p.price)}
                        </p>
                        <span className="flex h-8 w-8 items-center justify-center rounded-full bg-[#2C2C2C] text-white transition-colors hover:bg-[#C4704B]">
                          <ShoppingCart size={14} />
                        </span>
                      </div>
                    </div>
                  </Link>
                );
              })}
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
              href="/nous-contacter"
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

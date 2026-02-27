import { notFound } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, User } from "lucide-react";
import { prisma } from "@/lib/db";
import { auth } from "@/lib/auth";
import { formatPrice } from "@/lib/utils";
import AddToCartButton from "./AddToCartButton";
import FavoriteButton from "./FavoriteButton";

export const dynamic = "force-dynamic";

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const product = await prisma.product.findUnique({ where: { slug } });
  if (!product) return { title: "Produit introuvable" };
  return { title: product.name, description: product.description.slice(0, 160) };
}

export default async function ProductDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const session = await auth();

  const product = await prisma.product.findUnique({
    where: { slug },
    include: { artisan: { select: { id: true, name: true, country: true, bio: true } } },
  });

  if (!product || !product.published) notFound();

  let isFavorited = false;
  if (session?.user?.id) {
    const fav = await prisma.favorite.findUnique({
      where: { userId_productId: { userId: session.user.id, productId: product.id } },
    });
    isFavorited = !!fav;
  }

  // Related products
  const related = await prisma.product.findMany({
    where: { category: product.category, published: true, id: { not: product.id } },
    take: 4,
    include: { artisan: { select: { name: true } } },
  });

  return (
    <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
      <Link
        href="/marketplace"
        className="mb-6 inline-flex items-center gap-1.5 text-sm text-dta-taupe hover:text-dta-accent"
      >
        <ArrowLeft size={14} />
        Retour à la marketplace
      </Link>

      <div className="grid grid-cols-1 gap-10 lg:grid-cols-2">
        {/* Images */}
        <div className="aspect-square rounded-[var(--radius-card)] bg-gradient-to-br from-dta-sand to-dta-beige" />

        {/* Details */}
        <div>
          <div className="flex items-start justify-between">
            <div>
              <span className="rounded-[var(--radius-full)] bg-dta-beige px-3 py-1 text-xs font-medium text-dta-char">
                {product.category}
              </span>
              <h1 className="mt-3 font-serif text-3xl font-bold text-dta-dark sm:text-4xl">
                {product.name}
              </h1>
            </div>
            <FavoriteButton
              productId={product.id}
              initialFavorited={isFavorited}
              isLoggedIn={!!session}
            />
          </div>

          <p className="mt-4 font-serif text-3xl font-bold text-dta-accent">
            {formatPrice(product.price)}
          </p>

          <div className="mt-6 whitespace-pre-line text-sm leading-relaxed text-dta-char/80">
            {product.description}
          </div>

          <div className="mt-6 flex items-center gap-3 text-sm text-dta-taupe">
            <span>Origine : {product.country}</span>
            <span>&middot;</span>
            <span>
              {product.stock > 0
                ? `${product.stock} en stock`
                : "Rupture de stock"}
            </span>
          </div>

          {/* Add to cart */}
          {product.stock > 0 && (
            <div className="mt-8">
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
            </div>
          )}

          {/* Artisan */}
          <div className="mt-8 rounded-[var(--radius-card)] bg-dta-beige p-5">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-dta-accent/10 text-dta-accent">
                <User size={18} />
              </div>
              <div>
                <p className="font-medium text-dta-dark">{product.artisan.name}</p>
                <p className="text-xs text-dta-taupe">{product.artisan.country}</p>
              </div>
            </div>
            {product.artisan.bio && (
              <p className="mt-3 text-sm text-dta-char/70">{product.artisan.bio}</p>
            )}
          </div>
        </div>
      </div>

      {/* Related products */}
      {related.length > 0 && (
        <section className="mt-16">
          <h2 className="mb-6 font-serif text-2xl font-bold text-dta-dark">
            Vous aimerez aussi
          </h2>
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
            {related.map((p) => (
              <Link
                key={p.id}
                href={`/marketplace/${p.slug}`}
                className="group rounded-[var(--radius-card)] bg-white shadow-[var(--shadow-card)] transition-all duration-200 hover:shadow-[var(--shadow-card-hover)] hover:-translate-y-1"
              >
                <div className="aspect-square rounded-t-[var(--radius-card)] bg-gradient-to-br from-dta-sand to-dta-beige" />
                <div className="p-3">
                  <h3 className="truncate text-sm font-medium text-dta-dark group-hover:text-dta-accent">
                    {p.name}
                  </h3>
                  <p className="mt-1 font-serif text-base font-bold text-dta-accent">
                    {formatPrice(p.price)}
                  </p>
                </div>
              </Link>
            ))}
          </div>
        </section>
      )}
    </div>
  );
}

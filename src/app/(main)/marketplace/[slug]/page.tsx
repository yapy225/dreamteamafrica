import { notFound } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, MapPin, Tag, Package, ArrowRight } from "lucide-react";
import { prisma } from "@/lib/db";
import { auth } from "@/lib/auth";
import { formatPrice } from "@/lib/utils";
import AddToCartButton from "./AddToCartButton";
import FavoriteButton from "./FavoriteButton";
import ShareButton from "./ShareButton";

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

  const related = await prisma.product.findMany({
    where: { category: product.category, published: true, id: { not: product.id } },
    take: 4,
    include: { artisan: { select: { name: true, country: true } } },
  });

  const initials = (product.artisan.name || "A")
    .split(" ")
    .map((w) => w[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);

  return (
    <>
      {/* ── A. Sticky Nav ── */}
      <nav className="sticky top-0 z-40 border-b border-dta-sand/50 bg-white/80 backdrop-blur-md">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3 sm:px-6 lg:px-8">
          <Link
            href="/marketplace"
            className="flex items-center gap-1.5 text-sm font-medium text-dta-char transition-colors hover:text-dta-accent"
          >
            <ArrowLeft size={16} />
            Retour à la marketplace
          </Link>
          <div className="flex items-center gap-1">
            <ShareButton />
            <FavoriteButton
              productId={product.id}
              initialFavorited={isFavorited}
              isLoggedIn={!!session}
            />
          </div>
        </div>
      </nav>

      {/* ── B. Product Hero ── */}
      <section className="px-4 py-10 sm:py-16">
        <div className="mx-auto grid max-w-7xl grid-cols-1 gap-10 sm:px-6 lg:grid-cols-5 lg:gap-14 lg:px-8">
          {/* Image */}
          <div className="lg:col-span-3">
            <div className="aspect-square overflow-hidden rounded-2xl bg-gradient-to-br from-dta-sand to-dta-beige" />
          </div>

          {/* Details */}
          <div className="flex flex-col justify-center lg:col-span-2">
            <span className="inline-block w-fit rounded-[var(--radius-full)] bg-dta-beige px-3 py-1 text-xs font-medium text-dta-char">
              {product.category}
            </span>

            <h1 className="mt-4 font-serif text-3xl font-bold leading-tight text-dta-dark sm:text-4xl">
              {product.name}
            </h1>

            <p className="mt-4 font-serif text-3xl font-bold text-dta-accent">
              {formatPrice(product.price)}
            </p>

            {/* Stock status */}
            <div className="mt-4">
              {product.stock > 0 ? (
                <span className="inline-flex items-center gap-1.5 text-sm font-medium text-green-700">
                  <span className="h-2 w-2 rounded-full bg-green-500" />
                  En stock ({product.stock} disponible{product.stock > 1 ? "s" : ""})
                </span>
              ) : (
                <span className="inline-flex items-center gap-1.5 text-sm font-medium text-red-600">
                  <span className="h-2 w-2 rounded-full bg-red-500" />
                  Rupture de stock
                </span>
              )}
            </div>

            <div className="my-6 h-px bg-dta-sand/60" />

            <div className="whitespace-pre-line text-sm leading-relaxed text-dta-char/80">
              {product.description}
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
          </div>
        </div>
      </section>

      {/* ── C. Artisan Section ── */}
      <section className="bg-dta-beige px-4 py-16">
        <div className="mx-auto max-w-7xl sm:px-6 lg:px-8">
          <h2 className="font-serif text-2xl font-bold text-dta-dark">
            L&apos;artisan
          </h2>

          <div className="mt-6 rounded-[var(--radius-card)] bg-white p-6 shadow-[var(--shadow-card)] sm:p-8">
            <div className="flex items-center gap-4">
              <div className="flex h-14 w-14 flex-shrink-0 items-center justify-center rounded-full bg-dta-accent text-lg font-bold text-white">
                {initials}
              </div>
              <div>
                <p className="font-serif text-xl font-bold text-dta-dark">
                  {product.artisan.name}
                </p>
                <p className="flex items-center gap-1 text-sm text-dta-taupe">
                  <MapPin size={13} />
                  {product.artisan.country}
                </p>
              </div>
            </div>
            {product.artisan.bio && (
              <p className="mt-4 text-sm leading-relaxed text-dta-char/70">
                {product.artisan.bio}
              </p>
            )}
            <Link
              href={`/marketplace?country=${encodeURIComponent(product.artisan.country || "")}`}
              className="mt-5 inline-flex items-center gap-1 text-sm font-medium text-dta-accent transition-colors hover:text-dta-accent-dark"
            >
              Voir tous ses produits <ArrowRight size={14} />
            </Link>
          </div>
        </div>
      </section>

      {/* ── D. Product Details Strip ── */}
      <section className="px-4 py-12">
        <div className="mx-auto max-w-7xl sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
            <div className="flex items-center gap-4 rounded-[var(--radius-card)] bg-white p-5 shadow-[var(--shadow-card)]">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-dta-accent/10 text-dta-accent">
                <Tag size={20} />
              </div>
              <div>
                <p className="text-xs uppercase tracking-wider text-dta-taupe">Catégorie</p>
                <p className="font-medium text-dta-dark">{product.category}</p>
              </div>
            </div>
            <div className="flex items-center gap-4 rounded-[var(--radius-card)] bg-white p-5 shadow-[var(--shadow-card)]">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-dta-accent/10 text-dta-accent">
                <MapPin size={20} />
              </div>
              <div>
                <p className="text-xs uppercase tracking-wider text-dta-taupe">Origine</p>
                <p className="font-medium text-dta-dark">{product.country}</p>
              </div>
            </div>
            <div className="flex items-center gap-4 rounded-[var(--radius-card)] bg-white p-5 shadow-[var(--shadow-card)]">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-dta-accent/10 text-dta-accent">
                <Package size={20} />
              </div>
              <div>
                <p className="text-xs uppercase tracking-wider text-dta-taupe">Stock</p>
                <p className="font-medium text-dta-dark">
                  {product.stock > 0
                    ? `${product.stock} disponible${product.stock > 1 ? "s" : ""}`
                    : "Rupture de stock"}
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── E. Related Products ── */}
      {related.length > 0 && (
        <section className="bg-dta-beige px-4 py-16">
          <div className="mx-auto max-w-7xl sm:px-6 lg:px-8">
            <div className="flex items-end justify-between">
              <h2 className="font-serif text-2xl font-bold text-dta-dark sm:text-3xl">
                Vous aimerez aussi
              </h2>
              <Link
                href="/marketplace"
                className="hidden items-center gap-1 text-sm font-medium text-dta-accent transition-colors hover:text-dta-accent-dark sm:flex"
              >
                Tout voir <ArrowRight size={14} />
              </Link>
            </div>

            <div className="mt-8 grid grid-cols-2 gap-4 sm:gap-6 lg:grid-cols-4">
              {related.map((p) => (
                <Link
                  key={p.id}
                  href={`/marketplace/${p.slug}`}
                  className="group rounded-[var(--radius-card)] bg-white shadow-[var(--shadow-card)] transition-all duration-300 hover:shadow-[var(--shadow-card-hover)] hover:-translate-y-1"
                >
                  <div className="aspect-square rounded-t-[var(--radius-card)] bg-gradient-to-br from-dta-sand to-dta-beige" />
                  <div className="p-4">
                    <h3 className="truncate font-serif text-sm font-semibold text-dta-dark transition-colors group-hover:text-dta-accent">
                      {p.name}
                    </h3>
                    <p className="mt-1 text-xs text-dta-taupe">
                      par {p.artisan.name} — {p.artisan.country}
                    </p>
                    <p className="mt-2 font-serif text-base font-bold text-dta-accent">
                      {formatPrice(p.price)}
                    </p>
                  </div>
                </Link>
              ))}
            </div>

            <div className="mt-6 text-center sm:hidden">
              <Link
                href="/marketplace"
                className="text-sm font-medium text-dta-accent"
              >
                Voir toute la marketplace &rarr;
              </Link>
            </div>
          </div>
        </section>
      )}

      {/* ── F. Footer CTA ── */}
      <section className="px-4 py-12">
        <div className="mx-auto max-w-7xl text-center sm:px-6 lg:px-8">
          <p className="text-sm text-dta-char/60">
            Des questions ?{" "}
            <Link href="/contact" className="font-medium text-dta-accent hover:text-dta-accent-dark">
              Contactez-nous
            </Link>
          </p>
          <Link
            href="/marketplace"
            className="mt-3 inline-flex items-center gap-1.5 text-sm font-medium text-dta-taupe transition-colors hover:text-dta-accent"
          >
            <ArrowLeft size={14} />
            Retour à la marketplace
          </Link>
        </div>
      </section>
    </>
  );
}

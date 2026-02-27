import { redirect } from "next/navigation";
import Link from "next/link";
import { Plus, Pencil, Trash2, Eye, EyeOff, Package } from "lucide-react";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { formatPrice } from "@/lib/utils";
import DeleteProductButton from "./DeleteProductButton";

export const dynamic = "force-dynamic";
export const metadata = { title: "Mes produits" };

export default async function ArtisanProductsPage() {
  const session = await auth();
  if (!session) redirect("/auth/signin");
  if (session.user.role !== "ARTISAN" && session.user.role !== "ADMIN") {
    redirect("/dashboard");
  }

  const products = await prisma.product.findMany({
    where: { artisanId: session.user.id },
    orderBy: { createdAt: "desc" },
    include: { _count: { select: { orderItems: true, favorites: true } } },
  });

  return (
    <div className="mx-auto max-w-5xl px-4 py-12 sm:px-6 lg:px-8">
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="font-serif text-3xl font-bold text-dta-dark">Mes produits</h1>
          <p className="mt-1 text-sm text-dta-char/70">{products.length} produit{products.length !== 1 ? "s" : ""}</p>
        </div>
        <Link
          href="/dashboard/products/new"
          className="flex items-center gap-2 rounded-[var(--radius-button)] bg-dta-accent px-5 py-2.5 text-sm font-semibold text-white hover:bg-dta-accent-dark"
        >
          <Plus size={16} />
          Ajouter
        </Link>
      </div>

      {products.length === 0 ? (
        <div className="rounded-[var(--radius-card)] bg-white p-12 text-center shadow-[var(--shadow-card)]">
          <Package size={48} className="mx-auto text-dta-taupe" />
          <h2 className="mt-4 font-serif text-xl font-bold text-dta-dark">Aucun produit</h2>
          <p className="mt-2 text-sm text-dta-char/70">Commencez par ajouter votre première création.</p>
          <Link
            href="/dashboard/products/new"
            className="mt-6 inline-flex items-center gap-2 rounded-[var(--radius-button)] bg-dta-accent px-6 py-3 text-sm font-semibold text-white hover:bg-dta-accent-dark"
          >
            <Plus size={16} />
            Créer un produit
          </Link>
        </div>
      ) : (
        <div className="space-y-3">
          {products.map((product) => (
            <div
              key={product.id}
              className="flex items-center gap-4 rounded-[var(--radius-card)] bg-white p-4 shadow-[var(--shadow-card)]"
            >
              {/* Thumbnail */}
              <div className="h-16 w-16 flex-shrink-0 rounded-[var(--radius-input)] bg-gradient-to-br from-dta-sand to-dta-beige" />

              {/* Info */}
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <h3 className="truncate font-serif text-base font-semibold text-dta-dark">
                    {product.name}
                  </h3>
                  {!product.published && (
                    <span className="flex items-center gap-1 rounded-[var(--radius-full)] bg-amber-100 px-2 py-0.5 text-xs text-amber-700">
                      <EyeOff size={10} />
                      Masqué
                    </span>
                  )}
                </div>
                <div className="mt-1 flex items-center gap-3 text-xs text-dta-taupe">
                  <span>{product.category}</span>
                  <span>&middot;</span>
                  <span>{product.stock} en stock</span>
                  <span>&middot;</span>
                  <span>{product._count.orderItems} vente{product._count.orderItems !== 1 ? "s" : ""}</span>
                  <span>&middot;</span>
                  <span>{product._count.favorites} favori{product._count.favorites !== 1 ? "s" : ""}</span>
                </div>
              </div>

              {/* Price */}
              <span className="flex-shrink-0 font-serif text-lg font-bold text-dta-accent">
                {formatPrice(product.price)}
              </span>

              {/* Actions */}
              <div className="flex flex-shrink-0 items-center gap-1">
                <Link
                  href={`/marketplace/${product.slug}`}
                  className="rounded-[var(--radius-button)] p-2 text-dta-taupe hover:bg-dta-beige hover:text-dta-dark"
                  title="Voir"
                >
                  <Eye size={16} />
                </Link>
                <Link
                  href={`/dashboard/products/${product.id}/edit`}
                  className="rounded-[var(--radius-button)] p-2 text-dta-taupe hover:bg-dta-beige hover:text-dta-dark"
                  title="Modifier"
                >
                  <Pencil size={16} />
                </Link>
                <DeleteProductButton productId={product.id} productName={product.name} />
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

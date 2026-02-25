import { redirect } from "next/navigation";
import Link from "next/link";
import { Heart } from "lucide-react";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { formatPrice } from "@/lib/utils";

export const dynamic = "force-dynamic";
export const metadata = { title: "Mes favoris" };

export default async function FavoritesPage() {
  const session = await auth();
  if (!session) redirect("/auth/signin");

  const favorites = await prisma.favorite.findMany({
    where: { userId: session.user.id },
    include: {
      product: {
        include: { artisan: { select: { name: true } } },
      },
    },
    orderBy: { createdAt: "desc" },
  });

  return (
    <div className="mx-auto max-w-5xl px-4 py-12 sm:px-6 lg:px-8">
      <h1 className="mb-8 font-serif text-3xl font-bold text-dta-dark">
        Mes favoris ({favorites.length})
      </h1>

      {favorites.length === 0 ? (
        <div className="rounded-[var(--radius-card)] bg-white p-12 text-center shadow-[var(--shadow-card)]">
          <Heart size={48} className="mx-auto text-dta-taupe" />
          <h2 className="mt-4 font-serif text-xl font-bold text-dta-dark">Aucun favori</h2>
          <p className="mt-2 text-sm text-dta-char/70">
            Parcourez la marketplace et sauvegardez vos coups de c&oelig;ur.
          </p>
          <Link
            href="/marketplace"
            className="mt-6 inline-flex items-center rounded-[var(--radius-button)] bg-dta-accent px-6 py-3 text-sm font-semibold text-white hover:bg-dta-accent-dark"
          >
            Explorer la marketplace
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {favorites.map((fav) => (
            <Link
              key={fav.id}
              href={`/marketplace/${fav.product.slug}`}
              className="group rounded-[var(--radius-card)] bg-white shadow-[var(--shadow-card)] transition-all duration-300 hover:shadow-[var(--shadow-card-hover)] hover:-translate-y-1"
            >
              <div className="aspect-square rounded-t-[var(--radius-card)] bg-gradient-to-br from-dta-sand to-dta-beige" />
              <div className="p-4">
                <h3 className="font-serif text-base font-semibold text-dta-dark group-hover:text-dta-accent transition-colors">
                  {fav.product.name}
                </h3>
                <p className="mt-1 text-xs text-dta-taupe">par {fav.product.artisan.name}</p>
                <span className="mt-2 block font-serif text-lg font-bold text-dta-accent">
                  {formatPrice(fav.product.price)}
                </span>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}

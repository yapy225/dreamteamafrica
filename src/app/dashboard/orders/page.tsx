import { redirect } from "next/navigation";
import Link from "next/link";
import { Package } from "lucide-react";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { formatPrice, formatDate } from "@/lib/utils";

export const dynamic = "force-dynamic";
export const metadata = { title: "Mes commandes" };

const statusLabels: Record<string, string> = {
  PENDING: "En attente",
  PAID: "Payée",
  SHIPPED: "Expédiée",
  DELIVERED: "Livrée",
  CANCELLED: "Annulée",
};

const statusColors: Record<string, string> = {
  PENDING: "bg-amber-100 text-amber-700",
  PAID: "bg-blue-100 text-blue-700",
  SHIPPED: "bg-purple-100 text-purple-700",
  DELIVERED: "bg-green-100 text-green-700",
  CANCELLED: "bg-red-100 text-red-700",
};

export default async function OrdersPage() {
  const session = await auth();
  if (!session) redirect("/auth/signin");

  const orders = await prisma.order.findMany({
    where: { userId: session.user.id },
    include: {
      items: {
        include: { product: { select: { name: true, slug: true, images: true } } },
      },
    },
    orderBy: { createdAt: "desc" },
  });

  return (
    <div className="mx-auto max-w-4xl px-4 py-12 sm:px-6 lg:px-8">
      <h1 className="mb-8 font-serif text-3xl font-bold text-dta-dark">
        Mes commandes ({orders.length})
      </h1>

      {orders.length === 0 ? (
        <div className="rounded-[var(--radius-card)] bg-white p-12 text-center shadow-[var(--shadow-card)]">
          <Package size={48} className="mx-auto text-dta-taupe" />
          <h2 className="mt-4 font-serif text-xl font-bold text-dta-dark">Aucune commande</h2>
          <p className="mt-2 text-sm text-dta-char/70">
            Vos commandes de la marketplace apparaîtront ici.
          </p>
          <Link
            href="/marketplace"
            className="mt-6 inline-flex items-center rounded-[var(--radius-button)] bg-dta-accent px-6 py-3 text-sm font-semibold text-white hover:bg-dta-accent-dark"
          >
            Explorer la marketplace
          </Link>
        </div>
      ) : (
        <div className="space-y-4">
          {orders.map((order) => (
            <div
              key={order.id}
              className="rounded-[var(--radius-card)] bg-white p-6 shadow-[var(--shadow-card)]"
            >
              <div className="flex flex-wrap items-center justify-between gap-2">
                <div className="flex items-center gap-3">
                  <span className="font-mono text-xs text-dta-taupe">
                    #{order.id.slice(0, 8).toUpperCase()}
                  </span>
                  <span
                    className={`rounded-[var(--radius-full)] px-2.5 py-0.5 text-xs font-semibold ${statusColors[order.status] || ""}`}
                  >
                    {statusLabels[order.status]}
                  </span>
                </div>
                <div className="text-right">
                  <span className="font-serif text-lg font-bold text-dta-dark">
                    {formatPrice(order.total)}
                  </span>
                  <p className="text-xs text-dta-taupe">{formatDate(order.createdAt)}</p>
                </div>
              </div>

              <div className="mt-4 divide-y divide-dta-sand/50">
                {order.items.map((item) => (
                  <div key={item.id} className="flex items-center gap-3 py-3">
                    <div className="h-12 w-12 flex-shrink-0 rounded-[var(--radius-input)] bg-gradient-to-br from-dta-sand to-dta-beige" />
                    <div className="flex-1 min-w-0">
                      <Link
                        href={`/marketplace/${item.product.slug}`}
                        className="truncate text-sm font-medium text-dta-dark hover:text-dta-accent"
                      >
                        {item.product.name}
                      </Link>
                      <p className="text-xs text-dta-taupe">Qté : {item.quantity}</p>
                    </div>
                    <span className="text-sm font-medium text-dta-char">
                      {formatPrice(item.price * item.quantity)}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

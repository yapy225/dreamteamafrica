import { redirect } from "next/navigation";
import Link from "next/link";
import { Ticket, ShoppingBag, Newspaper, Megaphone } from "lucide-react";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/db";

export const dynamic = "force-dynamic";

export default async function DashboardPage() {
  const session = await auth();

  if (!session) {
    redirect("/auth/signin");
  }

  const [ticketCount, orderCount] = await Promise.all([
    prisma.ticket.count({ where: { userId: session.user.id } }),
    prisma.order.count({ where: { userId: session.user.id } }),
  ]);

  const quickLinks = [
    {
      href: "/dashboard/tickets",
      icon: Ticket,
      label: "Mes billets",
      count: ticketCount,
      color: "bg-blue-100 text-blue-600",
    },
    {
      href: "/dashboard/orders",
      icon: ShoppingBag,
      label: "Mes commandes",
      count: orderCount,
      color: "bg-green-100 text-green-600",
    },
    ...(session.user.role === "ARTISAN" || session.user.role === "ADMIN"
      ? [
          {
            href: "/dashboard/products",
            icon: ShoppingBag,
            label: "Mes produits",
            count: null,
            color: "bg-purple-100 text-purple-600",
          },
          {
            href: "/dashboard/articles",
            icon: Newspaper,
            label: "Mes articles",
            count: null,
            color: "bg-amber-100 text-amber-600",
          },
        ]
      : []),
    {
      href: "/dashboard/ads",
      icon: Megaphone,
      label: "DTA Ads",
      count: null,
      color: "bg-red-100 text-red-600",
    },
  ];

  return (
    <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
      <div className="mb-8">
        <h1 className="font-serif text-3xl font-bold text-dta-dark">
          Bienvenue, {session.user?.name?.split(" ")[0]}
        </h1>
        <p className="mt-2 text-dta-char/70">
          Votre espace personnel Dream Team Africa
        </p>
      </div>

      {/* Info cards */}
      <div className="mb-10 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
        <div className="rounded-[var(--radius-card)] bg-white p-6 shadow-[var(--shadow-card)]">
          <h3 className="text-sm font-medium text-dta-taupe">Rôle</h3>
          <p className="mt-1 font-serif text-2xl font-bold text-dta-dark">
            {session.user?.role === "ADMIN"
              ? "Administrateur"
              : session.user?.role === "ARTISAN"
                ? "Artisan"
                : "Membre"}
          </p>
        </div>

        <div className="rounded-[var(--radius-card)] bg-white p-6 shadow-[var(--shadow-card)]">
          <h3 className="text-sm font-medium text-dta-taupe">Email</h3>
          <p className="mt-1 text-lg font-medium text-dta-dark">
            {session.user?.email}
          </p>
        </div>

        <div className="rounded-[var(--radius-card)] bg-white p-6 shadow-[var(--shadow-card)]">
          <h3 className="text-sm font-medium text-dta-taupe">Statut</h3>
          <p className="mt-1 font-serif text-2xl font-bold text-green-600">
            Actif
          </p>
        </div>
      </div>

      {/* Quick links */}
      <h2 className="mb-4 font-serif text-xl font-bold text-dta-dark">Accès rapide</h2>
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {quickLinks.map((link) => (
          <Link
            key={link.href}
            href={link.href}
            className="group flex items-center gap-4 rounded-[var(--radius-card)] bg-white p-5 shadow-[var(--shadow-card)] transition-all duration-200 hover:shadow-[var(--shadow-card-hover)] hover:-translate-y-0.5"
          >
            <div className={`rounded-[var(--radius-button)] p-3 ${link.color}`}>
              <link.icon size={20} />
            </div>
            <div>
              <p className="font-medium text-dta-dark group-hover:text-dta-accent transition-colors">
                {link.label}
              </p>
              {link.count !== null && (
                <p className="text-sm text-dta-taupe">{link.count} élément{link.count !== 1 ? "s" : ""}</p>
              )}
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}

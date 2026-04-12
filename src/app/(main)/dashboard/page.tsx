import { redirect } from "next/navigation";
import Link from "next/link";
import { Ticket, ShoppingBag, Newspaper, CalendarDays, BookOpen, Rss, Bot, Search, Store, ClipboardList, Mail, ScanLine, MessageSquare, Inbox, MessageCircle, FileImage, Sparkles, FileText, Calculator, ShieldCheck, Wallet, QrCode, Gift } from "lucide-react";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { getRevenueData } from "@/lib/revenue";
import { RevenueSection } from "@/components/dashboard/revenue/RevenueSection";

export const dynamic = "force-dynamic";

export default async function DashboardPage() {
  const session = await auth();

  if (!session) {
    redirect("/auth/signin");
  }

  const isAdmin = session.user.role === "ADMIN";

  const [ticketCount, orderCount, revenueData, exhibitorBooking, unreadWhatsApp, unreadContacts, unreadEmails, ntbcUser, cptUnpaidCount] = await Promise.all([
    prisma.ticket.count({ where: { userId: session.user.id } }),
    prisma.order.count({ where: { userId: session.user.id } }),
    isAdmin ? getRevenueData() : null,
    prisma.exhibitorBooking.findFirst({
      where: { userId: session.user.id, status: { in: ["PARTIAL", "CONFIRMED"] } },
      select: { id: true },
    }),
    isAdmin ? prisma.whatsAppMessage.count({ where: { read: false, direction: "inbound" } }) : 0,
    isAdmin ? prisma.contactMessage.count({ where: { read: false } }) : 0,
    isAdmin ? prisma.email.count({ where: { isRead: false, isArchived: false, folder: "INBOX" } }) : 0,
    prisma.user.findUnique({ where: { id: session.user.id }, select: { soldeNtbc: true, soldeBonus: true, tier: true } }),
    isAdmin
      ? prisma.ticket.count({
          where: {
            payments: { some: { type: "cpt_deposit" } },
            totalPaid: { lt: prisma.ticket.fields.price },
          },
        })
      : 0,
  ]);

  const soldeTotal = (ntbcUser?.soldeNtbc || 0) + (ntbcUser?.soldeBonus || 0);

  const quickLinks = [
    {
      href: "/dashboard/wallet",
      icon: Wallet,
      label: `Mon wallet — ${soldeTotal} NTBC`,
      count: null,
      color: "bg-amber-100 text-amber-600",
    },
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
    ...(exhibitorBooking || session.user.role === "EXPOSANT" || session.user.role === "ADMIN"
      ? [
          {
            href: "/dashboard/mon-stand",
            icon: FileImage,
            label: "Mon espace exposant",
            count: null,
            color: "bg-amber-100 text-amber-600",
          },
        ]
      : []),
    ...(session.user.role === "ADMIN"
      ? [
          {
            href: "/dashboard/cpt",
            icon: Gift,
            label: "Culture pour Tous",
            count: cptUnpaidCount || null,
            color: "bg-emerald-100 text-emerald-600",
          },
          {
            href: "/dashboard/events",
            icon: CalendarDays,
            label: "Gestion événements",
            count: null,
            color: "bg-teal-100 text-teal-600",
          },
          {
            href: "/dashboard/officiel-afrique",
            icon: BookOpen,
            label: "Officiel d'Afrique",
            count: null,
            color: "bg-indigo-100 text-indigo-600",
          },
          {
            href: "/dashboard/rss-feeds",
            icon: Rss,
            label: "Flux RSS",
            count: null,
            color: "bg-rose-100 text-rose-600",
          },
          {
            href: "/dashboard/detected-articles",
            icon: Bot,
            label: "Articles detectes (IA)",
            count: null,
            color: "bg-violet-100 text-violet-600",
          },
          {
            href: "/dashboard/scanner",
            icon: ScanLine,
            label: "Scanner billets",
            count: null,
            color: "bg-orange-100 text-orange-600",
          },
          {
            href: "/dashboard/contrats",
            icon: FileText,
            label: "Contrats & Engagements",
            count: null,
            color: "bg-slate-100 text-slate-600",
          },
          {
            href: "/dashboard/comptabilite",
            icon: Calculator,
            label: "Comptabilité",
            count: null,
            color: "bg-cyan-100 text-cyan-600",
          },
          {
            href: "/dashboard/exposants",
            icon: Store,
            label: "Billetterie Exposants",
            count: null,
            color: "bg-emerald-100 text-emerald-600",
          },
          {
            href: "/dashboard/reservations",
            icon: ClipboardList,
            label: "Réservations gratuites",
            count: null,
            color: "bg-lime-100 text-lime-600",
          },
          {
            href: "/dashboard/whatsapp",
            icon: MessageCircle,
            label: "WhatsApp Business",
            count: unreadWhatsApp || null,
            color: "bg-green-100 text-green-600",
          },
          {
            href: "/dashboard/emails",
            icon: Inbox,
            label: "Boite mail",
            count: unreadEmails || null,
            color: "bg-yellow-100 text-yellow-600",
          },
          {
            href: "/dashboard/contacts",
            icon: Mail,
            label: "Messages de contact",
            count: unreadContacts || null,
            color: "bg-pink-100 text-pink-600",
          },
          {
            href: "/dashboard/social-drafts",
            icon: MessageSquare,
            label: "Social & Engagement",
            count: null,
            color: "bg-sky-100 text-sky-600",
          },
          {
            href: "/dashboard/seo",
            icon: Search,
            label: "Hub SEO",
            count: null,
            color: "bg-cyan-100 text-cyan-600",
          },
          {
            href: "/dashboard/security",
            icon: ShieldCheck,
            label: "Sécurité (2FA)",
            count: null,
            color: "bg-red-100 text-red-600",
          },
        ]
      : []),
  ];

  const externalLinks: typeof quickLinks = [];

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
                : session.user?.role === "EXPOSANT"
                  ? "Exposant"
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

      {/* Revenue charts (admin only) */}
      {revenueData && <RevenueSection data={revenueData} />}

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

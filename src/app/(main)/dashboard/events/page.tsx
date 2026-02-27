import { redirect } from "next/navigation";
import Link from "next/link";
import { Plus, Pencil, Trash2, Eye, EyeOff, CalendarDays } from "lucide-react";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { formatDate, formatPrice } from "@/lib/utils";
import DeleteEventButton from "./DeleteEventButton";

export const dynamic = "force-dynamic";
export const metadata = { title: "Gestion des événements" };

export default async function DashboardEventsPage() {
  const session = await auth();
  if (!session) redirect("/auth/signin");
  if (session.user.role !== "ADMIN" && session.user.role !== "ARTISAN") redirect("/dashboard");

  const events = await prisma.event.findMany({
    orderBy: { date: "desc" },
    include: { _count: { select: { tickets: true } } },
  });

  return (
    <div className="mx-auto max-w-5xl px-4 py-12 sm:px-6 lg:px-8">
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="font-serif text-3xl font-bold text-dta-dark">
            Gestion des événements
          </h1>
          <p className="mt-1 text-sm text-dta-char/70">
            {events.length} événement{events.length !== 1 ? "s" : ""}
          </p>
        </div>
        <Link
          href="/dashboard/events/new"
          className="flex items-center gap-2 rounded-[var(--radius-button)] bg-dta-accent px-5 py-2.5 text-sm font-semibold text-white hover:bg-dta-accent-dark"
        >
          <Plus size={16} />
          Créer un événement
        </Link>
      </div>

      {events.length === 0 ? (
        <div className="rounded-[var(--radius-card)] bg-white p-12 text-center shadow-[var(--shadow-card)]">
          <CalendarDays size={48} className="mx-auto text-dta-taupe" />
          <h2 className="mt-4 font-serif text-xl font-bold text-dta-dark">
            Aucun événement
          </h2>
          <p className="mt-2 text-sm text-dta-char/70">
            Commencez par créer votre premier événement.
          </p>
          <Link
            href="/dashboard/events/new"
            className="mt-6 inline-flex items-center gap-2 rounded-[var(--radius-button)] bg-dta-accent px-6 py-3 text-sm font-semibold text-white hover:bg-dta-accent-dark"
          >
            <Plus size={16} />
            Créer un événement
          </Link>
        </div>
      ) : (
        <div className="space-y-3">
          {events.map((event) => (
            <div
              key={event.id}
              className="flex items-center gap-4 rounded-[var(--radius-card)] bg-white p-4 shadow-[var(--shadow-card)]"
            >
              {/* Icon */}
              <div className="flex h-16 w-16 flex-shrink-0 items-center justify-center rounded-[var(--radius-input)] bg-gradient-to-br from-dta-sand to-dta-beige">
                <CalendarDays size={24} className="text-dta-accent" />
              </div>

              {/* Info */}
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-2">
                  <h3 className="truncate font-serif text-base font-semibold text-dta-dark">
                    {event.title}
                  </h3>
                  {!event.published && (
                    <span className="flex items-center gap-1 rounded-[var(--radius-full)] bg-amber-100 px-2 py-0.5 text-xs text-amber-700">
                      <EyeOff size={10} />
                      Brouillon
                    </span>
                  )}
                  {event.published && (
                    <span className="rounded-[var(--radius-full)] bg-green-100 px-2 py-0.5 text-xs font-medium text-green-700">
                      Publié
                    </span>
                  )}
                </div>
                <div className="mt-1 flex items-center gap-3 text-xs text-dta-taupe">
                  <span>{formatDate(event.date)}</span>
                  <span>&middot;</span>
                  <span>{event.venue}</span>
                  <span>&middot;</span>
                  <span>
                    {event._count.tickets} billet
                    {event._count.tickets !== 1 ? "s" : ""} vendus
                  </span>
                  <span>&middot;</span>
                  <span>
                    {formatPrice(event.priceStd)}
                  </span>
                </div>
              </div>

              {/* Actions */}
              <div className="flex flex-shrink-0 items-center gap-1">
                <Link
                  href={`/evenements/${event.slug}`}
                  className="rounded-[var(--radius-button)] p-2 text-dta-taupe hover:bg-dta-beige hover:text-dta-dark"
                  title="Voir"
                >
                  <Eye size={16} />
                </Link>
                <Link
                  href={`/dashboard/events/${event.id}/edit`}
                  className="rounded-[var(--radius-button)] p-2 text-dta-taupe hover:bg-dta-beige hover:text-dta-dark"
                  title="Modifier"
                >
                  <Pencil size={16} />
                </Link>
                <DeleteEventButton
                  eventId={event.id}
                  eventTitle={event.title}
                />
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

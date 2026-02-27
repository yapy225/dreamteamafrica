import { redirect } from "next/navigation";
import Link from "next/link";
import { Plus, Pencil, Trash2, EyeOff, BookOpen } from "lucide-react";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { formatDate } from "@/lib/utils";
import DeleteOfficielButton from "./DeleteOfficielButton";

export const dynamic = "force-dynamic";
export const metadata = { title: "Gestion Officiel d'Afrique" };

const TYPE_LABELS: Record<string, { label: string; color: string }> = {
  article: { label: "Article", color: "bg-blue-100 text-blue-700" },
  interview: { label: "Interview", color: "bg-purple-100 text-purple-700" },
  portrait: { label: "Portrait", color: "bg-amber-100 text-amber-700" },
  guide: { label: "Guide", color: "bg-green-100 text-green-700" },
};

export default async function DashboardOfficielPage() {
  const session = await auth();
  if (!session) redirect("/auth/signin");
  // Accessible à tous les utilisateurs connectés

  const contents = await prisma.officielContent.findMany({
    orderBy: { createdAt: "desc" },
    include: { author: { select: { name: true } } },
  });

  return (
    <div className="mx-auto max-w-5xl px-4 py-12 sm:px-6 lg:px-8">
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="font-serif text-3xl font-bold text-dta-dark">
            Officiel d&apos;Afrique
          </h1>
          <p className="mt-1 text-sm text-dta-char/70">
            {contents.length} contenu{contents.length !== 1 ? "s" : ""}
          </p>
        </div>
        <Link
          href="/dashboard/officiel-afrique/new"
          className="flex items-center gap-2 rounded-[var(--radius-button)] bg-dta-accent px-5 py-2.5 text-sm font-semibold text-white hover:bg-dta-accent-dark"
        >
          <Plus size={16} />
          Nouveau contenu
        </Link>
      </div>

      {contents.length === 0 ? (
        <div className="rounded-[var(--radius-card)] bg-white p-12 text-center shadow-[var(--shadow-card)]">
          <BookOpen size={48} className="mx-auto text-dta-taupe" />
          <h2 className="mt-4 font-serif text-xl font-bold text-dta-dark">
            Aucun contenu
          </h2>
          <p className="mt-2 text-sm text-dta-char/70">
            Commencez par créer votre premier contenu éditorial.
          </p>
          <Link
            href="/dashboard/officiel-afrique/new"
            className="mt-6 inline-flex items-center gap-2 rounded-[var(--radius-button)] bg-dta-accent px-6 py-3 text-sm font-semibold text-white hover:bg-dta-accent-dark"
          >
            <Plus size={16} />
            Créer un contenu
          </Link>
        </div>
      ) : (
        <div className="space-y-3">
          {contents.map((item) => {
            const typeInfo = TYPE_LABELS[item.type] || {
              label: item.type,
              color: "bg-gray-100 text-gray-700",
            };
            return (
              <div
                key={item.id}
                className="flex items-center gap-4 rounded-[var(--radius-card)] bg-white p-4 shadow-[var(--shadow-card)]"
              >
                {/* Icon */}
                <div className="flex h-16 w-16 flex-shrink-0 items-center justify-center rounded-[var(--radius-input)] bg-gradient-to-br from-dta-sand to-dta-beige">
                  <BookOpen size={24} className="text-dta-accent" />
                </div>

                {/* Info */}
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2">
                    <h3 className="truncate font-serif text-base font-semibold text-dta-dark">
                      {item.title}
                    </h3>
                    <span
                      className={`rounded-[var(--radius-full)] px-2 py-0.5 text-xs font-medium ${typeInfo.color}`}
                    >
                      {typeInfo.label}
                    </span>
                    {!item.published && (
                      <span className="flex items-center gap-1 rounded-[var(--radius-full)] bg-amber-100 px-2 py-0.5 text-xs text-amber-700">
                        <EyeOff size={10} />
                        Brouillon
                      </span>
                    )}
                    {item.published && (
                      <span className="rounded-[var(--radius-full)] bg-green-100 px-2 py-0.5 text-xs font-medium text-green-700">
                        Publié
                      </span>
                    )}
                  </div>
                  <div className="mt-1 flex items-center gap-3 text-xs text-dta-taupe">
                    <span>{item.category}</span>
                    <span>&middot;</span>
                    <span>{formatDate(item.createdAt)}</span>
                    {item.author.name && (
                      <>
                        <span>&middot;</span>
                        <span>{item.author.name}</span>
                      </>
                    )}
                  </div>
                </div>

                {/* Actions */}
                <div className="flex flex-shrink-0 items-center gap-1">
                  <Link
                    href={`/dashboard/officiel-afrique/${item.id}/edit`}
                    className="rounded-[var(--radius-button)] p-2 text-dta-taupe hover:bg-dta-beige hover:text-dta-dark"
                    title="Modifier"
                  >
                    <Pencil size={16} />
                  </Link>
                  <DeleteOfficielButton
                    contentId={item.id}
                    contentTitle={item.title}
                  />
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

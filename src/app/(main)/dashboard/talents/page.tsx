import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { Mail, Phone, Instagram, ExternalLink, Music, User } from "lucide-react";

export const dynamic = "force-dynamic";
export const metadata = { title: "Talents | Dashboard" };

const STATUS_BADGE: Record<string, string> = {
  PENDING: "bg-amber-100 text-amber-700",
  SELECTED: "bg-green-100 text-green-700",
  REJECTED: "bg-red-100 text-red-600",
};

const STATUS_LABEL: Record<string, string> = {
  PENDING: "En attente",
  SELECTED: "Sélectionné(e)",
  REJECTED: "Refusé(e)",
};

export default async function TalentsPage({
  searchParams,
}: {
  searchParams: Promise<{ tab?: string }>;
}) {
  const session = await auth();
  if (!session) redirect("/auth/signin");
  if (session.user.role !== "ADMIN") redirect("/dashboard");

  const params = await searchParams;
  const tab = params.tab || "mannequins";

  const models = await prisma.modelApplication.findMany({
    orderBy: { createdAt: "desc" },
  });

  const artists = await prisma.artistApplication.findMany({
    orderBy: { createdAt: "desc" },
  });

  const activeList = tab === "artistes" ? artists : models;
  const isArtists = tab === "artistes";

  return (
    <div className="mx-auto max-w-6xl px-4 py-12 sm:px-6 lg:px-8">
      <div className="mb-8">
        <h1 className="font-serif text-3xl font-bold text-dta-dark">
          Talents
        </h1>
        <p className="mt-2 text-sm text-dta-char/70">
          {models.length} mannequin{models.length > 1 ? "s" : ""} &middot;{" "}
          {artists.length} artiste{artists.length > 1 ? "s" : ""}
        </p>
      </div>

      {/* Tabs */}
      <div className="mb-6 flex gap-2">
        <a
          href="/dashboard/talents?tab=mannequins"
          className={`flex items-center gap-2 rounded-full px-5 py-2.5 text-sm font-semibold transition-colors ${
            !isArtists
              ? "bg-dta-accent text-white"
              : "bg-white border border-dta-sand text-dta-char hover:bg-dta-accent/5"
          }`}
        >
          <User size={16} />
          Mannequins ({models.length})
        </a>
        <a
          href="/dashboard/talents?tab=artistes"
          className={`flex items-center gap-2 rounded-full px-5 py-2.5 text-sm font-semibold transition-colors ${
            isArtists
              ? "bg-dta-accent text-white"
              : "bg-white border border-dta-sand text-dta-char hover:bg-dta-accent/5"
          }`}
        >
          <Music size={16} />
          Artistes ({artists.length})
        </a>
      </div>

      {/* Grid */}
      {activeList.length === 0 ? (
        <div className="rounded-2xl border border-dta-sand bg-white p-12 text-center">
          <p className="text-sm text-dta-char/50">
            Aucune candidature {isArtists ? "artiste" : "mannequin"} pour le
            moment.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {activeList.map((entry) => {
            const initials = `${entry.firstName[0]}${entry.lastName[0]}`.toUpperCase();
            return (
              <div
                key={entry.id}
                className="flex flex-col rounded-2xl border border-dta-sand bg-white p-5 shadow-sm transition-shadow hover:shadow-md"
              >
                {/* Header */}
                <div className="flex items-start gap-3">
                  <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-dta-accent text-sm font-bold text-white">
                    {initials}
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="font-bold text-dta-dark truncate">
                      {entry.firstName} {entry.lastName}
                    </p>
                    {isArtists && "discipline" in entry && (
                      <p className="text-xs text-dta-accent font-medium">
                        {(entry as typeof artists[0]).discipline}
                        {(entry as typeof artists[0]).groupName &&
                          ` — ${(entry as typeof artists[0]).groupName}`}
                      </p>
                    )}
                    {!isArtists && "height" in entry && (entry as typeof models[0]).height && (
                      <p className="text-xs text-dta-char/60">
                        {(entry as typeof models[0]).height}
                        {(entry as typeof models[0]).measurements &&
                          ` · ${(entry as typeof models[0]).measurements}`}
                      </p>
                    )}
                    <span
                      className={`mt-1 inline-block rounded-full px-2 py-0.5 text-[10px] font-medium ${STATUS_BADGE[entry.status] || "bg-gray-100 text-gray-500"}`}
                    >
                      {STATUS_LABEL[entry.status] || entry.status}
                    </span>
                  </div>
                </div>

                {/* Description / Experience */}
                {"experience" in entry && (entry as typeof models[0]).experience && (
                  <p className="mt-3 line-clamp-3 text-xs leading-relaxed text-dta-char/60">
                    {(entry as typeof models[0]).experience}
                  </p>
                )}
                {"description" in entry && (entry as typeof artists[0]).description && (
                  <p className="mt-3 line-clamp-3 text-xs leading-relaxed text-dta-char/60">
                    {(entry as typeof artists[0]).description}
                  </p>
                )}

                {/* Contact */}
                <div className="mt-auto pt-4 flex flex-wrap gap-2 border-t border-dta-sand/50 text-[11px] text-dta-char/50">
                  <a href={`mailto:${entry.email}`} className="flex items-center gap-1 hover:text-dta-accent">
                    <Mail size={11} /> {entry.email}
                  </a>
                  <a href={`tel:${entry.phone}`} className="flex items-center gap-1 hover:text-dta-accent">
                    <Phone size={11} /> {entry.phone}
                  </a>
                </div>

                {/* Social */}
                <div className="mt-2 flex gap-2">
                  {entry.instagram && (
                    <a
                      href={entry.instagram.startsWith("http") ? entry.instagram : `https://instagram.com/${entry.instagram.replace("@", "")}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-1 rounded-lg bg-dta-bg px-2 py-1 text-[10px] font-medium text-dta-char/70 hover:text-dta-accent"
                    >
                      <Instagram size={10} /> {entry.instagram}
                    </a>
                  )}
                  {"bookUrl" in entry && (entry as typeof models[0]).bookUrl && (
                    <a
                      href={(entry as typeof models[0]).bookUrl!}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-1 rounded-lg bg-dta-bg px-2 py-1 text-[10px] font-medium text-dta-char/70 hover:text-dta-accent"
                    >
                      <ExternalLink size={10} /> Book
                    </a>
                  )}
                  {"videoUrl" in entry && (entry as typeof artists[0]).videoUrl && (
                    <a
                      href={(entry as typeof artists[0]).videoUrl!}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-1 rounded-lg bg-dta-bg px-2 py-1 text-[10px] font-medium text-dta-char/70 hover:text-dta-accent"
                    >
                      <ExternalLink size={10} /> Vidéo
                    </a>
                  )}
                </div>

                {/* Date */}
                <p className="mt-2 text-[10px] text-dta-char/40">
                  Candidature du{" "}
                  {new Date(entry.createdAt).toLocaleDateString("fr-FR", {
                    day: "numeric",
                    month: "long",
                    year: "numeric",
                  })}
                </p>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

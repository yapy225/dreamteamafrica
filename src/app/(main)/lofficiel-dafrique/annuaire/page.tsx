import Link from "next/link";
import Image from "next/image";
import { ChevronLeft, ChevronRight, Phone, Mail, MapPin } from "lucide-react";
import { prisma } from "@/lib/db";
import type { Metadata } from "next";
import type { Prisma } from "@prisma/client";
import ProtectedContent from "./ProtectedContent";

const PAGE_SIZE = 24;

/** Mask email: jo***@gmail.com */
function maskEmail(email: string): string {
  const [local, domain] = email.split("@");
  if (!domain) return "***@***";
  return local.slice(0, 2) + "***@" + domain;
}

/** Mask phone: +33 6 ** ** ** 30 */
function maskPhone(phone: string): string {
  const cleaned = phone.replace(/\s/g, "");
  if (cleaned.length < 6) return "** ** ** **";
  return cleaned.slice(0, 6) + " ** ** " + cleaned.slice(-2);
}

export const revalidate = 60;

const siteUrl = process.env.NEXT_PUBLIC_APP_URL || "https://dreamteamafrica.com";

export const metadata: Metadata = {
  title: "Annuaire Professionnel — L'Officiel d'Afrique 2026 | Diaspora Africaine Paris",
  description:
    "Consultez l'annuaire professionnel de la diaspora africaine à Paris. Artistes, restaurants, médias, associations, sport. Filtrez par catégorie et pays.",
  keywords: [
    "annuaire professionnel diaspora africaine",
    "annuaire entreprises africaines Paris",
    "artistes africains France annuaire",
    "restaurants africains Paris",
    "associations diaspora africaine",
    "professionnels africains France",
  ],
  openGraph: {
    title: "Annuaire — L'Officiel d'Afrique 2026",
    description: "L'annuaire professionnel de la diaspora africaine à Paris. Filtrez par catégorie et pays.",
    type: "website",
    url: `${siteUrl}/lofficiel-dafrique/annuaire`,
  },
  twitter: {
    card: "summary",
    title: "Annuaire — L'Officiel d'Afrique 2026",
    description: "Annuaire professionnel de la diaspora africaine à Paris.",
  },
  alternates: {
    canonical: `${siteUrl}/lofficiel-dafrique/annuaire`,
  },
};


export default async function AnnuairePage({
  searchParams,
}: {
  searchParams: Promise<{ category?: string; country?: string; q?: string; page?: string }>;
}) {
  const params = await searchParams;
  const category = params.category || "";
  const country = params.country || "";
  const q = params.q || "";
  const page = Math.max(1, parseInt(params.page ?? "1", 10) || 1);

  // Build filtered query
  const where: Prisma.DirectoryEntryWhereInput = { published: true };
  if (category) where.category = category;
  if (country) where.country = country;
  if (q) {
    where.OR = [
      { contactName: { contains: q, mode: "insensitive" } },
      { companyName: { contains: q, mode: "insensitive" } },
      { description: { contains: q, mode: "insensitive" } },
    ];
  }

  // Parallel: paginated entries + total count + sidebar aggregates
  const [entries, totalFiltered, catGroups, countryGroups] = await Promise.all([
    prisma.directoryEntry.findMany({
      where,
      orderBy: { createdAt: "desc" },
      skip: (page - 1) * PAGE_SIZE,
      take: PAGE_SIZE,
      select: {
        id: true,
        companyName: true,
        contactName: true,
        category: true,
        city: true,
        country: true,
        email: true,
        phone: true,
        description: true,
        logoUrl: true,
      },
    }),
    prisma.directoryEntry.count({ where }),
    prisma.directoryEntry.groupBy({
      by: ["category"],
      where: { published: true },
      _count: { _all: true },
    }),
    prisma.directoryEntry.groupBy({
      by: ["country"],
      where: { published: true, country: { not: null } },
      _count: { _all: true },
    }),
  ]);

  const totalPages = Math.max(1, Math.ceil(totalFiltered / PAGE_SIZE));
  const currentPage = Math.min(page, totalPages);

  const categories = catGroups
    .map((g) => ({ category: g.category, _count: g._count._all }))
    .sort((a, b) => b._count - a._count);

  const countries = countryGroups
    .map((g) => ({ country: g.country!, _count: g._count._all }))
    .sort((a, b) => b._count - a._count);

  // Build URL with filters preserved, optionally overriding page
  const buildUrl = (overrides: { category?: string | null; country?: string | null; q?: string | null; page?: number | null } = {}) => {
    const sp = new URLSearchParams();
    const cat = overrides.category !== undefined ? overrides.category : category;
    const cty = overrides.country !== undefined ? overrides.country : country;
    const qq = overrides.q !== undefined ? overrides.q : q;
    const pg = overrides.page !== undefined ? overrides.page : currentPage;
    if (cat) sp.set("category", cat);
    if (cty) sp.set("country", cty);
    if (qq) sp.set("q", qq);
    if (pg && pg > 1) sp.set("page", String(pg));
    const s = sp.toString();
    return `/lofficiel-dafrique/annuaire${s ? `?${s}` : ""}`;
  };

  const breadcrumbJsonLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Accueil", item: siteUrl },
      { "@type": "ListItem", position: 2, name: "L'Officiel d'Afrique", item: `${siteUrl}/lofficiel-dafrique` },
      { "@type": "ListItem", position: 3, name: "Annuaire" },
    ],
  };

  return (
    <ProtectedContent>
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }}
    />
    <div className="min-h-screen bg-[#FAFAF7]">
      {/* Breadcrumb */}
      <nav className="border-b border-[#F0ECE7] bg-white" aria-label="Fil d'Ariane" itemScope itemType="https://schema.org/BreadcrumbList">
        <div className="mx-auto flex max-w-7xl items-center gap-1.5 px-4 py-3 text-xs text-[#999] sm:px-6 lg:px-8">
          <Link href="/" className="hover:text-[#C4704B] transition-colors">
            Accueil
          </Link>
          <ChevronRight size={12} />
          <Link href="/lofficiel-dafrique" className="hover:text-[#C4704B] transition-colors">
            L&apos;Officiel d&apos;Afrique
          </Link>
          <ChevronRight size={12} />
          <span className="text-[#2C2C2C]">Annuaire</span>
        </div>
      </nav>

      {/* Header */}
      <section className="border-b border-[#F0ECE7] bg-white px-4 py-10">
        <div className="mx-auto max-w-7xl sm:px-6 lg:px-8">
          <h1 className="text-3xl font-extrabold text-[#2C2C2C] sm:text-4xl">
            Annuaire professionnel
          </h1>
          <p className="mt-2 text-sm text-[#6B6B6B]">
            {totalFiltered} fiche{totalFiltered > 1 ? "s" : ""} dans l&apos;annuaire
            {totalPages > 1 ? ` — page ${currentPage} / ${totalPages}` : ""}
          </p>
        </div>
      </section>

      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-[240px_1fr]">
          {/* Sidebar filters */}
          <aside className="space-y-6">
            {/* Search */}
            <form method="GET" className="relative">
              {category && <input type="hidden" name="category" value={category} />}
              {country && <input type="hidden" name="country" value={country} />}
              <input
                name="q"
                type="text"
                defaultValue={q}
                placeholder="Rechercher..."
                className="w-full rounded-lg border border-[#E0E0E0] bg-white px-4 py-2.5 text-sm text-[#2C2C2C] outline-none focus:border-[#C4704B]"
              />
            </form>

            {/* Categories */}
            <div>
              <h3 className="text-xs font-bold uppercase tracking-wider text-[#999]">
                Categories
              </h3>
              <div className="mt-2 space-y-1">
                <Link
                  href={buildUrl({ category: null, page: 1 })}
                  prefetch={false}
                  className={`block rounded-lg px-3 py-2 text-sm transition-colors ${!category ? "bg-[#C4704B] text-white" : "text-[#4a4a4a] hover:bg-[#F5F0EB]"}`}
                >
                  Toutes ({categories.reduce((s, c) => s + c._count, 0)})
                </Link>
                {categories.map((c) => (
                    <Link
                      key={c.category}
                      href={buildUrl({ category: c.category, page: 1 })}
                      prefetch={false}
                      className={`block rounded-lg px-3 py-2 text-sm transition-colors ${category === c.category ? "bg-[#C4704B] text-white" : "text-[#4a4a4a] hover:bg-[#F5F0EB]"}`}
                    >
                      {c.category} ({c._count})
                    </Link>
                  ))}
              </div>
            </div>

            {/* Countries */}
            <div>
              <h3 className="text-xs font-bold uppercase tracking-wider text-[#999]">
                Pays
              </h3>
              <div className="mt-2 space-y-1">
                <Link
                  href={buildUrl({ country: null, page: 1 })}
                  prefetch={false}
                  className={`block rounded-lg px-3 py-2 text-sm transition-colors ${!country ? "bg-[#2C2C2C] text-white" : "text-[#4a4a4a] hover:bg-[#F5F0EB]"}`}
                >
                  Tous les pays
                </Link>
                {countries.map((c) => (
                  <Link
                    key={c.country}
                    href={buildUrl({ country: c.country, page: 1 })}
                    prefetch={false}
                    className={`block rounded-lg px-3 py-2 text-sm transition-colors ${country === c.country ? "bg-[#2C2C2C] text-white" : "text-[#4a4a4a] hover:bg-[#F5F0EB]"}`}
                  >
                    {c.country} ({c._count})
                  </Link>
                ))}
              </div>
            </div>

            {/* CTA */}
            <Link
              href="/lofficiel-dafrique#inscription"
              className="block rounded-xl bg-[#C4704B] px-4 py-3 text-center text-sm font-semibold text-white transition-colors hover:bg-[#A85D3B]"
            >
              Inscrire mon entreprise
            </Link>
          </aside>

          {/* Entries grid */}
          <div>
            {entries.length === 0 ? (
              <div className="rounded-xl border border-[#F0ECE7] bg-white p-12 text-center">
                <p className="text-sm text-[#999]">Aucune fiche ne correspond à votre recherche.</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                {entries.map((entry) => {
                  const initials = entry.contactName
                    .split(" ")
                    .map((n) => n[0])
                    .join("")
                    .slice(0, 2)
                    .toUpperCase();
                  return (
                    <div
                      key={entry.id}
                      className="flex flex-col rounded-xl border border-[#F0ECE7] bg-white p-5 transition-shadow hover:shadow-md"
                    >
                      {/* Header */}
                      <div className="flex items-start gap-3">
                        {entry.logoUrl ? (
                          <Image
                            src={entry.logoUrl}
                            alt={entry.companyName || entry.contactName}
                            width={44}
                            height={44}
                            className="h-11 w-11 shrink-0 rounded-full object-cover"
                          />
                        ) : (
                          <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-[#C4704B] text-sm font-bold text-white">
                            {initials}
                          </div>
                        )}
                        <div className="min-w-0">
                          {entry.companyName && (
                            <p className="truncate text-sm font-bold text-[#2C2C2C]">
                              {entry.companyName}
                            </p>
                          )}
                          <p className="truncate text-sm text-[#4a4a4a]">
                            {entry.contactName}
                          </p>
                          <div className="mt-1 flex flex-wrap gap-1.5">
                            <span className="rounded bg-[#F5F0EB] px-2 py-0.5 text-[10px] font-semibold text-[#C4704B]">
                              {entry.description?.slice(0, 40) || entry.category}
                            </span>
                            {(entry.city || entry.country) && (
                              <span className="rounded bg-[#F5F0EB] px-2 py-0.5 text-[10px] font-semibold text-[#6B6B6B]">
                                {entry.city}{entry.city && entry.country ? ", " : ""}{entry.country}
                              </span>
                            )}
                          </div>
                        </div>
                      </div>

                      {/* Description */}
                      <p className="mt-3 line-clamp-3 flex-1 text-[13px] leading-relaxed text-[#6B6B6B]">
                        {entry.description}
                      </p>

                      {/* Contact info — masked */}
                      <div className="mt-4 flex flex-wrap gap-3 border-t border-[#F0ECE7] pt-3 text-[11px] text-[#999]">
                        {entry.email && (
                          <span className="flex items-center gap-1">
                            <Mail size={12} /> {maskEmail(entry.email)}
                          </span>
                        )}
                        {entry.phone && (
                          <span className="flex items-center gap-1">
                            <Phone size={12} /> {maskPhone(entry.phone)}
                          </span>
                        )}
                        {entry.country && (
                          <span className="flex items-center gap-1">
                            <MapPin size={12} /> {entry.city ? `${entry.city}, ` : ""}{entry.country}
                          </span>
                        )}
                      </div>

                      {/* CTA contact */}
                      <div className="mt-3">
                        <a
                          href={`mailto:hello@dreamteamafrica.com?subject=Contact%20annuaire%20-%20${encodeURIComponent(entry.contactName)}`}
                          className="inline-flex items-center gap-1.5 rounded-lg bg-[#2C2C2C] px-3 py-1.5 text-[11px] font-semibold text-white transition-colors hover:bg-[#C4704B]"
                        >
                          <Mail size={11} /> Contacter
                        </a>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}

            {/* Pagination */}
            {totalPages > 1 && (
              <nav
                className="mt-8 flex items-center justify-center gap-1"
                aria-label="Pagination"
              >
                {currentPage > 1 && (
                  <Link
                    href={buildUrl({ page: currentPage - 1 })}
                    prefetch={false}
                    rel="prev"
                    className="flex items-center gap-1 rounded-lg border border-[#E0E0E0] bg-white px-3 py-2 text-sm text-[#4a4a4a] hover:bg-[#F5F0EB]"
                  >
                    <ChevronLeft size={14} /> Précédent
                  </Link>
                )}
                {(() => {
                  const windowSize = 5;
                  const start = Math.max(1, currentPage - Math.floor(windowSize / 2));
                  const end = Math.min(totalPages, start + windowSize - 1);
                  const realStart = Math.max(1, end - windowSize + 1);
                  const pages = [];
                  for (let p = realStart; p <= end; p++) pages.push(p);
                  return (
                    <>
                      {realStart > 1 && (
                        <>
                          <Link
                            href={buildUrl({ page: 1 })}
                            prefetch={false}
                            className="rounded-lg border border-[#E0E0E0] bg-white px-3 py-2 text-sm text-[#4a4a4a] hover:bg-[#F5F0EB]"
                          >
                            1
                          </Link>
                          {realStart > 2 && <span className="px-1 text-sm text-[#999]">…</span>}
                        </>
                      )}
                      {pages.map((p) => (
                        <Link
                          key={p}
                          href={buildUrl({ page: p })}
                          prefetch={false}
                          aria-current={p === currentPage ? "page" : undefined}
                          className={`rounded-lg border px-3 py-2 text-sm ${
                            p === currentPage
                              ? "border-[#C4704B] bg-[#C4704B] text-white"
                              : "border-[#E0E0E0] bg-white text-[#4a4a4a] hover:bg-[#F5F0EB]"
                          }`}
                        >
                          {p}
                        </Link>
                      ))}
                      {end < totalPages && (
                        <>
                          {end < totalPages - 1 && <span className="px-1 text-sm text-[#999]">…</span>}
                          <Link
                            href={buildUrl({ page: totalPages })}
                            prefetch={false}
                            className="rounded-lg border border-[#E0E0E0] bg-white px-3 py-2 text-sm text-[#4a4a4a] hover:bg-[#F5F0EB]"
                          >
                            {totalPages}
                          </Link>
                        </>
                      )}
                    </>
                  );
                })()}
                {currentPage < totalPages && (
                  <Link
                    href={buildUrl({ page: currentPage + 1 })}
                    prefetch={false}
                    rel="next"
                    className="flex items-center gap-1 rounded-lg border border-[#E0E0E0] bg-white px-3 py-2 text-sm text-[#4a4a4a] hover:bg-[#F5F0EB]"
                  >
                    Suivant <ChevronRight size={14} />
                  </Link>
                )}
              </nav>
            )}
          </div>
        </div>
      </div>
    </div>
    </ProtectedContent>
  );
}

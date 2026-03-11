import Link from "next/link";
import { ChevronRight, Phone, Mail, MapPin } from "lucide-react";
import { prisma } from "@/lib/db";
import type { Metadata } from "next";
import ProtectedContent from "./ProtectedContent";

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

export const dynamic = "force-dynamic";

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
  searchParams: Promise<{ category?: string; country?: string; q?: string }>;
}) {
  const params = await searchParams;
  const category = params.category || "";
  const country = params.country || "";
  const q = params.q || "";

  // Build filtered query
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const where: any = { published: true };
  if (category) where.category = category;
  if (country) where.country = country;
  if (q) {
    where.OR = [
      { contactName: { contains: q, mode: "insensitive" } },
      { companyName: { contains: q, mode: "insensitive" } },
      { description: { contains: q, mode: "insensitive" } },
    ];
  }

  // Fetch all published entries for counts + filtered entries
  const allPublished = await prisma.directoryEntry.findMany({
    where: { published: true },
    orderBy: { createdAt: "desc" },
  });

  // Filter in JS for the current view
  const entries = (category || country || q)
    ? allPublished.filter((e) => {
        if (category && e.category !== category) return false;
        if (country && e.country !== country) return false;
        if (q) {
          const lower = q.toLowerCase();
          if (
            !e.contactName.toLowerCase().includes(lower) &&
            !(e.companyName || "").toLowerCase().includes(lower) &&
            !e.description.toLowerCase().includes(lower)
          ) return false;
        }
        return true;
      })
    : allPublished;

  // Count by category & country from all published
  const catMap = new Map<string, number>();
  const countryMap = new Map<string, number>();
  for (const e of allPublished) {
    catMap.set(e.category, (catMap.get(e.category) || 0) + 1);
    if (e.country) countryMap.set(e.country, (countryMap.get(e.country) || 0) + 1);
  }

  const categories = [...catMap.entries()]
    .sort((a, b) => b[1] - a[1])
    .map(([cat, count]) => ({ category: cat, _count: count }));

  const countries = [...countryMap.entries()]
    .sort((a, b) => b[1] - a[1])
    .map(([c, count]) => ({ country: c, _count: count }));

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
            {entries.length} fiche{entries.length > 1 ? "s" : ""} dans l&apos;annuaire
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
                  href={`/lofficiel-dafrique/annuaire${country ? `?country=${country}` : ""}${q ? `${country ? "&" : "?"}q=${q}` : ""}`}
                  className={`block rounded-lg px-3 py-2 text-sm transition-colors ${!category ? "bg-[#C4704B] text-white" : "text-[#4a4a4a] hover:bg-[#F5F0EB]"}`}
                >
                  Toutes ({categories.reduce((s, c) => s + c._count, 0)})
                </Link>
                {categories.map((c) => (
                    <Link
                      key={c.category}
                      href={`/lofficiel-dafrique/annuaire?category=${encodeURIComponent(c.category)}${country ? `&country=${country}` : ""}${q ? `&q=${q}` : ""}`}
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
                  href={`/lofficiel-dafrique/annuaire${category ? `?category=${category}` : ""}${q ? `${category ? "&" : "?"}q=${q}` : ""}`}
                  className={`block rounded-lg px-3 py-2 text-sm transition-colors ${!country ? "bg-[#2C2C2C] text-white" : "text-[#4a4a4a] hover:bg-[#F5F0EB]"}`}
                >
                  Tous les pays
                </Link>
                {countries.map((c) => (
                  <Link
                    key={c.country}
                    href={`/lofficiel-dafrique/annuaire?${category ? `category=${category}&` : ""}country=${encodeURIComponent(c.country!)}${q ? `&q=${q}` : ""}`}
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
                        <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-[#C4704B] text-sm font-bold text-white">
                          {initials}
                        </div>
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
                              {entry.category}
                            </span>
                            {entry.country && (
                              <span className="rounded bg-[#F5F0EB] px-2 py-0.5 text-[10px] font-semibold text-[#6B6B6B]">
                                {entry.country}
                              </span>
                            )}
                            {entry.event && (
                              <span className="rounded bg-[#E8F5E9] px-2 py-0.5 text-[10px] font-semibold text-[#2E7D32]">
                                {entry.event}
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
                        <Link
                          href={`/nous-contacter?ref=annuaire&name=${encodeURIComponent(entry.contactName)}`}
                          className="inline-flex items-center gap-1.5 rounded-lg bg-[#2C2C2C] px-3 py-1.5 text-[11px] font-semibold text-white transition-colors hover:bg-[#C4704B]"
                        >
                          <Mail size={11} /> Contacter
                        </Link>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
    </ProtectedContent>
  );
}

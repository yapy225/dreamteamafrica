import Link from "next/link";
import Image from "next/image";
import { prisma } from "@/lib/db";
import { formatDate, formatPrice } from "@/lib/utils";
import { Calendar, ShoppingBag, Newspaper, Megaphone, MapPin, ArrowRight } from "lucide-react";

export const dynamic = "force-dynamic";

const features = [
  {
    icon: Calendar,
    title: "Événements culturels",
    description:
      "Cinéma, musique, danse, gastronomie et artisanat africain. Une saison complète à Paris.",
    href: "/evenements",
    cta: "Voir le programme",
  },
  {
    icon: ShoppingBag,
    title: "Marketplace artisanale",
    description:
      "Créations uniques d'artisans africains. Mode, bijoux, décoration et bien plus.",
    href: "/marketplace",
    cta: "Explorer la boutique",
  },
  {
    icon: Newspaper,
    title: "L'Afropéen",
    description:
      "Le journal de la diaspora africaine en Europe. Actualités, culture, business et lifestyle.",
    href: "/journal",
    cta: "Lire le journal",
  },
  {
    icon: Megaphone,
    title: "DTA Ads",
    description:
      "Boostez votre visibilité auprès de la communauté africaine de Paris.",
    href: "/ads",
    cta: "En savoir plus",
  },
];

const categoryColors: Record<string, string> = {
  ACTUALITE: "bg-blue-100 text-blue-700",
  CULTURE: "bg-purple-100 text-purple-700",
  DIASPORA: "bg-green-100 text-green-700",
  BUSINESS: "bg-amber-100 text-amber-700",
  LIFESTYLE: "bg-pink-100 text-pink-700",
  OPINION: "bg-red-100 text-red-700",
};

export default async function Home() {
  const [events, products, articles, eventCount, productCount, articleCount] =
    await Promise.all([
      prisma.event.findMany({
        where: { published: true },
        orderBy: { date: "asc" },
        take: 4,
      }),
      prisma.product.findMany({
        where: { published: true },
        include: { artisan: { select: { name: true, country: true } } },
        orderBy: { createdAt: "desc" },
        take: 4,
      }),
      prisma.article.findMany({
        where: { position: { not: "ARCHIVES" } },
        include: { author: { select: { name: true } } },
        orderBy: { publishedAt: "desc" },
        take: 3,
      }),
      prisma.event.count({ where: { published: true } }),
      prisma.product.count({ where: { published: true } }),
      prisma.article.count({ where: { position: { not: "ARCHIVES" } } }),
    ]);

  const featuredEvent = events[0];
  const otherEvents = events.slice(1);

  const featuredArticle = articles[0];
  const otherArticles = articles.slice(1);

  return (
    <>
      {/* ── A. Hero ── */}
      <section className="relative min-h-[90vh] overflow-hidden bg-dta-dark">
        {/* Kente strip */}
        <div className="h-1.5 w-full bg-gradient-to-r from-dta-accent via-emerald-700 to-dta-accent" />

        {/* Background gradients */}
        <div className="absolute inset-0 bg-gradient-to-br from-dta-dark via-dta-char to-dta-dark" />
        <div className="absolute inset-0 opacity-15">
          <div className="h-full w-full bg-[radial-gradient(ellipse_at_top_right,_var(--color-dta-accent)_0%,_transparent_50%)]" />
        </div>
        <div className="absolute inset-0 opacity-8">
          <div className="h-full w-full bg-[radial-gradient(ellipse_at_bottom_left,_#166534_0%,_transparent_40%)]" />
        </div>

        <div className="relative flex min-h-[90vh] flex-col justify-between px-4 sm:px-6 lg:px-8">
          {/* Main hero content */}
          <div className="mx-auto flex w-full max-w-7xl flex-1 items-center">
            <div className="max-w-3xl">
              <p className="mb-4 text-sm font-medium uppercase tracking-[0.2em] text-dta-accent">
                Saison 2026 &middot; Paris
              </p>
              <h1 className="font-serif text-4xl font-bold leading-[1.1] text-white sm:text-5xl lg:text-7xl">
                La culture africaine
                <br />
                <span className="text-dta-accent">rayonne à Paris</span>
              </h1>
              <p className="mt-6 max-w-xl text-lg leading-relaxed text-dta-sand/90">
                Événements exclusifs, marketplace artisanale et journal de la
                diaspora. Vivez la saison culturelle africaine 2026.
              </p>
              <div className="mt-10 flex flex-col gap-4 sm:flex-row">
                <Link
                  href="/evenements"
                  className="inline-flex items-center justify-center gap-2 rounded-[var(--radius-button)] bg-dta-accent px-8 py-4 text-sm font-semibold text-white transition-all duration-300 hover:bg-dta-accent-dark hover:shadow-lg"
                >
                  Découvrir les événements
                  <ArrowRight size={16} />
                </Link>
                <Link
                  href="/marketplace"
                  className="inline-flex items-center justify-center rounded-[var(--radius-button)] border border-dta-taupe/30 px-8 py-4 text-sm font-semibold text-white transition-all duration-300 hover:border-dta-accent hover:text-dta-accent"
                >
                  Explorer la marketplace
                </Link>
              </div>
            </div>
          </div>

          {/* Stats row */}
          <div className="mx-auto w-full max-w-7xl border-t border-white/10 py-8">
            <div className="flex flex-wrap items-center justify-center gap-8 text-center sm:justify-start sm:gap-16">
              <div>
                <span className="font-serif text-3xl font-bold text-white">
                  {eventCount}
                </span>
                <p className="mt-1 text-xs uppercase tracking-wider text-dta-sand/60">
                  événements
                </p>
              </div>
              <div className="h-8 w-px bg-white/10" />
              <div>
                <span className="font-serif text-3xl font-bold text-white">
                  {productCount}
                </span>
                <p className="mt-1 text-xs uppercase tracking-wider text-dta-sand/60">
                  artisans
                </p>
              </div>
              <div className="h-8 w-px bg-white/10" />
              <div>
                <span className="font-serif text-3xl font-bold text-white">
                  {articleCount}
                </span>
                <p className="mt-1 text-xs uppercase tracking-wider text-dta-sand/60">
                  articles
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── B. Season Banner ── */}
      <section className="bg-dta-accent px-4 py-4">
        <p className="text-center text-sm font-semibold tracking-wide text-white sm:text-base">
          Saison Culturelle Africaine 2026 — Avril à Décembre &middot; Paris
        </p>
      </section>

      {/* ── C. Upcoming Events ── */}
      <section className="bg-dta-beige px-4 py-20 sm:py-28">
        <div className="mx-auto max-w-7xl sm:px-6 lg:px-8">
          <div className="flex items-end justify-between">
            <div>
              <h2 className="font-serif text-3xl font-bold text-dta-dark sm:text-4xl">
                Prochains événements
              </h2>
              <p className="mt-3 text-dta-char/70">
                La saison culturelle 2026 vous attend
              </p>
            </div>
            <Link
              href="/evenements"
              className="hidden items-center gap-1 text-sm font-medium text-dta-accent transition-colors hover:text-dta-accent-dark sm:flex"
            >
              Tout voir <ArrowRight size={14} />
            </Link>
          </div>

          {events.length > 0 ? (
            <div className="mt-10 grid grid-cols-1 gap-6 lg:grid-cols-5">
              {/* Featured event (large card) */}
              {featuredEvent && (
                <Link
                  href={`/evenements/${featuredEvent.slug}`}
                  className="group lg:col-span-3 rounded-[var(--radius-card)] bg-white shadow-[var(--shadow-card)] transition-all duration-300 hover:shadow-[var(--shadow-card-hover)] hover:-translate-y-1 overflow-hidden"
                >
                  <div className="relative aspect-[16/10] overflow-hidden bg-gradient-to-br from-dta-accent/20 to-dta-sand">
                    {featuredEvent.coverImage && (
                      <Image src={featuredEvent.coverImage} alt={featuredEvent.title} fill className="object-cover transition-transform duration-300 group-hover:scale-105" sizes="(max-width: 1024px) 100vw, 60vw" />
                    )}
                  </div>
                  <div className="p-6">
                    <div className="mb-3 flex items-center gap-3">
                      <span className="rounded-[var(--radius-full)] bg-dta-accent/10 px-3 py-1 text-xs font-semibold text-dta-accent">
                        {formatDate(featuredEvent.date)}
                      </span>
                      <span className="flex items-center gap-1 text-xs text-dta-taupe">
                        <MapPin size={12} /> {featuredEvent.venue}
                      </span>
                    </div>
                    <h3 className="font-serif text-xl font-bold text-dta-dark transition-colors group-hover:text-dta-accent sm:text-2xl">
                      {featuredEvent.title}
                    </h3>
                    <p className="mt-2 line-clamp-2 text-sm text-dta-char/70">
                      {featuredEvent.description}
                    </p>
                    <div className="mt-4 flex items-center justify-between">
                      <span className="text-sm font-semibold text-dta-accent">
                        À partir de {formatPrice(featuredEvent.priceEarly)}
                      </span>
                      <span className="text-sm font-medium text-dta-accent opacity-0 transition-opacity group-hover:opacity-100">
                        Voir les détails &rarr;
                      </span>
                    </div>
                  </div>
                </Link>
              )}

              {/* Stacked smaller event cards */}
              <div className="flex flex-col gap-4 lg:col-span-2">
                {otherEvents.map((event) => (
                  <Link
                    key={event.id}
                    href={`/evenements/${event.slug}`}
                    className="group flex items-start gap-4 rounded-[var(--radius-card)] bg-white p-5 shadow-[var(--shadow-card)] transition-all duration-300 hover:shadow-[var(--shadow-card-hover)]"
                  >
                    <div className="flex-shrink-0 rounded-[var(--radius-button)] bg-dta-accent/10 px-3 py-2 text-center">
                      <span className="block text-xs font-semibold uppercase text-dta-accent">
                        {new Intl.DateTimeFormat("fr-FR", { month: "short" }).format(new Date(event.date))}
                      </span>
                      <span className="block font-serif text-2xl font-bold text-dta-dark">
                        {new Date(event.date).getDate()}
                      </span>
                    </div>
                    <div className="min-w-0 flex-1">
                      <h3 className="font-serif text-base font-semibold leading-snug text-dta-dark transition-colors group-hover:text-dta-accent">
                        {event.title}
                      </h3>
                      <p className="mt-1 flex items-center gap-1 text-xs text-dta-taupe">
                        <MapPin size={11} /> {event.venue}
                      </p>
                      <p className="mt-1 text-xs font-medium text-dta-accent">
                        dès {formatPrice(event.priceEarly)}
                      </p>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          ) : (
            <p className="mt-10 text-center text-dta-char/60">
              Les événements arrivent bientôt.
            </p>
          )}

          <div className="mt-8 text-center sm:hidden">
            <Link
              href="/evenements"
              className="text-sm font-medium text-dta-accent"
            >
              Voir tous les événements &rarr;
            </Link>
          </div>
        </div>
      </section>

      {/* ── D. Features ── */}
      <section className="px-4 py-20 sm:py-28">
        <div className="mx-auto max-w-7xl sm:px-6 lg:px-8">
          <div className="text-center">
            <h2 className="font-serif text-3xl font-bold text-dta-dark sm:text-4xl">
              Votre plateforme culturelle
            </h2>
            <p className="mx-auto mt-4 max-w-2xl text-dta-char/70">
              Dream Team Africa réunit événements, commerce et média pour
              célébrer la richesse de la culture africaine en Europe.
            </p>
          </div>

          <div className="mt-16 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {features.map((feature) => (
              <Link
                key={feature.title}
                href={feature.href}
                className="group rounded-[var(--radius-card)] bg-white p-8 shadow-[var(--shadow-card)] transition-all duration-300 hover:shadow-[var(--shadow-card-hover)] hover:-translate-y-1"
              >
                <div className="mb-5 inline-flex rounded-2xl bg-dta-accent/10 p-4 text-dta-accent transition-colors group-hover:bg-dta-accent group-hover:text-white">
                  <feature.icon size={28} />
                </div>
                <h3 className="font-serif text-lg font-semibold text-dta-dark">
                  {feature.title}
                </h3>
                <p className="mt-2 text-sm leading-relaxed text-dta-char/70">
                  {feature.description}
                </p>
                <span className="mt-5 inline-flex items-center gap-1 text-sm font-medium text-dta-accent transition-colors group-hover:text-dta-accent-dark">
                  {feature.cta} <ArrowRight size={14} />
                </span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ── E. Featured Products ── */}
      <section className="bg-dta-beige px-4 py-20 sm:py-28">
        <div className="mx-auto max-w-7xl sm:px-6 lg:px-8">
          <div className="flex items-end justify-between">
            <div>
              <h2 className="font-serif text-3xl font-bold text-dta-dark sm:text-4xl">
                Marketplace artisanale
              </h2>
              <p className="mt-3 text-dta-char/70">
                Des créations uniques façonnées par les meilleurs artisans
              </p>
            </div>
            <Link
              href="/marketplace"
              className="hidden items-center gap-1 text-sm font-medium text-dta-accent transition-colors hover:text-dta-accent-dark sm:flex"
            >
              Explorer <ArrowRight size={14} />
            </Link>
          </div>

          {products.length > 0 ? (
            <div className="mt-10 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
              {products.map((product) => (
                <Link
                  key={product.id}
                  href={`/marketplace/${product.slug}`}
                  className="group rounded-[var(--radius-card)] bg-white shadow-[var(--shadow-card)] transition-all duration-300 hover:shadow-[var(--shadow-card-hover)] hover:-translate-y-1"
                >
                  <div className="relative aspect-square overflow-hidden rounded-t-[var(--radius-card)] bg-gradient-to-br from-dta-sand to-dta-beige">
                    {product.images[0] && (
                      <Image src={product.images[0]} alt={product.name} fill className="object-cover transition-transform duration-300 group-hover:scale-105" sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw" />
                    )}
                  </div>
                  <div className="p-5">
                    <h3 className="font-serif text-base font-semibold text-dta-dark transition-colors group-hover:text-dta-accent">
                      {product.name}
                    </h3>
                    <p className="mt-1 text-xs text-dta-taupe">
                      par {product.artisan.name} — {product.artisan.country}
                    </p>
                    <div className="mt-3 flex items-center justify-between">
                      <span className="font-serif text-lg font-bold text-dta-accent">
                        {formatPrice(product.price)}
                      </span>
                      <span className="rounded-[var(--radius-full)] bg-dta-beige px-2 py-0.5 text-xs text-dta-char">
                        {product.category}
                      </span>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          ) : (
            <p className="mt-10 text-center text-dta-char/60">
              La boutique ouvre bientôt.
            </p>
          )}

          <div className="mt-8 text-center sm:hidden">
            <Link
              href="/marketplace"
              className="text-sm font-medium text-dta-accent"
            >
              Explorer la marketplace &rarr;
            </Link>
          </div>
        </div>
      </section>

      {/* ── F. Latest Articles ── */}
      <section className="px-4 py-20 sm:py-28">
        <div className="mx-auto max-w-7xl sm:px-6 lg:px-8">
          <div className="flex items-end justify-between">
            <div>
              <h2 className="font-serif text-3xl font-bold text-dta-dark sm:text-4xl">
                L&apos;Afropéen — Le journal
              </h2>
              <p className="mt-3 text-dta-char/70">
                Actualités, culture et lifestyle de la diaspora
              </p>
            </div>
            <Link
              href="/journal"
              className="hidden items-center gap-1 text-sm font-medium text-dta-accent transition-colors hover:text-dta-accent-dark sm:flex"
            >
              Lire le journal <ArrowRight size={14} />
            </Link>
          </div>

          {articles.length > 0 ? (
            <div className="mt-10 grid grid-cols-1 gap-6 lg:grid-cols-5">
              {/* Featured article */}
              {featuredArticle && (
                <Link
                  href={`/journal/${featuredArticle.slug}`}
                  className="group lg:col-span-3 rounded-[var(--radius-card)] bg-white shadow-[var(--shadow-card)] transition-all duration-300 hover:shadow-[var(--shadow-card-hover)] hover:-translate-y-1 overflow-hidden"
                >
                  <div className="relative aspect-[16/10] overflow-hidden bg-gradient-to-br from-dta-accent/20 to-dta-sand">
                    {featuredArticle.coverImage && (
                      <Image src={featuredArticle.coverImage} alt={featuredArticle.title} fill className="object-cover transition-transform duration-300 group-hover:scale-105" sizes="(max-width: 1024px) 100vw, 60vw" />
                    )}
                  </div>
                  <div className="p-6">
                    <div className="mb-3 flex items-center gap-2">
                      <span
                        className={`rounded-[var(--radius-full)] px-3 py-1 text-xs font-medium ${categoryColors[featuredArticle.category] || ""}`}
                      >
                        {featuredArticle.category}
                      </span>
                      <span className="text-xs text-dta-taupe">
                        {formatDate(featuredArticle.publishedAt)}
                      </span>
                    </div>
                    <h3 className="font-serif text-xl font-bold text-dta-dark transition-colors group-hover:text-dta-accent sm:text-2xl">
                      {featuredArticle.title}
                    </h3>
                    <p className="mt-2 line-clamp-2 text-sm text-dta-char/70">
                      {featuredArticle.excerpt}
                    </p>
                    <p className="mt-4 text-xs text-dta-taupe">
                      Par {featuredArticle.author.name}
                    </p>
                  </div>
                </Link>
              )}

              {/* Stacked smaller article cards */}
              <div className="flex flex-col gap-4 lg:col-span-2">
                {otherArticles.map((article) => (
                  <Link
                    key={article.id}
                    href={`/journal/${article.slug}`}
                    className="group flex gap-4 rounded-[var(--radius-card)] bg-white p-5 shadow-[var(--shadow-card)] transition-all duration-300 hover:shadow-[var(--shadow-card-hover)]"
                  >
                    <div className="relative h-24 w-24 flex-shrink-0 overflow-hidden rounded-lg bg-gradient-to-br from-dta-accent/15 to-dta-sand">
                      {article.coverImage && (
                        <Image src={article.coverImage} alt={article.title} fill className="object-cover" sizes="96px" />
                      )}
                    </div>
                    <div className="min-w-0 flex-1">
                      <span
                        className={`inline-block rounded-[var(--radius-full)] px-2 py-0.5 text-[10px] font-medium ${categoryColors[article.category] || ""}`}
                      >
                        {article.category}
                      </span>
                      <h3 className="mt-1 font-serif text-sm font-semibold leading-snug text-dta-dark transition-colors group-hover:text-dta-accent line-clamp-2">
                        {article.title}
                      </h3>
                      <p className="mt-1 text-xs text-dta-taupe">
                        {formatDate(article.publishedAt)}
                      </p>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          ) : (
            <p className="mt-10 text-center text-dta-char/60">
              Les articles arrivent bientôt.
            </p>
          )}

          <div className="mt-8 text-center sm:hidden">
            <Link
              href="/journal"
              className="text-sm font-medium text-dta-accent"
            >
              Lire le journal &rarr;
            </Link>
          </div>
        </div>
      </section>

      {/* ── G. L'Officiel d'Afrique Promo ── */}
      <section className="bg-dta-dark px-4 py-20 sm:py-28">
        <div className="mx-auto max-w-7xl sm:px-6 lg:px-8">
          <div className="mx-auto max-w-2xl text-center">
            <p className="text-sm font-medium uppercase tracking-[0.15em] text-dta-accent">
              Nouveau
            </p>
            <h2 className="mt-4 font-serif text-3xl font-bold text-white sm:text-4xl">
              L&apos;Officiel d&apos;Afrique 2026
            </h2>
            <p className="mt-4 text-lg leading-relaxed text-dta-sand/80">
              Le premier annuaire professionnel de la diaspora africaine à
              Paris. Référencez votre entreprise gratuitement auprès de
              milliers de professionnels et particuliers.
            </p>
            <Link
              href="/officiel-afrique"
              className="mt-8 inline-flex items-center gap-2 rounded-[var(--radius-button)] bg-dta-accent px-8 py-4 text-sm font-semibold text-white transition-all duration-300 hover:bg-dta-accent-dark hover:shadow-lg"
            >
              Inscrire mon entreprise
              <ArrowRight size={16} />
            </Link>
          </div>
        </div>
      </section>

      {/* ── H. Community CTA ── */}
      <section className="px-4 py-20 sm:py-28">
        <div className="mx-auto max-w-7xl sm:px-6 lg:px-8">
          <div className="rounded-[var(--radius-card)] bg-gradient-to-br from-dta-beige to-white px-8 py-16 text-center sm:px-16">
            <h2 className="font-serif text-3xl font-bold text-dta-dark sm:text-4xl">
              Rejoignez la communauté
            </h2>
            <p className="mx-auto mt-4 max-w-xl text-dta-char/70">
              Que vous soyez amateur de culture, artisan créateur ou
              professionnel, Dream Team Africa est votre plateforme.
            </p>
            <div className="mt-8 flex flex-col items-center justify-center gap-4 sm:flex-row">
              <Link
                href="/auth/signup"
                className="inline-flex items-center rounded-[var(--radius-button)] bg-dta-accent px-8 py-3.5 text-sm font-semibold text-white transition-all duration-300 hover:bg-dta-accent-dark"
              >
                Créer un compte
              </Link>
              <Link
                href="/auth/signup?role=artisan"
                className="inline-flex items-center rounded-[var(--radius-button)] border-2 border-dta-accent px-8 py-3.5 text-sm font-semibold text-dta-accent transition-all duration-300 hover:bg-dta-accent hover:text-white"
              >
                Devenir artisan
              </Link>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}

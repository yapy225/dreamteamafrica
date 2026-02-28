import Link from "next/link";
import Image from "next/image";
import { prisma } from "@/lib/db";
import { formatDate, formatPrice } from "@/lib/utils";
import {
  Calendar,
  ShoppingBag,
  Newspaper,
  Megaphone,
  MapPin,
  ArrowRight,
} from "lucide-react";
import ArticleCard from "@/components/journal/ArticleCard";
import Newsletter from "@/components/journal/Newsletter";
import styles from "./home.module.css";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "Accueil — Culture africaine à Paris",
  description:
    "Événements culturels, marketplace artisanale, journal L'Afropéen et L'Officiel d'Afrique. La plateforme de référence pour la culture africaine à Paris.",
  openGraph: {
    title: "Dream Team Africa — Culture africaine à Paris",
    description:
      "Événements exclusifs, marketplace artisanale et journal de la diaspora. La culture africaine rayonne à Paris.",
    type: "website",
  },
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
        where: { status: "PUBLISHED" },
        include: { author: { select: { name: true } } },
        orderBy: { publishedAt: "desc" },
        take: 3,
      }),
      prisma.event.count({ where: { published: true } }),
      prisma.product.count({ where: { published: true } }),
      prisma.article.count({ where: { status: "PUBLISHED" } }),
    ]);

  const featuredEvent = events[0];
  const otherEvents = events.slice(1);

  const featuredArticle = articles[0];
  const sideArticles = articles.slice(1);

  return (
    <>
      {/* ══ 1. Hero Cinématique ══ */}
      <section
        className={`relative min-h-screen overflow-hidden bg-dta-dark ${styles.grainOverlay}`}
      >
        {/* Kente strip */}
        <div className="absolute inset-x-0 top-0 z-10 h-[1.5px] bg-gradient-to-r from-dta-accent via-emerald-700 to-dta-accent" />

        {/* Background gradients */}
        <div className="absolute inset-0 bg-gradient-to-br from-dta-dark via-dta-char to-dta-dark" />
        <div className="absolute inset-0 opacity-15">
          <div className="h-full w-full bg-[radial-gradient(ellipse_at_top_right,_var(--color-dta-accent)_0%,_transparent_50%)]" />
        </div>
        <div className="absolute inset-0 opacity-[0.08]">
          <div className="h-full w-full bg-[radial-gradient(ellipse_at_bottom_left,_#166534_0%,_transparent_40%)]" />
        </div>

        <div className="relative flex min-h-screen flex-col justify-between px-4 sm:px-6 lg:px-8">
          {/* Main hero content */}
          <div className="mx-auto flex w-full max-w-7xl flex-1 items-center">
            <div className="max-w-3xl">
              <p className="mag-fade-up mag-d1 text-xs font-medium uppercase tracking-[0.25em] text-dta-accent">
                Saison 2026 &mdash; Paris
              </p>
              <h1 className="mag-fade-up mag-d2 mt-6 font-serif text-5xl font-bold leading-[1.05] text-white sm:text-6xl lg:text-8xl">
                La culture africaine
                <br />
                <span className="text-dta-accent">rayonne à Paris</span>
              </h1>
              <p className="mag-fade-up mag-d3 mt-8 max-w-xl font-serif text-lg italic leading-relaxed text-dta-sand/80">
                Événements exclusifs, marketplace artisanale et journal de la
                diaspora. Vivez la saison culturelle africaine 2026.
              </p>
              <div className="mag-fade-up mag-d4 mt-10 flex flex-col gap-4 sm:flex-row">
                <Link
                  href="/evenements"
                  className="inline-flex items-center justify-center gap-2 rounded-[var(--radius-button)] bg-dta-accent px-8 py-4 text-sm font-semibold text-white transition-all duration-300 hover:bg-dta-accent-dark hover:shadow-lg"
                >
                  Découvrir les événements
                  <ArrowRight size={16} />
                </Link>
                <Link
                  href="/marketplace"
                  className="inline-flex items-center justify-center rounded-[var(--radius-button)] border border-white/30 px-8 py-4 text-sm font-semibold text-white transition-all duration-300 hover:border-white hover:bg-white/5"
                >
                  Explorer la marketplace
                </Link>
              </div>
            </div>
          </div>

          {/* Stats ribbon */}
          <div className="mag-fade-up mag-d7 mx-auto w-full max-w-7xl">
            <div className="rounded-t-2xl bg-white/5 px-5 py-6 backdrop-blur-md sm:px-8">
              <div className="flex items-center justify-center gap-6 text-center sm:justify-start sm:gap-16">
                <div>
                  <span className="font-serif text-3xl font-bold text-white sm:text-4xl">
                    {eventCount}
                  </span>
                  <p className="mt-1 text-[10px] uppercase tracking-wider text-dta-sand/60 sm:text-xs">
                    événements
                  </p>
                </div>
                <div className="h-8 w-px bg-white/10" />
                <div>
                  <span className="font-serif text-3xl font-bold text-white sm:text-4xl">
                    {productCount}
                  </span>
                  <p className="mt-1 text-[10px] uppercase tracking-wider text-dta-sand/60 sm:text-xs">
                    créations
                  </p>
                </div>
                <div className="h-8 w-px bg-white/10" />
                <div>
                  <span className="font-serif text-3xl font-bold text-white sm:text-4xl">
                    {articleCount}
                  </span>
                  <p className="mt-1 text-[10px] uppercase tracking-wider text-dta-sand/60 sm:text-xs">
                    articles
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ══ 2. Bandeau Saison ══ */}
      <section className="bg-dta-accent py-4">
        <p className="text-center text-sm font-semibold tracking-wide text-white">
          &mdash; Saison Culturelle Africaine 2026 &mdash; Avril à Décembre
          &mdash; Paris &mdash;
        </p>
      </section>

      {/* ══ 3. Événements ══ */}
      <section className="bg-dta-beige px-4 py-20 sm:py-28">
        <div className="mx-auto max-w-7xl sm:px-6 lg:px-8">
          {/* Editorial header */}
          <div className="mb-12">
            <div className="mag-fade-up mb-4 h-px w-16 bg-dta-accent" />
            <p className="mag-fade-up mag-d1 text-xs font-medium uppercase tracking-[0.2em] text-dta-accent">
              Agenda
            </p>
            <div className="flex items-end justify-between">
              <div>
                <h2 className="mag-fade-up mag-d2 mt-3 font-serif text-4xl font-bold text-dta-dark sm:text-5xl">
                  Prochains événements
                </h2>
                <p className="mag-fade-up mag-d3 mt-3 font-serif italic text-dta-char/70">
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
          </div>

          {events.length > 0 ? (
            <div className="grid grid-cols-1 gap-6 lg:grid-cols-12">
              {/* Featured event — immersive card */}
              {featuredEvent && (
                <Link
                  href={`/evenements/${featuredEvent.slug}`}
                  className="group relative col-span-1 min-h-[360px] overflow-hidden rounded-[var(--radius-card)] sm:min-h-[480px] lg:col-span-7"
                >
                  <div className="absolute inset-0 bg-gradient-to-br from-dta-accent/30 to-dta-sand">
                    {featuredEvent.coverImage && (
                      <Image
                        src={featuredEvent.coverImage}
                        alt={featuredEvent.title}
                        fill
                        className="object-cover transition-transform duration-500 group-hover:scale-105"
                        sizes="(max-width: 1024px) 100vw, 58vw"
                      />
                    )}
                  </div>
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
                  <div className="relative flex h-full min-h-[360px] flex-col justify-end p-5 sm:min-h-[480px] sm:p-8">
                    <div className="mb-3 flex items-center gap-3">
                      <span className="rounded-full bg-dta-accent px-4 py-1 text-xs font-semibold text-white">
                        {formatDate(featuredEvent.date)}
                      </span>
                      <span className="flex items-center gap-1 text-xs text-white/80">
                        <MapPin size={12} /> {featuredEvent.venue}
                      </span>
                    </div>
                    <h3 className="font-serif text-2xl font-bold text-white sm:text-3xl">
                      {featuredEvent.title}
                    </h3>
                    <p className="mt-2 line-clamp-2 max-w-lg text-sm text-white/80">
                      {featuredEvent.description}
                    </p>
                    <div className="mt-4 flex items-center justify-between">
                      <span className="text-sm font-semibold text-white">
                        À partir de {formatPrice(featuredEvent.priceEarly)}
                      </span>
                      <span className="text-sm font-medium text-white opacity-0 transition-opacity group-hover:opacity-100">
                        Voir les détails &rarr;
                      </span>
                    </div>
                  </div>
                </Link>
              )}

              {/* Stacked event cards */}
              <div className="col-span-1 flex flex-col gap-4 lg:col-span-5">
                {otherEvents.map((event) => (
                  <Link
                    key={event.id}
                    href={`/evenements/${event.slug}`}
                    className="group flex items-start gap-4 rounded-[var(--radius-card)] bg-white p-5 shadow-[var(--shadow-card)] transition-all duration-300 hover:shadow-[var(--shadow-card-hover)]"
                  >
                    {/* Thumbnail */}
                    <div className="relative h-20 w-20 flex-shrink-0 overflow-hidden rounded-lg bg-gradient-to-br from-dta-accent/20 to-dta-sand">
                      {event.coverImage && (
                        <Image
                          src={event.coverImage}
                          alt={event.title}
                          fill
                          className="object-cover"
                          sizes="80px"
                        />
                      )}
                      {/* Date callout */}
                      <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/40 text-center">
                        <span className="block text-[10px] font-semibold uppercase text-white/80">
                          {new Intl.DateTimeFormat("fr-FR", {
                            month: "short",
                          }).format(new Date(event.date))}
                        </span>
                        <span className="block font-serif text-xl font-bold text-white">
                          {new Date(event.date).getDate()}
                        </span>
                      </div>
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

      {/* ══ 4. Citation Éditoriale ══ */}
      <section className="bg-dta-bg px-4 py-24">
        <div className="mx-auto max-w-3xl text-center">
          {/* Editorial divider */}
          <div className={styles.editorialDivider}>
            <span />
          </div>

          <blockquote className="mt-10 font-serif text-3xl font-light leading-[1.3] text-dta-dark sm:text-4xl lg:text-5xl">
            &laquo;&nbsp;Événements, marketplace et média réunis pour célébrer
            la richesse de la culture africaine en Europe.&nbsp;&raquo;
          </blockquote>
          <p className="mt-6 text-sm font-medium uppercase tracking-[0.15em] text-dta-taupe">
            &mdash; Dream Team Africa
          </p>

          {/* Icon links */}
          <div className="mt-10 flex items-center justify-center gap-8">
            <Link
              href="/evenements"
              className="flex flex-col items-center gap-2 text-dta-taupe transition-colors hover:text-dta-accent"
            >
              <Calendar size={22} />
              <span className="text-[10px] uppercase tracking-wider">
                Agenda
              </span>
            </Link>
            <Link
              href="/marketplace"
              className="flex flex-col items-center gap-2 text-dta-taupe transition-colors hover:text-dta-accent"
            >
              <ShoppingBag size={22} />
              <span className="text-[10px] uppercase tracking-wider">
                Boutique
              </span>
            </Link>
            <Link
              href="/journal"
              className="flex flex-col items-center gap-2 text-dta-taupe transition-colors hover:text-dta-accent"
            >
              <Newspaper size={22} />
              <span className="text-[10px] uppercase tracking-wider">
                Journal
              </span>
            </Link>
            <Link
              href="/ads"
              className="flex flex-col items-center gap-2 text-dta-taupe transition-colors hover:text-dta-accent"
            >
              <Megaphone size={22} />
              <span className="text-[10px] uppercase tracking-wider">
                Publicité
              </span>
            </Link>
          </div>
        </div>
      </section>

      {/* ══ 5. Marketplace ══ */}
      <section className="bg-dta-dark px-4 py-20 sm:py-28">
        <div className="mx-auto max-w-7xl sm:px-6 lg:px-8">
          {/* Editorial header — white */}
          <div className="mb-12">
            <div className="mb-4 h-px w-16 bg-dta-accent" />
            <p className="text-xs font-medium uppercase tracking-[0.2em] text-dta-accent">
              Marketplace
            </p>
            <div className="flex items-end justify-between">
              <div>
                <h2 className="mt-3 font-serif text-4xl font-bold text-white sm:text-5xl">
                  Créations artisanales
                </h2>
                <p className="mt-3 font-serif italic text-dta-sand/70">
                  Des pièces uniques façonnées par les meilleurs artisans
                </p>
              </div>
              <Link
                href="/marketplace"
                className="hidden items-center gap-1 text-sm font-medium text-dta-accent transition-colors hover:text-dta-accent-light sm:flex"
              >
                Explorer <ArrowRight size={14} />
              </Link>
            </div>
          </div>

          {products.length > 0 ? (
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-12">
              {/* P1: portrait */}
              {products[0] && (
                <Link
                  href={`/marketplace/${products[0].slug}`}
                  className="group relative col-span-1 overflow-hidden rounded-[var(--radius-card)] sm:col-span-1 lg:col-span-5 lg:row-span-2"
                >
                  <div className="relative aspect-[3/4] lg:aspect-auto lg:h-full">
                    <div className="absolute inset-0 bg-gradient-to-br from-dta-sand to-dta-beige">
                      {products[0].images[0] && (
                        <Image
                          src={products[0].images[0]}
                          alt={products[0].name}
                          fill
                          className="object-cover transition-transform duration-500 group-hover:scale-105"
                          sizes="(max-width: 1024px) 100vw, 42vw"
                        />
                      )}
                    </div>
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                    <div className="absolute inset-x-0 bottom-0 p-6">
                      <h3 className="font-serif text-lg font-bold text-white">
                        {products[0].name}
                      </h3>
                      <p className="mt-1 text-xs text-white/70">
                        par {products[0].artisan.name}
                      </p>
                      <p className="mt-2 font-serif text-xl font-bold text-white">
                        {formatPrice(products[0].price)}
                      </p>
                    </div>
                  </div>
                </Link>
              )}

              {/* P2: landscape */}
              {products[1] && (
                <Link
                  href={`/marketplace/${products[1].slug}`}
                  className="group relative col-span-1 overflow-hidden rounded-[var(--radius-card)] sm:col-span-1 lg:col-span-7"
                >
                  <div className="relative aspect-[16/10]">
                    <div className="absolute inset-0 bg-gradient-to-br from-dta-sand to-dta-beige">
                      {products[1].images[0] && (
                        <Image
                          src={products[1].images[0]}
                          alt={products[1].name}
                          fill
                          className="object-cover transition-transform duration-500 group-hover:scale-105"
                          sizes="(max-width: 1024px) 100vw, 58vw"
                        />
                      )}
                    </div>
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                    <div className="absolute inset-x-0 bottom-0 p-6">
                      <h3 className="font-serif text-lg font-bold text-white">
                        {products[1].name}
                      </h3>
                      <p className="mt-1 text-xs text-white/70">
                        par {products[1].artisan.name}
                      </p>
                      <p className="mt-2 font-serif text-xl font-bold text-white">
                        {formatPrice(products[1].price)}
                      </p>
                    </div>
                  </div>
                </Link>
              )}

              {/* P3: landscape */}
              {products[2] && (
                <Link
                  href={`/marketplace/${products[2].slug}`}
                  className="group relative col-span-1 overflow-hidden rounded-[var(--radius-card)] sm:col-span-1 lg:col-span-7"
                >
                  <div className="relative aspect-[16/10]">
                    <div className="absolute inset-0 bg-gradient-to-br from-dta-sand to-dta-beige">
                      {products[2].images[0] && (
                        <Image
                          src={products[2].images[0]}
                          alt={products[2].name}
                          fill
                          className="object-cover transition-transform duration-500 group-hover:scale-105"
                          sizes="(max-width: 1024px) 100vw, 58vw"
                        />
                      )}
                    </div>
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                    <div className="absolute inset-x-0 bottom-0 p-6">
                      <h3 className="font-serif text-lg font-bold text-white">
                        {products[2].name}
                      </h3>
                      <p className="mt-1 text-xs text-white/70">
                        par {products[2].artisan.name}
                      </p>
                      <p className="mt-2 font-serif text-xl font-bold text-white">
                        {formatPrice(products[2].price)}
                      </p>
                    </div>
                  </div>
                </Link>
              )}

              {/* P4: portrait */}
              {products[3] && (
                <Link
                  href={`/marketplace/${products[3].slug}`}
                  className="group relative col-span-1 overflow-hidden rounded-[var(--radius-card)] sm:col-span-1 lg:col-span-5 lg:row-span-2"
                >
                  <div className="relative aspect-[3/4] lg:aspect-auto lg:h-full">
                    <div className="absolute inset-0 bg-gradient-to-br from-dta-sand to-dta-beige">
                      {products[3].images[0] && (
                        <Image
                          src={products[3].images[0]}
                          alt={products[3].name}
                          fill
                          className="object-cover transition-transform duration-500 group-hover:scale-105"
                          sizes="(max-width: 1024px) 100vw, 42vw"
                        />
                      )}
                    </div>
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                    <div className="absolute inset-x-0 bottom-0 p-6">
                      <h3 className="font-serif text-lg font-bold text-white">
                        {products[3].name}
                      </h3>
                      <p className="mt-1 text-xs text-white/70">
                        par {products[3].artisan.name}
                      </p>
                      <p className="mt-2 font-serif text-xl font-bold text-white">
                        {formatPrice(products[3].price)}
                      </p>
                    </div>
                  </div>
                </Link>
              )}
            </div>
          ) : (
            <p className="mt-10 text-center text-dta-sand/60">
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

      {/* ══ 6. L'Afropéen — Articles ══ */}
      <section className="bg-dta-beige px-4 py-20 sm:py-28">
        <div className="mx-auto max-w-7xl sm:px-6 lg:px-8">
          {/* Editorial header */}
          <div className="mb-12">
            <div className="mb-4 h-px w-16 bg-dta-accent" />
            <p className="text-xs font-medium uppercase tracking-[0.2em] text-dta-accent">
              L&apos;Afropéen
            </p>
            <div className="flex items-end justify-between">
              <div>
                <h2 className="mt-3 font-serif text-4xl font-bold text-dta-dark sm:text-5xl">
                  Le journal
                </h2>
                <p className="mt-3 font-serif italic text-dta-char/70">
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
          </div>

          {articles.length > 0 ? (
            <div className="grid grid-cols-1 gap-6 lg:grid-cols-5">
              {/* Featured article — hero variant */}
              {featuredArticle && (
                <div className="lg:col-span-3">
                  <ArticleCard
                    article={featuredArticle}
                    variant="hero"
                    showLifecycleDay
                  />
                </div>
              )}

              {/* Side articles */}
              <div className="flex flex-col gap-4 lg:col-span-2">
                {sideArticles.map((article) => (
                  <ArticleCard
                    key={article.id}
                    article={article}
                    variant="side"
                    showLifecycleDay
                  />
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

      {/* ══ 7. L'Officiel d'Afrique ══ */}
      <section className="bg-dta-dark px-4 py-20 sm:py-28">
        <div className="mx-auto max-w-7xl sm:px-6 lg:px-8">
          <div className="relative grid grid-cols-1 items-center gap-8 lg:grid-cols-5">
            {/* Text — left 60% */}
            <div className="lg:col-span-3">
              <span className="inline-block rounded-full bg-dta-accent/20 px-4 py-1.5 text-xs font-semibold uppercase tracking-wider text-dta-accent">
                Nouveau
              </span>
              <h2 className="mt-6 font-serif text-4xl font-bold text-white sm:text-5xl">
                L&apos;Officiel d&apos;Afrique 2026
              </h2>
              <p className="mt-4 max-w-lg font-serif text-lg italic leading-relaxed text-dta-sand/80">
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

            {/* Decorative watermark — right */}
            <div className="hidden select-none lg:col-span-2 lg:flex lg:items-center lg:justify-center">
              <span className="font-serif text-[180px] font-bold leading-none text-white/[0.03]">
                2026
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* ══ 8. Newsletter ══ */}
      <Newsletter />

      {/* ══ 9. Communauté ══ */}
      <section className="bg-gradient-to-b from-dta-bg to-dta-beige px-4 py-20 sm:py-28">
        <div className="mx-auto max-w-3xl text-center">
          {/* Editorial divider */}
          <div className={styles.editorialDivider}>
            <span />
          </div>

          <h2 className="mt-10 font-serif text-4xl font-bold text-dta-dark sm:text-5xl">
            Rejoignez la communauté
          </h2>
          <p className="mt-4 font-serif italic text-dta-char/70">
            Que vous soyez amateur de culture, artisan créateur ou
            professionnel, Dream Team Africa est votre plateforme.
          </p>

          <div className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row">
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

          {/* Stats recall */}
          <div className="mt-14 flex items-center justify-center gap-6 sm:gap-10">
            <div>
              <span className="font-serif text-2xl font-bold text-dta-accent sm:text-3xl">
                {eventCount}
              </span>
              <p className="mt-1 text-[10px] uppercase tracking-wider text-dta-taupe sm:text-xs">
                événements
              </p>
            </div>
            <div className="h-6 w-px bg-dta-taupe/30" />
            <div>
              <span className="font-serif text-2xl font-bold text-dta-accent sm:text-3xl">
                {productCount}
              </span>
              <p className="mt-1 text-[10px] uppercase tracking-wider text-dta-taupe sm:text-xs">
                créations
              </p>
            </div>
            <div className="h-6 w-px bg-dta-taupe/30" />
            <div>
              <span className="font-serif text-2xl font-bold text-dta-accent sm:text-3xl">
                {articleCount}
              </span>
              <p className="mt-1 text-[10px] uppercase tracking-wider text-dta-taupe sm:text-xs">
                articles
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ══ 10. Colophon Éditorial ══ */}
      <section className="bg-dta-dark py-8">
        <div className="flex items-center justify-center gap-3">
          <Image
            src="/logo-dta.png"
            alt="Dream Team Africa"
            width={32}
            height={32}
            className="opacity-40"
          />
          <p className="text-xs text-dta-sand/40">
            Dream Team Africa &mdash; Paris, 2026
          </p>
        </div>
      </section>
    </>
  );
}

import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import {
  ArrowRight,
  Music,
  Users,
  Clock,
  MapPin,
  Star,
  Sparkles,
  Theater,
  Building2,
  GraduationCap,
  Heart,
  CheckCircle2,
} from "lucide-react";
import DevisForm from "./DevisForm";

const siteUrl = process.env.NEXT_PUBLIC_APP_URL || "https://dreamteamafrica.com";

export const metadata: Metadata = {
  title: "Danse Zaouli a Paris — cours & spectacles | Dream Team Africa",
  description:
    "Decouvrez le Zaouli, danse traditionnelle de Cote d'Ivoire. Cours de danse Zaouli a Paris, spectacles, animations comite d'entreprise. Dream Team Africa, specialiste de la culture africaine.",
  keywords: [
    "danse zaouli paris",
    "cours danse zaouli",
    "spectacle zaouli",
    "danse traditionnelle africaine paris",
    "danse cote d'ivoire",
    "animation africaine comite entreprise",
    "spectacle danse africaine",
    "cours danse africaine paris",
    "zaouli dance",
    "troupe danse africaine paris",
  ],
  openGraph: {
    title: "Danse Zaouli a Paris — cours & spectacles | Dream Team Africa",
    description:
      "Cours de danse Zaouli et production de spectacles traditionnels africains a Paris. Comite d'entreprise, theatres, festivals.",
    type: "website",
    url: `${siteUrl}/danse-zaouli-paris`,
    images: [
      {
        url: "https://dreamteamafricamedia.b-cdn.net/dansezaouliparis/zaouli-1920x1080%20.png",
        width: 1920,
        height: 1080,
        alt: "Danse Zaouli — Dream Team Africa",
      },
    ],
  },
  alternates: { canonical: `${siteUrl}/danse-zaouli-paris` },
};

const TARIFS_COURS = [
  {
    title: "Cours decouverte",
    price: "20",
    unit: "/ personne",
    duration: "1h30",
    desc: "Initiation aux pas de base du Zaouli. Ouvert a tous, aucune experience requise.",
    features: ["Echauffement rythme aux percussions", "Apprentissage des pas fondamentaux", "Initiation aux mouvements de bras", "Moment de partage culturel"],
    highlight: false,
  },
  {
    title: "Stage intensif",
    price: "75",
    unit: "/ personne",
    duration: "Demi-journee (3h)",
    desc: "Approfondissement technique et immersion dans l'univers du Zaouli avec un maitre danseur.",
    features: ["Technique avancee du Zaouli", "Histoire et signification des mouvements", "Accompagnement live aux percussions", "Video souvenir du stage", "Certificat de participation"],
    highlight: true,
  },
  {
    title: "Cours collectif hebdo",
    price: "150",
    unit: "/ mois",
    duration: "1h30 / semaine",
    desc: "Abonnement mensuel pour progresser regulierement. Cours chaque semaine avec suivi personnalise.",
    features: ["4 cours de 1h30 par mois", "Progression adaptee a votre niveau", "Percussions live", "Acces au groupe prive WhatsApp", "Spectacle de fin d'annee"],
    highlight: false,
  },
  {
    title: "Cours prive / entreprise",
    price: "Sur devis",
    unit: "",
    duration: "Selon vos besoins",
    desc: "Prestation sur mesure pour votre groupe, association, CE ou evenement prive.",
    features: ["A partir de 8 participants", "Lieu de votre choix ou dans nos locaux", "Danseurs et percussionnistes dedies", "Team building & cohesion d'equipe", "Formule adaptable (1h a journee)"],
    highlight: false,
  },
];

const SPECTACLES = [
  {
    icon: Theater,
    title: "Spectacle en theatre",
    desc: "Production complete avec danseurs, percussionnistes et costumes traditionnels. De 30 min a 1h30 de spectacle.",
  },
  {
    icon: Building2,
    title: "Comite d'entreprise",
    desc: "Animation culturelle pour vos evenements d'entreprise : seminaire, soiree de gala, journee de cohesion.",
  },
  {
    icon: Music,
    title: "Festival & evenement public",
    desc: "Prestation pour festivals, fetes de la musique, carnavals, journees du patrimoine, inaugurations.",
  },
  {
    icon: GraduationCap,
    title: "Milieu scolaire & MJC",
    desc: "Ateliers pedagogiques et representations pour ecoles, colleges, centres culturels et MJC.",
  },
  {
    icon: Heart,
    title: "Mariages & evenements prives",
    desc: "Entree des maries, animation de soiree, spectacle surprise. Un moment inoubliable pour vos invites.",
  },
  {
    icon: Users,
    title: "Collectivites & mairies",
    desc: "Spectacles pour journees interculturelles, fetes de quartier, celebrations officielles.",
  },
];

export default function DanseZaouliParis() {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "LocalBusiness",
    name: "Dream Team Africa — Danse Zaouli",
    description:
      "Cours de danse Zaouli et production de spectacles de danse traditionnelle africaine a Paris.",
    url: `${siteUrl}/danse-zaouli-paris`,
    telephone: "+33751443774",
    email: "hello@dreamteamafrica.com",
    address: {
      "@type": "PostalAddress",
      addressLocality: "Paris",
      addressCountry: "FR",
    },
    priceRange: "$$",
    makesOffer: [
      {
        "@type": "Offer",
        name: "Cours decouverte Zaouli",
        price: "20",
        priceCurrency: "EUR",
      },
      {
        "@type": "Offer",
        name: "Stage intensif Zaouli",
        price: "75",
        priceCurrency: "EUR",
      },
      {
        "@type": "Offer",
        name: "Abonnement mensuel Zaouli",
        price: "150",
        priceCurrency: "EUR",
      },
    ],
  };

  return (
    <div className="min-h-screen bg-white">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      {/* ───── Hero ───── */}
      <section className="relative overflow-hidden bg-dta-dark">
        <div className="absolute inset-0">
          <Image
            src="https://dreamteamafricamedia.b-cdn.net/dansezaouliparis/zaouli-1920x1080%20.png"
            alt="Spectacle de danse Zaouli"
            fill
            className="object-cover opacity-40"
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-t from-dta-dark via-dta-dark/60 to-transparent" />
        </div>
        <div className="relative mx-auto max-w-7xl px-4 pb-16 pt-28 sm:px-6 lg:px-8 lg:pb-24 lg:pt-36">
          <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-dta-accent">
            <Sparkles size={16} />
            Danse traditionnelle africaine
          </div>
          <h1 className="mt-4 max-w-3xl font-serif text-4xl font-bold text-white sm:text-5xl lg:text-6xl">
            Le Zaouli — cours de danse &amp; spectacles a Paris
          </h1>
          <p className="mt-5 max-w-2xl text-base leading-relaxed text-dta-sand/80">
            Originaire du peuple Gouro de <strong className="text-white">Cote d&apos;Ivoire</strong>,
            le Zaouli est l&apos;une des danses les plus rapides et les plus spectaculaires d&apos;Afrique
            de l&apos;Ouest. Inscrit au <strong className="text-white">patrimoine immateriel de
            l&apos;UNESCO</strong>, le Zaouli fascine par sa virtuosite, ses masques colores et ses
            rythmes envooutants. <strong className="text-white">Dream Team Africa</strong> vous propose
            des cours de danse et la production de spectacles Zaouli a Paris et en Ile-de-France.
          </p>
          <div className="mt-8 flex flex-wrap gap-4">
            <a
              href="#tarifs"
              className="inline-flex items-center gap-2 rounded-[var(--radius-button)] bg-dta-accent px-6 py-3 text-sm font-semibold text-white transition-colors hover:bg-dta-accent-dark"
            >
              Voir les tarifs des cours
              <ArrowRight size={16} />
            </a>
            <a
              href="#devis"
              className="inline-flex items-center gap-2 rounded-[var(--radius-button)] border border-white/30 px-6 py-3 text-sm font-semibold text-white transition-colors hover:bg-white/10"
            >
              Demander un devis spectacle
            </a>
          </div>
        </div>
      </section>

      {/* ───── Qu'est-ce que le Zaouli ? ───── */}
      <section className="bg-white px-4 py-16 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <div className="grid grid-cols-1 items-center gap-12 lg:grid-cols-2">
            <div>
              <h2 className="font-serif text-2xl font-bold text-dta-dark sm:text-3xl">
                Qu&apos;est-ce que le Zaouli ?
              </h2>
              <div className="mt-4 space-y-4 text-sm leading-relaxed text-dta-char/80">
                <p>
                  Le <strong>Zaouli</strong> est une danse traditionnelle nee dans les annees 1950
                  au sein du peuple Gouro, dans le centre-ouest de la Cote d&apos;Ivoire. Elle tire son
                  nom de <strong>Djela Lou Zaouli</strong>, une jeune fille d&apos;une beaute
                  legendaire dont le masque est inspire.
                </p>
                <p>
                  Le danseur, dissimule derriere un masque finement sculpte et pare de costumes
                  multicolores, execute des mouvements de jambes d&apos;une rapidite stupefiant, tout
                  en maintenant le haut du corps parfaitement immobile. Cette prouesse technique,
                  accompagnee par un ensemble de percussions, cree un spectacle hypnotique.
                </p>
                <p>
                  En 2017, le Zaouli a ete inscrit sur la liste representative du{" "}
                  <strong>patrimoine culturel immateriel de l&apos;humanite par l&apos;UNESCO</strong>,
                  reconnaissant son importance culturelle et sa contribution au patrimoine mondial.
                </p>
              </div>
            </div>
            <div className="relative aspect-[4/3] overflow-hidden rounded-[var(--radius-card)]">
              <Image
                src="https://dreamteamafricamedia.b-cdn.net/dansezaouliparis/zaouli-1080x1080.png"
                alt="Masque et costume traditionnel Zaouli"
                fill
                className="object-cover"
              />
            </div>
          </div>
        </div>
      </section>

      {/* ───── Cours de danse — Grille tarifaire ───── */}
      <section id="tarifs" className="bg-dta-beige/40 px-4 py-16 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <div className="text-center">
            <div className="flex items-center justify-center gap-2 text-xs font-bold uppercase tracking-widest text-dta-accent">
              <Music size={16} />
              Cours de danse
            </div>
            <h2 className="mt-3 font-serif text-2xl font-bold text-dta-dark sm:text-3xl">
              Nos formules de cours Zaouli
            </h2>
            <p className="mx-auto mt-3 max-w-xl text-sm text-dta-char/70">
              Du cours decouverte au stage intensif, trouvez la formule qui vous convient.
              Tous nos cours sont animes par des danseurs professionnels accompagnes de
              percussionnistes live.
            </p>
          </div>

          <div className="mt-10 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {TARIFS_COURS.map((t) => (
              <div
                key={t.title}
                className={`relative flex flex-col rounded-[var(--radius-card)] border p-6 transition-all duration-300 hover:-translate-y-1 hover:shadow-[var(--shadow-card-hover)] ${
                  t.highlight
                    ? "border-dta-accent bg-white shadow-lg ring-2 ring-dta-accent/20"
                    : "border-dta-sand/40 bg-white shadow-[var(--shadow-card)]"
                }`}
              >
                {t.highlight && (
                  <span className="absolute -top-3 left-1/2 -translate-x-1/2 rounded-full bg-dta-accent px-4 py-1 text-[10px] font-bold uppercase tracking-wider text-white">
                    Populaire
                  </span>
                )}
                <h3 className="font-serif text-lg font-bold text-dta-dark">{t.title}</h3>
                <div className="mt-3 flex items-baseline gap-1">
                  <span className="font-serif text-3xl font-bold text-dta-accent">
                    {t.price === "Sur devis" ? "" : `${t.price}\u00A0\u20AC`}
                  </span>
                  {t.price === "Sur devis" ? (
                    <span className="font-serif text-xl font-bold text-dta-accent">Sur devis</span>
                  ) : (
                    <span className="text-sm text-dta-taupe">{t.unit}</span>
                  )}
                </div>
                <div className="mt-2 flex items-center gap-2 text-xs text-dta-taupe">
                  <Clock size={12} />
                  {t.duration}
                </div>
                <p className="mt-3 text-sm leading-relaxed text-dta-char/70">{t.desc}</p>
                <ul className="mt-4 flex-1 space-y-2">
                  {t.features.map((f) => (
                    <li key={f} className="flex items-start gap-2 text-xs text-dta-char/80">
                      <CheckCircle2 size={14} className="mt-0.5 shrink-0 text-dta-accent" />
                      {f}
                    </li>
                  ))}
                </ul>
                <a
                  href={t.price === "Sur devis" ? "#devis" : "/nous-contacter"}
                  className={`mt-6 block rounded-[var(--radius-button)] px-4 py-2.5 text-center text-sm font-semibold transition-colors ${
                    t.highlight
                      ? "bg-dta-accent text-white hover:bg-dta-accent-dark"
                      : "border border-dta-accent text-dta-accent hover:bg-dta-accent hover:text-white"
                  }`}
                >
                  {t.price === "Sur devis" ? "Demander un devis" : "Reserver"}
                </a>
              </div>
            ))}
          </div>

          <p className="mt-8 text-center text-xs text-dta-taupe">
            Tarifs TTC. Les cours ont lieu a Paris et en Ile-de-France. Deplacement possible en province (frais en sus).
          </p>
        </div>
      </section>

      {/* ───── Galerie ───── */}
      <section className="bg-white px-4 py-16 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <h2 className="text-center font-serif text-2xl font-bold text-dta-dark sm:text-3xl">
            Le Zaouli en images
          </h2>
          <div className="mt-8 grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-3">
            {[
              { src: "https://dreamteamafricamedia.b-cdn.net/dansezaouliparis/zaouli-1920x1080%20.png", alt: "Spectacle de danse Zaouli" },
              { src: "https://dreamteamafricamedia.b-cdn.net/dansezaouliparis/zaouli-1080x1080.png", alt: "Masque Zaouli traditionnel" },
              { src: "https://dreamteamafricamedia.b-cdn.net/dansezaouliparis/zaouli-1080x1920.png", alt: "Danseur Zaouli en costume" },
            ].map((img) => (
              <div key={img.src} className="relative aspect-square overflow-hidden rounded-[var(--radius-card)]">
                <Image
                  src={img.src}
                  alt={img.alt}
                  fill
                  className="object-cover transition-transform duration-500 hover:scale-105"
                />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ───── Spectacles & prestations ───── */}
      <section className="bg-dta-beige/30 px-4 py-16 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <div className="text-center">
            <div className="flex items-center justify-center gap-2 text-xs font-bold uppercase tracking-widest text-dta-accent">
              <Star size={16} />
              Production &amp; distribution de spectacles
            </div>
            <h2 className="mt-3 font-serif text-2xl font-bold text-dta-dark sm:text-3xl">
              Un spectacle Zaouli pour votre evenement
            </h2>
            <p className="mx-auto mt-3 max-w-2xl text-sm text-dta-char/70">
              Dream Team Africa produit et distribue des spectacles de danse Zaouli authentiques
              pour tous types d&apos;evenements. Nos danseurs professionnels, accompagnes de
              percussionnistes, offrent une experience immersive et inoubliable.
            </p>
          </div>

          <div className="mt-10 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {SPECTACLES.map((s) => (
              <div
                key={s.title}
                className="group rounded-[var(--radius-card)] border border-dta-sand/40 bg-white p-6 shadow-[var(--shadow-card)] transition-all duration-300 hover:-translate-y-0.5 hover:shadow-[var(--shadow-card-hover)]"
              >
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-dta-accent/10 text-dta-accent transition-colors group-hover:bg-dta-accent group-hover:text-white">
                  <s.icon size={22} />
                </div>
                <h3 className="mt-4 font-serif text-lg font-bold text-dta-dark">
                  {s.title}
                </h3>
                <p className="mt-2 text-sm leading-relaxed text-dta-char/70">{s.desc}</p>
              </div>
            ))}
          </div>

          <div className="mt-10 text-center">
            <a
              href="#devis"
              className="inline-flex items-center gap-2 rounded-[var(--radius-button)] bg-dta-accent px-8 py-3 text-sm font-semibold text-white transition-colors hover:bg-dta-accent-dark"
            >
              Demander un devis gratuit
              <ArrowRight size={16} />
            </a>
          </div>
        </div>
      </section>

      {/* ───── Pourquoi nous choisir ───── */}
      <section className="bg-white px-4 py-16 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <h2 className="text-center font-serif text-2xl font-bold text-dta-dark sm:text-3xl">
            Pourquoi choisir Dream Team Africa ?
          </h2>
          <div className="mt-10 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {[
              {
                icon: Users,
                title: "Danseurs professionnels",
                desc: "Nos artistes sont originaires de Cote d'Ivoire et pratiquent le Zaouli depuis l'enfance.",
              },
              {
                icon: Music,
                title: "Percussions live",
                desc: "Tous nos cours et spectacles sont accompagnes par un ensemble de percussionnistes en live.",
              },
              {
                icon: Sparkles,
                title: "Costumes authentiques",
                desc: "Masques sculptes et costumes traditionnels confectionnes par des artisans ivoiriens.",
              },
              {
                icon: MapPin,
                title: "Partout en France",
                desc: "Nous nous deplacons a Paris, en Ile-de-France et dans toute la France pour vos evenements.",
              },
            ].map((item) => (
              <div key={item.title} className="text-center">
                <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-dta-accent/10 text-dta-accent">
                  <item.icon size={24} />
                </div>
                <h3 className="mt-4 font-serif text-base font-bold text-dta-dark">{item.title}</h3>
                <p className="mt-2 text-sm text-dta-char/70">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ───── Formulaire de devis ───── */}
      <section id="devis" className="bg-dta-beige/40 px-4 py-16 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <div className="grid grid-cols-1 items-start gap-12 lg:grid-cols-2">
            <div>
              <h2 className="font-serif text-2xl font-bold text-dta-dark sm:text-3xl">
                Votre spectacle Zaouli sur mesure
              </h2>
              <p className="mt-4 text-sm leading-relaxed text-dta-char/80">
                Que vous organisiez un evenement d&apos;entreprise, un festival, un mariage ou une
                representation en theatre, nous concevons une prestation adaptee a vos besoins.
              </p>
              <ul className="mt-6 space-y-3">
                {[
                  "Devis gratuit sous 48h",
                  "Prestation cle en main (danseurs, musiciens, costumes, son)",
                  "De 2 a 10 artistes selon votre evenement",
                  "Spectacle de 20 min a 1h30",
                  "Atelier participatif possible en complement",
                  "Deplacement dans toute la France",
                ].map((item) => (
                  <li key={item} className="flex items-start gap-3 text-sm text-dta-char/80">
                    <CheckCircle2 size={16} className="mt-0.5 shrink-0 text-dta-accent" />
                    {item}
                  </li>
                ))}
              </ul>
              <div className="mt-8 rounded-[var(--radius-card)] border border-dta-sand/40 bg-white p-5">
                <p className="text-sm font-semibold text-dta-dark">Besoin d&apos;un renseignement rapide ?</p>
                <p className="mt-1 text-sm text-dta-char/70">
                  Appelez-nous au{" "}
                  <a href="tel:+33751443774" className="font-semibold text-dta-accent hover:underline">
                    07 51 44 37 74
                  </a>{" "}
                  ou ecrivez a{" "}
                  <a href="mailto:hello@dreamteamafrica.com" className="font-semibold text-dta-accent hover:underline">
                    hello@dreamteamafrica.com
                  </a>
                </p>
              </div>
            </div>
            <DevisForm />
          </div>
        </div>
      </section>

      {/* ───── Maillage interne ───── */}
      <section className="bg-dta-bg px-4 py-14 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <h2 className="font-serif text-2xl font-bold text-dta-dark">A decouvrir aussi</h2>
          <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {[
              { title: "Spectacles africains a Paris", href: "/spectacle-africain-paris", emoji: "\uD83C\uDFAD" },
              { title: "Concerts afro a Paris", href: "/concert-afro-paris", emoji: "\uD83C\uDFB5" },
              { title: "Saison Culturelle Africaine 2026", href: "/saison-culturelle-africaine", emoji: "\uD83C\uDF1F" },
              { title: "Activites culturelles a Paris", href: "/activites-culturelles-paris", emoji: "\uD83C\uDFA8" },
              { title: "Que faire a Paris ce weekend ?", href: "/que-faire-paris-ce-weekend", emoji: "\uD83D\uDDFC" },
              { title: "Nous contacter", href: "/nous-contacter", emoji: "\uD83D\uDCE9" },
            ].map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="group flex items-center gap-3 rounded-[var(--radius-card)] border border-dta-sand/40 bg-white p-4 transition-all hover:bg-dta-accent/5 hover:shadow-sm"
              >
                <span className="text-2xl">{item.emoji}</span>
                <span className="text-sm font-semibold text-dta-dark transition-colors group-hover:text-dta-accent">
                  {item.title}
                </span>
                <ArrowRight size={14} className="ml-auto text-dta-taupe group-hover:text-dta-accent" />
              </Link>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}

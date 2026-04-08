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

function WhatsAppIcon({ size = 20 }: { size?: number }) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="currentColor">
      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
    </svg>
  );
}
import DevisForm from "./DevisForm";

const siteUrl = process.env.NEXT_PUBLIC_APP_URL || "https://dreamteamafrica.com";

export const metadata: Metadata = {
  title: "Danse Zaouli à Paris — cours & spectacles | Dream Team Africa",
  description:
    "Découvrez le Zaouli, danse traditionnelle de Côte d'Ivoire. Cours de danse Zaouli à Paris, spectacles, animations comité d'entreprise. Dream Team Africa, spécialiste de la culture africaine.",
  keywords: [
    "danse zaouli paris",
    "cours danse zaouli",
    "spectacle zaouli",
    "danse traditionnelle africaine paris",
    "danse côte d'ivoire",
    "animation africaine comité entreprise",
    "spectacle danse africaine",
    "cours danse africaine paris",
    "zaouli dance",
    "troupe danse africaine paris",
  ],
  openGraph: {
    title: "Danse Zaouli à Paris — cours & spectacles | Dream Team Africa",
    description:
      "Cours de danse Zaouli et production de spectacles traditionnels africains à Paris. Comité d'entreprise, théâtres, festivals.",
    type: "website",
    url: `${siteUrl}/danse-zaouli-paris`,
    images: [
      {
        url: "https://dreamteamafricamedia.b-cdn.net/dansezaouliparis/zaouli-1920x1080.png",
        width: 1920,
        height: 1080,
        alt: "Danse Zaouli — Dream Team Africa",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Danse Zaouli à Paris — cours & spectacles | Dream Team Africa",
    description:
      "Cours de danse Zaouli et spectacles traditionnels africains à Paris. Comité d'entreprise, théâtres, festivals.",
    images: ["https://dreamteamafricamedia.b-cdn.net/dansezaouliparis/zaouli-1920x1080.png"],
  },
  alternates: { canonical: `${siteUrl}/danse-zaouli-paris` },
};

const FORMULES_COURS = [
  {
    title: "Cours découverte",
    duration: "1h30",
    desc: "Initiation aux pas de base du Zaouli. Ouvert à tous, aucune expérience requise.",
    features: ["Échauffement rythmé aux percussions", "Apprentissage des pas fondamentaux", "Initiation aux mouvements de bras", "Moment de partage culturel"],
  },
  {
    title: "Stage intensif",
    duration: "Demi-journée (3h)",
    desc: "Approfondissement technique et immersion dans l'univers du Zaouli avec un maître danseur.",
    features: ["Technique avancée du Zaouli", "Histoire et signification des mouvements", "Accompagnement live aux percussions", "Vidéo souvenir du stage", "Certificat de participation"],
    highlight: true,
  },
  {
    title: "Cours collectif hebdo",
    duration: "1h30 / semaine",
    desc: "Abonnement mensuel pour progresser régulièrement. Cours chaque semaine avec suivi personnalisé.",
    features: ["4 cours de 1h30 par mois", "Progression adaptée à votre niveau", "Percussions live", "Accès au groupe privé WhatsApp", "Spectacle de fin d'année"],
  },
  {
    title: "Cours privé / entreprise",
    duration: "Selon vos besoins",
    desc: "Prestation sur mesure pour votre groupe, association, CE ou événement privé.",
    features: ["À partir de 8 participants", "Lieu de votre choix ou dans nos locaux", "Danseurs et percussionnistes dédiés", "Team building & cohésion d'équipe", "Formule adaptable (1h à journée)"],
  },
];

const WHATSAPP_COURS_URL = "https://wa.me/33751443774?text=Bonjour%20Dream%20Team%20Africa%20%21%20Je%20suis%20int%C3%A9ress%C3%A9(e)%20par%20vos%20cours%20de%20danse%20Zaouli.%20Pouvez-vous%20me%20donner%20plus%20d%27informations%20sur%20les%20tarifs%20et%20disponibilit%C3%A9s%20%3F";

const SPECTACLES = [
  {
    icon: Theater,
    title: "Spectacle en théâtre",
    desc: "Production complète avec danseurs, percussionnistes et costumes traditionnels. De 30 min à 1h30 de spectacle.",
  },
  {
    icon: Building2,
    title: "Comité d'entreprise",
    desc: "Animation culturelle pour vos événements d'entreprise : séminaire, soirée de gala, journée de cohésion.",
  },
  {
    icon: Music,
    title: "Festival & événement public",
    desc: "Prestation pour festivals, fêtes de la musique, carnavals, journées du patrimoine, inaugurations.",
  },
  {
    icon: GraduationCap,
    title: "Milieu scolaire & MJC",
    desc: "Ateliers pédagogiques et représentations pour écoles, collèges, centres culturels et MJC.",
  },
  {
    icon: Heart,
    title: "Mariages & événements privés",
    desc: "Entrée des mariés, animation de soirée, spectacle surprise. Un moment inoubliable pour vos invités.",
  },
  {
    icon: Users,
    title: "Collectivités & mairies",
    desc: "Spectacles pour journées interculturelles, fêtes de quartier, célébrations officielles.",
  },
];

export default function DanseZaouliParis() {
  const jsonLd = [
    {
      "@context": "https://schema.org",
      "@type": "LocalBusiness",
      name: "Dream Team Africa — Danse Zaouli",
      description:
        "Cours de danse Zaouli et production de spectacles de danse traditionnelle africaine à Paris.",
      url: `${siteUrl}/danse-zaouli-paris`,
      telephone: "+33751443774",
      email: "hello@dreamteamafrica.com",
      image: "https://dreamteamafricamedia.b-cdn.net/dansezaouliparis/zaouli-1920x1080.png",
      address: {
        "@type": "PostalAddress",
        addressLocality: "Paris",
        addressRegion: "Île-de-France",
        addressCountry: "FR",
      },
      geo: {
        "@type": "GeoCoordinates",
        latitude: 48.8566,
        longitude: 2.3522,
      },
      areaServed: [
        { "@type": "City", name: "Paris" },
        { "@type": "State", name: "Île-de-France" },
        { "@type": "Country", name: "France" },
      ],
      priceRange: "$$",
      makesOffer: [
        {
          "@type": "Offer",
          name: "Cours de danse Zaouli",
          availability: "https://schema.org/InStock",
          description: "Cours de danse Zaouli à Paris — découverte, stage intensif, cours hebdo, cours privé",
        },
        {
          "@type": "Offer",
          name: "Spectacle de danse Zaouli",
          availability: "https://schema.org/InStock",
          description: "Production et distribution de spectacles Zaouli pour théâtres, festivals, comités d'entreprise, mariages",
        },
      ],
    },
    {
      "@context": "https://schema.org",
      "@type": "FAQPage",
      mainEntity: [
        {
          "@type": "Question",
          name: "Qu'est-ce que la danse Zaouli ?",
          acceptedAnswer: {
            "@type": "Answer",
            text: "Le Zaouli est une danse traditionnelle originaire du peuple Gouro de Côte d'Ivoire, née dans les années 1950. Inscrite au patrimoine immatériel de l'UNESCO en 2017, elle se caractérise par des mouvements de jambes d'une rapidité extraordinaire, un masque sculpté coloré et un accompagnement aux percussions.",
          },
        },
        {
          "@type": "Question",
          name: "Faut-il avoir de l'expérience pour suivre un cours de Zaouli ?",
          acceptedAnswer: {
            "@type": "Answer",
            text: "Non, nos cours découverte sont ouverts à tous, sans aucune expérience préalable. Nos danseurs professionnels adaptent leur enseignement à chaque niveau, du débutant complet au danseur confirmé.",
          },
        },
        {
          "@type": "Question",
          name: "Où se déroulent les cours de danse Zaouli à Paris ?",
          acceptedAnswer: {
            "@type": "Answer",
            text: "Les cours ont lieu à Paris et en Île-de-France. Pour les cours privés et prestations entreprise, nous nous déplaçons dans le lieu de votre choix, partout en France.",
          },
        },
        {
          "@type": "Question",
          name: "Comment réserver un spectacle Zaouli pour un événement ?",
          acceptedAnswer: {
            "@type": "Answer",
            text: "Remplissez notre formulaire de devis en ligne ou contactez-nous par WhatsApp au 07 51 44 37 74. Nous vous envoyons une proposition personnalisée sous 48h, adaptée à votre événement (théâtre, comité d'entreprise, mariage, festival, collectivité).",
          },
        },
        {
          "@type": "Question",
          name: "Combien de danseurs pour un spectacle Zaouli ?",
          acceptedAnswer: {
            "@type": "Answer",
            text: "Nos prestations mobilisent de 2 à 10 artistes (danseurs et percussionnistes) selon la taille de votre événement et vos souhaits. Le spectacle dure de 20 minutes à 1h30, avec possibilité d'atelier participatif en complément.",
          },
        },
      ],
    },
  ];

  return (
    <div className="min-h-screen bg-white">
      {jsonLd.map((schema, i) => (
        <script
          key={i}
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
        />
      ))}

      {/* ───── Hero ───── */}
      <section className="relative overflow-hidden bg-dta-dark">
        <div className="absolute inset-0">
          <Image
            src="https://dreamteamafricamedia.b-cdn.net/dansezaouliparis/zaouli-1920x1080.png"
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
            Le Zaouli — cours de danse &amp; spectacles à Paris
          </h1>
          <p className="mt-5 max-w-2xl text-base leading-relaxed text-dta-sand/80">
            Originaire du peuple Gouro de <strong className="text-white">Côte d&apos;Ivoire</strong>,
            le Zaouli est l&apos;une des danses les plus rapides et les plus spectaculaires d&apos;Afrique
            de l&apos;Ouest. Inscrit au <strong className="text-white">patrimoine immatériel de
            l&apos;UNESCO</strong>, le Zaouli fascine par sa virtuosité, ses masques colorés et ses
            rythmes envoûtants. <strong className="text-white">Dream Team Africa</strong> vous propose
            des cours de danse et la production de spectacles Zaouli à Paris et en Île-de-France.
          </p>
          <div className="mt-8 flex flex-wrap gap-4">
            <a
              href="#tarifs"
              className="inline-flex items-center gap-2 rounded-[var(--radius-button)] bg-dta-accent px-6 py-3 text-sm font-semibold text-white transition-colors hover:bg-dta-accent-dark"
            >
              Découvrir nos cours
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
                  Le <strong>Zaouli</strong> est une danse traditionnelle née dans les années 1950
                  au sein du peuple Gouro, dans le centre-ouest de la Côte d&apos;Ivoire. Elle tire son
                  nom de <strong>Djela Lou Zaouli</strong>, une jeune fille d&apos;une beauté
                  légendaire dont le masque est inspiré.
                </p>
                <p>
                  Le danseur, dissimulé derrière un masque finement sculpté et paré de costumes
                  multicolores, exécute des mouvements de jambes d&apos;une rapidité stupéfiante, tout
                  en maintenant le haut du corps parfaitement immobile. Cette prouesse technique,
                  accompagnée par un ensemble de percussions, crée un spectacle hypnotique.
                </p>
                <p>
                  En 2017, le Zaouli a été inscrit sur la liste représentative du{" "}
                  <strong>patrimoine culturel immatériel de l&apos;humanité par l&apos;UNESCO</strong>,
                  reconnaissant son importance culturelle et sa contribution au patrimoine mondial.
                </p>
                <p>
                  À Paris, le Zaouli s&apos;inscrit dans une scène culturelle africaine en plein essor.
                  La{" "}
                  <Link href="/saison-culturelle-africaine" className="font-semibold text-dta-accent hover:underline">
                    Saison Culturelle Africaine 2026
                  </Link>{" "}
                  met à l&apos;honneur les arts vivants du continent, avec notamment{" "}
                  <Link href="/saison-culturelle-africaine/juste-une-danse" className="font-semibold text-dta-accent hover:underline">
                    Juste Une Danse
                  </Link>
                  , un événement dédié à la danse africaine sous toutes ses formes. Retrouvez également nos{" "}
                  <Link href="/spectacle-africain-paris" className="font-semibold text-dta-accent hover:underline">
                    spectacles africains à Paris
                  </Link>{" "}
                  et les{" "}
                  <Link href="/activites-culturelles-paris" className="font-semibold text-dta-accent hover:underline">
                    activités culturelles
                  </Link>{" "}
                  à découvrir dans la capitale.
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
              Nos formules de cours de Zaouli
            </h2>
            <p className="mx-auto mt-3 max-w-xl text-sm text-dta-char/70">
              Du cours découverte au stage intensif, trouvez la formule qui vous convient.
              Tous nos cours sont animés par des danseurs professionnels accompagnés de
              percussionnistes live.
            </p>
          </div>

          <div className="mt-10 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {FORMULES_COURS.map((t) => (
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
              </div>
            ))}
          </div>

          <div className="mt-10 text-center">
            <a
              href={WHATSAPP_COURS_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-3 rounded-[var(--radius-button)] bg-[#25D366] px-8 py-3.5 text-sm font-semibold text-white shadow-lg transition-all hover:bg-[#1fb855] hover:shadow-xl"
            >
              <WhatsAppIcon size={20} />
              Contactez-nous sur WhatsApp pour les tarifs
            </a>
            <p className="mt-3 text-xs text-dta-taupe">
              Réponse rapide — tarifs et disponibilités sur demande
            </p>
          </div>
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
              { src: "https://dreamteamafricamedia.b-cdn.net/dansezaouliparis/zaouli-1920x1080.png", alt: "Spectacle de danse Zaouli" },
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
              Un spectacle Zaouli pour votre événement
            </h2>
            <p className="mx-auto mt-3 max-w-2xl text-sm text-dta-char/70">
              Dream Team Africa produit et distribue des spectacles de danse Zaouli authentiques
              pour tous types d&apos;événements. Nos danseurs professionnels, accompagnés de
              percussionnistes, offrent une expérience immersive et inoubliable.
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
                desc: "Nos artistes sont originaires de Côte d'Ivoire et pratiquent le Zaouli depuis l'enfance.",
              },
              {
                icon: Music,
                title: "Percussions live",
                desc: "Tous nos cours et spectacles sont accompagnés par un ensemble de percussionnistes en live.",
              },
              {
                icon: Sparkles,
                title: "Costumes authentiques",
                desc: "Masques sculptés et costumes traditionnels confectionnés par des artisans ivoiriens.",
              },
              {
                icon: MapPin,
                title: "Partout en France",
                desc: "Nous nous déplaçons à Paris, en Île-de-France et dans toute la France pour vos événements.",
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
                Que vous organisiez un événement d&apos;entreprise, un festival, un mariage ou une
                représentation en théâtre, nous concevons une prestation adaptée à vos besoins.
              </p>
              <ul className="mt-6 space-y-3">
                {[
                  "Devis gratuit sous 48h",
                  "Prestation clé en main (danseurs, musiciens, costumes, son)",
                  "De 2 à 10 artistes selon votre événement",
                  "Spectacle de 20 min à 1h30",
                  "Atelier participatif possible en complément",
                  "Déplacement dans toute la France",
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
                  ou écrivez à{" "}
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

      {/* ───── FAQ ───── */}
      <section className="bg-white px-4 py-16 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-3xl">
          <h2 className="text-center font-serif text-2xl font-bold text-dta-dark sm:text-3xl">
            Questions fréquentes
          </h2>
          <div className="mt-8 space-y-4">
            {[
              {
                q: "Qu'est-ce que la danse Zaouli ?",
                a: "Le Zaouli est une danse traditionnelle originaire du peuple Gouro de Côte d'Ivoire, née dans les années 1950. Inscrite au patrimoine immatériel de l'UNESCO en 2017, elle se caractérise par des mouvements de jambes d'une rapidité extraordinaire, un masque sculpté coloré et un accompagnement aux percussions.",
              },
              {
                q: "Faut-il avoir de l'expérience pour suivre un cours ?",
                a: "Non, nos cours découverte sont ouverts à tous, sans aucune expérience préalable. Nos danseurs professionnels adaptent leur enseignement à chaque niveau, du débutant complet au danseur confirmé.",
              },
              {
                q: "Où se déroulent les cours à Paris ?",
                a: "Les cours ont lieu à Paris et en Île-de-France. Pour les cours privés et prestations entreprise, nous nous déplaçons dans le lieu de votre choix, partout en France.",
              },
              {
                q: "Comment réserver un spectacle pour un événement ?",
                a: "Remplissez notre formulaire de devis en ligne ou contactez-nous par WhatsApp au 07 51 44 37 74. Nous vous envoyons une proposition personnalisée sous 48h.",
              },
              {
                q: "Combien de danseurs pour un spectacle ?",
                a: "Nos prestations mobilisent de 2 à 10 artistes (danseurs et percussionnistes) selon la taille de votre événement. Le spectacle dure de 20 minutes à 1h30, avec possibilité d'atelier participatif.",
              },
            ].map((faq) => (
              <details
                key={faq.q}
                className="group rounded-[var(--radius-card)] border border-dta-sand/40 bg-dta-bg transition-all open:shadow-[var(--shadow-card)]"
              >
                <summary className="flex cursor-pointer items-center justify-between p-5 text-sm font-semibold text-dta-dark">
                  {faq.q}
                  <ArrowRight size={16} className="shrink-0 text-dta-taupe transition-transform group-open:rotate-90" />
                </summary>
                <p className="px-5 pb-5 text-sm leading-relaxed text-dta-char/70">
                  {faq.a}
                </p>
              </details>
            ))}
          </div>
        </div>
      </section>

      {/* ───── Maillage interne ───── */}
      <section className="bg-dta-bg px-4 py-14 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <h2 className="font-serif text-2xl font-bold text-dta-dark">À découvrir aussi</h2>
          <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {[
              { title: "Spectacles africains à Paris", href: "/spectacle-africain-paris", emoji: "\uD83C\uDFAD" },
              { title: "Concerts afro à Paris", href: "/concert-afro-paris", emoji: "\uD83C\uDFB5" },
              { title: "Saison Culturelle Africaine 2026", href: "/saison-culturelle-africaine", emoji: "\uD83C\uDF1F" },
              { title: "Activités culturelles à Paris", href: "/activites-culturelles-paris", emoji: "\uD83C\uDFA8" },
              { title: "Que faire à Paris ce weekend ?", href: "/que-faire-paris-ce-weekend", emoji: "\uD83D\uDDFC" },
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

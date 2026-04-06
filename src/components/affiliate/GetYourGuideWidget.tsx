"use client";

import { useEffect, useRef, useState } from "react";
import { Compass, ExternalLink, Star, MapPin } from "lucide-react";

/* ------------------------------------------------------------------ */
/*  Types                                                              */
/* ------------------------------------------------------------------ */

export type GYGTheme =
  | "culture"
  | "museums"
  | "cruises"
  | "food"
  | "fashion"
  | "family"
  | "shows"
  | "music";

interface GetYourGuideWidgetProps {
  /** Ville ciblée (Paris par défaut) */
  city?: string;
  /** Thème d'activités */
  theme?: GYGTheme;
  /** Titre de la section */
  title?: string;
  /** Sous-titre optionnel */
  subtitle?: string;
  /** Nombre max de cartes affichées */
  maxItems?: number;
  /** ID partenaire GetYourGuide */
  partnerId?: string;
  /** Nom de l'événement DTA associé (pour le CTA billetterie) */
  eventName?: string;
  /** Slug de l'événement DTA (pour le lien billetterie) */
  eventSlug?: string;
  /** Source UTM */
  utmSource?: string;
  /** Medium UTM */
  utmMedium?: string;
}

/* ------------------------------------------------------------------ */
/*  Mapping thème → activités curatées                                 */
/* ------------------------------------------------------------------ */

interface CuratedActivity {
  title: string;
  description: string;
  price: string;
  rating: number;
  reviews: string;
  image: string;
  path: string;
  badge?: string;
}

const THEME_CONFIG: Record<
  GYGTheme,
  { keyword: string; label: string; activities: CuratedActivity[] }
> = {
  culture: {
    keyword: "culture",
    label: "Culture & patrimoine",
    activities: [
      {
        title: "Musée du Louvre — billet coupe-file",
        description:
          "Accédez au plus grand musée du monde sans attendre. Mona Lisa, Vénus de Milo et 35 000 œuvres.",
        price: "À partir de 22 €",
        rating: 4.7,
        reviews: "45K+",
        image:
          "https://cdn.getyourguide.com/img/tour/5cb405ea24072.jpeg/98.jpg",
        path: "/paris-l16/louvre-museum-skip-the-line-ticket-t395828/",
        badge: "Populaire",
      },
      {
        title: "Musée du quai Branly — Arts d'Afrique",
        description:
          "Explorez l'une des plus grandes collections d'art africain, asiatique et océanien au monde.",
        price: "À partir de 14 €",
        rating: 4.6,
        reviews: "3K+",
        image:
          "https://cdn.getyourguide.com/img/tour/63e83b27a0c5a.jpeg/98.jpg",
        path: "/paris-l16/musee-du-quai-branly-ticket-t418774/",
      },
      {
        title: "Visite guidée du Marais — histoire & street art",
        description:
          "Découvrez le quartier le plus éclectique de Paris entre patrimoine médiéval et art urbain.",
        price: "À partir de 25 €",
        rating: 4.8,
        reviews: "2K+",
        image:
          "https://cdn.getyourguide.com/img/tour/5db8110a3f22c.jpeg/98.jpg",
        path: "/paris-l16/marais-walking-tour-t67890/",
      },
      {
        title: "Tour Eiffel — accès sommet avec guide",
        description:
          "Montez au sommet de la Dame de Fer accompagné d'un guide expert. Vue à 360° sur Paris.",
        price: "À partir de 59 €",
        rating: 4.5,
        reviews: "28K+",
        image:
          "https://cdn.getyourguide.com/img/tour/5cb401ae58e88.jpeg/98.jpg",
        path: "/paris-l16/eiffel-tower-summit-access-guided-tour-t395839/",
        badge: "Best-seller",
      },
    ],
  },
  museums: {
    keyword: "museums",
    label: "Musées & expositions",
    activities: [
      {
        title: "Musée du quai Branly — Arts d'Afrique",
        description:
          "Collections d'art africain, asiatique et océanien. Incontournable pour les passionnés de culture africaine.",
        price: "À partir de 14 €",
        rating: 4.6,
        reviews: "3K+",
        image:
          "https://cdn.getyourguide.com/img/tour/63e83b27a0c5a.jpeg/98.jpg",
        path: "/paris-l16/musee-du-quai-branly-ticket-t418774/",
        badge: "Art africain",
      },
      {
        title: "Musée d'Orsay — billet coupe-file",
        description:
          "Impressionnisme, post-impressionnisme et art moderne dans l'ancienne gare d'Orsay.",
        price: "À partir de 16 €",
        rating: 4.7,
        reviews: "18K+",
        image:
          "https://cdn.getyourguide.com/img/tour/5cb40617ddd74.jpeg/98.jpg",
        path: "/paris-l16/musee-dorsay-skip-the-line-ticket-t395830/",
        badge: "Populaire",
      },
      {
        title: "Musée du Louvre — billet coupe-file",
        description:
          "Le plus grand musée du monde. Mona Lisa, Vénus de Milo et des milliers d'œuvres.",
        price: "À partir de 22 €",
        rating: 4.7,
        reviews: "45K+",
        image:
          "https://cdn.getyourguide.com/img/tour/5cb405ea24072.jpeg/98.jpg",
        path: "/paris-l16/louvre-museum-skip-the-line-ticket-t395828/",
      },
      {
        title: "Institut du Monde Arabe — expositions",
        description:
          "Art et civilisations du monde arabe. Architecture iconique de Jean Nouvel.",
        price: "À partir de 10 €",
        rating: 4.5,
        reviews: "1K+",
        image:
          "https://cdn.getyourguide.com/img/tour/5f3e8c0f8e4f2.jpeg/98.jpg",
        path: "/paris-l16/institut-monde-arabe-t320561/",
      },
    ],
  },
  cruises: {
    keyword: "cruises",
    label: "Croisières sur la Seine",
    activities: [
      {
        title: "Croisière sur la Seine — 1h",
        description:
          "Naviguez devant la Tour Eiffel, Notre-Dame et le Louvre. Commentaires en français.",
        price: "À partir de 16 €",
        rating: 4.4,
        reviews: "52K+",
        image:
          "https://cdn.getyourguide.com/img/tour/5cb3f88e3db41.jpeg/98.jpg",
        path: "/paris-l16/seine-river-cruise-t395820/",
        badge: "Best-seller",
      },
      {
        title: "Dîner-croisière sur la Seine",
        description:
          "Savourez un dîner gastronomique français tout en admirant Paris illuminé.",
        price: "À partir de 89 €",
        rating: 4.3,
        reviews: "8K+",
        image:
          "https://cdn.getyourguide.com/img/tour/5e4a8d3f2b8c1.jpeg/98.jpg",
        path: "/paris-l16/dinner-cruise-seine-t395835/",
        badge: "Romantique",
      },
      {
        title: "Croisière avec apéritif au coucher du soleil",
        description:
          "Sirotez un verre de champagne en naviguant sur la Seine au soleil couchant.",
        price: "À partir de 39 €",
        rating: 4.6,
        reviews: "5K+",
        image:
          "https://cdn.getyourguide.com/img/tour/6a2b3c4d5e6f7.jpeg/98.jpg",
        path: "/paris-l16/sunset-cruise-champagne-t456789/",
      },
    ],
  },
  food: {
    keyword: "food-tours",
    label: "Gastronomie & food tours",
    activities: [
      {
        title: "Food tour dans le Marais",
        description:
          "Dégustez fromages, pâtisseries, chocolats et spécialités françaises dans le quartier historique.",
        price: "À partir de 65 €",
        rating: 4.8,
        reviews: "4K+",
        image:
          "https://cdn.getyourguide.com/img/tour/5db8110a3f22c.jpeg/98.jpg",
        path: "/paris-l16/marais-food-tour-t395842/",
        badge: "Top noté",
      },
      {
        title: "Cours de cuisine française — macarons",
        description:
          "Apprenez à faire des macarons comme un chef pâtissier parisien.",
        price: "À partir de 85 €",
        rating: 4.9,
        reviews: "2K+",
        image:
          "https://cdn.getyourguide.com/img/tour/5e3c8a2d1b4f5.jpeg/98.jpg",
        path: "/paris-l16/macaron-cooking-class-t395850/",
      },
      {
        title: "Dégustation de vin et fromage",
        description:
          "Initiez-vous à l'art du vin et du fromage dans une cave parisienne authentique.",
        price: "À partir de 49 €",
        rating: 4.7,
        reviews: "3K+",
        image:
          "https://cdn.getyourguide.com/img/tour/5f1a2b3c4d5e6.jpeg/98.jpg",
        path: "/paris-l16/wine-cheese-tasting-t395855/",
      },
    ],
  },
  fashion: {
    keyword: "fashion-shopping",
    label: "Mode & shopping",
    activities: [
      {
        title: "Shopping tour dans le Marais",
        description:
          "Découvrez les meilleures boutiques de créateurs, concept stores et galeries du Marais.",
        price: "À partir de 75 €",
        rating: 4.7,
        reviews: "1K+",
        image:
          "https://cdn.getyourguide.com/img/tour/5db8110a3f22c.jpeg/98.jpg",
        path: "/paris-l16/marais-shopping-tour-t395860/",
      },
      {
        title: "Visite des Galeries Lafayette & shopping",
        description:
          "Explorez le grand magasin iconique de Paris avec un personal shopper.",
        price: "À partir de 35 €",
        rating: 4.5,
        reviews: "2K+",
        image:
          "https://cdn.getyourguide.com/img/tour/5f2a3b4c5d6e7.jpeg/98.jpg",
        path: "/paris-l16/galeries-lafayette-tour-t395865/",
        badge: "Mode",
      },
    ],
  },
  family: {
    keyword: "family",
    label: "En famille",
    activities: [
      {
        title: "Disneyland Paris — billet 1 jour",
        description:
          "Vivez la magie Disney avec toute la famille. Deux parcs, des dizaines d'attractions.",
        price: "À partir de 56 €",
        rating: 4.5,
        reviews: "30K+",
        image:
          "https://cdn.getyourguide.com/img/tour/5cb3f23e12345.jpeg/98.jpg",
        path: "/paris-l16/disneyland-paris-ticket-t395870/",
        badge: "Famille",
      },
      {
        title: "Jardin d'Acclimatation — parc d'attractions",
        description:
          "Manèges, spectacles et ateliers pour les enfants au cœur du Bois de Boulogne.",
        price: "À partir de 7 €",
        rating: 4.4,
        reviews: "5K+",
        image:
          "https://cdn.getyourguide.com/img/tour/5e4b5c6d7e8f9.jpeg/98.jpg",
        path: "/paris-l16/jardin-acclimatation-t395875/",
      },
      {
        title: "Spectacle au Cirque d'Hiver",
        description:
          "Acrobaties, clowns et numéros époustouflants dans le plus ancien cirque de Paris.",
        price: "À partir de 20 €",
        rating: 4.6,
        reviews: "1K+",
        image:
          "https://cdn.getyourguide.com/img/tour/5f3a4b5c6d7e8.jpeg/98.jpg",
        path: "/paris-l16/cirque-hiver-show-t395880/",
      },
    ],
  },
  shows: {
    keyword: "shows",
    label: "Spectacles & concerts",
    activities: [
      {
        title: "Moulin Rouge — spectacle + champagne",
        description:
          "Le cabaret le plus célèbre au monde. Revue Féerie, champagne et paillettes.",
        price: "À partir de 87 €",
        rating: 4.5,
        reviews: "12K+",
        image:
          "https://cdn.getyourguide.com/img/tour/5cb404d7e4321.jpeg/98.jpg",
        path: "/paris-l16/moulin-rouge-show-t395885/",
        badge: "Iconique",
      },
      {
        title: "Lido de Paris — spectacle",
        description:
          "Revue, danse et effets spéciaux sur les Champs-Élysées.",
        price: "À partir de 75 €",
        rating: 4.4,
        reviews: "6K+",
        image:
          "https://cdn.getyourguide.com/img/tour/5e5c6d7e8f9a0.jpeg/98.jpg",
        path: "/paris-l16/lido-paris-show-t395890/",
      },
      {
        title: "Concert de jazz — cave parisienne",
        description:
          "Vivez le jazz dans une cave authentique de Saint-Germain-des-Prés.",
        price: "À partir de 30 €",
        rating: 4.8,
        reviews: "2K+",
        image:
          "https://cdn.getyourguide.com/img/tour/5f4b5c6d7e8f9.jpeg/98.jpg",
        path: "/paris-l16/jazz-concert-cave-t395895/",
      },
    ],
  },
  music: {
    keyword: "concerts",
    label: "Musique & danse",
    activities: [
      {
        title: "Concert de jazz — cave parisienne",
        description:
          "Vivez le jazz dans une cave authentique de Saint-Germain-des-Prés.",
        price: "À partir de 30 €",
        rating: 4.8,
        reviews: "2K+",
        image:
          "https://cdn.getyourguide.com/img/tour/5f4b5c6d7e8f9.jpeg/98.jpg",
        path: "/paris-l16/jazz-concert-cave-t395895/",
        badge: "Ambiance",
      },
      {
        title: "Moulin Rouge — spectacle + champagne",
        description:
          "Le cabaret le plus célèbre au monde. Revue Féerie avec champagne.",
        price: "À partir de 87 €",
        rating: 4.5,
        reviews: "12K+",
        image:
          "https://cdn.getyourguide.com/img/tour/5cb404d7e4321.jpeg/98.jpg",
        path: "/paris-l16/moulin-rouge-show-t395885/",
        badge: "Iconique",
      },
      {
        title: "Opéra Garnier — visite guidée",
        description:
          "Visitez le Palais Garnier, chef-d'œuvre architectural de Charles Garnier.",
        price: "À partir de 16 €",
        rating: 4.7,
        reviews: "8K+",
        image:
          "https://cdn.getyourguide.com/img/tour/5e6d7e8f9a0b1.jpeg/98.jpg",
        path: "/paris-l16/opera-garnier-guided-tour-t395900/",
      },
    ],
  },
};

/* ------------------------------------------------------------------ */
/*  Composant principal                                                */
/* ------------------------------------------------------------------ */

export default function GetYourGuideWidget({
  city = "Paris",
  theme = "culture",
  title,
  subtitle,
  maxItems = 3,
  partnerId = "K7ALFQK",
  eventName,
  eventSlug,
  utmSource = "evenement",
  utmMedium = "widget",
}: GetYourGuideWidgetProps) {
  const sectionRef = useRef<HTMLDivElement>(null);
  const [isVisible, setIsVisible] = useState(false);

  /* Lazy loading via IntersectionObserver */
  useEffect(() => {
    const el = sectionRef.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.disconnect();
        }
      },
      { rootMargin: "200px" },
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  const config = THEME_CONFIG[theme];
  const activities = config.activities.slice(0, maxItems);

  const buildAffiliateUrl = (path: string) =>
    `https://www.getyourguide.fr${path}?partner_id=${partnerId}&utm_medium=${utmMedium}&utm_source=${utmSource}&utm_campaign=gyg&cmp=dreamteamafrica`;

  const seeAllUrl = `https://www.getyourguide.fr/${city.toLowerCase()}-l16/?partner_id=${partnerId}&utm_medium=${utmMedium}&utm_source=${utmSource}&utm_campaign=gyg&cmp=dreamteamafrica`;

  return (
    <section ref={sectionRef} className="py-14">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="flex items-start justify-between gap-4">
          <div>
            <div className="mb-2 flex items-center gap-2">
              <Compass size={18} className="text-dta-accent" />
              <span className="text-xs font-bold uppercase tracking-widest text-dta-accent">
                {config.label}
              </span>
            </div>
            <h2 className="font-serif text-2xl font-bold text-dta-dark sm:text-3xl">
              {title || `Que faire à ${city} ce weekend ?`}
            </h2>
            {subtitle && (
              <p className="mt-2 max-w-2xl text-sm leading-relaxed text-dta-char/70">
                {subtitle}
              </p>
            )}
          </div>
          <a
            href={seeAllUrl}
            target="_blank"
            rel="noopener noreferrer nofollow sponsored"
            className="hidden items-center gap-1.5 rounded-[var(--radius-button)] border border-dta-accent px-4 py-2 text-sm font-semibold text-dta-accent transition-colors hover:bg-dta-accent hover:text-white sm:inline-flex"
          >
            Tout voir
            <ExternalLink size={13} />
          </a>
        </div>

        {/* Grille d'activités */}
        {isVisible && (
          <div className="mt-8 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {activities.map((activity) => (
              <a
                key={activity.path}
                href={buildAffiliateUrl(activity.path)}
                target="_blank"
                rel="noopener noreferrer nofollow sponsored"
                className="group overflow-hidden rounded-[var(--radius-card)] border border-dta-sand/40 bg-white shadow-[var(--shadow-card)] transition-all duration-300 hover:-translate-y-1 hover:shadow-[var(--shadow-card-hover)]"
              >
                {/* Image */}
                <div className="relative aspect-[16/10] overflow-hidden bg-gradient-to-br from-dta-accent/10 to-dta-sand/30">
                  <img
                    src={activity.image}
                    alt={activity.title}
                    loading="lazy"
                    className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                  {activity.badge && (
                    <span className="absolute left-3 top-3 rounded-full bg-dta-accent px-3 py-1 text-[10px] font-bold uppercase tracking-wide text-white shadow-sm">
                      {activity.badge}
                    </span>
                  )}
                  {/* Partenaire tag */}
                  <span className="absolute right-2 top-2 rounded-full bg-black/40 px-2 py-0.5 text-[9px] text-white/80 backdrop-blur-sm">
                    Partenaire
                  </span>
                </div>

                {/* Contenu */}
                <div className="p-4 sm:p-5">
                  <h3 className="font-serif text-base font-bold text-dta-dark transition-colors group-hover:text-dta-accent">
                    {activity.title}
                  </h3>
                  <p className="mt-1.5 line-clamp-2 text-sm leading-relaxed text-dta-char/70">
                    {activity.description}
                  </p>

                  {/* Rating + Price */}
                  <div className="mt-3 flex items-center justify-between">
                    <div className="flex items-center gap-1.5">
                      <Star
                        size={14}
                        className="fill-amber-400 text-amber-400"
                      />
                      <span className="text-sm font-semibold text-dta-dark">
                        {activity.rating}
                      </span>
                      <span className="text-xs text-dta-taupe">
                        ({activity.reviews} avis)
                      </span>
                    </div>
                    <span className="text-sm font-bold text-dta-accent-dark">
                      {activity.price}
                    </span>
                  </div>

                  {/* CTA */}
                  <div className="mt-4 flex items-center justify-center gap-2 rounded-[var(--radius-button)] bg-dta-accent px-4 py-2.5 text-sm font-semibold text-white transition-colors group-hover:bg-dta-accent-dark">
                    Voir les disponibilités
                    <ExternalLink size={13} />
                  </div>
                </div>
              </a>
            ))}
          </div>
        )}

        {/* Voir tout (mobile) */}
        <div className="mt-6 text-center sm:hidden">
          <a
            href={seeAllUrl}
            target="_blank"
            rel="noopener noreferrer nofollow sponsored"
            className="inline-flex items-center gap-1.5 rounded-[var(--radius-button)] border border-dta-accent px-6 py-3 text-sm font-semibold text-dta-accent transition-colors hover:bg-dta-accent hover:text-white"
          >
            Voir toutes les activités à {city}
            <ExternalLink size={13} />
          </a>
        </div>

        {/* CTA Billetterie DTA */}
        {eventName && eventSlug && (
          <div className="mt-8 rounded-[var(--radius-card)] border border-dta-sand/40 bg-gradient-to-r from-dta-accent/5 to-dta-beige/50 p-5 sm:p-6">
            <div className="flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-center">
              <div className="flex items-center gap-3">
                <MapPin size={20} className="flex-shrink-0 text-dta-accent" />
                <div>
                  <p className="text-sm font-semibold text-dta-dark">
                    Vous venez pour {eventName} ?
                  </p>
                  <p className="text-sm text-dta-char/70">
                    Réservez vos places dès maintenant sur Dream Team Africa.
                  </p>
                </div>
              </div>
              <a
                href={`/saison-culturelle-africaine/${eventSlug}`}
                className="inline-flex items-center gap-2 rounded-[var(--radius-button)] bg-dta-dark px-6 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-dta-char"
              >
                Réserver mes places
              </a>
            </div>
          </div>
        )}

        {/* Mention légale affiliée */}
        <p className="mt-4 text-[10px] leading-relaxed text-dta-taupe/60">
          Liens partenaires GetYourGuide — Dream Team Africa perçoit une
          commission de 8% sur chaque réservation effectuée via ces liens, sans
          frais supplémentaires pour vous.
        </p>
      </div>
    </section>
  );
}

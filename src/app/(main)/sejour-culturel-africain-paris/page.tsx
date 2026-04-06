import type { Metadata } from "next";
import Link from "next/link";
import { Hotel, Train, Car, UtensilsCrossed, MapPin, Sparkles, ArrowRight, Calendar, Ticket } from "lucide-react";
import { AffiliateCard, AffiliateDisclosure } from "@/components/affiliate";

export const metadata: Metadata = {
  title: "Séjour culturel africain à Paris 2026 — Guide complet | Dream Team Africa",
  description:
    "Organisez votre séjour culturel africain à Paris : hôtels, transport, restaurants, spas et activités. Guide pratique pour la Saison Culturelle Africaine 2026.",
  keywords: [
    "séjour culturel paris",
    "week-end culturel africain paris",
    "saison culturelle africaine paris 2026",
    "hôtel paris événement africain",
    "restaurant africain paris",
  ],
  openGraph: {
    title: "Séjour culturel africain à Paris 2026 — Guide complet",
    description:
      "Hébergement, transport, restaurants, spas, activités : tout pour votre séjour culturel africain à Paris.",
    type: "website",
    url: "https://dreamteamafrica.com/sejour-culturel-africain-paris",
  },
  alternates: {
    canonical: "https://dreamteamafrica.com/sejour-culturel-africain-paris",
  },
};

const EVENTS = [
  { name: "Foire d'Afrique Paris", date: "1-2 mai 2026", slug: "foire-dafrique-paris" },
  { name: "Évasion Paris", date: "13 juin 2026", slug: "evasion-paris" },
  { name: "Festival de l'Autre Culture", date: "27 juin 2026", slug: "festival-de-lautre-culture" },
  { name: "Fashion Week Africa", date: "3 octobre 2026", slug: "fashion-week-africa" },
];

function SectionTitle({ icon: Icon, title, subtitle }: { icon: typeof Hotel; title: string; subtitle: string }) {
  return (
    <div className="mb-6">
      <div className="flex items-center gap-3">
        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-dta-accent/10 text-dta-accent">
          <Icon size={20} />
        </div>
        <h2 className="font-serif text-2xl font-bold text-dta-dark sm:text-3xl">{title}</h2>
      </div>
      <p className="mt-2 text-sm text-dta-char/70">{subtitle}</p>
    </div>
  );
}

export default function SejourCulturelPage() {
  return (
    <>
      {/* Hero */}
      <section className="relative overflow-hidden bg-dta-dark px-4 py-20 sm:py-28">
        <div className="absolute inset-0 opacity-20">
          <div className="h-full w-full bg-[radial-gradient(ellipse_at_top_right,_var(--color-dta-accent)_0%,_transparent_50%)]" />
        </div>
        <div className="relative mx-auto max-w-3xl text-center">
          <span className="inline-block rounded-full bg-dta-accent/20 px-4 py-1.5 text-xs font-semibold uppercase tracking-wider text-dta-accent-light">
            Guide pratique 2026
          </span>
          <h1 className="mt-6 font-serif text-4xl font-bold leading-tight text-white sm:text-5xl lg:text-6xl">
            Votre séjour culturel africain à Paris
          </h1>
          <p className="mt-6 text-lg leading-relaxed text-dta-sand/80">
            Hébergement, transport, restaurants, bien-être et activités :
            tout ce qu'il faut pour profiter pleinement de la{" "}
            <strong className="text-white">Saison Culturelle Africaine 2026</strong>.
          </p>
        </div>
      </section>

      {/* Quick links — Événements */}
      <section className="border-b border-dta-sand/40 bg-dta-beige px-4 py-10">
        <div className="mx-auto max-w-5xl">
          <h2 className="text-center font-serif text-xl font-bold text-dta-dark">
            Nos prochains événements
          </h2>
          <div className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-4">
            {EVENTS.map((evt) => (
              <Link
                key={evt.slug}
                href={`/saison-culturelle-africaine/${evt.slug}`}
                className="group rounded-[var(--radius-card)] border border-dta-sand/50 bg-white p-4 text-center transition-all hover:-translate-y-0.5 hover:shadow-[var(--shadow-card)]"
              >
                <Calendar size={16} className="mx-auto mb-2 text-dta-accent" />
                <h3 className="text-sm font-semibold text-dta-dark group-hover:text-dta-accent">
                  {evt.name}
                </h3>
                <p className="mt-1 text-xs text-dta-taupe">{evt.date}</p>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Hébergement */}
      <section className="px-4 py-14 sm:py-20" id="hebergement">
        <div className="mx-auto max-w-5xl">
          <SectionTitle
            icon={Hotel}
            title="Où dormir ?"
            subtitle="Les meilleurs hébergements à proximité de nos événements."
          />
          <div className="grid gap-4 sm:grid-cols-2">
            <AffiliateCard
              type="hotel"
              name="Hôtels à Paris 13e"
              description="Proches de l'Espace MAS (Foire d'Afrique, Fashion Week Africa). Filtrez par prix et notes."
              price="À partir de 89€/nuit"
              affiliateUrl="https://www.booking.com/searchresults.html?ss=Paris+13e+arrondissement"
              badge="Recommandé"
            />
            <AffiliateCard
              type="hotel"
              name="Hôtels boutique Paris"
              description="Pour un séjour avec du caractère — hôtels de charme sélectionnés à Paris."
              price="À partir de 120€/nuit"
              affiliateUrl="https://www.booking.com/searchresults.html?ss=Paris&nflt=ht_id%3D204"
              badge="Coup de coeur"
            />
            <AffiliateCard
              type="hotel"
              name="Logement chez l'habitant"
              description="Appartements et chambres au coeur de Paris, idéal pour les séjours en groupe."
              price="À partir de 55€/nuit"
              affiliateUrl="https://www.airbnb.fr/s/Paris--France/homes"
            />
            <AffiliateCard
              type="hotel"
              name="Auberges de jeunesse"
              description="Budget malin pour les jeunes voyageurs et les étudiants."
              price="À partir de 30€/nuit"
              affiliateUrl="https://www.booking.com/searchresults.html?ss=Paris&nflt=ht_id%3D203"
            />
          </div>
        </div>
      </section>

      {/* Transport */}
      <section className="bg-dta-beige/50 px-4 py-14 sm:py-20" id="transport">
        <div className="mx-auto max-w-5xl">
          <SectionTitle
            icon={Train}
            title="Comment venir ?"
            subtitle="Train, avion ou voiture : trouvez la meilleure option."
          />
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            <AffiliateCard
              type="transport"
              name="Drivigo — VTC premium"
              description="Mercedes avec chauffeur, transferts aéroport CDG/Orly, tarif fixe garanti. WiFi, eau offerte."
              price="À partir de 130€"
              affiliateUrl="https://www.drivigo.fr/?ref=dreamteamafrica"
              badge="Premium"
              cta="Réserver"
            />
            <AffiliateCard
              type="transport"
              name="Trainline"
              description="Comparez les billets TGV, Ouigo et TER vers Paris. Meilleur prix garanti."
              price="À partir de 19€"
              affiliateUrl="https://www.thetrainline.com/fr/destinations/trains-pour-paris"
              cta="Comparer"
            />
            <AffiliateCard
              type="transport"
              name="Eurostar"
              description="Londres-Paris en 2h15. Direct vers Gare du Nord."
              price="À partir de 39€"
              affiliateUrl="https://www.eurostar.com/fr-fr"
              cta="Réserver"
            />
            <AffiliateCard
              type="car"
              name="Rentalcars"
              description="Comparez les loueurs de voitures à Paris. Annulation gratuite sur la plupart des réservations."
              price="À partir de 25€/jour"
              affiliateUrl="https://www.rentalcars.com/fr/city/fr/paris/"
              cta="Comparer"
            />
          </div>
        </div>
      </section>

      {/* Restaurants */}
      <section className="px-4 py-14 sm:py-20" id="restaurants">
        <div className="mx-auto max-w-5xl">
          <SectionTitle
            icon={UtensilsCrossed}
            title="Où manger ?"
            subtitle="Les meilleures tables africaines et afro-fusion de Paris."
          />
          <div className="grid gap-4 sm:grid-cols-2">
            <AffiliateCard
              type="restaurant"
              name="Restaurants africains à Paris"
              description="Réservez parmi les meilleurs restaurants africains de la capitale. Jusqu'à -50% sur la carte."
              affiliateUrl="https://www.thefork.fr/recherche?cityId=415144&what=restaurant+africain"
              badge="Promo"
              cta="Réserver une table"
            />
            <AffiliateCard
              type="restaurant"
              name="Restaurants afro-fusion"
              description="Cuisine africaine revisitée par les chefs de la diaspora. Expériences gastronomiques uniques."
              affiliateUrl="https://www.thefork.fr/recherche?cityId=415144&what=afro+fusion"
              cta="Découvrir"
            />
          </div>
        </div>
      </section>

      {/* Bien-être */}
      <section className="bg-dta-beige/50 px-4 py-14 sm:py-20" id="bien-etre">
        <div className="mx-auto max-w-5xl">
          <SectionTitle
            icon={Sparkles}
            title="Se détendre"
            subtitle="Spas, hammams et soins pour récupérer après les événements."
          />
          <div className="grid gap-4 sm:grid-cols-2">
            <AffiliateCard
              type="spa"
              name="Spas à Paris"
              description="Hammams, massages et soins du visage. Réservez en ligne avec des créneaux flexibles."
              affiliateUrl="https://www.treatwell.fr/salons/spa/paris/"
              cta="Réserver un soin"
            />
            <AffiliateCard
              type="spa"
              name="Coffrets Wonderbox"
              description="Offrez ou offrez-vous un coffret spa et bien-être. Le cadeau parfait pour accompagner un billet DTA."
              price="À partir de 29,90€"
              affiliateUrl="https://www.wonderbox.fr/coffret-cadeau/spa-et-soin/"
              cta="Voir les coffrets"
            />
          </div>
        </div>
      </section>

      {/* Activités */}
      <section className="px-4 py-14 sm:py-20" id="activites">
        <div className="mx-auto max-w-5xl">
          <SectionTitle
            icon={MapPin}
            title="Que faire à Paris ?"
            subtitle="Activités culturelles, visites guidées et expériences incontournables."
          />
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            <AffiliateCard
              type="activity"
              name="GetYourGuide"
              description="Visites guidées, croisières sur la Seine, musées : +500 activités à Paris avec annulation gratuite."
              affiliateUrl="https://www.getyourguide.fr/paris-l16/"
              badge="N°1"
              cta="Explorer"
            />
            <AffiliateCard
              type="activity"
              name="Viator"
              description="Expériences uniques à Paris : food tours, ateliers, spectacles. Réservez en ligne."
              affiliateUrl="https://www.viator.com/fr-FR/Paris/d479-ttd"
              cta="Découvrir"
            />
            <AffiliateCard
              type="activity"
              name="Fnac Spectacles"
              description="Concerts, spectacles et expositions à Paris. Billetterie en ligne."
              affiliateUrl="https://www.fnacspectacles.com/place-de-spectacle/lieu-paris-paris-pariszo1.htm"
              cta="Voir l'agenda"
            />
          </div>
        </div>
      </section>

      {/* CTA Billetterie */}
      <section className="bg-dta-dark px-4 py-16 sm:py-20">
        <div className="mx-auto max-w-3xl text-center">
          <Ticket size={32} className="mx-auto mb-4 text-dta-accent" />
          <h2 className="font-serif text-3xl font-bold text-white sm:text-4xl">
            Réservez vos places
          </h2>
          <p className="mt-4 text-lg text-dta-sand/80">
            Découvrez le programme complet de la Saison Culturelle Africaine 2026
            et achetez vos billets en ligne.
          </p>
          <Link
            href="/saison-culturelle-africaine"
            className="mt-8 inline-flex items-center gap-2 rounded-[var(--radius-button)] bg-dta-accent px-8 py-3.5 text-base font-semibold text-white transition-colors hover:bg-dta-accent-dark"
          >
            Voir les événements
            <ArrowRight size={16} />
          </Link>
        </div>
      </section>

      {/* Affiliate Disclosure */}
      <div className="mx-auto max-w-3xl px-4 py-8">
        <AffiliateDisclosure />
      </div>
    </>
  );
}

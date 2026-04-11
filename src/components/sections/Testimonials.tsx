"use client";

import { useEffect, useRef, useState } from "react";
import { usePathname } from "next/navigation";
import { Star } from "lucide-react";

interface Testimonial {
  name: string;
  role: string;
  title: string;
  text: string;
  rating: number;
}

const testimonialsByEvent: Record<string, { label: string; items: Testimonial[] }> = {
  "festival-de-lautre-culture": {
    label: "Festival de l'Autre Culture – 1\u00e8re \u00c9dition",
    items: [
      {
        name: "Sophie Mbemba",
        role: "\u00c9ducatrice sp\u00e9cialis\u00e9e",
        title: "Un rendez-vous \u00e0 ne pas manquer avant les vacances !",
        text: "Merci \u00e0 vous tous \u00e0 Fontenay pour cette belle initiative ! Quel bonheur d\u2019avoir un \u00e9v\u00e9nement comme celui-ci le dernier week-end avant les vacances. C\u2019est exactement ce qu\u2019il nous faut pour finir la saison en beaut\u00e9, tous ensemble. H\u00e2te d\u2019y \u00eatre et de d\u00e9couvrir les artistes sur sc\u00e8ne. On sera l\u00e0 !",
        rating: 5,
      },
      {
        name: "Amadou Diallo",
        role: "Responsable associatif",
        title: "Fontenay, terre de culture et de partage",
        text: "Un grand merci \u00e0 la ville de Fontenay-sous-Bois pour son soutien formidable \u00e0 la culture et \u00e0 la diversit\u00e9. C\u2019est rare de voir une municipalit\u00e9 s\u2019engager autant pour ce type de projet interculturel. Cette premi\u00e8re \u00e9dition promet d\u2019\u00eatre magnifique. Bravo aux organisateurs, on a besoin de ces espaces de rencontre et de transmission.",
        rating: 5,
      },
      {
        name: "Nathalie Kouassi",
        role: "Infirmi\u00e8re lib\u00e9rale",
        title: "Un festival pour toute la famille ?",
        text: "Bonjour ! Je viens de d\u00e9couvrir le festival et j\u2019adore le concept. Petite question : est-ce qu\u2019on peut venir avec les enfants ? J\u2019ai deux petits de 5 et 8 ans et j\u2019aimerais beaucoup leur faire d\u00e9couvrir les danses traditionnelles et l\u2019artisanat. Si c\u2019est adapt\u00e9 aux familles, on sera au rendez-vous avec plaisir. Vivement cette premi\u00e8re \u00e9dition !",
        rating: 5,
      },
    ],
  },
  "foire-dafrique-paris": {
    label: "Foire d\u2019Afrique Paris \u2014 6\u00e8me \u00c9dition",
    items: [
      {
        name: "Fatou Sow",
        role: "Entrepreneuse",
        title: "Mon \u00e9v\u00e9nement pr\u00e9f\u00e9r\u00e9 de l\u2019ann\u00e9e !",
        text: "J\u2019y vais chaque ann\u00e9e et c\u2019est toujours aussi bien. Les exposants sont vari\u00e9s, la nourriture est incroyable et l\u2019ambiance est unique. Cette ann\u00e9e j\u2019ai m\u00eame pu r\u00e9server avec Culture pour Tous, 5\u00a0\u20ac pour bloquer ma place. G\u00e9nial !",
        rating: 5,
      },
      {
        name: "Ibrahim Ciss\u00e9",
        role: "\u00c9tudiant",
        title: "Enfin un \u00e9v\u00e9nement accessible",
        text: "En tant qu\u2019\u00e9tudiant, le budget sorties est serr\u00e9. Gr\u00e2ce \u00e0 Culture pour Tous, j\u2019ai pu r\u00e9server ma place pour 5\u00a0\u20ac et payer le reste tranquillement. Le concept est top, la foire aussi. Je recommande \u00e0 100%.",
        rating: 5,
      },
      {
        name: "Marie-Claire Dup\u00e9",
        role: "Passionn\u00e9e de culture",
        title: "Une immersion totale",
        text: "D\u00e9couvrir 60 exposants, go\u00fbter des plats que je ne connaissais pas, \u00e9couter de la musique live\u2026 La Foire d\u2019Afrique c\u2019est un voyage sans quitter Paris. L\u2019organisation \u00e9tait impeccable. Vivement la prochaine !",
        rating: 5,
      },
    ],
  },
  "festival-cinema-africain": {
    label: "Festival International du Cin\u00e9ma Africain",
    items: [
      {
        name: "Ousmane Konat\u00e9",
        role: "Cin\u00e9phile",
        title: "Des films qu\u2019on ne voit nulle part ailleurs",
        text: "Enfin un festival qui met en lumi\u00e8re le cin\u00e9ma africain \u00e0 Paris. Des courts et longs m\u00e9trages de qualit\u00e9, des r\u00e9alisateurs accessibles. Une p\u00e9pite culturelle.",
        rating: 5,
      },
      {
        name: "Cl\u00e9mence Yao",
        role: "\u00c9tudiante en cin\u00e9ma",
        title: "Inspirant et n\u00e9cessaire",
        text: "En \u00e9cole de cin\u00e9ma, on parle rarement du cin\u00e9ma africain. Ce festival m\u2019a ouvert les yeux sur une richesse narrative incroyable. J\u2019ai h\u00e2te de revenir.",
        rating: 5,
      },
      {
        name: "Jean-Luc Mensah",
        role: "Journaliste culturel",
        title: "Un festival qui monte",
        text: "La programmation est ambitieuse et la qualit\u00e9 des films s\u00e9lectionn\u00e9s impressionne. Dream Team Africa prouve que le cin\u00e9ma africain a toute sa place \u00e0 Paris.",
        rating: 5,
      },
    ],
  },
  "fashion-week-africa": {
    label: "Fashion Week Africa",
    items: [
      {
        name: "Aïssatou Ba",
        role: "Styliste",
        title: "La mode africaine \u00e0 l\u2019honneur",
        text: "Un d\u00e9fil\u00e9 magnifique, des cr\u00e9ateurs talentueux et une organisation au top. La Fashion Week Africa prouve que la mode africaine n\u2019a rien \u00e0 envier aux grandes capitales.",
        rating: 5,
      },
      {
        name: "Lucas Fontaine",
        role: "Photographe mode",
        title: "Des cr\u00e9ations uniques",
        text: "J\u2019ai couvert beaucoup de d\u00e9fil\u00e9s \u00e0 Paris, mais celui-ci a une \u00e9nergie diff\u00e9rente. Les tissus, les couleurs, les coupes\u2026 c\u2019est frais et audacieux. \u00c0 ne pas manquer.",
        rating: 5,
      },
      {
        name: "Djeneba Tour\u00e9",
        role: "Blogueuse mode",
        title: "Mon coup de c\u0153ur de la saison",
        text: "J\u2019ai d\u00e9couvert des marques que je ne connaissais pas et j\u2019ai craqu\u00e9 pour plusieurs pi\u00e8ces. L\u2019ambiance \u00e9tait festive et chaleureuse. D\u00e9j\u00e0 h\u00e2te de la prochaine \u00e9dition !",
        rating: 5,
      },
    ],
  },
  "juste-une-danse": {
    label: "Juste Une Danse",
    items: [
      {
        name: "Mamadou Sidib\u00e9",
        role: "Danseur amateur",
        title: "Une soir\u00e9e inoubliable",
        text: "L\u2019\u00e9nergie sur la piste \u00e9tait dingue ! Des styles de danse vari\u00e9s, de l\u2019afrobeats au coupé-d\u00e9calé en passant par le ndombolo. M\u00eame les timides finissent par danser !",
        rating: 5,
      },
      {
        name: "Priscilla Adjoua",
        role: "Professeure de danse",
        title: "Le meilleur concept de soir\u00e9e danse \u00e0 Paris",
        text: "Enfin un \u00e9v\u00e9nement o\u00f9 la danse africaine est c\u00e9l\u00e9br\u00e9e comme elle le m\u00e9rite. L\u2019organisation est parfaite, le DJ au top. Mes \u00e9l\u00e8ves adorent !",
        rating: 5,
      },
      {
        name: "Kevin Nguema",
        role: "\u00c9tudiant",
        title: "On y retourne quand ?",
        text: "J\u2019y suis all\u00e9 avec mes potes sans trop savoir \u00e0 quoi m\u2019attendre. R\u00e9sultat : on a dans\u00e9 pendant 4 heures non-stop. Ambiance incroyable, prix abordable. On sera l\u00e0 \u00e0 la prochaine !",
        rating: 5,
      },
    ],
  },
  "festival-conte-africain": {
    label: "Festival du Conte Africain",
    items: [
      {
        name: "Mariam Diabat\u00e9",
        role: "Biblioth\u00e9caire",
        title: "La magie des mots",
        text: "Les conteurs nous ont transport\u00e9s dans un autre monde. Mes enfants \u00e9taient captiv\u00e9s du d\u00e9but \u00e0 la fin. C\u2019est rare de trouver un \u00e9v\u00e9nement aussi enrichissant pour toute la famille.",
        rating: 5,
      },
      {
        name: "Thomas Aka",
        role: "Enseignant",
        title: "Transmission et \u00e9motion",
        text: "Ce festival est un tr\u00e9sor. Les histoires racont\u00e9es portent des valeurs universelles avec une touche africaine unique. J\u2019ai ri, j\u2019ai \u00e9t\u00e9 \u00e9mu. Merci \u00e0 Dream Team Africa.",
        rating: 5,
      },
      {
        name: "Aminata Kamara",
        role: "M\u00e8re de famille",
        title: "Parfait pour les enfants",
        text: "Mes enfants parlent encore du conteur qui les a fait rire aux larmes. Un moment de partage interg\u00e9n\u00e9rationnel pr\u00e9cieux. On reviendra avec les grands-parents la prochaine fois !",
        rating: 5,
      },
    ],
  },
  "evasion-paris": {
    label: "\u00c9vasion Paris \u2014 Soir\u00e9e sur la Seine",
    items: [
      {
        name: "Salom\u00e9 Ndiaye",
        role: "Consultante",
        title: "Une soir\u00e9e magique sur la Seine",
        text: "Naviguer sur la Seine avec de la musique live africaine, un cocktail \u00e0 la main et Paris illumin\u00e9\u2026 C\u2019\u00e9tait un r\u00eave \u00e9veill\u00e9. L\u2019exp\u00e9rience est unique, je n\u2019ai jamais rien v\u00e9cu de pareil \u00e0 Paris.",
        rating: 5,
      },
      {
        name: "Yannick Obiang",
        role: "Cadre en finance",
        title: "Le luxe accessible",
        text: "J\u2019h\u00e9sitais vu le prix, mais avec Culture pour Tous j\u2019ai r\u00e9serv\u00e9 pour 5\u00a0\u20ac et j\u2019ai pay\u00e9 le reste tranquillement. La soir\u00e9e valait chaque euro. Ambiance chic et d\u00e9contract\u00e9e \u00e0 la fois.",
        rating: 5,
      },
      {
        name: "Amandine Kourouma",
        role: "Organisatrice d\u2019\u00e9v\u00e9nements",
        title: "Un concept brillant",
        text: "Marier la culture africaine avec une croisi\u00e8re sur la Seine, c\u2019est du g\u00e9nie. La musique, la gastronomie, la vue\u2026 tout \u00e9tait parfait. Dream Team Africa a frapp\u00e9 fort avec \u00c9vasion Paris.",
        rating: 5,
      },
    ],
  },
  "salon-made-in-africa": {
    label: "Salon Made In Africa",
    items: [
      {
        name: "C\u00e9line Okoye",
        role: "D\u00e9coratrice d\u2019int\u00e9rieur",
        title: "Des produits authentiques et de qualit\u00e9",
        text: "J\u2019ai trouv\u00e9 des pi\u00e8ces uniques pour mes projets de d\u00e9coration. L\u2019artisanat africain est d\u2019une richesse incroyable. Les exposants sont passionn\u00e9s et les prix raisonnables.",
        rating: 5,
      },
      {
        name: "Moussa Sangar\u00e9",
        role: "Entrepreneur",
        title: "Un salon professionnel et convivial",
        text: "J\u2019ai expos\u00e9 au salon l\u2019ann\u00e9e derni\u00e8re et le retour a \u00e9t\u00e9 excellent. L\u2019organisation est s\u00e9rieuse, le public est l\u00e0 et les contacts sont de qualit\u00e9. Je reviens cette ann\u00e9e !",
        rating: 5,
      },
      {
        name: "H\u00e9l\u00e8ne Tch\u00e9tchoua",
        role: "Acheteuse passionn\u00e9e",
        title: "Mon march\u00e9 pr\u00e9f\u00e9r\u00e9 \u00e0 Paris",
        text: "Des cosm\u00e9tiques naturels, des bijoux faits main, de la mode \u00e9thique\u2026 Tout ce que j\u2019aime au m\u00eame endroit. Et avec Culture pour Tous, j\u2019ai pu r\u00e9server d\u00e8s 5\u00a0\u20ac. Top !",
        rating: 5,
      },
    ],
  },
};

function StarRating({ rating }: { rating: number }) {
  return (
    <div className="flex gap-0.5">
      {Array.from({ length: 5 }).map((_, i) => (
        <Star
          key={i}
          className={`h-4 w-4 ${
            i < rating
              ? "fill-dta-accent text-dta-accent"
              : "fill-dta-sand text-dta-sand"
          }`}
        />
      ))}
    </div>
  );
}

function getInitials(name: string) {
  return name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase();
}

export default function Testimonials() {
  const pathname = usePathname();
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);

  // Find matching event slug from pathname
  const slug = Object.keys(testimonialsByEvent).find((s) =>
    pathname.includes(s)
  );
  const data = slug ? testimonialsByEvent[slug] : null;

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true);
          observer.disconnect();
        }
      },
      { threshold: 0.1 }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  if (!data) return null;

  const testimonials = data.items;

  return (
    <section ref={ref} className="bg-dta-beige py-20">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-12 text-center">
          <div className="mx-auto mb-4 h-px w-16 bg-dta-accent" />
          <h2 className="font-serif text-3xl font-bold text-dta-dark sm:text-4xl">
            Ce que nos visiteurs en disent
          </h2>
          <p className="mt-3 text-sm font-medium text-dta-accent">
            {data.label}
          </p>
        </div>

        {/* Grid */}
        <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
          {testimonials.map((t, i) => (
            <div
              key={t.name}
              className={`rounded-[var(--radius-card)] border border-dta-sand/50 bg-white p-6 shadow-[var(--shadow-card)] transition-all duration-700 hover:shadow-[var(--shadow-card-hover)] ${
                visible
                  ? "translate-y-0 opacity-100"
                  : "translate-y-8 opacity-0"
              }`}
              style={{ transitionDelay: `${i * 150}ms` }}
            >
              <div className="mb-3 flex items-center gap-3">
                {/* Avatar placeholder */}
                <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-dta-accent text-sm font-semibold text-white">
                  {getInitials(t.name)}
                </div>
                <div>
                  <p className="text-sm font-semibold text-dta-dark">
                    {t.name}
                  </p>
                  <p className="text-xs text-dta-taupe">{t.role}</p>
                  <StarRating rating={t.rating} />
                </div>
              </div>
              <h3 className="mb-2 text-sm font-semibold text-dta-dark">
                {t.title}
              </h3>
              <p className="text-sm leading-relaxed text-dta-char/80">
                &ldquo;{t.text}&rdquo;
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

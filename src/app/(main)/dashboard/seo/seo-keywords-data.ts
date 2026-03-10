export type KeywordVolume = "fort" | "moyen" | "niche";
export type KeywordIntent = "inscription" | "partenariat" | "visiteur" | "conversion" | "general";

export interface Keyword {
  term: string;
  volume: KeywordVolume;
  intent: KeywordIntent;
}

export interface KeywordCategory {
  name: string;
  keywords: Keyword[];
}

export interface SeoSection {
  id: string;
  title: string;
  description: string;
  path: string;
  color: string;
  keywords: KeywordCategory[];
}

// ─── L'OFFICIEL D'AFRIQUE ────────────────────────────────

const officielKeywords: KeywordCategory[] = [
  {
    name: "Annuaire & Diaspora",
    keywords: [
      { term: "annuaire diaspora africaine", volume: "fort", intent: "visiteur" },
      { term: "annuaire entreprises africaines France", volume: "fort", intent: "inscription" },
      { term: "annuaire professionnel africain", volume: "moyen", intent: "inscription" },
      { term: "annuaire entrepreneurs africains Paris", volume: "moyen", intent: "inscription" },
      { term: "annuaire artisans africains France", volume: "niche", intent: "inscription" },
    ],
  },
  {
    name: "Entrepreneuriat & Partenariats",
    keywords: [
      { term: "entrepreneur africain France", volume: "fort", intent: "general" },
      { term: "réseau entrepreneurs africains France", volume: "moyen", intent: "partenariat" },
      { term: "startup africaine Paris", volume: "moyen", intent: "partenariat" },
      { term: "distribution produits africains France", volume: "moyen", intent: "partenariat" },
      { term: "partenariat événement africain", volume: "moyen", intent: "partenariat" },
      { term: "sponsor salon africain Paris", volume: "niche", intent: "partenariat" },
      { term: "média diaspora africaine", volume: "niche", intent: "partenariat" },
    ],
  },
];

// ─── MARKETPLACE ─────────────────────────────────────────

const marketplaceKeywords: KeywordCategory[] = [
  {
    name: "Produits naturels africains",
    keywords: [
      { term: "produits naturels africains", volume: "fort", intent: "conversion" },
      { term: "produits africains en ligne", volume: "fort", intent: "conversion" },
      { term: "cosmétiques naturels africains", volume: "fort", intent: "conversion" },
      { term: "boutique produits africains en ligne", volume: "fort", intent: "conversion" },
      { term: "marketplace africaine France", volume: "moyen", intent: "inscription" },
      { term: "marque cosmétique africaine", volume: "moyen", intent: "inscription" },
    ],
  },
  {
    name: "Beurre de karité",
    keywords: [
      { term: "beurre de karité pur africain", volume: "fort", intent: "conversion" },
      { term: "beurre de karité artisanal", volume: "fort", intent: "conversion" },
      { term: "beurre de karité non raffiné", volume: "fort", intent: "conversion" },
      { term: "beurre de karité bio Burkina Faso", volume: "moyen", intent: "conversion" },
      { term: "beurre de karité cheveux crépus", volume: "fort", intent: "conversion" },
    ],
  },
  {
    name: "Chébé & Ambunu",
    keywords: [
      { term: "huile de chébé", volume: "fort", intent: "conversion" },
      { term: "huile de chébé pousse cheveux", volume: "moyen", intent: "visiteur" },
      { term: "chébé du Tchad", volume: "moyen", intent: "visiteur" },
      { term: "poudre de chébé Tchad", volume: "moyen", intent: "conversion" },
      { term: "shampoing solide au chébé", volume: "moyen", intent: "conversion" },
      { term: "ambunu plante démêlante cheveux crépus", volume: "moyen", intent: "visiteur" },
      { term: "poudre de ambunu", volume: "moyen", intent: "conversion" },
      { term: "feuilles ambunu cheveux crépus acheter", volume: "niche", intent: "conversion" },
      { term: "chébé secret femmes tchadiennes", volume: "moyen", intent: "visiteur" },
    ],
  },
  {
    name: "Huiles végétales africaines",
    keywords: [
      { term: "huile de baobab", volume: "fort", intent: "conversion" },
      { term: "huile de moringa", volume: "fort", intent: "conversion" },
      { term: "huiles végétales africaines", volume: "moyen", intent: "conversion" },
      { term: "huile de marula", volume: "moyen", intent: "conversion" },
      { term: "acheter huile végétale naturelle Afrique", volume: "niche", intent: "conversion" },
    ],
  },
  {
    name: "Savons africains",
    keywords: [
      { term: "savon noir africain", volume: "fort", intent: "conversion" },
      { term: "savon naturel africain", volume: "fort", intent: "conversion" },
      { term: "savon artisanal africain", volume: "fort", intent: "conversion" },
      { term: "acheter savon naturel africain en ligne", volume: "moyen", intent: "conversion" },
    ],
  },
  {
    name: "Soins capillaires afro",
    keywords: [
      { term: "soins capillaires afro naturels", volume: "fort", intent: "conversion" },
      { term: "produits capillaires africains", volume: "fort", intent: "conversion" },
      { term: "soin cheveux crépus naturel", volume: "fort", intent: "conversion" },
      { term: "routine capillaire naturelle afro", volume: "fort", intent: "visiteur" },
      { term: "produits cheveux afro Paris", volume: "moyen", intent: "conversion" },
      { term: "produit naturel pour cheveux crépus", volume: "moyen", intent: "conversion" },
    ],
  },
  {
    name: "Art & Artisanat africain",
    keywords: [
      { term: "artisanat africain", volume: "fort", intent: "conversion" },
      { term: "artisanat africain en ligne", volume: "moyen", intent: "conversion" },
      { term: "décoration africaine", volume: "fort", intent: "conversion" },
      { term: "art africain Paris", volume: "fort", intent: "visiteur" },
      { term: "acheter art africain en ligne", volume: "moyen", intent: "conversion" },
      { term: "objet déco africain", volume: "moyen", intent: "conversion" },
    ],
  },
];

// ─── ÉVÉNEMENTS / FOIRE D'AFRIQUE ───────────────────────

const evenementsKeywords: KeywordCategory[] = [
  {
    name: "Foire d'Afrique Paris",
    keywords: [
      { term: "foire d'Afrique", volume: "fort", intent: "visiteur" },
      { term: "foire d'Afrique Paris", volume: "fort", intent: "visiteur" },
      { term: "foire d'Afrique Paris 2026", volume: "fort", intent: "visiteur" },
      { term: "foire d'Afrique billet", volume: "moyen", intent: "conversion" },
      { term: "foire d'Afrique programme", volume: "moyen", intent: "visiteur" },
      { term: "foire d'Afrique exposant", volume: "moyen", intent: "inscription" },
      { term: "foire africaine Paris", volume: "fort", intent: "visiteur" },
      { term: "billet foire africaine Paris", volume: "moyen", intent: "conversion" },
    ],
  },
  {
    name: "Salons africains Paris",
    keywords: [
      { term: "salon africain Paris 2026", volume: "fort", intent: "visiteur" },
      { term: "salon afro Paris 2026", volume: "fort", intent: "visiteur" },
      { term: "Salon Made In Africa", volume: "moyen", intent: "visiteur" },
      { term: "salon artisanat africain Paris", volume: "moyen", intent: "visiteur" },
      { term: "marché africain Paris 2026", volume: "moyen", intent: "visiteur" },
      { term: "saison culturelle africaine Paris", volume: "moyen", intent: "visiteur" },
    ],
  },
  {
    name: "Festivals & Culture africaine",
    keywords: [
      { term: "événement culturel africain Paris", volume: "fort", intent: "visiteur" },
      { term: "festival africain Paris", volume: "fort", intent: "visiteur" },
      { term: "festival africain île de France", volume: "moyen", intent: "visiteur" },
      { term: "festival cinéma africain Paris", volume: "moyen", intent: "visiteur" },
      { term: "festival danse africaine Paris", volume: "moyen", intent: "visiteur" },
      { term: "conte africain spectacle Paris", volume: "niche", intent: "visiteur" },
      { term: "spectacle africain Paris", volume: "moyen", intent: "visiteur" },
      { term: "concert africain Paris 2026", volume: "moyen", intent: "visiteur" },
    ],
  },
  {
    name: "Mode africaine",
    keywords: [
      { term: "Fashion Week Africa", volume: "fort", intent: "visiteur" },
      { term: "mode africaine Paris", volume: "fort", intent: "visiteur" },
      { term: "défilé mode africaine Paris", volume: "moyen", intent: "visiteur" },
      { term: "créateur mode africaine", volume: "moyen", intent: "visiteur" },
    ],
  },
  {
    name: "Sortie & Loisirs afro Paris",
    keywords: [
      { term: "sortie afro Paris", volume: "moyen", intent: "visiteur" },
      { term: "soirée africaine Paris", volume: "moyen", intent: "visiteur" },
      { term: "événement diaspora Paris", volume: "moyen", intent: "visiteur" },
      { term: "agenda culturel africain Paris", volume: "niche", intent: "visiteur" },
    ],
  },
  {
    name: "Exposants & Inscription",
    keywords: [
      { term: "exposer salon africain Paris", volume: "moyen", intent: "inscription" },
      { term: "devenir exposant salon africain", volume: "moyen", intent: "inscription" },
      { term: "inscription salon africain Paris", volume: "moyen", intent: "inscription" },
      { term: "stand exposition africaine Paris", volume: "moyen", intent: "inscription" },
      { term: "exposant foire d'Afrique Paris", volume: "niche", intent: "inscription" },
    ],
  },
  {
    name: "Gastronomie africaine",
    keywords: [
      { term: "gastronomie africaine Paris", volume: "moyen", intent: "visiteur" },
      { term: "traiteur africain Paris", volume: "moyen", intent: "inscription" },
    ],
  },
];

// ─── SECTIONS ────────────────────────────────────────────

export const SEO_SECTIONS: SeoSection[] = [
  {
    id: "officiel-afrique",
    title: "L'Officiel d'Afrique",
    description: "Annuaire, partenariats et inscription des entreprises de la diaspora",
    path: "/dashboard/seo/officiel-afrique",
    color: "#C4704B",
    keywords: officielKeywords,
  },
  {
    id: "marketplace",
    title: "Marketplace",
    description: "Produits naturels, cosmétiques, art africain et artisanat",
    path: "/dashboard/seo/marketplace",
    color: "#2E7D32",
    keywords: marketplaceKeywords,
  },
  {
    id: "evenements",
    title: "Événements & Foire d'Afrique",
    description: "Salons, festivals, fashion week, billetterie et inscription exposants",
    path: "/dashboard/seo/evenements",
    color: "#1565C0",
    keywords: evenementsKeywords,
  },
];

export function getSectionById(id: string): SeoSection | undefined {
  return SEO_SECTIONS.find((s) => s.id === id);
}

export function getAllKeywordsFlat(): string[] {
  return SEO_SECTIONS.flatMap((s) => s.keywords.flatMap((c) => c.keywords.map((k) => k.term)));
}

export function getTotalKeywords(): number {
  return SEO_SECTIONS.reduce(
    (total, s) => total + s.keywords.reduce((st, c) => st + c.keywords.length, 0),
    0
  );
}

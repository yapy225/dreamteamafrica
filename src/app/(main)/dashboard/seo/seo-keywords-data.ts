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
      { term: "annuaire diaspora africaine en France", volume: "fort", intent: "visiteur" },
      { term: "annuaire entreprises africaines France", volume: "fort", intent: "inscription" },
      { term: "annuaire professionnel africain", volume: "moyen", intent: "inscription" },
      { term: "annuaire entrepreneurs africains Paris", volume: "moyen", intent: "inscription" },
      { term: "annuaire afro Paris", volume: "moyen", intent: "visiteur" },
      { term: "répertoire entreprises africaines", volume: "moyen", intent: "inscription" },
      { term: "trouver entreprise africaine Paris", volume: "moyen", intent: "visiteur" },
      { term: "annuaire commerçants africains", volume: "niche", intent: "inscription" },
      { term: "annuaire artisans africains France", volume: "niche", intent: "inscription" },
    ],
  },
  {
    name: "Entrepreneuriat",
    keywords: [
      { term: "entrepreneur africain France", volume: "fort", intent: "general" },
      { term: "réseau entrepreneurs africains France", volume: "moyen", intent: "partenariat" },
      { term: "startup africaine Paris", volume: "moyen", intent: "partenariat" },
      { term: "créer entreprise diaspora africaine", volume: "moyen", intent: "general" },
      { term: "investir Afrique depuis France", volume: "moyen", intent: "partenariat" },
      { term: "financement diaspora africaine", volume: "moyen", intent: "partenariat" },
      { term: "accompagnement entrepreneur africain", volume: "niche", intent: "partenariat" },
      { term: "incubateur afro France", volume: "niche", intent: "partenariat" },
    ],
  },
  {
    name: "Partenariats",
    keywords: [
      { term: "distribution produits africains France", volume: "moyen", intent: "partenariat" },
      { term: "import export Afrique France", volume: "moyen", intent: "partenariat" },
      { term: "partenariat événement africain", volume: "moyen", intent: "partenariat" },
      { term: "collaboration marques africaines", volume: "niche", intent: "partenariat" },
      { term: "partenariat commercial Afrique France", volume: "niche", intent: "partenariat" },
      { term: "sponsor salon africain Paris", volume: "niche", intent: "partenariat" },
      { term: "devenir partenaire foire africaine", volume: "niche", intent: "partenariat" },
      { term: "mécénat culture africaine France", volume: "niche", intent: "partenariat" },
    ],
  },
  {
    name: "Édition & Média",
    keywords: [
      { term: "livre auteur africain", volume: "moyen", intent: "visiteur" },
      { term: "librairie africaine Paris", volume: "moyen", intent: "visiteur" },
      { term: "influenceur afro France", volume: "moyen", intent: "partenariat" },
      { term: "éditeur africain France", volume: "niche", intent: "inscription" },
      { term: "média diaspora africaine", volume: "niche", intent: "partenariat" },
      { term: "podcast diaspora africaine", volume: "niche", intent: "partenariat" },
    ],
  },
];

// ─── MARKETPLACE ─────────────────────────────────────────

const marketplaceKeywords: KeywordCategory[] = [
  {
    name: "Produits phares (fort volume)",
    keywords: [
      { term: "huile de coco", volume: "fort", intent: "conversion" },
      { term: "huile de coco cheveux", volume: "fort", intent: "conversion" },
      { term: "huile de coco bienfaits", volume: "fort", intent: "visiteur" },
      { term: "huile de coco visage", volume: "fort", intent: "conversion" },
      { term: "huile de coco bio", volume: "fort", intent: "conversion" },
      { term: "huile de coco peau", volume: "fort", intent: "conversion" },
      { term: "huile de coco cheveux crépus", volume: "fort", intent: "conversion" },
      { term: "beurre de karité", volume: "fort", intent: "conversion" },
      { term: "beurre de karité cheveux", volume: "fort", intent: "conversion" },
      { term: "beurre de karité visage", volume: "fort", intent: "conversion" },
      { term: "beurre de karité bio", volume: "fort", intent: "conversion" },
      { term: "beurre de karité bienfaits", volume: "fort", intent: "visiteur" },
      { term: "beurre de karité cheveux crépus", volume: "fort", intent: "conversion" },
      { term: "beurre de karité peau", volume: "fort", intent: "conversion" },
      { term: "beurre de karité non raffiné", volume: "fort", intent: "conversion" },
      { term: "beurre de karité pur africain", volume: "fort", intent: "conversion" },
      { term: "beurre de cacao", volume: "fort", intent: "conversion" },
      { term: "beurre de cacao cheveux", volume: "moyen", intent: "conversion" },
      { term: "beurre de cacao cosmétique", volume: "moyen", intent: "conversion" },
      { term: "beurre de cacao peau", volume: "moyen", intent: "conversion" },
      { term: "beurre de cacao bio", volume: "moyen", intent: "conversion" },
      { term: "huile de chébé", volume: "fort", intent: "conversion" },
      { term: "huile de chébé bienfaits", volume: "moyen", intent: "visiteur" },
      { term: "huile de chébé pousse cheveux", volume: "moyen", intent: "visiteur" },
      { term: "huile de chébé pharmacie", volume: "moyen", intent: "conversion" },
      { term: "chébé du Tchad", volume: "moyen", intent: "visiteur" },
      { term: "huile de chébé barbe", volume: "niche", intent: "conversion" },
    ],
  },
  {
    name: "Huiles végétales & Graines",
    keywords: [
      { term: "huile de baobab", volume: "fort", intent: "conversion" },
      { term: "huile de baobab bienfaits peau cheveux", volume: "fort", intent: "visiteur" },
      { term: "huile de neem", volume: "fort", intent: "conversion" },
      { term: "huile de neem bienfaits peau", volume: "moyen", intent: "visiteur" },
      { term: "huile de moringa", volume: "fort", intent: "conversion" },
      { term: "huile de moringa bienfaits cosmétique", volume: "moyen", intent: "visiteur" },
      { term: "huile d'aloe vera", volume: "fort", intent: "conversion" },
      { term: "huile de chébé pousse cheveux crépus", volume: "fort", intent: "visiteur" },
      { term: "huile de fenugrec pousse cheveux", volume: "fort", intent: "visiteur" },
      { term: "huile de coco naturelle", volume: "fort", intent: "conversion" },
      { term: "huile de sésame africaine", volume: "moyen", intent: "conversion" },
      { term: "huile de marula", volume: "moyen", intent: "conversion" },
      { term: "huile d'arachide africaine", volume: "moyen", intent: "conversion" },
      { term: "huile de palmiste", volume: "moyen", intent: "conversion" },
      { term: "huile de gingembre", volume: "moyen", intent: "conversion" },
      { term: "huile de carotte naturelle", volume: "moyen", intent: "conversion" },
      { term: "huile de laurier", volume: "moyen", intent: "conversion" },
      { term: "huile de curcuma", volume: "moyen", intent: "conversion" },
      { term: "huile de mangue", volume: "moyen", intent: "conversion" },
      { term: "huile de citron naturelle", volume: "moyen", intent: "conversion" },
      { term: "huile d'eucalyptus", volume: "moyen", intent: "conversion" },
      { term: "huile de fenugrec", volume: "moyen", intent: "conversion" },
      { term: "huile de menthe", volume: "moyen", intent: "conversion" },
      { term: "huiles végétales africaines", volume: "moyen", intent: "conversion" },
      { term: "huile végétale bio Afrique", volume: "moyen", intent: "conversion" },
      { term: "macérât huileux de chébé", volume: "moyen", intent: "conversion" },
      { term: "huile de papaye", volume: "niche", intent: "conversion" },
      { term: "huile de coton", volume: "niche", intent: "conversion" },
      { term: "huile de balanités datte du désert", volume: "niche", intent: "conversion" },
      { term: "huile de carapa procera", volume: "niche", intent: "conversion" },
      { term: "acheter huile végétale naturelle Afrique", volume: "niche", intent: "conversion" },
    ],
  },
  {
    name: "Beurres naturels",
    keywords: [
      { term: "beurre de karité pur", volume: "fort", intent: "conversion" },
      { term: "beurre de karité artisanal", volume: "fort", intent: "conversion" },
      { term: "beurre de karité brut non raffiné", volume: "fort", intent: "conversion" },
      { term: "beurre de karité bienfaits peau cheveux", volume: "fort", intent: "visiteur" },
      { term: "beurre de karité bio Burkina Faso", volume: "moyen", intent: "conversion" },
      { term: "beurre de coco naturel", volume: "moyen", intent: "conversion" },
      { term: "beurre de moringa", volume: "moyen", intent: "conversion" },
      { term: "beurre de mangue", volume: "moyen", intent: "conversion" },
      { term: "beurre de chébé", volume: "moyen", intent: "conversion" },
      { term: "beurre corporel africain naturel", volume: "moyen", intent: "conversion" },
      { term: "beurre de vache africain", volume: "moyen", intent: "conversion" },
      { term: "beurre de lait de vache cheveux", volume: "moyen", intent: "conversion" },
      { term: "beurre de kigelia", volume: "niche", intent: "conversion" },
      { term: "beurre de gingembre", volume: "niche", intent: "conversion" },
      { term: "beurre de papaye", volume: "niche", intent: "conversion" },
      { term: "beurre de vache Peul Foulani", volume: "niche", intent: "conversion" },
      { term: "beurre de vache cosmétique traditionnel", volume: "niche", intent: "conversion" },
      { term: "beurre de vache peau hydratation", volume: "niche", intent: "visiteur" },
    ],
  },
  {
    name: "Savons naturels",
    keywords: [
      { term: "savon naturel africain", volume: "fort", intent: "conversion" },
      { term: "savon artisanal africain", volume: "fort", intent: "conversion" },
      { term: "savon noir africain", volume: "fort", intent: "conversion" },
      { term: "savon noir africain bienfaits peau", volume: "fort", intent: "visiteur" },
      { term: "savon de neem au citron", volume: "moyen", intent: "conversion" },
      { term: "savon au moringa", volume: "moyen", intent: "conversion" },
      { term: "savon au miel naturel", volume: "moyen", intent: "conversion" },
      { term: "savon à l'argile verte", volume: "moyen", intent: "conversion" },
      { term: "savon au curcuma", volume: "moyen", intent: "conversion" },
      { term: "savon à l'aloe vera", volume: "moyen", intent: "conversion" },
      { term: "savon noir Ghana acné eczéma", volume: "moyen", intent: "visiteur" },
      { term: "savon africain anti acné", volume: "moyen", intent: "conversion" },
      { term: "acheter savon naturel africain en ligne", volume: "moyen", intent: "conversion" },
      { term: "savon de toilette au djabi", volume: "niche", intent: "conversion" },
      { term: "savon de toilette aux balanités", volume: "niche", intent: "conversion" },
      { term: "savon de toilette à l'eucalyptus", volume: "niche", intent: "conversion" },
      { term: "savon lavande lait de riz", volume: "niche", intent: "conversion" },
      { term: "savon aux multiples plantes", volume: "niche", intent: "conversion" },
      { term: "savon au lait de soja", volume: "niche", intent: "conversion" },
      { term: "savon à la carotte", volume: "niche", intent: "conversion" },
      { term: "savon neem moringa naturel", volume: "niche", intent: "conversion" },
    ],
  },
  {
    name: "Soins capillaires & Ambunu",
    keywords: [
      { term: "soins capillaires afro naturels", volume: "fort", intent: "conversion" },
      { term: "produits capillaires africains", volume: "fort", intent: "conversion" },
      { term: "soin cheveux crépus naturel", volume: "fort", intent: "conversion" },
      { term: "soin naturel pousse cheveux afro", volume: "fort", intent: "visiteur" },
      { term: "démêlant naturel cheveux crépus", volume: "fort", intent: "conversion" },
      { term: "routine capillaire naturelle afro", volume: "fort", intent: "visiteur" },
      { term: "shampoing solide au ambunu", volume: "moyen", intent: "conversion" },
      { term: "poudre de ambunu", volume: "moyen", intent: "conversion" },
      { term: "shampoing solide au chébé", volume: "moyen", intent: "conversion" },
      { term: "chébé Tchad pousse cheveux", volume: "moyen", intent: "conversion" },
      { term: "ambunu plante démêlante cheveux crépus", volume: "moyen", intent: "visiteur" },
      { term: "chébé secret femmes tchadiennes", volume: "moyen", intent: "visiteur" },
      { term: "masque capillaire huile de fenugrec", volume: "moyen", intent: "visiteur" },
      { term: "shampoing liquide au ambunu", volume: "niche", intent: "conversion" },
      { term: "démêlant ambunu et karité", volume: "niche", intent: "conversion" },
      { term: "feuilles de ambunu", volume: "niche", intent: "conversion" },
      { term: "ambunu Tchad soin 3 en 1", volume: "niche", intent: "visiteur" },
      { term: "feuilles ambunu cheveux crépus acheter", volume: "niche", intent: "conversion" },
    ],
  },
  {
    name: "Pommades & Crèmes corporelles",
    keywords: [
      { term: "crème corporelle à l'aloe vera", volume: "moyen", intent: "conversion" },
      { term: "crème corporelle au karité", volume: "moyen", intent: "conversion" },
      { term: "crème naturelle africaine", volume: "moyen", intent: "conversion" },
      { term: "soin corps naturel Afrique", volume: "moyen", intent: "conversion" },
      { term: "crème hydratante africaine naturelle", volume: "moyen", intent: "conversion" },
      { term: "soin peau sèche beurre karité", volume: "moyen", intent: "visiteur" },
      { term: "pommade belle peau africaine", volume: "niche", intent: "conversion" },
      { term: "pommade au miel et lavande", volume: "niche", intent: "conversion" },
      { term: "pommade anti douleur huile de sésame", volume: "niche", intent: "conversion" },
      { term: "crème corporelle à la mangue", volume: "niche", intent: "conversion" },
      { term: "crème corporelle au moringa", volume: "niche", intent: "conversion" },
      { term: "pommade africaine traditionnelle", volume: "niche", intent: "conversion" },
    ],
  },
  {
    name: "Poudres naturelles",
    keywords: [
      { term: "poudre de moringa", volume: "fort", intent: "conversion" },
      { term: "poudre de moringa bienfaits santé", volume: "fort", intent: "visiteur" },
      { term: "poudre de moringa superaliment", volume: "moyen", intent: "visiteur" },
      { term: "poudre de pain de singe baobab", volume: "moyen", intent: "conversion" },
      { term: "poudre de karité", volume: "moyen", intent: "conversion" },
      { term: "poudre de neem", volume: "moyen", intent: "conversion" },
      { term: "poudre de chébé Tchad", volume: "moyen", intent: "conversion" },
      { term: "poudres naturelles africaines", volume: "moyen", intent: "conversion" },
      { term: "poudre de mangue", volume: "niche", intent: "conversion" },
      { term: "poudre de kigelia", volume: "niche", intent: "conversion" },
      { term: "poudre de balanités", volume: "niche", intent: "conversion" },
      { term: "superaliment africain en poudre", volume: "niche", intent: "visiteur" },
    ],
  },
  {
    name: "Cosmétique & Beauté afro",
    keywords: [
      { term: "meilleur produit pour cheveux crépus", volume: "fort", intent: "visiteur" },
      { term: "produit cheveux bouclés", volume: "fort", intent: "conversion" },
      { term: "produit cheveux afro pousse", volume: "moyen", intent: "conversion" },
      { term: "produit pour lisser les cheveux crépus", volume: "moyen", intent: "conversion" },
      { term: "produit assouplissant cheveux crépus", volume: "moyen", intent: "conversion" },
      { term: "produit pour cheveux afro homme", volume: "moyen", intent: "conversion" },
      { term: "produit naturel pour cheveux crépus", volume: "moyen", intent: "conversion" },
      { term: "soin visage peau noire", volume: "moyen", intent: "conversion" },
      { term: "cosmétique afrique", volume: "moyen", intent: "visiteur" },
      { term: "produits cheveux afro Paris", volume: "moyen", intent: "conversion" },
      { term: "soin cheveux crépus secs et cassants maison", volume: "moyen", intent: "visiteur" },
      { term: "maquillage afrique", volume: "niche", intent: "visiteur" },
    ],
  },
  {
    name: "Art africain",
    keywords: [
      { term: "art africain", volume: "fort", intent: "visiteur" },
      { term: "art africain traditionnel", volume: "fort", intent: "visiteur" },
      { term: "art africain contemporain", volume: "fort", intent: "visiteur" },
      { term: "art africain peinture", volume: "fort", intent: "visiteur" },
      { term: "art africain Paris", volume: "fort", intent: "visiteur" },
      { term: "art africain masque", volume: "moyen", intent: "visiteur" },
      { term: "art africain sculpture bois", volume: "moyen", intent: "visiteur" },
      { term: "galerie art africain Paris", volume: "moyen", intent: "visiteur" },
      { term: "acheter art africain en ligne", volume: "moyen", intent: "conversion" },
      { term: "tableau art africain", volume: "moyen", intent: "conversion" },
      { term: "décoration africaine", volume: "fort", intent: "conversion" },
      { term: "décoration africaine salon", volume: "moyen", intent: "conversion" },
      { term: "objet déco africain", volume: "moyen", intent: "conversion" },
      { term: "statue africaine décoration", volume: "moyen", intent: "conversion" },
      { term: "artisanat africain", volume: "fort", intent: "conversion" },
      { term: "artisanat africain en ligne", volume: "moyen", intent: "conversion" },
    ],
  },
  {
    name: "Marketplace générique",
    keywords: [
      { term: "produits naturels africains", volume: "fort", intent: "conversion" },
      { term: "produits africains", volume: "fort", intent: "conversion" },
      { term: "cosmétiques naturels africains", volume: "fort", intent: "conversion" },
      { term: "cosmétique bio africain", volume: "fort", intent: "conversion" },
      { term: "boutique produits africains en ligne", volume: "fort", intent: "conversion" },
      { term: "magasin produits africains", volume: "moyen", intent: "conversion" },
      { term: "grossiste produits africains", volume: "moyen", intent: "inscription" },
      { term: "grossiste produit exotique africain Paris", volume: "moyen", intent: "inscription" },
      { term: "marketplace africaine France", volume: "moyen", intent: "inscription" },
      { term: "vendre produits naturels africains en ligne", volume: "moyen", intent: "inscription" },
      { term: "marque cosmétique africaine", volume: "moyen", intent: "inscription" },
    ],
  },
];

// ─── ÉVÉNEMENTS / FOIRE D'AFRIQUE ───────────────────────

const evenementsKeywords: KeywordCategory[] = [
  {
    name: "Foire d'Afrique & Salons DTA",
    keywords: [
      { term: "foire d'Afrique", volume: "fort", intent: "visiteur" },
      { term: "foire d'Afrique Paris", volume: "fort", intent: "visiteur" },
      { term: "foire d'Afrique Paris 2026", volume: "fort", intent: "visiteur" },
      { term: "foire d'Afrique billet", volume: "moyen", intent: "conversion" },
      { term: "foire d'Afrique programme", volume: "moyen", intent: "visiteur" },
      { term: "foire d'Afrique exposant", volume: "moyen", intent: "inscription" },
      { term: "salon africain Paris 2026", volume: "fort", intent: "visiteur" },
      { term: "foire africaine Paris", volume: "fort", intent: "visiteur" },
      { term: "salon afro Paris 2026", volume: "fort", intent: "visiteur" },
      { term: "salon entrepreneurs africains", volume: "fort", intent: "visiteur" },
      { term: "Salon Made In Africa", volume: "moyen", intent: "visiteur" },
      { term: "salon artisanat africain Paris", volume: "moyen", intent: "visiteur" },
      { term: "salon du livre africain Paris", volume: "fort", intent: "visiteur" },
      { term: "marché africain Paris 2026", volume: "moyen", intent: "visiteur" },
      { term: "saison culturelle africaine Paris", volume: "moyen", intent: "visiteur" },
      { term: "marché afro-caribéen Paris", volume: "moyen", intent: "visiteur" },
      { term: "Africa Market Week Paris", volume: "niche", intent: "visiteur" },
    ],
  },
  {
    name: "Foire de Paris & Grands salons",
    keywords: [
      { term: "foire de paris", volume: "fort", intent: "visiteur" },
      { term: "foire de paris 2026", volume: "fort", intent: "visiteur" },
      { term: "foire de paris billet", volume: "fort", intent: "conversion" },
      { term: "foire de paris date", volume: "fort", intent: "visiteur" },
      { term: "foire de paris horaires", volume: "moyen", intent: "visiteur" },
      { term: "foire de paris programme", volume: "moyen", intent: "visiteur" },
      { term: "foire de paris stand", volume: "moyen", intent: "inscription" },
      { term: "foire de paris exposant", volume: "moyen", intent: "inscription" },
      { term: "foire de paris tarif stand", volume: "niche", intent: "inscription" },
      { term: "foire de paris porte de Versailles", volume: "moyen", intent: "visiteur" },
      { term: "salon porte de Versailles 2026", volume: "moyen", intent: "visiteur" },
    ],
  },
  {
    name: "Fashion Week & Mode africaine",
    keywords: [
      { term: "fashion week Paris", volume: "fort", intent: "visiteur" },
      { term: "fashion week Paris 2026", volume: "fort", intent: "visiteur" },
      { term: "Fashion Week Africa", volume: "fort", intent: "visiteur" },
      { term: "fashion week africaine", volume: "moyen", intent: "visiteur" },
      { term: "mode africaine Paris", volume: "fort", intent: "visiteur" },
      { term: "défilé mode africaine Paris", volume: "moyen", intent: "visiteur" },
      { term: "créateur mode africaine", volume: "moyen", intent: "visiteur" },
      { term: "styliste africain Paris", volume: "moyen", intent: "visiteur" },
      { term: "vêtement africain Paris", volume: "fort", intent: "conversion" },
      { term: "tissu africain Paris", volume: "moyen", intent: "conversion" },
      { term: "wax africain", volume: "fort", intent: "conversion" },
    ],
  },
  {
    name: "Sortir à Paris & Loisirs",
    keywords: [
      { term: "sortir à Paris", volume: "fort", intent: "visiteur" },
      { term: "que faire à Paris", volume: "fort", intent: "visiteur" },
      { term: "que faire à Paris ce week-end", volume: "fort", intent: "visiteur" },
      { term: "activités Paris", volume: "fort", intent: "visiteur" },
      { term: "sortie afro Paris", volume: "moyen", intent: "visiteur" },
      { term: "soirée africaine Paris", volume: "moyen", intent: "visiteur" },
      { term: "soirée afro Paris ce soir", volume: "moyen", intent: "visiteur" },
      { term: "événement diaspora Paris", volume: "moyen", intent: "visiteur" },
      { term: "agenda culturel africain Paris", volume: "niche", intent: "visiteur" },
      { term: "marché de Noël africain Paris", volume: "moyen", intent: "visiteur" },
    ],
  },
  {
    name: "Exposants & Inscription",
    keywords: [
      { term: "exposer salon africain Paris", volume: "moyen", intent: "inscription" },
      { term: "devenir exposant salon africain", volume: "moyen", intent: "inscription" },
      { term: "inscription salon africain Paris", volume: "moyen", intent: "inscription" },
      { term: "stand exposition africaine Paris", volume: "moyen", intent: "inscription" },
      { term: "tarif stand foire africaine", volume: "niche", intent: "inscription" },
      { term: "exposant foire d'Afrique Paris", volume: "niche", intent: "inscription" },
      { term: "réserver stand salon afro", volume: "niche", intent: "inscription" },
    ],
  },
  {
    name: "Festivals & Culture africaine",
    keywords: [
      { term: "événement culturel africain Paris", volume: "fort", intent: "visiteur" },
      { term: "festival africain Paris", volume: "fort", intent: "visiteur" },
      { term: "festival africain île de France", volume: "moyen", intent: "visiteur" },
      { term: "Festival International du Cinéma Africain", volume: "moyen", intent: "visiteur" },
      { term: "festival cinéma africain Paris", volume: "moyen", intent: "visiteur" },
      { term: "FICA festival cinéma africain", volume: "niche", intent: "visiteur" },
      { term: "Evasion Paris festival de l'autre culture", volume: "moyen", intent: "visiteur" },
      { term: "festival interculturel Paris", volume: "moyen", intent: "visiteur" },
      { term: "Juste Une Danse festival danses traditionnelles africaines", volume: "niche", intent: "visiteur" },
      { term: "festival danse africaine Paris", volume: "moyen", intent: "visiteur" },
      { term: "danse traditionnelle africaine spectacle", volume: "moyen", intent: "visiteur" },
      { term: "Festival du Conte Africain Sous l'Arbre à Palabre", volume: "niche", intent: "visiteur" },
      { term: "conte africain spectacle Paris", volume: "niche", intent: "visiteur" },
      { term: "festival musique africaine Paris", volume: "moyen", intent: "visiteur" },
      { term: "exposition art africain Paris 2026", volume: "moyen", intent: "visiteur" },
      { term: "spectacle africain Paris", volume: "moyen", intent: "visiteur" },
      { term: "concert africain Paris 2026", volume: "moyen", intent: "visiteur" },
    ],
  },
  {
    name: "Gastronomie événementielle",
    keywords: [
      { term: "gastronomie africaine Paris", volume: "moyen", intent: "visiteur" },
      { term: "traiteur africain Paris", volume: "moyen", intent: "inscription" },
      { term: "food truck africain Paris", volume: "niche", intent: "inscription" },
      { term: "dégustation cuisine africaine Paris", volume: "niche", intent: "visiteur" },
    ],
  },
  {
    name: "Billetterie & Pratique",
    keywords: [
      { term: "billet foire africaine Paris", volume: "moyen", intent: "conversion" },
      { term: "acheter billet salon africain", volume: "moyen", intent: "conversion" },
      { term: "programme foire d'Afrique Paris", volume: "niche", intent: "visiteur" },
      { term: "horaires salon africain Paris", volume: "niche", intent: "visiteur" },
      { term: "accès foire africaine Paris métro", volume: "niche", intent: "visiteur" },
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

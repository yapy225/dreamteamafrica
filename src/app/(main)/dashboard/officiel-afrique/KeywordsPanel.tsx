"use client";

import { useState } from "react";
import { Search, TrendingUp, Star, Globe, ShoppingBag, Users, Palette, Sparkles } from "lucide-react";

type Keyword = {
  term: string;
  volume: "fort" | "moyen" | "niche";
  intent: "inscription" | "partenariat" | "visiteur" | "general";
};

type Category = {
  name: string;
  icon: React.ReactNode;
  keywords: Keyword[];
};

const KEYWORD_DATA: Category[] = [
  {
    name: "Annuaire & Diaspora",
    icon: <Globe size={16} />,
    keywords: [
      { term: "annuaire diaspora africaine", volume: "fort", intent: "visiteur" },
      { term: "annuaire entreprises africaines France", volume: "fort", intent: "inscription" },
      { term: "annuaire professionnel africain", volume: "moyen", intent: "inscription" },
      { term: "annuaire entrepreneurs africains Paris", volume: "moyen", intent: "inscription" },
      { term: "annuaire afro Paris", volume: "moyen", intent: "visiteur" },
      { term: "annuaire diaspora africaine en France", volume: "fort", intent: "visiteur" },
      { term: "annuaire professionnel diaspora", volume: "moyen", intent: "inscription" },
      { term: "répertoire entreprises africaines", volume: "moyen", intent: "inscription" },
      { term: "annuaire commerçants africains", volume: "niche", intent: "inscription" },
      { term: "annuaire artisans africains France", volume: "niche", intent: "inscription" },
      { term: "pages jaunes diaspora africaine", volume: "niche", intent: "visiteur" },
      { term: "trouver entreprise africaine Paris", volume: "moyen", intent: "visiteur" },
    ],
  },
  {
    name: "Salons & Événements",
    icon: <Star size={16} />,
    keywords: [
      { term: "salon africain Paris 2026", volume: "fort", intent: "visiteur" },
      { term: "foire africaine Paris", volume: "fort", intent: "visiteur" },
      { term: "salon entrepreneurs africains", volume: "fort", intent: "inscription" },
      { term: "événement culturel africain Paris", volume: "fort", intent: "visiteur" },
      { term: "salon afro Paris 2026", volume: "fort", intent: "visiteur" },
      { term: "exposer salon africain Paris", volume: "moyen", intent: "inscription" },
      { term: "devenir exposant salon africain", volume: "moyen", intent: "inscription" },
      { term: "inscription salon africain Paris", volume: "moyen", intent: "inscription" },
      { term: "stand exposition africaine Paris", volume: "moyen", intent: "inscription" },
      { term: "marché africain Paris 2026", volume: "moyen", intent: "visiteur" },
      { term: "festival africain île de France", volume: "moyen", intent: "visiteur" },
      { term: "saison culturelle africaine Paris", volume: "moyen", intent: "visiteur" },
      { term: "Africa Market Week Paris", volume: "niche", intent: "visiteur" },
      { term: "salon du livre africain Paris", volume: "fort", intent: "visiteur" },
    ],
  },
  {
    name: "Mode & Textile Africain",
    icon: <Palette size={16} />,
    keywords: [
      { term: "mode africaine Paris", volume: "fort", intent: "visiteur" },
      { term: "créateur mode africaine", volume: "fort", intent: "inscription" },
      { term: "styliste africain Paris", volume: "moyen", intent: "inscription" },
      { term: "vêtements africains Paris", volume: "fort", intent: "visiteur" },
      { term: "tissu wax Paris", volume: "fort", intent: "visiteur" },
      { term: "boutique africaine Paris", volume: "fort", intent: "visiteur" },
      { term: "prêt à porter africain France", volume: "moyen", intent: "inscription" },
      { term: "accessoires africains Paris", volume: "moyen", intent: "visiteur" },
      { term: "bijoux africains artisanaux", volume: "moyen", intent: "inscription" },
      { term: "maroquinerie africaine France", volume: "niche", intent: "inscription" },
      { term: "textile africain France", volume: "moyen", intent: "inscription" },
      { term: "défilé mode africaine Paris", volume: "niche", intent: "visiteur" },
    ],
  },
  {
    name: "Cosmétique & Beauté",
    icon: <Sparkles size={16} />,
    keywords: [
      { term: "cosmétiques africains", volume: "fort", intent: "visiteur" },
      { term: "cosmétique naturel africain", volume: "fort", intent: "inscription" },
      { term: "cosmétiques bio africains France", volume: "moyen", intent: "inscription" },
      { term: "produits beauté africains Paris", volume: "moyen", intent: "visiteur" },
      { term: "beurre de karité artisanal France", volume: "moyen", intent: "inscription" },
      { term: "soins capillaires afro Paris", volume: "fort", intent: "visiteur" },
      { term: "marque cosmétique africaine", volume: "moyen", intent: "inscription" },
      { term: "produits naturels afrique", volume: "moyen", intent: "visiteur" },
      { term: "savon noir africain France", volume: "moyen", intent: "visiteur" },
      { term: "huiles végétales africaines", volume: "niche", intent: "inscription" },
    ],
  },
  {
    name: "Art & Artisanat",
    icon: <Palette size={16} />,
    keywords: [
      { term: "artisanat africain Paris", volume: "fort", intent: "visiteur" },
      { term: "art africain contemporain Paris", volume: "fort", intent: "visiteur" },
      { term: "artisan africain France", volume: "moyen", intent: "inscription" },
      { term: "décoration africaine Paris", volume: "moyen", intent: "visiteur" },
      { term: "galerie art africain Paris", volume: "moyen", intent: "visiteur" },
      { term: "sculpture africaine artisanale", volume: "niche", intent: "inscription" },
      { term: "peinture artiste africain France", volume: "niche", intent: "inscription" },
      { term: "objet déco africain", volume: "moyen", intent: "visiteur" },
      { term: "création artisanale africaine", volume: "niche", intent: "inscription" },
      { term: "exposition art africain Paris 2026", volume: "moyen", intent: "visiteur" },
    ],
  },
  {
    name: "Gastronomie & Alimentaire",
    icon: <ShoppingBag size={16} />,
    keywords: [
      { term: "épicerie africaine Paris", volume: "fort", intent: "visiteur" },
      { term: "produits alimentaires africains France", volume: "fort", intent: "inscription" },
      { term: "restaurant africain Paris", volume: "fort", intent: "visiteur" },
      { term: "traiteur africain Paris", volume: "moyen", intent: "inscription" },
      { term: "épicerie fine africaine", volume: "moyen", intent: "inscription" },
      { term: "boissons africaines France", volume: "niche", intent: "inscription" },
      { term: "gastronomie africaine Paris", volume: "moyen", intent: "visiteur" },
      { term: "noix de cajou africaine France", volume: "niche", intent: "inscription" },
      { term: "infusion africaine bio", volume: "niche", intent: "inscription" },
      { term: "food truck africain Paris", volume: "niche", intent: "inscription" },
    ],
  },
  {
    name: "Entrepreneuriat & Business",
    icon: <TrendingUp size={16} />,
    keywords: [
      { term: "entrepreneur africain France", volume: "fort", intent: "general" },
      { term: "créer entreprise diaspora africaine", volume: "moyen", intent: "general" },
      { term: "réseau entrepreneurs africains France", volume: "moyen", intent: "partenariat" },
      { term: "startup africaine Paris", volume: "moyen", intent: "partenariat" },
      { term: "business africain France", volume: "moyen", intent: "general" },
      { term: "investir Afrique depuis France", volume: "moyen", intent: "partenariat" },
      { term: "chambre commerce africaine France", volume: "niche", intent: "partenariat" },
      { term: "accompagnement entrepreneur africain", volume: "niche", intent: "partenariat" },
      { term: "financement diaspora africaine", volume: "moyen", intent: "partenariat" },
      { term: "incubateur afro France", volume: "niche", intent: "partenariat" },
      { term: "CPCCAF partenariat Afrique", volume: "niche", intent: "partenariat" },
      { term: "meet africa entrepreneur", volume: "niche", intent: "partenariat" },
    ],
  },
  {
    name: "Partenariats & Sponsors",
    icon: <Users size={16} />,
    keywords: [
      { term: "partenariat événement africain", volume: "moyen", intent: "partenariat" },
      { term: "sponsor salon africain Paris", volume: "niche", intent: "partenariat" },
      { term: "devenir partenaire foire africaine", volume: "niche", intent: "partenariat" },
      { term: "mécénat culture africaine France", volume: "niche", intent: "partenariat" },
      { term: "partenaire diaspora africaine", volume: "niche", intent: "partenariat" },
      { term: "collaboration marques africaines", volume: "niche", intent: "partenariat" },
      { term: "distribution produits africains France", volume: "moyen", intent: "partenariat" },
      { term: "import export Afrique France", volume: "moyen", intent: "partenariat" },
      { term: "grossiste produits africains", volume: "moyen", intent: "partenariat" },
      { term: "partenariat commercial Afrique France", volume: "niche", intent: "partenariat" },
    ],
  },
  {
    name: "Immobilier & Services",
    icon: <Globe size={16} />,
    keywords: [
      { term: "immobilier Afrique diaspora", volume: "moyen", intent: "inscription" },
      { term: "investir immobilier Afrique", volume: "fort", intent: "general" },
      { term: "agence immobilière africaine Paris", volume: "niche", intent: "inscription" },
      { term: "services diaspora africaine France", volume: "niche", intent: "inscription" },
      { term: "transfert argent Afrique", volume: "fort", intent: "general" },
      { term: "avocat droit africain Paris", volume: "niche", intent: "inscription" },
      { term: "comptable entreprise africaine", volume: "niche", intent: "inscription" },
      { term: "assurance diaspora africaine", volume: "niche", intent: "inscription" },
    ],
  },
  {
    name: "Édition & Média",
    icon: <Globe size={16} />,
    keywords: [
      { term: "éditeur africain France", volume: "niche", intent: "inscription" },
      { term: "livre auteur africain", volume: "moyen", intent: "visiteur" },
      { term: "librairie africaine Paris", volume: "moyen", intent: "visiteur" },
      { term: "média diaspora africaine", volume: "niche", intent: "partenariat" },
      { term: "magazine africain France", volume: "niche", intent: "partenariat" },
      { term: "podcast diaspora africaine", volume: "niche", intent: "partenariat" },
      { term: "influenceur afro France", volume: "moyen", intent: "partenariat" },
      { term: "blog culture africaine", volume: "niche", intent: "visiteur" },
      { term: "presse africaine France", volume: "niche", intent: "partenariat" },
      { term: "production audiovisuelle africaine", volume: "niche", intent: "inscription" },
    ],
  },
];

const VOLUME_BADGE = {
  fort: { label: "Fort", className: "bg-green-100 text-green-700" },
  moyen: { label: "Moyen", className: "bg-yellow-100 text-yellow-700" },
  niche: { label: "Niche", className: "bg-blue-100 text-blue-700" },
};

const INTENT_BADGE = {
  inscription: { label: "Inscription", className: "bg-[#C4704B]/10 text-[#C4704B]" },
  partenariat: { label: "Partenariat", className: "bg-purple-100 text-purple-700" },
  visiteur: { label: "Visiteur", className: "bg-gray-100 text-gray-600" },
  general: { label: "Général", className: "bg-slate-100 text-slate-600" },
};

export default function KeywordsPanel() {
  const [search, setSearch] = useState("");
  const [filterIntent, setFilterIntent] = useState<string>("");
  const [filterVolume, setFilterVolume] = useState<string>("");
  const [openCats, setOpenCats] = useState<Set<string>>(new Set(KEYWORD_DATA.map((c) => c.name)));

  const totalKeywords = KEYWORD_DATA.reduce((s, c) => s + c.keywords.length, 0);

  const toggleCat = (name: string) => {
    setOpenCats((prev) => {
      const next = new Set(prev);
      if (next.has(name)) next.delete(name);
      else next.add(name);
      return next;
    });
  };

  const filteredData = KEYWORD_DATA.map((cat) => ({
    ...cat,
    keywords: cat.keywords.filter((kw) => {
      if (search && !kw.term.toLowerCase().includes(search.toLowerCase())) return false;
      if (filterIntent && kw.intent !== filterIntent) return false;
      if (filterVolume && kw.volume !== filterVolume) return false;
      return true;
    }),
  })).filter((cat) => cat.keywords.length > 0);

  const filteredCount = filteredData.reduce((s, c) => s + c.keywords.length, 0);

  return (
    <div className="mt-10 rounded-xl border border-[#F0ECE7] bg-white">
      {/* Header */}
      <div className="border-b border-[#F0ECE7] px-6 py-5">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-lg font-bold text-[#2C2C2C]">
              Recherche de mots-clés SEO
            </h2>
            <p className="mt-1 text-sm text-[#6B6B6B]">
              {totalKeywords} mots-clés pour attirer des entreprises et partenaires vers L&apos;Officiel d&apos;Afrique
            </p>
          </div>
          <div className="flex items-center gap-2 text-xs text-[#999]">
            <TrendingUp size={14} />
            {filteredCount} résultat{filteredCount > 1 ? "s" : ""}
          </div>
        </div>

        {/* Filters */}
        <div className="mt-4 flex flex-wrap gap-3">
          <div className="relative flex-1 min-w-[200px]">
            <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#999]" />
            <input
              type="text"
              placeholder="Rechercher un mot-clé..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full rounded-lg border border-[#E0E0E0] bg-white py-2 pl-9 pr-3 text-sm outline-none focus:border-[#C4704B]"
            />
          </div>
          <select
            value={filterIntent}
            onChange={(e) => setFilterIntent(e.target.value)}
            className="rounded-lg border border-[#E0E0E0] px-3 py-2 text-sm outline-none focus:border-[#C4704B]"
          >
            <option value="">Tous les objectifs</option>
            <option value="inscription">Inscription</option>
            <option value="partenariat">Partenariat</option>
            <option value="visiteur">Visiteur</option>
            <option value="general">Général</option>
          </select>
          <select
            value={filterVolume}
            onChange={(e) => setFilterVolume(e.target.value)}
            className="rounded-lg border border-[#E0E0E0] px-3 py-2 text-sm outline-none focus:border-[#C4704B]"
          >
            <option value="">Tous les volumes</option>
            <option value="fort">Fort</option>
            <option value="moyen">Moyen</option>
            <option value="niche">Niche</option>
          </select>
        </div>
      </div>

      {/* Categories */}
      <div className="divide-y divide-[#F0ECE7]">
        {filteredData.map((cat) => (
          <div key={cat.name}>
            <button
              onClick={() => toggleCat(cat.name)}
              className="flex w-full items-center gap-2 px-6 py-3 text-left text-sm font-semibold text-[#2C2C2C] hover:bg-[#FAFAF7] transition-colors"
            >
              {cat.icon}
              {cat.name}
              <span className="ml-auto rounded-full bg-[#F5F0EB] px-2 py-0.5 text-[11px] font-medium text-[#C4704B]">
                {cat.keywords.length}
              </span>
              <span className={`ml-1 text-[#999] transition-transform ${openCats.has(cat.name) ? "rotate-90" : ""}`}>
                ▶
              </span>
            </button>
            {openCats.has(cat.name) && (
              <div className="px-6 pb-4">
                <div className="grid grid-cols-1 gap-2 sm:grid-cols-2 lg:grid-cols-3">
                  {cat.keywords.map((kw) => {
                    const vol = VOLUME_BADGE[kw.volume];
                    const intent = INTENT_BADGE[kw.intent];
                    return (
                      <div
                        key={kw.term}
                        className="flex items-center justify-between rounded-lg border border-[#F0ECE7] px-3 py-2 text-sm hover:bg-[#FAFAF7]"
                      >
                        <span className="text-[#2C2C2C] font-medium truncate mr-2">{kw.term}</span>
                        <div className="flex shrink-0 gap-1.5">
                          <span className={`rounded px-1.5 py-0.5 text-[10px] font-semibold ${vol.className}`}>
                            {vol.label}
                          </span>
                          <span className={`rounded px-1.5 py-0.5 text-[10px] font-semibold ${intent.className}`}>
                            {intent.label}
                          </span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}
          </div>
        ))}
      </div>

      {filteredData.length === 0 && (
        <div className="px-6 py-12 text-center text-sm text-[#999]">
          Aucun mot-clé ne correspond à votre recherche.
        </div>
      )}

      {/* Legend */}
      <div className="border-t border-[#F0ECE7] px-6 py-4">
        <p className="text-[11px] font-semibold uppercase tracking-wider text-[#999] mb-2">Légende</p>
        <div className="flex flex-wrap gap-4 text-[11px]">
          <div className="flex items-center gap-3">
            <span className="font-medium text-[#6B6B6B]">Volume :</span>
            <span className="rounded bg-green-100 px-1.5 py-0.5 font-semibold text-green-700">Fort</span>
            <span className="rounded bg-yellow-100 px-1.5 py-0.5 font-semibold text-yellow-700">Moyen</span>
            <span className="rounded bg-blue-100 px-1.5 py-0.5 font-semibold text-blue-700">Niche</span>
          </div>
          <div className="flex items-center gap-3">
            <span className="font-medium text-[#6B6B6B]">Objectif :</span>
            <span className="rounded bg-[#C4704B]/10 px-1.5 py-0.5 font-semibold text-[#C4704B]">Inscription</span>
            <span className="rounded bg-purple-100 px-1.5 py-0.5 font-semibold text-purple-700">Partenariat</span>
            <span className="rounded bg-gray-100 px-1.5 py-0.5 font-semibold text-gray-600">Visiteur</span>
            <span className="rounded bg-slate-100 px-1.5 py-0.5 font-semibold text-slate-600">Général</span>
          </div>
        </div>
      </div>
    </div>
  );
}

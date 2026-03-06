"use client";

import { useState } from "react";
import { Search, ChevronRight } from "lucide-react";
import type { KeywordCategory } from "./seo-keywords-data";

const VOLUME_BADGE = {
  fort: { label: "Fort", cls: "bg-green-100 text-green-700" },
  moyen: { label: "Moyen", cls: "bg-yellow-100 text-yellow-700" },
  niche: { label: "Niche", cls: "bg-blue-100 text-blue-700" },
};

const INTENT_BADGE = {
  inscription: { label: "Inscription", cls: "bg-[#C4704B]/10 text-[#C4704B]" },
  partenariat: { label: "Partenariat", cls: "bg-purple-100 text-purple-700" },
  visiteur: { label: "Visiteur", cls: "bg-gray-100 text-gray-600" },
  conversion: { label: "Conversion", cls: "bg-emerald-100 text-emerald-700" },
  general: { label: "Général", cls: "bg-slate-100 text-slate-600" },
};

export default function SeoKeywordsPanel({
  categories,
  accentColor = "#C4704B",
}: {
  categories: KeywordCategory[];
  accentColor?: string;
}) {
  const [search, setSearch] = useState("");
  const [filterIntent, setFilterIntent] = useState("");
  const [filterVolume, setFilterVolume] = useState("");
  const [openCats, setOpenCats] = useState<Set<string>>(
    new Set(categories.map((c) => c.name))
  );

  const totalKw = categories.reduce((s, c) => s + c.keywords.length, 0);

  const toggleCat = (name: string) => {
    setOpenCats((prev) => {
      const next = new Set(prev);
      if (next.has(name)) next.delete(name);
      else next.add(name);
      return next;
    });
  };

  const filtered = categories
    .map((cat) => ({
      ...cat,
      keywords: cat.keywords.filter((kw) => {
        if (search && !kw.term.toLowerCase().includes(search.toLowerCase())) return false;
        if (filterIntent && kw.intent !== filterIntent) return false;
        if (filterVolume && kw.volume !== filterVolume) return false;
        return true;
      }),
    }))
    .filter((cat) => cat.keywords.length > 0);

  const filteredCount = filtered.reduce((s, c) => s + c.keywords.length, 0);

  return (
    <div className="rounded-xl border border-[#F0ECE7] bg-white">
      <div className="border-b border-[#F0ECE7] px-6 py-4">
        <div className="flex items-center justify-between">
          <p className="text-sm font-semibold text-[#2C2C2C]">
            {totalKw} mots-cl&eacute;s &middot; {filteredCount} affich&eacute;s
          </p>
        </div>
        <div className="mt-3 flex flex-wrap gap-3">
          <div className="relative flex-1 min-w-[180px]">
            <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#999]" />
            <input
              type="text"
              placeholder="Rechercher..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full rounded-lg border border-[#E0E0E0] bg-white py-2 pl-9 pr-3 text-sm outline-none focus:border-[#C4704B]"
            />
          </div>
          <select
            value={filterIntent}
            onChange={(e) => setFilterIntent(e.target.value)}
            className="rounded-lg border border-[#E0E0E0] px-3 py-2 text-sm outline-none"
          >
            <option value="">Tous objectifs</option>
            <option value="inscription">Inscription</option>
            <option value="partenariat">Partenariat</option>
            <option value="visiteur">Visiteur</option>
            <option value="conversion">Conversion</option>
            <option value="general">Général</option>
          </select>
          <select
            value={filterVolume}
            onChange={(e) => setFilterVolume(e.target.value)}
            className="rounded-lg border border-[#E0E0E0] px-3 py-2 text-sm outline-none"
          >
            <option value="">Tous volumes</option>
            <option value="fort">Fort</option>
            <option value="moyen">Moyen</option>
            <option value="niche">Niche</option>
          </select>
        </div>
      </div>

      <div className="divide-y divide-[#F0ECE7]">
        {filtered.map((cat) => (
          <div key={cat.name}>
            <button
              onClick={() => toggleCat(cat.name)}
              className="flex w-full items-center gap-2 px-6 py-3 text-left text-sm font-semibold text-[#2C2C2C] hover:bg-[#FAFAF7]"
            >
              <ChevronRight
                size={14}
                className={`text-[#999] transition-transform ${openCats.has(cat.name) ? "rotate-90" : ""}`}
              />
              {cat.name}
              <span
                className="ml-auto rounded-full px-2 py-0.5 text-[11px] font-medium"
                style={{ backgroundColor: accentColor + "15", color: accentColor }}
              >
                {cat.keywords.length}
              </span>
            </button>
            {openCats.has(cat.name) && (
              <div className="px-6 pb-4">
                <div className="grid grid-cols-1 gap-2 sm:grid-cols-2 lg:grid-cols-3">
                  {cat.keywords.map((kw) => (
                    <div
                      key={kw.term}
                      className="flex items-center justify-between rounded-lg border border-[#F0ECE7] px-3 py-2 text-sm hover:bg-[#FAFAF7]"
                    >
                      <span className="font-medium text-[#2C2C2C] truncate mr-2">{kw.term}</span>
                      <div className="flex shrink-0 gap-1.5">
                        <span className={`rounded px-1.5 py-0.5 text-[10px] font-semibold ${VOLUME_BADGE[kw.volume].cls}`}>
                          {VOLUME_BADGE[kw.volume].label}
                        </span>
                        <span className={`rounded px-1.5 py-0.5 text-[10px] font-semibold ${INTENT_BADGE[kw.intent].cls}`}>
                          {INTENT_BADGE[kw.intent].label}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        ))}
      </div>

      {filtered.length === 0 && (
        <div className="px-6 py-12 text-center text-sm text-[#999]">
          Aucun mot-cl&eacute; trouv&eacute;.
        </div>
      )}
    </div>
  );
}

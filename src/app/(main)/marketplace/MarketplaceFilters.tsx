"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { Search, X } from "lucide-react";
import { Suspense, useState, useCallback } from "react";

interface FiltersProps {
  categories: string[];
  countries: string[];
  currentCategory?: string;
  currentCountry?: string;
  currentSort?: string;
  currentQ?: string;
  resultCount: number;
}

const SORT_OPTIONS = [
  { value: "", label: "Nouveaut\u00e9s" },
  { value: "popular", label: "Populaire" },
  { value: "price_asc", label: "Prix \u2191" },
  { value: "price_desc", label: "Prix \u2193" },
];

function FiltersInner(props: FiltersProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [search, setSearch] = useState(props.currentQ || "");

  const updateFilter = useCallback(
    (key: string, value: string | null) => {
      const params = new URLSearchParams(searchParams.toString());
      if (value) {
        params.set(key, value);
      } else {
        params.delete(key);
      }
      router.push(`/marketplace?${params.toString()}`);
    },
    [router, searchParams],
  );

  const clearFilters = () => {
    setSearch("");
    router.push("/marketplace");
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    updateFilter("q", search.trim() || null);
  };

  const hasFilters =
    props.currentCategory || props.currentCountry || props.currentQ || props.currentSort;

  return (
    <div className="rounded-2xl bg-white p-5 shadow-sm">
      {/* Search bar */}
      <form onSubmit={handleSearch} className="relative mb-4">
        <Search
          size={18}
          className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#999]"
        />
        <input
          type="text"
          placeholder="Rechercher un produit, un artisan..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full rounded-full border border-[#E5E0DB] bg-[#FAFAF7] py-2.5 pl-10 pr-4 text-sm text-[#2C2C2C] placeholder:text-[#B0AAA3] focus:border-[#C4704B] focus:outline-none focus:ring-1 focus:ring-[#C4704B]/30"
        />
        {search && (
          <button
            type="button"
            onClick={() => {
              setSearch("");
              updateFilter("q", null);
            }}
            className="absolute right-3.5 top-1/2 -translate-y-1/2 text-[#999] hover:text-[#2C2C2C]"
          >
            <X size={16} />
          </button>
        )}
      </form>

      {/* Category pills */}
      <div className="flex flex-wrap items-center gap-2">
        <span className="mr-1 text-xs font-medium uppercase tracking-wider text-[#999]">
          Cat&eacute;gories
        </span>
        <button
          onClick={() => updateFilter("category", null)}
          className={`rounded-full px-4 py-1.5 text-sm font-medium transition-colors ${
            !props.currentCategory
              ? "bg-[#C4704B] text-white"
              : "bg-[#F5F0EB] text-[#6B6B6B] hover:bg-[#EDE5DD]"
          }`}
        >
          Tous
        </button>
        {props.categories.map((cat) => (
          <button
            key={cat}
            onClick={() =>
              updateFilter("category", cat === props.currentCategory ? null : cat)
            }
            className={`rounded-full px-4 py-1.5 text-sm font-medium transition-colors ${
              props.currentCategory === cat
                ? "bg-[#C4704B] text-white"
                : "bg-[#F5F0EB] text-[#6B6B6B] hover:bg-[#EDE5DD]"
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Sort + Country + Result count */}
      <div className="mt-4 flex flex-wrap items-center gap-3 border-t border-[#F0ECE7] pt-4">
        {/* Sort pills */}
        <div className="flex items-center gap-1.5">
          <span className="mr-1 text-xs font-medium uppercase tracking-wider text-[#999]">
            Tri
          </span>
          {SORT_OPTIONS.map((opt) => (
            <button
              key={opt.value}
              onClick={() => updateFilter("sort", opt.value || null)}
              className={`rounded-full px-3 py-1 text-xs font-medium transition-colors ${
                (props.currentSort || "") === opt.value
                  ? "bg-[#2C2C2C] text-white"
                  : "bg-[#F5F0EB] text-[#6B6B6B] hover:bg-[#EDE5DD]"
              }`}
            >
              {opt.label}
            </button>
          ))}
        </div>

        {/* Country dropdown */}
        <select
          value={props.currentCountry || ""}
          onChange={(e) => updateFilter("country", e.target.value || null)}
          className="rounded-full border border-[#E5E0DB] bg-[#FAFAF7] px-3 py-1.5 text-xs text-[#6B6B6B] focus:border-[#C4704B] focus:outline-none"
        >
          <option value="">Tous pays</option>
          {props.countries.map((c) => (
            <option key={c} value={c}>
              {c}
            </option>
          ))}
        </select>

        {/* Clear + count */}
        {hasFilters && (
          <button
            onClick={clearFilters}
            className="flex items-center gap-1 rounded-full bg-[#C4704B]/10 px-3 py-1.5 text-xs font-medium text-[#C4704B] hover:bg-[#C4704B]/20"
          >
            <X size={12} />
            Effacer
          </button>
        )}

        <span className="ml-auto rounded-full bg-[#F5F0EB] px-3 py-1 text-xs font-medium text-[#6B6B6B]">
          {props.resultCount} produit{props.resultCount !== 1 ? "s" : ""}
        </span>
      </div>
    </div>
  );
}

export default function MarketplaceFilters(props: FiltersProps) {
  return (
    <Suspense fallback={<div className="h-36 rounded-2xl bg-white shadow-sm" />}>
      <FiltersInner {...props} />
    </Suspense>
  );
}

"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { SlidersHorizontal, X } from "lucide-react";
import { Suspense } from "react";

interface FiltersProps {
  categories: string[];
  countries: string[];
  currentCategory?: string;
  currentCountry?: string;
  currentSort?: string;
  currentMinPrice?: string;
  currentMaxPrice?: string;
  resultCount: number;
}

function FiltersInner(props: FiltersProps) {
  const router = useRouter();
  const searchParams = useSearchParams();

  const updateFilter = (key: string, value: string | null) => {
    const params = new URLSearchParams(searchParams.toString());
    if (value) {
      params.set(key, value);
    } else {
      params.delete(key);
    }
    router.push(`/marketplace?${params.toString()}`);
  };

  const clearFilters = () => {
    router.push("/marketplace");
  };

  const hasFilters =
    props.currentCategory || props.currentCountry || props.currentMinPrice || props.currentMaxPrice;

  return (
    <div className="mb-8">
      <div className="flex flex-wrap items-center gap-3">
        <div className="flex items-center gap-1.5 text-sm font-medium text-dta-char">
          <SlidersHorizontal size={14} />
          Filtrer
        </div>

        {/* Category */}
        <select
          value={props.currentCategory || ""}
          onChange={(e) => updateFilter("category", e.target.value || null)}
          className="rounded-[var(--radius-full)] border border-dta-sand bg-white px-3 py-1.5 text-sm text-dta-char focus:border-dta-accent focus:outline-none"
        >
          <option value="">Toutes catégories</option>
          {props.categories.map((c) => (
            <option key={c} value={c}>{c}</option>
          ))}
        </select>

        {/* Country */}
        <select
          value={props.currentCountry || ""}
          onChange={(e) => updateFilter("country", e.target.value || null)}
          className="rounded-[var(--radius-full)] border border-dta-sand bg-white px-3 py-1.5 text-sm text-dta-char focus:border-dta-accent focus:outline-none"
        >
          <option value="">Tous pays</option>
          {props.countries.map((c) => (
            <option key={c} value={c}>{c}</option>
          ))}
        </select>

        {/* Sort */}
        <select
          value={props.currentSort || ""}
          onChange={(e) => updateFilter("sort", e.target.value || null)}
          className="rounded-[var(--radius-full)] border border-dta-sand bg-white px-3 py-1.5 text-sm text-dta-char focus:border-dta-accent focus:outline-none"
        >
          <option value="">Tri : Récents</option>
          <option value="price_asc">Prix croissant</option>
          <option value="price_desc">Prix décroissant</option>
        </select>

        {/* Price range */}
        <input
          type="number"
          placeholder="Min €"
          value={props.currentMinPrice || ""}
          onChange={(e) => updateFilter("minPrice", e.target.value || null)}
          className="w-20 rounded-[var(--radius-full)] border border-dta-sand bg-white px-3 py-1.5 text-sm text-dta-char focus:border-dta-accent focus:outline-none"
        />
        <span className="text-xs text-dta-taupe">—</span>
        <input
          type="number"
          placeholder="Max €"
          value={props.currentMaxPrice || ""}
          onChange={(e) => updateFilter("maxPrice", e.target.value || null)}
          className="w-20 rounded-[var(--radius-full)] border border-dta-sand bg-white px-3 py-1.5 text-sm text-dta-char focus:border-dta-accent focus:outline-none"
        />

        {hasFilters && (
          <button
            onClick={clearFilters}
            className="flex items-center gap-1 rounded-[var(--radius-full)] bg-dta-accent/10 px-3 py-1.5 text-xs font-medium text-dta-accent hover:bg-dta-accent/20"
          >
            <X size={12} />
            Effacer
          </button>
        )}

        <span className="ml-auto text-xs text-dta-taupe">
          {props.resultCount} produit{props.resultCount !== 1 ? "s" : ""}
        </span>
      </div>
    </div>
  );
}

export default function MarketplaceFilters(props: FiltersProps) {
  return (
    <Suspense fallback={<div className="mb-8 h-10" />}>
      <FiltersInner {...props} />
    </Suspense>
  );
}

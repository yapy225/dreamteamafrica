"use client";

import { useState } from "react";
import Link from "next/link";
import { ChevronRight, KeyRound, BarChart3 } from "lucide-react";
import type { SeoSection } from "./seo-keywords-data";
import SeoKeywordsPanel from "./SeoKeywordsPanel";
import SeoArticleTracker from "./SeoArticleTracker";

export default function SeoSectionPage({ section }: { section: SeoSection }) {
  const [tab, setTab] = useState<"keywords" | "tracker">("keywords");

  const totalKw = section.keywords.reduce((s, c) => s + c.keywords.length, 0);
  const allKwList = section.keywords.flatMap((c) => c.keywords.map((k) => k.term));

  return (
    <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
      {/* Breadcrumb */}
      <nav className="mb-6 flex items-center gap-1.5 text-xs text-[#999]">
        <Link href="/dashboard" className="hover:text-[#C4704B]">Dashboard</Link>
        <ChevronRight size={12} />
        <Link href="/dashboard/seo" className="hover:text-[#C4704B]">Hub SEO</Link>
        <ChevronRight size={12} />
        <span className="text-[#2C2C2C]">{section.title}</span>
      </nav>

      {/* Header */}
      <div className="mb-8 flex items-center gap-4">
        <div
          className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl text-white font-bold"
          style={{ backgroundColor: section.color }}
        >
          {section.title.slice(0, 2).toUpperCase()}
        </div>
        <div>
          <h1 className="text-2xl font-bold text-[#2C2C2C]">{section.title}</h1>
          <p className="text-sm text-[#6B6B6B]">{section.description}</p>
        </div>
      </div>

      {/* Tabs */}
      <div className="mb-6 flex gap-2">
        <button
          onClick={() => setTab("keywords")}
          className={`flex items-center gap-2 rounded-lg px-4 py-2.5 text-sm font-semibold transition-colors ${
            tab === "keywords"
              ? "text-white"
              : "bg-white border border-[#E0E0E0] text-[#4a4a4a] hover:bg-[#F5F0EB]"
          }`}
          style={tab === "keywords" ? { backgroundColor: section.color } : undefined}
        >
          <KeyRound size={16} />
          Mots-cl&eacute;s ({totalKw})
        </button>
        <button
          onClick={() => setTab("tracker")}
          className={`flex items-center gap-2 rounded-lg px-4 py-2.5 text-sm font-semibold transition-colors ${
            tab === "tracker"
              ? "text-white"
              : "bg-white border border-[#E0E0E0] text-[#4a4a4a] hover:bg-[#F5F0EB]"
          }`}
          style={tab === "tracker" ? { backgroundColor: section.color } : undefined}
        >
          <BarChart3 size={16} />
          Suivi &amp; Maillage
        </button>
      </div>

      {/* Content */}
      {tab === "keywords" && (
        <SeoKeywordsPanel categories={section.keywords} accentColor={section.color} />
      )}
      {tab === "tracker" && (
        <SeoArticleTracker sectionKeywords={allKwList} />
      )}
    </div>
  );
}

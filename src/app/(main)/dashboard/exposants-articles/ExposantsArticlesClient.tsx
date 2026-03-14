"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

type Entry = {
  id: string;
  companyName: string;
  contactName: string;
  category: string;
  email: string | null;
  phone: string | null;
  description: string;
  instagram: string | null;
  facebook: string | null;
  hasArticle: boolean;
  articleSlug: string | null;
};

type Data = {
  entries: Entry[];
  total: number;
  withArticle: number;
  withoutArticle: number;
};

export default function ExposantsArticlesClient() {
  const [data, setData] = useState<Data | null>(null);
  const [loading, setLoading] = useState(true);
  const [generating, setGenerating] = useState<string | null>(null);
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState<"all" | "with" | "without">("all");
  const [bulkRunning, setBulkRunning] = useState(false);
  const [bulkProgress, setBulkProgress] = useState({ done: 0, total: 0 });

  async function fetchData() {
    const res = await fetch("/api/admin/exposants-articles");
    if (res.ok) setData(await res.json());
    setLoading(false);
  }

  useEffect(() => { fetchData(); }, []);

  async function generateArticle(entryId: string) {
    setGenerating(entryId);
    try {
      const res = await fetch("/api/admin/exposants-articles", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ entryId }),
      });
      if (res.ok) {
        await fetchData();
      } else {
        const err = await res.json();
        alert(err.error || "Erreur");
      }
    } catch {
      alert("Erreur réseau");
    }
    setGenerating(null);
  }

  async function generateAll() {
    if (!data) return;
    const toGenerate = filtered.filter((e) => !e.hasArticle);
    if (!toGenerate.length) return alert("Tous les articles sont déjà générés !");
    if (!confirm(`Générer ${toGenerate.length} articles ? Cela peut prendre plusieurs minutes.`)) return;

    setBulkRunning(true);
    setBulkProgress({ done: 0, total: toGenerate.length });

    for (const entry of toGenerate) {
      setGenerating(entry.id);
      try {
        await fetch("/api/admin/exposants-articles", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ entryId: entry.id }),
        });
      } catch {}
      setBulkProgress((p) => ({ ...p, done: p.done + 1 }));
    }

    setGenerating(null);
    setBulkRunning(false);
    await fetchData();
  }

  if (loading) return <div className="p-12 text-center">Chargement...</div>;
  if (!data) return <div className="p-12 text-center text-red-500">Erreur de chargement</div>;

  const filtered = data.entries.filter((e) => {
    const matchSearch = !search ||
      e.companyName.toLowerCase().includes(search.toLowerCase()) ||
      e.contactName.toLowerCase().includes(search.toLowerCase()) ||
      (e.category || "").toLowerCase().includes(search.toLowerCase());
    const matchFilter =
      filter === "all" ? true :
      filter === "with" ? e.hasArticle :
      !e.hasArticle;
    return matchSearch && matchFilter;
  });

  return (
    <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
      <div className="mb-2 flex items-center justify-between">
        <h1 className="font-serif text-3xl font-bold text-dta-dark">
          Articles Sponsorisés — Exposants
        </h1>
        <button
          onClick={generateAll}
          disabled={bulkRunning}
          className="rounded-lg bg-dta-accent px-4 py-2 text-sm font-medium text-white hover:bg-dta-accent/90 disabled:opacity-50"
        >
          {bulkRunning
            ? `Génération ${bulkProgress.done}/${bulkProgress.total}...`
            : `Générer tout (${data.withoutArticle})`}
        </button>
      </div>
      <p className="mb-8 text-dta-char/70">
        Générez des articles sponsorisés pour chaque exposant avec couverture DALL-E
      </p>

      {/* Stats */}
      <div className="mb-6 grid grid-cols-3 gap-4">
        <div className="rounded-xl bg-white p-5 shadow-sm">
          <p className="text-xs font-medium text-dta-taupe">Total exposants</p>
          <p className="mt-1 font-serif text-2xl font-bold text-dta-dark">{data.total}</p>
        </div>
        <div className="rounded-xl bg-white p-5 shadow-sm">
          <p className="text-xs font-medium text-green-600">Avec article</p>
          <p className="mt-1 font-serif text-2xl font-bold text-green-600">{data.withArticle}</p>
        </div>
        <div className="rounded-xl bg-white p-5 shadow-sm">
          <p className="text-xs font-medium text-amber-600">Sans article</p>
          <p className="mt-1 font-serif text-2xl font-bold text-amber-600">{data.withoutArticle}</p>
        </div>
      </div>

      {/* Filters */}
      <div className="mb-6 flex flex-wrap items-center gap-3">
        <input
          type="text"
          placeholder="Rechercher..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="rounded-lg border border-dta-sand px-3 py-2 text-sm"
        />
        <select
          value={filter}
          onChange={(e) => setFilter(e.target.value as typeof filter)}
          className="rounded-lg border border-dta-sand px-3 py-2 text-sm"
        >
          <option value="all">Tous ({data.total})</option>
          <option value="with">Avec article ({data.withArticle})</option>
          <option value="without">Sans article ({data.withoutArticle})</option>
        </select>
      </div>

      {/* Table */}
      <div className="overflow-x-auto rounded-xl bg-white shadow-sm">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-dta-sand text-left">
              <th className="px-4 py-3 font-medium text-dta-taupe">Entreprise</th>
              <th className="px-4 py-3 font-medium text-dta-taupe">Secteur</th>
              <th className="px-4 py-3 font-medium text-dta-taupe">Contact</th>
              <th className="px-4 py-3 font-medium text-dta-taupe">Description</th>
              <th className="px-4 py-3 font-medium text-dta-taupe">Statut</th>
              <th className="px-4 py-3 font-medium text-dta-taupe">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filtered.length === 0 && (
              <tr>
                <td colSpan={6} className="px-4 py-8 text-center text-dta-taupe">
                  Aucun résultat
                </td>
              </tr>
            )}
            {filtered.map((e) => (
              <tr key={e.id} className="border-b border-dta-sand/50 hover:bg-dta-bg/50">
                <td className="px-4 py-3">
                  <p className="font-medium text-dta-dark">{e.companyName}</p>
                  <p className="text-xs text-dta-taupe">{e.contactName}</p>
                </td>
                <td className="px-4 py-3 text-dta-char">{e.category}</td>
                <td className="px-4 py-3">
                  <p className="text-xs text-dta-char">{e.email}</p>
                  <p className="text-xs text-dta-taupe">{e.phone}</p>
                </td>
                <td className="max-w-[250px] px-4 py-3">
                  <p className="truncate text-xs text-dta-char/70">{e.description}</p>
                </td>
                <td className="px-4 py-3">
                  {e.hasArticle ? (
                    <span className="rounded-full bg-green-100 px-2 py-0.5 text-xs font-medium text-green-700">
                      Publié
                    </span>
                  ) : (
                    <span className="rounded-full bg-gray-100 px-2 py-0.5 text-xs font-medium text-gray-600">
                      En attente
                    </span>
                  )}
                </td>
                <td className="px-4 py-3">
                  {e.hasArticle ? (
                    <Link
                      href={`/lafropeen/${e.articleSlug}`}
                      className="rounded-lg border border-dta-sand px-3 py-1.5 text-xs font-medium text-dta-char hover:bg-dta-beige"
                      target="_blank"
                    >
                      Voir
                    </Link>
                  ) : (
                    <button
                      onClick={() => generateArticle(e.id)}
                      disabled={generating === e.id || bulkRunning}
                      className="rounded-lg bg-dta-accent px-3 py-1.5 text-xs font-medium text-white hover:bg-dta-accent/90 disabled:opacity-50"
                    >
                      {generating === e.id ? "Génération..." : "Générer"}
                    </button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

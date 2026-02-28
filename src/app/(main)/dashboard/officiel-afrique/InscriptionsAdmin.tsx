"use client";

import { useState, useEffect, useCallback } from "react";
import {
  Search,
  Plus,
  Download,
  Eye,
  Pencil,
  CheckCircle,
  XCircle,
  Trash2,
  Loader2,
  X,
  ChevronLeft,
  ChevronRight,
  Building2,
  Clock,
  CheckCheck,
  Ban,
} from "lucide-react";

/* ─── Types ──────────────────────────────────────────────── */

interface Inscription {
  id: string;
  entreprise: string;
  categorie: string;
  directeur: string;
  adresse: string | null;
  ville: string;
  codePostal: string | null;
  pays: string;
  mobile: string;
  telephone: string | null;
  email: string;
  siteWeb: string | null;
  facebook: string | null;
  instagram: string | null;
  tiktok: string | null;
  whatsapp: string | null;
  youtube: string | null;
  linkedin: string | null;
  description: string;
  motsCles: string | null;
  newsletter: boolean;
  status: "PENDING" | "VALIDATED" | "REJECTED";
  createdAt: string;
  updatedAt: string;
}

interface Stats {
  total: number;
  pending: number;
  validated: number;
  rejected: number;
}

interface APIResponse {
  inscriptions: Inscription[];
  total: number;
  page: number;
  pages: number;
  stats: Stats;
  categories: string[];
}

/* ─── Helpers ────────────────────────────────────────────── */

const statusConfig = {
  PENDING: { label: "En attente", color: "bg-orange-100 text-orange-700", icon: Clock },
  VALIDATED: { label: "Valid\u00e9e", color: "bg-green-100 text-green-700", icon: CheckCheck },
  REJECTED: { label: "Refus\u00e9e", color: "bg-red-100 text-red-700", icon: Ban },
};

function formatDate(d: string) {
  return new Date(d).toLocaleDateString("fr-FR", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

const inputClass =
  "w-full rounded-[var(--radius-input)] border border-dta-sand bg-dta-bg px-4 py-2.5 text-sm text-dta-dark placeholder:text-dta-taupe focus:border-dta-accent focus:outline-none focus:ring-1 focus:ring-dta-accent";

const CATEGORIES_PRESET = [
  "Restaurant",
  "Commerce",
  "Mode & Textile",
  "Coiffure & Beauté",
  "Services",
  "Artisanat",
  "Culture & Art",
  "Santé & Bien-être",
  "Éducation",
  "Technologie",
  "Immobilier",
  "Transport",
  "Autre",
];

/* ─── Empty Form Data ────────────────────────────────────── */

function emptyForm() {
  return {
    entreprise: "",
    categorie: "",
    directeur: "",
    adresse: "",
    ville: "",
    codePostal: "",
    pays: "France",
    mobile: "",
    telephone: "",
    email: "",
    siteWeb: "",
    facebook: "",
    instagram: "",
    tiktok: "",
    whatsapp: "",
    youtube: "",
    linkedin: "",
    description: "",
    motsCles: "",
    newsletter: false,
    status: "PENDING" as const,
  };
}

/* ═══ MAIN COMPONENT ═════════════════════════════════════ */

export default function InscriptionsAdmin() {
  const [data, setData] = useState<APIResponse | null>(null);
  const [loading, setLoading] = useState(true);

  // Filters
  const [statusFilter, setStatusFilter] = useState("");
  const [catFilter, setCatFilter] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [page, setPage] = useState(1);

  // Modals
  const [viewInscription, setViewInscription] = useState<Inscription | null>(null);
  const [editInscription, setEditInscription] = useState<Inscription | null>(null);
  const [createOpen, setCreateOpen] = useState(false);

  // Action loading
  const [actionLoading, setActionLoading] = useState<string | null>(null);

  /* ─── Fetch ──────────────────────────────────────────── */

  const fetchData = useCallback(async () => {
    setLoading(true);
    const params = new URLSearchParams();
    params.set("page", String(page));
    params.set("limit", "20");
    if (statusFilter) params.set("status", statusFilter);
    if (catFilter) params.set("categorie", catFilter);
    if (searchQuery.length >= 2) params.set("q", searchQuery);

    try {
      const res = await fetch(`/api/admin/officiel-afrique?${params}`);
      if (res.ok) {
        const json = await res.json();
        setData(json);
      }
    } catch {
      // silent
    }
    setLoading(false);
  }, [page, statusFilter, catFilter, searchQuery]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  // Reset page when filters change
  useEffect(() => {
    setPage(1);
  }, [statusFilter, catFilter, searchQuery]);

  /* ─── Quick actions ─────────────────────────────────── */

  const quickStatus = async (id: string, status: string) => {
    setActionLoading(id);
    await fetch(`/api/admin/officiel-afrique/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status }),
    });
    setActionLoading(null);
    fetchData();
  };

  const handleDelete = async (insc: Inscription) => {
    if (!confirm(`Supprimer "${insc.entreprise}" ? Cette action est irr\u00e9versible.`)) return;
    setActionLoading(insc.id);
    await fetch(`/api/admin/officiel-afrique/${insc.id}`, { method: "DELETE" });
    setActionLoading(null);
    fetchData();
  };

  /* ─── CSV Export ────────────────────────────────────── */

  const handleExport = () => {
    window.open("/api/admin/officiel-afrique/export", "_blank");
  };

  /* ─── Stats ─────────────────────────────────────────── */

  const stats = data?.stats ?? { total: 0, pending: 0, validated: 0, rejected: 0 };

  return (
    <div>
      {/* ── Header ─────────────────────────────────────── */}
      <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="font-serif text-3xl font-bold text-dta-dark">
            Gestion &mdash; L&apos;Officiel d&apos;Afrique 2026
          </h1>
          <p className="mt-1 text-sm text-dta-char/70">
            Base de donn&eacute;es des inscriptions
          </p>
        </div>
        <div className="flex gap-2">
          <button
            onClick={handleExport}
            className="flex items-center gap-2 rounded-[var(--radius-button)] border border-dta-sand px-4 py-2.5 text-sm font-medium text-dta-char hover:bg-dta-beige"
          >
            <Download size={16} />
            Exporter CSV
          </button>
          <button
            onClick={() => setCreateOpen(true)}
            className="flex items-center gap-2 rounded-[var(--radius-button)] bg-dta-accent px-5 py-2.5 text-sm font-semibold text-white hover:bg-dta-accent-dark"
          >
            <Plus size={16} />
            Ajouter une entreprise
          </button>
        </div>
      </div>

      {/* ── Stats cards ────────────────────────────────── */}
      <div className="mb-8 grid grid-cols-2 gap-4 lg:grid-cols-4">
        <StatCard label="Total inscriptions" value={stats.total} icon={Building2} color="text-dta-accent" />
        <StatCard label="En attente" value={stats.pending} icon={Clock} color="text-orange-600" />
        <StatCard label="Valid\u00e9es" value={stats.validated} icon={CheckCheck} color="text-green-600" />
        <StatCard label="Refus\u00e9es" value={stats.rejected} icon={Ban} color="text-red-600" />
      </div>

      {/* ── Filters ────────────────────────────────────── */}
      <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-center">
        <div className="relative flex-1">
          <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-dta-taupe" />
          <input
            type="search"
            placeholder="Rechercher entreprise, directeur, email, ville..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full rounded-[var(--radius-input)] border border-dta-sand bg-white py-2.5 pl-9 pr-3 text-sm text-dta-dark placeholder:text-dta-taupe focus:border-dta-accent focus:outline-none"
          />
        </div>
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="rounded-[var(--radius-input)] border border-dta-sand bg-white px-3 py-2.5 text-sm text-dta-dark focus:border-dta-accent focus:outline-none"
        >
          <option value="">Tous les statuts</option>
          <option value="PENDING">En attente</option>
          <option value="VALIDATED">Valid&eacute;es</option>
          <option value="REJECTED">Refus&eacute;es</option>
        </select>
        <select
          value={catFilter}
          onChange={(e) => setCatFilter(e.target.value)}
          className="rounded-[var(--radius-input)] border border-dta-sand bg-white px-3 py-2.5 text-sm text-dta-dark focus:border-dta-accent focus:outline-none"
        >
          <option value="">Toutes cat&eacute;gories</option>
          {(data?.categories ?? []).map((c) => (
            <option key={c} value={c}>{c}</option>
          ))}
        </select>
      </div>

      {/* ── Table ──────────────────────────────────────── */}
      <div className="overflow-x-auto rounded-[var(--radius-card)] bg-white shadow-[var(--shadow-card)]">
        <table className="w-full text-left text-sm">
          <thead>
            <tr className="border-b border-dta-sand/50 bg-dta-beige/50">
              <th className="px-4 py-3 text-xs font-semibold uppercase tracking-wider text-dta-taupe">#</th>
              <th className="px-4 py-3 text-xs font-semibold uppercase tracking-wider text-dta-taupe">Entreprise</th>
              <th className="hidden px-4 py-3 text-xs font-semibold uppercase tracking-wider text-dta-taupe md:table-cell">Cat&eacute;gorie</th>
              <th className="hidden px-4 py-3 text-xs font-semibold uppercase tracking-wider text-dta-taupe lg:table-cell">Directeur</th>
              <th className="hidden px-4 py-3 text-xs font-semibold uppercase tracking-wider text-dta-taupe lg:table-cell">Ville</th>
              <th className="hidden px-4 py-3 text-xs font-semibold uppercase tracking-wider text-dta-taupe md:table-cell">Email</th>
              <th className="px-4 py-3 text-xs font-semibold uppercase tracking-wider text-dta-taupe">Statut</th>
              <th className="hidden px-4 py-3 text-xs font-semibold uppercase tracking-wider text-dta-taupe lg:table-cell">Date</th>
              <th className="px-4 py-3 text-xs font-semibold uppercase tracking-wider text-dta-taupe">Actions</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan={9} className="px-4 py-12 text-center text-dta-taupe">
                  <Loader2 size={24} className="mx-auto animate-spin" />
                </td>
              </tr>
            ) : !data || data.inscriptions.length === 0 ? (
              <tr>
                <td colSpan={9} className="px-4 py-12 text-center text-dta-taupe">
                  Aucune inscription trouv&eacute;e.
                </td>
              </tr>
            ) : (
              data.inscriptions.map((insc, i) => {
                const sc = statusConfig[insc.status];
                const rowIndex = (data.page - 1) * 20 + i + 1;

                return (
                  <tr
                    key={insc.id}
                    className="border-b border-dta-sand/30 transition-colors hover:bg-dta-beige/30"
                  >
                    <td className="px-4 py-3 text-xs text-dta-taupe">{rowIndex}</td>
                    <td className="px-4 py-3">
                      <span className="font-medium text-dta-dark">{insc.entreprise}</span>
                    </td>
                    <td className="hidden px-4 py-3 text-dta-char/70 md:table-cell">{insc.categorie}</td>
                    <td className="hidden px-4 py-3 text-dta-char/70 lg:table-cell">{insc.directeur}</td>
                    <td className="hidden px-4 py-3 text-dta-char/70 lg:table-cell">{insc.ville}</td>
                    <td className="hidden px-4 py-3 md:table-cell">
                      <span className="text-dta-char/70">{insc.email}</span>
                    </td>
                    <td className="px-4 py-3">
                      <span className={`inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-xs font-medium ${sc.color}`}>
                        <sc.icon size={12} />
                        {sc.label}
                      </span>
                    </td>
                    <td className="hidden px-4 py-3 text-xs text-dta-taupe lg:table-cell">
                      {formatDate(insc.createdAt)}
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-0.5">
                        {actionLoading === insc.id ? (
                          <Loader2 size={16} className="animate-spin text-dta-taupe" />
                        ) : (
                          <>
                            <button
                              onClick={() => setViewInscription(insc)}
                              className="rounded-[var(--radius-button)] p-1.5 text-dta-taupe hover:bg-blue-50 hover:text-blue-600"
                              title="Voir la fiche"
                            >
                              <Eye size={15} />
                            </button>
                            <button
                              onClick={() => setEditInscription(insc)}
                              className="rounded-[var(--radius-button)] p-1.5 text-dta-taupe hover:bg-dta-beige hover:text-dta-dark"
                              title="Modifier"
                            >
                              <Pencil size={15} />
                            </button>
                            {insc.status !== "VALIDATED" && (
                              <button
                                onClick={() => quickStatus(insc.id, "VALIDATED")}
                                className="rounded-[var(--radius-button)] p-1.5 text-dta-taupe hover:bg-green-50 hover:text-green-600"
                                title="Valider"
                              >
                                <CheckCircle size={15} />
                              </button>
                            )}
                            {insc.status !== "REJECTED" && (
                              <button
                                onClick={() => quickStatus(insc.id, "REJECTED")}
                                className="rounded-[var(--radius-button)] p-1.5 text-dta-taupe hover:bg-red-50 hover:text-red-600"
                                title="Refuser"
                              >
                                <XCircle size={15} />
                              </button>
                            )}
                            <button
                              onClick={() => handleDelete(insc)}
                              className="rounded-[var(--radius-button)] p-1.5 text-dta-taupe hover:bg-red-50 hover:text-red-600"
                              title="Supprimer"
                            >
                              <Trash2 size={15} />
                            </button>
                          </>
                        )}
                      </div>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>

      {/* ── Pagination ─────────────────────────────────── */}
      {data && data.pages > 1 && (
        <div className="mt-4 flex items-center justify-between">
          <p className="text-sm text-dta-taupe">
            {data.total} inscription{data.total !== 1 ? "s" : ""} &mdash; page {data.page}/{data.pages}
          </p>
          <div className="flex items-center gap-1">
            <button
              disabled={page <= 1}
              onClick={() => setPage((p) => p - 1)}
              className="rounded-[var(--radius-button)] p-2 text-dta-taupe hover:bg-dta-beige disabled:opacity-30"
            >
              <ChevronLeft size={16} />
            </button>
            {Array.from({ length: data.pages }, (_, i) => i + 1)
              .filter((p) => p === 1 || p === data.pages || Math.abs(p - page) <= 2)
              .map((p, idx, arr) => {
                const showEllipsis = idx > 0 && p - arr[idx - 1] > 1;
                return (
                  <span key={p} className="flex items-center">
                    {showEllipsis && <span className="px-1 text-dta-taupe">&hellip;</span>}
                    <button
                      onClick={() => setPage(p)}
                      className={`min-w-[32px] rounded-[var(--radius-button)] px-2 py-1 text-sm ${
                        p === page
                          ? "bg-dta-accent font-semibold text-white"
                          : "text-dta-char hover:bg-dta-beige"
                      }`}
                    >
                      {p}
                    </button>
                  </span>
                );
              })}
            <button
              disabled={page >= (data?.pages ?? 1)}
              onClick={() => setPage((p) => p + 1)}
              className="rounded-[var(--radius-button)] p-2 text-dta-taupe hover:bg-dta-beige disabled:opacity-30"
            >
              <ChevronRight size={16} />
            </button>
          </div>
        </div>
      )}

      {/* ── View Modal ─────────────────────────────────── */}
      {viewInscription && (
        <ViewModal inscription={viewInscription} onClose={() => setViewInscription(null)} />
      )}

      {/* ── Edit Modal ─────────────────────────────────── */}
      {editInscription && (
        <FormModal
          inscription={editInscription}
          onClose={() => setEditInscription(null)}
          onSaved={() => { setEditInscription(null); fetchData(); }}
        />
      )}

      {/* ── Create Modal ───────────────────────────────── */}
      {createOpen && (
        <FormModal
          inscription={null}
          onClose={() => setCreateOpen(false)}
          onSaved={() => { setCreateOpen(false); fetchData(); }}
        />
      )}
    </div>
  );
}

/* ═══ STAT CARD ══════════════════════════════════════════ */

function StatCard({
  label,
  value,
  icon: Icon,
  color,
}: {
  label: string;
  value: number;
  icon: React.ComponentType<{ size: number; className?: string }>;
  color: string;
}) {
  return (
    <div className="rounded-[var(--radius-card)] bg-white p-5 shadow-[var(--shadow-card)]">
      <div className="flex items-center gap-3">
        <div className={`rounded-[var(--radius-button)] bg-dta-beige p-2.5 ${color}`}>
          <Icon size={20} />
        </div>
        <div>
          <p className="text-xs font-medium text-dta-taupe">{label}</p>
          <p className="font-serif text-2xl font-bold text-dta-dark">{value}</p>
        </div>
      </div>
    </div>
  );
}

/* ═══ VIEW MODAL ═════════════════════════════════════════ */

function ViewModal({
  inscription: insc,
  onClose,
}: {
  inscription: Inscription;
  onClose: () => void;
}) {
  const sc = statusConfig[insc.status];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4" onClick={onClose}>
      <div
        className="max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-[var(--radius-card)] bg-white shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between border-b border-dta-sand/50 px-6 py-4">
          <div>
            <h2 className="font-serif text-xl font-bold text-dta-dark">{insc.entreprise}</h2>
            <span className={`mt-1 inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-xs font-medium ${sc.color}`}>
              <sc.icon size={12} />
              {sc.label}
            </span>
          </div>
          <button onClick={onClose} className="rounded-full p-2 hover:bg-dta-beige">
            <X size={18} className="text-dta-taupe" />
          </button>
        </div>

        {/* Body */}
        <div className="space-y-6 px-6 py-5">
          {/* Infos principales */}
          <Section title="Informations g\u00e9n\u00e9rales">
            <Field label="Cat\u00e9gorie" value={insc.categorie} />
            <Field label="Directeur" value={insc.directeur} />
            <Field label="Email" value={insc.email} />
            <Field label="Mobile" value={insc.mobile} />
            {insc.telephone && <Field label="T\u00e9l\u00e9phone" value={insc.telephone} />}
          </Section>

          {/* Adresse */}
          <Section title="Adresse">
            {insc.adresse && <Field label="Adresse" value={insc.adresse} />}
            <Field label="Ville" value={insc.ville} />
            {insc.codePostal && <Field label="Code postal" value={insc.codePostal} />}
            <Field label="Pays" value={insc.pays} />
          </Section>

          {/* Web & réseaux */}
          {(insc.siteWeb || insc.facebook || insc.instagram || insc.tiktok || insc.whatsapp || insc.youtube || insc.linkedin) && (
            <Section title="Web &amp; r\u00e9seaux sociaux">
              {insc.siteWeb && <Field label="Site web" value={insc.siteWeb} />}
              {insc.facebook && <Field label="Facebook" value={insc.facebook} />}
              {insc.instagram && <Field label="Instagram" value={insc.instagram} />}
              {insc.tiktok && <Field label="TikTok" value={insc.tiktok} />}
              {insc.whatsapp && <Field label="WhatsApp" value={insc.whatsapp} />}
              {insc.youtube && <Field label="YouTube" value={insc.youtube} />}
              {insc.linkedin && <Field label="LinkedIn" value={insc.linkedin} />}
            </Section>
          )}

          {/* Description */}
          <Section title="Description">
            <p className="text-sm leading-relaxed text-dta-char/80">{insc.description}</p>
          </Section>

          {insc.motsCles && (
            <Section title="Mots-cl\u00e9s">
              <div className="flex flex-wrap gap-1.5">
                {insc.motsCles.split(",").map((kw, i) => (
                  <span key={i} className="rounded-full bg-dta-beige px-2.5 py-0.5 text-xs text-dta-char">
                    {kw.trim()}
                  </span>
                ))}
              </div>
            </Section>
          )}

          {/* Meta */}
          <div className="flex items-center gap-4 text-xs text-dta-taupe">
            <span>Inscrit le {formatDate(insc.createdAt)}</span>
            <span>Newsletter : {insc.newsletter ? "Oui" : "Non"}</span>
          </div>
        </div>
      </div>
    </div>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div>
      <h3 className="mb-2 text-xs font-semibold uppercase tracking-widest text-dta-taupe">{title}</h3>
      <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">{children}</div>
    </div>
  );
}

function Field({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <span className="text-xs text-dta-taupe">{label}</span>
      <p className="text-sm font-medium text-dta-dark">{value}</p>
    </div>
  );
}

/* ═══ FORM MODAL (Create / Edit) ═════════════════════════ */

function FormModal({
  inscription,
  onClose,
  onSaved,
}: {
  inscription: Inscription | null;
  onClose: () => void;
  onSaved: () => void;
}) {
  const isEditing = !!inscription;

  const [form, setForm] = useState(
    inscription
      ? {
          entreprise: inscription.entreprise,
          categorie: inscription.categorie,
          directeur: inscription.directeur,
          adresse: inscription.adresse || "",
          ville: inscription.ville,
          codePostal: inscription.codePostal || "",
          pays: inscription.pays,
          mobile: inscription.mobile,
          telephone: inscription.telephone || "",
          email: inscription.email,
          siteWeb: inscription.siteWeb || "",
          facebook: inscription.facebook || "",
          instagram: inscription.instagram || "",
          tiktok: inscription.tiktok || "",
          whatsapp: inscription.whatsapp || "",
          youtube: inscription.youtube || "",
          linkedin: inscription.linkedin || "",
          description: inscription.description,
          motsCles: inscription.motsCles || "",
          newsletter: inscription.newsletter,
          status: inscription.status,
        }
      : emptyForm()
  );

  const [error, setError] = useState("");
  const [saving, setSaving] = useState(false);

  const set = (key: string, value: string | boolean) =>
    setForm((prev) => ({ ...prev, [key]: value }));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSaving(true);

    const url = isEditing
      ? `/api/admin/officiel-afrique/${inscription.id}`
      : "/api/admin/officiel-afrique";
    const method = isEditing ? "PATCH" : "POST";

    try {
      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      if (!res.ok) {
        const data = await res.json();
        setError(data.error || "Une erreur est survenue.");
        setSaving(false);
        return;
      }

      onSaved();
    } catch {
      setError("Erreur r\u00e9seau.");
      setSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4" onClick={onClose}>
      <div
        className="max-h-[90vh] w-full max-w-3xl overflow-y-auto rounded-[var(--radius-card)] bg-white shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between border-b border-dta-sand/50 px-6 py-4">
          <h2 className="font-serif text-xl font-bold text-dta-dark">
            {isEditing ? "Modifier l\u2019inscription" : "Ajouter une entreprise"}
          </h2>
          <button onClick={onClose} className="rounded-full p-2 hover:bg-dta-beige">
            <X size={18} className="text-dta-taupe" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-5 px-6 py-5">
          {error && (
            <div className="rounded-[var(--radius-input)] bg-red-50 px-4 py-3 text-sm text-red-600">
              {error}
            </div>
          )}

          {/* Entreprise + Catégorie */}
          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label className="mb-1 block text-sm font-medium text-dta-char">Entreprise *</label>
              <input required value={form.entreprise} onChange={(e) => set("entreprise", e.target.value)} className={inputClass} placeholder="Nom de l'entreprise" />
            </div>
            <div>
              <label className="mb-1 block text-sm font-medium text-dta-char">Cat&eacute;gorie *</label>
              <select value={form.categorie} onChange={(e) => set("categorie", e.target.value)} className={inputClass} required>
                <option value="">-- S&eacute;lectionner --</option>
                {CATEGORIES_PRESET.map((c) => (
                  <option key={c} value={c}>{c}</option>
                ))}
              </select>
            </div>
          </div>

          {/* Directeur + Email */}
          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label className="mb-1 block text-sm font-medium text-dta-char">Directeur / Responsable *</label>
              <input required value={form.directeur} onChange={(e) => set("directeur", e.target.value)} className={inputClass} placeholder="Nom complet" />
            </div>
            <div>
              <label className="mb-1 block text-sm font-medium text-dta-char">Email *</label>
              <input required type="email" value={form.email} onChange={(e) => set("email", e.target.value)} className={inputClass} placeholder="email@exemple.com" />
            </div>
          </div>

          {/* Adresse */}
          <div>
            <label className="mb-1 block text-sm font-medium text-dta-char">Adresse</label>
            <input value={form.adresse} onChange={(e) => set("adresse", e.target.value)} className={inputClass} placeholder="Rue, num\u00e9ro..." />
          </div>

          {/* Ville + CP + Pays */}
          <div className="grid gap-4 sm:grid-cols-3">
            <div>
              <label className="mb-1 block text-sm font-medium text-dta-char">Ville *</label>
              <input required value={form.ville} onChange={(e) => set("ville", e.target.value)} className={inputClass} />
            </div>
            <div>
              <label className="mb-1 block text-sm font-medium text-dta-char">Code postal</label>
              <input value={form.codePostal} onChange={(e) => set("codePostal", e.target.value)} className={inputClass} />
            </div>
            <div>
              <label className="mb-1 block text-sm font-medium text-dta-char">Pays *</label>
              <input required value={form.pays} onChange={(e) => set("pays", e.target.value)} className={inputClass} />
            </div>
          </div>

          {/* Mobile + Téléphone */}
          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label className="mb-1 block text-sm font-medium text-dta-char">Mobile *</label>
              <input required value={form.mobile} onChange={(e) => set("mobile", e.target.value)} className={inputClass} placeholder="+33 6 ..." />
            </div>
            <div>
              <label className="mb-1 block text-sm font-medium text-dta-char">T&eacute;l&eacute;phone</label>
              <input value={form.telephone} onChange={(e) => set("telephone", e.target.value)} className={inputClass} placeholder="+33 1 ..." />
            </div>
          </div>

          {/* Site web */}
          <div>
            <label className="mb-1 block text-sm font-medium text-dta-char">Site web</label>
            <input value={form.siteWeb} onChange={(e) => set("siteWeb", e.target.value)} className={inputClass} placeholder="https://..." />
          </div>

          {/* Réseaux sociaux */}
          <div>
            <h3 className="mb-2 text-xs font-semibold uppercase tracking-widest text-dta-taupe">R&eacute;seaux sociaux</h3>
            <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
              <input value={form.facebook} onChange={(e) => set("facebook", e.target.value)} className={inputClass} placeholder="Facebook" />
              <input value={form.instagram} onChange={(e) => set("instagram", e.target.value)} className={inputClass} placeholder="Instagram" />
              <input value={form.tiktok} onChange={(e) => set("tiktok", e.target.value)} className={inputClass} placeholder="TikTok" />
              <input value={form.whatsapp} onChange={(e) => set("whatsapp", e.target.value)} className={inputClass} placeholder="WhatsApp" />
              <input value={form.youtube} onChange={(e) => set("youtube", e.target.value)} className={inputClass} placeholder="YouTube" />
              <input value={form.linkedin} onChange={(e) => set("linkedin", e.target.value)} className={inputClass} placeholder="LinkedIn" />
            </div>
          </div>

          {/* Description */}
          <div>
            <label className="mb-1 block text-sm font-medium text-dta-char">Description *</label>
            <textarea required rows={4} value={form.description} onChange={(e) => set("description", e.target.value)} className={inputClass} placeholder="D\u00e9crivez l'activit\u00e9 de l'entreprise..." />
          </div>

          {/* Mots-clés */}
          <div>
            <label className="mb-1 block text-sm font-medium text-dta-char">Mots-cl&eacute;s <span className="text-dta-taupe">(s&eacute;par&eacute;s par des virgules)</span></label>
            <input value={form.motsCles} onChange={(e) => set("motsCles", e.target.value)} className={inputClass} placeholder="artisanat, mode, bijoux..." />
          </div>

          {/* Admin fields: Status + Newsletter */}
          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label className="mb-1 block text-sm font-medium text-dta-char">Statut</label>
              <select value={form.status} onChange={(e) => set("status", e.target.value)} className={inputClass}>
                <option value="PENDING">En attente</option>
                <option value="VALIDATED">Valid&eacute;e</option>
                <option value="REJECTED">Refus&eacute;e</option>
              </select>
            </div>
            <div className="flex items-end pb-1">
              <label className="flex items-center gap-3">
                <button
                  type="button"
                  onClick={() => set("newsletter", !form.newsletter)}
                  className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                    form.newsletter ? "bg-dta-accent" : "bg-dta-sand"
                  }`}
                >
                  <span
                    className={`inline-block h-4 w-4 rounded-full bg-white transition-transform ${
                      form.newsletter ? "translate-x-6" : "translate-x-1"
                    }`}
                  />
                </button>
                <span className="text-sm text-dta-char">Newsletter</span>
              </label>
            </div>
          </div>

          {/* Submit */}
          <div className="flex gap-3 border-t border-dta-sand/50 pt-5">
            <button
              type="submit"
              disabled={saving}
              className="flex items-center gap-2 rounded-[var(--radius-button)] bg-dta-accent px-6 py-3 text-sm font-semibold text-white hover:bg-dta-accent-dark disabled:opacity-50"
            >
              {saving && <Loader2 size={16} className="animate-spin" />}
              {isEditing ? "Sauvegarder les modifications" : "Enregistrer"}
            </button>
            <button
              type="button"
              onClick={onClose}
              className="rounded-[var(--radius-button)] border border-dta-sand px-6 py-3 text-sm font-medium text-dta-char hover:bg-dta-beige"
            >
              Annuler
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

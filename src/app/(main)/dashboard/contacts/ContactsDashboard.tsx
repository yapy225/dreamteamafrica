"use client";

import { useState, useMemo } from "react";
import {
  Search,
  Filter,
  MessageSquare,
  Phone,
  Mail,
  Building2,
  ChevronDown,
  X,
  Send,
  Trash2,
  StickyNote,
  Megaphone,
  Loader2,
  CheckSquare,
  Square,
  Eye,
  EyeOff,
  ExternalLink,
} from "lucide-react";

// ─── Constants ───

const STATUSES = [
  { id: "NOUVEAU", label: "Nouveau", color: "bg-gray-100 text-gray-700", dot: "bg-gray-400" },
  { id: "CONTACTE", label: "Contacte", color: "bg-blue-100 text-blue-700", dot: "bg-blue-500" },
  { id: "INTERESSE", label: "Interesse", color: "bg-orange-100 text-orange-700", dot: "bg-orange-500" },
  { id: "ACOMPTE", label: "Acompte", color: "bg-yellow-100 text-yellow-700", dot: "bg-yellow-500" },
  { id: "CONFIRME", label: "Confirme", color: "bg-green-100 text-green-700", dot: "bg-green-500" },
  { id: "PERDU", label: "Perdu", color: "bg-red-100 text-red-700", dot: "bg-red-500" },
] as const;

const CATEGORIES = [
  { id: "EXPOSANT", label: "Exposant", color: "bg-emerald-100 text-emerald-700" },
  { id: "MANNEQUIN", label: "Mannequin", color: "bg-pink-100 text-pink-700" },
  { id: "PRESTATAIRE", label: "Prestataire", color: "bg-blue-100 text-blue-700" },
  { id: "PARTENAIRE", label: "Partenaire", color: "bg-purple-100 text-purple-700" },
  { id: "INSTITUTION", label: "Institution", color: "bg-amber-100 text-amber-700" },
  { id: "MEDIA", label: "Media", color: "bg-red-100 text-red-700" },
  { id: "ARTISTE", label: "Artiste", color: "bg-indigo-100 text-indigo-700" },
];

function getStatus(id: string) {
  return STATUSES.find((s) => s.id === id) || STATUSES[0];
}
function getCategory(id: string) {
  return CATEGORIES.find((c) => c.id === id) || { id, label: id, color: "bg-gray-100 text-gray-700" };
}

interface Reply {
  id: string;
  body: string;
  sentAt: string;
}

interface Contact {
  id: string;
  category: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string | null;
  company: string | null;
  message: string;
  read: boolean;
  status: string;
  notes: string | null;
  draftReply: string | null;
  createdAt: string;
  replies: Reply[];
}

// ─── Component ───

export default function ContactsDashboard({ messages: initial }: { messages: Contact[] }) {
  const [messages, setMessages] = useState<Contact[]>(initial);
  const [search, setSearch] = useState("");
  const [filterCategory, setFilterCategory] = useState("");
  const [filterStatus, setFilterStatus] = useState("");
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [replyText, setReplyText] = useState("");
  const [sending, setSending] = useState(false);
  const [notesText, setNotesText] = useState("");
  const [editingNotes, setEditingNotes] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [draftText, setDraftText] = useState("");
  const [editingDraft, setEditingDraft] = useState(false);
  const [generatingDraft, setGeneratingDraft] = useState(false);
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
  const [prospectSending, setProspectSending] = useState(false);
  const [prospectResult, setProspectResult] = useState<string | null>(null);

  // ─── Filtered list ───
  const filtered = useMemo(() => {
    return messages.filter((m) => {
      if (filterCategory && m.category !== filterCategory) return false;
      if (filterStatus && m.status !== filterStatus) return false;
      if (search) {
        const q = search.toLowerCase();
        return (
          m.firstName.toLowerCase().includes(q) ||
          m.lastName.toLowerCase().includes(q) ||
          m.email.toLowerCase().includes(q) ||
          (m.company || "").toLowerCase().includes(q) ||
          (m.phone || "").includes(q) ||
          m.message.toLowerCase().includes(q)
        );
      }
      return true;
    });
  }, [messages, search, filterCategory, filterStatus]);

  const selected = messages.find((m) => m.id === selectedId) || null;

  // ─── Stats ───
  const stats = useMemo(() => {
    const s: Record<string, number> = {};
    STATUSES.forEach((st) => (s[st.id] = 0));
    messages.forEach((m) => (s[m.status] = (s[m.status] || 0) + 1));
    return s;
  }, [messages]);

  const unreadCount = messages.filter((m) => !m.read).length;

  // ─── Actions ───
  const updateContact = async (id: string, data: any) => {
    await fetch(`/api/contact/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
    setMessages((prev) => prev.map((m) => (m.id === id ? { ...m, ...data } : m)));
  };

  const deleteContact = async (id: string) => {
    await fetch(`/api/contact/${id}`, { method: "DELETE" });
    setMessages((prev) => prev.filter((m) => m.id !== id));
    setSelectedId(null);
    setShowDeleteConfirm(false);
  };

  const sendReply = async () => {
    if (!replyText.trim() || !selected || sending) return;
    setSending(true);
    try {
      const res = await fetch(`/api/contact/${selected.id}/reply`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ body: replyText }),
      });
      if (res.ok) {
        const reply = await res.json();
        setMessages((prev) =>
          prev.map((m) =>
            m.id === selected.id
              ? { ...m, read: true, replies: [reply, ...m.replies] }
              : m
          )
        );
        setReplyText("");
        // Auto-update status to CONTACTE if still NOUVEAU
        if (selected.status === "NOUVEAU") {
          updateContact(selected.id, { status: "CONTACTE" });
        }
      }
    } catch {
      alert("Erreur d'envoi");
    }
    setSending(false);
  };

  const saveNotes = async () => {
    if (!selected) return;
    await updateContact(selected.id, { notes: notesText });
    setEditingNotes(false);
  };

  const toggleSelect = (id: string) => {
    setSelectedIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const toggleSelectAll = () => {
    if (selectedIds.size === filtered.length) {
      setSelectedIds(new Set());
    } else {
      setSelectedIds(new Set(filtered.map((m) => m.id)));
    }
  };

  const sendProspectEmails = async (ids: string[]) => {
    if (prospectSending || ids.length === 0) return;
    setProspectSending(true);
    setProspectResult(null);
    try {
      const res = await fetch("/api/contact/prospect-email", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ids }),
      });
      const data = await res.json();
      if (res.ok) {
        setProspectResult(`${data.sent} email(s) envoye(s)${data.errors ? `, ${data.errors} erreur(s)` : ""}`);
        // Update local status
        setMessages((prev) =>
          prev.map((m) =>
            ids.includes(m.id) && m.status === "NOUVEAU"
              ? { ...m, status: "CONTACTE" }
              : m
          )
        );
        setSelectedIds(new Set());
        setTimeout(() => setProspectResult(null), 4000);
      } else {
        setProspectResult(data.error || "Erreur");
      }
    } catch {
      setProspectResult("Erreur reseau");
    }
    setProspectSending(false);
  };

  const generateDraft = async (contact: Contact) => {
    setGeneratingDraft(true);
    try {
      const res = await fetch(`/api/contact/${contact.id}/draft`, { method: "POST" });
      const data = await res.json();
      if (res.ok && data.draft) {
        setDraftText(data.draft);
        setEditingDraft(true);
        setMessages((prev) =>
          prev.map((m) => (m.id === contact.id ? { ...m, draftReply: data.draft } : m))
        );
      }
    } catch {
      alert("Erreur de generation");
    }
    setGeneratingDraft(false);
  };

  const sendDraft = async () => {
    if (!draftText.trim() || !selected || sending) return;
    setSending(true);
    try {
      const res = await fetch(`/api/contact/${selected.id}/reply`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ body: draftText }),
      });
      if (res.ok) {
        const reply = await res.json();
        setMessages((prev) =>
          prev.map((m) =>
            m.id === selected.id
              ? { ...m, read: true, draftReply: null, replies: [reply, ...m.replies] }
              : m
          )
        );
        // Clear draft from DB
        await fetch(`/api/contact/${selected.id}`, {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ draftReply: "" }),
        });
        setDraftText("");
        setEditingDraft(false);
        if (selected.status === "NOUVEAU") {
          updateContact(selected.id, { status: "CONTACTE" });
        }
      }
    } catch {
      alert("Erreur d'envoi");
    }
    setSending(false);
  };

  const openContact = (m: Contact) => {
    setSelectedId(m.id);
    setReplyText("");
    setEditingNotes(false);
    setNotesText(m.notes || "");
    setDraftText(m.draftReply || "");
    setEditingDraft(false);
    setShowDeleteConfirm(false);
    if (!m.read) updateContact(m.id, { read: true });
  };

  // ─── Detail view ───
  if (selected) {
    const st = getStatus(selected.status);
    const cat = getCategory(selected.category);

    return (
      <div className="mx-auto max-w-4xl px-4 py-10 sm:px-6 lg:px-8">
        {/* Back button */}
        <button
          onClick={() => setSelectedId(null)}
          className="mb-4 flex items-center gap-1.5 text-sm text-dta-taupe hover:text-dta-accent"
        >
          &larr; Retour aux contacts
        </button>

        <div className="rounded-[var(--radius-card)] bg-white shadow-[var(--shadow-card)] overflow-hidden">
          {/* Header */}
          <div className="border-b px-6 py-4">
            <div className="flex items-start justify-between">
              <div>
                <h2 className="text-xl font-bold text-dta-dark">
                  {selected.firstName} {selected.lastName}
                </h2>
                <div className="mt-1 flex flex-wrap items-center gap-2">
                  <span className={`rounded-full px-2.5 py-0.5 text-xs font-medium ${cat.color}`}>
                    {cat.label}
                  </span>
                  {selected.company && (
                    <span className="flex items-center gap-1 text-sm text-dta-char">
                      <Building2 size={13} /> {selected.company}
                    </span>
                  )}
                </div>
              </div>
              <div className="flex items-center gap-2">
                {/* Status dropdown */}
                <select
                  value={selected.status}
                  onChange={(e) => updateContact(selected.id, { status: e.target.value })}
                  className={`rounded-full px-3 py-1 text-xs font-medium border-0 cursor-pointer ${st.color}`}
                >
                  {STATUSES.map((s) => (
                    <option key={s.id} value={s.id}>{s.label}</option>
                  ))}
                </select>
                {/* Delete */}
                {showDeleteConfirm ? (
                  <div className="flex items-center gap-1">
                    <button onClick={() => deleteContact(selected.id)} className="rounded bg-red-600 px-2 py-1 text-xs text-white">Confirmer</button>
                    <button onClick={() => setShowDeleteConfirm(false)} className="rounded bg-gray-100 px-2 py-1 text-xs">Annuler</button>
                  </div>
                ) : (
                  <button onClick={() => setShowDeleteConfirm(true)} className="rounded-full p-1.5 hover:bg-red-50" title="Supprimer">
                    <Trash2 size={16} className="text-gray-400 hover:text-red-500" />
                  </button>
                )}
              </div>
            </div>

            {/* Contact info */}
            <div className="mt-3 flex flex-wrap gap-4 text-sm">
              <a href={`mailto:${selected.email}`} className="flex items-center gap-1.5 text-dta-char hover:text-dta-accent">
                <Mail size={14} /> {selected.email}
              </a>
              {selected.phone && (
                <a href={`tel:${selected.phone}`} className="flex items-center gap-1.5 text-dta-char hover:text-dta-accent">
                  <Phone size={14} /> {selected.phone}
                </a>
              )}
              {selected.phone && (
                <a
                  href={`https://wa.me/${selected.phone.replace(/[^0-9+]/g, "")}`}
                  target="_blank"
                  rel="noopener"
                  className="flex items-center gap-1.5 text-green-600 hover:text-green-700"
                >
                  <ExternalLink size={14} /> WhatsApp
                </a>
              )}
              <span className="text-xs text-dta-taupe">
                {new Date(selected.createdAt).toLocaleDateString("fr-FR", {
                  day: "numeric", month: "long", year: "numeric", hour: "2-digit", minute: "2-digit",
                })}
              </span>
            </div>
          </div>

          {/* Message */}
          <div className="border-b px-6 py-4">
            <h3 className="mb-2 text-xs font-medium uppercase text-dta-taupe">Message</h3>
            <p className="whitespace-pre-wrap text-sm text-dta-char">{selected.message}</p>
          </div>

          {/* Notes */}
          <div className="border-b px-6 py-4">
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-xs font-medium uppercase text-dta-taupe flex items-center gap-1.5">
                <StickyNote size={13} /> Notes internes
              </h3>
              {!editingNotes && (
                <button
                  onClick={() => { setEditingNotes(true); setNotesText(selected.notes || ""); }}
                  className="text-xs text-dta-accent hover:underline"
                >
                  {selected.notes ? "Modifier" : "Ajouter"}
                </button>
              )}
            </div>
            {editingNotes ? (
              <div className="space-y-2">
                <textarea
                  value={notesText}
                  onChange={(e) => setNotesText(e.target.value)}
                  rows={3}
                  placeholder="Notes sur ce prospect..."
                  className="w-full rounded-lg border border-dta-taupe/30 px-3 py-2 text-sm outline-none focus:border-dta-accent focus:ring-1 focus:ring-dta-accent resize-y"
                />
                <div className="flex gap-2">
                  <button onClick={saveNotes} className="rounded bg-dta-accent px-3 py-1 text-xs text-white">Enregistrer</button>
                  <button onClick={() => setEditingNotes(false)} className="rounded bg-gray-100 px-3 py-1 text-xs">Annuler</button>
                </div>
              </div>
            ) : (
              <p className="text-sm text-dta-char/70 italic">
                {selected.notes || "Aucune note"}
              </p>
            )}
          </div>

          {/* Replies history */}
          {selected.replies.length > 0 && (
            <div className="border-b px-6 py-4">
              <h3 className="mb-3 text-xs font-medium uppercase text-dta-taupe">Historique des reponses</h3>
              <div className="space-y-3">
                {selected.replies.map((r) => (
                  <div key={r.id} className="rounded-lg bg-dta-accent/5 px-4 py-3">
                    <p className="whitespace-pre-wrap text-sm text-dta-char">{r.body}</p>
                    <p className="mt-1 text-xs text-dta-taupe">
                      {new Date(r.sentAt).toLocaleDateString("fr-FR", {
                        day: "numeric", month: "short", hour: "2-digit", minute: "2-digit",
                      })}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* AI Draft Reply */}
          <div className="border-b px-6 py-4">
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-xs font-medium uppercase text-dta-taupe flex items-center gap-1.5">
                🤖 Brouillon IA
              </h3>
              <button
                onClick={() => generateDraft(selected)}
                disabled={generatingDraft}
                className="flex items-center gap-1 text-xs text-dta-accent hover:underline disabled:opacity-50"
              >
                {generatingDraft ? (
                  <><Loader2 size={12} className="animate-spin" /> Generation...</>
                ) : (
                  selected.draftReply ? "Regenerer" : "Generer un brouillon"
                )}
              </button>
            </div>

            {(draftText || selected.draftReply) ? (
              <div className="space-y-3">
                {editingDraft ? (
                  <textarea
                    value={draftText}
                    onChange={(e) => setDraftText(e.target.value)}
                    rows={6}
                    className="w-full rounded-lg border border-dta-accent/30 bg-dta-accent/5 px-3 py-2 text-sm outline-none focus:border-dta-accent focus:ring-1 focus:ring-dta-accent resize-y"
                  />
                ) : (
                  <div
                    onClick={() => { setDraftText(selected.draftReply || ""); setEditingDraft(true); }}
                    className="cursor-pointer rounded-lg bg-dta-accent/5 border border-dta-accent/20 px-4 py-3 text-sm text-dta-char whitespace-pre-wrap hover:border-dta-accent/40 transition-colors"
                  >
                    {selected.draftReply}
                    <p className="mt-2 text-[10px] text-dta-taupe italic">Cliquez pour modifier</p>
                  </div>
                )}
                <div className="flex items-center gap-2">
                  <button
                    onClick={sendDraft}
                    disabled={!draftText.trim() || sending}
                    className="flex items-center gap-1.5 rounded-[var(--radius-button)] bg-dta-accent px-4 py-2 text-sm font-medium text-white hover:bg-dta-accent/90 disabled:opacity-50"
                  >
                    <Send size={14} />
                    {sending ? "Envoi..." : "Envoyer ce brouillon"}
                  </button>
                  {editingDraft && (
                    <button
                      onClick={() => setEditingDraft(false)}
                      className="rounded-[var(--radius-button)] bg-gray-100 px-3 py-2 text-sm text-dta-char hover:bg-gray-200"
                    >
                      Apercu
                    </button>
                  )}
                </div>
              </div>
            ) : (
              <p className="text-sm text-dta-char/50 italic">
                Aucun brouillon. Cliquez sur "Generer un brouillon" pour que l'IA redige une reponse.
              </p>
            )}
          </div>

          {/* Prospect email CTA */}
          <div className="border-b px-6 py-4">
            <button
              onClick={() => sendProspectEmails([selected.id])}
              disabled={prospectSending}
              className="flex items-center gap-2 rounded-[var(--radius-button)] bg-dta-accent px-4 py-2.5 text-sm font-medium text-white hover:bg-dta-accent/90 disabled:opacity-50"
            >
              {prospectSending ? <Loader2 size={14} className="animate-spin" /> : <Megaphone size={14} />}
              {prospectSending ? "Envoi..." : "Envoyer email Foire d'Afrique"}
            </button>
            {prospectResult && (
              <p className="mt-2 text-sm text-green-600">{prospectResult}</p>
            )}
            <p className="mt-1.5 text-xs text-dta-taupe">
              Envoie la page de garde de la Foire d'Afrique avec bouton "Exposer" + "Repondre sur WhatsApp"
            </p>
          </div>

          {/* Reply form */}
          <div className="px-6 py-4">
            <h3 className="mb-2 text-xs font-medium uppercase text-dta-taupe">Repondre par email</h3>
            <textarea
              value={replyText}
              onChange={(e) => setReplyText(e.target.value)}
              rows={4}
              placeholder="Ecrivez votre reponse..."
              className="w-full rounded-lg border border-dta-taupe/30 px-3 py-2 text-sm outline-none focus:border-dta-accent focus:ring-1 focus:ring-dta-accent resize-y"
            />
            <div className="mt-2 flex gap-2">
              <button
                onClick={sendReply}
                disabled={!replyText.trim() || sending}
                className="flex items-center gap-1.5 rounded-[var(--radius-button)] bg-dta-accent px-4 py-2 text-sm font-medium text-white hover:bg-dta-accent/90 disabled:opacity-50"
              >
                <Send size={14} />
                {sending ? "Envoi..." : "Envoyer"}
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // ─── List view ───
  return (
    <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
      {/* Title */}
      <div>
        <h1 className="font-serif text-3xl font-bold text-dta-dark">Prospects & Contacts</h1>
        <p className="mt-1 text-sm text-dta-char/70">
          {messages.length} contact{messages.length > 1 ? "s" : ""}
          {unreadCount > 0 && (
            <span className="ml-2 rounded-full bg-red-100 px-2.5 py-0.5 text-xs font-medium text-red-600">
              {unreadCount} non lu{unreadCount > 1 ? "s" : ""}
            </span>
          )}
        </p>
      </div>

      {/* KPIs */}
      <div className="mt-6 grid grid-cols-3 gap-3 sm:grid-cols-6">
        {STATUSES.map((s) => (
          <button
            key={s.id}
            onClick={() => setFilterStatus(filterStatus === s.id ? "" : s.id)}
            className={`rounded-xl px-4 py-3 text-center transition-all ${
              filterStatus === s.id ? "ring-2 ring-dta-accent ring-offset-2" : ""
            } ${s.color}`}
          >
            <p className="text-2xl font-bold">{stats[s.id] || 0}</p>
            <p className="text-xs font-medium">{s.label}</p>
          </button>
        ))}
      </div>

      {/* Filters bar */}
      <div className="mt-6 flex flex-wrap items-center gap-3">
        <div className="relative flex-1 min-w-[200px]">
          <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-dta-taupe" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Rechercher nom, email, entreprise, telephone..."
            className="w-full rounded-lg border border-dta-taupe/30 bg-white py-2 pl-9 pr-3 text-sm outline-none focus:border-dta-accent focus:ring-1 focus:ring-dta-accent"
          />
          {search && (
            <button onClick={() => setSearch("")} className="absolute right-3 top-1/2 -translate-y-1/2">
              <X size={14} className="text-dta-taupe" />
            </button>
          )}
        </div>
        <select
          value={filterCategory}
          onChange={(e) => setFilterCategory(e.target.value)}
          className="rounded-lg border border-dta-taupe/30 bg-white px-3 py-2 text-sm outline-none focus:border-dta-accent"
        >
          <option value="">Toutes categories</option>
          {CATEGORIES.map((c) => (
            <option key={c.id} value={c.id}>{c.label}</option>
          ))}
        </select>
        {(filterCategory || filterStatus || search) && (
          <button
            onClick={() => { setFilterCategory(""); setFilterStatus(""); setSearch(""); }}
            className="flex items-center gap-1 rounded-lg bg-gray-100 px-3 py-2 text-xs text-dta-char hover:bg-gray-200"
          >
            <X size={12} /> Effacer filtres
          </button>
        )}
        <span className="text-xs text-dta-taupe">
          {filtered.length} resultat{filtered.length > 1 ? "s" : ""}
        </span>
      </div>

      {/* Selection bar */}
      {selectedIds.size > 0 && (
        <div className="mt-4 flex items-center gap-3 rounded-lg bg-dta-accent/10 px-4 py-3">
          <span className="text-sm font-medium text-dta-dark">
            {selectedIds.size} selectionne{selectedIds.size > 1 ? "s" : ""}
          </span>
          <button
            onClick={() => sendProspectEmails(Array.from(selectedIds))}
            disabled={prospectSending}
            className="flex items-center gap-1.5 rounded-[var(--radius-button)] bg-dta-accent px-4 py-2 text-sm font-medium text-white hover:bg-dta-accent/90 disabled:opacity-50"
          >
            {prospectSending ? <Loader2 size={14} className="animate-spin" /> : <Megaphone size={14} />}
            {prospectSending ? "Envoi..." : "Envoyer email prospect"}
          </button>
          <button onClick={() => setSelectedIds(new Set())} className="text-xs text-dta-taupe hover:text-dta-dark">
            Deselectionner
          </button>
        </div>
      )}

      {/* Prospect result toast */}
      {prospectResult && (
        <div className="mt-2 rounded-lg bg-green-50 px-4 py-2 text-sm text-green-700">
          {prospectResult}
        </div>
      )}

      {/* Table */}
      <div className="mt-4 overflow-x-auto rounded-[var(--radius-card)] bg-white shadow-[var(--shadow-card)]">
        <table className="w-full text-left text-sm">
          <thead className="border-b border-dta-sand bg-dta-bg text-xs uppercase text-dta-taupe">
            <tr>
              <th className="px-3 py-3 w-8">
                <button onClick={toggleSelectAll} className="text-dta-taupe hover:text-dta-accent">
                  {selectedIds.size === filtered.length && filtered.length > 0
                    ? <CheckSquare size={16} />
                    : <Square size={16} />}
                </button>
              </th>
              <th className="px-4 py-3">Statut</th>
              <th className="px-4 py-3">Profil</th>
              <th className="px-4 py-3">Nom / Entreprise</th>
              <th className="px-4 py-3">Contact</th>
              <th className="px-4 py-3">Message</th>
              <th className="px-4 py-3">Notes</th>
              <th className="px-4 py-3">Date</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-dta-sand/50">
            {filtered.map((m) => {
              const st = getStatus(m.status);
              const cat = getCategory(m.category);
              return (
                <tr
                  key={m.id}
                  onClick={() => openContact(m)}
                  className={`cursor-pointer transition-colors ${
                    !m.read ? "bg-dta-accent/5 hover:bg-dta-accent/10" : "hover:bg-dta-bg/50"
                  }`}
                >
                  <td className="px-3 py-3 w-8" onClick={(e) => e.stopPropagation()}>
                    <button onClick={() => toggleSelect(m.id)} className="text-dta-taupe hover:text-dta-accent">
                      {selectedIds.has(m.id) ? <CheckSquare size={16} className="text-dta-accent" /> : <Square size={16} />}
                    </button>
                  </td>
                  <td className="whitespace-nowrap px-4 py-3">
                    <select
                      value={m.status}
                      onClick={(e) => e.stopPropagation()}
                      onChange={(e) => {
                        e.stopPropagation();
                        updateContact(m.id, { status: e.target.value });
                      }}
                      className={`rounded-full px-2 py-0.5 text-[11px] font-medium border-0 cursor-pointer ${st.color}`}
                    >
                      {STATUSES.map((s) => (
                        <option key={s.id} value={s.id}>{s.label}</option>
                      ))}
                    </select>
                  </td>
                  <td className="whitespace-nowrap px-4 py-3">
                    <span className={`rounded-full px-2.5 py-0.5 text-xs font-medium ${cat.color}`}>
                      {cat.label}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <p className={`font-medium ${!m.read ? "text-dta-dark" : "text-dta-char"}`}>
                      {!m.read && <span className="mr-1.5 inline-block h-2 w-2 rounded-full bg-dta-accent" />}
                      {m.firstName} {m.lastName}
                    </p>
                    {m.company && (
                      <p className="text-xs text-dta-taupe">{m.company}</p>
                    )}
                  </td>
                  <td className="px-4 py-3">
                    <p className="text-xs text-dta-char">{m.email}</p>
                    {m.phone && <p className="text-xs text-dta-taupe">{m.phone}</p>}
                  </td>
                  <td className="max-w-[200px] truncate px-4 py-3 text-xs text-dta-char/70">
                    {m.message}
                  </td>
                  <td className="max-w-[150px] truncate px-4 py-3 text-xs text-dta-taupe italic">
                    {m.notes || "—"}
                  </td>
                  <td className="whitespace-nowrap px-4 py-3 text-xs text-dta-taupe">
                    {new Date(m.createdAt).toLocaleDateString("fr-FR", {
                      day: "2-digit",
                      month: "short",
                    })}
                    {m.replies.length > 0 && (
                      <span className="ml-1.5 inline-flex items-center gap-0.5 text-dta-accent">
                        <MessageSquare size={10} /> {m.replies.length}
                      </span>
                    )}
                  </td>
                </tr>
              );
            })}
            {filtered.length === 0 && (
              <tr>
                <td colSpan={8} className="px-4 py-12 text-center text-dta-taupe">
                  Aucun contact trouve.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

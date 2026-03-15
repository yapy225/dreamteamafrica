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

  const openContact = (m: Contact) => {
    setSelectedId(m.id);
    setReplyText("");
    setEditingNotes(false);
    setNotesText(m.notes || "");
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

      {/* Table */}
      <div className="mt-4 overflow-x-auto rounded-[var(--radius-card)] bg-white shadow-[var(--shadow-card)]">
        <table className="w-full text-left text-sm">
          <thead className="border-b border-dta-sand bg-dta-bg text-xs uppercase text-dta-taupe">
            <tr>
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
                <td colSpan={7} className="px-4 py-12 text-center text-dta-taupe">
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

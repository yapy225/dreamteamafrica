"use client";

import { useState, useEffect, useRef } from "react";
import {
  RefreshCw,
  Mail,
  ArrowLeft,
  Send,
  Archive,
  Star,
  Inbox,
  Search,
  MailOpen,
  Paperclip,
  Trash2,
  Tag,
  X,
  ChevronDown,
} from "lucide-react";

const LABELS = [
  { id: "important", name: "Important", color: "bg-red-500" },
  { id: "exposant", name: "Exposant", color: "bg-orange-500" },
  { id: "partenaire", name: "Partenaire", color: "bg-blue-500" },
  { id: "client", name: "Client", color: "bg-green-500" },
  { id: "presse", name: "Presse", color: "bg-purple-500" },
  { id: "facturation", name: "Facturation", color: "bg-yellow-500" },
];

function getLabelInfo(labelId: string | null) {
  return LABELS.find((l) => l.id === labelId) || null;
}

interface EmailSummary {
  id: string;
  messageId: string;
  fromName: string | null;
  fromEmail: string;
  subject: string;
  snippet: string | null;
  isRead: boolean;
  isStarred: boolean;
  isArchived: boolean;
  hasAttachments: boolean;
  label: string | null;
  receivedAt: string;
  folder: string;
}

interface EmailFull {
  id: string;
  messageId: string;
  fromName: string | null;
  fromEmail: string;
  toEmails: string[];
  ccEmails: string[];
  subject: string;
  bodyText: string | null;
  bodyHtml: string | null;
  snippet: string | null;
  isRead: boolean;
  isStarred: boolean;
  isArchived: boolean;
  hasAttachments: boolean;
  attachments: any;
  label: string | null;
  inReplyTo: string | null;
  references: string[];
  receivedAt: string;
  folder: string;
}

function formatDate(dateStr: string) {
  const d = new Date(dateStr);
  const now = new Date();
  const diffMs = now.getTime() - d.getTime();
  const diffH = diffMs / (1000 * 60 * 60);

  if (diffH < 24) {
    return d.toLocaleTimeString("fr-FR", { hour: "2-digit", minute: "2-digit" });
  }
  if (diffH < 48) return "Hier";
  if (diffH < 168) {
    return d.toLocaleDateString("fr-FR", { weekday: "short" });
  }
  return d.toLocaleDateString("fr-FR", { day: "2-digit", month: "short" });
}

function formatFullDate(dateStr: string) {
  return new Date(dateStr).toLocaleDateString("fr-FR", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

export default function EmailInbox() {
  const [emails, setEmails] = useState<EmailSummary[]>([]);
  const [selectedEmail, setSelectedEmail] = useState<EmailFull | null>(null);
  const [tab, setTab] = useState<"inbox" | "starred" | "archives">("inbox");
  const [activeLabel, setActiveLabel] = useState<string>("");
  const [loading, setLoading] = useState(true);
  const [syncing, setSyncing] = useState(false);
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [unreadCount, setUnreadCount] = useState(0);

  // Reply state
  const [showReply, setShowReply] = useState(false);
  const [replyText, setReplyText] = useState("");
  const [sending, setSending] = useState(false);
  const replyRef = useRef<HTMLTextAreaElement>(null);

  // Label dropdown state
  const [showLabelMenu, setShowLabelMenu] = useState<string | null>(null);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState<string | null>(null);

  const loadEmails = async (p = page, s = search) => {
    setLoading(true);
    try {
      const params = new URLSearchParams({
        archived: tab === "archives" ? "true" : "false",
        page: String(p),
        limit: "30",
      });
      if (s) params.set("search", s);
      if (tab === "starred") params.set("starred", "true");
      if (activeLabel) params.set("label", activeLabel);

      const res = await fetch(`/api/emails?${params}`);
      const data = await res.json();
      setEmails(data.emails || []);
      setTotalPages(data.totalPages || 1);
      setUnreadCount(data.unreadCount || 0);
    } catch {
      console.error("Failed to load emails");
    }
    setLoading(false);
  };

  const refreshEmails = async () => {
    setSyncing(true);
    await loadEmails(1, search);
    setSyncing(false);
  };

  const openEmail = async (id: string) => {
    try {
      const res = await fetch(`/api/emails/${id}`);
      const data = await res.json();
      setSelectedEmail(data);
      setShowReply(false);
      setReplyText("");
      setEmails((prev) =>
        prev.map((e) => (e.id === id ? { ...e, isRead: true } : e))
      );
    } catch {
      console.error("Failed to load email");
    }
  };

  const toggleStar = async (id: string, current: boolean) => {
    await fetch(`/api/emails/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ isStarred: !current }),
    });
    if (selectedEmail?.id === id) {
      setSelectedEmail((prev) =>
        prev ? { ...prev, isStarred: !current } : null
      );
    }
    setEmails((prev) =>
      prev.map((e) => (e.id === id ? { ...e, isStarred: !current } : e))
    );
  };

  const setLabel = async (id: string, label: string | null) => {
    await fetch(`/api/emails/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ label: label || "" }),
    });
    if (selectedEmail?.id === id) {
      setSelectedEmail((prev) => (prev ? { ...prev, label } : null));
    }
    setEmails((prev) =>
      prev.map((e) => (e.id === id ? { ...e, label } : e))
    );
    setShowLabelMenu(null);
  };

  const archiveEmail = async (id: string) => {
    await fetch(`/api/emails/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ isArchived: true }),
    });
    setSelectedEmail(null);
    setEmails((prev) => prev.filter((e) => e.id !== id));
  };

  const unarchiveEmail = async (id: string) => {
    await fetch(`/api/emails/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ isArchived: false }),
    });
    setSelectedEmail(null);
    setEmails((prev) => prev.filter((e) => e.id !== id));
  };

  const deleteEmail = async (id: string) => {
    await fetch(`/api/emails/${id}`, { method: "DELETE" });
    setSelectedEmail(null);
    setShowDeleteConfirm(null);
    setEmails((prev) => prev.filter((e) => e.id !== id));
  };

  const handleReply = async () => {
    if (!replyText.trim() || !selectedEmail || sending) return;
    setSending(true);
    try {
      const refs = [...(selectedEmail.references || [])];
      if (selectedEmail.messageId) refs.push(selectedEmail.messageId);

      const res = await fetch("/api/emails/send", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          to: selectedEmail.fromEmail,
          subject: selectedEmail.subject.startsWith("Re:")
            ? selectedEmail.subject
            : `Re: ${selectedEmail.subject}`,
          bodyText: replyText,
          bodyHtml: `<p>${replyText.replace(/\n/g, "<br>")}</p>`,
          inReplyTo: selectedEmail.messageId,
          references: refs,
        }),
      });

      if (res.ok) {
        setReplyText("");
        setShowReply(false);
        alert("Reponse envoyee !");
      } else {
        const err = await res.json();
        alert(err.error || "Erreur d'envoi");
      }
    } catch {
      alert("Erreur reseau");
    }
    setSending(false);
  };

  useEffect(() => {
    loadEmails(1, search);
  }, [tab, activeLabel]);

  useEffect(() => {
    loadEmails(1, "");
  }, []);

  // ─── Label dropdown component ───
  const LabelDropdown = ({ emailId, currentLabel }: { emailId: string; currentLabel: string | null }) => {
    if (showLabelMenu !== emailId) return null;
    return (
      <div className="absolute right-0 top-full z-50 mt-1 w-44 rounded-lg border bg-white shadow-lg">
        <div className="p-1">
          {LABELS.map((l) => (
            <button
              key={l.id}
              onClick={(e) => { e.stopPropagation(); setLabel(emailId, l.id); }}
              className={`flex w-full items-center gap-2 rounded px-3 py-1.5 text-sm hover:bg-gray-50 ${
                currentLabel === l.id ? "bg-gray-100 font-medium" : ""
              }`}
            >
              <span className={`h-2.5 w-2.5 rounded-full ${l.color}`} />
              {l.name}
            </button>
          ))}
          {currentLabel && (
            <>
              <hr className="my-1" />
              <button
                onClick={(e) => { e.stopPropagation(); setLabel(emailId, null); }}
                className="flex w-full items-center gap-2 rounded px-3 py-1.5 text-sm text-red-600 hover:bg-red-50"
              >
                <X size={12} />
                Retirer le label
              </button>
            </>
          )}
        </div>
      </div>
    );
  };

  // ─── Email list view ───
  if (!selectedEmail) {
    return (
      <div className="rounded-[var(--radius-card)] bg-white shadow-[var(--shadow-card)] overflow-hidden">
        {/* Top bar */}
        <div className="flex flex-col gap-3 border-b px-4 py-3 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-2 flex-wrap">
            <button
              onClick={() => { setTab("inbox"); setActiveLabel(""); setPage(1); }}
              className={`flex items-center gap-1.5 rounded-[var(--radius-button)] px-3 py-1.5 text-sm font-medium transition-colors ${
                tab === "inbox"
                  ? "bg-dta-accent text-white"
                  : "bg-dta-beige text-dta-char hover:bg-dta-taupe/20"
              }`}
            >
              <Inbox size={14} />
              Reception
              {unreadCount > 0 && (
                <span className="ml-1 flex h-5 min-w-[20px] items-center justify-center rounded-full bg-red-500 px-1 text-xs text-white">
                  {unreadCount}
                </span>
              )}
            </button>
            <button
              onClick={() => { setTab("starred"); setActiveLabel(""); setPage(1); }}
              className={`flex items-center gap-1.5 rounded-[var(--radius-button)] px-3 py-1.5 text-sm font-medium transition-colors ${
                tab === "starred"
                  ? "bg-dta-accent text-white"
                  : "bg-dta-beige text-dta-char hover:bg-dta-taupe/20"
              }`}
            >
              <Star size={14} />
              Favoris
            </button>
            <button
              onClick={() => { setTab("archives"); setActiveLabel(""); setPage(1); }}
              className={`flex items-center gap-1.5 rounded-[var(--radius-button)] px-3 py-1.5 text-sm font-medium transition-colors ${
                tab === "archives"
                  ? "bg-dta-accent text-white"
                  : "bg-dta-beige text-dta-char hover:bg-dta-taupe/20"
              }`}
            >
              <Archive size={14} />
              Archives
            </button>
          </div>
          <div className="flex items-center gap-2">
            <div className="relative">
              <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-dta-taupe" />
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") { setPage(1); loadEmails(1, search); }
                }}
                placeholder="Rechercher..."
                className="rounded-[var(--radius-button)] border border-dta-taupe/30 bg-white py-1.5 pl-9 pr-3 text-sm outline-none focus:border-dta-accent focus:ring-1 focus:ring-dta-accent"
              />
            </div>
            <button
              onClick={refreshEmails}
              disabled={syncing}
              className="flex items-center gap-1.5 rounded-[var(--radius-button)] bg-dta-beige px-3 py-1.5 text-sm font-medium text-dta-char hover:bg-dta-taupe/20 disabled:opacity-50"
            >
              <RefreshCw size={14} className={syncing ? "animate-spin" : ""} />
              Actualiser
            </button>
          </div>
        </div>

        {/* Labels filter bar */}
        <div className="flex items-center gap-2 border-b px-4 py-2 overflow-x-auto">
          <Tag size={14} className="shrink-0 text-dta-taupe" />
          <button
            onClick={() => { setActiveLabel(""); setPage(1); }}
            className={`shrink-0 rounded-full px-3 py-1 text-xs font-medium transition-colors ${
              !activeLabel ? "bg-dta-accent text-white" : "bg-gray-100 text-dta-char hover:bg-gray-200"
            }`}
          >
            Tous
          </button>
          {LABELS.map((l) => (
            <button
              key={l.id}
              onClick={() => { setActiveLabel(activeLabel === l.id ? "" : l.id); setPage(1); }}
              className={`flex shrink-0 items-center gap-1.5 rounded-full px-3 py-1 text-xs font-medium transition-colors ${
                activeLabel === l.id ? "bg-dta-accent text-white" : "bg-gray-100 text-dta-char hover:bg-gray-200"
              }`}
            >
              <span className={`h-2 w-2 rounded-full ${l.color}`} />
              {l.name}
            </button>
          ))}
        </div>

        {/* Email list */}
        {loading && emails.length === 0 ? (
          <div className="flex items-center justify-center py-20 text-dta-taupe">
            <RefreshCw size={20} className="animate-spin mr-2" />
            Chargement...
          </div>
        ) : emails.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 text-dta-taupe">
            <Mail size={48} className="mb-4 opacity-30" />
            <p>
              {tab === "inbox" ? "Aucun email" : tab === "starred" ? "Aucun favori" : "Aucun email archive"}
              {activeLabel ? ` avec le label "${getLabelInfo(activeLabel)?.name}"` : ""}
            </p>
          </div>
        ) : (
          <>
            <ul className="divide-y">
              {emails.map((email) => {
                const labelInfo = getLabelInfo(email.label);
                return (
                  <li key={email.id} className="group relative">
                    <div
                      onClick={() => openEmail(email.id)}
                      className={`flex w-full cursor-pointer items-center gap-3 px-4 py-3 text-left transition-colors hover:bg-gray-50 ${
                        !email.isRead ? "bg-blue-50/50" : ""
                      }`}
                    >
                      {/* Avatar */}
                      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-dta-accent/10 text-dta-accent font-bold text-sm">
                        {(email.fromName || email.fromEmail).charAt(0).toUpperCase()}
                      </div>

                      {/* Content */}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between gap-2">
                          <div className="flex items-center gap-2 min-w-0">
                            <p className={`truncate text-sm ${!email.isRead ? "font-bold text-dta-dark" : "text-dta-char"}`}>
                              {email.fromName || email.fromEmail}
                            </p>
                            {labelInfo && (
                              <span className={`shrink-0 inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[10px] font-medium text-white ${labelInfo.color}`}>
                                {labelInfo.name}
                              </span>
                            )}
                          </div>
                          <span className="shrink-0 text-xs text-dta-taupe">
                            {formatDate(email.receivedAt)}
                          </span>
                        </div>
                        <p className={`truncate text-sm ${!email.isRead ? "font-semibold text-dta-dark" : "text-dta-char"}`}>
                          {email.subject}
                        </p>
                        <p className="truncate text-xs text-dta-taupe mt-0.5">
                          {email.snippet}
                        </p>
                      </div>

                      {/* Indicators */}
                      <div className="flex shrink-0 items-center gap-1">
                        {email.hasAttachments && (
                          <Paperclip size={14} className="text-dta-taupe" />
                        )}
                        {email.isStarred && (
                          <Star size={14} className="fill-yellow-400 text-yellow-400" />
                        )}
                        {!email.isRead && (
                          <div className="h-2.5 w-2.5 rounded-full bg-dta-accent" />
                        )}
                      </div>
                    </div>

                    {/* Quick actions on hover */}
                    <div className="absolute right-14 top-1/2 -translate-y-1/2 hidden items-center gap-1 group-hover:flex">
                      <button
                        onClick={(e) => { e.stopPropagation(); toggleStar(email.id, email.isStarred); }}
                        className="rounded-full p-1.5 hover:bg-yellow-50"
                        title={email.isStarred ? "Retirer favori" : "Favori"}
                      >
                        <Star size={14} className={email.isStarred ? "fill-yellow-400 text-yellow-400" : "text-gray-400"} />
                      </button>
                      <div className="relative">
                        <button
                          onClick={(e) => { e.stopPropagation(); setShowLabelMenu(showLabelMenu === email.id ? null : email.id); }}
                          className="rounded-full p-1.5 hover:bg-blue-50"
                          title="Classer"
                        >
                          <Tag size={14} className="text-gray-400" />
                        </button>
                        <LabelDropdown emailId={email.id} currentLabel={email.label} />
                      </div>
                      <button
                        onClick={(e) => { e.stopPropagation(); archiveEmail(email.id); }}
                        className="rounded-full p-1.5 hover:bg-gray-100"
                        title="Archiver"
                      >
                        <Archive size={14} className="text-gray-400" />
                      </button>
                      <button
                        onClick={(e) => { e.stopPropagation(); setShowDeleteConfirm(email.id); }}
                        className="rounded-full p-1.5 hover:bg-red-50"
                        title="Supprimer"
                      >
                        <Trash2 size={14} className="text-gray-400 hover:text-red-500" />
                      </button>
                    </div>

                    {/* Delete confirmation */}
                    {showDeleteConfirm === email.id && (
                      <div
                        className="absolute inset-0 z-50 flex items-center justify-center bg-white/95"
                        onClick={(e) => e.stopPropagation()}
                      >
                        <div className="flex items-center gap-3">
                          <p className="text-sm text-dta-char">Supprimer cet email ?</p>
                          <button
                            onClick={() => deleteEmail(email.id)}
                            className="rounded-[var(--radius-button)] bg-red-600 px-3 py-1 text-sm text-white hover:bg-red-700"
                          >
                            Supprimer
                          </button>
                          <button
                            onClick={() => setShowDeleteConfirm(null)}
                            className="rounded-[var(--radius-button)] bg-gray-100 px-3 py-1 text-sm text-dta-char hover:bg-gray-200"
                          >
                            Annuler
                          </button>
                        </div>
                      </div>
                    )}
                  </li>
                );
              })}
            </ul>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="flex items-center justify-center gap-2 border-t px-4 py-3">
                <button
                  onClick={() => { setPage(page - 1); loadEmails(page - 1, search); }}
                  disabled={page <= 1}
                  className="rounded-[var(--radius-button)] bg-dta-beige px-3 py-1 text-sm disabled:opacity-30"
                >
                  Precedent
                </button>
                <span className="text-sm text-dta-taupe">
                  {page} / {totalPages}
                </span>
                <button
                  onClick={() => { setPage(page + 1); loadEmails(page + 1, search); }}
                  disabled={page >= totalPages}
                  className="rounded-[var(--radius-button)] bg-dta-beige px-3 py-1 text-sm disabled:opacity-30"
                >
                  Suivant
                </button>
              </div>
            )}
          </>
        )}
      </div>
    );
  }

  // ─── Email detail view ───
  const detailLabel = getLabelInfo(selectedEmail.label);

  return (
    <div className="rounded-[var(--radius-card)] bg-white shadow-[var(--shadow-card)] overflow-hidden">
      {/* Header */}
      <div className="flex items-center gap-3 border-b px-4 py-3">
        <button
          onClick={() => {
            setSelectedEmail(null);
            loadEmails(page, search);
          }}
          className="rounded-full p-2 hover:bg-gray-100 transition-colors"
        >
          <ArrowLeft size={18} />
        </button>

        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2">
            <h2 className="truncate font-semibold text-dta-dark">
              {selectedEmail.subject}
            </h2>
            {detailLabel && (
              <span className={`shrink-0 inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[10px] font-medium text-white ${detailLabel.color}`}>
                {detailLabel.name}
              </span>
            )}
          </div>
        </div>

        <div className="flex items-center gap-1">
          {/* Label button */}
          <div className="relative">
            <button
              onClick={() => setShowLabelMenu(showLabelMenu === selectedEmail.id ? null : selectedEmail.id)}
              className="rounded-full p-2 hover:bg-blue-50 transition-colors"
              title="Classer"
            >
              <Tag size={18} className="text-dta-taupe" />
            </button>
            <LabelDropdown emailId={selectedEmail.id} currentLabel={selectedEmail.label} />
          </div>

          {/* Star */}
          <button
            onClick={() => toggleStar(selectedEmail.id, selectedEmail.isStarred)}
            className="rounded-full p-2 hover:bg-yellow-50 transition-colors"
            title={selectedEmail.isStarred ? "Retirer favori" : "Ajouter favori"}
          >
            <Star
              size={18}
              className={
                selectedEmail.isStarred
                  ? "fill-yellow-400 text-yellow-400"
                  : "text-dta-taupe"
              }
            />
          </button>

          {/* Archive / Unarchive */}
          {selectedEmail.isArchived ? (
            <button
              onClick={() => unarchiveEmail(selectedEmail.id)}
              className="rounded-full p-2 hover:bg-blue-50 transition-colors"
              title="Desarchiver"
            >
              <Inbox size={18} className="text-blue-600" />
            </button>
          ) : (
            <button
              onClick={() => archiveEmail(selectedEmail.id)}
              className="rounded-full p-2 hover:bg-gray-100 transition-colors"
              title="Archiver"
            >
              <Archive size={18} className="text-dta-taupe" />
            </button>
          )}

          {/* Delete */}
          {showDeleteConfirm === selectedEmail.id ? (
            <div className="flex items-center gap-1 ml-2">
              <button
                onClick={() => deleteEmail(selectedEmail.id)}
                className="rounded-[var(--radius-button)] bg-red-600 px-3 py-1 text-xs text-white hover:bg-red-700"
              >
                Confirmer
              </button>
              <button
                onClick={() => setShowDeleteConfirm(null)}
                className="rounded-[var(--radius-button)] bg-gray-100 px-3 py-1 text-xs text-dta-char hover:bg-gray-200"
              >
                Annuler
              </button>
            </div>
          ) : (
            <button
              onClick={() => setShowDeleteConfirm(selectedEmail.id)}
              className="rounded-full p-2 hover:bg-red-50 transition-colors"
              title="Supprimer"
            >
              <Trash2 size={18} className="text-dta-taupe hover:text-red-500" />
            </button>
          )}
        </div>
      </div>

      {/* Email meta */}
      <div className="border-b px-6 py-4">
        <div className="flex items-start gap-3">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-dta-accent/10 text-dta-accent font-bold">
            {(selectedEmail.fromName || selectedEmail.fromEmail)
              .charAt(0)
              .toUpperCase()}
          </div>
          <div className="flex-1 min-w-0">
            <p className="font-semibold text-dta-dark">
              {selectedEmail.fromName || selectedEmail.fromEmail}
            </p>
            <p className="text-xs text-dta-taupe">
              {selectedEmail.fromEmail}
              {selectedEmail.toEmails.length > 0 && (
                <> &rarr; {selectedEmail.toEmails.join(", ")}</>
              )}
            </p>
            <p className="text-xs text-dta-taupe mt-0.5">
              {formatFullDate(selectedEmail.receivedAt)}
            </p>
          </div>
        </div>

        {/* Attachments */}
        {selectedEmail.hasAttachments && selectedEmail.attachments && (
          <div className="mt-3 flex flex-wrap gap-2">
            {(Array.isArray(selectedEmail.attachments) ? selectedEmail.attachments : []).map(
              (att: any, i: number) => (
                <div
                  key={i}
                  className="flex items-center gap-1.5 rounded-[var(--radius-button)] bg-gray-100 px-3 py-1.5 text-xs text-dta-char"
                >
                  <Paperclip size={12} />
                  {att.filename}
                  <span className="text-dta-taupe">
                    ({Math.round((att.size || 0) / 1024)} Ko)
                  </span>
                </div>
              )
            )}
          </div>
        )}
      </div>

      {/* Email body */}
      <div className="px-6 py-4" style={{ maxHeight: "50vh", overflow: "auto" }}>
        {selectedEmail.bodyHtml ? (
          <iframe
            srcDoc={`<!DOCTYPE html><html><head><meta charset="utf-8"><style>body{font-family:system-ui,sans-serif;font-size:14px;color:#333;margin:0;padding:8px;word-break:break-word;}a{color:#C4704B;}img{max-width:100%;height:auto;}</style></head><body>${selectedEmail.bodyHtml}</body></html>`}
            className="w-full border-0"
            style={{ minHeight: 200 }}
            onLoad={(e) => {
              const iframe = e.target as HTMLIFrameElement;
              if (iframe.contentDocument) {
                iframe.style.height =
                  iframe.contentDocument.documentElement.scrollHeight + "px";
              }
            }}
            sandbox="allow-same-origin"
          />
        ) : (
          <pre className="whitespace-pre-wrap text-sm text-dta-char font-sans">
            {selectedEmail.bodyText}
          </pre>
        )}
      </div>

      {/* Reply section */}
      <div className="border-t px-6 py-4">
        {!showReply ? (
          <button
            onClick={() => {
              setShowReply(true);
              setTimeout(() => replyRef.current?.focus(), 100);
            }}
            className="flex items-center gap-2 rounded-[var(--radius-button)] border border-dta-taupe/30 px-4 py-2 text-sm text-dta-char hover:bg-gray-50 transition-colors"
          >
            <MailOpen size={16} />
            Repondre
          </button>
        ) : (
          <div className="space-y-3">
            <p className="text-xs text-dta-taupe">
              Repondre a {selectedEmail.fromName || selectedEmail.fromEmail} ({selectedEmail.fromEmail})
            </p>
            <textarea
              ref={replyRef}
              value={replyText}
              onChange={(e) => setReplyText(e.target.value)}
              rows={5}
              placeholder="Ecrivez votre reponse..."
              className="w-full rounded-[var(--radius-card)] border border-dta-taupe/30 bg-white px-4 py-3 text-sm text-dta-dark outline-none focus:border-dta-accent focus:ring-1 focus:ring-dta-accent resize-y"
            />
            <div className="flex items-center gap-2">
              <button
                onClick={handleReply}
                disabled={!replyText.trim() || sending}
                className="flex items-center gap-2 rounded-[var(--radius-button)] bg-dta-accent px-4 py-2 text-sm font-medium text-white hover:bg-dta-accent/90 disabled:opacity-50"
              >
                <Send size={14} />
                {sending ? "Envoi..." : "Envoyer"}
              </button>
              <button
                onClick={() => { setShowReply(false); setReplyText(""); }}
                className="rounded-[var(--radius-button)] bg-dta-beige px-4 py-2 text-sm font-medium text-dta-char hover:bg-dta-taupe/20"
              >
                Annuler
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

"use client";

import { useState, useEffect, useRef } from "react";
import { Send, ArrowLeft, RefreshCw, MessageCircle, Archive, ArchiveRestore, Trash2 } from "lucide-react";

interface Conversation {
  from: string;
  contactName: string;
  body: string;
  createdAt: string;
  unreadCount: number;
  archived: boolean;
}

interface Message {
  id: string;
  waMessageId: string;
  from: string;
  to: string;
  contactName: string;
  direction: string;
  type: string;
  body: string | null;
  mediaUrl: string | null;
  status: string | null;
  createdAt: string;
}

function formatPhone(phone: string) {
  if (phone.startsWith("33") && phone.length === 11) {
    return `+33 ${phone.slice(2, 3)} ${phone.slice(3, 5)} ${phone.slice(5, 7)} ${phone.slice(7, 9)} ${phone.slice(9)}`;
  }
  return `+${phone}`;
}

function formatTime(dateStr: string) {
  const d = new Date(dateStr);
  const now = new Date();
  const diffMs = now.getTime() - d.getTime();
  const diffH = diffMs / (1000 * 60 * 60);

  if (diffH < 24) {
    return d.toLocaleTimeString("fr-FR", { hour: "2-digit", minute: "2-digit" });
  }
  if (diffH < 48) {
    return "Hier " + d.toLocaleTimeString("fr-FR", { hour: "2-digit", minute: "2-digit" });
  }
  return d.toLocaleDateString("fr-FR", { day: "2-digit", month: "short" }) +
    " " + d.toLocaleTimeString("fr-FR", { hour: "2-digit", minute: "2-digit" });
}

const IMAGE_EXTENSIONS = [".jpg", ".jpeg", ".png", ".gif", ".webp"];
const VIDEO_EXTENSIONS = [".mp4", ".mov", ".avi", ".webm", ".3gp"];

function isImageUrl(url: string) {
  const lower = url.toLowerCase();
  return IMAGE_EXTENSIONS.some((ext) => lower.includes(ext));
}

function isVideoUrl(url: string) {
  const lower = url.toLowerCase();
  return VIDEO_EXTENSIONS.some((ext) => lower.includes(ext));
}

function MediaBubble({ url, type, body }: { url: string; type: string; body: string | null }) {
  // Images (sent as image or as document with image extension)
  if (type === "image" || type === "sticker" || (type === "document" && isImageUrl(url))) {
    return (
      <a href={url} target="_blank" rel="noopener noreferrer">
        <img src={url} alt={body ?? ""} className="max-w-full rounded-lg mb-1" style={{ maxHeight: 300 }} loading="lazy" />
      </a>
    );
  }

  // Videos
  if (type === "video" || (type === "document" && isVideoUrl(url))) {
    return (
      <video controls className="max-w-full rounded-lg mb-1" style={{ maxHeight: 300 }}>
        <source src={url} />
      </video>
    );
  }

  // Audio
  if (type === "audio") {
    return (
      <audio controls className="mb-1 w-full max-w-[250px]">
        <source src={url} />
      </audio>
    );
  }

  // Other documents — show as link
  return (
    <a href={url} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 rounded-lg bg-gray-100 px-3 py-2 text-sm text-blue-600 hover:bg-gray-200 transition-colors mb-1">
      <svg className="shrink-0" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/></svg>
      {body || "Document"}
    </a>
  );
}

export default function WhatsAppInbox() {
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [selectedPhone, setSelectedPhone] = useState<string | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [reply, setReply] = useState("");
  const [sending, setSending] = useState(false);
  const [loading, setLoading] = useState(true);
  const [showArchived, setShowArchived] = useState(false);
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const prevMessageCountRef = useRef<number>(0);
  const isFirstLoadRef = useRef<boolean>(true);

  // Load conversations
  const loadConversations = async (archived = showArchived) => {
    setLoading(true);
    try {
      const res = await fetch(`/api/whatsapp/messages?archived=${archived}`);
      const data = await res.json();
      setConversations(Array.isArray(data) ? data : []);
    } catch {
      console.error("Failed to load conversations");
    }
    setLoading(false);
  };

  // Archive/unarchive a conversation
  const archiveConversation = async (phone: string, archived: boolean) => {
    await fetch("/api/whatsapp/conversations", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ phone, archived }),
    });
    setConversations((prev) => prev.filter((c) => c.from !== phone));
    setDeleteConfirm(null);
  };

  // Delete a conversation
  const deleteConversation = async (phone: string) => {
    await fetch("/api/whatsapp/conversations", {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ phone }),
    });
    setConversations((prev) => prev.filter((c) => c.from !== phone));
    setDeleteConfirm(null);
  };

  // Load messages for a phone
  const loadMessages = async (phone: string) => {
    try {
      const res = await fetch(`/api/whatsapp/messages?phone=${phone}`);
      const data = await res.json();
      const newMessages = Array.isArray(data) ? data : [];
      setMessages((prev) => {
        // Only update if messages actually changed (avoids unnecessary re-renders and scrolls)
        if (prev.length === newMessages.length && prev.length > 0 && prev[prev.length - 1]?.id === newMessages[newMessages.length - 1]?.id) {
          return prev;
        }
        return newMessages;
      });
    } catch {
      console.error("Failed to load messages");
    }
  };

  // Send reply
  const handleSend = async () => {
    if (!reply.trim() || !selectedPhone || sending) return;
    setSending(true);
    try {
      const res = await fetch("/api/whatsapp/send", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ to: selectedPhone, message: reply }),
      });
      if (res.ok) {
        setReply("");
        await loadMessages(selectedPhone);
      } else {
        const err = await res.json();
        alert(`Erreur: ${err.error}`);
      }
    } catch {
      alert("Erreur d'envoi");
    }
    setSending(false);
  };

  useEffect(() => {
    loadConversations(showArchived);
  }, [showArchived]);

  useEffect(() => {
    if (selectedPhone) {
      isFirstLoadRef.current = true;
      prevMessageCountRef.current = 0;
      loadMessages(selectedPhone);
      const interval = setInterval(() => loadMessages(selectedPhone), 5000);
      return () => clearInterval(interval);
    }
  }, [selectedPhone]);

  useEffect(() => {
    // Only scroll to bottom on first load or when new messages arrive
    if (messages.length > 0) {
      if (isFirstLoadRef.current || messages.length > prevMessageCountRef.current) {
        messagesEndRef.current?.scrollIntoView({ behavior: isFirstLoadRef.current ? "instant" : "smooth" });
        isFirstLoadRef.current = false;
      }
      prevMessageCountRef.current = messages.length;
    }
  }, [messages]);

  // Conversation list
  if (!selectedPhone) {
    return (
      <div className="rounded-[var(--radius-card)] bg-white shadow-[var(--shadow-card)] overflow-hidden">
        <div className="flex items-center justify-between border-b px-6 py-4">
          <h2 className="font-semibold text-dta-dark">
            {showArchived ? "Archives" : "Conversations"}
          </h2>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setShowArchived(!showArchived)}
              className={`flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs transition-colors ${
                showArchived
                  ? "bg-slate-100 text-slate-700"
                  : "text-dta-taupe hover:bg-gray-100"
              }`}
            >
              {showArchived ? <ArchiveRestore size={13} /> : <Archive size={13} />}
              {showArchived ? "Voir actives" : "Voir archives"}
            </button>
            <button
              onClick={() => loadConversations(showArchived)}
              className="rounded-full p-2 text-dta-taupe hover:bg-gray-100 transition-colors"
            >
              <RefreshCw size={16} className={loading ? "animate-spin" : ""} />
            </button>
          </div>
        </div>

        {loading && conversations.length === 0 ? (
          <div className="flex items-center justify-center py-20 text-dta-taupe">
            <RefreshCw size={20} className="animate-spin mr-2" />
            Chargement...
          </div>
        ) : conversations.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 text-dta-taupe">
            <MessageCircle size={48} className="mb-4 opacity-30" />
            <p>Aucun message reçu</p>
            <p className="text-sm mt-1">Les messages WhatsApp apparaîtront ici</p>
          </div>
        ) : (
          <ul className="divide-y">
            {conversations.map((conv) => (
              <li key={conv.from} className="group relative">
                <button
                  onClick={() => setSelectedPhone(conv.from)}
                  className="flex w-full items-center gap-4 px-6 py-4 text-left hover:bg-gray-50 transition-colors"
                >
                  {/* Avatar */}
                  <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-green-100 text-green-700 font-bold text-lg">
                    {conv.contactName?.charAt(0)?.toUpperCase() || "?"}
                  </div>

                  {/* Info */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <p className="font-semibold text-dta-dark truncate">
                        {conv.contactName}
                      </p>
                      <span className="text-xs text-dta-taupe whitespace-nowrap ml-2">
                        {formatTime(conv.createdAt)}
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <p className="text-sm text-dta-taupe truncate">
                        {conv.body || "..."}
                      </p>
                      {conv.unreadCount > 0 && (
                        <span className="ml-2 flex h-5 min-w-[20px] items-center justify-center rounded-full bg-green-500 px-1.5 text-xs font-bold text-white">
                          {conv.unreadCount}
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-dta-taupe/60 mt-0.5">
                      {formatPhone(conv.from)}
                    </p>
                  </div>
                </button>

                {/* Actions (visible on hover) */}
                {deleteConfirm === conv.from ? (
                  <div className="absolute right-4 top-1/2 -translate-y-1/2 flex items-center gap-1.5 bg-white rounded-lg shadow-md px-2 py-1.5 z-10">
                    <button
                      onClick={() => deleteConversation(conv.from)}
                      className="rounded bg-red-600 px-2.5 py-1 text-xs font-medium text-white hover:bg-red-700"
                    >
                      Confirmer
                    </button>
                    <button
                      onClick={() => setDeleteConfirm(null)}
                      className="rounded bg-gray-100 px-2.5 py-1 text-xs text-gray-700 hover:bg-gray-200"
                    >
                      Annuler
                    </button>
                  </div>
                ) : (
                  <div className="absolute right-4 top-1/2 -translate-y-1/2 hidden group-hover:flex items-center gap-1 bg-white rounded-lg shadow-sm px-1 py-1">
                    <button
                      onClick={(e) => { e.stopPropagation(); archiveConversation(conv.from, !showArchived); }}
                      className="rounded-full p-1.5 hover:bg-slate-100 transition-colors"
                      title={showArchived ? "Desarchiver" : "Archiver"}
                    >
                      {showArchived ? <ArchiveRestore size={15} className="text-slate-500" /> : <Archive size={15} className="text-slate-500" />}
                    </button>
                    <button
                      onClick={(e) => { e.stopPropagation(); setDeleteConfirm(conv.from); }}
                      className="rounded-full p-1.5 hover:bg-red-50 transition-colors"
                      title="Supprimer"
                    >
                      <Trash2 size={15} className="text-gray-400 hover:text-red-500" />
                    </button>
                  </div>
                )}
              </li>
            ))}
          </ul>
        )}
      </div>
    );
  }

  // Chat view
  const contactName = messages.find((m) => m.direction === "inbound")?.contactName ?? formatPhone(selectedPhone);

  return (
    <div className="flex flex-col rounded-[var(--radius-card)] bg-white shadow-[var(--shadow-card)] overflow-hidden" style={{ height: "calc(100vh - 200px)" }}>
      {/* Header */}
      <div className="flex items-center gap-3 border-b px-4 py-3 bg-green-50">
        <button
          onClick={() => {
            setSelectedPhone(null);
            loadConversations();
          }}
          className="rounded-full p-2 hover:bg-green-100 transition-colors"
        >
          <ArrowLeft size={18} />
        </button>
        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-green-500 text-white font-bold">
          {contactName.charAt(0).toUpperCase()}
        </div>
        <div className="flex-1">
          <p className="font-semibold text-dta-dark">{contactName}</p>
          <p className="text-xs text-dta-taupe">{formatPhone(selectedPhone)}</p>
        </div>
        <div className="flex items-center gap-1">
          <button
            onClick={() => { archiveConversation(selectedPhone, true); setSelectedPhone(null); }}
            className="rounded-full p-2 hover:bg-green-100 transition-colors"
            title="Archiver"
          >
            <Archive size={16} className="text-gray-500" />
          </button>
          <button
            onClick={() => {
              if (confirm("Supprimer cette conversation ?")) {
                deleteConversation(selectedPhone);
                setSelectedPhone(null);
              }
            }}
            className="rounded-full p-2 hover:bg-red-50 transition-colors"
            title="Supprimer"
          >
            <Trash2 size={16} className="text-gray-400 hover:text-red-500" />
          </button>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto px-4 py-4 space-y-3 bg-[#ece5dd]">
        {messages.map((msg) => (
          <div
            key={msg.id}
            className={`flex ${msg.direction === "outbound" ? "justify-end" : "justify-start"}`}
          >
            <div
              className={`max-w-[75%] rounded-2xl px-4 py-2 shadow-sm ${
                msg.status === "draft"
                  ? "bg-amber-100 border-2 border-dashed border-amber-400 rounded-tr-sm"
                  : msg.direction === "outbound"
                    ? "bg-[#dcf8c6] rounded-tr-sm"
                    : "bg-white rounded-tl-sm"
              }`}
            >
              {msg.status === "draft" && (
                <p className="text-[10px] font-bold uppercase tracking-wider text-amber-600 mb-1">
                  Brouillon IA
                </p>
              )}
              {msg.mediaUrl && <MediaBubble url={msg.mediaUrl} type={msg.type} body={msg.body} />}
              {!msg.mediaUrl && (
                <p className="text-sm whitespace-pre-wrap break-words">{msg.body || `[${msg.type}]`}</p>
              )}
              {msg.mediaUrl && msg.body && !["[Image]", "[Video]", "[Audio]", "[Sticker]"].includes(msg.body) && (
                <p className="text-sm whitespace-pre-wrap break-words mt-1">{msg.body}</p>
              )}
              {msg.status === "draft" && (
                <div className="flex items-center gap-2 mt-2 pt-2 border-t border-amber-300">
                  <button
                    type="button"
                    onClick={async () => {
                      setSending(true);
                      try {
                        const res = await fetch("/api/whatsapp/send", {
                          method: "POST",
                          headers: { "Content-Type": "application/json" },
                          body: JSON.stringify({ to: selectedPhone, message: msg.body, draftId: msg.id }),
                        });
                        if (res.ok) loadMessages(selectedPhone!);
                      } catch {}
                      setSending(false);
                    }}
                    className="rounded-full bg-green-500 px-3 py-1 text-xs font-semibold text-white hover:bg-green-600"
                  >
                    Envoyer
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setReply(msg.body || "");
                      // Delete draft
                      fetch("/api/whatsapp/send", {
                        method: "DELETE",
                        headers: { "Content-Type": "application/json" },
                        body: JSON.stringify({ draftId: msg.id }),
                      }).then(() => loadMessages(selectedPhone!));
                    }}
                    className="rounded-full border border-amber-400 px-3 py-1 text-xs font-semibold text-amber-700 hover:bg-amber-200"
                  >
                    Modifier
                  </button>
                </div>
              )}
              <div className="flex items-center justify-end gap-1 mt-1">
                <span className="text-[10px] text-gray-500">
                  {formatTime(msg.createdAt)}
                </span>
                {msg.direction === "outbound" && msg.status && msg.status !== "draft" && (
                  <span className="text-[10px] text-gray-400">
                    {msg.status === "read" ? "✓✓" : msg.status === "delivered" ? "✓✓" : "✓"}
                  </span>
                )}
              </div>
            </div>
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>

      {/* Reply input */}
      <div className="border-t bg-gray-50 px-4 py-3">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleSend();
          }}
          className="flex items-center gap-2"
        >
          <input
            type="text"
            value={reply}
            onChange={(e) => setReply(e.target.value)}
            placeholder="Écrire un message..."
            className="flex-1 rounded-full border border-gray-300 px-4 py-2.5 text-sm outline-none focus:border-green-500 focus:ring-1 focus:ring-green-500"
          />
          <button
            type="submit"
            disabled={!reply.trim() || sending}
            className="flex h-10 w-10 items-center justify-center rounded-full bg-green-500 text-white transition-colors hover:bg-green-600 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Send size={18} />
          </button>
        </form>
      </div>
    </div>
  );
}

"use client";

import { useState } from "react";
import Link from "next/link";

interface PaymentInfo {
  id: string;
  amount: number;
  type: string;
  label: string;
  paidAt: string;
}

interface TicketInfo {
  id: string;
  eventTitle: string;
  venue: string;
  address: string;
  date: string;
  coverImage: string | null;
  visitDate: string | null;
  tier: string;
  price: number;
  totalPaid: number;
  installments: number;
  firstName: string | null;
  lastName: string | null;
  qrCode: string | null;
  purchasedAt: string;
  payments: PaymentInfo[];
}

const formatCurrency = (amount: number) =>
  new Intl.NumberFormat("fr-FR", { style: "currency", currency: "EUR" }).format(amount);

const formatDate = (date: string) =>
  new Date(date).toLocaleDateString("fr-FR", { day: "numeric", month: "long", year: "numeric" });

const tierLabels: Record<string, string> = {
  EARLY_BIRD: "Early Bird",
  LAST_CHANCE: "Last Chance",
  STANDARD: "Standard",
  VIP: "VIP",
};

export default function MesBilletsPage() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [tickets, setTickets] = useState<TicketInfo[] | null>(null);
  const [error, setError] = useState("");
  const [rechargeTicketId, setRechargeTicketId] = useState<string | null>(null);
  const [rechargeAmount, setRechargeAmount] = useState<number | null>(null);
  const [rechargeLoading, setRechargeLoading] = useState(false);
  const [expandedTicket, setExpandedTicket] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    setTickets(null);

    try {
      const res = await fetch("/api/tickets/lookup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });

      if (!res.ok) {
        const data = await res.json();
        setError(data.error || "Une erreur est survenue.");
      } else {
        const data = await res.json();
        if (data.tickets && data.tickets.length > 0) {
          setTickets(data.tickets);
        } else {
          setError("Aucun billet trouvé pour cette adresse email.");
        }
      }
    } catch {
      setError("Une erreur est survenue. Réessayez.");
    }

    setLoading(false);
  };

  const handleRecharge = async (ticketId: string, amount: number) => {
    setRechargeLoading(true);
    try {
      const res = await fetch("/api/tickets/recharge", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ticketId, amount, email }),
      });
      const data = await res.json();
      if (data.url) {
        window.location.href = data.url;
      } else {
        setError(data.error || "Erreur lors de la recharge.");
      }
    } catch {
      setError("Erreur réseau. Réessayez.");
    }
    setRechargeLoading(false);
  };

  if (!tickets) {
    return (
      <div className="flex min-h-[80vh] items-center justify-center px-4 py-12">
        <div className="w-full max-w-lg">
          <div className="text-center">
            <h1 className="font-serif text-3xl font-bold text-dta-dark">Mon espace billetterie</h1>
            <p className="mt-2 text-sm text-dta-char/70">
              La culture africaine pour tous. R&eacute;serve ta place d&egrave;s 5&nbsp;&euro; et paye &agrave; ton rythme.
            </p>
          </div>

          <div className="mt-8 rounded-[var(--radius-card)] bg-white p-8 shadow-[var(--shadow-card)]">
            <form onSubmit={handleSubmit} className="space-y-4">
              {error && (
                <div className="rounded-[var(--radius-input)] bg-red-50 px-4 py-3 text-sm text-red-600">
                  {error}
                </div>
              )}
              <div>
                <label htmlFor="email" className="mb-1.5 block text-sm font-medium text-dta-char">
                  Email utilis&eacute; lors de l&apos;achat
                </label>
                <input
                  id="email"
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full rounded-[var(--radius-input)] border border-dta-sand bg-dta-bg px-4 py-2.5 text-sm text-dta-dark placeholder:text-dta-taupe focus:border-dta-accent focus:outline-none focus:ring-1 focus:ring-dta-accent"
                  placeholder="vous@email.com"
                />
              </div>
              <button
                type="submit"
                disabled={loading}
                className="w-full rounded-[var(--radius-button)] bg-dta-accent px-4 py-3 text-sm font-semibold text-white transition-colors hover:bg-dta-accent-dark disabled:opacity-50"
              >
                {loading ? "Recherche..." : "Acc\u00e9der \u00e0 mon espace"}
              </button>
            </form>
          </div>

          <p className="mt-6 text-center text-sm text-dta-char/70">
            <Link href="/saison-culturelle-africaine" className="font-medium text-dta-accent hover:text-dta-accent-dark">
              D&eacute;couvrir les &eacute;v&eacute;nements
            </Link>
          </p>
        </div>
      </div>
    );
  }

  // Dashboard view
  const totalPaid = tickets.reduce((sum, t) => sum + t.totalPaid, 0);
  const totalPrice = tickets.reduce((sum, t) => sum + t.price, 0);
  const totalRemaining = totalPrice - totalPaid;
  const firstName = tickets[0]?.firstName || "vous";
  const allPayments = tickets
    .flatMap((t) => t.payments.map((p) => ({ ...p, eventTitle: t.eventTitle })))
    .sort((a, b) => new Date(b.paidAt).getTime() - new Date(a.paidAt).getTime());

  return (
    <div className="mx-auto max-w-2xl px-4 py-10">
      {/* Header */}
      <div className="mb-8">
        <Link href="/saison-culturelle-africaine" className="text-sm text-dta-accent hover:text-dta-accent-dark">
          &larr; Retour aux &eacute;v&eacute;nements
        </Link>
        <h1 className="mt-4 font-serif text-2xl font-bold text-dta-dark">
          Bonjour, {firstName} &#x1F44B;
        </h1>
        <p className="mt-1 text-sm text-dta-char/70">
          Suis tes r&eacute;servations et recharge ton solde &agrave; ton rythme.
        </p>
      </div>

      {/* Stats cards */}
      <div className="mb-8 grid grid-cols-3 gap-4">
        <div className="rounded-xl border border-dta-sand bg-white p-4 text-center">
          <p className="text-xs text-dta-char/60">Billets</p>
          <p className="mt-1 font-serif text-2xl font-bold text-dta-dark">{tickets.length}</p>
        </div>
        <div className="rounded-xl border border-dta-sand bg-white p-4 text-center">
          <p className="text-xs text-dta-char/60">Total vers&eacute;</p>
          <p className="mt-1 font-serif text-2xl font-bold text-green-600">{formatCurrency(totalPaid)}</p>
        </div>
        <div className="rounded-xl border border-dta-sand bg-white p-4 text-center">
          <p className="text-xs text-dta-char/60">Reste</p>
          <p className="mt-1 font-serif text-2xl font-bold text-dta-accent">{formatCurrency(totalRemaining)}</p>
        </div>
      </div>

      {/* Tickets list */}
      <h2 className="mb-4 font-serif text-lg font-bold text-dta-dark">Mes billets</h2>
      <div className="space-y-4">
        {tickets.map((ticket) => {
          const remaining = ticket.price - ticket.totalPaid;
          const percent = ticket.price > 0 ? Math.round((ticket.totalPaid / ticket.price) * 100) : 100;
          const isPaid = remaining <= 0;
          const isExpanded = expandedTicket === ticket.id;

          return (
            <div key={ticket.id} className="overflow-hidden rounded-xl border border-dta-sand bg-white">
              <div className="p-5">
                {/* Header */}
                <div className="flex items-start justify-between">
                  <div>
                    <span className={`inline-block rounded-full px-2.5 py-0.5 text-xs font-semibold ${
                      isPaid ? "bg-green-100 text-green-700" : "bg-amber-100 text-amber-700"
                    }`}>
                      {isPaid ? "Pay\u00e9" : "En cours"}
                    </span>
                    <p className="mt-2 font-serif text-lg font-bold text-dta-dark">{ticket.eventTitle}</p>
                    <p className="text-xs text-dta-char/60">
                      {tierLabels[ticket.tier] || ticket.tier} &middot; R&eacute;serv&eacute; le {formatDate(ticket.purchasedAt)}
                    </p>
                  </div>
                  {ticket.qrCode && isPaid && (
                    <a href={ticket.qrCode} target="_blank" rel="noopener noreferrer">
                      <img src={ticket.qrCode} alt="QR" className="h-16 w-16 rounded-lg border border-dta-sand" />
                    </a>
                  )}
                </div>

                {/* Progress bar */}
                <div className="mt-4">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-semibold text-green-600">{formatCurrency(ticket.totalPaid)} vers&eacute;s</span>
                    <span className="text-dta-char/60">{percent}%</span>
                  </div>
                  <div className="mt-1.5 h-2.5 overflow-hidden rounded-full bg-dta-bg">
                    <div
                      className={`h-full rounded-full transition-all duration-500 ${
                        isPaid ? "bg-green-500" : "bg-dta-accent"
                      }`}
                      style={{ width: `${percent}%` }}
                    />
                  </div>
                  <div className="mt-1.5 flex items-center justify-between text-xs text-dta-char/60">
                    <span>sur {formatCurrency(ticket.price)}</span>
                    {!isPaid && <span>Reste {formatCurrency(remaining)}</span>}
                  </div>
                </div>

                {/* Recharge section */}
                {!isPaid && (
                  <div className="mt-4">
                    {rechargeTicketId === ticket.id ? (
                      <div className="rounded-lg bg-dta-bg p-4">
                        <p className="mb-3 text-xs font-medium text-dta-char">Choisis un montant</p>
                        <div className="flex flex-wrap gap-2">
                          {[5, 10, 20, remaining > 0 ? remaining : null].filter(Boolean).map((amt) => (
                            <button
                              key={amt}
                              type="button"
                              onClick={() => setRechargeAmount(amt!)}
                              className={`rounded-lg border px-4 py-2 text-sm font-medium transition-colors ${
                                rechargeAmount === amt
                                  ? "border-dta-accent bg-dta-accent text-white"
                                  : "border-dta-sand bg-white text-dta-char hover:border-dta-accent/50"
                              }`}
                            >
                              {amt === remaining ? `${formatCurrency(amt!)} (solde)` : formatCurrency(amt!)}
                            </button>
                          ))}
                        </div>
                        <div className="mt-3 flex gap-2">
                          <button
                            onClick={() => rechargeAmount && handleRecharge(ticket.id, rechargeAmount)}
                            disabled={!rechargeAmount || rechargeLoading}
                            className="flex-1 rounded-lg bg-dta-accent px-4 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-dta-accent-dark disabled:opacity-50"
                          >
                            {rechargeLoading ? "Redirection..." : "Payer maintenant"}
                          </button>
                          <button
                            onClick={() => { setRechargeTicketId(null); setRechargeAmount(null); }}
                            className="rounded-lg border border-dta-sand px-3 py-2.5 text-sm text-dta-char hover:bg-dta-bg"
                          >
                            Annuler
                          </button>
                        </div>
                        <p className="mt-2 text-center text-[10px] text-dta-char/50">
                          &#x1F512; Paiement 100% s&eacute;curis&eacute;
                        </p>
                      </div>
                    ) : (
                      <button
                        onClick={() => { setRechargeTicketId(ticket.id); setRechargeAmount(null); }}
                        className="w-full rounded-lg border border-dta-accent bg-dta-accent/5 px-4 py-2.5 text-sm font-semibold text-dta-accent transition-colors hover:bg-dta-accent/10"
                      >
                        + Recharger
                      </button>
                    )}
                  </div>
                )}

                {/* Toggle details */}
                <button
                  onClick={() => setExpandedTicket(isExpanded ? null : ticket.id)}
                  className="mt-3 text-xs font-medium text-dta-accent hover:text-dta-accent-dark"
                >
                  {isExpanded ? "Masquer les d\u00e9tails" : "D\u00e9tails"}
                </button>
              </div>

              {/* Expanded details */}
              {isExpanded && (
                <div className="border-t border-dta-sand bg-dta-bg px-5 py-4">
                  <div className="grid grid-cols-2 gap-3 text-xs">
                    <div>
                      <span className="text-dta-char/60">Lieu</span>
                      <p className="font-medium text-dta-dark">{ticket.venue}</p>
                    </div>
                    <div>
                      <span className="text-dta-char/60">Prix garanti</span>
                      <p className="font-medium text-dta-dark">{formatCurrency(ticket.price)}</p>
                    </div>
                  </div>
                  {ticket.qrCode && (
                    <div className="mt-4 text-center">
                      <img src={ticket.qrCode} alt="QR Code" className="mx-auto h-40 w-40 rounded-lg border border-dta-sand" />
                      <a
                        href={ticket.qrCode}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="mt-2 inline-block text-xs font-medium text-dta-accent"
                      >
                        T&eacute;l&eacute;charger le QR code
                      </a>
                    </div>
                  )}
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Payment history */}
      {allPayments.length > 0 && (
        <div className="mt-10">
          <h2 className="mb-4 font-serif text-lg font-bold text-dta-dark">Historique des versements</h2>
          <div className="space-y-2">
            {allPayments.map((p) => (
              <div key={p.id} className="flex items-center justify-between rounded-xl border border-dta-sand bg-white px-5 py-3">
                <div className="flex items-center gap-3">
                  <span className="text-lg">&#x1F4B3;</span>
                  <div>
                    <p className="text-sm font-medium text-dta-dark">{p.label}</p>
                    <p className="text-xs text-dta-char/60">{p.eventTitle} &middot; {formatDate(p.paidAt)}</p>
                  </div>
                </div>
                <span className="text-sm font-bold text-green-600">+{formatCurrency(p.amount)}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Recharge rapide */}
      <div className="mt-10 rounded-xl border border-dta-sand bg-white p-6 text-center">
        <p className="text-sm text-dta-char/70">
          La culture africaine pour tous. Chaque euro te rapproche de ton &eacute;v&eacute;nement.
        </p>
      </div>

      {/* Logout / change email */}
      <button
        onClick={() => { setTickets(null); setEmail(""); }}
        className="mt-6 w-full text-center text-sm font-medium text-dta-char/50 hover:text-dta-dark"
      >
        Chercher avec une autre adresse
      </button>
    </div>
  );
}

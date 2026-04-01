"use client";

import { useState } from "react";
import Link from "next/link";
import { signOut } from "next-auth/react";

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
  eventSlug: string;
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

export default function MonEspaceClient({
  userName,
  userEmail,
  memberSince,
  tickets,
  totpEnabled: initialTotpEnabled,
}: {
  userName: string;
  userEmail: string;
  memberSince: string;
  tickets: TicketInfo[];
  totpEnabled: boolean;
}) {
  const [rechargeTicketId, setRechargeTicketId] = useState<string | null>(null);
  const [rechargeAmount, setRechargeAmount] = useState<number | null>(null);
  const [customAmount, setCustomAmount] = useState("");
  const [rechargeLoading, setRechargeLoading] = useState(false);
  const [expandedTicket, setExpandedTicket] = useState<string | null>(null);
  const [totpEnabled, setTotpEnabled] = useState(initialTotpEnabled);
  const [totpSetup, setTotpSetup] = useState<{ qrCode: string; secret: string } | null>(null);
  const [totpCode, setTotpCode] = useState("");
  const [totpLoading, setTotpLoading] = useState(false);
  const [totpError, setTotpError] = useState("");

  const totalPaid = tickets.reduce((sum, t) => sum + t.totalPaid, 0);
  const totalPrice = tickets.reduce((sum, t) => sum + t.price, 0);
  const totalRemaining = totalPrice - totalPaid;
  const firstName = userName.split(" ")[0];

  const allPayments = tickets
    .flatMap((t) => t.payments.map((p) => ({ ...p, eventTitle: t.eventTitle })))
    .sort((a, b) => new Date(b.paidAt).getTime() - new Date(a.paidAt).getTime());

  const handleRecharge = async (ticketId: string, amount: number) => {
    setRechargeLoading(true);
    try {
      const res = await fetch("/api/tickets/recharge", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ticketId, amount, email: userEmail }),
      });
      const data = await res.json();
      if (data.url) {
        window.location.href = data.url;
      }
    } catch {}
    setRechargeLoading(false);
  };

  const selectAmount = (amt: number) => {
    setRechargeAmount(amt);
    setCustomAmount("");
  };

  const handleCustomAmount = (val: string) => {
    setCustomAmount(val);
    const num = parseFloat(val);
    setRechargeAmount(num > 0 ? num : null);
  };

  if (tickets.length === 0) {
    return (
      <div className="mx-auto max-w-2xl px-4 py-16 text-center">
        <h1 className="font-serif text-2xl font-bold text-dta-dark">Bonjour, {firstName}</h1>
        <p className="mt-4 text-dta-char/70">Tu n&apos;as pas encore de billets.</p>
        <Link
          href="/saison-culturelle-africaine"
          className="mt-6 inline-block rounded-[var(--radius-button)] bg-dta-accent px-6 py-3 text-sm font-semibold text-white hover:bg-dta-accent-dark"
        >
          D&eacute;couvrir les &eacute;v&eacute;nements
        </Link>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-2xl px-4 py-10">
      {/* Header */}
      <div className="mb-2">
        <Link href="/saison-culturelle-africaine" className="text-sm text-dta-accent hover:text-dta-accent-dark">
          &larr; Retour aux &eacute;v&eacute;nements
        </Link>
      </div>

      <div className="mb-8 flex items-start justify-between">
        <div>
          <h1 className="font-serif text-2xl font-bold text-dta-dark">
            Bonjour, {firstName} &#x1F44B;
          </h1>
          <p className="mt-1 text-sm text-dta-char/70">
            Suis tes r&eacute;servations et recharge ton solde &agrave; ton rythme.
          </p>
        </div>
        <span className="rounded-full bg-green-100 px-3 py-1 text-xs font-semibold text-green-700">
          &#x2713; Compte v&eacute;rifi&eacute;
        </span>
      </div>

      {/* Stats */}
      <div className="mb-8 grid grid-cols-3 gap-3">
        <div className="rounded-xl border border-dta-sand bg-white p-4 text-center">
          <p className="text-[11px] font-medium uppercase tracking-wider text-dta-char/50">Billets</p>
          <p className="mt-1 font-serif text-2xl font-bold text-dta-dark">{tickets.length}</p>
        </div>
        <div className="rounded-xl border border-dta-sand bg-white p-4 text-center">
          <p className="text-[11px] font-medium uppercase tracking-wider text-dta-char/50">Total vers&eacute;</p>
          <p className="mt-1 font-serif text-xl font-bold text-green-600">{formatCurrency(totalPaid)}</p>
        </div>
        <div className="rounded-xl border border-dta-sand bg-white p-4 text-center">
          <p className="text-[11px] font-medium uppercase tracking-wider text-dta-char/50">Reste</p>
          <p className="mt-1 font-serif text-xl font-bold text-dta-accent">{formatCurrency(totalRemaining)}</p>
        </div>
      </div>

      {/* Tickets */}
      <h2 className="mb-4 font-serif text-lg font-bold text-dta-dark">Mes r&eacute;servations</h2>
      <div className="space-y-4">
        {tickets.map((ticket) => {
          const remaining = ticket.price - ticket.totalPaid;
          const percent = ticket.price > 0 ? Math.round((ticket.totalPaid / ticket.price) * 100) : 100;
          const isPaid = remaining <= 0;
          const isExpanded = expandedTicket === ticket.id;

          return (
            <div key={ticket.id} className="overflow-hidden rounded-xl border border-dta-sand bg-white">
              <div className="p-5">
                {/* Status + Title */}
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <span className={`inline-block rounded-full px-2.5 py-0.5 text-xs font-semibold ${
                      isPaid ? "bg-green-100 text-green-700" : percent > 0 ? "bg-amber-100 text-amber-700" : "bg-gray-100 text-gray-600"
                    }`}>
                      {isPaid ? "Pay\u00e9" : percent > 0 ? "En cours" : "D\u00e9marr\u00e9"}
                    </span>
                    <p className="mt-2 font-serif text-lg font-bold text-dta-dark">{ticket.eventTitle}</p>
                    <p className="text-xs text-dta-char/60">
                      R&eacute;serv&eacute; le {formatDate(ticket.purchasedAt)} &middot; {tierLabels[ticket.tier] || ticket.tier}
                    </p>
                  </div>
                  {ticket.qrCode && isPaid && (
                    <a href={ticket.qrCode} target="_blank" rel="noopener noreferrer" className="ml-3 flex-shrink-0">
                      <img src={ticket.qrCode} alt="QR" className="h-16 w-16 rounded-lg border border-dta-sand" />
                    </a>
                  )}
                </div>

                {/* Progress */}
                <div className="mt-4">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-semibold text-green-600">{formatCurrency(ticket.totalPaid)} vers&eacute;s</span>
                    <span className="text-dta-char/60">{percent}%</span>
                  </div>
                  <div className="mt-1.5 h-3 overflow-hidden rounded-full bg-dta-bg">
                    <div
                      className={`h-full rounded-full transition-all duration-700 ${isPaid ? "bg-green-500" : "bg-gradient-to-r from-dta-accent to-amber-500"}`}
                      style={{ width: `${Math.max(percent, 2)}%` }}
                    />
                  </div>
                  <div className="mt-2 flex items-center justify-between text-xs text-dta-char/60">
                    <span>sur {formatCurrency(ticket.price)}</span>
                    {!isPaid && <span className="font-medium text-dta-accent">Reste {formatCurrency(remaining)}</span>}
                  </div>
                </div>

                {/* Info row */}
                {!isPaid && (
                  <div className="mt-3 grid grid-cols-3 gap-2 rounded-lg bg-dta-bg p-3 text-center text-xs">
                    <div>
                      <p className="text-dta-char/50">Reste</p>
                      <p className="font-bold text-dta-dark">{formatCurrency(remaining)}</p>
                    </div>
                    <div>
                      <p className="text-dta-char/50">D&eacute;lai estim&eacute;</p>
                      <p className="font-bold text-dta-dark">~{Math.ceil(remaining / 20)} mois</p>
                    </div>
                    <div>
                      <p className="text-dta-char/50">Prix garanti</p>
                      <p className="font-bold text-dta-dark">{formatCurrency(ticket.price)}</p>
                    </div>
                  </div>
                )}

                {/* Recharge */}
                {!isPaid && (
                  <div className="mt-4">
                    {rechargeTicketId === ticket.id ? (
                      <div className="rounded-xl border border-dta-sand bg-dta-bg p-4">
                        <p className="mb-3 text-xs font-semibold text-dta-char">Choisis le montant. Chaque euro te rapproche de ton &eacute;v&eacute;nement.</p>
                        <div className="flex flex-wrap gap-2">
                          {[5, 10, 20].map((amt) => (
                            <button
                              key={amt}
                              type="button"
                              onClick={() => selectAmount(amt)}
                              className={`rounded-lg border px-4 py-2 text-sm font-medium transition-colors ${
                                rechargeAmount === amt && !customAmount
                                  ? "border-dta-accent bg-dta-accent text-white"
                                  : "border-dta-sand bg-white text-dta-char hover:border-dta-accent/50"
                              }`}
                            >
                              {formatCurrency(amt)}
                            </button>
                          ))}
                          {remaining > 20 && (
                            <button
                              type="button"
                              onClick={() => selectAmount(remaining)}
                              className={`rounded-lg border px-4 py-2 text-sm font-medium transition-colors ${
                                rechargeAmount === remaining && !customAmount
                                  ? "border-dta-accent bg-dta-accent text-white"
                                  : "border-green-200 bg-green-50 text-green-700 hover:border-green-400"
                              }`}
                            >
                              {formatCurrency(remaining)} (solde)
                            </button>
                          )}
                        </div>
                        <input
                          type="number"
                          min="1"
                          max={remaining}
                          placeholder="Autre montant (&euro;)"
                          value={customAmount}
                          onChange={(e) => handleCustomAmount(e.target.value)}
                          className="mt-3 w-full rounded-lg border border-dta-sand bg-white px-4 py-2 text-sm text-dta-dark placeholder:text-dta-taupe focus:border-dta-accent focus:outline-none"
                        />
                        <div className="mt-3 flex gap-2">
                          <button
                            onClick={() => rechargeAmount && handleRecharge(ticket.id, Math.min(rechargeAmount, remaining))}
                            disabled={!rechargeAmount || rechargeLoading}
                            className="flex-1 rounded-lg bg-dta-accent px-4 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-dta-accent-dark disabled:opacity-50"
                          >
                            {rechargeLoading ? "Redirection..." : "Payer maintenant"}
                          </button>
                          <button
                            onClick={() => { setRechargeTicketId(null); setRechargeAmount(null); setCustomAmount(""); }}
                            className="rounded-lg border border-dta-sand px-3 py-2.5 text-sm text-dta-char hover:bg-white"
                          >
                            Annuler
                          </button>
                        </div>
                        <p className="mt-2 text-center text-[10px] text-dta-char/40">&#x1F512; Paiement 100% s&eacute;curis&eacute;</p>
                      </div>
                    ) : (
                      <button
                        onClick={() => { setRechargeTicketId(ticket.id); setRechargeAmount(null); setCustomAmount(""); }}
                        className="w-full rounded-lg border-2 border-dashed border-dta-accent/30 bg-dta-accent/5 px-4 py-3 text-sm font-semibold text-dta-accent transition-colors hover:border-dta-accent/50 hover:bg-dta-accent/10"
                      >
                        + Recharger
                      </button>
                    )}
                  </div>
                )}

                {/* Details toggle */}
                <button
                  onClick={() => setExpandedTicket(isExpanded ? null : ticket.id)}
                  className="mt-3 text-xs font-medium text-dta-accent hover:text-dta-accent-dark"
                >
                  {isExpanded ? "Masquer" : "D\u00e9tails"}
                </button>
              </div>

              {/* Expanded */}
              {isExpanded && (
                <div className="border-t border-dta-sand bg-dta-bg px-5 py-4">
                  <div className="grid grid-cols-2 gap-3 text-xs">
                    <div>
                      <span className="text-dta-char/50">Lieu</span>
                      <p className="font-medium text-dta-dark">{ticket.venue}</p>
                      <p className="text-dta-char/60">{ticket.address}</p>
                    </div>
                    <div>
                      <span className="text-dta-char/50">Date</span>
                      <p className="font-medium text-dta-dark">{formatDate(ticket.visitDate || ticket.date)}</p>
                    </div>
                  </div>
                  {ticket.qrCode && (
                    <div className="mt-4 text-center">
                      <img src={ticket.qrCode} alt="QR Code" className="mx-auto h-44 w-44 rounded-xl border border-dta-sand bg-white p-2" />
                      <a href={ticket.qrCode} target="_blank" rel="noopener noreferrer" className="mt-2 inline-block text-xs font-medium text-dta-accent">
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
                    <p className="text-xs text-dta-char/50">{p.eventTitle} &middot; {formatDate(p.paidAt)}</p>
                  </div>
                </div>
                <span className="text-sm font-bold text-green-600">+{formatCurrency(p.amount)}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Security - 2FA */}
      <div className="mt-10 rounded-xl border border-dta-sand bg-white p-6">
        <h2 className="mb-4 font-serif text-lg font-bold text-dta-dark">S&eacute;curit&eacute;</h2>
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-dta-dark">Authentification &agrave; deux facteurs (2FA)</p>
            <p className="text-xs text-dta-char/50">
              {totpEnabled
                ? "Votre compte est prot\u00e9g\u00e9 par la v\u00e9rification en deux \u00e9tapes."
                : "Ajoutez une couche de s\u00e9curit\u00e9 suppl\u00e9mentaire \u00e0 votre compte."}
            </p>
          </div>
          <span className={`rounded-full px-3 py-1 text-xs font-semibold ${
            totpEnabled ? "bg-green-100 text-green-700" : "bg-gray-100 text-gray-600"
          }`}>
            {totpEnabled ? "Activ\u00e9" : "D\u00e9sactiv\u00e9"}
          </span>
        </div>

        {totpError && (
          <div className="mt-3 rounded-lg bg-red-50 px-4 py-2 text-xs text-red-600">{totpError}</div>
        )}

        {!totpEnabled && !totpSetup && (
          <button
            onClick={async () => {
              setTotpLoading(true);
              setTotpError("");
              try {
                const res = await fetch("/api/auth/totp/setup", { method: "POST" });
                const data = await res.json();
                if (data.qrCode) {
                  setTotpSetup(data);
                } else {
                  setTotpError(data.error || "Erreur");
                }
              } catch { setTotpError("Erreur réseau."); }
              setTotpLoading(false);
            }}
            disabled={totpLoading}
            className="mt-4 rounded-lg bg-dta-accent px-4 py-2 text-sm font-semibold text-white hover:bg-dta-accent-dark disabled:opacity-50"
          >
            {totpLoading ? "Chargement..." : "Activer le 2FA"}
          </button>
        )}

        {totpSetup && !totpEnabled && (
          <div className="mt-4 rounded-xl border border-dta-sand bg-dta-bg p-5">
            <p className="mb-3 text-sm font-medium text-dta-dark">1. Scannez ce QR code avec votre application (Google Authenticator, Authy, etc.)</p>
            <div className="text-center">
              <img src={totpSetup.qrCode} alt="QR Code 2FA" className="mx-auto h-48 w-48 rounded-lg" />
            </div>
            <p className="mt-3 text-xs text-dta-char/50 text-center">
              Cl&eacute; manuelle : <code className="rounded bg-white px-2 py-0.5 font-mono text-xs">{totpSetup.secret}</code>
            </p>
            <p className="mt-4 mb-2 text-sm font-medium text-dta-dark">2. Entrez le code &agrave; 6 chiffres</p>
            <div className="flex gap-2">
              <input
                type="text"
                inputMode="numeric"
                pattern="[0-9]{6}"
                maxLength={6}
                value={totpCode}
                onChange={(e) => setTotpCode(e.target.value.replace(/\D/g, ""))}
                className="flex-1 rounded-lg border border-dta-sand bg-white px-4 py-2.5 text-center font-mono text-lg tracking-[0.3em] focus:border-dta-accent focus:outline-none"
                placeholder="000000"
              />
              <button
                onClick={async () => {
                  setTotpLoading(true);
                  setTotpError("");
                  try {
                    const res = await fetch("/api/auth/totp/verify", {
                      method: "POST",
                      headers: { "Content-Type": "application/json" },
                      body: JSON.stringify({ code: totpCode }),
                    });
                    const data = await res.json();
                    if (data.success) {
                      setTotpEnabled(true);
                      setTotpSetup(null);
                      setTotpCode("");
                    } else {
                      setTotpError(data.error || "Code incorrect.");
                    }
                  } catch { setTotpError("Erreur réseau."); }
                  setTotpLoading(false);
                }}
                disabled={totpCode.length !== 6 || totpLoading}
                className="rounded-lg bg-dta-accent px-4 py-2.5 text-sm font-semibold text-white hover:bg-dta-accent-dark disabled:opacity-50"
              >
                {totpLoading ? "..." : "Valider"}
              </button>
            </div>
            <button
              onClick={() => { setTotpSetup(null); setTotpCode(""); setTotpError(""); }}
              className="mt-3 text-xs text-dta-char/50 hover:text-dta-dark"
            >
              Annuler
            </button>
          </div>
        )}

        {totpEnabled && (
          <div className="mt-4">
            <button
              onClick={async () => {
                const code = prompt("Entrez votre code 2FA pour d\u00e9sactiver :");
                if (!code) return;
                setTotpLoading(true);
                setTotpError("");
                try {
                  const res = await fetch("/api/auth/totp/disable", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ code }),
                  });
                  const data = await res.json();
                  if (data.success) {
                    setTotpEnabled(false);
                  } else {
                    setTotpError(data.error || "Code incorrect.");
                  }
                } catch { setTotpError("Erreur réseau."); }
                setTotpLoading(false);
              }}
              className="text-sm text-red-500 hover:text-red-700"
            >
              D&eacute;sactiver le 2FA
            </button>
          </div>
        )}
      </div>

      {/* Profile */}
      <div className="mt-10 rounded-xl border border-dta-sand bg-white p-6">
        <h2 className="mb-4 font-serif text-lg font-bold text-dta-dark">Mon profil</h2>
        <div className="grid grid-cols-2 gap-4 text-sm">
          <div>
            <p className="text-xs text-dta-char/50">Nom</p>
            <p className="font-medium text-dta-dark">{userName}</p>
          </div>
          <div>
            <p className="text-xs text-dta-char/50">Email</p>
            <p className="font-medium text-dta-dark">{userEmail}</p>
          </div>
          <div>
            <p className="text-xs text-dta-char/50">Membre depuis</p>
            <p className="font-medium text-dta-dark">{memberSince}</p>
          </div>
          <div>
            <p className="text-xs text-dta-char/50">Billets achet&eacute;s</p>
            <p className="font-medium text-dta-dark">{tickets.length}</p>
          </div>
        </div>
        <button
          onClick={() => signOut({ callbackUrl: "/" })}
          className="mt-6 text-sm font-medium text-red-500 hover:text-red-700"
        >
          Se d&eacute;connecter
        </button>
      </div>

      {/* Footer baseline */}
      <p className="mt-8 text-center text-xs text-dta-char/40">
        La culture africaine pour tous. R&eacute;serve ta place d&egrave;s 5&nbsp;&euro; et paye &agrave; ton rythme.
      </p>
    </div>
  );
}

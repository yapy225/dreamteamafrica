"use client";

import { useEffect, useState } from "react";

type ActiveListing = {
  id: string;
  price: number;
  listedAt: string;
};

export default function ListingButton({
  ticketId,
  price,
  eventTitle,
  activeListing: initialListing,
}: {
  ticketId: string;
  price: number;
  eventTitle: string;
  activeListing: ActiveListing | null;
}) {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [listing, setListing] = useState<ActiveListing | null>(initialListing);

  useEffect(() => { setListing(initialListing); }, [initialListing]);

  const commission = Math.round(price * 0.05 * 100) / 100;
  const total = Math.round((price + commission) * 100) / 100;

  const handleList = async () => {
    setError("");
    setSuccess("");
    setLoading(true);
    try {
      const res = await fetch(`/api/tickets/${ticketId}/list`, { method: "POST", headers: { "Content-Type": "application/json" }, body: "{}" });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error || "Erreur lors de la mise en vente.");
      } else {
        setSuccess("Billet mis en vente sur la Bourse officielle !");
        setListing({ id: data.listingId, price, listedAt: new Date().toISOString() });
      }
    } catch {
      setError("Erreur réseau.");
    } finally {
      setLoading(false);
    }
  };

  const handleDelist = async () => {
    if (!listing) return;
    if (!confirm("Retirer ce billet de la Bourse ?")) return;
    try {
      const res = await fetch(`/api/listings/${listing.id}/delist`, { method: "POST" });
      const data = await res.json();
      if (!res.ok) {
        alert(data.error || "Erreur lors du retrait.");
        return;
      }
      setListing(null);
      setSuccess("");
    } catch {
      alert("Erreur réseau.");
    }
  };

  if (listing) {
    return (
      <div className="flex flex-col items-end gap-1">
        <span className="inline-flex items-center gap-1.5 rounded-xl border border-emerald-200 bg-emerald-50 px-3 py-1.5 text-[11px] font-semibold text-emerald-700">
          En vente — {listing.price.toFixed(2)} €
        </span>
        <div className="flex gap-2">
          <a href={`/bourse/${listing.id}`} target="_blank" rel="noreferrer" className="text-[10px] text-emerald-700 hover:underline">Voir l&apos;annonce</a>
          <button onClick={handleDelist} className="text-[10px] text-red-600 hover:underline">Retirer</button>
        </div>
      </div>
    );
  }

  if (!open) {
    return (
      <button
        onClick={(e) => { e.preventDefault(); e.stopPropagation(); setOpen(true); }}
        className="inline-flex items-center gap-1.5 rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-2 text-xs font-semibold text-emerald-700 transition-colors hover:border-emerald-500 hover:bg-emerald-500 hover:text-white"
      >
        Mettre en vente
      </button>
    );
  }

  return (
    <div
      className="w-full rounded-xl border border-slate-200 bg-slate-50 p-4 sm:min-w-[280px]"
      onClick={(e) => { e.preventDefault(); e.stopPropagation(); }}
    >
      <div className="mb-3 flex items-center justify-between">
        <p className="text-xs font-semibold text-slate-900">Bourse officielle DTA</p>
        <button onClick={() => { setOpen(false); setError(""); setSuccess(""); }} className="text-[11px] text-slate-400 hover:text-slate-600">Fermer</button>
      </div>
      <div className="space-y-1 text-[11px] text-slate-600">
        <p>Tu revends ce billet au <strong>prix d&apos;achat</strong> ({price.toFixed(2)} €). Zéro spéculation.</p>
        <p>L&apos;acheteur paiera {total.toFixed(2)} € ({price.toFixed(2)} + {commission.toFixed(2)} € de frais de service).</p>
        <p>Tu seras remboursé {price.toFixed(2)} € sur ta carte d&apos;origine dès l&apos;achat.</p>
      </div>
      <button
        onClick={handleList}
        disabled={loading}
        className="mt-3 w-full rounded-lg bg-emerald-600 px-4 py-2 text-xs font-semibold text-white hover:bg-emerald-700 disabled:opacity-50"
      >
        {loading ? "Mise en vente..." : `Mettre en vente — ${eventTitle}`}
      </button>
      {error && <p className="mt-2 text-[11px] text-red-600">{error}</p>}
      {success && <p className="mt-2 text-[11px] text-emerald-700">{success}</p>}
    </div>
  );
}

"use client";

import { useState } from "react";
import { FileText, Loader2, Download } from "lucide-react";

const EVENTS = [
  { id: "foire", name: "Foire d'Afrique Paris — 6ème Édition", date: "1er & 2 mai 2026", venue: "Espace MAS", address: "10 rue des Terres au Curé, 75013 Paris" },
  { id: "evasion", name: "Évasion Paris", date: "13 juin 2026", venue: "La Seine — Paris", address: "Paris" },
  { id: "autre-culture", name: "Festival de l'Autre Culture", date: "27 juin 2026", venue: "Parc des Épivans", address: "Fontenay-sous-Bois" },
  { id: "fashion", name: "Fashion Week Africa — Paris 2026", date: "3 octobre 2026", venue: "Espace MAS", address: "10 rue des Terres au Curé, 75013 Paris" },
  { id: "danse", name: "Juste Une Danse", date: "31 octobre 2026", venue: "Espace MAS", address: "10 rue des Terres au Curé, 75013 Paris" },
  { id: "conte", name: "Festival du Conte Africain", date: "11 novembre 2026", venue: "Espace MAS", address: "10 rue des Terres au Curé, 75013 Paris" },
  { id: "salon", name: "Salon Made In Africa", date: "11 & 12 décembre 2026", venue: "Espace MAS", address: "10 rue des Terres au Curé, 75013 Paris" },
];

const ROLES = [
  { id: "exposant", label: "Exposant" },
  { id: "mannequin", label: "Mannequin" },
  { id: "artiste", label: "Artiste / Performeur" },
  { id: "invite", label: "Invité(e)" },
];

interface Props {
  defaultName?: string;
  defaultCompany?: string;
  defaultRole?: string;
}

export default function InvitationGenerator({ defaultName, defaultCompany, defaultRole }: Props) {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    recipientName: defaultName || "",
    recipientCompany: defaultCompany || "",
    recipientAddress: "",
    eventId: "foire",
    role: defaultRole || "exposant",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setForm((p) => ({ ...p, [e.target.name]: e.target.value }));
  };

  const handleGenerate = async () => {
    setLoading(true);
    const event = EVENTS.find((e) => e.id === form.eventId)!;

    try {
      const res = await fetch("/api/admin/invitation", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          recipientName: form.recipientName,
          recipientCompany: form.recipientCompany,
          recipientAddress: form.recipientAddress,
          event: event.name,
          eventDate: event.date,
          eventVenue: event.venue,
          eventAddress: event.address,
          role: form.role,
        }),
      });

      if (!res.ok) throw new Error("Erreur");

      const blob = await res.blob();
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `Invitation-${form.recipientName.replace(/\s/g, "_")}.pdf`;
      a.click();
      URL.revokeObjectURL(url);
    } catch {
      alert("Erreur lors de la génération.");
    }

    setLoading(false);
  };

  if (!open) {
    return (
      <button
        onClick={() => setOpen(true)}
        className="flex items-center gap-2 rounded-full bg-dta-accent px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-dta-accent-dark"
      >
        <FileText size={16} />
        G&eacute;n&eacute;rer une lettre d&apos;invitation
      </button>
    );
  }

  return (
    <div className="rounded-2xl border border-dta-sand bg-white p-6 shadow-sm">
      <div className="mb-4 flex items-center justify-between">
        <h3 className="font-serif text-lg font-bold text-dta-dark">
          G&eacute;n&eacute;rateur de lettre d&apos;invitation
        </h3>
        <button onClick={() => setOpen(false)} className="text-sm text-dta-char/50 hover:text-dta-dark">
          Fermer
        </button>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div>
          <label className="mb-1 block text-sm font-medium text-dta-char">Nom complet *</label>
          <input
            name="recipientName"
            value={form.recipientName}
            onChange={handleChange}
            placeholder="Prénom NOM"
            className="w-full rounded-lg border border-dta-sand bg-dta-bg px-3 py-2.5 text-sm outline-none focus:border-dta-accent"
          />
        </div>
        <div>
          <label className="mb-1 block text-sm font-medium text-dta-char">Entreprise / Marque</label>
          <input
            name="recipientCompany"
            value={form.recipientCompany}
            onChange={handleChange}
            placeholder="Nom de l'entreprise (optionnel)"
            className="w-full rounded-lg border border-dta-sand bg-dta-bg px-3 py-2.5 text-sm outline-none focus:border-dta-accent"
          />
        </div>
        <div className="sm:col-span-2">
          <label className="mb-1 block text-sm font-medium text-dta-char">Adresse postale</label>
          <input
            name="recipientAddress"
            value={form.recipientAddress}
            onChange={handleChange}
            placeholder="Adresse complète (optionnel — utile pour les visas)"
            className="w-full rounded-lg border border-dta-sand bg-dta-bg px-3 py-2.5 text-sm outline-none focus:border-dta-accent"
          />
        </div>
        <div>
          <label className="mb-1 block text-sm font-medium text-dta-char">&Eacute;v&eacute;nement *</label>
          <select
            name="eventId"
            value={form.eventId}
            onChange={handleChange}
            className="w-full rounded-lg border border-dta-sand bg-dta-bg px-3 py-2.5 text-sm outline-none focus:border-dta-accent"
          >
            {EVENTS.map((e) => (
              <option key={e.id} value={e.id}>
                {e.name} — {e.date}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label className="mb-1 block text-sm font-medium text-dta-char">R&ocirc;le *</label>
          <select
            name="role"
            value={form.role}
            onChange={handleChange}
            className="w-full rounded-lg border border-dta-sand bg-dta-bg px-3 py-2.5 text-sm outline-none focus:border-dta-accent"
          >
            {ROLES.map((r) => (
              <option key={r.id} value={r.id}>
                {r.label}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="mt-6 flex gap-3">
        <button
          onClick={handleGenerate}
          disabled={loading || !form.recipientName}
          className="flex items-center gap-2 rounded-full bg-dta-accent px-6 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-dta-accent-dark disabled:opacity-50"
        >
          {loading ? (
            <>
              <Loader2 size={16} className="animate-spin" />
              G&eacute;n&eacute;ration...
            </>
          ) : (
            <>
              <Download size={16} />
              T&eacute;l&eacute;charger le PDF
            </>
          )}
        </button>
      </div>
    </div>
  );
}

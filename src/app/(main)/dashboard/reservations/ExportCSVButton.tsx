"use client";

import { useState } from "react";
import { Download, Loader2 } from "lucide-react";

export default function ExportCSVButton() {
  const [loading, setLoading] = useState(false);

  const handleExport = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/reservations/export");
      if (!res.ok) throw new Error("Export failed");
      const blob = await res.blob();
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `reservations-${new Date().toISOString().slice(0, 10)}.csv`;
      a.click();
      URL.revokeObjectURL(url);
    } catch {
      alert("Erreur lors de l'export.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <button
      onClick={handleExport}
      disabled={loading}
      className="flex items-center gap-2 rounded-[var(--radius-button)] bg-dta-accent px-4 py-2.5 text-sm font-medium text-white hover:bg-dta-accent-dark disabled:opacity-50"
    >
      {loading ? <Loader2 size={16} className="animate-spin" /> : <Download size={16} />}
      Exporter CSV
    </button>
  );
}

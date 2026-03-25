"use client";

import { useState, useEffect, useRef } from "react";
import { Upload, FileText, Trash2, Loader2, ExternalLink } from "lucide-react";

interface DocFile {
  name: string;
  url: string;
  date: string;
  size: string;
}

export default function DocumentArchive() {
  const [files, setFiles] = useState<DocFile[]>([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const loadFiles = async () => {
    try {
      const res = await fetch("/api/admin/documents");
      const data = await res.json();
      if (data.files) setFiles(data.files);
    } catch {
      // silent
    }
    setLoading(false);
  };

  useEffect(() => {
    loadFiles();
  }, []);

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);

    const formData = new FormData();
    formData.append("file", file);

    try {
      const res = await fetch("/api/admin/documents", {
        method: "POST",
        body: formData,
      });
      if (res.ok) {
        await loadFiles();
      }
    } catch {
      // silent
    }

    setUploading(false);
    if (inputRef.current) inputRef.current.value = "";
  };

  const handleDelete = async (name: string) => {
    if (!confirm(`Supprimer ${name} ?`)) return;
    await fetch("/api/admin/documents", {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name }),
    });
    await loadFiles();
  };

  return (
    <div className="rounded-2xl border border-dta-sand bg-white p-6 shadow-sm">
      <div className="mb-4 flex items-center justify-between">
        <h3 className="font-serif text-lg font-bold text-dta-dark">
          Archives documents
        </h3>
        <label className="flex cursor-pointer items-center gap-2 rounded-full bg-dta-accent px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-dta-accent-dark">
          {uploading ? (
            <Loader2 size={14} className="animate-spin" />
          ) : (
            <Upload size={14} />
          )}
          {uploading ? "Envoi..." : "Importer un PDF"}
          <input
            ref={inputRef}
            type="file"
            accept=".pdf"
            onChange={handleUpload}
            className="hidden"
            disabled={uploading}
          />
        </label>
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-8">
          <Loader2 size={24} className="animate-spin text-dta-accent" />
        </div>
      ) : files.length === 0 ? (
        <p className="py-8 text-center text-sm text-dta-char/50">
          Aucun document archiv&eacute;. Importez vos PDF ici.
        </p>
      ) : (
        <div className="space-y-2">
          {files.map((f) => (
            <div
              key={f.name}
              className="flex items-center gap-3 rounded-xl border border-dta-sand/50 bg-dta-bg px-4 py-3 transition-colors hover:bg-white"
            >
              <FileText size={18} className="shrink-0 text-red-500" />
              <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-medium text-dta-dark">
                  {f.name}
                </p>
                <p className="text-[10px] text-dta-char/50">
                  {f.date} &middot; {f.size}
                </p>
              </div>
              <a
                href={f.url}
                target="_blank"
                rel="noopener noreferrer"
                className="rounded-lg p-1.5 text-dta-char/40 hover:bg-dta-accent/10 hover:text-dta-accent transition-colors"
              >
                <ExternalLink size={14} />
              </a>
              <button
                onClick={() => handleDelete(f.name)}
                className="rounded-lg p-1.5 text-dta-char/40 hover:bg-red-50 hover:text-red-500 transition-colors"
              >
                <Trash2 size={14} />
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

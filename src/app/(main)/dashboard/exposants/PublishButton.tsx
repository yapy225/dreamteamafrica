"use client";

import { useState } from "react";
import { Send } from "lucide-react";

export default function PublishButton({ profileId }: { profileId: string }) {
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<{
    published: number;
    failed: number;
    details: Array<{ platform: string; status: string; postUrl?: string; error?: string }>;
  } | null>(null);

  const handleClick = async () => {
    setLoading(true);
    setResult(null);

    try {
      const res = await fetch("/api/admin/exhibitor-publish", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ profileId }),
      });
      const data = await res.json();
      if (data.error) {
        setResult({ published: 0, failed: 1, details: [{ platform: "-", status: "error", error: data.error }] });
      } else {
        setResult(data);
      }
    } catch {
      setResult({ published: 0, failed: 1, details: [] });
    }

    setLoading(false);
  };

  return (
    <div>
      <button
        onClick={handleClick}
        disabled={loading}
        className="inline-flex items-center gap-1 rounded-[var(--radius-button)] bg-green-600 px-3 py-1.5 text-xs font-semibold text-white hover:bg-green-700 disabled:opacity-50"
      >
        <Send size={12} />
        {loading ? "Publication..." : "Publier"}
      </button>
      {result && (
        <div className="mt-1.5 space-y-0.5">
          {result.details.map((d, i) => (
            <div key={i} className="flex items-center gap-1 text-[10px]">
              <span
                className={`inline-block h-1.5 w-1.5 rounded-full ${
                  d.status === "published"
                    ? "bg-green-500"
                    : d.status === "draft"
                      ? "bg-amber-400"
                      : "bg-red-400"
                }`}
              />
              <span className="text-dta-char/70">
                {d.platform}
                {d.status === "published" && d.postUrl && (
                  <>
                    {" "}
                    <a href={d.postUrl} target="_blank" rel="noopener noreferrer" className="text-dta-accent underline">
                      voir
                    </a>
                  </>
                )}
                {d.status === "draft" && " (brouillon)"}
                {d.status === "error" && ` — ${d.error?.slice(0, 40)}`}
                {d.status === "failed" && ` — ${d.error?.slice(0, 40)}`}
              </span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

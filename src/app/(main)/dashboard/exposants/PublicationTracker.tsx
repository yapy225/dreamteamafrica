"use client";

import { useState } from "react";
import { CheckCircle, Clock, Loader2, ExternalLink } from "lucide-react";
import { useRouter } from "next/navigation";

const PLATFORMS = [
  { id: "facebook", label: "FB", color: "bg-blue-600" },
  { id: "instagram", label: "IG", color: "bg-gradient-to-br from-purple-600 to-pink-500" },
  { id: "twitter", label: "𝕏", color: "bg-black" },
  { id: "linkedin", label: "In", color: "bg-blue-700" },
  { id: "tiktok", label: "TK", color: "bg-gray-900" },
  { id: "lafropeen", label: "AF", color: "bg-dta-accent" },
  { id: "officiel", label: "OA", color: "bg-dta-dark" },
] as const;

interface Publication {
  platform: string;
  status: string;
  postUrl: string | null;
}

export default function PublicationTracker({
  profileId,
  publications,
}: {
  profileId: string;
  publications: Publication[];
}) {
  const [pubs, setPubs] = useState<Record<string, Publication>>(
    Object.fromEntries(publications.map((p) => [p.platform, p])),
  );
  const [loading, setLoading] = useState<string | null>(null);
  const [urlInput, setUrlInput] = useState<{ platform: string; url: string } | null>(null);
  const router = useRouter();

  const cycle = async (platform: string, postUrl?: string) => {
    const current = pubs[platform]?.status || "PENDING";
    const next =
      current === "PENDING"
        ? "SCHEDULED"
        : current === "SCHEDULED"
          ? "POSTED"
          : "PENDING";

    // If transitioning to POSTED, ask for URL
    if (next === "POSTED" && !postUrl) {
      setUrlInput({ platform, url: "" });
      return;
    }

    setLoading(platform);
    try {
      const res = await fetch("/api/admin/exhibitor-publications", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          profileId,
          platform,
          status: next,
          postUrl: postUrl || null,
        }),
      });
      if (res.ok) {
        setPubs((prev) => ({
          ...prev,
          [platform]: { platform, status: next, postUrl: postUrl || null },
        }));
        router.refresh();
      }
    } catch {
      // silent
    }
    setLoading(null);
    setUrlInput(null);
  };

  return (
    <div className="space-y-1">
      {urlInput && (
        <div className="mb-2 flex gap-1">
          <input
            type="url"
            value={urlInput.url}
            onChange={(e) => setUrlInput({ ...urlInput, url: e.target.value })}
            placeholder="URL du post"
            className="w-full rounded border border-gray-300 px-1.5 py-0.5 text-[10px] outline-none focus:border-dta-accent"
            autoFocus
            onKeyDown={(e) => {
              if (e.key === "Enter") cycle(urlInput.platform, urlInput.url);
              if (e.key === "Escape") setUrlInput(null);
            }}
          />
          <button
            onClick={() => cycle(urlInput.platform, urlInput.url)}
            className="rounded bg-green-600 px-1.5 text-[10px] text-white hover:bg-green-700"
          >
            OK
          </button>
        </div>
      )}
      <div className="flex flex-wrap gap-1">
        {PLATFORMS.map((pl) => {
          const pub = pubs[pl.id];
          const status = pub?.status || "PENDING";
          const isLoading = loading === pl.id;

          return (
            <button
              key={pl.id}
              onClick={() => cycle(pl.id)}
              disabled={isLoading}
              title={`${pl.label}: ${status}${pub?.postUrl ? ` — ${pub.postUrl}` : ""}\nCliquer pour changer`}
              className={`relative flex h-5 w-5 items-center justify-center rounded text-[7px] font-bold text-white transition-all ${
                status === "POSTED"
                  ? "ring-2 ring-green-400 ring-offset-1"
                  : status === "SCHEDULED"
                    ? "ring-2 ring-blue-400 ring-offset-1"
                    : "opacity-40 hover:opacity-70"
              } ${pl.color}`}
            >
              {isLoading ? (
                <Loader2 size={8} className="animate-spin" />
              ) : status === "POSTED" ? (
                <CheckCircle size={8} />
              ) : status === "SCHEDULED" ? (
                <Clock size={8} />
              ) : (
                pl.label.slice(0, 2)
              )}
            </button>
          );
        })}
      </div>
      {Object.values(pubs).some((p) => p.postUrl) && (
        <div className="flex flex-wrap gap-1 mt-0.5">
          {Object.values(pubs)
            .filter((p) => p.postUrl)
            .map((p) => (
              <a
                key={p.platform}
                href={p.postUrl!}
                target="_blank"
                rel="noopener noreferrer"
                className="text-[9px] text-dta-accent hover:underline"
              >
                <ExternalLink size={8} className="inline" /> {p.platform}
              </a>
            ))}
        </div>
      )}
    </div>
  );
}

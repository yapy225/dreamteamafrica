"use client";

import { useState, useEffect } from "react";
import { Loader2, Lock, Check, X } from "lucide-react";

interface StandInfo {
  status: "available" | "reserved" | "blocked" | "mine";
  companyName?: string;
  bookingId?: string;
  userId?: string;
  reason?: string;
}

interface FloorPlanProps {
  bookingId?: string; // Current user's booking ID (exhibitor mode)
  userId?: string; // Current user ID
  isAdmin?: boolean;
  onStandSelected?: (standNumber: number) => void;
}

// Stand layout: 45 stands arranged in the main room
// 5 columns x 9 rows grid
const STAND_LAYOUT: Array<{
  number: number;
  x: number;
  y: number;
  w: number;
  h: number;
}> = (() => {
  const stands: typeof STAND_LAYOUT = [];
  const sw = 52; // stand width
  const sh = 40; // stand height
  const gap = 4;

  // Left wall stands (1-9): vertical column along left wall
  for (let i = 0; i < 9; i++) {
    stands.push({
      number: i + 1,
      x: 20,
      y: 60 + i * (sh + gap),
      w: sw,
      h: sh,
    });
  }

  // Center-left column (10-18)
  for (let i = 0; i < 9; i++) {
    stands.push({
      number: i + 10,
      x: 20 + (sw + gap) * 1,
      y: 60 + i * (sh + gap),
      w: sw,
      h: sh,
    });
  }

  // Center column (19-27)
  for (let i = 0; i < 9; i++) {
    stands.push({
      number: i + 19,
      x: 20 + (sw + gap) * 2,
      y: 60 + i * (sh + gap),
      w: sw,
      h: sh,
    });
  }

  // Center-right column (28-36)
  for (let i = 0; i < 9; i++) {
    stands.push({
      number: i + 28,
      x: 20 + (sw + gap) * 3,
      y: 60 + i * (sh + gap),
      w: sw,
      h: sh,
    });
  }

  // Right column (37-45)
  for (let i = 0; i < 9; i++) {
    stands.push({
      number: i + 37,
      x: 20 + (sw + gap) * 4,
      y: 60 + i * (sh + gap),
      w: sw,
      h: sh,
    });
  }

  return stands;
})();

const COLORS = {
  available: { fill: "#22c55e", stroke: "#16a34a", text: "#fff" },
  reserved: { fill: "#ef4444", stroke: "#dc2626", text: "#fff" },
  blocked: { fill: "#9ca3af", stroke: "#6b7280", text: "#fff" },
  mine: { fill: "#3b82f6", stroke: "#2563eb", text: "#fff" },
  hover: { fill: "#86efac", stroke: "#16a34a", text: "#166534" },
};

export default function FloorPlan({
  bookingId,
  userId,
  isAdmin = false,
  onStandSelected,
}: FloorPlanProps) {
  const [stands, setStands] = useState<Record<number, StandInfo>>({});
  const [loading, setLoading] = useState(true);
  const [hoveredStand, setHoveredStand] = useState<number | null>(null);
  const [selectedStand, setSelectedStand] = useState<number | null>(null);
  const [actionLoading, setActionLoading] = useState(false);
  const [tooltip, setTooltip] = useState<{
    x: number;
    y: number;
    text: string;
  } | null>(null);

  const fetchStands = async () => {
    try {
      const res = await fetch("/api/stands");
      const data = await res.json();
      // Mark user's own stands
      const enriched: Record<number, StandInfo> = {};
      for (const [key, info] of Object.entries(data.stands) as [
        string,
        StandInfo,
      ][]) {
        const n = parseInt(key);
        if (info.status === "reserved" && info.userId === userId) {
          enriched[n] = { ...info, status: "mine" };
          setSelectedStand(n);
        } else {
          enriched[n] = info;
        }
      }
      setStands(enriched);
    } catch {
      console.error("Failed to load stands");
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchStands();
  }, []);

  const handleStandClick = async (standNumber: number) => {
    const info = stands[standNumber];
    if (!info) return;

    // Admin mode: block/unblock
    if (isAdmin) {
      setActionLoading(true);
      const action =
        info.status === "blocked"
          ? "unblock"
          : info.status === "available"
            ? "block"
            : info.status === "reserved" || info.status === "mine"
              ? "free"
              : null;

      if (action) {
        await fetch("/api/admin/stands", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ standNumber, action }),
        });
        await fetchStands();
      }
      setActionLoading(false);
      return;
    }

    // Exhibitor mode: select available stand
    if (info.status === "available" && bookingId) {
      setActionLoading(true);
      const res = await fetch("/api/stands", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ standNumber, bookingId }),
      });
      const result = await res.json();
      if (result.ok) {
        await fetchStands();
        onStandSelected?.(standNumber);
      }
      setActionLoading(false);
    }
  };

  const handleMouseEnter = (
    standNumber: number,
    e: React.MouseEvent<SVGRectElement>,
  ) => {
    setHoveredStand(standNumber);
    const info = stands[standNumber];
    let text = `Stand ${standNumber}`;
    if (info?.status === "reserved")
      text += ` — ${info.companyName || "Réservé"}`;
    if (info?.status === "mine") text += " — Votre stand";
    if (info?.status === "blocked") text += " — Indisponible";
    if (info?.status === "available") text += " — Disponible";

    const rect = e.currentTarget.getBoundingClientRect();
    setTooltip({ x: rect.left + rect.width / 2, y: rect.top - 10, text });
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <Loader2 size={32} className="animate-spin text-dta-accent" />
      </div>
    );
  }

  const totalW = 300;
  const totalH = 480;
  const available = Object.values(stands).filter(
    (s) => s.status === "available",
  ).length;
  const reserved = Object.values(stands).filter(
    (s) => s.status === "reserved" || s.status === "mine",
  ).length;
  const blocked = Object.values(stands).filter(
    (s) => s.status === "blocked",
  ).length;

  return (
    <div className="space-y-4">
      {/* Legend */}
      <div className="flex flex-wrap items-center gap-4 text-xs">
        <div className="flex items-center gap-1.5">
          <span
            className="inline-block h-3 w-3 rounded"
            style={{ background: COLORS.available.fill }}
          />
          Disponible ({available})
        </div>
        <div className="flex items-center gap-1.5">
          <span
            className="inline-block h-3 w-3 rounded"
            style={{ background: COLORS.reserved.fill }}
          />
          R&eacute;serv&eacute; ({reserved})
        </div>
        <div className="flex items-center gap-1.5">
          <span
            className="inline-block h-3 w-3 rounded"
            style={{ background: COLORS.mine.fill }}
          />
          Votre stand
        </div>
        <div className="flex items-center gap-1.5">
          <span
            className="inline-block h-3 w-3 rounded"
            style={{ background: COLORS.blocked.fill }}
          />
          Indisponible ({blocked})
        </div>
      </div>

      {/* Floor plan SVG */}
      <div className="relative overflow-auto rounded-xl border border-dta-sand bg-white p-2">
        <svg
          viewBox={`0 0 ${totalW} ${totalH}`}
          className="mx-auto w-full max-w-md"
          style={{ minHeight: 400 }}
        >
          {/* Room outline */}
          <rect
            x={10}
            y={10}
            width={totalW - 20}
            height={totalH - 60}
            rx={4}
            fill="#fefce8"
            stroke="#ca8a04"
            strokeWidth={2}
          />

          {/* Room label */}
          <text
            x={totalW / 2}
            y={35}
            textAnchor="middle"
            fontSize={13}
            fontWeight="bold"
            fontStyle="italic"
            fill="#92400e"
          >
            Salle Emile Loffon
          </text>
          <text
            x={totalW / 2}
            y={50}
            textAnchor="middle"
            fontSize={9}
            fill="#a16207"
          >
            45 stands — Rez-de-chauss&eacute;e
          </text>

          {/* Stands */}
          {STAND_LAYOUT.map((stand) => {
            const info = stands[stand.number];
            const status = info?.status || "available";
            const isHovered = hoveredStand === stand.number;
            const colors = isHovered && status === "available"
              ? COLORS.hover
              : COLORS[status];

            return (
              <g
                key={stand.number}
                onClick={() => handleStandClick(stand.number)}
                onMouseEnter={(e) =>
                  handleMouseEnter(
                    stand.number,
                    e as unknown as React.MouseEvent<SVGRectElement>,
                  )
                }
                onMouseLeave={() => {
                  setHoveredStand(null);
                  setTooltip(null);
                }}
                style={{
                  cursor:
                    status === "available" || isAdmin
                      ? "pointer"
                      : "default",
                }}
              >
                <rect
                  x={stand.x}
                  y={stand.y}
                  width={stand.w}
                  height={stand.h}
                  rx={3}
                  fill={colors.fill}
                  stroke={colors.stroke}
                  strokeWidth={1.5}
                  opacity={isHovered ? 0.9 : 1}
                />
                <text
                  x={stand.x + stand.w / 2}
                  y={stand.y + stand.h / 2 + 1}
                  textAnchor="middle"
                  dominantBaseline="middle"
                  fontSize={11}
                  fontWeight="bold"
                  fill={colors.text}
                >
                  {stand.number}
                </text>
                {status === "blocked" && (
                  <Lock
                    x={stand.x + stand.w - 12}
                    y={stand.y + 2}
                    size={10}
                    color="#fff"
                  />
                )}
              </g>
            );
          })}

          {/* Hall area */}
          <rect
            x={10}
            y={totalH - 48}
            width={totalW - 20}
            height={38}
            rx={4}
            fill="#f5f5f4"
            stroke="#a8a29e"
            strokeWidth={1}
          />
          <text
            x={totalW / 2}
            y={totalH - 28}
            textAnchor="middle"
            fontSize={10}
            fill="#78716c"
          >
            Hall — Accueil &amp; Entr&eacute;e
          </text>

          {/* Kitchen label */}
          <rect
            x={totalW - 70}
            y={14}
            width={50}
            height={25}
            rx={3}
            fill="#e5e7eb"
            stroke="#9ca3af"
            strokeWidth={1}
          />
          <text
            x={totalW - 45}
            y={30}
            textAnchor="middle"
            fontSize={8}
            fill="#6b7280"
          >
            Cuisine
          </text>
        </svg>

        {/* Tooltip */}
        {tooltip && (
          <div
            className="pointer-events-none fixed z-50 rounded-lg bg-dta-dark px-3 py-1.5 text-xs font-medium text-white shadow-lg"
            style={{
              left: tooltip.x,
              top: tooltip.y,
              transform: "translate(-50%, -100%)",
            }}
          >
            {tooltip.text}
          </div>
        )}

        {actionLoading && (
          <div className="absolute inset-0 flex items-center justify-center bg-white/60 rounded-xl">
            <Loader2 size={24} className="animate-spin text-dta-accent" />
          </div>
        )}
      </div>

      {/* Admin instructions */}
      {isAdmin && (
        <p className="text-xs text-dta-taupe">
          Cliquez sur un stand vert pour le <strong>bloquer</strong>, gris pour
          le <strong>d&eacute;bloquer</strong>, rouge pour le{" "}
          <strong>lib&eacute;rer</strong>.
        </p>
      )}

      {/* Exhibitor instructions */}
      {!isAdmin && bookingId && (
        <p className="text-xs text-dta-taupe">
          Cliquez sur un stand <strong className="text-green-600">vert</strong>{" "}
          pour le r&eacute;server. Votre stand appara&icirc;tra en{" "}
          <strong className="text-blue-600">bleu</strong>.
        </p>
      )}
    </div>
  );
}

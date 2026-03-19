"use client";

import { useState, useEffect, useCallback } from "react";
import { Loader2 } from "lucide-react";

interface StandInfo {
  status: "available" | "reserved" | "blocked" | "mine";
  companyName?: string;
  bookingId?: string;
  userId?: string;
  reason?: string;
}

interface FloorPlanProps {
  bookingId?: string;
  userId?: string;
  isAdmin?: boolean;
  onStandSelected?: (standNumber: number) => void;
}

// Total: 57 emplacements
// Hall 1 (Accueil): 1-4
// Hall 2: 5-8
// Hall 3 (Salle Loffon): 9-53 (45 stands)
// Hall 4 (Restauration): 54-57 (4 traiteurs)
const TOTAL_STANDS = 57;

interface StandDef {
  number: number;
  x: number;
  y: number;
  w: number;
  h: number;
  label?: string;
}

// Layout dimensions
const SVG_W = 520;
const SVG_H = 620;

function buildLayout(): {
  halls: Array<{
    name: string;
    subtitle: string;
    x: number;
    y: number;
    w: number;
    h: number;
    fill: string;
    stroke: string;
    stands: StandDef[];
  }>;
} {
  const sw = 48;
  const sh = 36;
  const gap = 4;

  // ── HALL 1 — Accueil (bottom left) ──
  const hall1Stands: StandDef[] = [];
  for (let i = 0; i < 4; i++) {
    hall1Stands.push({
      number: i + 1,
      x: 20 + i * (sw + gap),
      y: 545,
      w: sw,
      h: sh,
    });
  }

  // ── HALL 2 (bottom right) ──
  const hall2Stands: StandDef[] = [];
  for (let i = 0; i < 4; i++) {
    hall2Stands.push({
      number: i + 5,
      x: 310 + i * (sw + gap),
      y: 545,
      w: sw,
      h: sh,
    });
  }

  // ── HALL 3 — Salle Emile Loffon (main room, center) ──
  // 45 stands: 5 columns x 9 rows
  const hall3Stands: StandDef[] = [];
  const h3x = 30;
  const h3y = 80;
  for (let col = 0; col < 5; col++) {
    for (let row = 0; row < 9; row++) {
      hall3Stands.push({
        number: 9 + col * 9 + row,
        x: h3x + col * (sw + gap),
        y: h3y + row * (sh + gap),
        w: sw,
        h: sh,
      });
    }
  }

  // ── HALL 4 — Espace Restauration (right side) ──
  const hall4Stands: StandDef[] = [];
  for (let i = 0; i < 4; i++) {
    hall4Stands.push({
      number: 54 + i,
      x: 350,
      y: 80 + i * (sh + gap + 20),
      w: sw + 20,
      h: sh + 16,
      label: `T${i + 1}`,
    });
  }

  return {
    halls: [
      {
        name: "Hall 3 — Salle Emile Loffon",
        subtitle: "45 stands",
        x: 15,
        y: 40,
        w: 280,
        h: 420,
        fill: "#fefce8",
        stroke: "#ca8a04",
        stands: hall3Stands,
      },
      {
        name: "Hall 4 — Restauration",
        subtitle: "4 traiteurs",
        x: 320,
        y: 40,
        w: 185,
        h: 280,
        fill: "#fef2f2",
        stroke: "#dc2626",
        stands: hall4Stands,
      },
      {
        name: "Hall 1 — Accueil",
        subtitle: "4 stands",
        x: 15,
        y: 500,
        w: 220,
        h: 100,
        fill: "#f0fdf4",
        stroke: "#16a34a",
        stands: hall1Stands,
      },
      {
        name: "Hall 2",
        subtitle: "4 stands",
        x: 280,
        y: 500,
        w: 225,
        h: 100,
        fill: "#eff6ff",
        stroke: "#2563eb",
        stands: hall2Stands,
      },
    ],
  };
}

const LAYOUT = buildLayout();

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
  const [actionLoading, setActionLoading] = useState(false);
  const [tooltipInfo, setTooltipInfo] = useState<string | null>(null);

  const fetchStands = useCallback(async () => {
    try {
      const res = await fetch("/api/stands");
      const data = await res.json();
      const enriched: Record<number, StandInfo> = {};
      for (const [key, info] of Object.entries(data.stands) as [
        string,
        StandInfo,
      ][]) {
        const n = parseInt(key);
        if (info.status === "reserved" && info.userId === userId) {
          enriched[n] = { ...info, status: "mine" };
        } else {
          enriched[n] = info;
        }
      }
      setStands(enriched);
    } catch {
      console.error("Failed to load stands");
    }
    setLoading(false);
  }, [userId]);

  useEffect(() => {
    fetchStands();
  }, [fetchStands]);

  const handleStandClick = async (standNumber: number) => {
    const info = stands[standNumber];
    if (!info) return;

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

  const getTooltip = (standNumber: number) => {
    const info = stands[standNumber];
    let text = `Stand n°${standNumber}`;
    if (info?.status === "reserved")
      text += ` — ${info.companyName || "Réservé"}`;
    if (info?.status === "mine") text += " — Votre stand";
    if (info?.status === "blocked") text += " — Indisponible";
    if (info?.status === "available") text += " — Disponible";
    return text;
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <Loader2 size={32} className="animate-spin text-dta-accent" />
      </div>
    );
  }

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

      {/* Tooltip */}
      {tooltipInfo && (
        <div className="rounded-lg bg-dta-dark px-3 py-1.5 text-xs font-medium text-white text-center">
          {tooltipInfo}
        </div>
      )}

      {/* Floor plan SVG */}
      <div className="relative overflow-auto rounded-xl border border-dta-sand bg-white p-3">
        <svg
          viewBox={`0 0 ${SVG_W} ${SVG_H}`}
          className="mx-auto w-full"
          style={{ minHeight: 450, maxWidth: 600 }}
        >
          {/* Title */}
          <text
            x={SVG_W / 2}
            y={22}
            textAnchor="middle"
            fontSize={14}
            fontWeight="bold"
            fontStyle="italic"
            fill="#1a1a1a"
          >
            Rez-de-chauss&eacute;e — Espace MAS
          </text>

          {/* Halls */}
          {LAYOUT.halls.map((hall) => (
            <g key={hall.name}>
              {/* Hall background */}
              <rect
                x={hall.x}
                y={hall.y}
                width={hall.w}
                height={hall.h}
                rx={6}
                fill={hall.fill}
                stroke={hall.stroke}
                strokeWidth={2}
              />
              {/* Hall label */}
              <text
                x={hall.x + hall.w / 2}
                y={hall.y + 18}
                textAnchor="middle"
                fontSize={10}
                fontWeight="bold"
                fill={hall.stroke}
              >
                {hall.name}
              </text>
              <text
                x={hall.x + hall.w / 2}
                y={hall.y + 30}
                textAnchor="middle"
                fontSize={8}
                fill={hall.stroke}
                opacity={0.7}
              >
                {hall.subtitle}
              </text>

              {/* Stands */}
              {hall.stands.map((stand) => {
                const info = stands[stand.number];
                const status = info?.status || "available";
                const isHovered = hoveredStand === stand.number;
                const colors =
                  isHovered && status === "available"
                    ? COLORS.hover
                    : COLORS[status];

                return (
                  <g
                    key={stand.number}
                    onClick={() => handleStandClick(stand.number)}
                    onMouseEnter={() => {
                      setHoveredStand(stand.number);
                      setTooltipInfo(getTooltip(stand.number));
                    }}
                    onMouseLeave={() => {
                      setHoveredStand(null);
                      setTooltipInfo(null);
                    }}
                    onTouchStart={() => {
                      setTooltipInfo(getTooltip(stand.number));
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
                      rx={4}
                      fill={colors.fill}
                      stroke={colors.stroke}
                      strokeWidth={1.5}
                      opacity={isHovered ? 0.85 : 1}
                    />
                    <text
                      x={stand.x + stand.w / 2}
                      y={stand.y + stand.h / 2 + 1}
                      textAnchor="middle"
                      dominantBaseline="middle"
                      fontSize={stand.label ? 10 : 11}
                      fontWeight="bold"
                      fill={colors.text}
                    >
                      {stand.label || stand.number}
                    </text>
                  </g>
                );
              })}
            </g>
          ))}

          {/* Connecting corridor between halls */}
          <rect
            x={15}
            y={465}
            width={490}
            height={30}
            rx={4}
            fill="#f5f5f4"
            stroke="#d6d3d1"
            strokeWidth={1}
            strokeDasharray="4 2"
          />
          <text
            x={SVG_W / 2}
            y={484}
            textAnchor="middle"
            fontSize={9}
            fill="#a8a29e"
          >
            Couloir &amp; circulation
          </text>

          {/* Kitchen area */}
          <rect
            x={320}
            y={340}
            width={185}
            height={50}
            rx={4}
            fill="#e5e7eb"
            stroke="#9ca3af"
            strokeWidth={1}
          />
          <text
            x={412}
            y={370}
            textAnchor="middle"
            fontSize={10}
            fill="#6b7280"
          >
            Cuisine
          </text>

          {/* Entrance arrow */}
          <text
            x={SVG_W / 2}
            y={SVG_H - 4}
            textAnchor="middle"
            fontSize={10}
            fill="#78716c"
          >
            &uarr; ENTR&Eacute;E PRINCIPALE &uarr;
          </text>
        </svg>

        {actionLoading && (
          <div className="absolute inset-0 flex items-center justify-center rounded-xl bg-white/60">
            <Loader2 size={24} className="animate-spin text-dta-accent" />
          </div>
        )}
      </div>

      {/* Instructions */}
      {isAdmin ? (
        <p className="text-xs text-dta-taupe">
          <strong>Admin :</strong> Cliquez sur un stand{" "}
          <strong className="text-green-600">vert</strong> pour le bloquer,{" "}
          <strong className="text-gray-500">gris</strong> pour le d&eacute;bloquer,{" "}
          <strong className="text-red-600">rouge</strong> pour le lib&eacute;rer.
        </p>
      ) : bookingId ? (
        <p className="text-xs text-dta-taupe">
          Cliquez sur un stand{" "}
          <strong className="text-green-600">vert</strong> pour le
          r&eacute;server. Votre stand appara&icirc;tra en{" "}
          <strong className="text-blue-600">bleu</strong>.
        </p>
      ) : null}
    </div>
  );
}

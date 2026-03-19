"use client";

import { useState, useEffect, useCallback, useRef } from "react";
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
const TOTAL_STANDS = 60; // 48 salle + 4 hall1 + 4 hall2 + 4 traiteurs

interface StandDef {
  number: number;
  x: number;
  y: number;
  w: number;
  h: number;
  label?: string;
}

// Layout dimensions
const SVG_W = 680;
const SVG_H = 750;
const STAND_W = 44;
const STAND_H = 34;
const STAND_GAP = 3;
const CORRIDOR_W = 26;

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
  const sw = 44;
  const sh = 34;
  const gap = 3;

  // Pré-calcul des positions bas de page
  const preHall3H = (140 - 40) + 8 * (sh + gap) + 30;
  const preBottomY = 40 + preHall3H + 15 + 35;

  // ── HALL 2 (bottom left — inversé) ──
  const hall2Stands: StandDef[] = [];
  for (let i = 0; i < 4; i++) {
    hall2Stands.push({
      number: i + 5,
      x: 25 + i * (sw + gap),
      y: preBottomY + 40,
      w: sw,
      h: sh,
    });
  }

  // ── HALL 1 — Accueil (bottom right — inversé) ──
  const hall1Stands: StandDef[] = [];
  for (let i = 0; i < 4; i++) {
    hall1Stands.push({
      number: i + 1,
      x: 310 + i * (sw + gap),
      y: preBottomY + 40,
      w: sw,
      h: sh,
    });
  }

  // ── HALL 3 — Salle Emile Loffon ──
  // 6 rangées de 8 = 48 stands
  // Rangée A (mur gauche): stands 9-16 → dos au mur
  // Rangée B: stands 17-24 → dos à dos avec C
  // Rangée C: stands 25-32 → dos à dos avec B
  // Rangée D: stands 33-40 → dos à dos avec E
  // Rangée E: stands 41-48 → dos à dos avec D
  // Rangée F (mur droit): stands 49-56 → dos au mur
  const hall3Stands: StandDef[] = [];
  const h3baseY = 140; // décalé pour scène + chaises masterclass
  const corridorW = 24; // couloir de circulation
  const rowCount = 8;

  // Rangée A — Mur gauche (stands 9-16) → dos au mur
  const colAx = 18;
  for (let i = 0; i < rowCount; i++) {
    hall3Stands.push({ number: 9 + i, x: colAx, y: h3baseY + i * (sh + gap), w: sw, h: sh });
  }

  // Rangée B (stands 17-24) → dos à dos avec C
  const colBx = colAx + sw + corridorW;
  for (let i = 0; i < rowCount; i++) {
    hall3Stands.push({ number: 17 + i, x: colBx, y: h3baseY + i * (sh + gap), w: sw, h: sh });
  }

  // Rangée C (stands 25-32) → dos à dos avec B
  const colCx = colBx + sw + gap;
  for (let i = 0; i < rowCount; i++) {
    hall3Stands.push({ number: 25 + i, x: colCx, y: h3baseY + i * (sh + gap), w: sw, h: sh });
  }

  // Rangée D (stands 33-40) → dos à dos avec E
  const colDx = colCx + sw + corridorW;
  for (let i = 0; i < rowCount; i++) {
    hall3Stands.push({ number: 33 + i, x: colDx, y: h3baseY + i * (sh + gap), w: sw, h: sh });
  }

  // Rangée E (stands 41-48) → dos à dos avec D
  const colEx = colDx + sw + gap;
  for (let i = 0; i < rowCount; i++) {
    hall3Stands.push({ number: 41 + i, x: colEx, y: h3baseY + i * (sh + gap), w: sw, h: sh });
  }

  // Rangée F — Mur droit (stands 49-56) → dos au mur
  const colFx = colEx + sw + corridorW;
  for (let i = 0; i < rowCount; i++) {
    hall3Stands.push({ number: 49 + i, x: colFx, y: h3baseY + i * (sh + gap), w: sw, h: sh });
  }

  const hall3W = colFx + sw - colAx + 20;

  // Calcul de la hauteur de la salle Loffon
  const hall3H = h3baseY - 40 + 8 * (sh + gap) + 30;
  const hall3Right = hall3W + 12 + 12; // bord droit de la salle

  // ── Cuisine (à droite en haut) ──
  const cuisineX = hall3Right + 5;
  const cuisineW = 110;
  const cuisineH = 80;

  // ── HALL 4 — Espace Restauration (à droite, sous la cuisine) ──
  const hall4Stands: StandDef[] = [];
  const hall4Y = 40 + cuisineH + 10;
  for (let i = 0; i < 4; i++) {
    hall4Stands.push({
      number: 57 + i,
      x: cuisineX + 15,
      y: hall4Y + 40 + i * (sh + gap + 20),
      w: cuisineW - 30,
      h: sh + 14,
      label: `T${i + 1}`,
    });
  }

  // Positions bas de page
  const bottomSectionY = 40 + hall3H + 15;
  const corridorY = bottomSectionY;
  const bottomHallY = corridorY + 35;

  return {
    halls: [
      {
        name: "Hall 3 — Salle Emile Loffon",
        subtitle: "48 stands",
        x: 12,
        y: 40,
        w: hall3W + 12,
        h: hall3H,
        fill: "#fefce8",
        stroke: "#ca8a04",
        stands: hall3Stands,
      },
      {
        name: "Cuisine",
        subtitle: "",
        x: cuisineX,
        y: 40,
        w: cuisineW,
        h: cuisineH,
        fill: "#e5e7eb",
        stroke: "#9ca3af",
        stands: [],
      },
      {
        name: "Espace",
        subtitle: "Restauration",
        x: cuisineX,
        y: 40 + cuisineH + 5,
        w: cuisineW,
        h: hall3H - cuisineH - 5,
        fill: "#f5f0ff",
        stroke: "#7c3aed",
        stands: hall4Stands,
      },
      {
        name: "Hall 2",
        subtitle: "4 stands",
        x: 12,
        y: bottomHallY,
        w: 210,
        h: 100,
        fill: "#eff6ff",
        stroke: "#2563eb",
        stands: hall2Stands,
      },
      {
        name: "Hall 1 — Accueil",
        subtitle: "4 stands",
        x: 280,
        y: bottomHallY,
        w: 225,
        h: 100,
        fill: "#f0fdf4",
        stroke: "#16a34a",
        stands: hall1Stands,
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
  const clickLockRef = useRef(false); // prevent double-clicks
  const hoverTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const fetchStands = useCallback(async () => {
    try {
      const res = await fetch("/api/stands");
      if (!res.ok) {
        setLoading(false);
        return;
      }
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
    return () => {
      if (hoverTimeoutRef.current) clearTimeout(hoverTimeoutRef.current);
    };
  }, [fetchStands]);

  const handleStandClick = async (standNumber: number) => {
    if (clickLockRef.current || actionLoading) return; // prevent double-click
    const info = stands[standNumber];
    if (!info) return;

    clickLockRef.current = true;
    setActionLoading(true);

    try {
      if (isAdmin) {
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
      } else if (info.status === "available" && bookingId) {
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
      }
    } finally {
      setActionLoading(false);
      clickLockRef.current = false;
    }
  };

  // Debounced hover to prevent tooltip flickering
  const handleHover = (standNumber: number | null) => {
    if (hoverTimeoutRef.current) clearTimeout(hoverTimeoutRef.current);
    if (standNumber === null) {
      hoverTimeoutRef.current = setTimeout(() => {
        setHoveredStand(null);
        setTooltipInfo(null);
      }, 50);
    } else {
      setHoveredStand(standNumber);
      const info = stands[standNumber];
      let text = `Stand n°${standNumber}`;
      if (info?.status === "reserved") text += ` — ${info.companyName || "Réservé"}`;
      if (info?.status === "mine") text += " — Votre stand";
      if (info?.status === "blocked") text += " — Indisponible";
      if (info?.status === "available") text += " — Disponible";
      setTooltipInfo(text);
    }
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

      {/* Floor plan SVG */}
      <div className="relative overflow-auto rounded-xl border border-dta-sand bg-white p-3">
        {/* Tooltip — position absolute pour ne pas décaler le layout */}
        <div
          className={`pointer-events-none absolute left-1/2 top-2 z-10 -translate-x-1/2 rounded-lg bg-dta-dark px-3 py-1.5 text-xs font-medium text-white text-center transition-opacity duration-150 ${tooltipInfo ? "opacity-100" : "opacity-0"}`}
        >
          {tooltipInfo || "\u00A0"}
        </div>
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
                    onMouseEnter={() => handleHover(stand.number)}
                    onMouseLeave={() => handleHover(null)}
                    onTouchStart={() => handleHover(stand.number)}
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

          {/* Couloirs de circulation dans Hall 3 */}
          {(() => {
            const hallStands = LAYOUT.halls[0].stands;
            const sA = hallStands.find(s => s.number === 9);
            const sB = hallStands.find(s => s.number === 17);
            const sC = hallStands.find(s => s.number === 25);
            const sD = hallStands.find(s => s.number === 33);
            const sE = hallStands.find(s => s.number === 41);
            const sF = hallStands.find(s => s.number === 49);
            if (!sA || !sB || !sC || !sD || !sE || !sF) return null;
            const rowH = 8 * (STAND_H + STAND_GAP) - STAND_GAP;
            const topY = sA.y - 2;
            const cColor = "#fff9db";
            const cStroke = "#fbbf24";
            const dosColor = "#d97706";
            return (
              <>
                {/* Couloir A-B */}
                <rect x={sA.x + STAND_W + 2} y={topY} width={CORRIDOR_W - 4} height={rowH} rx={2} fill={cColor} stroke={cStroke} strokeWidth={0.5} strokeDasharray="3 2" opacity={0.5} />
                {/* Dos à dos B-C */}
                <line x1={sB.x + STAND_W + 1} y1={topY + 4} x2={sB.x + STAND_W + 1} y2={topY + rowH} stroke={dosColor} strokeWidth={1.5} strokeDasharray="4 3" />
                {/* Couloir C-D */}
                <rect x={sC.x + STAND_W + 2} y={topY} width={CORRIDOR_W - 4} height={rowH} rx={2} fill={cColor} stroke={cStroke} strokeWidth={0.5} strokeDasharray="3 2" opacity={0.5} />
                {/* Dos à dos D-E */}
                <line x1={sD.x + STAND_W + 1} y1={topY + 4} x2={sD.x + STAND_W + 1} y2={topY + rowH} stroke={dosColor} strokeWidth={1.5} strokeDasharray="4 3" />
                {/* Couloir E-F */}
                <rect x={sE.x + STAND_W + 2} y={topY} width={CORRIDOR_W - 4} height={rowH} rx={2} fill={cColor} stroke={cStroke} strokeWidth={0.5} strokeDasharray="3 2" opacity={0.5} />
                {/* Annotations murs */}
                <text x={sA.x} y={topY + rowH + 14} fontSize={7} fill="#92400e" opacity={0.6}>Mur &larr;</text>
                <text x={sF.x + STAND_W} y={topY + rowH + 14} fontSize={7} fill="#92400e" opacity={0.6} textAnchor="end">&rarr; Mur</text>
              </>
            );
          })()}

          {/* Connecting corridor between halls */}
          {(() => {
            const hall3 = LAYOUT.halls[0];
            const corrY = hall3.y + hall3.h + 5;
            return (
              <>
                <rect
                  x={12}
                  y={corrY}
                  width={hall3.w}
                  height={28}
                  rx={4}
                  fill="#f5f5f4"
                  stroke="#d6d3d1"
                  strokeWidth={1}
                  strokeDasharray="4 2"
                />
                <text
                  x={12 + hall3.w / 2}
                  y={corrY + 18}
                  textAnchor="middle"
                  fontSize={9}
                  fill="#a8a29e"
                >
                  Couloir &amp; circulation
                </text>
              </>
            );
          })()}

          {/* Scène au fond de la salle (haut du Hall 3) */}
          {(() => {
            const hall3 = LAYOUT.halls[0];
            return (
              <>
                <rect
                  x={hall3.x + 10}
                  y={hall3.y + 2}
                  width={hall3.w - 20}
                  height={28}
                  rx={4}
                  fill="#7c3aed"
                  stroke="#6d28d9"
                  strokeWidth={1.5}
                />
                <text
                  x={hall3.x + hall3.w / 2}
                  y={hall3.y + 20}
                  textAnchor="middle"
                  fontSize={11}
                  fontWeight="bold"
                  fill="#fff"
                  letterSpacing={2}
                >
                  SCENE
                </text>
                {/* 4 lignes de chaises pour masterclass */}
                {[0, 1, 2, 3].map((row) => {
                  const chairY = hall3.y + 36 + row * 12;
                  const chairCount = 12;
                  const chairW = 8;
                  const chairGap = 4;
                  const totalChairsW = chairCount * (chairW + chairGap) - chairGap;
                  const chairStartX = hall3.x + (hall3.w - totalChairsW) / 2;
                  return (
                    <g key={row}>
                      {Array.from({ length: chairCount }, (_, i) => (
                        <rect
                          key={i}
                          x={chairStartX + i * (chairW + chairGap)}
                          y={chairY}
                          width={chairW}
                          height={8}
                          rx={2}
                          fill="#ddd6fe"
                          stroke="#a78bfa"
                          strokeWidth={0.5}
                        />
                      ))}
                    </g>
                  );
                })}
                <text
                  x={hall3.x + hall3.w / 2}
                  y={hall3.y + 92}
                  textAnchor="middle"
                  fontSize={7}
                  fill="#7c3aed"
                  opacity={0.6}
                >
                  Masterclass — 48 places assises
                </text>
              </>
            );
          })()}

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

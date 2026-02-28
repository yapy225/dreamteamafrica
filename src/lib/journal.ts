// ─── L'AFROPÉEN — Journal Lifecycle Utilities ───────────

export type JournalZone =
  | "UNE"
  | "FACE_UNE"
  | "PAGES_4_5"
  | "PAGES_6_7"
  | "PAGES_8_9"
  | "PAGES_10_11"
  | "PAGES_12_13"
  | "ARCHIVES";

export const LIFECYCLE_RULES: Array<{
  maxDay: number;
  zone: JournalZone;
  label: string;
  shortLabel: string;
}> = [
  { maxDay: 3, zone: "UNE", label: "À la Une", shortLabel: "Une" },
  { maxDay: 6, zone: "FACE_UNE", label: "Face Une", shortLabel: "Face" },
  { maxDay: 8, zone: "PAGES_4_5", label: "Pages 4–5", shortLabel: "P.4-5" },
  { maxDay: 10, zone: "PAGES_6_7", label: "Pages 6–7", shortLabel: "P.6-7" },
  { maxDay: 12, zone: "PAGES_8_9", label: "Pages 8–9", shortLabel: "P.8-9" },
  { maxDay: 16, zone: "PAGES_10_11", label: "Pages 10–11", shortLabel: "P.10-11" },
  { maxDay: 21, zone: "PAGES_12_13", label: "Pages 12–13", shortLabel: "P.12-13" },
];

/** Compute lifecycle day from publishedAt date (J1 = day of publication) */
export function getLifecycleDay(publishedAt: Date): number {
  const now = new Date();
  const diffMs = now.getTime() - new Date(publishedAt).getTime();
  return Math.max(1, Math.ceil(diffMs / (1000 * 60 * 60 * 24)));
}

/** Get zone for a given lifecycle day */
export function getZoneForDay(day: number): JournalZone {
  for (const rule of LIFECYCLE_RULES) {
    if (day <= rule.maxDay) return rule.zone;
  }
  return "ARCHIVES";
}

/** Get label for a zone */
export function getZoneLabel(zone: JournalZone): string {
  if (zone === "ARCHIVES") return "Archives";
  const rule = LIFECYCLE_RULES.find((r) => r.zone === zone);
  return rule?.label ?? "Archives";
}

/** Compute reading time from word count (200 wpm) */
export function computeReadingTime(content: string): number {
  const wordCount = content.split(/\s+/).filter(Boolean).length;
  return Math.max(1, Math.ceil(wordCount / 200));
}

/** Gradient CSS class map (g1–g12) */
export const GRADIENT_MAP: Record<string, string> = {
  g1: "linear-gradient(145deg, #C4B5A4, #A69888)",
  g2: "linear-gradient(145deg, #8B7D6B, #6E6155)",
  g3: "linear-gradient(145deg, #6B8FA0, #4A6B7A)",
  g4: "linear-gradient(145deg, #A08060, #846A4E)",
  g5: "linear-gradient(145deg, #8B6F4E, #A68B6B)",
  g6: "linear-gradient(145deg, #7A8B7A, #687968)",
  g7: "linear-gradient(145deg, #9B8574, #897362)",
  g8: "linear-gradient(145deg, #6B7C8A, #5A6B78)",
  g9: "linear-gradient(145deg, #B89F7E, #A88F6E)",
  g10: "linear-gradient(145deg, #7A6B5A, #6B5C4B)",
  g11: "linear-gradient(145deg, #5A7A6A, #4A6A5A)",
  g12: "linear-gradient(145deg, #8A7A6A, #7A6A5A)",
};

/** Pick a gradient class cyclically from article index */
export function pickGradient(index: number): string {
  const keys = Object.keys(GRADIENT_MAP);
  return keys[index % keys.length];
}

/** Category display config */
export const CATEGORY_CONFIG: Record<
  string,
  { label: string; badge: string; badgeHero: string }
> = {
  ACTUALITE: {
    label: "Actualités",
    badge: "bg-blue-100 text-blue-700",
    badgeHero: "bg-blue-500/20 text-blue-200 backdrop-blur-sm",
  },
  CULTURE: {
    label: "Culture",
    badge: "bg-purple-100 text-purple-700",
    badgeHero: "bg-purple-500/20 text-purple-200 backdrop-blur-sm",
  },
  DIASPORA: {
    label: "Diaspora",
    badge: "bg-green-100 text-green-700",
    badgeHero: "bg-green-500/20 text-green-200 backdrop-blur-sm",
  },
  BUSINESS: {
    label: "Business",
    badge: "bg-amber-100 text-amber-700",
    badgeHero: "bg-amber-500/20 text-amber-200 backdrop-blur-sm",
  },
  LIFESTYLE: {
    label: "Lifestyle",
    badge: "bg-pink-100 text-pink-700",
    badgeHero: "bg-pink-500/20 text-pink-200 backdrop-blur-sm",
  },
  OPINION: {
    label: "Opinion",
    badge: "bg-red-100 text-red-700",
    badgeHero: "bg-red-500/20 text-red-200 backdrop-blur-sm",
  },
};

/** Compute campaign progress for ads */
export function campaignProgress(
  start: string | Date,
  weeks: number
): { current: number; total: number; label: string; percent: number } {
  const startDate = new Date(start);
  const now = new Date();
  const diffMs = now.getTime() - startDate.getTime();
  const currentWeek = Math.max(1, Math.ceil(diffMs / (1000 * 60 * 60 * 24 * 7)));
  const clamped = Math.min(currentWeek, weeks);
  return {
    current: clamped,
    total: weeks,
    label: `S${clamped}/${weeks}`,
    percent: Math.round((clamped / weeks) * 100),
  };
}

/** Group published articles by computed lifecycle zone */
export function groupArticlesByZone<
  T extends { publishedAt: Date; isSponsored: boolean },
>(articles: T[]): Record<JournalZone, T[]> {
  const groups: Record<JournalZone, T[]> = {
    UNE: [],
    FACE_UNE: [],
    PAGES_4_5: [],
    PAGES_6_7: [],
    PAGES_8_9: [],
    PAGES_10_11: [],
    PAGES_12_13: [],
    ARCHIVES: [],
  };

  for (const article of articles) {
    const day = getLifecycleDay(article.publishedAt);
    const zone = getZoneForDay(day);
    groups[zone].push(article);
  }

  // Sponsored articles first within each zone, then by date desc
  for (const zone of Object.keys(groups) as JournalZone[]) {
    groups[zone].sort((a, b) => {
      if (a.isSponsored && !b.isSponsored) return -1;
      if (!a.isSponsored && b.isSponsored) return 1;
      return new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime();
    });
  }

  return groups;
}

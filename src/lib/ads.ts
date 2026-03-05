import { prisma } from "@/lib/db";
import type { AdPage, AdPlacement, AdPlan } from "@prisma/client";

/** Priority multiplier per plan — ELITE gets 3× more impressions */
const PLAN_WEIGHT: Record<AdPlan, number> = {
  ELITE: 3,
  BUSINESS: 1,
  ESSENTIEL: 1,
};

/** Plan priority order for sorting (highest first) */
const PLAN_PRIORITY: Record<AdPlan, number> = {
  ELITE: 3,
  BUSINESS: 2,
  ESSENTIEL: 1,
};

/** Which placements are premium-only (ELITE) */
const PREMIUM_PLACEMENTS: AdPlacement[] = ["HERO", "INTERSTITIAL"];

export interface ServedAd {
  id: string;
  title: string;
  supportType: string;
  mediaFormat: string;
  plan: string;
  content: string;
  imageUrl: string | null;
  videoUrl: string | null;
  targetUrl: string;
  ctaText: string | null;
  advertiserName: string | null;
}

/**
 * Serve ads for a given page + placement.
 * - Filters by active, date range, matching page & placement
 * - Sorts by plan priority (ELITE first)
 * - Applies weighted rotation for fairness
 */
export async function serveAds(
  page: AdPage,
  placement: AdPlacement,
  limit = 3
): Promise<ServedAd[]> {
  const now = new Date();

  const campaigns = await prisma.adCampaign.findMany({
    where: {
      active: true,
      pages: { has: page },
      placements: { has: placement },
      startDate: { lte: now },
      OR: [{ endDate: null }, { endDate: { gte: now } }],
    },
    select: {
      id: true,
      title: true,
      supportType: true,
      mediaFormat: true,
      plan: true,
      content: true,
      imageUrl: true,
      videoUrl: true,
      targetUrl: true,
      ctaText: true,
      advertiserName: true,
    },
    orderBy: { createdAt: "desc" },
  });

  // Filter premium placements
  const filtered = PREMIUM_PLACEMENTS.includes(placement)
    ? campaigns.filter((c) => c.plan === "ELITE")
    : campaigns;

  // Weighted shuffle: each campaign gets weight based on plan
  const weighted = filtered.map((c) => ({
    ...c,
    weight: PLAN_WEIGHT[c.plan] * (1 + Math.random()),
    priority: PLAN_PRIORITY[c.plan],
  }));

  // Sort by priority desc, then by weight desc
  weighted.sort((a, b) => b.priority - a.priority || b.weight - a.weight);

  return weighted.slice(0, limit).map(({ weight: _w, priority: _p, ...ad }) => ad);
}

/**
 * Track an impression or click for a campaign
 */
export async function trackAd(campaignId: string, type: "impression" | "click") {
  await prisma.adCampaign.update({
    where: { id: campaignId },
    data:
      type === "impression"
        ? { impressions: { increment: 1 } }
        : { clicks: { increment: 1 } },
  });
}

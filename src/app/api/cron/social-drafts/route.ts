import { verifyCronAuth } from "@/lib/cron-auth";
import { NextResponse } from "next/server";

/**
 * CRON: Social Drafts — runs every day at 10 AM
 * Generates promotional drafts for L'Officiel d'Afrique + publishes approved drafts.
 */

export const maxDuration = 60;

export async function GET(request: Request) {
  const authError = verifyCronAuth(request);
  if (authError) return authError;

  try {
    const { generateOfficielPromoDrafts, publishApprovedDraft } = await import(
      "@/lib/social-drafts"
    );
    const { prisma } = await import("@/lib/db");

    // 1. Generate new Officiel promo drafts
    const generated = await generateOfficielPromoDrafts();

    // 2. Auto-publish any APPROVED drafts that are past their scheduledFor
    const approvedDrafts = await prisma.socialDraft.findMany({
      where: {
        status: "APPROVED",
        OR: [
          { scheduledFor: null },
          { scheduledFor: { lte: new Date() } },
        ],
      },
      take: 5,
    });

    let published = 0;
    let failed = 0;
    for (const draft of approvedDrafts) {
      try {
        await publishApprovedDraft(draft.id);
        published++;
      } catch {
        failed++;
      }
    }

    const result = {
      generated,
      published,
      failed,
      timestamp: new Date().toISOString(),
    };

    console.log("[CRON social-drafts]", result);
    return NextResponse.json(result);
  } catch (error: any) {
    console.error("[CRON social-drafts ERROR]", error);
    return NextResponse.json({ error: "Internal error" }, { status: 500 });
  }
}

import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/db";

/**
 * POST /api/admin/exhibitor-publications
 * Create or update a publication entry for an exhibitor profile on a given platform.
 * Body: { profileId, platform, status, postUrl? }
 */
export async function POST(request: NextRequest) {
  const session = await auth();
  if (!session || session.user.role !== "ADMIN") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { profileId, platform, status, postUrl } = await request.json();

  if (!profileId || !platform) {
    return NextResponse.json(
      { error: "profileId and platform are required" },
      { status: 400 },
    );
  }

  const validStatuses = ["PENDING", "SCHEDULED", "POSTED"];
  if (status && !validStatuses.includes(status)) {
    return NextResponse.json(
      { error: `status must be one of: ${validStatuses.join(", ")}` },
      { status: 400 },
    );
  }

  const pub = await prisma.exhibitorPublication.upsert({
    where: { profileId_platform: { profileId, platform } },
    create: {
      profileId,
      platform,
      status: status || "PENDING",
      postUrl: postUrl || null,
      ...(status === "POSTED" ? { postedAt: new Date() } : {}),
    },
    update: {
      status: status || undefined,
      postUrl: postUrl !== undefined ? postUrl : undefined,
      ...(status === "POSTED" ? { postedAt: new Date() } : {}),
    },
  });

  return NextResponse.json({ success: true, publication: pub });
}

/**
 * GET /api/admin/exhibitor-publications?profileId=xxx
 * Get all publications for a profile.
 */
export async function GET(request: NextRequest) {
  const session = await auth();
  if (!session || session.user.role !== "ADMIN") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const profileId = request.nextUrl.searchParams.get("profileId");

  const where = profileId ? { profileId } : {};
  const pubs = await prisma.exhibitorPublication.findMany({
    where,
    include: { profile: { select: { companyName: true, id: true } } },
    orderBy: { createdAt: "desc" },
  });

  return NextResponse.json(pubs);
}

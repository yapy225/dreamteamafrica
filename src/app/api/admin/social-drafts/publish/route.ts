import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";

export async function POST(request: NextRequest) {
  const session = await auth();
  if (!session?.user?.id || session.user.role !== "ADMIN") {
    return NextResponse.json({ error: "Non autorisé" }, { status: 403 });
  }

  const { draftId } = await request.json();

  if (!draftId) {
    return NextResponse.json(
      { error: "draftId is required" },
      { status: 400 }
    );
  }

  try {
    const { publishApprovedDraft } = await import("@/lib/social-drafts");
    const result = await publishApprovedDraft(draftId);
    return NextResponse.json(result);
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Publication failed";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

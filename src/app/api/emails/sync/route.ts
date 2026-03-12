import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { syncEmails } from "@/lib/imap-sync";

export const dynamic = "force-dynamic";
export const maxDuration = 60;
export const runtime = "nodejs";

/** POST — Trigger IMAP sync */
export async function POST() {
  const session = await auth();
  if (!session || session.user.role !== "ADMIN") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  // Check env vars
  if (!process.env.IMAP_USER || !process.env.IMAP_PASS) {
    return NextResponse.json(
      { error: "IMAP credentials not configured" },
      { status: 500 }
    );
  }

  try {
    const result = await syncEmails("INBOX", 100);
    return NextResponse.json(result);
  } catch (err: any) {
    console.error("Email sync error:", err?.message, err?.stack);
    return NextResponse.json(
      { error: err?.message || "Sync failed", detail: String(err) },
      { status: 500 }
    );
  }
}

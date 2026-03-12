import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { syncEmails } from "@/lib/imap-sync";

export const dynamic = "force-dynamic";
export const maxDuration = 60;

/** POST — Trigger IMAP sync */
export async function POST() {
  const session = await auth();
  if (!session || session.user.role !== "ADMIN") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const result = await syncEmails("INBOX", 200);
    return NextResponse.json(result);
  } catch (err: any) {
    console.error("Email sync error:", err);
    return NextResponse.json(
      { error: err.message || "Sync failed" },
      { status: 500 }
    );
  }
}

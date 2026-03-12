import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/db";

export const dynamic = "force-dynamic";

/** POST — Return sync status (IMAP sync runs locally via script) */
export async function POST() {
  const session = await auth();
  if (!session || session.user.role !== "ADMIN") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const [total, unread, lastSync] = await Promise.all([
    prisma.email.count({ where: { folder: "INBOX" } }),
    prisma.email.count({ where: { folder: "INBOX", isRead: false, isArchived: false } }),
    prisma.emailSyncState.findUnique({ where: { folder: "INBOX" } }),
  ]);

  return NextResponse.json({
    synced: 0,
    total,
    unread,
    lastSync: lastSync?.lastSyncAt || null,
    message: "Sync locale uniquement. Lancez: npx tsx scripts/sync-emails.ts",
  });
}

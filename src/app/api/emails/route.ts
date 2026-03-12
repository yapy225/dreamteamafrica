import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/db";

export const dynamic = "force-dynamic";

/** GET — List emails (inbox or archived) */
export async function GET(request: Request) {
  const session = await auth();
  if (!session || session.user.role !== "ADMIN") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const url = new URL(request.url);
  const archived = url.searchParams.get("archived") === "true";
  const page = Math.max(1, Number(url.searchParams.get("page")) || 1);
  const limit = Math.min(100, Math.max(1, Number(url.searchParams.get("limit")) || 30));
  const search = url.searchParams.get("search") || "";

  const where: any = {
    isArchived: archived,
    folder: { in: ["INBOX", "Sent"] },
  };

  if (search) {
    where.OR = [
      { subject: { contains: search, mode: "insensitive" } },
      { fromName: { contains: search, mode: "insensitive" } },
      { fromEmail: { contains: search, mode: "insensitive" } },
      { snippet: { contains: search, mode: "insensitive" } },
    ];
  }

  const [emails, total, unreadCount] = await Promise.all([
    prisma.email.findMany({
      where,
      select: {
        id: true,
        messageId: true,
        fromName: true,
        fromEmail: true,
        subject: true,
        snippet: true,
        isRead: true,
        isStarred: true,
        isArchived: true,
        hasAttachments: true,
        receivedAt: true,
        folder: true,
      },
      orderBy: { receivedAt: "desc" },
      skip: (page - 1) * limit,
      take: limit,
    }),
    prisma.email.count({ where }),
    prisma.email.count({
      where: { isArchived: false, isRead: false, folder: "INBOX" },
    }),
  ]);

  return NextResponse.json({
    emails,
    total,
    page,
    totalPages: Math.ceil(total / limit),
    unreadCount,
  });
}

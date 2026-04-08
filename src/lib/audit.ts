import { prisma } from "@/lib/db";

/**
 * Log an auditable action. Non-blocking — never throws.
 */
export async function audit(params: {
  userId?: string | null;
  userEmail?: string | null;
  action: string;
  target?: string | null;
  details?: Record<string, unknown> | null;
  ip?: string | null;
}): Promise<void> {
  try {
    await prisma.auditLog.create({
      data: {
        userId: params.userId || null,
        userEmail: params.userEmail || null,
        action: params.action,
        target: params.target || null,
        details: params.details ? JSON.parse(JSON.stringify(params.details)) : undefined,
        ip: params.ip || null,
      },
    });
  } catch (err) {
    // Never block the main flow — just log the error
    console.error("[AUDIT] Failed to write audit log:", err);
  }
}

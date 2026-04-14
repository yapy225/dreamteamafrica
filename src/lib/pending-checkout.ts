import { prisma } from "@/lib/db";

/**
 * Distributed lock against duplicate checkouts:
 * creates a PendingCheckout row BEFORE calling Stripe.
 * Unique (email, eventId, tier) prevents concurrent serverless instances
 * from opening two Stripe sessions for the same triplet.
 */

const LOCK_TTL_MS = 3 * 60 * 1000; // 3 min — couvre un checkout Stripe normal sans pénaliser les abandons

export class DuplicateCheckoutError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "DuplicateCheckoutError";
  }
}

export async function acquireCheckoutLock(params: {
  email: string;
  eventId: string;
  tier: string;
}): Promise<{ id: string }> {
  const { email, eventId, tier } = params;
  const now = new Date();
  const expiresAt = new Date(now.getTime() + LOCK_TTL_MS);

  await prisma.pendingCheckout.deleteMany({
    where: { email, eventId, tier, expiresAt: { lt: now } },
  });

  try {
    const row = await prisma.pendingCheckout.create({
      data: { email, eventId, tier, expiresAt },
    });
    return { id: row.id };
  } catch (e: unknown) {
    const err = e as { code?: string };
    if (err.code === "P2002") {
      throw new DuplicateCheckoutError(
        "Un paiement est déjà en cours pour ce billet. Patientez quelques minutes ou vérifiez votre email.",
      );
    }
    throw e;
  }
}

export async function attachSessionToLock(lockId: string, stripeSessionId: string) {
  await prisma.pendingCheckout.update({
    where: { id: lockId },
    data: { stripeSessionId },
  });
}

export async function releaseCheckoutLock(lockId: string) {
  await prisma.pendingCheckout.deleteMany({ where: { id: lockId } });
}

export async function releaseLockBySession(stripeSessionId: string) {
  await prisma.pendingCheckout.deleteMany({ where: { stripeSessionId } });
}

import { LISTING_CONFIG } from "./transfer-config";

type TicketShape = {
  price: number | { toNumber(): number };
  totalPaid: number | { toNumber(): number };
  checkedInAt: Date | null;
  transferCount: number;
  stripeSessionId: string | null;
  purchasedAt: Date;
  transfers?: Array<{ status: string }>;
  payments?: Array<{ stripeId: string | null; paidAt: Date }>;
};

type EventShape = {
  date: Date;
  published: boolean;
};

export function checkListingEligibility(
  ticket: TicketShape,
  event: EventShape,
): { ok: true } | { ok: false; reason: string } {
  const price = typeof ticket.price === "number" ? ticket.price : ticket.price.toNumber();
  const totalPaid = typeof ticket.totalPaid === "number" ? ticket.totalPaid : ticket.totalPaid.toNumber();

  if (totalPaid < price) {
    return { ok: false, reason: "Ce billet n'est pas intégralement payé : impossible de le mettre en vente." };
  }
  if (ticket.checkedInAt) {
    return { ok: false, reason: "Ce billet a déjà été scanné à l'entrée." };
  }
  if (ticket.transferCount > 0) {
    return { ok: false, reason: "Ce billet a déjà été transféré : la revente n'est pas autorisée sur un billet de seconde main." };
  }

  const pending = (ticket.transfers ?? []).filter((t) => t.status === "PENDING" || t.status === "LISTED");
  if (pending.length > 0) {
    return { ok: false, reason: "Ce billet est déjà engagé dans un transfert ou une mise en vente active." };
  }

  if (!event.published) {
    return { ok: false, reason: "L'événement n'est plus publié." };
  }

  const now = Date.now();
  const limit = new Date(event.date).getTime() - LISTING_CONFIG.DELAI_LIMITE_H * 3600 * 1000;
  if (now > limit) {
    return { ok: false, reason: `Les reventes sont clôturées ${LISTING_CONFIG.DELAI_LIMITE_H} heures avant l'événement.` };
  }

  const payments = ticket.payments ?? [];
  const stripePayments = payments.filter((p) => p.stripeId);
  if (stripePayments.length === 0 && !ticket.stripeSessionId) {
    return { ok: false, reason: "Ce billet n'a pas été acheté via Stripe : la revente automatique n'est pas disponible (contactez-nous)." };
  }

  const oldestStripePayment = stripePayments.reduce<Date | null>((oldest, p) => {
    const d = new Date(p.paidAt);
    if (!oldest || d < oldest) return d;
    return oldest;
  }, null);
  const refDate = oldestStripePayment ?? new Date(ticket.purchasedAt);
  const ageDays = (now - refDate.getTime()) / (24 * 3600 * 1000);
  if (ageDays > LISTING_CONFIG.MAX_PAYMENT_AGE_DAYS) {
    return {
      ok: false,
      reason: `Ce billet a été payé il y a plus de ${LISTING_CONFIG.MAX_PAYMENT_AGE_DAYS} jours : la revente automatique est désactivée. Contactez-nous pour une revente manuelle.`,
    };
  }

  return { ok: true };
}

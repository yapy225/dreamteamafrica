import { TRANSFER_CONFIG } from "./transfer-config";

type TicketShape = {
  price: number | { toNumber(): number };
  totalPaid: number | { toNumber(): number };
  checkedInAt: Date | null;
  transferCount: number;
  transfers?: Array<{ status: string }>;
};

type EventShape = {
  date: Date;
  published: boolean;
};

export function checkTransferEligibility(
  ticket: TicketShape,
  event: EventShape,
): { ok: true } | { ok: false; reason: string } {
  const totalPaid = Number(ticket.totalPaid);
  const price = Number(ticket.price);

  if (totalPaid < price) {
    return { ok: false, reason: "Ce billet n'est pas intégralement payé : impossible de le céder tant qu'il reste un solde." };
  }

  if (ticket.checkedInAt) {
    return { ok: false, reason: "Ce billet a déjà été scanné à l'entrée : il ne peut plus être cédé." };
  }

  if (ticket.transferCount >= TRANSFER_CONFIG.MAX_TRANSFERS) {
    return { ok: false, reason: `Ce billet a déjà été transféré ${TRANSFER_CONFIG.MAX_TRANSFERS} fois : la cession n'est plus autorisée.` };
  }

  const hasPending = (ticket.transfers ?? []).some((t) => t.status === "PENDING");
  if (hasPending) {
    return { ok: false, reason: "Une invitation de transfert est déjà en cours sur ce billet. Annulez-la avant d'en créer une nouvelle." };
  }

  if (!event.published) {
    return { ok: false, reason: "L'événement n'est plus publié : le transfert est indisponible." };
  }

  const now = Date.now();
  const limit = new Date(event.date).getTime() - TRANSFER_CONFIG.DELAI_LIMITE_H * 3600 * 1000;
  if (now > limit) {
    return { ok: false, reason: `Les transferts sont clôturés ${TRANSFER_CONFIG.DELAI_LIMITE_H} heures avant l'événement.` };
  }

  return { ok: true };
}

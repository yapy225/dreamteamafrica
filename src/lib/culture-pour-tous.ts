/**
 * ╔══════════════════════════════════════════════════════════════╗
 * ║  CULTURE POUR TOUS — Système de paiement flexible          ║
 * ║                                                            ║
 * ║  "Réserve ta place avec 5€, paie comme tu peux,           ║
 * ║   solde la veille de l'événement."                         ║
 * ║                                                            ║
 * ║  CACHÉ — Ne pas intégrer pour l'instant.                   ║
 * ║  Sera branché sur toute la billetterie plus tard.          ║
 * ╚══════════════════════════════════════════════════════════════╝
 *
 * Fonctionnement :
 *   1. Le visiteur réserve avec un acompte de 5€ (via Stripe)
 *   2. Il reçoit son billet (QR code) immédiatement
 *   3. Il peut recharger son billet quand il veut (montant libre)
 *   4. Le solde restant est à régler la veille de l'événement
 *   5. Relance automatique J-7, J-3, J-1 pour ceux qui n'ont pas soldé
 *   6. Si pas soldé → le billet reste valide, complément à payer sur place
 *
 * Intégration future :
 *   - Nouveau tier "CULTURE_POUR_TOUS" dans event.tiers
 *   - Route checkout : POST /api/checkout/culture-pour-tous
 *   - Route recharge : POST /api/tickets/recharge (existe déjà)
 *   - Cron relance : /api/cron/culture-pour-tous-relance
 *   - Dashboard : section "Billets Culture pour Tous" avec solde
 */

import type { Stripe } from "stripe";

// ── Configuration ──

export const CPT_CONFIG = {
  /** Montant minimum de l'acompte pour réserver */
  depositAmount: 5,

  /** Prix du billet à atteindre (sera dynamique selon le tier) */
  targetPrice: 10,

  /** Montant minimum par recharge */
  minRechargeAmount: 1,

  /** Jours avant l'événement pour la deadline de solde */
  deadlineDaysBefore: 1,

  /** Jours avant l'événement pour les relances */
  reminders: [7, 3, 1],

  /** Message sur le billet */
  ticketLabel: "Culture pour Tous",

  /** Description affichée au checkout */
  checkoutDescription: "Réservez votre place avec 5€. Complétez le paiement quand vous voulez, jusqu'à la veille de l'événement.",
};

// ── Types ──

export interface CulturePourTousTicket {
  ticketId: string;
  eventId: string;
  userId: string;
  email: string;
  phone: string;
  firstName: string;
  lastName: string;
  /** Prix total du billet */
  targetPrice: number;
  /** Montant déjà payé (acompte + recharges) */
  totalPaid: number;
  /** Solde restant */
  remaining: number;
  /** Billet complètement soldé ? */
  isFullyPaid: boolean;
  /** Date limite de paiement */
  deadline: Date;
}

// ── Helpers ──

/**
 * Calcule le solde restant pour un billet CPT.
 */
export function calculateRemaining(targetPrice: number, totalPaid: number): number {
  return Math.max(0, Math.round((targetPrice - totalPaid) * 100) / 100);
}

/**
 * Vérifie si un billet est complètement soldé.
 */
export function isFullyPaid(targetPrice: number, totalPaid: number): boolean {
  return totalPaid >= targetPrice;
}

/**
 * Calcule la date limite de paiement (veille de l'événement).
 */
export function getPaymentDeadline(eventDate: Date): Date {
  const deadline = new Date(eventDate);
  deadline.setDate(deadline.getDate() - CPT_CONFIG.deadlineDaysBefore);
  deadline.setHours(23, 59, 59, 999);
  return deadline;
}

/**
 * Vérifie si la deadline est dépassée.
 */
export function isDeadlinePassed(eventDate: Date): boolean {
  return new Date() > getPaymentDeadline(eventDate);
}

/**
 * Détermine les jours de relance nécessaires.
 * Retourne les jours restants qui correspondent aux seuils de relance.
 */
export function getRelanceDay(eventDate: Date): number | null {
  const now = new Date();
  const diffMs = eventDate.getTime() - now.getTime();
  const daysUntilEvent = Math.ceil(diffMs / 86400000);

  for (const day of CPT_CONFIG.reminders) {
    if (daysUntilEvent === day) return day;
  }
  return null;
}

// ── Stripe Checkout (acompte initial) ──

/**
 * Paramètres pour créer une session Stripe Checkout CPT.
 * À utiliser dans la route checkout quand le système sera activé.
 */
export function buildCptCheckoutParams(opts: {
  eventTitle: string;
  eventSlug: string;
  eventId: string;
  userId: string;
  tier: string;
  quantity: number;
  unitPrice: number;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  visitDate?: string;
  appUrl: string;
}): Stripe.Checkout.SessionCreateParams {
  const deposit = CPT_CONFIG.depositAmount * opts.quantity;

  return {
    mode: "payment",
    payment_method_types: ["card", "paypal"],
    customer_email: opts.email,
    line_items: [
      {
        price_data: {
          currency: "eur",
          unit_amount: CPT_CONFIG.depositAmount * 100,
          product_data: {
            name: `Culture pour Tous — ${opts.eventTitle}`,
            description: CPT_CONFIG.checkoutDescription,
          },
        },
        quantity: opts.quantity,
      },
    ],
    metadata: {
      type: "culture_pour_tous",
      eventId: opts.eventId,
      userId: opts.userId,
      tier: opts.tier,
      quantity: String(opts.quantity),
      unitPrice: String(opts.unitPrice),
      deposit: String(deposit),
      remainingBalance: String(opts.unitPrice * opts.quantity - deposit),
      firstName: opts.firstName,
      lastName: opts.lastName,
      email: opts.email,
      phone: opts.phone,
      ...(opts.visitDate && { visitDate: opts.visitDate }),
    },
    success_url: `${opts.appUrl}/saison-culturelle-africaine/confirmation/{CHECKOUT_SESSION_ID}`,
    cancel_url: `${opts.appUrl}/saison-culturelle-africaine/${opts.eventSlug}`,
  };
}

// ── Emails de relance ──

/**
 * Génère le contenu de l'email de relance selon le nombre de jours restants.
 */
export function buildRelanceEmail(opts: {
  firstName: string;
  eventTitle: string;
  remaining: number;
  daysLeft: number;
  rechargeUrl: string;
}): { subject: string; body: string } {
  const urgency = opts.daysLeft <= 1 ? "DERNIERE CHANCE" : `J-${opts.daysLeft}`;

  return {
    subject: `${urgency} — Soldez votre billet ${opts.eventTitle} (${opts.remaining}€ restants)`,
    body: `Bonjour ${opts.firstName},

Votre billet Culture pour Tous pour ${opts.eventTitle} n'est pas encore complètement soldé.

Montant restant : ${opts.remaining} €
Date limite : la veille de l'événement

Soldez votre billet en un clic :
${opts.rechargeUrl}

Si vous ne soldez pas avant, le complément sera à régler sur place à l'entrée.

L'équipe Dream Team Africa`,
  };
}

/**
 * Génère le message WhatsApp de relance.
 */
export function buildRelanceWhatsApp(opts: {
  firstName: string;
  eventTitle: string;
  remaining: number;
  daysLeft: number;
  rechargeUrl: string;
}): string {
  const urgency = opts.daysLeft <= 1 ? "DERNIER JOUR" : `J-${opts.daysLeft}`;

  return `${urgency} - ${opts.eventTitle}

Bonjour ${opts.firstName},

Il vous reste ${opts.remaining} EUR a regler sur votre billet Culture pour Tous.

Soldez en ligne : ${opts.rechargeUrl}

Sinon, le complement sera a payer sur place.

Dream Team Africa`;
}

// ── Tier config (à ajouter dans event.tiers quand activé) ──

/**
 * Configuration du tier Culture pour Tous à injecter dans event.tiers.
 *
 * Exemple d'utilisation :
 *   const tiers = [...existingTiers, getCptTierConfig(10)];
 *   await prisma.event.update({ where: { id }, data: { tiers } });
 */
export function getCptTierConfig(targetPrice: number) {
  return {
    id: "CULTURE_POUR_TOUS",
    name: "Culture pour Tous",
    price: targetPrice,
    deposit: CPT_CONFIG.depositAmount,
    features: [
      `Réservez avec seulement ${CPT_CONFIG.depositAmount}€`,
      "Payez le solde quand vous voulez",
      "Date limite : la veille de l'événement",
      "Accès 1 jour",
      "Accès au Grand Marché Africain",
      "Espaces culture & Exposition",
      "Accès restauration",
      "Animations culturelles",
      "Billet électronique",
      "Billet nominatif",
    ],
    highlight: true,
    description: "Réservez votre place avec 5€ — payez comme vous pouvez",
    isCulturePourTous: true,
  };
}

import { prisma } from "./db";
import { NtbcTier } from "@prisma/client";

const COMMISSION_RATE = 0.04;
const SYSTEM_ACCOUNT = "SYSTEM"; // On utilise un userId spécial ou le solde admin

// ── Calcul du tier ────────────────────────────────────────────────────────
export function calculateTier(solde: number): NtbcTier {
  if (solde >= 200) return "BAOBAB";
  if (solde >= 50) return "TRONC";
  if (solde >= 10) return "RACINE";
  return "SEMENCE";
}

export async function updateUserTier(userId: string) {
  const user = await prisma.user.findUniqueOrThrow({ where: { id: userId } });
  const soldeTotal = user.soldeNtbc + user.soldeBonus;
  const newTier = calculateTier(soldeTotal);
  if (newTier !== user.tier) {
    await prisma.user.update({ where: { id: userId }, data: { tier: newTier } });
  }
  return newTier;
}

// ── Transaction NTBC ──────────────────────────────────────────────────────
export async function executeNtbcTransaction(
  visiteurId: string,
  exposantId: string,
  montantNtbc: number,
  label?: string,
  eventId?: string
) {
  const visiteur = await prisma.user.findUniqueOrThrow({ where: { id: visiteurId } });
  const soldeTotal = visiteur.soldeNtbc + visiteur.soldeBonus;

  if (soldeTotal < montantNtbc) {
    return { error: `Solde insuffisant (${soldeTotal} NTBC)` };
  }

  const commission = Math.round(montantNtbc * COMMISSION_RATE * 100) / 100;
  const netExposant = Math.round((montantNtbc - commission) * 100) / 100;

  // Débiter bonus en priorité
  const debitBonus = Math.min(visiteur.soldeBonus, montantNtbc);
  const debitNtbc = montantNtbc - debitBonus;

  const tx = await prisma.$transaction(async (db) => {
    // Débiter visiteur
    await db.user.update({
      where: { id: visiteurId },
      data: {
        soldeBonus: { decrement: debitBonus },
        soldeNtbc: { decrement: debitNtbc },
      },
    });

    // Créditer exposant (NTBC normaux, retirables)
    await db.user.update({
      where: { id: exposantId },
      data: { soldeNtbc: { increment: netExposant } },
    });

    // Enregistrer la transaction
    return db.ntbcTransaction.create({
      data: {
        emetteurId: visiteurId,
        receveurId: exposantId,
        montantNtbc,
        commissionNtbc: commission,
        netNtbc: netExposant,
        label,
        eventId,
      },
    });
  });

  await Promise.all([updateUserTier(visiteurId), updateUserTier(exposantId)]);

  return {
    transactionId: tx.id,
    montantNtbc,
    commission,
    netExposant,
  };
}

// ── Créditer NTBC (recharge, bonus billet) ────────────────────────────────
export async function crediterNtbc(userId: string, montant: number, label: string) {
  await prisma.user.update({
    where: { id: userId },
    data: { soldeNtbc: { increment: montant } },
  });
  await updateUserTier(userId);
}

// ── Créditer bonus (parrainage) ───────────────────────────────────────────
export async function crediterBonus(userId: string, montant: number) {
  await prisma.user.update({
    where: { id: userId },
    data: { soldeBonus: { increment: montant } },
  });
  await updateUserTier(userId);
}

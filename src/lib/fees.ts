/**
 * Frais de gestion — 3% avec minimum 0.50€
 * Absorbés sur les micro-transactions < 5€ (recharges)
 */

const FEE_RATE = 0.03; // 3%
const MIN_FEE = 0.50; // 0.50€ minimum
const ABSORB_THRESHOLD = 5; // pas de frais sous 5€ (micro-recharges)

/**
 * Calcule les frais de gestion pour un montant donné.
 * @param amount Montant HT en euros
 * @param absorb Si true, pas de frais sous le seuil (pour les recharges)
 */
export function calculateFees(amount: number, absorb = false): {
  subtotal: number;
  fees: number;
  total: number;
  feeLabel: string;
} {
  if (absorb && amount < ABSORB_THRESHOLD) {
    return {
      subtotal: amount,
      fees: 0,
      total: amount,
      feeLabel: "Frais offerts",
    };
  }

  const rawFee = amount * FEE_RATE;
  const fees = Math.max(rawFee, MIN_FEE);
  const roundedFees = Math.round(fees * 100) / 100;
  const total = Math.round((amount + roundedFees) * 100) / 100;

  return {
    subtotal: amount,
    fees: roundedFees,
    total,
    feeLabel: `Frais de gestion (3%)`,
  };
}

/**
 * Stripe line items avec frais de gestion séparés.
 */
export function buildLineItemsWithFees(
  productName: string,
  description: string,
  unitAmount: number,
  quantity: number,
  absorb = false,
): Array<{ price_data: { currency: string; unit_amount: number; product_data: { name: string; description?: string } }; quantity: number }> {
  const { fees } = calculateFees(unitAmount * quantity, absorb);

  const items: Array<{ price_data: { currency: string; unit_amount: number; product_data: { name: string; description?: string } }; quantity: number }> = [
    {
      price_data: {
        currency: "eur",
        unit_amount: Math.round(unitAmount * 100),
        product_data: { name: productName, description },
      },
      quantity,
    },
  ];

  if (fees > 0) {
    items.push({
      price_data: {
        currency: "eur",
        unit_amount: Math.round(fees * 100),
        product_data: { name: "Frais de gestion (3%)" },
      },
      quantity: 1,
    });
  }

  return items;
}

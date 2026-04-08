import type { Decimal } from "@prisma/client/runtime/library";

/**
 * Safely convert Prisma Decimal/Float to number.
 * Handles both Decimal objects and regular numbers.
 */
export function toNum(value: Decimal | number | null | undefined): number {
  if (value == null) return 0;
  if (typeof value === "number") return value;
  return Number(value);
}

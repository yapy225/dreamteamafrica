import { PrismaClient } from "@prisma/client";

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

const basePrisma = globalForPrisma.prisma ?? new PrismaClient();

if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = basePrisma;

/**
 * Extended Prisma client with Decimal→number auto-conversion.
 * All Decimal fields are automatically converted to JavaScript numbers
 * so arithmetic operators work without explicit casting.
 */
export const prisma = basePrisma.$extends({
  result: {
    ticket: {
      price: { needs: { price: true }, compute: (t) => Number(t.price) },
      totalPaid: { needs: { totalPaid: true }, compute: (t) => Number(t.totalPaid) },
    },
    ticketPayment: {
      amount: { needs: { amount: true }, compute: (t) => Number(t.amount) },
    },
    event: {
      priceEarly: { needs: { priceEarly: true }, compute: (e) => Number(e.priceEarly) },
      priceStd: { needs: { priceStd: true }, compute: (e) => Number(e.priceStd) },
      priceVip: { needs: { priceVip: true }, compute: (e) => Number(e.priceVip) },
    },
    product: {
      price: { needs: { price: true }, compute: (p) => Number(p.price) },
    },
    order: {
      total: { needs: { total: true }, compute: (o) => Number(o.total) },
    },
    orderItem: {
      price: { needs: { price: true }, compute: (i) => Number(i.price) },
    },
    exhibitorBooking: {
      totalPrice: { needs: { totalPrice: true }, compute: (b) => Number(b.totalPrice) },
      installmentAmount: { needs: { installmentAmount: true }, compute: (b) => Number(b.installmentAmount) },
    },
    exhibitorPayment: {
      amount: { needs: { amount: true }, compute: (p) => Number(p.amount) },
    },
    coupon: {
      value: { needs: { value: true }, compute: (c) => Number(c.value) },
    },
  },
});

import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { getStripe } from "@/lib/stripe";

export async function POST(request: Request) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Non authentifié." }, { status: 401 });
    }

    const { items } = await request.json();

    if (!items || !Array.isArray(items) || items.length === 0) {
      return NextResponse.json({ error: "Panier vide." }, { status: 400 });
    }

    // Validate products and stock
    const productIds = items.map((i: { productId: string }) => i.productId);
    const products = await prisma.product.findMany({
      where: { id: { in: productIds }, published: true },
    });

    if (products.length !== items.length) {
      return NextResponse.json(
        { error: "Un ou plusieurs produits sont indisponibles." },
        { status: 400 }
      );
    }

    const productMap = new Map(products.map((p) => [p.id, p]));

    for (const item of items) {
      const product = productMap.get(item.productId);
      if (!product || product.stock < item.quantity) {
        return NextResponse.json(
          { error: `Stock insuffisant pour "${product?.name || "produit inconnu"}".` },
          { status: 400 }
        );
      }
    }

    // Build line items
    const lineItems = items.map((item: { productId: string; quantity: number }) => {
      const product = productMap.get(item.productId)!;
      return {
        price_data: {
          currency: "eur",
          unit_amount: Math.round(product.price * 100),
          product_data: {
            name: product.name,
            description: product.category,
          },
        },
        quantity: item.quantity,
      };
    });

    const total = items.reduce((sum: number, item: { productId: string; quantity: number }) => {
      const product = productMap.get(item.productId)!;
      return sum + product.price * item.quantity;
    }, 0);

    const checkoutSession = await getStripe().checkout.sessions.create({
      mode: "payment",
      customer_email: session.user.email!,
      line_items: lineItems,
      metadata: {
        type: "order",
        userId: session.user.id,
        items: JSON.stringify(
          items.map((i: { productId: string; quantity: number }) => ({
            productId: i.productId,
            quantity: i.quantity,
            price: productMap.get(i.productId)!.price,
          }))
        ),
        total: String(total),
      },
      success_url: `${process.env.NEXT_PUBLIC_APP_URL}/dashboard/orders?success=1`,
      cancel_url: `${process.env.NEXT_PUBLIC_APP_URL}/cart`,
    });

    return NextResponse.json({ url: checkoutSession.url });
  } catch (error) {
    console.error("Order checkout error:", error);
    return NextResponse.json({ error: "Erreur interne." }, { status: 500 });
  }
}

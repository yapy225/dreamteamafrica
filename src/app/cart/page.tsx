"use client";

import Link from "next/link";
import { Trash2, Minus, Plus, ShoppingBag, ArrowLeft, Loader2 } from "lucide-react";
import { useCartStore } from "@/stores/cart";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function CartPage() {
  const { items, removeItem, updateQuantity, clearCart, totalPrice } = useCartStore();
  const { data: session } = useSession();
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const formatPrice = (price: number) =>
    new Intl.NumberFormat("fr-FR", { style: "currency", currency: "EUR" }).format(price);

  const handleCheckout = async () => {
    if (!session) {
      router.push("/auth/signin");
      return;
    }

    setLoading(true);
    try {
      const res = await fetch("/api/checkout/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          items: items.map((i) => ({ productId: i.productId, quantity: i.quantity })),
        }),
      });

      const data = await res.json();
      if (data.url) {
        clearCart();
        window.location.href = data.url;
      } else {
        alert(data.error || "Erreur lors du paiement.");
        setLoading(false);
      }
    } catch {
      alert("Erreur réseau.");
      setLoading(false);
    }
  };

  if (items.length === 0) {
    return (
      <div className="mx-auto max-w-2xl px-4 py-20 text-center">
        <ShoppingBag size={48} className="mx-auto text-dta-taupe" />
        <h1 className="mt-4 font-serif text-3xl font-bold text-dta-dark">Panier vide</h1>
        <p className="mt-2 text-dta-char/70">Explorez notre marketplace pour trouver des pièces uniques.</p>
        <Link
          href="/marketplace"
          className="mt-8 inline-flex items-center gap-2 rounded-[var(--radius-button)] bg-dta-accent px-6 py-3 text-sm font-semibold text-white hover:bg-dta-accent-dark"
        >
          <ArrowLeft size={16} />
          Explorer la marketplace
        </Link>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-3xl px-4 py-12 sm:px-6">
      <h1 className="mb-8 font-serif text-3xl font-bold text-dta-dark">
        Panier ({items.length} article{items.length !== 1 ? "s" : ""})
      </h1>

      <div className="space-y-3">
        {items.map((item) => (
          <div
            key={item.productId}
            className="flex items-center gap-4 rounded-[var(--radius-card)] bg-white p-4 shadow-[var(--shadow-card)]"
          >
            <div className="h-20 w-20 flex-shrink-0 rounded-[var(--radius-input)] bg-gradient-to-br from-dta-sand to-dta-beige" />

            <div className="flex-1 min-w-0">
              <h3 className="truncate font-serif text-base font-semibold text-dta-dark">
                {item.name}
              </h3>
              <p className="text-xs text-dta-taupe">par {item.artisan}</p>
              <p className="mt-1 font-serif text-base font-bold text-dta-accent">
                {formatPrice(item.price)}
              </p>
            </div>

            <div className="flex items-center rounded-[var(--radius-button)] border border-dta-sand">
              <button
                onClick={() => updateQuantity(item.productId, item.quantity - 1)}
                className="px-2.5 py-1.5 text-dta-char/50 hover:text-dta-dark"
              >
                <Minus size={14} />
              </button>
              <span className="w-8 text-center text-sm font-medium">{item.quantity}</span>
              <button
                onClick={() => updateQuantity(item.productId, item.quantity + 1)}
                className="px-2.5 py-1.5 text-dta-char/50 hover:text-dta-dark"
                disabled={item.quantity >= item.maxStock}
              >
                <Plus size={14} />
              </button>
            </div>

            <span className="w-20 text-right font-serif font-bold text-dta-dark">
              {formatPrice(item.price * item.quantity)}
            </span>

            <button
              onClick={() => removeItem(item.productId)}
              className="rounded-[var(--radius-button)] p-2 text-dta-taupe hover:bg-red-50 hover:text-red-600"
            >
              <Trash2 size={16} />
            </button>
          </div>
        ))}
      </div>

      {/* Summary */}
      <div className="mt-8 rounded-[var(--radius-card)] bg-white p-6 shadow-[var(--shadow-card)]">
        <div className="flex items-center justify-between">
          <span className="text-lg font-medium text-dta-char">Total</span>
          <span className="font-serif text-2xl font-bold text-dta-dark">
            {formatPrice(totalPrice())}
          </span>
        </div>

        <button
          onClick={handleCheckout}
          disabled={loading}
          className="mt-4 flex w-full items-center justify-center gap-2 rounded-[var(--radius-button)] bg-dta-accent px-6 py-3.5 text-sm font-semibold text-white hover:bg-dta-accent-dark disabled:opacity-50"
        >
          {loading ? (
            <>
              <Loader2 size={16} className="animate-spin" />
              Redirection vers le paiement...
            </>
          ) : (
            "Passer au paiement"
          )}
        </button>

        <div className="mt-3 flex justify-between">
          <Link href="/marketplace" className="text-sm text-dta-taupe hover:text-dta-accent">
            &larr; Continuer mes achats
          </Link>
          <button
            onClick={clearCart}
            className="text-sm text-dta-taupe hover:text-red-500"
          >
            Vider le panier
          </button>
        </div>
      </div>
    </div>
  );
}

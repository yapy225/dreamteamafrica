"use client";

import { useState } from "react";
import { ShoppingBag, Check, Minus, Plus } from "lucide-react";
import { useCartStore } from "@/stores/cart";

interface AddToCartButtonProps {
  product: {
    productId: string;
    name: string;
    price: number;
    image: string;
    artisan: string;
    maxStock: number;
  };
}

export default function AddToCartButton({ product }: AddToCartButtonProps) {
  const [quantity, setQuantity] = useState(1);
  const [added, setAdded] = useState(false);
  const addItem = useCartStore((s) => s.addItem);

  const handleAdd = () => {
    addItem({ ...product, quantity });
    setAdded(true);
    setTimeout(() => setAdded(false), 2000);
  };

  return (
    <div className="flex items-center gap-3">
      <div className="flex items-center rounded-[var(--radius-button)] border border-dta-sand">
        <button
          onClick={() => setQuantity(Math.max(1, quantity - 1))}
          className="px-3 py-2.5 text-dta-char/50 hover:text-dta-dark"
          disabled={quantity <= 1}
        >
          <Minus size={14} />
        </button>
        <span className="w-10 text-center text-sm font-medium text-dta-dark">{quantity}</span>
        <button
          onClick={() => setQuantity(Math.min(product.maxStock, quantity + 1))}
          className="px-3 py-2.5 text-dta-char/50 hover:text-dta-dark"
          disabled={quantity >= product.maxStock}
        >
          <Plus size={14} />
        </button>
      </div>

      <button
        onClick={handleAdd}
        className={`flex flex-1 items-center justify-center gap-2 rounded-[var(--radius-button)] px-6 py-3 text-sm font-semibold text-white transition-all duration-200 ${
          added
            ? "bg-green-600"
            : "bg-dta-accent hover:bg-dta-accent-dark"
        }`}
      >
        {added ? (
          <>
            <Check size={16} />
            Ajouté au panier
          </>
        ) : (
          <>
            <ShoppingBag size={16} />
            Ajouter au panier
          </>
        )}
      </button>
    </div>
  );
}

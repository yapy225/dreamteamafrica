"use client";

import { useState } from "react";
import { Check, Minus, Plus } from "lucide-react";
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
  formattedPrice?: string;
}

function PriceDisplay({ price }: { price: number }) {
  const euros = Math.floor(price);
  const cents = Math.round((price - euros) * 100);
  return (
    <span className="flex items-start text-[#2C2C2C]">
      <span className="font-serif text-[32px] font-bold leading-none">{euros}</span>
      <span className="ml-0.5 mt-0.5 flex flex-col text-[13px] font-bold leading-tight">
        <span>,{cents.toString().padStart(2, "0")}&euro;</span>
      </span>
    </span>
  );
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
    <div className="space-y-4">
      {/* Quantity selector + Price */}
      <div className="flex items-center justify-between">
        <div className="flex items-center rounded-lg border border-[#E0E0E0]">
          <button
            onClick={() => setQuantity(Math.max(1, quantity - 1))}
            className="flex h-11 w-11 items-center justify-center text-[#6B6B6B] transition-colors hover:text-[#2C2C2C] disabled:opacity-30"
            disabled={quantity <= 1}
          >
            <Minus size={16} />
          </button>
          <span className="flex h-11 w-12 items-center justify-center border-x border-[#E0E0E0] text-sm font-medium text-[#2C2C2C]">
            {quantity}
          </span>
          <button
            onClick={() => setQuantity(Math.min(product.maxStock, quantity + 1))}
            className="flex h-11 w-11 items-center justify-center text-[#6B6B6B] transition-colors hover:text-[#2C2C2C] disabled:opacity-30"
            disabled={quantity >= product.maxStock}
          >
            <Plus size={16} />
          </button>
        </div>
        <PriceDisplay price={product.price} />
      </div>

      {/* Full-width Add to Cart */}
      <button
        onClick={handleAdd}
        className={`flex w-full items-center justify-center gap-2 rounded-xl py-4 text-sm font-semibold text-white transition-all duration-200 ${
          added
            ? "bg-[#5A7A62]"
            : "bg-[#2C2C2C] hover:bg-[#1a1a1a]"
        }`}
      >
        {added ? (
          <>
            <Check size={16} />
            Ajout&eacute; au panier
          </>
        ) : (
          "Ajouter au panier"
        )}
      </button>
    </div>
  );
}

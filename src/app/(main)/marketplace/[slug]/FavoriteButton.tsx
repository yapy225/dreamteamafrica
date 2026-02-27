"use client";

import { useState } from "react";
import { Heart } from "lucide-react";
import { useRouter } from "next/navigation";

export default function FavoriteButton({
  productId,
  initialFavorited,
  isLoggedIn,
}: {
  productId: string;
  initialFavorited: boolean;
  isLoggedIn: boolean;
}) {
  const router = useRouter();
  const [favorited, setFavorited] = useState(initialFavorited);
  const [loading, setLoading] = useState(false);

  const handleToggle = async () => {
    if (!isLoggedIn) {
      router.push("/auth/signin");
      return;
    }

    setLoading(true);
    const res = await fetch("/api/favorites", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ productId }),
    });

    if (res.ok) {
      const data = await res.json();
      setFavorited(data.favorited);
    }
    setLoading(false);
  };

  return (
    <button
      onClick={handleToggle}
      disabled={loading}
      className={`rounded-full p-2.5 transition-all duration-200 ${
        favorited
          ? "bg-red-50 text-red-500 hover:bg-red-100"
          : "bg-dta-beige text-dta-taupe hover:bg-dta-sand hover:text-dta-accent"
      }`}
      title={favorited ? "Retirer des favoris" : "Ajouter aux favoris"}
    >
      <Heart size={20} fill={favorited ? "currentColor" : "none"} />
    </button>
  );
}

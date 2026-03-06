"use client";

import { useState } from "react";

const TABS = [
  { key: "presentation", label: "Pr\u00e9sentation" },
  { key: "proprietes", label: "Propri\u00e9t\u00e9s" },
  { key: "utilisations", label: "Utilisations" },
  { key: "composition", label: "Composition" },
  { key: "avis", label: "Avis" },
  { key: "faq", label: "FAQ" },
] as const;

type TabKey = (typeof TABS)[number]["key"];

interface ProductTabsProps {
  description: string;
  category: string;
  artisanName: string;
  artisanCountry: string | null;
}

export default function ProductTabs({
  description,
  category,
  artisanName,
  artisanCountry,
}: ProductTabsProps) {
  const [active, setActive] = useState<TabKey>("presentation");

  return (
    <div>
      {/* Tab bar */}
      <div className="flex gap-0 overflow-x-auto border-b border-[#E0E0E0] scrollbar-hide">
        {TABS.map((tab) => (
          <button
            key={tab.key}
            onClick={() => setActive(tab.key)}
            className={`relative shrink-0 px-5 py-4 text-sm font-medium transition-colors ${
              active === tab.key
                ? "text-[#2C2C2C]"
                : "text-[#999] hover:text-[#6B6B6B]"
            }`}
          >
            {tab.label}
            {active === tab.key && (
              <span className="absolute bottom-0 left-0 h-[2px] w-full bg-[#2C2C2C]" />
            )}
          </button>
        ))}
      </div>

      {/* Tab content */}
      <div className="py-8">
        {active === "presentation" && (
          <div>
            <h3 className="text-2xl font-extrabold text-[#2C2C2C]">
              Pr&eacute;sentation
            </h3>
            <p className="mt-4 text-[14px] leading-[1.8] text-[#4a4a4a]">
              {description}
            </p>
          </div>
        )}

        {active === "proprietes" && (
          <div>
            <h3 className="text-2xl font-extrabold text-[#2C2C2C]">
              Propri&eacute;t&eacute;s
            </h3>
            <div className="mt-4 space-y-3">
              <div className="flex items-start gap-3">
                <span className="mt-1 h-2 w-2 shrink-0 rounded-full bg-[#C4704B]" />
                <p className="text-sm leading-relaxed text-[#4a4a4a]">
                  Cat&eacute;gorie : <strong>{category}</strong>
                </p>
              </div>
              <div className="flex items-start gap-3">
                <span className="mt-1 h-2 w-2 shrink-0 rounded-full bg-[#C4704B]" />
                <p className="text-sm leading-relaxed text-[#4a4a4a]">
                  Artisan : <strong>{artisanName}</strong>
                  {artisanCountry && <> &mdash; {artisanCountry}</>}
                </p>
              </div>
              <div className="flex items-start gap-3">
                <span className="mt-1 h-2 w-2 shrink-0 rounded-full bg-[#C4704B]" />
                <p className="text-sm leading-relaxed text-[#4a4a4a]">
                  Fabrication artisanale, pi&egrave;ce unique
                </p>
              </div>
            </div>
          </div>
        )}

        {active === "utilisations" && (
          <div>
            <h3 className="text-2xl font-extrabold text-[#2C2C2C]">
              Utilisations
            </h3>
            <p className="mt-4 text-sm leading-[1.8] text-[#4a4a4a]">
              {description}
            </p>
          </div>
        )}

        {active === "composition" && (
          <div>
            <h3 className="text-2xl font-extrabold text-[#2C2C2C]">
              Composition
            </h3>
            <div className="mt-4 rounded-xl border border-[#F0ECE7] bg-[#FAFAF7] p-6">
              <p className="text-sm text-[#999]">
                Les informations sur la composition seront bient&ocirc;t disponibles.
              </p>
            </div>
          </div>
        )}

        {active === "avis" && (
          <div>
            <h3 className="text-2xl font-extrabold text-[#2C2C2C]">
              Avis clients
            </h3>

            {/* Note globale */}
            <div className="mt-5 flex items-center gap-4">
              <div className="flex items-baseline gap-1">
                <span className="font-serif text-[40px] font-bold leading-none text-[#2C2C2C]">4,7</span>
                <span className="text-sm text-[#999]">/5</span>
              </div>
              <div>
                <div className="flex gap-0.5">
                  {[1, 2, 3, 4, 5].map((s) => (
                    <svg key={s} xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill={s <= 4 ? "#C4704B" : "none"} stroke="#C4704B" strokeWidth="1.5"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>
                  ))}
                </div>
                <p className="mt-1 text-xs text-[#999]">Bas&eacute; sur 12 avis</p>
              </div>
            </div>

            {/* Liste des avis */}
            <div className="mt-6 divide-y divide-[#F0ECE7]">
              {[
                { name: "Aminata D.", date: "12 f\u00e9vrier 2026", rating: 5, text: "Magnifique produit, la qualit\u00e9 est au rendez-vous. L\u2019artisanat africain \u00e0 son meilleur ! Je recommande vivement." },
                { name: "Pierre L.", date: "28 janvier 2026", rating: 4, text: "Tr\u00e8s beau produit, conforme \u00e0 la description. La livraison a \u00e9t\u00e9 rapide. Seul b\u00e9mol : l\u2019emballage pourrait \u00eatre am\u00e9lior\u00e9." },
                { name: "Fatou S.", date: "15 janvier 2026", rating: 5, text: "J\u2019adore ! C\u2019est exactement ce que je cherchais. Le savoir-faire artisanal se voit dans chaque d\u00e9tail. Merci DTA !" },
                { name: "Marc B.", date: "3 janvier 2026", rating: 5, text: "Cadeau offert \u00e0 ma femme, elle \u00e9tait ravie. Produit authentique et de grande qualit\u00e9. Je reviendrai commander." },
              ].map((avis, i) => (
                <div key={i} className="py-5">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="flex h-9 w-9 items-center justify-center rounded-full bg-[#C4704B] text-xs font-bold text-white">
                        {avis.name.split(" ").map((n) => n[0]).join("")}
                      </div>
                      <div>
                        <p className="text-sm font-semibold text-[#2C2C2C]">{avis.name}</p>
                        <p className="text-[11px] text-[#999]">{avis.date}</p>
                      </div>
                    </div>
                    <div className="flex gap-0.5">
                      {[1, 2, 3, 4, 5].map((s) => (
                        <svg key={s} xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill={s <= avis.rating ? "#C4704B" : "none"} stroke="#C4704B" strokeWidth="1.5"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>
                      ))}
                    </div>
                  </div>
                  <p className="mt-3 text-sm leading-[1.7] text-[#4a4a4a]">{avis.text}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {active === "faq" && (
          <div>
            <h3 className="text-2xl font-extrabold text-[#2C2C2C]">
              Questions fr&eacute;quentes
            </h3>
            <div className="mt-4 divide-y divide-[#F0ECE7]">
              {[
                { q: "Quels sont les d\u00e9lais de livraison ?", a: "Les commandes sont exp\u00e9di\u00e9es sous 3 \u00e0 5 jours ouvrables. La livraison en France m\u00e9tropolitaine prend g\u00e9n\u00e9ralement 2 \u00e0 4 jours suppl\u00e9mentaires." },
                { q: "Comment sont fabriqu\u00e9s les produits ?", a: "Chaque pi\u00e8ce est fabriqu\u00e9e \u00e0 la main par des artisans africains qualifi\u00e9s, en utilisant des techniques traditionnelles et des mat\u00e9riaux authentiques." },
                { q: "Puis-je retourner un produit ?", a: "Vous disposez de 14 jours apr\u00e8s r\u00e9ception pour retourner un produit dans son \u00e9tat d\u2019origine. Les frais de retour sont \u00e0 la charge du client." },
                { q: "Le paiement est-il s\u00e9curis\u00e9 ?", a: "Oui, tous les paiements sont s\u00e9curis\u00e9s via Stripe. Nous acceptons CB, Visa, Mastercard, PayPal, Apple Pay et Google Pay." },
              ].map((item, i) => (
                <details key={i} className="group py-4">
                  <summary className="flex cursor-pointer items-center justify-between text-[15px] font-semibold text-[#2C2C2C]">
                    {item.q}
                    <span className="ml-4 shrink-0 text-[#C4704B] transition-transform group-open:rotate-45">+</span>
                  </summary>
                  <p className="mt-3 text-sm leading-[1.7] text-[#6B6B6B]">
                    {item.a}
                  </p>
                </details>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

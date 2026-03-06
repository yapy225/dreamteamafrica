"use client";

import { useState } from "react";
import Image from "next/image";

interface ImageGalleryProps {
  images: string[];
  name: string;
  category: string;
}

/**
 * Build thumbnail list: use all product images,
 * then pad with styled "alternate view" placeholders if < 4.
 */
function buildThumbnails(images: string[], category: string) {
  const views: { type: "image" | "zoom" | "color"; src?: string; label: string }[] = [];

  // Real images first
  images.forEach((src, i) => {
    views.push({ type: "image", src, label: i === 0 ? "Vue principale" : `Vue ${i + 1}` });
  });

  // Pad with simulated views up to 4
  if (views.length < 4) {
    views.push({ type: "zoom", src: images[0], label: "Vue rapprochée" });
  }
  if (views.length < 4) {
    views.push({ type: "image", src: images[0], label: "Vue d'ensemble" });
  }
  if (views.length < 4) {
    views.push({ type: "color", label: category });
  }

  return views.slice(0, 5);
}

export default function ImageGallery({ images, name, category }: ImageGalleryProps) {
  const thumbs = buildThumbnails(images, category);
  const [activeIndex, setActiveIndex] = useState(0);

  const activeThumb = thumbs[activeIndex];
  const mainImage = activeThumb?.src || images[0];

  return (
    <div className="flex gap-3">
      {/* Thumbnails */}
      <div className="hidden w-16 flex-col gap-2 sm:flex">
        {thumbs.map((thumb, i) => (
          <button
            key={i}
            onClick={() => setActiveIndex(i)}
            className={`relative aspect-square overflow-hidden rounded-lg border-2 bg-[#F5F0EB] transition-all ${
              i === activeIndex
                ? "border-[#2C2C2C] shadow-sm"
                : "border-transparent hover:border-[#C4704B]/40"
            }`}
          >
            {thumb.type === "color" ? (
              <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-[#C4704B]/20 to-[#C4704B]/40">
                <span className="text-[8px] font-bold uppercase leading-tight text-[#C4704B]/80 text-center px-0.5">
                  {thumb.label}
                </span>
              </div>
            ) : (
              <Image
                src={thumb.src!}
                alt={`${name} - ${thumb.label}`}
                fill
                className={`object-cover ${thumb.type === "zoom" ? "scale-150" : ""}`}
                sizes="64px"
              />
            )}
          </button>
        ))}
      </div>

      {/* Main Image */}
      <div className="relative flex-1 overflow-hidden rounded-2xl bg-[#F5F0EB]">
        <div className="relative aspect-[3/4]">
          {mainImage && (
            <Image
              src={mainImage}
              alt={name}
              fill
              className={`object-contain transition-all duration-300 ${
                activeThumb?.type === "zoom" ? "scale-150" : ""
              }`}
              sizes="(max-width: 1024px) 100vw, 55vw"
              priority={activeIndex === 0}
            />
          )}
        </div>
      </div>
    </div>
  );
}

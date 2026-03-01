"use client";

import Image, { type ImageProps } from "next/image";

const CDN_URL = process.env.NEXT_PUBLIC_BUNNY_CDN_URL ?? "";

interface BunnyImageProps extends Omit<ImageProps, "src" | "loader"> {
  path: string;
  width?: number;
  height?: number;
  quality?: number;
}

function bunnyLoader({ src, width, quality }: { src: string; width: number; quality?: number }) {
  const params = new URLSearchParams({
    width: String(width),
    quality: String(quality ?? 80),
    optimizer: "image",
  });
  return `${src}?${params}`;
}

export default function BunnyImage({ path, alt, width, height, quality, ...rest }: BunnyImageProps) {
  const src = path.startsWith("http") ? path : `${CDN_URL}/${path.replace(/^\//, "")}`;

  return (
    <Image
      loader={bunnyLoader}
      src={src}
      alt={alt}
      width={width ?? 800}
      height={height ?? 600}
      quality={quality ?? 80}
      {...rest}
    />
  );
}

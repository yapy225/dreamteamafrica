"use client";

import { usePathname } from "next/navigation";
import NewsletterSection from "./NewsletterSection";

export default function GlobalSections() {
  const pathname = usePathname();

  if (pathname.startsWith("/dashboard")) return null;

  return (
    <>
      <NewsletterSection />
    </>
  );
}

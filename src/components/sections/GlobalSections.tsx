"use client";

import { usePathname } from "next/navigation";
import FAQ from "./FAQ";
import NewsletterSection from "./NewsletterSection";
import Comments from "./Comments";

export default function GlobalSections() {
  const pathname = usePathname();

  if (pathname.startsWith("/dashboard")) return null;

  return (
    <>
      <FAQ />
      <NewsletterSection />
      <Comments />
    </>
  );
}

"use client";

import { usePathname } from "next/navigation";
import NewsletterSection from "./NewsletterSection";
import Testimonials from "./Testimonials";

const TESTIMONIAL_SLUGS = [
  "/saison-culturelle-africaine/festival-de-lautre-culture",
];

export default function GlobalSections() {
  const pathname = usePathname();

  if (pathname.startsWith("/dashboard")) return null;

  return (
    <>
      {TESTIMONIAL_SLUGS.some((s) => pathname.startsWith(s)) && <Testimonials />}
      <NewsletterSection />
    </>
  );
}

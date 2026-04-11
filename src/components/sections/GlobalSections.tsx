"use client";

import { usePathname } from "next/navigation";
import NewsletterSection from "./NewsletterSection";
import Testimonials from "./Testimonials";

export default function GlobalSections() {
  const pathname = usePathname();

  if (pathname.startsWith("/dashboard")) return null;

  const isEventPage = pathname.startsWith("/saison-culturelle-africaine/") && pathname !== "/saison-culturelle-africaine";

  return (
    <>
      {isEventPage && <Testimonials />}
      <NewsletterSection />
    </>
  );
}

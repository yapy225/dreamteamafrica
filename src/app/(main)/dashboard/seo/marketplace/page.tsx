import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import { getSectionById } from "../seo-keywords-data";
import SeoSectionPage from "../SeoSectionPage";

export const metadata = { title: "SEO — Marketplace" };

export default async function MarketplaceSeoPage() {
  const session = await auth();
  if (!session) redirect("/auth/signin");
  if (session.user.role !== "ADMIN") redirect("/dashboard");

  const section = getSectionById("marketplace")!;
  return <SeoSectionPage section={section} />;
}

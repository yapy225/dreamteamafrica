import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import { getSectionById } from "../seo-keywords-data";
import SeoSectionPage from "../SeoSectionPage";

export const metadata = { title: "SEO — DTA ADS" };

export default async function AdsSeoPage() {
  const session = await auth();
  if (!session) redirect("/auth/signin");
  if (session.user.role !== "ADMIN") redirect("/dashboard");

  const section = getSectionById("ads")!;
  return <SeoSectionPage section={section} />;
}

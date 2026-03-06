import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import { getSectionById } from "../seo-keywords-data";
import SeoSectionPage from "../SeoSectionPage";

export const metadata = { title: "SEO — L'Officiel d'Afrique" };

export default async function OfficielSeoPage() {
  const session = await auth();
  if (!session) redirect("/auth/signin");
  if (session.user.role !== "ADMIN") redirect("/dashboard");

  const section = getSectionById("officiel-afrique")!;
  return <SeoSectionPage section={section} />;
}

import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import { getSectionById } from "../seo-keywords-data";
import SeoSectionPage from "../SeoSectionPage";

export const metadata = { title: "SEO — Événements & Foire d'Afrique" };

export default async function EvenementsSeoPage() {
  const session = await auth();
  if (!session) redirect("/auth/signin");
  if (session.user.role !== "ADMIN") redirect("/dashboard");

  const section = getSectionById("evenements")!;
  return <SeoSectionPage section={section} />;
}

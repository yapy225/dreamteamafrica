import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import ExposantsArticlesClient from "./ExposantsArticlesClient";

export const dynamic = "force-dynamic";
export const metadata = { title: "Articles Sponsorisés Exposants | Dashboard" };

export default async function ExposantsArticlesPage() {
  const session = await auth();
  if (!session) redirect("/auth/signin");
  if (session.user.role !== "ADMIN") redirect("/dashboard");

  return <ExposantsArticlesClient />;
}

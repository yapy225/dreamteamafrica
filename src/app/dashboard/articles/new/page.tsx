import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import ArticleForm from "../ArticleForm";

export const metadata = { title: "Nouvel article" };

export default async function NewArticlePage() {
  const session = await auth();
  if (!session) redirect("/auth/signin");
  if (session.user.role !== "ARTISAN" && session.user.role !== "ADMIN") {
    redirect("/dashboard");
  }

  return (
    <div className="mx-auto max-w-3xl px-4 py-12 sm:px-6">
      <h1 className="mb-8 font-serif text-3xl font-bold text-dta-dark">Nouvel article</h1>
      <div className="rounded-[var(--radius-card)] bg-white p-8 shadow-[var(--shadow-card)]">
        <ArticleForm />
      </div>
    </div>
  );
}

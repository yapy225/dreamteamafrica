import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import EmailInbox from "./EmailInbox";

export const dynamic = "force-dynamic";

export default async function EmailsPage() {
  const session = await auth();
  if (!session || session.user.role !== "ADMIN") {
    redirect("/auth/signin");
  }

  return (
    <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6 lg:px-8">
      <div className="mb-6">
        <h1 className="font-serif text-2xl font-bold text-dta-dark">
          Boite mail
        </h1>
        <p className="mt-1 text-sm text-dta-taupe">
          hello@dreamteamafrica.com
        </p>
      </div>
      <EmailInbox />
    </div>
  );
}

import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import WhatsAppInbox from "./WhatsAppInbox";

export const dynamic = "force-dynamic";

export default async function WhatsAppPage() {
  const session = await auth();
  if (!session || session.user.role !== "ADMIN") {
    redirect("/auth/signin");
  }

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      <div className="mb-6">
        <h1 className="font-serif text-2xl font-bold text-dta-dark">
          WhatsApp Business
        </h1>
        <p className="mt-1 text-sm text-dta-taupe">
          Messages reçus sur le +33 7 82 80 18 52
        </p>
      </div>
      <WhatsAppInbox />
    </div>
  );
}

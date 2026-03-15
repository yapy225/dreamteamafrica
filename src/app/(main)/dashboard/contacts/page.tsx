import { prisma } from "@/lib/db";
import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import ContactsDashboard from "./ContactsDashboard";

export const dynamic = "force-dynamic";
export const metadata = { title: "Prospects & Contacts" };

export default async function ContactsAdminPage() {
  const session = await auth();
  if (!session?.user?.id) redirect("/auth/signin");

  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
    select: { role: true },
  });
  if (user?.role !== "ADMIN") redirect("/dashboard");

  const messages = await prisma.contactMessage.findMany({
    orderBy: { createdAt: "desc" },
    include: { replies: { orderBy: { sentAt: "desc" } } },
  });

  return <ContactsDashboard messages={JSON.parse(JSON.stringify(messages))} />;
}

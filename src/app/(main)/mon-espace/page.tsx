import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/db";
import MonEspaceClient from "./MonEspaceClient";

export default async function MonEspacePage() {
  const session = await auth();

  if (!session?.user?.id) {
    redirect("/auth/signin?callbackUrl=/mon-espace");
  }

  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
    select: { name: true, email: true, createdAt: true, totpEnabled: true },
  });

  const tickets = await prisma.ticket.findMany({
    where: { userId: session.user.id },
    include: {
      event: { select: { title: true, venue: true, address: true, date: true, coverImage: true, slug: true } },
      payments: { orderBy: { paidAt: "desc" } },
    },
    orderBy: { purchasedAt: "desc" },
  });

  const serialized = tickets.map((t) => ({
    id: t.id,
    eventTitle: t.event.title,
    eventSlug: t.event.slug,
    venue: t.event.venue,
    address: t.event.address,
    date: t.event.date.toISOString(),
    coverImage: t.event.coverImage,
    visitDate: t.visitDate?.toISOString() || null,
    tier: t.tier,
    price: t.price,
    totalPaid: t.totalPaid,
    installments: t.installments,
    firstName: t.firstName,
    lastName: t.lastName,
    qrCode: t.qrCode,
    purchasedAt: t.purchasedAt.toISOString(),
    payments: t.payments.map((p) => ({
      id: p.id,
      amount: p.amount,
      type: p.type,
      label: p.label,
      paidAt: p.paidAt.toISOString(),
    })),
  }));

  return (
    <MonEspaceClient
      userName={user?.name || "vous"}
      userEmail={user?.email || ""}
      memberSince={user?.createdAt ? new Intl.DateTimeFormat("fr-FR", { month: "long", year: "numeric" }).format(user.createdAt) : ""}
      tickets={serialized}
      totpEnabled={user?.totpEnabled || false}
    />
  );
}

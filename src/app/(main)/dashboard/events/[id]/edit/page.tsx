import { redirect, notFound } from "next/navigation";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/db";
import EventForm from "../../EventForm";

export const dynamic = "force-dynamic";
export const metadata = { title: "Modifier l'événement" };

function toParisDatetimeString(date: Date): string {
  const parts = new Intl.DateTimeFormat("sv-SE", {
    timeZone: "Europe/Paris",
    year: "numeric", month: "2-digit", day: "2-digit",
    hour: "2-digit", minute: "2-digit",
    hour12: false,
  }).formatToParts(date);
  const get = (t: string) => parts.find((p) => p.type === t)?.value ?? "";
  return `${get("year")}-${get("month")}-${get("day")}T${get("hour")}:${get("minute")}`;
}

export default async function EditEventPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const session = await auth();
  if (!session) redirect("/auth/signin");
  // Accessible à tous les utilisateurs connectés

  const { id } = await params;
  const event = await prisma.event.findUnique({ where: { id } });
  if (!event) notFound();

  return (
    <div className="mx-auto max-w-3xl px-4 py-12 sm:px-6 lg:px-8">
      <h1 className="mb-8 font-serif text-3xl font-bold text-dta-dark">
        Modifier l&apos;événement
      </h1>
      <div className="rounded-[var(--radius-card)] bg-white p-6 shadow-[var(--shadow-card)] sm:p-8">
        <EventForm
          initialData={{
            id: event.id,
            title: event.title,
            slug: event.slug,
            description: event.description,
            coverImage: event.coverImage,
            venue: event.venue,
            address: event.address,
            venues: (event.venues as Array<{name:string;address:string}>) ?? null,
            date: toParisDatetimeString(event.date),
            endDate: event.endDate
              ? toParisDatetimeString(event.endDate)
              : null,
            capacity: event.capacity,
            showCapacity: event.showCapacity,
            program: (event.program as Array<{date:string;time:string;venue:string;address:string;type:string;title:string;director:string;synopsis:string;price:string;pricing:string;note:string}>) ?? null,
            tiers: (event.tiers as Array<{id:string;name:string;price:number;description:string;features:string[];highlight:boolean}>) ?? null,
            priceEarly: event.priceEarly,
            priceStd: event.priceStd,
            priceVip: event.priceVip,
            published: event.published,
          }}
        />
      </div>
    </div>
  );
}

import { notFound } from "next/navigation";
import Link from "next/link";
import { prisma } from "@/lib/db";
import { LISTING_CONFIG } from "@/lib/transfer-config";
import BuyListingClient from "./BuyListingClient";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "Acheter un billet — Bourse officielle de billets DTA",
};

export default async function ListingPage({
  params,
  searchParams,
}: {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ success?: string }>;
}) {
  const { id } = await params;
  const { success } = await searchParams;

  const listing = await prisma.ticketTransfer.findUnique({
    where: { id },
    include: {
      ticket: {
        include: {
          event: { select: { title: true, slug: true, venue: true, address: true, date: true, coverImage: true, published: true } },
        },
      },
    },
  });

  if (!listing) notFound();

  const dateStr = new Intl.DateTimeFormat("fr-FR", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  }).format(new Date(listing.ticket.event.date));

  if (success) {
    return (
      <main className="mx-auto max-w-lg px-4 py-16">
        <div className="rounded-2xl bg-white p-8 text-center shadow-lg">
          <div className="mx-auto mb-4 inline-flex rounded-full bg-green-100 p-3">
            <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#16a34a" strokeWidth="2">
              <path d="M20 6L9 17l-5-5" />
            </svg>
          </div>
          <h1 className="font-serif text-2xl font-bold text-dta-dark">Paiement reçu !</h1>
          <p className="mt-3 text-sm text-dta-char/70">
            Votre billet pour <strong>{listing.ticket.event.title}</strong> arrive par email d&apos;ici quelques minutes, QR code inclus.
          </p>
          <Link href="/bourse" className="mt-6 inline-flex rounded-xl bg-dta-accent px-6 py-3 text-sm font-semibold text-white hover:bg-dta-accent-dark">
            Retour à la Bourse
          </Link>
        </div>
      </main>
    );
  }

  if (listing.status !== "LISTED") {
    return (
      <main className="mx-auto max-w-lg px-4 py-16">
        <div className="rounded-2xl bg-white p-8 text-center shadow-lg">
          <h1 className="font-serif text-2xl font-bold text-dta-dark">Annonce indisponible</h1>
          <p className="mt-3 text-sm text-dta-char/70">Ce billet a été vendu ou retiré de la Bourse.</p>
          <Link href="/bourse" className="mt-6 inline-flex rounded-xl bg-dta-accent px-6 py-3 text-sm font-semibold text-white hover:bg-dta-accent-dark">
            Voir les autres billets
          </Link>
        </div>
      </main>
    );
  }

  if (!listing.ticket.event.published) notFound();

  const price = listing.publicPrice ? Number(listing.publicPrice) : Number(listing.ticket.price);
  const commission = Math.round(price * LISTING_CONFIG.COMMISSION_RATE * 100) / 100;
  const total = Math.round((price + commission) * 100) / 100;

  const fromInitial = listing.fromLastName ? listing.fromLastName[0].toUpperCase() + "." : "";
  const fromLabel = [listing.fromFirstName, fromInitial].filter(Boolean).join(" ") || "Un membre Dream Team Africa";

  return (
    <main className="mx-auto max-w-2xl px-4 py-12">
      <div className="overflow-hidden rounded-2xl bg-white shadow-lg">
        {listing.ticket.event.coverImage ? (
          <div className="relative h-56 w-full bg-slate-900">
            <img src={listing.ticket.event.coverImage} alt={listing.ticket.event.title} className="h-full w-full object-cover opacity-85" />
            <div className="absolute inset-0 bg-gradient-to-t from-slate-900/90 via-slate-900/20 to-transparent" />
            <div className="absolute bottom-4 left-5 right-5">
              <p className="text-[11px] uppercase tracking-wider text-amber-300">Bourse officielle de billets DTA — cédé par {fromLabel}</p>
              <h1 className="mt-1 font-serif text-2xl font-bold text-white">{listing.ticket.event.title}</h1>
            </div>
          </div>
        ) : (
          <div className="bg-gradient-to-br from-dta-accent to-dta-accent-dark p-8">
            <p className="text-[11px] uppercase tracking-wider text-white/70">Bourse officielle de billets DTA</p>
            <h1 className="mt-1 font-serif text-2xl font-bold text-white">{listing.ticket.event.title}</h1>
          </div>
        )}

        <div className="space-y-3 border-b border-slate-100 p-5 text-sm">
          <div className="flex gap-3"><span className="w-24 text-xs uppercase tracking-wider text-slate-400">Quand</span><span className="flex-1 font-medium text-slate-900">{dateStr}</span></div>
          <div className="flex gap-3"><span className="w-24 text-xs uppercase tracking-wider text-slate-400">Où</span><span className="flex-1 font-medium text-slate-900">{listing.ticket.event.venue}</span></div>
          <div className="flex gap-3"><span className="w-24 text-xs uppercase tracking-wider text-slate-400">Adresse</span><span className="flex-1 text-slate-600">{listing.ticket.event.address}</span></div>
          <div className="flex gap-3"><span className="w-24 text-xs uppercase tracking-wider text-slate-400">Catégorie</span><span className="flex-1 font-semibold text-dta-accent">{listing.ticket.tier}</span></div>
        </div>

        <div className="border-b border-slate-100 bg-slate-50 p-5">
          <div className="flex items-baseline justify-between text-sm">
            <span className="text-slate-600">Prix du billet</span>
            <span className="font-bold text-slate-900">{price.toFixed(2)} €</span>
          </div>
          <div className="mt-1 flex items-baseline justify-between text-sm">
            <span className="text-slate-500">Frais de service ({Math.round(LISTING_CONFIG.COMMISSION_RATE * 100)} %)</span>
            <span className="text-slate-700">{commission.toFixed(2)} €</span>
          </div>
          <div className="mt-3 flex items-baseline justify-between border-t border-slate-200 pt-3 text-sm">
            <span className="font-semibold text-slate-900">Total</span>
            <span className="font-serif text-2xl font-bold text-dta-accent">{total.toFixed(2)} €</span>
          </div>
        </div>

        <BuyListingClient listingId={listing.id} />
      </div>
    </main>
  );
}

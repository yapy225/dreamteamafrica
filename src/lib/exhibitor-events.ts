export interface ExhibitorEvent {
  id: string;
  title: string;
  date: string;
  endDate?: string;
  days: number;
  venue: string;
  address: string;
  hours: string;
}

export const EXHIBITOR_EVENTS: ExhibitorEvent[] = [
  {
    id: "foire-dafrique-paris",
    title: "Foire d'Afrique Paris 2026",
    date: "2026-05-01",
    endDate: "2026-05-02",
    days: 2,
    venue: "Espace MAS",
    address: "10 rue des terres au curé, Paris 13e",
    hours: "12h – 22h",
  },
  {
    id: "festival-autre-culture",
    title: "Festival de l'Autre Culture",
    date: "2026-06-27",
    days: 1,
    venue: "Espace Culturel",
    address: "28 Av. de Neuilly, 94120 Fontenay-sous-Bois",
    hours: "12h – 22h",
  },
  {
    id: "festival-cinema-africain",
    title: "Festival International du Cinéma Africain",
    date: "2026-09-01",
    days: 1,
    venue: "Maison des Citoyens",
    address: "Fontenay-sous-Bois",
    hours: "10h – 22h",
  },
  {
    id: "fashion-week-africa",
    title: "Fashion Week Africa",
    date: "2026-10-03",
    days: 1,
    venue: "Espace MAS",
    address: "10 rue des terres au curé, Paris 13e",
    hours: "12h – 22h",
  },
  {
    id: "juste-une-danse",
    title: "Juste Une Danse",
    date: "2026-10-29",
    days: 1,
    venue: "Espace MAS",
    address: "Paris 13e",
    hours: "12h – 22h",
  },
  {
    id: "festival-conte-africain",
    title: "Festival du Conte Africain",
    date: "2026-11-11",
    days: 1,
    venue: "Espace MAS",
    address: "Paris 13e",
    hours: "12h – 22h",
  },
  {
    id: "salon-made-in-africa",
    title: "Salon Made In Africa",
    date: "2026-12-11",
    endDate: "2026-12-12",
    days: 2,
    venue: "Espace MAS",
    address: "Paris 13e",
    hours: "12h – 22h",
  },
];

export interface ExhibitorPackInfo {
  id: "ENTREPRENEUR_1J" | "ENTREPRENEUR" | "RESTAURATION";
  name: string;
  pricePerDay: number;
  /** Tarif préférentiel par jour quand l'exposant réserve tous les événements */
  allEventsPricePerDay: number;
  description: string;
  kit: string[];
  highlight?: boolean;
}

export const EXHIBITOR_PACKS: ExhibitorPackInfo[] = [
  {
    id: "ENTREPRENEUR_1J",
    name: "Pack Entrepreneur 1 jour",
    pricePerDay: 190,
    allEventsPricePerDay: 170,
    description: "Stand exposant 2 m² pour 1 journée — idéal pour tester",
    kit: [
      "1 table (1,50 m x 0,60 m)",
      "2 chaises",
      "2 badges exposants",
    ],
  },
  {
    id: "ENTREPRENEUR",
    name: "Pack Entrepreneur 2 jours",
    pricePerDay: 160,
    allEventsPricePerDay: 150,
    description: "Stand exposant 2 m² — idéal pour présenter vos produits et services",
    kit: [
      "1 table (1,50 m x 0,60 m)",
      "2 chaises",
      "2 badges exposants",
    ],
  },
  {
    id: "RESTAURATION",
    name: "Pack Restauration 2 jours",
    pricePerDay: 500,
    allEventsPricePerDay: 450,
    description: "Espace restauration — pour les traiteurs et food entrepreneurs",
    kit: [
      "2 tables",
      "4 chaises",
      "4 badges exposants",
    ],
    highlight: true,
  },
];

/** Check if all events are selected */
export function isAllEvents(eventIds: string[]): boolean {
  return EXHIBITOR_EVENTS.every((e) => eventIds.includes(e.id));
}

export function calculatePrice(
  packId: string,
  eventIds: string[]
): { totalDays: number; totalPrice: number; fullPrice: number } {
  const pack = EXHIBITOR_PACKS.find((p) => p.id === packId);
  if (!pack) return { totalDays: 0, totalPrice: 0, fullPrice: 0 };

  // Support legacy SAISON pack → map to ENTREPRENEUR with all events
  const effectivePackId = packId === "SAISON" ? "ENTREPRENEUR" : packId;
  const effectivePack = EXHIBITOR_PACKS.find((p) => p.id === effectivePackId) ?? pack;
  const effectiveEvents = packId === "SAISON"
    ? EXHIBITOR_EVENTS.map((e) => e.id)
    : eventIds;

  const selectedEvents = EXHIBITOR_EVENTS.filter((e) => effectiveEvents.includes(e.id));
  const allSelected = isAllEvents(effectiveEvents);

  const totalDays = effectivePackId === "ENTREPRENEUR_1J"
    ? selectedEvents.length
    : selectedEvents.reduce((sum, e) => sum + e.days, 0);

  const pricePerDay = allSelected ? effectivePack.allEventsPricePerDay : effectivePack.pricePerDay;
  const fullPrice = totalDays * effectivePack.pricePerDay;
  const totalPrice = totalDays * pricePerDay;

  return { totalDays, totalPrice, fullPrice };
}

// ── Payment configuration ──
// Deposit amount charged upfront to secure the booking.
// The remaining balance (totalPrice - DEPOSIT) is payable in monthly installments.
export const DEPOSIT_AMOUNT = 50;
export const MAX_INSTALLMENTS = 10;

export function formatDate(dateStr: string): string {
  return new Date(dateStr + "T12:00:00").toLocaleDateString("fr-FR", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}

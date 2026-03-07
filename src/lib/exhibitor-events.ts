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
  id: "ENTREPRENEUR_1J" | "ENTREPRENEUR" | "RESTAURATION" | "SAISON";
  name: string;
  pricePerDay: number;
  description: string;
  kit: string[];
  highlight?: boolean;
}

export const EXHIBITOR_PACKS: ExhibitorPackInfo[] = [
  {
    id: "ENTREPRENEUR_1J",
    name: "Pack Entrepreneur 1 jour",
    pricePerDay: 190,
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
    description: "Espace restauration — pour les traiteurs et food entrepreneurs",
    kit: [
      "2 tables",
      "4 chaises",
      "4 badges exposants",
    ],
    highlight: true,
  },
  {
    id: "SAISON",
    name: "Pack Saison Complète",
    pricePerDay: 150,
    description: "Exposez sur les 4 événements de la saison 2026 — tarif préférentiel",
    kit: [
      "1 table (1,50 m x 0,60 m)",
      "2 chaises",
      "2 badges exposants",
      "Présence sur les 4 événements",
    ],
  },
];

export function calculatePrice(
  packId: string,
  eventIds: string[]
): { totalDays: number; totalPrice: number } {
  const pack = EXHIBITOR_PACKS.find((p) => p.id === packId);
  if (!pack) return { totalDays: 0, totalPrice: 0 };

  if (packId === "SAISON") {
    const totalDays = EXHIBITOR_EVENTS.reduce((sum, e) => sum + e.days, 0);
    return { totalDays, totalPrice: totalDays * pack.pricePerDay };
  }

  const selectedEvents = EXHIBITOR_EVENTS.filter((e) => eventIds.includes(e.id));
  // Pack 1 jour = 1 jour par événement, sinon tous les jours de l'événement
  const totalDays = packId === "ENTREPRENEUR_1J"
    ? selectedEvents.length
    : selectedEvents.reduce((sum, e) => sum + e.days, 0);
  return { totalDays, totalPrice: totalDays * pack.pricePerDay };
}

export function formatDate(dateStr: string): string {
  return new Date(dateStr + "T12:00:00").toLocaleDateString("fr-FR", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}

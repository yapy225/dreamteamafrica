/**
 * Génération de devis exposant PDF — Dream Team Africa
 * Modèle réutilisable pour tous les exposants de la Saison Culturelle 2026.
 *
 * Usage :
 *   import { generateDevisExposant } from "@/lib/generate-devis-exposant";
 *   const buffer = await generateDevisExposant({ name, company, email, phone, pack, totalPrice });
 */

import PDFDocument from "pdfkit";
import { EXHIBITOR_EVENTS } from "./exhibitor-events";

// ── Couleurs DTA ──
const GOLD = "#8B6F4E";
const DARK = "#1a1a1a";
const GREY = "#666666";
const LIGHT_GREY = "#999999";
const BG_CREAM = "#F9F6F2";

// ── Descriptions des événements ──
const EVENT_DESCRIPTIONS: Record<string, string> = {
  "foire-dafrique-paris":
    "Le plus grand salon de la culture africaine à Paris. Artisanat, gastronomie, musique live et conférences.",
  "festival-autre-culture":
    "Festival multiculturel en plein air. Musique, danse, gastronomie et rencontres dans un cadre verdoyant.",
  "festival-cinema-africain":
    "Deux jours de cinéma, de mémoire et de dialogue. Projections et débats avec des réalisateurs africains.",
  "fashion-week-africa":
    "Les créateurs africains sur les podiums parisiens. Défilés, mode contemporaine et savoir-faire du continent.",
  "juste-une-danse":
    "Festival des danses traditionnelles et contemporaines africaines. Spectacles, compétitions et ateliers.",
  "festival-conte-africain":
    "Les griots et conteurs d'Afrique partagent leurs histoires millénaires. Spectacles pour toute la famille.",
  "salon-made-in-africa":
    "L'artisanat africain à l'honneur. Mode, décoration, cosmétiques, épicerie fine. 500+ artisans exposants.",
};

// ── Types ──
export interface DevisExposantInput {
  /** Nom complet du client */
  name: string;
  /** Nom de l'entreprise / marque */
  company: string;
  /** Email du client */
  email: string;
  /** Téléphone du client */
  phone: string;
  /** Événement principal réservé (slug) — par défaut "foire-dafrique-paris" */
  eventSlug?: string;
  /** Pack choisi */
  pack: "ENTREPRENEUR_1J" | "ENTREPRENEUR" | "RESTAURATION";
  /** Nombre de jours */
  totalDays: number;
  /** Prix par jour */
  pricePerDay: number;
  /** Prix total */
  totalPrice: number;
  /** Numéro de devis (auto-généré si absent) */
  devisNumber?: string;
}

const PACK_NAMES: Record<string, string> = {
  ENTREPRENEUR_1J: "Pack Entrepreneur 1 jour",
  ENTREPRENEUR: "Pack Entrepreneur 2 jours",
  RESTAURATION: "Pack Restauration 2 jours",
};

const PACK_KIT: Record<string, string> = {
  ENTREPRENEUR_1J: "Stand 2 m² • 1 table (1,50m × 0,60m) • 2 chaises • 2 badges",
  ENTREPRENEUR: "Stand 2 m² • 1 table (1,50m × 0,60m) • 2 chaises • 2 badges",
  RESTAURATION: "Espace restauration • 2 tables • 4 chaises • 4 badges",
};

function fmt(n: number) {
  return n.toLocaleString("fr-FR") + " €";
}

function formatEventDate(dateStr: string, endDate?: string): string {
  const d = new Date(dateStr + "T12:00:00");
  const opts: Intl.DateTimeFormatOptions = { day: "numeric", month: "long", year: "numeric" };
  if (endDate) {
    const d2 = new Date(endDate + "T12:00:00");
    return `${d.getDate()} & ${d2.toLocaleDateString("fr-FR", opts)}`;
  }
  return d.toLocaleDateString("fr-FR", opts);
}

function drawLine(doc: PDFKit.PDFDocument, y: number, color = "#e5e5e5") {
  doc.moveTo(40, y).lineTo(555, y).strokeColor(color).lineWidth(0.5).stroke();
}

function drawThickLine(doc: PDFKit.PDFDocument, y: number) {
  doc.moveTo(40, y).lineTo(555, y).strokeColor(GOLD).lineWidth(2).stroke();
}

/**
 * Génère un devis exposant PDF et retourne le Buffer.
 */
export async function generateDevisExposant(input: DevisExposantInput): Promise<Buffer> {
  const eventSlug = input.eventSlug ?? "foire-dafrique-paris";
  const mainEvent = EXHIBITOR_EVENTS.find((e) => e.id === eventSlug) ?? EXHIBITOR_EVENTS[0];

  const devisNum = input.devisNumber ?? `DTA-2026-${String(Date.now()).slice(-4)}`;
  const devisDate = new Date().toLocaleDateString("fr-FR", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
  const validUntil = new Date(Date.now() + 15 * 86400000).toLocaleDateString("fr-FR", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });

  const doc = new PDFDocument({ size: "A4", margin: 40 });
  const chunks: Buffer[] = [];
  doc.on("data", (chunk: Buffer) => chunks.push(chunk));

  const L = 40; // marge gauche
  const R = 555; // marge droite
  const W = R - L; // largeur utile

  // ═══════════════════════════════════════
  // EN-TÊTE
  // ═══════════════════════════════════════
  doc.fontSize(22).font("Helvetica-Bold").fillColor(GOLD).text("Dream Team Africa", L, 35);
  doc.fontSize(8).font("Helvetica").fillColor(LIGHT_GREY)
    .text("SAISON CULTURELLE AFRICAINE 2026", L, 58, { characterSpacing: 2 });
  drawThickLine(doc, 72);

  // ═══════════════════════════════════════
  // DEVIS + CLIENT
  // ═══════════════════════════════════════
  const topY = 80;

  doc.fontSize(14).font("Helvetica-Bold").fillColor(DARK).text("DEVIS", L, topY);
  doc.fontSize(8).font("Helvetica").fillColor(GREY);
  doc.text(`N° ${devisNum}`, L, topY + 18);
  doc.text(`Date : ${devisDate}`, L, topY + 28);
  doc.text(`Valable jusqu'au : ${validUntil}`, L, topY + 38);

  doc.fontSize(8).font("Helvetica-Bold").fillColor(GOLD).text("CLIENT", 350, topY);
  doc.fontSize(9).font("Helvetica-Bold").fillColor(DARK).text(input.name, 350, topY + 13);
  doc.fontSize(8).font("Helvetica").fillColor(GREY);
  doc.text(input.company, 350, topY + 25);
  doc.text(input.email, 350, topY + 35);
  doc.text(input.phone, 350, topY + 45);

  // ═══════════════════════════════════════
  // ÉVÉNEMENT PRINCIPAL
  // ═══════════════════════════════════════
  let y = 138;
  drawThickLine(doc, y);
  y += 8;

  const eventDateStr = formatEventDate(mainEvent.date, mainEvent.endDate);
  doc.fontSize(11).font("Helvetica-Bold").fillColor(GOLD).text(`${mainEvent.title}`, L, y);
  y += 16;
  doc.fontSize(8).font("Helvetica").fillColor(GREY)
    .text(`${eventDateStr}  •  ${mainEvent.hours}  •  ${mainEvent.venue}, ${mainEvent.address}`, L, y);
  y += 14;

  // Tableau principal — Header
  doc.rect(L, y, W, 18).fill(GOLD);
  doc.fontSize(8).font("Helvetica-Bold").fillColor("#ffffff");
  doc.text("Désignation", L + 8, y + 5);
  doc.text("Jours", 340, y + 5, { width: 45, align: "center" });
  doc.text("Prix/jour", 395, y + 5, { width: 55, align: "right" });
  doc.text("Total", 465, y + 5, { width: 55, align: "right" });
  y += 18;

  // Ligne Pack
  doc.fontSize(8).font("Helvetica-Bold").fillColor(DARK)
    .text(PACK_NAMES[input.pack] ?? input.pack, L + 8, y + 5);
  doc.fontSize(7).font("Helvetica").fillColor(GREY)
    .text(PACK_KIT[input.pack] ?? "", L + 8, y + 15);
  doc.fontSize(8).font("Helvetica").fillColor(DARK);
  doc.text(String(input.totalDays), 340, y + 8, { width: 45, align: "center" });
  doc.text(fmt(input.pricePerDay), 395, y + 8, { width: 55, align: "right" });
  doc.font("Helvetica-Bold").text(fmt(input.totalPrice), 465, y + 8, { width: 55, align: "right" });
  y += 28;
  drawLine(doc, y);

  // Capsule vidéo promo
  y += 4;
  doc.fontSize(8).font("Helvetica").fillColor(DARK).text("Capsule vidéo promotionnelle personnalisée", L + 8, y);
  doc.fontSize(7).font("Helvetica").fillColor(GREY)
    .text("Diffusée sur +28 pages réseaux sociaux Dream Team Africa", L + 8, y + 10);
  doc.fontSize(8).font("Helvetica-Bold").fillColor(GOLD).text("OFFERT", 465, y + 4, { width: 55, align: "right" });
  y += 22;
  drawLine(doc, y);

  // Référencement Officiel d'Afrique
  y += 4;
  doc.fontSize(8).font("Helvetica").fillColor(DARK).text("Référencement dans L'Officiel d'Afrique", L + 8, y);
  doc.fontSize(7).font("Helvetica").fillColor(GREY)
    .text("Annuaire professionnel en ligne — visibilité permanente", L + 8, y + 10);
  doc.fontSize(8).font("Helvetica-Bold").fillColor(GOLD).text("OFFERT", 465, y + 4, { width: 55, align: "right" });
  y += 22;
  drawLine(doc, y);

  // TOTAL
  y += 5;
  doc.rect(L, y, W, 22).fill(BG_CREAM);
  doc.fontSize(9).font("Helvetica-Bold").fillColor(DARK).text(`TOTAL — ${mainEvent.title}`, L + 8, y + 6);
  doc.fontSize(11).font("Helvetica-Bold").fillColor(GOLD).text(fmt(input.totalPrice), 445, y + 5, { width: 80, align: "right" });
  y += 27;

  // Modalités paiement
  doc.fontSize(7).font("Helvetica").fillColor(GREY);
  doc.text("Acompte de 50 € pour confirmer la réservation — Solde payable en mensualités (jusqu'à 10 fois sans frais)", L + 8, y);
  y += 12;

  // ═══════════════════════════════════════
  // NOS ÉVÉNEMENTS — SAISON
  // ═══════════════════════════════════════
  y += 6;
  drawThickLine(doc, y);
  y += 7;

  doc.fontSize(10).font("Helvetica-Bold").fillColor(GOLD)
    .text("Nos événements — Saison Culturelle Africaine 2026", L, y);
  y += 15;
  doc.fontSize(7).font("Helvetica").fillColor(GREY)
    .text("Retrouvez-nous tout au long de l'année sur ces 7 rendez-vous incontournables de la culture africaine à Paris.", L, y);
  y += 12;

  for (const ev of EXHIBITOR_EVENTS) {
    const dateLabel = formatEventDate(ev.date, ev.endDate);
    const desc = EVENT_DESCRIPTIONS[ev.id] ?? "";

    doc.fontSize(8).font("Helvetica-Bold").fillColor(DARK).text(ev.title, L + 8, y, { width: 290 });
    doc.fontSize(8).font("Helvetica-Bold").fillColor(GOLD).text(dateLabel, 350, y, { width: 175, align: "right" });
    y += 11;
    doc.fontSize(7).font("Helvetica").fillColor(GREY).text(desc, L + 8, y, { width: 485 });
    y += doc.heightOfString(desc, { width: 485 }) + 5;
    drawLine(doc, y);
    y += 5;
  }

  // ═══════════════════════════════════════
  // PIED DE PAGE
  // ═══════════════════════════════════════
  y += 10;
  drawLine(doc, y, GOLD);
  y += 8;

  doc.fontSize(8).font("Helvetica-Bold").fillColor(DARK).text("Pour confirmer votre réservation :", L, y);
  y += 13;

  // Liens sur une seule ligne compacte
  doc.fontSize(7).font("Helvetica").fillColor(GOLD);
  doc.text("En ligne : ", L + 8, y, { continued: true });
  doc.font("Helvetica-Bold").text(`dreamteamafrica.com/resa-exposants/${eventSlug}`, {
    link: `https://dreamteamafrica.com/resa-exposants/${eventSlug}`,
    underline: true,
  });
  y += 11;

  doc.fontSize(7).font("Helvetica").fillColor(GOLD).text("Par WhatsApp : ", L + 8, y, { continued: true });
  doc.font("Helvetica-Bold").text("wa.me/33782801852", {
    link: "https://wa.me/33782801852",
    underline: true,
    continued: true,
  });
  doc.font("Helvetica").text("    Vidéo promo : ", { continued: true, underline: false });
  doc.font("Helvetica-Bold").text("tally.so/r/31GKbl", {
    link: "https://tally.so/r/31GKbl",
    underline: true,
    continued: true,
  });
  doc.font("Helvetica").text("    Notre site : ", { continued: true, underline: false });
  doc.font("Helvetica-Bold").text("dreamteamafrica.com", {
    link: "https://dreamteamafrica.com",
    underline: true,
  });
  y += 16;

  doc.fontSize(7).font("Helvetica").fillColor(LIGHT_GREY);
  doc.text("Dream Team Africa — Saison Culturelle Africaine 2026  •  Yvylee KOFFI — +33 7 82 80 18 52 — hello@dreamteamafrica.com", L, y);
  doc.text("TVA non applicable, art. 293 B du CGI", L, y + 9);

  doc.end();

  return new Promise<Buffer>((resolve) => {
    doc.on("end", () => resolve(Buffer.concat(chunks)));
  });
}

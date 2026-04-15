/**
 * Génère la facture PDF pour Leina (Jeux Izika) — CLMA
 * Salon Made In Africa du 19 décembre 2025 — 150 € TTC — payé le 09/12/2025
 *
 * Usage : npx tsx scripts/generate-facture-leina-izika.ts
 */
import PDFDocument from "pdfkit";
import fs from "fs";
import path from "path";

const OUTPUT = path.join(__dirname, "..", "Facture-CLMA-JeuxIzika-SalonMadeInAfrica-2025.pdf");

const ACCENT = "#C4704B"; // orange terracotta
const DARK = "#1A1A1A";
const GREY = "#666666";
const LIGHT = "#999999";
const GREEN = "#16A34A";
const BORDER = "#E8DFD3";
const ROW_BG = "#FAFAF7";

const L = 50;
const R = 545;
const W = R - L;

async function main() {
  const doc = new PDFDocument({ size: "A4", margin: L });
  const stream = fs.createWriteStream(OUTPUT);
  doc.pipe(stream);

  // ── HEADER ─────────────────────────────────────────────
  doc.fontSize(22).font("Helvetica-Bold").fillColor(DARK).text("DREAM TEAM AFRICA", L, 50);
  doc.fontSize(8).font("Helvetica").fillColor(GREY)
    .text("Association Loi 1901", L, 78)
    .text("16 rue du Révérend Père Lucien Aubry", L, 90)
    .text("94120 Fontenay-sous-Bois", L, 102)
    .text("Tél : 07 82 80 18 52", L, 114)
    .text("Email : hello@dreamteamafrica.com", L, 126);

  // Right — FACTURE + number
  doc.fontSize(28).font("Helvetica-Bold").fillColor(ACCENT)
    .text("FACTURE", L + 300, 50, { width: W - 300, align: "right" });
  doc.fontSize(10).font("Helvetica").fillColor(DARK)
    .text("N° : FA-2025-SMIA-002", L + 300, 88, { width: W - 300, align: "right" })
    .text("Date : 15 avril 2026", L + 300, 102, { width: W - 300, align: "right" })
    .text("Échéance : Payée", L + 300, 116, { width: W - 300, align: "right" });

  // Separator
  doc.moveTo(L, 150).lineTo(R, 150).strokeColor(ACCENT).lineWidth(0.8).stroke();

  // ── FACTURÉ À / ÉVÉNEMENT ────────────────────────────
  doc.fontSize(9).font("Helvetica-Bold").fillColor(DARK).text("FACTURÉ À :", L, 170);
  doc.fontSize(10).font("Helvetica").fillColor(DARK)
    .text("CLMA", L, 187)
    .text("200 rue Edouard Tremblay", L, 201)
    .text("94400 Vitry-sur-Seine", L, 215)
    .text("France", L, 229)
    .fillColor(GREY).fontSize(9)
    .text("Contact : Leina — Les Jeux Izika", L, 245);

  doc.fontSize(9).font("Helvetica-Bold").fillColor(DARK).text("ÉVÉNEMENT :", L + 280, 170);
  doc.fontSize(10).font("Helvetica").fillColor(DARK)
    .text("Salon Made In Africa", L + 280, 187)
    .text("19 décembre 2025", L + 280, 201)
    .text("Espace MAS — Paris 13e", L + 280, 215);

  // ── TABLE ─────────────────────────────────────────────
  const tTop = 285;
  doc.rect(L, tTop, W, 26).fill(DARK);
  doc.fontSize(9).font("Helvetica-Bold").fillColor("#ffffff")
    .text("DÉSIGNATION", L + 12, tTop + 9, { width: 280 })
    .text("QTÉ", L + 305, tTop + 9, { width: 40, align: "center" })
    .text("PRIX UNIT.", L + 355, tTop + 9, { width: 70, align: "right" })
    .text("TOTAL", L + 435, tTop + 9, { width: 60, align: "right" });

  const rTop = tTop + 26;
  doc.rect(L, rTop, W, 40).fill(ROW_BG);
  doc.fontSize(10).font("Helvetica-Bold").fillColor(DARK)
    .text("Stand exposant — Salon Made In Africa", L + 12, rTop + 8, { width: 280 });
  doc.fontSize(8).font("Helvetica").fillColor(GREY)
    .text("Validation du stand (19 décembre 2025 — 1 jour)", L + 12, rTop + 24, { width: 280 });
  doc.fontSize(10).font("Helvetica").fillColor(DARK)
    .text("1", L + 305, rTop + 14, { width: 40, align: "center" })
    .text("150,00 €", L + 355, rTop + 14, { width: 70, align: "right" })
    .text("150,00 €", L + 435, rTop + 14, { width: 60, align: "right" });

  // ── TOTALS ────────────────────────────────────────────
  let y = rTop + 60;
  doc.fontSize(10).font("Helvetica").fillColor(GREY)
    .text("Sous-total HT", L + 280, y, { width: 150 })
    .fillColor(DARK)
    .text("150,00 €", L + 435, y, { width: 60, align: "right" });

  y += 20;
  doc.fillColor(GREY).text("TVA (non applicable)", L + 280, y, { width: 150 })
    .fillColor(DARK).text("0,00 €", L + 435, y, { width: 60, align: "right" });

  y += 14;
  doc.fontSize(8).fillColor(LIGHT).text("TVA non applicable — Art. 293 B du CGI", L + 280, y);

  y += 22;
  doc.moveTo(L + 280, y).lineTo(R, y).strokeColor(ACCENT).lineWidth(0.8).stroke();

  y += 10;
  doc.fontSize(14).font("Helvetica-Bold").fillColor(DARK)
    .text("TOTAL TTC", L + 280, y, { width: 100 })
    .text("150,00 €", L + 400, y, { width: 95, align: "right" });

  // ── PAYÉE banner ──────────────────────────────────────
  y += 38;
  doc.rect(L + 280, y, W - 280, 34).fill(GREEN);
  doc.fontSize(14).font("Helvetica-Bold").fillColor("#ffffff")
    .text("PAYÉE", L + 280, y + 9, { width: W - 280, align: "center" });

  // ── PAYMENT HISTORY ───────────────────────────────────
  y += 60;
  doc.fontSize(10).font("Helvetica").fillColor(GREY)
    .text("Paiement reçu le 9 décembre 2025 — 150,00 €", L, y);

  // ── FOOTER ────────────────────────────────────────────
  y += 30;
  doc.moveTo(L, y).lineTo(R, y).strokeColor(BORDER).lineWidth(0.5).stroke();
  y += 10;
  doc.fontSize(8).fillColor(GREY)
    .text("Conditions de paiement : Paiement reçu — Merci.", L, y);
  y += 12;
  doc.text("TVA non applicable — Article 293 B du Code Général des Impôts.", L, y);
  y += 12;
  doc.text("Association Dream Team Africa — Loi 1901", L, y);

  // Bottom footer (absolute bottom) — disable auto-pagination
  doc.page.margins.bottom = 0;
  const fY = doc.page.height - 40;
  doc.fontSize(7).fillColor(LIGHT).text(
    "Dream Team Africa — 16 rue du Rév. Père L. Aubry, 94120 Fontenay-sous-Bois — hello@dreamteamafrica.com — 07 82 80 18 52",
    L, fY, { width: W, align: "center", lineBreak: false },
  );

  doc.end();
  await new Promise<void>((resolve) => stream.on("finish", () => resolve()));
  console.log(`✅ Facture générée : ${OUTPUT}`);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});

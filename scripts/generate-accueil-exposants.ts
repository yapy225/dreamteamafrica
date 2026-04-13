/**
 * Génère le PDF "Accueil Exposants — Foire d'Afrique Paris 2026" — 1 page
 * Usage : npx tsx scripts/generate-accueil-exposants.ts
 */
import PDFDocument from "pdfkit";
import fs from "fs";
import path from "path";

const OUTPUT = path.join(__dirname, "..", "accueil-exposants-foire-2026.pdf");

const GOLD = "#D4AF37";
const DARK = "#1A1A1A";
const GREY = "#555555";
const LIGHT_GREY = "#999999";
const TERRACOTTA = "#C4704B";
const BG = "#FAF8F4";
const L = 40;
const R = 555;
const W = R - L;

function line(doc: PDFKit.PDFDocument, y: number) {
  doc.moveTo(L, y).lineTo(R, y).strokeColor("#E8DFD3").lineWidth(0.4).stroke();
}

function section(doc: PDFKit.PDFDocument, title: string, y: number): number {
  doc.fontSize(8).font("Helvetica-Bold").fillColor(TERRACOTTA).text(title.toUpperCase(), L, y);
  return y + 12;
}

function b(doc: PDFKit.PDFDocument, text: string, x: number, y: number): number {
  doc.fontSize(7.5).font("Helvetica").fillColor(GREY).text("- " + text, x, y, { width: 490 });
  return y + doc.heightOfString("- " + text, { width: 490 }) + 1;
}

async function main() {
  const doc = new PDFDocument({ size: "A4", margin: L });
  const stream = fs.createWriteStream(OUTPUT);
  doc.pipe(stream);

  // HEADER
  doc.rect(0, 0, 595, 65).fill(DARK);
  doc.fontSize(16).font("Helvetica-Bold").fillColor(GOLD).text("FOIRE D'AFRIQUE PARIS 2026", L, 15);
  doc.fontSize(9).font("Helvetica").fillColor("#ffffff").text("6eme Edition -- Accueil des Exposants", L, 36);
  doc.fontSize(7).fillColor("rgba(255,255,255,0.4)").text("AFRIQUE  -  CULTURE  -  HERITAGE", L, 50);

  let y = 75;

  // INTRO
  doc.fontSize(8).font("Helvetica").fillColor(GREY).text("Chers exposants,", L, y);
  y += 11;
  doc.fontSize(7.5).text("Nous avons le plaisir de vous accueillir a la 6eme edition de la Foire d'Afrique Paris. Votre presence contribue a faire rayonner le patrimoine africain au coeur de Paris. Merci de faire partie de cette aventure.", L, y, { width: W, lineGap: 1 });
  y += 28;

  // DATES & LIEU
  doc.rect(L, y, W, 28).fill(BG);
  doc.fontSize(8).font("Helvetica-Bold").fillColor(DARK);
  doc.text("DATES : 1er et 2 mai 2026          LIEU : Espace MAS, 10 rue des Terres au Cure, 75013 Paris", L + 10, y + 9);
  y += 34;

  // HORAIRES
  y = section(doc, "Horaires d'ouverture au public", y);
  doc.fontSize(7.5).font("Helvetica").fillColor(GREY);
  doc.text("1er mai : 11h - 22h     |     2 mai : 10h - 22h", L + 15, y);
  y += 12; line(doc, y); y += 6;

  // INSTALLATION
  y = section(doc, "Installation, livraison & logistique", y);
  y = b(doc, "Installation des stands : de 7h30 a 9h30 chaque matin", L + 15, y);
  y = b(doc, "Livraison : Acces direct de plain-pied devant l'Espace MAS", L + 15, y);
  y = b(doc, "ATTENTION : Pas de parking disponible pour les exposants", L + 15, y);
  y += 3; line(doc, y); y += 6;

  // ATTRIBUTION
  y = section(doc, "Attribution des stands", y);
  doc.fontSize(7.5).font("Helvetica").fillColor(GREY)
    .text("Les stands seront remis le matin meme a l'accueil. Merci de respecter les horaires pour une installation optimale.", L + 15, y, { width: 490 });
  y += 14; line(doc, y); y += 6;

  // AMÉNAGEMENT — 2 colonnes
  y = section(doc, "Amenagement des stands", y);

  const colLeft = L + 15;
  const colRight = 300;

  doc.fontSize(7.5).font("Helvetica-Bold").fillColor(DARK).text("Stands d'exposition :", colLeft, y);
  doc.text("Stands de restauration :", colRight, y);
  y += 10;
  doc.fontSize(7.5).font("Helvetica").fillColor(GREY);
  doc.text("- 1 table (1,50 m)\n- 2 chaises\n- 2 badges exposants", colLeft, y);
  doc.text("- 2 tables\n- 4 chaises\n- 4 badges exposants", colRight, y);
  y += 30;
  doc.fontSize(6.5).fillColor(LIGHT_GREY).text("Pour toute demande specifique, contactez-nous en amont (sous reserve de disponibilite).", colLeft, y, { width: 490 });
  y += 10; line(doc, y); y += 6;

  // RESSOURCES
  y = section(doc, "Ressources sur place", y);
  y = b(doc, "Wi-Fi gratuit (fibre)", L + 15, y);
  y = b(doc, "Electricite : reservation obligatoire (emplacements avec prise le long des murs)", L + 15, y);
  y = b(doc, "Zone de recharge pour telephones et ordinateurs", L + 15, y);
  y += 3; line(doc, y); y += 6;

  // STOCKAGE + RESTAURATION (sur une ligne chacun)
  y = section(doc, "Stockage", y);
  doc.fontSize(7.5).font("Helvetica").fillColor(GREY)
    .text("0,5 m2 sous votre table. Pas d'espace de stockage supplementaire.", L + 15, y, { width: 490 });
  y += 10; line(doc, y); y += 6;

  y = section(doc, "Restauration & pause", y);
  doc.fontSize(7.5).font("Helvetica").fillColor(GREY)
    .text("Cafe/the offerts de 9h00 a 11h45. Restauration legere disponible a l'achat sur place.", L + 15, y, { width: 490 });
  y += 10; line(doc, y); y += 6;

  // VISIBILITÉ & ANIMATIONS
  y = section(doc, "Visibilite & animations", y);

  doc.fontSize(7.5).font("Helvetica-Bold").fillColor(DARK).text("Interviews filmees", L + 15, y);
  doc.font("Helvetica").fillColor(GREY).text("  --  Exprimez-vous face camera. Videos diffusees sur nos canaux.", L + 115, y);
  y += 10;
  doc.fontSize(7).font("Helvetica-Bold").fillColor(TERRACOTTA).text("Inscription avant le 25 avril : hello@dreamteamafrica.com", L + 15, y);
  y += 10;

  doc.fontSize(7.5).font("Helvetica-Bold").fillColor(DARK).text("Presentations sceniques", L + 15, y);
  doc.font("Helvetica").fillColor(GREY).text("  --  Masterclass de 10-15 min. 15 participants max.", L + 140, y);
  y += 12; line(doc, y); y += 6;

  // COMMUNICATION INTERNE
  y = section(doc, "Communication interne", y);
  doc.fontSize(7.5).font("Helvetica").fillColor(GREY)
    .text("Rejoignez le groupe WhatsApp des exposants : ", L + 15, y, { continued: true });
  doc.font("Helvetica-Bold").fillColor(DARK).text("+33 7 82 80 18 52 -- Referente : Yvylee");
  y += 12; line(doc, y); y += 6;

  // ÉQUIPE
  y = section(doc, "Equipe organisatrice -- Dream Team Africa", y);
  doc.fontSize(7).font("Helvetica").fillColor(GREY);
  doc.text("Yvylee KOFFI (Presidente)  |  Solene KIANGEBENI (Resp. Plateau)  |  Christiane GNAHORE (Relations Publiques)", L + 15, y, { width: 500 });
  y += 10;
  doc.text("Email : hello@dreamteamafrica.com  |  Site : dreamteamafrica.com", L + 15, y);
  y += 14; line(doc, y); y += 8;

  // SAVE THE DATE
  doc.rect(L, y, W, 75).fill(DARK);
  doc.fontSize(7).font("Helvetica").fillColor(GOLD).text("SAVE THE DATE", L + 15, y + 8, { characterSpacing: 2 });
  doc.fontSize(11).font("Helvetica-Bold").fillColor("#ffffff").text("Salon Made In Africa -- Paris 2026", L + 15, y + 20);
  doc.fontSize(7).font("Helvetica").fillColor("rgba(255,255,255,0.6)")
    .text("Le grand marche africain de Noel revient le 20 decembre 2026 a l'Espace MAS (Paris 13e).", L + 15, y + 36, { width: 480 });
  doc.fontSize(8).font("Helvetica-Bold").fillColor(GOLD)
    .text("Pack Entrepreneur -- 190 EUR/jour  |  Regler en 5x (38 EUR/mois)", L + 15, y + 52);
  doc.fontSize(6.5).font("Helvetica").fillColor("rgba(255,255,255,0.4)")
    .text("dreamteamafrica.com/resa-exposants/salon-made-in-africa", L + 15, y + 64);

  // FOOTER
  doc.fontSize(6).font("Helvetica").fillColor(LIGHT_GREY)
    .text("Dream Team Africa -- Saison Culturelle Africaine 2026 -- dreamteamafrica.com", L, 820, { align: "center", width: W });

  doc.end();
  await new Promise<void>((resolve) => stream.on("finish", resolve));
  console.log(`PDF genere : ${OUTPUT}`);
}

main().catch((e) => { console.error(e); process.exit(1); });

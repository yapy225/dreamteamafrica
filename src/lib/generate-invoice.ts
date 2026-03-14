import PDFDocument from "pdfkit";
import { prisma } from "./db";
import { EXHIBITOR_EVENTS, EXHIBITOR_PACKS, DEPOSIT_AMOUNT } from "./exhibitor-events";

const LOGO_URL = "https://dreamteamafricamedia.b-cdn.net/1772399817306-logo-dta.png";

const COMPANY = {
  name: "Dream Team Africa",
  type: "Association loi 1901",
  siret: "W942006772",
  address: "16 rue du Révérend Père Lucien Aubry",
  city: "94120 Fontenay-sous-Bois",
  phone: "+33 7 43 53 75 51",
  email: "hello@dreamteamafrica.com",
  website: "dreamteamafrica.com",
};

const COLORS = {
  accent: "#8B6F4E",
  dark: "#1a1a1a",
  muted: "#666666",
  light: "#f5f0eb",
  border: "#d4c5b0",
  green: "#16a34a",
};

/**
 * Fetch an image from URL and return as Buffer for PDFKit
 */
async function fetchImageBuffer(url: string): Promise<Buffer | null> {
  try {
    const res = await fetch(url);
    if (!res.ok) return null;
    const arrayBuffer = await res.arrayBuffer();
    return Buffer.from(arrayBuffer);
  } catch {
    return null;
  }
}

/**
 * Generate an invoice number: FA-YYYY-XXXXX
 */
export async function generateInvoiceNumber(): Promise<string> {
  const year = new Date().getFullYear();
  const prefix = `FA-${year}-`;

  const lastInvoice = await prisma.exhibitorBooking.findFirst({
    where: { invoiceNumber: { startsWith: prefix } },
    orderBy: { invoiceNumber: "desc" },
    select: { invoiceNumber: true },
  });

  const lastNum = lastInvoice?.invoiceNumber
    ? parseInt(lastInvoice.invoiceNumber.replace(prefix, ""), 10)
    : 0;

  return `${prefix}${String(lastNum + 1).padStart(5, "0")}`;
}

/**
 * Generate a PDF invoice buffer for a given booking
 */
export async function generateInvoicePDF(bookingId: string): Promise<Buffer> {
  const booking = await prisma.exhibitorBooking.findUnique({
    where: { id: bookingId },
    include: { payments: { orderBy: { paidAt: "asc" } } },
  });

  if (!booking) throw new Error("Réservation introuvable");

  // Assign invoice number if not yet set
  if (!booking.invoiceNumber) {
    const invoiceNumber = await generateInvoiceNumber();
    await prisma.exhibitorBooking.update({
      where: { id: bookingId },
      data: { invoiceNumber },
    });
    booking.invoiceNumber = invoiceNumber;
  }

  const pack = EXHIBITOR_PACKS.find((p) => p.id === booking.pack);
  const events = EXHIBITOR_EVENTS.filter((e) => booking.events.includes(e.id));
  const stands = booking.stands ?? 1;
  const formatter = (n: number) =>
    n.toLocaleString("fr-FR", { minimumFractionDigits: 2, maximumFractionDigits: 2 }) + " €";

  const dateFmt = (d: Date) =>
    d.toLocaleDateString("fr-FR", { day: "numeric", month: "long", year: "numeric" });

  const eventDateFmt = (dateStr: string) =>
    new Date(dateStr + "T12:00:00").toLocaleDateString("fr-FR", {
      day: "numeric",
      month: "long",
      year: "numeric",
    });

  // Fetch logo
  const logoBuffer = await fetchImageBuffer(LOGO_URL);

  return new Promise((resolve, reject) => {
    const doc = new PDFDocument({ size: "A4", margin: 50 });
    const chunks: Buffer[] = [];
    doc.on("data", (chunk: Buffer) => chunks.push(chunk));
    doc.on("end", () => resolve(Buffer.concat(chunks)));
    doc.on("error", reject);

    const pageWidth = doc.page.width - 100; // 50 margin each side

    // ── Header with logo ──
    let headerTextX = 50;
    if (logoBuffer) {
      doc.image(logoBuffer, 50, 40, { width: 60 });
      headerTextX = 120;
    }

    doc
      .fontSize(16)
      .fillColor(COLORS.accent)
      .text(COMPANY.name, headerTextX, 45, { width: 200 })
      .fontSize(8)
      .fillColor(COLORS.muted)
      .text(COMPANY.address, headerTextX, 65)
      .text(COMPANY.city, headerTextX, 76)
      .text(`Tél : ${COMPANY.phone}`, headerTextX, 87)
      .text(`E-mail : ${COMPANY.email}`, headerTextX, 98)
      .text(COMPANY.website, headerTextX, 109);

    // Invoice title + number (right side)
    doc
      .fontSize(28)
      .fillColor(COLORS.accent)
      .text("FACTURE", 300, 45, { width: 245, align: "right" })
      .fontSize(10)
      .fillColor(COLORS.dark)
      .text(`N° ${booking.invoiceNumber}`, 300, 78, { width: 245, align: "right" })
      .text(`Date : ${dateFmt(new Date())}`, 300, 93, { width: 245, align: "right" });

    // ── Separator ──
    doc
      .moveTo(50, 130)
      .lineTo(545, 130)
      .strokeColor(COLORS.border)
      .lineWidth(1)
      .stroke();

    // ── Client info ──
    doc
      .fontSize(9)
      .fillColor(COLORS.muted)
      .text("FACTURÉ À", 50, 145)
      .fontSize(12)
      .fillColor(COLORS.dark)
      .text(booking.companyName, 50, 160)
      .fontSize(9)
      .fillColor(COLORS.muted)
      .text(booking.contactName, 50, 177)
      .text(booking.email, 50, 189)
      .text(booking.phone, 50, 201);

    // Booking ref (right)
    doc
      .fontSize(9)
      .fillColor(COLORS.muted)
      .text("RÉFÉRENCE", 350, 145, { width: 195, align: "right" })
      .fontSize(10)
      .fillColor(COLORS.dark)
      .text(booking.id, 350, 160, { width: 195, align: "right" })
      .fontSize(9)
      .fillColor(COLORS.muted)
      .text(`Réservation du ${dateFmt(booking.createdAt)}`, 350, 177, { width: 195, align: "right" });

    // ── Event details ──
    let y = 225;
    doc
      .fontSize(11)
      .fillColor(COLORS.accent)
      .text("ÉVÉNEMENT" + (events.length > 1 ? "S" : ""), 50, y);

    y += 16;
    for (const evt of events) {
      doc
        .fontSize(10)
        .fillColor(COLORS.dark)
        .text(evt.title, 60, y, { continued: true })
        .fontSize(9)
        .fillColor(COLORS.muted)
        .text(
          `  —  ${eventDateFmt(evt.date)}${evt.endDate ? ` au ${eventDateFmt(evt.endDate)}` : ""}, ${evt.venue}, ${evt.address}`,
        );
      y += 15;
    }

    // ── Table header ──
    y += 10;
    const tableTop = y;
    doc
      .rect(50, tableTop, pageWidth, 25)
      .fill(COLORS.accent);

    doc
      .fontSize(9)
      .fillColor("#ffffff")
      .text("DESCRIPTION", 60, tableTop + 7, { width: 250 })
      .text("QTÉ", 320, tableTop + 7, { width: 50, align: "center" })
      .text("P.U.", 380, tableTop + 7, { width: 70, align: "right" })
      .text("TOTAL", 460, tableTop + 7, { width: 80, align: "right" });

    // ── Table rows ──
    y = tableTop + 30;
    const rowHeight = 22;

    // Stand line
    const unitPrice = booking.totalPrice / stands;
    const packName = pack?.name || booking.pack;

    doc.rect(50, y - 2, pageWidth, rowHeight).fill("#fafaf7");
    doc
      .fontSize(9)
      .fillColor(COLORS.dark)
      .text(
        `${packName} — ${booking.totalDays} jour${booking.totalDays > 1 ? "s" : ""}`,
        60,
        y + 3,
        { width: 250 },
      )
      .text(String(stands), 320, y + 3, { width: 50, align: "center" })
      .text(formatter(unitPrice), 380, y + 3, { width: 70, align: "right" })
      .text(formatter(booking.totalPrice), 460, y + 3, { width: 80, align: "right" });

    y += rowHeight;

    // ── Totals ──
    y += 10;
    doc
      .moveTo(350, y)
      .lineTo(545, y)
      .strokeColor(COLORS.border)
      .lineWidth(0.5)
      .stroke();

    y += 8;
    doc
      .fontSize(10)
      .fillColor(COLORS.muted)
      .text("Total HT", 350, y, { width: 100 })
      .fillColor(COLORS.dark)
      .text(formatter(booking.totalPrice), 460, y, { width: 80, align: "right" });

    y += 18;
    doc
      .fillColor(COLORS.muted)
      .text("TVA (non applicable)", 350, y, { width: 100 })
      .fillColor(COLORS.dark)
      .text("—", 460, y, { width: 80, align: "right" });

    y += 18;
    doc
      .rect(350, y - 4, 195, 28)
      .fill(COLORS.accent);
    doc
      .fontSize(12)
      .fillColor("#ffffff")
      .text("TOTAL TTC", 360, y + 2, { width: 100 })
      .text(formatter(booking.totalPrice), 460, y + 2, { width: 80, align: "right" });

    // ── Payment history ──
    y += 50;
    doc
      .fontSize(12)
      .fillColor(COLORS.accent)
      .text("HISTORIQUE DES PAIEMENTS", 50, y);

    y += 20;
    // Header
    doc
      .rect(50, y, pageWidth, 22)
      .fill(COLORS.light);
    doc
      .fontSize(8)
      .fillColor(COLORS.muted)
      .text("DATE", 60, y + 6, { width: 100 })
      .text("LIBELLÉ", 170, y + 6, { width: 200 })
      .text("MONTANT", 460, y + 6, { width: 80, align: "right" });

    y += 26;
    let totalPaid = 0;

    if (booking.payments.length > 0) {
      for (let i = 0; i < booking.payments.length; i++) {
        const p = booking.payments[i];
        if (i % 2 === 0) {
          doc.rect(50, y - 2, pageWidth, 18).fill("#fafaf7");
        }
        doc
          .fontSize(9)
          .fillColor(COLORS.dark)
          .text(dateFmt(p.paidAt), 60, y + 2, { width: 100 })
          .text(p.label, 170, y + 2, { width: 200 })
          .fillColor(COLORS.green)
          .text(formatter(p.amount), 460, y + 2, { width: 80, align: "right" });
        totalPaid += p.amount;
        y += 18;
      }
    } else {
      // Fallback: reconstruct from booking data
      const deposit = Math.min(DEPOSIT_AMOUNT * stands, booking.totalPrice);
      if (booking.paidInstallments >= 1) {
        doc.rect(50, y - 2, pageWidth, 18).fill("#fafaf7");
        doc
          .fontSize(9)
          .fillColor(COLORS.dark)
          .text(dateFmt(booking.createdAt), 60, y + 2, { width: 100 })
          .text(
            booking.installments > 1 ? "Acompte de réservation" : "Paiement intégral",
            170, y + 2, { width: 200 },
          )
          .fillColor(COLORS.green)
          .text(
            formatter(booking.installments > 1 ? deposit : booking.totalPrice),
            460, y + 2, { width: 80, align: "right" },
          );
        totalPaid += booking.installments > 1 ? deposit : booking.totalPrice;
        y += 18;
      }

      if (booking.installments > 1) {
        const totalMonths = booking.installments - 1;
        const monthly = Math.ceil(((booking.totalPrice - deposit) / totalMonths) * 100) / 100;
        const paidMonths = Math.max(0, booking.paidInstallments - 1);
        for (let i = 0; i < paidMonths; i++) {
          const d = new Date(booking.createdAt);
          d.setMonth(d.getMonth() + i + 1);
          if (i % 2 === 1) {
            doc.rect(50, y - 2, pageWidth, 18).fill("#fafaf7");
          }
          doc
            .fontSize(9)
            .fillColor(COLORS.dark)
            .text(dateFmt(d), 60, y + 2, { width: 100 })
            .text(`Mensualité ${i + 1}/${totalMonths}`, 170, y + 2, { width: 200 })
            .fillColor(COLORS.green)
            .text(formatter(monthly), 460, y + 2, { width: 80, align: "right" });
          totalPaid += monthly;
          y += 18;
        }
      }
    }

    // Total paid
    y += 4;
    doc
      .moveTo(350, y)
      .lineTo(545, y)
      .strokeColor(COLORS.border)
      .lineWidth(0.5)
      .stroke();
    y += 8;

    const remaining = Math.max(0, booking.totalPrice - totalPaid);
    doc
      .fontSize(10)
      .fillColor(COLORS.dark)
      .text("Total payé", 350, y, { width: 100 })
      .fillColor(COLORS.green)
      .text(formatter(totalPaid), 460, y, { width: 80, align: "right" });

    if (remaining > 0) {
      y += 18;
      doc
        .fillColor(COLORS.dark)
        .text("Solde restant", 350, y, { width: 100 })
        .fillColor(COLORS.accent)
        .text(formatter(remaining), 460, y, { width: 80, align: "right" });
    }

    // ── Footer (disable auto-pagination to prevent extra pages) ──
    const savedBottomMargin = doc.page.margins.bottom;
    doc.page.margins.bottom = 0;

    const fY = doc.page.height - 55;
    const fW = pageWidth;
    const fCx = 50 + fW / 2;

    doc
      .moveTo(50, fY)
      .lineTo(50 + fW, fY)
      .strokeColor(COLORS.border)
      .lineWidth(0.5)
      .stroke();

    doc.fontSize(6).fillColor(COLORS.muted);
    const line1 = "TVA non applicable — Art. 293 B du CGI";
    const w1 = doc.widthOfString(line1);
    doc.text(line1, fCx - w1 / 2, fY + 6, { lineBreak: false });

    const line2 = `${COMPANY.name} — ${COMPANY.address}, ${COMPANY.city} — N° ${COMPANY.siret}`;
    const w2 = doc.widthOfString(line2);
    doc.text(line2, fCx - w2 / 2, fY + 16, { lineBreak: false });

    const line3 = `${COMPANY.phone} — ${COMPANY.email} — ${COMPANY.website}`;
    const w3 = doc.widthOfString(line3);
    doc.text(line3, fCx - w3 / 2, fY + 26, { lineBreak: false });

    doc.page.margins.bottom = savedBottomMargin;
    doc.end();
  });
}

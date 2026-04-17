import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/db";
import PDFDocument from "pdfkit";
import { rateLimit } from "@/lib/rate-limit";

const LOGO_URL = "https://dreamteamafricamedia.b-cdn.net/1772399817306-logo-dta.png";

const COLORS = {
  accent: "#8B6F4E",
  dark: "#1a1a1a",
  muted: "#666666",
  light: "#f5f0eb",
};

async function fetchImageBuffer(url: string): Promise<Buffer | null> {
  try {
    const res = await fetch(url);
    if (!res.ok) return null;
    return Buffer.from(await res.arrayBuffer());
  } catch {
    return null;
  }
}

const tierLabels: Record<string, string> = {
  EARLY_BIRD: "Early Bird",
  LAST_CHANCE: "Last Chance",
  STANDARD: "Standard",
  VIP: "VIP",
};

export async function GET(request: Request) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Non autorisé." }, { status: 401 });
  }

  const rl = rateLimit(`ticket-pdf:${session.user.id}`, { limit: 10, windowSec: 60 });
  if (!rl.success) {
    return NextResponse.json({ error: "Trop de tentatives." }, { status: 429 });
  }

  const { searchParams } = new URL(request.url);
  const ticketId = searchParams.get("id");

  if (!ticketId) {
    return NextResponse.json({ error: "ID requis." }, { status: 400 });
  }

  const ticket = await prisma.ticket.findUnique({
    where: { id: ticketId },
    include: {
      event: true,
    },
  });

  if (!ticket || ticket.userId !== session.user.id) {
    return NextResponse.json({ error: "Billet introuvable." }, { status: 404 });
  }

  // Generate PDF
  const doc = new PDFDocument({ size: "A4", margin: 50 });
  const chunks: Buffer[] = [];

  doc.on("data", (chunk: Buffer) => chunks.push(chunk));

  const pdfReady = new Promise<Buffer>((resolve) => {
    doc.on("end", () => resolve(Buffer.concat(chunks)));
  });

  // Logo
  const logoBuffer = await fetchImageBuffer(LOGO_URL);
  if (logoBuffer) {
    doc.image(logoBuffer, 50, 40, { width: 80 });
  }

  // Header
  doc.fontSize(10).fillColor(COLORS.muted).text("Dream Team Africa", 140, 50);
  doc.fontSize(8).text("Association loi 1901", 140, 65);

  // Title
  doc.moveDown(3);
  doc.fontSize(24).fillColor(COLORS.accent).text("BILLET", { align: "center" });
  doc.moveDown(0.5);

  // Event title
  doc.fontSize(18).fillColor(COLORS.dark).text(ticket.event.title, { align: "center" });
  doc.moveDown(1.5);

  // Divider
  const divY = doc.y;
  doc.moveTo(50, divY).lineTo(545, divY).strokeColor(COLORS.accent).lineWidth(2).stroke();
  doc.moveDown(1);

  // Ticket info table
  const leftCol = 50;
  const rightCol = 300;
  let y = doc.y;

  const addRow = (label: string, value: string) => {
    doc.fontSize(9).fillColor(COLORS.muted).text(label, leftCol, y);
    doc.fontSize(11).fillColor(COLORS.dark).text(value, rightCol, y);
    y += 25;
  };

  const tierName = tierLabels[ticket.tier] || ticket.tier;
  const eventDate = new Intl.DateTimeFormat("fr-FR", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  }).format(ticket.visitDate || ticket.event.date);

  addRow("Titulaire", `${ticket.firstName || ""} ${ticket.lastName || ""}`.trim());
  addRow("Événement", ticket.event.title);
  addRow("Date", eventDate);
  addRow("Horaire", `${new Date(ticket.event.date).toLocaleTimeString("fr-FR", { hour: "2-digit", minute: "2-digit" })} - ${ticket.event.endDate ? new Date(ticket.event.endDate).toLocaleTimeString("fr-FR", { hour: "2-digit", minute: "2-digit" }) : "22h00"}`);
  addRow("Lieu", ticket.event.venue);
  addRow("Adresse", ticket.event.address);
  addRow("Catégorie", tierName);
  addRow("Prix", `${ticket.price.toFixed(2)} €`);
  addRow("Référence", ticket.id.slice(0, 8).toUpperCase());

  doc.y = y + 10;

  // Divider
  doc.moveTo(50, doc.y).lineTo(545, doc.y).strokeColor(COLORS.light).lineWidth(1).stroke();
  doc.moveDown(1);

  // QR Code
  if (ticket.qrCode) {
    const qrBuffer = await fetchImageBuffer(ticket.qrCode);
    if (qrBuffer) {
      const qrX = (595 - 150) / 2;
      doc.image(qrBuffer, qrX, doc.y, { width: 150 });
      doc.y += 160;
      doc.fontSize(8).fillColor(COLORS.muted).text("Présentez ce QR code à l'entrée de l'événement", { align: "center" });
    }
  }

  // Footer
  doc.moveDown(2);
  doc.moveTo(50, doc.y).lineTo(545, doc.y).strokeColor(COLORS.light).lineWidth(1).stroke();
  doc.moveDown(0.5);
  doc.fontSize(7).fillColor(COLORS.muted).text(
    "Ce billet est personnel. La cession n'est autorisée que via la plateforme officielle dreamteamafrica.com/mon-espace. Toute revente hors plateforme entraîne l'invalidation.",
    { align: "center" }
  );
  doc.moveDown(0.3);
  doc.text("Dream Team Africa — hello@dreamteamafrica.com — dreamteamafrica.com", { align: "center" });

  doc.end();

  const pdfBuffer = await pdfReady;

  const fileName = `billet-${ticket.event.slug || "event"}-${ticket.id.slice(0, 8)}.pdf`;

  return new NextResponse(new Uint8Array(pdfBuffer), {
    headers: {
      "Content-Type": "application/pdf",
      "Content-Disposition": `attachment; filename="${fileName}"`,
      "Cache-Control": "private, no-cache",
    },
  });
}

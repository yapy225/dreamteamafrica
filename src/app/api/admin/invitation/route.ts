import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import PDFDocument from "pdfkit";
import { uploadBuffer } from "@/lib/bunny";

export const dynamic = "force-dynamic";

export async function POST(request: NextRequest) {
  const session = await auth();
  if (!session || session.user.role !== "ADMIN") {
    return NextResponse.json({ error: "Non autorisé" }, { status: 401 });
  }

  const body = await request.json();
  const {
    recipientName,
    recipientCompany,
    recipientAddress,
    event,
    eventDate,
    eventVenue,
    eventAddress,
    role, // exposant, mannequin, artiste, invité
  } = body;

  if (!recipientName || !event) {
    return NextResponse.json({ error: "Nom et événement requis." }, { status: 400 });
  }

  const today = new Date().toLocaleDateString("fr-FR", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });

  const roleLabel =
    role === "exposant"
      ? "en qualité d'exposant"
      : role === "mannequin"
        ? "en qualité de mannequin pour le défilé"
        : role === "artiste"
          ? "en qualité d'artiste/performeur"
          : "en qualité d'invité(e)";

  const doc = new PDFDocument({ size: "A4", margin: 60 });
  const chunks: Buffer[] = [];

  doc.on("data", (chunk: Buffer) => chunks.push(chunk));

  const pdfPromise = new Promise<Buffer>((resolve) => {
    doc.on("end", () => resolve(Buffer.concat(chunks)));
  });

  // ── Header ──
  doc
    .fontSize(22)
    .font("Helvetica-Bold")
    .fillColor("#1A1A1A")
    .text("DREAM TEAM AFRICA", { align: "center" });

  doc
    .fontSize(10)
    .font("Helvetica")
    .fillColor("#666666")
    .text("Association Loi 1901 — Promotion de la culture africaine", { align: "center" })
    .text("Paris, France", { align: "center" })
    .text("hello@dreamteamafrica.com | +33 7 51 44 37 74", { align: "center" });

  doc.moveDown(1);
  doc
    .moveTo(60, doc.y)
    .lineTo(535, doc.y)
    .strokeColor("#C4704B")
    .lineWidth(2)
    .stroke();

  doc.moveDown(2);

  // ── Date & Lieu ──
  doc
    .fontSize(11)
    .font("Helvetica")
    .fillColor("#333333")
    .text(`Paris, le ${today}`, { align: "right" });

  doc.moveDown(2);

  // ── Destinataire ──
  if (recipientCompany) {
    doc.font("Helvetica-Bold").text(recipientCompany);
  }
  doc.font("Helvetica").text(recipientName);
  if (recipientAddress) {
    doc.text(recipientAddress);
  }

  doc.moveDown(2);

  // ── Objet ──
  doc
    .fontSize(12)
    .font("Helvetica-Bold")
    .fillColor("#1A1A1A")
    .text(`Objet : Lettre d'invitation — ${event}`);

  doc.moveDown(1.5);

  // ── Corps ──
  doc
    .fontSize(11)
    .font("Helvetica")
    .fillColor("#333333")
    .text(`Madame, Monsieur,`, { lineGap: 4 });

  doc.moveDown(0.8);

  doc.text(
    `Nous avons le plaisir de vous confirmer votre participation à l'événement « ${event} » organisé par l'association Dream Team Africa, ${roleLabel}.`,
    { lineGap: 4 },
  );

  doc.moveDown(0.8);

  doc.text(`Cet événement se tiendra :`, { lineGap: 4 });
  doc.moveDown(0.5);

  doc
    .font("Helvetica-Bold")
    .text(`Date : ${eventDate || "À confirmer"}`)
    .text(`Lieu : ${eventVenue || "À confirmer"}`)
    .text(`Adresse : ${eventAddress || "À confirmer"}`);

  doc.moveDown(0.8);

  doc
    .font("Helvetica")
    .text(
      `Cette lettre d'invitation est délivrée pour servir et valoir ce que de droit, notamment pour les démarches administratives nécessaires à votre venue.`,
      { lineGap: 4 },
    );

  doc.moveDown(0.8);

  doc.text(
    `L'association Dream Team Africa prend en charge l'organisation de l'événement. Les frais de transport, d'hébergement et de restauration restent à la charge du participant, sauf accord préalable.`,
    { lineGap: 4 },
  );

  doc.moveDown(0.8);

  doc.text(
    `Nous restons à votre disposition pour toute information complémentaire.`,
    { lineGap: 4 },
  );

  doc.moveDown(0.8);

  doc.text(`Nous vous prions d'agréer, Madame, Monsieur, l'expression de nos salutations distinguées.`, {
    lineGap: 4,
  });

  doc.moveDown(2);

  // ── Signature ──
  doc
    .font("Helvetica-Bold")
    .text("Yvylee KOFFI")
    .font("Helvetica")
    .text("Présidente — Dream Team Africa");

  doc.moveDown(3);

  // ── Pied de page ──
  doc
    .moveTo(60, doc.y)
    .lineTo(535, doc.y)
    .strokeColor("#E0E0E0")
    .lineWidth(0.5)
    .stroke();

  doc.moveDown(0.5);
  doc
    .fontSize(8)
    .fillColor("#999999")
    .text(
      "Dream Team Africa — Association Loi 1901 | dreamteamafrica.com | hello@dreamteamafrica.com | +33 7 51 44 37 74",
      { align: "center" },
    );

  doc.end();

  const pdfBuffer = await pdfPromise;

  const safeName = recipientName.replace(/[^a-zA-Z0-9]/g, "_");
  const dateStr = new Date().toISOString().slice(0, 10);
  const archivePath = `invitations/${dateStr}-${safeName}.pdf`;

  // Archive on Bunny CDN
  try {
    await uploadBuffer(pdfBuffer, archivePath, "application/pdf");
  } catch (err) {
    console.error("Invitation archive upload error:", err);
  }

  return new NextResponse(pdfBuffer, {
    headers: {
      "Content-Type": "application/pdf",
      "Content-Disposition": `attachment; filename="Invitation-${safeName}.pdf"`,
    },
  });
}

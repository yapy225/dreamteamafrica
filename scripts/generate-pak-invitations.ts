import "dotenv/config";
import PDFDocument from "pdfkit";
import fs from "fs";
import path from "path";

const delegates = [
  {
    civilite: "Monsieur",
    nom: "KABAMBA KASONGO",
    prenoms: "Crispin",
    passeport: "OP1565752",
    delPasseport: "22.12.2023",
    expPasseport: "21.12.2028",
    fonction: null,
    entreprise: null,
  },
  {
    civilite: "Monsieur",
    nom: "ILUNGA MBIYA",
    prenoms: "François",
    passeport: "OP1846273",
    delPasseport: "25.10.2024",
    expPasseport: "24.10.2029",
    fonction: null,
    entreprise: null,
  },
  {
    civilite: "Monsieur",
    nom: "NSINGI DIEZEKA",
    prenoms: "Didier",
    passeport: "OP1383896",
    delPasseport: "03.07.2023",
    expPasseport: "02.07.2028",
    fonction: null,
    entreprise: null,
  },
  {
    civilite: "Madame",
    nom: "TSHOMBE KAT",
    prenoms: "Kathy",
    passeport: "OP1579657",
    delPasseport: "13.01.2024",
    expPasseport: "12.01.2029",
    fonction: "Artisane, membre de la PAK",
    entreprise: "Ets KAT'S BUSINESS – Chips banane plantain",
  },
  {
    civilite: "Monsieur",
    nom: "WAWA IBALE KEYILA",
    prenoms: "Rubins",
    passeport: "OP1927098",
    delPasseport: "14.02.2025",
    expPasseport: "13.02.2030",
    fonction: "Président de la PAK",
    entreprise: "CONGO BOKOKO – Vannerie",
  },
  {
    civilite: "Monsieur",
    nom: "EBENGO NGOVO",
    prenoms: "Grace",
    passeport: "OP1961479",
    delPasseport: "05.04.2025",
    expPasseport: "04.04.2030",
    fonction: "Artisan – Membre PAK",
    entreprise: "ETS TUNDULU BUSINESS – Imprimerie",
  },
  {
    civilite: "Madame",
    nom: "WAWA KEKIELE",
    prenoms: "Henriette",
    passeport: "OP1966734",
    delPasseport: "03.04.2025",
    expPasseport: "02.04.2030",
    fonction: "Artisane, membre de la PAK",
    entreprise: "ETABLISSEMENT CONGO BOKOKO – Vannerie et décoration",
  },
  {
    civilite: "Madame",
    nom: "MASSAMBA NDEDI",
    prenoms: "Beverly",
    passeport: "OP1022506",
    delPasseport: "06.04.2022",
    expPasseport: "05.04.2027",
    fonction: "Artisane, membre de la PAK",
    entreprise: "ETABLISSEMENT LES ARTS MODEL – Coiffure",
  },
  {
    civilite: "Monsieur",
    nom: "WAWA LOKANGO",
    prenoms: "Justin",
    passeport: "OP1965615",
    delPasseport: "09.04.2025",
    expPasseport: "08.04.2030",
    fonction: "Artisan, membre de la PAK",
    entreprise: "ETS CONGO BOKOKO – Vannerie",
  },
  {
    civilite: "Monsieur",
    nom: "MABIALA YENGO",
    prenoms: "Adélard",
    passeport: "OP1820990",
    delPasseport: "27.09.2024",
    expPasseport: "26.09.2029",
    fonction: "Artisan – Membre PAK",
    entreprise: "LUMIER BUSINESS – Vente des œuvres d'art",
  },
];

function generateInvitation(delegate: (typeof delegates)[0]): Promise<Buffer> {
  return new Promise((resolve) => {
    const doc = new PDFDocument({ size: "A4", margin: 60 });
    const chunks: Buffer[] = [];
    doc.on("data", (chunk: Buffer) => chunks.push(chunk));
    doc.on("end", () => resolve(Buffer.concat(chunks)));

    const lineColor = "#C4704B";

    // ── Header ──
    doc
      .fontSize(24)
      .font("Helvetica-Bold")
      .fillColor("#1A1A1A")
      .text("DREAM TEAM", { align: "center" });

    doc
      .fontSize(8)
      .font("Helvetica")
      .fillColor("#666666")
      .text(
        "Association Loi 1901 | SIREN : 852 965 201 | SIRET : 852 965 201 00019 | RNA : W942006772",
        { align: "center" },
      )
      .text(
        "48 rue de Birague, 94490 Ormesson-sur-Marne | hello@dreamteamafrica.com | +33 6 23 91 41 42",
        { align: "center" },
      );

    doc.moveDown(0.5);
    doc.moveTo(60, doc.y).lineTo(535, doc.y).strokeColor(lineColor).lineWidth(1.5).stroke();
    doc.moveDown(1);

    // ── Date ──
    doc
      .fontSize(11)
      .font("Helvetica")
      .fillColor("#333333")
      .text("Paris, le 27 mars 2026", { align: "right" });

    doc.moveDown(1.5);

    // ── Objet ──
    doc
      .fontSize(12)
      .font("Helvetica-Bold")
      .fillColor("#1A1A1A")
      .text("Objet : Lettre d'invitation — Foire d'Afrique Paris — 6ème Édition");

    doc.moveDown(1.5);

    // ── Corps ──
    doc
      .fontSize(11)
      .font("Helvetica")
      .fillColor("#333333")
      .text(`${delegate.civilite} ${delegate.nom},`, { lineGap: 4 });

    doc.moveDown(0.8);

    doc.text(
      `Nous avons le plaisir de vous inviter à participer à la Foire d'Afrique Paris-2026 — 6ème Édition, organisée par l'association DREAM TEAM, en qualité d'exposant.`,
      { lineGap: 4 },
    );

    doc.moveDown(0.8);
    doc.text("Cet événement se tiendra :", { lineGap: 4 });
    doc.moveDown(0.5);

    doc
      .font("Helvetica-Bold")
      .text("Date : 1er & 2 mai 2026       Horaires : 12h00 — 22h00")
      .text("Lieu : Espace MAS, 10 rue des Terres au Curé, 75013 Paris, France");

    doc.moveDown(0.8);

    doc
      .font("Helvetica")
      .text(
        `La Foire d'Afrique Paris - « le plus grand marché africain », réunissant plus de 50 exposants de la diaspora africaine autour de l'artisanat, la gastronomie, la mode et la culture. Cet événement, qui en est à sa 6ème édition, accueille plus de 2 000 visiteurs.`,
        { lineGap: 4 },
      );

    doc.moveDown(0.8);

    // Paragraph about the delegate
    if (delegate.fonction && delegate.entreprise) {
      doc.text(
        `${delegate.civilite === "Madame" ? "Mme" : "M."} ${delegate.nom} ${delegate.prenoms} est invité${delegate.civilite === "Madame" ? "e" : ""} à présenter et commercialiser ses produits (${delegate.entreprise}) sur un stand dédié pendant les deux jours de l'événement.`,
        { lineGap: 4 },
      );
    } else {
      doc.text(
        `${delegate.civilite === "Madame" ? "Mme" : "M."} ${delegate.nom} ${delegate.prenoms} est invité${delegate.civilite === "Madame" ? "e" : ""} à présenter et commercialiser ses créations artisanales sur un stand dédié pendant les deux jours de l'événement.`,
        { lineGap: 4 },
      );
    }

    doc.moveDown(0.8);

    doc.text(
      `Cette lettre d'invitation est délivrée pour servir et valoir ce que de droit, notamment pour les démarches administratives nécessaires à l'obtention d'un visa d'entrée en France auprès des autorités consulaires françaises en République Démocratique du Congo.`,
      { lineGap: 4 },
    );

    doc.moveDown(0.8);

    // ── Passport info ──
    doc.font("Helvetica-Bold").text("Informations relatives au titulaire du passeport :");
    doc
      .font("Helvetica")
      .text(
        `Nom : ${delegate.nom}   |   Prénoms : ${delegate.prenoms}   |   N° passeport : ${delegate.passeport}`,
      );

    doc.moveDown(0.8);

    doc
      .font("Helvetica")
      .text(
        `L'association DREAM TEAM prend en charge l'organisation de l'événement et la mise à disposition du stand. Les frais de transport, d'hébergement et de restauration restent à la charge de l'invité, sauf accord préalable.`,
        { lineGap: 4 },
      );

    doc.moveDown(0.8);

    doc.text("Nous restons à votre disposition pour toute information complémentaire.", {
      lineGap: 4,
    });

    doc.moveDown(0.8);

    doc.text(
      `Nous vous prions d'agréer, ${delegate.civilite}, l'expression de nos salutations distinguées.`,
      { lineGap: 4 },
    );

    doc.moveDown(2);

    // ── Signature ──
    doc.font("Helvetica-Bold").text("Yapy MAMBO");
    doc.font("Helvetica").text("Président — Association DREAM TEAM");

    doc.moveDown(3);

    // ── Footer ──
    doc.moveTo(60, doc.y).lineTo(535, doc.y).strokeColor("#E0E0E0").lineWidth(0.5).stroke();
    doc.moveDown(0.5);
    doc
      .fontSize(8)
      .fillColor("#999999")
      .text(
        "DREAM TEAM — Asso. loi 1901 | SIRET 852 965 201 00019 | RNA W942006772 | 48 rue de Birague, 94490 Ormesson-sur-Marne | hello@dreamteamafrica.com",
        { align: "center" },
      );

    doc.end();
  });
}

async function main() {
  const outDir = path.join(process.env.HOME || "/tmp", "Downloads");

  for (const d of delegates) {
    const buffer = await generateInvitation(d);
    const safeName = `${d.nom}-${d.prenoms}`.replace(/[^a-zA-Z0-9-]/g, "_");
    const filePath = path.join(outDir, `Invitation-${safeName}-FoireAfrique2026.pdf`);
    fs.writeFileSync(filePath, buffer);
    console.log(`OK ${filePath}`);
  }
}

main();

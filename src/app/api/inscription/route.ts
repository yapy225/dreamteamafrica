import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import nodemailer from "nodemailer";

const ADMIN_EMAIL = "yapy.mambo@gmail.com";

async function sendNotification(inscription: {
  id: string;
  entreprise: string;
  categorie: string;
  directeur: string;
  ville: string;
  email: string;
  description: string;
}) {
  try {
    const smtpUser = process.env.SMTP_USER || process.env.E_MAIL;
    const smtpPass = process.env.SMTP_PASS || process.env.PASSEWORD;

    if (!smtpUser || !smtpPass) {
      console.warn("SMTP credentials not configured — skipping email.");
      return;
    }

    const transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST || "smtp.gmail.com",
      port: parseInt(process.env.SMTP_PORT || "587", 10),
      secure: false,
      auth: { user: smtpUser, pass: smtpPass },
    });

    const baseUrl = process.env.NEXTAUTH_URL || "https://dreamteamafrica.com";

    await transporter.sendMail({
      from: `"L'Officiel d'Afrique" <${smtpUser}>`,
      to: ADMIN_EMAIL,
      subject: `Nouvelle inscription — ${inscription.entreprise}`,
      html: `
        <div style="font-family:Arial,sans-serif;max-width:600px;margin:0 auto;background:#0E0E0E;color:#F2EDE4;padding:2rem;">
          <h1 style="color:#C8A246;font-size:1.4rem;margin-bottom:1.5rem;">
            Nouvelle inscription — L'Officiel d'Afrique
          </h1>
          <table style="width:100%;border-collapse:collapse;font-size:.9rem;">
            <tr><td style="padding:.5rem 0;color:#C8A246;width:120px;">Entreprise</td><td>${inscription.entreprise}</td></tr>
            <tr><td style="padding:.5rem 0;color:#C8A246;">Catégorie</td><td>${inscription.categorie}</td></tr>
            <tr><td style="padding:.5rem 0;color:#C8A246;">Directeur</td><td>${inscription.directeur}</td></tr>
            <tr><td style="padding:.5rem 0;color:#C8A246;">Ville</td><td>${inscription.ville}</td></tr>
            <tr><td style="padding:.5rem 0;color:#C8A246;">Email</td><td>${inscription.email}</td></tr>
          </table>
          <div style="margin:1.5rem 0;padding:1rem;background:#151515;border-left:3px solid #C8A246;">
            <p style="margin:0;font-size:.85rem;line-height:1.6;">${inscription.description}</p>
          </div>
          <div style="margin-top:1.5rem;">
            <a href="${baseUrl}/api/inscription/${inscription.id}/validate" style="display:inline-block;padding:.7rem 1.5rem;background:#2BA84A;color:#fff;text-decoration:none;font-weight:bold;font-size:.85rem;margin-right:.5rem;">
              ✓ Valider
            </a>
            <a href="${baseUrl}/api/inscription/${inscription.id}/reject" style="display:inline-block;padding:.7rem 1.5rem;background:#C23B22;color:#fff;text-decoration:none;font-weight:bold;font-size:.85rem;">
              ✗ Refuser
            </a>
          </div>
          <p style="margin-top:2rem;font-size:.7rem;color:rgba(242,237,228,0.3);">
            L'Officiel d'Afrique — Annuaire de la diaspora africaine
          </p>
        </div>
      `,
    });
  } catch (err) {
    console.error("Email notification failed (inscription still saved):", err);
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();

    const required = [
      "entreprise",
      "categorie",
      "directeur",
      "ville",
      "pays",
      "mobile",
      "email",
      "description",
    ];

    for (const field of required) {
      if (
        !body[field] ||
        (typeof body[field] === "string" && !body[field].trim())
      ) {
        return NextResponse.json(
          { error: `Le champ "${field}" est requis.` },
          { status: 400 }
        );
      }
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(body.email)) {
      return NextResponse.json(
        { error: "Adresse email invalide." },
        { status: 400 }
      );
    }

    const inscription = await prisma.inscription.create({
      data: {
        entreprise: body.entreprise.trim(),
        categorie: body.categorie.trim(),
        directeur: body.directeur.trim(),
        adresse: body.adresse?.trim() || null,
        ville: body.ville.trim(),
        codePostal: body.codePostal?.trim() || null,
        pays: body.pays.trim(),
        mobile: body.mobile.trim(),
        telephone: body.telephone?.trim() || null,
        email: body.email.trim().toLowerCase(),
        siteWeb: body.siteWeb?.trim() || null,
        facebook: body.facebook?.trim() || null,
        instagram: body.instagram?.trim() || null,
        tiktok: body.tiktok?.trim() || null,
        whatsapp: body.whatsapp?.trim() || null,
        youtube: body.youtube?.trim() || null,
        linkedin: body.linkedin?.trim() || null,
        description: body.description.trim(),
        motsCles: body.motsCles?.trim() || null,
        newsletter: body.newsletter ?? false,
      },
    });

    // Send notification email (non-blocking)
    sendNotification(inscription);

    return NextResponse.json(
      { id: inscription.id, message: "Inscription enregistrée avec succès." },
      { status: 201 }
    );
  } catch (error) {
    console.error("Inscription error:", error);
    return NextResponse.json(
      { error: "Erreur interne du serveur." },
      { status: 500 }
    );
  }
}

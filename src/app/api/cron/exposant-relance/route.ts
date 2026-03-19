import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { sendWhatsAppText } from "@/lib/whatsapp";

const APP_URL = process.env.NEXT_PUBLIC_APP_URL || "https://dreamteamafrica.com";

/**
 * Cron job: relance les prospects exposants 23h après leur demande
 * (dans la fenêtre gratuite WhatsApp de 24h).
 * Runs every hour via Vercel cron.
 */
export async function GET(req: NextRequest) {
  const authHeader = req.headers.get("authorization");
  const cronSecret = process.env.CRON_SECRET;
  if (!cronSecret || authHeader !== `Bearer ${cronSecret}`) {
    return NextResponse.json({ error: "Non autorisé" }, { status: 401 });
  }

  const now = new Date();
  // Leads created between 22h and 24h ago, not yet reminded, not yet paid
  const from = new Date(now.getTime() - 24 * 60 * 60 * 1000); // 24h ago
  const to = new Date(now.getTime() - 22 * 60 * 60 * 1000);   // 22h ago

  const leads = await prisma.exposantLead.findMany({
    where: {
      status: "SENT",
      remindedAt: null,
      createdAt: { gte: from, lte: to },
    },
  });

  let sent = 0;
  let failed = 0;

  for (const lead of leads) {
    const depositUrl = `${APP_URL}/exposants/devis/${lead.id}?t=${Date.now()}`;

    const message = [
      `Bonjour ${lead.firstName} !`,
      ``,
      `Suite à votre demande pour exposer à *${lead.eventName}* avec *${lead.brand}*, nous voulions nous assurer que vous n'avez pas manqué cette opportunité.`,
      ``,
      `*Les stands partent vite* et votre place n'est pas encore garantie.`,
      ``,
      `La bonne nouvelle ? Il suffit de *seulement 50 €* pour bloquer votre stand dès maintenant. Ce montant sera déduit de votre facture finale.`,
      ``,
      `👉 ${depositUrl}`,
      ``,
      `Pas de prise de tête, pas d'engagement définitif — juste 50 € pour sécuriser votre place.`,
      ``,
      `Une question ? Répondez directement ici, on est là pour vous.`,
      ``,
      `L'équipe Dream Team Africa`,
    ].join("\n");

    try {
      await sendWhatsAppText(lead.phone, message);
      await prisma.exposantLead.update({
        where: { id: lead.id },
        data: { remindedAt: new Date() },
      });
      sent++;
      console.log(`[exposant-relance] Sent to ${lead.firstName} ${lead.lastName} (${lead.phone})`);
    } catch (err) {
      failed++;
      console.error(`[exposant-relance] Failed for ${lead.id}:`, err);
    }
  }

  return NextResponse.json({
    found: leads.length,
    sent,
    failed,
  });
}

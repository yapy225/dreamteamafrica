import nodemailer from "nodemailer";
import { prisma } from "./db";

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST || "mail59.lwspanel.com",
  port: Number(process.env.SMTP_PORT) || 465,
  secure: true,
  auth: {
    user: process.env.SMTP_USER || process.env.IMAP_USER,
    pass: process.env.SMTP_PASS || process.env.IMAP_PASS,
  },
});

export async function sendReply({
  to,
  subject,
  bodyHtml,
  bodyText,
  inReplyTo,
  references,
}: {
  to: string;
  subject: string;
  bodyHtml: string;
  bodyText: string;
  inReplyTo?: string | null;
  references?: string[];
}) {
  const headers: Record<string, string> = {};
  if (inReplyTo) headers["In-Reply-To"] = inReplyTo;
  if (references && references.length > 0) {
    headers["References"] = references.join(" ");
  }

  const info = await transporter.sendMail({
    from: `"Dream Team Africa" <${process.env.SMTP_USER || process.env.IMAP_USER || "hello@dreamteamafrica.com"}>`,
    to,
    subject,
    text: bodyText,
    html: bodyHtml,
    headers,
  });

  // Save sent email to database
  const saved = await prisma.email.create({
    data: {
      messageId: info.messageId || `sent-${Date.now()}`,
      folder: "Sent",
      fromName: "Dream Team Africa",
      fromEmail: process.env.SMTP_USER || process.env.IMAP_USER || "hello@dreamteamafrica.com",
      toEmails: [to],
      subject,
      bodyText,
      bodyHtml,
      snippet: bodyText.slice(0, 200).replace(/\n/g, " ").trim(),
      isRead: true,
      inReplyTo: inReplyTo || null,
      references: references || [],
      receivedAt: new Date(),
    },
  });

  return saved;
}

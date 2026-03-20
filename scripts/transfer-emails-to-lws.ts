import { ImapFlow } from "imapflow";
import { prisma } from "../src/lib/db";

async function main() {
  // Fetch all emails from database
  const emails = await prisma.email.findMany({
    orderBy: { receivedAt: "asc" },
  });

  console.log(`Found ${emails.length} emails in database`);

  if (emails.length === 0) {
    console.log("Nothing to transfer.");
    await prisma.$disconnect();
    return;
  }

  // Connect to IMAP
  const client = new ImapFlow({
    host: process.env.IMAP_HOST || "mail59.lwspanel.com",
    port: 993,
    secure: true,
    auth: {
      user: process.env.IMAP_USER || "hello@dreamteamafrica.com",
      pass: process.env.IMAP_PASS || "MYkachou225*",
    },
    logger: false,
  });

  await client.connect();
  console.log("Connected to IMAP server");

  let transferred = 0;
  let errors = 0;

  for (const email of emails) {
    try {
      // Build RFC 2822 raw email
      const date = new Date(email.receivedAt).toUTCString();
      const from = email.fromName
        ? `"${email.fromName.replace(/"/g, '\\"')}" <${email.fromEmail}>`
        : email.fromEmail;
      const to = (email.toEmails || []).join(", ");
      const cc = (email.ccEmails || []).join(", ");

      const boundary = `----boundary-${Date.now()}-${Math.random().toString(36).slice(2)}`;

      let rawEmail = `From: ${from}\r\n`;
      rawEmail += `To: ${to}\r\n`;
      if (cc) rawEmail += `Cc: ${cc}\r\n`;
      rawEmail += `Subject: ${email.subject}\r\n`;
      rawEmail += `Date: ${date}\r\n`;
      rawEmail += `Message-ID: ${email.messageId}\r\n`;
      if (email.inReplyTo) rawEmail += `In-Reply-To: ${email.inReplyTo}\r\n`;
      if (email.references?.length) rawEmail += `References: ${email.references.join(" ")}\r\n`;
      rawEmail += `MIME-Version: 1.0\r\n`;

      if (email.bodyHtml && email.bodyText) {
        rawEmail += `Content-Type: multipart/alternative; boundary="${boundary}"\r\n`;
        rawEmail += `\r\n`;
        rawEmail += `--${boundary}\r\n`;
        rawEmail += `Content-Type: text/plain; charset="utf-8"\r\n\r\n`;
        rawEmail += `${email.bodyText}\r\n`;
        rawEmail += `--${boundary}\r\n`;
        rawEmail += `Content-Type: text/html; charset="utf-8"\r\n\r\n`;
        rawEmail += `${email.bodyHtml}\r\n`;
        rawEmail += `--${boundary}--\r\n`;
      } else if (email.bodyHtml) {
        rawEmail += `Content-Type: text/html; charset="utf-8"\r\n\r\n`;
        rawEmail += `${email.bodyHtml}\r\n`;
      } else {
        rawEmail += `Content-Type: text/plain; charset="utf-8"\r\n\r\n`;
        rawEmail += `${email.bodyText || ""}\r\n`;
      }

      // Determine target folder
      const folder = email.folder === "Sent" ? "Sent" : "INBOX";

      // Set flags
      const flags: string[] = [];
      if (email.isRead) flags.push("\\Seen");
      if (email.isStarred) flags.push("\\Flagged");

      // APPEND to IMAP server
      await client.append(folder, Buffer.from(rawEmail), flags, email.receivedAt);

      transferred++;
      console.log(`[${transferred}/${emails.length}] ${email.folder} - ${email.subject}`);
    } catch (err: any) {
      errors++;
      console.error(`ERROR: ${email.subject} — ${err.message}`);
    }
  }

  await client.logout();
  await prisma.$disconnect();

  console.log(`\nDone! Transferred: ${transferred}, Errors: ${errors}`);
}

main().catch((err) => {
  console.error("Fatal error:", err);
  process.exit(1);
});

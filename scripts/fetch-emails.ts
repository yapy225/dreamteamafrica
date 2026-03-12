import { ImapFlow } from "imapflow";
import { simpleParser } from "mailparser";

async function main() {
  const client = new ImapFlow({
    host: process.env.IMAP_HOST || "imap.hostinger.com",
    port: 993,
    secure: true,
    auth: {
      user: process.env.IMAP_USER!,
      pass: process.env.IMAP_PASS!,
    },
    logger: false,
  });

  await client.connect();
  console.log("Connected to IMAP");

  // List mailboxes
  const mailboxes = await client.list();
  console.log("\nMailboxes:");
  for (const mb of mailboxes) {
    console.log(`  ${mb.path}`);
  }

  // Open INBOX
  const lock = await client.getMailboxLock("INBOX");
  try {
    console.log(`\nINBOX: ${(client.mailbox as any)?.exists} messages\n`);

    // Fetch last 100 messages to find exposition-related ones
    const total = (client.mailbox as any)?.exists || 0;
    const from = Math.max(1, total - 99);

    const contacts = new Map<string, { name: string; email: string; subject: string; date: string; snippet: string }>();

    for await (const msg of client.fetch(`${from}:*`, {
      envelope: true,
      source: true,
    })) {
      const env = msg.envelope;
      if (!env?.from?.[0]?.address) continue;

      const fromEmail = env.from[0].address.toLowerCase();
      const fromName = env.from[0].name || fromEmail;
      const subject = env.subject || "";
      const date = env.date?.toISOString().slice(0, 10) || "";

      // Skip system/noreply emails
      if (
        fromEmail.includes("noreply") ||
        fromEmail.includes("no-reply") ||
        fromEmail.includes("mailer-daemon") ||
        fromEmail.includes("postmaster") ||
        fromEmail.includes("resend") ||
        fromEmail.includes("stripe") ||
        fromEmail.includes("hostinger") ||
        fromEmail.includes("dreamteamafrica")
      ) continue;

      // Parse body for snippet
      let snippet = "";
      try {
        const parsed = await simpleParser(msg.source!);
        snippet = (parsed.text || "").slice(0, 200).replace(/\n/g, " ").trim();
      } catch {}

      // Deduplicate by email, keep most recent
      if (!contacts.has(fromEmail) || date > (contacts.get(fromEmail)?.date || "")) {
        contacts.set(fromEmail, { name: fromName, email: fromEmail, subject, date, snippet });
      }
    }

    console.log(`Found ${contacts.size} unique contacts:\n`);
    const sorted = [...contacts.values()].sort((a, b) => b.date.localeCompare(a.date));
    for (const c of sorted) {
      console.log(`${c.date} | ${c.name} <${c.email}>`);
      console.log(`  Subject: ${c.subject}`);
      if (c.snippet) console.log(`  Snippet: ${c.snippet.slice(0, 120)}`);
      console.log();
    }
  } finally {
    lock.release();
  }

  await client.logout();
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});

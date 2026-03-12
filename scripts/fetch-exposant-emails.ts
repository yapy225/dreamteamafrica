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

  // Scan both INBOX.Exposants and INBOX for exposant-related emails
  const folders = ["INBOX.Exposants", "INBOX"];
  const contacts = new Map<string, { name: string; email: string; subject: string; date: string; snippet: string; folder: string }>();

  for (const folder of folders) {
    const lock = await client.getMailboxLock(folder);
    try {
      const total = (client.mailbox as any)?.exists || 0;
      console.log(`${folder}: ${total} messages`);
      if (total === 0) continue;

      for await (const msg of client.fetch("1:*", {
        envelope: true,
        source: true,
      })) {
        const env = msg.envelope;
        if (!env?.from?.[0]?.address) continue;

        const fromEmail = env.from[0].address.toLowerCase();
        const fromName = env.from[0].name || fromEmail;
        const subject = env.subject || "";
        const date = env.date?.toISOString().slice(0, 10) || "";

        // Skip system emails
        if (
          fromEmail.includes("noreply") ||
          fromEmail.includes("no-reply") ||
          fromEmail.includes("mailer-daemon") ||
          fromEmail.includes("postmaster") ||
          fromEmail.includes("resend") ||
          fromEmail.includes("stripe") ||
          fromEmail.includes("hostinger") ||
          fromEmail.includes("dreamteamafrica") ||
          fromEmail.includes("zoho") ||
          fromEmail.includes("meta") ||
          fromEmail.includes("groupon") ||
          fromEmail.includes("dentsu") ||
          fromEmail.includes("flair-agence") ||
          fromEmail.includes("seogardenparty") ||
          fromEmail.includes("openai") ||
          fromEmail.includes("proxy") ||
          fromEmail.includes("suticketlink")
        ) continue;

        let snippet = "";
        try {
          const parsed = await simpleParser(msg.source!);
          snippet = (parsed.text || "").slice(0, 300).replace(/\n/g, " ").trim();
        } catch {}

        // For INBOX, only keep exposant-related subjects
        if (folder === "INBOX") {
          const lowerSubject = subject.toLowerCase();
          const lowerSnippet = snippet.toLowerCase();
          const isExposant =
            lowerSubject.includes("expos") ||
            lowerSubject.includes("stand") ||
            lowerSubject.includes("foire") ||
            lowerSubject.includes("salon") ||
            lowerSubject.includes("fashion") ||
            lowerSubject.includes("réservation") ||
            lowerSubject.includes("reservation") ||
            lowerSubject.includes("particip") ||
            lowerSnippet.includes("exposant") ||
            lowerSnippet.includes("stand") ||
            lowerSnippet.includes("participer") ||
            lowerSnippet.includes("exposition");
          if (!isExposant) continue;
        }

        if (!contacts.has(fromEmail) || date > (contacts.get(fromEmail)?.date || "")) {
          contacts.set(fromEmail, { name: fromName, email: fromEmail, subject, date, snippet, folder });
        }
      }
    } finally {
      lock.release();
    }
  }

  console.log(`\n=== ${contacts.size} CONTACTS EXPOSANTS UNIQUES ===\n`);
  const sorted = [...contacts.values()].sort((a, b) => b.date.localeCompare(a.date));
  for (const c of sorted) {
    console.log(`${c.date} | ${c.name} <${c.email}> [${c.folder}]`);
    console.log(`  Subject: ${c.subject}`);
    if (c.snippet) console.log(`  Snippet: ${c.snippet.slice(0, 150)}`);
    console.log();
  }

  await client.logout();
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});

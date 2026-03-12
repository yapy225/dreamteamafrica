import { ImapFlow } from "imapflow";
import { simpleParser } from "mailparser";
import { writeFileSync, mkdirSync } from "fs";

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

  const mailboxes = await client.list();
  const folders = mailboxes.map((m) => m.path);
  console.log(`Folders: ${folders.join(", ")}\n`);

  const allEmails: any[] = [];

  for (const folder of folders) {
    const lock = await client.getMailboxLock(folder);
    try {
      const total = (client.mailbox as any)?.exists || 0;
      if (total === 0) {
        lock.release();
        continue;
      }
      console.log(`${folder}: ${total} messages`);

      let count = 0;
      for await (const msg of client.fetch("1:*", {
        envelope: true,
        source: true,
      })) {
        const env = msg.envelope;
        if (!env) continue;

        let body = "";
        let attachments: string[] = [];
        try {
          const parsed = await simpleParser(msg.source!);
          body = (parsed.text || "").slice(0, 1000);
          attachments = (parsed.attachments || []).map((a) => a.filename || "unnamed");
        } catch {}

        allEmails.push({
          folder,
          uid: msg.uid,
          date: env.date?.toISOString() || "",
          from: env.from?.[0] ? `${env.from[0].name || ""} <${env.from[0].address || ""}>`.trim() : "",
          fromEmail: env.from?.[0]?.address || "",
          to: env.to?.[0] ? `${env.to[0].name || ""} <${env.to[0].address || ""}>`.trim() : "",
          subject: env.subject || "",
          body,
          attachments,
        });

        count++;
        if (count % 50 === 0) process.stdout.write(`\r  ${folder}: ${count}/${total}`);
      }
      console.log(`\r  ${folder}: ${count}/${total} done`);
    } finally {
      lock.release();
    }
  }

  await client.logout();

  // Save as JSON
  const outPath = "/Users/yaps225/Downloads/dreamteam-emails-export.json";
  writeFileSync(outPath, JSON.stringify(allEmails, null, 2), "utf-8");
  console.log(`\nExported ${allEmails.length} emails to ${outPath}`);

  // Also save as CSV
  const csvPath = "/Users/yaps225/Downloads/dreamteam-emails-export.csv";
  const csvHeader = "Dossier,Date,De,Email,Objet,Pièces jointes\n";
  const csvRows = allEmails.map((e) =>
    [
      e.folder,
      e.date.slice(0, 19),
      `"${(e.from || "").replace(/"/g, '""')}"`,
      e.fromEmail,
      `"${(e.subject || "").replace(/"/g, '""')}"`,
      `"${(e.attachments || []).join(", ")}"`,
    ].join(",")
  );
  writeFileSync(csvPath, csvHeader + csvRows.join("\n"), "utf-8");
  console.log(`Exported CSV to ${csvPath}`);

  // Stats
  const byFolder = new Map<string, number>();
  for (const e of allEmails) {
    byFolder.set(e.folder, (byFolder.get(e.folder) || 0) + 1);
  }
  console.log("\nStats:");
  for (const [f, c] of byFolder) {
    console.log(`  ${f}: ${c}`);
  }
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});

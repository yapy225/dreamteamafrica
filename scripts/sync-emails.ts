import { ImapFlow } from "imapflow";
import { simpleParser } from "mailparser";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function syncEmails(folder = "INBOX", maxMessages = 500) {
  const host = process.env.IMAP_HOST || "mail59.lwspanel.com";
  const user = process.env.IMAP_USER || "hello@dreamteamafrica.com";
  const pass = process.env.IMAP_PASS!;

  console.log(`Connecting to ${host} as ${user}...`);

  const client = new ImapFlow({
    host,
    port: 993,
    secure: true,
    auth: { user, pass },
    logger: false,
  });

  await client.connect();
  console.log("Connected");

  let syncState = await prisma.emailSyncState.findUnique({
    where: { folder },
  });

  if (!syncState) {
    syncState = await prisma.emailSyncState.create({
      data: { folder, lastUid: 0 },
    });
  }

  const lock = await client.getMailboxLock(folder);
  let synced = 0;

  try {
    const total = (client.mailbox as any)?.exists || 0;
    console.log(`${folder}: ${total} messages`);
    if (total === 0) {
      lock.release();
      await client.logout();
      console.log("No messages to sync");
      return;
    }

    // Use UID SEARCH to find messages newer than lastUid
    let uids: number[] = [];
    try {
      const searchResult = await client.search(
        syncState.lastUid > 0 ? { uid: `${syncState.lastUid + 1}:*` } : { all: true },
        { uid: true }
      );
      uids = (searchResult || []).filter((uid: number) => uid > syncState!.lastUid);
    } catch {
      // Fallback: fetch all
      try {
        const searchResult = await client.search({ all: true }, { uid: true });
        uids = (searchResult || []).filter((uid: number) => uid > syncState!.lastUid);
      } catch {}
    }

    console.log(`Found ${uids.length} new messages (lastUid: ${syncState.lastUid})`);
    if (uids.length === 0) {
      lock.release();
      await client.logout();
      const totalInDb = await prisma.email.count({ where: { folder } });
      console.log(`No new messages. Total in DB: ${totalInDb}`);
      return;
    }

    const range = uids.join(",");
    let maxUid = syncState.lastUid;

    for await (const msg of client.fetch(range, {
      envelope: true,
      source: true,
      uid: true,
    })) {
      if (synced >= maxMessages) break;
      if (msg.uid <= syncState.lastUid) continue;

      const env = msg.envelope;
      if (!env) continue;

      let bodyText = "";
      let bodyHtml = "";
      let attachmentList: any[] = [];
      let inReplyTo: string | null = null;
      let references: string[] = [];

      try {
        const parsed = await simpleParser(msg.source!);
        bodyText = parsed.text || "";
        bodyHtml = parsed.html || "";
        attachmentList = (parsed.attachments || []).map((a) => ({
          filename: a.filename || "unnamed",
          contentType: a.contentType || "application/octet-stream",
          size: a.size || 0,
        }));
        inReplyTo = parsed.inReplyTo || null;
        if (parsed.references) {
          references = Array.isArray(parsed.references)
            ? parsed.references
            : [parsed.references];
        }
      } catch {}

      const messageId =
        env.messageId || `no-id-${msg.uid}-${folder}-${Date.now()}`;
      const fromAddr = env.from?.[0];
      const toAddrs = (env.to || []).map((t: any) => t.address || "");
      const ccAddrs = (env.cc || []).map((c: any) => c.address || "");
      const snippet = bodyText.slice(0, 200).replace(/\n/g, " ").trim();

      try {
        await prisma.email.upsert({
          where: { messageId },
          create: {
            messageId,
            imapUid: msg.uid,
            folder,
            fromName: fromAddr?.name || null,
            fromEmail: fromAddr?.address || "",
            toEmails: toAddrs,
            ccEmails: ccAddrs,
            subject: env.subject || "(sans objet)",
            bodyText,
            bodyHtml,
            snippet,
            hasAttachments: attachmentList.length > 0,
            attachments: attachmentList.length > 0 ? attachmentList : undefined,
            inReplyTo,
            references,
            receivedAt: env.date || new Date(),
          },
          update: {},
        });
        synced++;
        process.stdout.write(`\r  Synced: ${synced}`);
      } catch (err: any) {
        if (!err.message?.includes("Unique constraint")) {
          console.error(`\n  Error: ${err.message}`);
        }
      }

      if (msg.uid > maxUid) maxUid = msg.uid;
    }

    if (maxUid > syncState.lastUid) {
      await prisma.emailSyncState.update({
        where: { folder },
        data: { lastUid: maxUid, lastSyncAt: new Date() },
      });
    }
  } finally {
    lock.release();
  }

  await client.logout();
  const totalInDb = await prisma.email.count({ where: { folder } });
  console.log(`\nDone! Synced: ${synced}, Total in DB: ${totalInDb}`);
}

syncEmails().then(() => prisma.$disconnect()).catch((e) => {
  console.error(e);
  process.exit(1);
});

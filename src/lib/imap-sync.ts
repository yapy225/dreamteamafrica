import { ImapFlow } from "imapflow";
import { simpleParser } from "mailparser";
import { prisma } from "./db";

export async function syncEmails(folder = "INBOX", maxMessages = 200) {
  const host = process.env.IMAP_HOST || "mail59.lwspanel.com";
  const user = process.env.IMAP_USER!;

  console.log(`[IMAP] Connecting to ${host} as ${user}...`);

  const client = new ImapFlow({
    host,
    port: 993,
    secure: true,
    auth: { user, pass: process.env.IMAP_PASS! },
    logger: false,
    tls: { rejectUnauthorized: true, servername: host },
  });

  try {
    await client.connect();
  } catch (err: any) {
    console.error(`[IMAP] Connection failed:`, err.message);
    throw new Error(`IMAP connection failed: ${err.message}`);
  }
  console.log("[IMAP] Connected");

  // Get last synced UID
  let syncState = await prisma.emailSyncState.findUnique({
    where: { folder },
  });

  if (!syncState) {
    syncState = await prisma.emailSyncState.create({
      data: { folder, lastUid: 0 },
    });
  }

  let lock;
  try {
    lock = await client.getMailboxLock(folder);
  } catch (err: any) {
    console.error(`[IMAP] Failed to lock ${folder}:`, err.message);
    await client.logout();
    throw new Error(`IMAP mailbox lock failed: ${err.message}`);
  }
  console.log(`[IMAP] Mailbox locked: ${folder}`);
  let synced = 0;

  try {
    const total = (client.mailbox as any)?.exists || 0;
    console.log(`[IMAP] ${folder}: ${total} messages`);
    if (total === 0) {
      lock.release();
      await client.logout();
      return { synced: 0, total: 0 };
    }

    // Fetch messages with UID greater than lastUid
    const range = syncState.lastUid > 0 ? `${syncState.lastUid + 1}:*` : "1:*";
    console.log(`[IMAP] Fetching range: ${range}`);
    let maxUid = syncState.lastUid;
    let count = 0;

    for await (const msg of client.fetch(range, {
      envelope: true,
      source: true,
      uid: true,
    })) {
      if (count >= maxMessages) break;
      if (msg.uid <= syncState.lastUid) continue;

      const env = msg.envelope;
      if (!env) continue;

      let bodyText = "";
      let bodyHtml = "";
      let attachmentList: { filename: string; contentType: string; size: number }[] = [];
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
      const toAddrs = (env.to || []).map(
        (t: any) => t.address || ""
      );
      const ccAddrs = (env.cc || []).map(
        (c: any) => c.address || ""
      );

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
            attachments:
              attachmentList.length > 0 ? attachmentList : undefined,
            inReplyTo,
            references,
            receivedAt: env.date || new Date(),
          },
          update: {},
        });
        synced++;
      } catch (err: any) {
        // Skip duplicates
        if (!err.message?.includes("Unique constraint")) {
          console.error(`Email sync error: ${err.message}`);
        }
      }

      if (msg.uid > maxUid) maxUid = msg.uid;
      count++;
    }

    // Update sync state
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

  const totalEmails = await prisma.email.count({ where: { folder } });
  return { synced, total: totalEmails };
}

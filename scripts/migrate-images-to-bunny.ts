import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

const VERCEL_BLOB_HOST = "fxsckhiprgvaidgc.public.blob.vercel-storage.com";
const BUNNY_STORAGE_API_KEY = process.env.BUNNY_STORAGE_API_KEY!;
const BUNNY_STORAGE_ZONE = process.env.BUNNY_STORAGE_ZONE!;
const BUNNY_STORAGE_HOSTNAME = process.env.BUNNY_STORAGE_HOSTNAME ?? "storage.bunnycdn.com";
const CDN_URL = process.env.NEXT_PUBLIC_BUNNY_CDN_URL!;

function sanitize(name: string): string {
  return name
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-zA-Z0-9._-]/g, "-")
    .replace(/-+/g, "-")
    .toLowerCase();
}

async function migrateToBunny(vercelUrl: string, folder: string): Promise<string> {
  // Download from Vercel Blob
  const res = await fetch(vercelUrl);
  if (!res.ok) {
    console.error(`  ✗ Download failed for ${vercelUrl}: ${res.status}`);
    return vercelUrl; // keep original if download fails
  }
  const buffer = Buffer.from(await res.arrayBuffer());
  const contentType = res.headers.get("content-type") ?? "application/octet-stream";

  // Extract and sanitize filename
  const urlPath = new URL(vercelUrl).pathname;
  const originalName = decodeURIComponent(urlPath.split("/").pop()!);
  const safeName = sanitize(originalName);
  const bunnyPath = `${folder}/${Date.now()}-${safeName}`;

  // Upload to Bunny
  const uploadUrl = `https://${BUNNY_STORAGE_HOSTNAME}/${BUNNY_STORAGE_ZONE}/${bunnyPath}`;
  const uploadRes = await fetch(uploadUrl, {
    method: "PUT",
    headers: {
      AccessKey: BUNNY_STORAGE_API_KEY,
      "Content-Type": contentType,
    },
    body: buffer,
  });

  if (!uploadRes.ok) {
    console.error(`  ✗ Upload failed for ${safeName}: ${uploadRes.status}`);
    return vercelUrl;
  }

  const cdnUrl = `${CDN_URL}/${bunnyPath}`;
  console.log(`  ✓ ${originalName} → ${cdnUrl}`);
  return cdnUrl;
}

function isVercelBlob(url: string | null | undefined): boolean {
  return !!url && url.includes(VERCEL_BLOB_HOST);
}

async function main() {
  console.log("=== Migration des images Vercel Blob → Bunny CDN ===\n");

  // 1. Users
  const users = await prisma.user.findMany({ where: { image: { contains: VERCEL_BLOB_HOST } } });
  if (users.length) {
    console.log(`\n[User] ${users.length} image(s) à migrer`);
    for (const u of users) {
      if (!isVercelBlob(u.image)) continue;
      const newUrl = await migrateToBunny(u.image!, "users");
      await prisma.user.update({ where: { id: u.id }, data: { image: newUrl } });
    }
  }

  // 2. Articles
  const articles = await prisma.article.findMany({ where: { coverImage: { contains: VERCEL_BLOB_HOST } } });
  if (articles.length) {
    console.log(`\n[Article] ${articles.length} image(s) à migrer`);
    for (const a of articles) {
      if (!isVercelBlob(a.coverImage)) continue;
      const newUrl = await migrateToBunny(a.coverImage!, "articles");
      await prisma.article.update({ where: { id: a.id }, data: { coverImage: newUrl } });
    }
  }

  // 3. Events
  const events = await prisma.event.findMany({ where: { coverImage: { contains: VERCEL_BLOB_HOST } } });
  if (events.length) {
    console.log(`\n[Event] ${events.length} image(s) à migrer`);
    for (const e of events) {
      if (!isVercelBlob(e.coverImage)) continue;
      const newUrl = await migrateToBunny(e.coverImage!, "events");
      await prisma.event.update({ where: { id: e.id }, data: { coverImage: newUrl } });
    }
  }

  // 4. Products (images is String[])
  const products = await prisma.product.findMany();
  const productsToMigrate = products.filter((p) => p.images.some((img) => img.includes(VERCEL_BLOB_HOST)));
  if (productsToMigrate.length) {
    console.log(`\n[Product] ${productsToMigrate.length} produit(s) avec images à migrer`);
    for (const p of productsToMigrate) {
      const newImages = await Promise.all(
        p.images.map((img) => (isVercelBlob(img) ? migrateToBunny(img, "products") : img)),
      );
      await prisma.product.update({ where: { id: p.id }, data: { images: newImages } });
    }
  }

  // 5. AdCampaign
  const ads = await prisma.adCampaign.findMany({ where: { imageUrl: { contains: VERCEL_BLOB_HOST } } });
  if (ads.length) {
    console.log(`\n[AdCampaign] ${ads.length} image(s) à migrer`);
    for (const a of ads) {
      if (!isVercelBlob(a.imageUrl)) continue;
      const newUrl = await migrateToBunny(a.imageUrl!, "ads");
      await prisma.adCampaign.update({ where: { id: a.id }, data: { imageUrl: newUrl } });
    }
  }

  // 6. OfficielContent
  const officielEntries = await prisma.officielContent.findMany({ where: { coverImage: { contains: VERCEL_BLOB_HOST } } });
  if (officielEntries.length) {
    console.log(`\n[OfficielContent] ${officielEntries.length} image(s) à migrer`);
    for (const o of officielEntries) {
      if (!isVercelBlob(o.coverImage)) continue;
      const newUrl = await migrateToBunny(o.coverImage!, "officiel-afrique");
      await prisma.officielContent.update({ where: { id: o.id }, data: { coverImage: newUrl } });
    }
  }

  // 7. JournalAd
  const journalAds = await prisma.journalAd.findMany({ where: { imageUrl: { contains: VERCEL_BLOB_HOST } } });
  if (journalAds.length) {
    console.log(`\n[JournalAd] ${journalAds.length} image(s) à migrer`);
    for (const j of journalAds) {
      if (!isVercelBlob(j.imageUrl)) continue;
      const newUrl = await migrateToBunny(j.imageUrl!, "journal-ads");
      await prisma.journalAd.update({ where: { id: j.id }, data: { imageUrl: newUrl } });
    }
  }

  console.log("\n=== Migration terminée ===");
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());

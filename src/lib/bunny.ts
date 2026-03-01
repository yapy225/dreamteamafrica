const STORAGE_API_KEY = process.env.BUNNY_STORAGE_API_KEY!;
const STORAGE_ZONE = process.env.BUNNY_STORAGE_ZONE!;
const STORAGE_HOSTNAME = process.env.BUNNY_STORAGE_HOSTNAME ?? "storage.bunnycdn.com";
const CDN_URL = process.env.NEXT_PUBLIC_BUNNY_CDN_URL!;

function sanitizeFileName(name: string): string {
  return name
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-zA-Z0-9._-]/g, "-")
    .replace(/-+/g, "-")
    .toLowerCase();
}

function buildStorageUrl(path: string): string {
  const clean = path.startsWith("/") ? path.slice(1) : path;
  return `https://${STORAGE_HOSTNAME}/${STORAGE_ZONE}/${clean}`;
}

export function getCdnUrl(path: string): string {
  const clean = path.startsWith("/") ? path.slice(1) : path;
  return `${CDN_URL}/${clean}`;
}

export async function uploadFile(
  file: File,
  folder = "",
): Promise<{ url: string; path: string }> {
  const safeName = sanitizeFileName(file.name);
  const timestamp = Date.now();
  const filePath = folder
    ? `${folder}/${timestamp}-${safeName}`
    : `${timestamp}-${safeName}`;

  const buffer = Buffer.from(await file.arrayBuffer());

  const res = await fetch(buildStorageUrl(filePath), {
    method: "PUT",
    headers: {
      AccessKey: STORAGE_API_KEY,
      "Content-Type": file.type || "application/octet-stream",
    },
    body: buffer,
  });

  if (!res.ok) {
    const text = await res.text();
    throw new Error(`Bunny upload failed (${res.status}): ${text}`);
  }

  return { url: getCdnUrl(filePath), path: filePath };
}

export async function deleteFile(filePath: string): Promise<void> {
  const res = await fetch(buildStorageUrl(filePath), {
    method: "DELETE",
    headers: { AccessKey: STORAGE_API_KEY },
  });

  if (!res.ok && res.status !== 404) {
    const text = await res.text();
    throw new Error(`Bunny delete failed (${res.status}): ${text}`);
  }
}

interface BunnyStorageObject {
  ObjectName: string;
  Path: string;
  IsDirectory: boolean;
  Length: number;
  LastChanged: string;
}

export async function listFiles(folder = ""): Promise<BunnyStorageObject[]> {
  const path = folder ? `${folder}/` : "";
  const res = await fetch(buildStorageUrl(path), {
    method: "GET",
    headers: { AccessKey: STORAGE_API_KEY, Accept: "application/json" },
  });

  if (!res.ok) {
    const text = await res.text();
    throw new Error(`Bunny list failed (${res.status}): ${text}`);
  }

  return res.json();
}

import sharp from "sharp";
import { uploadBuffer } from "./bunny";

const LOGO_URL =
  "https://dreamteamafricamedia.b-cdn.net/foiredafriqueparis/logo/FoireDafriqueParis_2026.png";
const BANNER_TEXT = "Foire d'Afrique Paris — 1er & 2 mai 2026";

let _logoBuffer: Buffer | null = null;

async function getLogoBuffer(): Promise<Buffer> {
  if (_logoBuffer) return _logoBuffer;
  const res = await fetch(LOGO_URL);
  _logoBuffer = Buffer.from(await res.arrayBuffer());
  return _logoBuffer;
}

/**
 * Compose a branded image:
 * - Original exhibitor image
 * - Logo Foire d'Afrique in bottom-right
 * - Banner text at the bottom
 *
 * Returns the Bunny CDN URL of the composed image.
 */
export async function createBrandedImage(
  imageUrl: string,
  outputPath: string,
): Promise<string> {
  // Download original image
  const imgRes = await fetch(imageUrl);
  const imgBuffer = Buffer.from(await imgRes.arrayBuffer());

  // Get image dimensions
  const metadata = await sharp(imgBuffer).metadata();
  const width = metadata.width || 1200;
  const height = metadata.height || 800;

  // Resize original to 1200px wide for consistency
  const targetW = 1200;
  const scale = targetW / width;
  const targetH = Math.round(height * scale);
  const bannerH = 60;
  const totalH = targetH + bannerH;

  // Resize original
  const resizedImg = await sharp(imgBuffer)
    .resize(targetW, targetH, { fit: "cover" })
    .toBuffer();

  // Prepare logo (150px wide, transparent background)
  const logoRaw = await getLogoBuffer();
  const logoSize = 120;
  const logoResized = await sharp(logoRaw)
    .resize(logoSize, logoSize, { fit: "contain", background: { r: 0, g: 0, b: 0, alpha: 0 } })
    .toBuffer();

  // Create banner with text
  const bannerSvg = Buffer.from(`
    <svg width="${targetW}" height="${bannerH}">
      <rect width="100%" height="100%" fill="#1A1A1A"/>
      <text
        x="${targetW / 2}"
        y="${bannerH / 2 + 6}"
        text-anchor="middle"
        font-family="Arial, sans-serif"
        font-size="22"
        font-weight="bold"
        fill="#d4af37"
        letter-spacing="2"
      >${BANNER_TEXT.replace(/&/g, "&amp;")}</text>
    </svg>
  `);

  // Compose: original + logo overlay + banner at bottom
  const composed = await sharp({
    create: {
      width: targetW,
      height: totalH,
      channels: 3,
      background: { r: 26, g: 26, b: 26 },
    },
  })
    .composite([
      // Original image
      { input: resizedImg, top: 0, left: 0 },
      // Logo in bottom-right of the image (above banner)
      {
        input: logoResized,
        top: targetH - logoSize - 15,
        left: targetW - logoSize - 15,
      },
      // Banner at bottom
      { input: bannerSvg, top: targetH, left: 0 },
    ])
    .webp({ quality: 85 })
    .toBuffer();

  // Upload to Bunny CDN
  const { url } = await uploadBuffer(
    Buffer.from(composed),
    outputPath,
    "image/webp",
  );

  return url;
}

import OpenAI from "openai";
import { uploadBuffer } from "./bunny";

function getOpenAI() {
  return new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
}

/**
 * Use GPT-4 Vision to describe the original image,
 * then build a DALL-E prompt from that description.
 */
async function describeImage(imageUrl: string, title: string): Promise<string> {
  const response = await getOpenAI().chat.completions.create({
    model: "gpt-4o",
    messages: [
      {
        role: "user",
        content: [
          {
            type: "text",
            text: [
              `This is the cover image for an article titled: "${title}".`,
              "Describe this photograph with extreme precision so it can be recreated as a near-identical image.",
              "Include EVERY detail:",
              "- Exact number of people, their gender, age range, ethnicity, clothing, posture, facial expressions, gestures",
              "- Exact setting: indoor/outdoor, furniture, objects, architecture, vegetation",
              "- Camera angle: close-up, medium shot, wide angle, bird's eye, etc.",
              "- Lighting: direction, intensity, natural/artificial, shadows, highlights",
              "- Color palette: dominant colors, warm/cool tones, saturation level",
              "- Depth of field: what is in focus, what is blurred",
              "Be extremely specific and literal. 4-5 detailed sentences.",
            ].join(" "),
          },
          { type: "image_url", image_url: { url: imageUrl } },
        ],
      },
    ],
    max_tokens: 500,
  });

  return response.choices[0]?.message?.content || title;
}

function buildPrompt(description: string): string {
  return [
    `Reproduce this exact scene as a realistic photograph: ${description}`,
    "Ultra-realistic, indistinguishable from a real photo taken by a professional photographer.",
    "Natural imperfections: skin texture, fabric wrinkles, real shadows.",
    "No artistic filters, no illustration, no painting, no digital art, no text, no watermarks.",
  ].join(" ");
}

function buildFallbackPrompt(title: string, category: string): string {
  return [
    `Authentic documentary photograph illustrating: "${title}".`,
    `Category: ${category}.`,
    "Shot on a Canon EOS R5, natural lighting, candid moment.",
    "Photojournalism style, real and authentic feel.",
    "No illustrations, no digital art, no text, no watermarks.",
  ].join(" ");
}

/**
 * Generate a cover image inspired by the original article photo.
 * 1. If originalImageUrl is provided → GPT-4o describes it → DALL-E recreates it
 * 2. If no original image → DALL-E generates from title + category
 * Returns the Bunny CDN URL, or null on failure.
 */
export async function generateCoverImage(
  title: string,
  category: string,
  slug: string,
  originalImageUrl?: string | null,
): Promise<string | null> {
  try {
    let prompt: string;

    if (originalImageUrl) {
      console.log(`[COVER IMAGE] Analyzing original image: ${originalImageUrl}`);
      const description = await describeImage(originalImageUrl, title);
      console.log(`[COVER IMAGE] Description: ${description}`);
      prompt = buildPrompt(description);
    } else {
      prompt = buildFallbackPrompt(title, category);
    }

    const response = await getOpenAI().images.generate({
      model: "dall-e-3",
      prompt,
      n: 1,
      size: "1792x1024",
      response_format: "url",
    });

    const imageUrl = response.data?.[0]?.url;
    if (!imageUrl) return null;

    const imgRes = await fetch(imageUrl);
    if (!imgRes.ok) return null;

    const buffer = Buffer.from(await imgRes.arrayBuffer());
    const filePath = `articles/${slug}.png`;

    const { url } = await uploadBuffer(buffer, filePath, "image/png");

    console.log(`[COVER IMAGE] Generated and uploaded: ${url}`);
    return url;
  } catch (error) {
    console.error("[COVER IMAGE] Generation failed:", error);
    return null;
  }
}

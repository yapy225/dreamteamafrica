/**
 * Pexels API integration for article cover images.
 * Replaces DALL-E for article illustrations with real, free HD photos.
 */

interface PexelsPhoto {
  id: number;
  width: number;
  height: number;
  url: string;
  photographer: string;
  photographer_url: string;
  src: {
    original: string;
    large2x: string;
    large: string;
    medium: string;
    small: string;
    portrait: string;
    landscape: string;
    tiny: string;
  };
  alt: string;
}

interface PexelsSearchResponse {
  total_results: number;
  page: number;
  per_page: number;
  photos: PexelsPhoto[];
}

/**
 * Search Pexels for a photo matching the given query.
 * Returns the URL of the best matching landscape photo, or null if none found.
 */
export async function searchPexelsPhoto(
  query: string,
  options?: { orientation?: "landscape" | "portrait" | "square"; perPage?: number },
): Promise<{ url: string; photographer: string; alt: string } | null> {
  const apiKey = process.env.PEXELS_API_KEY;
  if (!apiKey) {
    console.error("[Pexels] API key not configured");
    return null;
  }

  const orientation = options?.orientation || "landscape";
  const perPage = options?.perPage || 5;

  const params = new URLSearchParams({
    query,
    orientation,
    per_page: String(perPage),
    locale: "fr-FR",
  });

  try {
    const res = await fetch(
      `https://api.pexels.com/v1/search?${params.toString()}`,
      {
        headers: { Authorization: apiKey },
      },
    );

    if (!res.ok) {
      console.error(`[Pexels] API error: ${res.status}`);
      return null;
    }

    const data: PexelsSearchResponse = await res.json();

    if (data.photos.length === 0) {
      return null;
    }

    // Pick a random photo from the top results for variety
    const photo = data.photos[Math.floor(Math.random() * data.photos.length)];

    return {
      url: photo.src.large2x || photo.src.large, // HD quality
      photographer: photo.photographer,
      alt: photo.alt || query,
    };
  } catch (err) {
    console.error("[Pexels] Fetch error:", err);
    return null;
  }
}

/**
 * Generate search keywords from article title and category.
 * Uses the most relevant words for better image matching.
 */
export function buildPexelsQuery(title: string, category: string): string {
  // Map French categories to English search terms for better Pexels results
  const categoryMap: Record<string, string> = {
    ACTUALITE: "africa news",
    CULTURE: "african culture",
    CINEMA: "african cinema film",
    MUSIQUE: "african music",
    SPORT: "african sport",
    DIASPORA: "african diaspora",
    BUSINESS: "african business entrepreneur",
    LIFESTYLE: "african lifestyle",
    OPINION: "africa people",
  };

  const categoryQuery = categoryMap[category] || "africa";

  // Extract key words from title (remove common French words)
  const stopWords = new Set([
    "le", "la", "les", "un", "une", "des", "de", "du", "au", "aux",
    "et", "ou", "en", "dans", "sur", "pour", "par", "avec", "ce",
    "cette", "ces", "son", "sa", "ses", "qui", "que", "quoi", "dont",
    "est", "sont", "a", "ont", "fait", "être", "avoir", "plus",
    "très", "pas", "ne", "se", "il", "elle", "ils", "elles",
  ]);

  const titleWords = title
    .toLowerCase()
    .replace(/[^a-zàâéèêëïîôùûüç\s]/g, "")
    .split(/\s+/)
    .filter((w) => w.length > 3 && !stopWords.has(w))
    .slice(0, 4)
    .join(" ");

  return `${titleWords} ${categoryQuery}`.trim();
}

import OpenAI from "openai";
import { marked } from "marked";

// ── OpenAI ──

export function getOpenAI() {
  return new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
}

// ── Scoring prompt ──

export const SCORE_SYSTEM_PROMPT = `Role : Analyste de tendances pour le media "L'Afropeen".
Mission : Evaluer le POTENTIEL THEMATIQUE d'un sujet a partir d'un signal faible (resume RSS).

Consigne de notation (1-10) :

Note le SUJET, pas la redaction. Si le resume est court mais traite d'un sujet strategique (Tech, Finance, Diaspora, Culture, Innovation en Afrique), donne une note elevee.

9-10 (Strategique) : Levees de fonds, Licornes africaines, geopolitique majeure, succes eclatants de la diaspora.
7-8 (Pertinent) : Initiatives locales innovantes, tendances culturelles fortes, nouveaux marches.
5-6 (Moyen mais exploitable) : Actualite economique ou politique classique qui necessite un angle "Afropeen" pour devenir interessante.
1-4 (A ecarter) : Faits divers, sport pur, meteo, depeches sans analyse possible.

Format de sortie : {"score": X, "topic_potential": "explication en 5 mots"}`;

export function buildScoreUserPrompt(title: string, summary: string) {
  return `Note cet article pour L'Afropeen sur 10.

Regles de scoring (obligatoires) :
- 1-3 : hors ligne editoriale / faible interet
- 4-6 : moyen / pas prioritaire
- 7-8 : bon / interessant
- 9-10 : excellent / tres prioritaire (impact diaspora + potentiel viral)

Interdiction : ne reponds PAS 7 par defaut.
Important: 7 doit etre rare. Utilise 5,6 pour "moyen" et 8,9 pour "fort".
Si l'info est trop vague, mets 4 ou 5.
Si c'est tres pertinent, monte a 8-10.

Titre : ${title}
Resume : ${summary || "Pas de resume disponible"}

Reponds uniquement sous ce format exact :
{"score": X, "topic_potential": "explication en 5 mots"}`;
}

export function buildRewritePrompt(title: string, summary: string) {
  return `Tu es journaliste expert pour L'Afropeen, media specialise Afrique, diaspora, economie emergente et innovation culturelle.

Redige un article expert structure SEO a partir des elements suivants :

Titre : ${title}
Resume RSS : ${summary}

Structure obligatoire en Markdown :
- Premiere ligne : le titre optimise SEO (sans prefixe, sans #)
- Un paragraphe d'introduction (sans sous-titre "Introduction")
- 3 a 4 sections avec des sous-titres ## evocateurs et journalistiques (JAMAIS de titres generiques comme "Introduction contextualisee", "Analyse strategique", "Conclusion prospective", "Enjeux pour la diaspora")
- Un dernier paragraphe de conclusion avec un sous-titre ## accrocheur (PAS "Conclusion prospective")

Apres l'article, ajoute sur des lignes separees :
META: [meta description de 155 caracteres max]
KEYWORDS: [5 mots-cles SEO separes par des virgules]

Important :
- Utilise le format Markdown : ## pour les sous-titres, **gras**, *italique*. Ne mets JAMAIS "h2", "h:2" ou du HTML brut.
- Ne pas inventer de donnees chiffrees.
- Ne pas halluciner des faits.
- Ajouter de la profondeur strategique.
- Style professionnel, credible et analytique.
- Redige en francais.`;
}

// ── Score parsing ──

export function parseScoreResponse(text: string): { score: number; reason: string } {
  const scoreMatch = text.match(/"score"\s*:\s*(\d+)/);
  const score = scoreMatch ? parseInt(scoreMatch[1], 10) : 0;
  const topicMatch = text.match(/"topic_potential"\s*:\s*"([^"]+)"/);
  const reason = topicMatch?.[1] || text;
  return { score, reason };
}

// ── Rewrite parsing ──

export function parseRewriteResponse(raw: string, fallbackTitle: string, fallbackSummary: string) {
  const lines = raw.split("\n");
  const metaLine = lines.find((l) => l.startsWith("META:"));
  const keywordsLine = lines.find((l) => l.startsWith("KEYWORDS:"));

  const meta = metaLine?.replace("META:", "").trim() || "";
  const keywords = keywordsLine
    ? keywordsLine.replace("KEYWORDS:", "").trim().split(",").map((k) => k.trim()).filter(Boolean)
    : [];

  const contentLines = lines.filter(
    (l) => !l.startsWith("META:") && !l.startsWith("KEYWORDS:")
  );

  const firstLine = contentLines.find((l) => l.trim());
  const title = firstLine?.replace(/^#+\s*/, "").trim() || fallbackTitle;
  const contentBody = contentLines
    .slice(contentLines.indexOf(firstLine!) + 1)
    .join("\n")
    .trim();
  const contentHtml = marked.parse(contentBody) as string;

  const excerptMatch = contentBody.match(/^[^#\n].+/m);
  const excerpt = excerptMatch?.[0]?.trim().slice(0, 300) || meta || fallbackSummary?.slice(0, 300) || "";

  return { title, contentHtml, excerpt, meta, keywords };
}

// ── Category resolution ──

const VALID_CATEGORIES = [
  "ACTUALITE", "CULTURE", "CINEMA", "MUSIQUE", "SPORT", "DIASPORA", "BUSINESS", "LIFESTYLE", "OPINION",
] as const;

const CATEGORY_MAP: Record<string, string> = {
  "ACTUALITE GENERALE": "ACTUALITE",
  "ECONOMIE & TECH": "BUSINESS",
  "DIASPORA & CULTURE": "CULTURE",
  "INSTITUTIONNEL": "ACTUALITE",
  "TECHNOLOGIE": "BUSINESS",
  "SPORT": "SPORT",
  "FOOTBALL": "SPORT",
  "MUSIQUE": "MUSIQUE",
  "CINEMA": "CINEMA",
  "FILM": "CINEMA",
  "MODE": "LIFESTYLE",
  "POLITIQUE": "ACTUALITE",
  "ENQUETE & ANALYSE": "OPINION",
};

export function resolveCategory(raw: string): string {
  const upper = raw.toUpperCase().trim();
  if (VALID_CATEGORIES.includes(upper as any)) return upper;
  return CATEGORY_MAP[upper] || "ACTUALITE";
}

// ── Slug generation ──

export function generateSlug(title: string): string {
  return title
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "");
}

// ── HTML utilities ──

export { sanitizeHtml } from "@/lib/sanitize";

export function computeReadingTime(html: string): number {
  const text = html.replace(/<[^>]*>/g, "");
  const words = text.split(/\s+/).filter(Boolean).length;
  return Math.max(1, Math.ceil(words / 200));
}

export function extractImageFromHtml(html: string): string | null {
  const match = html.match(/<img[^>]+src=["']([^"']+)["']/i);
  return match?.[1] || null;
}

// ── Constants ──

export const MIN_SCORE = 5;
export const ARTICLES_PER_RUN = 3;
export const DETECTION_WINDOW_HOURS = 48;
export const CLEANUP_DAYS = 30;

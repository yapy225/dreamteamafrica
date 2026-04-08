/**
 * Behavioral scoring — signal weights and threshold config.
 * Used server-side (API + checkout) to evaluate fraud risk.
 */

export const BEHAVIOR_WEIGHTS: Record<string, number> = {
  cgv_view: 1,         // Chaque visite CGV/mentions légales (réduit: comportement normal)
  devtools_open: 5,    // DevTools détecté
  checkout_abandon: 3, // Checkout initié puis abandonné
  rapid_nav: 1,        // Navigation anormalement rapide (<1s entre pages) (réduit)
  source_inspect: 4,   // Clic droit + "Afficher le code source"
  multi_tier_switch: 1,// Change de tier plusieurs fois sans acheter (réduit)
  copy_text: 1,        // Copie de texte (Ctrl+C / Cmd+C) (réduit)
  paste_text: 1,       // Colle du texte
  select_text: 0,      // Sélection de texte — désactivé, trop de faux positifs
  print_attempt: 3,    // Tentative d'impression (Ctrl+P) (réduit)
};

// Seuils de friction (relevés pour éviter les faux positifs)
export const FRICTION_THRESHOLDS = {
  CAPTCHA: 15,         // Score ≥ 15 → CAPTCHA au checkout
  PHONE_VERIFY: 30,    // Score ≥ 30 → Vérification téléphone obligatoire
  CARD_ONLY: 50,       // Score ≥ 50 → PayPal désactivé, carte uniquement
  BLOCK: 80,           // Score ≥ 80 → Refus temporaire
} as const;

// Durée de vie du score avant réinitialisation (24h)
export const SCORE_TTL_MS = 24 * 60 * 60 * 1000;

export type FrictionLevel = "none" | "captcha" | "phone_verify" | "card_only" | "block";

export function getFrictionLevel(score: number): FrictionLevel {
  if (score >= FRICTION_THRESHOLDS.BLOCK) return "block";
  if (score >= FRICTION_THRESHOLDS.CARD_ONLY) return "card_only";
  if (score >= FRICTION_THRESHOLDS.PHONE_VERIFY) return "phone_verify";
  if (score >= FRICTION_THRESHOLDS.CAPTCHA) return "captcha";
  return "none";
}

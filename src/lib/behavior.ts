/**
 * Behavioral scoring — signal weights and threshold config.
 * Used server-side (API + checkout) to evaluate fraud risk.
 */

export const BEHAVIOR_WEIGHTS: Record<string, number> = {
  cgv_view: 2,         // Chaque visite CGV/mentions légales
  devtools_open: 5,    // DevTools détecté
  checkout_abandon: 3, // Checkout initié puis abandonné
  rapid_nav: 2,        // Navigation anormalement rapide (<1s entre pages)
  source_inspect: 4,   // Clic droit + "Afficher le code source"
  multi_tier_switch: 2,// Change de tier plusieurs fois sans acheter
  copy_text: 2,        // Copie de texte (Ctrl+C / Cmd+C)
  paste_text: 1,       // Colle du texte
  select_text: 1,      // Sélection de texte (par bloc, pas clic simple)
  print_attempt: 5,    // Tentative d'impression (Ctrl+P)
};

// Seuils de friction
export const FRICTION_THRESHOLDS = {
  CAPTCHA: 8,          // Score ≥ 8 → CAPTCHA au checkout
  PHONE_VERIFY: 15,    // Score ≥ 15 → Vérification téléphone obligatoire
  CARD_ONLY: 20,       // Score ≥ 20 → PayPal désactivé, carte uniquement
  BLOCK: 40,           // Score ≥ 40 → Refus temporaire
} as const;

export type FrictionLevel = "none" | "captcha" | "phone_verify" | "card_only" | "block";

export function getFrictionLevel(score: number): FrictionLevel {
  if (score >= FRICTION_THRESHOLDS.BLOCK) return "block";
  if (score >= FRICTION_THRESHOLDS.CARD_ONLY) return "card_only";
  if (score >= FRICTION_THRESHOLDS.PHONE_VERIFY) return "phone_verify";
  if (score >= FRICTION_THRESHOLDS.CAPTCHA) return "captcha";
  return "none";
}

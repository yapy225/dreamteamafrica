/**
 * Password policy — applied at signup, password-reset and password-change.
 * Existing users' hashed passwords are unaffected; policy only kicks in
 * when a new password is being set.
 *
 * Requirements:
 * - min 10 chars (NIST SP 800-63B recommends ≥8, we go a bit stricter)
 * - at least 1 uppercase, 1 lowercase, 1 digit, 1 special character
 * - max 128 chars (bcrypt truncates at 72 bytes; reject very long inputs to avoid DoS via slow-hash)
 */
export function validatePasswordPolicy(password: unknown): string | null {
  if (typeof password !== "string") return "Mot de passe requis.";
  if (password.length < 10) return "Le mot de passe doit contenir au moins 10 caractères.";
  if (password.length > 128) return "Le mot de passe est trop long (128 caractères max).";
  if (!/[A-Z]/.test(password)) return "Le mot de passe doit contenir au moins une majuscule.";
  if (!/[a-z]/.test(password)) return "Le mot de passe doit contenir au moins une minuscule.";
  if (!/[0-9]/.test(password)) return "Le mot de passe doit contenir au moins un chiffre.";
  if (!/[^A-Za-z0-9]/.test(password)) return "Le mot de passe doit contenir au moins un caractère spécial (ex: ! @ # $ % & * ?).";
  return null;
}

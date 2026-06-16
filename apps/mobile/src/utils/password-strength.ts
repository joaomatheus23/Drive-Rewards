export type PasswordStrengthLevel = "weak" | "fair" | "good" | "strong";

export interface PasswordStrengthResult {
  score: number;
  level: PasswordStrengthLevel;
  label: string;
}

export function getPasswordStrength(password: string): PasswordStrengthResult {
  if (!password) {
    return { score: 0, level: "weak", label: "" };
  }

  let score = 0;

  if (password.length >= 6) score += 1;
  if (password.length >= 8) score += 1;
  if (/[A-Z]/.test(password) && /[a-z]/.test(password)) score += 1;
  if (/\d/.test(password)) score += 1;

  if (score <= 1) return { score: 1, level: "weak", label: "Weak" };
  if (score === 2) return { score: 2, level: "fair", label: "Fair" };
  if (score === 3) return { score: 3, level: "good", label: "Good" };
  return { score: 4, level: "strong", label: "Strong" };
}

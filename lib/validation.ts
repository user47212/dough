export type FieldRule = "positive" | "non-negative";

export interface FieldResult {
  /** Parsed numeric value, or null when invalid. */
  value: number | null;
  /** Human-readable error message, or null when valid. */
  error: string | null;
}

/**
 * Validate a raw input string against a numeric rule.
 *
 * - "positive": must parse to a finite number > 0 (ball count, ball weight).
 * - "non-negative": must parse to a finite number >= 0 (percentages; 0 is a
 *   legitimate lean-dough value).
 *
 * Empty/whitespace-only strings and anything that does not parse to a finite
 * number are invalid — this is the no-NaN-on-screen guard.
 */
export function validateField(raw: string, rule: FieldRule): FieldResult {
  const trimmed = raw.trim();
  if (trimmed === "") {
    return { value: null, error: "Required" };
  }

  const value = Number(trimmed);
  if (!Number.isFinite(value)) {
    return { value: null, error: "Must be a number" };
  }

  if (rule === "positive" && value <= 0) {
    return { value: null, error: "Must be greater than 0" };
  }

  if (rule === "non-negative" && value < 0) {
    return { value: null, error: "Cannot be negative" };
  }

  return { value, error: null };
}

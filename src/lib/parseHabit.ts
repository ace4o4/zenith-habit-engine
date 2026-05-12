export interface ParsedHabit {
  title: string;
  duration: number | "lifetime";
}

/**
 * Parses natural-language habit strings.
 * Examples:
 *   "Read 10 pages for 30 days" -> { title: "Read 10 pages", duration: 30 }
 *   "Meditate for 2 weeks"      -> { title: "Meditate", duration: 14 }
 *   "Drink water"               -> { title: "Drink water", duration: "lifetime" }
 *   "Workout for life"          -> { title: "Workout", duration: "lifetime" }
 */
export function parseHabit(raw: string): ParsedHabit | null {
  const input = raw.trim();
  if (!input) return null;

  // Strip leading "I will "
  let s = input.replace(/^i\s+will\s+/i, "").trim();

  // Lifetime variants
  const lifetimeMatch = s.match(/\s+for\s+(life|lifetime|ever|forever)\s*$/i);
  if (lifetimeMatch) {
    return { title: s.slice(0, lifetimeMatch.index).trim(), duration: "lifetime" };
  }

  // "for N day|week|month|year(s)"
  const m = s.match(/\s+for\s+(\d+)\s*(day|week|month|year)s?\s*$/i);
  if (m) {
    const n = parseInt(m[1], 10);
    const unit = m[2].toLowerCase();
    const mult = unit === "day" ? 1 : unit === "week" ? 7 : unit === "month" ? 30 : 365;
    return { title: s.slice(0, m.index).trim(), duration: n * mult };
  }

  return { title: s, duration: "lifetime" };
}

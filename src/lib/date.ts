export function todayStr(d: Date = new Date()): string {
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${y}-${m}-${day}`;
}

export function dateStr(d: Date): string {
  return todayStr(d);
}

export function lastNDays(n: number, end: Date = new Date()): string[] {
  const out: string[] = [];
  for (let i = n - 1; i >= 0; i--) {
    const d = new Date(end);
    d.setDate(end.getDate() - i);
    out.push(todayStr(d));
  }
  return out;
}

/**
 * Streak counts consecutive completed days ending at today (or, if today is
 * not yet done, ending at yesterday — so the streak doesn't drop until the
 * day actually ends).
 */
export function computeStreak(history: Record<string, boolean>): number {
  const now = new Date();
  let cursor = new Date(now);

  // If today not done, start from yesterday so an active streak persists.
  if (!history[todayStr(cursor)]) {
    cursor.setDate(cursor.getDate() - 1);
  }

  let streak = 0;
  for (let i = 0; i < 3650; i++) {
    if (history[todayStr(cursor)]) {
      streak++;
      cursor.setDate(cursor.getDate() - 1);
    } else {
      break;
    }
  }
  return streak;
}

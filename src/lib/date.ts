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

export function computeStreak(history: Record<string, boolean>): number {
  let streak = 0;
  const now = new Date();
  for (let i = 0; i < 3650; i++) {
    const d = new Date(now);
    d.setDate(now.getDate() - i);
    const key = todayStr(d);
    if (history[key]) {
      streak++;
    } else if (i === 0) {
      // today not done — streak counts from yesterday backward
      continue;
    } else {
      break;
    }
  }
  return streak;
}

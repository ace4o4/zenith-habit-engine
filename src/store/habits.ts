import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import { indexedDbStorage } from "./storage";
import { computeStreak, todayStr } from "@/lib/date";

export type HabitMap = Record<string, boolean>;

export interface HabitEntity {
  id: string;
  title: string;
  createdAt: number;
  /** "lifetime" | number of days (when no explicit range) */
  duration: number | "lifetime";
  /** Optional explicit window (YYYY-MM-DD). If both set, window takes precedence. */
  startDate?: string;
  endDate?: string;
  history: HabitMap;
  streak: number;
}

export interface HabitPatch {
  title?: string;
  duration?: number | "lifetime";
  startDate?: string | null;
  endDate?: string | null;
}

interface AppState {
  habits: HabitEntity[];
  hydrated: boolean;
  setHydrated: (v: boolean) => void;
  addHabit: (
    title: string,
    duration: number | "lifetime",
    range?: { startDate?: string; endDate?: string },
  ) => void;
  removeHabit: (id: string) => void;
  updateHabit: (id: string, patch: HabitPatch) => void;
  toggleDay: (habitId: string, dateStr?: string) => void;
}

function uid(): string {
  if (typeof crypto !== "undefined" && "randomUUID" in crypto) {
    return crypto.randomUUID();
  }
  return Math.random().toString(36).slice(2) + Date.now().toString(36);
}

export const useHabits = create<AppState>()(
  persist(
    (set) => ({
      habits: [],
      hydrated: false,
      setHydrated: (v) => set({ hydrated: v }),
      addHabit: (title, duration, range) =>
        set((state) => ({
          habits: [
            ...state.habits,
            {
              id: uid(),
              title: title.trim().slice(0, 80),
              createdAt: Date.now(),
              duration,
              startDate: range?.startDate,
              endDate: range?.endDate,
              history: {},
              streak: 0,
            },
          ],
        })),
      removeHabit: (id) =>
        set((state) => ({ habits: state.habits.filter((h) => h.id !== id) })),
      updateHabit: (id, patch) =>
        set((state) => ({
          habits: state.habits.map((h) => {
            if (h.id !== id) return h;
            return {
              ...h,
              title:
                patch.title !== undefined
                  ? patch.title.trim().slice(0, 80) || h.title
                  : h.title,
              duration: patch.duration !== undefined ? patch.duration : h.duration,
              startDate:
                patch.startDate === null
                  ? undefined
                  : patch.startDate !== undefined
                    ? patch.startDate
                    : h.startDate,
              endDate:
                patch.endDate === null
                  ? undefined
                  : patch.endDate !== undefined
                    ? patch.endDate
                    : h.endDate,
            };
          }),
        })),
      toggleDay: (habitId, date) =>
        set((state) => ({
          habits: state.habits.map((h) => {
            if (h.id !== habitId) return h;
            const key = date ?? todayStr();
            const next = { ...h.history };
            if (next[key]) delete next[key];
            else next[key] = true;
            return { ...h, history: next, streak: computeStreak(next) };
          }),
        })),
    }),
    {
      name: "zenith-habits",
      storage: createJSONStorage(() => indexedDbStorage),
      skipHydration: true,
      partialize: (s) => ({ habits: s.habits }),
      onRehydrateStorage: () => (state) => {
        if (!state) return;
        state.habits = state.habits.map((h) => ({
          ...h,
          streak: computeStreak(h.history),
        }));
      },
    },
  ),
);

export function getOverallProgress(habits: HabitEntity[]): number {
  if (!habits.length) return 0;
  const today = todayStr();
  const done = habits.filter((h) => h.history[today]).length;
  return done / habits.length;
}

function daysBetween(a: string, b: string): number {
  const ad = new Date(a + "T00:00:00");
  const bd = new Date(b + "T00:00:00");
  return Math.max(1, Math.round((bd.getTime() - ad.getTime()) / 86400000) + 1);
}

export function getCompletionRate(h: HabitEntity): number {
  if (h.startDate && h.endDate) {
    const total = daysBetween(h.startDate, h.endDate);
    const done = Object.entries(h.history).filter(
      ([d, v]) => v && d >= h.startDate! && d <= h.endDate!,
    ).length;
    return Math.min(done / total, 1);
  }
  const total = typeof h.duration === "number" ? h.duration : 30;
  const done = Object.values(h.history).filter(Boolean).length;
  return Math.min(done / total, 1);
}

/** Validates a habit patch. Returns map of field → message (empty when valid). */
export function validateHabit(input: {
  title: string;
  mode: "lifetime" | "fixed" | "range";
  days?: number;
  startDate?: string;
  endDate?: string;
}): Record<string, string> {
  const errors: Record<string, string> = {};
  const title = input.title.trim();
  if (!title) errors.title = "Title is required.";
  else if (title.length > 80) errors.title = "Title must be 80 characters or less.";

  if (input.mode === "fixed") {
    const d = input.days ?? NaN;
    if (!Number.isFinite(d) || d < 1 || d > 3650) {
      errors.days = "Enter a whole number between 1 and 3650.";
    }
  }

  if (input.mode === "range") {
    if (!input.startDate) errors.startDate = "Pick a start date.";
    if (!input.endDate) errors.endDate = "Pick an end date.";
    if (input.startDate && input.endDate) {
      if (input.endDate < input.startDate) {
        errors.endDate = "End date must be on or after the start date.";
      } else if (daysBetween(input.startDate, input.endDate) > 3650) {
        errors.endDate = "Range can't exceed 3650 days (~10 years).";
      }
    }
  }

  return errors;
}

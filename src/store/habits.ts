import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import { indexedDbStorage } from "./storage";
import { computeStreak, todayStr } from "@/lib/date";

export type HabitMap = Record<string, boolean>;

export interface HabitEntity {
  id: string;
  title: string;
  createdAt: number;
  duration: number | "lifetime";
  history: HabitMap;
  streak: number;
}

interface AppState {
  habits: HabitEntity[];
  hydrated: boolean;
  setHydrated: (v: boolean) => void;
  addHabit: (title: string, duration: number | "lifetime") => void;
  removeHabit: (id: string) => void;
  updateHabit: (id: string, patch: { title?: string; duration?: number | "lifetime" }) => void;
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
      addHabit: (title, duration) =>
        set((state) => ({
          habits: [
            ...state.habits,
            {
              id: uid(),
              title: title.trim(),
              createdAt: Date.now(),
              duration,
              history: {},
              streak: 0,
            },
          ],
        })),
      removeHabit: (id) =>
        set((state) => ({ habits: state.habits.filter((h) => h.id !== id) })),
      updateHabit: (id, patch) =>
        set((state) => ({
          habits: state.habits.map((h) =>
            h.id === id
              ? {
                  ...h,
                  title: patch.title !== undefined ? patch.title.trim() || h.title : h.title,
                  duration: patch.duration !== undefined ? patch.duration : h.duration,
                }
              : h,
          ),
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
      // Recompute streaks on rehydrate so logic fixes apply to old data
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

export function getCompletionRate(h: HabitEntity): number {
  const total = typeof h.duration === "number" ? h.duration : 30;
  const done = Object.values(h.history).filter(Boolean).length;
  return Math.min(done / total, 1);
}

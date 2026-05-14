import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import { indexedDbStorage } from "./storage";

interface NotesState {
  text: string;
  hydrated: boolean;
  setHydrated: (v: boolean) => void;
  setText: (t: string) => void;
}

export const useNotes = create<NotesState>()(
  persist(
    (set) => ({
      text: "",
      hydrated: false,
      setHydrated: (v) => set({ hydrated: v }),
      setText: (t) => set({ text: t.slice(0, 20000) }),
    }),
    {
      name: "zenith-notes",
      storage: createJSONStorage(() => indexedDbStorage),
      skipHydration: true,
      partialize: (s) => ({ text: s.text }),
    },
  ),
);

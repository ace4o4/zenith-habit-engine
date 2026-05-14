import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import { indexedDbStorage } from "./storage";

export interface TodoItem {
  id: string;
  text: string;
  done: boolean;
  createdAt: number;
}

interface TodoState {
  todos: TodoItem[];
  hydrated: boolean;
  setHydrated: (v: boolean) => void;
  addTodo: (text: string) => void;
  toggleTodo: (id: string) => void;
  removeTodo: (id: string) => void;
  clearCompleted: () => void;
}

function uid(): string {
  if (typeof crypto !== "undefined" && "randomUUID" in crypto) return crypto.randomUUID();
  return Math.random().toString(36).slice(2) + Date.now().toString(36);
}

export const useTodos = create<TodoState>()(
  persist(
    (set) => ({
      todos: [],
      hydrated: false,
      setHydrated: (v) => set({ hydrated: v }),
      addTodo: (text) => {
        const t = text.trim().slice(0, 200);
        if (!t) return;
        set((s) => ({
          todos: [{ id: uid(), text: t, done: false, createdAt: Date.now() }, ...s.todos],
        }));
      },
      toggleTodo: (id) =>
        set((s) => ({
          todos: s.todos.map((t) => (t.id === id ? { ...t, done: !t.done } : t)),
        })),
      removeTodo: (id) =>
        set((s) => ({ todos: s.todos.filter((t) => t.id !== id) })),
      clearCompleted: () => set((s) => ({ todos: s.todos.filter((t) => !t.done) })),
    }),
    {
      name: "zenith-todos",
      storage: createJSONStorage(() => indexedDbStorage),
      skipHydration: true,
      partialize: (s) => ({ todos: s.todos }),
    },
  ),
);

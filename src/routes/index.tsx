import { useEffect, useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { ListChecks, NotebookPen } from "lucide-react";
import { CommandTerminal } from "@/components/zenith/CommandTerminal";
import { BentoDashboard } from "@/components/zenith/BentoDashboard";
import { OverallStats } from "@/components/zenith/OverallStats";
import { ThemeToggle } from "@/components/zenith/ThemeToggle";
import { TodosPanel } from "@/components/zenith/TodosPanel";
import { NotesPanel } from "@/components/zenith/NotesPanel";
import { useHabits } from "@/store/habits";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Zenith — Minimal Habit Tracker" },
      {
        name: "description",
        content:
          "Minimal, premium habit tracker. Offline-first, focused, distraction-free.",
      },
      { property: "og:title", content: "Zenith — Minimal Habit Tracker" },
      {
        property: "og:description",
        content: "Architect your discipline with a focused, premium habit engine.",
      },
    ],
  }),
  component: Index,
});

function Index() {
  const habits = useHabits((s) => s.habits);
  const hydrated = useHabits((s) => s.hydrated);
  const setHydrated = useHabits((s) => s.setHydrated);
  const [mounted, setMounted] = useState(false);
  const [todosOpen, setTodosOpen] = useState(false);
  const [notesOpen, setNotesOpen] = useState(false);

  useEffect(() => {
    setMounted(true);
    useHabits.persist.rehydrate()?.then(() => setHydrated(true));
  }, [setHydrated]);

  return (
    <main className="relative min-h-screen bg-background">
      <div className="mx-auto flex min-h-screen w-full max-w-5xl flex-col gap-8 px-4 py-8 sm:px-6 sm:py-10 md:gap-10 md:py-14">
        <header className="flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div
              className="size-2.5 rounded-sm bg-accent-gradient"
              aria-hidden
            />
            <span className="text-[13px] font-semibold tracking-[0.2em] text-foreground">
              ZENITH
            </span>
          </div>
          <div className="flex items-center gap-1.5 sm:gap-2">
            <IconButton
              label="Open todos"
              onClick={() => setTodosOpen(true)}
              icon={<ListChecks className="size-4" strokeWidth={1.75} />}
            />
            <IconButton
              label="Open notes"
              onClick={() => setNotesOpen(true)}
              icon={<NotebookPen className="size-4" strokeWidth={1.75} />}
            />
            <ThemeToggle />
          </div>
        </header>

        <CommandTerminal />

        {mounted && hydrated ? (
          <>
            <OverallStats habits={habits} />
            <BentoDashboard habits={habits} />
          </>
        ) : (
          <div className="surface-card h-40 animate-pulse" />
        )}

        <footer className="mt-auto pt-6 text-center text-[11px] text-muted-foreground">
          Engineered for focus · {new Date().getFullYear()}
        </footer>
      </div>

      <TodosPanel open={todosOpen} onOpenChange={setTodosOpen} />
      <NotesPanel open={notesOpen} onOpenChange={setNotesOpen} />
    </main>
  );
}

function IconButton({
  label,
  onClick,
  icon,
}: {
  label: string;
  onClick: () => void;
  icon: React.ReactNode;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={label}
      title={label}
      className="inline-flex size-9 items-center justify-center rounded-full border border-border bg-card text-foreground transition-colors hover:bg-secondary"
    >
      {icon}
    </button>
  );
}

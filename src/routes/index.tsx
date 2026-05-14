import { useEffect, useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { CommandTerminal } from "@/components/zenith/CommandTerminal";
import { BentoDashboard } from "@/components/zenith/BentoDashboard";
import { OverallStats } from "@/components/zenith/OverallStats";
import { ThemeToggle } from "@/components/zenith/ThemeToggle";
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
          <div className="flex items-center gap-3">
            <span className="hidden text-[10px] uppercase tracking-[0.2em] text-muted-foreground sm:inline">
              Offline · Local · Yours
            </span>
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
    </main>
  );
}

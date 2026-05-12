import { useEffect, useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { ClientOnly } from "@tanstack/react-router";
import { CommandTerminal } from "@/components/zenith/CommandTerminal";
import { BentoDashboard } from "@/components/zenith/BentoDashboard";
import { OverallStats } from "@/components/zenith/OverallStats";
import { CinematicCanvas } from "@/components/zenith/CinematicCanvas";
import { useHabits } from "@/store/habits";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Zenith — God Tier Habit Engine" },
      {
        name: "description",
        content:
          "Cinematic, offline-first habit tracker. Glassmorphic Bento grid, liquid checkboxes, and 3D ambience.",
      },
      { property: "og:title", content: "Zenith — God Tier Habit Engine" },
      {
        property: "og:description",
        content: "Architect your discipline. Offline-first habit tracking with cinematic feel.",
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
    <main className="relative min-h-screen overflow-hidden">
      <ClientOnly fallback={null}>
        <CinematicCanvas />
      </ClientOnly>

      <div className="relative mx-auto flex min-h-screen w-full max-w-6xl flex-col gap-8 px-5 py-10 md:px-8 md:py-14">
        <header className="flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div
              className="size-3 rounded-sm"
              style={{
                backgroundImage: "linear-gradient(135deg,#00f2fe,#4facfe)",
                boxShadow: "0 0 14px rgba(79,172,254,0.7)",
              }}
            />
            <span className="text-sm font-semibold tracking-[0.18em] text-text-primary">
              ZENITH
            </span>
          </div>
          <span className="text-[11px] uppercase tracking-[0.2em] text-text-muted">
            Offline · Local · Yours
          </span>
        </header>

        <CommandTerminal />

        {mounted && hydrated ? (
          <>
            <OverallStats habits={habits} />
            <BentoDashboard habits={habits} />
          </>
        ) : (
          <div className="glass-bento h-40 animate-pulse" />
        )}

        <footer className="mt-auto pt-8 text-center text-[11px] text-text-muted">
          Engineered in the void · {new Date().getFullYear()}
        </footer>
      </div>
    </main>
  );
}

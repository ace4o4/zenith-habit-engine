import { useMemo } from "react";
import type { HabitEntity } from "@/store/habits";
import { lastNDays, todayStr } from "@/lib/date";
import { useHabits } from "@/store/habits";

interface Props {
  habit: HabitEntity;
  days?: number;
}

export function HeatmapStrip({ habit, days = 28 }: Props) {
  const cells = useMemo(() => lastNDays(days), [days]);
  const today = todayStr();
  const toggleDay = useHabits((s) => s.toggleDay);

  return (
    <div
      className="grid gap-1"
      style={{ gridTemplateColumns: `repeat(${days}, minmax(0, 1fr))` }}
      aria-label={`${days}-day completion strip`}
    >
      {cells.map((d) => {
        const done = !!habit.history[d];
        const isToday = d === today;
        return (
          <button
            key={d}
            type="button"
            title={`${d}${isToday ? " (today) — click to toggle" : " — locked"}`}
            onClick={() => isToday && toggleDay(habit.id, d)}
            className={`aspect-square rounded-[3px] transition-all ${isToday ? "hover:scale-110 cursor-pointer" : "cursor-default"}`}
            style={
              done
                ? {
                    background: "linear-gradient(135deg,var(--accent-from),var(--accent-to))",
                    boxShadow: isToday
                      ? "0 0 0 1.5px var(--background), 0 0 0 2.5px var(--accent)"
                      : "none",
                  }
                : {
                    backgroundColor: "var(--secondary)",
                    border: isToday
                      ? "1px solid var(--accent)"
                      : "1px solid var(--border)",
                  }
            }
          />
        );
      })}
    </div>
  );
}

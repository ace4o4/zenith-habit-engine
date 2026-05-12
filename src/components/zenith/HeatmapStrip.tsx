import { useMemo } from "react";
import type { HabitEntity } from "@/store/habits";
import { lastNDays } from "@/lib/date";

interface Props {
  habit: HabitEntity;
  days?: number;
}

export function HeatmapStrip({ habit, days = 28 }: Props) {
  const cells = useMemo(() => lastNDays(days), [days]);

  return (
    <div
      className="grid gap-1.5"
      style={{ gridTemplateColumns: `repeat(${days}, minmax(0, 1fr))` }}
      aria-label={`${days}-day completion strip`}
    >
      {cells.map((d) => {
        const done = !!habit.history[d];
        return (
          <div
            key={d}
            title={d}
            className="aspect-square rounded-[4px] transition-colors"
            style={
              done
                ? {
                    backgroundImage: "linear-gradient(135deg,#00f2fe,#4facfe)",
                    boxShadow: "0 0 6px rgba(79,172,254,0.45)",
                  }
                : {
                    backgroundColor: "rgba(255,255,255,0.04)",
                    border: "1px solid rgba(255,255,255,0.05)",
                  }
            }
          />
        );
      })}
    </div>
  );
}

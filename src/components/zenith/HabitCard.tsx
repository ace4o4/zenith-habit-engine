import { motion } from "motion/react";
import { Flame, X } from "lucide-react";
import { LiquidCheckbox } from "./LiquidCheckbox";
import { HeatmapStrip } from "./HeatmapStrip";
import { ProgressRing } from "./ProgressRing";
import { getCompletionRate, useHabits, type HabitEntity } from "@/store/habits";
import { todayStr } from "@/lib/date";

interface Props {
  habit: HabitEntity;
}

export function HabitCard({ habit }: Props) {
  const toggleDay = useHabits((s) => s.toggleDay);
  const removeHabit = useHabits((s) => s.removeHabit);
  const today = todayStr();
  const doneToday = !!habit.history[today];
  const rate = getCompletionRate(habit);

  return (
    <motion.article
      layout
      initial={{ opacity: 0, y: 24, scale: 0.98 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: -16, scale: 0.96 }}
      transition={{ type: "spring", stiffness: 220, damping: 24 }}
      whileHover={{ y: -4, scale: 1.01 }}
      className="glass-bento group relative p-5"
    >
      {/* Top row */}
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <h3 className="truncate text-[15px] font-semibold tracking-tight text-text-primary">
            {habit.title}
          </h3>
          <p className="mt-0.5 text-[11px] uppercase tracking-wider text-text-muted">
            {typeof habit.duration === "number"
              ? `${habit.duration}-day quest`
              : "Lifetime ritual"}
          </p>
        </div>

        <div className="flex items-center gap-2">
          <div
            className="inline-flex items-center gap-1 rounded-full border border-white/10 bg-white/[0.03] px-2 py-1 text-[11px] font-medium text-text-primary"
            title={`${habit.streak}-day streak`}
          >
            <Flame
              className="size-3"
              style={{ color: habit.streak > 0 ? "#4facfe" : "rgba(255,255,255,0.5)" }}
            />
            <span className="tabular-nums">{habit.streak}</span>
          </div>
          <button
            onClick={() => removeHabit(habit.id)}
            aria-label="Remove habit"
            className="rounded-full p-1 text-text-muted opacity-0 transition-opacity hover:text-text-primary group-hover:opacity-100"
          >
            <X className="size-3.5" />
          </button>
        </div>
      </div>

      {/* Body */}
      <div className="mt-5 flex items-center gap-4">
        <LiquidCheckbox
          checked={doneToday}
          onToggle={() => toggleDay(habit.id)}
          ariaLabel={`Mark ${habit.title} for today`}
        />
        <div className="flex flex-1 flex-col gap-1.5">
          <span className="text-[11px] uppercase tracking-wider text-text-muted">
            {doneToday ? "Done today" : "Tap to commit today"}
          </span>
          <HeatmapStrip habit={habit} days={28} />
        </div>
        {typeof habit.duration === "number" && (
          <ProgressRing progress={rate} size={52} />
        )}
      </div>
    </motion.article>
  );
}

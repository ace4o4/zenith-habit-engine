import { motion } from "motion/react";
import { ProgressRing } from "./ProgressRing";
import { getOverallProgress, type HabitEntity } from "@/store/habits";
import { todayStr } from "@/lib/date";

interface Props {
  habits: HabitEntity[];
}

export function OverallStats({ habits }: Props) {
  const today = todayStr();
  const doneToday = habits.filter((h) => h.history[today]).length;
  const overall = getOverallProgress(habits);
  const longest = habits.reduce((m, h) => Math.max(m, h.streak), 0);
  const total = habits.length;

  const dateLabel = new Date().toLocaleDateString(undefined, {
    weekday: "long",
    month: "long",
    day: "numeric",
  });

  return (
    <motion.section
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ type: "spring", stiffness: 220, damping: 24 }}
      className="glass-bento flex flex-col gap-5 p-6 md:flex-row md:items-center md:justify-between"
    >
      <div>
        <p className="text-[11px] uppercase tracking-[0.2em] text-text-muted">
          {dateLabel}
        </p>
        <h2 className="mt-2 text-2xl font-semibold tracking-tight text-text-primary md:text-3xl">
          {total === 0 ? (
            "Engineer your day"
          ) : doneToday === total ? (
            <>All clear. <span className="text-neon">Zenith reached.</span></>
          ) : (
            <>
              <span className="text-neon">{doneToday}</span>
              <span className="text-text-muted"> / {total}</span> committed today
            </>
          )}
        </h2>
        <p className="mt-1 text-sm text-text-muted">
          Longest active streak{" "}
          <span className="text-text-primary tabular-nums">{longest}</span> days.
        </p>
      </div>

      <div className="flex items-center gap-6">
        <ProgressRing
          progress={overall}
          size={84}
          label={`${Math.round(overall * 100)}%`}
        />
      </div>
    </motion.section>
  );
}

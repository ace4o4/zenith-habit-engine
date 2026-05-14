import { motion } from "motion/react";
import { ProgressBar } from "./ProgressBar";
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
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ type: "spring", stiffness: 220, damping: 24 }}
      className="surface-card flex flex-col gap-5 p-5 sm:p-6"
    >
      <div className="flex flex-col gap-1">
        <p className="text-[11px] uppercase tracking-[0.18em] text-muted-foreground">
          {dateLabel}
        </p>
        <h2 className="text-2xl font-semibold tracking-tight text-foreground sm:text-[28px]">
          {total === 0 ? (
            "Build your first ritual"
          ) : doneToday === total ? (
            <>All clear. <span className="text-accent-gradient">Zenith reached.</span></>
          ) : (
            <>
              <span className="text-accent-gradient">{doneToday}</span>
              <span className="text-muted-foreground"> / {total}</span> committed today
            </>
          )}
        </h2>
      </div>

      <ProgressBar progress={overall} showLabel={false} height={8} />

      <div className="grid grid-cols-3 gap-4 border-t border-border pt-4">
        <Stat label="Today" value={`${doneToday}/${total}`} />
        <Stat label="Longest streak" value={`${longest}`} suffix={longest === 1 ? "day" : "days"} />
        <Stat label="Overall" value={`${Math.round(overall * 100)}%`} />
      </div>
    </motion.section>
  );
}

function Stat({ label, value, suffix }: { label: string; value: string; suffix?: string }) {
  return (
    <div className="flex flex-col">
      <span className="text-[10px] uppercase tracking-[0.14em] text-muted-foreground">
        {label}
      </span>
      <span className="mt-1 text-lg font-semibold tabular-nums text-foreground sm:text-xl">
        {value}
        {suffix && (
          <span className="ml-1 text-xs font-normal text-muted-foreground">{suffix}</span>
        )}
      </span>
    </div>
  );
}

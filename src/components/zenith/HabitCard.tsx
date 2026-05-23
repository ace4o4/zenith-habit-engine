import { useState } from "react";
import { motion } from "motion/react";
import { Flame, Pencil, Trash2, CalendarPlus } from "lucide-react";
import { LiquidCheckbox } from "./LiquidCheckbox";
import { HeatmapStrip } from "./HeatmapStrip";
import { ProgressBar } from "./ProgressBar";
import { EditHabitDialog } from "./EditHabitDialog";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { getCompletionRate, useHabits, type HabitEntity } from "@/store/habits";
import { todayStr, dateStr } from "@/lib/date";

interface Props {
  habit: HabitEntity;
}

export function HabitCard({ habit }: Props) {
  const toggleDay = useHabits((s) => s.toggleDay);
  const removeHabit = useHabits((s) => s.removeHabit);
  const updateHabit = useHabits((s) => s.updateHabit);
  const today = todayStr();
  const doneToday = !!habit.history[today];
  const rate = getCompletionRate(habit);
  const [editing, setEditing] = useState(false);
  const [calOpen, setCalOpen] = useState(false);

  const fixed = typeof habit.duration === "number";
  const ranged = !!(habit.startDate && habit.endDate);

  const subtitle = ranged
    ? `${formatShort(habit.startDate!)} → ${formatShort(habit.endDate!)}`
    : fixed
      ? `${habit.duration}-day quest`
      : "Lifetime ritual";

  return (
    <>
      <motion.article
        layout
        initial={{ opacity: 0, y: 16, scale: 0.99 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: -12, scale: 0.97 }}
        transition={{ type: "spring", stiffness: 220, damping: 24 }}
        whileHover={{ y: -2 }}
        className="surface-card group relative flex flex-col gap-4 p-4 sm:p-5"
      >
        {/* Header */}
        <header className="flex items-start justify-between gap-3">
          <div className="min-w-0 flex-1">
            <h3 className="truncate text-[15px] font-semibold tracking-tight text-foreground">
              {habit.title}
            </h3>
            <p className="mt-0.5 text-[11px] uppercase tracking-[0.12em] text-muted-foreground">
              {subtitle}
            </p>
          </div>

          <div className="flex items-center gap-1.5">
            <div
              className="inline-flex items-center gap-1 rounded-full border border-border bg-secondary px-2 py-0.5 text-[11px] font-medium text-foreground"
              title={`${habit.streak}-day streak`}
            >
              <Flame
                className="size-3"
                style={{
                  color: habit.streak > 0 ? "var(--accent)" : "var(--muted-foreground)",
                }}
              />
              <span className="tabular-nums">{habit.streak}</span>
            </div>
          </div>
        </header>

        {/* Toggle row */}
        <div className="flex items-center gap-3">
          <LiquidCheckbox
            checked={doneToday}
            onToggle={() => toggleDay(habit.id)}
            ariaLabel={`Mark ${habit.title} for today`}
          />
          <div className="min-w-0 flex-1">
            <p className="text-[13px] font-medium text-foreground">
              {doneToday ? "Done today" : "Tap to commit today"}
            </p>
            <p className="text-[11px] text-muted-foreground">
              {new Date().toLocaleDateString(undefined, {
                weekday: "short",
                month: "short",
                day: "numeric",
              })}
            </p>
          </div>

          <Popover open={calOpen} onOpenChange={setCalOpen}>
            <PopoverTrigger asChild>
              <button
                type="button"
                aria-label="Mark a custom date"
                className="inline-flex size-8 items-center justify-center rounded-md border border-border text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground"
              >
                <CalendarPlus className="size-3.5" />
              </button>
            </PopoverTrigger>
            <PopoverContent align="end" className="w-auto p-0">
              <Calendar
                mode="single"
                selected={habit.endDate ? new Date(habit.endDate + "T00:00:00") : undefined}
                onSelect={(d) => {
                  if (d) {
                    const dStr = dateStr(d);
                    const todayLocal = todayStr();
                    if (dStr > todayLocal) {
                      if (habit.endDate === dStr) {
                        updateHabit(habit.id, { endDate: null, startDate: null });
                      } else {
                        updateHabit(habit.id, {
                          endDate: dStr,
                          startDate: habit.startDate || dateStr(new Date(habit.createdAt)),
                        });
                      }
                    } else if (dStr === todayLocal) {
                      toggleDay(habit.id, dStr);
                    }
                    setCalOpen(false);
                  }
                }}
                disabled={(d) => dateStr(d) < todayStr()}
                modifiers={{
                  done: (d) => !!habit.history[dateStr(d)],
                }}
                modifiersStyles={{
                  done: {
                    background: "linear-gradient(135deg,var(--accent-from),var(--accent-to))",
                    color: "var(--accent-foreground)",
                    fontWeight: 600,
                  },
                }}
                modifiersClassNames={{
                  done: "relative after:absolute after:-top-1.5 after:-right-1.5 after:content-['✔'] after:text-[#22c55e] after:text-[12px] after:z-20",
                }}
                className="pointer-events-auto p-3"
              />
              <div className="border-t border-border px-3 py-2 text-[11px] text-muted-foreground">
                Pick today to toggle, or a future day to set a goal date. Past dates are locked.
              </div>
            </PopoverContent>
          </Popover>
        </div>

        {/* Progress */}
        {ranged ? (
          <ProgressBar progress={rate} label="Window progress" />
        ) : fixed ? (
          <ProgressBar progress={rate} label="Quest progress" />
        ) : (
          <ProgressBar
            progress={Object.values(habit.history).filter(Boolean).length / 30}
            label="Last 30 days"
          />
        )}

        {/* Heatmap */}
        <div>
          <p className="mb-1.5 text-[11px] uppercase tracking-[0.14em] text-muted-foreground">
            Last 28 days
          </p>
          <HeatmapStrip habit={habit} days={28} />
        </div>

        {/* Footer actions */}
        <footer className="-mb-1 flex items-center justify-end gap-1 pt-1">
          <button
            onClick={() => setEditing(true)}
            aria-label="Edit habit"
            className="inline-flex items-center gap-1 rounded-md px-2 py-1 text-[12px] text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground"
          >
            <Pencil className="size-3.5" />
            Edit
          </button>
          <button
            onClick={() => removeHabit(habit.id)}
            aria-label="Remove habit"
            className="inline-flex items-center gap-1 rounded-md px-2 py-1 text-[12px] text-muted-foreground transition-colors hover:bg-secondary hover:text-destructive"
          >
            <Trash2 className="size-3.5" />
            Delete
          </button>
        </footer>
      </motion.article>

      <EditHabitDialog habit={editing ? habit : null} open={editing} onOpenChange={setEditing} />
    </>
  );
}

function formatShort(iso: string): string {
  const d = new Date(iso + "T00:00:00");
  return d.toLocaleDateString(undefined, { month: "short", day: "numeric" });
}

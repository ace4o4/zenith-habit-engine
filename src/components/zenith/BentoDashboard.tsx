import { AnimatePresence, motion } from "motion/react";
import { HabitCard } from "./HabitCard";
import type { HabitEntity } from "@/store/habits";

interface Props {
  habits: HabitEntity[];
}

const container = {
  hidden: {},
  show: {
    transition: { staggerChildren: 0.05, delayChildren: 0.05 },
  },
};

export function BentoDashboard({ habits }: Props) {
  if (habits.length === 0) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ type: "spring", stiffness: 220, damping: 24, delay: 0.1 }}
        className="surface-card flex flex-col items-center justify-center gap-3 px-8 py-16 text-center"
      >
        <div
          className="size-10 rounded-full bg-accent-gradient opacity-90"
          aria-hidden
        />
        <h3 className="text-base font-semibold tracking-tight">No habits yet</h3>
        <p className="max-w-sm text-sm text-muted-foreground">
          Use the bar above to add your first habit. Try “Read 10 pages for 30 days”.
        </p>
      </motion.div>
    );
  }

  return (
    <motion.div
      variants={container}
      initial="hidden"
      animate="show"
      className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3"
    >
      <AnimatePresence mode="popLayout">
        {habits.map((h) => (
          <HabitCard key={h.id} habit={h} />
        ))}
      </AnimatePresence>
    </motion.div>
  );
}

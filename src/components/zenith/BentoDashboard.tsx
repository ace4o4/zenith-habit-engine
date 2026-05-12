import { AnimatePresence, motion } from "motion/react";
import { HabitCard } from "./HabitCard";
import type { HabitEntity } from "@/store/habits";

interface Props {
  habits: HabitEntity[];
}

const container = {
  hidden: {},
  show: {
    transition: { staggerChildren: 0.06, delayChildren: 0.1 },
  },
};

export function BentoDashboard({ habits }: Props) {
  if (habits.length === 0) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ type: "spring", stiffness: 220, damping: 24, delay: 0.1 }}
        className="glass-bento flex flex-col items-center justify-center gap-3 px-8 py-20 text-center"
      >
        <div
          className="size-12 rounded-full"
          style={{
            backgroundImage: "linear-gradient(135deg,#00f2fe,#4facfe)",
            boxShadow: "0 0 32px rgba(79,172,254,0.45)",
            opacity: 0.85,
          }}
        />
        <h3 className="text-lg font-semibold tracking-tight">The void awaits.</h3>
        <p className="max-w-sm text-sm text-text-muted">
          Speak your intent into the terminal above. Zenith will architect the path.
        </p>
      </motion.div>
    );
  }

  return (
    <motion.div
      variants={container}
      initial="hidden"
      animate="show"
      className="grid grid-cols-1 gap-5 md:grid-cols-2 xl:grid-cols-3"
    >
      <AnimatePresence mode="popLayout">
        {habits.map((h) => (
          <HabitCard key={h.id} habit={h} />
        ))}
      </AnimatePresence>
    </motion.div>
  );
}

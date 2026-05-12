import { useState } from "react";
import { motion } from "motion/react";
import { ArrowRight } from "lucide-react";
import { parseHabit } from "@/lib/parseHabit";
import { useHabits } from "@/store/habits";

export function CommandTerminal() {
  const [value, setValue] = useState("");
  const [pulse, setPulse] = useState(false);
  const addHabit = useHabits((s) => s.addHabit);

  const submit = (e?: React.FormEvent) => {
    e?.preventDefault();
    const parsed = parseHabit(value);
    if (!parsed || !parsed.title) {
      setPulse(true);
      setTimeout(() => setPulse(false), 400);
      return;
    }
    addHabit(parsed.title, parsed.duration);
    setValue("");
  };

  return (
    <motion.form
      onSubmit={submit}
      initial={{ opacity: 0, y: -12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ type: "spring", stiffness: 220, damping: 24, delay: 0.05 }}
      className="relative mx-auto w-full max-w-2xl"
    >
      <motion.div
        animate={pulse ? { x: [-4, 4, -3, 3, 0] } : { x: 0 }}
        transition={{ duration: 0.4 }}
        className="glass-bento flex items-center gap-3 rounded-full px-5 py-3"
        style={{ borderRadius: 9999 }}
      >
        <span
          aria-hidden
          className="size-2 rounded-full bg-neon"
          style={{ boxShadow: "0 0 12px rgba(79,172,254,0.8)" }}
        />
        <input
          value={value}
          onChange={(e) => setValue(e.target.value)}
          placeholder="I will [Action] for [Duration]…"
          className="flex-1 bg-transparent text-sm text-text-primary placeholder:text-text-muted outline-none"
          aria-label="New habit command"
          autoComplete="off"
          spellCheck={false}
        />
        <motion.button
          type="submit"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.94 }}
          transition={{ type: "spring", stiffness: 400, damping: 22 }}
          className="inline-flex size-8 items-center justify-center rounded-full bg-neon text-[#050507]"
          aria-label="Create habit"
        >
          <ArrowRight className="size-4" strokeWidth={2.5} />
        </motion.button>
      </motion.div>
      <p className="mt-2 text-center text-[11px] text-text-muted">
        Try “Read 10 pages for 30 days” · “Meditate for 2 weeks” · “Drink water”
      </p>
    </motion.form>
  );
}

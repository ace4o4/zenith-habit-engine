import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { ArrowRight, Check, AlertCircle } from "lucide-react";
import { parseHabit } from "@/lib/parseHabit";
import { useHabits } from "@/store/habits";

type Status = { kind: "idle" } | { kind: "ok"; title: string } | { kind: "error"; msg: string };

export function CommandTerminal() {
  const [value, setValue] = useState("");
  const [status, setStatus] = useState<Status>({ kind: "idle" });
  const addHabit = useHabits((s) => s.addHabit);

  const submit = (e?: React.FormEvent) => {
    e?.preventDefault();
    const trimmed = value.trim();
    if (!trimmed) {
      setStatus({
        kind: "error",
        msg: "Type a habit. Example: “Read 10 pages for 30 days”.",
      });
      return;
    }
    const parsed = parseHabit(trimmed);
    if (!parsed || !parsed.title) {
      setStatus({
        kind: "error",
        msg: "Couldn't parse that. Try: “[Action]” or “[Action] for [N] days/weeks”.",
      });
      return;
    }
    addHabit(parsed.title, parsed.duration);
    setStatus({ kind: "ok", title: parsed.title });
    setValue("");
    window.setTimeout(() => setStatus({ kind: "idle" }), 1800);
  };

  const onChange = (v: string) => {
    setValue(v);
    if (status.kind !== "idle") setStatus({ kind: "idle" });
  };

  const isError = status.kind === "error";
  const isOk = status.kind === "ok";

  return (
    <motion.form
      onSubmit={submit}
      initial={{ opacity: 0, y: -8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ type: "spring", stiffness: 220, damping: 24, delay: 0.05 }}
      className="relative mx-auto w-full max-w-2xl"
    >
      <motion.div
        animate={isError ? { x: [-5, 5, -4, 4, 0] } : { x: 0 }}
        transition={{ duration: 0.36 }}
        className="surface-card flex items-center gap-2 px-3 py-2 sm:gap-3 sm:px-4 sm:py-2.5"
        style={{
          borderColor: isError
            ? "var(--destructive)"
            : isOk
              ? "color-mix(in oklab, var(--accent) 60%, transparent)"
              : undefined,
        }}
      >
        <span
          aria-hidden
          className="hidden size-2 shrink-0 rounded-full bg-accent-gradient sm:block"
        />
        <input
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder="I will [action] for [duration]…"
          className="flex-1 bg-transparent text-sm text-foreground placeholder:text-muted-foreground outline-none"
          aria-label="New habit command"
          aria-invalid={isError}
          autoComplete="off"
          spellCheck={false}
        />
        <motion.button
          type="submit"
          whileHover={{ scale: 1.04 }}
          whileTap={{ scale: 0.94 }}
          transition={{ type: "spring", stiffness: 400, damping: 22 }}
          className="inline-flex size-9 shrink-0 items-center justify-center rounded-full bg-foreground text-background"
          aria-label="Create habit"
        >
          <ArrowRight className="size-4" strokeWidth={2.25} />
        </motion.button>
      </motion.div>

      <div className="mt-2 min-h-[18px] px-1 text-center">
        <AnimatePresence mode="wait" initial={false}>
          {isError && (
            <motion.p
              key="err"
              initial={{ opacity: 0, y: -4 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -4 }}
              transition={{ duration: 0.18 }}
              className="inline-flex items-center gap-1.5 text-[12px] text-destructive"
              role="alert"
            >
              <AlertCircle className="size-3.5" />
              {status.msg}
            </motion.p>
          )}
          {isOk && (
            <motion.p
              key="ok"
              initial={{ opacity: 0, y: -4 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -4 }}
              transition={{ duration: 0.18 }}
              className="inline-flex items-center gap-1.5 text-[12px] text-foreground"
            >
              <motion.span
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: "spring", stiffness: 500, damping: 20 }}
                className="inline-flex size-4 items-center justify-center rounded-full bg-accent-gradient text-[var(--accent-foreground)]"
              >
                <Check className="size-2.5" strokeWidth={3} />
              </motion.span>
              Added “{status.title}”
            </motion.p>
          )}
          {status.kind === "idle" && (
            <motion.p
              key="hint"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.15 }}
              className="text-[11px] text-muted-foreground"
            >
              Try “Read 10 pages for 30 days” · “Meditate for 2 weeks” · “Drink water”
            </motion.p>
          )}
        </AnimatePresence>
      </div>
    </motion.form>
  );
}

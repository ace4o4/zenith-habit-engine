import { motion } from "motion/react";

interface Props {
  progress: number; // 0..1
  label?: string;
  showLabel?: boolean;
  height?: number;
}

export function ProgressBar({ progress, label, showLabel = true, height = 6 }: Props) {
  const clamped = Math.max(0, Math.min(1, progress));
  const pct = Math.round(clamped * 100);

  return (
    <div className="w-full">
      {showLabel && (
        <div className="mb-1.5 flex items-center justify-between text-[11px]">
          <span className="font-medium uppercase tracking-[0.14em] text-text-muted">
            {label ?? "Progress"}
          </span>
          <span className="tabular-nums text-foreground">{pct}%</span>
        </div>
      )}
      <div
        className="relative w-full overflow-hidden rounded-full bg-secondary"
        style={{ height }}
        role="progressbar"
        aria-valuenow={pct}
        aria-valuemin={0}
        aria-valuemax={100}
      >
        <motion.div
          className="absolute inset-y-0 left-0 rounded-full bg-accent-gradient"
          initial={false}
          animate={{ width: `${pct}%` }}
          transition={{ type: "spring", stiffness: 120, damping: 22 }}
          style={{
            boxShadow: "0 0 12px color-mix(in oklab, var(--accent) 45%, transparent)",
          }}
        />
      </div>
    </div>
  );
}

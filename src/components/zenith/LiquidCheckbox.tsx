import { motion, useReducedMotion } from "motion/react";
import { useId } from "react";

interface Props {
  checked: boolean;
  onToggle: () => void;
  size?: number;
  ariaLabel?: string;
}

export function LiquidCheckbox({
  checked,
  onToggle,
  size = 28,
  ariaLabel = "Toggle day",
}: Props) {
  const reduced = useReducedMotion();
  const gradId = useId();

  const handle = () => {
    onToggle();
    if (typeof navigator !== "undefined" && "vibrate" in navigator) {
      try {
        navigator.vibrate(35);
      } catch {
        /* noop */
      }
    }
  };

  const onKey = (e: React.KeyboardEvent) => {
    if (e.key === " " || e.key === "Enter") {
      e.preventDefault();
      handle();
    }
  };

  return (
    <motion.button
      type="button"
      role="checkbox"
      aria-checked={checked}
      aria-label={ariaLabel}
      onClick={handle}
      onKeyDown={onKey}
      whileTap={{ scale: 0.9 }}
      transition={{ type: "spring", stiffness: 400, damping: 25 }}
      className="relative inline-flex shrink-0 items-center justify-center rounded-[10px] outline-none focus-visible:ring-2 focus-visible:ring-ring"
      style={{ width: size, height: size }}
    >
      <svg width={size} height={size} viewBox="0 0 32 32" fill="none">
        <defs>
          <linearGradient id={`${gradId}-fill`} x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="var(--accent-from)" />
            <stop offset="100%" stopColor="var(--accent-to)" />
          </linearGradient>
        </defs>

        <rect
          x="2"
          y="2"
          width="28"
          height="28"
          rx="9"
          fill="var(--secondary)"
          stroke="var(--border)"
          strokeWidth="1"
        />

        <motion.rect
          x="2"
          y="2"
          width="28"
          height="28"
          rx="9"
          fill={`url(#${gradId}-fill)`}
          initial={false}
          animate={{ scale: checked ? 1 : 0, opacity: checked ? 1 : 0 }}
          transition={
            reduced
              ? { duration: 0.15 }
              : { type: "spring", stiffness: 380, damping: 22 }
          }
          style={{ transformOrigin: "center" }}
        />

        <motion.path
          d="M9 16.5 L14 21 L23 11"
          stroke="var(--accent-foreground)"
          strokeWidth="2.6"
          strokeLinecap="round"
          strokeLinejoin="round"
          fill="none"
          initial={false}
          animate={{ pathLength: checked ? 1 : 0, opacity: checked ? 1 : 0 }}
          transition={{ duration: reduced ? 0.1 : 0.35, ease: "easeOut" }}
        />
      </svg>
    </motion.button>
  );
}

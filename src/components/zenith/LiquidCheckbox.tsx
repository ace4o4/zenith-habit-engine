import { motion, useReducedMotion } from "motion/react";
import { useId } from "react";

interface Props {
  checked: boolean;
  onToggle: () => void;
  size?: number;
  ariaLabel?: string;
}

export function LiquidCheckbox({ checked, onToggle, size = 28, ariaLabel = "Toggle day" }: Props) {
  const reduced = useReducedMotion();
  const gradId = useId();

  const handle = () => {
    onToggle();
    if (typeof navigator !== "undefined" && "vibrate" in navigator) {
      try {
        navigator.vibrate(50);
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
      whileTap={{ scale: 0.92 }}
      transition={{ type: "spring", stiffness: 400, damping: 25 }}
      className="relative inline-flex items-center justify-center rounded-[10px] outline-none focus-visible:ring-2 focus-visible:ring-[#4facfe]/70"
      style={{ width: size, height: size }}
    >
      <svg
        width={size}
        height={size}
        viewBox="0 0 32 32"
        fill="none"
        style={{
          filter: checked ? "drop-shadow(0 0 12px rgba(79,172,254,0.65))" : "none",
          transition: "filter 0.3s ease",
        }}
      >
        <defs>
          <radialGradient id={`${gradId}-fill`} cx="50%" cy="50%" r="60%">
            <stop offset="0%" stopColor="#00f2fe" />
            <stop offset="100%" stopColor="#4facfe" />
          </radialGradient>
        </defs>

        {/* Idle border */}
        <rect
          x="2"
          y="2"
          width="28"
          height="28"
          rx="8"
          fill="rgba(255,255,255,0.02)"
          stroke="rgba(255,255,255,0.18)"
          strokeWidth="1.25"
        />

        {/* Liquid fill burst */}
        <motion.rect
          x="2"
          y="2"
          width="28"
          height="28"
          rx="8"
          fill={`url(#${gradId}-fill)`}
          initial={false}
          animate={{ scale: checked ? 1 : 0, opacity: checked ? 1 : 0 }}
          transition={
            reduced
              ? { duration: 0.15 }
              : { type: "spring", stiffness: 400, damping: 25 }
          }
          style={{ transformOrigin: "center" }}
        />

        {/* Check path */}
        <motion.path
          d="M9 16.5 L14 21 L23 11"
          stroke="#050507"
          strokeWidth="2.6"
          strokeLinecap="round"
          strokeLinejoin="round"
          fill="none"
          initial={false}
          animate={{ pathLength: checked ? 1 : 0, opacity: checked ? 1 : 0 }}
          transition={{ duration: reduced ? 0.1 : 0.4, ease: "easeOut" }}
        />
      </svg>
    </motion.button>
  );
}

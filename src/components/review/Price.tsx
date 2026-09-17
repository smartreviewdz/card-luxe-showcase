import { AnimatePresence, motion } from "motion/react";
import { formatDA } from "./catalogue-data";

export function Price({
  base,
  current,
  unit,
  size = "md",
}: {
  base: number;
  current: number;
  unit?: string | undefined;
  size?: "md" | "lg";
}) {
  const changed = current !== base && base > 0;
  const down = current < base;
  const pct = changed ? Math.round((Math.abs(base - current) / base) * 100) : 0;

  return (
    <div className="flex flex-col items-end gap-1">
      <AnimatePresence mode="popLayout" initial={false}>
        {changed && (
          <motion.span
            key={`old-${base}`}
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -6 }}
            className="relative font-sans text-[0.72rem] text-ink-muted"
          >
            <span className="opacity-70">{formatDA(base)}</span>
            <motion.span
              initial={{ scaleX: 0 }}
              animate={{ scaleX: 1 }}
              transition={{ duration: 0.4, ease: "easeOut" }}
              className="absolute inset-x-0 top-1/2 h-px origin-left bg-gold-deep"
            />
          </motion.span>
        )}
      </AnimatePresence>

      <div className="flex items-baseline gap-1.5">
        <AnimatePresence mode="popLayout" initial={false}>
          <motion.span
            key={current}
            initial={{ opacity: 0, y: 10, filter: "blur(4px)" }}
            animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
            exit={{ opacity: 0, y: -10, filter: "blur(4px)" }}
            transition={{ duration: 0.32, ease: [0.16, 1, 0.3, 1] }}
            className={`gold-text-deep font-display font-bold tracking-wide ${
              size === "lg" ? "text-4xl" : "text-3xl"
            }`}
          >
            {formatDA(current)}
          </motion.span>
        </AnimatePresence>
        {unit && <span className="font-sans text-[0.66rem] text-ink-muted">{unit}</span>}
      </div>

      <AnimatePresence>
        {changed && pct > 0 && (
          <motion.span
            key={down ? "down" : "up"}
            initial={{ opacity: 0, scale: 0.7 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.7 }}
            transition={{ type: "spring", stiffness: 420, damping: 16 }}
            className={
              down
                ? "rounded-full border border-gold/60 bg-navy px-2 py-0.5 font-sans text-[0.58rem] font-semibold tracking-[0.18em] text-gold uppercase"
                : "rounded-full border border-navy/30 bg-gold px-2 py-0.5 font-sans text-[0.58rem] font-semibold tracking-[0.18em] text-navy uppercase"
            }
            style={{ boxShadow: "var(--shadow-gold-glow)" }}
          >
            {down ? "−" : "+"}
            {pct}%
          </motion.span>
        )}
      </AnimatePresence>
    </div>
  );
}

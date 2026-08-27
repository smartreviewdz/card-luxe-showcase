import { motion, type Variants } from "motion/react";
import type { ReactNode } from "react";

export const rise: Variants = {
  hidden: { opacity: 0, y: 26 },
  show: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.8, ease: [0.16, 1, 0.3, 1] },
  },
};

export function Reveal({
  children,
  delay = 0,
  className,
}: {
  children: ReactNode;
  delay?: number;
  className?: string;
}) {
  return (
    <motion.div
      className={className}
      initial="hidden"
      whileInView="show"
      viewport={{ once: true, amount: 0.25 }}
      variants={{
        hidden: { opacity: 0, y: 26 },
        show: {
          opacity: 1,
          y: 0,
          transition: { duration: 0.85, delay, ease: [0.16, 1, 0.3, 1] },
        },
      }}
    >
      {children}
    </motion.div>
  );
}

export function Eyebrow({ children, tone = "gold" }: { children: ReactNode; tone?: "gold" | "navy" }) {
  return (
    <div className="flex items-center justify-center gap-3">
      <span className="gold-rule w-10" />
      <span
        className={`font-sans text-[0.66rem] font-medium tracking-[0.42em] uppercase ${
          tone === "gold" ? "text-gold" : "text-navy"
        }`}
      >
        {children}
      </span>
      <span className="gold-rule w-10" />
    </div>
  );
}

export function Corners({ tone = "gold" }: { tone?: "gold" | "goldSoft" }) {
  const color = tone === "gold" ? "border-gold" : "border-gold/50";
  const base = `pointer-events-none absolute h-8 w-8 ${color}`;
  return (
    <>
      <span className={`${base} top-0 left-0 border-t-2 border-l-2`} />
      <span className={`${base} top-0 right-0 border-t-2 border-r-2`} />
      <span className={`${base} bottom-0 left-0 border-b-2 border-l-2`} />
      <span className={`${base} right-0 bottom-0 border-r-2 border-b-2`} />
    </>
  );
}

export function GoldStar({ className = "", fill = 1 }: { className?: string; fill?: number }) {
  const id = `grad-${Math.round(fill * 100)}`;
  return (
    <svg viewBox="0 0 24 24" className={className} aria-hidden="true">
      <defs>
        <linearGradient id={id} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="oklch(0.9 0.09 92)" />
          <stop offset="45%" stopColor="oklch(0.82 0.14 86)" />
          <stop offset="100%" stopColor="oklch(0.62 0.12 70)" />
        </linearGradient>
      </defs>
      <path
        d="M12 2.6l2.79 5.98 6.21.78-4.56 4.34 1.19 6.3L12 16.9l-5.63 3.1 1.19-6.3L3 9.36l6.21-.78L12 2.6z"
        fill={fill > 0 ? `url(#${id})` : "currentColor"}
      />
    </svg>
  );
}

import { useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { GoldStar } from "./primitives";

const CAPTIONS = [
  "Choisissez une note",
  "Nous pouvons faire mieux",
  "Merci pour votre franchise",
  "Une expérience correcte",
  "Ravi de vous avoir servi",
  "Vous êtes formidable, merci !",
];

export function RatingPicker() {
  const [value, setValue] = useState(0);
  const [hover, setHover] = useState(0);
  const active = hover || value;

  return (
    <div className="flex flex-col items-center gap-6">
      <div className="flex items-end gap-2" onMouseLeave={() => setHover(0)}>
        {[1, 2, 3, 4, 5].map((n) => {
          const on = n <= active;
          return (
            <motion.button
              key={n}
              type="button"
              aria-label={`Note ${n} sur 5`}
              onMouseEnter={() => setHover(n)}
              onFocus={() => setHover(n)}
              onClick={() => setValue(n)}
              whileTap={{ scale: 0.86 }}
              animate={on ? { scale: 1.12, y: -4, rotate: 0 } : { scale: 1, y: 0, rotate: 0 }}
              transition={{ type: "spring", stiffness: 420, damping: 14, delay: on ? n * 0.035 : 0 }}
              className="relative outline-none"
            >
              {on && (
                <span
                  className="absolute inset-0 -z-10 rounded-full blur-md"
                  style={{ background: "radial-gradient(circle, var(--gold) 0%, transparent 70%)", opacity: 0.5 }}
                />
              )}
              <GoldStar
                fill={on ? 1 : 0}
                className={`h-12 w-12 transition-colors duration-300 ${on ? "animate-twinkle" : "text-ivory-shade"}`}
              />
            </motion.button>
          );
        })}
      </div>

      <div className="h-5 overflow-hidden">
        <AnimatePresence mode="wait">
          <motion.p
            key={active}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -12 }}
            transition={{ duration: 0.28 }}
            className="font-sans text-[0.7rem] font-500 tracking-[0.34em] text-navy uppercase"
          >
            {CAPTIONS[active]}
          </motion.p>
        </AnimatePresence>
      </div>

      <motion.div
        animate={{ opacity: value ? 1 : 0.45, y: value ? 0 : 6 }}
        transition={{ duration: 0.4 }}
        className="relative overflow-hidden rounded-full px-9 py-3.5"
        style={{ backgroundImage: "var(--gradient-navy)", boxShadow: "var(--shadow-lift)" }}
      >
        <span className="pointer-events-none absolute inset-0 rounded-full border border-gold/60" />
        <span
          className="animate-sheen pointer-events-none absolute inset-y-0 -left-1/3 w-1/3"
          style={{ background: "linear-gradient(90deg, transparent, oklch(1 0 0 / 0.28), transparent)" }}
        />
        <span className="gold-text relative font-sans text-[0.72rem] font-600 tracking-[0.3em] uppercase">
          Publier mon avis
        </span>
      </motion.div>
    </div>
  );
}

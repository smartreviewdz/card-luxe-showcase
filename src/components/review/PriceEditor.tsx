import { AnimatePresence, motion } from "motion/react";
import { RotateCcw, X } from "lucide-react";
import { ALL_ITEMS, CATALOGUE, formatDA } from "./catalogue-data";

export function PriceEditor({
  open,
  prices,
  previous,
  onChange,
  onReset,
  onClose,
}: {
  open: boolean;
  prices: Record<string, number>;
  previous: Record<string, number>;
  onChange: (id: string, value: number) => void;
  onReset: () => void;
  onClose: () => void;
}) {
  const changed = ALL_ITEMS.some((it) => (prices[it.id] ?? it.base) !== it.base);

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-end justify-center"
          style={{ background: "oklch(0.15 0.05 262 / 0.7)", backdropFilter: "blur(6px)" }}
          onClick={onClose}
        >
          <motion.div
            initial={{ y: "100%" }}
            animate={{ y: 0 }}
            exit={{ y: "100%" }}
            transition={{ type: "spring", stiffness: 260, damping: 30 }}
            onClick={(e) => e.stopPropagation()}
            className="relative max-h-[86vh] w-full overflow-y-auto rounded-t-[2rem] px-5 pt-6 pb-10"
            style={{ backgroundImage: "var(--gradient-navy)", boxShadow: "var(--shadow-lift)" }}
          >
            <span className="mx-auto mb-5 block h-1 w-12 rounded-full bg-gold/60" />
            <button
              type="button"
              onClick={onClose}
              aria-label="Fermer"
              className="absolute top-5 right-5 grid h-8 w-8 place-items-center rounded-full border border-gold/40 text-gold"
            >
              <X className="h-4 w-4" />
            </button>

            <h2 className="text-center font-display text-2xl font-semibold text-ivory">Ajuster les tarifs</h2>
            <p className="mt-1 text-center font-sans text-[0.68rem] tracking-[0.2em] text-ivory/50 uppercase">
              Ancien prix affiché à chaque changement
            </p>
            <p className="mt-2 text-center font-sans text-[0.62rem] text-gold/80">
              Vos tarifs sont enregistrés automatiquement
            </p>

            <div className="mt-7 space-y-7">
              {CATALOGUE.map((group) => (
                <div key={group.id}>
                  <p className="font-sans text-[0.6rem] font-semibold tracking-[0.3em] text-gold uppercase">
                    {group.index} — {group.title}
                  </p>
                  <div className="mt-3 space-y-3">
                    {group.items.map((item) => {
                      const value = prices[item.id] ?? item.base;
                      const off = value < item.base;
                      return (
                        <div
                          key={item.id}
                          className="rounded-2xl border border-gold/20 px-4 py-3"
                          style={{ background: "oklch(1 0 0 / 0.04)" }}
                        >
                          <div className="flex items-center justify-between gap-3">
                            <span className="font-sans text-[0.78rem] text-ivory">{item.name}</span>
                            <div className="flex items-center gap-2">
                              <input
                                type="number"
                                inputMode="numeric"
                                step={100}
                                min={0}
                                value={value}
                                onChange={(e) => onChange(item.id, Number(e.target.value) || 0)}
                                className="w-24 rounded-lg border border-gold/40 bg-navy-deep px-2 py-1.5 text-right font-sans text-sm text-gold outline-none focus:border-gold"
                              />
                              <span className="font-sans text-[0.6rem] text-ivory/45">DA{item.unit ?? ""}</span>
                            </div>
                          </div>
                          <AnimatePresence>
                            {off && (
                              <motion.p
                                initial={{ opacity: 0, height: 0 }}
                                animate={{ opacity: 1, height: "auto" }}
                                exit={{ opacity: 0, height: 0 }}
                                className="mt-2 font-sans text-[0.62rem] text-ivory/55"
                              >
                                Remise&nbsp;: <span className="line-through">{formatDA(item.base)}</span> →{" "}
                                <span className="text-gold">{formatDA(value)}</span>
                              </motion.p>
                            )}
                          </AnimatePresence>
                        </div>
                      );
                    })}
                  </div>
                </div>
              ))}
            </div>

            <button
              type="button"
              onClick={onReset}
              disabled={!changed}
              className="mt-8 flex w-full items-center justify-center gap-2 rounded-full border border-gold/50 py-3 font-sans text-[0.68rem] font-semibold tracking-[0.28em] text-gold uppercase disabled:opacity-35"
            >
              <RotateCcw className="h-3.5 w-3.5" /> Rétablir les tarifs
            </button>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

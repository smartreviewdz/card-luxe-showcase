import { motion } from "motion/react";
import { CATALOGUE, type Item } from "./catalogue-data";
import { Price } from "./Price";
import { Corners, Eyebrow, Reveal } from "./primitives";

function ProductCard({ item, price, i }: { item: Item; price: number; i: number }) {
  return (
    <Reveal delay={i * 0.08}>
      <motion.article
        whileHover={{ y: -6 }}
        transition={{ type: "spring", stiffness: 260, damping: 20 }}
        className="group relative overflow-hidden rounded-[1.4rem] border border-gold/25 bg-ivory p-4"
        style={{ boxShadow: "var(--shadow-soft-inset)" }}
      >
        <span
          className="animate-sheen pointer-events-none absolute inset-y-0 -left-1/3 w-1/3 opacity-60"
          style={{ background: "linear-gradient(90deg, transparent, oklch(1 0 0 / 0.55), transparent)" }}
        />
        {item.featured && (
          <span className="absolute top-3 right-3 z-10 rounded-full border border-gold/60 px-2 py-0.5 font-sans text-[0.54rem] font-semibold tracking-[0.2em] text-gold-deep uppercase">
            Premium
          </span>
        )}

        <div className="flex items-center gap-4">
          {item.image && (
            <motion.div
              whileHover={{ scale: 1.06, rotate: -1.5 }}
              transition={{ type: "spring", stiffness: 300, damping: 18 }}
              className="relative h-24 w-24 shrink-0 overflow-hidden rounded-[1rem] border border-gold/30"
            >
              <img
                src={item.image}
                alt={item.name}
                loading="lazy"
                className="h-full w-full object-cover"
              />
            </motion.div>
          )}
          <div className="min-w-0 flex-1">
            <h3 className="font-display text-xl leading-tight font-semibold text-navy">{item.name}</h3>
            <p className="mt-1 font-sans text-[0.72rem] leading-snug text-ink-muted">{item.detail}</p>
          </div>
        </div>

        <div className="mt-4 flex items-end justify-between gap-3">
          {item.note ? (
            <span className="max-w-[9rem] font-sans text-[0.58rem] leading-snug tracking-[0.14em] text-gold-deep uppercase">
              {item.note}
            </span>
          ) : (
            <span className="gold-rule w-16" />
          )}
          <Price base={item.base} current={price} unit={item.unit} size={item.featured ? "lg" : "md"} />
        </div>
      </motion.article>
    </Reveal>
  );
}

export function Catalogue({ prices }: { prices: Record<string, number> }) {
  return (
    <div className="px-5 pt-10 pb-4">
      {CATALOGUE.map((group, gi) => (
        <section key={group.id} className="mb-12">
          <Reveal className="relative mb-6">
            <div className="relative grid place-items-center py-2">
              <Corners tone="goldSoft" />
              <span className="font-display text-4xl font-semibold text-navy/15">{group.index}</span>
              <h2 className="-mt-3 text-center font-display text-2xl font-semibold text-navy">{group.title}</h2>
              <div className="mt-2">
                <Eyebrow tone="navy">Tarifs en DA</Eyebrow>
              </div>
            </div>
          </Reveal>

          <div className="flex flex-col gap-4">
            {group.items.map((item, i) => (
              <ProductCard key={item.id} item={item} price={prices[item.id] ?? item.base} i={i + gi * 0.2} />
            ))}
          </div>
        </section>
      ))}
    </div>
  );
}

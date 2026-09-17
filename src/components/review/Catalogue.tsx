import { LayoutGroup, motion } from "motion/react";
import { CATALOGUE, type Item } from "./catalogue-data";
import { Price } from "./Price";
import { Corners, Eyebrow, Reveal } from "./primitives";

function ProductCard({
  item,
  price,
  reference,
  i,
}: {
  item: Item;
  price: number;
  reference: number;
  i: number;
}) {
  return (
    <Reveal delay={i * 0.08}>
      <motion.article
        layout
        whileHover={{ y: -7, scale: 1.012 }}
        whileTap={{ scale: 0.992 }}
        transition={{ layout: { type: "spring", stiffness: 210, damping: 24 }, type: "spring", stiffness: 260, damping: 20 }}
        className="group relative overflow-hidden rounded-[1.4rem] border border-gold/45 bg-ivory p-4"
        style={{ boxShadow: "var(--shadow-card)" }}
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

        <div className="flex items-center gap-3">
          {item.image && (
            <motion.div
              initial={{ opacity: 0, scale: 0.82, rotate: -4 }}
              whileInView={{ opacity: 1, scale: 1, rotate: 0 }}
              viewport={{ once: true, amount: 0.4 }}
              transition={{ delay: 0.12 + i * 0.06, type: "spring", stiffness: 190, damping: 17 }}
              className="relative h-36 w-36 shrink-0"
            >
              <div className="animate-product-float relative h-full w-full overflow-hidden rounded-[1rem] border border-gold/45 bg-ivory-shade shadow-[var(--shadow-product)]">
                <span className="pointer-events-none absolute inset-0 z-10 bg-product-glint opacity-0 transition-opacity duration-500 group-hover:opacity-100" />
                <img
                  src={item.image}
                  alt={item.name}
                  loading="lazy"
                  className="h-full w-full object-cover transition-transform duration-700 ease-out group-hover:scale-[1.08]"
                />
              </div>
            </motion.div>
          )}
          <div className="min-w-0 flex-1">
            <h3 className="font-display text-lg leading-tight font-semibold text-navy">{item.name}</h3>
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
          <Price base={reference} current={price} unit={item.unit} size={item.featured ? "lg" : "md"} />
        </div>
      </motion.article>
    </Reveal>
  );
}

export function Catalogue({
  prices,
  previous,
}: {
  prices: Record<string, number>;
  previous: Record<string, number>;
}) {
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

          <LayoutGroup id={group.id}>
            <motion.div layout className="flex flex-col gap-4">
              {(group.id === "cartes"
                ? [...group.items].sort(
                    (a, b) => (prices[a.id] ?? a.base) - (prices[b.id] ?? b.base),
                  )
                : group.items
              ).map((item, i) => (
                <ProductCard
                  key={item.id}
                  item={item}
                  price={prices[item.id] ?? item.base}
                  reference={previous[item.id] ?? item.base}
                  i={i + gi * 0.2}
                />
              ))}
            </motion.div>
          </LayoutGroup>
        </section>
      ))}
    </div>
  );
}

import { useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { queryOptions, useQuery, useQueryClient, useSuspenseQuery } from "@tanstack/react-query";
import { useServerFn } from "@tanstack/react-start";
import { motion } from "motion/react";
import { GoogleBadge } from "@/components/review/GoogleBadge";
import { Catalogue } from "@/components/review/Catalogue";
import { PriceEditor } from "@/components/review/PriceEditor";
import { Eyebrow, GoldStar, Reveal } from "@/components/review/primitives";
import { ALL_ITEMS } from "@/components/review/catalogue-data";
import {
  getEditorStatus,
  getPrices,
  resetPrices,
  savePrice,
  unlockEditor,
  type PriceState,
} from "@/lib/prices.functions";

const pricesQuery = queryOptions({
  queryKey: ["catalogue-prices"],
  queryFn: () => getPrices(),
});

const statusQuery = queryOptions({
  queryKey: ["editor-status"],
  queryFn: () => getEditorStatus(),
});

export const Route = createFileRoute("/")({
  loader: ({ context }) => {
    void context.queryClient.ensureQueryData(pricesQuery);
  },
  head: () => ({
    meta: [
      { title: "Avify Stat — Catalogue des cartes et abonnements" },
      {
        name: "description",
        content:
          "Catalogue Avify Stat : cartes d'avis Google NFC, chevalet de comptoir, édition Premium et abonnements au logiciel de filtrage. Tarifs en dinars algériens.",
      },
      { property: "og:title", content: "Avify Stat — Catalogue des cartes et abonnements" },
      {
        property: "og:description",
        content: "Cartes NFC d'avis Google et abonnements logiciel, tarifs en DA.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: CataloguePage,
});

function Particles() {
  const dots = [8, 20, 33, 47, 61, 74, 88];
  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden">
      {dots.map((left, i) => (
        <span
          key={left}
          className="absolute bottom-0 h-1 w-1 rounded-full bg-gold"
          style={{
            left: `${left}%`,
            animation: `avify-drift ${7 + (i % 4) * 2.5}s linear ${i * 1.3}s infinite`,
          }}
        />
      ))}
    </div>
  );
}

function Hero({ onBadgeClick }: { onBadgeClick: () => void }) {
  return (
    <header className="relative overflow-hidden pt-14 pb-24" style={{ backgroundImage: "var(--gradient-navy)" }}>
      <Particles />
      

      <div className="relative px-6">
        <GoogleBadge onClick={onBadgeClick} />

        <motion.div
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, delay: 0.25, ease: [0.16, 1, 0.3, 1] }}
          className="mt-7"
        >
          <Eyebrow>Catalogue officiel</Eyebrow>
          <h1 className="mt-4 text-center font-display text-4xl leading-tight font-semibold tracking-[0.14em] text-ivory uppercase">
            Avify Stat
          </h1>
          <p className="mt-3 text-center font-sans text-[0.62rem] tracking-[0.3em] text-ivory/50 uppercase">
            Better feedback. Better businesses.
          </p>
        </motion.div>

        <div className="mt-6 flex items-center justify-center gap-3">
          <span className="gold-rule w-10" />
          {[0, 1, 2, 3, 4].map((i) => (
            <motion.span
              key={i}
              initial={{ opacity: 0, scale: 0.4, rotate: -35 }}
              animate={{ opacity: 1, scale: 1, rotate: 0 }}
              transition={{ delay: 0.45 + i * 0.11, type: "spring", stiffness: 300, damping: 12 }}
            >
              <GoldStar className="animate-twinkle h-7 w-7" fill={1} />
            </motion.span>
          ))}
          <span className="gold-rule w-10" />
        </div>
      </div>

      <div className="absolute inset-x-0 bottom-[-1px]">
        <svg viewBox="0 0 390 70" preserveAspectRatio="none" className="block h-16 w-full">
          <path d="M0 44 C 90 4, 250 -6, 390 26 L390 70 L0 70 Z" fill="var(--gold)" opacity="0.9" />
          <path d="M0 50 C 90 10, 250 0, 390 32 L390 70 L0 70 Z" fill="var(--ivory)" />
        </svg>
      </div>
    </header>
  );
}

function Footer() {
  return (
    <footer className="px-6 pb-12">
      <div className="gold-rule" />
      <Reveal className="mt-8 flex flex-col items-center">
        <div className="flex items-center gap-3">
          <span className="gold-rule w-16" />
          <span className="h-2 w-2 rotate-45 bg-gold" />
          <span className="gold-rule w-16" />
        </div>
        <p className="gold-text-deep mt-5 font-display text-4xl font-semibold tracking-[0.16em]">AVIFY STAT</p>
        <p className="mt-3 font-sans text-[0.62rem] tracking-[0.28em] text-ink-muted uppercase">
          Tarifs exprimés en dinars algériens
        </p>
      </Reveal>
    </footer>
  );
}

function CataloguePage() {
  const queryClient = useQueryClient();
  const { data: state } = useSuspenseQuery(pricesQuery);
  const { data: status } = useQuery({ ...statusQuery, staleTime: 60_000 });
  const [open, setOpen] = useState(false);
  const [saving, setSaving] = useState(false);

  const save = useServerFn(savePrice);
  const reset = useServerFn(resetPrices);
  const unlock = useServerFn(unlockEditor);

  const apply = (next: PriceState) => queryClient.setQueryData(pricesQuery.queryKey, next);

  const handleUnlock = async (code: string) => {
    const res = await unlock({ data: { code } });
    if (!res.ok) return false;
    queryClient.setQueryData(statusQuery.queryKey, { unlocked: true });
    void queryClient.invalidateQueries({ queryKey: statusQuery.queryKey });
    return true;
  };


  const handleChange = async (id: string, value: number) => {
    const base = ALL_ITEMS.find((it) => it.id === id)?.base ?? value;
    setSaving(true);
    try {
      apply(await save({ data: { itemId: id, price: value, base } }));
    } finally {
      setSaving(false);
    }
  };

  const handleReset = async () => {
    setSaving(true);
    try {
      apply(await reset());
    } finally {
      setSaving(false);
    }
  };

  return (
    <main className="min-h-screen bg-ivory font-sans antialiased">
      <Hero onBadgeClick={() => setOpen(true)} />
      <Catalogue prices={state.prices} previous={state.previous} />
      <Footer />
      <PriceEditor
        open={open}
        unlocked={status?.unlocked === true}
        prices={state.prices}
        previous={state.previous}
        saving={saving}
        onUnlock={handleUnlock}
        onChange={handleChange}
        onReset={handleReset}
        onClose={() => setOpen(false)}
      />
    </main>
  );
}

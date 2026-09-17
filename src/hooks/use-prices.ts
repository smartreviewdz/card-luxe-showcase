import { useCallback, useEffect, useState } from "react";

const KEY = "avify-prices-v1";

type Store = { prices: Record<string, number>; previous: Record<string, number> };

const EMPTY: Store = { prices: {}, previous: {} };

export function usePrices() {
  const [store, setStore] = useState<Store>(EMPTY);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(KEY);
      if (raw) {
        const parsed = JSON.parse(raw) as Partial<Store>;
        setStore({ prices: parsed.prices ?? {}, previous: parsed.previous ?? {} });
      }
    } catch {
      /* ignore corrupted storage */
    }
    setHydrated(true);
  }, []);

  useEffect(() => {
    if (!hydrated) return;
    try {
      localStorage.setItem(KEY, JSON.stringify(store));
    } catch {
      /* storage unavailable */
    }
  }, [store, hydrated]);

  const setPrice = useCallback((id: string, value: number) => {
    setStore((s) => ({ ...s, prices: { ...s.prices, [id]: value } }));
  }, []);

  // Freeze the current values as the "old price" reference before a new editing session.
  const snapshot = useCallback((baseline: Record<string, number>) => {
    setStore((s) => ({ ...s, previous: { ...baseline, ...s.prices } }));
  }, []);

  const reset = useCallback(() => {
    setStore(EMPTY);
    try {
      localStorage.removeItem(KEY);
    } catch {
      /* storage unavailable */
    }
  }, []);

  return { prices: store.prices, previous: store.previous, setPrice, snapshot, reset };
}

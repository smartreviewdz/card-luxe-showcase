export type Item = {
  id: string;
  name: string;
  detail: string;
  base: number;
  unit?: string;
  image?: string;
  note?: string;
  featured?: boolean;
};

export type Group = { id: string; index: string; title: string; items: Item[] };

export const CATALOGUE: Group[] = [
  {
    id: "cartes",
    index: "01",
    title: "Cartes Avify",
    items: [
      {
        id: "normale",
        name: "Carte Normale 10×10",
        detail: "Plaque NFC + QR, finition mate",
        base: 3200,
        image: "/card-luxe-showcase/images/carte-normale.webp",
      },
      {
        id: "stand",
        name: "Carte Normale Stand",
        detail: "Chevalet de comptoir autoportant",
        base: 3000,
        image: "/card-luxe-showcase/images/avify-premium.webp",
      },
      {
        id: "premium",
        name: "Avify Premium 15×15",
        detail: "Édition navy & or, personnalisée",
        base: 3600,
        image: "/card-luxe-showcase/images/carte-stand.png",
        featured: true,
      },
    ],
  },
  {
    id: "filtrage",
    index: "02",
    title: "Logiciel de Filtrage",
    items: [
      {
        id: "filtrage-3",
        name: "Pack 3 mois",
        detail: "Paiement unique",
        base: 9000,
      },
      {
        id: "filtrage-6",
        name: "Pack 6 mois",
        detail: "Paiement unique",
        base: 16000,
      },
      {
        id: "filtrage-12",
        name: "Pack 1 an",
        detail: "Paiement unique",
        base: 28000,
        featured: true,
      },
    ],
  },
  {
    id: "tracking",
    index: "03",
    title: "Logiciel + Rapport PDF de Tracking",
    items: [
      {
        id: "tracking-3",
        name: "Pack 3 mois",
        detail: "Paiement unique",
        base: 10000,
      },
      {
        id: "tracking-6",
        name: "Pack 6 mois",
        detail: "Paiement unique",
        base: 18000,
      },
      {
        id: "tracking-12",
        name: "Pack 1 an",
        detail: "Paiement unique",
        base: 32000,
        featured: true,
      },
    ],
  },
];

export const ALL_ITEMS: Item[] = CATALOGUE.flatMap((g) => g.items);

/** Pack item id -> { months, reference pack id used as the monthly benchmark } */
export const PACKS: Record<string, { months: number; reference: string }> = {
  "filtrage-3": { months: 3, reference: "filtrage-3" },
  "filtrage-6": { months: 6, reference: "filtrage-3" },
  "filtrage-12": { months: 12, reference: "filtrage-3" },
  "tracking-3": { months: 3, reference: "tracking-3" },
  "tracking-6": { months: 6, reference: "tracking-3" },
  "tracking-12": { months: 12, reference: "tracking-3" },
};

const REFERENCE_MONTHS = 3;

function priceOf(id: string, prices: Record<string, number>) {
  const item = ALL_ITEMS.find((it) => it.id === id);
  return prices[id] ?? item?.base ?? 0;
}

/** "Paiement unique · X DA / mois" line for a pack. */
export function packMonthly(itemId: string, prices: Record<string, number>): string | null {
  const pack = PACKS[itemId];
  if (!pack) return null;
  const perMonth = Math.round(priceOf(itemId, prices) / pack.months);
  return `Paiement unique · ${formatDA(perMonth)} / mois`;
}

/** Live saving vs the 3-month pack rate, or null when there is none. */
export function packSavings(itemId: string, prices: Record<string, number>): string | null {
  const pack = PACKS[itemId];
  if (!pack || pack.months === REFERENCE_MONTHS) return null;
  const refMonthly = priceOf(pack.reference, prices) / REFERENCE_MONTHS;
  const diff = Math.round(refMonthly * pack.months - priceOf(itemId, prices));
  if (diff <= 0) return null;
  return `Économie de ${formatDA(diff)} sur ${pack.months} mois`;
}

export function formatDA(v: number) {
  return `${v.toLocaleString("fr-FR").replace(/\u202f|,/g, " ")} DA`;
}

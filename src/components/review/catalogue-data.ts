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
        image: "/card-luxe-showcase/images/carte-stand.png",
      },
      {
        id: "premium",
        name: "Avify Premium 15×15",
        detail: "Édition navy & or, personnalisée",
        base: 3600,
        image: "/card-luxe-showcase/images/avify-premium.webp",
        featured: true,
      },
    ],
  },
  {
    id: "filtrage",
    index: "02",
    title: "Logiciel de Filtrage",
    items: [
      { id: "filtrage-mois", name: "Abonnement mensuel", detail: "Sans engagement", base: 3500, unit: "/ mois" },
      {
        id: "filtrage-6",
        name: "Engagement 6 mois",
        detail: "−500 DA / mois",
        base: 3000,
        unit: "/ mois",
        note: "Économie de 3 000 DA sur 6 mois",
      },
    ],
  },
  {
    id: "tracking",
    index: "03",
    title: "Logiciel + Rapport PDF de Tracking",
    items: [
      { id: "tracking-mois", name: "Abonnement mensuel", detail: "Rapport mensuel inclus", base: 3800, unit: "/ mois" },
      {
        id: "tracking-6",
        name: "Engagement 6 mois",
        detail: "−300 DA / mois",
        base: 3500,
        unit: "/ mois",
        note: "Économie de 1 800 DA sur 6 mois",
      },
    ],
  },
];

export const ALL_ITEMS: Item[] = CATALOGUE.flatMap((g) => g.items);

export function formatDA(v: number) {
  return `${v.toLocaleString("fr-FR").replace(/\u202f|,/g, " ")} DA`;
}

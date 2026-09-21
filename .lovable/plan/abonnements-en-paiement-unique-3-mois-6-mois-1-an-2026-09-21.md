# Abonnements en paiement unique (3 mois, 6 mois, 1 an)

Les deux logiciels ne sont plus vendus au mois : chaque formule devient un pack payé en une seule fois.

## Ce qui change

Pour **Logiciel de Filtrage** et **Logiciel + Rapport PDF de Tracking**, les deux cartes actuelles (mensuel / engagement 6 mois) sont remplacées par trois cartes chacune :

- Pack 3 mois — paiement unique
- Pack 6 mois — paiement unique
- Pack 1 an — paiement unique

Chaque carte affiche le prix total du pack (plus de « / mois »), avec la mention « Paiement unique » et, en petit, le coût par mois correspondant.

Les prix de départ sont mis à des valeurs provisoires ; vous les fixez ensuite vous-même depuis le logo G, comme aujourd'hui. Les anciens prix barrés et les badges −% / +% continuent de fonctionner à chaque modification.

## Économie affichée

Le pack 3 mois sert de tarif de référence. Pour les packs 6 mois et 1 an, la carte calcule toute seule, à partir des prix que vous fixez :

- le coût par mois du pack,
- l'économie totale par rapport au même nombre de mois payé au tarif du pack 3 mois (ex. « Économie de 3 000 DA sur 12 mois »).

Si un pack n'est pas avantageux (prix trop haut), la mention d'économie disparaît simplement au lieu d'afficher un chiffre faux.

## Cartes Avify

Aucun changement : mêmes produits, même tri automatique du prix le plus bas au plus haut.

## Détails techniques

- `src/components/review/catalogue-data.ts` : remplacer les items des groupes `filtrage` et `tracking` par `filtrage-3 / filtrage-6 / filtrage-12` et `tracking-3 / tracking-6 / tracking-12`, avec `unit` supprimé et un champ de durée (mois) par item. Remplacer `ENGAGEMENTS` par une table `PACKS` associant chaque item à son pack de référence 3 mois et à sa durée.
- Réécrire `engagementNote` / `engagementDetail` en `packSavings(itemId, prices)` (économie totale vs tarif du pack 3 mois × durée) et `packMonthly(itemId, prices)` (coût par mois arrondi), tous deux calculés à partir des prix courants.
- `src/components/review/Catalogue.tsx` : la carte affiche `packMonthly` en sous-titre et `packSavings` en note ; le tri par prix reste réservé au groupe `cartes`.
- `src/components/review/PriceEditor.tsx` : la liste des champs vient de `ALL_ITEMS`, donc elle suit automatiquement les nouveaux items ; vérifier les libellés (plus de « / mois »).
- Base de données : aucune migration. La table `catalogue_prices` est indexée par `item_id` ; les anciennes lignes (`filtrage-mois`, `tracking-mois`, etc.) deviennent inutilisées et « Rétablir les tarifs » les efface.
- Vérification : build + typecheck, puis test navigateur (déverrouillage par code, modification d'un prix de pack, contrôle du calcul d'économie, puis remise à zéro).

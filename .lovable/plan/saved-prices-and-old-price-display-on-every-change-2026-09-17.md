# Saved prices and old-price display on every change

## What changes

1. **Old price shown for increases too**
  Today the crossed-out original price and the badge only appear when you lower a price. After this change, any modified price shows the previus mod one next to it, for all three cards and all four subscriptions:
  - Lower price: previus mod price crossed out + gold "−X%" badge (as today).
  - Higher price: previus mod price crpssed out + a "+X%" badge in a distinct navy/gold styling so the two cases read differently.
2. **Prices stay saved**
  Edited prices persist on the device, so closing the panel, refreshing, or reopening the page keeps your latest numbers. "Rétablir les tarifs" clears the saved values and returns everything to the original catalogue prices.
3. **Save feedback in the editor**
  The editor panel gets a clear confirmation that changes are kept, plus the existing reset button. Closing the panel never discards edits.

## Technical notes

- `src/routes/index.tsx`: move `prices` state into a small persistence hook backed by `localStorage` (key `avify-prices-v1`), read after hydration to avoid SSR mismatch, written on every change; reset clears the key.
- `src/components/review/Price.tsx`: replace `discounted` boolean with a `changed` comparison; compute signed percentage; render the struck-through base price whenever `current !== base`, and render the badge with `−X%` (gold on navy) or `+X%` (navy on gold) depending on direction.
- `src/components/review/PriceEditor.tsx`: the per-item note under the input shows both directions ("Remise" / "Hausse"), and a short line confirms prices are saved automatically.
- Sorting, subscription order, theme, and animations stay exactly as they are.most important when i change the price old one is the new og one okey not the fixed 3600 for example okey 
# Shared prices for everyone who scans the QR code

Today the prices you change are only stored on your own phone. This plan moves them to an online store so every client who scans your QR code sees exactly the prices you set, from any phone.

## How it will work

1. **You open the editor** — tap the big G logo, type your secret code once. The page remembers you on that phone.
2. **You change prices** — each change is saved online immediately, with a small "Enregistré" confirmation.
3. **Clients scan the QR code** — the page loads with your latest prices already applied, plus the crossed-out old price and the gold −%/+% badge, exactly like now.
4. **"Rétablir les tarifs"** puts every product back to its original catalogue price, for everyone.

Clients never see the editor: without the secret code, tapping the G logo just asks for a code and nothing can be changed.

## What stays the same

Design, animations, card sorting, subscription order, old-price display and badges — all unchanged. Only where the prices live changes.

## Technical notes

- Enable Lovable Cloud (database) for the project.
- Migration creates `public.catalogue_prices`: `item_id text primary key`, `price integer`, `previous_price integer`, `updated_at timestamptz`. Grants: `SELECT` to `anon` and `authenticated`, `ALL` to `service_role`. RLS on, with a single public read policy; no public write policy.
- Reads: a public server function using the server publishable client returns all rows; the `/` route loader calls it so prices are correct on first paint (no flash of default prices).
- Writes: server functions `setPrice`, `resetPrices`, `verifyCode`, each taking the secret code and comparing it timing-safely against a server-only `CATALOGUE_EDIT_CODE` secret before using the admin client to upsert. The code is never in client code.
- Unlock state stored in an encrypted session cookie (`SESSION_SECRET`, generated) so you only type the code once per device.
- `usePrices` localStorage hook is replaced by TanStack Query against these server functions; `previous` is snapshotted server-side on each write (old price = last saved value, not the fixed base).
- Two secrets needed: `CATALOGUE_EDIT_CODE` (you choose the code) and `SESSION_SECRET` (generated automatically).

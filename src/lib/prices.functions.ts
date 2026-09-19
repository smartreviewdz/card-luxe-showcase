import { createServerFn } from "@tanstack/react-start";
import { useSession } from "@tanstack/react-start/server";
import { createClient } from "@supabase/supabase-js";
import { createHash, timingSafeEqual } from "node:crypto";

export type PriceRow = { item_id: string; price: number; previous_price: number };
export type PriceState = { prices: Record<string, number>; previous: Record<string, number> };

type GateSession = { unlocked?: boolean };

function sessionConfig() {
  return {
    password: process.env["SESSION_SECRET"]!,
    name: "avify-editor",
    maxAge: 60 * 60 * 24 * 90,
    // SameSite=None so the editor session survives inside the Lovable preview
    // iframe (cross-site context); Secure is required alongside it.
    cookie: { httpOnly: true, secure: true, sameSite: "none" as const, path: "/" },
  };
}


function codeMatches(input: string, expected: string) {
  const a = createHash("sha256").update(input, "utf8").digest();
  const b = createHash("sha256").update(expected, "utf8").digest();
  return timingSafeEqual(a, b);
}

async function requireUnlocked() {
  const session = await useSession<GateSession>(sessionConfig());
  if (!session.data.unlocked) throw new Error("locked");
}

function publicClient() {
  const key = process.env["SUPABASE_PUBLISHABLE_KEY"]!;
  return createClient(process.env["SUPABASE_URL"]!, key, {
    auth: { persistSession: false, autoRefreshToken: false },
    global: {
      fetch: (input: RequestInfo | URL, init?: RequestInit) => {
        const h = new Headers(init?.headers);
        if (key.startsWith("sb_") && h.get("Authorization") === `Bearer ${key}`) h.delete("Authorization");
        h.set("apikey", key);
        return fetch(input, { ...init, headers: h });
      },
    },
  });
}

function toState(rows: PriceRow[]): PriceState {
  const prices: Record<string, number> = {};
  const previous: Record<string, number> = {};
  for (const row of rows) {
    prices[row.item_id] = row.price;
    previous[row.item_id] = row.previous_price;
  }
  return { prices, previous };
}

export const getPrices = createServerFn({ method: "GET" }).handler(async (): Promise<PriceState> => {
  const { data, error } = await publicClient()
    .from("catalogue_prices")
    .select("item_id, price, previous_price");
  if (error) return { prices: {}, previous: {} };
  return toState((data ?? []) as PriceRow[]);
});

export const getEditorStatus = createServerFn({ method: "GET" }).handler(async () => {
  const session = await useSession<GateSession>(sessionConfig());
  return { unlocked: session.data.unlocked === true };
});

export const unlockEditor = createServerFn({ method: "POST" })
  .inputValidator((data: { code: string }) => data)
  .handler(async ({ data }) => {
    const expected = process.env["CATALOGUE_EDIT_CODE"];
    if (!expected) return { ok: false as const };
    if (!codeMatches(data.code ?? "", expected)) return { ok: false as const };
    const session = await useSession<GateSession>(sessionConfig());
    await session.update({ unlocked: true });
    return { ok: true as const };
  });

export const lockEditor = createServerFn({ method: "POST" }).handler(async () => {
  const session = await useSession<GateSession>(sessionConfig());
  await session.clear();
  return { ok: true as const };
});

export const savePrice = createServerFn({ method: "POST" })
  .inputValidator((data: { itemId: string; price: number; base: number }) => data)
  .handler(async ({ data }): Promise<PriceState> => {
    await requireUnlocked();
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");

    const { data: existing } = await supabaseAdmin
      .from("catalogue_prices")
      .select("price, previous_price")
      .eq("item_id", data.itemId)
      .maybeSingle();

    const current = existing?.price ?? data.base;
    const price = Math.max(0, Math.round(data.price));
    // Old price = the last value that was in place before this edit.
    const previous = price === current ? (existing?.previous_price ?? data.base) : current;

    await supabaseAdmin
      .from("catalogue_prices")
      .upsert(
        { item_id: data.itemId, price, previous_price: previous, updated_at: new Date().toISOString() },
        { onConflict: "item_id" },
      );

    const { data: rows } = await supabaseAdmin
      .from("catalogue_prices")
      .select("item_id, price, previous_price");
    return toState((rows ?? []) as PriceRow[]);
  });

export const resetPrices = createServerFn({ method: "POST" }).handler(async (): Promise<PriceState> => {
  await requireUnlocked();
  const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
  await supabaseAdmin.from("catalogue_prices").delete().neq("item_id", "");
  return { prices: {}, previous: {} };
});

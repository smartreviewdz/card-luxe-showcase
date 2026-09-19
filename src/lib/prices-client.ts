import { createClient, type SupabaseClient } from "@supabase/supabase-js";

export type PriceState = { prices: Record<string, number>; previous: Record<string, number> };

const CODE_KEY = "avify-editor-code";

let client: SupabaseClient | null = null;

function db(): SupabaseClient {
  if (!client) {
    const url = import.meta.env["VITE_SUPABASE_URL"] as string;
    const key = import.meta.env["VITE_SUPABASE_PUBLISHABLE_KEY"] as string;
    client = createClient(url, key, {
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
  return client;
}

export function storedCode(): string | null {
  if (typeof window === "undefined") return null;
  return window.localStorage.getItem(CODE_KEY);
}

function rememberCode(code: string) {
  if (typeof window !== "undefined") window.localStorage.setItem(CODE_KEY, code);
}

export async function fetchPrices(): Promise<PriceState> {
  const { data, error } = await db().from("catalogue_prices").select("item_id, price, previous_price");
  const prices: Record<string, number> = {};
  const previous: Record<string, number> = {};
  if (error || !data) return { prices, previous };
  for (const row of data as { item_id: string; price: number; previous_price: number }[]) {
    prices[row.item_id] = row.price;
    previous[row.item_id] = row.previous_price;
  }
  return { prices, previous };
}

export async function verifyCode(code: string): Promise<boolean> {
  const { data, error } = await db().rpc("verify_edit_code", { p_code: code });
  if (error || data !== true) return false;
  rememberCode(code);
  return true;
}

export async function savePriceRemote(itemId: string, price: number, base: number): Promise<PriceState> {
  const code = storedCode();
  if (!code) throw new Error("locked");
  const { error } = await db().rpc("set_catalogue_price", {
    p_code: code,
    p_item_id: itemId,
    p_price: Math.max(0, Math.round(price)),
    p_base: base,
  });
  if (error) throw error;
  return fetchPrices();
}

export async function resetPricesRemote(): Promise<PriceState> {
  const code = storedCode();
  if (!code) throw new Error("locked");
  const { error } = await db().rpc("reset_catalogue_prices", { p_code: code });
  if (error) throw error;
  return { prices: {}, previous: {} };
}

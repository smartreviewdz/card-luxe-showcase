CREATE TABLE public.catalogue_prices (
  item_id text PRIMARY KEY,
  price integer NOT NULL,
  previous_price integer NOT NULL,
  updated_at timestamptz NOT NULL DEFAULT now()
);

GRANT SELECT ON public.catalogue_prices TO anon;
GRANT SELECT ON public.catalogue_prices TO authenticated;
GRANT ALL ON public.catalogue_prices TO service_role;

ALTER TABLE public.catalogue_prices ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Catalogue prices are publicly readable"
ON public.catalogue_prices
FOR SELECT
USING (true);
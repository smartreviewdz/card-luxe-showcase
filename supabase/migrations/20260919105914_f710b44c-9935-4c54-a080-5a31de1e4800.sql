CREATE TABLE IF NOT EXISTS public.app_config (
  key text PRIMARY KEY,
  value text NOT NULL,
  updated_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE public.app_config ENABLE ROW LEVEL SECURITY;
GRANT ALL ON public.app_config TO service_role;

INSERT INTO public.app_config (key, value)
VALUES ('edit_code_sha256', '49fdfc988e29f9ff8c710f68a3309da08a789dc79e1914f7ad62829cc76a7302')
ON CONFLICT (key) DO UPDATE SET value = EXCLUDED.value, updated_at = now();

CREATE OR REPLACE FUNCTION public.verify_edit_code(p_code text)
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public, extensions
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.app_config
    WHERE key = 'edit_code_sha256'
      AND value = encode(digest(coalesce(p_code, ''), 'sha256'), 'hex')
  );
$$;

CREATE OR REPLACE FUNCTION public.set_catalogue_price(p_code text, p_item_id text, p_price integer, p_base integer)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public, extensions
AS $$
DECLARE
  v_current integer;
  v_previous integer;
  v_price integer := greatest(0, p_price);
BEGIN
  IF NOT public.verify_edit_code(p_code) THEN
    RAISE EXCEPTION 'invalid code';
  END IF;

  SELECT price, previous_price INTO v_current, v_previous
  FROM public.catalogue_prices WHERE item_id = p_item_id;

  IF v_current IS NULL THEN
    v_current := p_base;
    v_previous := p_base;
  END IF;

  IF v_price = v_current THEN
    v_previous := coalesce(v_previous, p_base);
  ELSE
    v_previous := v_current;
  END IF;

  INSERT INTO public.catalogue_prices (item_id, price, previous_price, updated_at)
  VALUES (p_item_id, v_price, v_previous, now())
  ON CONFLICT (item_id) DO UPDATE
    SET price = EXCLUDED.price, previous_price = EXCLUDED.previous_price, updated_at = now();
END;
$$;

CREATE OR REPLACE FUNCTION public.reset_catalogue_prices(p_code text)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public, extensions
AS $$
BEGIN
  IF NOT public.verify_edit_code(p_code) THEN
    RAISE EXCEPTION 'invalid code';
  END IF;
  DELETE FROM public.catalogue_prices WHERE true;
END;
$$;

REVOKE ALL ON FUNCTION public.verify_edit_code(text) FROM PUBLIC;
REVOKE ALL ON FUNCTION public.set_catalogue_price(text, text, integer, integer) FROM PUBLIC;
REVOKE ALL ON FUNCTION public.reset_catalogue_prices(text) FROM PUBLIC;

GRANT EXECUTE ON FUNCTION public.verify_edit_code(text) TO anon, authenticated, service_role;
GRANT EXECUTE ON FUNCTION public.set_catalogue_price(text, text, integer, integer) TO anon, authenticated, service_role;
GRANT EXECUTE ON FUNCTION public.reset_catalogue_prices(text) TO anon, authenticated, service_role;
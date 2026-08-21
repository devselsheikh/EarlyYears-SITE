CREATE SCHEMA IF NOT EXISTS extensions;
CREATE EXTENSION IF NOT EXISTS pgcrypto WITH SCHEMA extensions;

CREATE TABLE IF NOT EXISTS public.parent_portal_access (
  singleton BOOLEAN PRIMARY KEY DEFAULT TRUE CHECK (singleton),
  pin_hash TEXT NOT NULL,
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_by UUID REFERENCES public.profiles(id) ON DELETE SET NULL
);

ALTER TABLE public.parent_portal_access ENABLE ROW LEVEL SECURITY;

-- The PIN hash is never readable from browser clients. Owners update it through
-- the security-definer function; public clients receive only a boolean result.
REVOKE ALL ON public.parent_portal_access FROM anon, authenticated;

CREATE OR REPLACE FUNCTION public.verify_parent_portal_pin(candidate_pin TEXT)
RETURNS BOOLEAN
LANGUAGE sql
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT COALESCE(
    (SELECT pin_hash = extensions.crypt(candidate_pin, pin_hash) FROM public.parent_portal_access WHERE singleton = TRUE),
    FALSE
  );
$$;

CREATE OR REPLACE FUNCTION public.set_parent_portal_pin(new_pin TEXT)
RETURNS VOID
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  IF public.current_app_role() <> 'owner' THEN
    RAISE EXCEPTION 'Owner access required';
  END IF;
  IF char_length(new_pin) < 6 THEN
    RAISE EXCEPTION 'Portal PIN must contain at least 6 characters';
  END IF;
  INSERT INTO public.parent_portal_access (singleton, pin_hash, updated_at, updated_by)
  VALUES (TRUE, extensions.crypt(new_pin, extensions.gen_salt('bf')), now(), auth.uid())
  ON CONFLICT (singleton) DO UPDATE SET
    pin_hash = EXCLUDED.pin_hash,
    updated_at = now(),
    updated_by = auth.uid();
END;
$$;

REVOKE ALL ON FUNCTION public.verify_parent_portal_pin(TEXT) FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.verify_parent_portal_pin(TEXT) TO anon, authenticated;
REVOKE ALL ON FUNCTION public.set_parent_portal_pin(TEXT) FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.set_parent_portal_pin(TEXT) TO authenticated;

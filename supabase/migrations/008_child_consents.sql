CREATE TABLE IF NOT EXISTS public.child_consents (
  child_id UUID NOT NULL REFERENCES public.children(id) ON DELETE CASCADE,
  guardian_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  consent_key TEXT NOT NULL CHECK (consent_key IN ('photos', 'localTrips', 'emergencyCare')),
  granted BOOLEAN NOT NULL DEFAULT FALSE,
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  PRIMARY KEY (child_id, guardian_id, consent_key)
);

ALTER TABLE public.child_consents ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "role_scoped_consents_read" ON public.child_consents;
DROP POLICY IF EXISTS "guardians_manage_own_consents" ON public.child_consents;

CREATE POLICY "role_scoped_consents_read" ON public.child_consents FOR SELECT TO authenticated
  USING (public.can_access_child(child_id));
CREATE POLICY "guardians_manage_own_consents" ON public.child_consents FOR ALL TO authenticated
  USING (guardian_id = auth.uid() AND public.can_access_child(child_id))
  WITH CHECK (guardian_id = auth.uid() AND public.can_access_child(child_id));

CREATE INDEX IF NOT EXISTS child_consents_guardian_idx ON public.child_consents (guardian_id, child_id);


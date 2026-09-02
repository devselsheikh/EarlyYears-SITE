-- Tracks server-issued workspace invitations without exposing auth administration
-- or privileged credentials to the browser.

CREATE TABLE IF NOT EXISTS public.workspace_invitations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email TEXT NOT NULL,
  display_name TEXT NOT NULL,
  invited_role public.app_role NOT NULL,
  invited_by UUID NOT NULL REFERENCES public.profiles(id) ON DELETE RESTRICT,
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'sent', 'failed', 'accepted')),
  provider_user_id UUID,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  CHECK (char_length(email) BETWEEN 3 AND 320),
  CHECK (char_length(display_name) BETWEEN 2 AND 100),
  CHECK (invited_role IN ('admin', 'teacher', 'parent'))
);

CREATE INDEX IF NOT EXISTS workspace_invitations_actor_created_idx
  ON public.workspace_invitations (invited_by, created_at DESC);
CREATE INDEX IF NOT EXISTS workspace_invitations_email_idx
  ON public.workspace_invitations (lower(email));

ALTER TABLE public.workspace_invitations ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "operations_read_workspace_invitations" ON public.workspace_invitations;
CREATE POLICY "operations_read_workspace_invitations"
  ON public.workspace_invitations FOR SELECT TO authenticated
  USING (public.current_app_role() IN ('owner', 'admin'));

-- Browser clients may read invitation history but never create or alter it.
REVOKE INSERT, UPDATE, DELETE ON public.workspace_invitations FROM authenticated, anon;

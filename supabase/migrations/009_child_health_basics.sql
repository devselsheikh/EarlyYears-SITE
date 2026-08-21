-- Minimal health information needed by daily attendance and care workflows.
-- Access remains governed by the existing child-scoped RLS policies.

ALTER TABLE public.children
  ADD COLUMN IF NOT EXISTS allergies TEXT[] NOT NULL DEFAULT ARRAY[]::TEXT[];

COMMENT ON COLUMN public.children.allergies IS
  'Concise allergy labels visible only to staff assigned to the child, operations roles, and linked guardians.';

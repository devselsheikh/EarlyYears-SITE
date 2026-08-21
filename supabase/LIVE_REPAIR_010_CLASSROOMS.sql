-- Early Years live Supabase follow-up: classrooms and staff assignments
-- Safe to rerun.

CREATE TABLE IF NOT EXISTS public.classrooms (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL UNIQUE,
  age_group TEXT NOT NULL DEFAULT '',
  capacity INTEGER CHECK (capacity IS NULL OR capacity > 0),
  active BOOLEAN NOT NULL DEFAULT TRUE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.staff_classroom_assignments (
  classroom_id UUID NOT NULL REFERENCES public.classrooms(id) ON DELETE CASCADE,
  staff_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  assignment_role TEXT NOT NULL DEFAULT 'teacher',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  PRIMARY KEY (classroom_id, staff_id)
);

ALTER TABLE public.classrooms ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.staff_classroom_assignments ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "authenticated_read_classrooms" ON public.classrooms;
DROP POLICY IF EXISTS "operations_manage_classrooms" ON public.classrooms;
DROP POLICY IF EXISTS "operations_read_staff_assignments" ON public.staff_classroom_assignments;
DROP POLICY IF EXISTS "staff_read_own_assignments" ON public.staff_classroom_assignments;
DROP POLICY IF EXISTS "operations_manage_staff_assignments" ON public.staff_classroom_assignments;

CREATE POLICY "authenticated_read_classrooms" ON public.classrooms FOR SELECT TO authenticated
  USING (active = TRUE OR public.current_app_role() IN ('owner', 'admin'));
CREATE POLICY "operations_manage_classrooms" ON public.classrooms FOR ALL TO authenticated
  USING (public.current_app_role() IN ('owner', 'admin'))
  WITH CHECK (public.current_app_role() IN ('owner', 'admin'));
CREATE POLICY "operations_read_staff_assignments" ON public.staff_classroom_assignments FOR SELECT TO authenticated
  USING (public.current_app_role() IN ('owner', 'admin'));
CREATE POLICY "staff_read_own_assignments" ON public.staff_classroom_assignments FOR SELECT TO authenticated
  USING (staff_id = auth.uid());
CREATE POLICY "operations_manage_staff_assignments" ON public.staff_classroom_assignments FOR ALL TO authenticated
  USING (public.current_app_role() IN ('owner', 'admin'))
  WITH CHECK (
    public.current_app_role() IN ('owner', 'admin')
    AND EXISTS (
      SELECT 1 FROM public.profiles profile
      WHERE profile.id = staff_id AND profile.role IN ('owner', 'admin', 'teacher') AND profile.active = TRUE
    )
  );

CREATE INDEX IF NOT EXISTS staff_assignments_staff_idx
  ON public.staff_classroom_assignments (staff_id);

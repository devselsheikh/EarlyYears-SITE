-- Early Years live Supabase follow-up: secure class membership and daily care.
-- Generated from migrations/011_daily_care_foundation.sql. Safe to rerun.

DO $$ BEGIN
  CREATE TYPE public.meal_consumption AS ENUM ('not_offered', 'none', 'some', 'half', 'most', 'all');
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;

CREATE TABLE IF NOT EXISTS public.classroom_memberships (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  classroom_id UUID NOT NULL REFERENCES public.classrooms(id) ON DELETE RESTRICT,
  child_id UUID NOT NULL REFERENCES public.children(id) ON DELETE CASCADE,
  starts_on DATE NOT NULL DEFAULT CURRENT_DATE,
  ends_on DATE,
  created_by UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  CHECK (ends_on IS NULL OR ends_on >= starts_on),
  UNIQUE (classroom_id, child_id, starts_on)
);

CREATE UNIQUE INDEX IF NOT EXISTS one_current_classroom_per_child_idx
  ON public.classroom_memberships (child_id) WHERE ends_on IS NULL;
CREATE INDEX IF NOT EXISTS classroom_memberships_class_dates_idx
  ON public.classroom_memberships (classroom_id, starts_on, ends_on);

CREATE OR REPLACE FUNCTION public.can_access_classroom(target_classroom UUID)
RETURNS BOOLEAN LANGUAGE sql STABLE SECURITY DEFINER SET search_path = public
AS $$
  SELECT public.current_app_role() IN ('owner', 'admin')
    OR EXISTS (SELECT 1 FROM public.staff_classroom_assignments assignment WHERE assignment.classroom_id = target_classroom AND assignment.staff_id = auth.uid())
    OR EXISTS (
      SELECT 1 FROM public.classroom_memberships membership
      JOIN public.child_guardians guardian ON guardian.child_id = membership.child_id
      WHERE membership.classroom_id = target_classroom AND guardian.guardian_id = auth.uid()
        AND membership.starts_on <= CURRENT_DATE AND (membership.ends_on IS NULL OR membership.ends_on >= CURRENT_DATE)
    );
$$;

CREATE OR REPLACE FUNCTION public.can_access_child(target_child UUID)
RETURNS BOOLEAN LANGUAGE sql STABLE SECURITY DEFINER SET search_path = public
AS $$
  SELECT public.current_app_role() IN ('owner', 'admin')
    OR EXISTS (SELECT 1 FROM public.children child WHERE child.id = target_child AND child.key_person_id = auth.uid())
    OR EXISTS (SELECT 1 FROM public.child_guardians guardian WHERE guardian.child_id = target_child AND guardian.guardian_id = auth.uid())
    OR EXISTS (
      SELECT 1 FROM public.classroom_memberships membership
      JOIN public.staff_classroom_assignments assignment ON assignment.classroom_id = membership.classroom_id
      WHERE membership.child_id = target_child AND assignment.staff_id = auth.uid()
        AND membership.starts_on <= CURRENT_DATE AND (membership.ends_on IS NULL OR membership.ends_on >= CURRENT_DATE)
    );
$$;

CREATE TABLE IF NOT EXISTS public.child_daily_reports (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  child_id UUID NOT NULL REFERENCES public.children(id) ON DELETE CASCADE,
  classroom_id UUID NOT NULL REFERENCES public.classrooms(id) ON DELETE RESTRICT,
  report_date DATE NOT NULL DEFAULT CURRENT_DATE,
  breakfast public.meal_consumption NOT NULL DEFAULT 'not_offered',
  lunch public.meal_consumption NOT NULL DEFAULT 'not_offered',
  snack public.meal_consumption NOT NULL DEFAULT 'not_offered',
  meal_notes TEXT NOT NULL DEFAULT '' CHECK (char_length(meal_notes) <= 2000),
  water_refills SMALLINT NOT NULL DEFAULT 0 CHECK (water_refills BETWEEN 0 AND 20),
  wet_changes SMALLINT NOT NULL DEFAULT 0 CHECK (wet_changes BETWEEN 0 AND 20),
  soiled_changes SMALLINT NOT NULL DEFAULT 0 CHECK (soiled_changes BETWEEN 0 AND 20),
  diaper_request BOOLEAN NOT NULL DEFAULT FALSE,
  care_notes TEXT NOT NULL DEFAULT '' CHECK (char_length(care_notes) <= 4000),
  updated_by UUID NOT NULL REFERENCES public.profiles(id) ON DELETE RESTRICT,
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  published_by UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
  published_at TIMESTAMPTZ,
  UNIQUE (child_id, report_date),
  CHECK ((published_at IS NULL AND published_by IS NULL) OR (published_at IS NOT NULL AND published_by IS NOT NULL))
);

CREATE TABLE IF NOT EXISTS public.child_daily_report_revisions (
  id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  report_id UUID NOT NULL,
  child_id UUID NOT NULL,
  report_date DATE NOT NULL,
  previous_data JSONB NOT NULL,
  changed_by UUID,
  changed_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE OR REPLACE FUNCTION public.audit_child_daily_report_change()
RETURNS trigger LANGUAGE plpgsql SECURITY DEFINER SET search_path = public
AS $$
BEGIN
  INSERT INTO public.child_daily_report_revisions (report_id, child_id, report_date, previous_data, changed_by)
  VALUES (OLD.id, OLD.child_id, OLD.report_date, to_jsonb(OLD), auth.uid());
  NEW.updated_at := now();
  RETURN NEW;
END;
$$;

CREATE OR REPLACE FUNCTION public.stamp_daily_report_publication()
RETURNS trigger LANGUAGE plpgsql SECURITY DEFINER SET search_path = public
AS $$
BEGIN
  IF TG_OP = 'UPDATE' AND OLD.published_at IS NOT NULL AND NEW.published_at IS NULL
    AND public.current_app_role() NOT IN ('owner', 'admin') THEN
    RAISE EXCEPTION 'Only an Owner or Admin may withdraw a published daily report';
  END IF;
  IF NEW.published_at IS NULL THEN
    NEW.published_by := NULL;
  ELSIF TG_OP = 'INSERT' OR OLD.published_at IS DISTINCT FROM NEW.published_at THEN
    NEW.published_by := auth.uid();
  END IF;
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS audit_child_daily_report_update ON public.child_daily_reports;
DROP TRIGGER IF EXISTS stamp_daily_report_publication ON public.child_daily_reports;
CREATE TRIGGER stamp_daily_report_publication BEFORE INSERT OR UPDATE ON public.child_daily_reports
FOR EACH ROW EXECUTE FUNCTION public.stamp_daily_report_publication();
CREATE TRIGGER audit_child_daily_report_update BEFORE UPDATE ON public.child_daily_reports
FOR EACH ROW EXECUTE FUNCTION public.audit_child_daily_report_change();

ALTER TABLE public.classroom_memberships ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.child_daily_reports ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.child_daily_report_revisions ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "role_scoped_classroom_memberships_read" ON public.classroom_memberships;
DROP POLICY IF EXISTS "operations_manage_classroom_memberships" ON public.classroom_memberships;
DROP POLICY IF EXISTS "role_scoped_daily_reports_read" ON public.child_daily_reports;
DROP POLICY IF EXISTS "staff_create_daily_reports" ON public.child_daily_reports;
DROP POLICY IF EXISTS "staff_update_daily_reports" ON public.child_daily_reports;
DROP POLICY IF EXISTS "owners_read_daily_report_revisions" ON public.child_daily_report_revisions;

CREATE POLICY "role_scoped_classroom_memberships_read" ON public.classroom_memberships FOR SELECT TO authenticated USING (public.can_access_child(child_id));
CREATE POLICY "operations_manage_classroom_memberships" ON public.classroom_memberships FOR ALL TO authenticated
  USING (public.current_app_role() IN ('owner', 'admin')) WITH CHECK (public.current_app_role() IN ('owner', 'admin'));
CREATE POLICY "role_scoped_daily_reports_read" ON public.child_daily_reports FOR SELECT TO authenticated
  USING (
    (public.current_app_role() IN ('owner', 'admin', 'teacher') AND public.can_access_child(child_id))
    OR (public.current_app_role() = 'parent' AND published_at IS NOT NULL AND EXISTS (
      SELECT 1 FROM public.child_guardians guardian WHERE guardian.child_id = child_daily_reports.child_id AND guardian.guardian_id = auth.uid()
    ))
  );
CREATE POLICY "staff_create_daily_reports" ON public.child_daily_reports FOR INSERT TO authenticated
  WITH CHECK (public.current_app_role() IN ('owner', 'admin', 'teacher') AND updated_by = auth.uid() AND (published_at IS NULL OR published_by = auth.uid()) AND public.can_access_child(child_id) AND public.can_access_classroom(classroom_id));
CREATE POLICY "staff_update_daily_reports" ON public.child_daily_reports FOR UPDATE TO authenticated
  USING (public.current_app_role() IN ('owner', 'admin', 'teacher') AND public.can_access_child(child_id))
  WITH CHECK (public.current_app_role() IN ('owner', 'admin', 'teacher') AND updated_by = auth.uid() AND (published_at IS NULL OR published_by = auth.uid()) AND public.can_access_child(child_id) AND public.can_access_classroom(classroom_id));
CREATE POLICY "owners_read_daily_report_revisions" ON public.child_daily_report_revisions FOR SELECT TO authenticated USING (public.current_app_role() = 'owner');

REVOKE DELETE ON public.child_daily_reports FROM authenticated;
REVOKE INSERT, UPDATE, DELETE ON public.child_daily_report_revisions FROM anon, authenticated;
CREATE INDEX IF NOT EXISTS child_daily_reports_date_class_idx ON public.child_daily_reports (report_date DESC, classroom_id);
CREATE INDEX IF NOT EXISTS child_daily_report_revisions_report_idx ON public.child_daily_report_revisions (report_id, changed_at DESC);

CREATE TABLE IF NOT EXISTS public.children (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  display_name TEXT NOT NULL,
  date_of_birth DATE,
  room_name TEXT NOT NULL DEFAULT '',
  key_person_id UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
  active BOOLEAN NOT NULL DEFAULT TRUE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.child_guardians (
  child_id UUID NOT NULL REFERENCES public.children(id) ON DELETE CASCADE,
  guardian_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  relationship TEXT NOT NULL DEFAULT 'guardian',
  PRIMARY KEY (child_id, guardian_id)
);

CREATE TABLE IF NOT EXISTS public.attendance_records (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  child_id UUID NOT NULL REFERENCES public.children(id) ON DELETE CASCADE,
  attendance_date DATE NOT NULL DEFAULT CURRENT_DATE,
  state TEXT NOT NULL CHECK (state IN ('present', 'absent', 'pending')),
  arrival_at TIMESTAMPTZ,
  recorded_by UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE (child_id, attendance_date)
);

CREATE TABLE IF NOT EXISTS public.family_updates (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  child_id UUID NOT NULL REFERENCES public.children(id) ON DELETE CASCADE,
  author_id UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
  kind TEXT NOT NULL CHECK (kind IN ('learning', 'care', 'notice')),
  body TEXT NOT NULL CHECK (char_length(body) BETWEEN 1 AND 4000),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.family_messages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  child_id UUID NOT NULL REFERENCES public.children(id) ON DELETE CASCADE,
  sender_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  body TEXT NOT NULL CHECK (char_length(body) BETWEEN 1 AND 4000),
  read_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE public.children ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.child_guardians ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.attendance_records ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.family_updates ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.family_messages ENABLE ROW LEVEL SECURITY;

CREATE OR REPLACE FUNCTION public.can_access_child(target_child UUID)
RETURNS BOOLEAN LANGUAGE sql STABLE SECURITY DEFINER SET search_path = public
AS $$
  SELECT public.current_app_role() IN ('owner', 'admin')
    OR EXISTS (SELECT 1 FROM public.children c WHERE c.id = target_child AND c.key_person_id = auth.uid())
    OR EXISTS (SELECT 1 FROM public.child_guardians g WHERE g.child_id = target_child AND g.guardian_id = auth.uid());
$$;

DROP POLICY IF EXISTS "role_scoped_children_read" ON public.children;
DROP POLICY IF EXISTS "operations_manage_children" ON public.children;
DROP POLICY IF EXISTS "role_scoped_guardians_read" ON public.child_guardians;
DROP POLICY IF EXISTS "operations_manage_guardians" ON public.child_guardians;
DROP POLICY IF EXISTS "role_scoped_attendance_read" ON public.attendance_records;
DROP POLICY IF EXISTS "staff_manage_attendance" ON public.attendance_records;
DROP POLICY IF EXISTS "role_scoped_updates_read" ON public.family_updates;
DROP POLICY IF EXISTS "staff_publish_updates" ON public.family_updates;
DROP POLICY IF EXISTS "role_scoped_messages" ON public.family_messages;
DROP POLICY IF EXISTS "role_scoped_message_insert" ON public.family_messages;

CREATE POLICY "role_scoped_children_read" ON public.children FOR SELECT TO authenticated
  USING (public.can_access_child(id));
CREATE POLICY "operations_manage_children" ON public.children FOR ALL TO authenticated
  USING (public.current_app_role() IN ('owner', 'admin')) WITH CHECK (public.current_app_role() IN ('owner', 'admin'));
CREATE POLICY "role_scoped_guardians_read" ON public.child_guardians FOR SELECT TO authenticated
  USING (public.can_access_child(child_id));
CREATE POLICY "operations_manage_guardians" ON public.child_guardians FOR ALL TO authenticated
  USING (public.current_app_role() IN ('owner', 'admin')) WITH CHECK (public.current_app_role() IN ('owner', 'admin'));
CREATE POLICY "role_scoped_attendance_read" ON public.attendance_records FOR SELECT TO authenticated
  USING (public.can_access_child(child_id));
CREATE POLICY "staff_manage_attendance" ON public.attendance_records FOR ALL TO authenticated
  USING (public.current_app_role() IN ('owner', 'admin', 'teacher') AND public.can_access_child(child_id))
  WITH CHECK (public.current_app_role() IN ('owner', 'admin', 'teacher') AND public.can_access_child(child_id));
CREATE POLICY "role_scoped_updates_read" ON public.family_updates FOR SELECT TO authenticated
  USING (public.can_access_child(child_id));
CREATE POLICY "staff_publish_updates" ON public.family_updates FOR INSERT TO authenticated
  WITH CHECK (public.current_app_role() IN ('owner', 'admin', 'teacher') AND public.can_access_child(child_id));
CREATE POLICY "role_scoped_messages" ON public.family_messages FOR SELECT TO authenticated
  USING (public.can_access_child(child_id));
CREATE POLICY "role_scoped_message_insert" ON public.family_messages FOR INSERT TO authenticated
  WITH CHECK (sender_id = auth.uid() AND public.can_access_child(child_id));

CREATE INDEX IF NOT EXISTS attendance_child_date_idx ON public.attendance_records (child_id, attendance_date DESC);
CREATE INDEX IF NOT EXISTS family_updates_child_created_idx ON public.family_updates (child_id, created_at DESC);
CREATE INDEX IF NOT EXISTS family_messages_child_created_idx ON public.family_messages (child_id, created_at DESC);

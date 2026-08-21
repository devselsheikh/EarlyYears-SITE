-- Atomic, audited operations for the Owner/Admin class setup experience.
-- These functions deliberately avoid dynamic SQL and never create auth users in-browser.

CREATE OR REPLACE FUNCTION public.require_operations_role()
RETURNS VOID
LANGUAGE plpgsql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  IF auth.uid() IS NULL OR public.current_app_role() NOT IN ('owner', 'admin') THEN
    RAISE EXCEPTION 'Owner or Admin access is required' USING ERRCODE = '42501';
  END IF;
END;
$$;

CREATE OR REPLACE FUNCTION public.create_classroom(
  classroom_name TEXT,
  classroom_age_group TEXT DEFAULT '',
  classroom_capacity INTEGER DEFAULT NULL
)
RETURNS UUID
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  clean_name TEXT := btrim(classroom_name);
  clean_age_group TEXT := btrim(COALESCE(classroom_age_group, ''));
  created_id UUID;
BEGIN
  PERFORM public.require_operations_role();
  IF char_length(clean_name) NOT BETWEEN 2 AND 80 THEN
    RAISE EXCEPTION 'Classroom name must be between 2 and 80 characters' USING ERRCODE = '22023';
  END IF;
  IF char_length(clean_age_group) > 80 THEN
    RAISE EXCEPTION 'Age group must be 80 characters or fewer' USING ERRCODE = '22023';
  END IF;
  IF classroom_capacity IS NOT NULL AND classroom_capacity NOT BETWEEN 1 AND 100 THEN
    RAISE EXCEPTION 'Capacity must be between 1 and 100' USING ERRCODE = '22023';
  END IF;

  INSERT INTO public.classrooms (name, age_group, capacity)
  VALUES (clean_name, clean_age_group, classroom_capacity)
  RETURNING id INTO created_id;

  INSERT INTO public.audit_log (actor_id, action, resource_type, resource_id, after_state)
  VALUES (auth.uid(), 'classroom.create', 'classrooms', created_id::TEXT,
    jsonb_build_object('name', clean_name, 'age_group', clean_age_group, 'capacity', classroom_capacity));
  RETURN created_id;
END;
$$;

CREATE OR REPLACE FUNCTION public.set_classroom_staff(
  target_classroom UUID,
  target_staff UUID,
  assigned BOOLEAN
)
RETURNS VOID
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  staff_record public.profiles%ROWTYPE;
BEGIN
  PERFORM public.require_operations_role();
  IF NOT EXISTS (SELECT 1 FROM public.classrooms WHERE id = target_classroom AND active) THEN
    RAISE EXCEPTION 'Active classroom not found' USING ERRCODE = '22023';
  END IF;
  SELECT * INTO staff_record FROM public.profiles WHERE id = target_staff;
  IF NOT FOUND OR NOT staff_record.active OR staff_record.role NOT IN ('owner', 'admin', 'teacher') THEN
    RAISE EXCEPTION 'An active staff account is required' USING ERRCODE = '22023';
  END IF;

  IF assigned THEN
    INSERT INTO public.staff_classroom_assignments (classroom_id, staff_id, assignment_role)
    VALUES (target_classroom, target_staff, 'teacher')
    ON CONFLICT (classroom_id, staff_id) DO NOTHING;
  ELSE
    DELETE FROM public.staff_classroom_assignments
    WHERE classroom_id = target_classroom AND staff_id = target_staff;
  END IF;

  INSERT INTO public.audit_log (actor_id, action, resource_type, resource_id, after_state)
  VALUES (auth.uid(), CASE WHEN assigned THEN 'classroom.staff.assign' ELSE 'classroom.staff.remove' END,
    'staff_classroom_assignments', target_classroom::TEXT,
    jsonb_build_object('staff_id', target_staff));
END;
$$;

CREATE OR REPLACE FUNCTION public.enrol_child_in_classroom(
  target_child UUID,
  target_classroom UUID,
  effective_date DATE DEFAULT CURRENT_DATE
)
RETURNS UUID
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  membership_id UUID;
  previous_classroom UUID;
  room_capacity INTEGER;
  room_count INTEGER;
BEGIN
  PERFORM public.require_operations_role();
  IF effective_date IS NULL OR effective_date > CURRENT_DATE + 31 THEN
    RAISE EXCEPTION 'Choose a valid enrolment date' USING ERRCODE = '22023';
  END IF;
  IF NOT EXISTS (SELECT 1 FROM public.children WHERE id = target_child AND active) THEN
    RAISE EXCEPTION 'Active child not found' USING ERRCODE = '22023';
  END IF;
  IF NOT EXISTS (SELECT 1 FROM public.classrooms WHERE id = target_classroom AND active) THEN
    RAISE EXCEPTION 'Active classroom not found' USING ERRCODE = '22023';
  END IF;

  SELECT capacity INTO room_capacity FROM public.classrooms
  WHERE id = target_classroom FOR UPDATE;
  SELECT count(*) INTO room_count FROM public.classroom_memberships
  WHERE classroom_id = target_classroom AND ends_on IS NULL AND child_id <> target_child;
  IF room_capacity IS NOT NULL AND room_count >= room_capacity THEN
    RAISE EXCEPTION 'This classroom is at capacity' USING ERRCODE = '23514';
  END IF;

  SELECT classroom_id INTO previous_classroom
  FROM public.classroom_memberships
  WHERE child_id = target_child AND ends_on IS NULL
  FOR UPDATE;

  IF previous_classroom = target_classroom THEN
    SELECT id INTO membership_id FROM public.classroom_memberships
    WHERE child_id = target_child AND ends_on IS NULL;
    RETURN membership_id;
  END IF;

  UPDATE public.classroom_memberships
  SET ends_on = GREATEST(starts_on, effective_date - 1)
  WHERE child_id = target_child AND ends_on IS NULL;

  INSERT INTO public.classroom_memberships (classroom_id, child_id, starts_on, created_by)
  VALUES (target_classroom, target_child, effective_date, auth.uid())
  RETURNING id INTO membership_id;

  UPDATE public.children
  SET room_name = (SELECT name FROM public.classrooms WHERE id = target_classroom), updated_at = now()
  WHERE id = target_child;

  INSERT INTO public.audit_log (actor_id, action, resource_type, resource_id, before_state, after_state)
  VALUES (auth.uid(), 'classroom.child.enrol', 'classroom_memberships', membership_id::TEXT,
    jsonb_build_object('classroom_id', previous_classroom),
    jsonb_build_object('classroom_id', target_classroom, 'child_id', target_child, 'starts_on', effective_date));
  RETURN membership_id;
END;
$$;

CREATE OR REPLACE FUNCTION public.link_child_guardian(
  target_child UUID,
  target_guardian UUID,
  guardian_relationship TEXT DEFAULT 'guardian'
)
RETURNS VOID
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  clean_relationship TEXT := btrim(COALESCE(guardian_relationship, 'guardian'));
BEGIN
  PERFORM public.require_operations_role();
  IF NOT EXISTS (SELECT 1 FROM public.children WHERE id = target_child AND active) THEN
    RAISE EXCEPTION 'Active child not found' USING ERRCODE = '22023';
  END IF;
  IF NOT EXISTS (SELECT 1 FROM public.profiles WHERE id = target_guardian AND role = 'parent' AND active) THEN
    RAISE EXCEPTION 'An active Parent account is required' USING ERRCODE = '22023';
  END IF;
  IF char_length(clean_relationship) NOT BETWEEN 2 AND 40 THEN
    RAISE EXCEPTION 'Relationship must be between 2 and 40 characters' USING ERRCODE = '22023';
  END IF;

  INSERT INTO public.child_guardians (child_id, guardian_id, relationship)
  VALUES (target_child, target_guardian, clean_relationship)
  ON CONFLICT (child_id, guardian_id) DO UPDATE SET relationship = EXCLUDED.relationship;

  INSERT INTO public.audit_log (actor_id, action, resource_type, resource_id, after_state)
  VALUES (auth.uid(), 'child.guardian.link', 'child_guardians', target_child::TEXT,
    jsonb_build_object('guardian_id', target_guardian, 'relationship', clean_relationship));
END;
$$;

REVOKE ALL ON FUNCTION public.require_operations_role() FROM PUBLIC;
REVOKE ALL ON FUNCTION public.create_classroom(TEXT, TEXT, INTEGER) FROM PUBLIC;
REVOKE ALL ON FUNCTION public.set_classroom_staff(UUID, UUID, BOOLEAN) FROM PUBLIC;
REVOKE ALL ON FUNCTION public.enrol_child_in_classroom(UUID, UUID, DATE) FROM PUBLIC;
REVOKE ALL ON FUNCTION public.link_child_guardian(UUID, UUID, TEXT) FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.create_classroom(TEXT, TEXT, INTEGER) TO authenticated;
GRANT EXECUTE ON FUNCTION public.set_classroom_staff(UUID, UUID, BOOLEAN) TO authenticated;
GRANT EXECUTE ON FUNCTION public.enrol_child_in_classroom(UUID, UUID, DATE) TO authenticated;
GRANT EXECUTE ON FUNCTION public.link_child_guardian(UUID, UUID, TEXT) TO authenticated;

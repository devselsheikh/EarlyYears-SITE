-- A single, audited Owner/Admin operation for creating a child and optionally
-- placing them into a classroom. No dynamic SQL or browser-side privilege.

CREATE OR REPLACE FUNCTION public.create_child_record(
  child_name TEXT,
  child_date_of_birth DATE DEFAULT NULL,
  target_classroom UUID DEFAULT NULL
)
RETURNS UUID
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  clean_name TEXT := btrim(child_name);
  child_id UUID;
  room_name_value TEXT := '';
BEGIN
  PERFORM public.require_operations_role();
  IF char_length(clean_name) NOT BETWEEN 2 AND 100 THEN
    RAISE EXCEPTION 'Child name must be between 2 and 100 characters' USING ERRCODE = '22023';
  END IF;
  IF child_date_of_birth IS NOT NULL AND (child_date_of_birth > CURRENT_DATE OR child_date_of_birth < (CURRENT_DATE - INTERVAL '10 years')::DATE) THEN
    RAISE EXCEPTION 'Choose a valid date of birth' USING ERRCODE = '22023';
  END IF;
  IF target_classroom IS NOT NULL THEN
    SELECT name INTO room_name_value FROM public.classrooms WHERE id = target_classroom AND active;
    IF NOT FOUND THEN RAISE EXCEPTION 'Active classroom not found' USING ERRCODE = '22023'; END IF;
  END IF;

  INSERT INTO public.children (display_name, date_of_birth, room_name)
  VALUES (clean_name, child_date_of_birth, room_name_value)
  RETURNING id INTO child_id;

  IF target_classroom IS NOT NULL THEN
    PERFORM public.enrol_child_in_classroom(child_id, target_classroom, CURRENT_DATE);
  END IF;

  INSERT INTO public.audit_log (actor_id, action, resource_type, resource_id, after_state)
  VALUES (auth.uid(), 'child.create', 'children', child_id::TEXT,
    jsonb_build_object('display_name', clean_name, 'date_of_birth', child_date_of_birth, 'classroom_id', target_classroom));
  RETURN child_id;
END;
$$;

REVOKE ALL ON FUNCTION public.create_child_record(TEXT, DATE, UUID) FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.create_child_record(TEXT, DATE, UUID) TO authenticated;

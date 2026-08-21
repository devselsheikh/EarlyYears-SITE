-- Make authenticated identities and application profiles converge automatically.
-- New accounts start as Parent; elevated access is always an explicit action.

CREATE OR REPLACE FUNCTION public.handle_new_auth_user()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public, auth
AS $$
DECLARE
  requested_role public.app_role := 'parent';
BEGIN
  IF COALESCE(NEW.raw_app_meta_data ->> 'role', '') IN ('owner', 'admin', 'teacher', 'parent') THEN
    requested_role := (NEW.raw_app_meta_data ->> 'role')::public.app_role;
  END IF;

  INSERT INTO public.profiles (id, role, display_name)
  VALUES (
    NEW.id,
    requested_role,
    COALESCE(NEW.raw_user_meta_data ->> 'display_name', NEW.raw_user_meta_data ->> 'full_name', '')
  )
  ON CONFLICT (id) DO UPDATE SET
    display_name = CASE
      WHEN public.profiles.display_name = '' THEN EXCLUDED.display_name
      ELSE public.profiles.display_name
    END,
    updated_at = now();

  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
AFTER INSERT ON auth.users
FOR EACH ROW EXECUTE FUNCTION public.handle_new_auth_user();

-- Remove the earlier broad Admin write policy: its WITH CHECK allowed an Admin
-- to create another Admin. Role changes now pass through assign_profile_role().
DROP POLICY IF EXISTS "admins_manage_non_owner_profiles" ON public.profiles;

-- Repair existing installations where auth users predate the profiles table.
INSERT INTO public.profiles (id, role, display_name)
SELECT
  user_record.id,
  CASE
    WHEN COALESCE(user_record.raw_app_meta_data ->> 'role', '') IN ('owner', 'admin', 'teacher', 'parent')
      THEN (user_record.raw_app_meta_data ->> 'role')::public.app_role
    ELSE 'parent'::public.app_role
  END,
  COALESCE(user_record.raw_user_meta_data ->> 'display_name', user_record.raw_user_meta_data ->> 'full_name', '')
FROM auth.users AS user_record
ON CONFLICT (id) DO NOTHING;

-- The first authenticated account may explicitly initialize a fresh installation.
-- The row lock prevents two concurrent requests from both becoming Owner.
CREATE OR REPLACE FUNCTION public.claim_initial_owner()
RETURNS public.app_role
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public, auth
AS $$
DECLARE
  caller_id UUID := auth.uid();
BEGIN
  IF caller_id IS NULL THEN
    RAISE EXCEPTION 'Authentication required';
  END IF;

  LOCK TABLE public.profiles IN SHARE ROW EXCLUSIVE MODE;

  IF EXISTS (SELECT 1 FROM public.profiles WHERE role = 'owner' AND active = TRUE) THEN
    RAISE EXCEPTION 'An active Owner already exists';
  END IF;

  INSERT INTO public.profiles (id, role, display_name, active)
  SELECT
    caller_id,
    'owner'::public.app_role,
    COALESCE(raw_user_meta_data ->> 'display_name', raw_user_meta_data ->> 'full_name', ''),
    TRUE
  FROM auth.users
  WHERE id = caller_id
  ON CONFLICT (id) DO UPDATE SET role = 'owner', active = TRUE, updated_at = now();

  RETURN 'owner'::public.app_role;
END;
$$;

REVOKE ALL ON FUNCTION public.claim_initial_owner() FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.claim_initial_owner() TO authenticated;

-- Central role assignment keeps validation on the server and avoids exposing
-- auth.users to the browser. Owner may manage everyone; Admin may manage only
-- Teacher and Parent accounts.
CREATE OR REPLACE FUNCTION public.assign_profile_role(target_user UUID, next_role public.app_role)
RETURNS public.profiles
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public, auth
AS $$
DECLARE
  caller_role public.app_role := public.current_app_role();
  target_current_role public.app_role;
  result public.profiles;
BEGIN
  SELECT role INTO target_current_role FROM public.profiles WHERE id = target_user FOR UPDATE;
  IF NOT FOUND THEN RAISE EXCEPTION 'Profile not found'; END IF;

  IF caller_role = 'owner' THEN
    NULL;
  ELSIF caller_role = 'admin'
    AND target_current_role <> 'owner'
    AND next_role IN ('teacher'::public.app_role, 'parent'::public.app_role) THEN
    NULL;
  ELSE
    RAISE EXCEPTION 'Insufficient permission to assign this role';
  END IF;

  IF target_user = auth.uid() AND target_current_role = 'owner' AND next_role <> 'owner' THEN
    RAISE EXCEPTION 'Owners cannot remove their own Owner access';
  END IF;

  UPDATE public.profiles
  SET role = next_role, updated_at = now()
  WHERE id = target_user
  RETURNING * INTO result;

  RETURN result;
END;
$$;

REVOKE ALL ON FUNCTION public.assign_profile_role(UUID, public.app_role) FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.assign_profile_role(UUID, public.app_role) TO authenticated;

-- Direct writes and future code paths cannot remove the final active Owner.
CREATE OR REPLACE FUNCTION public.protect_last_owner()
RETURNS trigger
LANGUAGE plpgsql
SET search_path = public
AS $$
BEGIN
  IF TG_OP = 'DELETE' THEN
    IF OLD.role = 'owner' AND OLD.active = TRUE
      AND NOT EXISTS (
        SELECT 1 FROM public.profiles
        WHERE id <> OLD.id AND role = 'owner' AND active = TRUE
      ) THEN
      RAISE EXCEPTION 'The final active Owner cannot be removed';
    END IF;
    RETURN OLD;
  END IF;

  IF OLD.role = 'owner' AND OLD.active = TRUE
    AND (NEW.role <> 'owner' OR NEW.active = FALSE)
    AND NOT EXISTS (
      SELECT 1 FROM public.profiles
      WHERE id <> OLD.id AND role = 'owner' AND active = TRUE
    ) THEN
    RAISE EXCEPTION 'The final active Owner cannot be removed';
  END IF;
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS protect_last_owner_profile ON public.profiles;
DROP TRIGGER IF EXISTS protect_last_owner_delete ON public.profiles;
CREATE TRIGGER protect_last_owner_profile
BEFORE UPDATE OF role, active ON public.profiles
FOR EACH ROW EXECUTE FUNCTION public.protect_last_owner();
CREATE TRIGGER protect_last_owner_delete
BEFORE DELETE ON public.profiles
FOR EACH ROW EXECUTE FUNCTION public.protect_last_owner();

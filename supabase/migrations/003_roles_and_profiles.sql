DO $$ BEGIN
  CREATE TYPE public.app_role AS ENUM ('owner', 'admin', 'teacher', 'parent');
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;

CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  role public.app_role NOT NULL DEFAULT 'parent',
  display_name TEXT NOT NULL DEFAULT '',
  avatar_url TEXT,
  phone TEXT,
  active BOOLEAN NOT NULL DEFAULT TRUE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

CREATE OR REPLACE FUNCTION public.current_app_role()
RETURNS public.app_role LANGUAGE sql STABLE SECURITY DEFINER SET search_path = public
AS $$ SELECT role FROM public.profiles WHERE id = auth.uid() AND active = TRUE; $$;

DROP POLICY IF EXISTS "users_read_own_profile" ON public.profiles;
DROP POLICY IF EXISTS "owners_and_admins_read_profiles" ON public.profiles;
DROP POLICY IF EXISTS "owners_manage_all_profiles" ON public.profiles;
DROP POLICY IF EXISTS "admins_manage_non_owner_profiles" ON public.profiles;

CREATE POLICY "users_read_own_profile" ON public.profiles FOR SELECT TO authenticated
  USING (id = auth.uid());
CREATE POLICY "owners_and_admins_read_profiles" ON public.profiles FOR SELECT TO authenticated
  USING (public.current_app_role() IN ('owner', 'admin'));
CREATE POLICY "owners_manage_all_profiles" ON public.profiles FOR ALL TO authenticated
  USING (public.current_app_role() = 'owner') WITH CHECK (public.current_app_role() = 'owner');
CREATE POLICY "admins_manage_non_owner_profiles" ON public.profiles FOR ALL TO authenticated
  USING (public.current_app_role() = 'admin' AND role <> 'owner')
  WITH CHECK (public.current_app_role() = 'admin' AND role <> 'owner');

CREATE OR REPLACE FUNCTION public.sync_profile_role_to_auth()
RETURNS trigger LANGUAGE plpgsql SECURITY DEFINER SET search_path = public, auth
AS $$
BEGIN
  UPDATE auth.users
  SET raw_app_meta_data = COALESCE(raw_app_meta_data, '{}'::jsonb) || jsonb_build_object('role', NEW.role::text)
  WHERE id = NEW.id;
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS sync_profile_role ON public.profiles;
CREATE TRIGGER sync_profile_role AFTER INSERT OR UPDATE OF role ON public.profiles
FOR EACH ROW EXECUTE FUNCTION public.sync_profile_role_to_auth();

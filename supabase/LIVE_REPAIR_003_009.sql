-- Early Years live Supabase repair bundle
-- Generated from canonical migrations 003–009. Apply once in the Supabase SQL Editor.
-- Re-running is supported by the idempotent migrations and explicit policy replacement.

-- ── 003_roles_and_profiles.sql ──

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



-- ── 004_child_management_foundation.sql ──

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



-- ── 005_parent_portal_access.sql ──

CREATE SCHEMA IF NOT EXISTS extensions;
CREATE EXTENSION IF NOT EXISTS pgcrypto WITH SCHEMA extensions;

CREATE TABLE IF NOT EXISTS public.parent_portal_access (
  singleton BOOLEAN PRIMARY KEY DEFAULT TRUE CHECK (singleton),
  pin_hash TEXT NOT NULL,
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_by UUID REFERENCES public.profiles(id) ON DELETE SET NULL
);

ALTER TABLE public.parent_portal_access ENABLE ROW LEVEL SECURITY;

-- The PIN hash is never readable from browser clients. Owners update it through
-- the security-definer function; public clients receive only a boolean result.
REVOKE ALL ON public.parent_portal_access FROM anon, authenticated;

CREATE OR REPLACE FUNCTION public.verify_parent_portal_pin(candidate_pin TEXT)
RETURNS BOOLEAN
LANGUAGE sql
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT COALESCE(
    (SELECT pin_hash = extensions.crypt(candidate_pin, pin_hash) FROM public.parent_portal_access WHERE singleton = TRUE),
    FALSE
  );
$$;

CREATE OR REPLACE FUNCTION public.set_parent_portal_pin(new_pin TEXT)
RETURNS VOID
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  IF public.current_app_role() <> 'owner' THEN
    RAISE EXCEPTION 'Owner access required';
  END IF;
  IF char_length(new_pin) < 6 THEN
    RAISE EXCEPTION 'Portal PIN must contain at least 6 characters';
  END IF;
  INSERT INTO public.parent_portal_access (singleton, pin_hash, updated_at, updated_by)
  VALUES (TRUE, extensions.crypt(new_pin, extensions.gen_salt('bf')), now(), auth.uid())
  ON CONFLICT (singleton) DO UPDATE SET
    pin_hash = EXCLUDED.pin_hash,
    updated_at = now(),
    updated_by = auth.uid();
END;
$$;

REVOKE ALL ON FUNCTION public.verify_parent_portal_pin(TEXT) FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.verify_parent_portal_pin(TEXT) TO anon, authenticated;
REVOKE ALL ON FUNCTION public.set_parent_portal_pin(TEXT) FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.set_parent_portal_pin(TEXT) TO authenticated;



-- ── 006_owner_console_security.sql ──

-- Core CMS tables were previously documented inside the UI but were not part
-- of the repeatable migration chain. This migration makes fresh setup complete
-- and replaces broad "any authenticated user" access with role-scoped policies.

CREATE SCHEMA IF NOT EXISTS extensions;
CREATE EXTENSION IF NOT EXISTS pgcrypto WITH SCHEMA extensions;

CREATE TABLE IF NOT EXISTS public.cms_published (
  id TEXT PRIMARY KEY,
  data JSONB NOT NULL DEFAULT '{}'::jsonb,
  published_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.cms_drafts (
  id TEXT PRIMARY KEY,
  data JSONB NOT NULL DEFAULT '{}'::jsonb,
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.site_settings (
  key TEXT PRIMARY KEY,
  value JSONB NOT NULL DEFAULT 'null'::jsonb,
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.site_popups (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  body TEXT NOT NULL,
  cta_label TEXT,
  cta_url TEXT,
  badge_text TEXT,
  pages TEXT NOT NULL DEFAULT 'all' CHECK (pages IN ('all', 'daycare', 'eduhub')),
  delay_seconds INTEGER NOT NULL DEFAULT 2 CHECK (delay_seconds BETWEEN 0 AND 60),
  show_once BOOLEAN NOT NULL DEFAULT TRUE,
  enabled BOOLEAN NOT NULL DEFAULT FALSE,
  bg_color TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.submissions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  source TEXT NOT NULL,
  payload JSONB NOT NULL DEFAULT '{}'::jsonb,
  status TEXT NOT NULL DEFAULT 'unread' CHECK (status IN ('unread', 'read')),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE public.cms_published ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.cms_drafts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.site_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.site_popups ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.submissions ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "public_read_cms_published" ON public.cms_published;
DROP POLICY IF EXISTS "owner_manage_cms_published" ON public.cms_published;
DROP POLICY IF EXISTS "Public can read published CMS" ON public.cms_published;
DROP POLICY IF EXISTS "Admins manage published CMS" ON public.cms_published;
DROP POLICY IF EXISTS "owner_manage_cms_drafts" ON public.cms_drafts;
DROP POLICY IF EXISTS "Admins manage draft CMS" ON public.cms_drafts;
DROP POLICY IF EXISTS "public_read_site_settings" ON public.site_settings;
DROP POLICY IF EXISTS "owner_manage_site_settings" ON public.site_settings;
DROP POLICY IF EXISTS "Public can read site settings" ON public.site_settings;
DROP POLICY IF EXISTS "Admins manage site settings" ON public.site_settings;
DROP POLICY IF EXISTS "public_read_enabled_popups" ON public.site_popups;
DROP POLICY IF EXISTS "operations_manage_popups" ON public.site_popups;
DROP POLICY IF EXISTS "Public can read enabled popups" ON public.site_popups;
DROP POLICY IF EXISTS "Admins manage popups" ON public.site_popups;
DROP POLICY IF EXISTS "public_create_submissions" ON public.submissions;
DROP POLICY IF EXISTS "operations_manage_submissions" ON public.submissions;
DROP POLICY IF EXISTS "Public can insert submissions" ON public.submissions;
DROP POLICY IF EXISTS "Admins manage submissions" ON public.submissions;

CREATE POLICY "public_read_cms_published" ON public.cms_published FOR SELECT TO anon, authenticated USING (TRUE);
CREATE POLICY "owner_manage_cms_published" ON public.cms_published FOR ALL TO authenticated
  USING (public.current_app_role() = 'owner') WITH CHECK (public.current_app_role() = 'owner');
CREATE POLICY "owner_manage_cms_drafts" ON public.cms_drafts FOR ALL TO authenticated
  USING (public.current_app_role() = 'owner') WITH CHECK (public.current_app_role() = 'owner');
CREATE POLICY "public_read_site_settings" ON public.site_settings FOR SELECT TO anon, authenticated USING (TRUE);
CREATE POLICY "owner_manage_site_settings" ON public.site_settings FOR ALL TO authenticated
  USING (public.current_app_role() = 'owner') WITH CHECK (public.current_app_role() = 'owner');
CREATE POLICY "public_read_enabled_popups" ON public.site_popups FOR SELECT TO anon, authenticated USING (enabled = TRUE);
CREATE POLICY "operations_manage_popups" ON public.site_popups FOR ALL TO authenticated
  USING (public.current_app_role() IN ('owner', 'admin')) WITH CHECK (public.current_app_role() IN ('owner', 'admin'));
CREATE POLICY "public_create_submissions" ON public.submissions FOR INSERT TO anon, authenticated WITH CHECK (TRUE);
CREATE POLICY "operations_manage_submissions" ON public.submissions FOR ALL TO authenticated
  USING (public.current_app_role() IN ('owner', 'admin')) WITH CHECK (public.current_app_role() IN ('owner', 'admin'));

-- Replace migration 001 policies that granted technical CMS access to every
-- authenticated account. Public published reads remain available.
DROP POLICY IF EXISTS "authenticated_read_all_assets" ON public.global_assets;
DROP POLICY IF EXISTS "authenticated_upsert_draft_assets" ON public.global_assets;
DROP POLICY IF EXISTS "authenticated_update_draft_assets" ON public.global_assets;
DROP POLICY IF EXISTS "admin_delete_assets" ON public.global_assets;
DROP POLICY IF EXISTS "authenticated_read_asset_versions" ON public.asset_versions;
DROP POLICY IF EXISTS "authenticated_insert_asset_versions" ON public.asset_versions;
DROP POLICY IF EXISTS "authenticated_manage_asset_usages" ON public.asset_usages;
DROP POLICY IF EXISTS "authenticated_read_publications" ON public.publications;
DROP POLICY IF EXISTS "authenticated_read_all_claims" ON public.cms_claims;
DROP POLICY IF EXISTS "authenticated_manage_claims" ON public.cms_claims;
DROP POLICY IF EXISTS "admin_read_audit_log" ON public.audit_log;
DROP POLICY IF EXISTS "Public can read published assets" ON public.global_assets;
DROP POLICY IF EXISTS "Admins manage assets" ON public.global_assets;
DROP POLICY IF EXISTS "Admins manage asset versions" ON public.asset_versions;
DROP POLICY IF EXISTS "Admins manage publications" ON public.publications;
DROP POLICY IF EXISTS "Public can insert claims" ON public.cms_claims;
DROP POLICY IF EXISTS "Admins manage claims" ON public.cms_claims;

DROP POLICY IF EXISTS "owner_manage_global_assets" ON public.global_assets;
DROP POLICY IF EXISTS "owner_read_asset_versions" ON public.asset_versions;
DROP POLICY IF EXISTS "owner_insert_asset_versions" ON public.asset_versions;
DROP POLICY IF EXISTS "owner_manage_asset_usages" ON public.asset_usages;
DROP POLICY IF EXISTS "owner_read_publications" ON public.publications;
DROP POLICY IF EXISTS "owner_manage_claims" ON public.cms_claims;
DROP POLICY IF EXISTS "owner_read_audit_log" ON public.audit_log;

CREATE POLICY "owner_manage_global_assets" ON public.global_assets FOR ALL TO authenticated
  USING (public.current_app_role() = 'owner') WITH CHECK (public.current_app_role() = 'owner');
CREATE POLICY "owner_read_asset_versions" ON public.asset_versions FOR SELECT TO authenticated
  USING (public.current_app_role() = 'owner');
CREATE POLICY "owner_insert_asset_versions" ON public.asset_versions FOR INSERT TO authenticated
  WITH CHECK (public.current_app_role() = 'owner');
CREATE POLICY "owner_manage_asset_usages" ON public.asset_usages FOR ALL TO authenticated
  USING (public.current_app_role() = 'owner') WITH CHECK (public.current_app_role() = 'owner');
CREATE POLICY "owner_read_publications" ON public.publications FOR SELECT TO authenticated
  USING (public.current_app_role() = 'owner');
CREATE POLICY "owner_manage_claims" ON public.cms_claims FOR ALL TO authenticated
  USING (public.current_app_role() = 'owner') WITH CHECK (public.current_app_role() = 'owner');
CREATE POLICY "owner_read_audit_log" ON public.audit_log FOR SELECT TO authenticated
  USING (public.current_app_role() = 'owner');

CREATE INDEX IF NOT EXISTS submissions_status_created_idx ON public.submissions (status, created_at DESC);
CREATE INDEX IF NOT EXISTS site_popups_enabled_created_idx ON public.site_popups (enabled, created_at DESC);



-- ── 007_identity_provisioning.sql ──

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



-- ── 008_child_consents.sql ──

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



-- ── 009_child_health_basics.sql ──

-- Minimal health information needed by daily attendance and care workflows.
-- Access remains governed by the existing child-scoped RLS policies.

ALTER TABLE public.children
  ADD COLUMN IF NOT EXISTS allergies TEXT[] NOT NULL DEFAULT ARRAY[]::TEXT[];

COMMENT ON COLUMN public.children.allergies IS
  'Concise allergy labels visible only to staff assigned to the child, operations roles, and linked guardians.';



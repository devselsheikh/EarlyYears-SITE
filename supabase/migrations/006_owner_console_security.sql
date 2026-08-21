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

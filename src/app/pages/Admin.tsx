import { useState, useCallback, useRef, useMemo, useEffect } from 'react';
import {
  Settings, Image, Users, Star, LayoutGrid, BookOpen, Clock,
  UtensilsCrossed, GraduationCap, Award, FileText, HelpCircle,
  Mail, Inbox, LogOut, Eye, ChevronUp, ChevronDown, Plus,
  Pencil, Trash2, Check, X, Search,
  BarChart3, Link2, Megaphone, AlertTriangle, Copy, Globe, Upload, Bell,
  CloudUpload, CheckCircle2, AlertCircle, Loader2,
  Shield, Activity, Package, Calendar, ClipboardList, Rocket, Download,
  ArrowRight, LockKeyhole, Sparkles,
} from 'lucide-react';
import {
  CMSContent, CMSStatus, CMSEducator, CMSTestimonial, CMSGalleryItem,
  CMSCourse, CMSAlumni, CMSAccreditation, CMSBlogArticle, CMSFAQ,
  CMSCalendarEvent, CMSPortalFile, CMSDaycareHero, CMSEduhubHero,
  SupabaseSubmission, CMSMediaItem, CMSProgram, CMSScheduleStep,
  generateId, DEFAULT_CMS, isPublished, isEditorialArticle, getStatus, scanMediaUsage,
  getHealthWarnings, loadDraftCMS, saveDraft, publishCMS, publishAllAssets,
  fetchSubmissions, updateSubmissionStatus, deleteSubmission,
  CMS_KEY, loadCMS, saveCMS,
} from '../data/cms';
import { ALL_POSTS as HARDCODED_BLOG_POSTS } from '../data/blogPosts';
import { supabase, supabaseConfigured } from '../utils/supabase/client';
import type { Session } from '@supabase/supabase-js';
import { invalidateCMSCache } from '../hooks/useCMS';
import { invalidateAssetCache } from '../hooks/useAssets';
import { AssetsSection } from '../components/admin/AssetsSection';
import { LaunchChecklistSection } from '../components/admin/LaunchChecklistSection';
import { ContentHealthSection } from '../components/admin/ContentHealthSection';
import { PublicationsSection } from '../components/admin/PublicationsSection';
import { PopupSection } from '../components/admin/PopupSection';
import { useProfileRole } from '../auth/useProfileRole';
import DaycareLogo from '../components/DaycareLogo';

// ─── Brand colours ────────────────────────────────────────────────────────────
// peach-600 ≈ #ea7c4b  |  coral ≈ #f06b5d  |  blue-600 = #2563eb
const ACCENT = 'text-orange-600';
const ACCENT_BG = 'bg-orange-50';
const ACCENT_BORDER = 'border-orange-200';
const ACTIVE_NAV = 'bg-gradient-to-r from-orange-50 to-rose-50 text-orange-700 border-r-2 border-orange-500';

// ─── Shared UI ────────────────────────────────────────────────────────────────

function Field({ label, required, hint, children }: { label: string; required?: boolean; hint?: string; children: React.ReactNode }) {
  return (
    <div className="mb-4">
      <label className="block text-xs font-semibold text-gray-600 mb-1">
        {label}{required && <span className="text-red-500 ml-0.5">*</span>}
      </label>
      {children}
      {hint && <p className="text-xs text-gray-400 mt-1">{hint}</p>}
    </div>
  );
}

const inputCls = 'w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-orange-400 focus:border-transparent bg-white';
const btnPrimary = 'inline-flex items-center gap-1.5 px-4 py-2 bg-orange-500 text-white rounded-lg text-sm font-semibold hover:bg-orange-600 transition-colors';
const btnBlue = 'inline-flex items-center gap-1.5 px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-semibold hover:bg-blue-700 transition-colors';
const btnSecondary = 'inline-flex items-center gap-1.5 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg text-sm font-semibold hover:bg-gray-200 transition-colors';
const btnDanger = 'inline-flex items-center gap-1.5 px-3 py-1.5 bg-red-50 text-red-600 rounded-lg text-xs font-semibold hover:bg-red-100 transition-colors';
const btnGhost = 'inline-flex items-center gap-1.5 px-3 py-1.5 bg-white border border-gray-200 text-gray-600 rounded-lg text-xs font-semibold hover:bg-gray-50 transition-colors';

function AdminEntryShell({ children }: { children: React.ReactNode }) {
  return <main className="ey-gate admin-gate">
    <header className="ey-gate__header"><a href="/daycare" aria-label="Early Years Daycare home"><DaycareLogo /></a><a className="ey-gate__back" href="/workspace">Back to workspace <ArrowRight aria-hidden="true" /></a></header>
    <div className="ey-gate__layout">
      <section className="ey-gate__welcome" aria-labelledby="admin-entry-title"><div className="ey-gate__art" aria-hidden="true"><span>●</span><span>★</span><span>♥</span><Sparkles /></div><div className="ey-gate__welcome-copy"><p className="platform-eyebrow">Owner Console</p><h1 id="admin-entry-title">Your website, carefully managed.</h1><p>Publishing, enquiries, images, security checks, and system health—reserved for the Early Years owner.</p></div><div className="ey-gate__trust"><Shield aria-hidden="true" /><span><strong>Owner-only controls</strong><small>Operational accounts continue through the separate workspace.</small></span></div></section>
      <section className="ey-gate__entry">{children}</section>
    </div>
  </main>;
}

function Toggle({ value, onChange, label }: { value: boolean; onChange: (v: boolean) => void; label: string }) {
  return (
    <label className="flex items-center gap-2 cursor-pointer select-none">
      <div onClick={() => onChange(!value)} className={`w-9 h-5 rounded-full transition-colors ${value ? 'bg-orange-500' : 'bg-gray-300'} relative flex-shrink-0`}>
        <div className={`absolute top-0.5 w-4 h-4 bg-white rounded-full shadow transition-transform ${value ? 'translate-x-4' : 'translate-x-0.5'}`} />
      </div>
      <span className="text-sm text-gray-700">{label}</span>
    </label>
  );
}

function StatusPill({ status }: { status?: CMSStatus; active?: boolean }) {
  const s = status || 'published';
  const map: Record<CMSStatus, string> = { published: 'bg-green-100 text-green-700', draft: 'bg-amber-100 text-amber-700', hidden: 'bg-gray-100 text-gray-500' };
  return <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wide ${map[s]}`}>{s}</span>;
}

function FeaturedPill() {
  return <span className="px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wide bg-orange-100 text-orange-700">Featured</span>;
}

function Badge({ color, children }: { color: string; children: React.ReactNode }) {
  return <span className={`px-2 py-0.5 rounded-full text-xs font-semibold ${color}`}>{children}</span>;
}

function ReorderBtns({ onUp, onDown, first, last }: { onUp: () => void; onDown: () => void; first: boolean; last: boolean }) {
  return (
    <div className="flex flex-col gap-0.5">
      <button onClick={onUp} disabled={first} className="disabled:opacity-25 hover:bg-gray-100 rounded p-0.5 transition-colors"><ChevronUp className="w-3.5 h-3.5" /></button>
      <button onClick={onDown} disabled={last} className="disabled:opacity-25 hover:bg-gray-100 rounded p-0.5 transition-colors"><ChevronDown className="w-3.5 h-3.5" /></button>
    </div>
  );
}

function Modal({ title, subtitle, onClose, children, wide }: { title: string; subtitle?: string; onClose: () => void; children: React.ReactNode; wide?: boolean }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={onClose} />
      <div className={`relative bg-white rounded-2xl shadow-2xl w-full max-h-[92vh] overflow-y-auto ${wide ? 'max-w-3xl' : 'max-w-2xl'}`}>
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100 sticky top-0 bg-white z-10 rounded-t-2xl">
          <div>
            <h3 className="font-bold text-gray-900">{title}</h3>
            {subtitle && <p className="text-xs text-gray-500 mt-0.5">{subtitle}</p>}
          </div>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-700 transition-colors"><X className="w-5 h-5" /></button>
        </div>
        <div className="p-6">{children}</div>
      </div>
    </div>
  );
}

function ConfirmModal({ message, onConfirm, onCancel }: { message: string; onConfirm: () => void; onCancel: () => void }) {
  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/60" onClick={onCancel} />
      <div className="relative bg-white rounded-2xl shadow-2xl p-6 w-full max-w-sm text-center">
        <AlertTriangle className="w-10 h-10 text-amber-500 mx-auto mb-3" />
        <p className="text-gray-800 mb-5 leading-relaxed">{message}</p>
        <div className="flex gap-2 justify-center">
          <button className={btnSecondary} onClick={onCancel}>Cancel</button>
          <button className="px-4 py-2 bg-red-600 text-white rounded-lg text-sm font-semibold hover:bg-red-700 transition-colors" onClick={onConfirm}>Confirm</button>
        </div>
      </div>
    </div>
  );
}

function EmptyState({ message, action, onAction }: { message: string; action?: string; onAction?: () => void }) {
  return (
    <div className="text-center py-12">
      <div className="text-gray-300 text-4xl mb-3">○</div>
      <p className="text-gray-500 text-sm mb-3">{message}</p>
      {action && onAction && <button className={btnPrimary} onClick={onAction}><Plus className="w-4 h-4" />{action}</button>}
    </div>
  );
}

function StatusSelect({ value, onChange }: { value?: CMSStatus; onChange: (v: CMSStatus) => void }) {
  return (
    <select className={inputCls} value={value || 'published'} onChange={e => onChange(e.target.value as CMSStatus)}>
      <option value="published">✅ Published</option>
      <option value="draft">✏️ Draft</option>
      <option value="hidden">🚫 Hidden</option>
    </select>
  );
}

function SectionHeader({ title, description }: { title: string; description: string }) {
  return (
    <div className="mb-6 pb-4 border-b border-gray-100">
      <h2 className="text-xl font-bold text-gray-900">{title}</h2>
      <p className="text-sm text-gray-500 mt-0.5">{description}</p>
    </div>
  );
}

// ─── Overview ─────────────────────────────────────────────────────────────────

function OverviewSection({ cms, onNavigate, unreadCount }: { cms: CMSContent; onNavigate: (id: string, action?: string) => void; unreadCount: number }) {
  const unread = unreadCount;
  const warnings = getHealthWarnings(cms);

  const stats = [
    { label: 'Company Team', value: cms.educators.length, sub: `${cms.educators.filter(isPublished).length} published`, color: 'bg-orange-50 border-orange-100', icon: Users, section: 'educators' },
    { label: 'Testimonials', value: cms.testimonials.length, sub: `${cms.testimonials.filter(isPublished).length} published`, color: 'bg-rose-50 border-rose-100', icon: Star, section: 'testimonials' },
    { label: 'Gallery Images', value: cms.gallery.length, sub: `${cms.gallery.filter(isPublished).length} visible`, color: 'bg-teal-50 border-teal-100', icon: LayoutGrid, section: 'gallery' },
    { label: 'Blog Articles', value: cms.blog.length, sub: `${cms.blog.filter(isPublished).length} published`, color: 'bg-blue-50 border-blue-100', icon: FileText, section: 'blog' },
    { label: 'Submissions', value: unread, sub: `${unread} unread`, color: unread > 0 ? 'bg-amber-50 border-amber-200' : 'bg-gray-50 border-gray-100', icon: Inbox, section: 'submissions' },
    { label: 'FAQ Items', value: cms.faq.length, sub: `${cms.faq.filter(isPublished).length} active`, color: 'bg-purple-50 border-purple-100', icon: HelpCircle, section: 'faq' },
  ];

  const quickActions = [
    { label: 'Add Team Member', icon: Users, section: 'educators', action: 'new' },
    { label: 'Add Review', icon: Star, section: 'testimonials', action: 'new' },
    { label: 'Add Gallery Image', icon: LayoutGrid, section: 'gallery', action: 'new' },
    { label: 'Add Blog Article', icon: FileText, section: 'blog', action: 'new' },
    { label: 'View Submissions', icon: Inbox, section: 'submissions' },
    { label: 'Preview Website', icon: Eye, section: '_preview' },
  ];

  return (
    <div>
      <SectionHeader title="Overview" description="Real-time summary of your website content." />

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
        {stats.map((s, i) => {
          const Icon = s.icon;
          return (
            <button key={i} onClick={() => onNavigate(s.section)} className={`text-left p-4 rounded-2xl border ${s.color} hover:shadow-md transition-all group`}>
              <div className="flex items-center justify-between mb-2">
                <Icon className="w-5 h-5 text-gray-500" />
                <span className="text-2xl font-bold text-gray-900 group-hover:text-orange-600 transition-colors">{s.value}</span>
              </div>
              <div className="font-semibold text-sm text-gray-700">{s.label}</div>
              <div className="text-xs text-gray-500">{s.sub}</div>
            </button>
          );
        })}
      </div>

      {/* Quick actions */}
      <h3 className="font-bold text-gray-800 mb-3">Quick Actions</h3>
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 mb-8">
        {quickActions.map((a, i) => {
          const Icon = a.icon;
          return (
            <button key={i}
              onClick={() => a.section === '_preview' ? window.open('/', '_blank') : onNavigate(a.section, a.action)}
              className="flex items-center gap-2 p-3 rounded-xl border border-gray-100 bg-white hover:border-orange-200 hover:bg-orange-50 transition-all text-sm font-medium text-gray-700 hover:text-orange-700 shadow-sm"
            >
              <Icon className="w-4 h-4 flex-shrink-0" />
              {a.label}
            </button>
          );
        })}
      </div>

      {/* Content health */}
      <h3 className="font-bold text-gray-800 mb-3">Content Health</h3>
      {warnings.length === 0 ? (
        <div className="flex items-center gap-2 p-4 bg-green-50 border border-green-100 rounded-2xl text-green-700 text-sm">
          <Check className="w-5 h-5" /> All content checks passed.
        </div>
      ) : (
        <div className="space-y-2">
          {warnings.map((w, i) => (
            <div key={i} className="flex items-center gap-3 p-3 bg-amber-50 border border-amber-100 rounded-xl">
              <AlertTriangle className="w-4 h-4 text-amber-500 flex-shrink-0" />
              <div className="flex-1 min-w-0">
                <span className="text-sm font-semibold text-amber-800">{w.section}</span>
                <span className="text-sm text-amber-700 ml-2">{w.message}</span>
              </div>
              <span className="text-xs font-bold bg-amber-200 text-amber-800 px-2 py-0.5 rounded-full">{w.count}</span>
              <button onClick={() => onNavigate(w.sectionId)} className="text-xs text-amber-700 underline hover:no-underline">Fix</button>
            </div>
          ))}
        </div>
      )}

      {/* Database Setup */}
      <DatabaseSetupCard />
    </div>
  );
}

const DB_SETUP_SQL = `-- ══════════════════════════════════════════════════════════════════
-- EARLY YEARS — Complete Supabase Database Setup  (fully idempotent)
-- Safe to re-run. Skips tables/policies that already exist.
-- Paste into: https://supabase.com/dashboard/project/_/sql/new
-- ══════════════════════════════════════════════════════════════════

-- ── 1. CMS Content ───────────────────────────────────────────────
create table if not exists cms_published (
  id           text primary key default 'main',
  data         jsonb not null default '{}',
  published_at timestamptz not null default now(),
  updated_at   timestamptz not null default now()
);
create table if not exists cms_drafts (
  id         text primary key default 'main',
  data       jsonb not null default '{}',
  updated_at timestamptz not null default now()
);
alter table cms_published enable row level security;
alter table cms_drafts     enable row level security;
do $$ begin
  create policy "Public can read published CMS"
    on cms_published for select using (true);
exception when duplicate_object then null; end $$;
do $$ begin
  create policy "Admins manage published CMS"
    on cms_published for all using (auth.role() = 'authenticated');
exception when duplicate_object then null; end $$;
do $$ begin
  create policy "Admins manage draft CMS"
    on cms_drafts for all using (auth.role() = 'authenticated');
exception when duplicate_object then null; end $$;

-- ── 2. Form submissions ───────────────────────────────────────────
create table if not exists submissions (
  id         uuid primary key default gen_random_uuid(),
  source     text not null,
  payload    jsonb not null default '{}',
  status     text not null default 'unread',
  created_at timestamptz not null default now()
);
alter table submissions add column if not exists status text not null default 'unread';
alter table submissions enable row level security;
do $$ begin
  create policy "Public can insert submissions"
    on submissions for insert with check (true);
exception when duplicate_object then null; end $$;
do $$ begin
  create policy "Admins manage submissions"
    on submissions for all using (auth.role() = 'authenticated');
exception when duplicate_object then null; end $$;

-- ── 3. Site settings ─────────────────────────────────────────────
create table if not exists site_settings (
  key        text primary key,
  value      text not null,
  updated_at timestamptz not null default now()
);
alter table site_settings enable row level security;
do $$ begin
  create policy "Public can read site settings"
    on site_settings for select using (true);
exception when duplicate_object then null; end $$;
do $$ begin
  create policy "Admins manage site settings"
    on site_settings for all using (auth.role() = 'authenticated');
exception when duplicate_object then null; end $$;
-- Seed parent portal PIN (change '2026' to your PIN)
insert into site_settings (key, value)
  values ('parent_portal_pin', '2026')
  on conflict (key) do nothing;

-- ── 4. Announcement popups ────────────────────────────────────────
create table if not exists site_popups (
  id            uuid primary key default gen_random_uuid(),
  title         text not null,
  body          text not null,
  cta_label     text,
  cta_url       text,
  badge_text    text,
  pages         text not null default 'all',
  delay_seconds int not null default 3,
  show_once     boolean not null default true,
  enabled       boolean not null default false,
  bg_color      text,
  created_at    timestamptz not null default now()
);
alter table site_popups add column if not exists enabled boolean not null default false;
alter table site_popups add column if not exists pages   text not null default 'all';
alter table site_popups enable row level security;
do $$ begin
  create policy "Public can read enabled popups"
    on site_popups for select using (enabled = true);
exception when duplicate_object then null; end $$;
do $$ begin
  create policy "Admins manage popups"
    on site_popups for all using (auth.role() = 'authenticated');
exception when duplicate_object then null; end $$;

-- ── 5. Image assets & version history ────────────────────────────
create table if not exists global_assets (
  id                   uuid primary key default gen_random_uuid(),
  asset_key            text not null unique,
  alt_text             text,
  focal_x              real not null default 0.5,
  focal_y              real not null default 0.5,
  published_url        text,
  published_mobile_url text,
  version              int not null default 0,
  status               text not null default 'draft',
  updated_at           timestamptz not null default now()
);
alter table global_assets add column if not exists status text not null default 'draft';
alter table global_assets add column if not exists published_mobile_url text;
alter table global_assets add column if not exists version int not null default 0;
create table if not exists asset_versions (
  id           uuid primary key default gen_random_uuid(),
  asset_id     uuid references global_assets(id) on delete cascade,
  version      int not null,
  original_url text,
  mobile_url   text,
  alt_text     text,
  focal_x      real,
  focal_y      real,
  created_at   timestamptz not null default now()
);
alter table global_assets  enable row level security;
alter table asset_versions enable row level security;
do $$ begin
  create policy "Public can read published assets"
    on global_assets for select using (status = 'published');
exception when duplicate_object then null; end $$;
do $$ begin
  create policy "Admins manage assets"
    on global_assets for all using (auth.role() = 'authenticated');
exception when duplicate_object then null; end $$;
do $$ begin
  create policy "Admins manage asset versions"
    on asset_versions for all using (auth.role() = 'authenticated');
exception when duplicate_object then null; end $$;

-- ── 6. Publications log ───────────────────────────────────────────
create table if not exists publications (
  id         uuid primary key default gen_random_uuid(),
  label      text not null,
  status     text not null default 'pending',
  payload    jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
alter table publications add column if not exists status text not null default 'pending';
alter table publications enable row level security;
do $$ begin
  create policy "Admins manage publications"
    on publications for all using (auth.role() = 'authenticated');
exception when duplicate_object then null; end $$;

-- ── 7. Claims & verification ──────────────────────────────────────
create table if not exists cms_claims (
  id         uuid primary key default gen_random_uuid(),
  type       text not null,
  payload    jsonb not null default '{}',
  status     text not null default 'pending',
  created_at timestamptz not null default now()
);
alter table cms_claims add column if not exists status text not null default 'pending';
alter table cms_claims add column if not exists type   text;
alter table cms_claims enable row level security;
do $$ begin
  create policy "Public can insert claims"
    on cms_claims for insert with check (true);
exception when duplicate_object then null; end $$;
do $$ begin
  create policy "Admins manage claims"
    on cms_claims for all using (auth.role() = 'authenticated');
exception when duplicate_object then null; end $$;

-- ══════════════════════════════════════════════════════════════════
-- Storage bucket (run once, separate from above if needed)
-- ══════════════════════════════════════════════════════════════════
-- insert into storage.buckets (id, name, public)
--   values ('assets', 'assets', true) on conflict do nothing;
-- create policy "Public read assets"
--   on storage.objects for select using (bucket_id = 'assets');
-- create policy "Auth upload assets"
--   on storage.objects for insert
--   with check (bucket_id = 'assets' and auth.role() = 'authenticated');`;

function DatabaseSetupCard() {
  const [open, setOpen] = useState(false);
  const [copied, setCopied] = useState(false);

  const copy = () => {
    navigator.clipboard.writeText(DB_SETUP_SQL).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  };

  return (
    <div className="mt-8 border border-dashed border-gray-300 rounded-2xl overflow-hidden">
      <button
        onClick={() => setOpen(o => !o)}
        className="w-full flex items-center justify-between px-5 py-4 bg-gray-50 hover:bg-gray-100 transition-colors text-left"
      >
        <div>
          <p className="font-semibold text-gray-700 text-sm">🗄️ Database Setup SQL</p>
          <p className="text-xs text-gray-400 mt-0.5">Run once in your Supabase SQL Editor to create all required tables</p>
        </div>
        <ChevronDown className={`w-4 h-4 text-gray-400 transition-transform ${open ? 'rotate-180' : ''}`} />
      </button>
      {open && (
        <div className="p-5 space-y-3">
          <div className="flex items-center justify-between">
            <p className="text-xs text-gray-500">
              Copy all SQL below → paste into{' '}
              <a
                href="https://supabase.com/dashboard/project/_/sql/new"
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-500 underline"
              >
                Supabase SQL Editor
              </a>{' '}
              → Run
            </p>
            <button
              onClick={copy}
              className={`flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-lg font-semibold transition-colors ${copied ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}
            >
              {copied ? <><Check className="w-3.5 h-3.5" /> Copied!</> : <><Copy className="w-3.5 h-3.5" /> Copy SQL</>}
            </button>
          </div>
          <pre className="bg-gray-900 text-green-300 text-[10px] rounded-xl p-4 overflow-x-auto leading-relaxed whitespace-pre max-h-80 overflow-y-auto">
            {DB_SETUP_SQL}
          </pre>
          <div className="grid sm:grid-cols-2 gap-2 text-[11px] text-gray-500">
            {[
              'cms_published — stores live site content',
              'cms_drafts — stores unpublished edits',
              'submissions — contact form enquiries',
              'site_settings — portal PIN & config',
              'site_popups — announcement popups',
              'global_assets — image asset registry',
              'asset_versions — image version history',
              'publications — publish audit log',
              'cms_claims — claims & verifications',
            ].map(t => (
              <div key={t} className="flex items-center gap-1.5">
                <CheckCircle2 className="w-3 h-3 text-green-400 flex-shrink-0" />
                {t}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

// ─── Site Settings ────────────────────────────────────────────────────────────

function SiteSettingsSection({ cms, onChange }: { cms: CMSContent; onChange: (c: CMSContent) => void }) {
  const s = cms.siteSettings;
  const upd = (k: string, v: string) => onChange({ ...cms, siteSettings: { ...s, [k]: v } });
  return (
    <div>
      <SectionHeader title="Site Settings" description="Global contact details, social links, and brand statistics." />
      <div className="grid md:grid-cols-2 gap-x-4">
        <Field label="Company Name" required><input className={inputCls} value={s.companyName} onChange={e => upd('companyName', e.target.value)} /></Field>
        <Field label="Main Email"><input className={inputCls} type="email" value={s.mainEmail} onChange={e => upd('mainEmail', e.target.value)} /></Field>
        <Field label="Daycare Email"><input className={inputCls} type="email" value={s.daycareEmail} onChange={e => upd('daycareEmail', e.target.value)} /></Field>
        <Field label="EduHub Email"><input className={inputCls} type="email" value={s.eduhubEmail} onChange={e => upd('eduhubEmail', e.target.value)} /></Field>
        <Field label="Main Phone"><input className={inputCls} value={s.mainPhone} onChange={e => upd('mainPhone', e.target.value)} /></Field>
        <Field label="Daycare Phone"><input className={inputCls} value={s.daycarePhone} onChange={e => upd('daycarePhone', e.target.value)} /></Field>
        <Field label="EduHub Phone"><input className={inputCls} value={s.eduhubPhone} onChange={e => upd('eduhubPhone', e.target.value)} /></Field>
        <Field label="WhatsApp"><input className={inputCls} value={s.whatsapp} onChange={e => upd('whatsapp', e.target.value)} /></Field>
        <Field label="Address"><input className={inputCls} value={s.address} onChange={e => upd('address', e.target.value)} /></Field>
        <Field label="Google Maps Link"><input className={inputCls} value={s.googleMapsLink} onChange={e => upd('googleMapsLink', e.target.value)} /></Field>
        <Field label="LinkedIn URL"><input className={inputCls} value={s.linkedinUrl} onChange={e => upd('linkedinUrl', e.target.value)} /></Field>
        <Field label="Instagram URL"><input className={inputCls} value={s.instagramUrl} onChange={e => upd('instagramUrl', e.target.value)} /></Field>
      </div>
      <Field label="Footer Copyright"><input className={inputCls} value={s.footerCopyright} onChange={e => upd('footerCopyright', e.target.value)} /></Field>

      <div className="mt-4">
        <div className="flex items-center justify-between mb-3">
          <h4 className="font-semibold text-sm text-gray-700">Brand Statistics</h4>
          <button className={btnPrimary} onClick={() => onChange({ ...cms, siteSettings: { ...s, stats: [...s.stats, { label: '', value: '' }] } })}><Plus className="w-3.5 h-3.5" />Add Stat</button>
        </div>
        {s.stats.map((st, i) => (
          <div key={i} className="flex gap-2 mb-2">
            <input className={inputCls} placeholder="Value (e.g. 25+)" value={st.value} onChange={e => { const ns = [...s.stats]; ns[i] = { ...ns[i], value: e.target.value }; onChange({ ...cms, siteSettings: { ...s, stats: ns } }); }} />
            <input className={inputCls} placeholder="Label (e.g. Years of Excellence)" value={st.label} onChange={e => { const ns = [...s.stats]; ns[i] = { ...ns[i], label: e.target.value }; onChange({ ...cms, siteSettings: { ...s, stats: ns } }); }} />
            <button onClick={() => onChange({ ...cms, siteSettings: { ...s, stats: s.stats.filter((_, j) => j !== i) } })} className="text-red-400 hover:text-red-600 flex-shrink-0"><X className="w-4 h-4" /></button>
          </div>
        ))}
      </div>
    </div>
  );
}

// ─── SEO ──────────────────────────────────────────────────────────────────────

function SitemapGenerator({ cms }: { cms: CMSContent }) {
  const [sitemapXml, setSitemapXml] = useState<string | null>(null);

  const generate = () => {
    const base = 'https://theearlyyearscompany.com';
    const today = new Date().toISOString().split('T')[0];

    const staticRoutes = [
      { loc: base, changefreq: 'weekly', priority: '1.0' },
      { loc: `${base}/daycare`, changefreq: 'weekly', priority: '0.9' },
      { loc: `${base}/daycare/about`, changefreq: 'monthly', priority: '0.8' },
      { loc: `${base}/daycare/programs`, changefreq: 'monthly', priority: '0.8' },
      { loc: `${base}/daycare/contact`, changefreq: 'monthly', priority: '0.8' },
      { loc: `${base}/eduhub`, changefreq: 'weekly', priority: '0.9' },
      { loc: `${base}/eduhub/programs`, changefreq: 'monthly', priority: '0.8' },
      { loc: `${base}/eduhub/programs/diploma`, changefreq: 'monthly', priority: '0.7' },
      { loc: `${base}/eduhub/about`, changefreq: 'monthly', priority: '0.7' },
      { loc: `${base}/eduhub/contact`, changefreq: 'monthly', priority: '0.8' },
      { loc: `${base}/blog`, changefreq: 'daily', priority: '0.8' },
      { loc: `${base}/contact`, changefreq: 'monthly', priority: '0.7' },
      { loc: `${base}/privacy`, changefreq: 'yearly', priority: '0.3' },
      { loc: `${base}/terms`, changefreq: 'yearly', priority: '0.3' },
    ];

    const publishedBlogs = cms.blog.filter(isPublished).filter(isEditorialArticle);
    const blogSlugs = new Set([...HARDCODED_BLOG_POSTS.map(post => post.slug), ...publishedBlogs.map(post => post.slug)]);
    const blogRoutes = [...blogSlugs].map(slug => ({ loc: `${base}/blog/${slug}`, changefreq: 'monthly', priority: '0.6' }));

    const all = [...staticRoutes, ...blogRoutes];
    const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${all.map(r => `  <url>
    <loc>${r.loc}</loc>
    <lastmod>${today}</lastmod>
    <changefreq>${r.changefreq}</changefreq>
    <priority>${r.priority}</priority>
  </url>`).join('\n')}
</urlset>`;
    setSitemapXml(xml);
  };

  const download = () => {
    if (!sitemapXml) return;
    const blob = new Blob([sitemapXml], { type: 'application/xml' });
    const a = document.createElement('a');
    a.href = URL.createObjectURL(blob);
    a.download = 'sitemap.xml';
    a.click();
  };

  return (
    <div className="mt-8 p-4 bg-gray-50 rounded-2xl border border-gray-100">
      <div className="flex items-center justify-between mb-3">
        <div>
          <h4 className="font-semibold text-sm text-gray-800">Sitemap Generator</h4>
          <p className="text-xs text-gray-500 mt-0.5">Generates sitemap.xml with all public routes + published blog articles.</p>
        </div>
        <div className="flex gap-2">
          <button onClick={generate} className="px-4 py-2 text-xs font-semibold rounded-xl bg-blue-600 text-white hover:bg-blue-700 transition-colors">Generate</button>
          {sitemapXml && <button onClick={download} className="px-4 py-2 text-xs font-semibold rounded-xl bg-green-600 text-white hover:bg-green-700 transition-colors">Download</button>}
        </div>
      </div>
      {sitemapXml && (
        <div>
          <p className="text-xs text-green-700 font-semibold mb-2">✓ Generated — {sitemapXml.split('<url>').length - 1} URLs</p>
          <textarea readOnly value={sitemapXml} rows={8} className="w-full font-mono text-xs border border-gray-200 rounded-xl p-3 bg-white resize-none text-gray-700" />
          <p className="text-xs text-gray-400 mt-2">Upload sitemap.xml to your web root, then submit it via Google Search Console.</p>
        </div>
      )}
    </div>
  );
}

function RobotsGenerator() {
  const [copied, setCopied] = useState(false);
  const content = `User-agent: *
Allow: /

Sitemap: https://theearlyyearscompany.com/sitemap.xml

# Disallow admin routes
Disallow: /admin
Disallow: /admin/*`;

  const copy = () => {
    navigator.clipboard.writeText(content).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  };

  const download = () => {
    const blob = new Blob([content], { type: 'text/plain' });
    const a = document.createElement('a');
    a.href = URL.createObjectURL(blob);
    a.download = 'robots.txt';
    a.click();
  };

  return (
    <div className="mt-6 p-4 bg-gray-50 rounded-2xl border border-gray-100">
      <div className="flex items-center justify-between mb-3">
        <div>
          <h4 className="font-semibold text-sm text-gray-800">robots.txt</h4>
          <p className="text-xs text-gray-500 mt-0.5">Upload this file to your web root at <code className="bg-gray-100 px-1 rounded">https://theearlyyearscompany.com/robots.txt</code></p>
        </div>
        <div className="flex gap-2">
          <button onClick={copy} className="px-3 py-1.5 text-xs font-semibold rounded-xl bg-gray-200 text-gray-700 hover:bg-gray-300 transition-colors">{copied ? '✓ Copied' : 'Copy'}</button>
          <button onClick={download} className="px-3 py-1.5 text-xs font-semibold rounded-xl bg-green-600 text-white hover:bg-green-700 transition-colors">Download</button>
        </div>
      </div>
      <pre className="text-xs font-mono bg-white border border-gray-200 rounded-xl p-3 text-gray-700 whitespace-pre-wrap">{content}</pre>
    </div>
  );
}

function SEOSection({ cms, onChange }: { cms: CMSContent; onChange: (c: CMSContent) => void }) {
  const s = cms.seo;
  const upd = (k: string, v: string) => onChange({ ...cms, seo: { ...s, [k]: v } });
  const pairs: Array<[string, string, string, string]> = [
    ['homepageTitle', 'homepageDescription', '🏠 Homepage', '/'],
    ['daycareTitle', 'daycareDescription', '🌈 Daycare', '/daycare'],
    ['eduhubTitle', 'eduhubDescription', '🎓 EduHub', '/eduhub'],
    ['blogTitle', 'blogDescription', '📰 Blog', '/blog'],
  ];
  return (
    <div>
      <SectionHeader title="SEO" description="Page titles and meta descriptions. These update the browser tab and search engine snippets." />
      {pairs.map(([tk, dk, label, path]) => (
        <div key={tk} className="mb-6 p-4 bg-gray-50 rounded-2xl border border-gray-100">
          <div className="flex items-center gap-2 mb-3">
            <span className="font-semibold text-sm text-gray-700">{label}</span>
            <span className="text-xs text-gray-400">{path}</span>
          </div>
          <Field label="SEO Title" hint="~60 characters recommended">
            <input className={inputCls} value={(s as Record<string, string>)[tk]} onChange={e => upd(tk, e.target.value)} />
            <span className="text-xs text-gray-400">{((s as Record<string, string>)[tk] || '').length}/60</span>
          </Field>
          <Field label="Meta Description" hint="~155 characters recommended">
            <textarea className={inputCls} rows={2} value={(s as Record<string, string>)[dk]} onChange={e => upd(dk, e.target.value)} />
            <span className="text-xs text-gray-400">{((s as Record<string, string>)[dk] || '').length}/155</span>
          </Field>
        </div>
      ))}
      <Field label="Default Open Graph Image URL" hint="Used as fallback OG image when no page-specific image is set.">
        <input className={inputCls} value={s.defaultOGImage} onChange={e => upd('defaultOGImage', e.target.value)} placeholder="https://..." />
        {s.defaultOGImage && <img src={s.defaultOGImage} alt="" className="mt-2 h-20 rounded-lg object-cover" onError={e => (e.currentTarget.style.display = 'none')} />}
      </Field>

      <SitemapGenerator cms={cms} />
      <RobotsGenerator />
    </div>
  );
}

// ─── CTA Settings ─────────────────────────────────────────────────────────────

function CTASection({ cms, onChange }: { cms: CMSContent; onChange: (c: CMSContent) => void }) {
  const c = cms.ctaSettings;
  const updGroup = (brand: 'daycare' | 'eduhub', k: string, v: string) =>
    onChange({ ...cms, ctaSettings: { ...c, [brand]: { ...c[brand], [k]: v } } });
  const updGlobal = (k: string, v: string) => onChange({ ...cms, ctaSettings: { ...c, [k]: v } });

  const CTAGroupEditor = ({ brand, label }: { brand: 'daycare' | 'eduhub'; label: string }) => {
    const g = c[brand];
    return (
      <div className="mb-6 p-4 bg-gray-50 rounded-2xl border border-gray-100">
        <h4 className="font-semibold text-sm text-gray-700 mb-4">{label}</h4>
        <div className="grid md:grid-cols-2 gap-x-4">
          <Field label="Primary Button Label"><input className={inputCls} value={g.primaryLabel} onChange={e => updGroup(brand, 'primaryLabel', e.target.value)} /></Field>
          <Field label="Primary Button Link"><input className={inputCls} value={g.primaryLink} onChange={e => updGroup(brand, 'primaryLink', e.target.value)} /></Field>
          <Field label="Secondary Button Label"><input className={inputCls} value={g.secondaryLabel} onChange={e => updGroup(brand, 'secondaryLabel', e.target.value)} /></Field>
          <Field label="Secondary Button Link"><input className={inputCls} value={g.secondaryLink} onChange={e => updGroup(brand, 'secondaryLink', e.target.value)} /></Field>
          <Field label="Mobile Sticky Primary Label"><input className={inputCls} value={g.stickyPrimaryLabel} onChange={e => updGroup(brand, 'stickyPrimaryLabel', e.target.value)} /></Field>
          <Field label="Mobile Sticky Primary Link"><input className={inputCls} value={g.stickyPrimaryLink} onChange={e => updGroup(brand, 'stickyPrimaryLink', e.target.value)} /></Field>
          <Field label="Mobile Sticky Secondary Label"><input className={inputCls} value={g.stickySecondaryLabel} onChange={e => updGroup(brand, 'stickySecondaryLabel', e.target.value)} /></Field>
          <Field label="Mobile Sticky Secondary Link"><input className={inputCls} value={g.stickySecondaryLink} onChange={e => updGroup(brand, 'stickySecondaryLink', e.target.value)} /></Field>
        </div>
      </div>
    );
  };

  return (
    <div>
      <SectionHeader title="CTA Settings" description="Control all call-to-action buttons across the public website." />
      <CTAGroupEditor brand="daycare" label="🌈 Daycare CTAs" />
      <CTAGroupEditor brand="eduhub" label="🎓 EduHub CTAs" />
      <div className="p-4 bg-gray-50 rounded-2xl border border-gray-100">
        <h4 className="font-semibold text-sm text-gray-700 mb-4">🏠 Homepage Cards</h4>
        <div className="grid md:grid-cols-2 gap-x-4">
          <Field label="Daycare Card Label"><input className={inputCls} value={c.homepageDaycareLabel} onChange={e => updGlobal('homepageDaycareLabel', e.target.value)} /></Field>
          <Field label="Daycare Card Link"><input className={inputCls} value={c.homepageDaycareLink} onChange={e => updGlobal('homepageDaycareLink', e.target.value)} /></Field>
          <Field label="EduHub Card Label"><input className={inputCls} value={c.homepageEduhubLabel} onChange={e => updGlobal('homepageEduhubLabel', e.target.value)} /></Field>
          <Field label="EduHub Card Link"><input className={inputCls} value={c.homepageEduhubLink} onChange={e => updGlobal('homepageEduhubLink', e.target.value)} /></Field>
        </div>
      </div>
    </div>
  );
}

// ─── Form Settings ────────────────────────────────────────────────────────────

function FormSettingsSection({ cms, onChange }: { cms: CMSContent; onChange: (c: CMSContent) => void }) {
  const f = cms.formSettings;
  const upd = (k: keyof typeof f, v: string | boolean) => onChange({ ...cms, formSettings: { ...f, [k]: v } });
  const missingEndpoints = f.emailEndpointEnabled && (!f.daycareEndpoint || !f.eduhubEndpoint || !f.generalEndpoint);
  return (
    <div>
      <SectionHeader title="Form Settings" description="Control where enquiries go and what users see after submitting." />
      {missingEndpoints && (
        <div className="mb-5 flex items-start gap-3 p-4 bg-amber-50 border border-amber-200 rounded-xl">
          <AlertTriangle className="w-5 h-5 text-amber-500 flex-shrink-0 mt-0.5" />
          <div>
            <p className="text-sm font-semibold text-amber-800">Email delivery not fully configured</p>
            <p className="text-xs text-amber-700 mt-1 leading-relaxed">
              Submissions are saved in the CMS Submissions inbox, but email delivery is not configured for one or more forms. Add an endpoint URL (Webhook, Zapier, Make, etc.) or disable email delivery below.
            </p>
          </div>
        </div>
      )}
      <div className="grid md:grid-cols-3 gap-4 mb-6">
        <div className="p-4 bg-orange-50 rounded-xl border border-orange-100">
          <h4 className="font-semibold text-sm text-orange-800 mb-3">Daycare Form</h4>
          <Field label="Destination Email"><input className={inputCls} type="email" value={f.daycareEmail} onChange={e => upd('daycareEmail', e.target.value)} /></Field>
          <Field label="External Endpoint URL" hint="Leave empty to use Web3Forms"><input className={inputCls} value={f.daycareEndpoint} onChange={e => upd('daycareEndpoint', e.target.value)} /></Field>
          <Field label="Thank-You Message"><textarea className={inputCls} rows={2} value={f.daycareThankyou} onChange={e => upd('daycareThankyou', e.target.value)} /></Field>
        </div>
        <div className="p-4 bg-blue-50 rounded-xl border border-blue-100">
          <h4 className="font-semibold text-sm text-blue-800 mb-3">EduHub Form</h4>
          <Field label="Destination Email"><input className={inputCls} type="email" value={f.eduhubEmail} onChange={e => upd('eduhubEmail', e.target.value)} /></Field>
          <Field label="External Endpoint URL" hint="Leave empty to use Web3Forms"><input className={inputCls} value={f.eduhubEndpoint} onChange={e => upd('eduhubEndpoint', e.target.value)} /></Field>
          <Field label="Thank-You Message"><textarea className={inputCls} rows={2} value={f.eduhubThankyou} onChange={e => upd('eduhubThankyou', e.target.value)} /></Field>
        </div>
        <div className="p-4 bg-gray-50 rounded-xl border border-gray-100">
          <h4 className="font-semibold text-sm text-gray-800 mb-3">General Contact</h4>
          <Field label="Destination Email"><input className={inputCls} type="email" value={f.generalEmail} onChange={e => upd('generalEmail', e.target.value)} /></Field>
          <Field label="External Endpoint URL"><input className={inputCls} value={f.generalEndpoint} onChange={e => upd('generalEndpoint', e.target.value)} /></Field>
          <Field label="Thank-You Message"><textarea className={inputCls} rows={2} value={f.generalThankyou} onChange={e => upd('generalThankyou', e.target.value)} /></Field>
        </div>
      </div>
      <div className="p-4 bg-gray-50 rounded-xl border border-gray-100">
        <h4 className="font-semibold text-sm text-gray-700 mb-3">Global Behaviour</h4>
        <Field label="WhatsApp Number"><input className={inputCls} value={f.whatsapp} onChange={e => upd('whatsapp', e.target.value)} /></Field>
        <div className="flex flex-wrap gap-4 mt-2">
          <Toggle value={f.storeLocalCopy} onChange={v => upd('storeLocalCopy', v)} label="Store local copy in Submissions Inbox" />
          <Toggle value={f.emailEndpointEnabled} onChange={v => upd('emailEndpointEnabled', v)} label="Email endpoint enabled" />
          <Toggle value={f.redirectToWhatsApp} onChange={v => upd('redirectToWhatsApp', v)} label="Redirect to WhatsApp after submit" />
        </div>
      </div>
    </div>
  );
}

// ─── Media Library ────────────────────────────────────────────────────────────

function MediaSection({ cms, onChange }: { cms: CMSContent; onChange: (c: CMSContent) => void }) {
  const [editing, setEditing] = useState<CMSMediaItem | null>(null);
  const [search, setSearch] = useState('');
  const [catFilter, setCatFilter] = useState('All');
  const [altFilter, setAltFilter] = useState(false);
  const CATS = ['Daycare', 'EduHub', 'Campus', 'Educators', 'Blog', 'Testimonials', 'General'] as const;
  const usage = useMemo(() => scanMediaUsage(cms), [cms]);

  const filtered = cms.media.filter(m => {
    const matchSearch = m.title.toLowerCase().includes(search.toLowerCase()) || m.category.toLowerCase().includes(search.toLowerCase());
    const matchCat = catFilter === 'All' || m.category === catFilter;
    const matchAlt = !altFilter || !m.alt;
    const matchUnused = catFilter !== 'Unused' || !usage[m.url]?.length;
    return matchSearch && (catFilter === 'Unused' ? matchUnused : matchCat) && matchAlt;
  });

  const empty: CMSMediaItem = { id: '', title: '', url: '', alt: '', category: 'General', status: 'published' };

  const save = (item: CMSMediaItem) => {
    const updated = !item.id ? [...cms.media, { ...item, id: generateId() }] : cms.media.map(m => m.id === item.id ? item : m);
    onChange({ ...cms, media: updated });
    setEditing(null);
  };

  return (
    <div>
      <SectionHeader title="Media Library" description="Manage image URLs used across the site." />
      <div className="flex items-center gap-2 mb-4 p-3 bg-blue-50 border border-blue-100 rounded-xl text-xs text-blue-700">
        <Globe className="w-4 h-4 flex-shrink-0" />
        Use hosted image URLs (Unsplash, Cloudinary, etc.). File uploads are not supported — link to externally hosted images.
      </div>
      <div className="flex flex-wrap gap-2 mb-4">
        <div className="relative flex-1 min-w-48"><Search className="absolute left-3 top-2.5 w-4 h-4 text-gray-400" /><input className={inputCls + ' pl-9'} placeholder="Search…" value={search} onChange={e => setSearch(e.target.value)} /></div>
        {['All', ...CATS, 'Unused'].map(c => <button key={c} onClick={() => setCatFilter(c)} className={`px-3 py-1.5 rounded-full text-xs font-semibold transition-all ${catFilter === c ? 'bg-orange-500 text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}>{c}</button>)}
        <button onClick={() => setAltFilter(!altFilter)} className={`px-3 py-1.5 rounded-full text-xs font-semibold transition-all ${altFilter ? 'bg-amber-500 text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}>Missing Alt</button>
        <button className={btnPrimary} onClick={() => setEditing({ ...empty })}><Plus className="w-3.5 h-3.5" />Add Image</button>
      </div>
      {filtered.length === 0 ? <EmptyState message="No media items match your filters." action="Add Image" onAction={() => setEditing({ ...empty })} /> : (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {filtered.map(m => {
            const usedIn = usage[m.url] || [];
            return (
              <div key={m.id} className="border border-gray-100 rounded-2xl overflow-hidden bg-white shadow-sm hover:shadow-md transition-shadow">
                {m.url ? <img src={m.url} alt={m.alt || ''} className="w-full h-32 object-cover" onError={e => (e.currentTarget.style.display = 'none')} /> : <div className="w-full h-32 bg-gray-100 flex items-center justify-center text-gray-400 text-xs">No URL</div>}
                <div className="p-3">
                  <div className="font-semibold text-sm truncate mb-1">{m.title || '(untitled)'}</div>
                  <div className="flex flex-wrap gap-1 mb-2">
                    <Badge color="bg-blue-100 text-blue-700">{m.category}</Badge>
                    {!m.alt && <Badge color="bg-amber-100 text-amber-700">No alt text</Badge>}
                    {usedIn.length === 0 && <Badge color="bg-gray-100 text-gray-500">Unused</Badge>}
                  </div>
                  {usedIn.length > 0 && <div className="text-xs text-gray-500 mb-2">{usedIn.slice(0, 2).join(', ')}{usedIn.length > 2 ? ` +${usedIn.length - 2} more` : ''}</div>}
                  <div className="flex gap-1">
                    <button className={btnGhost} onClick={() => setEditing(m)}><Pencil className="w-3.5 h-3.5" /></button>
                    <button className={btnDanger} onClick={() => onChange({ ...cms, media: cms.media.filter(x => x.id !== m.id) })}><Trash2 className="w-3.5 h-3.5" /></button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
      {editing && (
        <Modal title={editing.id ? 'Edit Image' : 'Add Image'} onClose={() => setEditing(null)}>
          <Field label="Title" required><input className={inputCls} value={editing.title} onChange={e => setEditing({ ...editing, title: e.target.value })} /></Field>
          <Field label="Image URL" required><input className={inputCls} value={editing.url} onChange={e => setEditing({ ...editing, url: e.target.value })} placeholder="https://…" /></Field>
          {editing.url && <img src={editing.url} alt="" className="w-full h-36 object-cover rounded-xl mb-4" onError={e => (e.currentTarget.style.display = 'none')} />}
          <Field label="Alt Text" hint="Describe the image for accessibility."><input className={inputCls} value={editing.alt} onChange={e => setEditing({ ...editing, alt: e.target.value })} /></Field>
          <Field label="Category"><select className={inputCls} value={editing.category} onChange={e => setEditing({ ...editing, category: e.target.value as CMSMediaItem['category'] })}>{CATS.map(c => <option key={c}>{c}</option>)}</select></Field>
          <div className="flex gap-2 justify-end mt-4">
            <button className={btnSecondary} onClick={() => setEditing(null)}>Cancel</button>
            <button className={btnPrimary} onClick={() => save(editing)} disabled={!editing.title || !editing.url}>Save</button>
          </div>
        </Modal>
      )}
    </div>
  );
}

// ─── Generic list helpers ─────────────────────────────────────────────────────

function useListEditor<T extends { id: string; status?: CMSStatus; active?: boolean; featured?: boolean; displayOrder?: number }>(
  items: T[],
  onUpdate: (updated: T[]) => void,
) {
  const sorted = [...items].sort((a, b) => (a.displayOrder ?? 0) - (b.displayOrder ?? 0));

  const save = (item: T) => {
    const isNew = !item.id;
    onUpdate(isNew ? [...items, { ...item, id: generateId() }] : items.map(x => x.id === item.id ? item : x));
  };

  const del = (id: string) => onUpdate(items.filter(x => x.id !== id));

  const duplicate = (item: T) => {
    const clone = { ...item, id: generateId(), displayOrder: (item.displayOrder ?? 0) + 0.5 };
    onUpdate([...items, clone]);
  };

  const reorder = (id: string, dir: 'up' | 'down') => {
    const s = [...sorted];
    const idx = s.findIndex(x => x.id === id);
    if (dir === 'up' && idx > 0) [s[idx].displayOrder, s[idx - 1].displayOrder] = [s[idx - 1].displayOrder ?? 0, s[idx].displayOrder ?? 0];
    if (dir === 'down' && idx < s.length - 1) [s[idx].displayOrder, s[idx + 1].displayOrder] = [s[idx + 1].displayOrder ?? 0, s[idx].displayOrder ?? 0];
    onUpdate(s);
  };

  return { sorted, save, del, duplicate, reorder };
}

// ─── Educators ────────────────────────────────────────────────────────────────

function EducatorsSection({ cms, onChange, initialNew }: { cms: CMSContent; onChange: (c: CMSContent) => void; initialNew?: boolean }) {
  const { sorted, save, del, duplicate, reorder } = useListEditor(cms.educators, eds => onChange({ ...cms, educators: eds }));
  const [editing, setEditing] = useState<CMSEducator | null>(initialNew ? { id: '', name: '', displayOrder: sorted.length + 1, title: '', qualification: '', specialtyBadge: '', bio: '', img: '', featured: false, leadership: false, status: 'published' } : null);
  const [confirm, setConfirm] = useState<string | null>(null);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<CMSStatus | 'all'>('all');

  const filtered = sorted.filter(e => {
    const matchSearch = e.name.toLowerCase().includes(search.toLowerCase()) || e.title.toLowerCase().includes(search.toLowerCase());
    const matchStatus = statusFilter === 'all' || getStatus(e) === statusFilter;
    return matchSearch && matchStatus;
  });

  const empty: CMSEducator = { id: '', name: '', displayOrder: sorted.length + 1, title: '', qualification: '', specialtyBadge: '', bio: '', img: '', featured: false, leadership: false, status: 'published' };

  return (
    <div>
      <SectionHeader title="Company Team" description="Manage the verified team shown across Daycare and EduHub. Nesreen and Lamia appear in both; EduHub also displays its training and quality team." />
      <div className="flex flex-wrap gap-2 mb-4">
        <div className="relative flex-1 min-w-40"><Search className="absolute left-3 top-2.5 w-4 h-4 text-gray-400" /><input className={inputCls + ' pl-9'} placeholder="Search…" value={search} onChange={e => setSearch(e.target.value)} /></div>
        {(['all', 'published', 'draft', 'hidden'] as const).map(s => <button key={s} onClick={() => setStatusFilter(s)} className={`px-3 py-1.5 rounded-full text-xs font-semibold capitalize transition-all ${statusFilter === s ? 'bg-orange-500 text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}>{s}</button>)}
        <button className={btnPrimary} onClick={() => setEditing({ ...empty })}><Plus className="w-3.5 h-3.5" />Add Educator</button>
      </div>
      {filtered.length === 0 ? <EmptyState message="No educators found." action="Add Educator" onAction={() => setEditing({ ...empty })} /> : (
        <div className="space-y-2">
          {filtered.map((ed, i) => (
            <div key={ed.id} className="flex items-center gap-3 p-3 rounded-xl border border-gray-100 bg-white hover:border-orange-100 transition-colors">
              <ReorderBtns onUp={() => reorder(ed.id, 'up')} onDown={() => reorder(ed.id, 'down')} first={i === 0} last={i === filtered.length - 1} />
              <img src={ed.img || ''} alt={ed.name} className="w-11 h-11 rounded-full object-cover flex-shrink-0 bg-gray-100" onError={e => (e.currentTarget.style.background = '#e5e7eb')} />
              <div className="flex-1 min-w-0">
                <div className="font-semibold text-sm text-gray-900">{ed.name}</div>
                <div className="text-xs text-gray-500">{ed.title}</div>
              </div>
              <div className="flex gap-1 flex-wrap">
                {ed.leadership && <Badge color="bg-orange-100 text-orange-700">Leadership</Badge>}
                {ed.featured && <FeaturedPill />}
                <StatusPill status={ed.status} />
              </div>
              <div className="flex gap-1">
                <button className={btnGhost} onClick={() => setEditing(ed)}><Pencil className="w-3.5 h-3.5" /></button>
                <button className={btnGhost} onClick={() => duplicate(ed)}><Copy className="w-3.5 h-3.5" /></button>
                <button className={btnDanger} onClick={() => setConfirm(ed.id)}><Trash2 className="w-3.5 h-3.5" /></button>
              </div>
            </div>
          ))}
        </div>
      )}
      {editing && (
        <Modal title={editing.id ? `Edit — ${editing.name}` : 'Add Educator'} onClose={() => setEditing(null)} wide>
          <div className="grid md:grid-cols-2 gap-x-4">
            <Field label="Name" required><input className={inputCls} value={editing.name} onChange={e => setEditing({ ...editing, name: e.target.value })} /></Field>
            <Field label="Title / Role" required><input className={inputCls} value={editing.title} onChange={e => setEditing({ ...editing, title: e.target.value })} /></Field>
            <Field label="Qualification"><input className={inputCls} value={editing.qualification} onChange={e => setEditing({ ...editing, qualification: e.target.value })} /></Field>
            <Field label="Specialty Badge"><input className={inputCls} value={editing.specialtyBadge} onChange={e => setEditing({ ...editing, specialtyBadge: e.target.value })} placeholder="e.g. 🏅 EYFS Specialist" /></Field>
            <Field label="Portrait Image URL"><input className={inputCls} value={editing.img} onChange={e => setEditing({ ...editing, img: e.target.value })} /></Field>
            <Field label="Display Order"><input className={inputCls} type="number" value={editing.displayOrder} onChange={e => setEditing({ ...editing, displayOrder: +e.target.value })} /></Field>
          </div>
          {editing.img && <img src={editing.img} alt="" className="w-full h-40 object-cover object-top rounded-xl mb-4" onError={e => (e.currentTarget.style.display = 'none')} />}
          <Field label="Bio"><textarea className={inputCls} rows={4} value={editing.bio} onChange={e => setEditing({ ...editing, bio: e.target.value })} /></Field>
          <div className="grid md:grid-cols-2 gap-x-4">
            <Field label="Status"><StatusSelect value={editing.status} onChange={v => setEditing({ ...editing, status: v })} /></Field>
          </div>
          <div className="flex flex-wrap gap-4 mb-4">
            <Toggle value={editing.featured} onChange={v => setEditing({ ...editing, featured: v })} label="Featured" />
            <Toggle value={editing.leadership} onChange={v => setEditing({ ...editing, leadership: v })} label="Leadership highlight" />
          </div>
          <div className="flex gap-2 justify-end">
            <button className={btnSecondary} onClick={() => setEditing(null)}>Cancel</button>
            <button className={btnPrimary} onClick={() => { save(editing); setEditing(null); }} disabled={!editing.name || !editing.title}>Save</button>
          </div>
        </Modal>
      )}
      {confirm && <ConfirmModal message="Delete this educator? This cannot be undone." onConfirm={() => { del(confirm); setConfirm(null); }} onCancel={() => setConfirm(null)} />}
    </div>
  );
}

// ─── Testimonials ─────────────────────────────────────────────────────────────

function TestimonialsSection({ cms, onChange, initialNew }: { cms: CMSContent; onChange: (c: CMSContent) => void; initialNew?: boolean }) {
  const { sorted, save, del, duplicate, reorder } = useListEditor(cms.testimonials, ts => onChange({ ...cms, testimonials: ts }));
  const empty: CMSTestimonial = { id: '', name: '', role: '', quote: '', rating: 5, highlight: '', avatar: '', featured: false, status: 'published', displayOrder: sorted.length + 1 };
  const [editing, setEditing] = useState<CMSTestimonial | null>(initialNew ? { ...empty } : null);
  const [confirm, setConfirm] = useState<string | null>(null);

  return (
    <div>
      <SectionHeader title="Parent Reviews" description="Testimonials shown on the Daycare page. Featured items appear first." />
      <div className="flex justify-between items-center mb-4">
        <p className="text-sm text-gray-500">{sorted.length} review{sorted.length !== 1 ? 's' : ''} · {sorted.filter(isPublished).length} published</p>
        <button className={btnPrimary} onClick={() => setEditing({ ...empty })}><Plus className="w-3.5 h-3.5" />Add Review</button>
      </div>
      {sorted.length === 0 ? <EmptyState message="No testimonials yet." action="Add Review" onAction={() => setEditing({ ...empty })} /> : (
        <div className="space-y-2">
          {sorted.map((t, i) => (
            <div key={t.id} className="flex items-center gap-3 p-3 rounded-xl border border-gray-100 bg-white">
              <ReorderBtns onUp={() => reorder(t.id, 'up')} onDown={() => reorder(t.id, 'down')} first={i === 0} last={i === sorted.length - 1} />
              <img src={t.avatar || ''} alt={t.name} className="w-10 h-10 rounded-full object-cover flex-shrink-0 bg-gray-100" onError={e => (e.currentTarget.style.background = '#e5e7eb')} />
              <div className="flex-1 min-w-0">
                <div className="font-semibold text-sm">{t.name}</div>
                <div className="text-xs text-gray-500 truncate">{t.role}</div>
              </div>
              <span className="text-yellow-400 text-xs">{'★'.repeat(t.rating)}</span>
              {t.featured && <FeaturedPill />}
              <StatusPill status={t.status} />
              <div className="flex gap-1">
                <button className={btnGhost} onClick={() => setEditing(t)}><Pencil className="w-3.5 h-3.5" /></button>
                <button className={btnGhost} onClick={() => duplicate(t)}><Copy className="w-3.5 h-3.5" /></button>
                <button className={btnDanger} onClick={() => setConfirm(t.id)}><Trash2 className="w-3.5 h-3.5" /></button>
              </div>
            </div>
          ))}
        </div>
      )}
      {editing && (
        <Modal title={editing.id ? 'Edit Review' : 'Add Review'} onClose={() => setEditing(null)}>
          <div className="grid md:grid-cols-2 gap-x-4">
            <Field label="Parent Name" required><input className={inputCls} value={editing.name} onChange={e => setEditing({ ...editing, name: e.target.value })} /></Field>
            <Field label="Context"><input className={inputCls} value={editing.role} onChange={e => setEditing({ ...editing, role: e.target.value })} placeholder="Parent of Sara, Age 4" /></Field>
            <Field label="Highlight Tag"><input className={inputCls} value={editing.highlight} onChange={e => setEditing({ ...editing, highlight: e.target.value })} /></Field>
            <Field label="Rating (1–5)"><input className={inputCls} type="number" min={1} max={5} value={editing.rating} onChange={e => setEditing({ ...editing, rating: +e.target.value })} /></Field>
            <Field label="Avatar URL"><input className={inputCls} value={editing.avatar} onChange={e => setEditing({ ...editing, avatar: e.target.value })} /></Field>
            <Field label="Display Order"><input className={inputCls} type="number" value={editing.displayOrder} onChange={e => setEditing({ ...editing, displayOrder: +e.target.value })} /></Field>
          </div>
          <Field label="Review Text" required><textarea className={inputCls} rows={4} value={editing.quote} onChange={e => setEditing({ ...editing, quote: e.target.value })} /></Field>
          <Field label="Status"><StatusSelect value={editing.status} onChange={v => setEditing({ ...editing, status: v })} /></Field>
          <div className="flex flex-wrap gap-4 my-3"><Toggle value={editing.featured} onChange={v => setEditing({ ...editing, featured: v })} label="Featured (appears first)" /></div>
          <div className="flex gap-2 justify-end">
            <button className={btnSecondary} onClick={() => setEditing(null)}>Cancel</button>
            <button className={btnPrimary} onClick={() => { save(editing); setEditing(null); }} disabled={!editing.name || !editing.quote}>Save</button>
          </div>
        </Modal>
      )}
      {confirm && <ConfirmModal message="Delete this review?" onConfirm={() => { del(confirm); setConfirm(null); }} onCancel={() => setConfirm(null)} />}
    </div>
  );
}

// ─── Gallery ──────────────────────────────────────────────────────────────────

function GallerySection({ cms, onChange, initialNew }: { cms: CMSContent; onChange: (c: CMSContent) => void; initialNew?: boolean }) {
  const { sorted, save, del, duplicate, reorder } = useListEditor(cms.gallery, gs => onChange({ ...cms, gallery: gs }));
  const CATS = ['Classrooms', 'Activity Areas', 'Playground', 'Dining Area', 'Reading Corner', 'Campus'] as const;
  const empty: CMSGalleryItem = { id: '', url: '', alt: '', title: '', category: 'Classrooms', caption: '', featured: false, status: 'published', displayOrder: sorted.length + 1 };
  const [editing, setEditing] = useState<CMSGalleryItem | null>(initialNew ? { ...empty } : null);
  const [confirm, setConfirm] = useState<string | null>(null);

  return (
    <div>
      <SectionHeader title="Campus Gallery" description="Photos shown in the gallery section. Featured items appear first in their category." />
      <div className="flex justify-between items-center mb-4">
        <p className="text-sm text-gray-500">{sorted.length} image{sorted.length !== 1 ? 's' : ''}</p>
        <button className={btnPrimary} onClick={() => setEditing({ ...empty })}><Plus className="w-3.5 h-3.5" />Add Image</button>
      </div>
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
        {sorted.map((g, i) => (
          <div key={g.id} className={`border rounded-2xl overflow-hidden bg-white shadow-sm ${getStatus(g) !== 'published' ? 'opacity-60' : ''}`}>
            {g.url ? <img src={g.url} alt={g.alt} className="w-full h-28 object-cover" onError={e => (e.currentTarget.style.display = 'none')} /> : <div className="w-full h-28 bg-gray-100 flex items-center justify-center text-gray-400 text-xs">No URL</div>}
            <div className="p-3">
              <div className="font-semibold text-sm truncate">{g.title}</div>
              <div className="flex gap-1 mt-1 mb-2 flex-wrap">
                <Badge color="bg-gray-100 text-gray-600">{g.category}</Badge>
                {g.featured && <FeaturedPill />}
                <StatusPill status={g.status} />
              </div>
              <div className="flex gap-1">
                <button className={btnGhost} onClick={() => setEditing(g)}><Pencil className="w-3.5 h-3.5" /></button>
                <button className={btnGhost} onClick={() => duplicate(g)}><Copy className="w-3.5 h-3.5" /></button>
                <button className={btnDanger} onClick={() => setConfirm(g.id)}><Trash2 className="w-3.5 h-3.5" /></button>
              </div>
            </div>
          </div>
        ))}
      </div>
      {editing && (
        <Modal title={editing.id ? 'Edit Image' : 'Add Image'} onClose={() => setEditing(null)}>
          <Field label="Image URL" required><input className={inputCls} value={editing.url} onChange={e => setEditing({ ...editing, url: e.target.value })} /></Field>
          {editing.url && <img src={editing.url} alt="" className="w-full h-36 object-cover rounded-xl mb-4" onError={e => (e.currentTarget.style.display = 'none')} />}
          <div className="grid md:grid-cols-2 gap-x-4">
            <Field label="Title" required><input className={inputCls} value={editing.title} onChange={e => setEditing({ ...editing, title: e.target.value })} /></Field>
            <Field label="Alt Text" hint="Describe the image."><input className={inputCls} value={editing.alt} onChange={e => setEditing({ ...editing, alt: e.target.value })} /></Field>
            <Field label="Category"><select className={inputCls} value={editing.category} onChange={e => setEditing({ ...editing, category: e.target.value as CMSGalleryItem['category'] })}>{CATS.map(c => <option key={c}>{c}</option>)}</select></Field>
            <Field label="Caption"><input className={inputCls} value={editing.caption} onChange={e => setEditing({ ...editing, caption: e.target.value })} /></Field>
            <Field label="Display Order"><input className={inputCls} type="number" value={editing.displayOrder} onChange={e => setEditing({ ...editing, displayOrder: +e.target.value })} /></Field>
          </div>
          <Field label="Status"><StatusSelect value={editing.status} onChange={v => setEditing({ ...editing, status: v })} /></Field>
          <div className="flex flex-wrap gap-4 my-3"><Toggle value={editing.featured} onChange={v => setEditing({ ...editing, featured: v })} label="Featured" /></div>
          <div className="flex gap-2 justify-end">
            <button className={btnSecondary} onClick={() => setEditing(null)}>Cancel</button>
            <button className={btnPrimary} onClick={() => { save(editing); setEditing(null); }} disabled={!editing.title || !editing.url}>Save</button>
          </div>
        </Modal>
      )}
      {confirm && <ConfirmModal message="Delete this image?" onConfirm={() => { del(confirm); setConfirm(null); }} onCancel={() => setConfirm(null)} />}
    </div>
  );
}

// ─── Programs ─────────────────────────────────────────────────────────────────

function ProgramsSection({ cms, onChange }: { cms: CMSContent; onChange: (c: CMSContent) => void }) {
  const { sorted, save, del, reorder } = useListEditor(cms.programs, ps => onChange({ ...cms, programs: ps }));
  const empty: CMSProgram = { id: '', name: '', ageRange: '', emoji: '📚', description: '', ratio: '', maxClassSize: '', features: [], status: 'published', displayOrder: sorted.length + 1 };
  const [editing, setEditing] = useState<CMSProgram | null>(null);
  const [confirm, setConfirm] = useState<string | null>(null);

  return (
    <div>
      <SectionHeader title="Daycare Programs" description="Age-based classes shown on the Programs page." />
      <div className="flex justify-between items-center mb-4">
        <p className="text-sm text-gray-500">{sorted.length} program{sorted.length !== 1 ? 's' : ''}</p>
        <button className={btnPrimary} onClick={() => setEditing({ ...empty })}><Plus className="w-3.5 h-3.5" />Add Program</button>
      </div>
      <div className="space-y-2">
        {sorted.map((p, i) => (
          <div key={p.id} className="flex items-center gap-3 p-3 rounded-xl border border-gray-100 bg-white">
            <ReorderBtns onUp={() => reorder(p.id, 'up')} onDown={() => reorder(p.id, 'down')} first={i === 0} last={i === sorted.length - 1} />
            <span className="text-2xl">{p.emoji}</span>
            <div className="flex-1"><div className="font-semibold text-sm">{p.name}</div><div className="text-xs text-gray-500">{p.ageRange} · {p.ratio}</div></div>
            <StatusPill status={p.status} />
            <div className="flex gap-1">
              <button className={btnGhost} onClick={() => setEditing(p)}><Pencil className="w-3.5 h-3.5" /></button>
              <button className={btnDanger} onClick={() => setConfirm(p.id)}><Trash2 className="w-3.5 h-3.5" /></button>
            </div>
          </div>
        ))}
      </div>
      {editing && (
        <Modal title={editing.id ? 'Edit Program' : 'Add Program'} onClose={() => setEditing(null)}>
          <div className="grid md:grid-cols-2 gap-x-4">
            <Field label="Program Name" required><input className={inputCls} value={editing.name} onChange={e => setEditing({ ...editing, name: e.target.value })} /></Field>
            <Field label="Age Range"><input className={inputCls} value={editing.ageRange} onChange={e => setEditing({ ...editing, ageRange: e.target.value })} /></Field>
            <Field label="Emoji"><input className={inputCls} value={editing.emoji} onChange={e => setEditing({ ...editing, emoji: e.target.value })} /></Field>
            <Field label="Ratio"><input className={inputCls} value={editing.ratio} onChange={e => setEditing({ ...editing, ratio: e.target.value })} /></Field>
            <Field label="Max Class Size"><input className={inputCls} value={editing.maxClassSize} onChange={e => setEditing({ ...editing, maxClassSize: e.target.value })} /></Field>
            <Field label="Display Order"><input className={inputCls} type="number" value={editing.displayOrder} onChange={e => setEditing({ ...editing, displayOrder: +e.target.value })} /></Field>
          </div>
          <Field label="Description"><textarea className={inputCls} rows={2} value={editing.description} onChange={e => setEditing({ ...editing, description: e.target.value })} /></Field>
          <Field label="Key Features (one per line)"><textarea className={inputCls} rows={3} value={editing.features.join('\n')} onChange={e => setEditing({ ...editing, features: e.target.value.split('\n').filter(Boolean) })} /></Field>
          <Field label="Status"><StatusSelect value={editing.status} onChange={v => setEditing({ ...editing, status: v })} /></Field>
          <div className="flex gap-2 justify-end mt-4">
            <button className={btnSecondary} onClick={() => setEditing(null)}>Cancel</button>
            <button className={btnPrimary} onClick={() => { save(editing); setEditing(null); }} disabled={!editing.name}>Save</button>
          </div>
        </Modal>
      )}
      {confirm && <ConfirmModal message="Delete this program?" onConfirm={() => { del(confirm); setConfirm(null); }} onCancel={() => setConfirm(null)} />}
    </div>
  );
}

// ─── Schedule ─────────────────────────────────────────────────────────────────

function ScheduleSection({ cms, onChange }: { cms: CMSContent; onChange: (c: CMSContent) => void }) {
  const { sorted, save, del, reorder } = useListEditor(cms.schedule, ss => onChange({ ...cms, schedule: ss }));
  const empty: CMSScheduleStep = { id: '', time: '', title: '', emoji: '🕐', description: '', whyItMatters: '', outcomes: [], displayOrder: sorted.length + 1, status: 'published' };
  const [editing, setEditing] = useState<CMSScheduleStep | null>(null);
  const [confirm, setConfirm] = useState<string | null>(null);

  return (
    <div>
      <SectionHeader title="Daily Schedule" description="The day timeline shown in the 'A Day at Early Years' section." />
      <div className="flex justify-between items-center mb-4">
        <p className="text-sm text-gray-500">{sorted.length} time slots</p>
        <button className={btnPrimary} onClick={() => setEditing({ ...empty })}><Plus className="w-3.5 h-3.5" />Add Step</button>
      </div>
      <div className="space-y-2">
        {sorted.map((s, i) => (
          <div key={s.id} className="flex items-center gap-3 p-3 rounded-xl border border-gray-100 bg-white">
            <ReorderBtns onUp={() => reorder(s.id, 'up')} onDown={() => reorder(s.id, 'down')} first={i === 0} last={i === sorted.length - 1} />
            <span className="text-xl">{s.emoji}</span>
            <div className="flex-1"><div className="font-semibold text-sm">{s.time} — {s.title}</div></div>
            <StatusPill status={s.status} />
            <div className="flex gap-1">
              <button className={btnGhost} onClick={() => setEditing(s)}><Pencil className="w-3.5 h-3.5" /></button>
              <button className={btnDanger} onClick={() => setConfirm(s.id)}><Trash2 className="w-3.5 h-3.5" /></button>
            </div>
          </div>
        ))}
      </div>
      {editing && (
        <Modal title={editing.id ? 'Edit Step' : 'Add Step'} onClose={() => setEditing(null)}>
          <div className="grid md:grid-cols-2 gap-x-4">
            <Field label="Time" required><input className={inputCls} value={editing.time} onChange={e => setEditing({ ...editing, time: e.target.value })} placeholder="e.g. 9:00 AM" /></Field>
            <Field label="Title" required><input className={inputCls} value={editing.title} onChange={e => setEditing({ ...editing, title: e.target.value })} /></Field>
            <Field label="Emoji"><input className={inputCls} value={editing.emoji} onChange={e => setEditing({ ...editing, emoji: e.target.value })} /></Field>
            <Field label="Display Order"><input className={inputCls} type="number" value={editing.displayOrder} onChange={e => setEditing({ ...editing, displayOrder: +e.target.value })} /></Field>
          </div>
          <Field label="Description"><textarea className={inputCls} rows={3} value={editing.description} onChange={e => setEditing({ ...editing, description: e.target.value })} /></Field>
          <Field label="Why It Matters"><textarea className={inputCls} rows={2} value={editing.whyItMatters} onChange={e => setEditing({ ...editing, whyItMatters: e.target.value })} /></Field>
          <Field label="Outcomes (one per line)"><textarea className={inputCls} rows={3} value={editing.outcomes.join('\n')} onChange={e => setEditing({ ...editing, outcomes: e.target.value.split('\n').filter(Boolean) })} /></Field>
          <Field label="Status"><StatusSelect value={editing.status} onChange={v => setEditing({ ...editing, status: v })} /></Field>
          <div className="flex gap-2 justify-end mt-4">
            <button className={btnSecondary} onClick={() => setEditing(null)}>Cancel</button>
            <button className={btnPrimary} onClick={() => { save(editing); setEditing(null); }} disabled={!editing.time || !editing.title}>Save</button>
          </div>
        </Modal>
      )}
      {confirm && <ConfirmModal message="Delete this schedule step?" onConfirm={() => { del(confirm); setConfirm(null); }} onCancel={() => setConfirm(null)} />}
    </div>
  );
}

// ─── Meals ────────────────────────────────────────────────────────────────────

function MealsSection({ cms, onChange }: { cms: CMSContent; onChange: (c: CMSContent) => void }) {
  const m = cms.meals;
  const [activeMenu, setActiveMenu] = useState<string>(m.menus[0]?.id || '');
  const menu = m.menus.find(x => x.id === activeMenu);
  const updMenu = (id: string, days: typeof m.menus[0]['days']) => onChange({ ...cms, meals: { ...m, menus: m.menus.map(x => x.id === id ? { ...x, days } : x) } });

  return (
    <div>
      <SectionHeader title="Meals & Weekly Menu" description="The rotating weekly meal menus and snack lists." />
      <div className="flex flex-wrap gap-2 mb-5">
        {m.menus.map(mn => (
          <button key={mn.id} onClick={() => setActiveMenu(mn.id)} className={`px-3 py-1.5 rounded-full text-xs font-semibold border transition-all ${activeMenu === mn.id ? 'bg-teal-600 text-white border-teal-600' : 'border-gray-200 text-gray-600 hover:border-teal-300'}`}>
            {mn.season === 'winter' ? '❄️' : '☀️'} {mn.season.charAt(0).toUpperCase() + mn.season.slice(1)} — Week {mn.week.slice(4)}
          </button>
        ))}
      </div>
      {menu && (
        <div className="mb-6">
          <h4 className="font-semibold text-sm text-gray-700 mb-3">Lunch Menu — Edit days below</h4>
          <div className="space-y-2">
            {menu.days.map((day, i) => (
              <div key={i} className="grid grid-cols-[72px_1fr_1fr_36px] gap-2 items-center">
                <span className="text-sm font-semibold text-gray-700">{day.day}</span>
                <input className={inputCls} value={day.lunch} placeholder="Lunch" onChange={e => { const nd = [...menu.days]; nd[i] = { ...nd[i], lunch: e.target.value }; updMenu(menu.id, nd); }} />
                <input className={inputCls} value={day.sides} placeholder="Sides" onChange={e => { const nd = [...menu.days]; nd[i] = { ...nd[i], sides: e.target.value }; updMenu(menu.id, nd); }} />
                <input className={inputCls} value={day.emoji} onChange={e => { const nd = [...menu.days]; nd[i] = { ...nd[i], emoji: e.target.value }; updMenu(menu.id, nd); }} />
              </div>
            ))}
          </div>
        </div>
      )}
      <div className="grid md:grid-cols-2 gap-4">
        <Field label="❄️ Winter Snacks (one per line)"><textarea className={inputCls} rows={5} value={m.winterSnacks.join('\n')} onChange={e => onChange({ ...cms, meals: { ...m, winterSnacks: e.target.value.split('\n').filter(Boolean) } })} /></Field>
        <Field label="☀️ Summer Snacks (one per line)"><textarea className={inputCls} rows={5} value={m.summerSnacks.join('\n')} onChange={e => onChange({ ...cms, meals: { ...m, summerSnacks: e.target.value.split('\n').filter(Boolean) } })} /></Field>
      </div>
      <Field label="Dietary Policy"><textarea className={inputCls} rows={3} value={m.dietaryPolicy} onChange={e => onChange({ ...cms, meals: { ...m, dietaryPolicy: e.target.value } })} /></Field>
    </div>
  );
}

// ─── EduHub Courses ───────────────────────────────────────────────────────────

function CoursesSection({ cms, onChange }: { cms: CMSContent; onChange: (c: CMSContent) => void }) {
  const { sorted, save, del, reorder } = useListEditor(cms.courses, cs => onChange({ ...cms, courses: cs }));
  const empty: CMSCourse = { id: '', level: '', title: '', description: '', duration: '', hours: '', cost: '', mode: 'Hybrid', status: 'Available', publishStatus: 'published', outcomes: [], ctaLabel: 'View Details', ctaLink: '/eduhub/programs', displayOrder: sorted.length + 1, color: 'from-blue-400 to-blue-600', lightBg: 'bg-blue-50', border: 'border-blue-200', tag: 'bg-blue-100 text-blue-700' };
  const [editing, setEditing] = useState<CMSCourse | null>(null);
  const [confirm, setConfirm] = useState<string | null>(null);

  return (
    <div>
      <SectionHeader title="EduHub Courses" description="CACHE qualification levels shown on the EduHub pages." />
      <div className="flex justify-between items-center mb-4">
        <p className="text-sm text-gray-500">{sorted.length} course{sorted.length !== 1 ? 's' : ''}</p>
        <button className={btnPrimary} onClick={() => setEditing({ ...empty })}><Plus className="w-3.5 h-3.5" />Add Course</button>
      </div>
      <div className="space-y-2">
        {sorted.map((c, i) => (
          <div key={c.id} className="flex items-center gap-3 p-3 rounded-xl border border-gray-100 bg-white">
            <ReorderBtns onUp={() => reorder(c.id, 'up')} onDown={() => reorder(c.id, 'down')} first={i === 0} last={i === sorted.length - 1} />
            <div className="flex-1"><div className="font-semibold text-sm">{c.level}</div><div className="text-xs text-gray-500">{c.title}</div></div>
            <Badge color={c.status === 'Available' ? 'bg-green-100 text-green-700' : 'bg-amber-100 text-amber-700'}>{c.status}</Badge>
            <StatusPill status={c.publishStatus} />
            <div className="flex gap-1">
              <button className={btnGhost} onClick={() => setEditing(c)}><Pencil className="w-3.5 h-3.5" /></button>
              <button className={btnDanger} onClick={() => setConfirm(c.id)}><Trash2 className="w-3.5 h-3.5" /></button>
            </div>
          </div>
        ))}
      </div>
      {editing && (
        <Modal title={editing.id ? 'Edit Course' : 'Add Course'} onClose={() => setEditing(null)} wide>
          <div className="grid md:grid-cols-2 gap-x-4">
            <Field label="Level" required><input className={inputCls} value={editing.level} onChange={e => setEditing({ ...editing, level: e.target.value })} placeholder="e.g. CACHE Level 3" /></Field>
            <Field label="Availability Status"><select className={inputCls} value={editing.status} onChange={e => setEditing({ ...editing, status: e.target.value as CMSCourse['status'] })}><option>Available</option><option>Fully Booked</option><option>Coming Soon</option></select></Field>
            <Field label="Course Title" required><input className={inputCls} value={editing.title} onChange={e => setEditing({ ...editing, title: e.target.value })} /></Field>
            <Field label="Duration"><input className={inputCls} value={editing.duration} onChange={e => setEditing({ ...editing, duration: e.target.value })} /></Field>
            <Field label="Weekly Hours"><input className={inputCls} value={editing.hours} onChange={e => setEditing({ ...editing, hours: e.target.value })} /></Field>
            <Field label="Cost"><input className={inputCls} value={editing.cost} onChange={e => setEditing({ ...editing, cost: e.target.value })} /></Field>
            <Field label="Mode"><input className={inputCls} value={editing.mode} onChange={e => setEditing({ ...editing, mode: e.target.value })} /></Field>
            <Field label="Display Order"><input className={inputCls} type="number" value={editing.displayOrder} onChange={e => setEditing({ ...editing, displayOrder: +e.target.value })} /></Field>
          </div>
          <Field label="Description"><textarea className={inputCls} rows={3} value={editing.description} onChange={e => setEditing({ ...editing, description: e.target.value })} /></Field>
          <Field label="Learning Outcomes (one per line)"><textarea className={inputCls} rows={4} value={editing.outcomes.join('\n')} onChange={e => setEditing({ ...editing, outcomes: e.target.value.split('\n').filter(Boolean) })} /></Field>
          <Field label="Publish Status"><StatusSelect value={editing.publishStatus} onChange={v => setEditing({ ...editing, publishStatus: v })} /></Field>
          <div className="flex gap-2 justify-end mt-4">
            <button className={btnSecondary} onClick={() => setEditing(null)}>Cancel</button>
            <button className={btnPrimary} onClick={() => { save(editing); setEditing(null); }} disabled={!editing.level || !editing.title}>Save</button>
          </div>
        </Modal>
      )}
      {confirm && <ConfirmModal message="Delete this course?" onConfirm={() => { del(confirm); setConfirm(null); }} onCancel={() => setConfirm(null)} />}
    </div>
  );
}

// ─── Alumni ───────────────────────────────────────────────────────────────────

function AlumniSection({ cms, onChange }: { cms: CMSContent; onChange: (c: CMSContent) => void }) {
  const { sorted, save, del } = useListEditor(cms.alumni, as => onChange({ ...cms, alumni: as }));
  const empty: CMSAlumni = { id: '', name: '', currentRole: '', completedCourse: '', quote: '', img: '', featured: false, status: 'published', colorAccent: 'bg-blue-600' };
  const [editing, setEditing] = useState<CMSAlumni | null>(null);
  const [confirm, setConfirm] = useState<string | null>(null);

  return (
    <div>
      <SectionHeader title="Alumni Spotlights" description="Graduate success stories shown on the EduHub page." />
      <div className="flex justify-between items-center mb-4">
        <p className="text-sm text-gray-500">{sorted.length} alumni</p>
        <button className={btnPrimary} onClick={() => setEditing({ ...empty })}><Plus className="w-3.5 h-3.5" />Add Alumni</button>
      </div>
      <div className="space-y-2">
        {sorted.map(a => (
          <div key={a.id} className="flex items-center gap-3 p-3 rounded-xl border border-gray-100 bg-white">
            <img src={a.img || ''} alt={a.name} className="w-10 h-10 rounded-full object-cover bg-gray-100 flex-shrink-0" onError={e => (e.currentTarget.style.background = '#e5e7eb')} />
            <div className="flex-1 min-w-0"><div className="font-semibold text-sm">{a.name}</div><div className="text-xs text-gray-500">{a.currentRole}</div></div>
            <Badge color="bg-indigo-100 text-indigo-700">{a.completedCourse}</Badge>
            {a.featured && <FeaturedPill />}
            <StatusPill status={a.status} />
            <div className="flex gap-1">
              <button className={btnGhost} onClick={() => setEditing(a)}><Pencil className="w-3.5 h-3.5" /></button>
              <button className={btnDanger} onClick={() => setConfirm(a.id)}><Trash2 className="w-3.5 h-3.5" /></button>
            </div>
          </div>
        ))}
      </div>
      {editing && (
        <Modal title={editing.id ? 'Edit Alumni' : 'Add Alumni'} onClose={() => setEditing(null)}>
          <div className="grid md:grid-cols-2 gap-x-4">
            <Field label="Name" required><input className={inputCls} value={editing.name} onChange={e => setEditing({ ...editing, name: e.target.value })} /></Field>
            <Field label="Current Role"><input className={inputCls} value={editing.currentRole} onChange={e => setEditing({ ...editing, currentRole: e.target.value })} /></Field>
            <Field label="Completed Course"><input className={inputCls} value={editing.completedCourse} onChange={e => setEditing({ ...editing, completedCourse: e.target.value })} /></Field>
            <Field label="Photo URL"><input className={inputCls} value={editing.img} onChange={e => setEditing({ ...editing, img: e.target.value })} /></Field>
          </div>
          <Field label="Quote"><textarea className={inputCls} rows={4} value={editing.quote} onChange={e => setEditing({ ...editing, quote: e.target.value })} /></Field>
          <Field label="Status"><StatusSelect value={editing.status} onChange={v => setEditing({ ...editing, status: v })} /></Field>
          <div className="flex flex-wrap gap-4 my-3"><Toggle value={editing.featured} onChange={v => setEditing({ ...editing, featured: v })} label="Featured" /></div>
          <div className="flex gap-2 justify-end">
            <button className={btnSecondary} onClick={() => setEditing(null)}>Cancel</button>
            <button className={btnPrimary} onClick={() => { save(editing); setEditing(null); }} disabled={!editing.name}>Save</button>
          </div>
        </Modal>
      )}
      {confirm && <ConfirmModal message="Delete this alumni?" onConfirm={() => { del(confirm); setConfirm(null); }} onCancel={() => setConfirm(null)} />}
    </div>
  );
}

// ─── Accreditation ────────────────────────────────────────────────────────────

function AccreditationSection({ cms, onChange }: { cms: CMSContent; onChange: (c: CMSContent) => void }) {
  const { sorted, save, del, reorder } = useListEditor(cms.accreditations, as => onChange({ ...cms, accreditations: as }));
  const empty: CMSAccreditation = { id: '', name: '', description: '', detail: '', logoUrl: '', externalLink: '', status: 'published', displayOrder: sorted.length + 1 };
  const [editing, setEditing] = useState<CMSAccreditation | null>(null);
  const [confirm, setConfirm] = useState<string | null>(null);

  return (
    <div>
      <SectionHeader title="Accreditation" description="UK accreditation partners shown on the EduHub page." />
      <div className="flex justify-between items-center mb-4">
        <p className="text-sm text-gray-500">{sorted.length} partner{sorted.length !== 1 ? 's' : ''}</p>
        <button className={btnPrimary} onClick={() => setEditing({ ...empty })}><Plus className="w-3.5 h-3.5" />Add Partner</button>
      </div>
      <div className="space-y-2">
        {sorted.map((a, i) => (
          <div key={a.id} className="flex items-center gap-3 p-3 rounded-xl border border-gray-100 bg-white">
            <ReorderBtns onUp={() => reorder(a.id, 'up')} onDown={() => reorder(a.id, 'down')} first={i === 0} last={i === sorted.length - 1} />
            <div className="flex-1"><div className="font-semibold text-sm">{a.name}</div><div className="text-xs text-gray-500">{a.description}</div></div>
            <StatusPill status={a.status} />
            <div className="flex gap-1">
              <button className={btnGhost} onClick={() => setEditing(a)}><Pencil className="w-3.5 h-3.5" /></button>
              <button className={btnDanger} onClick={() => setConfirm(a.id)}><Trash2 className="w-3.5 h-3.5" /></button>
            </div>
          </div>
        ))}
      </div>
      {editing && (
        <Modal title={editing.id ? 'Edit Partner' : 'Add Partner'} onClose={() => setEditing(null)}>
          <div className="grid md:grid-cols-2 gap-x-4">
            <Field label="Name" required><input className={inputCls} value={editing.name} onChange={e => setEditing({ ...editing, name: e.target.value })} /></Field>
            <Field label="Description"><input className={inputCls} value={editing.description} onChange={e => setEditing({ ...editing, description: e.target.value })} /></Field>
            <Field label="Detail"><input className={inputCls} value={editing.detail} onChange={e => setEditing({ ...editing, detail: e.target.value })} /></Field>
            <Field label="External Link"><input className={inputCls} value={editing.externalLink} onChange={e => setEditing({ ...editing, externalLink: e.target.value })} /></Field>
            <Field label="Display Order"><input className={inputCls} type="number" value={editing.displayOrder} onChange={e => setEditing({ ...editing, displayOrder: +e.target.value })} /></Field>
          </div>
          <Field label="Status"><StatusSelect value={editing.status} onChange={v => setEditing({ ...editing, status: v })} /></Field>
          <div className="flex gap-2 justify-end mt-4">
            <button className={btnSecondary} onClick={() => setEditing(null)}>Cancel</button>
            <button className={btnPrimary} onClick={() => { save(editing); setEditing(null); }} disabled={!editing.name}>Save</button>
          </div>
        </Modal>
      )}
      {confirm && <ConfirmModal message="Delete this partner?" onConfirm={() => { del(confirm); setConfirm(null); }} onCancel={() => setConfirm(null)} />}
    </div>
  );
}

// ─── Blog ─────────────────────────────────────────────────────────────────────

function BlogSection({ cms, onChange, initialNew }: { cms: CMSContent; onChange: (c: CMSContent) => void; initialNew?: boolean }) {
  const { sorted, save, del, duplicate } = useListEditor(cms.blog, bs => onChange({ ...cms, blog: bs }));
  const [search, setSearch] = useState('');
  const [audFilter, setAudFilter] = useState<'All' | 'Parents' | 'Educators'>('All');
  const [seeding, setSeeding] = useState(false);
  const [seedMsg, setSeedMsg] = useState('');
  const empty: CMSBlogArticle = { id: '', title: '', slug: '', audience: 'Parents', category: '', excerpt: '', body: '', authorName: '', authorTitle: '', publishDate: new Date().toISOString().split('T')[0], readTime: '5 min', featuredImage: '', featured: false, status: 'published', seoTitle: '', seoDescription: '', ogImage: '' };
  const [editing, setEditing] = useState<CMSBlogArticle | null>(initialNew ? { ...empty } : null);
  const [confirm, setConfirm] = useState<string | null>(null);

  const existingSlugs = new Set(sorted.map(b => b.slug));

  const seedFromHardcoded = () => {
    setSeeding(true);
    setSeedMsg('');
    const toAdd: CMSBlogArticle[] = HARDCODED_BLOG_POSTS
      .filter(p => !existingSlugs.has(p.slug))
      .map(p => ({
        id: generateId(),
        title: p.title,
        slug: p.slug,
        audience: p.stream === 'parents' ? 'Parents' : 'Educators',
        category: p.category,
        excerpt: p.excerpt,
        body: p.content.map(s => {
          if (s.type === 'h2') return `## ${s.content}`;
          if (s.type === 'h3') return `### ${s.content}`;
          if (s.type === 'quote') return `> ${s.content}`;
          if (s.type === 'tip' || s.type === 'highlight') return `💡 ${s.content}`;
          if (s.type === 'ul') return (Array.isArray(s.content) ? s.content : [s.content]).map(li => `- ${li}`).join('\n');
          if (s.type === 'ol') return (Array.isArray(s.content) ? s.content : [s.content]).map((li, i) => `${i + 1}. ${li}`).join('\n');
          return Array.isArray(s.content) ? s.content.join('\n') : String(s.content);
        }).join('\n\n'),
        authorName: p.author,
        authorTitle: p.authorRole,
        publishDate: p.date,
        readTime: p.readTime,
        featuredImage: '',
        featured: p.featured,
        status: 'published' as const,
        seoTitle: p.metaTitle,
        seoDescription: p.metaDescription,
        ogImage: '',
      }));
    if (toAdd.length === 0) {
      setSeedMsg('All hardcoded posts are already in the CMS.');
    } else {
      onChange({ ...cms, blog: [...sorted, ...toAdd] });
      setSeedMsg(`✓ Added ${toAdd.length} article${toAdd.length > 1 ? 's' : ''} — click "Publish Changes" to make them live.`);
    }
    setSeeding(false);
  };

  const filtered = sorted.filter(b =>
    (audFilter === 'All' || b.audience === audFilter) &&
    b.title.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div>
      <SectionHeader title="Blog" description="Articles shown in the Parent Blog and Educator Blog streams." />

      {/* Seed banner */}
      {HARDCODED_BLOG_POSTS.filter(p => !existingSlugs.has(p.slug)).length > 0 && (
        <div className="mb-4 flex items-center gap-3 bg-amber-50 border border-amber-200 rounded-xl px-4 py-3">
          <AlertTriangle className="w-4 h-4 text-amber-600 flex-shrink-0" />
          <p className="text-sm text-amber-800 flex-1">{HARDCODED_BLOG_POSTS.filter(p => !existingSlugs.has(p.slug)).length} public blog articles exist in code but are not yet in the CMS.</p>
          <button onClick={seedFromHardcoded} disabled={seeding} className="px-3 py-1.5 text-xs font-bold rounded-lg bg-amber-600 text-white hover:bg-amber-700 disabled:opacity-50 transition-colors">
            {seeding ? 'Seeding…' : 'Import All'}
          </button>
        </div>
      )}
      {seedMsg && <p className={`mb-3 text-sm px-3 py-2 rounded-xl ${seedMsg.startsWith('✓') ? 'bg-green-50 text-green-800 border border-green-200' : 'bg-gray-50 text-gray-700 border border-gray-200'}`}>{seedMsg}</p>}

      <div className="flex flex-wrap gap-2 mb-4">
        <div className="relative flex-1 min-w-40"><Search className="absolute left-3 top-2.5 w-4 h-4 text-gray-400" /><input className={inputCls + ' pl-9'} placeholder="Search articles…" value={search} onChange={e => setSearch(e.target.value)} /></div>
        {(['All', 'Parents', 'Educators'] as const).map(a => <button key={a} onClick={() => setAudFilter(a)} className={`px-3 py-1.5 rounded-full text-xs font-semibold transition-all ${audFilter === a ? 'bg-orange-500 text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}>{a}</button>)}
        <button className={btnPrimary} onClick={() => setEditing({ ...empty })}><Plus className="w-3.5 h-3.5" />New Article</button>
      </div>
      {filtered.length === 0 ? <EmptyState message="No blog articles yet." action="New Article" onAction={() => setEditing({ ...empty })} /> : (
        <div className="space-y-2">
          {filtered.map(b => (
            <div key={b.id} className="flex items-center gap-3 p-3 rounded-xl border border-gray-100 bg-white">
              {b.featuredImage && <img src={b.featuredImage} alt="" className="w-12 h-9 object-cover rounded-lg flex-shrink-0" onError={e => (e.currentTarget.style.display = 'none')} />}
              <div className="flex-1 min-w-0"><div className="font-semibold text-sm truncate">{b.title}</div><div className="text-xs text-gray-500">{b.publishDate} · {b.readTime}</div></div>
              <Badge color={b.audience === 'Parents' ? 'bg-orange-100 text-orange-700' : 'bg-blue-100 text-blue-700'}>{b.audience}</Badge>
              {b.featured && <FeaturedPill />}
              <StatusPill status={b.status} />
              <div className="flex gap-1">
                <button className={btnGhost} onClick={() => setEditing(b)}><Pencil className="w-3.5 h-3.5" /></button>
                <button className={btnGhost} onClick={() => duplicate(b)}><Copy className="w-3.5 h-3.5" /></button>
                <button className={btnDanger} onClick={() => setConfirm(b.id)}><Trash2 className="w-3.5 h-3.5" /></button>
              </div>
            </div>
          ))}
        </div>
      )}
      {editing && (
        <Modal title={editing.id ? `Edit — ${editing.title || 'Untitled'}` : 'New Article'} onClose={() => setEditing(null)} wide>
          <div className="grid md:grid-cols-2 gap-x-4">
            <Field label="Title" required><input className={inputCls} value={editing.title} onChange={e => setEditing({ ...editing, title: e.target.value })} /></Field>
            <Field label="Slug" required hint="URL-friendly, e.g. my-article-title"><input className={inputCls} value={editing.slug} onChange={e => setEditing({ ...editing, slug: e.target.value })} /></Field>
            <Field label="Audience"><select className={inputCls} value={editing.audience} onChange={e => setEditing({ ...editing, audience: e.target.value as CMSBlogArticle['audience'] })}><option>Parents</option><option>Educators</option></select></Field>
            <Field label="Category"><input className={inputCls} value={editing.category} onChange={e => setEditing({ ...editing, category: e.target.value })} /></Field>
            <Field label="Author Name"><input className={inputCls} value={editing.authorName} onChange={e => setEditing({ ...editing, authorName: e.target.value })} /></Field>
            <Field label="Author Title"><input className={inputCls} value={editing.authorTitle} onChange={e => setEditing({ ...editing, authorTitle: e.target.value })} /></Field>
            <Field label="Publish Date"><input className={inputCls} type="date" value={editing.publishDate} onChange={e => setEditing({ ...editing, publishDate: e.target.value })} /></Field>
            <Field label="Read Time"><input className={inputCls} value={editing.readTime} onChange={e => setEditing({ ...editing, readTime: e.target.value })} /></Field>
            <Field label="Featured Image URL"><input className={inputCls} value={editing.featuredImage} onChange={e => setEditing({ ...editing, featuredImage: e.target.value })} /></Field>
          </div>
          {editing.featuredImage && <img src={editing.featuredImage} alt="" className="w-full h-32 object-cover rounded-xl mb-4" onError={e => (e.currentTarget.style.display = 'none')} />}
          <Field label="Excerpt"><textarea className={inputCls} rows={2} value={editing.excerpt} onChange={e => setEditing({ ...editing, excerpt: e.target.value })} /></Field>
          <Field label="Body Content"><textarea className={inputCls} rows={10} value={editing.body} onChange={e => setEditing({ ...editing, body: e.target.value })} /></Field>
          <div className="p-3 bg-gray-50 rounded-xl border border-gray-100 mt-4 mb-4">
            <h4 className="font-semibold text-sm text-gray-700 mb-3">SEO</h4>
            <Field label="SEO Title" hint="~60 chars"><input className={inputCls} value={editing.seoTitle} onChange={e => setEditing({ ...editing, seoTitle: e.target.value })} /></Field>
            <Field label="SEO Description" hint="~155 chars"><textarea className={inputCls} rows={2} value={editing.seoDescription} onChange={e => setEditing({ ...editing, seoDescription: e.target.value })} /></Field>
            <Field label="OG Image URL"><input className={inputCls} value={editing.ogImage || ''} onChange={e => setEditing({ ...editing, ogImage: e.target.value })} /></Field>
          </div>
          <Field label="Status"><StatusSelect value={editing.status} onChange={v => setEditing({ ...editing, status: v })} /></Field>
          <div className="flex flex-wrap gap-4 my-3"><Toggle value={editing.featured} onChange={v => setEditing({ ...editing, featured: v })} label="Featured (pinned to top)" /></div>
          <div className="flex gap-2 justify-end">
            <button className={btnSecondary} onClick={() => setEditing(null)}>Cancel</button>
            <button className={btnPrimary} onClick={() => { save(editing); setEditing(null); }} disabled={!editing.title || !editing.slug}>Save</button>
          </div>
        </Modal>
      )}
      {confirm && <ConfirmModal message="Delete this article?" onConfirm={() => { del(confirm); setConfirm(null); }} onCancel={() => setConfirm(null)} />}
    </div>
  );
}

// ─── FAQ ──────────────────────────────────────────────────────────────────────

function FAQSection({ cms, onChange }: { cms: CMSContent; onChange: (c: CMSContent) => void }) {
  const [group, setGroup] = useState<'Daycare' | 'EduHub' | 'General'>('Daycare');
  const groupItems = cms.faq.filter(f => f.group === group).sort((a, b) => a.displayOrder - b.displayOrder);
  const { sorted, save, del, reorder } = useListEditor(groupItems, updated => onChange({ ...cms, faq: [...cms.faq.filter(f => f.group !== group), ...updated] }));
  const empty: CMSFAQ = { id: '', group, question: '', answer: '', tip: '', icon: '❓', displayOrder: sorted.length + 1, status: 'published' };
  const [editing, setEditing] = useState<CMSFAQ | null>(null);
  const [confirm, setConfirm] = useState<string | null>(null);

  return (
    <div>
      <SectionHeader title="FAQ" description="Frequently asked questions by section." />
      <div className="flex flex-wrap gap-2 mb-4">
        {(['Daycare', 'EduHub', 'General'] as const).map(g => <button key={g} onClick={() => setGroup(g)} className={`px-3 py-1.5 rounded-full text-xs font-semibold transition-all ${group === g ? 'bg-orange-500 text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}>{g}</button>)}
        <button className={btnPrimary + ' ml-auto'} onClick={() => setEditing({ ...empty, group })}><Plus className="w-3.5 h-3.5" />Add FAQ</button>
      </div>
      {sorted.length === 0 ? <EmptyState message={`No FAQ items in ${group}.`} action="Add FAQ" onAction={() => setEditing({ ...empty, group })} /> : (
        <div className="space-y-2">
          {sorted.map((f, i) => (
            <div key={f.id} className="flex items-center gap-3 p-3 rounded-xl border border-gray-100 bg-white">
              <ReorderBtns onUp={() => reorder(f.id, 'up')} onDown={() => reorder(f.id, 'down')} first={i === 0} last={i === sorted.length - 1} />
              <span className="text-xl">{f.icon}</span>
              <div className="flex-1 min-w-0 truncate font-semibold text-sm">{f.question}</div>
              <StatusPill status={f.status} />
              <div className="flex gap-1">
                <button className={btnGhost} onClick={() => setEditing(f)}><Pencil className="w-3.5 h-3.5" /></button>
                <button className={btnDanger} onClick={() => setConfirm(f.id)}><Trash2 className="w-3.5 h-3.5" /></button>
              </div>
            </div>
          ))}
        </div>
      )}
      {editing && (
        <Modal title={editing.id ? 'Edit FAQ' : 'Add FAQ'} onClose={() => setEditing(null)}>
          <div className="grid md:grid-cols-2 gap-x-4">
            <Field label="Icon"><input className={inputCls} value={editing.icon} onChange={e => setEditing({ ...editing, icon: e.target.value })} /></Field>
            <Field label="Group"><select className={inputCls} value={editing.group} onChange={e => setEditing({ ...editing, group: e.target.value as CMSFAQ['group'] })}><option>Daycare</option><option>EduHub</option><option>General</option></select></Field>
          </div>
          <Field label="Question" required><input className={inputCls} value={editing.question} onChange={e => setEditing({ ...editing, question: e.target.value })} /></Field>
          <Field label="Answer" required><textarea className={inputCls} rows={4} value={editing.answer} onChange={e => setEditing({ ...editing, answer: e.target.value })} /></Field>
          <Field label="Did You Know Tip"><input className={inputCls} value={editing.tip || ''} onChange={e => setEditing({ ...editing, tip: e.target.value })} /></Field>
          <Field label="Status"><StatusSelect value={editing.status} onChange={v => setEditing({ ...editing, status: v })} /></Field>
          <div className="flex gap-2 justify-end mt-4">
            <button className={btnSecondary} onClick={() => setEditing(null)}>Cancel</button>
            <button className={btnPrimary} onClick={() => { save(editing); setEditing(null); }} disabled={!editing.question || !editing.answer}>Save</button>
          </div>
        </Modal>
      )}
      {confirm && <ConfirmModal message="Delete this FAQ?" onConfirm={() => { del(confirm); setConfirm(null); }} onCancel={() => setConfirm(null)} />}
    </div>
  );
}

// ─── Submissions ──────────────────────────────────────────────────────────────

function SubmissionsSection({ onUnreadChange }: { onUnreadChange?: (n: number) => void }) {
  const [subs, setSubs] = useState<SupabaseSubmission[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<'All' | 'daycare' | 'eduhub' | 'general' | 'Unread'>('All');
  const [search, setSearch] = useState('');
  const [confirm, setConfirm] = useState<string | null>(null);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const data = await fetchSubmissions();
      setSubs(data);
      onUnreadChange?.(data.filter(s => s.status === 'unread').length);
    } catch { /* network error */ }
    finally { setLoading(false); }
  }, [onUnreadChange]);

  useEffect(() => { load(); }, [load]);

  const filtered = subs.filter(s => {
    const matchFilter = filter === 'All' || (filter === 'Unread' ? s.status === 'unread' : s.source === filter);
    const q = search.toLowerCase();
    const p = s.payload as Record<string, string>;
    return matchFilter && (!q || String(p.name ?? '').toLowerCase().includes(q) || String(p.email ?? '').toLowerCase().includes(q) || String(p.message ?? '').toLowerCase().includes(q));
  });

  const toggleRead = async (sub: SupabaseSubmission) => {
    const next = sub.status === 'unread' ? 'read' : 'unread';
    await updateSubmissionStatus(sub.id, next);
    const updated = subs.map(s => s.id === sub.id ? { ...s, status: next } : s);
    setSubs(updated);
    onUnreadChange?.(updated.filter(s => s.status === 'unread').length);
  };

  const del = async (id: string) => {
    await deleteSubmission(id);
    const updated = subs.filter(s => s.id !== id);
    setSubs(updated);
    onUnreadChange?.(updated.filter(s => s.status === 'unread').length);
  };

  const exportCSV = () => {
    const h = ['Date', 'Source', 'Name', 'Email', 'Phone', 'Message'];
    const rows = subs.map(s => {
      const p = s.payload as Record<string, string>;
      return [s.created_at, s.source, p.name ?? '', p.email ?? '', p.phone ?? '', String(p.message ?? '').replace(/[\n\r]/g, ' ')];
    });
    const csv = [h, ...rows].map(r => r.map(c => `"${String(c).replace(/"/g, '""')}"`).join(',')).join('\n');
    const a = document.createElement('a'); a.href = URL.createObjectURL(new Blob([csv], { type: 'text/csv' })); a.download = 'submissions.csv'; a.click();
  };

  const unread = subs.filter(s => s.status === 'unread').length;

  return (
    <div>
      <SectionHeader title="Submissions Inbox" description="Form enquiries submitted through the public website — cloud-backed in production with an on-device recovery copy." />
      <div className="flex flex-wrap gap-2 mb-4 items-center">
        {(['All', 'daycare', 'eduhub', 'general', 'Unread'] as const).map(f => (
          <button key={f} onClick={() => setFilter(f)} className={`px-3 py-1.5 rounded-full text-xs font-semibold capitalize transition-all ${filter === f ? 'bg-orange-500 text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}>
            {f}{f === 'Unread' && unread > 0 && <span className="ml-1 bg-red-500 text-white text-[9px] rounded-full px-1.5 py-0.5">{unread}</span>}
          </button>
        ))}
        <div className="relative ml-auto"><Search className="absolute left-3 top-2.5 w-4 h-4 text-gray-400" /><input className={inputCls + ' pl-9 w-44'} placeholder="Search…" value={search} onChange={e => setSearch(e.target.value)} /></div>
        <button className={btnGhost} onClick={exportCSV}><Download className="w-3.5 h-3.5" />CSV</button>
        <button className={btnGhost} onClick={load}>{loading ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : 'Refresh'}</button>
      </div>
      {loading ? (
        <div className="text-center py-12 text-gray-400"><Loader2 className="w-8 h-8 animate-spin mx-auto mb-2" />Loading submissions…</div>
      ) : filtered.length === 0 ? (
        <EmptyState message="No submissions found. Form enquiries submitted by visitors will appear here." />
      ) : (
        <div className="space-y-2">
          {filtered.map(s => {
            const p = s.payload as Record<string, string>;
            const isUnread = s.status === 'unread';
            return (
              <div key={s.id} className={`p-4 rounded-xl border bg-white ${isUnread ? 'border-orange-200 bg-orange-50/20' : 'border-gray-100'}`}>
                <div className="flex items-start gap-3">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1 flex-wrap">
                      {isUnread && <div className="w-2 h-2 rounded-full bg-orange-500 flex-shrink-0" />}
                      <span className="font-semibold text-sm">{p.name || '(no name)'}</span>
                      <Badge color={s.source === 'daycare' ? 'bg-orange-100 text-orange-700' : s.source === 'eduhub' ? 'bg-blue-100 text-blue-700' : 'bg-gray-100 text-gray-600'}>{s.source}</Badge>
                      <span className="text-xs text-gray-400">{new Date(s.created_at).toLocaleString()}</span>
                    </div>
                    <div className="text-xs text-gray-600 mb-1">{p.email}{p.phone && ` · ${p.phone}`}</div>
                    <div className="text-sm text-gray-700">{p.message}</div>
                    {Object.entries(p).filter(([k]) => !['name','email','phone','message'].includes(k)).length > 0 && (
                      <div className="mt-2 flex flex-wrap gap-1">
                        {Object.entries(p).filter(([k]) => !['name','email','phone','message'].includes(k)).map(([k, v]) => (
                          <span key={k} className="text-xs bg-gray-100 rounded px-2 py-0.5 text-gray-600"><span className="font-medium">{k}:</span> {v}</span>
                        ))}
                      </div>
                    )}
                  </div>
                  <div className="flex gap-1 flex-shrink-0">
                    <button className={btnGhost} onClick={() => toggleRead(s)} title={isUnread ? 'Mark read' : 'Mark unread'}><Check className={`w-3.5 h-3.5 ${!isUnread ? 'text-green-500' : ''}`} /></button>
                    <button className={btnDanger} onClick={() => setConfirm(s.id)}><Trash2 className="w-3.5 h-3.5" /></button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
      {confirm && <ConfirmModal message="Delete this submission?" onConfirm={() => { del(confirm!); setConfirm(null); }} onCancel={() => setConfirm(null)} />}
    </div>
  );
}

// ─── Daycare Hero editor ──────────────────────────────────────────────────────

function DaycareHeroEditorSection({ cms, onChange }: { cms: CMSContent; onChange: (c: CMSContent) => void }) {
  const h = cms.daycareHero;
  const upd = (patch: Partial<CMSDaycareHero>) => onChange({ ...cms, daycareHero: { ...h, ...patch } });

  return (
    <div className="space-y-6">
      <p className="text-sm text-gray-500">Edit the hero headline, subtitle, trust badges, and CTAs shown on the Daycare homepage.</p>

      <div className="bg-white border border-gray-100 rounded-2xl p-5 space-y-4">
        <h3 className="font-semibold text-gray-800 text-sm">Text Content</h3>
        <div>
          <label className="block text-xs font-semibold text-gray-600 mb-1">Eyebrow text</label>
          <input className="w-full border border-gray-200 rounded-xl px-3 py-2 text-sm" value={h.eyebrow} onChange={e => upd({ eyebrow: e.target.value })} />
        </div>
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="block text-xs font-semibold text-gray-600 mb-1">Headline</label>
            <input className="w-full border border-gray-200 rounded-xl px-3 py-2 text-sm" value={h.headline} onChange={e => upd({ headline: e.target.value })} />
          </div>
          <div>
            <label className="block text-xs font-semibold text-gray-600 mb-1">Highlighted word</label>
            <input className="w-full border border-gray-200 rounded-xl px-3 py-2 text-sm" value={h.highlightWord} onChange={e => upd({ highlightWord: e.target.value })} />
          </div>
        </div>
        <div>
          <label className="block text-xs font-semibold text-gray-600 mb-1">Subtitle</label>
          <textarea rows={2} className="w-full border border-gray-200 rounded-xl px-3 py-2 text-sm resize-none" value={h.subtitle} onChange={e => upd({ subtitle: e.target.value })} />
        </div>
      </div>

      <div className="bg-white border border-gray-100 rounded-2xl p-5 space-y-4">
        <h3 className="font-semibold text-gray-800 text-sm">Call-to-Action Buttons</h3>
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="block text-xs font-semibold text-gray-600 mb-1">Primary button label</label>
            <input className="w-full border border-gray-200 rounded-xl px-3 py-2 text-sm" value={h.primaryCTALabel} onChange={e => upd({ primaryCTALabel: e.target.value })} />
          </div>
          <div>
            <label className="block text-xs font-semibold text-gray-600 mb-1">Primary button link</label>
            <input className="w-full border border-gray-200 rounded-xl px-3 py-2 text-sm" value={h.primaryCTALink} onChange={e => upd({ primaryCTALink: e.target.value })} />
          </div>
          <div>
            <label className="block text-xs font-semibold text-gray-600 mb-1">Secondary button label</label>
            <input className="w-full border border-gray-200 rounded-xl px-3 py-2 text-sm" value={h.secondaryCTALabel} onChange={e => upd({ secondaryCTALabel: e.target.value })} />
          </div>
          <div>
            <label className="block text-xs font-semibold text-gray-600 mb-1">Secondary button link</label>
            <input className="w-full border border-gray-200 rounded-xl px-3 py-2 text-sm" value={h.secondaryCTALink} onChange={e => upd({ secondaryCTALink: e.target.value })} />
          </div>
        </div>
      </div>

      <div className="bg-white border border-gray-100 rounded-2xl p-5 space-y-4">
        <h3 className="font-semibold text-gray-800 text-sm">Hero Image URL</h3>
        <input className="w-full border border-gray-200 rounded-xl px-3 py-2 text-sm" placeholder="https://… (leave blank for default)" value={h.heroImageUrl} onChange={e => upd({ heroImageUrl: e.target.value })} />
        {h.heroImageUrl && <img src={h.heroImageUrl} alt="Hero preview" className="rounded-xl h-40 object-cover w-full" />}
      </div>

      <div className="bg-white border border-gray-100 rounded-2xl p-5 space-y-3">
        <h3 className="font-semibold text-gray-800 text-sm">Trust Badges ({h.trustBadges.length})</h3>
        {h.trustBadges.map((b, i) => (
          <div key={i} className="flex items-center gap-2">
            <input className="w-14 border border-gray-200 rounded-xl px-2 py-2 text-sm text-center" value={b.icon} onChange={e => { const t = [...h.trustBadges]; t[i] = { ...t[i], icon: e.target.value }; upd({ trustBadges: t }); }} placeholder="🏫" />
            <input className="flex-1 border border-gray-200 rounded-xl px-3 py-2 text-sm" value={b.text} onChange={e => { const t = [...h.trustBadges]; t[i] = { ...t[i], text: e.target.value }; upd({ trustBadges: t }); }} placeholder="Badge text" />
            <button onClick={() => { const t = [...h.trustBadges]; t.splice(i, 1); upd({ trustBadges: t }); }} className="w-8 h-8 rounded-xl bg-red-50 text-red-500 hover:bg-red-100 flex items-center justify-center text-sm transition-colors">✕</button>
          </div>
        ))}
        <button onClick={() => upd({ trustBadges: [...h.trustBadges, { icon: '✨', text: 'New badge' }] })} className="text-xs font-semibold text-blue-600 hover:underline">+ Add trust badge</button>
      </div>
    </div>
  );
}

// ─── EduHub Hero editor ───────────────────────────────────────────────────────

function EduhubHeroEditorSection({ cms, onChange }: { cms: CMSContent; onChange: (c: CMSContent) => void }) {
  const h = cms.eduhubHero;
  const upd = (patch: Partial<CMSEduhubHero>) => onChange({ ...cms, eduhubHero: { ...h, ...patch } });

  return (
    <div className="space-y-6">
      <p className="text-sm text-gray-500">Edit the EduHub homepage hero: headline, subheadline, CTAs, and stats strip.</p>

      <div className="bg-white border border-gray-100 rounded-2xl p-5 space-y-4">
        <h3 className="font-semibold text-gray-800 text-sm">Text Content</h3>
        <div>
          <label className="block text-xs font-semibold text-gray-600 mb-1">Eyebrow badge</label>
          <input className="w-full border border-gray-200 rounded-xl px-3 py-2 text-sm" value={h.eyebrow} onChange={e => upd({ eyebrow: e.target.value })} />
        </div>
        <div>
          <label className="block text-xs font-semibold text-gray-600 mb-1">Headline</label>
          <input className="w-full border border-gray-200 rounded-xl px-3 py-2 text-sm" value={h.headline} onChange={e => upd({ headline: e.target.value })} />
        </div>
        <div>
          <label className="block text-xs font-semibold text-gray-600 mb-1">Subheadline paragraph</label>
          <textarea rows={3} className="w-full border border-gray-200 rounded-xl px-3 py-2 text-sm resize-none" value={h.subheadline} onChange={e => upd({ subheadline: e.target.value })} />
        </div>
      </div>

      <div className="bg-white border border-gray-100 rounded-2xl p-5 space-y-4">
        <h3 className="font-semibold text-gray-800 text-sm">Call-to-Action Buttons</h3>
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="block text-xs font-semibold text-gray-600 mb-1">Primary button label</label>
            <input className="w-full border border-gray-200 rounded-xl px-3 py-2 text-sm" value={h.primaryCTALabel} onChange={e => upd({ primaryCTALabel: e.target.value })} />
          </div>
          <div>
            <label className="block text-xs font-semibold text-gray-600 mb-1">Primary button link</label>
            <input className="w-full border border-gray-200 rounded-xl px-3 py-2 text-sm" value={h.primaryCTALink} onChange={e => upd({ primaryCTALink: e.target.value })} />
          </div>
          <div>
            <label className="block text-xs font-semibold text-gray-600 mb-1">Secondary button label</label>
            <input className="w-full border border-gray-200 rounded-xl px-3 py-2 text-sm" value={h.secondaryCTALabel} onChange={e => upd({ secondaryCTALabel: e.target.value })} />
          </div>
          <div>
            <label className="block text-xs font-semibold text-gray-600 mb-1">Secondary button link</label>
            <input className="w-full border border-gray-200 rounded-xl px-3 py-2 text-sm" value={h.secondaryCTALink} onChange={e => upd({ secondaryCTALink: e.target.value })} />
          </div>
        </div>
      </div>

      <div className="bg-white border border-gray-100 rounded-2xl p-5 space-y-4">
        <h3 className="font-semibold text-gray-800 text-sm">Hero Image URL</h3>
        <input className="w-full border border-gray-200 rounded-xl px-3 py-2 text-sm" placeholder="https://… (leave blank for default)" value={h.heroImageUrl} onChange={e => upd({ heroImageUrl: e.target.value })} />
        {h.heroImageUrl && <img src={h.heroImageUrl} alt="Hero preview" className="rounded-xl h-40 object-cover w-full" />}
      </div>

      <div className="bg-white border border-gray-100 rounded-2xl p-5 space-y-3">
        <h3 className="font-semibold text-gray-800 text-sm">Stats Strip ({h.stats?.length ?? 0})</h3>
        {(h.stats ?? []).map((s, i) => (
          <div key={i} className="flex items-center gap-2">
            <input className="w-20 border border-gray-200 rounded-xl px-2 py-2 text-sm font-bold" value={s.num} onChange={e => { const t = [...(h.stats ?? [])]; t[i] = { ...t[i], num: e.target.value }; upd({ stats: t }); }} placeholder="#1" />
            <input className="flex-1 border border-gray-200 rounded-xl px-3 py-2 text-sm" value={s.label} onChange={e => { const t = [...(h.stats ?? [])]; t[i] = { ...t[i], label: e.target.value }; upd({ stats: t }); }} placeholder="Stat label" />
            <button onClick={() => { const t = [...(h.stats ?? [])]; t.splice(i, 1); upd({ stats: t }); }} className="w-8 h-8 rounded-xl bg-red-50 text-red-500 hover:bg-red-100 flex items-center justify-center text-sm transition-colors">✕</button>
          </div>
        ))}
        <button onClick={() => upd({ stats: [...(h.stats ?? []), { num: '0', label: 'New stat' }] })} className="text-xs font-semibold text-blue-600 hover:underline">+ Add stat</button>
      </div>
    </div>
  );
}

// ─── Sidebar nav config ───────────────────────────────────────────────────────

type SectionId = 'overview' | 'settings' | 'media' | 'assets' | 'seo' | 'cta' | 'forms' | 'submissions' |
  'educators' | 'testimonials' | 'gallery' | 'programs' | 'schedule' | 'meals' | 'faq' |
  'calendar-events' | 'portal-files' | 'daycare-hero' |
  'courses' | 'alumni' | 'accreditation' | 'eduhub-hero' | 'blog' | 'popups' |
  'content-health' | 'publications' | 'launch-checklist';

const NAV_GROUPS = [
  {
    label: null,
    items: [{ id: 'overview' as SectionId, label: 'Overview', icon: BarChart3 }],
  },
  {
    label: 'Global',
    items: [
      { id: 'settings' as SectionId, label: 'Site Settings', icon: Settings },
      { id: 'media' as SectionId, label: 'Media Library', icon: Image },
      { id: 'assets' as SectionId, label: 'Image Assets', icon: LayoutGrid },
      { id: 'popups' as SectionId, label: 'Announcement Popups', icon: Bell },
      { id: 'seo' as SectionId, label: 'SEO', icon: Globe },
      { id: 'cta' as SectionId, label: 'CTA Settings', icon: Megaphone },
      { id: 'forms' as SectionId, label: 'Form Settings', icon: Mail },
      { id: 'submissions' as SectionId, label: 'Submissions', icon: Inbox },
      { id: 'content-health' as SectionId, label: 'Content Health', icon: Activity },
      { id: 'publications' as SectionId, label: 'Publications', icon: Package },
      { id: 'launch-checklist' as SectionId, label: 'Launch Checklist', icon: Rocket },
    ],
  },
  {
    label: 'Daycare',
    items: [
      { id: 'daycare-hero' as SectionId, label: 'Hero Section', icon: LayoutGrid },
      { id: 'educators' as SectionId, label: 'Company Team', icon: Users },
      { id: 'testimonials' as SectionId, label: 'Testimonials', icon: Star },
      { id: 'gallery' as SectionId, label: 'Gallery', icon: LayoutGrid },
      { id: 'programs' as SectionId, label: 'Programs', icon: BookOpen },
      { id: 'schedule' as SectionId, label: 'Daily Schedule', icon: Clock },
      { id: 'meals' as SectionId, label: 'Meals & Menu', icon: UtensilsCrossed },
      { id: 'calendar-events' as SectionId, label: 'Calendar Events', icon: Calendar },
      { id: 'portal-files' as SectionId, label: 'Portal Files', icon: ClipboardList },
      { id: 'faq' as SectionId, label: 'FAQ', icon: HelpCircle },
    ],
  },
  {
    label: 'EduHub',
    items: [
      { id: 'eduhub-hero' as SectionId, label: 'Hero Section', icon: LayoutGrid },
      { id: 'courses' as SectionId, label: 'Courses', icon: GraduationCap },
      { id: 'alumni' as SectionId, label: 'Alumni', icon: Award },
      { id: 'accreditation' as SectionId, label: 'Accreditation', icon: Link2 },
    ],
  },
  {
    label: 'Content',
    items: [
      { id: 'blog' as SectionId, label: 'Blog', icon: FileText },
    ],
  },
];

// ─── Import/Export ────────────────────────────────────────────────────────────

function useBackup(cms: CMSContent, setCMS: (c: CMSContent) => void) {
  const fileRef = useRef<HTMLInputElement>(null);
  const [confirm, setConfirm] = useState<{ msg: string; fn: () => void } | null>(null);

  const exportData = () => {
    const blob = new Blob([JSON.stringify({ ...cms, exportedAt: new Date().toISOString() }, null, 2)], { type: 'application/json' });
    const a = document.createElement('a'); a.href = URL.createObjectURL(blob); a.download = `eyc-cms-${new Date().toISOString().split('T')[0]}.json`; a.click();
  };

  // Import into draft editor only — does NOT auto-publish
  const importData = (file: File) => {
    const reader = new FileReader();
    reader.onload = e => {
      try {
        const data = JSON.parse(e.target?.result as string) as CMSContent;
        if (!data.siteSettings) { alert('Invalid CMS JSON — missing siteSettings.'); return; }
        setConfirm({ msg: 'Load this JSON into the draft editor? It will not go live until you click "Prepare Publication Package".', fn: () => { setCMS(data); setConfirm(null); alert('Content loaded into draft. Click "Save Draft" to persist, then "Prepare Publication Package" to queue for deployment.'); } });
      } catch { alert('Could not parse JSON file.'); }
    };
    reader.readAsText(file);
  };

  const doReset = () => {
    setConfirm({ msg: 'Reset the draft editor to factory defaults?', fn: () => { setCMS(DEFAULT_CMS); setConfirm(null); } });
  };

  return { exportData, importData, fileRef, confirm, setConfirm, doReset };
}

// ─── Calendar Events Section ──────────────────────────────────────────────────

const EVENT_TYPES: CMSCalendarEvent['type'][] = ['term', 'holiday', 'event', 'parent', 'closure', 'camp'];

function CalendarEventsSection({ cms, onChange }: { cms: CMSContent; onChange: (c: CMSContent) => void }) {
  const [editing, setEditing] = useState<CMSCalendarEvent | null>(null);
  const [isNew, setIsNew] = useState(false);

  const events = [...(cms.calendarEvents ?? [])].sort((a, b) => a.isoDate.localeCompare(b.isoDate));

  const save = (ev: CMSCalendarEvent) => {
    const existing = cms.calendarEvents ?? [];
    const idx = existing.findIndex(e => e.id === ev.id);
    const updated = idx >= 0
      ? existing.map((e, i) => i === idx ? ev : e)
      : [...existing, ev];
    onChange({ ...cms, calendarEvents: updated });
    setEditing(null);
    setIsNew(false);
  };

  const remove = (id: string) => {
    onChange({ ...cms, calendarEvents: (cms.calendarEvents ?? []).filter(e => e.id !== id) });
  };

  const toggleActive = (id: string) => {
    onChange({
      ...cms,
      calendarEvents: (cms.calendarEvents ?? []).map(e =>
        e.id === id ? { ...e, active: !e.active } : e
      ),
    });
  };

  const startNew = () => {
    const d = new Date();
    const iso = d.toISOString().slice(0, 10);
    const friendly = d.toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' });
    setEditing({ id: generateId(), isoDate: iso, date: friendly, title: '', type: 'event', description: '', displayOrder: events.length, active: true });
    setIsNew(true);
  };

  const TYPE_COLORS: Record<CMSCalendarEvent['type'], string> = {
    term:    'bg-blue-100 text-blue-700',
    holiday: 'bg-red-100 text-red-700',
    event:   'bg-purple-100 text-purple-700',
    parent:  'bg-green-100 text-green-700',
    closure: 'bg-orange-100 text-orange-700',
    camp:    'bg-yellow-100 text-yellow-700',
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <p className="text-xs text-gray-500">Manage term dates, holidays, and events visible in the calendar and Parent Portal.</p>
        <button onClick={startNew} className="flex items-center gap-1.5 px-3 py-2 bg-peach-500 text-white rounded-xl text-sm font-semibold hover:bg-peach-600 transition-colors">
          <Plus className="w-4 h-4" /> Add Event
        </button>
      </div>

      {editing && (
        <div className="bg-blue-50 border border-blue-200 rounded-2xl p-5 space-y-3">
          <p className="font-semibold text-blue-800 text-sm">{isNew ? 'New Event' : 'Edit Event'}</p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-gray-500 mb-1">Title *</label>
              <input value={editing.title} onChange={e => setEditing({ ...editing, title: e.target.value })}
                className="w-full border border-gray-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:border-blue-400" placeholder="e.g. Autumn Term Begins" />
            </div>
            <div>
              <label className="block text-xs font-semibold text-gray-500 mb-1">Date (ISO: YYYY-MM-DD) *</label>
              <input type="date" value={editing.isoDate} onChange={e => {
                const d = new Date(e.target.value);
                const friendly = isNaN(d.getTime()) ? e.target.value : d.toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' });
                setEditing({ ...editing, isoDate: e.target.value, date: friendly });
              }} className="w-full border border-gray-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:border-blue-400" />
            </div>
            <div>
              <label className="block text-xs font-semibold text-gray-500 mb-1">Type *</label>
              <select value={editing.type} onChange={e => setEditing({ ...editing, type: e.target.value as CMSCalendarEvent['type'] })}
                className="w-full border border-gray-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:border-blue-400 bg-white">
                {EVENT_TYPES.map(t => <option key={t} value={t}>{t.charAt(0).toUpperCase() + t.slice(1)}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-xs font-semibold text-gray-500 mb-1">Description</label>
              <input value={editing.description ?? ''} onChange={e => setEditing({ ...editing, description: e.target.value })}
                className="w-full border border-gray-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:border-blue-400" placeholder="Optional details" />
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button onClick={() => { if (editing.title && editing.isoDate) save(editing); }}
              disabled={!editing.title || !editing.isoDate}
              className="px-4 py-2 bg-blue-600 text-white rounded-xl text-sm font-semibold hover:bg-blue-700 transition-colors disabled:opacity-40">
              {isNew ? 'Add' : 'Save'}
            </button>
            <button onClick={() => { setEditing(null); setIsNew(false); }}
              className="px-4 py-2 bg-gray-100 text-gray-600 rounded-xl text-sm font-semibold hover:bg-gray-200 transition-colors">
              Cancel
            </button>
          </div>
        </div>
      )}

      <div className="space-y-1.5">
        {events.length === 0 && (
          <div className="text-center py-8 text-gray-400 text-sm border border-dashed rounded-2xl">No calendar events yet.</div>
        )}
        {events.map(ev => (
          <div key={ev.id} className={`flex items-center gap-3 bg-white border rounded-2xl px-4 py-3 ${ev.active === false ? 'opacity-50' : ''}`}>
            <div className="text-center w-12 flex-shrink-0">
              <p className="text-[10px] text-gray-400 font-semibold uppercase">{ev.isoDate.slice(5, 7)}/{ev.isoDate.slice(0, 4)}</p>
              <p className="text-lg font-bold text-gray-800 leading-none">{ev.isoDate.slice(8, 10)}</p>
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-semibold text-gray-800 truncate">{ev.title}</p>
              {ev.description && <p className="text-xs text-gray-500 truncate">{ev.description}</p>}
            </div>
            <span className={`text-[10px] px-2 py-0.5 rounded-full font-semibold flex-shrink-0 ${TYPE_COLORS[ev.type]}`}>{ev.type}</span>
            <div className="flex items-center gap-1 flex-shrink-0">
              <button onClick={() => toggleActive(ev.id)} title={ev.active === false ? 'Activate' : 'Deactivate'}
                className={`w-7 h-7 rounded-lg flex items-center justify-center text-xs transition-colors ${ev.active === false ? 'bg-gray-100 text-gray-400 hover:bg-green-100' : 'bg-green-50 text-green-600 hover:bg-gray-100'}`}>
                {ev.active === false ? '○' : '●'}
              </button>
              <button onClick={() => { setEditing({ ...ev }); setIsNew(false); }}
                className="w-7 h-7 rounded-lg flex items-center justify-center bg-gray-50 hover:bg-blue-50 text-gray-400 hover:text-blue-600 transition-colors">
                <Pencil className="w-3.5 h-3.5" />
              </button>
              <button onClick={() => remove(ev.id)}
                className="w-7 h-7 rounded-lg flex items-center justify-center bg-gray-50 hover:bg-red-50 text-gray-400 hover:text-red-500 transition-colors">
                <Trash2 className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// ─── Portal Files Section ─────────────────────────────────────────────────────

const FILE_CATEGORIES: CMSPortalFile['category'][] = ['newsletter', 'parent-info-pack', 'programme-guide', 'enrollment-form', 'form', 'policy', 'calendar', 'menu', 'eduhub-schedule', 'eduhub-guide', 'accreditation', 'other'];
const FILE_AUDIENCES: CMSPortalFile['audience'][] = ['Public', 'Parents', 'EduHub', 'Internal'];

function PortalFilesSection({ cms, onChange }: { cms: CMSContent; onChange: (c: CMSContent) => void }) {
  const [editing, setEditing] = useState<CMSPortalFile | null>(null);
  const [isNew, setIsNew] = useState(false);

  const files = [...(cms.portalFiles ?? [])].sort((a, b) => a.displayOrder - b.displayOrder);

  const save = (f: CMSPortalFile) => {
    const existing = cms.portalFiles ?? [];
    const idx = existing.findIndex(x => x.id === f.id);
    const updated = idx >= 0 ? existing.map((x, i) => i === idx ? f : x) : [...existing, f];
    onChange({ ...cms, portalFiles: updated });
    setEditing(null);
    setIsNew(false);
  };

  const remove = (id: string) => {
    onChange({ ...cms, portalFiles: (cms.portalFiles ?? []).filter(f => f.id !== id) });
  };

  const toggleActive = (id: string) => {
    onChange({
      ...cms,
      portalFiles: (cms.portalFiles ?? []).map(f =>
        f.id === id ? { ...f, active: !f.active } : f
      ),
    });
  };

  const startNew = () => {
    setEditing({ id: generateId(), name: '', category: 'form', audience: 'Parents', url: '', description: '', highlights: [], displayOrder: files.length, active: true, publishDate: new Date().toISOString().slice(0, 10) });
    setIsNew(true);
  };

  const CAT_COLORS: Record<CMSPortalFile['category'], string> = {
    newsletter: 'bg-blue-100 text-blue-700',
    form:       'bg-green-100 text-green-700',
    menu:       'bg-amber-100 text-amber-700',
    policy:     'bg-purple-100 text-purple-700',
    other:      'bg-gray-100 text-gray-600',
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <p className="text-xs text-gray-500">Manage downloadable files visible to enrolled families in the Parent Portal.</p>
        <button onClick={startNew} className="flex items-center gap-1.5 px-3 py-2 bg-peach-500 text-white rounded-xl text-sm font-semibold hover:bg-peach-600 transition-colors">
          <Plus className="w-4 h-4" /> Add File
        </button>
      </div>

      {editing && (
        <div className="bg-green-50 border border-green-200 rounded-2xl p-5 space-y-3">
          <p className="font-semibold text-green-800 text-sm">{isNew ? 'New File' : 'Edit File'}</p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-gray-500 mb-1">Name *</label>
              <input value={editing.name} onChange={e => setEditing({ ...editing, name: e.target.value })}
                className="w-full border border-gray-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:border-green-400" placeholder="e.g. January Newsletter 2026" />
            </div>
            <div>
              <label className="block text-xs font-semibold text-gray-500 mb-1">Category *</label>
              <select value={editing.category} onChange={e => setEditing({ ...editing, category: e.target.value as CMSPortalFile['category'] })}
                className="w-full border border-gray-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:border-green-400 bg-white">
                {FILE_CATEGORIES.map(c => <option key={c} value={c}>{c.replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-xs font-semibold text-gray-500 mb-1">Audience *</label>
              <select value={editing.audience ?? 'Parents'} onChange={e => setEditing({ ...editing, audience: e.target.value as CMSPortalFile['audience'] })}
                className="w-full border border-gray-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:border-green-400 bg-white">
                {FILE_AUDIENCES.map(a => <option key={a}>{a}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-xs font-semibold text-gray-500 mb-1">Publish Date</label>
              <input type="date" value={editing.publishDate ?? ''} onChange={e => setEditing({ ...editing, publishDate: e.target.value })}
                className="w-full border border-gray-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:border-green-400" />
            </div>
            <div className="sm:col-span-2">
              <label className="block text-xs font-semibold text-gray-500 mb-1">Download URL *</label>
              <input type="url" value={editing.url} onChange={e => setEditing({ ...editing, url: e.target.value })}
                className="w-full border border-gray-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:border-green-400" placeholder="https://..." />
              <p className="text-[10px] text-gray-400 mt-1">Upload files to Supabase Storage, Google Drive (public link), or another host, then paste the URL here.</p>
            </div>
            <div className="sm:col-span-2">
              <label className="block text-xs font-semibold text-gray-500 mb-1">Description</label>
              <input value={editing.description ?? ''} onChange={e => setEditing({ ...editing, description: e.target.value })}
                className="w-full border border-gray-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:border-green-400" placeholder="Short description" />
            </div>
            <div className="sm:col-span-2">
              <label className="block text-xs font-semibold text-gray-500 mb-1">Highlights (one per line)</label>
              <textarea
                rows={3}
                value={(editing.highlights ?? []).join('\n')}
                onChange={e => setEditing({ ...editing, highlights: e.target.value.split('\n').filter(Boolean) })}
                className="w-full border border-gray-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:border-green-400 resize-none"
                placeholder="Key highlight 1&#10;Key highlight 2"
              />
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button onClick={() => { if (editing.name && editing.url) save(editing); }}
              disabled={!editing.name || !editing.url}
              className="px-4 py-2 bg-green-600 text-white rounded-xl text-sm font-semibold hover:bg-green-700 transition-colors disabled:opacity-40">
              {isNew ? 'Add' : 'Save'}
            </button>
            <button onClick={() => { setEditing(null); setIsNew(false); }}
              className="px-4 py-2 bg-gray-100 text-gray-600 rounded-xl text-sm font-semibold hover:bg-gray-200 transition-colors">
              Cancel
            </button>
          </div>
        </div>
      )}

      <div className="space-y-1.5">
        {files.length === 0 && (
          <div className="text-center py-8 text-gray-400 text-sm border border-dashed rounded-2xl">No files yet. Add a file to make it available in the Parent Portal.</div>
        )}
        {files.map(f => (
          <div key={f.id} className={`flex items-center gap-3 bg-white border rounded-2xl px-4 py-3 ${f.active === false ? 'opacity-50' : ''}`}>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 flex-wrap">
                <p className="text-sm font-semibold text-gray-800 truncate">{f.name}</p>
                <span className={`text-[10px] px-1.5 py-0.5 rounded-full font-semibold flex-shrink-0 ${CAT_COLORS[f.category]}`}>{f.category}</span>
              </div>
              {f.description && <p className="text-xs text-gray-500 truncate mt-0.5">{f.description}</p>}
              <a href={f.url} target="_blank" rel="noopener noreferrer" className="text-[10px] text-blue-500 hover:underline truncate block">{f.url}</a>
            </div>
            <div className="flex items-center gap-1 flex-shrink-0">
              <button onClick={() => toggleActive(f.id)} title={f.active === false ? 'Activate' : 'Deactivate'}
                className={`w-7 h-7 rounded-lg flex items-center justify-center text-xs transition-colors ${f.active === false ? 'bg-gray-100 text-gray-400 hover:bg-green-100' : 'bg-green-50 text-green-600 hover:bg-gray-100'}`}>
                {f.active === false ? '○' : '●'}
              </button>
              <button onClick={() => { setEditing({ ...f }); setIsNew(false); }}
                className="w-7 h-7 rounded-lg flex items-center justify-center bg-gray-50 hover:bg-blue-50 text-gray-400 hover:text-blue-600 transition-colors">
                <Pencil className="w-3.5 h-3.5" />
              </button>
              <button onClick={() => remove(f.id)}
                className="w-7 h-7 rounded-lg flex items-center justify-center bg-gray-50 hover:bg-red-50 text-gray-400 hover:text-red-500 transition-colors">
                <Trash2 className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// ─── Main Admin ───────────────────────────────────────────────────────────────

export default function Admin() {
  const [session, setSession] = useState<Session | null>(null);
  const [authLoading, setAuthLoading] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [authError, setAuthError] = useState('');
  const [signingIn, setSigningIn] = useState(false);
  const localOwnerPreview = import.meta.env.DEV && !supabaseConfigured;
  const { role: accountRole, loading: roleLoading, error: roleError, refresh: refreshRole } = useProfileRole(session);

  useEffect(() => {
    if (localOwnerPreview) {
      setAuthLoading(false);
      return;
    }
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setAuthLoading(false);
    });
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
    });
    return () => subscription.unsubscribe();
  }, [localOwnerPreview]);

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    setSigningIn(true);
    setAuthError('');
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) setAuthError('That email or password was not recognised. Check your details and try again.');
    setSigningIn(false);
  };

  const handleSignOut = async () => {
    await supabase.auth.signOut();
  };

  if (authLoading || (!!session && roleLoading)) return <AdminEntryShell><div className="ey-gate__loading" role="status"><span aria-hidden="true" /><strong>Opening the Owner Console</strong><small>Verifying secure access…</small></div></AdminEntryShell>;

  if (localOwnerPreview) {
    return <AdminDashboard onLogout={() => window.location.assign('/workspace')} localMode />;
  }

  if (!session) return <AdminEntryShell><div className="ey-gate__entry-heading"><span className="ey-gate__icon"><LockKeyhole aria-hidden="true" /></span><p className="platform-eyebrow">Owner-only access</p><h2>Owner Console</h2><p>Sign in with the owner account provided for Early Years. Teachers, administrators, and families should use the main workspace.</p></div><form onSubmit={handleSignIn} className="ey-gate__form"><label htmlFor="owner-email">Email address</label><input id="owner-email" type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="you@example.com" autoFocus autoComplete="email" required /><label htmlFor="owner-password">Password</label><input id="owner-password" type="password" value={password} onChange={e => { setPassword(e.target.value); setAuthError(''); }} placeholder="Your password" autoComplete="current-password" required />{authError && <p className="platform-error" role="alert">{authError}</p>}<button type="submit" disabled={signingIn} className="platform-button ey-gate__submit">{signingIn ? 'Signing in…' : 'Sign in securely'} {!signingIn && <ArrowRight aria-hidden="true" />}</button></form><a href="/workspace" className="admin-gate__workspace"><Users aria-hidden="true" /><span><strong>Not managing the website?</strong><small>Open the everyday staff and family workspace.</small></span><ArrowRight aria-hidden="true" /></a></AdminEntryShell>;

  if (accountRole !== 'owner') return <AdminEntryShell><div className="ey-gate__entry-heading"><span className="ey-gate__icon"><Shield aria-hidden="true" /></span><p className="platform-eyebrow">Protected controls</p><h2>Owner access required</h2><p>This account cannot open website publishing or infrastructure controls. No restricted information was displayed.</p></div><div className="admin-gate__actions">{roleError && <button type="button" onClick={() => void refreshRole()} className="platform-button">Try verification again</button>}<a href="/workspace" className="platform-button">Return to workspace <ArrowRight aria-hidden="true" /></a><button type="button" onClick={handleSignOut} className="platform-button platform-button--quiet">Sign out</button></div></AdminEntryShell>;

  return <AdminDashboard onLogout={handleSignOut} />;
}

function AdminDashboard({ onLogout, localMode = false }: { onLogout: () => void; localMode?: boolean }) {
  const [cms, setCMSState] = useState<CMSContent>(DEFAULT_CMS);
  const [cmsLoading, setCmsLoading] = useState(true);
  const [active, setActive] = useState<SectionId>('overview');
  const [pendingAction, setPendingAction] = useState<string | undefined>();
  const [publishState, setPublishState] = useState<'idle' | 'publishing' | 'published' | 'failed'>('idle');
  const [publishedAt, setPublishedAt] = useState<Date | null>(null);
  const [showPublishModal, setShowPublishModal] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);
  const [localMigrationBanner, setLocalMigrationBanner] = useState(false);
  const [hasUnsaved, setHasUnsaved] = useState(false);

  // Load draft on mount
  useEffect(() => {
    if (localMode) {
      setCMSState(loadCMS());
      setCmsLoading(false);
      return;
    }
    loadDraftCMS().then(data => {
      setCMSState(data);
      setCmsLoading(false);
    });
    // Show migration banner if old localStorage content exists
    if (localStorage.getItem(CMS_KEY)) setLocalMigrationBanner(true);
  }, [localMode]);

  const handleChange = useCallback((updated: CMSContent) => {
    setCMSState(updated);
    setHasUnsaved(true);
  }, []);

  const handlePublish = async () => {
    setShowPublishModal(false);
    setPublishState('publishing');
    if (localMode) {
      saveCMS(cms);
      setPublishedAt(new Date());
      setHasUnsaved(false);
      setPublishState('published');
      invalidateCMSCache();
      window.setTimeout(() => setPublishState('idle'), 3500);
      return;
    }
    await saveDraft(cms);
    const { error } = await publishCMS(cms);
    if (error) { setPublishState('failed'); return; }
    await publishAllAssets();
    setPublishedAt(new Date());
    setHasUnsaved(false);
    setPublishState('published');
    invalidateCMSCache();
    invalidateAssetCache();
    setTimeout(() => setPublishState('idle'), 3500);
  };

  const handleMigrateLocal = async () => {
    const raw = localStorage.getItem(CMS_KEY);
    if (!raw) return;
    try {
      const data = JSON.parse(raw) as CMSContent;
      setCMSState(data);
      setHasUnsaved(true);
      const { error } = await saveDraft(data);
      if (!error) {
        localStorage.removeItem(CMS_KEY);
        setLocalMigrationBanner(false);
        alert('Local content loaded. Click "Publish Changes" to make it live on the public website.');
      }
    } catch { alert('Could not parse local CMS content.'); }
  };

  const navigate = (id: string, action?: string) => {
    setActive(id as SectionId);
    setPendingAction(action);
    setSidebarOpen(false);
  };

  const sectionTitle = NAV_GROUPS.flatMap(g => g.items).find(i => i.id === active);

  const SECTION_DESCRIPTIONS: Record<SectionId, string> = {
    overview: 'Real-time summary of your website content.',
    settings: 'Global contact details, social links, and brand statistics.',
    media: 'Manage image URLs used across the site.',
    seo: 'Page titles and meta descriptions for search engines.',
    cta: 'Control all call-to-action buttons across the website.',
    forms: 'Where enquiries go and what users see after submitting.',
    submissions: 'Form enquiries submitted through the public website.',
    'daycare-hero': 'Headline, subtitle, CTAs, and trust badges on the Daycare homepage.',
    'eduhub-hero': 'Headline, subtitle, CTAs, and stats strip on the EduHub homepage.',
    educators: 'Verified team profiles shared by Daycare and EduHub, with brand-specific visibility.',
    testimonials: 'Parent reviews shown on the Daycare page.',
    gallery: 'Campus photos shown in the gallery section.',
    programs: 'Age-based classes on the Programs page.',
    schedule: 'The day timeline in "A Day at Early Years".',
    meals: 'Weekly menus and snack lists.',
    'calendar-events': 'Add, edit, and reorder term dates and events shown on the calendar.',
    'portal-files': 'Upload and manage downloadable files visible to enrolled families in the Parent Portal.',
    faq: 'Frequently asked questions by section.',
    courses: 'CACHE qualification levels on the EduHub pages.',
    alumni: 'Graduate success stories on the EduHub page.',
    accreditation: 'UK accreditation partners on the EduHub page.',
    blog: 'Parent Blog and Educator Blog articles.',
    assets: 'Manage image assets and replacements.',
    popups: 'Announcement popups shown to site visitors.',
    'content-health': 'Content health overview.',
    publications: 'Publications and asset publishing.',
    'launch-checklist': 'Pre-launch checklist for going live.',
  };

  if (cmsLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-8 h-8 text-orange-400 animate-spin mx-auto mb-3" />
          <p className="text-sm text-gray-500">Loading CMS draft…</p>
        </div>
      </div>
    );
  }

  return (
    <div className="admin-console min-h-screen bg-gray-50 flex text-gray-900">
      {sidebarOpen && <div className="fixed inset-0 z-30 bg-black/40 lg:hidden" onClick={() => setSidebarOpen(false)} />}

      {/* Sidebar */}
      <aside className={`fixed lg:static inset-y-0 left-0 z-40 w-60 bg-white border-r border-gray-100 flex flex-col shadow-xl lg:shadow-none transition-transform duration-300 ${sidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}`}>
        {/* Brand */}
        <div className="px-4 py-5 border-b border-gray-100">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-orange-400 to-rose-500 flex items-center justify-center flex-shrink-0">
              <Settings className="w-4 h-4 text-white" />
            </div>
            <div>
              <div className="font-bold text-sm text-gray-900 leading-tight">Owner Console</div>
              <div className={`text-[10px] font-semibold leading-tight ${localMode ? 'text-blue-600' : 'text-green-600'}`}>● {localMode ? 'Local preview' : 'Cloud connected'}</div>
            </div>
          </div>
        </div>

        {/* Nav */}
        <nav className="flex-1 overflow-y-auto py-2">
          {NAV_GROUPS.map((group, gi) => (
            <div key={gi} className="mb-1">
              {group.label && <div className="px-4 pt-3 pb-1 text-[10px] font-bold text-gray-400 uppercase tracking-wider">{group.label}</div>}
              {group.items.map(item => {
                const Icon = item.icon;
                const isActive = active === item.id;
                return (
                  <button key={item.id} onClick={() => { setActive(item.id); setSidebarOpen(false); }}
                    className={`w-full flex items-center gap-2.5 px-4 py-2 text-sm font-medium transition-all ${isActive ? ACTIVE_NAV : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'}`}>
                    <Icon className="w-4 h-4 flex-shrink-0" />
                    {item.label}
                    {item.id === 'submissions' && unreadCount > 0 && (
                      <span className="ml-auto text-[10px] bg-orange-500 text-white rounded-full px-1.5 font-bold">{unreadCount}</span>
                    )}
                  </button>
                );
              })}
            </div>
          ))}
        </nav>

        {/* Status footer */}
        <div className="p-3 border-t border-gray-100 space-y-1.5 text-[10px] text-gray-400">
          {publishedAt && <div className="text-green-600">✓ Published {publishedAt.toLocaleTimeString()}</div>}
          <a href="/" target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 px-3 py-2 rounded-lg text-sm text-gray-600 hover:bg-orange-50 hover:text-orange-700 transition-colors">
            <Eye className="w-4 h-4" />Preview Site ↗
          </a>
          <button onClick={onLogout} className="w-full flex items-center gap-2 px-3 py-2 rounded-lg text-sm text-gray-600 hover:bg-red-50 hover:text-red-600 transition-colors">
            <LogOut className="w-4 h-4" />Sign Out
          </button>
        </div>
      </aside>

      {/* Main */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {/* Migration banner */}
        {localMigrationBanner && (
          <div className="bg-amber-50 border-b border-amber-200 px-4 py-2 flex items-center gap-3 flex-wrap">
            <AlertTriangle className="w-4 h-4 text-amber-600 flex-shrink-0" />
            <span className="text-sm text-amber-800 flex-1">Local CMS content found in this browser. Import it into Supabase draft?</span>
            <button className="px-3 py-1 bg-amber-600 text-white text-xs font-semibold rounded-lg hover:bg-amber-700 transition-colors" onClick={handleMigrateLocal}><Upload className="w-3 h-3 inline mr-1" />Import Local Content</button>
            <button className="text-xs text-amber-600 hover:underline" onClick={() => setLocalMigrationBanner(false)}>Dismiss</button>
          </div>
        )}

        {/* Top bar */}
        <header className="bg-white border-b border-gray-100 px-4 sm:px-5 py-3 flex items-center gap-3 sticky top-0 z-20 shadow-sm">
          <button className="lg:hidden text-gray-500 hover:text-gray-900 transition-colors" onClick={() => setSidebarOpen(!sidebarOpen)}>
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" /></svg>
          </button>
          <div className="flex-1 min-w-0">
            <h1 className="font-bold text-gray-900 text-sm leading-tight truncate">{sectionTitle?.label}</h1>
            <p className="text-xs text-gray-400 hidden sm:block truncate">{SECTION_DESCRIPTIONS[active]}</p>
          </div>
            <span className={`hidden sm:inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold border ${localMode ? 'bg-blue-100 text-blue-700 border-blue-200' : 'bg-green-100 text-green-700 border-green-200'}`}>
            <span className={`w-1.5 h-1.5 rounded-full inline-block ${localMode ? 'bg-blue-500' : 'bg-green-500'}`} />{localMode ? 'Local owner preview' : 'Cloud connected'}
          </span>
          <div className="flex items-center gap-2">
            {hasUnsaved && (
              <span className="hidden sm:inline-flex items-center gap-1 px-2 py-1 rounded-full text-[10px] font-bold bg-amber-100 text-amber-700 border border-amber-200">
                Unsaved changes
              </span>
            )}
            <button
              className={`inline-flex items-center gap-1.5 px-4 py-2 rounded-lg text-sm font-semibold transition-colors ${
                publishState === 'published' ? 'bg-green-600 text-white' :
                publishState === 'publishing' ? 'bg-orange-400 text-white' :
                publishState === 'failed' ? 'bg-red-500 text-white' :
                hasUnsaved ? 'bg-orange-500 text-white hover:bg-orange-600' :
                'bg-orange-500 text-white hover:bg-orange-600'
              }`}
              onClick={() => setShowPublishModal(true)}
              disabled={publishState === 'publishing'}
            >
              {publishState === 'published' ? <><CheckCircle2 className="w-4 h-4" />Published!</> :
               publishState === 'publishing' ? <><Loader2 className="w-4 h-4 animate-spin" />Publishing…</> :
               publishState === 'failed' ? <><AlertCircle className="w-4 h-4" />Failed — Retry</> :
               <><CloudUpload className="w-4 h-4" />Publish Changes</>}
            </button>
          </div>
        </header>

        {/* Content */}
        <main className="flex-1 p-4 sm:p-6 overflow-y-auto">
          <div className="max-w-5xl mx-auto">
            {active === 'overview' && <OverviewSection cms={cms} onNavigate={navigate} unreadCount={unreadCount} />}
            {active === 'settings' && <SiteSettingsSection cms={cms} onChange={handleChange} />}
            {active === 'media' && <MediaSection cms={cms} onChange={handleChange} />}
            {active === 'assets' && <AssetsSection />}
            {active === 'seo' && <SEOSection cms={cms} onChange={handleChange} />}
            {active === 'cta' && <CTASection cms={cms} onChange={handleChange} />}
            {active === 'forms' && <FormSettingsSection cms={cms} onChange={handleChange} />}
            {active === 'submissions' && <SubmissionsSection onUnreadChange={setUnreadCount} />}
            {active === 'daycare-hero' && <DaycareHeroEditorSection cms={cms} onChange={handleChange} />}
            {active === 'eduhub-hero' && <EduhubHeroEditorSection cms={cms} onChange={handleChange} />}
            {active === 'educators' && <EducatorsSection cms={cms} onChange={handleChange} initialNew={pendingAction === 'new'} key={active + pendingAction} />}
            {active === 'testimonials' && <TestimonialsSection cms={cms} onChange={handleChange} initialNew={pendingAction === 'new'} key={active + pendingAction} />}
            {active === 'gallery' && <GallerySection cms={cms} onChange={handleChange} initialNew={pendingAction === 'new'} key={active + pendingAction} />}
            {active === 'programs' && <ProgramsSection cms={cms} onChange={handleChange} />}
            {active === 'schedule' && <ScheduleSection cms={cms} onChange={handleChange} />}
            {active === 'meals' && <MealsSection cms={cms} onChange={handleChange} />}
            {active === 'calendar-events' && <CalendarEventsSection cms={cms} onChange={handleChange} />}
            {active === 'portal-files' && <PortalFilesSection cms={cms} onChange={handleChange} />}
            {active === 'faq' && <FAQSection cms={cms} onChange={handleChange} />}
            {active === 'courses' && <CoursesSection cms={cms} onChange={handleChange} />}
            {active === 'alumni' && <AlumniSection cms={cms} onChange={handleChange} />}
            {active === 'accreditation' && <AccreditationSection cms={cms} onChange={handleChange} />}
            {active === 'blog' && <BlogSection cms={cms} onChange={handleChange} initialNew={pendingAction === 'new'} key={active + pendingAction} />}
            {active === 'popups' && <PopupSection />}
            {active === 'launch-checklist' && <LaunchChecklistSection />}
            {active === 'content-health' && <ContentHealthSection cms={cms} onNavigate={id => setActive(id as SectionId)} />}
            {active === 'publications' && <PublicationsSection />}
          </div>
        </main>
      </div>

      {/* Publish Changes confirmation modal */}
      {showPublishModal && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/60" onClick={() => setShowPublishModal(false)} />
          <div className="relative bg-white rounded-2xl shadow-2xl p-6 w-full max-w-md">
            <div className="flex items-start gap-3 mb-4">
              <CloudUpload className="w-8 h-8 text-orange-500 flex-shrink-0 mt-0.5" />
              <div>
                <h3 className="font-bold text-gray-900 text-lg">Publish Changes</h3>
                <p className="text-gray-600 text-sm mt-1 leading-relaxed">
                  {localMode
                    ? 'Your changes will be saved in this browser for local preview. They will not affect the deployed website.'
                    : 'Your changes will be saved to Supabase and the public website will update immediately. This becomes the live version visible to all visitors.'}
                </p>
              </div>
            </div>
            <div className="bg-green-50 border border-green-200 rounded-lg px-4 py-3 mb-5 flex items-start gap-2">
              <CheckCircle2 className="w-4 h-4 text-green-600 mt-0.5 flex-shrink-0" />
              <p className="text-green-800 text-xs leading-relaxed">
                {localMode
                  ? 'Local publishing is safe and reversible. Clear local site data to return to bundled defaults.'
                  : 'The public website reads content live from Supabase. Changes take effect as soon as publishing completes — no separate deployment needed.'}
              </p>
            </div>
            <div className="flex gap-2 justify-end">
              <button className={btnSecondary} onClick={() => setShowPublishModal(false)}>Cancel</button>
              <button className={btnPrimary} onClick={handlePublish}><CloudUpload className="w-4 h-4" />Publish Changes</button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}

import React, { useMemo } from 'react';
import { AlertTriangle, CheckCircle, XCircle, Info, ArrowRight } from 'lucide-react';
import { CMSContent, isPublished, getHealthWarnings } from '../../data/cms';

type Severity = 'error' | 'warning' | 'info';

interface HealthIssue {
  id: string;
  severity: Severity;
  category: string;
  title: string;
  detail: string;
  action?: string;
  sectionId?: string;
}

function runChecks(cms: CMSContent): HealthIssue[] {
  const issues: HealthIssue[] = [];

  // ── Dynamic checks from getHealthWarnings ──────────────────────────────────
  getHealthWarnings(cms).forEach(w => {
    issues.push({
      id: `dynamic-${w.sectionId}-${w.message.slice(0, 20)}`,
      severity: w.sectionId === 'settings' || w.sectionId === 'forms' ? 'error' : 'warning',
      category: w.section,
      title: `${w.message}${w.count > 1 ? ` (${w.count})` : ''}`,
      detail: `Found in: ${w.section}`,
      sectionId: w.sectionId,
    });
  });

  // ── KNOWN CONTENT CONTRADICTIONS ──────────────────────────────────────────
  issues.push({
    id: 'contradiction-tour-days',
    severity: 'warning',
    category: 'Content Contradiction',
    title: 'Tour availability: confirm Mon–Fri vs Sun–Thu',
    detail: 'The website may describe tours as Mon–Fri. Daycare operating days are typically Sunday–Thursday in Egypt. Confirm the correct tour days with operations.',
    action: 'Update tour day wording in contact page and FAQ.',
  });

  issues.push({
    id: 'contradiction-ages',
    severity: 'warning',
    category: 'Content Contradiction',
    title: 'Age range: separate nursery (1–5) from after-school (6–10)',
    detail: 'FAQ may mention ages up to 10 without clearly distinguishing after-school care from the main nursery programme.',
    action: 'Clarify "Nursery/Preschool (ages 1–5)" vs "After-School Care (ages 6–10)" in FAQ.',
    sectionId: 'faq',
  });

  issues.push({
    id: 'contradiction-calendar-year',
    severity: 'warning',
    category: 'Content Contradiction',
    title: 'Academic calendar: verify dates are for 2026–27',
    detail: 'Confirm calendar events have been updated for the current academic year.',
    action: 'Update calendar entries in CMS → Calendar Events.',
    sectionId: 'calendar-events',
  });

  // ── EDUCATORS ──────────────────────────────────────────────────────────────
  const publishedEducators = cms.educators.filter(isPublished);
  publishedEducators.forEach(e => {
    if (!e.img) {
      issues.push({
        id: `educator-img-${e.id}`,
        severity: 'error',
        category: 'Missing Image',
        title: `${e.name}: portrait image broken or missing`,
        detail: `${e.name} has no portrait image set.`,
        action: 'Add the portrait path in Company Team.',
        sectionId: 'educators',
      });
    }
    if (!e.bio || e.bio.trim().length < 30) {
      issues.push({
        id: `educator-bio-${e.id}`,
        severity: 'warning',
        category: 'Incomplete Content',
        title: `${e.name}: biography missing or too short`,
        detail: 'Educator biographies should describe qualifications, experience, and teaching philosophy.',
        sectionId: 'educators',
      });
    }
  });

  // ── BLOG SEO ────────────────────────────────────────────────────────────
  const publishedBlogs = cms.blog.filter(isPublished);
  publishedBlogs.forEach(b => {
    if (!b.seoDescription) {
      issues.push({
        id: `blog-seo-${b.id}`,
        severity: 'warning',
        category: 'SEO',
        title: `Blog: "${b.title}" missing SEO description`,
        detail: 'Without a meta description, this article will not show a preview in search results.',
        sectionId: 'blog',
      });
    }
  });

  // ── TESTIMONIALS / ALUMNI ─────────────────────────────────────────────────
  const publishedTestimonials = cms.testimonials.filter(isPublished);
  if (publishedTestimonials.length > 0) {
    issues.push({
      id: 'testimonials-consent',
      severity: 'warning',
      category: 'Consent & Verification',
      title: `${publishedTestimonials.length} testimonial(s) without documented consent`,
      detail: 'Testimonials from parents require documented consent to publish name and quote.',
      action: 'Obtain written consent before publishing testimonials.',
      sectionId: 'testimonials',
    });
  }
  const publishedAlumni = cms.alumni.filter(isPublished);
  if (publishedAlumni.length > 0) {
    issues.push({
      id: 'alumni-consent',
      severity: 'warning',
      category: 'Consent & Verification',
      title: `${publishedAlumni.length} alumni profile(s) without documented consent`,
      detail: 'Alumni profiles require consent for publishing name, photo, and career information.',
      action: 'Obtain written consent for each alumni profile.',
      sectionId: 'alumni',
    });
  }

  // ── GLOBAL SEO ─────────────────────────────────────────────────────────────
  if (!cms.seo.daycareTitle || cms.seo.daycareTitle.length < 10) {
    issues.push({ id: 'seo-daycare-title', severity: 'warning', category: 'SEO', title: 'Daycare SEO title missing or too short', detail: 'Set a unique, descriptive SEO title for the Daycare homepage (50–60 chars).', sectionId: 'seo' });
  }
  if (!cms.seo.eduhubTitle || cms.seo.eduhubTitle.length < 10) {
    issues.push({ id: 'seo-eduhub-title', severity: 'warning', category: 'SEO', title: 'EduHub SEO title missing or too short', detail: 'Set a unique, descriptive SEO title for the EduHub homepage (50–60 chars).', sectionId: 'seo' });
  }
  if (!cms.seo.daycareDescription || cms.seo.daycareDescription.length < 50) {
    issues.push({ id: 'seo-daycare-desc', severity: 'warning', category: 'SEO', title: 'Daycare meta description missing or too short', detail: 'Meta descriptions should be 120–160 characters.', sectionId: 'seo' });
  }
  if (!cms.seo.eduhubDescription || cms.seo.eduhubDescription.length < 50) {
    issues.push({ id: 'seo-eduhub-desc', severity: 'warning', category: 'SEO', title: 'EduHub meta description missing or too short', detail: 'Meta descriptions should be 120–160 characters.', sectionId: 'seo' });
  }
  if (!cms.seo.defaultOGImage) {
    issues.push({ id: 'seo-og-image', severity: 'warning', category: 'SEO', title: 'Default Open Graph image not set', detail: 'Without an OG image, social shares will not display a preview image.', sectionId: 'seo' });
  }

  // ── GALLERY ALT TEXT ───────────────────────────────────────────────────────
  const galleryMissingAlt = cms.gallery.filter(g => isPublished(g) && !g.alt);
  if (galleryMissingAlt.length > 0) {
    issues.push({
      id: 'gallery-alt',
      severity: 'warning',
      category: 'Accessibility',
      title: `${galleryMissingAlt.length} gallery image(s) missing alt text`,
      detail: 'All images require descriptive alt text for accessibility and SEO.',
      sectionId: 'gallery',
    });
  }

  // ── MEDIA ALT TEXT ─────────────────────────────────────────────────────────
  const mediaMissingAlt = cms.media.filter(m => isPublished(m) && !m.alt);
  if (mediaMissingAlt.length > 0) {
    issues.push({
      id: 'media-alt',
      severity: 'warning',
      category: 'Accessibility',
      title: `${mediaMissingAlt.length} media item(s) missing alt text`,
      detail: 'All media items require descriptive alt text.',
      sectionId: 'media',
    });
  }

  // ── PARENT PORTAL ─────────────────────────────────────────────────────────
  const portalFiles = (cms.portalFiles ?? []).filter(f => f.active !== false);
  const missingUrlFiles = portalFiles.filter(f => !f.url);
  if (missingUrlFiles.length > 0) {
    issues.push({
      id: 'portal-missing-url',
      severity: 'error',
      category: 'Portal Files',
      title: `${missingUrlFiles.length} document(s) missing download URL`,
      detail: `Affected: ${missingUrlFiles.slice(0, 3).map(f => f.name).join(', ')}${missingUrlFiles.length > 3 ? '…' : ''}. Download CTAs will be broken.`,
      action: 'Add download URLs in CMS → Portal Files.',
      sectionId: 'portal-files',
    });
  }

  // De-duplicate by id
  const seen = new Set<string>();
  return issues.filter(i => {
    if (seen.has(i.id)) return false;
    seen.add(i.id);
    return true;
  });
}

const SEVERITY_CONFIG: Record<Severity, { bg: string; border: string; icon: React.FC<{ className?: string }>; iconColor: string; label: string }> = {
  error: { bg: 'bg-red-50', border: 'border-red-200', icon: XCircle, iconColor: 'text-red-500', label: 'Error' },
  warning: { bg: 'bg-amber-50', border: 'border-amber-200', icon: AlertTriangle, iconColor: 'text-amber-500', label: 'Warning' },
  info: { bg: 'bg-blue-50', border: 'border-blue-200', icon: Info, iconColor: 'text-blue-500', label: 'Info' },
};

function IssueCard({ issue, onNavigate }: { issue: HealthIssue; onNavigate?: (id: string) => void }) {
  const cfg = SEVERITY_CONFIG[issue.severity];
  const Icon = cfg.icon;
  return (
    <div className={`${cfg.bg} ${cfg.border} border rounded-xl p-4`}>
      <div className="flex items-start gap-3">
        <Icon className={`w-4 h-4 ${cfg.iconColor} flex-shrink-0 mt-0.5`} />
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap mb-0.5">
            <span className="text-xs font-semibold text-gray-500 uppercase tracking-wide">{issue.category}</span>
            <span className={`text-[10px] px-1.5 py-0.5 rounded-full font-bold ${
              issue.severity === 'error' ? 'bg-red-100 text-red-700' :
              issue.severity === 'warning' ? 'bg-amber-100 text-amber-700' : 'bg-blue-100 text-blue-700'
            }`}>{cfg.label}</span>
          </div>
          <p className="text-sm font-semibold text-gray-900">{issue.title}</p>
          <p className="text-xs text-gray-600 mt-1 leading-relaxed">{issue.detail}</p>
          {(issue.action || issue.sectionId) && (
            <div className="flex items-center gap-3 mt-2 pt-2 border-t border-current/10">
              {issue.action && <p className="text-xs text-gray-500 italic flex-1">{issue.action}</p>}
              {issue.sectionId && onNavigate && (
                <button
                  onClick={() => onNavigate(issue.sectionId!)}
                  className="flex-shrink-0 flex items-center gap-1 text-xs font-semibold text-blue-600 hover:text-blue-800 transition-colors"
                >
                  Go to section <ArrowRight className="w-3 h-3" />
                </button>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export function ContentHealthSection({ cms, onNavigate }: { cms: CMSContent; onNavigate?: (sectionId: string) => void }) {
  const issues = useMemo(() => runChecks(cms), [cms]);

  const errors = issues.filter(i => i.severity === 'error');
  const warnings = issues.filter(i => i.severity === 'warning');
  const infos = issues.filter(i => i.severity === 'info');

  const categories = Array.from(new Set(issues.map(i => i.category))).sort();

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-semibold text-gray-900">Content Health</h2>
        <p className="text-sm text-gray-500 mt-1">
          Live audit of missing data, contradictions, SEO gaps, and unverified claims. Each issue links to the relevant admin section.
        </p>
      </div>

      {/* Summary */}
      <div className="grid grid-cols-3 gap-3">
        <div className={`rounded-xl border p-3 text-center ${errors.length > 0 ? 'bg-red-50 border-red-200' : 'bg-white border-gray-100'}`}>
          <p className={`text-2xl font-bold ${errors.length > 0 ? 'text-red-600' : 'text-gray-400'}`}>{errors.length}</p>
          <p className="text-xs text-gray-500 mt-0.5">Errors</p>
        </div>
        <div className={`rounded-xl border p-3 text-center ${warnings.length > 0 ? 'bg-amber-50 border-amber-200' : 'bg-white border-gray-100'}`}>
          <p className={`text-2xl font-bold ${warnings.length > 0 ? 'text-amber-600' : 'text-gray-400'}`}>{warnings.length}</p>
          <p className="text-xs text-gray-500 mt-0.5">Warnings</p>
        </div>
        <div className="bg-white rounded-xl border border-gray-100 p-3 text-center">
          <p className="text-2xl font-bold text-blue-500">{infos.length}</p>
          <p className="text-xs text-gray-500 mt-0.5">Info</p>
        </div>
      </div>

      {errors.length === 0 && warnings.length === 0 ? (
        <div className="bg-green-50 border border-green-200 rounded-xl p-6 text-center">
          <CheckCircle className="w-8 h-8 text-green-500 mx-auto mb-2" />
          <p className="font-semibold text-green-800">No critical issues</p>
          <p className="text-xs text-green-700 mt-1">All mandatory content fields are populated and no contradictions detected.</p>
        </div>
      ) : null}

      {/* Issues by category */}
      {categories.map(cat => {
        const catIssues = issues.filter(i => i.category === cat);
        const catErrors = catIssues.filter(i => i.severity === 'error').length;
        return (
          <div key={cat}>
            <h3 className="text-sm font-semibold text-gray-700 mb-2 flex items-center gap-2">
              {cat}
              <span className="text-xs font-normal text-gray-400">({catIssues.length})</span>
              {catErrors > 0 && <span className="text-[10px] px-1.5 py-0.5 rounded-full bg-red-100 text-red-700 font-bold">{catErrors} error{catErrors > 1 ? 's' : ''}</span>}
            </h3>
            <div className="space-y-2">
              {catIssues.map(issue => <IssueCard key={issue.id} issue={issue} onNavigate={onNavigate} />)}
            </div>
          </div>
        );
      })}
    </div>
  );
}

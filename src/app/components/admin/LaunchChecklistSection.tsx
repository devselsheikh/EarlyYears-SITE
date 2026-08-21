import { useState, useEffect } from 'react';
import { CheckCircle2, Circle, Rocket, AlertTriangle, ExternalLink, RefreshCw } from 'lucide-react';
import { checkBackendHealth, type BackendHealth } from '../../utils/supabase/health';

interface CheckItem {
  id: string;
  label: string;
  hint?: string;
  link?: string;
  linkLabel?: string;
  category: string;
}

const CHECKLIST: CheckItem[] = [
  // Infrastructure
  { id: 'domain', label: 'Custom domain connected and live', hint: 'Point DNS A/CNAME to hosting provider', category: 'Infrastructure' },
  { id: 'supabase', label: 'Supabase project connected', hint: 'Environment variables VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY are set', category: 'Infrastructure' },
  { id: 'ssl', label: 'SSL certificate active (https://)', category: 'Infrastructure' },
  // CMS & Content
  { id: 'cms-publish', label: 'CMS content published to Supabase', hint: 'Click "Publish Changes" to save all CMS data to the live database', category: 'CMS & Content' },
  { id: 'real-photos', label: 'Real campus/daycare photos added to Media Library', category: 'CMS & Content' },
  { id: 'docs-linked', label: 'All document download URLs filled in (Portal Files)', hint: 'No documents should have empty URL', category: 'CMS & Content' },
  { id: 'no-placeholder', label: 'No placeholder links or "#" CTAs remaining', category: 'CMS & Content' },
  { id: 'whatsapp-verified', label: 'WhatsApp number verified and tested', hint: 'Test the wa.me link from a mobile device', category: 'CMS & Content' },
  // Forms & Submissions
  { id: 'forms-tested', label: 'All contact forms tested end-to-end', hint: 'Submit a test enquiry for each form type', category: 'Forms & Submissions' },
  { id: 'submissions-inbox', label: 'Submissions appear in admin Inbox after test submission', category: 'Forms & Submissions' },
  { id: 'email-delivery', label: 'Email delivery endpoint configured and tested', hint: 'Add endpoint URL in Form Settings → Email Endpoint', category: 'Forms & Submissions' },
  // SEO
  { id: 'seo-titles', label: 'All SEO titles and meta descriptions completed', hint: 'Update in CMS → SEO section', category: 'SEO' },
  { id: 'og-image', label: 'Default OG image set for social sharing', category: 'SEO' },
  { id: 'sitemap', label: 'Sitemap.xml configured at hosting level', category: 'SEO' },
  { id: 'gsc', label: 'Google Search Console property verified', hint: 'Submit sitemap once domain is live', category: 'SEO', link: 'https://search.google.com/search-console', linkLabel: 'Open GSC' },
  { id: 'robots', label: 'robots.txt allows indexing of public pages', category: 'SEO' },
  // CTAs & Navigation
  { id: 'ctas-tested', label: 'All public CTAs tested (Book a Tour, Register Interest)', category: 'CTAs & Navigation' },
  { id: 'mobile-tested', label: 'Mobile layout reviewed at 390px width', hint: 'No overflow, sticky CTA not blocking content', category: 'CTAs & Navigation' },
  { id: 'nav-links', label: 'All navigation links working', category: 'CTAs & Navigation' },
  { id: 'footer-links', label: 'Footer links verified (no dead links)', category: 'CTAs & Navigation' },
  // Verification
  { id: 'claims-verified', label: 'All public claims reviewed in Claims & Verification', hint: 'Mark unverified claims as hidden', category: 'Verification' },
  { id: 'content-health', label: 'Content Health showing no critical warnings', category: 'Verification' },
  { id: 'owner-approved', label: 'Owner has reviewed and approved the live site', category: 'Verification' },
];

const STORAGE_KEY = 'eyc_launch_checklist_v1';

function loadChecked(): Record<string, boolean> {
  try { return JSON.parse(localStorage.getItem(STORAGE_KEY) || '{}'); } catch { return {}; }
}

function saveChecked(data: Record<string, boolean>) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
}

export function LaunchChecklistSection() {
  const [checked, setChecked] = useState<Record<string, boolean>>(loadChecked);
  const [backendHealth, setBackendHealth] = useState<BackendHealth | null>(null);

  useEffect(() => {
    checkBackendHealth().then(setBackendHealth);
  }, []);

  const toggle = (id: string) => {
    const next = { ...checked, [id]: !checked[id] };
    setChecked(next);
    saveChecked(next);
  };

  const reset = () => { setChecked({}); saveChecked({}); };

  const total = CHECKLIST.length;
  const done = CHECKLIST.filter(i => checked[i.id]).length;
  const pct = Math.round((done / total) * 100);

  const categories = Array.from(new Set(CHECKLIST.map(i => i.category)));

  const autoChecked: Record<string, boolean> = {};
  if (backendHealth?.state === 'online') autoChecked['supabase'] = true;

  const effectiveChecked = (id: string) => autoChecked[id] || checked[id] || false;
  const effectiveDone = CHECKLIST.filter(i => effectiveChecked(i.id)).length;
  const effectivePct = Math.round((effectiveDone / total) * 100);

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      {/* Header */}
      <div className="flex items-start justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2">
            <Rocket className="w-6 h-6 text-orange-500" /> Launch Checklist
          </h2>
          <p className="text-sm text-gray-500 mt-1">Track everything that needs to be done before going live.</p>
        </div>
        <button onClick={reset} className="flex items-center gap-1.5 px-3 py-2 text-xs font-semibold text-gray-500 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
          <RefreshCw className="w-3.5 h-3.5" /> Reset
        </button>
      </div>

      {/* Progress bar */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
        <div className="flex items-center justify-between mb-3">
          <span className="text-sm font-semibold text-gray-700">{effectiveDone} of {total} complete</span>
          <span className={`text-sm font-bold ${effectivePct === 100 ? 'text-green-600' : effectivePct >= 75 ? 'text-amber-600' : 'text-orange-600'}`}>{effectivePct}%</span>
        </div>
        <div className="h-3 bg-gray-100 rounded-full overflow-hidden">
          <div
            className={`h-full rounded-full transition-all duration-500 ${effectivePct === 100 ? 'bg-green-500' : effectivePct >= 75 ? 'bg-amber-500' : 'bg-orange-500'}`}
            style={{ width: `${effectivePct}%` }}
          />
        </div>
        {effectivePct === 100 && (
          <div className="mt-4 flex items-center gap-2 px-4 py-3 bg-green-50 border border-green-200 rounded-xl">
            <CheckCircle2 className="w-5 h-5 text-green-600 flex-shrink-0" />
            <p className="text-green-800 text-sm font-medium">All items complete — you're ready to launch!</p>
          </div>
        )}
      </div>

      {/* Supabase status */}
      <div className={`px-4 py-3 rounded-xl border flex items-start gap-3 text-sm ${backendHealth?.state === 'online' ? 'bg-green-50 border-green-200 text-green-800' : backendHealth ? 'bg-amber-50 border-amber-200 text-amber-900' : 'bg-gray-50 border-gray-200 text-gray-600'}`}>
        {!backendHealth ? <span className="animate-pulse">Checking all required backend services…</span>
          : backendHealth.state === 'online'
          ? <><CheckCircle2 className="w-4 h-4 flex-shrink-0 mt-0.5" /> <div><strong>Supabase fully ready</strong><p className="text-xs mt-0.5">{backendHealth.message}</p></div></>
          : <><AlertTriangle className="w-4 h-4 flex-shrink-0 mt-0.5" /><div className="flex-1"><strong>{backendHealth.state === 'local' ? 'Local mode active' : 'Supabase needs attention'}</strong><p className="text-xs mt-0.5 leading-relaxed">{backendHealth.message}</p>{backendHealth.failedServices.length > 0 && <p className="text-xs mt-1 font-semibold">Missing or unreachable: {backendHealth.failedServices.join(', ')}</p>}<button type="button" onClick={() => { setBackendHealth(null); checkBackendHealth().then(setBackendHealth); }} className="mt-2 underline font-semibold">Run check again</button></div></>
        }
      </div>

      {/* Checklist by category */}
      {categories.map(cat => (
        <div key={cat} className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
          <div className="px-5 py-3 bg-gray-50 border-b border-gray-100">
            <h3 className="text-sm font-bold text-gray-700">{cat}</h3>
          </div>
          <div className="divide-y divide-gray-50">
            {CHECKLIST.filter(i => i.category === cat).map(item => {
              const isAuto = !!autoChecked[item.id];
              const isChecked = effectiveChecked(item.id);
              return (
                <div
                  key={item.id}
                  onClick={() => !isAuto && toggle(item.id)}
                  className={`flex items-start gap-3 px-5 py-4 cursor-pointer hover:bg-gray-50 transition-colors ${isChecked ? 'bg-green-50/40' : ''}`}
                >
                  <div className="mt-0.5 flex-shrink-0">
                    {isChecked
                      ? <CheckCircle2 className="w-5 h-5 text-green-500" />
                      : <Circle className="w-5 h-5 text-gray-300" />
                    }
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className={`text-sm font-medium ${isChecked ? 'text-gray-400 line-through' : 'text-gray-900'}`}>{item.label}</p>
                    {item.hint && !isChecked && <p className="text-xs text-gray-400 mt-0.5 leading-relaxed">{item.hint}</p>}
                    {isAuto && <span className="text-xs text-green-600 font-medium">Auto-detected</span>}
                  </div>
                  {item.link && (
                    <a
                      href={item.link}
                      target="_blank"
                      rel="noopener noreferrer"
                      onClick={e => e.stopPropagation()}
                      className="flex-shrink-0 flex items-center gap-1 text-xs text-blue-600 hover:underline"
                    >
                      {item.linkLabel || 'Open'} <ExternalLink className="w-3 h-3" />
                    </a>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      ))}

      <p className="text-xs text-gray-400 text-center pb-4">Checklist progress is saved locally in your browser.</p>
    </div>
  );
}

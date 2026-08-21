// ─────────────────────────────────────────────────────────────────────────────
// SitePopup — site-wide announcement popup managed via the CMS dashboard.
//
// Fetches the active popup from Supabase `site_popups` table.
// Respects `show_once` (uses sessionStorage to suppress repeats).
// Supports configurable delay, page targeting, and a CTA button.
// ─────────────────────────────────────────────────────────────────────────────

import { useState, useEffect, useCallback } from 'react';
import { X } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
const supabaseConfigured = Boolean(import.meta.env.VITE_SUPABASE_URL?.trim() && import.meta.env.VITE_SUPABASE_ANON_KEY?.trim());

interface SitePopupRow {
  id: string;
  title: string;
  body: string;
  cta_label: string | null;
  cta_url: string | null;
  badge_text: string | null;
  pages: 'all' | 'daycare' | 'eduhub';
  delay_seconds: number;
  show_once: boolean;
  enabled: boolean;
  bg_color: string | null;  // tailwind class e.g. "from-peach-400 to-coral-500"
}

interface SitePopupProps {
  /** Which site section this is displayed on — used to filter by popup.pages */
  site?: 'daycare' | 'eduhub' | 'all';
}

const SESSION_KEY = 'ey_popup_seen';

export function SitePopup({ site = 'all' }: SitePopupProps) {
  const [popup, setPopup] = useState<SitePopupRow | null>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    let timer: ReturnType<typeof setTimeout>;

    async function load() {
      if (!supabaseConfigured) return;
      const { supabase } = await import('../utils/supabase/client');
      try {
        const { data } = await supabase
          .from('site_popups')
          .select('*')
          .eq('enabled', true)
          .in('pages', ['all', site])
          .order('created_at', { ascending: false })
          .limit(1)
          .single();

        if (!data) return;
        const row = data as SitePopupRow;

        // Respect show_once — suppress if already dismissed this session
        if (row.show_once && sessionStorage.getItem(`${SESSION_KEY}_${row.id}`)) return;

        setPopup(row);
        timer = setTimeout(() => setVisible(true), (row.delay_seconds ?? 2) * 1000);
      } catch {
        // Supabase unavailable — no popup shown
      }
    }

    load();
    return () => clearTimeout(timer);
  }, [site]);

  const dismiss = useCallback(() => {
    setVisible(false);
    if (popup?.show_once) {
      sessionStorage.setItem(`${SESSION_KEY}_${popup.id}`, '1');
    }
  }, [popup]);

  if (!popup) return null;

  const gradientClass = popup.bg_color ?? 'from-peach-400 to-coral-500';

  return (
    <AnimatePresence>
      {visible && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={dismiss}
            className="fixed inset-0 bg-black/40 backdrop-blur-sm z-[200]"
          />

          {/* Modal */}
          <motion.div
            initial={{ opacity: 0, scale: 0.92, y: 24 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.92, y: 24 }}
            transition={{ type: 'spring', damping: 22, stiffness: 300 }}
            className="fixed inset-0 z-[201] flex items-center justify-center p-4 pointer-events-none"
          >
            <div className="relative w-full max-w-md bg-white rounded-3xl shadow-2xl overflow-hidden pointer-events-auto">
              {/* Header gradient */}
              <div className={`bg-gradient-to-br ${gradientClass} px-6 pt-6 pb-8`}>
                <button
                  onClick={dismiss}
                  className="absolute top-4 right-4 w-8 h-8 rounded-full bg-white/20 hover:bg-white/30 flex items-center justify-center text-white transition-colors"
                  aria-label="Close"
                >
                  <X className="w-4 h-4" />
                </button>

                {popup.badge_text && (
                  <span className="inline-block text-[11px] font-semibold uppercase tracking-wider bg-white/25 text-white px-2.5 py-1 rounded-full mb-3">
                    {popup.badge_text}
                  </span>
                )}

                <h2 className="text-xl font-bold text-white leading-snug">{popup.title}</h2>
              </div>

              {/* Body */}
              <div className="px-6 py-5">
                <p className="text-sm text-gray-700 leading-relaxed whitespace-pre-line">{popup.body}</p>

                <div className="mt-5 flex gap-3">
                  {popup.cta_label && popup.cta_url && (
                    <a
                      href={popup.cta_url}
                      className={`flex-1 text-center px-4 py-3 rounded-2xl bg-gradient-to-r ${gradientClass} text-white font-semibold text-sm hover:shadow-lg transition-all`}
                    >
                      {popup.cta_label}
                    </a>
                  )}
                  <button
                    onClick={dismiss}
                    className="flex-1 px-4 py-3 rounded-2xl border border-gray-200 text-gray-600 font-semibold text-sm hover:bg-gray-50 transition-colors"
                  >
                    Close
                  </button>
                </div>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}

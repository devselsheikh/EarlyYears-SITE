import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  Lock, FileText, Camera, UtensilsCrossed, Calendar, ClipboardList,
  Download, LogOut, Star, Heart, ChevronRight, Bell, BookOpen,
  CheckCircle2, AlertCircle, Clock, Leaf, Sun,
} from 'lucide-react';
import DaycareNav from '../../components/DaycareNav';
import DaycareFooter from '../../components/DaycareFooter';
import { supabase, supabaseConfigured } from '../../utils/supabase/client';
import { useCMS } from '../../hooks/useCMS';
import type { CMSCalendarEvent, CMSPortalFile, CMSMeals } from '../../data/cms';

// ─── Auth ─────────────────────────────────────────────────────────────────────

const SESSION_KEY = 'ey_parent_portal_auth';
const LOCAL_PORTAL_PIN = import.meta.env.VITE_PARENT_PORTAL_PIN?.trim() || (import.meta.env.DEV ? '2026' : '');

// ─── Pin Gate ─────────────────────────────────────────────────────────────────

function PinGate({ onSuccess }: { onSuccess: () => void }) {
  const [pin, setPin] = useState('');
  const [error, setError] = useState('');
  const [checking, setChecking] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!pin.trim()) return;
    setError('');
    setChecking(true);
    try {
      let accepted = false;
      if (supabaseConfigured) {
        const verification = supabase.rpc('verify_parent_portal_pin', { candidate_pin: pin.trim() });
        const result = await Promise.race([
          verification,
          new Promise<never>((_, reject) => window.setTimeout(() => reject(new Error('Portal verification timed out')), 5_000)),
        ]);
        if (result.error) throw result.error;
        accepted = result.data === true;
      } else {
        accepted = Boolean(LOCAL_PORTAL_PIN && pin.trim() === LOCAL_PORTAL_PIN);
      }
      if (accepted) {
        sessionStorage.setItem(SESSION_KEY, '1');
        onSuccess();
      } else {
        setError('Incorrect PIN. Please check with the nursery team.');
        setPin('');
      }
    } catch {
      setError('The portal could not verify access right now. Please retry or contact the nursery team.');
    } finally {
      setChecking(false);
    }
  };

  return (
    <main className="min-h-screen bg-gradient-to-br from-peach-50 via-white to-coral-50 flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ type: 'spring', damping: 20 }}
        className="w-full max-w-sm"
      >
        {/* Card */}
        <div className="bg-white rounded-3xl shadow-2xl overflow-hidden">
          {/* Header */}
          <div className="bg-gradient-to-br from-peach-400 via-coral-500 to-pink-500 px-8 pt-8 pb-10 text-center">
            <div className="w-16 h-16 bg-white/20 rounded-2xl flex items-center justify-center mx-auto mb-4 backdrop-blur-sm">
              <Lock className="w-8 h-8 text-white" />
            </div>
            <h1 className="text-2xl font-bold text-white">Family Portal</h1>
            <p className="text-white/75 text-sm mt-1">Early Years — The Daycare</p>
          </div>

          {/* Body */}
          <div className="px-8 py-7 space-y-5">
            <p className="text-sm text-gray-500 text-center leading-relaxed">
              This shared information space is for approved families. No individual child profile is required—enter the PIN supplied by the nursery team.
            </p>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="relative">
                <input
                  aria-label="Parent Portal PIN"
                  type="password"
                  value={pin}
                  onChange={e => setPin(e.target.value)}
                  placeholder="• • • •"
                  maxLength={8}
                  autoFocus
                  className="w-full border-2 border-gray-200 rounded-2xl px-5 py-4 text-center text-2xl tracking-[0.6em] font-mono focus:outline-none focus:border-peach-400 transition-colors placeholder:tracking-normal placeholder:text-gray-300"
                />
              </div>

              <AnimatePresence>
                {error && (
                  <motion.p
                    initial={{ opacity: 0, y: -4 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0 }}
                    className="text-xs text-red-600 text-center flex items-center justify-center gap-1"
                  >
                    <AlertCircle className="w-3.5 h-3.5" /> {error}
                  </motion.p>
                )}
              </AnimatePresence>

              <button
                type="submit"
                disabled={checking || pin.length < 4}
                className="w-full py-3.5 bg-gradient-to-r from-peach-400 to-coral-500 text-white rounded-2xl font-bold hover:shadow-lg hover:scale-[1.02] transition-all disabled:opacity-40 disabled:scale-100"
              >
                {checking ? 'Checking…' : 'Enter Portal →'}
              </button>
            </form>

            <p className="text-xs text-gray-600 text-center">
              Need your PIN?{' '}
              <a href="/daycare/contact" className="text-orange-700 hover:underline font-medium">Contact us</a>
            </p>
          </div>
        </div>

        {/* What's inside teaser */}
        <div className="mt-4 grid grid-cols-3 gap-2">
          {[
            { icon: FileText, label: 'Newsletters' },
            { icon: UtensilsCrossed, label: 'Full Menu' },
            { icon: Calendar, label: 'Calendar' },
          ].map(({ icon: Icon, label }) => (
            <div key={label} className="bg-white/70 backdrop-blur rounded-2xl p-3 text-center border border-white/80">
              <Icon className="w-5 h-5 text-gray-400 mx-auto mb-1" />
              <p className="text-[10px] text-gray-500 font-medium">{label}</p>
            </div>
          ))}
        </div>
      </motion.div>
    </main>
  );
}

// ─── Section types ────────────────────────────────────────────────────────────

type Section = 'home' | 'newsletters' | 'classroom' | 'menu' | 'calendar' | 'forms';

const SECTIONS: { id: Section; label: string; icon: React.FC<{ className?: string }>; desc: string }[] = [
  { id: 'home',        label: 'Overview',     icon: Star,           desc: 'Your family hub' },
  { id: 'newsletters', label: 'Newsletters',   icon: FileText,       desc: 'Monthly updates' },
  { id: 'menu',        label: 'Lunch Menu',    icon: UtensilsCrossed,desc: 'Full seasonal menu' },
  { id: 'calendar',    label: 'Calendar',      icon: Calendar,       desc: 'Term dates & events' },
  { id: 'forms',       label: 'Forms & Files', icon: ClipboardList,  desc: 'Downloads' },
  { id: 'classroom',   label: 'Classroom',     icon: Camera,         desc: 'Photos & updates' },
];

const EVENT_COLORS: Record<CMSCalendarEvent['type'], string> = {
  term:    'bg-blue-100 text-blue-700 border-blue-200',
  holiday: 'bg-red-100 text-red-700 border-red-200',
  event:   'bg-purple-100 text-purple-700 border-purple-200',
  parent:  'bg-green-100 text-green-700 border-green-200',
  closure: 'bg-orange-100 text-orange-700 border-orange-200',
  camp:    'bg-yellow-100 text-yellow-700 border-yellow-200',
};

// ─── Portal Content ───────────────────────────────────────────────────────────

function PortalContent({ onLogout }: { onLogout: () => void }) {
  const cms = useCMS();
  const [activeSection, setActiveSection] = useState<Section>('home');

  const meals = cms.meals;
  const calendarEvents = (cms.calendarEvents ?? []).filter(e => e.active !== false).sort((a, b) => a.isoDate.localeCompare(b.isoDate));
  const portalFiles = (cms.portalFiles ?? []).filter(f => f.active !== false).sort((a, b) => a.displayOrder - b.displayOrder);

  const newsletters = portalFiles.filter(f => f.category === 'newsletter');
  const forms = portalFiles.filter(f => f.category === 'form' || f.category === 'policy' || f.category === 'other');
  const menuFiles = portalFiles.filter(f => f.category === 'menu');

  const upcomingEvents = calendarEvents
    .filter(e => e.isoDate >= new Date().toISOString().slice(0, 10))
    .slice(0, 4);

  return (
    <div className="min-h-screen bg-[#faf9f7]">
      <DaycareNav />

      <main>

      {/* Portal header */}
      <div className="bg-gradient-to-br from-peach-400 via-coral-500 to-pink-500 relative overflow-hidden">
        <div className="absolute inset-0 opacity-10" style={{ backgroundImage: 'radial-gradient(circle at 30% 50%, white 1px, transparent 1px)', backgroundSize: '24px 24px' }} />
        <div className="relative max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-10">
          <div className="flex items-center justify-between gap-4 mb-6">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <div className="w-5 h-5 bg-white/30 rounded-full flex items-center justify-center">
                  <Star className="w-3 h-3 text-white fill-white" />
                </div>
                <span className="text-white/80 text-xs font-semibold uppercase tracking-wide">Enrolled Families</span>
              </div>
              <h1 className="text-2xl sm:text-3xl font-bold text-white">Family Portal</h1>
              <p className="text-white/70 text-sm mt-0.5">Early Years — The Daycare</p>
            </div>
            <button
              onClick={onLogout}
              className="flex items-center gap-1.5 text-sm text-white/70 hover:text-white transition-colors bg-white/10 hover:bg-white/20 px-3 py-2 rounded-xl"
            >
              <LogOut className="w-4 h-4" /> Sign out
            </button>
          </div>

          {/* Section tab bar */}
          <div className="flex gap-1.5 overflow-x-auto pb-1 scrollbar-hide -mx-1 px-1">
            {SECTIONS.map(s => {
              const Icon = s.icon;
              const active = activeSection === s.id;
              return (
                <button
                  key={s.id}
                  onClick={() => setActiveSection(s.id)}
                  className={`flex items-center gap-2 px-3.5 py-2.5 rounded-2xl text-sm font-semibold whitespace-nowrap transition-all flex-shrink-0 ${
                    active
                      ? 'bg-white text-coral-600 shadow-sm'
                      : 'text-white/80 hover:bg-white/15 hover:text-white'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  <span className="hidden sm:inline">{s.label}</span>
                  <span className="sm:hidden">{s.label.split(' ')[0]}</span>
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <AnimatePresence mode="wait">
          <motion.div
            key={activeSection}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.18 }}
          >
            {activeSection === 'home'        && <HomeOverview newsletters={newsletters} upcomingEvents={upcomingEvents} forms={forms} onNavigate={setActiveSection} />}
            {activeSection === 'newsletters' && <NewslettersSection files={newsletters} />}
            {activeSection === 'menu'        && <MenuSection meals={meals} menuFiles={menuFiles} />}
            {activeSection === 'calendar'    && <CalendarSection events={calendarEvents} />}
            {activeSection === 'forms'       && <FormsSection files={[...forms, ...menuFiles]} />}
            {activeSection === 'classroom'   && <ClassroomSection />}
          </motion.div>
        </AnimatePresence>
      </div>
      </main>

      <DaycareFooter />
    </div>
  );
}

// ─── Overview (home) ──────────────────────────────────────────────────────────

function HomeOverview({
  newsletters, upcomingEvents, forms,
  onNavigate,
}: {
  newsletters: CMSPortalFile[];
  upcomingEvents: CMSCalendarEvent[];
  forms: CMSPortalFile[];
  onNavigate: (s: Section) => void;
}) {
  const latest = newsletters[0];

  return (
    <div className="space-y-6">
      {/* Welcome banner */}
      <div className="bg-gradient-to-r from-peach-50 to-coral-50 border border-peach-100 rounded-3xl p-6 flex items-start gap-4">
        <span className="text-3xl flex-shrink-0">👋</span>
        <div>
          <h2 className="font-bold text-gray-900 text-lg">Welcome to your Family Portal</h2>
          <p className="text-sm text-gray-600 mt-1 leading-relaxed">
            Everything you need — newsletters, full menus, the term calendar, and downloadable forms — all in one private place.
          </p>
        </div>
      </div>

      {/* Quick-access grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        {([
          { id: 'newsletters' as Section, icon: FileText,        label: 'Newsletters',   color: 'from-blue-50 to-indigo-50', border: 'border-blue-100', iconColor: 'text-blue-500', count: newsletters.length },
          { id: 'menu'        as Section, icon: UtensilsCrossed, label: 'Lunch Menus',   color: 'from-emerald-50 to-teal-50', border: 'border-emerald-100', iconColor: 'text-emerald-600', count: 4 },
          { id: 'calendar'    as Section, icon: Calendar,        label: 'Calendar',      color: 'from-purple-50 to-violet-50', border: 'border-purple-100', iconColor: 'text-purple-500', count: upcomingEvents.length },
          { id: 'forms'       as Section, icon: ClipboardList,   label: 'Forms & Files', color: 'from-amber-50 to-orange-50', border: 'border-amber-100', iconColor: 'text-amber-600', count: forms.length },
        ] as const).map(item => {
          const Icon = item.icon;
          return (
            <button
              key={item.id}
              onClick={() => onNavigate(item.id)}
              className={`bg-gradient-to-br ${item.color} border ${item.border} rounded-2xl p-4 text-left hover:shadow-md transition-all group`}
            >
              <div className="flex items-center justify-between mb-3">
                <Icon className={`w-5 h-5 ${item.iconColor}`} />
                <span className="text-xs font-bold text-gray-400">{item.count}</span>
              </div>
              <p className="font-semibold text-gray-800 text-sm">{item.label}</p>
              <div className="flex items-center gap-1 mt-1">
                <span className="text-xs text-gray-400">View all</span>
                <ChevronRight className="w-3 h-3 text-gray-400 group-hover:translate-x-0.5 transition-transform" />
              </div>
            </button>
          );
        })}
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        {/* Latest newsletter */}
        {latest && (
          <div className="bg-white border border-gray-200 rounded-2xl overflow-hidden">
            <div className="bg-gradient-to-r from-blue-500 to-indigo-600 px-5 py-4 flex items-center gap-2">
              <FileText className="w-4 h-4 text-white/80" />
              <h3 className="font-bold text-white text-sm">Latest Newsletter</h3>
            </div>
            <div className="p-5">
              <p className="font-bold text-gray-900 mb-1">{latest.name}</p>
              <p className="text-sm text-gray-500 mb-3">{latest.description}</p>
              {latest.highlights && (
                <ul className="space-y-1 mb-4">
                  {latest.highlights.map(h => (
                    <li key={h} className="flex items-start gap-1.5 text-xs text-gray-600">
                      <Heart className="w-3 h-3 text-peach-400 flex-shrink-0 mt-0.5" />
                      {h}
                    </li>
                  ))}
                </ul>
              )}
              <a
                href={latest.url}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center gap-2 w-full py-2.5 bg-gradient-to-r from-blue-500 to-indigo-600 text-white rounded-xl text-sm font-semibold hover:shadow-md transition-all"
              >
                <Download className="w-4 h-4" /> Download PDF
              </a>
              <button onClick={() => onNavigate('newsletters')} className="w-full mt-2 text-xs text-gray-400 hover:text-gray-600 text-center transition-colors">
                View all newsletters →
              </button>
            </div>
          </div>
        )}

        {/* Upcoming events */}
        <div className="bg-white border border-gray-200 rounded-2xl overflow-hidden">
          <div className="bg-gradient-to-r from-purple-500 to-violet-600 px-5 py-4 flex items-center gap-2">
            <Calendar className="w-4 h-4 text-white/80" />
            <h3 className="font-bold text-white text-sm">Upcoming Events</h3>
          </div>
          <div className="divide-y divide-gray-50">
            {upcomingEvents.length === 0 ? (
              <p className="p-5 text-sm text-gray-400 text-center">No upcoming events</p>
            ) : upcomingEvents.map((event) => (
              <div key={event.id} className="flex items-center gap-3 px-5 py-3">
                <div className="text-center flex-shrink-0 w-10">
                  <p className="text-[10px] text-gray-400 font-medium">{event.date.split(' ')[2]?.slice(0, 3).toUpperCase()}</p>
                  <p className="text-lg font-bold text-gray-800 leading-none">{event.date.split(' ')[1]}</p>
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-gray-800 truncate">{event.title}</p>
                  <span className={`inline-block text-[10px] px-1.5 py-0.5 rounded-full border font-medium mt-0.5 ${EVENT_COLORS[event.type]}`}>
                    {event.type}
                  </span>
                </div>
              </div>
            ))}
          </div>
          <div className="px-5 py-3 border-t border-gray-100">
            <button onClick={() => onNavigate('calendar')} className="w-full text-xs text-purple-500 hover:text-purple-700 font-medium transition-colors">
              View full calendar →
            </button>
          </div>
        </div>
      </div>

      {/* Contact banner */}
      <div className="bg-white border border-gray-200 rounded-2xl p-5 flex flex-col sm:flex-row items-center gap-4 text-center sm:text-left">
        <span className="text-3xl">💬</span>
        <div className="flex-1">
          <p className="font-semibold text-gray-900">Need to reach us?</p>
          <p className="text-sm text-gray-500 mt-0.5">We're always happy to help with any questions about your child.</p>
        </div>
        <a
          href="/daycare/contact"
          className="flex-shrink-0 px-5 py-2.5 bg-gradient-to-r from-peach-400 to-coral-500 text-white rounded-2xl text-sm font-semibold hover:shadow-lg transition-all"
        >
          Contact us
        </a>
      </div>
    </div>
  );
}

// ─── Newsletters ──────────────────────────────────────────────────────────────

function NewslettersSection({ files }: { files: CMSPortalFile[] }) {
  return (
    <div className="space-y-5">
      <div>
        <h2 className="text-xl font-bold text-gray-900">Monthly Newsletters</h2>
        <p className="text-sm text-gray-500 mt-0.5">Stay up to date with everything happening at Early Years.</p>
      </div>
      {files.length === 0 ? (
        <div className="bg-white border border-dashed border-gray-200 rounded-2xl p-10 text-center text-gray-400">
          <FileText className="w-8 h-8 mx-auto mb-2 opacity-30" />
          <p className="text-sm">Newsletters will appear here once published by the admin.</p>
        </div>
      ) : (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {files.map(file => (
            <div key={file.id} className="bg-white rounded-2xl border border-gray-200 overflow-hidden hover:shadow-md transition-shadow">
              <div className="bg-gradient-to-br from-blue-50 to-indigo-50 px-5 py-5">
                <div className="flex items-start justify-between">
                  <div>
                    <p className="font-bold text-gray-900 leading-tight">{file.name}</p>
                    {file.publishDate && (
                      <p className="text-xs text-gray-400 mt-0.5">{new Date(file.publishDate).toLocaleDateString('en-GB', { month: 'long', year: 'numeric' })}</p>
                    )}
                  </div>
                  <div className="w-9 h-9 bg-blue-100 rounded-xl flex items-center justify-center flex-shrink-0 ml-2">
                    <FileText className="w-4 h-4 text-blue-500" />
                  </div>
                </div>
              </div>
              <div className="px-5 py-4">
                {file.highlights && file.highlights.length > 0 && (
                  <ul className="space-y-1 mb-4">
                    {file.highlights.map(h => (
                      <li key={h} className="flex items-start gap-1.5 text-xs text-gray-600">
                        <Heart className="w-3 h-3 text-peach-400 flex-shrink-0 mt-0.5" />
                        {h}
                      </li>
                    ))}
                  </ul>
                )}
                {file.description && !file.highlights?.length && (
                  <p className="text-xs text-gray-500 mb-4">{file.description}</p>
                )}
                {file.url ? (
                <a
                  href={file.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-center gap-2 w-full py-2.5 bg-gradient-to-r from-blue-500 to-indigo-600 text-white rounded-xl text-sm font-semibold hover:shadow-md transition-all"
                >
                  <Download className="w-4 h-4" /> Download PDF
                </a>
                ) : (
                  <p className="text-xs text-gray-400 text-center py-2">Document coming soon</p>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

// ─── Full Menu ────────────────────────────────────────────────────────────────

function MenuSection({ meals, menuFiles }: { meals: CMSMeals; menuFiles: CMSPortalFile[] }) {
  const [season, setSeason] = useState<'winter' | 'summer'>('winter');
  const [week, setWeek] = useState<'week1' | 'week2'>('week1');

  const activeMenu = meals.menus.find(m => m.season === season && m.week === week);
  const activeSnacks = season === 'winter' ? meals.winterSnacks : meals.summerSnacks;

  const DAYS_ORDER = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday'];

  return (
    <div className="space-y-6">
      <div className="flex items-start justify-between gap-4 flex-wrap">
        <div>
          <h2 className="text-xl font-bold text-gray-900">Lunch Menu</h2>
          <p className="text-sm text-gray-500 mt-0.5">Full rotating menu — developed by our nutrition specialist.</p>
        </div>
        {/* Controls */}
        <div className="flex items-center gap-2 flex-wrap">
          <div className="flex items-center gap-1 bg-gray-100 rounded-2xl p-1">
            <button onClick={() => setSeason('winter')}
              className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-sm font-semibold transition-all ${season === 'winter' ? 'bg-white text-blue-700 shadow-sm' : 'text-gray-500 hover:text-gray-700'}`}>
              <Leaf className="w-3.5 h-3.5" /> Winter
            </button>
            <button onClick={() => setSeason('summer')}
              className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-sm font-semibold transition-all ${season === 'summer' ? 'bg-white text-amber-600 shadow-sm' : 'text-gray-500 hover:text-gray-700'}`}>
              <Sun className="w-3.5 h-3.5" /> Summer
            </button>
          </div>
          <div className="flex items-center gap-1 bg-gray-100 rounded-2xl p-1">
            <button onClick={() => setWeek('week1')}
              className={`px-4 py-2 rounded-xl text-sm font-semibold transition-all ${week === 'week1' ? 'bg-white text-gray-800 shadow-sm' : 'text-gray-500 hover:text-gray-700'}`}>
              Week 1
            </button>
            <button onClick={() => setWeek('week2')}
              className={`px-4 py-2 rounded-xl text-sm font-semibold transition-all ${week === 'week2' ? 'bg-white text-gray-800 shadow-sm' : 'text-gray-500 hover:text-gray-700'}`}>
              Week 2
            </button>
          </div>
        </div>
      </div>

      {/* Menu grid */}
      <AnimatePresence mode="wait">
        <motion.div
          key={`${season}-${week}`}
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -8 }}
          transition={{ duration: 0.18 }}
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3"
        >
          {(activeMenu?.days ?? []).sort((a, b) => DAYS_ORDER.indexOf(a.day) - DAYS_ORDER.indexOf(b.day)).map((day) => (
            <div
              key={day.day}
              className={`rounded-2xl p-5 border text-center ${season === 'winter' ? 'bg-gradient-to-br from-blue-50 to-indigo-50 border-blue-100' : 'bg-gradient-to-br from-amber-50 to-orange-50 border-amber-100'}`}
            >
              <div className="text-2xl mb-2">{day.emoji}</div>
              <p className={`text-xs font-bold mb-1 ${season === 'winter' ? 'text-blue-600' : 'text-amber-600'}`}>{day.day.slice(0, 3).toUpperCase()}</p>
              <p className="text-sm font-bold text-gray-800 leading-snug mb-1.5">{day.lunch}</p>
              <p className="text-xs text-gray-500 leading-relaxed">{day.sides}</p>
            </div>
          ))}
          {!activeMenu && (
            <div className="col-span-5 py-8 text-center text-gray-400">
              <UtensilsCrossed className="w-8 h-8 mx-auto mb-2 opacity-30" />
              <p className="text-sm">Menu not yet configured. Check the CMS Meals section.</p>
            </div>
          )}
        </motion.div>
      </AnimatePresence>

      {/* Snacks */}
      <div className="bg-white border border-gray-200 rounded-2xl p-5">
        <p className="text-xs font-bold text-gray-400 uppercase tracking-wide mb-3">Morning & Afternoon Snacks</p>
        <div className="flex flex-wrap gap-2">
          {activeSnacks.map((s, i) => (
            <span key={i} className={`px-3 py-1.5 rounded-full border text-xs font-medium text-gray-700 ${season === 'winter' ? 'bg-blue-50 border-blue-100' : 'bg-amber-50 border-amber-100'}`}>
              {s}
            </span>
          ))}
        </div>
      </div>

      {/* Dietary policy */}
      <div className="bg-emerald-50 border border-emerald-200 rounded-2xl p-5">
        <p className="font-semibold text-emerald-800 text-sm mb-1">Dietary Policy</p>
        <p className="text-sm text-emerald-700 leading-relaxed">{meals.dietaryPolicy}</p>
      </div>

      {/* All 4 menu summary */}
      <div className="bg-white border border-gray-200 rounded-2xl p-5">
        <p className="font-semibold text-gray-800 mb-3">All Menu Versions</p>
        <div className="grid grid-cols-2 gap-3">
          {(['winter', 'summer'] as const).map(s => (
            ['week1', 'week2'] as const).map(w => {
              const m = meals.menus.find(x => x.season === s && x.week === w);
              const active = s === season && w === week;
              return (
                <button
                  key={`${s}-${w}`}
                  onClick={() => { setSeason(s); setWeek(w); }}
                  className={`flex items-center gap-2 px-4 py-3 rounded-xl border text-sm font-medium transition-all text-left ${active ? 'border-peach-300 bg-peach-50 text-peach-700' : 'border-gray-200 hover:bg-gray-50 text-gray-600'}`}
                >
                  {s === 'winter' ? <Leaf className="w-4 h-4 flex-shrink-0" /> : <Sun className="w-4 h-4 flex-shrink-0" />}
                  <span>{s === 'winter' ? '❄️ Winter' : '☀️ Summer'} — {w === 'week1' ? 'Week 1' : 'Week 2'}</span>
                  {!m && <span className="ml-auto text-[10px] text-amber-500">TBC</span>}
                  {active && <CheckCircle2 className="w-3.5 h-3.5 ml-auto text-peach-500" />}
                </button>
              );
            })
          )}
        </div>
      </div>

      {/* Downloadable menu files */}
      {menuFiles.length > 0 && (
        <div className="bg-white border border-gray-200 rounded-2xl p-5">
          <p className="font-semibold text-gray-800 mb-3">Downloadable Menu PDFs</p>
          <div className="space-y-2">
            {menuFiles.map(f => (
              <a key={f.id} href={f.url} target="_blank" rel="noopener noreferrer"
                className="flex items-center gap-3 px-4 py-3 rounded-xl bg-gray-50 hover:bg-gray-100 transition-colors group">
                <Download className="w-4 h-4 text-gray-400 group-hover:text-gray-600" />
                <span className="flex-1 text-sm text-gray-700 font-medium">{f.name}</span>
                <ChevronRight className="w-4 h-4 text-gray-400" />
              </a>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

// ─── Calendar ─────────────────────────────────────────────────────────────────

function CalendarSection({ events }: { events: CMSCalendarEvent[] }) {
  const today = new Date().toISOString().slice(0, 10);
  const upcoming = events.filter(e => e.isoDate >= today);
  const past = events.filter(e => e.isoDate < today);

  const EventRow = ({ event }: { event: CMSCalendarEvent }) => (
    <div className="flex items-center gap-4 px-5 py-3.5 border-b border-gray-50 last:border-0">
      <div className="text-center flex-shrink-0 w-12">
        <p className="text-[10px] text-gray-400 font-semibold uppercase">{event.date.split(' ')[2]?.slice(0, 3)}</p>
        <p className="text-xl font-bold text-gray-800 leading-none">{event.date.split(' ')[1]}</p>
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-sm font-semibold text-gray-800">{event.title}</p>
        {event.description && <p className="text-xs text-gray-500 mt-0.5">{event.description}</p>}
      </div>
      <span className={`text-[10px] px-2 py-1 rounded-full border font-semibold flex-shrink-0 ${EVENT_COLORS[event.type]}`}>
        {event.type}
      </span>
    </div>
  );

  return (
    <div className="space-y-5">
      <div>
        <h2 className="text-xl font-bold text-gray-900">Term Calendar</h2>
        <p className="text-sm text-gray-500 mt-0.5">All key dates for the academic year.</p>
      </div>

      {events.length === 0 ? (
        <div className="bg-white border border-dashed border-gray-200 rounded-2xl p-10 text-center text-gray-400">
          <Calendar className="w-8 h-8 mx-auto mb-2 opacity-30" />
          <p className="text-sm">Calendar events will appear here once added by the admin.</p>
        </div>
      ) : (
        <>
          {upcoming.length > 0 && (
            <div className="bg-white border border-gray-200 rounded-2xl overflow-hidden">
              <div className="px-5 py-3.5 border-b border-gray-100 bg-gray-50">
                <p className="text-xs font-bold text-gray-500 uppercase tracking-wide flex items-center gap-1.5">
                  <Clock className="w-3.5 h-3.5" /> Upcoming
                </p>
              </div>
              {upcoming.map((e) => <EventRow key={e.id} event={e} />)}
            </div>
          )}

          {past.length > 0 && (
            <div className="bg-white border border-gray-200 rounded-2xl overflow-hidden opacity-60">
              <div className="px-5 py-3.5 border-b border-gray-100 bg-gray-50">
                <p className="text-xs font-bold text-gray-400 uppercase tracking-wide">Past dates</p>
              </div>
              {[...past].reverse().map((e) => <EventRow key={e.id} event={e} />)}
            </div>
          )}

          {/* Legend */}
          <div className="bg-white border border-gray-200 rounded-2xl p-4">
            <p className="text-xs font-semibold text-gray-500 mb-3">Legend</p>
            <div className="flex flex-wrap gap-2">
              {(Object.entries(EVENT_COLORS) as [CMSCalendarEvent['type'], string][]).map(([type, cls]) => (
                <span key={type} className={`text-[10px] px-2 py-1 rounded-full border font-semibold ${cls}`}>{type}</span>
              ))}
            </div>
          </div>
        </>
      )}
    </div>
  );
}

// ─── Forms & Files ────────────────────────────────────────────────────────────

const FILE_CATEGORY_LABELS: Record<CMSPortalFile['category'], { label: string; color: string }> = {
  newsletter: { label: 'Newsletter', color: 'bg-blue-100 text-blue-700' },
  form:       { label: 'Form',       color: 'bg-green-100 text-green-700' },
  menu:       { label: 'Menu',       color: 'bg-amber-100 text-amber-700' },
  policy:     { label: 'Policy',     color: 'bg-purple-100 text-purple-700' },
  other:      { label: 'Other',      color: 'bg-gray-100 text-gray-600' },
};

function FormsSection({ files }: { files: CMSPortalFile[] }) {
  return (
    <div className="space-y-5">
      <div>
        <h2 className="text-xl font-bold text-gray-900">Forms & Downloads</h2>
        <p className="text-sm text-gray-500 mt-0.5">Download, complete, and return to the nursery office.</p>
      </div>

      {files.length === 0 ? (
        <div className="bg-white border border-dashed border-gray-200 rounded-2xl p-10 text-center text-gray-400">
          <ClipboardList className="w-8 h-8 mx-auto mb-2 opacity-30" />
          <p className="text-sm">Files will appear here once added by the admin.</p>
        </div>
      ) : (
        <div className="space-y-2">
          {files.map(file => {
            const catStyle = FILE_CATEGORY_LABELS[file.category];
            return (
              <div key={file.id} className="bg-white border border-gray-200 rounded-2xl p-4 flex items-start gap-4 hover:shadow-sm transition-shadow">
                <div className="w-10 h-10 bg-gray-100 rounded-xl flex items-center justify-center flex-shrink-0">
                  <ClipboardList className="w-5 h-5 text-gray-400" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap mb-0.5">
                    <p className="font-semibold text-gray-900 text-sm">{file.name}</p>
                    <span className={`text-[10px] px-1.5 py-0.5 rounded-full font-medium ${catStyle.color}`}>{catStyle.label}</span>
                  </div>
                  {file.description && <p className="text-xs text-gray-500">{file.description}</p>}
                </div>
                {file.url ? (
                  <a
                    href={file.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-1.5 text-xs font-semibold text-peach-600 hover:text-peach-700 bg-peach-50 hover:bg-peach-100 px-3 py-2 rounded-xl transition-colors flex-shrink-0"
                  >
                    <Download className="w-3.5 h-3.5" /> Download
                  </a>
                ) : (
                  <span className="text-xs text-gray-400 px-3 py-2 flex-shrink-0">Coming soon</span>
                )}
              </div>
            );
          })}
        </div>
      )}

      <div className="bg-blue-50 border border-blue-200 rounded-2xl p-4 text-xs text-blue-700">
        Return completed forms to the nursery office or email to{' '}
        <a href="mailto:info@theearlyyearscompany.com" className="underline font-medium">info@theearlyyearscompany.com</a>
      </div>
    </div>
  );
}

// ─── Classroom ────────────────────────────────────────────────────────────────

function ClassroomSection() {
  return (
    <div className="space-y-5">
      <div>
        <h2 className="text-xl font-bold text-gray-900">Classroom Updates</h2>
        <p className="text-sm text-gray-500 mt-0.5">Photos and updates from your child's room.</p>
      </div>
      <div className="bg-white border border-dashed border-gray-300 rounded-2xl p-12 text-center space-y-3">
        <Camera className="w-10 h-10 text-gray-300 mx-auto" />
        <div>
          <p className="font-semibold text-gray-600 mb-1">Private gallery — coming soon</p>
          <p className="text-sm text-gray-400 leading-relaxed max-w-sm mx-auto">
            A private photo gallery for each classroom is in development. Photos are currently shared via class WhatsApp groups.
          </p>
        </div>
      </div>
    </div>
  );
}

// ─── Root ─────────────────────────────────────────────────────────────────────

export default function ParentPortal() {
  const [authenticated, setAuthenticated] = useState(
    () => sessionStorage.getItem(SESSION_KEY) === '1'
  );

  const handleLogout = () => {
    sessionStorage.removeItem(SESSION_KEY);
    setAuthenticated(false);
  };

  if (!authenticated) {
    return <PinGate onSuccess={() => setAuthenticated(true)} />;
  }

  return <PortalContent onLogout={handleLogout} />;
}

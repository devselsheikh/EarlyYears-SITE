import { Link, useLocation } from 'react-router';
import { Menu, X } from 'lucide-react';
import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import DaycareLogo from './DaycareLogo';

const NAV_ITEMS = [
  { path: '/daycare', label: 'Home' },
  { path: '/daycare/programs', label: 'Programs' },
  { path: '/daycare/parent-info', label: 'Parent Guide' },
  { path: '/daycare/calendar', label: 'Facilities & Meals' },
  { path: '/blog?stream=parents', label: 'Blog' },
  { path: '/daycare/parents', label: '🔒 Families' },
  { path: '/eduhub', label: 'EduHub ↗' },
];

export default function DaycareNav() {
  const location = useLocation();
  const [mobileOpen, setMobileOpen] = useState(false);

  const isActive = (path: string) => location.pathname === path;

  return (
    <nav className="bg-white/95 backdrop-blur-lg border-b border-peach-100 sticky top-0 z-50 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">

          {/* Logo */}
          <Link to="/" className="flex items-center self-center group flex-shrink-0">
            <DaycareLogo className="h-10 w-auto max-w-[160px] transition-transform group-hover:scale-[1.03]" />
          </Link>

          {/* Desktop Nav */}
          <div className="hidden lg:flex items-center gap-0.5">
            {NAV_ITEMS.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                className={`px-3 py-2.5 rounded-2xl text-sm font-semibold transition-all ${
                  isActive(item.path)
                    ? 'bg-gradient-to-r from-peach-100 to-coral-100 text-coral-700 shadow-sm'
                    : item.label.includes('↗')
                    ? 'text-blue-600 hover:bg-blue-50'
                    : 'text-gray-600 hover:bg-peach-50 hover:text-peach-700'
                }`}
              >
                {item.label}
              </Link>
            ))}
          </div>

          {/* Desktop CTAs */}
          <div className="hidden lg:flex items-center gap-2">
            <Link
              to="/daycare/contact"
              className="px-4 py-2.5 rounded-2xl border-2 border-peach-200 text-peach-700 text-sm font-semibold hover:bg-peach-50 transition-all"
            >
              Apply Now
            </Link>
            <Link
              to="/daycare/contact"
              className="px-5 py-2.5 rounded-2xl bg-gradient-to-r from-peach-400 via-coral-500 to-pink-500 text-white text-sm font-semibold hover:shadow-xl hover:scale-105 transition-all"
            >
              Book a Tour 📅
            </Link>
          </div>

          {/* Mobile hamburger */}
          <button
            onClick={() => setMobileOpen(!mobileOpen)}
            className="lg:hidden min-h-11 min-w-11 p-2.5 rounded-xl text-gray-600 hover:bg-peach-50 transition-colors"
            aria-label={mobileOpen ? 'Close navigation' : 'Open navigation'}
            aria-expanded={mobileOpen}
          >
            {mobileOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="lg:hidden border-t border-peach-100 bg-white/98 backdrop-blur-lg"
          >
            <div className="px-4 py-4 space-y-1.5">
              {NAV_ITEMS.map((item) => (
                <Link
                  key={item.path}
                  to={item.path}
                  onClick={() => setMobileOpen(false)}
                  className={`block px-4 py-3 rounded-2xl text-sm font-semibold ${
                    isActive(item.path)
                      ? 'bg-peach-100 text-coral-700'
                      : item.label.includes('↗')
                      ? 'text-blue-600 hover:bg-blue-50'
                      : 'text-gray-600 hover:bg-peach-50'
                  }`}
                >
                  {item.label}
                </Link>
              ))}
              <div className="pt-2 space-y-2">
                <Link
                  to="/daycare/contact"
                  onClick={() => setMobileOpen(false)}
                  className="block px-4 py-3 rounded-2xl border-2 border-peach-200 text-peach-700 text-center font-semibold text-sm"
                >
                  Apply Now
                </Link>
                <Link
                  to="/daycare/contact"
                  onClick={() => setMobileOpen(false)}
                  className="block px-4 py-3.5 rounded-2xl bg-gradient-to-r from-peach-400 via-coral-500 to-pink-500 text-white text-center font-bold"
                >
                  Book a Tour 📅
                </Link>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
}

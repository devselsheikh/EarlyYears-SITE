import { Link, useLocation } from "react-router";
import { Menu, X } from "lucide-react";
import { useState } from "react";
import { motion, AnimatePresence, useReducedMotion } from "motion/react";
import EduHubLogo from "./EduHubLogo";

export default function EduHubNav() {
  const location = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const reduceMotion = useReducedMotion();

  const navItems = [
    { path: "/eduhub", label: "Home" },
    { path: "/eduhub/programs", label: "Programs" },
    { path: "/eduhub/about", label: "About" },
    { path: "/blog?stream=educators", label: "Blog" },
    { path: "/eduhub/contact", label: "Contact" },
  ];

  return (
    <nav className="bg-white border-b border-gray-200 sticky top-0 z-50 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          {/* Logo */}
          <Link
            to="/"
            className="flex min-h-11 items-center space-x-3 group"
            aria-label="Early Years home"
          >
            <EduHubLogo className="h-10 w-auto" />
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-1">
            {navItems.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                className={`px-4 py-2 rounded-lg text-sm transition-colors ${
                  location.pathname === item.path
                    ? "bg-blue-50 text-[#1349D1]"
                    : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
                }`}
              >
                {item.label}
              </Link>
            ))}
            <Link
              to="/eduhub/contact"
              className="ml-4 px-6 py-2 rounded-lg bg-[#1349D1] text-white hover:bg-blue-700 transition-colors"
            >
              Register Interest
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden min-h-11 min-w-11 p-2 rounded-lg text-gray-600 hover:bg-gray-50"
            aria-label={mobileMenuOpen ? 'Close navigation' : 'Open navigation'}
            aria-expanded={mobileMenuOpen}
          >
            {mobileMenuOpen ? (
              <X className="w-6 h-6" />
            ) : (
              <Menu className="w-6 h-6" />
            )}
          </button>
        </div>
      </div>

      {/* Mobile Navigation */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0, transform: reduceMotion ? 'none' : 'translateY(-8px)' }}
            animate={{ opacity: 1, height: "auto", transform: 'translateY(0)' }}
            exit={{ opacity: 0, height: 0, transform: reduceMotion ? 'none' : 'translateY(-8px)' }}
            transition={{ duration: 0.2, ease: [0.23, 1, 0.32, 1] }}
            className="md:hidden border-t border-gray-200 bg-white"
          >
            <div className="px-4 py-4 space-y-2">
              {navItems.map((item) => (
                <Link
                  key={item.path}
                  to={item.path}
                  onClick={() => setMobileMenuOpen(false)}
                  className={`block px-4 py-3 rounded-lg text-sm transition-colors ${
                    location.pathname === item.path
                      ? "bg-blue-50 text-[#1349D1]"
                      : "text-gray-600 hover:bg-gray-50"
                  }`}
                >
                  {item.label}
                </Link>
              ))}
              <Link
                to="/eduhub/contact"
                onClick={() => setMobileMenuOpen(false)}
                className="block px-4 py-3 rounded-lg bg-[#1349D1] text-white text-center"
              >
                Register Interest
              </Link>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
}

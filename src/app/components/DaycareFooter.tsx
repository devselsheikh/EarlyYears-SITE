import { Link } from 'react-router';
import { Mail, Phone, MapPin, Linkedin, Instagram } from 'lucide-react';
import DaycareLogo from './DaycareLogo';
import { useCMS } from '../hooks/useCMS';

export default function DaycareFooter() {
  const cms = useCMS();
  const s = cms.siteSettings;

  const waLink = `https://wa.me/${s.whatsapp.replace(/\D/g, '')}`;

  return (
    <footer className="bg-gradient-to-br from-peach-50 via-lemon-50 to-mint-50 border-t border-peach-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-16">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-12">
          {/* About */}
          <div className="md:col-span-2">
            <DaycareLogo className="h-16 w-auto max-w-[220px] mb-4" />
            <p className="text-sm text-gray-600 mb-4 leading-relaxed">
              25 years of expertise in Early Years education following the EYFS curriculum. Nurturing young minds with care, play, and learning.
            </p>
            <div className="space-y-3">
              {s.daycareEmail && (
                <div className="flex items-center text-sm text-gray-600">
                  <div className="w-8 h-8 rounded-xl bg-white flex items-center justify-center mr-3 flex-shrink-0">
                    <Mail className="w-4 h-4 text-coral-500" />
                  </div>
                  <a href={`mailto:${s.daycareEmail}`} className="hover:text-coral-600 transition-colors">
                    {s.daycareEmail}
                  </a>
                </div>
              )}
              {s.daycarePhone && (
                <div className="flex items-center text-sm text-gray-600">
                  <div className="w-8 h-8 rounded-xl bg-white flex items-center justify-center mr-3 flex-shrink-0">
                    <Phone className="w-4 h-4 text-coral-500" />
                  </div>
                  <a href={`tel:${s.daycarePhone.replace(/\s/g, '')}`} className="hover:text-coral-600 transition-colors">
                    {s.daycarePhone}
                  </a>
                </div>
              )}
              {s.address && (
                <div className="flex items-start text-sm text-gray-600">
                  <div className="w-8 h-8 rounded-xl bg-white flex items-center justify-center mr-3 mt-0.5 flex-shrink-0">
                    <MapPin className="w-4 h-4 text-coral-500" />
                  </div>
                  {s.googleMapsLink ? (
                    <a href={s.googleMapsLink} target="_blank" rel="noopener noreferrer" className="hover:text-coral-600 transition-colors">
                      {s.address}
                    </a>
                  ) : (
                    <span>{s.address}</span>
                  )}
                </div>
              )}
              {(s.linkedinUrl || s.instagramUrl) && (
                <div className="flex items-center gap-3 pt-1">
                  {s.linkedinUrl && (
                    <a aria-label="LinkedIn" href={s.linkedinUrl} target="_blank" rel="noopener noreferrer" className="inline-flex min-h-11 min-w-11 items-center justify-center text-gray-600 hover:text-coral-700 transition-colors">
                      <Linkedin className="w-4 h-4" />
                    </a>
                  )}
                  {s.instagramUrl && (
                    <a aria-label="Instagram" href={s.instagramUrl} target="_blank" rel="noopener noreferrer" className="inline-flex min-h-11 min-w-11 items-center justify-center text-gray-600 hover:text-coral-700 transition-colors">
                      <Instagram className="w-4 h-4" />
                    </a>
                  )}
                  {s.whatsapp && (
                    <a href={waLink} target="_blank" rel="noopener noreferrer" className="inline-flex min-h-11 items-center text-xs text-green-800 hover:text-green-900 font-semibold transition-colors">
                      WhatsApp
                    </a>
                  )}
                </div>
              )}
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="font-bold text-gray-900 mb-4">Quick Links</h3>
            <ul className="space-y-2">
              {[
                { to: '/daycare/about', label: 'About Us' },
                { to: '/daycare/programs', label: 'Programmes' },
                { to: '/daycare/parents', label: '🔒 Family Guides & Menus' },
                { to: '/daycare/contact', label: 'Contact' },
              ].map(({ to, label }) => (
                <li key={to}>
                  <Link to={to} className="text-sm text-gray-600 hover:text-coral-600 transition-colors inline-flex items-center gap-1 hover:gap-2">
                    <span>{label}</span>
                    <span className="text-xs">→</span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Hours & Info */}
          <div>
            <h3 className="font-bold text-gray-900 mb-4">Hours & Info</h3>
            <ul className="space-y-2">
              <li className="text-sm text-gray-600">
                <div className="font-semibold text-gray-900 mb-1">Operating Hours</div>
                Sunday – Thursday<br />
                8:15 AM – 4:00 PM
              </li>
              <li className="text-sm text-gray-600 mt-4">
                <div className="font-semibold text-gray-900 mb-1">Tour Times</div>
                10:30 AM – 12:00 PM<br />
                <span className="text-xs">(1 day advance notice)</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="pt-8 border-t border-peach-200 flex flex-col sm:flex-row justify-between items-center gap-4">
          <div><div className="text-sm text-gray-500">{s.footerCopyright || '© 2026 Early Years Company. All rights reserved.'}</div><div className="flex gap-3 mt-2 text-xs text-gray-600"><Link to="/privacy" className="hover:text-coral-700">Privacy</Link><Link to="/terms" className="hover:text-coral-700">Terms</Link></div></div>
          <div className="flex items-center gap-2 text-sm text-gray-600">
            Trusted by <span className="font-semibold text-peach-600 mx-1">200+ families</span> since 2001
          </div>
        </div>
      </div>
    </footer>
  );
}

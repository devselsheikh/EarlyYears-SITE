import { Link } from 'react-router';
import { Mail, Phone, Linkedin, Instagram } from 'lucide-react';
import EduHubLogo from './EduHubLogo';
import { useCMS } from '../hooks/useCMS';

export default function EduHubFooter() {
  const cms = useCMS();
  const s = cms.siteSettings;

  const waLink = s.whatsapp ? `https://wa.me/${s.whatsapp.replace(/\D/g, '')}` : null;

  return (
    <footer className="eduhub-footer bg-[#0b1730] text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-16">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-12">
          {/* About */}
          <div className="md:col-span-2">
            <EduHubLogo variant="white" className="h-10 w-auto mb-4" />
            <p className="text-sm text-slate-300 mb-4 leading-relaxed">
              First CACHE-approved training centre in Egypt. UK-accredited professional development for early years educators.
            </p>
            <div className="space-y-2">
              {s.eduhubEmail && (
                <div className="flex items-center text-sm text-slate-300">
                  <Mail className="w-4 h-4 mr-2 text-[#1349D1] flex-shrink-0" />
                  <a href={`mailto:${s.eduhubEmail}`} className="inline-flex min-h-11 items-center hover:text-cyan-300 transition-colors">
                    {s.eduhubEmail}
                  </a>
                </div>
              )}
              {s.eduhubPhone && (
                <div className="flex items-center text-sm text-slate-300">
                  <Phone className="w-4 h-4 mr-2 text-[#1349D1] flex-shrink-0" />
                  <a href={`tel:${s.eduhubPhone.replace(/\s/g, '')}`} className="inline-flex min-h-11 items-center hover:text-cyan-300 transition-colors">
                    {s.eduhubPhone}
                  </a>
                </div>
              )}
              {s.mainEmail && s.mainEmail !== s.eduhubEmail && (
                <div className="text-xs text-gray-300 mt-3">
                  General: <a href={`mailto:${s.mainEmail}`} className="inline-flex min-h-11 items-center text-slate-300 hover:text-cyan-300 transition-colors">{s.mainEmail}</a>
                </div>
              )}
              {(s.linkedinUrl || s.instagramUrl || waLink) && (
                <div className="flex items-center gap-3 pt-2">
                  {s.linkedinUrl && (
                    <a aria-label="LinkedIn" href={s.linkedinUrl} target="_blank" rel="noopener noreferrer" className="inline-flex min-h-11 min-w-11 items-center justify-center text-slate-400 hover:text-cyan-300 transition-colors">
                      <Linkedin className="w-4 h-4" />
                    </a>
                  )}
                  {s.instagramUrl && (
                    <a aria-label="Instagram" href={s.instagramUrl} target="_blank" rel="noopener noreferrer" className="inline-flex min-h-11 min-w-11 items-center justify-center text-slate-400 hover:text-cyan-300 transition-colors">
                      <Instagram className="w-4 h-4" />
                    </a>
                  )}
                  {waLink && (
                    <a href={waLink} target="_blank" rel="noopener noreferrer" className="inline-flex min-h-11 items-center text-xs text-green-500 hover:text-green-400 font-medium transition-colors">
                      WhatsApp
                    </a>
                  )}
                </div>
              )}
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-sm font-bold text-white mb-4">Quick Links</h3>
            <ul className="space-y-2">
              <li><Link to="/eduhub/programs" className="inline-flex min-h-11 items-center text-sm text-slate-300 hover:text-cyan-300 transition-colors">All Programmes</Link></li>
              <li><Link to="/eduhub/about" className="inline-flex min-h-11 items-center text-sm text-slate-300 hover:text-cyan-300 transition-colors">About EduHub</Link></li>
              <li><Link to="/eduhub/contact" className="inline-flex min-h-11 items-center text-sm text-slate-300 hover:text-cyan-300 transition-colors">Enrolment Support</Link></li>
            </ul>
          </div>

          {/* More */}
          <div>
            <h3 className="text-sm font-bold text-white mb-4">Resources</h3>
            <ul className="space-y-2">
              <li><Link to="/blog?stream=educators" className="inline-flex min-h-11 items-center text-sm text-slate-300 hover:text-cyan-300 transition-colors">Educator Blog</Link></li>
              <li>
                <a href="https://www.ncfe.org.uk/qualification-search/qualification-detail/cache-level-3-diploma-for-the-early-years-workforce-early-years-educator-601-2617-0" target="_blank" rel="noopener noreferrer" className="inline-flex min-h-11 items-center text-sm text-slate-300 hover:text-cyan-300 transition-colors">
                  CACHE / NCFE Accreditation ↗
                </a>
              </li>
              <li><Link to="/contact" className="inline-flex min-h-11 items-center text-sm text-slate-300 hover:text-cyan-300 transition-colors">Contact Us</Link></li>
            </ul>
          </div>
        </div>

        <div className="pt-8 border-t border-white/10 text-center text-sm text-slate-300">
          {s.footerCopyright || '© 2026 Early Years Company. All rights reserved.'}
        </div>
      </div>
    </footer>
  );
}

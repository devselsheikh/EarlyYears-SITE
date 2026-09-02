import { Link } from 'react-router';
import { motion } from 'motion/react';
import { ArrowRight, Star, GraduationCap, MapPin, MessageCircle, Phone, Mail, HelpCircle } from 'lucide-react';
import DaycareLogo from '../components/DaycareLogo';
import EduHubLogo from '../components/EduHubLogo';
import { useCMS } from '../hooks/useCMS';
import { JsonLd, organizationSchema } from '../components/JsonLd';
import { SitePopup } from '../components/SitePopup';

function waLink(num: string) {
  return `https://wa.me/${num.replace(/\D/g, '')}`;
}

export default function Landing() {
  const cms = useCMS();
  const s = cms.siteSettings;
  const cta = cms.ctaSettings;

  const siteUrl = 'https://theearlyyearscompany.com';

  return (
    <div className="min-h-screen bg-white flex flex-col">
      <JsonLd data={organizationSchema({ name: s.companyName, url: siteUrl, phone: s.mainPhone, email: s.mainEmail })} />
      <SitePopup site="all" />

      {/* ── Minimal top bar ── */}
      <header className="flex items-center justify-between px-6 sm:px-10 lg:px-16 py-5 border-b border-gray-100">
        <DaycareLogo company className="h-14 sm:h-16 w-auto max-w-[220px]" />
        <nav className="hidden md:flex items-center gap-6 text-sm text-gray-600 font-medium">
          {s.linkedinUrl && <a href={s.linkedinUrl} target="_blank" rel="noopener noreferrer" className="hover:text-gray-900 transition-colors">LinkedIn</a>}
          {s.instagramUrl && <a href={s.instagramUrl} target="_blank" rel="noopener noreferrer" className="hover:text-gray-900 transition-colors">Instagram</a>}
          <Link to="/contact" className="hover:text-gray-900 transition-colors">Contact</Link>
        </nav>
        {s.whatsapp && (
          <a
            href={waLink(s.whatsapp)}
            target="_blank"
            rel="noopener noreferrer"
            className="md:hidden inline-flex min-h-11 items-center gap-1.5 px-3 py-2 rounded-full bg-green-700 text-white text-sm font-semibold"
          >
            <MessageCircle className="w-4 h-4" />
            WhatsApp
          </a>
        )}
      </header>

      {/* ── Hero ── */}
      <main className="landing-main flex-1 flex flex-col items-center justify-center px-4 sm:px-6 lg:px-8 py-8 sm:py-11">

        {/* Trust badge */}
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gray-50 border border-gray-200 text-sm text-gray-700 mb-6"
        >
          <Star className="w-4 h-4 text-amber-400 fill-amber-400" />
          <span className="font-semibold">Serving families and educators for 25+ years</span>
          <Star className="w-4 h-4 text-amber-400 fill-amber-400" />
        </motion.div>

        {/* Headline */}
        <motion.h1
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="text-4xl sm:text-5xl lg:text-6xl font-bold text-gray-900 text-center mb-3 max-w-3xl leading-[1.04] tracking-[-0.045em]"
        >
          Growth Begins with the{' '}
          <span className="landing-foundations">Right Foundations</span>
        </motion.h1>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.25 }}
          className="text-lg sm:text-xl text-gray-500 text-center mb-3 max-w-xl"
        >
          {s.companyName} — Egypt's leader in early childhood care and educator training.
        </motion.p>

        {/* Two-branch positioning */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="landing-hero-actions grid sm:grid-cols-2 gap-3 mb-7 w-full max-w-3xl"
        >
          <Link to={cta.homepageDaycareLink || '/daycare'} className="inline-flex min-h-12 items-center gap-2 px-4 py-2 rounded-2xl bg-orange-50 border border-orange-200 text-sm text-orange-800 no-underline">
            <span className="text-base">🌱</span>
            <span className="flex-1"><strong>The Daycare</strong><small className="block text-xs mt-0.5">EYFS nursery at AUC New Cairo</small></span><ArrowRight className="w-4 h-4" />
          </Link>
          <Link to={cta.homepageEduhubLink || '/eduhub'} className="inline-flex min-h-12 items-center gap-2 px-4 py-2 rounded-2xl bg-blue-50 border border-blue-200 text-sm text-blue-900 no-underline">
            <span className="text-base">🎓</span>
            <span className="flex-1"><strong>EduHub</strong><small className="block text-xs mt-0.5">CACHE teacher training in Egypt</small></span><ArrowRight className="w-4 h-4" />
          </Link>
        </motion.div>

        {/* ── THE FUNNEL SPLIT ── */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.35 }}
          className="text-base font-semibold text-gray-500 mb-5 uppercase tracking-widest text-center"
        >
          How can we support your next step?
        </motion.p>

        <div className="grid md:grid-cols-2 gap-5 sm:gap-6 w-full max-w-4xl">

          {/* ── Card 1: Daycare ── */}
          <Link to={cta.homepageDaycareLink || '/daycare'} className="group focus:outline-none focus-visible:ring-2 focus-visible:ring-orange-500 focus-visible:ring-offset-2 rounded-3xl">
            <motion.div
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.55, delay: 0.4 }}
              whileHover={{ y: -4, scale: 1.005 }}
              whileTap={{ scale: 0.98 }}
              className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-orange-50 via-yellow-50 to-teal-50 border-2 border-transparent group-hover:border-orange-200 p-8 sm:p-10 shadow-lg hover:shadow-2xl transition-all duration-400 h-full flex flex-col"
            >
              <div className="absolute top-0 right-0 w-48 h-48 rounded-full bg-gradient-to-br from-orange-200/30 to-yellow-200/30 blur-3xl -translate-y-1/2 translate-x-1/2" />
              <div className="absolute bottom-0 left-0 w-40 h-40 rounded-full bg-gradient-to-tr from-teal-200/30 to-transparent blur-3xl translate-y-1/2 -translate-x-1/2" />

              <div className="relative flex-1 flex flex-col">
                <DaycareLogo className="h-14 w-auto max-w-[200px] mb-5 transition-transform group-hover:scale-[1.03]" />
                <div className="inline-block px-3 py-1 rounded-full bg-orange-100 text-orange-700 text-xs font-bold mb-4 uppercase tracking-wide w-fit">
                  For Parents
                </div>
                <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-3 group-hover:text-orange-700 transition-colors">
                  Find Quality Childcare
                </h2>
                <p className="text-gray-600 mb-5 leading-relaxed">
                  EYFS nursery and preschool for children aged 1–5 at AUC New Cairo. Play-based learning in a safe, nurturing environment.
                </p>
                <ul className="space-y-2 mb-7">
                  {['Nursery & preschool programmes', 'After-school care', 'Summer & winter camps'].map((item, i) => (
                    <li key={i} className="flex items-center gap-2 text-sm text-gray-700">
                      <div className="w-1.5 h-1.5 rounded-full bg-orange-400 flex-shrink-0" />
                      {item}
                    </li>
                  ))}
                </ul>
                <div className="mt-auto">
                  <div className="inline-flex min-h-11 items-center gap-2 px-5 py-2.5 rounded-xl bg-orange-700 text-white font-bold text-sm group-hover:bg-orange-800 transition-colors">
                    {cta.homepageDaycareLabel || 'Find Childcare'}
                    <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                  </div>
                </div>
              </div>
            </motion.div>
          </Link>

          {/* ── Card 2: EduHub ── */}
          <Link to={cta.homepageEduhubLink || '/eduhub'} className="group focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2 rounded-3xl">
            <motion.div
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.55, delay: 0.5 }}
              whileHover={{ y: -4, scale: 1.005 }}
              whileTap={{ scale: 0.98 }}
              className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-blue-700 via-blue-800 to-indigo-900 border-2 border-transparent group-hover:border-blue-400 p-8 sm:p-10 shadow-lg hover:shadow-2xl transition-all duration-400 h-full text-white flex flex-col"
            >
              <div className="absolute inset-0 opacity-5 group-hover:opacity-10 transition-opacity">
                <div className="absolute inset-0" style={{
                  backgroundImage: 'linear-gradient(white 1px, transparent 1px), linear-gradient(90deg, white 1px, transparent 1px)',
                  backgroundSize: '28px 28px'
                }} />
              </div>
              <div className="absolute top-6 right-6 w-10 h-10 border-2 border-white/20 rounded-lg" />
              <div className="absolute bottom-10 left-6 w-7 h-7 border-2 border-white/20 rounded" />

              <div className="relative flex-1 flex flex-col">
                <EduHubLogo variant="white" className="h-14 w-auto max-w-[200px] mb-5" />
                <div className="inline-block px-3 py-1 rounded-full bg-white/10 text-blue-200 text-xs font-bold mb-4 uppercase tracking-wide border border-white/20 w-fit">
                  For Educators
                </div>
                <h2 className="text-2xl sm:text-3xl font-bold mb-3 group-hover:text-blue-100 transition-colors">
                  Become a Qualified Early Years Educator
                </h2>
                <p className="text-blue-100 mb-5 leading-relaxed">
                  UK-accredited CACHE qualifications, delivered in Egypt. First CACHE-approved centre in the country.
                </p>
                <ul className="space-y-2 mb-7">
                  {['CACHE Level 2, 3 & 5 Diplomas', 'CPD and professional development', 'Hybrid in-person & online learning'].map((item, i) => (
                    <li key={i} className="flex items-center gap-2 text-sm text-blue-100">
                      <div className="w-1.5 h-1.5 rounded-full bg-blue-300 flex-shrink-0" />
                      {item}
                    </li>
                  ))}
                </ul>
                <div className="mt-auto">
                  <div className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-white text-blue-700 font-bold text-sm group-hover:bg-blue-50 transition-colors">
                    {cta.homepageEduhubLabel || 'Become an Educator'}
                    <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                  </div>
                </div>
              </div>
            </motion.div>
          </Link>
        </div>

        {/* ── Contact prompt ── */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.65 }}
          className="mt-5 flex flex-wrap items-center justify-center gap-x-6 gap-y-2 text-sm text-gray-500"
        >
          <span className="flex items-center gap-1.5">
            <HelpCircle className="w-4 h-4 text-gray-400" />
            Not sure who to contact?
          </span>
          <div className="flex gap-4">
            {s.whatsapp && (
              <a
                href={waLink(s.whatsapp)}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex min-h-11 items-center gap-1.5 text-green-800 font-semibold hover:text-green-900 transition-colors"
              >
                <MessageCircle className="w-4 h-4" />
                WhatsApp us
              </a>
            )}
            <Link to="/contact" className="inline-flex min-h-11 items-center gap-1.5 text-blue-700 font-medium hover:text-blue-800 transition-colors">
              <Mail className="w-4 h-4" />
              Send a message
            </Link>
          </div>
        </motion.div>

        {/* ── Trust stats strip ── */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.7 }}
          className="flex flex-wrap justify-center gap-6 sm:gap-10 mt-12 pt-10 border-t border-gray-100 w-full max-w-4xl"
        >
          {s.stats.length > 0 ? s.stats.map((stat, i) => (
            <div key={i} className="flex items-center gap-3">
              <div>
                <div className="font-bold text-gray-900">{stat.value}</div>
                <div className="text-xs text-gray-500">{stat.label}</div>
              </div>
            </div>
          )) : (
            <>
              <div className="flex items-center gap-3">
                <Star className="w-6 h-6 text-amber-400 flex-shrink-0" />
                <div><div className="font-bold text-gray-900">25+</div><div className="text-xs text-gray-500">Years of experience</div></div>
              </div>
              <div className="flex items-center gap-3">
                <GraduationCap className="w-6 h-6 text-blue-500 flex-shrink-0" />
                <div><div className="font-bold text-gray-900">CACHE</div><div className="text-xs text-gray-500">First approved centre in Egypt</div></div>
              </div>
              <div className="flex items-center gap-3">
                <MapPin className="w-6 h-6 text-orange-500 flex-shrink-0" />
                <div><div className="font-bold text-gray-900">AUC</div><div className="text-xs text-gray-500">New Cairo campus</div></div>
              </div>
              <div className="flex items-center gap-3">
                <Phone className="w-6 h-6 text-teal-500 flex-shrink-0" />
                <div><div className="font-bold text-gray-900">2 sites</div><div className="text-xs text-gray-500">Daycare & Training</div></div>
              </div>
            </>
          )}
        </motion.div>
      </main>

      {/* ── Footer ── */}
      <footer className="border-t border-gray-100 px-6 sm:px-10 lg:px-16 py-6">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-xs text-gray-600">{s.footerCopyright || '© 2026 Early Years Company. All rights reserved.'}</p>
          <div className="flex flex-wrap gap-4 justify-center text-xs text-gray-600">
            <Link to="/privacy" className="inline-flex min-h-11 items-center">Privacy</Link>
            <Link to="/terms" className="inline-flex min-h-11 items-center">Terms</Link>
            {s.mainEmail && (
              <a href={`mailto:${s.mainEmail}`} className="inline-flex min-h-11 items-center gap-1 hover:text-gray-900 transition-colors">
                <Mail className="w-3.5 h-3.5" />
                {s.mainEmail}
              </a>
            )}
            {s.mainPhone && (
              <a href={`tel:${s.mainPhone.replace(/\s/g, '')}`} className="inline-flex items-center gap-1 hover:text-gray-600 transition-colors">
                <Phone className="w-3.5 h-3.5" />
                {s.mainPhone}
              </a>
            )}
            {s.whatsapp && (
              <a
                href={waLink(s.whatsapp)}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex min-h-11 items-center gap-1 text-green-800 hover:text-green-900 transition-colors font-semibold"
              >
                <MessageCircle className="w-3.5 h-3.5" />
                WhatsApp
              </a>
            )}
          </div>
        </div>
        <p className="mt-3 text-center text-xs text-gray-500"><MapPin className="inline w-3.5 h-3.5 mr-1" />AUC New Cairo, Campus Center, Arnold Pavilion PO29, New Cairo 11835, Egypt</p>
      </footer>
    </div>
  );
}

import { motion, AnimatePresence } from 'motion/react';
import { useState, useMemo } from 'react';
import { isPublished } from '../../data/cms';
import { useCMS } from '../../hooks/useCMS';
import { useSEO } from '../../hooks/useSEO';
import {
  GraduationCap, Award, Users, BookOpen, ArrowRight, CheckCircle2,
  Building2, Star, Briefcase, ChevronRight, Quote
} from 'lucide-react';
import { Link } from 'react-router';
import EduHubNav from '../../components/EduHubNav';
import EduHubFooter from '../../components/EduHubFooter';
import { ImageWithFallback } from '../../components/media/ImageWithFallback';
import ManagedImage from '../../components/ManagedImage';
import { JsonLd, organizationSchema, educationalOrgSchema } from '../../components/JsonLd';
import { ALUMNI_KEYS } from '../../data/assetManifest';
import { SitePopup } from '../../components/SitePopup';

// ─── Courses ──────────────────────────────────────────────────────
const COURSES = [
  {
    level: 'CACHE Level 2',
    title: 'Caring for Children and Young People',
    description: 'Your entry point into early years. Gain foundational knowledge and open the door to a rewarding career with children.',
    duration: '6–9 months',
    status: 'Available',
    color: 'from-blue-400 to-blue-600',
    lightBg: 'bg-blue-50',
    border: 'border-blue-200',
    tag: 'bg-blue-100 text-blue-700',
  },
  {
    level: 'CACHE Level 3',
    title: 'Diploma for Early Years Workforce',
    description: 'The most in-demand qualification for nursery practitioners. Covers birth to 5 with knowledge extending to age 7.',
    duration: '9–12 months',
    status: 'Available',
    color: 'from-indigo-400 to-indigo-600',
    lightBg: 'bg-indigo-50',
    border: 'border-indigo-200',
    tag: 'bg-indigo-100 text-indigo-700',
  },
  {
    level: 'CACHE Level 5',
    title: 'Diploma for Early Years Leadership',
    description: 'Designed for practitioners ready to lead. Build the skills to manage settings, mentor teams, and shape provision.',
    duration: '9–12 months',
    status: 'Available',
    color: 'from-purple-400 to-purple-600',
    lightBg: 'bg-purple-50',
    border: 'border-purple-200',
    tag: 'bg-purple-100 text-purple-700',
  },
];

// ─── Course Journey Steps ─────────────────────────────────────────
const COURSE_JOURNEY = [
  {
    step: '01',
    icon: '📋',
    title: 'Enroll & Orientation',
    subtitle: 'Weeks 1–2',
    desc: 'Begin with an orientation session covering the EYFS framework, course expectations, and your personal learning plan. You\'ll meet your assigned assessor and cohort.',
    outcomes: ['Course overview', 'Meet your assessor', 'Set learning goals'],
    color: 'from-blue-400 to-blue-600',
    lightBg: 'bg-blue-50',
    border: 'border-blue-100',
  },
  {
    step: '02',
    icon: '📚',
    title: 'Taught Sessions',
    subtitle: 'Ongoing weekly',
    desc: 'Attend weekly classroom sessions led by qualified trainers. Topics cover child development, safeguarding, communication, play-based learning, and EYFS areas of learning.',
    outcomes: ['Expert-led workshops', 'Peer discussions', 'Case study analysis'],
    color: 'from-indigo-400 to-indigo-600',
    lightBg: 'bg-indigo-50',
    border: 'border-indigo-100',
  },
  {
    step: '03',
    icon: '🏫',
    title: 'Workplace Practice',
    subtitle: 'Practical placement',
    desc: 'Apply your learning in a real early years setting. Your assessor observes your practice, gives structured feedback, and supports your professional growth hands-on.',
    outcomes: ['Observed teaching', 'Structured feedback', 'Real classroom experience'],
    color: 'from-violet-400 to-purple-600',
    lightBg: 'bg-violet-50',
    border: 'border-violet-100',
  },
  {
    step: '04',
    icon: '🎓',
    title: 'Assessment & Certification',
    subtitle: 'Final stage',
    desc: 'Submit your portfolio of evidence, complete your end assessments, and receive your UK-accredited CACHE certificate — recognised internationally and respected by schools and nurseries across the region.',
    outcomes: ['Portfolio submission', 'UK CACHE certificate', 'Alumni network access'],
    color: 'from-pink-400 to-rose-600',
    lightBg: 'bg-rose-50',
    border: 'border-rose-100',
  },
];

// ─── Alumni Spotlights ────────────────────────────────────────────
const ALUMNI = [
  {
    name: 'Nour Abdel-Aziz',
    role: 'Lead Educator, Cairo British Nursery',
    course: 'CACHE Level 3 Graduate',
    quote: 'EduHub changed my career completely. I came in as a teaching assistant with no formal qualification — I left as a confident, certified Lead Educator. The practical placement was invaluable.',
    img: 'https://images.unsplash.com/photo-1758691737605-69a0e78bd193?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=400',
    stars: 5,
    colorAccent: 'bg-blue-600',
  },
  {
    name: 'Yasmine Mostafa',
    role: 'Nursery Director, AUC Early Years',
    course: 'CACHE Level 5 Graduate',
    quote: 'The Level 5 gave me the leadership framework I needed. Within six months of graduating I was managing a team of 12 educators. The UK accreditation opened doors I didn\'t expect.',
    img: 'https://images.unsplash.com/photo-1691256257499-25b0717e3f57?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=400',
    stars: 5,
    colorAccent: 'bg-indigo-600',
  },
  {
    name: 'Omar Khalil',
    role: 'EYFS Practitioner, International School',
    course: 'CACHE Level 2 Graduate',
    quote: 'I switched careers at 32 and had no background in education. EduHub\'s team made the process smooth and supportive. The Level 2 gave me the confidence to take the leap.',
    img: 'https://images.unsplash.com/photo-1755718669459-a8691dd613de?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=400',
    stars: 5,
    colorAccent: 'bg-violet-600',
  },
];

// ─── Accreditations ───────────────────────────────────────────────
const ACCREDITATIONS = [
  { name: 'CACHE', description: 'UK-recognised qualifications', detail: 'Leading awarding organisation for early years', logoUrl: '/images/eduhub/accreditation/cache.png' },
  { name: 'NCFE', description: 'Official UK recognition', detail: 'Recognised by UK education regulators', logoUrl: '/images/eduhub/accreditation/ncfe.png' },
  { name: 'BriteThink UK', description: 'Quality assurance partner', detail: 'Provides assessment and content support', logoUrl: '/images/eduhub/accreditation/britethink.png' },
];

const accreditationLogo = (name: string, logoUrl?: string) => {
  if (logoUrl) return logoUrl;
  const normalized = name.toLowerCase();
  if (normalized.includes('brite')) return '/images/eduhub/accreditation/britethink.png';
  if (normalized.includes('ncfe')) return '/images/eduhub/accreditation/ncfe.png';
  return '/images/eduhub/accreditation/cache.png';
};

export default function EduHubHome() {
  const [openJourney, setOpenJourney] = useState<number | null>(0);

  const cms = useCMS();
  useSEO('eduhub', undefined, cms);

  const heroH = cms.eduhubHero;

  const cmsCourses = useMemo(() => {
    const active = cms.courses.filter(c => isPublished({ status: c.publishStatus, active: c.active })).sort((a, b) => a.displayOrder - b.displayOrder);
    return active.length > 0 ? active : null;
  }, [cms.courses]);

  const cmsAlumni = useMemo(() => {
    const active = cms.alumni.filter(isPublished);
    return active.length > 0 ? active : null;
  }, [cms.alumni]);

  const cmsAccreditations = useMemo(() => {
    const active = cms.accreditations.filter(isPublished).sort((a, b) => a.displayOrder - b.displayOrder);
    return active.length > 0 ? active : null;
  }, [cms.accreditations]);

  const s = cms.siteSettings;
  const siteUrl = 'https://theearlyyearscompany.com';

  return (
    <div className="eduhub-site min-h-screen bg-white overflow-x-hidden">
      <JsonLd data={[
        organizationSchema({ name: s.companyName, url: siteUrl, phone: s.mainPhone, email: s.mainEmail }),
        educationalOrgSchema({ name: `${s.companyName} — EduHub Teacher Training`, url: `${siteUrl}/eduhub`, phone: s.mainPhone, email: s.eduhubEmail || s.mainEmail, description: heroH.subheadline || 'UK-accredited CACHE teacher training in Egypt and the Middle East.' }),
      ]} />
      <SitePopup site="eduhub" />
      <EduHubNav />

      <main>

      {/* ── HERO ── */}
      <section className="eduhub-home-hero relative overflow-hidden py-14 sm:py-20 lg:py-24">
        <div className="eduhub-home-hero__halo" aria-hidden="true" />
        <div className="eduhub-home-hero__ring" aria-hidden="true" />

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-[1.02fr_0.98fr] gap-10 lg:gap-14 items-center">
            <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.45, ease: [0.23, 1, 0.32, 1] }}>
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 border border-white/20 text-white text-xs sm:text-sm mb-6 max-w-full flex-wrap backdrop-blur-sm">
                <Award className="w-4 h-4 flex-shrink-0" />
                <span className="font-semibold">{heroH.eyebrow || 'First CACHE-Approved Centre in Egypt'}</span>
              </div>
              <h1 className="text-[2.65rem] sm:text-5xl lg:text-[4rem] text-white mb-5 leading-[1.02] font-bold max-w-2xl">
                {heroH.headline || 'Advance Your Early Years Career'}
              </h1>
              <p className="text-base sm:text-lg text-white/85 mb-8 leading-relaxed max-w-xl">
                {heroH.subheadline || 'EduHub is a division of Early Years Company, offering UK-accredited CACHE teacher training. We help educators across Egypt and the Middle East gain internationally recognised qualifications.'}
              </p>
              <div className="flex flex-col sm:flex-row gap-3">
                <motion.div whileTap={{ scale: 0.97 }} transition={{ duration: 0.14 }}>
                  <Link to={heroH.primaryCTALink || '/eduhub/programs'}
                    className="eduhub-home-hero__primary inline-flex w-full sm:w-auto items-center justify-center gap-2 px-7 py-4 rounded-xl bg-white text-[#1C46D7] font-bold">
                    <GraduationCap className="w-5 h-5" />
                    {heroH.primaryCTALabel || 'Explore Courses'}
                  </Link>
                </motion.div>
                <motion.div whileTap={{ scale: 0.97 }} transition={{ duration: 0.14 }} className="group">
                  <Link to={heroH.secondaryCTALink || '/eduhub/contact'}
                    className="inline-flex w-full sm:w-auto items-center justify-center gap-2 px-7 py-4 rounded-xl bg-white/10 border border-white/25 text-white font-semibold hover:bg-white/16 transition-colors">
                    {heroH.secondaryCTALabel || 'Register Interest'}
                    <ArrowRight className="w-5 h-5 translate-x-0 group-hover:translate-x-1 transition-transform duration-200" />
                  </Link>
                </motion.div>
              </div>
              <div className="mt-8 flex flex-wrap items-center gap-x-5 gap-y-2 text-xs sm:text-sm text-white/78">
                {['Internationally recognised', 'Flexible study', 'Assessor support'].map(item => (
                  <span key={item} className="inline-flex items-center gap-1.5"><CheckCircle2 className="w-4 h-4 text-[#7DE3FF]" />{item}</span>
                ))}
              </div>
            </motion.div>

            <motion.div initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.1, ease: [0.23, 1, 0.32, 1] }}
              className="eduhub-home-hero__visual relative">
              <div className="rounded-[1.6rem] overflow-hidden aspect-[4/3] border border-white/25">
                <ManagedImage
                  assetKey="eduhub.hero"
                  src={heroH.heroImageUrl || "https://images.unsplash.com/photo-1758270704021-361c165d68fd?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080"}
                  alt="Teacher professional training at EduHub"
                  className="w-full h-full object-cover"
                />
              </div>
              <motion.div initial={{ opacity: 0, scale: 0.96 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.45, duration: 0.28, ease: [0.23, 1, 0.32, 1] }}
                className="eduhub-home-hero__trust absolute -bottom-5 left-3 right-3 sm:left-5 sm:right-auto bg-white rounded-2xl p-3.5 sm:p-4 border border-white">
                <div className="flex items-center justify-between gap-4 sm:min-w-[22rem]">
                  <div>
                    <div className="text-[11px] font-semibold uppercase tracking-[0.12em] text-[#52627c]">Trusted qualification partners</div>
                    <div className="mt-2 flex items-center gap-4">
                      <img src="/images/eduhub/accreditation/cache.png" alt="CACHE accreditation" className="h-6 w-auto object-contain" />
                      <img src="/images/eduhub/accreditation/ncfe.png" alt="NCFE accreditation" className="h-6 w-auto object-contain" />
                      <img src="/images/eduhub/accreditation/britethink.png" alt="BriteThink quality assurance partner" className="h-6 w-auto max-w-[6.5rem] object-contain" />
                    </div>
                  </div>
                </div>
              </motion.div>
            </motion.div>
          </div>

          {/* Quick stats strip */}
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }}
            className="eduhub-home-hero__stats mt-14 lg:mt-16 grid grid-cols-2 md:grid-cols-4">
            {(heroH.stats?.length ? heroH.stats : [
              { num: '#1', label: 'CACHE Centre in Egypt' },
              { num: '3', label: 'Qualification Levels' },
              { num: '500+', label: 'Graduates to Date' },
              { num: '100%', label: 'UK Accredited' },
            ]).map((s, i) => (
              <div key={i} className="p-4 sm:p-5 text-center">
                <div className="text-2xl font-bold text-white mb-1">{s.num}</div>
                <div className="text-xs text-white/72 font-medium">{s.label}</div>
              </div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* ── ACCREDITATION STRIP ── */}
      <section className="py-16 lg:py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="text-center mb-12">
            <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-3">
              UK-Accredited Qualifications
            </h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              The first and only CACHE-approved training centre in Egypt, supported by NCFE UK and BriteThink UK.
            </p>
          </motion.div>
          <div className="grid md:grid-cols-3 gap-5">
            {(cmsAccreditations || ACCREDITATIONS).map((acc, i) => (
              <motion.div key={i}
                initial={{ opacity: 0, scale: 0.96 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.13, duration: 0.45, ease: [0.25, 0.46, 0.45, 0.94] }}
                whileHover={{ y: -4, transition: { duration: 0.22, ease: 'easeOut' } }}
                className="eduhub-accreditation-card bg-white rounded-2xl p-6 text-left border border-blue-100 hover:shadow-lg transition-shadow">
                <div className="h-16 rounded-xl bg-[#F4F7FF] border border-[#DFE8FF] flex items-center px-5 mb-5">
                  <img src={accreditationLogo(acc.name, 'logoUrl' in acc ? acc.logoUrl : undefined)} alt={`${acc.name} accreditation logo`} className="max-h-9 max-w-[12rem] w-auto object-contain" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">{acc.name}</h3>
                <p className="text-[#1349D1] text-sm font-semibold mb-1">{acc.description}</p>
                <p className="text-gray-500 text-sm">{acc.detail}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── COURSE JOURNEY ── */}
      <section className="py-20 lg:py-28 bg-gray-50">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="text-center mb-14">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white border border-blue-100 shadow-sm text-[#1349D1] text-sm mb-5">
              <BookOpen className="w-4 h-4" />
              <span className="font-semibold">Your Course Journey</span>
            </div>
            <h2 className="text-4xl lg:text-5xl font-bold text-gray-900 mb-4">
              From Enrolment to Certificate
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Every EduHub learner follows a structured, supported pathway. Here's exactly what to expect — from your first session to your UK-accredited certificate.
            </p>
          </motion.div>

          <div className="space-y-3">
            {COURSE_JOURNEY.map((step, i) => {
              const isOpen = openJourney === i;
              return (
                <motion.div key={i}
                  initial={{ opacity: 0, x: -12 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.09, duration: 0.45, ease: [0.25, 0.46, 0.45, 0.94] }}
                  animate={{
                    boxShadow: isOpen
                      ? '0 0 0 2px rgba(19,73,209,0.18), 0 8px 24px -4px rgba(19,73,209,0.1)'
                      : '0 1px 3px rgba(0,0,0,0.06)',
                  }}
                  className={`rounded-2xl border-2 bg-white overflow-hidden transition-colors duration-300 ${isOpen ? step.border : 'border-transparent'}`}
                >
                  {/* Header row */}
                  <button onClick={() => setOpenJourney(isOpen ? null : i)} className="w-full text-left">
                    <div className="grid grid-cols-[72px_1fr] sm:grid-cols-[96px_1fr] items-stretch">
                      {/* Step number */}
                      <div className={`bg-gradient-to-br ${step.color} flex flex-col items-center justify-center py-5 gap-1`}>
                        <span className="text-2xl sm:text-3xl leading-none">{step.icon}</span>
                        <span className="text-white text-[10px] font-bold opacity-80">{step.step}</span>
                      </div>
                      {/* Content */}
                      <div className="px-6 py-5 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                        <div>
                          <div className="flex items-center gap-3 mb-1">
                            <h3 className="font-bold text-gray-900">{step.title}</h3>
                            <span className={`hidden sm:inline px-2.5 py-0.5 rounded-full text-xs font-medium ${step.lightBg} text-gray-600 border ${step.border}`}>
                              {step.subtitle}
                            </span>
                          </div>
                          <p className="text-sm text-gray-600 line-clamp-1">{step.desc}</p>
                        </div>
                        <div className={`w-8 h-8 rounded-full flex-shrink-0 flex items-center justify-center transition-all ${isOpen ? `bg-gradient-to-br ${step.color} text-white` : `${step.lightBg} text-gray-400`}`}>
                          <motion.span animate={{ rotate: isOpen ? 90 : 0 }} transition={{ duration: 0.2 }}>
                            <ChevronRight className="w-4 h-4" />
                          </motion.span>
                        </div>
                      </div>
                    </div>
                  </button>

                  {/* Expanded */}
                  <AnimatePresence initial={false}>
                    {isOpen && (
                      <motion.div
                        initial={{ opacity: 0, y: -6 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -6 }}
                        transition={{ duration: 0.22, ease: [0.25, 0.46, 0.45, 0.94] }}
                      >
                        <div className={`border-t ${step.border} grid sm:grid-cols-[1fr_auto] gap-0`}>
                          <div className={`${step.lightBg} px-6 py-5`}>
                            <p className="text-gray-700 text-sm leading-relaxed mb-4">{step.desc}</p>
                            <div className="flex flex-wrap gap-2">
                              {step.outcomes.map((o, j) => (
                                <span key={j} className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white border border-white/80 shadow-sm text-xs font-medium text-gray-700">
                                  <CheckCircle2 className="w-3 h-3 text-green-500" />
                                  {o}
                                </span>
                              ))}
                            </div>
                          </div>
                          {i < 3 && (
                            <div className={`hidden sm:flex flex-col items-center justify-center px-7 py-5 ${step.lightBg} border-l ${step.border}`}>
                              <div className={`w-12 h-12 rounded-2xl bg-gradient-to-br ${step.color} flex items-center justify-center mb-2 shadow-md`}>
                                <ArrowRight className="w-5 h-5 text-white" />
                              </div>
                              <span className="text-xs text-gray-500 font-medium text-center">Next:<br />Step {String(i + 2).padStart(2, '0')}</span>
                            </div>
                          )}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </motion.div>
              );
            })}
          </div>

          <motion.div initial={{ opacity: 0, y: 12 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: 0.3 }}
            className="mt-8 text-center">
            <Link to="/eduhub/programs"
              className="inline-flex items-center gap-2 px-8 py-4 rounded-xl bg-[#1349D1] text-white font-bold hover:bg-blue-700 hover:shadow-xl transition-all">
              See Full Course Details
              <ArrowRight className="w-5 h-5" />
            </Link>
          </motion.div>
        </div>
      </section>

      {/* ── COURSES CARDS ── */}
      <section className="py-20 lg:py-28 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="text-center mb-14">
            <h2 className="text-4xl lg:text-5xl font-bold text-gray-900 mb-4">
              Three Levels, One Clear Pathway
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Whether you're starting out or stepping into leadership, there's a CACHE qualification designed for where you are now — and where you want to go.
            </p>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-6">
            {(cmsCourses || COURSES).map((course, i) => (
              <motion.div key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.11, duration: 0.48, ease: [0.25, 0.46, 0.45, 0.94] }}
                whileHover={{ y: -6, transition: { duration: 0.22, ease: 'easeOut' } }}
                whileTap={{ scale: 0.99 }}
                className={`bg-white rounded-2xl overflow-hidden shadow-md hover:shadow-xl transition-shadow border ${course.border} group`}
              >
                <div className={`h-2 bg-gradient-to-r ${course.color}`} />
                <div className="p-7">
                  <div className="flex items-center justify-between mb-5">
                    <span className={`text-xs px-3 py-1.5 rounded-full font-semibold ${course.tag}`}>{course.level}</span>
                    <span className={`text-xs px-3 py-1.5 rounded-full font-medium ${course.status === 'Available' ? 'bg-emerald-100 text-emerald-700' : 'bg-gray-100 text-gray-600'}`}>
                      {course.status}
                    </span>
                  </div>
                  <h3 className="text-lg font-bold text-gray-900 mb-3 leading-snug">{course.title}</h3>
                  <p className="text-sm text-gray-600 mb-5 leading-relaxed">{course.description}</p>
                  <div className="flex items-center gap-2 text-sm text-gray-500 mb-6">
                    <BookOpen className="w-4 h-4" />
                    <span>Duration: {course.duration}</span>
                  </div>
                  <Link to="/eduhub/programs"
                    className={`flex items-center justify-center gap-2 px-5 py-3 rounded-xl font-semibold text-sm transition-all ${course.status === 'Available' ? `bg-gradient-to-r ${course.color} text-white hover:shadow-lg hover:brightness-105` : 'bg-gray-100 text-gray-500 cursor-default'}`}>
                    {course.status === 'Available' ? (
                      <>View Course Details <ArrowRight className="w-4 h-4 translate-x-0 group-hover:translate-x-1 transition-transform duration-200" /></>
                    ) : 'Join Waitlist'}
                  </Link>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── WHO WE SERVE ── */}
      <section className="py-20 lg:py-28 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <motion.div initial={{ opacity: 0, x: -20 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ duration: 0.6 }}>
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white border border-blue-100 shadow-sm text-[#1349D1] text-sm mb-6">
                <Users className="w-4 h-4" />
                <span className="font-semibold">Who We Train</span>
              </div>
              <h2 className="text-4xl lg:text-5xl font-bold text-gray-900 mb-5">
                Built for Ambitious Educators
              </h2>
              <p className="text-lg text-gray-600 mb-8 leading-relaxed">
                EduHub serves educators across Egypt and the wider Middle East — from career starters to experienced leaders looking for international recognition.
              </p>
              <div className="space-y-3">
                {[
                  { icon: '🎓', text: 'Individual educators seeking career advancement and formal recognition' },
                  { icon: '🏫', text: 'Schools implementing or improving their EYFS curriculum' },
                  { icon: '👶', text: 'Nurseries and daycare centres upskilling their teams in-house' },
                  { icon: '🏛️', text: 'Private and public educational institutions' },
                  { icon: '📋', text: 'Ministry of Education training and professional development programs' },
                ].map((item, i) => (
                  <motion.div key={i} initial={{ opacity: 0, x: -16 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.08 }}
                    className="flex items-start gap-4 bg-white rounded-xl px-5 py-4 border border-gray-100 shadow-sm">
                    <span className="text-xl flex-shrink-0">{item.icon}</span>
                    <span className="text-gray-700 text-sm leading-relaxed">{item.text}</span>
                  </motion.div>
                ))}
              </div>
            </motion.div>

            <motion.div initial={{ opacity: 0, x: 20 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ duration: 0.6, delay: 0.2 }}>
              <div className="rounded-2xl overflow-hidden shadow-2xl aspect-[4/3]">
                <ManagedImage
                  assetKey="eduhub.hero.graduates"
                  src="https://images.unsplash.com/photo-1593442808882-775dfcd90699?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080"
                  alt="Educator classroom observation and practical teaching"
                  className="w-full h-full object-cover"
                />
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* ── ALUMNI SPOTLIGHTS ── */}
      <section className="py-20 lg:py-28 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="text-center mb-14">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-blue-50 border border-blue-100 shadow-sm text-[#1349D1] text-sm mb-5">
              <Star className="w-4 h-4" />
              <span className="font-semibold">Alumni Spotlights</span>
            </div>
            <h2 className="text-4xl lg:text-5xl font-bold text-gray-900 mb-4">
              Real Educators, Real Careers
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Hear from educators who trained with EduHub and used their CACHE qualification to build careers they're proud of.
            </p>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-7">
            {(cmsAlumni || ALUMNI).map((person, i) => (
              <motion.div key={i}
                initial={{ opacity: 0, y: 20, scale: 0.98 }}
                whileInView={{ opacity: 1, y: 0, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.14, duration: 0.52, ease: [0.25, 0.46, 0.45, 0.94] }}
                whileHover={{ y: -4, transition: { duration: 0.22, ease: 'easeOut' } }}
                className="bg-white rounded-2xl shadow-md hover:shadow-xl transition-shadow border border-gray-100 overflow-hidden flex flex-col"
              >
                {/* Quote section */}
                <div className="p-7 flex-1">
                  <Quote className="w-8 h-8 text-blue-200 mb-4" />
                  <p className="text-gray-700 text-sm leading-relaxed mb-5 italic">
                    "{person.quote}"
                  </p>
                  {/* Stars */}
                  <div className="flex gap-1">
                    {Array.from({ length: person.stars }).map((_, j) => (
                      <Star key={j} className="w-4 h-4 text-amber-400 fill-amber-400" />
                    ))}
                  </div>
                </div>
                {/* Person info */}
                <div className="border-t border-gray-100 px-7 py-5 flex items-center gap-4">
                  <div className="w-12 h-12 rounded-full overflow-hidden flex-shrink-0 shadow-md">
                    <ManagedImage assetKey={ALUMNI_KEYS[person.name]} src={person.img} alt={person.name} className="w-full h-full object-cover" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="font-bold text-gray-900 text-sm">{person.name}</div>
                    <div className="text-xs text-gray-500 truncate">{person.role}</div>
                    <div className={`inline-flex items-center gap-1 mt-1 px-2 py-0.5 rounded-full text-[10px] font-bold text-white ${person.colorAccent}`}>
                      <GraduationCap className="w-3 h-3" />
                      {person.course}
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── WHY EDUHUB ── */}
      <section className="py-20 lg:py-28 bg-gradient-to-br from-blue-50 to-indigo-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="text-center mb-14">
            <h2 className="text-4xl lg:text-5xl font-bold text-gray-900 mb-4">Why Choose EduHub?</h2>
            <p className="text-lg text-gray-600">Egypt's first and leading CACHE training centre</p>
          </motion.div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { icon: Award, title: 'UK Accreditation', desc: 'Official CACHE, NCFE, and BriteThink recognition respected worldwide', color: 'from-blue-400 to-blue-600' },
              { icon: Building2, title: 'First in Egypt', desc: 'Pioneer CACHE-approved training centre since our founding', color: 'from-indigo-400 to-indigo-600' },
              { icon: Users, title: 'Expert Trainers', desc: 'Qualified assessors with real-world early years and UK standards experience', color: 'from-violet-400 to-purple-600' },
              { icon: Briefcase, title: 'Career Outcomes', desc: 'Clear pathways from Level 2 practice to Level 5 nursery leadership', color: 'from-pink-400 to-rose-500' },
            ].map((f, i) => (
              <motion.div key={i} initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.1 }}
                whileHover={{ y: -4 }}
                className="bg-white rounded-2xl p-7 shadow-md hover:shadow-xl transition-all text-center border border-white">
                <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${f.color} flex items-center justify-center mx-auto mb-5 shadow-lg`}>
                  <f.icon className="w-7 h-7 text-white" />
                </div>
                <h3 className="font-bold text-gray-900 mb-2">{f.title}</h3>
                <p className="text-sm text-gray-600 leading-relaxed">{f.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA ── */}
      <section className="py-20 lg:py-28 bg-[#0d2c6b]">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
            <div className="text-5xl mb-6">🎓</div>
            <h2 className="text-4xl lg:text-5xl font-bold text-white mb-5">
              Ready to Take the Next Step?
            </h2>
            <p className="text-xl text-white/80 mb-8 max-w-2xl mx-auto">
              Join hundreds of educators who have transformed their careers with EduHub's UK-accredited CACHE qualifications.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <motion.div whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }} transition={{ duration: 0.18 }}>
                <Link to="/eduhub/programs"
                  className="inline-flex items-center justify-center gap-2 px-8 py-4 rounded-xl bg-white text-gray-900 font-bold hover:shadow-2xl transition-shadow">
                  <GraduationCap className="w-5 h-5 text-[#1349D1]" />
                  View All Courses
                </Link>
              </motion.div>
              <motion.div whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }} transition={{ duration: 0.18 }} className="group">
                <Link to="/eduhub/contact"
                  className="inline-flex items-center justify-center gap-2 px-8 py-4 rounded-xl border-2 border-white/30 text-white font-semibold hover:bg-white/10 transition-colors">
                  Register Interest
                  <ArrowRight className="w-5 h-5 translate-x-0 group-hover:translate-x-1 transition-transform duration-200" />
                </Link>
              </motion.div>
            </div>
          </motion.div>
        </div>
      </section>

      </main>
      <EduHubFooter />
    </div>
  );
}

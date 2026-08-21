import { motion } from 'motion/react';
import { useState } from 'react';
import {
  Sprout, Users, Sun, ArrowRight, CheckCircle2,
  Clock, Calendar, Star, ChevronRight
} from 'lucide-react';
import { Link } from 'react-router';
import DaycareNav from '../../components/DaycareNav';
import DaycareFooter from '../../components/DaycareFooter';

// ─── Program Data ───────────────────────────────────────────────
const PROGRAMS = [
  {
    id: 'preschool',
    emoji: '🌈',
    icon: Sprout,
    title: 'Preschool Program',
    subtitle: 'EYFS Curriculum',
    age: '1 year (walking) – 5 years',
    schedule: 'Mon – Fri · 8:15 AM – 4:00 PM',
    classSize: 'Max 14 per class',
    color: 'from-peach-400 to-coral-500',
    bg: 'bg-peach-50',
    border: 'border-peach-200',
    tag: 'bg-peach-100 text-peach-700',
    accentText: 'text-coral-600',
    description:
      'Our flagship EYFS program supports children aged 1–5 through play-based, holistic learning that builds genuine foundations for school and life. Five dedicated age-group classrooms, each with its own curriculum rhythm, teacher ratio, and enabling environment.',
    highlights: [
      { emoji: '📚', label: 'EYFS curriculum framework' },
      { emoji: '🎨', label: 'Play-based holistic development' },
      { emoji: '🍽️', label: 'Daily freshly cooked warm lunch' },
      { emoji: '🔬', label: 'Science, arts & sensory activities' },
      { emoji: '📋', label: 'Weekly thematic plans & newsletters' },
      { emoji: '🤝', label: 'Strong parent–teacher partnership' },
      { emoji: '📊', label: 'Regular developmental assessments' },
    ],
    classes: [
      { name: 'Toddlers', age: '1–2 yrs', ratio: '1:4', emoji: '🍼' },
      { name: 'Butterflies', age: '2–3 yrs', ratio: '1:5', emoji: '🦋' },
      { name: 'Bees', age: '3–4 yrs', ratio: '1:6', emoji: '🐝' },
      { name: 'Ladybirds & Spiders', age: '3.5–4.5 yrs', ratio: '1:7', emoji: '🐞' },
      { name: 'Dragonflies', age: '4–5 yrs', ratio: '1:7', emoji: '🐉' },
    ],
    cta: 'Book a Tour',
    ctaLink: '/daycare/contact',
  },
  {
    id: 'afterschool',
    emoji: '🎒',
    icon: Users,
    title: 'After-School Care',
    subtitle: 'Ages up to 10',
    age: 'School-age children · up to age 10',
    schedule: 'After school hours · flexible',
    classSize: 'Max 10 children per day',
    color: 'from-teal-400 to-emerald-500',
    bg: 'bg-teal-50',
    border: 'border-teal-200',
    tag: 'bg-teal-100 text-teal-700',
    accentText: 'text-teal-600',
    description:
      'A safe, supervised after-school environment for children up to age 10. With a small maximum of 10 children per day, every child gets individual attention, homework support, and genuinely enjoyable afternoon activities.',
    highlights: [
      { emoji: '🔒', label: 'Safe, supervised environment' },
      { emoji: '📝', label: 'Homework support & guidance' },
      { emoji: '🎮', label: 'Structured play activities' },
      { emoji: '🥕', label: 'Healthy snacks provided' },
      { emoji: '🎨', label: 'Creative & physical activities' },
      { emoji: '👥', label: 'Small group (max 10 children)' },
      { emoji: '📅', label: 'Flexible scheduling options' },
    ],
    classes: null,
    cta: 'Enquire About Availability',
    ctaLink: '/daycare/contact',
  },
  {
    id: 'camps',
    emoji: '☀️',
    icon: Sun,
    title: 'Seasonal Camps',
    subtitle: 'Winter & Summer',
    age: '4 – 8 years',
    schedule: 'Winter & Summer school breaks',
    classSize: 'Subject to availability',
    color: 'from-amber-400 to-orange-500',
    bg: 'bg-amber-50',
    border: 'border-amber-200',
    tag: 'bg-amber-100 text-amber-700',
    accentText: 'text-amber-600',
    description:
      "Seasonal camps that make the most of the daycare facility's AUC campus grounds. Themed weeks of outdoor adventure, creative projects, new friendships, and healthy meals — keeping children active and curious through every school break.",
    highlights: [
      { emoji: '🌳', label: 'Outdoor play & exploration' },
      { emoji: '🎭', label: 'Seasonal themed activities' },
      { emoji: '🎨', label: 'Arts, crafts & creative projects' },
      { emoji: '⚽', label: 'Physical games & sports' },
      { emoji: '🎵', label: 'Music & movement sessions' },
      { emoji: '🥗', label: 'Healthy meals & snacks' },
      { emoji: '👫', label: 'New friendships & social skills' },
    ],
    classes: null,
    cta: 'Join the Waitlist',
    ctaLink: '/daycare/contact',
  },
];

// ─── Fees Data ──────────────────────────────────────────────────
const FEES = {
  period: '10-month period · September to June',
  aucStaff: [
    { label: 'Registration Fee', value: '2,000 EGP' },
    { label: 'Monthly Tuition', value: '6,800 EGP' },
    { label: 'Late School (4–5 PM)', value: '750 EGP / month' },
  ],
  nonAuc: [
    { label: 'Registration Fee', value: '2,500 EGP' },
    { label: 'Monthly Tuition', value: '9,500 EGP' },
    { label: 'Late School (4–5 PM)', value: '1,500 EGP / month' },
  ],
  notes: [
    'All fees are non-refundable and cover a 10-month period (September to June)',
    'Registration fee paid within one week from acceptance letter',
    'Monthly tuition paid by the 20th of the previous month',
    'LE 100 penalty for late payment (after 22nd of the month)',
    'Seasonal camp fees are separate and depend on availability',
  ],
};

export default function DaycarePrograms() {
  const [active, setActive] = useState<string>(PROGRAMS[0].id);

  const prog = PROGRAMS.find(p => p.id === active)!;

  return (
    <div className="min-h-screen bg-white">
      <DaycareNav />

      <main>

      {/* ── Hero ─────────────────────────────────────────────────── */}
      <section className="relative bg-gradient-to-br from-peach-50 via-lemon-50 to-mint-50 py-16 sm:py-20 overflow-hidden">
        <motion.div animate={{ y: [0, -18, 0] }} transition={{ duration: 8, repeat: Infinity }}
          className="absolute top-10 right-20 text-5xl opacity-25 hidden sm:block pointer-events-none">🌈</motion.div>
        <motion.div animate={{ y: [0, 16, 0] }} transition={{ duration: 10, repeat: Infinity, delay: 1.5 }}
          className="absolute bottom-10 left-16 text-4xl opacity-20 hidden sm:block pointer-events-none">⭐</motion.div>

        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
            <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: 'spring', duration: 0.6 }}
              className="inline-block text-5xl mb-5">🌈</motion.div>
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-gray-900 mb-4">
              Our Programs
            </h1>
            <p className="text-lg sm:text-xl text-gray-600 leading-relaxed max-w-2xl mx-auto">
              Three program types designed around your family's needs — from daily EYFS learning to after-school care and seasonal holiday camps.
            </p>
          </motion.div>
        </div>
      </section>

      {/* ── Program Tabs ─────────────────────────────────────────── */}
      <section className="py-14 lg:py-20">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">

          {/* Tab switcher */}
          <div className="flex flex-col sm:flex-row gap-3 mb-10">
            {PROGRAMS.map((p) => (
              <motion.button
                key={p.id}
                onClick={() => setActive(p.id)}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className={`flex-1 flex items-center gap-3 px-5 py-4 rounded-2xl border-2 text-left transition-all ${
                  active === p.id
                    ? `bg-gradient-to-r ${p.color} text-white border-transparent shadow-xl`
                    : `bg-white ${p.border} text-gray-700 hover:shadow-md`
                }`}
              >
                <span className="text-2xl">{p.emoji}</span>
                <div>
                  <div className={`text-sm font-bold ${active === p.id ? 'text-white' : 'text-gray-900'}`}>{p.title}</div>
                  <div className={`text-xs ${active === p.id ? 'text-white/80' : 'text-gray-500'}`}>{p.subtitle}</div>
                </div>
              </motion.button>
            ))}
          </div>

          {/* Active Program Detail */}
          <motion.div
            key={active}
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
          >
            <div className={`${prog.bg} rounded-3xl border ${prog.border} overflow-hidden`}>

              {/* Colored top accent */}
              <div className={`h-1.5 w-full bg-gradient-to-r ${prog.color}`} />

              <div className="p-8 lg:p-10">
                <div className="grid lg:grid-cols-5 gap-10">

                  {/* Left col (3/5) — main info */}
                  <div className="lg:col-span-3 space-y-7">
                    {/* Title + badge row */}
                    <div>
                      <div className="flex items-center gap-3 mb-3">
                        <span className="text-3xl">{prog.emoji}</span>
                        <div>
                          <h2 className="text-2xl lg:text-3xl font-bold text-gray-900">{prog.title}</h2>
                          <span className={`inline-block text-xs font-bold px-2.5 py-1 rounded-full ${prog.tag} mt-1`}>{prog.subtitle}</span>
                        </div>
                      </div>
                      <p className="text-gray-700 leading-relaxed">{prog.description}</p>
                    </div>

                    {/* Quick stats */}
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                      {[
                        { icon: '👶', label: 'Age', value: prog.age },
                        { icon: '🗓️', label: 'Schedule', value: prog.schedule },
                        { icon: '👥', label: 'Class Size', value: prog.classSize },
                      ].map((stat, i) => (
                        <div key={i} className="bg-white/80 rounded-2xl p-3.5">
                          <div className="text-xl mb-1">{stat.icon}</div>
                          <div className="text-xs text-gray-500 mb-0.5">{stat.label}</div>
                          <div className="text-sm font-bold text-gray-800 leading-snug">{stat.value}</div>
                        </div>
                      ))}
                    </div>

                    {/* Class breakdown (Preschool only) */}
                    {prog.classes && (
                      <div className="bg-white/80 rounded-2xl p-5">
                        <h3 className="text-sm font-bold text-gray-500 uppercase tracking-wide mb-3">Class Progression</h3>
                        <div className="flex flex-wrap gap-2">
                          {prog.classes.map((cls, i) => (
                            <div key={i} className="flex items-center gap-2">
                              <div className={`flex items-center gap-2 px-3 py-2 rounded-xl ${prog.bg} border ${prog.border}`}>
                                <span>{cls.emoji}</span>
                                <div>
                                  <div className="text-xs font-bold text-gray-800">{cls.name}</div>
                                  <div className="text-[10px] text-gray-500">{cls.age} · {cls.ratio}</div>
                                </div>
                              </div>
                              {i < prog.classes!.length - 1 && (
                                <ChevronRight className="w-3.5 h-3.5 text-gray-300 flex-shrink-0" />
                              )}
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Right col (2/5) — highlights + CTA */}
                  <div className="lg:col-span-2 space-y-6">
                    <div className="bg-white rounded-2xl p-6 shadow-md">
                      <h3 className="text-base font-bold text-gray-900 mb-4 flex items-center gap-2">
                        <Star className="w-4 h-4 text-amber-400 fill-amber-400" />
                        What's Included
                      </h3>
                      <ul className="space-y-3">
                        {prog.highlights.map((h, i) => (
                          <li key={i} className="flex items-start gap-3">
                            <span className="text-lg flex-shrink-0">{h.emoji}</span>
                            <span className="text-sm text-gray-700">{h.label}</span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    <Link
                      to={prog.ctaLink}
                      className={`flex items-center justify-center gap-2 w-full px-6 py-4 rounded-2xl font-bold text-white bg-gradient-to-r ${prog.color} shadow-lg hover:shadow-xl hover:scale-105 transition-all`}
                    >
                      {prog.cta}
                      <ArrowRight className="w-5 h-5" />
                    </Link>
                    <Link
                      to="/daycare/contact"
                      className="flex items-center justify-center gap-2 w-full px-6 py-3.5 rounded-2xl font-semibold text-gray-700 border-2 border-gray-200 hover:border-gray-300 hover:shadow transition-all text-sm"
                    >
                      <Calendar className="w-4 h-4" />
                      Schedule a Free Visit
                    </Link>
                  </div>

                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* ── Fees ─────────────────────────────────────────────────── */}
      <section className="py-16 lg:py-24 bg-gradient-to-br from-peach-50/60 via-lemon-50/40 to-mint-50/60">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
            className="text-center mb-10">
            <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-2">Tuition & Fees 2025–26</h2>
            <p className="text-gray-500">{FEES.period} · All fees non-refundable</p>
          </motion.div>

          <div className="grid md:grid-cols-2 gap-6 mb-6">
            {/* AUC Staff */}
            <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
              className="bg-white rounded-3xl overflow-hidden shadow-lg">
              <div className="bg-gradient-to-r from-peach-400 to-coral-500 px-6 py-4">
                <h3 className="text-white font-bold text-lg">AUC Staff</h3>
                <p className="text-white/80 text-sm">Special rates for AUC community</p>
              </div>
              <div className="p-6 space-y-3">
                {FEES.aucStaff.map((item, i) => (
                  <div key={i} className="flex justify-between items-center py-3 border-b border-gray-50 last:border-0">
                    <span className="text-gray-600 text-sm">{item.label}</span>
                    <span className="font-bold text-gray-900">{item.value}</span>
                  </div>
                ))}
              </div>
            </motion.div>

            {/* Non-AUC */}
            <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
              transition={{ delay: 0.1 }}
              className="bg-white rounded-3xl overflow-hidden shadow-lg">
              <div className="bg-gradient-to-r from-teal-400 to-emerald-500 px-6 py-4">
                <h3 className="text-white font-bold text-lg">Non-AUC</h3>
                <p className="text-white/80 text-sm">Standard enrollment rates</p>
              </div>
              <div className="p-6 space-y-3">
                {FEES.nonAuc.map((item, i) => (
                  <div key={i} className="flex justify-between items-center py-3 border-b border-gray-50 last:border-0">
                    <span className="text-gray-600 text-sm">{item.label}</span>
                    <span className="font-bold text-gray-900">{item.value}</span>
                  </div>
                ))}
              </div>
            </motion.div>
          </div>

          {/* Notes */}
          <motion.div initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
            className="bg-white rounded-2xl p-6 shadow-sm">
            <h4 className="text-sm font-bold text-gray-700 mb-3 uppercase tracking-wide">Important Notes</h4>
            <ul className="space-y-2">
              {FEES.notes.map((note, i) => (
                <li key={i} className="flex items-start gap-2.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-500 flex-shrink-0 mt-0.5" />
                  <span className="text-sm text-gray-600">{note}</span>
                </li>
              ))}
            </ul>
          </motion.div>
        </div>
      </section>

      {/* ── CTA ──────────────────────────────────────────────────── */}
      <section className="py-16 lg:py-24 bg-gradient-to-r from-peach-400 via-coral-500 to-pink-500">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
            <div className="text-4xl mb-4">🏫</div>
            <h2 className="text-3xl lg:text-4xl font-bold text-white mb-3">Ready to Enroll?</h2>
            <p className="text-white/90 mb-8">
              Tours run Monday–Friday, 10:30 AM–12:00 PM. Book 1 day in advance to meet the team and see the classrooms.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <Link to="/daycare/contact"
                className="inline-flex items-center justify-center gap-2 px-8 py-4 rounded-2xl bg-white text-gray-900 font-bold hover:shadow-2xl hover:scale-105 transition-all">
                <Calendar className="w-5 h-5" />
                Book a Tour
              </Link>
              <Link to="/daycare/contact"
                className="inline-flex items-center justify-center gap-2 px-8 py-4 rounded-2xl bg-white/20 text-white font-bold border-2 border-white/40 hover:bg-white/30 transition-all">
                Apply Now
                <ArrowRight className="w-5 h-5" />
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      </main>
      <DaycareFooter />
    </div>
  );
}

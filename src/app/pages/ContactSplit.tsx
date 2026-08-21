import { useState } from 'react';
import { Link } from 'react-router';
import { motion, AnimatePresence } from 'motion/react';
import { ArrowLeft, Send, CheckCircle, Phone, Mail } from 'lucide-react';
import {
  DAYCARE_RECIPIENT_EMAIL,
  EDUHUB_RECIPIENT_EMAIL,
  createMailtoLink,
} from '../utils/emailService';
import { insertSubmission } from '../data/cms';
import DaycareLogo from '../components/DaycareLogo';
import EduHubLogo from '../components/EduHubLogo';

/* ─── Shared spinner ─────────────────────────────────────── */
function Spinner() {
  return (
    <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
    </svg>
  );
}

/* ─── Success overlay ────────────────────────────────────── */
function SuccessBanner({ message, steps, onReset }: { message: string; steps: string[]; onReset: () => void }) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className="flex flex-col items-center text-center py-10 px-6 gap-5"
    >
      <CheckCircle className="w-14 h-14 text-green-500" />
      <p className="text-gray-800 leading-relaxed max-w-xs">{message}</p>
      <div className="w-full text-left bg-gray-50 rounded-2xl p-4 space-y-3">
        <p className="text-xs font-bold uppercase tracking-widest text-gray-600 mb-2">What happens next</p>
        {steps.map((step, i) => (
          <div key={i} className="flex items-start gap-3 text-sm text-gray-700">
            <span className="w-5 h-5 rounded-full bg-green-100 text-green-700 text-xs font-bold flex items-center justify-center flex-shrink-0 mt-0.5">{i + 1}</span>
            {step}
          </div>
        ))}
      </div>
      <button onClick={onReset} className="text-sm text-gray-500 underline underline-offset-2 hover:text-gray-800 transition-colors">
        Send another message
      </button>
    </motion.div>
  );
}

/* ════════════════════════════════════════════════════════════
   DAYCARE PANEL
════════════════════════════════════════════════════════════ */
function DaycarePanel() {
  const [form, setForm] = useState({ name: '', email: '', phone: '', childAge: '', message: '' });
  const [submitting, setSubmitting] = useState(false);
  const [done, setDone] = useState(false);

  const set = (k: string, v: string) => setForm(f => ({ ...f, [k]: v }));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      const payload = {
        subject: `Daycare Enquiry — ${form.name}`,
        name: form.name,
        email: form.email,
        phone: form.phone,
        childAge: form.childAge || 'Not specified',
        message: form.message || 'No message provided',
        submittedAt: new Date().toISOString(),
        source: 'Split Contact — Daycare',
      };
      const receipt = await insertSubmission('daycare', payload);
      if (receipt.cloudSaved) {
        setDone(true);
      } else {
        const mailtoUrl = createMailtoLink(
          DAYCARE_RECIPIENT_EMAIL,
          `Daycare Enquiry — ${form.name}`,
          `Name: ${form.name}\nEmail: ${form.email}\nPhone: ${form.phone}\nChild Age: ${form.childAge || 'N/A'}\nMessage: ${form.message || 'N/A'}`
        );
        if (window.confirm('There was an issue submitting the form. Click OK to open your email client instead.')) {
          window.location.href = mailtoUrl;
        }
      }
    } catch {
      alert('Something went wrong. Please email us directly at ' + DAYCARE_RECIPIENT_EMAIL);
    } finally {
      setSubmitting(false);
    }
  };

  const inputCls = 'w-full px-4 py-3 rounded-xl border-2 border-orange-100 focus:border-orange-400 focus:outline-none transition-colors bg-white text-sm';
  const labelCls = 'block text-xs text-gray-500 mb-1.5';

  return (
    <div className="flex flex-col h-full">
      {/* Panel header */}
      <div className="bg-gradient-to-br from-orange-50 via-yellow-50 to-teal-50 px-7 pt-8 pb-6 rounded-t-2xl border-b border-orange-100">
        <div className="flex items-center gap-2 mb-1">
          <DaycareLogo className="h-8 w-auto" />
          <span className="inline-block px-2.5 py-0.5 rounded-full bg-orange-100 text-orange-700 text-xs font-bold uppercase tracking-wide">For Parents</span>
        </div>
        <h2 className="text-gray-900 mb-1" style={{ fontSize: '1.35rem', fontWeight: 700 }}>Early Years Daycare</h2>
        <p className="text-sm text-gray-500">Book a tour or ask about enrollment for your child.</p>
        <div className="flex flex-wrap gap-3 mt-4 text-xs text-gray-500">
          <a href="tel:+20226153903" className="flex items-center gap-1 hover:text-orange-600 transition-colors">
            <Phone className="w-3.5 h-3.5" /> (+202) 02-2615-3903
          </a>
          <a href="mailto:info@theearlyyearscompany.com" className="flex items-center gap-1 hover:text-orange-600 transition-colors">
            <Mail className="w-3.5 h-3.5" /> info@theearlyyearscompany.com
          </a>
        </div>
      </div>

      {/* Form body */}
      <div className="flex-1 px-7 py-6">
        <AnimatePresence mode="wait">
          {done ? (
            <SuccessBanner
              message="Thank you! Your enquiry has been sent to the Early Years team."
              steps={[
                'You\'ll receive a confirmation email shortly.',
                'A member of our team will call or email you within 24 hours.',
                'We\'ll arrange a tour of our AUC New Cairo campus at a time that suits you.',
              ]}
              onReset={() => { setDone(false); setForm({ name: '', email: '', phone: '', childAge: '', message: '' }); }}
            />
          ) : (
            <motion.form key="form" initial={{ opacity: 0 }} animate={{ opacity: 1 }} onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label htmlFor="split-daycare-name" className={labelCls}>Parent / Guardian Name *</label>
                <input id="split-daycare-name" required name="name" value={form.name} onChange={e => set('name', e.target.value)} className={inputCls} placeholder="Your name" />
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label htmlFor="split-daycare-email" className={labelCls}>Email *</label>
                  <input id="split-daycare-email" required type="email" name="email" value={form.email} onChange={e => set('email', e.target.value)} className={inputCls} placeholder="you@example.com" />
                </div>
                <div>
                  <label htmlFor="split-daycare-phone" className={labelCls}>Phone *</label>
                  <input id="split-daycare-phone" required type="tel" name="phone" value={form.phone} onChange={e => set('phone', e.target.value)} className={inputCls} placeholder="+20 XXX XXX XXXX" />
                </div>
              </div>
              <div>
                <label htmlFor="split-daycare-age" className={labelCls}>Child's Age</label>
                <input id="split-daycare-age" name="child_age" value={form.childAge} onChange={e => set('childAge', e.target.value)} className={inputCls} placeholder="e.g. 2 years, 18 months" />
              </div>
              <div>
                <label htmlFor="split-daycare-message" className={labelCls}>Message or Questions</label>
                <textarea id="split-daycare-message" name="message" rows={4} value={form.message} onChange={e => set('message', e.target.value)} className={`${inputCls} resize-none`} placeholder="Tell us about your child or anything you'd like to know…" />
              </div>
              <button
                type="submit"
                disabled={submitting}
                className="w-full flex items-center justify-center gap-2 py-3.5 rounded-xl bg-gradient-to-r from-orange-400 via-coral-500 to-pink-500 text-white font-bold shadow-lg hover:shadow-xl transition-all active:scale-95 disabled:opacity-70"
              >
                {submitting ? <Spinner /> : <><Send className="w-4 h-4" /> Send to Early Years</>}
              </button>
              <p className="text-xs text-gray-600 text-center">We'll confirm within 24 hours.</p>
            </motion.form>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}

/* ════════════════════════════════════════════════════════════
   EDUHUB PANEL
════════════════════════════════════════════════════════════ */
function EduHubPanel() {
  const [form, setForm] = useState({ name: '', email: '', phone: '', qualification: '', message: '' });
  const [submitting, setSubmitting] = useState(false);
  const [done, setDone] = useState(false);

  const set = (k: string, v: string) => setForm(f => ({ ...f, [k]: v }));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      const payload = {
        subject: `EduHub Enquiry — ${form.name}`,
        name: form.name,
        email: form.email,
        phone: form.phone,
        qualification: form.qualification || 'Not specified',
        message: form.message || 'No message provided',
        submittedAt: new Date().toISOString(),
        source: 'Split Contact — EduHub',
      };
      const receipt = await insertSubmission('eduhub', payload);
      if (receipt.cloudSaved) {
        setDone(true);
      } else {
        const mailtoUrl = createMailtoLink(
          EDUHUB_RECIPIENT_EMAIL,
          `EduHub Enquiry — ${form.name}`,
          `Name: ${form.name}\nEmail: ${form.email}\nPhone: ${form.phone}\nQualification: ${form.qualification || 'N/A'}\nMessage: ${form.message || 'N/A'}`
        );
        if (window.confirm('There was an issue submitting the form. Click OK to open your email client instead.')) {
          window.location.href = mailtoUrl;
        }
      }
    } catch {
      alert('Something went wrong. Please email us directly at ' + EDUHUB_RECIPIENT_EMAIL);
    } finally {
      setSubmitting(false);
    }
  };

  const inputCls = 'w-full px-4 py-3 rounded-xl border-2 border-blue-100 focus:border-[#1349D1] focus:outline-none transition-colors bg-white text-sm';
  const labelCls = 'block text-xs text-gray-500 mb-1.5';

  return (
    <div className="flex flex-col h-full">
      {/* Panel header */}
      <div className="bg-gradient-to-br from-blue-700 via-blue-800 to-indigo-900 px-7 pt-8 pb-6 rounded-t-2xl border-b border-blue-700">
        <div className="flex items-center gap-2 mb-1">
          <EduHubLogo variant="white" className="h-8 w-auto" />
          <span className="inline-block px-2.5 py-0.5 rounded-full bg-white/15 text-blue-100 text-xs font-bold uppercase tracking-wide border border-white/20">For Educators</span>
        </div>
        <h2 className="text-white mb-1" style={{ fontSize: '1.35rem', fontWeight: 700 }}>EduHub Training</h2>
        <p className="text-sm text-blue-200">Register your interest in CACHE-accredited qualifications.</p>
        <div className="flex flex-wrap gap-3 mt-4 text-xs text-blue-200">
          <a href="tel:+201115004090" className="flex items-center gap-1 hover:text-white transition-colors">
            <Phone className="w-3.5 h-3.5" /> +20 111 500 4090
          </a>
          <a href="mailto:eduhub@theearlyyearscompany.com" className="flex items-center gap-1 hover:text-white transition-colors">
            <Mail className="w-3.5 h-3.5" /> eduhub@theearlyyearscompany.com
          </a>
        </div>
      </div>

      {/* Form body */}
      <div className="flex-1 px-7 py-6">
        <AnimatePresence mode="wait">
          {done ? (
            <SuccessBanner
              message="Thank you! Your registration of interest has been sent to the EduHub team."
              steps={[
                'You\'ll receive a confirmation email within a few minutes.',
                'An EduHub advisor will contact you within 24–48 hours.',
                'They\'ll share program dates, fees, and entry requirements for your chosen level.',
              ]}
              onReset={() => { setDone(false); setForm({ name: '', email: '', phone: '', qualification: '', message: '' }); }}
            />
          ) : (
            <motion.form key="form" initial={{ opacity: 0 }} animate={{ opacity: 1 }} onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label htmlFor="split-eduhub-name" className={labelCls}>Full Name *</label>
                <input id="split-eduhub-name" required name="name" value={form.name} onChange={e => set('name', e.target.value)} className={inputCls} placeholder="Your full name" />
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label htmlFor="split-eduhub-email" className={labelCls}>Email *</label>
                  <input id="split-eduhub-email" required type="email" name="email" value={form.email} onChange={e => set('email', e.target.value)} className={inputCls} placeholder="you@example.com" />
                </div>
                <div>
                  <label htmlFor="split-eduhub-phone" className={labelCls}>Phone *</label>
                  <input id="split-eduhub-phone" required type="tel" name="phone" value={form.phone} onChange={e => set('phone', e.target.value)} className={inputCls} placeholder="+20 XXX XXX XXXX" />
                </div>
              </div>
              <div>
                <label htmlFor="split-eduhub-qualification" className={labelCls}>Interested Program</label>
                <select id="split-eduhub-qualification" name="qualification" value={form.qualification} onChange={e => set('qualification', e.target.value)} className={inputCls}>
                  <option value="">Select a program (optional)</option>
                  <option value="level-2">CACHE Level 2 — Caring for Children</option>
                  <option value="level-3">CACHE Level 3 — Early Years Workforce</option>
                  <option value="level-5">CACHE Level 5 — Early Years Leadership</option>
                  <option value="undecided">Not sure yet / Need guidance</option>
                </select>
              </div>
              <div>
                <label htmlFor="split-eduhub-message" className={labelCls}>Message or Questions</label>
                <textarea id="split-eduhub-message" name="message" rows={4} value={form.message} onChange={e => set('message', e.target.value)} className={`${inputCls} resize-none`} placeholder="Tell us about your background or what you'd like to know…" />
              </div>
              <button
                type="submit"
                disabled={submitting}
                className="w-full flex items-center justify-center gap-2 py-3.5 rounded-xl bg-[#1349D1] hover:bg-blue-700 text-white font-bold shadow-lg hover:shadow-xl transition-all active:scale-95 disabled:opacity-70"
              >
                {submitting ? <Spinner /> : <><Send className="w-4 h-4" /> Send to EduHub</>}
              </button>
              <p className="text-xs text-gray-600 text-center">We'll respond within 24–48 hours.</p>
            </motion.form>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}

/* ════════════════════════════════════════════════════════════
   PAGE
════════════════════════════════════════════════════════════ */
export default function ContactSplit() {
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">

      {/* ── Top bar ── */}
      <header className="bg-white border-b border-gray-100 px-5 sm:px-8 py-4 flex items-center justify-between sticky top-0 z-40 shadow-sm">
        <Link
          to="/"
          className="inline-flex items-center gap-2 text-sm text-gray-600 font-semibold hover:text-gray-900 transition-colors group"
        >
          <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
          Back to Home
        </Link>
        <DaycareLogo company className="h-10 w-auto" />
        <div className="w-24" /> {/* spacer for balance */}
      </header>

      <main>

      {/* ── Intro ── */}
      <div className="text-center pt-10 pb-8 px-4">
        <motion.p
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-xs font-bold uppercase tracking-widest text-gray-600 mb-2"
        >
          Get in Touch
        </motion.p>
        <motion.h1
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.08 }}
          className="text-gray-900 mb-2"
          style={{ fontSize: 'clamp(1.6rem, 4vw, 2.4rem)', fontWeight: 800 }}
        >
          Who would you like to reach?
        </motion.h1>
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.18 }}
          className="text-sm text-gray-500 max-w-sm mx-auto"
        >
          Fill in the form on the side that matches your enquiry — or both!
        </motion.p>
      </div>

      {/* ── Split panels ── */}
      <div className="flex-1 max-w-6xl mx-auto w-full px-4 sm:px-6 pb-16">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="grid md:grid-cols-2 gap-5 lg:gap-6 items-start"
        >
          {/* Daycare card */}
          <div className="bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden flex flex-col">
            <DaycarePanel />
          </div>

          {/* Divider on mobile */}
          <div className="md:hidden flex items-center gap-3">
            <div className="flex-1 h-px bg-gray-200" />
            <span className="text-xs text-gray-600 font-semibold">OR</span>
            <div className="flex-1 h-px bg-gray-200" />
          </div>

          {/* Vertical divider on desktop — rendered via CSS grid gap, plus a subtle line */}
          <div className="bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden flex flex-col">
            <EduHubPanel />
          </div>
        </motion.div>
      </div>
      </main>

      {/* ── Footer strip ── */}
      <footer className="border-t border-gray-100 py-5 text-center">
        <p className="text-xs text-gray-600">
          © 2026 Early Years Company · <a href="mailto:info@theearlyyearscompany.com" className="hover:text-gray-600 transition-colors">info@theearlyyearscompany.com</a>
        </p>
      </footer>
    </div>
  );
}

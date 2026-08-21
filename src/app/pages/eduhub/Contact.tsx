import { motion } from 'motion/react';
import { Mail, Phone, Send, BookOpen, Award, AlertTriangle, CheckCircle2 } from 'lucide-react';
import EduHubNav from '../../components/EduHubNav';
import EduHubFooter from '../../components/EduHubFooter';
import { useState } from 'react';
import { useCMS } from '../../hooks/useCMS';
import { useSEO } from '../../hooks/useSEO';
import { postToWebhook } from '../../utils/emailService';
import { insertSubmission } from '../../data/cms';

export default function EduHubContact() {
  const cms = useCMS();
  const s = cms.siteSettings;
  const fs = cms.formSettings;
  useSEO('eduhub', { title: 'Register Interest — EduHub | Early Years Company', description: 'Register your interest in CACHE Level 2, 3 or 5 qualifications at EduHub by Early Years Company in Cairo, Egypt.' }, cms);

  const [formData, setFormData] = useState({
    name: '', email: '', phone: '', qualification: '', experience: '', institution: '', message: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const [errorMsg, setErrorMsg] = useState('');

  const recipientEmail = fs.eduhubEmail || s.eduhubEmail || 'eduhub@theearlyyearscompany.com';

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitStatus('idle');
    setErrorMsg('');

    const payload = {
      source: 'EduHub',
      subject: `New EduHub Interest Form — ${formData.name}`,
      destinationEmail: recipientEmail,
      name: formData.name,
      email: formData.email,
      phone: formData.phone,
      qualification: formData.qualification,
      experience: formData.experience || '',
      institution: formData.institution || '',
      message: formData.message || 'No message provided',
      submittedAt: new Date().toISOString(),
    };

    try {
      // 1. Always save to Supabase
      const receipt = await insertSubmission('eduhub', payload);
      let delivered = receipt.cloudSaved;

      // 2. If webhook configured, POST there too
      if (fs.emailEndpointEnabled && fs.eduhubEndpoint) {
        const webhook = await postToWebhook(fs.eduhubEndpoint, payload);
        delivered ||= webhook.success;
      }

      if (!delivered) throw new Error(receipt.error || 'No delivery channel accepted the registration.');

      setSubmitStatus('success');
      setFormData({ name: '', email: '', phone: '', qualification: '', experience: '', institution: '', message: '' });
    } catch (err) {
      console.error('EduHub form error:', err);
      setErrorMsg('Your details were kept safely on this device, but could not be delivered. Please try again or contact us directly.');
      setSubmitStatus('error');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-white">
      <EduHubNav />

      <main>

      {/* Hero */}
      <div className="relative overflow-hidden bg-gradient-to-br from-blue-50 to-indigo-50 py-20 lg:py-32">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }} className="text-center max-w-4xl mx-auto">
            <h1 className="text-5xl lg:text-6xl text-gray-900 mb-6">Register Your Interest</h1>
            <p className="text-xl text-gray-600 leading-relaxed">
              Begin your journey toward UK-accredited CACHE qualifications. Contact us to learn more about enrolment and programme details.
            </p>
          </motion.div>
        </div>
      </div>

      {/* Contact Info & Form */}
      <div className="py-20 lg:py-28">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12">
            {/* Contact Information */}
            <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.6 }}>
              <h2 className="text-4xl text-gray-900 mb-8">Get in Touch with EduHub</h2>

              <div className="space-y-6 mb-12">
                {recipientEmail && (
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 rounded-full bg-[#1349D1] flex items-center justify-center flex-shrink-0">
                      <Mail className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <div className="text-sm text-gray-500 mb-1">Email</div>
                      <a href={`mailto:${recipientEmail}`} className="text-lg text-gray-900 hover:text-[#1349D1] transition-colors">{recipientEmail}</a>
                    </div>
                  </div>
                )}
                {s.eduhubPhone && (
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 rounded-full bg-[#1349D1] flex items-center justify-center flex-shrink-0">
                      <Phone className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <div className="text-sm text-gray-500 mb-1">Phone</div>
                      <a href={`tel:${s.eduhubPhone.replace(/\s/g, '')}`} className="text-lg text-gray-900 hover:text-[#1349D1] transition-colors">{s.eduhubPhone}</a>
                    </div>
                  </div>
                )}
                {s.whatsapp && (
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 rounded-full bg-green-500 flex items-center justify-center flex-shrink-0">
                      <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 24 24"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" /></svg>
                    </div>
                    <div>
                      <div className="text-sm text-gray-500 mb-1">WhatsApp</div>
                      <a href={`https://wa.me/${s.whatsapp.replace(/\D/g, '')}`} target="_blank" rel="noopener noreferrer" className="text-lg text-gray-900 hover:text-green-600 transition-colors">{s.whatsapp}</a>
                    </div>
                  </div>
                )}
              </div>

              <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-2xl p-8 mb-8">
                <div className="flex items-center gap-3 mb-4">
                  <Award className="w-8 h-8 text-[#1349D1]" />
                  <h3 className="text-2xl text-gray-900">Why Choose EduHub?</h3>
                </div>
                <div className="space-y-3 text-gray-700">
                  {['First CACHE-approved centre in Egypt', 'UK-accredited CACHE qualifications', 'Supported by NCFE UK and BriteThink UK', 'Hybrid learning (in-person & online)', 'Expert trainers and assessors', 'Workplace-based assessment'].map((point, i) => (
                    <div key={i} className="flex items-start gap-2">
                      <div className="w-1.5 h-1.5 rounded-full bg-[#1349D1] mt-2 flex-shrink-0" />
                      <span>{point}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="bg-white border-2 border-gray-100 rounded-2xl p-8">
                <div className="flex items-center gap-3 mb-4">
                  <BookOpen className="w-8 h-8 text-[#1349D1]" />
                  <h3 className="text-2xl text-gray-900">Available Programmes</h3>
                </div>
                <div className="space-y-4">
                  {[
                    { level: 'CACHE Level 2', title: 'Caring for Children and Young People' },
                    { level: 'CACHE Level 3', title: 'Diploma for Early Years Workforce' },
                    { level: 'CACHE Level 5', title: 'Diploma for Early Years Leadership' },
                  ].map((c, i) => (
                    <div key={i}>
                      <div className="text-[#1349D1] mb-1">{c.level}</div>
                      <div className="text-sm text-gray-600">{c.title}</div>
                      <div className="text-xs text-green-700 mt-1">Available</div>
                    </div>
                  ))}
                </div>
              </div>
            </motion.div>

            {/* Registration Form */}
            <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.6, delay: 0.2 }}>
              <div className="bg-white rounded-2xl border-2 border-gray-100 shadow-lg p-8">
                <h2 className="text-3xl text-gray-900 mb-6">Register Your Interest</h2>

                {submitStatus === 'success' && (
                  <div className="mb-5 flex items-start gap-2 px-4 py-3 bg-green-50 border border-green-200 rounded-xl">
                    <CheckCircle2 className="w-4 h-4 text-green-600 flex-shrink-0 mt-0.5" />
                    <p className="text-green-800 text-sm leading-relaxed">{fs.eduhubThankyou || "Thank you! We'll be in touch within 24–48 hours with programme details and next steps."}</p>
                  </div>
                )}

                {submitStatus === 'error' && (
                  <div className="mb-5 flex items-start gap-2 px-4 py-3 bg-red-50 border border-red-200 rounded-xl">
                    <AlertTriangle className="w-4 h-4 text-red-600 flex-shrink-0 mt-0.5" />
                    <p className="text-red-800 text-sm">{errorMsg || 'Something went wrong. Please try again or contact us directly.'}</p>
                  </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-5">
                  {[
                    { id: 'name', label: 'Full Name *', type: 'text', required: true, placeholder: 'Your full name', value: formData.name, onChange: (v: string) => setFormData({ ...formData, name: v }) },
                    { id: 'email', label: 'Email Address *', type: 'email', required: true, placeholder: 'your.email@example.com', value: formData.email, onChange: (v: string) => setFormData({ ...formData, email: v }) },
                    { id: 'phone', label: 'Phone Number *', type: 'tel', required: true, placeholder: '+20 XXX XXX XXXX', value: formData.phone, onChange: (v: string) => setFormData({ ...formData, phone: v }) },
                    { id: 'experience', label: 'Years of Experience in Early Years', type: 'text', required: false, placeholder: 'e.g. 3 years', value: formData.experience, onChange: (v: string) => setFormData({ ...formData, experience: v }) },
                    { id: 'institution', label: 'Current Institution/School (if applicable)', type: 'text', required: false, placeholder: 'School or nursery name', value: formData.institution, onChange: (v: string) => setFormData({ ...formData, institution: v }) },
                  ].map(field => (
                    <div key={field.id}>
                      <label htmlFor={field.id} className="block text-sm text-gray-700 mb-2">{field.label}</label>
                      <input type={field.type} id={field.id} required={field.required} value={field.value} onChange={e => field.onChange(e.target.value)}
                        className="w-full px-4 py-3 rounded-lg border-2 border-gray-200 focus:border-[#1349D1] focus:outline-none transition-colors"
                        placeholder={field.placeholder} />
                    </div>
                  ))}

                  <div>
                    <label htmlFor="qualification" className="block text-sm text-gray-700 mb-2">Interested in Which Qualification? *</label>
                    <select id="qualification" required value={formData.qualification} onChange={e => setFormData({ ...formData, qualification: e.target.value })}
                      className="w-full px-4 py-3 rounded-lg border-2 border-gray-200 focus:border-[#1349D1] focus:outline-none transition-colors">
                      <option value="">Select a programme</option>
                      <option value="level-2">CACHE Level 2 — Caring for Children and Young People</option>
                      <option value="level-3">CACHE Level 3 — Diploma for Early Years Workforce</option>
                      <option value="level-5">CACHE Level 5 — Diploma for Early Years Leadership</option>
                      <option value="undecided">Undecided / Need guidance</option>
                    </select>
                  </div>

                  <div>
                    <label htmlFor="message" className="block text-sm text-gray-700 mb-2">Additional Information or Questions</label>
                    <textarea id="message" rows={4} value={formData.message} onChange={e => setFormData({ ...formData, message: e.target.value })}
                      className="w-full px-4 py-3 rounded-lg border-2 border-gray-200 focus:border-[#1349D1] focus:outline-none transition-colors resize-none"
                      placeholder="Tell us about your goals, background, or any questions you have…" />
                  </div>

                  <button type="submit" disabled={isSubmitting}
                    className="w-full px-8 py-4 rounded-lg bg-[#1349D1] text-white hover:bg-blue-700 transition-all flex items-center justify-center gap-2 disabled:opacity-60">
                    {isSubmitting
                      ? <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.928l3-2.647z"/></svg>
                      : <><Send className="w-5 h-5" /> Submit Registration</>
                    }
                  </button>
                  <p className="text-sm text-gray-500 text-center">We'll respond within 24–48 hours with programme details and next steps.</p>
                </form>
              </div>
            </motion.div>
          </div>
        </div>
      </div>

      {/* What Happens Next */}
      <div className="py-20 lg:py-28 bg-gray-50">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.6 }} className="text-center mb-12">
            <h2 className="text-4xl text-gray-900 mb-4">What Happens After You Register?</h2>
            <p className="text-xl text-gray-600">Here's what to expect next</p>
          </motion.div>

          <div className="grid md:grid-cols-4 gap-6">
            {[
              { step: '01', title: 'We Contact You', description: 'Our team reaches out within 24–48 hours to discuss your background and goals.' },
              { step: '02', title: 'We Recommend a Level', description: 'We match you with the right CACHE level based on your experience and entry requirements.' },
              { step: '03', title: 'Schedule & Fees', description: 'You receive the full cohort schedule, fees, and all enrolment details.' },
              { step: '04', title: 'You Begin Enrolment', description: 'Complete your enrolment paperwork and start your CACHE qualification journey.' },
            ].map((item, i) => (
              <motion.div key={i} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.5, delay: i * 0.1 }} className="bg-white rounded-2xl p-6 text-center shadow-lg">
                <div className="w-14 h-14 rounded-full bg-[#1349D1] flex items-center justify-center mx-auto mb-4 text-white font-bold text-lg">{item.step}</div>
                <h3 className="text-lg font-bold text-gray-900 mb-2">{item.title}</h3>
                <p className="text-gray-600 text-sm leading-relaxed">{item.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </div>

      </main>
      <EduHubFooter />
    </div>
  );
}

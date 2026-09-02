import { motion } from "motion/react";
import {
  Mail,
  Phone,
  MapPin,
  Clock,
  Calendar,
  Send,
  CheckCircle2,
  AlertTriangle,
} from "lucide-react";
import DaycareNav from "../../components/DaycareNav";
import DaycareFooter from "../../components/DaycareFooter";
import { useState } from "react";
import { postToWebhook, DAYCARE_RECIPIENT_EMAIL } from '../../utils/emailService';
import { insertSubmission } from '../../data/cms';
import { useCMS } from '../../hooks/useCMS';

export default function DaycareContact() {
  const cms = useCMS();
  const s = cms.siteSettings;
  const fs = cms.formSettings;
  const recipientEmail = fs.daycareEmail || s.daycareEmail || 'info@theearlyyearscompany.com';

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    childAge: "",
    tourDate: "",
    message: "",
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const [errorMsg, setErrorMsg] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitStatus('idle');
    setErrorMsg('');

    const payload = {
      source: 'Daycare',
      subject: `New Daycare Tour Booking — ${formData.name}`,
      destinationEmail: recipientEmail,
      name: formData.name,
      email: formData.email,
      phone: formData.phone,
      childAge: formData.childAge,
      tourDate: formData.tourDate,
      message: formData.message || 'No message provided',
      submittedAt: new Date().toISOString(),
    };

    try {
      // 1. Always save to Supabase
      const receipt = await insertSubmission('daycare', payload);
      let delivered = receipt.cloudSaved;

      // 2. If webhook configured, POST there too
      if (fs.emailEndpointEnabled && fs.daycareEndpoint) {
        const webhook = await postToWebhook(fs.daycareEndpoint, payload);
        delivered ||= webhook.success;
      }

      if (!delivered) throw new Error(receipt.error || 'No delivery channel accepted the enquiry.');

      setSubmitStatus('success');
      setFormData({ name: "", email: "", phone: "", childAge: "", tourDate: "", message: "" });
    } catch (err) {
      console.error('Daycare form error:', err);
      setErrorMsg('Your details were kept safely on this device, but could not be delivered. Please try again or call us directly.');
      setSubmitStatus('error');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="daycare-site min-h-screen bg-white">
      <DaycareNav />

      <main>

      {/* Hero */}
      <div className="relative overflow-hidden bg-gradient-to-br from-orange-50 via-yellow-50 to-teal-50 py-16 sm:py-20 lg:py-32">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center max-w-4xl mx-auto"
          >
            <h1 className="text-3xl sm:text-4xl lg:text-6xl text-gray-900 mb-4 sm:mb-6 font-bold">
              Get in Touch
            </h1>
            <p className="text-base sm:text-lg md:text-xl text-gray-600 leading-relaxed px-4">
              Book a tour, ask questions, or learn more about
              enrolment. We're here to help you find the
              perfect childcare solution.
            </p>
          </motion.div>
        </div>
      </div>

      {/* Contact Info & Form */}
      <div className="py-20 lg:py-28">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12">
            {/* Contact Information */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              <h2 className="text-4xl text-gray-900 mb-8">
                Contact Information
              </h2>

              <div className="space-y-6 mb-12">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-full bg-gradient-to-br from-orange-400 to-coral-500 flex items-center justify-center flex-shrink-0">
                    <Mail className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <div className="text-sm text-gray-500 mb-1">
                      Email
                    </div>
                    <a
                      href={`mailto:${DAYCARE_RECIPIENT_EMAIL}`}
                      className="text-lg text-gray-900 hover:text-orange-500 transition-colors"
                    >
                      {DAYCARE_RECIPIENT_EMAIL}
                    </a>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-full bg-gradient-to-br from-pink-400 to-orange-400 flex items-center justify-center flex-shrink-0">
                    <Phone className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <div className="text-sm text-gray-500 mb-1">
                      Phone
                    </div>
                    <div className="space-y-1">
                      {s.daycarePhone && (
                        <a
                          href={`tel:${s.daycarePhone.replace(/\s/g, '')}`}
                          className="block text-lg text-gray-900 hover:text-orange-500 transition-colors"
                        >
                          {s.daycarePhone}
                        </a>
                      )}
                      {s.mainPhone && s.mainPhone !== s.daycarePhone && (
                        <a
                          href={`tel:${s.mainPhone.replace(/\s/g, '')}`}
                          className="block text-lg text-gray-900 hover:text-orange-500 transition-colors"
                        >
                          {s.mainPhone}
                        </a>
                      )}
                    </div>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-full bg-gradient-to-br from-teal-400 to-blue-400 flex items-center justify-center flex-shrink-0">
                    <MapPin className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <div className="text-sm text-gray-500 mb-1">
                      Location
                    </div>
                    <div className="text-lg text-gray-900">
                      {s.address || 'AUC New Cairo, Cairo, Egypt'}
                    </div>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-full bg-gradient-to-br from-yellow-400 to-orange-400 flex items-center justify-center flex-shrink-0">
                    <Clock className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <div className="text-sm text-gray-500 mb-1">
                      Tour Hours
                    </div>
                    <div className="text-lg text-gray-900">
                      10:30 AM - 12:00 PM
                      <br />
                      <span className="text-sm text-gray-600">
                        (Book 1 day in advance)
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-gradient-to-br from-orange-50 to-yellow-50 rounded-3xl p-8">
                <h3 className="text-2xl text-gray-900 mb-4">
                  Book a Tour
                </h3>
                <p className="text-gray-600 leading-relaxed mb-4">
                  We welcome you to visit our facility and see
                  our EYFS curriculum in action. Tours are
                  available Monday through Friday between 10:30
                  AM and 12:00 PM.
                </p>
                <div className="flex items-start gap-3 text-gray-700">
                  <Calendar className="w-5 h-5 text-orange-500 flex-shrink-0 mt-1" />
                  <span className="text-sm">
                    Please book at least 1 day in advance to
                    ensure availability
                  </span>
                </div>
              </div>
            </motion.div>

            {/* Contact Form */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              <div className="bg-white rounded-3xl border-2 border-gray-100 shadow-lg p-8">
                <h2 className="text-3xl text-gray-900 mb-6">
                  Request a Tour
                </h2>
                {submitStatus === 'success' && (
                  <div className="mb-5 flex items-start gap-2 px-4 py-3 bg-green-50 border border-green-200 rounded-xl">
                    <CheckCircle2 className="w-4 h-4 text-green-600 flex-shrink-0 mt-0.5" />
                    <p className="text-green-800 text-sm leading-relaxed">{fs.daycareThankyou || "Thank you! Your tour booking has been submitted. We'll contact you shortly to confirm your visit."}</p>
                  </div>
                )}
                {submitStatus === 'error' && (
                  <div className="mb-5 flex items-start gap-2 px-4 py-3 bg-red-50 border border-red-200 rounded-xl">
                    <AlertTriangle className="w-4 h-4 text-red-600 flex-shrink-0 mt-0.5" />
                    <p className="text-red-800 text-sm">{errorMsg || 'Something went wrong. Please try again or call us directly.'}</p>
                  </div>
                )}
                <form
                  onSubmit={handleSubmit}
                  className="space-y-6"
                >
                  <div>
                    <label
                      htmlFor="name"
                      className="block text-sm text-gray-700 mb-2"
                    >
                      Parent/Guardian Name *
                    </label>
                    <input
                      type="text"
                      id="name"
                      required
                      value={formData.name}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          name: e.target.value,
                        })
                      }
                      className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-orange-400 focus:outline-none transition-colors"
                      placeholder="Your name"
                    />
                  </div>

                  <div>
                    <label
                      htmlFor="email"
                      className="block text-sm text-gray-700 mb-2"
                    >
                      Email Address *
                    </label>
                    <input
                      type="email"
                      id="email"
                      required
                      value={formData.email}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          email: e.target.value,
                        })
                      }
                      className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-orange-400 focus:outline-none transition-colors"
                      placeholder="your.email@example.com"
                    />
                  </div>

                  <div>
                    <label
                      htmlFor="phone"
                      className="block text-sm text-gray-700 mb-2"
                    >
                      Phone Number *
                    </label>
                    <input
                      type="tel"
                      id="phone"
                      required
                      value={formData.phone}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          phone: e.target.value,
                        })
                      }
                      className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-orange-400 focus:outline-none transition-colors"
                      placeholder="+20 XXX XXX XXXX"
                    />
                  </div>

                  <div>
                    <label
                      htmlFor="childAge"
                      className="block text-sm text-gray-700 mb-2"
                    >
                      Child's Age
                    </label>
                    <input
                      type="text"
                      id="childAge"
                      value={formData.childAge}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          childAge: e.target.value,
                        })
                      }
                      className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-orange-400 focus:outline-none transition-colors"
                      placeholder="e.g., 2 years, 18 months"
                    />
                  </div>

                  <div>
                    <label
                      htmlFor="tourDate"
                      className="block text-sm text-gray-700 mb-2"
                    >
                      Preferred Tour Date
                    </label>
                    <input
                      type="date"
                      id="tourDate"
                      value={formData.tourDate}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          tourDate: e.target.value,
                        })
                      }
                      className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-orange-400 focus:outline-none transition-colors"
                    />
                  </div>

                  <div>
                    <label
                      htmlFor="message"
                      className="block text-sm text-gray-700 mb-2"
                    >
                      Message or Questions
                    </label>
                    <textarea
                      id="message"
                      rows={4}
                      value={formData.message}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          message: e.target.value,
                        })
                      }
                      className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-orange-400 focus:outline-none transition-colors resize-none"
                      placeholder="Tell us about your child or any questions you have..."
                    ></textarea>
                  </div>

                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full px-8 py-4 rounded-full bg-gradient-to-r from-orange-400 to-coral-500 text-white hover:shadow-xl transition-all flex items-center justify-center gap-2 disabled:opacity-70"
                  >
                    {isSubmitting ? (
                      <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                    ) : (
                      <>
                        <Send className="w-5 h-5" />
                        Request Tour
                      </>
                    )}
                  </button>

                  <p className="text-sm text-gray-700 text-center">
                    We'll confirm your tour within 24 hours
                  </p>
                </form>
              </div>
            </motion.div>
          </div>
        </div>
      </div>

      {/* What Happens After You Book */}
      <div className="py-16 lg:py-20 bg-gray-50">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.6 }} className="text-center mb-10">
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-3">What Happens After You Book?</h2>
            <p className="text-lg text-gray-600">Here's what to expect — simple and stress-free</p>
          </motion.div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {[
              { step: '01', emoji: '📅', title: 'We Confirm Your Visit', desc: 'Our team contacts you within 24 hours to confirm the date and let you know what to bring.' },
              { step: '02', emoji: '🏫', title: 'You Tour the Campus', desc: 'Meet the team, see the classrooms, and watch the curriculum in action — no pressure, just a genuine look.' },
              { step: '03', emoji: '💬', title: 'We Recommend a Class', desc: "Based on your child's age and needs, we'll suggest the right programme and answer your questions honestly." },
              { step: '04', emoji: '📋', title: 'You Receive Enrolment Steps', desc: "If you're ready, we share everything you need to enrol — paperwork, fees, and next available places." },
            ].map((item, i) => (
              <motion.div key={i} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.5, delay: i * 0.1 }} className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 text-center">
                <div className="text-3xl mb-3">{item.emoji}</div>
                <div className="text-xs font-bold text-orange-500 mb-1 tracking-wide">{item.step}</div>
                <h3 className="font-bold text-gray-900 mb-2 text-sm">{item.title}</h3>
                <p className="text-xs text-gray-600 leading-relaxed">{item.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </div>

      {/* Map Section */}
      <div className="py-20 lg:py-28 bg-gradient-to-br from-orange-50 via-yellow-50 to-teal-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center mb-12"
          >
            <h2 className="text-4xl text-gray-900 mb-6">
              Find Us
            </h2>
            <p className="text-xl text-gray-600">
              {s.address || 'Located at AUC New Cairo campus'}
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="bg-white rounded-3xl overflow-hidden shadow-lg"
          >
            <div className="aspect-video bg-gray-100 flex items-center justify-center">
              <div className="text-center p-8">
                <MapPin className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-600">
                  {s.address || 'AUC New Cairo, Cairo, Egypt'}
                </p>
                {(s.googleMapsLink || 'https://maps.app.goo.gl/JYf4tcxn6CyofMWU6') && (
                  <a
                    href={s.googleMapsLink || 'https://maps.app.goo.gl/JYf4tcxn6CyofMWU6'}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-block mt-4 px-6 py-2 rounded-full bg-gray-100 text-gray-700 hover:bg-gray-200 transition-colors"
                  >
                    Open in Google Maps
                  </a>
                )}
              </div>
            </div>
          </motion.div>
        </div>
      </div>

      </main>
      <DaycareFooter />
    </div>
  );
}

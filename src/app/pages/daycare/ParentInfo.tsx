import { motion } from 'motion/react';
import { FileText, Heart, Shield, Users, Clock, Utensils, Shirt, AlertCircle } from 'lucide-react';
import { Link } from 'react-router';
import DaycareNav from '../../components/DaycareNav';
import DaycareFooter from '../../components/DaycareFooter';
import { useState } from 'react';

export default function DaycareParentInfo() {
  const [openSection, setOpenSection] = useState<string | null>('partnership');

  const sections = [
    {
      id: 'partnership',
      title: 'Parent Partnership',
      icon: Users,
      color: 'from-orange-400 to-coral-500',
      content: (
        <div className="space-y-4">
          <p className="text-gray-700 leading-relaxed">
            At Early Years Daycare, we emphasize parents and teachers working in partnership. We believe that strong communication and collaboration between home and daycare create the best outcomes for children.
          </p>
          <div className="bg-orange-50 rounded-2xl p-6">
            <h3 className="text-lg text-gray-900 mb-3">How We Communicate</h3>
            <ul className="space-y-2 text-gray-700">
              <li className="flex items-start gap-2">
                <div className="w-2 h-2 rounded-full bg-orange-400 mt-2 flex-shrink-0"></div>
                <span>Daily updates on your child's activities, meals, and development</span>
              </li>
              <li className="flex items-start gap-2">
                <div className="w-2 h-2 rounded-full bg-orange-400 mt-2 flex-shrink-0"></div>
                <span>Weekly plans and thematic newsletters</span>
              </li>
              <li className="flex items-start gap-2">
                <div className="w-2 h-2 rounded-full bg-orange-400 mt-2 flex-shrink-0"></div>
                <span>Regular parent-teacher meetings and progress updates</span>
              </li>
              <li className="flex items-start gap-2">
                <div className="w-2 h-2 rounded-full bg-orange-400 mt-2 flex-shrink-0"></div>
                <span>Open door policy for questions and concerns</span>
              </li>
            </ul>
          </div>
        </div>
      )
    },
    {
      id: 'routine',
      title: 'Daily Routine',
      icon: Clock,
      color: 'from-pink-400 to-orange-400',
      content: (
        <div className="space-y-4">
          <p className="text-gray-700 leading-relaxed">
            Our daily routines run from 8:15 AM to 4:00 PM, Monday through Friday. We follow a structured yet flexible schedule that balances learning, play, meals, and rest.
          </p>
          <div className="bg-pink-50 rounded-2xl p-6">
            <h3 className="text-lg text-gray-900 mb-4">Typical Day Schedule</h3>
            <div className="space-y-3">
              {[
                { time: '8:15 AM', activity: 'Arrival & Settling' },
                { time: '9:00 AM', activity: 'Circle Time & Group Learning' },
                { time: '10:00 AM', activity: 'Guided Activities (EYFS)' },
                { time: '11:30 AM', activity: 'Fresh Cooked Lunch' },
                { time: '12:30 PM', activity: 'Rest & Quiet Time' },
                { time: '2:00 PM', activity: 'Outdoor Play' },
                { time: '3:00 PM', activity: 'Creative Exploration' },
                { time: '4:00 PM', activity: 'Pick-Up Time' }
              ].map((item, index) => (
                <div key={index} className="flex items-center gap-4">
                  <span className="text-sm text-gray-600 w-20">{item.time}</span>
                  <div className="h-px flex-1 bg-gray-200"></div>
                  <span className="text-gray-900">{item.activity}</span>
                </div>
              ))}
            </div>
          </div>
          <div className="bg-yellow-50 rounded-2xl p-6 border-l-4 border-yellow-400">
            <div className="flex items-start gap-3">
              <AlertCircle className="w-6 h-6 text-yellow-700 flex-shrink-0 mt-0.5" />
              <div>
                <h3 className="text-lg text-gray-900 mb-2">Pickup Policy</h3>
                <p className="text-gray-700">
                  Children must be picked up on time at 4:00 PM. Late pickup incurs a penalty fee. Please notify us in advance if you'll be late due to an emergency.
                </p>
              </div>
            </div>
          </div>
        </div>
      )
    },
    {
      id: 'health',
      title: 'Health & Safety',
      icon: Shield,
      color: 'from-teal-400 to-blue-400',
      content: (
        <div className="space-y-4">
          <p className="text-gray-700 leading-relaxed">
            The health and safety of every child is our top priority. We maintain strict health protocols and safety measures to ensure a secure environment.
          </p>
          <div className="grid md:grid-cols-2 gap-6">
            <div className="bg-teal-50 rounded-2xl p-6">
              <h3 className="text-lg text-gray-900 mb-3">Health Checks</h3>
              <ul className="space-y-2 text-gray-700">
                <li className="flex items-start gap-2">
                  <div className="w-2 h-2 rounded-full bg-teal-400 mt-2 flex-shrink-0"></div>
                  <span>Temperature checks at drop-off daily</span>
                </li>
                <li className="flex items-start gap-2">
                  <div className="w-2 h-2 rounded-full bg-teal-400 mt-2 flex-shrink-0"></div>
                  <span>Fortnightly health checks (lice & nails)</span>
                </li>
                <li className="flex items-start gap-2">
                  <div className="w-2 h-2 rounded-full bg-teal-400 mt-2 flex-shrink-0"></div>
                  <span>Regular cleaning and sanitization</span>
                </li>
              </ul>
            </div>
            <div className="bg-blue-50 rounded-2xl p-6">
              <h3 className="text-lg text-gray-900 mb-3">Illness Policy</h3>
              <ul className="space-y-2 text-gray-700">
                <li className="flex items-start gap-2">
                  <div className="w-2 h-2 rounded-full bg-blue-400 mt-2 flex-shrink-0"></div>
                  <span>Children with contagious illness must stay home</span>
                </li>
                <li className="flex items-start gap-2">
                  <div className="w-2 h-2 rounded-full bg-blue-400 mt-2 flex-shrink-0"></div>
                  <span>Medical certificate required to return after illness</span>
                </li>
                <li className="flex items-start gap-2">
                  <div className="w-2 h-2 rounded-full bg-blue-400 mt-2 flex-shrink-0"></div>
                  <span>No medication administered by staff</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      )
    },
    {
      id: 'nutrition',
      title: 'Meals & Nutrition',
      icon: Utensils,
      color: 'from-yellow-400 to-orange-400',
      content: (
        <div className="space-y-4">
          <p className="text-gray-700 leading-relaxed">
            We provide daily freshly cooked warm lunch with balanced nutrients made from seasonal vegetables and fresh ingredients. Our meals are designed to support healthy growth and development.
          </p>
          <div className="bg-yellow-50 rounded-2xl p-6">
            <h3 className="text-lg text-gray-900 mb-3">What We Provide</h3>
            <ul className="space-y-2 text-gray-700">
              <li className="flex items-start gap-2">
                <div className="w-2 h-2 rounded-full bg-yellow-400 mt-2 flex-shrink-0"></div>
                <span>Freshly prepared daily hot lunch</span>
              </li>
              <li className="flex items-start gap-2">
                <div className="w-2 h-2 rounded-full bg-yellow-400 mt-2 flex-shrink-0"></div>
                <span>Seasonal vegetables and fresh ingredients</span>
              </li>
              <li className="flex items-start gap-2">
                <div className="w-2 h-2 rounded-full bg-yellow-400 mt-2 flex-shrink-0"></div>
                <span>Balanced nutritional content</span>
              </li>
              <li className="flex items-start gap-2">
                <div className="w-2 h-2 rounded-full bg-yellow-400 mt-2 flex-shrink-0"></div>
                <span>Accommodations for dietary requirements and allergies</span>
              </li>
              <li className="flex items-start gap-2">
                <div className="w-2 h-2 rounded-full bg-yellow-400 mt-2 flex-shrink-0"></div>
                <span>Promoting healthy eating habits</span>
              </li>
            </ul>
          </div>
        </div>
      )
    },
    {
      id: 'dress',
      title: 'Dress Code & Rules',
      icon: Shirt,
      color: 'from-coral-400 to-pink-400',
      content: (
        <div className="space-y-4">
          <p className="text-gray-700 leading-relaxed">
            Children should wear comfortable, practical clothing suitable for active play and learning activities. Please follow these guidelines to ensure your child's safety and comfort.
          </p>
          <div className="bg-coral-50 rounded-2xl p-6">
            <h3 className="text-lg text-gray-900 mb-3">Clothing Guidelines</h3>
            <div className="space-y-4">
              <div>
                <div className="text-green-700 mb-2">✓ Please Wear:</div>
                <ul className="space-y-1 text-gray-700 ml-6">
                  <li>Comfortable, practical clothing only</li>
                  <li>Easy-to-remove clothing for bathroom independence</li>
                  <li>Closed-toe shoes with secure straps or elastic</li>
                  <li>Weather-appropriate layers</li>
                </ul>
              </div>
              <div>
                <div className="text-red-700 mb-2">✗ Please Avoid:</div>
                <ul className="space-y-1 text-gray-700 ml-6">
                  <li>No slippers or shoes with laces (safety hazard)</li>
                  <li>No jewelry except studs (safety concern)</li>
                  <li>No fancy or expensive clothing (may get messy)</li>
                  <li>No accessories that can be choking hazards</li>
                </ul>
              </div>
            </div>
          </div>
          <div className="bg-orange-50 rounded-2xl p-6 border-l-4 border-orange-400">
            <div className="flex items-start gap-3">
              <AlertCircle className="w-6 h-6 text-orange-700 flex-shrink-0 mt-0.5" />
              <div>
                <h3 className="text-lg text-gray-900 mb-2">Important: Label All Belongings</h3>
                <p className="text-gray-700">
                  Please clearly label all clothing, bags, water bottles, and personal items with your child's name to prevent loss.
                </p>
              </div>
            </div>
          </div>
        </div>
      )
    }
  ];

  return (
    <div className="min-h-screen bg-white">
      <DaycareNav />

      <main>

      {/* Hero */}
      <div className="relative overflow-hidden bg-gradient-to-br from-orange-50 via-yellow-50 to-teal-50 py-20 lg:py-32">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center max-w-4xl mx-auto"
          >
            <h1 className="text-5xl lg:text-6xl text-gray-900 mb-6">
              Parent Information
            </h1>
            <p className="text-xl text-gray-600 leading-relaxed">
              Everything you need to know about our policies, routines, and how we work together to support your child's development.
            </p>
          </motion.div>
        </div>
      </div>

      {/* Accordion Sections */}
      <div className="py-20 lg:py-28">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="space-y-4">
            {sections.map((section, index) => (
              <motion.div
                key={section.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                className="bg-white rounded-2xl border-2 border-gray-100 overflow-hidden shadow-sm hover:shadow-lg transition-all"
              >
                <button
                  onClick={() => setOpenSection(openSection === section.id ? null : section.id)}
                  className="w-full px-8 py-6 flex items-center justify-between text-left hover:bg-gray-50 transition-colors"
                >
                  <div className="flex items-center gap-4">
                    <div className={`w-12 h-12 rounded-full bg-gradient-to-br ${section.color} flex items-center justify-center`}>
                      <section.icon className="w-6 h-6 text-white" />
                    </div>
                    <h2 className="text-2xl text-gray-900">{section.title}</h2>
                  </div>
                  <div className={`transform transition-transform ${openSection === section.id ? 'rotate-180' : ''}`}>
                    <svg className="w-6 h-6 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </div>
                </button>
                {openSection === section.id && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    transition={{ duration: 0.3 }}
                    className="px-8 pb-8 pt-4"
                  >
                    {section.content}
                  </motion.div>
                )}
              </motion.div>
            ))}
          </div>
        </div>
      </div>

      {/* Additional Info */}
      <div className="py-20 lg:py-28 bg-gradient-to-br from-orange-50 via-yellow-50 to-teal-50">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center mb-12"
          >
            <h2 className="text-4xl text-gray-900 mb-6">
              Need More Information?
            </h2>
            <p className="text-xl text-gray-600 mb-8">
              We're here to answer any questions you may have about our policies, programmes, or enrolment process.
            </p>
            <Link
              to="/daycare/contact"
              className="inline-block px-8 py-4 rounded-full bg-gradient-to-r from-orange-400 to-coral-500 text-white hover:shadow-xl transition-all"
            >
              Contact Us
            </Link>
          </motion.div>
        </div>
      </div>

      </main>
      <DaycareFooter />
    </div>
  );
}

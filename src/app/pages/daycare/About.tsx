import { motion } from 'motion/react';
import { Heart, Target, Users, Award, BookOpen, MapPin } from 'lucide-react';
import { Link } from 'react-router';
import DaycareNav from '../../components/DaycareNav';
import DaycareFooter from '../../components/DaycareFooter';
import ManagedImage from '../../components/ManagedImage';

export default function DaycareAbout() {
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
            <h1 className="text-3xl sm:text-4xl lg:text-5xl text-gray-900 mb-4 sm:mb-6 font-bold">
              About Early Years — The Daycare —
            </h1>
            <p className="text-lg sm:text-xl text-gray-600 leading-relaxed px-4">
              25 years of expertise in Early Years education in Egypt, following the EYFS curriculum with a child-centered, play-based approach that nurtures holistic development.
            </p>
          </motion.div>
        </div>
      </div>

      {/* Our Story */}
      <div className="py-20 lg:py-28">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              <div className="inline-block px-4 py-2 rounded-full bg-orange-100 text-orange-700 text-sm mb-6">
                Our Story
              </div>
              <h2 className="text-4xl lg:text-5xl text-gray-900 mb-6">
                25 Years of Excellence in Early Years Education
              </h2>
              <div className="space-y-4 text-lg text-gray-600 leading-relaxed">
                <p>
                  The Early Years Daycare offers 25 years of expertise in Early Years education in Egypt, following the Early Years Foundation Stage (EYFS) curriculum.
                </p>
                <p>
                  We embrace the EYFS framework to foster holistic development through play and exploration. Our mission is to equip children with lifelong learning skills while celebrating their unique nature and learning styles.
                </p>
                <p>
                  Our child-centered, play-based learning environment supports lifelong learning by establishing a strong educational foundation, respecting each child's uniqueness and diverse abilities.
                </p>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="relative"
            >
              <div className="rounded-3xl overflow-hidden shadow-2xl aspect-[4/3]">
                <ManagedImage
                  assetKey="daycare.about.hero"
                  alt="Children playing at Early Years Daycare"
                  className="w-full h-full object-cover"
                />
              </div>
            </motion.div>
          </div>
        </div>
      </div>

      {/* Our Philosophy */}
      <div className="py-20 lg:py-28 bg-gradient-to-br from-orange-50/50 via-yellow-50/50 to-teal-50/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center mb-16"
          >
            <div className="inline-block px-4 py-2 rounded-full bg-orange-100 text-orange-700 text-sm mb-6">
              Our Philosophy
            </div>
            <h2 className="text-4xl lg:text-5xl text-gray-900 mb-6">
              EYFS Curriculum & Child-Centered Learning
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              We support children to develop skills and strategies foundational to learning and lifelong educational success
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              {
                icon: BookOpen,
                title: 'EYFS Framework',
                description: 'Following the Early Years Foundation Stage curriculum with play-based learning approaches',
                color: 'from-orange-400 to-coral-500'
              },
              {
                icon: Heart,
                title: 'Holistic Development',
                description: 'Fostering physical, cognitive, social, and emotional growth in every child',
                color: 'from-pink-400 to-orange-400'
              },
              {
                icon: Users,
                title: 'Child-Centered',
                description: 'Respecting each child\'s uniqueness, learning styles, and diverse abilities',
                color: 'from-yellow-400 to-teal-400'
              },
              {
                icon: Target,
                title: 'Lifelong Learning',
                description: 'Establishing strong educational foundations for future success',
                color: 'from-teal-400 to-blue-400'
              }
            ].map((item, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                className="bg-white rounded-3xl p-8 shadow-lg hover:shadow-xl transition-all"
              >
                <div className={`w-16 h-16 rounded-full bg-gradient-to-br ${item.color} flex items-center justify-center mb-6`}>
                  <item.icon className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-xl text-gray-900 mb-3">{item.title}</h3>
                <p className="text-gray-600 leading-relaxed">{item.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </div>

      {/* Enrollment & Settling In */}
      <div className="py-20 lg:py-28">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="relative"
            >
              <div className="rounded-3xl overflow-hidden shadow-2xl aspect-[4/3]">
                <ManagedImage
                  assetKey="daycare.about.mission"
                  alt="Children settling in at daycare"
                  className="w-full h-full object-cover"
                />
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              <div className="inline-block px-4 py-2 rounded-full bg-orange-100 text-orange-700 text-sm mb-6">
                Enrollment & Settling In
              </div>
              <h2 className="text-4xl lg:text-5xl text-gray-900 mb-6">
                A Positive Start for Every Child
              </h2>
              <div className="space-y-4 text-lg text-gray-600 leading-relaxed">
                <p>
                  The daycare aims to ensure children feel safe and secure in the absence of parents. Our staff make the settling-in process a positive experience for children, building trust and confidence from day one.
                </p>
                <p>
                  We work closely with parents to understand each child's unique needs, routines, and comfort items, ensuring a smooth transition from home to daycare.
                </p>
                <p>
                  Our gentle approach allows children to explore their new environment at their own pace, supported by caring educators who build strong, secure attachments.
                </p>
              </div>
            </motion.div>
          </div>
        </div>
      </div>

      {/* The Enabling Environment */}
      <div className="py-20 lg:py-28 bg-gradient-to-br from-orange-50 via-yellow-50 to-teal-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center mb-16"
          >
            <div className="inline-block px-4 py-2 rounded-full bg-orange-100 text-orange-700 text-sm mb-6">
              Our Environment
            </div>
            <h2 className="text-4xl lg:text-5xl text-gray-900 mb-6">
              The Enabling Environment
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Safe, enjoyable spaces where children thrive and proudly display their achievements
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 gap-12">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="bg-white rounded-3xl p-8 shadow-lg"
            >
              <h3 className="text-2xl text-gray-900 mb-4">Learning Materials & Exploration</h3>
              <p className="text-gray-600 leading-relaxed mb-6">
                All areas are stocked with learning materials to encourage exploration and self-expression. Children have access to age-appropriate resources that spark curiosity and support development across all learning domains.
              </p>
              <div className="space-y-3">
                {[
                  'Sensory exploration materials',
                  'Creative arts and crafts supplies',
                  'Building and construction toys',
                  'Books and literacy resources',
                  'Music and movement equipment'
                ].map((item, index) => (
                  <div key={index} className="flex items-center gap-3">
                    <div className="w-2 h-2 rounded-full bg-gradient-to-br from-orange-400 to-coral-500"></div>
                    <span className="text-gray-700">{item}</span>
                  </div>
                ))}
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="bg-white rounded-3xl p-8 shadow-lg"
            >
              <h3 className="text-2xl text-gray-900 mb-4">Child Health & Nutrition</h3>
              <p className="text-gray-600 leading-relaxed mb-6">
                Daily freshly cooked warm lunch with balanced nutrients made from seasonal vegetables and fresh ingredients. We prioritize healthy eating habits and accommodate dietary requirements.
              </p>
              <div className="space-y-3">
                {[
                  'Freshly prepared daily meals',
                  'Seasonal vegetables & fresh ingredients',
                  'Balanced nutritional content',
                  'Accommodates dietary needs',
                  'Promotes healthy eating habits'
                ].map((item, index) => (
                  <div key={index} className="flex items-center gap-3">
                    <div className="w-2 h-2 rounded-full bg-gradient-to-br from-teal-400 to-blue-400"></div>
                    <span className="text-gray-700">{item}</span>
                  </div>
                ))}
              </div>
            </motion.div>
          </div>
        </div>
      </div>

      {/* Location */}
      <div className="py-20 lg:py-28">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="bg-gradient-to-br from-orange-400 to-coral-500 rounded-3xl p-12 text-center text-white"
          >
            <MapPin className="w-16 h-16 mx-auto mb-6 opacity-90" />
            <h2 className="text-4xl mb-4">Our Location</h2>
            <p className="text-xl mb-8 opacity-90">
              AUC New Cairo, Cairo, Egypt
            </p>
            <div className="space-y-2 text-white/90">
              <p>Conveniently located at the American University in Cairo campus</p>
              <p>Serving families in the New Cairo community</p>
            </div>
          </motion.div>
        </div>
      </div>

      {/* CTA */}
      <div className="py-20 lg:py-28 bg-gradient-to-br from-orange-50 via-yellow-50 to-teal-50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="text-4xl lg:text-5xl text-gray-900 mb-6">
              Come Visit Us
            </h2>
            <p className="text-xl text-gray-600 mb-8">
              Book a tour between 10:30 AM to 12:00 PM (book 1 day in advance)
            </p>
            <Link
              to="/daycare/contact"
              className="inline-block px-8 py-4 rounded-full bg-gradient-to-r from-orange-400 to-coral-500 text-white hover:shadow-xl transition-all"
            >
              Schedule a Tour
            </Link>
          </motion.div>
        </div>
      </div>

      </main>
      <DaycareFooter />
    </div>
  );
}

import { motion } from 'motion/react';
import { Award, Users, Target, Building2 } from 'lucide-react';
import { Link } from 'react-router';
import EduHubNav from '../../components/EduHubNav';
import EduHubFooter from '../../components/EduHubFooter';
import ManagedImage from '../../components/ManagedImage';

export default function EduHubAbout() {
  const team = [
    {
      name: 'Nesreen Hassanin',
      role: 'Founder & Managing Director',
      description: 'Visionary leader with decades of experience in early years education and teacher training.'
    },
    {
      name: 'Lamia Hassanin',
      role: 'Co-Founder & Training Manager',
      description: 'Expert trainer specializing in CACHE qualifications and professional development programs.'
    },
    {
      name: 'Ann Osman',
      role: 'Trainer and Assessor',
      description: 'Experienced educator providing training and assessment for CACHE qualifications.'
    },
    {
      name: 'Bassent Barsoum',
      role: 'Center Coordinator & Assessor',
      description: 'Manages day-to-day operations and conducts workplace assessments for learners.'
    },
    {
      name: 'Robert Mitton',
      role: 'Internal Quality Assurance Officer',
      description: 'Ensures all programs meet UK standards and NCFE quality requirements.'
    }
  ];

  return (
    <div className="min-h-screen bg-white">
      <EduHubNav />

      <main>

      {/* Hero */}
      <div className="relative overflow-hidden bg-gradient-to-br from-blue-50 to-indigo-50 py-20 lg:py-32">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center max-w-4xl mx-auto"
          >
            <h1 className="text-5xl lg:text-6xl text-gray-900 mb-6">
              About EduHub
            </h1>
            <p className="text-xl text-gray-600 leading-relaxed">
              First CACHE-approved training centre in Egypt, providing UK-accredited professional development for early years educators across Egypt and the Middle East.
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
              <div className="inline-block px-4 py-2 rounded-lg bg-blue-100 text-[#1349D1] text-sm mb-6">
                Our Story
              </div>
              <h2 className="text-4xl lg:text-5xl text-gray-900 mb-6">
                Pioneering UK-Accredited Teacher Training in Egypt
              </h2>
              <div className="space-y-4 text-lg text-gray-600 leading-relaxed">
                <p>
                  EduHub is a division of Early Years Company, offering accredited teacher training qualifications with official UK recognition.
                </p>
                <p>
                  As the first CACHE-approved training centre in Egypt, we are supported by NCFE UK (the official awarding organization) and BriteThink UK (providing quality assurance, content, and assessment services).
                </p>
                <p>
                  Our mission is to provide professional development for early years educators across Egypt and the Middle East, helping schools and settings deliver in-house training with official UK recognition.
                </p>
                <p>
                  We serve both private and public educational institutions, working to elevate the standard of early years education throughout the region.
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
              <div className="rounded-2xl overflow-hidden shadow-2xl aspect-[4/3]">
                <ManagedImage
                  assetKey="eduhub.about.hero"
                  alt="EduHub training centre"
                  className="w-full h-full object-cover"
                />
              </div>
            </motion.div>
          </div>
        </div>
      </div>

      {/* Mission & Values */}
      <div className="py-20 lg:py-28 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl lg:text-5xl text-gray-900 mb-6">
              Our Mission & Purpose
            </h2>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              {
                icon: Award,
                title: 'UK Accreditation',
                description: 'Providing official CACHE qualifications recognized by UK regulators through NCFE'
              },
              {
                icon: Users,
                title: 'Professional Development',
                description: 'Supporting early years educators across Egypt and the Middle East'
              },
              {
                icon: Building2,
                title: 'Institutional Support',
                description: 'Helping schools deliver in-house training with official UK recognition'
              },
              {
                icon: Target,
                title: 'Quality Education',
                description: 'Serving private and public educational institutions to elevate standards'
              }
            ].map((item, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                className="bg-white rounded-2xl p-8 shadow-lg"
              >
                <div className="w-16 h-16 rounded-full bg-gradient-to-br from-blue-400 to-indigo-600 flex items-center justify-center mb-6">
                  <item.icon className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-xl text-gray-900 mb-3">{item.title}</h3>
                <p className="text-gray-600 leading-relaxed">{item.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </div>

      {/* Accreditation Partners */}
      <div className="py-20 lg:py-28">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center mb-16"
          >
            <div className="inline-block px-4 py-2 rounded-lg bg-blue-100 text-[#1349D1] text-sm mb-6">
              Accreditation & Partners
            </div>
            <h2 className="text-4xl lg:text-5xl text-gray-900 mb-6">
              Official UK Recognition
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Our programs are accredited and supported by leading UK education organizations
            </p>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                name: 'NCFE',
                role: 'Accrediting Organization',
                description: 'UK awarding organization recognized by UK regulators (Ofqual, CCEA Regulation, Qualifications Wales). NCFE provides official accreditation for all CACHE qualifications offered at EduHub.',
                highlight: 'Official UK Awarding Body'
              },
              {
                name: 'BriteThink UK',
                role: 'Quality Assurance Partner',
                description: 'BriteThink provides comprehensive support including quality assurance, educational content development, and assessment services for all EduHub programs.',
                highlight: 'Assessment & QA Support'
              },
              {
                name: 'CACHE',
                role: 'Qualification Provider',
                description: 'Leading awarding organization for qualifications in early years, childcare, and education. CACHE qualifications are respected throughout the UK and internationally.',
                highlight: 'Industry-Leading Qualifications'
              }
            ].map((partner, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-2xl p-8"
              >
                <div className="w-16 h-16 rounded-full bg-[#1349D1] flex items-center justify-center mb-6">
                  <Award className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-2xl text-gray-900 mb-2">{partner.name}</h3>
                <div className="text-sm px-3 py-1 rounded-full bg-white text-[#1349D1] inline-block mb-4">
                  {partner.highlight}
                </div>
                <div className="text-[#1349D1] mb-3">{partner.role}</div>
                <p className="text-gray-600 leading-relaxed">{partner.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </div>

      {/* Meet The Team */}
      <div className="py-20 lg:py-28 bg-gradient-to-br from-blue-50 to-indigo-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl lg:text-5xl text-gray-900 mb-6">
              Meet The Training Team
            </h2>
            <p className="text-xl text-gray-600">
              Experienced professionals dedicated to educator development
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {team.map((member, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                className="bg-white rounded-2xl p-8 shadow-lg text-center"
              >
                <div className="w-24 h-24 rounded-full bg-gradient-to-br from-blue-400 to-indigo-600 flex items-center justify-center mx-auto mb-6">
                  <Users className="w-12 h-12 text-white" />
                </div>
                <h3 className="text-2xl text-gray-900 mb-2">{member.name}</h3>
                <div className="text-[#1349D1] mb-4">{member.role}</div>
                <p className="text-gray-600 leading-relaxed">{member.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </div>

      {/* Who We Train */}
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
              <div className="rounded-2xl overflow-hidden shadow-2xl aspect-[4/3]">
                <ManagedImage
                  assetKey="eduhub.about.team"
                  alt="Professional educators in training"
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
              <h2 className="text-4xl lg:text-5xl text-gray-900 mb-6">
                Who We Train
              </h2>
              <p className="text-lg text-gray-600 mb-8 leading-relaxed">
                We provide professional development for a wide range of early years professionals and educational institutions across Egypt and the Middle East.
              </p>
              <div className="space-y-4">
                {[
                  'Individual educators seeking career advancement',
                  'Schools and nurseries implementing EYFS curriculum',
                  'Private and public educational institutions',
                  'Ministry of Education training programs',
                  'Early years practitioners and assistants',
                  'Nursery managers and setting leaders',
                  'Career changers entering early years education'
                ].map((item, index) => (
                  <div key={index} className="flex items-start gap-3">
                    <div className="w-6 h-6 rounded-full bg-[#1349D1] flex items-center justify-center flex-shrink-0 mt-1">
                      <div className="w-2 h-2 rounded-full bg-white"></div>
                    </div>
                    <span className="text-lg text-gray-700">{item}</span>
                  </div>
                ))}
              </div>
            </motion.div>
          </div>
        </div>
      </div>

      {/* CTA */}
      <div className="py-20 lg:py-28 bg-[#1349D1]">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="text-4xl lg:text-5xl text-white mb-6">
              Join EduHub
            </h2>
            <p className="text-xl text-white/90 mb-8">
              Register your interest for UK-accredited CACHE teacher training
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                to="/eduhub/contact"
                className="px-8 py-4 rounded-lg bg-white text-gray-900 hover:bg-gray-100 transition-all"
              >
                Register Interest
              </Link>
              <Link
                to="/eduhub/programs"
                className="px-8 py-4 rounded-lg bg-transparent border-2 border-white text-white hover:bg-white/10 transition-all"
              >
                View Programs
              </Link>
            </div>
          </motion.div>
        </div>
      </div>

      </main>
      <EduHubFooter />
    </div>
  );
}

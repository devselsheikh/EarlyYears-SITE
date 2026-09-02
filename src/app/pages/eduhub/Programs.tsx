import { motion } from 'motion/react';
import { GraduationCap, Clock, DollarSign, MapPin, CheckCircle2, BookOpen, Users, Award } from 'lucide-react';
import { Link } from 'react-router';
import EduHubNav from '../../components/EduHubNav';
import EduHubFooter from '../../components/EduHubFooter';
import ManagedImage from '../../components/ManagedImage';
import { useCMS } from '../../hooks/useCMS';
import { isPublished } from '../../data/cms';

export default function EduHubPrograms() {
  const cms = useCMS();
  const fallbackPrograms = [
    {
      level: 'CACHE Level 2',
      title: 'Caring for Children and Young People',
      description: 'Provides knowledge and understanding to explore careers working with children and young people. An entry-level qualification for those beginning their journey in early years education.',
      duration: '6-9 months',
      hours: '3 hours/week',
      cost: 'Contact for pricing',
      mode: 'Hybrid (in-person & online)',
      status: 'Available',
      color: 'from-blue-400 to-blue-600',
      bgColor: 'from-blue-50 to-indigo-50',
      entryRequirements: [
        'Interest in working with children and young people',
        'Basic English literacy skills',
        'No prior qualifications required'
      ],
      outcomes: [
        'Understanding of child development',
        'Basic safeguarding knowledge',
        'Foundation for further study',
        'Entry-level career opportunities'
      ],
      whoFor: [
        'School leavers exploring childcare careers',
        'Career changers entering early years',
        'Parents wanting to understand child development',
        'Volunteers in childcare settings'
      ]
    },
    {
      level: 'CACHE Level 3',
      title: 'Diploma for Early Years Workforce',
      description: 'Prepares learners for roles with children from birth to 5 (knowledge extends to age 7). This qualification is widely recognized for early years practitioners.',
      duration: '9-12 months',
      hours: '3 hours/week',
      cost: 'Contact for pricing',
      mode: 'Hybrid (in-person & online)',
      status: 'Available',
      color: 'from-indigo-400 to-indigo-600',
      bgColor: 'from-indigo-50 to-purple-50',
      entryRequirements: [
        'Level 2 qualification or equivalent',
        'Experience working with children (preferred)',
        'English proficiency'
      ],
      outcomes: [
        'Qualified early years practitioner',
        'EYFS curriculum expertise',
        'Work independently with children',
        'Progress to Level 5 leadership pathway'
      ],
      whoFor: [
        'Early years assistants seeking advancement',
        'Practitioners wanting formal qualification',
        'Those transitioning to EYFS settings',
        'Educators aiming for senior roles'
      ]
    },
    {
      level: 'CACHE Level 5',
      title: 'Diploma for Early Years Leadership',
      description: 'Develops skills for managing practice and leading others in children and youth services. For health & social care and children & young people\'s services.',
      duration: '9-12 months',
      hours: '3 hours/week',
      cost: '85,000 EGP + 3,000 EGP registration',
      mode: 'Hybrid (in-person & online)',
      status: 'Available',
      color: 'from-purple-400 to-purple-600',
      bgColor: 'from-purple-50 to-pink-50',
      entryRequirements: [
        'Level 3 qualification or equivalent',
        '3-5 years experience in early years setting',
        'Current employment in leadership/supervisory role (preferred)'
      ],
      outcomes: [
        'Qualified manager in early years settings',
        'Leadership and management skills',
        'Quality assurance expertise',
        'Progression to degree-level study possible'
      ],
      whoFor: [
        'Nursery managers and deputies',
        'Setting coordinators',
        'EYFS leaders in schools',
        'Those aspiring to senior management'
      ],
      assessment: [
        'Workplace observation',
        'Research project',
        'Written assignments',
        'Professional portfolio'
      ]
    }
  ];
  const managedPrograms = cms.courses
    .filter(course => isPublished({ status: course.publishStatus, active: course.active }))
    .sort((a, b) => a.displayOrder - b.displayOrder)
    .map(course => ({
      ...course,
      bgColor: course.lightBg.replace('bg-', 'from-') + ' to-white',
      entryRequirements: ['Contact our team to confirm entry requirements', 'English proficiency appropriate to the course'],
      whoFor: course.outcomes.map(outcome => `Learners developing: ${outcome}`),
    }));
  const programs = managedPrograms.length > 0 ? managedPrograms : fallbackPrograms;

  return (
    <div className="eduhub-site min-h-screen bg-white">
      <EduHubNav />

      <main>

      {/* Hero */}
      <section className="editorial-hero editorial-hero--educators relative py-16 sm:py-20 overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center max-w-4xl mx-auto"
          >
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white shadow-md text-gray-700 text-sm mb-5">
              <GraduationCap className="w-4 h-4" />
              <span className="font-semibold">UK-Accredited Qualifications</span>
            </div>
            <h1 className="text-4xl sm:text-5xl lg:text-6xl text-white font-bold mb-4">
              CACHE Qualification{' '}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-200 via-white to-violet-200">Programs</span>
            </h1>
            <p className="text-lg sm:text-xl text-blue-50 leading-relaxed max-w-3xl mx-auto">
              UK-accredited CACHE qualifications from Level 2 to Level 5 leadership, recognized across Egypt and the Middle East.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Programs Detail */}
      <div className="py-20 lg:py-28">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-20">
          {programs.map((program, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              id={program.level.toLowerCase().replace(' ', '-')}
            >
              <div className={`relative rounded-3xl overflow-hidden bg-gradient-to-br ${program.bgColor} p-8 lg:p-12`}>
                <div className="grid lg:grid-cols-3 gap-12">
                  {/* Main Info */}
                  <div className="lg:col-span-2">
                    <div className="flex items-center gap-4 mb-6">
                      <span className="px-4 py-2 rounded-lg bg-white text-[#1349D1]">
                        {program.level}
                      </span>
                      <span className={`px-4 py-2 rounded-lg text-sm ${
                        program.status === 'Available'
                          ? 'bg-green-100 text-green-700'
                          : 'bg-gray-100 text-gray-700'
                      }`}>
                        {program.status}
                      </span>
                    </div>
                    <h2 className="text-4xl text-gray-900 mb-4">{program.title}</h2>
                    <p className="text-lg text-gray-600 mb-8 leading-relaxed">
                      {program.description}
                    </p>

                    {/* Course Details Grid */}
                    <div className="grid md:grid-cols-2 gap-4 mb-8">
                      <div className="bg-white/70 backdrop-blur rounded-xl p-4 flex items-center gap-3">
                        <Clock className="w-5 h-5 text-[#1349D1]" />
                        <div>
                          <div className="text-xs text-gray-500">Duration</div>
                          <div className="text-gray-900">{program.duration}</div>
                        </div>
                      </div>
                      <div className="bg-white/70 backdrop-blur rounded-xl p-4 flex items-center gap-3">
                        <BookOpen className="w-5 h-5 text-[#1349D1]" />
                        <div>
                          <div className="text-xs text-gray-500">Teaching Hours</div>
                          <div className="text-gray-900">{program.hours}</div>
                        </div>
                      </div>
                      <div className="bg-white/70 backdrop-blur rounded-xl p-4 flex items-center gap-3">
                        <DollarSign className="w-5 h-5 text-[#1349D1]" />
                        <div>
                          <div className="text-xs text-gray-500">Cost</div>
                          <div className="text-gray-900">{program.cost}</div>
                        </div>
                      </div>
                      <div className="bg-white/70 backdrop-blur rounded-xl p-4 flex items-center gap-3">
                        <MapPin className="w-5 h-5 text-[#1349D1]" />
                        <div>
                          <div className="text-xs text-gray-500">Mode</div>
                          <div className="text-gray-900">{program.mode}</div>
                        </div>
                      </div>
                    </div>

                    {/* Who This Is For */}
                    <div className="bg-white rounded-xl p-6">
                      <h3 className="text-xl text-gray-900 mb-4 flex items-center gap-2">
                        <Users className="w-5 h-5 text-[#1349D1]" />
                        Who This Course Is For
                      </h3>
                      <div className="space-y-2">
                        {program.whoFor.map((item, idx) => (
                          <div key={idx} className="flex items-start gap-2">
                            <CheckCircle2 className="w-5 h-5 text-[#1349D1] flex-shrink-0 mt-0.5" />
                            <span className="text-gray-700">{item}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Sidebar Info */}
                  <div className="space-y-6">
                    {/* Entry Requirements */}
                    <div className="bg-white rounded-xl p-6">
                      <h3 className="text-lg text-gray-900 mb-4">Entry Requirements</h3>
                      <div className="space-y-2">
                        {program.entryRequirements.map((req, idx) => (
                          <div key={idx} className="flex items-start gap-2">
                            <div className="w-1.5 h-1.5 rounded-full bg-[#1349D1] mt-2 flex-shrink-0"></div>
                            <span className="text-sm text-gray-700">{req}</span>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Learning Outcomes */}
                    <div className="bg-white rounded-xl p-6">
                      <h3 className="text-lg text-gray-900 mb-4">Learning Outcomes</h3>
                      <div className="space-y-2">
                        {program.outcomes.map((outcome, idx) => (
                          <div key={idx} className="flex items-start gap-2">
                            <Award className="w-4 h-4 text-[#1349D1] flex-shrink-0 mt-0.5" />
                            <span className="text-sm text-gray-700">{outcome}</span>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Assessment (if exists) */}
                    {program.assessment && (
                      <div className="bg-white rounded-xl p-6">
                        <h3 className="text-lg text-gray-900 mb-4">Assessment Methods</h3>
                        <div className="space-y-2">
                          {program.assessment.map((method, idx) => (
                            <div key={idx} className="flex items-start gap-2">
                              <div className="w-1.5 h-1.5 rounded-full bg-[#1349D1] mt-2 flex-shrink-0"></div>
                              <span className="text-sm text-gray-700">{method}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* CTA Button */}
                    <Link
                      to="/eduhub/contact"
                      className="block text-center px-6 py-3 rounded-lg bg-[#1349D1] text-white hover:bg-blue-700 transition-colors"
                    >
                      Register Interest
                    </Link>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Accreditation Partners */}
      <div className="py-20 lg:py-28 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center mb-12"
          >
            <h2 className="text-4xl text-gray-900 mb-6">
              Accreditation Partners
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              EduHub is accredited and supported by leading UK education organizations
            </p>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                name: 'NCFE',
                role: 'Accrediting Organization',
                logo: '/images/eduhub/accreditation/ncfe.png',
                description: 'UK awarding organization recognized by UK regulators, providing official accreditation for all CACHE qualifications.'
              },
              {
                name: 'BriteThink UK',
                role: 'Quality Assurance Partner',
                logo: '/images/eduhub/accreditation/britethink.png',
                description: 'Provides support, quality assurance, educational content, and assessment services for all programs.'
              },
              {
                name: 'CACHE',
                role: 'Qualification Provider',
                logo: '/images/eduhub/accreditation/cache.png',
                description: 'Leading awarding organization for qualifications in early years, childcare, and education sectors.'
              }
            ].map((partner, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                className="eduhub-accreditation-card bg-white rounded-2xl p-6 sm:p-8 shadow-lg border border-blue-100"
              >
                <div className="h-16 rounded-xl bg-[#F4F7FF] border border-[#DFE8FF] flex items-center px-5 mb-6">
                  <img src={partner.logo} alt={`${partner.name} accreditation logo`} className="max-h-9 max-w-[12rem] w-auto object-contain" />
                </div>
                <h3 className="text-2xl text-gray-900 mb-2">{partner.name}</h3>
                <div className="text-sm text-[#1349D1] mb-4">{partner.role}</div>
                <p className="text-gray-600 leading-relaxed">{partner.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </div>

      {/* Gallery */}
      <div className="py-20 lg:py-28">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center mb-12"
          >
            <h2 className="text-4xl text-gray-900 mb-6">
              Professional Training Environment
            </h2>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-6">
            {['eduhub.about.hero', 'eduhub.about.team', 'eduhub.about.training'].map((assetKey, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                className="relative rounded-2xl overflow-hidden shadow-lg hover:shadow-xl transition-all aspect-square"
              >
                <ManagedImage
                  assetKey={assetKey}
                  alt={`Training environment ${index + 1}`}
                  className="w-full h-full object-cover"
                />
              </motion.div>
            ))}
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
              Ready to Start Your Journey?
            </h2>
            <p className="text-xl text-white/90 mb-8">
              Register your interest or contact us for more information about enrolment
            </p>
            <Link
              to="/eduhub/contact"
              className="inline-block px-8 py-4 rounded-lg bg-white text-gray-900 hover:bg-gray-100 transition-all"
            >
              Register Interest
            </Link>
          </motion.div>
        </div>
      </div>

      </main>
      <EduHubFooter />
    </div>
  );
}

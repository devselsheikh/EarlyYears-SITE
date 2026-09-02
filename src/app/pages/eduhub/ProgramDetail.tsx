import { motion } from 'motion/react';
import { Clock, Users, BookOpen, CheckCircle, Award, FileText, ArrowRight } from 'lucide-react';
import { Link, useParams } from 'react-router';
import EduHubNav from '../../components/EduHubNav';
import EduHubFooter from '../../components/EduHubFooter';

export default function EduHubProgramDetail() {
  const { id } = useParams();

  // Mock program data - in a real app, this would come from an API
  const program = {
    title: 'Diploma of Early Childhood Education',
    subtitle: 'Advanced qualification for leading rooms and programs',
    duration: '18 months',
    mode: 'In-person & Online (Hybrid)',
    level: 'Intermediate',
    overview: 'The Diploma of Early Childhood Education is a comprehensive qualification that prepares educators to take on leadership roles within early childhood settings. This programme combines theoretical knowledge with extensive practical experience, ensuring graduates are ready to design and implement high-quality programmes that support children\'s learning and development.',
    whoFor: [
      'Educators currently working in childcare or preschool settings',
      'Certificate III holders looking to advance their career',
      'Those aspiring to room leader or educational leader positions',
      'Career changers with relevant experience in child-related fields'
    ],
    outcomes: [
      'Design and implement age-appropriate learning programs',
      'Lead and mentor a team of early childhood educators',
      'Apply child development theory to practice',
      'Build partnerships with families and communities',
      'Meet regulatory and quality standards',
      'Support children with diverse needs and backgrounds'
    ],
    format: {
      delivery: 'Hybrid model combining online learning and face-to-face workshops',
      schedule: 'Flexible part-time study (15-20 hours per week)',
      practicum: '240 hours of supervised placement in approved services',
      assessments: 'Written assignments, observations, portfolios, and practical demonstrations'
    },
    assessment: [
      'Written reflections and case studies',
      'Practical observations in workplace settings',
      'Portfolio of evidence',
      'Program planning and curriculum documentation'
    ],
    certification: 'Upon successful completion, graduates receive a nationally recognized Diploma of Early Childhood Education and Care, meeting the qualification requirements for early childhood educators under the National Quality Framework.',
    nextSteps: [
      'Complete online application form',
      'Attend information session (optional)',
      'Submit supporting documents',
      'Interview with programme coordinator',
      'Receive offer and enroll'
    ]
  };

  return (
    <div className="eduhub-site min-h-screen bg-white">
      <EduHubNav />

      <main>

      {/* Hero */}
      <div className="relative overflow-hidden bg-gradient-to-br from-[#1349D1] to-blue-900 py-20 lg:py-32">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute inset-0" style={{
            backgroundImage: 'linear-gradient(white 1px, transparent 1px), linear-gradient(90deg, white 1px, transparent 1px)',
            backgroundSize: '50px 50px'
          }}></div>
        </div>
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="max-w-4xl text-white"
          >
            <div className="inline-block px-3 py-1 rounded-full bg-white/20 text-white text-sm mb-6">
              {program.level}
            </div>
            <h1 className="text-5xl lg:text-6xl mb-4">
              {program.title}
            </h1>
            <p className="text-xl text-blue-100 mb-8">
              {program.subtitle}
            </p>
            <div className="flex flex-wrap gap-6 text-blue-100">
              <div className="flex items-center gap-2">
                <Clock className="w-5 h-5" />
                {program.duration}
              </div>
              <div className="flex items-center gap-2">
                <Users className="w-5 h-5" />
                {program.mode}
              </div>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Content */}
      <div className="py-20 lg:py-28">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-3 gap-12">
            {/* Main Content */}
            <div className="lg:col-span-2 space-y-16">
              {/* Program Overview */}
              <motion.section
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
              >
                <h2 className="text-3xl text-gray-900 mb-6">Program Overview</h2>
                <p className="text-lg text-gray-600 leading-relaxed">
                  {program.overview}
                </p>
              </motion.section>

              {/* Who This Course is For */}
              <motion.section
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6 }}
              >
                <h2 className="text-3xl text-gray-900 mb-6">Who This Course is For</h2>
                <ul className="space-y-4">
                  {program.whoFor.map((item, index) => (
                    <li key={index} className="flex items-start gap-3">
                      <div className="w-6 h-6 rounded bg-blue-50 flex items-center justify-center flex-shrink-0 mt-1">
                        <CheckCircle className="w-4 h-4 text-[#1349D1]" />
                      </div>
                      <span className="text-gray-700 leading-relaxed">{item}</span>
                    </li>
                  ))}
                </ul>
              </motion.section>

              {/* Learning Outcomes */}
              <motion.section
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6 }}
              >
                <h2 className="text-3xl text-gray-900 mb-6">Learning Outcomes</h2>
                <p className="text-gray-600 mb-6 leading-relaxed">
                  Upon completion, you will be able to:
                </p>
                <div className="grid sm:grid-cols-2 gap-4">
                  {program.outcomes.map((outcome, index) => (
                    <div key={index} className="flex items-start gap-3 p-4 bg-gray-50 rounded-lg">
                      <CheckCircle className="w-5 h-5 text-[#1349D1] flex-shrink-0 mt-0.5" />
                      <span className="text-gray-700">{outcome}</span>
                    </div>
                  ))}
                </div>
              </motion.section>

              {/* Duration & Format */}
              <motion.section
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6 }}
              >
                <h2 className="text-3xl text-gray-900 mb-6">Duration & Format</h2>
                <div className="space-y-6">
                  <div className="border-l-4 border-[#1349D1] pl-6">
                    <h3 className="text-xl text-gray-900 mb-2">Delivery Mode</h3>
                    <p className="text-gray-600">{program.format.delivery}</p>
                  </div>
                  <div className="border-l-4 border-[#1349D1] pl-6">
                    <h3 className="text-xl text-gray-900 mb-2">Study Schedule</h3>
                    <p className="text-gray-600">{program.format.schedule}</p>
                  </div>
                  <div className="border-l-4 border-[#1349D1] pl-6">
                    <h3 className="text-xl text-gray-900 mb-2">Practical Experience</h3>
                    <p className="text-gray-600">{program.format.practicum}</p>
                  </div>
                  <div className="border-l-4 border-[#1349D1] pl-6">
                    <h3 className="text-xl text-gray-900 mb-2">Assessment Methods</h3>
                    <p className="text-gray-600">{program.format.assessments}</p>
                  </div>
                </div>
              </motion.section>

              {/* Assessment & Requirements */}
              <motion.section
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6 }}
              >
                <h2 className="text-3xl text-gray-900 mb-6">Assessment & Requirements</h2>
                <p className="text-gray-600 mb-6">
                  Assessment is competency-based and includes:
                </p>
                <ul className="space-y-3">
                  {program.assessment.map((item, index) => (
                    <li key={index} className="flex items-start gap-3">
                      <div className="w-2 h-2 rounded-full bg-[#1349D1] mt-2"></div>
                      <span className="text-gray-700">{item}</span>
                    </li>
                  ))}
                </ul>
              </motion.section>

              {/* Certification */}
              <motion.section
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6 }}
                className="bg-gradient-to-br from-blue-50 to-gray-50 rounded-xl p-8 border border-gray-100"
              >
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-lg bg-[#1349D1] flex items-center justify-center flex-shrink-0">
                    <Award className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h2 className="text-2xl text-gray-900 mb-3">Certification / Recognition</h2>
                    <p className="text-gray-600 leading-relaxed">{program.certification}</p>
                  </div>
                </div>
              </motion.section>
            </div>

            {/* Sidebar */}
            <div className="lg:col-span-1">
              <div className="sticky top-32 space-y-6">
                {/* CTA Panel */}
                <motion.div
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.6, delay: 0.2 }}
                  className="bg-gradient-to-br from-[#1349D1] to-blue-900 rounded-xl p-8 text-white"
                >
                  <h3 className="text-2xl mb-6">Ready to Enroll?</h3>
                  <div className="space-y-4">
                    <Link
                      to="/eduhub/contact"
                      className="block w-full px-6 py-3 rounded-lg bg-white text-[#1349D1] text-center hover:bg-gray-50 transition-all"
                    >
                      Register Interest
                    </Link>
                    <Link
                      to="/eduhub/contact"
                      className="block w-full px-6 py-3 rounded-lg bg-transparent border-2 border-white text-white text-center hover:bg-white/10 transition-all"
                    >
                      Apply Now
                    </Link>
                  </div>
                  <div className="mt-8 pt-8 border-t border-white/20">
                    <h4 className="text-sm mb-4">Next Steps:</h4>
                    <ol className="space-y-3 text-sm text-blue-100">
                      {program.nextSteps.map((step, index) => (
                        <li key={index} className="flex gap-3">
                          <span className="flex-shrink-0">{index + 1}.</span>
                          <span>{step}</span>
                        </li>
                      ))}
                    </ol>
                  </div>
                </motion.div>

                {/* Quick Info */}
                <motion.div
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.6, delay: 0.3 }}
                  className="bg-gray-50 rounded-xl p-6 border border-gray-100"
                >
                  <h3 className="text-lg text-gray-900 mb-4">Program Information</h3>
                  <div className="space-y-4 text-sm">
                    <div className="flex items-start gap-3">
                      <Clock className="w-5 h-5 text-[#1349D1] flex-shrink-0" />
                      <div>
                        <div className="text-gray-500">Duration</div>
                        <div className="text-gray-900">{program.duration}</div>
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <Users className="w-5 h-5 text-[#1349D1] flex-shrink-0" />
                      <div>
                        <div className="text-gray-500">Mode</div>
                        <div className="text-gray-900">{program.mode}</div>
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <BookOpen className="w-5 h-5 text-[#1349D1] flex-shrink-0" />
                      <div>
                        <div className="text-gray-500">Level</div>
                        <div className="text-gray-900">{program.level}</div>
                      </div>
                    </div>
                  </div>
                </motion.div>

                {/* Download */}
                <motion.div
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.6, delay: 0.4 }}
                  className="bg-white rounded-xl p-6 border-2 border-gray-100"
                >
                  <FileText className="w-8 h-8 text-[#1349D1] mb-4" />
                  <h3 className="text-lg text-gray-900 mb-2">Program Guide</h3>
                  <p className="text-sm text-gray-600 mb-4">
                    Download detailed course information
                  </p>
                  <Link
                    to="/eduhub/contact"
                    className="block w-full px-4 py-2 rounded-lg bg-gray-100 text-gray-900 text-center hover:bg-gray-200 transition-all text-sm"
                  >
                    Request Program Guide
                  </Link>
                </motion.div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Related Programs */}
      <div className="py-20 lg:py-28 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl lg:text-4xl text-gray-900 mb-4">
              Related Programs
            </h2>
            <p className="text-gray-600">
              Continue your professional development
            </p>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                title: 'Advanced Curriculum & Pedagogy',
                duration: '6 months',
                description: 'Deepen your understanding of curriculum frameworks and pedagogical approaches.'
              },
              {
                title: 'Educational Leadership',
                duration: '6 months',
                description: 'Develop leadership skills for coordinating teams and managing programs.'
              },
              {
                title: 'Inclusive Practice',
                duration: '4 months',
                description: 'Strategies for supporting diverse learners and children with additional needs.'
              }
            ].map((relatedProgram, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                className="bg-white rounded-xl p-6 border border-gray-200 hover:border-[#1349D1] transition-all"
              >
                <h3 className="text-xl text-gray-900 mb-2">{relatedProgram.title}</h3>
                <div className="text-sm text-gray-500 mb-4">{relatedProgram.duration}</div>
                <p className="text-gray-600 mb-4">{relatedProgram.description}</p>
                <Link
                  to="/eduhub/programs"
                  className="inline-flex items-center text-[#1349D1] hover:gap-2 transition-all text-sm"
                >
                  Learn More
                  <ArrowRight className="w-4 h-4 ml-1" />
                </Link>
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

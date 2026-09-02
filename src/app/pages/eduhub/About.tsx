import { motion } from 'motion/react';
import { Award, Users, Target, Building2 } from 'lucide-react';
import { Link } from 'react-router';
import EduHubNav from '../../components/EduHubNav';
import EduHubFooter from '../../components/EduHubFooter';
import ManagedImage from '../../components/ManagedImage';
import { useCMS } from '../../hooks/useCMS';
import { isPublished } from '../../data/cms';

export default function EduHubAbout() {
  const cms = useCMS();
  const fallbackTeam = [
    {
      name: 'Nesreen Hassanin',
      role: 'Founder & Managing Director',
      image: '/images/eduhub/team/nesreen-hassanin.jpg',
      credentials: '30 years in early years · CACHE Levels 3 & 5 · M.Ed. Leadership',
      description: 'An early years leader who has supported children, families, educators, and learning settings across Egypt, Saudi Arabia, and Dubai. Nesreen co-founded two nurseries and the Early Years Company, bringing practical leadership, training, and start-up expertise to every EduHub programme.'
    },
    {
      name: 'Lamia Hassanin',
      role: 'Co-Founder & Training Manager',
      image: '/images/eduhub/team/lamia-hassanin.jpg',
      credentials: 'M.Ed. · SENCO · Parenting Coach · 23 years’ leadership',
      description: 'Lamia oversees educational quality and training with more than two decades of early years management experience. Her work centres on inclusive, child-led learning and practical support for educators, families, and children with diverse learning needs.'
    },
    {
      name: 'Ann Osman',
      role: 'Trainer and Assessor',
      image: '/images/eduhub/team/ann-osman.jpg',
      credentials: '27 years in education · Montessori · Child Psychology',
      description: 'Ann brings extensive British and American curriculum experience, including early years leadership and inclusive education. Her workshops cover classroom management, Montessori practice, special educational needs, and confident staff development.'
    },
    {
      name: 'Bassent Barsoum',
      role: 'Centre Coordinator & Assessor',
      image: '/images/eduhub/team/bassent-barsoum.jpg',
      credentials: 'B.A. Psychology, AUC · Professional Educator Diploma',
      description: 'Bassent began as an early years educator after studying Psychology at AUC and joined Early Years in 2017. She now coordinates the centre and supports learners through assessment, helping educators turn their knowledge into confident professional practice.'
    },
    {
      name: 'Robert Mitton',
      role: 'Internal Quality Assurance Officer',
      image: '/images/eduhub/team/robert-mitton.jpg',
      credentials: 'Qualified Assessor & IQA · Vocational Training Specialist',
      description: 'Robert combines vocational assessment, moderation, and quality-assurance expertise with first-hand knowledge of early years settings. He safeguards the consistency and UK-aligned quality of EduHub’s training and assessment.'
    }
  ];
  const approvedNames = new Set(['Nesrin Hassanin', 'Nesreen Hassanin', 'Lamia Hassanin', 'Ann Osman', 'Bassent Barsoum', 'Robert Mitton']);
  const managedTeam = cms.educators.filter(isPublished).filter(member => approvedNames.has(member.name)).sort((a, b) => a.displayOrder - b.displayOrder).map(member => ({
    name: member.name === 'Nesrin Hassanin' ? 'Nesreen Hassanin' : member.name,
    role: member.title,
    image: member.img,
    credentials: member.qualification,
    description: member.bio,
  }));
  const team = managedTeam.length >= 5 ? managedTeam : fallbackTeam;

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
              <Award className="w-4 h-4" />
              <span className="font-semibold">Egypt’s First CACHE-Approved Centre</span>
            </div>
            <h1 className="text-4xl sm:text-5xl lg:text-6xl text-white font-bold mb-4">
              About{' '}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-200 via-white to-violet-200">EduHub</span>
            </h1>
            <p className="text-lg sm:text-xl text-blue-50 leading-relaxed max-w-3xl mx-auto">
              First CACHE-approved training centre in Egypt, providing UK-accredited professional development for early years educators across Egypt and the Middle East.
            </p>
          </motion.div>
        </div>
      </section>

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
                logo: '/images/eduhub/accreditation/ncfe.png',
                description: 'UK awarding organization recognized by UK regulators (Ofqual, CCEA Regulation, Qualifications Wales). NCFE provides official accreditation for all CACHE qualifications offered at EduHub.',
                highlight: 'Official UK Awarding Body'
              },
              {
                name: 'BriteThink UK',
                role: 'Quality Assurance Partner',
                logo: '/images/eduhub/accreditation/britethink.png',
                description: 'BriteThink provides comprehensive support including quality assurance, educational content development, and assessment services for all EduHub programs.',
                highlight: 'Assessment & QA Support'
              },
              {
                name: 'CACHE',
                role: 'Qualification Provider',
                logo: '/images/eduhub/accreditation/cache.png',
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
                className="eduhub-accreditation-card bg-white rounded-2xl p-6 sm:p-8 border border-blue-100"
              >
                <div className="h-16 rounded-xl bg-[#F4F7FF] border border-[#DFE8FF] flex items-center px-5 mb-6">
                  <img src={partner.logo} alt={`${partner.name} accreditation logo`} className="max-h-9 max-w-[12rem] w-auto object-contain" />
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
      <div className="py-16 sm:py-20 lg:py-28 bg-[#f5f8ff]">
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

          <div className="grid sm:grid-cols-2 lg:grid-cols-6 gap-5 lg:gap-6">
            {team.map((member, index) => (
              <motion.div
                key={member.name}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.45, delay: index * 0.06 }}
                className={`group overflow-hidden bg-white rounded-[1.4rem] border border-blue-100 shadow-[0_12px_36px_rgba(19,73,209,0.08)] ${index < 2 ? 'lg:col-span-3' : 'lg:col-span-2'}`}
              >
                <div className={`overflow-hidden bg-blue-100 ${index < 2 ? 'aspect-[16/10]' : 'aspect-[4/3]'}`}>
                  <img src={member.image} alt={`${member.name}, ${member.role}`} className="h-full w-full object-cover object-top transition-transform duration-300 group-hover:scale-[1.02]" loading="lazy" decoding="async" />
                </div>
                <div className="p-5 sm:p-6 text-left">
                  <h3 className="text-xl sm:text-2xl font-bold text-gray-950 mb-1">{member.name}</h3>
                  <div className="text-[#1349D1] font-semibold text-sm mb-3">{member.role}</div>
                  <p className="text-xs font-semibold text-slate-500 mb-3 leading-relaxed">{member.credentials}</p>
                  <p className="text-sm text-gray-600 leading-6">{member.description}</p>
                </div>
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

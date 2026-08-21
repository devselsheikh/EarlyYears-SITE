// ─────────────────────────────────────────────────────────────────────────────
// Early Years CMS — Data model, defaults, localStorage helpers
// ─────────────────────────────────────────────────────────────────────────────

export const CMS_KEY = 'eyc_cms_v1';
export const SUBMISSIONS_KEY = 'eyc_submissions';

export function generateId(): string {
  return Math.random().toString(36).slice(2, 10) + Date.now().toString(36);
}

// ─── Status ───────────────────────────────────────────────────────────────────

export type CMSStatus = 'draft' | 'published' | 'hidden';

export function getStatus(record: { status?: CMSStatus; active?: boolean }): CMSStatus {
  if (record.status) return record.status;
  return record.active !== false ? 'published' : 'hidden';
}

export function isPublished(record: { status?: CMSStatus; active?: boolean }): boolean {
  return getStatus(record) === 'published';
}

// ─── Types ────────────────────────────────────────────────────────────────────

export interface CMSStat { label: string; value: string }

export interface CMSSiteSettings {
  companyName: string;
  mainEmail: string;
  daycareEmail: string;
  eduhubEmail: string;
  mainPhone: string;
  daycarePhone: string;
  eduhubPhone: string;
  whatsapp: string;
  address: string;
  googleMapsLink: string;
  linkedinUrl: string;
  instagramUrl: string;
  footerCopyright: string;
  stats: CMSStat[];
}

export interface CMSSEO {
  homepageTitle: string;
  homepageDescription: string;
  daycareTitle: string;
  daycareDescription: string;
  eduhubTitle: string;
  eduhubDescription: string;
  blogTitle: string;
  blogDescription: string;
  defaultOGImage: string;
}

export interface CMSCTAGroup {
  primaryLabel: string;
  primaryLink: string;
  secondaryLabel: string;
  secondaryLink: string;
  stickyPrimaryLabel: string;
  stickyPrimaryLink: string;
  stickySecondaryLabel: string;
  stickySecondaryLink: string;
}

export interface CMSCTASettings {
  daycare: CMSCTAGroup;
  eduhub: CMSCTAGroup;
  homepageDaycareLabel: string;
  homepageDaycareLink: string;
  homepageEduhubLabel: string;
  homepageEduhubLink: string;
}

export interface CMSMediaItem {
  id: string;
  title: string;
  url: string;
  alt: string;
  category: 'Daycare' | 'EduHub' | 'Campus' | 'Educators' | 'Blog' | 'Testimonials' | 'General';
  status?: CMSStatus;
  active?: boolean;
}

export interface CMSTrustBadge { icon: string; text: string }

export interface CMSDaycareHero {
  eyebrow: string;
  headline: string;
  highlightWord: string;
  subtitle: string;
  primaryCTALabel: string;
  primaryCTALink: string;
  secondaryCTALabel: string;
  secondaryCTALink: string;
  heroImageUrl: string;
  trustBadges: CMSTrustBadge[];
}

export interface CMSEducator {
  id: string;
  name: string;
  displayOrder: number;
  title: string;
  qualification: string;
  specialtyBadge: string;
  bio: string;
  img: string;
  featured: boolean;
  leadership: boolean;
  active?: boolean;
  status?: CMSStatus;
}

export interface CMSTestimonial {
  id: string;
  name: string;
  role: string;
  quote: string;
  rating: number;
  highlight: string;
  avatar: string;
  featured: boolean;
  active?: boolean;
  status?: CMSStatus;
  displayOrder: number;
}

export interface CMSGalleryItem {
  id: string;
  url: string;
  alt: string;
  title: string;
  category: 'Classrooms' | 'Activity Areas' | 'Playground' | 'Dining Area' | 'Reading Corner' | 'Campus';
  caption: string;
  featured: boolean;
  active?: boolean;
  status?: CMSStatus;
  displayOrder: number;
}

export interface CMSProgram {
  id: string;
  name: string;
  ageRange: string;
  emoji: string;
  description: string;
  ratio: string;
  maxClassSize: string;
  features: string[];
  active?: boolean;
  status?: CMSStatus;
  displayOrder: number;
}

export interface CMSScheduleStep {
  id: string;
  time: string;
  title: string;
  emoji: string;
  description: string;
  whyItMatters: string;
  outcomes: string[];
  displayOrder: number;
  active?: boolean;
  status?: CMSStatus;
}

export interface CMSMenuDay { day: string; lunch: string; sides: string; emoji: string }

export interface CMSMenuWeek {
  id: string;
  season: 'winter' | 'summer';
  week: 'week1' | 'week2';
  days: CMSMenuDay[];
}

export interface CMSMeals {
  menus: CMSMenuWeek[];
  winterSnacks: string[];
  summerSnacks: string[];
  dietaryPolicy: string;
}

export interface CMSCalendarEvent {
  id: string;
  date: string;          // display string e.g. "Mon 7 Sep 2026"
  isoDate: string;       // sortable e.g. "2026-09-07"
  title: string;
  type: 'term' | 'holiday' | 'event' | 'parent' | 'closure' | 'camp';
  description?: string;
  displayOrder: number;
  active?: boolean;
}

export interface CMSPortalFile {
  id: string;
  name: string;
  category: 'newsletter' | 'form' | 'menu' | 'policy' | 'parent-info-pack' | 'programme-guide' | 'enrollment-form' | 'calendar' | 'eduhub-schedule' | 'eduhub-guide' | 'accreditation' | 'other';
  audience: 'Public' | 'Parents' | 'EduHub' | 'Internal';
  url: string;
  description?: string;
  highlights?: string[];
  displayOrder: number;
  active?: boolean;
  publishDate?: string;
}

export interface CMSCourse {
  id: string;
  level: string;
  title: string;
  description: string;
  duration: string;
  hours: string;
  cost: string;
  mode: string;
  status: 'Available' | 'Fully Booked' | 'Coming Soon';
  publishStatus?: CMSStatus;
  active?: boolean;
  outcomes: string[];
  ctaLabel: string;
  ctaLink: string;
  displayOrder: number;
  color: string;
  lightBg: string;
  border: string;
  tag: string;
}

export interface CMSAlumni {
  id: string;
  name: string;
  currentRole: string;
  completedCourse: string;
  quote: string;
  img: string;
  featured: boolean;
  active?: boolean;
  status?: CMSStatus;
  colorAccent: string;
}

export interface CMSAccreditation {
  id: string;
  name: string;
  description: string;
  detail: string;
  logoUrl: string;
  externalLink: string;
  active?: boolean;
  status?: CMSStatus;
  displayOrder: number;
}

export interface CMSBlogArticle {
  id: string;
  title: string;
  slug: string;
  audience: 'Parents' | 'Educators';
  category: string;
  excerpt: string;
  body: string;
  authorName: string;
  authorTitle: string;
  publishDate: string;
  readTime: string;
  featuredImage: string;
  featured: boolean;
  active?: boolean;
  status?: CMSStatus;
  seoTitle: string;
  seoDescription: string;
  ogImage?: string;
}

export interface CMSFAQ {
  id: string;
  group: 'Daycare' | 'EduHub' | 'General';
  question: string;
  answer: string;
  tip?: string;
  icon: string;
  displayOrder: number;
  active?: boolean;
  status?: CMSStatus;
}

export interface CMSFormSettings {
  daycareEmail: string;
  eduhubEmail: string;
  generalEmail: string;
  whatsapp: string;
  daycareThankyou: string;
  eduhubThankyou: string;
  generalThankyou: string;
  daycareEndpoint: string;
  eduhubEndpoint: string;
  generalEndpoint: string;
  redirectToWhatsApp: boolean;
  storeLocalCopy: boolean;
  emailEndpointEnabled: boolean;
}

export interface CMSEduhubHero {
  eyebrow: string;
  headline: string;
  subheadline: string;
  primaryCTALabel: string;
  primaryCTALink: string;
  secondaryCTALabel: string;
  secondaryCTALink: string;
  heroImageUrl: string;
  stats: { num: string; label: string }[];
}

export interface CMSContent {
  version: number;
  siteSettings: CMSSiteSettings;
  seo: CMSSEO;
  ctaSettings: CMSCTASettings;
  media: CMSMediaItem[];
  daycareHero: CMSDaycareHero;
  eduhubHero: CMSEduhubHero;
  educators: CMSEducator[];
  testimonials: CMSTestimonial[];
  gallery: CMSGalleryItem[];
  programs: CMSProgram[];
  schedule: CMSScheduleStep[];
  meals: CMSMeals;
  calendarEvents: CMSCalendarEvent[];
  portalFiles: CMSPortalFile[];
  courses: CMSCourse[];
  alumni: CMSAlumni[];
  accreditations: CMSAccreditation[];
  blog: CMSBlogArticle[];
  faq: CMSFAQ[];
  formSettings: CMSFormSettings;
}

export interface CMSSubmission {
  id: string;
  submittedAt: string;
  source: 'Daycare' | 'EduHub' | 'General';
  name: string;
  email: string;
  phone: string;
  message: string;
  extra: Record<string, string>;
  read: boolean;
}

// ─── Default content ──────────────────────────────────────────────────────────

export const DEFAULT_CMS: CMSContent = {
  version: 2,

  siteSettings: {
    companyName: 'Early Years Company',
    mainEmail: 'info@theearlyyearscompany.com',
    daycareEmail: 'info@theearlyyearscompany.com',
    eduhubEmail: 'eduhub@theearlyyearscompany.com',
    mainPhone: '+20 2 2615 3903',
    daycarePhone: '+20 2 2615 3903',
    eduhubPhone: '+20 111 500 4090',
    whatsapp: '+20 111 443 3382',
    address: 'AUC New Cairo Campus, Gate 3, Ring Road, Cairo',
    googleMapsLink: 'https://maps.app.goo.gl/JYf4tcxn6CyofMWU6',
    linkedinUrl: 'https://www.linkedin.com/company/early-years-daycare/',
    instagramUrl: 'https://www.instagram.com/earlyyearscompany/',
    footerCopyright: '© 2026 Early Years Company. All rights reserved.',
    stats: [
      { label: 'Years of Excellence', value: '25+' },
      { label: 'Happy Families', value: '200+' },
      { label: 'Parent Satisfaction', value: '98%' },
      { label: 'Average Rating', value: '4.9/5' },
    ],
  },

  seo: {
    homepageTitle: 'Early Years Company — Daycare & Teacher Training in Cairo',
    homepageDescription: 'Early Years Company offers play-based EYFS daycare at AUC New Cairo and UK-accredited CACHE teacher training through EduHub.',
    daycareTitle: 'Early Years Daycare at AUC New Cairo | EYFS Nursery Cairo',
    daycareDescription: 'Play-based EYFS nursery for children aged 1–5 at AUC New Cairo. 25+ years of trusted early childhood care.',
    eduhubTitle: 'EduHub by Early Years — CACHE Teacher Training Egypt',
    eduhubDescription: 'UK-accredited CACHE Level 2, 3 & 5 qualifications for early years educators in Egypt. First CACHE-approved centre in the country.',
    blogTitle: 'Blog — Early Years Company',
    blogDescription: 'Expert insights on early childhood education, parenting, and EYFS practice from the Early Years Company team.',
    defaultOGImage: '',
  },

  ctaSettings: {
    daycare: {
      primaryLabel: 'Book a Tour',
      primaryLink: '/daycare/contact',
      secondaryLabel: 'View Programs',
      secondaryLink: '/daycare/programs',
      stickyPrimaryLabel: 'Book a Tour',
      stickyPrimaryLink: '/daycare/contact',
      stickySecondaryLabel: 'View Programs',
      stickySecondaryLink: '/daycare/programs',
    },
    eduhub: {
      primaryLabel: 'Explore Courses',
      primaryLink: '/eduhub/programs',
      secondaryLabel: 'Register Interest',
      secondaryLink: '/eduhub/contact',
      stickyPrimaryLabel: 'Register Interest',
      stickyPrimaryLink: '/eduhub/contact',
      stickySecondaryLabel: 'View Courses',
      stickySecondaryLink: '/eduhub/programs',
    },
    homepageDaycareLabel: 'Find Childcare',
    homepageDaycareLink: '/daycare',
    homepageEduhubLabel: 'Become an Educator',
    homepageEduhubLink: '/eduhub',
  },

  media: [
    // ── Daycare ──────────────────────────────────────────────────────────────
    { id: 'media-daycare-hero', title: 'Daycare Hero', url: 'https://images.unsplash.com/photo-1503454537195-1dcabb73ffb9?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080', alt: 'Children playing at Early Years Daycare', category: 'Daycare' as const, active: true, status: 'published' as CMSStatus },
    { id: 'media-classroom-main', title: 'Main Classroom', url: 'https://images.unsplash.com/photo-1761208663763-c4d30657c910?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=800', alt: 'Children playing in bright classroom', category: 'Daycare' as const, active: true, status: 'published' as CMSStatus },
    { id: 'media-sensory-play', title: 'Sensory Play Area', url: 'https://images.unsplash.com/photo-1764786077942-40f305ebcd97?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=800', alt: 'Sensory water play activity', category: 'Daycare' as const, active: true, status: 'published' as CMSStatus },
    { id: 'media-playground', title: 'Outdoor Playground', url: 'https://images.unsplash.com/photo-1753488821008-10ebbe34e73e?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=800', alt: 'Children playing outside on campus', category: 'Campus' as const, active: true, status: 'published' as CMSStatus },
    { id: 'media-dining', title: 'Dining Area', url: 'https://images.unsplash.com/photo-1528960647731-ab4ec9b96a04?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=800', alt: 'Children eating lunch together', category: 'Daycare' as const, active: true, status: 'published' as CMSStatus },
    { id: 'media-reading', title: 'Reading Corner', url: 'https://images.unsplash.com/photo-1762475833776-fd57865db4d5?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=800', alt: 'Cozy reading corner', category: 'Daycare' as const, active: true, status: 'published' as CMSStatus },
    // ── Educators ────────────────────────────────────────────────────────────
    { id: 'media-educator-nesrin', title: 'Nesrin Hassanin Portrait', url: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=400', alt: 'Nesrin Hassanin, Managing Director', category: 'Educators' as const, active: true, status: 'published' as CMSStatus },
    { id: 'media-educator-sarah', title: 'Sarah Al-Masri Portrait', url: 'https://images.unsplash.com/photo-1758685847967-c598c3b176b0?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=400', alt: 'Sarah Al-Masri, Lead Educator', category: 'Educators' as const, active: true, status: 'published' as CMSStatus },
    { id: 'media-educator-nadia', title: 'Nadia Hassan Portrait', url: 'https://images.unsplash.com/photo-1607746882042-944635dfe10e?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=400', alt: 'Nadia Hassan, Nursery Room Leader', category: 'Educators' as const, active: true, status: 'published' as CMSStatus },
    { id: 'media-educator-reem', title: 'Reem Fouad Portrait', url: 'https://images.unsplash.com/photo-1761604478724-13fe879468cf?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=400', alt: 'Reem Fouad, Pre-K Lead', category: 'Educators' as const, active: true, status: 'published' as CMSStatus },
    // ── EduHub ───────────────────────────────────────────────────────────────
    { id: 'media-eduhub-hero', title: 'EduHub Hero', url: 'https://images.unsplash.com/photo-1758270704021-361c165d68fd?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080', alt: 'Teacher training at EduHub', category: 'EduHub' as const, active: true, status: 'published' as CMSStatus },
    { id: 'media-alumni-nour', title: 'Alumni Nour Abdel-Aziz', url: 'https://images.unsplash.com/photo-1758691737605-69a0e78bd193?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=400', alt: 'Nour Abdel-Aziz, CACHE Level 3 graduate', category: 'EduHub' as const, active: true, status: 'published' as CMSStatus },
    { id: 'media-alumni-yasmine', title: 'Alumni Yasmine Mostafa', url: 'https://images.unsplash.com/photo-1691256257499-25b0717e3f57?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=400', alt: 'Yasmine Mostafa, CACHE Level 5 graduate', category: 'EduHub' as const, active: true, status: 'published' as CMSStatus },
    { id: 'media-alumni-omar', title: 'Alumni Omar Khalil', url: 'https://images.unsplash.com/photo-1755718669459-a8691dd613de?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=400', alt: 'Omar Khalil, CACHE Level 2 graduate', category: 'EduHub' as const, active: true, status: 'published' as CMSStatus },
    // ── Blog ─────────────────────────────────────────────────────────────────
    { id: 'media-blog-nursery', title: 'Blog Starting Nursery', url: 'https://images.unsplash.com/photo-1503454537195-1dcabb73ffb9?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080', alt: 'Parent and child at nursery', category: 'Blog' as const, active: true, status: 'published' as CMSStatus },
    { id: 'media-blog-parent', title: 'Blog Parent and Child', url: 'https://images.unsplash.com/photo-1567680148642-ac49a46543d3?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080', alt: 'Parent and child playing together', category: 'Blog' as const, active: true, status: 'published' as CMSStatus },
  ],

  daycareHero: {
    eyebrow: '25+ Years of Excellence · Egypt\'s Most Trusted Nursery',
    headline: 'Early Years Daycare',
    highlightWord: 'at AUC',
    subtitle: 'Play-based EYFS nursery for children aged 1–5 in New Cairo.',
    primaryCTALabel: 'Book a Tour',
    primaryCTALink: '/daycare/contact',
    secondaryCTALabel: 'View Programs',
    secondaryCTALink: '/daycare/programs',
    heroImageUrl: '',
    trustBadges: [
      { icon: '🏫', text: 'AUC New Cairo' },
      { icon: '📚', text: 'EYFS Curriculum' },
      { icon: '🍽️', text: 'Fresh Daily Meals' },
      { icon: '🔒', text: 'Safe & Secure' },
    ],
  },

  eduhubHero: {
    eyebrow: 'First CACHE-Approved Centre in Egypt',
    headline: 'Advance Your Early Years Career',
    subheadline: 'EduHub is a division of Early Years Company, offering UK-accredited CACHE teacher training. We help educators across Egypt and the Middle East gain internationally recognised qualifications.',
    primaryCTALabel: 'Explore Courses',
    primaryCTALink: '/eduhub/programs',
    secondaryCTALabel: 'Register Interest',
    secondaryCTALink: '/eduhub/contact',
    heroImageUrl: '',
    stats: [
      { num: '#1', label: 'CACHE Centre in Egypt' },
      { num: '3', label: 'Qualification Levels' },
      { num: '500+', label: 'Graduates to Date' },
      { num: '100%', label: 'UK Accredited' },
    ],
  },

  educators: [
    { id: generateId(), displayOrder: 1, name: 'Nesrin Hassanin', title: 'Managing Director', qualification: 'M.Ed. (in progress) | CACHE Level 3 | 30 Years Experience', specialtyBadge: '🏛️ EYC Co-Founder', bio: 'Early Years expert with 30 years across the Middle East, co-founder of Early Years Company and two nursery schools in Egypt. Career spans direct childcare, nursery management, staff training, and startup advisory. Holds a CACHE Level 3 in Early Childhood Education and is completing a Master\'s in Leadership in Education — driven by a lifelong belief that quality Early Years care shapes every child\'s future.', img: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=400', featured: true, leadership: true, status: 'published' },
    { id: generateId(), displayOrder: 2, name: 'Lamia Hassanin', title: 'Educational Coordinator', qualification: 'AUC Early Years Education | SENCo (LRC) | Parenting Coach (Intellect)', specialtyBadge: '🏛️ EYC Co-Founder', bio: 'A founding member of Early Years Company with 18+ years at Cairo\'s most reputable nursery, where she rose to Deputy Head. Holds an Early Years Education degree from AUC, SENCo certification from LRC, and a Parenting Coach qualification from Intellect. Passionate advocate for child-led, play-based learning at every child\'s own pace.', img: '/lamia-hassanin.png', featured: true, leadership: true, status: 'published' },
    { id: generateId(), displayOrder: 3, name: 'Sarah Al-Masri', title: 'Lead Early Years Educator', qualification: 'CACHE Level 3 | 12 Years Experience', specialtyBadge: '🏅 EYFS Specialist', bio: 'Sarah specialises in language development and EYFS play-based learning. Parents describe her as the teacher who \'makes every child feel seen\'.', img: 'https://images.unsplash.com/photo-1758685847967-c598c3b176b0?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=400', featured: false, leadership: false, status: 'published' },
    { id: generateId(), displayOrder: 4, name: 'Nadia Hassan', title: 'Nursery Room Leader', qualification: 'CACHE Level 3 | 8 Years Experience', specialtyBadge: '🎓 CACHE Certified', bio: 'Nadia\'s background in child psychology brings a uniquely nurturing approach to the toddler and nursery rooms. She leads our settling-in program.', img: 'https://images.unsplash.com/photo-1607746882042-944635dfe10e?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=400', featured: false, leadership: false, status: 'published' },
    { id: generateId(), displayOrder: 5, name: 'Reem Fouad', title: 'Pre-K & School Readiness Lead', qualification: 'CACHE Level 5 | 15 Years Experience', specialtyBadge: '⭐ School Readiness', bio: 'Reem has prepared hundreds of children for primary school. Her pre-K graduates consistently receive excellent feedback from receiving schools.', img: 'https://images.unsplash.com/photo-1761604478724-13fe879468cf?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=400', featured: false, leadership: false, status: 'published' },
  ],

  testimonials: [
    { id: generateId(), displayOrder: 1, name: 'Sarah Mohamed', role: 'Parent of Layla, Age 4', quote: 'Early Years has been a blessing for our family. Layla loves going to daycare every morning! The teachers are so caring and the EYFS curriculum has really helped her development. We see progress every week.', rating: 5, highlight: 'Amazing staff and curriculum', avatar: 'https://images.unsplash.com/photo-1628676348963-f88c671333f6?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=200', featured: true, status: 'published' },
    { id: generateId(), displayOrder: 2, name: 'Ahmed Hassan', role: 'AUC Staff, Parent of twins', quote: 'As AUC staff, having the daycare on campus is incredibly convenient. The twins are safe, happy, and learning so much. The daily updates give us peace of mind, and the meals are always nutritious and fresh.', rating: 5, highlight: 'Convenient and trustworthy', avatar: 'https://images.unsplash.com/photo-1685580388390-576100ae9ce3?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=200', featured: true, status: 'published' },
    { id: generateId(), displayOrder: 3, name: 'Noha Ibrahim', role: 'Parent of Omar, Age 3', quote: 'Omar started at Early Years when he was 2, and the transformation has been incredible. He\'s more confident, social, and curious. The play-based learning approach works wonders. I recommend it to all my friends!', rating: 5, highlight: 'Incredible transformation', avatar: 'https://images.unsplash.com/photo-1624272864537-8ecc72b67958?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=200', featured: false, status: 'published' },
    { id: generateId(), displayOrder: 4, name: 'Karim Ali', role: 'Parent of Malak, Age 5', quote: 'The professionalism and warmth of the Early Years team is unmatched. Malak has been attending for 3 years and is now fully ready for school. The 25 years of experience really shows in everything they do.', rating: 5, highlight: 'Professional and warm', avatar: 'https://images.unsplash.com/photo-1774641374101-0c5a243b7e7e?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=200', featured: false, status: 'published' },
    { id: generateId(), displayOrder: 5, name: 'Dina Youssef', role: 'Parent of twins, Ages 6 & 8', quote: 'The After-School program has been a lifesaver! The kids get homework help, creative activities, and healthy meals. They come home happy and we have peace of mind knowing they\'re in great hands.', rating: 5, highlight: 'Perfect after-school care', avatar: 'https://images.unsplash.com/photo-1567680148642-ac49a46543d3?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=200', featured: false, status: 'published' },
    { id: generateId(), displayOrder: 6, name: 'Hossam Farid', role: 'Parent of Jana, Age 4', quote: 'From the moment we toured the facility, we knew this was the right place. The classrooms are bright and engaging, the outdoor play area is amazing, and most importantly, Jana absolutely loves her teachers.', rating: 5, highlight: 'Perfect environment for learning', avatar: 'https://images.unsplash.com/photo-1564429238817-393bd4286b2d?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=200', featured: false, status: 'published' },
  ],

  gallery: [
    { id: generateId(), displayOrder: 1, url: 'https://images.unsplash.com/photo-1761208663763-c4d30657c910?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=800', alt: 'Children playing in bright classroom', title: 'Main Classroom', category: 'Classrooms', caption: 'Classrooms', featured: true, status: 'published' },
    { id: generateId(), displayOrder: 2, url: 'https://images.unsplash.com/photo-1764786077942-40f305ebcd97?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=800', alt: 'Sensory water play activity', title: 'Sensory Play', category: 'Activity Areas', caption: 'Activity Areas', featured: false, status: 'published' },
    { id: generateId(), displayOrder: 3, url: 'https://images.unsplash.com/photo-1753488821008-10ebbe34e73e?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=800', alt: 'Outdoor playground', title: 'Outdoor Playground', category: 'Playground', caption: 'Playground', featured: false, status: 'published' },
    { id: generateId(), displayOrder: 4, url: 'https://images.unsplash.com/photo-1528960647731-ab4ec9b96a04?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=800', alt: 'Children eating lunch together', title: 'Dining Area', category: 'Dining Area', caption: 'Dining Area', featured: false, status: 'published' },
    { id: generateId(), displayOrder: 5, url: 'https://images.unsplash.com/photo-1762475833776-fd57865db4d5?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=800', alt: 'Cozy reading corner', title: 'Reading Corner', category: 'Reading Corner', caption: 'Reading Corner', featured: false, status: 'published' },
  ],

  programs: [
    { id: generateId(), displayOrder: 1, name: 'Butterflies Class', ageRange: '1–2 Years', emoji: '🦋', description: 'Gentle, home-like setting where little ones discover the world through touch, sound, and play.', ratio: '1 : 4', maxClassSize: 'Max 8 children', features: ['Sensory play stations', 'Language-rich environment', 'Outdoor sensory garden'], status: 'published' },
    { id: generateId(), displayOrder: 2, name: 'Bees Class', ageRange: '2–3 Years', emoji: '🐝', description: 'Curiosity-led learning through art, music, stories, and outdoor adventures.', ratio: '1 : 5', maxClassSize: 'Max 10 children', features: ['Creative arts & crafts', 'Music & movement', 'Outdoor play daily'], status: 'published' },
    { id: generateId(), displayOrder: 3, name: 'Ladybirds Class', ageRange: '3–4 Years', emoji: '🐞', description: 'Structured play-based learning building school readiness through EYFS activities.', ratio: '1 : 6', maxClassSize: 'Max 12 children', features: ['Phonics & early literacy', 'Number sense activities', 'Project-based learning'], status: 'published' },
    { id: generateId(), displayOrder: 4, name: 'Spiders Class', ageRange: '3.5–4.5 Years', emoji: '🕷️', description: 'Building independence and critical thinking through collaborative projects.', ratio: '1 : 7', maxClassSize: 'Max 14 children', features: ['Science experiments', 'Creative writing', 'Team projects'], status: 'published' },
    { id: generateId(), displayOrder: 5, name: 'Dragonflies Class', ageRange: '4–5 Years', emoji: '🦋', description: 'School readiness programme preparing children for Year 1 with confidence.', ratio: '1 : 8', maxClassSize: 'Max 16 children', features: ['Literacy & numeracy', 'School transition support', 'Assessment & reports'], status: 'published' },
  ],

  schedule: [
    { id: generateId(), displayOrder: 1, time: '7:30 AM', title: 'Warm Arrival & Welcome', emoji: '🌅', description: 'Each child is greeted by name and settles into familiar activities.', whyItMatters: 'A consistent arrival routine helps children feel emotionally regulated.', outcomes: ['Emotional Wellbeing', 'Communication'], status: 'published' },
    { id: generateId(), displayOrder: 2, time: '8:00 AM', title: 'Free Play', emoji: '🎮', description: 'Child-led exploration across dedicated learning zones.', whyItMatters: 'Free play is the most powerful learning mode for young children.', outcomes: ['Problem Solving', 'Creativity', 'Social Skills'], status: 'published' },
    { id: generateId(), displayOrder: 3, time: '9:00 AM', title: 'Circle Time', emoji: '🟢', description: 'Songs, stories, the calendar, weather, and sharing time.', whyItMatters: 'Sustained shared thinking is one of the strongest predictors of early learning outcomes.', outcomes: ['Literacy & Language', 'Music & Rhythm', 'Attention & Focus'], status: 'published' },
    { id: generateId(), displayOrder: 4, time: '10:00 AM', title: 'Outdoor Play', emoji: '🌿', description: 'Running, climbing, digging, and exploring on our AUC campus grounds.', whyItMatters: 'Children who spend at least 60 minutes outdoors daily show stronger physical development.', outcomes: ['Physical Development', 'Understanding the World', 'Wellbeing'], status: 'published' },
    { id: generateId(), displayOrder: 5, time: '11:00 AM', title: 'Creative Activity', emoji: '🎨', description: 'Rotating EYFS-linked projects: painting, science experiments, sensory play.', whyItMatters: 'Open-ended art activities build fine motor control and self-expression.', outcomes: ['Expressive Arts', 'Early Maths', 'Fine Motor Skills'], status: 'published' },
    { id: generateId(), displayOrder: 6, time: '12:00 PM', title: 'Lunch & Meals', emoji: '🍎', description: 'Fresh, nutritious meals served family-style.', whyItMatters: 'Our weekly menu rotates to introduce a variety of flavours and food groups.', outcomes: ['Independence', 'Healthy Habits', 'Table Manners'], status: 'published' },
    { id: generateId(), displayOrder: 7, time: '1:00 PM', title: 'Rest & Quiet Time', emoji: '💤', description: 'Younger children nap; older children enjoy quiet reading or puzzles.', whyItMatters: 'Sleep consolidates memory and supports emotional regulation.', outcomes: ['Rest & Wellbeing', 'Memory Consolidation'], status: 'published' },
    { id: generateId(), displayOrder: 8, time: '2:00 PM', title: 'Storytime & Afternoon Activity', emoji: '📖', description: 'Shared reading, puppet shows, or afternoon EYFS activities.', whyItMatters: 'Children who are read to daily develop larger vocabularies by age 5.', outcomes: ['Literacy', 'Imagination', 'Vocabulary'], status: 'published' },
    { id: generateId(), displayOrder: 9, time: '3:00 PM', title: 'Home Time', emoji: '🏡', description: 'A warm, calm close to the day with a written daily note for parents.', whyItMatters: 'Every parent receives a written daily update at pickup.', outcomes: ['Parent Partnership', 'Smooth Transitions'], status: 'published' },
  ],

  meals: {
    menus: [
      { id: generateId(), season: 'winter', week: 'week1', days: [{ day: 'Sunday', lunch: 'Pasta Bolognese', sides: 'Garden salad + fruit', emoji: '🍝' }, { day: 'Monday', lunch: 'Rice & Grilled Chicken', sides: 'Steamed veg + yoghurt', emoji: '🍚' }, { day: 'Tuesday', lunch: 'Lentil Soup & Bread', sides: 'Fresh fruit cup', emoji: '🍲' }, { day: 'Wednesday', lunch: 'Chicken Wraps', sides: 'Cucumber & carrot sticks', emoji: '🌯' }, { day: 'Thursday', lunch: 'Rice & Baked Fish', sides: 'Mixed salad + fruit', emoji: '🐟' }] },
      { id: generateId(), season: 'winter', week: 'week2', days: [{ day: 'Sunday', lunch: 'Macaroni Béchamel', sides: 'Side salad + orange', emoji: '🧀' }, { day: 'Monday', lunch: 'Chicken Soup & Rice', sides: 'Bread + yoghurt', emoji: '🍜' }, { day: 'Tuesday', lunch: 'Kofta & Rice', sides: 'Steamed broccoli + fruit', emoji: '🥩' }, { day: 'Wednesday', lunch: 'Cheese Omelette & Toast', sides: 'Tomato salad', emoji: '🍳' }, { day: 'Thursday', lunch: 'Pasta with Tomato Sauce', sides: 'Green salad + fruit', emoji: '🍝' }] },
      { id: generateId(), season: 'summer', week: 'week1', days: [{ day: 'Sunday', lunch: 'Grilled Chicken & Rice', sides: 'Cucumber salad + watermelon', emoji: '🍗' }, { day: 'Monday', lunch: 'Tuna Salad Sandwich', sides: 'Fresh fruit platter', emoji: '🥪' }, { day: 'Tuesday', lunch: 'Pasta Primavera', sides: 'Mixed salad + melon', emoji: '🍝' }, { day: 'Wednesday', lunch: 'Rice & Grilled Fish', sides: 'Tomato salad + orange', emoji: '🐟' }, { day: 'Thursday', lunch: 'Chicken Burger & Salad', sides: 'Fresh fruit cup', emoji: '🍔' }] },
      { id: generateId(), season: 'summer', week: 'week2', days: [{ day: 'Sunday', lunch: 'Grilled Kofta & Rice', sides: 'Green salad + grapes', emoji: '🥩' }, { day: 'Monday', lunch: 'Pasta with Pesto', sides: 'Cucumber sticks + melon', emoji: '🍝' }, { day: 'Tuesday', lunch: 'Rice & Baked Chicken', sides: 'Tossed salad + fruit', emoji: '🍗' }, { day: 'Wednesday', lunch: 'Vegetable Soup & Bread', sides: 'Fruit cup', emoji: '🥣' }, { day: 'Thursday', lunch: 'Fish Fingers & Rice', sides: 'Coleslaw + watermelon', emoji: '🐟' }] },
    ],
    winterSnacks: ['🍌 Fresh Banana', '🍊 Orange Slices', '🥦 Raw Veg Sticks', '🧀 Cheese & Crackers', '🥛 Milk', '🍇 Grapes'],
    summerSnacks: ['🍉 Watermelon', '🍓 Strawberries', '🥒 Cucumber Sticks', '🧃 Fresh Juice', '🥛 Milk', '🍑 Peach Slices'],
    dietaryPolicy: 'All meals are nut-free and prepared on-site by our kitchen team. We accommodate vegetarian, halal, and specific allergy requirements — just let us know on your application.',
  },

  calendarEvents: [
    { id: generateId(), displayOrder: 1,  isoDate: '2025-09-07', date: 'Sun 7 Sep 2025',  title: 'Autumn term begins',                         type: 'term',    active: true },
    { id: generateId(), displayOrder: 2,  isoDate: '2025-09-07', date: 'Sun 7 Sep 2025',  title: 'Welcome morning (9:00 – 10:30)',              type: 'event',   active: true },
    { id: generateId(), displayOrder: 3,  isoDate: '2025-10-02', date: 'Thu 2 Oct 2025',  title: 'Parent–teacher consultations',                type: 'parent',  active: true },
    { id: generateId(), displayOrder: 4,  isoDate: '2025-10-23', date: 'Thu 23 Oct 2025', title: 'Half-term begins',                            type: 'holiday', active: true },
    { id: generateId(), displayOrder: 5,  isoDate: '2025-11-02', date: 'Sun 2 Nov 2025',  title: 'Term resumes',                                type: 'term',    active: true },
    { id: generateId(), displayOrder: 6,  isoDate: '2025-12-18', date: 'Thu 18 Dec 2025', title: 'Christmas concert 🎄',                        type: 'event',   active: true },
    { id: generateId(), displayOrder: 7,  isoDate: '2025-12-18', date: 'Thu 18 Dec 2025', title: 'Autumn term ends',                            type: 'holiday', active: true },
    { id: generateId(), displayOrder: 8,  isoDate: '2026-01-04', date: 'Sun 4 Jan 2026',  title: 'Spring term begins',                          type: 'term',    active: true },
    { id: generateId(), displayOrder: 9,  isoDate: '2026-01-04', date: 'Sun 4 Jan 2026',  title: 'Welcome back morning',                        type: 'event',   active: true },
    { id: generateId(), displayOrder: 10, isoDate: '2026-02-19', date: 'Thu 19 Feb 2026', title: 'Half-term begins',                            type: 'holiday', active: true },
    { id: generateId(), displayOrder: 11, isoDate: '2026-03-01', date: 'Sun 1 Mar 2026',  title: 'Term resumes',                                type: 'term',    active: true },
    { id: generateId(), displayOrder: 12, isoDate: '2026-03-15', date: 'Sun 15 Mar 2026', title: 'Ramadan break begins',                        type: 'holiday', active: true },
    { id: generateId(), displayOrder: 13, isoDate: '2026-04-12', date: 'Sun 12 Apr 2026', title: 'Spring term resumes',                         type: 'term',    active: true },
    { id: generateId(), displayOrder: 14, isoDate: '2026-04-16', date: 'Thu 16 Apr 2026', title: 'Parent–teacher consultations',                type: 'parent',  active: true },
    { id: generateId(), displayOrder: 15, isoDate: '2026-05-28', date: 'Thu 28 May 2026', title: 'Spring term ends',                            type: 'holiday', active: true },
    { id: generateId(), displayOrder: 16, isoDate: '2026-06-07', date: 'Sun 7 Jun 2026',  title: 'Summer programme begins',                     type: 'camp',    active: true },
    { id: generateId(), displayOrder: 17, isoDate: '2026-07-02', date: 'Thu 2 Jul 2026',  title: 'Graduation ceremony 🎓',                      type: 'event',   active: true },
    { id: generateId(), displayOrder: 18, isoDate: '2026-07-30', date: 'Thu 30 Jul 2026', title: 'Summer programme ends',                       type: 'camp',    active: true },
    { id: generateId(), displayOrder: 19, isoDate: '2026-09-06', date: 'Sun 6 Sep 2026',  title: 'New academic year begins 2026–2027',          type: 'term',    active: true },
  ],

  portalFiles: [
    { id: generateId(), displayOrder: 1, category: 'newsletter', audience: 'Parents', name: 'May 2026 Newsletter', url: '/newsletters/May_Newsletter.pdf', description: 'End-of-year celebrations, graduation news, summer programme', highlights: ['Graduation ceremony', 'Summer programme enrolment', 'End-of-year events'], publishDate: '2026-05-01', active: true },
    { id: generateId(), displayOrder: 2, category: 'newsletter', audience: 'Parents', name: 'April 2026 Newsletter', url: '/newsletters/April_Newsletter.pdf', description: 'Ramadan celebrations, Easter activities, spring events', highlights: ['Ramadan lantern making', 'Easter egg hunt', 'Garden project'], publishDate: '2026-04-01', active: true },
    { id: generateId(), displayOrder: 3, category: 'newsletter', audience: 'Parents', name: 'March 2026 Newsletter', url: '/newsletters/March_Newsletter.pdf', description: 'Spring term highlights, parent-teacher meetings', highlights: ['Parent consultations', 'Literacy week', 'Garden project launch'], publishDate: '2026-03-01', active: true },
    { id: generateId(), displayOrder: 4, category: 'newsletter', audience: 'Parents', name: 'February 2026 Newsletter', url: '/newsletters/February_Newsletter.pdf', description: 'Winter celebrations, literacy week, staff news', highlights: ['Winter celebrations', 'Literacy week', 'New staff welcome'], publishDate: '2026-02-01', active: true },
    { id: generateId(), displayOrder: 5, category: 'newsletter', audience: 'Parents', name: 'January 2026 Newsletter', url: '/newsletters/January_Newsletter_2026.pdf', description: 'New term welcome, programme updates, policy reminders', highlights: ['New year welcome', 'Programme updates', 'Policy reminders'], publishDate: '2026-01-01', active: true },
    { id: generateId(), displayOrder: 6, category: 'enrollment-form', audience: 'Public', name: 'Medical Information Update', url: '/forms/medical-update-form.pdf', description: 'Update emergency contacts and medical needs', active: true },
    { id: generateId(), displayOrder: 7, category: 'form', audience: 'Parents', name: 'Permission Slip — Field Trips', url: '/forms/permission-trips.pdf', description: 'Annual consent for day trips and outings', active: true },
    { id: generateId(), displayOrder: 8, category: 'form', audience: 'Parents', name: 'Media Consent Form', url: '/forms/media-consent.pdf', description: 'Photography and video permission for activities', active: true },
    { id: generateId(), displayOrder: 9, category: 'form', audience: 'Parents', name: 'Allergy & Dietary Notification', url: '/forms/allergy-form.pdf', description: 'Update dietary requirements and allergy alerts', active: true },
    { id: generateId(), displayOrder: 10, category: 'policy', audience: 'Parents', name: 'Parent Handbook 2025–2026', url: '/forms/parent-handbook.pdf', description: 'Complete guide to policies, procedures and expectations', active: true },
  ],

  courses: [
    { id: generateId(), displayOrder: 1, level: 'CACHE Level 2', title: 'Caring for Children and Young People', description: 'Your entry point into early years. Gain foundational knowledge and open the door to a rewarding career with children.', duration: '6–9 months', hours: '3 hours/week', cost: 'Contact for pricing', mode: 'Hybrid (in-person & online)', status: 'Available', publishStatus: 'published', outcomes: ['Child development fundamentals', 'Safe practice & safeguarding', 'Communication with children'], ctaLabel: 'View Course Details', ctaLink: '/eduhub/programs', color: 'from-blue-400 to-blue-600', lightBg: 'bg-blue-50', border: 'border-blue-200', tag: 'bg-blue-100 text-blue-700' },
    { id: generateId(), displayOrder: 2, level: 'CACHE Level 3', title: 'Diploma for Early Years Workforce', description: 'The most in-demand qualification for nursery practitioners. Covers birth to 5 with knowledge extending to age 7.', duration: '9–12 months', hours: '3 hours/week', cost: 'Contact for pricing', mode: 'Hybrid (in-person & online)', status: 'Available', publishStatus: 'published', outcomes: ['EYFS curriculum mastery', 'Observation & assessment', 'Safeguarding & welfare'], ctaLabel: 'View Course Details', ctaLink: '/eduhub/programs', color: 'from-indigo-400 to-indigo-600', lightBg: 'bg-indigo-50', border: 'border-indigo-200', tag: 'bg-indigo-100 text-indigo-700' },
    { id: generateId(), displayOrder: 3, level: 'CACHE Level 5', title: 'Diploma for Early Years Leadership', description: 'Designed for practitioners ready to lead. Build the skills to manage settings, mentor teams, and shape provision.', duration: '9–12 months', hours: '3 hours/week', cost: 'Contact for pricing', mode: 'Hybrid (in-person & online)', status: 'Available', publishStatus: 'published', outcomes: ['Leadership & management', 'Quality improvement', 'Mentoring & coaching'], ctaLabel: 'View Course Details', ctaLink: '/eduhub/programs', color: 'from-purple-400 to-purple-600', lightBg: 'bg-purple-50', border: 'border-purple-200', tag: 'bg-purple-100 text-purple-700' },
  ],

  alumni: [
    { id: generateId(), name: 'Nour Abdel-Aziz', currentRole: 'Lead Educator, Cairo British Nursery', completedCourse: 'CACHE Level 3 Graduate', quote: 'EduHub changed my career completely. I came in as a teaching assistant with no formal qualification — I left as a confident, certified Lead Educator. The practical placement was invaluable.', img: 'https://images.unsplash.com/photo-1758691737605-69a0e78bd193?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=400', featured: true, status: 'published', colorAccent: 'bg-blue-600' },
    { id: generateId(), name: 'Yasmine Mostafa', currentRole: 'Nursery Director, AUC Early Years', completedCourse: 'CACHE Level 5 Graduate', quote: 'The Level 5 gave me the leadership framework I needed. Within six months of graduating I was managing a team of 12 educators. The UK accreditation opened doors I didn\'t expect.', img: 'https://images.unsplash.com/photo-1691256257499-25b0717e3f57?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=400', featured: true, status: 'published', colorAccent: 'bg-indigo-600' },
    { id: generateId(), name: 'Omar Khalil', currentRole: 'EYFS Practitioner, International School', completedCourse: 'CACHE Level 2 Graduate', quote: 'I switched careers at 32 and had no background in education. EduHub\'s team made the process smooth and supportive. The Level 2 gave me the confidence to take the leap.', img: 'https://images.unsplash.com/photo-1755718669459-a8691dd613de?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=400', featured: false, status: 'published', colorAccent: 'bg-violet-600' },
  ],

  accreditations: [
    { id: generateId(), displayOrder: 1, name: 'CACHE', description: 'UK-recognised qualifications', detail: 'Leading awarding organisation for early years', logoUrl: '', externalLink: 'https://www.ncfe.org.uk', status: 'published' },
    { id: generateId(), displayOrder: 2, name: 'NCFE', description: 'Official UK recognition', detail: 'Recognised by UK education regulators', logoUrl: '', externalLink: 'https://www.ncfe.org.uk', status: 'published' },
    { id: generateId(), displayOrder: 3, name: 'BriteThink UK', description: 'Quality assurance partner', detail: 'Provides assessment and content support', logoUrl: '', externalLink: '', status: 'published' },
  ],

  blog: [
    {
      id: generateId(),
      title: 'May 2026 Newsletter — End of Year Celebrations',
      slug: 'newsletter-may-2026',
      audience: 'Parents',
      category: 'Newsletter',
      excerpt: 'As we approach the end of the 2025–2026 academic year, we celebrate our children\'s incredible growth, upcoming graduation events, and summer programme details.',
      body: `Dear Early Years families,\n\nWhat a wonderful year it has been! As we approach the end of term, we are filled with pride looking back at everything our children have achieved.\n\n## Highlights This Month\n\nOur children have been busy preparing for the end-of-year celebrations. The Butterflies class has been working on their graduation project, while the Bees have been exploring the world of insects in our garden.\n\n## Upcoming Events\n\n- **Graduation Ceremony**: Details coming soon\n- **Summer Programme**: Enrolment now open\n- **End of Term**: Contact the office for exact dates\n\n## A Note from the Team\n\nThank you for your continued trust and partnership throughout this year. We look forward to seeing you at our end-of-year events.\n\nWith warm wishes,\nThe Early Years Team`,
      authorName: 'The Early Years Team',
      authorTitle: 'Early Years — The Daycare',
      publishDate: '2026-05-01',
      readTime: '4 min',
      featuredImage: 'https://images.unsplash.com/photo-1503454537195-1dcabb73ffb9?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080',
      featured: true,
      status: 'published',
      seoTitle: 'May 2026 Newsletter | Early Years Daycare',
      seoDescription: 'End of year celebrations, graduation events, and summer programme details from Early Years The Daycare.',
    },
    {
      id: generateId(),
      title: 'April 2026 Newsletter — Ramadan, Easter & Spring Activities',
      slug: 'newsletter-april-2026',
      audience: 'Parents',
      category: 'Newsletter',
      excerpt: 'April brought Ramadan celebrations, Easter activities, and a wonderful mix of cultural learning. Plus updates on new enrolments and upcoming events.',
      body: `Dear Early Years families,\n\nApril was a month of rich cultural experiences and joyful celebrations at Early Years.\n\n## Ramadan at Early Years\n\nWe celebrated Ramadan with lantern-making, stories, and special activities that helped our children understand and appreciate this important time of year.\n\n## Easter Activities\n\nOur Easter egg hunt was a huge success! Children in all classrooms took part in games, crafts, and storytelling.\n\n## Spring Is Here\n\nOur garden project is in full bloom. Children have been planting seeds, learning about growth cycles, and caring for our small vegetable patch.\n\n## New Enrolments\n\nWe are delighted to welcome several new families to our Early Years community this month.\n\nWith warm wishes,\nThe Early Years Team`,
      authorName: 'The Early Years Team',
      authorTitle: 'Early Years — The Daycare',
      publishDate: '2026-04-01',
      readTime: '4 min',
      featuredImage: 'https://images.unsplash.com/photo-1567680148642-ac49a46543d3?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080',
      featured: false,
      status: 'published',
      seoTitle: 'April 2026 Newsletter | Early Years Daycare',
      seoDescription: 'Ramadan celebrations, Easter activities and spring events at Early Years The Daycare in April 2026.',
    },
    {
      id: generateId(),
      title: 'March 2026 Newsletter — Spring Events & Parent Meetings',
      slug: 'newsletter-march-2026',
      audience: 'Parents',
      category: 'Newsletter',
      excerpt: 'Spring is in the air! This month we held parent-teacher meetings, launched our garden project, and continued our exploration-based learning programmes.',
      body: `Dear Early Years families,\n\nMarch has been a busy and rewarding month at Early Years. Our children are thriving and we have so much to share.\n\n## Parent-Teacher Meetings\n\nThank you to all families who attended our parent-teacher consultations this month. Your engagement and support make such a difference to your child's learning journey.\n\n## Garden Project Launch\n\nWe are excited to announce the launch of our sensory garden project. Children will be growing vegetables, herbs, and flowers throughout the spring and summer terms.\n\n## Literacy Week\n\nOur special Literacy Week was a highlight of the month, with storytelling sessions, author visits, and reading challenges for every classroom.\n\nWith warm wishes,\nThe Early Years Team`,
      authorName: 'The Early Years Team',
      authorTitle: 'Early Years — The Daycare',
      publishDate: '2026-03-01',
      readTime: '3 min',
      featuredImage: 'https://images.unsplash.com/photo-1587654780291-39c9404d746b?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080',
      featured: false,
      status: 'published',
      seoTitle: 'March 2026 Newsletter | Early Years Daycare',
      seoDescription: 'Spring events, parent-teacher meetings, and garden project launch at Early Years The Daycare.',
    },
    {
      id: generateId(),
      title: 'February 2026 Newsletter — Winter Celebrations & Literacy',
      slug: 'newsletter-february-2026',
      audience: 'Parents',
      category: 'Newsletter',
      excerpt: 'February brought winter celebrations, our annual Literacy Week, and important staff news. A warm and wonderful month at Early Years.',
      body: `Dear Early Years families,\n\nFebruary flew by in a wonderful blur of activities, celebrations, and learning at Early Years.\n\n## Winter Celebrations\n\nOur winter celebrations brought children, families and staff together for crafts, music, and seasonal activities across all classrooms.\n\n## Literacy Week\n\nWe are proud of our commitment to early literacy. This month, Literacy Week saw every classroom buzzing with stories, rhymes, poetry and shared reading.\n\n## Staff News\n\nWe are pleased to welcome a new member to our teaching team. Further details were shared at the welcome morning.\n\n## Looking Ahead\n\nSpring term is shaping up to be an exciting one. Watch this space for upcoming events and activities.\n\nWith warm wishes,\nThe Early Years Team`,
      authorName: 'The Early Years Team',
      authorTitle: 'Early Years — The Daycare',
      publishDate: '2026-02-01',
      readTime: '3 min',
      featuredImage: 'https://images.unsplash.com/photo-1762475833776-fd57865db4d5?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080',
      featured: false,
      status: 'published',
      seoTitle: 'February 2026 Newsletter | Early Years Daycare',
      seoDescription: 'Winter celebrations, literacy week highlights and staff news from Early Years The Daycare.',
    },
    {
      id: generateId(),
      title: 'January 2026 Newsletter — New Term Welcome',
      slug: 'newsletter-january-2026',
      audience: 'Parents',
      category: 'Newsletter',
      excerpt: 'Welcome back to a brand new year! January brought a fresh start, programme updates, important policy reminders, and lots of excitement from children returning to the nursery.',
      body: `Dear Early Years families,\n\nWelcome back and Happy New Year! We are so excited to begin 2026 together with all of our wonderful Early Years families.\n\n## A New Year at Early Years\n\nThe children returned full of energy and enthusiasm. Classrooms have been refreshed with new resources, and we have exciting themes planned for each term.\n\n## Programme Updates\n\nWe are delighted to announce some updates to our weekly programming, including new enrichment activities and enhanced outdoor learning sessions.\n\n## Important Policy Reminders\n\nPlease review the Parent Handbook for updated drop-off and collection procedures, illness policies, and communication guidelines. Copies are available from the office.\n\n## Thank You\n\nThank you for choosing Early Years. We are honoured to be part of your child's early learning journey.\n\nWith warm wishes,\nThe Early Years Team`,
      authorName: 'The Early Years Team',
      authorTitle: 'Early Years — The Daycare',
      publishDate: '2026-01-01',
      readTime: '4 min',
      featuredImage: 'https://images.unsplash.com/photo-1759772238042-3d95f8256381?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080',
      featured: false,
      status: 'published',
      seoTitle: 'January 2026 Newsletter | Early Years Daycare',
      seoDescription: 'New term welcome, programme updates and policy reminders from Early Years The Daycare, January 2026.',
    },
  ],

  faq: [
    { id: generateId(), displayOrder: 1, group: 'Daycare', question: 'What ages do you accept?', answer: 'We welcome children from 1 to 10 years old. Our Preschool Program serves ages 1–5, while our After-School Program caters to children up to 10 years old.', tip: 'Early Years is one of the few centres in Egypt with 25 years of EYFS experience!', icon: '👶', status: 'published' },
    { id: generateId(), displayOrder: 2, group: 'Daycare', question: 'What are your operating hours?', answer: 'We are open Sunday through Thursday from 8:15 AM to 4:00 PM. Tours can be scheduled between 10:30 AM to 12:00 PM with 1 day advance notice.', tip: 'Early drop-off or late pick-up? Contact us to discuss flexible arrangements!', icon: '🕐', status: 'published' },
    { id: generateId(), displayOrder: 3, group: 'Daycare', question: 'What curriculum do you follow?', answer: 'We follow the UK Early Years Foundation Stage (EYFS) curriculum, which is play-based and focuses on holistic child development.', tip: 'The EYFS framework is recognised worldwide as a gold standard for early years education!', icon: '📚', status: 'published' },
    { id: generateId(), displayOrder: 4, group: 'Daycare', question: 'Do you provide meals?', answer: 'Yes! We provide freshly cooked, nutritious meals daily, prepared on-site by our kitchen staff.', tip: 'We accommodate dietary restrictions and allergies. Just let us know your child\'s needs!', icon: '🍽️', status: 'published' },
    { id: generateId(), displayOrder: 5, group: 'Daycare', question: 'How do I enrol my child?', answer: 'Start by booking a tour to visit our facility and meet our team. After your tour, you can complete the registration form and submit required documents.', tip: 'Book your tour at least 1 day in advance for the best experience!', icon: '📝', status: 'published' },
    { id: generateId(), displayOrder: 6, group: 'Daycare', question: 'What is the student-to-teacher ratio?', answer: 'We maintain small group sizes: 1:3 for children under 2, 1:4 for 2-year-olds, and 1:8 for children 3–5 years old.', tip: 'Small class sizes mean more one-on-one time for your child to thrive!', icon: '👥', status: 'published' },
    { id: generateId(), displayOrder: 7, group: 'Daycare', question: 'How do you communicate with parents?', answer: 'You\'ll receive daily updates about your child\'s activities, meals, and progress. We also hold regular parent-teacher meetings.', tip: 'Stay connected through our parent communication app for real-time updates!', icon: '💬', status: 'published' },
    { id: generateId(), displayOrder: 8, group: 'Daycare', question: 'Is the facility safe and secure?', answer: 'Safety is our top priority. Our facility features secure entry systems, CCTV monitoring, child-safe furniture, regular safety drills, and trained staff with first aid certification.', tip: 'All visitors must check in at reception — your child\'s safety comes first!', icon: '🔒', status: 'published' },
  ],

  formSettings: {
    daycareEmail: 'info@theearlyyearscompany.com',
    eduhubEmail: 'eduhub@theearlyyearscompany.com',
    generalEmail: 'info@theearlyyearscompany.com',
    whatsapp: '+20 111 443 3382',
    daycareThankyou: 'Thank you! Your enquiry has been sent to the Early Years team.',
    eduhubThankyou: 'Thank you! Your registration of interest has been sent to the EduHub team.',
    generalThankyou: 'Thank you for reaching out! We\'ll be in touch shortly.',
    daycareEndpoint: '',
    eduhubEndpoint: '',
    generalEndpoint: '',
    redirectToWhatsApp: false,
    storeLocalCopy: true,
    emailEndpointEnabled: true,
  },
};

// ─── Storage helpers ──────────────────────────────────────────────────────────

export function loadCMS(): CMSContent {
  try {
    const raw = localStorage.getItem(CMS_KEY);
    if (!raw) return DEFAULT_CMS;
    const parsed = JSON.parse(raw) as CMSContent;
    return migrate({ ...DEFAULT_CMS, ...parsed });
  } catch {
    return DEFAULT_CMS;
  }
}

function migrate(cms: CMSContent): CMSContent {
  // Convert active boolean to status if status missing
  const conv = (r: { active?: boolean; status?: CMSStatus }) => {
    if (!r.status) r.status = r.active !== false ? 'published' : 'hidden';
    return r;
  };
  return {
    ...cms,
    educators: cms.educators?.map(e => conv(e) as CMSEducator) ?? DEFAULT_CMS.educators,
    testimonials: cms.testimonials?.map(t => conv(t) as CMSTestimonial) ?? DEFAULT_CMS.testimonials,
    gallery: cms.gallery?.map(g => conv(g) as CMSGalleryItem) ?? DEFAULT_CMS.gallery,
    programs: cms.programs?.map(p => conv(p) as CMSProgram) ?? DEFAULT_CMS.programs,
    schedule: cms.schedule?.map(s => conv(s) as CMSScheduleStep) ?? DEFAULT_CMS.schedule,
    courses: cms.courses?.map(c => { if (!c.publishStatus) c.publishStatus = c.active !== false ? 'published' : 'hidden'; return c; }) ?? DEFAULT_CMS.courses,
    alumni: cms.alumni?.map(a => conv(a) as CMSAlumni) ?? DEFAULT_CMS.alumni,
    accreditations: cms.accreditations?.map(a => conv(a) as CMSAccreditation) ?? DEFAULT_CMS.accreditations,
    blog: cms.blog?.map(b => conv(b) as CMSBlogArticle) ?? [],
    faq: cms.faq?.map(f => conv(f) as CMSFAQ) ?? DEFAULT_CMS.faq,
    calendarEvents: cms.calendarEvents?.map(e => conv(e) as CMSCalendarEvent) ?? DEFAULT_CMS.calendarEvents,
    portalFiles: cms.portalFiles?.map(f => conv(f) as CMSPortalFile) ?? DEFAULT_CMS.portalFiles,
    seo: cms.seo ?? DEFAULT_CMS.seo,
    ctaSettings: cms.ctaSettings ?? DEFAULT_CMS.ctaSettings,
    formSettings: (() => {
      const saved = { ...DEFAULT_CMS.formSettings, ...(cms.formSettings ?? {}) };
      // Replace lingering test/placeholder addresses with the correct ones
      const OLD_DAYCARE = ['shehabdiaa12345@gmail.com', 'shehabelsheikh@aucegypt.edu'];
      const OLD_EDUHUB = ['shehabelsheikh@aucegypt.edu', 'shehabdiaa12345@gmail.com'];
      if (OLD_DAYCARE.includes(saved.daycareEmail)) saved.daycareEmail = 'info@theearlyyearscompany.com';
      if (OLD_EDUHUB.includes(saved.eduhubEmail)) saved.eduhubEmail = 'eduhub@theearlyyearscompany.com';
      if (OLD_DAYCARE.includes(saved.generalEmail)) saved.generalEmail = 'info@theearlyyearscompany.com';
      return saved;
    })(),
    media: cms.media ?? [],
    daycareHero: { ...DEFAULT_CMS.daycareHero, ...(cms.daycareHero ?? {}) },
    eduhubHero: { ...DEFAULT_CMS.eduhubHero, ...(cms.eduhubHero ?? {}) },
  };
}

export function saveCMS(data: CMSContent): void {
  localStorage.setItem(CMS_KEY, JSON.stringify({ ...data, version: 2 }));
}

export function resetCMS(): void {
  const backup = localStorage.getItem(CMS_KEY);
  if (backup) localStorage.setItem(CMS_KEY + '_backup', backup);
  localStorage.removeItem(CMS_KEY);
}

export function loadSubmissions(): CMSSubmission[] {
  try {
    const raw = localStorage.getItem(SUBMISSIONS_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

export function saveSubmissions(subs: CMSSubmission[]): void {
  localStorage.setItem(SUBMISSIONS_KEY, JSON.stringify(subs));
}

export function addSubmission(sub: Omit<CMSSubmission, 'id' | 'read'>): void {
  const subs = loadSubmissions();
  subs.unshift({ ...sub, id: generateId(), read: false });
  saveSubmissions(subs);
}

// ─── Supabase async helpers ───────────────────────────────────────────────────

const supabaseConfigured = Boolean(import.meta.env.VITE_SUPABASE_URL?.trim() && import.meta.env.VITE_SUPABASE_ANON_KEY?.trim());
async function getSupabase() {
  return (await import('../utils/supabase/client')).supabase;
}

export async function loadPublishedCMS(): Promise<CMSContent> {
  if (!supabaseConfigured) return loadCMS();
  const supabase = await getSupabase();
  try {
    const { data, error } = await supabase
      .from('cms_published')
      .select('data')
      .eq('id', 'main')
      .single();
    if (error || !data?.data) return loadCMS();
    return migrate({ ...DEFAULT_CMS, ...(data.data as CMSContent) });
  } catch {
    return loadCMS();
  }
}

export async function loadDraftCMS(): Promise<CMSContent> {
  if (!supabaseConfigured) return loadCMS();
  const supabase = await getSupabase();
  try {
    const { data, error } = await supabase
      .from('cms_drafts')
      .select('data')
      .eq('id', 'main')
      .single();
    if (!error && data?.data) return migrate({ ...DEFAULT_CMS, ...(data.data as CMSContent) });
  } catch { /* fall through */ }
  // Fallback chain: localStorage → cms_published → DEFAULT_CMS
  const local = localStorage.getItem(CMS_KEY);
  if (local) {
    try { return migrate({ ...DEFAULT_CMS, ...JSON.parse(local) }); } catch { /* */ }
  }
  return await loadPublishedCMS();
}

export async function saveDraft(data: CMSContent): Promise<{ error: string | null }> {
  const supabase = await getSupabase();
  const { error } = await supabase.from('cms_drafts').upsert({
    id: 'main',
    data,
    updated_at: new Date().toISOString(),
  });
  return { error: error?.message ?? null };
}

export async function publishCMS(data: CMSContent): Promise<{ error: string | null }> {
  const supabase = await getSupabase();
  const { error } = await supabase.from('cms_published').upsert({
    id: 'main',
    data,
    published_at: new Date().toISOString(),
  });
  return { error: error?.message ?? null };
}

export interface SupabaseSubmission {
  id: string;
  source: string;
  payload: Record<string, unknown>;
  status: 'unread' | 'read';
  created_at: string;
}

export async function insertSubmission(
  source: 'daycare' | 'eduhub' | 'general',
  payload: Record<string, unknown>
): Promise<{ cloudSaved: boolean; localSaved: boolean; error?: string }> {
  const stringValue = (value: unknown) => typeof value === 'string' ? value : '';
  addSubmission({
    submittedAt: stringValue(payload.submittedAt) || new Date().toISOString(),
    source: source === 'daycare' ? 'Daycare' : source === 'eduhub' ? 'EduHub' : 'General',
    name: stringValue(payload.name),
    email: stringValue(payload.email),
    phone: stringValue(payload.phone),
    message: stringValue(payload.message),
    extra: Object.fromEntries(Object.entries(payload).filter(([, value]) => typeof value === 'string').map(([key, value]) => [key, value as string])),
  });

  if (!supabaseConfigured) return { cloudSaved: false, localSaved: true, error: 'Cloud submissions are not configured.' };
  try {
    const supabase = await getSupabase();
    const { error } = await supabase.from('submissions').insert({ source, payload, status: 'unread' });
    if (error) return { cloudSaved: false, localSaved: true, error: error.message };
    return { cloudSaved: true, localSaved: true };
  } catch (error) {
    return { cloudSaved: false, localSaved: true, error: error instanceof Error ? error.message : 'Cloud submission failed.' };
  }
}

export async function fetchSubmissions(): Promise<SupabaseSubmission[]> {
  if (!supabaseConfigured) return loadSubmissions().map(item => ({
    id: item.id,
    source: item.source.toLowerCase(),
    payload: { name: item.name, email: item.email, phone: item.phone, message: item.message, ...item.extra },
    status: item.read ? 'read' : 'unread',
    created_at: item.submittedAt,
  }));
  const supabase = await getSupabase();
  const { data, error } = await supabase
    .from('submissions')
    .select('*')
    .order('created_at', { ascending: false });
  if (error) throw new Error(error.message);
  return (data ?? []) as SupabaseSubmission[];
}

export async function updateSubmissionStatus(id: string, status: 'read' | 'unread'): Promise<void> {
  if (!supabaseConfigured) {
    saveSubmissions(loadSubmissions().map(item => item.id === id ? { ...item, read: status === 'read' } : item));
    return;
  }
  const supabase = await getSupabase();
  const { error } = await supabase.from('submissions').update({ status }).eq('id', id);
  if (error) throw new Error(error.message);
}

export async function deleteSubmission(id: string): Promise<void> {
  if (!supabaseConfigured) {
    saveSubmissions(loadSubmissions().filter(item => item.id !== id));
    return;
  }
  const supabase = await getSupabase();
  const { error } = await supabase.from('submissions').delete().eq('id', id);
  if (error) throw new Error(error.message);
}

// ─── Global asset CRUD ────────────────────────────────────────────────────────
// Column names match the migration schema in supabase/migrations/001_cms_hardening.sql

export interface GlobalAssetRow {
  id: string;
  asset_key: string;             // immutable semantic key e.g. "daycare.hero"
  display_name: string;
  category: string;

  // ── Draft fields ──────────────────────────────────────────────────────────
  // draft_storage_path is the stable path in cms-image-drafts (private bucket).
  // NEVER store a signed URL here. Signed preview URLs are generated on demand.
  draft_storage_path: string | null;
  draft_original_url: string | null;   // external URL drafts ONLY (e.g. Unsplash); null for storage uploads
  draft_mobile_url: string | null;

  // ── Published fields (permanent public URLs from cms-image-published) ─────
  // published_remote_url must be a permanent public CDN URL, never a signed URL.
  published_remote_url: string | null;
  published_mobile_url: string | null;

  // ── Storage paths in cms-image-published bucket ───────────────────────────
  published_storage_path: string | null;          // e.g. "daycare.hero/v2/desktop.webp"
  published_mobile_storage_path: string | null;   // e.g. "daycare.hero/v2/mobile.webp"
  original_published_storage_path: string | null; // e.g. "daycare.hero/v2/original.jpg"

  // ── Static bundle paths (set after publication package is deployed) ───────
  published_static_path: string | null;
  published_static_mobile_path: string | null;

  original_fallback_path: string | null;   // bundled fallback, never changes
  alt_text: string | null;
  focal_x: number;
  focal_y: number;
  version: number;
  draft_status: string;          // 'none' | 'pending' | 'approved' | 'rejected'
  updated_at: string;
  updated_by: string | null;
  published_at: string | null;
}

export interface AssetVersionRow {
  id: string;
  asset_id: string;              // UUID FK → global_assets.id
  version: number;
  original_url: string | null;
  mobile_url: string | null;
  static_path: string | null;
  static_mobile_path: string | null;
  alt_text: string | null;
  focal_x: number;
  focal_y: number;
  publication_id: string | null;
  notes: string | null;
  created_at: string;
  created_by: string | null;
}

export async function fetchGlobalAssets(): Promise<GlobalAssetRow[]> {
  const supabase = await getSupabase();
  const { data, error } = await supabase
    .from('global_assets')
    .select('*')
    .order('category')
    .order('asset_key');
  if (error) return [];
  return (data ?? []) as GlobalAssetRow[];
}

// ─── Draft record management ──────────────────────────────────────────────────
//
// IMPORTANT: draft_storage_path must be a stable path in cms-image-drafts.
// Never pass a signed URL as draft_storage_path or draft_original_url
// when the source is a storage upload.
//
// draft_original_url is ONLY for externally-hosted URLs (e.g. Unsplash) where
// there is no storage path. It must never hold a signed URL from cms-image-drafts.

export interface SaveDraftRecordParams {
  // Stable path in cms-image-drafts (for files uploaded to Supabase Storage)
  draft_storage_path?: string | null;
  // External URL ONLY (Unsplash, etc.) — null for any storage-uploaded file
  draft_original_url?: string | null;
  draft_mobile_url?: string | null;
  alt_text?: string | null;
  focal_x?: number;
  focal_y?: number;
  display_name?: string;
  category?: string;
  original_fallback_path?: string | null;
}

export async function saveDraftRecord(
  assetKey: string,
  params: SaveDraftRecordParams,
): Promise<{ error: string | null }> {
  const supabase = await getSupabase();
  // Only include keys that were explicitly provided (never null-out unprovided fields)
  const update: Record<string, unknown> = {
    asset_key: assetKey,
    draft_status: 'pending',
    updated_at: new Date().toISOString(),
  };
  if (params.draft_storage_path !== undefined) update.draft_storage_path = params.draft_storage_path;
  if (params.draft_original_url !== undefined) update.draft_original_url = params.draft_original_url;
  if (params.draft_mobile_url !== undefined) update.draft_mobile_url = params.draft_mobile_url;
  if (params.alt_text !== undefined) update.alt_text = params.alt_text;
  if (params.focal_x !== undefined) update.focal_x = params.focal_x;
  if (params.focal_y !== undefined) update.focal_y = params.focal_y;
  if (params.display_name !== undefined) update.display_name = params.display_name;
  if (params.category !== undefined) update.category = params.category;
  if (params.original_fallback_path !== undefined) update.original_fallback_path = params.original_fallback_path;

  const { error } = await supabase
    .from('global_assets')
    .upsert(update, { onConflict: 'asset_key' });

  if (error) {
    const m = error.message.toLowerCase();
    if (m.includes('row-level security') || m.includes('rls') || m.includes('violates row-level')) {
      return {
        error:
          'Database draft save denied by row-level security policy. ' +
          'Make sure you are signed in and that the global_assets RLS policy ' +
          'allows authenticated editors to insert/update rows. ' +
          '(Raw: ' + error.message + ')',
      };
    }
    return { error: error.message };
  }
  return { error: null };
}

// ─── Draft signed URL preview (admin only, never stored in DB) ────────────────

/**
 * Generate a short-lived signed URL for admin preview of a private draft.
 * The returned URL must NEVER be stored in the database.
 * It expires after 1 hour and is for in-browser preview only.
 */
export async function getDraftPreviewUrl(
  storagePath: string,
): Promise<{ url: string | null; error: string | null }> {
  const supabase = await getSupabase();
  const { data, error } = await supabase.storage
    .from(DRAFT_BUCKET)
    .createSignedUrl(storagePath, 3600);
  if (error || !data?.signedUrl) {
    return { url: null, error: error?.message ?? 'Could not generate preview URL' };
  }
  return { url: data.signedUrl, error: null };
}

// ─── Download draft blob (used by publication workflow) ───────────────────────

/**
 * Download the original draft file from the private cms-image-drafts bucket.
 * Requires an authenticated Supabase session with read access to the bucket.
 */
export async function downloadDraftBlob(
  storagePath: string,
): Promise<{ blob: Blob | null; error: string | null }> {
  const supabase = await getSupabase();
  const { data, error } = await supabase.storage
    .from(DRAFT_BUCKET)
    .download(storagePath);
  if (error || !data) {
    return { blob: null, error: error?.message ?? 'Download failed' };
  }
  return { blob: data, error: null };
}

// ─── Write published record (called by assetPublisher after all uploads succeed) ─

/**
 * Write the final published URLs and paths to global_assets.
 * Must only be called after ALL variant uploads to cms-image-published have succeeded.
 * published_remote_url and published_mobile_url must be permanent public CDN URLs,
 * never signed URLs.
 */
export async function writePublishedRecord(
  assetKey: string,
  params: {
    published_remote_url: string;          // permanent public URL (desktop WebP)
    published_mobile_url: string;          // permanent public URL (mobile WebP)
    published_storage_path: string;        // path in cms-image-published
    published_mobile_storage_path: string;
    original_published_storage_path: string;
    version: number;
    alt_text: string | null;
    focal_x: number;
    focal_y: number;
  },
): Promise<{ error: string | null; assetId: string | null }> {
  const supabase = await getSupabase();
  const { error } = await supabase.from('global_assets').update({
    published_remote_url: params.published_remote_url,
    published_mobile_url: params.published_mobile_url,
    published_storage_path: params.published_storage_path,
    published_mobile_storage_path: params.published_mobile_storage_path,
    original_published_storage_path: params.original_published_storage_path,
    version: params.version,
    draft_status: 'approved',
    published_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  }).eq('asset_key', assetKey);

  if (error) return { error: error.message, assetId: null };

  const { data } = await supabase
    .from('global_assets')
    .select('id')
    .eq('asset_key', assetKey)
    .single();

  return { error: null, assetId: (data as { id: string } | null)?.id ?? null };
}

// ─── Legacy batch helper (calls through to assetPublisher) ───────────────────

/**
 * Approve all assets that have a draft but no published URL.
 * NOTE: This is DB-only metadata promotion for URL-based drafts.
 * For storage-uploaded drafts use approveAssetForPublication from assetPublisher.ts.
 */
export async function publishAllAssets(): Promise<{ error: string | null }> {
  const supabase = await getSupabase();
  // Fetch all assets with an external URL draft (not storage-backed)
  const { data, error: fetchErr } = await supabase
    .from('global_assets')
    .select('asset_key, draft_original_url, draft_mobile_url, version, alt_text, focal_x, focal_y, id')
    .not('draft_original_url', 'is', null)
    .is('draft_storage_path', null); // only URL-based drafts; storage drafts need the full pipeline
  if (fetchErr) return { error: fetchErr.message };
  if (!data?.length) return { error: null };

  const rows = data as GlobalAssetRow[];
  let lastError: string | null = null;

  for (const row of rows) {
    if (!row.draft_original_url) continue;
    const newVersion = (row.version ?? 1) + 1;

    const { error } = await supabase.from('global_assets').update({
      published_remote_url: row.draft_original_url,
      published_mobile_url: row.draft_mobile_url,
      version: newVersion,
      draft_status: 'approved',
      published_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    }).eq('asset_key', row.asset_key);

    if (error) { lastError = error.message; continue; }

    await supabase.from('asset_versions').insert({
      asset_id: row.id,
      version: newVersion,
      original_url: row.draft_original_url,
      mobile_url: row.draft_mobile_url,
      alt_text: row.alt_text,
      focal_x: row.focal_x,
      focal_y: row.focal_y,
      notes: 'Batch approved via admin panel',
      created_at: new Date().toISOString(),
    });
  }

  return { error: lastError };
}

export async function fetchAssetVersions(assetKey: string): Promise<AssetVersionRow[]> {
  const supabase = await getSupabase();
  // Resolve asset UUID from key, then fetch versions
  const { data: assetData } = await supabase
    .from('global_assets')
    .select('id')
    .eq('asset_key', assetKey)
    .single();
  if (!assetData) return [];

  const { data, error } = await supabase
    .from('asset_versions')
    .select('*')
    .eq('asset_id', (assetData as { id: string }).id)
    .order('version', { ascending: false })
    .limit(20);
  if (error) return [];
  return (data ?? []) as AssetVersionRow[];
}

export async function rollbackAsset(assetKey: string, originalUrl: string, version: number): Promise<{ error: string | null }> {
  const supabase = await getSupabase();
  const { error } = await supabase.from('global_assets').update({
    draft_original_url: originalUrl,
    version,
    draft_status: 'pending',
    updated_at: new Date().toISOString(),
  }).eq('asset_key', assetKey);
  return { error: error?.message ?? null };
}

// ─── Supabase Storage upload ──────────────────────────────────────────────────

export const DRAFT_BUCKET = 'cms-image-drafts';
export const PUBLISHED_BUCKET = 'cms-image-published';

/** Classify a Supabase Storage error message into a human-readable, actionable string. */
function classifyStorageError(message: string, bucket: string): string {
  const m = message.toLowerCase();

  // Auth / JWT errors — most important to distinguish
  if (
    m.includes('anon key') || m.includes('jwt') || m.includes('not authenticated') ||
    m.includes('invalid token') || m.includes('no authorization') || m.includes('unauthorized') ||
    m.includes('row-level security') || m.includes('rls') || m.includes('violates row-level')
  ) {
    // RLS denial can mean either no session (anon key used) or missing INSERT policy
    if (m.includes('row-level security') || m.includes('rls') || m.includes('violates row-level')) {
      return (
        'Storage INSERT policy denied the upload. ' +
        'This usually means you are not signed in (anon key is being used instead of your access token). ' +
        'Sign out and sign in again. If already signed in, verify the cms-image-drafts bucket has an ' +
        'authenticated INSERT policy. (Raw error: ' + message + ')'
      );
    }
    return 'Your CMS session is not authenticated with Supabase. Sign out and sign in again.';
  }

  if (m.includes('not found') || m.includes('does not exist') || m.includes('no such bucket')) {
    return (
      `Storage bucket "${bucket}" does not exist. ` +
      'Create it in Supabase Dashboard → Storage, ' +
      'then add a policy: authenticated role → INSERT.'
    );
  }

  if (m.includes('already exists') || m.includes('duplicate')) {
    // Should not happen with upsert:true, but surface it if it does
    return `A file already exists at this path in "${bucket}". (${message})`;
  }

  if (m.includes('mime') || m.includes('content-type') || m.includes('invalid type') || m.includes('format')) {
    return `File type rejected by the storage policy. Allowed formats: JPEG, PNG, WebP, AVIF. (${message})`;
  }

  if (m.includes('too large') || m.includes('size limit') || m.includes('payload too large')) {
    return `File exceeds the storage size limit. Maximum allowed: 10 MB. (${message})`;
  }

  return `Storage upload failed: ${message}`;
}

/**
 * Upload a File to the private cms-image-drafts bucket.
 *
 * Before uploading:
 *   1. Checks supabase.auth.getSession() — if no session, returns an auth error immediately.
 *   2. Logs safe diagnostics (no access token logged).
 *
 * Returns:
 *   path       — stable Storage object path; MUST be persisted to draft_storage_path in DB.
 *   previewUrl — a 1-hour signed URL for in-editor preview ONLY.
 *                MUST NOT be stored in the database or used as published_remote_url.
 */
export async function uploadDraftToStorage(
  assetKey: string,
  file: File,
  version: number,
): Promise<{ previewUrl: string | null; path: string | null; error: string | null }> {
  const supabase = await getSupabase();
  // ── 1. Verify authenticated session ────────────────────────────────────────
  const { data: sessionData, error: sessionError } = await supabase.auth.getSession();
  const session = sessionData?.session ?? null;

  const ext = file.name.split('.').pop()?.toLowerCase() ?? 'jpg';
  const storagePath = `${assetKey}/v${version}-${Date.now()}.${ext}`;

  // Safe diagnostic log — access token is deliberately omitted
  console.debug('[CMS Storage] Upload diagnostic', {
    hasSession: !!session,
    userId: session?.user?.id ?? null,
    tokenExpiresAt: session?.expires_at
      ? new Date(session.expires_at * 1000).toISOString()
      : null,
    sessionError: sessionError?.message ?? null,
    bucket: DRAFT_BUCKET,
    path: storagePath,
    fileType: file.type,
    fileSizeBytes: file.size,
  });

  if (sessionError) {
    return { previewUrl: null, path: null, error: `Session error: ${sessionError.message}` };
  }

  if (!session || !session.user) {
    return {
      previewUrl: null,
      path: null,
      error:
        'Your CMS session is not authenticated with Supabase. ' +
        'Sign out and sign in again to get a fresh session before uploading.',
    };
  }

  // ── 2. Upload ──────────────────────────────────────────────────────────────
  const { error: uploadError } = await supabase.storage
    .from(DRAFT_BUCKET)
    .upload(storagePath, file, { upsert: true, contentType: file.type });

  if (uploadError) {
    return { previewUrl: null, path: null, error: classifyStorageError(uploadError.message, DRAFT_BUCKET) };
  }

  // ── 3. Generate short-lived signed URL for immediate preview ───────────────
  // This URL must NEVER be stored in the database.
  const { data: signedData, error: signError } = await supabase.storage
    .from(DRAFT_BUCKET)
    .createSignedUrl(storagePath, 3600);

  if (signError || !signedData?.signedUrl) {
    // Upload succeeded; caller can call getDraftPreviewUrl(path) on demand later.
    return { previewUrl: null, path: storagePath, error: null };
  }

  return { previewUrl: signedData.signedUrl, path: storagePath, error: null };
}

/**
 * Upload a processed image blob to the public published bucket.
 * This should only be called from a server-side function in production.
 * In this environment it is called from the browser with the authenticated user's session.
 */
export async function uploadPublishedToStorage(
  assetKey: string,
  blob: Blob,
  label: 'desktop' | 'mobile' | 'thumb',
  format: 'webp' | 'jpeg' | 'png',
  version: number,
): Promise<{ url: string | null; path: string | null; error: string | null }> {
  const supabase = await getSupabase();
  const safeKey = assetKey.replace(/\./g, '-');
  const ext = format === 'jpeg' ? 'jpg' : format;
  const path = `published/${safeKey}/v${version}-${label}.${ext}`;

  const file = new File([blob], path.split('/').pop()!, { type: `image/${format === 'jpeg' ? 'jpeg' : format}` });

  const { error: uploadError } = await supabase.storage
    .from(PUBLISHED_BUCKET)
    .upload(path, file, { upsert: true, contentType: file.type, cacheControl: '31536000' });

  if (uploadError) {
    return { url: null, path: null, error: uploadError.message };
  }

  const { data } = supabase.storage.from(PUBLISHED_BUCKET).getPublicUrl(path);
  return { url: data.publicUrl, path, error: null };
}

// ─── Media usage scanner ──────────────────────────────────────────────────────

export function scanMediaUsage(cms: CMSContent): Record<string, string[]> {
  const usage: Record<string, string[]> = {};
  const track = (url: string, where: string) => {
    if (!url) return;
    if (!usage[url]) usage[url] = [];
    if (!usage[url].includes(where)) usage[url].push(where);
  };
  cms.educators.forEach(e => track(e.img, `Educator: ${e.name}`));
  cms.testimonials.forEach(t => track(t.avatar, `Testimonial: ${t.name}`));
  cms.gallery.forEach(g => track(g.url, `Gallery: ${g.title}`));
  cms.blog.forEach(b => track(b.featuredImage, `Blog: ${b.title}`));
  cms.alumni.forEach(a => track(a.img, `Alumni: ${a.name}`));
  cms.accreditations.forEach(a => track(a.logoUrl, `Accreditation: ${a.name}`));
  track(cms.daycareHero.heroImageUrl, 'Daycare Hero');
  return usage;
}

// ─── Health checks ────────────────────────────────────────────────────────────

export interface HealthWarning {
  section: string;
  message: string;
  count: number;
  sectionId: string;
}

export function getHealthWarnings(cms: CMSContent): HealthWarning[] {
  const warnings: HealthWarning[] = [];
  const add = (section: string, message: string, count: number, sectionId: string) => {
    if (count > 0) warnings.push({ section, message, count, sectionId });
  };

  add('Educators', 'Missing portrait photo', cms.educators.filter(e => !e.img).length, 'educators');
  add('Gallery', 'Missing alt text', cms.gallery.filter(g => !g.alt).length, 'gallery');
  add('Testimonials', 'Missing name', cms.testimonials.filter(t => !t.name).length, 'testimonials');
  add('Blog', 'Missing SEO description', cms.blog.filter(b => isPublished(b) && !b.seoDescription).length, 'blog');
  add('Blog', 'Missing featured image', cms.blog.filter(b => isPublished(b) && !b.featuredImage).length, 'blog');
  add('Media', 'Missing alt text', cms.media.filter(m => !m.alt).length, 'media');

  const draftCount = [
    ...cms.educators, ...cms.testimonials, ...cms.gallery,
    ...cms.programs, ...cms.blog, ...cms.faq,
  ].filter(r => getStatus(r) === 'draft').length;
  add('Content', 'Draft records not yet published', draftCount, 'settings');

  const hashLinks = [
    cms.ctaSettings.daycare.primaryLink,
    cms.ctaSettings.daycare.secondaryLink,
    cms.ctaSettings.eduhub.primaryLink,
    cms.ctaSettings.eduhub.secondaryLink,
  ].filter(l => l === '#').length;
  add('CTA Settings', 'Placeholder "#" links', hashLinks, 'cta');

  // WhatsApp placeholder check — common test numbers
  const placeholderWA = ['201234567890', '0000000000', '1234567890', '+201234567890'];
  const waNumber = (cms.siteSettings.whatsapp || '').replace(/\D/g, '');
  if (!cms.siteSettings.whatsapp || placeholderWA.includes(waNumber)) {
    add('Site Settings', 'WhatsApp number is missing or a placeholder', 1, 'settings');
  }
  const fsWA = (cms.formSettings.whatsapp || '').replace(/\D/g, '');
  if (cms.formSettings.whatsapp && placeholderWA.includes(fsWA)) {
    add('Form Settings', 'Form WhatsApp number is a placeholder', 1, 'forms');
  }

  // Missing Google Maps link
  if (!cms.siteSettings.googleMapsLink) {
    add('Site Settings', 'Google Maps link is missing', 1, 'settings');
  }

  // Form email endpoint warning
  if (cms.formSettings.emailEndpointEnabled) {
    if (!cms.formSettings.daycareEndpoint) add('Form Settings', 'Daycare form has no email delivery endpoint', 1, 'forms');
    if (!cms.formSettings.eduhubEndpoint) add('Form Settings', 'EduHub form has no email delivery endpoint', 1, 'forms');
    if (!cms.formSettings.generalEndpoint) add('Form Settings', 'General contact form has no email delivery endpoint', 1, 'forms');
  }

  // Accreditations missing external link
  add('EduHub', 'Accreditation missing external proof link', cms.accreditations.filter(a => isPublished(a) && !a.externalLink).length, 'accreditation');

  // Portal files with missing URLs
  add('Portal Files', 'Documents missing download URL', (cms.portalFiles ?? []).filter(f => f.active !== false && !f.url).length, 'portal-files');

  return warnings;
}

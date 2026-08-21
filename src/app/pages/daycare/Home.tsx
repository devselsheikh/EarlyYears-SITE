import image_IMG_20211012_WA0027 from "../../../imports/IMG-20211012-WA0027.jpg";
import {
  motion,
  useScroll,
  useTransform,
  AnimatePresence,
} from "motion/react";
import { useState, useMemo } from "react";
import { isPublished } from "../../data/cms";
import { useCMS } from "../../hooks/useCMS";
import { useSEO } from "../../hooks/useSEO";
import {
  Heart,
  Users,
  BookOpen,
  Sprout,
  ArrowRight,
  Shield,
  Sparkles,
  Clock,
  Star,
  Calendar,
  Trophy,
  Smile,
  CheckCircle,
  MapPin,
  ChevronRight,
  ChevronDown,
  Download,
  GraduationCap,
  Phone,
  MessageCircle,
} from "lucide-react";
import { Link } from "react-router";
import DaycareNav from "../../components/DaycareNav";
import DaycareFooter from "../../components/DaycareFooter";
import { SitePopup } from "../../components/SitePopup";
import ManagedImage from "../../components/ManagedImage";
import FAQSection from "../../components/daycare/FAQSection";
import Testimonials from "../../components/daycare/Testimonials";
import EducatorsCarousel from "../../components/daycare/EducatorsCarousel";
import { JsonLd, organizationSchema, childCareSchema } from "../../components/JsonLd";

// ─── Programs by Age (detailed) ──────────────────────────────────
const AGE_PROGRAMS = [
  {
    emoji: "🦋",
    label: "Butterflies Class",
    sublabel: null,
    age: "1–2 Years",
    ratio: "1 : 4",
    classSize: "Max 8 children",
    focus: "Sensory exploration & early communication",
    description:
      "Gentle, home-like setting where little ones discover the world through touch, sound, and play. Every interaction builds the trust that supports all future learning.",
    schedule: "Flexible half-day & full-day",
    features: [
      "Sensory play stations",
      "Language-rich environment",
      "Outdoor sensory garden",
    ],
    gradient: "from-pink-400 to-rose-400",
    bg: "from-pink-50 to-rose-50",
    border: "border-pink-200",
    tag: "from-pink-100 to-rose-100",
    tagText: "text-pink-700",
  },
  {
    emoji: "🐝",
    label: "Bees Class",
    sublabel: "Nursery",
    age: "2–3 Years",
    ratio: "1 : 5",
    classSize: "Max 10 children",
    focus: "Social skills & creative exploration",
    description:
      "Curiosity-led learning through art, music, stories, and outdoor adventures. Children build confidence, friendships, and the language skills they need to flourish.",
    schedule: "Half-day & full-day options",
    features: [
      "Creative arts & crafts",
      "Music & movement",
      "Outdoor play daily",
    ],
    gradient: "from-orange-400 to-amber-400",
    bg: "from-orange-50 to-amber-50",
    border: "border-orange-200",
    tag: "from-orange-100 to-amber-100",
    tagText: "text-orange-700",
  },
  {
    emoji: "🐞",
    label: "Ladybirds Class",
    sublabel: "Preschool",
    age: "3–4 Years",
    ratio: "1 : 6",
    classSize: "Max 12 children",
    focus: "Early literacy, numeracy & science",
    description:
      "Hands-on projects, science experiments, and imaginative storytelling. Children dive into reading readiness and early maths through play-based discovery.",
    schedule: "Full-day program",
    features: [
      "Literacy & phonics foundation",
      "Early numeracy",
      "Science exploration",
    ],
    gradient: "from-teal-400 to-emerald-400",
    bg: "from-teal-50 to-emerald-50",
    border: "border-teal-200",
    tag: "from-teal-100 to-emerald-100",
    tagText: "text-teal-700",
  },
  {
    emoji: "🕷️",
    label: "Spiders Class",
    sublabel: "Pre-K",
    age: "3.5–4.5 Years",
    ratio: "1 : 7",
    classSize: "Max 14 children",
    focus: "Independence, collaboration & curiosity",
    description:
      "Two parallel Pre-K classes growing together. Children develop independent thinking, collaborative skills, and the self-regulation every school setting values.",
    schedule: "Full-day with extended care option",
    features: [
      "Independent problem solving",
      "Group projects & collaboration",
      "Emotional intelligence",
    ],
    gradient: "from-rose-400 to-pink-400",
    bg: "from-rose-50 to-pink-50",
    border: "border-rose-200",
    tag: "from-rose-100 to-pink-100",
    tagText: "text-rose-700",
  },
  {
    emoji: "🐉",
    label: "Dragonflies Class",
    sublabel: "School Ready",
    age: "4–5 Years",
    ratio: "1 : 7",
    classSize: "Max 14 children",
    focus: "School readiness & independence",
    description:
      "Children graduate confident, curious, and ready. Our Dragonflies program focuses on reading, writing, and the social-emotional skills every primary school looks for.",
    schedule: "Full-day with extended care option",
    features: [
      "Reading & writing skills",
      "Problem-solving challenges",
      "School transition support",
    ],
    gradient: "from-violet-400 to-purple-400",
    bg: "from-violet-50 to-purple-50",
    border: "border-violet-200",
    tag: "from-violet-100 to-purple-100",
    tagText: "text-violet-700",
  },
];

// ─── Color palette for CMS-driven programs ───────────────────────
const PROGRAM_COLORS = [
  { gradient: 'from-pink-400 to-rose-400', bg: 'from-pink-50 to-rose-50', border: 'border-pink-200', tag: 'from-pink-100 to-rose-100', tagText: 'text-pink-700' },
  { gradient: 'from-orange-400 to-amber-400', bg: 'from-orange-50 to-amber-50', border: 'border-orange-200', tag: 'from-orange-100 to-amber-100', tagText: 'text-orange-700' },
  { gradient: 'from-teal-400 to-emerald-400', bg: 'from-teal-50 to-emerald-50', border: 'border-teal-200', tag: 'from-teal-100 to-emerald-100', tagText: 'text-teal-700' },
  { gradient: 'from-rose-400 to-pink-400', bg: 'from-rose-50 to-pink-50', border: 'border-rose-200', tag: 'from-rose-100 to-pink-100', tagText: 'text-rose-700' },
  { gradient: 'from-violet-400 to-purple-400', bg: 'from-violet-50 to-purple-50', border: 'border-violet-200', tag: 'from-violet-100 to-purple-100', tagText: 'text-violet-700' },
  { gradient: 'from-blue-400 to-indigo-400', bg: 'from-blue-50 to-indigo-50', border: 'border-blue-200', tag: 'from-blue-100 to-indigo-100', tagText: 'text-blue-700' },
];

// ─── Daily Timeline ─────────────────────────────────────────────
const DAY_TIMELINE = [
  {
    time: "7:30 AM",
    icon: "🌅",
    label: "Warm Arrival & Welcome",
    colorBar: "from-yellow-400 to-amber-500",
    colorLight: "bg-amber-50",
    colorBorder: "border-amber-100",
    desc: "Each child is greeted by name and settles into familiar activities. Soft lighting and calm music ease the morning transition.",
    photo:
      "https://images.unsplash.com/photo-1759772238042-3d95f8256381?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=800",
    funFact:
      "A consistent arrival routine helps children feel emotionally regulated — setting them up for a confident, curious day.",
    outcomes: ["🫀 Emotional Wellbeing", "🗣️ Communication"],
  },
  {
    time: "8:00 AM",
    icon: "🎮",
    label: "Free Play",
    colorBar: "from-orange-400 to-peach-500",
    colorLight: "bg-orange-50",
    colorBorder: "border-orange-100",
    desc: "Child-led exploration across dedicated learning zones: construction, role play, mark-making, sand & water, and creative arts.",
    photo:
      "https://images.unsplash.com/photo-1631032024590-140cc8dd4b32?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=800",
    funFact:
      "Free play is the most powerful learning mode for young children — building problem-solving, language, and social skills simultaneously.",
    outcomes: [
      "🧠 Problem Solving",
      "🎨 Creativity",
      "🤝 Social Skills",
    ],
  },
  {
    time: "9:00 AM",
    icon: "🟢",
    label: "Circle Time",
    colorBar: "from-emerald-400 to-teal-500",
    colorLight: "bg-emerald-50",
    colorBorder: "border-emerald-100",
    desc: "Songs, stories, the calendar, weather, and sharing time. A joyful group moment that builds language, attention, and community.",
    photo:
      "https://images.unsplash.com/photo-1761208663763-c4d30657c910?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=800",
    funFact:
      '"Sustained shared thinking" — where teachers and children explore ideas together — is one of the strongest predictors of early learning outcomes.',
    outcomes: [
      "📖 Literacy & Language",
      "🎵 Music & Rhythm",
      "🧘 Attention & Focus",
    ],
  },
  {
    time: "10:00 AM",
    icon: "🌿",
    label: "Outdoor Play",
    colorBar: "from-teal-400 to-cyan-500",
    colorLight: "bg-teal-50",
    colorBorder: "border-teal-100",
    desc: "Running, climbing, digging, and exploring on our AUC campus grounds. Outdoor play is never cancelled — we dress for all weather.",
    photo:
      "https://images.unsplash.com/photo-1767680148642-ac49a46543d3?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=800",
    funFact:
      "Children who spend at least 60 minutes outdoors daily show stronger physical development and better mood regulation all afternoon.",
    outcomes: [
      "🏃 Physical Development",
      "🌍 Understanding the World",
      "😊 Wellbeing",
    ],
  },
  {
    time: "11:00 AM",
    icon: "🎨",
    label: "Creative Activity",
    colorBar: "from-blue-400 to-indigo-500",
    colorLight: "bg-blue-50",
    colorBorder: "border-blue-100",
    desc: "Rotating EYFS-linked projects: painting, science experiments, sensory play, literacy activities, or maths explorations.",
    photo:
      "https://images.unsplash.com/photo-1691256257482-ac753cb26509?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=800",
    funFact:
      "Open-ended art activities build fine motor control, self-expression, and early maths concepts — all at once.",
    outcomes: [
      "🎨 Expressive Arts",
      "🔢 Early Maths",
      "✏️ Fine Motor Skills",
    ],
  },
  {
    time: "12:00 PM",
    icon: "🍎",
    label: "Lunch & Meals",
    colorBar: "from-rose-400 to-pink-500",
    colorLight: "bg-rose-50",
    colorBorder: "border-rose-100",
    desc: "Fresh, nutritious meals served family-style. Children help set the table and pour their own water — building independence and confidence.",
    photo:
      "https://images.unsplash.com/photo-1581861181562-34284733005a?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=800",
    funFact:
      "Our weekly menu rotates to introduce a variety of flavours, textures, and food groups — supporting adventurous eating habits from an early age.",
    mealSample: [
      { day: "Sun", meal: "Pasta & Salad" },
      { day: "Mon", meal: "Rice & Chicken" },
      { day: "Tue", meal: "Soup & Bread" },
      { day: "Wed", meal: "Wraps & Veg" },
      { day: "Thu", meal: "Rice & Fish" },
    ],
    outcomes: [
      "🍽️ Independence",
      "🥗 Healthy Habits",
      "🤝 Table Manners",
    ],
  },
  {
    time: "1:00 PM",
    icon: "💤",
    label: "Rest & Quiet Time",
    colorBar: "from-indigo-400 to-violet-500",
    colorLight: "bg-indigo-50",
    colorBorder: "border-indigo-100",
    desc: "Younger children nap in a calm, darkened room with soft music. Older children enjoy quiet reading or puzzles. Rest is never forced.",
    photo:
      "https://images.unsplash.com/photo-1621403215688-d4d8088ccbc4?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=800",
    funFact:
      "Sleep consolidates memory and supports emotional regulation — children who rest mid-day learn more effectively in afternoon sessions.",
    outcomes: [
      "💤 Rest & Wellbeing",
      "🧠 Memory Consolidation",
    ],
  },
  {
    time: "2:00 PM",
    icon: "📖",
    label: "Storytime & Afternoon Activity",
    colorBar: "from-pink-400 to-rose-500",
    colorLight: "bg-pink-50",
    colorBorder: "border-pink-100",
    desc: "Shared reading, puppet shows, or afternoon EYFS activities. Children choose books from our reading corner to take home weekly.",
    photo:
      "https://images.unsplash.com/photo-1761604478724-13fe879468cf?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=800",
    funFact:
      "Children who are read to daily develop vocabularies up to 1,000 words larger by age 5 — giving them a powerful head start at school.",
    outcomes: [
      "📚 Literacy",
      "🎭 Imagination",
      "🗣️ Vocabulary",
    ],
  },
  {
    time: "3:00 PM",
    icon: "🏡",
    label: "Home Time",
    colorBar: "from-amber-400 to-orange-500",
    colorLight: "bg-amber-50",
    colorBorder: "border-amber-100",
    desc: "A warm, calm close to the day. Your educator shares a written daily note: what your child ate, how they napped, and one highlight moment.",
    photo: null,
    funFact:
      "Every parent receives a written daily update at pickup — because staying connected to your child's day matters to us as much as it does to you.",
    outcomes: [
      "❤️ Parent Partnership",
      "🏡 Smooth Transitions",
    ],
  },
];

const DAY_TIMELINE_IMAGE_KEYS = [
  'daycare.hero',
  'daycare.about.mission',
  'daycare.gallery.classroom',
  'daycare.gallery.playground',
  'daycare.gallery.sensory',
  'daycare.gallery.dining',
  'daycare.gallery.reading',
  'daycare.section.classroom-2',
] as const;

// ─── Educator Profiles ──────────────────────────────────────────
const EDUCATORS = [
  {
    name: "Nesrin Hassanin",
    title: "Managing Director",
    cert: "M.Ed. (in progress) | CACHE Level 3 | 30 Years Experience",
    bio: "Early Years expert with 30 years across the Middle East, co-founder of Early Years Company and two nursery schools in Egypt. Career spans direct childcare, nursery management, staff training, and startup advisory. Holds a CACHE Level 3 in Early Childhood Education and is completing a Master's in Leadership in Education — driven by a lifelong belief that quality Early Years care shapes every child's future.",
    img: "/nesrin-hassanin.png",
    badge: "🏛️ EYC Co-Founder",
  },
  {
    name: "Lamia Hassanin",
    title: "Educational Coordinator",
    cert: "AUC Early Years Education | SENCo (LRC) | Parenting Coach (Intellect)",
    bio: "A founding member of Early Years Company with 18+ years at Cairo's most reputable nursery, where she rose to Deputy Head. Holds an Early Years Education degree from AUC, SENCo certification from LRC, and a Parenting Coach qualification from Intellect. Passionate advocate for child-led, play-based learning at every child's own pace.",
    img: "/lamia-hassanin.png",
    badge: "🏛️ EYC Co-Founder",
  },
  {
    name: "Sarah Al-Masri",
    title: "Lead Early Years Educator",
    cert: "CACHE Level 3 | 12 Years Experience",
    bio: "Sarah specialises in language development and EYFS play-based learning. Parents describe her as the teacher who 'makes every child feel seen'.",
    img: "https://images.unsplash.com/photo-1758685847967-c598c3b176b0?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=400",
    badge: "🏅 EYFS Specialist",
  },
  {
    name: "Nadia Hassan",
    title: "Nursery Room Leader",
    cert: "CACHE Level 3 | 8 Years Experience",
    bio: "Nadia's background in child psychology brings a uniquely nurturing approach to the toddler and nursery rooms. She leads our settling-in program.",
    img: "https://images.unsplash.com/photo-1607746882042-944635dfe10e?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=400",
    badge: "🎓 CACHE Certified",
  },
  {
    name: "Reem Fouad",
    title: "Pre-K & School Readiness Lead",
    cert: "CACHE Level 5 | 15 Years Experience",
    bio: "Reem has prepared hundreds of children for primary school. Her pre-K graduates consistently receive excellent feedback from receiving schools.",
    img: "https://images.unsplash.com/photo-1761604478724-13fe879468cf?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=400",
    badge: "⭐ School Readiness",
  },
];

// ─── Gallery ────────────────────────────────────────────────────
const GALLERY = [
  {
    assetKey: "daycare.gallery.classroom",
    src: "https://images.unsplash.com/photo-1761208663763-c4d30657c910?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=800",
    alt: "Children playing in bright classroom",
    caption: "Classrooms",
    span: "col-span-2 md:col-span-2",
  },
  {
    assetKey: "daycare.gallery.sensory",
    src: "https://images.unsplash.com/photo-1764786077942-40f305ebcd97?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=800",
    alt: "Sensory water play activity",
    caption: "Activity Areas",
    span: "",
  },
  {
    assetKey: "daycare.gallery.playground",
    src: "https://images.unsplash.com/photo-1753488821008-10ebbe34e73e?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=800",
    alt: "Outdoor playground",
    caption: "Playground",
    span: "",
  },
  {
    assetKey: "daycare.gallery.dining",
    src: "https://images.unsplash.com/photo-1528960647731-ab4ec9b96a04?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=800",
    alt: "Children eating lunch together",
    caption: "Dining Area",
    span: "",
  },
  {
    assetKey: "daycare.gallery.reading",
    src: "https://images.unsplash.com/photo-1762475833776-fd57865db4d5?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=800",
    alt: "Cozy reading corner",
    caption: "Reading Corner",
    span: "",
  },
];

// ─── Enrollment Steps ────────────────────────────────────────────
const ENROLL_STEPS = [
  {
    step: "1",
    icon: "📅",
    title: "Book a Visit",
    desc: "Come see our classrooms and meet the team. Tours run Monday–Friday, 10:30 AM–12:00 PM.",
  },
  {
    step: "2",
    icon: "🤝",
    title: "Meet the Team",
    desc: "Sit down with our educators to discuss your child's needs, interests, and any questions.",
  },
  {
    step: "3",
    icon: "📝",
    title: "Submit Application",
    desc: "Complete a simple application form and we'll guide you through every step.",
  },
  {
    step: "4",
    icon: "🌈",
    title: "Child Orientation",
    desc: "A gentle, warm settling-in process so your child feels excited from day one.",
  },
];

// ─── Blog Posts (stub) ──────────────────────────────────────────
const BLOG_POSTS = [
  {
    tag: "For Parents",
    emoji: "👶",
    title: "When Should My Child Start Nursery?",
    excerpt:
      "Every child is different, but there are clear signs of readiness — and ways to make the transition easier for both of you.",
    tagColor: "bg-peach-100 text-peach-700",
    slug: "/blog/when-should-my-child-start-nursery",
  },
  {
    tag: "For Parents",
    emoji: "📚",
    title: "What Is the EYFS Curriculum?",
    excerpt:
      "EYFS stands for Early Years Foundation Stage. Here's what it means for your child's daily experience at nursery.",
    tagColor: "bg-peach-100 text-peach-700",
    slug: "/blog/what-is-eyfs-curriculum",
  },
  {
    tag: "For Educators",
    emoji: "🎓",
    title: "CACHE Certification Explained",
    excerpt:
      "Everything you need to know about Egypt's first CACHE-approved qualification program — entry requirements, levels, and career outcomes.",
    tagColor: "bg-blue-100 text-blue-700",
    slug: "/blog/cache-certification-explained",
  },
];

// ─── Day Section (accordion) ─────────────────────────────────────
function DaySection() {
  const [openStep, setOpenStep] = useState<number | null>(0);

  return (
    <section className="py-20 lg:py-28 bg-gradient-to-br from-lemon-50/50 via-peach-50/30 to-mint-50/50">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-10"
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white shadow-md text-amber-700 text-sm mb-4">
            <Clock className="w-4 h-4" />
            <span className="font-semibold">
              A Day at Early Years
            </span>
          </div>
          <h2 className="text-4xl lg:text-5xl font-bold text-gray-900 mb-4">
            Every Day is an Adventure
          </h2>
          <p className="text-base text-gray-600 max-w-lg mx-auto">
            A predictable, nurturing rhythm gives children the
            security to take risks, explore, and flourish. Tap
            any block to see what's happening — and why it
            matters.
          </p>
        </motion.div>

        {/* Compact Accordion */}
        <div className="space-y-2 mb-12">
          {DAY_TIMELINE.map((step, i) => {
            const isOpen = openStep === i;
            return (
              <motion.div
                key={i}
                initial={{ opacity: 0, x: -16 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: i * 0.04 }}
                className={`rounded-2xl overflow-hidden border transition-all ${isOpen ? step.colorBorder + " shadow-lg" : "border-gray-100 shadow-sm"}`}
              >
                {/* Always-visible header row */}
                <button
                  onClick={() => setOpenStep(isOpen ? null : i)}
                  className={`w-full flex items-center gap-3 px-5 py-3.5 text-left transition-all ${isOpen ? step.colorLight : "bg-white hover:bg-gray-50"}`}
                >
                  {/* Time badge */}
                  <span
                    className={`hidden sm:inline-flex px-3 py-1 rounded-full bg-gradient-to-r ${step.colorBar} text-white text-xs font-bold flex-shrink-0 w-20 justify-center`}
                  >
                    {step.time}
                  </span>
                  {/* Emoji */}
                  <span className="text-xl flex-shrink-0">
                    {step.icon}
                  </span>
                  {/* Label */}
                  <span className="font-bold text-gray-900 flex-1 text-sm sm:text-base">
                    {step.label}
                  </span>
                  {/* Time badge mobile */}
                  <span
                    className={`sm:hidden inline-flex px-2 py-0.5 rounded-full bg-gradient-to-r ${step.colorBar} text-white text-[10px] font-bold flex-shrink-0`}
                  >
                    {step.time}
                  </span>
                  {/* Mini outcome chips — desktop only */}
                  <div className="hidden lg:flex gap-1.5 flex-shrink-0">
                    {step.outcomes.slice(0, 2).map((o, j) => (
                      <span
                        key={j}
                        className={`px-2 py-0.5 rounded-full text-[10px] font-medium bg-white/80 text-gray-600 border border-gray-100`}
                      >
                        {o}
                      </span>
                    ))}
                  </div>
                  <ChevronDown
                    className={`w-4 h-4 text-gray-400 flex-shrink-0 transition-transform ${isOpen ? "rotate-180" : ""}`}
                  />
                </button>

                {/* Expanded content */}
                <AnimatePresence initial={false}>
                  {isOpen && (
                    <motion.div
                      key="content"
                      initial={{ opacity: 0, y: -6 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -6 }}
                      transition={{
                        duration: 0.22,
                        ease: [0.25, 0.46, 0.45, 0.94],
                      }}
                    >
                      <div
                        className={`${step.colorLight} border-t ${step.colorBorder}`}
                      >
                        <div
                          className={`grid ${step.photo ? "md:grid-cols-5" : ""} gap-0`}
                        >
                          {/* Info panel */}
                          <div
                            className={`p-6 ${step.photo ? "md:col-span-3" : ""}`}
                          >
                            <p className="text-sm text-gray-700 leading-relaxed mb-4">
                              {step.desc}
                            </p>

                            {/* Outcome chips */}
                            <div className="flex flex-wrap gap-2 mb-4">
                              {step.outcomes.map((o, j) => (
                                <span
                                  key={j}
                                  className="px-2.5 py-1 rounded-full bg-white/80 text-xs font-medium text-gray-700 border border-white shadow-sm"
                                >
                                  {o}
                                </span>
                              ))}
                            </div>

                            {/* Fun fact */}
                            <div className="flex items-start gap-2 bg-white/70 rounded-xl p-3">
                              <span className="text-amber-400 flex-shrink-0">
                                💡
                              </span>
                              <p className="text-xs text-gray-600 italic leading-relaxed">
                                {step.funFact}
                              </p>
                            </div>
                          </div>

                          {/* Photo panel */}
                          {step.photo && (
                            <div className="md:col-span-2 relative min-h-[160px]">
                              <ManagedImage
                                assetKey={DAY_TIMELINE_IMAGE_KEYS[i]}
                                src={step.photo}
                                alt={step.label}
                                className="w-full h-full object-cover min-h-[160px]"
                              />
                            </div>
                          )}
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            );
          })}
        </div>

        {/* ── Food & Nutrition Section ─────────────────────────── */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          <div className="bg-white rounded-3xl border border-emerald-100 shadow-lg overflow-hidden">
            <div className="bg-gradient-to-r from-emerald-400 to-teal-500 px-7 py-6">
              <div className="flex items-center gap-3">
                <span className="text-3xl">🍽️</span>
                <div>
                  <h3 className="text-white font-bold text-xl">Premium Nutrition Programme</h3>
                  <p className="text-white/80 text-sm">Freshly cooked on-site daily · Nut-free · Allergy-aware</p>
                </div>
              </div>
            </div>
            <div className="p-6 lg:p-8 space-y-5">
              <p className="text-gray-700 leading-relaxed">
                Every meal served at Early Years is <strong>developed and approved by a qualified nutrition specialist</strong> — ensuring our children receive the precise balance of proteins, complex carbohydrates, healthy fats, vitamins, and minerals they need at each stage of development.
              </p>
              <div className="grid sm:grid-cols-3 gap-4">
                {[
                  { emoji: '🥗', title: 'Nutritionist-Designed', desc: 'Menus created by a certified nutrition specialist and reviewed seasonally' },
                  { emoji: '🍳', title: 'Freshly Prepared', desc: 'Cooked on-site every morning using fresh, high-quality ingredients' },
                  { emoji: '🌿', title: 'Balanced & Varied', desc: 'Rotating two-week menus ensure variety across all food groups' },
                ].map(item => (
                  <div key={item.title} className="bg-emerald-50 rounded-2xl p-4 border border-emerald-100 text-center">
                    <div className="text-2xl mb-2">{item.emoji}</div>
                    <p className="text-sm font-bold text-gray-800 mb-1">{item.title}</p>
                    <p className="text-xs text-gray-500 leading-relaxed">{item.desc}</p>
                  </div>
                ))}
              </div>
              <div className="bg-amber-50 rounded-2xl p-4 border border-amber-100 flex items-start gap-3">
                <span className="text-xl flex-shrink-0">⚠️</span>
                <p className="text-xs text-gray-600 leading-relaxed">
                  All meals are <strong>nut-free</strong> and we accommodate vegetarian, halal, and specific allergy requirements. The full seasonal menus — with daily lunch, sides, and snack details — are available exclusively in the <strong>Parent Portal</strong>.
                </p>
              </div>
              <div className="flex justify-center">
                <Link
                  to="/daycare/parents"
                  className="inline-flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-emerald-500 to-teal-500 text-white rounded-2xl text-sm font-semibold hover:shadow-lg transition-all"
                >
                  🔒 View Full Menu in Parent Portal
                </Link>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}

export default function DaycareHome() {
  const { scrollYProgress } = useScroll();
  const yHero = useTransform(
    scrollYProgress,
    [0, 0.25],
    [0, -50],
  );

  const cms = useCMS();
  useSEO("daycare", undefined, cms);

  const hero = cms.daycareHero;

  const programs = useMemo(() => {
    const cmsPrograms = cms.programs.filter(isPublished).sort((a, b) => a.displayOrder - b.displayOrder);
    if (cmsPrograms.length > 0) {
      return cmsPrograms.map((p, i) => {
        const c = PROGRAM_COLORS[i % PROGRAM_COLORS.length];
        return { emoji: p.emoji, label: p.name, sublabel: null, age: p.ageRange, ratio: p.ratio, classSize: p.maxClassSize, focus: p.description.split('.')[0] || '', description: p.description, schedule: '', features: p.features, ...c };
      });
    }
    return AGE_PROGRAMS;
  }, [cms.programs]);

  const cmsEducators = useMemo(() => {
    return cms.educators
      .filter(isPublished)
      .sort((a, b) => a.displayOrder - b.displayOrder)
      .map((e) => ({
        name: e.name,
        title: e.title,
        cert: e.qualification,
        bio: e.bio,
        img: e.img,
        badge: e.specialtyBadge,
        leadership: e.leadership,
      }));
  }, [cms.educators]);

  const s = cms.siteSettings;
  const siteUrl = 'https://theearlyyearscompany.com';

  return (
    <div className="min-h-screen bg-white overflow-x-hidden">
      <JsonLd data={[
        organizationSchema({ name: s.companyName, url: siteUrl, phone: s.mainPhone, email: s.mainEmail }),
        childCareSchema({ name: `${s.companyName} — Nursery & Daycare`, url: `${siteUrl}/daycare`, phone: s.daycarePhone || s.mainPhone, email: s.daycareEmail || s.mainEmail, description: hero.subtitle || 'Play-based EYFS nursery for children aged 1–5 in New Cairo.', openingHours: 'Su-Th 07:30-17:00' }),
      ]} />
      <SitePopup site="daycare" />
      <DaycareNav />

      <main>

      {/* ══════════════════════════════════════════════════════════
          HERO — What? Where? Why trust?
      ══════════════════════════════════════════════════════════ */}
      <section className="relative bg-gradient-to-br from-peach-50 via-lemon-50 to-mint-50 overflow-hidden">
        {/* Ambient blobs */}
        <div className="absolute top-10 left-10 w-40 h-40 rounded-full bg-peach-200/35 blur-3xl pointer-events-none" />
        <div className="absolute bottom-16 right-10 w-52 h-52 rounded-full bg-mint-200/35 blur-3xl pointer-events-none" />

        <motion.div
          style={{ y: yHero }}
          className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14 sm:py-20 lg:py-28"
        >
          <div className="grid lg:grid-cols-2 gap-10 lg:gap-16 items-center">
            {/* Left */}
            <motion.div
              initial={false}
            >
              {/* Trust badge */}
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/90 backdrop-blur-sm text-peach-700 text-xs sm:text-sm mb-5 shadow-lg border border-peach-100"
              >
                <Trophy className="w-4 h-4" />
                <span className="font-semibold">{hero.eyebrow || '25+ Years of Excellence · Egypt\'s Most Trusted Nursery'}</span>
              </motion.div>

              {/* Headline */}
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-gray-900 mb-3 leading-tight">
                {hero.headline || 'Early Years Daycare'}{' '}
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-peach-500 via-coral-500 to-pink-500">
                  {hero.highlightWord || 'at AUC'}
                </span>
              </h1>

              {/* Subheadline */}
              <p className="text-lg sm:text-xl text-gray-700 mb-2 leading-relaxed">
                {hero.subtitle || 'Play-based EYFS nursery for children aged 1–5 in New Cairo.'}
              </p>
              <p className="text-sm text-gray-500 mb-6 flex items-center gap-1.5">
                <MapPin className="w-4 h-4 text-coral-500 flex-shrink-0" />
                American University in Cairo (AUC) · New Cairo Campus
              </p>

              {/* Trust chips — from CMS */}
              <div className="grid grid-cols-2 gap-3 mb-8">
                {(hero.trustBadges?.length ? hero.trustBadges : [
                  { icon: '🎓', text: 'EYFS Certified' },
                  { icon: '👩‍🏫', text: 'Qualified Educators' },
                  { icon: '🏫', text: 'AUC New Cairo' },
                  { icon: '⭐', text: '25+ Years' },
                ]).map((item, i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.4 + i * 0.07 }}
                    className="flex items-center gap-2 bg-white/80 rounded-xl px-3 py-2.5 shadow border border-gray-100"
                  >
                    <span className="text-xl">{item.icon}</span>
                    <span className="text-xs sm:text-sm font-medium text-gray-700">{item.text}</span>
                  </motion.div>
                ))}
              </div>

              {/* CTAs — from CMS */}
              <div className="flex flex-col sm:flex-row gap-3">
                <motion.div whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.97 }}>
                  <Link
                    to={hero.primaryCTALink || '/daycare/contact'}
                    className="flex items-center justify-center gap-2 px-7 py-4 rounded-2xl bg-gradient-to-r from-peach-400 via-coral-500 to-pink-500 text-white font-bold shadow-xl hover:shadow-2xl transition-all"
                  >
                    <Calendar className="w-5 h-5" />
                    {hero.primaryCTALabel || 'Book a Tour'}
                  </Link>
                </motion.div>
                {hero.secondaryCTALabel && hero.secondaryCTALink && (
                  <motion.div whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.97 }}>
                    <Link
                      to={hero.secondaryCTALink}
                      className="flex items-center justify-center gap-2 px-7 py-4 rounded-2xl bg-white text-gray-900 font-bold border-2 border-gray-200 hover:border-peach-300 hover:shadow-lg transition-all"
                    >
                      {hero.secondaryCTALabel}
                      <ArrowRight className="w-5 h-5" />
                    </Link>
                  </motion.div>
                )}
              </div>

              {/* Download brochure */}
              <Link
                to="/daycare/parent-info"
                className="inline-flex items-center gap-1.5 mt-4 text-sm text-gray-500 hover:text-teal-600 transition-colors"
              >
                <Download className="w-4 h-4" />
                Download Parent Information Pack
              </Link>
            </motion.div>

            {/* Right — hero image */}
            <motion.div
              initial={false}
              className="relative"
            >
              <div className="relative rounded-3xl overflow-hidden shadow-2xl">
                <ManagedImage
                  assetKey="daycare.hero"
                  src={image_IMG_20211012_WA0027}
                  alt="Children arriving happily at Early Years daycare"
                  className="w-full aspect-[4/3] object-cover"
                  loading="eager"
                  fetchPriority="high"
                />
                <motion.div
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{
                    delay: 0.9,
                    duration: 0.35,
                    ease: [0.25, 0.46, 0.45, 0.94],
                  }}
                  className="absolute bottom-5 left-5 bg-white/95 backdrop-blur-sm rounded-2xl p-4 shadow-xl"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-mint-400 to-teal-500 flex items-center justify-center">
                      <Smile className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <div className="text-sm font-bold text-gray-900">
                        98% Parent Satisfaction
                      </div>
                      <div className="text-xs text-gray-500">
                        from 200+ families surveyed
                      </div>
                    </div>
                  </div>
                </motion.div>
              </div>
            </motion.div>
          </div>
        </motion.div>
      </section>

      {/* ══════════════════════════════════════════════════════════
          TRUST STRIP
      ══════════════════════════════════════════════════════════ */}
      <section className="py-6 bg-white border-y border-gray-100">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[
              {
                icon: Trophy,
                label: "25+ Years Experience",
                color: "from-amber-400 to-orange-500",
              },
              {
                icon: BookOpen,
                label: "EYFS Curriculum",
                color: "from-teal-400 to-emerald-500",
              },
              {
                icon: MapPin,
                label: "Located at AUC",
                color: "from-blue-400 to-indigo-500",
              },
              {
                icon: Users,
                label: "Qualified Educators",
                color: "from-pink-400 to-rose-500",
              },
            ].map((item, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 12 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.07 }}
                className="flex items-center gap-3 py-4 group"
              >
                <div
                  className={`w-10 h-10 rounded-xl bg-gradient-to-br ${item.color} flex items-center justify-center shadow-md flex-shrink-0 group-hover:scale-110 transition-transform`}
                >
                  <item.icon className="w-5 h-5 text-white" />
                </div>
                <span className="text-sm font-semibold text-gray-700">
                  {item.label}
                </span>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════════════════
          AUC — warm, playful, visual
      ══════════════════════════════════════════════════════════ */}
      <section className="py-20 lg:py-28 bg-gradient-to-br from-amber-50 via-orange-50/60 to-peach-50 overflow-hidden relative">
        <div className="absolute top-16 right-16 w-36 h-36 rounded-full bg-orange-200/30 blur-3xl pointer-events-none" />
        <div className="absolute bottom-16 left-10 w-44 h-44 rounded-full bg-yellow-200/30 blur-3xl pointer-events-none" />

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
            {/* Left — warm copy + playful trust badges */}
            <motion.div
              initial={{ opacity: 0, x: -24 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white shadow-sm border border-orange-100 text-orange-700 text-sm mb-6">
                <MapPin className="w-4 h-4" />
                <span className="font-semibold">
                  Our Home for 25+ Years
                </span>
              </div>
              <h2 className="text-4xl lg:text-5xl font-bold text-gray-900 mb-5 leading-tight">
                Growing Up Safely
                <br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-400 to-coral-500">
                  at AUC
                </span>
              </h2>
              <p className="text-lg text-gray-700 mb-8 leading-relaxed">
                For over 25 years, families at the American
                University in Cairo have trusted Early Years to
                nurture their children in a safe, playful, and
                inspiring environment. Being on campus means
                your child grows up surrounded by nature,
                security, and community.
              </p>

              {/* Playful trust badges */}
              <div className="grid grid-cols-2 gap-3 mb-8">
                {[
                  {
                    emoji: "🔒",
                    title: "Secure Campus",
                    desc: "Gated AUC access with trained staff at every entry point",
                  },
                  {
                    emoji: "🌳",
                    title: "Beautiful Green Spaces",
                    desc: "Gardens and outdoor play areas surrounded by nature",
                  },
                  {
                    emoji: "👨‍👩‍👧",
                    title: "AUC Family Community",
                    desc: "A welcoming, diverse community of hundreds of families",
                  },
                  {
                    emoji: "👩‍🏫",
                    title: "Qualified Educators",
                    desc: "Every team member holds a CACHE or equivalent qualification",
                  },
                ].map((badge, i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, y: 10 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.1 + i * 0.07 }}
                    whileHover={{ y: -3 }}
                    className="bg-white rounded-2xl p-4 shadow-sm border border-orange-100 hover:shadow-md hover:border-orange-200 transition-all"
                  >
                    <div className="text-3xl mb-2">
                      {badge.emoji}
                    </div>
                    <div className="text-sm font-bold text-gray-900 mb-1">
                      {badge.title}
                    </div>
                    <div className="text-xs text-gray-500 leading-relaxed">
                      {badge.desc}
                    </div>
                  </motion.div>
                ))}
              </div>

              <a
                href="https://maps.app.goo.gl/JYf4tcxn6CyofMWU6"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-6 py-3.5 rounded-2xl bg-white border-2 border-orange-200 text-gray-800 font-bold hover:shadow-lg hover:border-orange-300 transition-all"
              >
                <MapPin className="w-5 h-5 text-orange-500" />
                Find Us at AUC New Cairo
              </a>
            </motion.div>

            {/* Right — photo mosaic */}
            <motion.div
              initial={{ opacity: 0, x: 24 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.15 }}
              className="grid grid-cols-2 gap-3"
            >
              {/* Tall left photo */}
              <div className="rounded-3xl overflow-hidden shadow-xl row-span-2">
                <ManagedImage
                  assetKey="daycare.section.family-play"
                  src="https://images.unsplash.com/photo-1767680148642-ac49a46543d3?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=600"
                  alt="Children playing outdoors at AUC"
                  className="w-full h-full object-cover hover:scale-105 transition-transform duration-700"
                  style={{ minHeight: "340px" }}
                />
              </div>
              {/* Top-right photo */}
              <div className="rounded-3xl overflow-hidden shadow-xl aspect-square">
                <ManagedImage
                  assetKey="daycare.gallery.classroom"
                  src="https://images.unsplash.com/photo-1761208663763-c4d30657c910?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=600"
                  alt="Children circle time"
                  className="w-full h-full object-cover hover:scale-105 transition-transform duration-700"
                />
              </div>
              {/* Bottom-right playful badge card */}
              <motion.div
                whileHover={{ scale: 1.04 }}
                className="rounded-3xl overflow-hidden shadow-xl bg-gradient-to-br from-orange-100 to-amber-100 flex items-center justify-center aspect-square border border-orange-200"
              >
                <div className="text-center p-4">
                  <div className="text-5xl mb-2">🏫</div>
                  <div className="text-3xl font-bold text-orange-700">
                    25+
                  </div>
                  <div className="text-sm text-orange-600 font-semibold leading-tight">
                    Years at AUC
                    <br />
                    New Cairo
                  </div>
                </div>
              </motion.div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════════════════
          MAP EMBED
      ══════════════════════════════════════════════════════════ */}
      <section className="py-12 bg-white">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="rounded-3xl overflow-hidden shadow-xl border border-orange-100">
            <iframe
              title="Early Years Daycare — AUC New Cairo"
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3455.3!2d31.5!3d29.98!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x14583a4560f28e4b%3A0xb2f36ccff5a28f7c!2sAmerican%20University%20in%20Cairo%20(AUC)%20New%20Cairo!5e0!3m2!1sen!2seg!4v1720000000000"
              width="100%"
              height="320"
              style={{ border: 0, display: "block" }}
              allowFullScreen
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
            />
          </div>
          <div className="flex items-center justify-between mt-4 px-1">
            <p className="text-sm text-gray-500">
              AUC New Cairo Campus — Gate 3, off Ring Road
            </p>
            <a
              href="https://maps.app.goo.gl/JYf4tcxn6CyofMWU6"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex min-h-11 items-center text-sm text-orange-800 font-semibold hover:text-orange-900 transition-colors"
            >
              Open in Google Maps ↗
            </a>
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════════════════
          PROGRAMS BY AGE — detailed
      ══════════════════════════════════════════════════════════ */}
      <section className="py-20 lg:py-28 bg-gradient-to-br from-peach-50/40 via-white to-mint-50/40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-14"
          >
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white shadow-md text-coral-700 text-sm mb-4">
              <Sprout className="w-4 h-4" />
              <span className="font-semibold">
                Programs by Age
              </span>
            </div>
            <h2 className="text-4xl lg:text-5xl font-bold text-gray-900 mb-4">
              The Right Program for Every Stage
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Each age group has its own dedicated curriculum,
              daily rhythm, teacher ratio, and class size —
              because every stage of childhood matters.
            </p>
          </motion.div>

          {/* Class progression flow */}
          <div className="flex items-center justify-center flex-wrap gap-2 mb-8">
            {programs.map((prog, i) => (
              <div key={i} className="flex items-center gap-2">
                <div
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-gradient-to-r ${prog.bg} border ${prog.border} text-xs font-bold ${prog.tagText}`}
                >
                  <span>{prog.emoji}</span>
                  <span>{prog.label}</span>
                  {prog.sublabel && (
                    <span className="opacity-70">
                      · {prog.sublabel}
                    </span>
                  )}
                </div>
                {i < programs.length - 1 && (
                  <ChevronRight className="w-3.5 h-3.5 text-gray-300 flex-shrink-0" />
                )}
              </div>
            ))}
          </div>

          {/* Mobile: horizontal snap carousel */}
          <div tabIndex={0} aria-label="Daycare programs carousel" className="sm:hidden -mx-4 px-4 overflow-x-auto snap-x snap-mandatory flex gap-4 pb-4" style={{ scrollbarWidth: 'none' }}>
            {programs.map((prog, i) => (
              <div
                key={i}
                className={`snap-center flex-shrink-0 w-[80vw] max-w-xs bg-gradient-to-br ${prog.bg} rounded-3xl p-5 border ${prog.border} shadow flex flex-col`}
              >
                <div className={`w-11 h-11 rounded-2xl bg-gradient-to-br ${prog.gradient} flex items-center justify-center mb-3 shadow-md text-xl`}>
                  {prog.emoji}
                </div>
                <span className={`text-xs font-bold px-2.5 py-1 rounded-full bg-gradient-to-r ${prog.tag} ${prog.tagText} inline-block mb-2 w-fit`}>
                  {prog.age}
                </span>
                <h3 className="text-base font-bold text-gray-900 mb-0.5">{prog.label}</h3>
                {prog.sublabel && <p className={`text-xs font-semibold ${prog.tagText} mb-1`}>{prog.sublabel}</p>}
                <p className="text-xs text-gray-500 italic mb-2">{prog.focus}</p>
                <p className="text-xs text-gray-600 mb-4 leading-relaxed flex-1">{prog.description}</p>
                <div className="flex gap-3 mb-3">
                  <div className="flex-1 bg-white/70 rounded-xl p-2.5 text-center">
                    <div className="text-xs text-gray-400 mb-0.5">Ratio</div>
                    <div className="text-sm font-bold text-gray-800">{prog.ratio}</div>
                  </div>
                  <div className="flex-1 bg-white/70 rounded-xl p-2.5 text-center">
                    <div className="text-xs text-gray-400 mb-0.5">Class</div>
                    <div className="text-xs font-bold text-gray-800">{prog.classSize}</div>
                  </div>
                </div>
                <ul className="space-y-1.5">
                  {prog.features.map((f, j) => (
                    <li key={j} className="flex items-center gap-2 text-xs text-gray-700">
                      <CheckCircle className="w-3.5 h-3.5 flex-shrink-0 text-emerald-500" />
                      {f}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
          {/* Swipe hint dots for mobile */}
          <div className="sm:hidden flex justify-center gap-1.5 mt-2 mb-4">
            {programs.map((_, i) => (
              <div key={i} className={`w-1.5 h-1.5 rounded-full ${i === 0 ? 'bg-coral-400' : 'bg-gray-200'}`} />
            ))}
          </div>

          {/* Desktop: grid */}
          <div className="hidden sm:grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-5">
            {programs.map((prog, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{
                  duration: 0.55,
                  delay: i * 0.09,
                  ease: [0.25, 0.46, 0.45, 0.94],
                }}
                whileHover={{
                  y: -4,
                  transition: {
                    duration: 0.25,
                    ease: "easeOut",
                  },
                }}
                className={`bg-gradient-to-br ${prog.bg} rounded-3xl p-6 border ${prog.border} shadow hover:shadow-lg transition-shadow group flex flex-col`}
              >
                <div
                  className={`w-12 h-12 rounded-2xl bg-gradient-to-br ${prog.gradient} flex items-center justify-center mb-3 shadow-md group-hover:scale-110 transition-transform text-xl`}
                >
                  {prog.emoji}
                </div>
                <span
                  className={`text-xs font-bold px-2.5 py-1 rounded-full bg-gradient-to-r ${prog.tag} ${prog.tagText} inline-block mb-2 w-fit`}
                >
                  {prog.age}
                </span>
                <h3 className="text-base font-bold text-gray-900 mb-0.5">
                  {prog.label}
                </h3>
                {prog.sublabel && (
                  <p
                    className={`text-xs font-semibold ${prog.tagText} mb-1`}
                  >
                    {prog.sublabel}
                  </p>
                )}
                <p className="text-xs text-gray-500 italic mb-2">
                  {prog.focus}
                </p>
                <p className="text-xs text-gray-600 mb-4 leading-relaxed flex-1">
                  {prog.description}
                </p>

                {/* Ratio & class size */}
                <div className="flex gap-3 mb-4">
                  <div className="flex-1 bg-white/70 rounded-xl p-2.5 text-center">
                    <div className="text-xs text-gray-400 mb-0.5">
                      Ratio
                    </div>
                    <div className="text-sm font-bold text-gray-800">
                      {prog.ratio}
                    </div>
                  </div>
                  <div className="flex-1 bg-white/70 rounded-xl p-2.5 text-center">
                    <div className="text-xs text-gray-400 mb-0.5">
                      Class
                    </div>
                    <div className="text-xs font-bold text-gray-800">
                      {prog.classSize}
                    </div>
                  </div>
                </div>

                <ul className="space-y-1.5">
                  {prog.features.map((f, j) => (
                    <li
                      key={j}
                      className="flex items-center gap-2 text-xs text-gray-700"
                    >
                      <CheckCircle className="w-3.5 h-3.5 flex-shrink-0 text-emerald-500" />
                      {f}
                    </li>
                  ))}
                </ul>
              </motion.div>
            ))}
          </div>

          {/* Mid-page CTA */}
          <div className="mt-12 bg-gradient-to-r from-peach-50 to-mint-50 rounded-3xl p-8 sm:p-10 text-center border border-peach-100">
            <h3 className="text-2xl font-bold text-gray-900 mb-2">
              Not sure which program fits your child?
            </h3>
            <p className="text-gray-600 mb-6">
              Book a free 30-minute consultation with our team
              and we'll help you find the perfect fit.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <Link
                to="/daycare/contact"
                className="inline-flex items-center justify-center gap-2 px-8 py-4 rounded-2xl bg-gradient-to-r from-peach-400 to-coral-500 text-white font-bold shadow-lg hover:shadow-xl hover:scale-105 transition-all"
              >
                <Calendar className="w-5 h-5" />
                Book a Free Consultation
              </Link>
              <Link
                to="/daycare/parent-info"
                className="inline-flex items-center justify-center gap-2 px-8 py-4 rounded-2xl border-2 border-gray-200 text-gray-700 font-bold hover:border-peach-300 transition-all"
              >
                <Download className="w-5 h-5" />
                Download Program Guide
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════════════════
          WHY PARENTS CHOOSE US
      ══════════════════════════════════════════════════════════ */}
      <section className="py-20 lg:py-28 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-14"
          >
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white shadow-md text-mint-700 text-sm mb-4 border border-gray-100">
              <Heart className="w-4 h-4" />
              <span className="font-semibold">
                Why Parents Choose Us
              </span>
            </div>
            <h2 className="text-4xl lg:text-5xl font-bold text-gray-900 mb-4">
              The Early Years Difference
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Four pillars that make us Egypt's most trusted
              choice for early childhood education.
            </p>
          </motion.div>
          <div className="grid md:grid-cols-2 gap-6">
            {[
              {
                icon: Shield,
                title: "Safe & Secure",
                desc: "Children feel safe with experienced staff who make the settling-in process warm and reassuring. Security is built into every layer of our campus.",
                gradient: "from-mint-400 to-teal-500",
              },
              {
                icon: Sprout,
                title: "EYFS Learning",
                desc: "Our play-based curriculum respects each child's uniqueness and builds strong foundations for lifelong learning — and genuine love of discovery.",
                gradient: "from-peach-400 to-coral-500",
              },
              {
                icon: Sparkles,
                title: "Enabling Environments",
                desc: "Beautifully designed spaces stocked with learning materials that encourage exploration, creativity, and independent thinking every day.",
                gradient: "from-lavender-400 to-purple-500",
              },
              {
                icon: Heart,
                title: "Parent Partnership",
                desc: "Daily written updates, open-door communication, and regular parent events keep you genuinely connected to your child's learning journey.",
                gradient: "from-pink-400 to-coral-500",
              },
            ].map((v, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: i * 0.1 }}
                whileHover={{ y: -4 }}
                className="relative rounded-3xl overflow-hidden shadow-lg hover:shadow-2xl transition-all group bg-white border border-gray-100"
              >
                <div
                  className={`absolute inset-0 bg-gradient-to-br ${v.gradient} opacity-5 group-hover:opacity-10 transition-opacity`}
                />
                <div className="relative p-8 flex items-start gap-5">
                  <div
                    className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${v.gradient} flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform shadow-md`}
                  >
                    <v.icon className="w-7 h-7 text-white" />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-gray-900 mb-2">
                      {v.title}
                    </h3>
                    <p className="text-gray-600 leading-relaxed">
                      {v.desc}
                    </p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════════════════
          A DAY AT EARLY YEARS — Compact accordion + food menu
      ══════════════════════════════════════════════════════════ */}
      <DaySection />

      {/* ══════════════════════════════════════════════════════════
          CAMPUS GALLERY
      ══════════════════════════════════════════════���═══════════ */}
      <section className="py-20 lg:py-28 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white shadow-md text-blue-700 text-sm mb-4 border border-gray-100">
              <MapPin className="w-4 h-4" />
              <span className="font-semibold">
                Campus Gallery
              </span>
            </div>
            <h2 className="text-4xl lg:text-5xl font-bold text-gray-900 mb-4">
              See Where Your Child Will Learn
            </h2>
            <p className="text-lg text-gray-600 max-w-xl mx-auto">
              Bright classrooms, an open playground, creative
              spaces, and a reading nook — all inside the AUC
              New Cairo campus.
            </p>
          </motion.div>

          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            {GALLERY.map((img, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, scale: 0.95 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.45, delay: i * 0.08 }}
                whileHover={{ scale: 1.02 }}
                className={`relative rounded-2xl overflow-hidden shadow-md hover:shadow-xl transition-all group ${img.span}`}
              >
                <ManagedImage
                  assetKey={img.assetKey}
                  src={img.src}
                  alt={img.alt}
                  className="w-full aspect-[4/3] object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                <div className="absolute bottom-0 left-0 right-0 p-4 text-white transform translate-y-full group-hover:translate-y-0 transition-transform duration-300">
                  <span className="text-sm font-semibold">
                    {img.caption}
                  </span>
                </div>
              </motion.div>
            ))}
          </div>

          <div className="text-center mt-10">
            <Link
              to="/daycare/contact"
              className="inline-flex items-center gap-2 px-8 py-4 rounded-2xl border-2 border-gray-200 text-gray-700 font-semibold hover:border-peach-300 hover:shadow-lg transition-all"
            >
              <Calendar className="w-5 h-5 text-peach-500" />
              Book a Campus Tour
            </Link>
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════════════════
          PARENT TESTIMONIALS
      ══════════════════════════════════════════════════════════ */}
      <section className="py-20 lg:py-28 bg-gradient-to-br from-peach-50/30 via-white to-mint-50/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <Testimonials />
        </div>
      </section>

      {/* ══════════════════════════════════════════════════════════
          EDUCATOR SPOTLIGHT
      ══════════════════════════════════════════════════════════ */}
      <EducatorsCarousel
        educators={
          cmsEducators.length > 0 ? cmsEducators : EDUCATORS
        }
      />

      {/* ══════════════════════════════════════════════════════════
          EYFS CURRICULUM OVERVIEW
      ══════════════════════════════════════════════════════════ */}
      <section className="py-20 lg:py-28 bg-gradient-to-br from-teal-50/40 to-mint-50/40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-14 items-center">
            <motion.div
              initial={{ opacity: 0, x: -24 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-teal-50 text-teal-700 text-sm mb-5 border border-teal-100">
                <BookOpen className="w-4 h-4" />
                <span className="font-semibold">
                  Our Curriculum
                </span>
              </div>
              <h2 className="text-4xl lg:text-5xl font-bold text-gray-900 mb-5">
                Children Learn Best Through{" "}
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-teal-500 to-emerald-500">
                  Play, Curiosity & Discovery
                </span>
              </h2>
              <p className="text-lg text-gray-600 mb-6 leading-relaxed">
                Our EYFS (Early Years Foundation Stage)
                curriculum covers seven key areas of learning —
                all delivered through exploration, stories,
                outdoor adventures, and creative projects.
              </p>
              <div className="grid grid-cols-2 gap-3 mb-8">
                {[
                  {
                    icon: "🗣️",
                    text: "Communication & Language",
                  },
                  { icon: "🏃", text: "Physical Development" },
                  {
                    icon: "❤️",
                    text: "Personal, Social & Emotional",
                  },
                  { icon: "📖", text: "Literacy" },
                  { icon: "🔢", text: "Mathematics" },
                  {
                    icon: "🌍",
                    text: "Understanding the World",
                  },
                  { icon: "🎭", text: "Expressive Arts" },
                  { icon: "🌿", text: "Outdoor Learning" },
                ].map((item, i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, x: -10 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: i * 0.05 }}
                    className="flex items-center gap-2 text-sm text-gray-700 bg-white rounded-xl px-3 py-2.5 shadow-sm border border-gray-100"
                  >
                    <span className="text-base flex-shrink-0">
                      {item.icon}
                    </span>
                    <span>{item.text}</span>
                  </motion.div>
                ))}
              </div>
              <Link
                to="/daycare/parent-info"
                className="inline-flex items-center gap-2 text-teal-600 font-bold hover:text-teal-700 transition-colors"
              >
                Download Parent Information Pack
                <ChevronRight className="w-5 h-5" />
              </Link>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 24 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.15 }}
              className="relative"
            >
              <div className="rounded-3xl overflow-hidden shadow-2xl">
                <ManagedImage
                  assetKey="daycare.hero.family"
                  src="https://images.unsplash.com/photo-1564429238817-393bd4286b2d?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080"
                  alt="Children engaged in creative learning activity"
                  className="w-full aspect-[4/3] object-cover"
                />
              </div>
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{
                  delay: 0.5,
                  duration: 0.35,
                  ease: [0.25, 0.46, 0.45, 0.94],
                }}
                className="absolute -bottom-6 left-0 sm:-left-6 bg-white rounded-2xl p-5 shadow-xl border border-gray-100"
              >
                <div className="flex items-center gap-3">
                  <Star className="w-7 h-7 text-amber-400 fill-amber-400" />
                  <div>
                    <div className="text-sm font-bold text-gray-900">
                      EYFS Certified
                    </div>
                    <div className="text-xs text-gray-500">
                      UK Early Years Foundation Stage
                    </div>
                  </div>
                </div>
              </motion.div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════════════════
          ENROLLMENT PROCESS — 4 steps
      ══════════════════════════════════════════════════════════ */}
      <section className="py-20 lg:py-28 bg-white">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-14"
          >
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white shadow-md text-coral-700 text-sm mb-4 border border-gray-100">
              <CheckCircle className="w-4 h-4" />
              <span className="font-semibold">
                Enrollment Process
              </span>
            </div>
            <h2 className="text-4xl lg:text-5xl font-bold text-gray-900 mb-4">
              Getting Started is Simple
            </h2>
            <p className="text-lg text-gray-600 max-w-xl mx-auto">
              We make enrolment smooth and stress-free. Most
              families complete all four steps within a week.
            </p>
          </motion.div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
            {ENROLL_STEPS.map((s, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: i * 0.1 }}
                className="relative bg-white rounded-3xl p-7 shadow-lg hover:shadow-xl transition-all text-center border border-gray-100 group"
              >
                {i < ENROLL_STEPS.length - 1 && (
                  <div className="hidden lg:block absolute top-10 -right-3 w-6 h-0.5 bg-gray-200 z-20" />
                )}
                <div className="text-4xl mb-4">{s.icon}</div>
                <div className="w-8 h-8 rounded-full bg-gradient-to-r from-peach-400 to-coral-500 text-white text-sm font-bold flex items-center justify-center mx-auto mb-4">
                  {s.step}
                </div>
                <h3 className="text-lg font-bold text-gray-900 mb-2">
                  {s.title}
                </h3>
                <p className="text-sm text-gray-600 leading-relaxed">
                  {s.desc}
                </p>
              </motion.div>
            ))}
          </div>

          <div className="text-center">
            <Link
              to="/daycare/contact"
              className="inline-flex items-center gap-2 px-10 py-5 rounded-2xl bg-gradient-to-r from-peach-400 via-coral-500 to-pink-500 text-white font-bold shadow-2xl hover:scale-105 transition-all text-lg"
            >
              <Calendar className="w-6 h-6" />
              Start Your Enrollment — Book a Visit
            </Link>
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════════════════
          FAQ
      ══════════════════════════════════════════════════════════ */}
      <section className="py-20 lg:py-28 bg-gradient-to-br from-gray-50 to-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <FAQSection />
        </div>
      </section>

      {/* ══════════════════════════════════════════════════════════
          BLOG PREVIEW
      ══════════════════════════════════════════════════════════ */}
      <section className="py-20 lg:py-28 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white shadow-md text-gray-600 text-sm mb-4 border border-gray-100">
              <BookOpen className="w-4 h-4" />
              <span className="font-semibold">
                Parent & Educator Resources
              </span>
            </div>
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              Helpful Reads
            </h2>
            <p className="text-gray-600 max-w-xl mx-auto">
              Guides for parents navigating childcare decisions,
              and insights for educators building their careers.
            </p>
          </motion.div>
          <div className="grid md:grid-cols-3 gap-6">
            {BLOG_POSTS.map((post, i) => (
              <Link key={i} to={post.slug}>
                <motion.article
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.1 }}
                  whileHover={{ y: -4 }}
                  className="bg-white rounded-2xl border border-gray-100 shadow-md hover:shadow-xl transition-all p-7 flex flex-col group cursor-pointer h-full"
                >
                  <span
                    className={`text-xs font-bold px-2.5 py-1 rounded-full ${post.tagColor} inline-block mb-4 w-fit`}
                  >
                    {post.tag}
                  </span>
                  <div className="text-3xl mb-3">
                    {post.emoji}
                  </div>
                  <h3 className="text-lg font-bold text-gray-900 mb-2 group-hover:text-peach-600 transition-colors">
                    {post.title}
                  </h3>
                  <p className="text-sm text-gray-600 leading-relaxed flex-1">
                    {post.excerpt}
                  </p>
                  <div className="mt-4 flex items-center gap-1.5 text-sm font-semibold text-peach-600 group-hover:gap-3 transition-all">
                    <span>Read More</span>
                    <ArrowRight className="w-4 h-4" />
                  </div>
                </motion.article>
              </Link>
            ))}
          </div>
          <div className="text-center mt-8">
            <Link
              to="/blog"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-2xl border-2 border-gray-200 text-gray-700 font-semibold hover:border-peach-300 transition-all"
            >
              View All Articles
              <ArrowRight className="w-5 h-5" />
            </Link>
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════════════════
          FINAL CTA
      ══════════════════════════════════════════════════════════ */}
      <section className="relative py-24 lg:py-32 bg-gradient-to-br from-peach-400 via-coral-500 to-pink-500 overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 rounded-full bg-white/10 -translate-y-1/2 translate-x-1/2" />
        <div className="absolute bottom-0 left-0 w-72 h-72 rounded-full bg-white/10 translate-y-1/2 -translate-x-1/2" />
        <div className="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <div className="text-6xl mb-6">🌈</div>
            <h2 className="text-4xl lg:text-6xl font-bold text-white mb-5 leading-tight">
              Come See It for Yourself
            </h2>
            <p className="text-xl text-white/90 mb-4 max-w-2xl mx-auto leading-relaxed">
              Book a campus tour — Monday to Friday,{" "}
              <strong>10:30 AM to 12:00 PM</strong> — and see
              why hundreds of Cairo families trust Early Years
              with their most important people.
            </p>
            <div className="flex items-center justify-center gap-2 text-white/80 mb-10">
              <Phone className="w-4 h-4" />
              <span className="text-sm">
                (+202) 02-2615-3903&nbsp;|&nbsp;+02 011 1443
                3382
              </span>
            </div>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.97 }}
              >
                <Link
                  to="/daycare/contact"
                  className="inline-flex items-center gap-2 px-10 py-5 rounded-2xl bg-white text-gray-900 font-bold shadow-2xl hover:shadow-3xl transition-all text-lg"
                >
                  <Calendar className="w-6 h-6 text-coral-500" />
                  Book a Visit
                </Link>
              </motion.div>
              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.97 }}
              >
                <Link
                  to="/daycare/programs"
                  className="inline-flex items-center gap-2 px-10 py-5 rounded-2xl border-2 border-white text-white font-bold hover:bg-white/10 transition-all text-lg"
                >
                  Explore Programs
                  <ArrowRight className="w-6 h-6" />
                </Link>
              </motion.div>
            </div>
          </motion.div>
        </div>
      </section>

      </main>
      <DaycareFooter />

      {/* ── Sticky mobile action bar (hidden on lg+) ── */}
      <nav aria-label="Mobile contact actions" className="lg:hidden fixed bottom-0 inset-x-0 z-50 bg-white border-t border-gray-200 shadow-2xl">
        <div className="flex items-stretch">
          <a
            href="https://wa.me/201234567890"
            target="_blank"
            rel="noopener noreferrer"
            className="flex-1 flex flex-col items-center justify-center gap-1 py-3 bg-green-700 text-white active:bg-green-800 transition-colors min-h-[56px]"
            aria-label="Chat on WhatsApp"
          >
            <MessageCircle className="w-5 h-5" />
            <span className="text-xs font-semibold">
              WhatsApp
            </span>
          </a>
          <div className="w-px bg-white/30" />
          <Link
            to="/daycare/contact"
            className="flex-1 flex flex-col items-center justify-center gap-1 py-3 bg-orange-700 text-white active:bg-orange-800 transition-colors min-h-[56px]"
            aria-label="Book a tour"
          >
            <Calendar className="w-5 h-5" />
            <span className="text-xs font-semibold">
              Book a Tour
            </span>
          </Link>
          <div className="w-px bg-white/30" />
          <a
            href="tel:+20226153903"
            className="flex-1 flex flex-col items-center justify-center gap-1 py-3 bg-gray-700 text-white active:bg-gray-800 transition-colors min-h-[56px]"
            aria-label="Call us"
          >
            <Phone className="w-5 h-5" />
            <span className="text-xs font-semibold">Call</span>
          </a>
        </div>
        {/* Safe area spacer for iOS home bar */}
        <div
          className="bg-white pb-safe"
          style={{
            paddingBottom: "env(safe-area-inset-bottom)",
          }}
        />
      </nav>

      {/* Bottom padding so footer isn't hidden behind sticky bar on mobile */}
      <div className="lg:hidden h-16" />
    </div>
  );
}

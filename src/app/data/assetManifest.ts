// ─────────────────────────────────────────────────────────────────────────────
// Global Asset Manifest — semantic keys for every replaceable site image.
// This file is the source of truth for keys and bundled fallback URLs.
// Static public slots resolve to bundled files. Dynamic profile records may
// provide a remote portrait URL, with the matching local slot as their fallback.
//
// Required Supabase tables:
//   global_assets (key TEXT PK, name TEXT, draft_url TEXT, published_url TEXT,
//                  fallback_url TEXT, alt_text TEXT, focal_point JSONB,
//                  version INT, category TEXT, draft_updated_at TIMESTAMPTZ,
//                  published_at TIMESTAMPTZ, created_at TIMESTAMPTZ)
//   asset_versions (id UUID PK, asset_key TEXT, url TEXT, version INT,
//                   notes TEXT, created_at TIMESTAMPTZ)
// ─────────────────────────────────────────────────────────────────────────────

export type AssetCategory =
  | 'daycare-hero'
  | 'daycare-educators'
  | 'daycare-testimonials'
  | 'daycare-gallery'
  | 'daycare-about'
  | 'eduhub-hero'
  | 'eduhub-alumni'
  | 'eduhub-about'
  | 'brand';

export interface AssetEntry {
  key: string;
  name: string;
  category: AssetCategory;
  fallbackUrl: string;
  alt: string;
  usageLocations: string[];
  system?: boolean; // true = bundled logo or system asset, not replaceable via URL
}

// ─── Educators ────────────────────────────────────────────────────────────────
export const EDUCATOR_KEYS: Record<string, string> = {
  'Nesrin Hassanin': 'daycare.educator.nesrin',
  'Lamia Hassanin':  'daycare.educator.lamia',
  'Sarah Al-Masri':  'daycare.educator.sarah',
  'Nadia Hassan':    'daycare.educator.nadia',
  'Reem Fouad':      'daycare.educator.reem',
};

// ─── Testimonials ─────────────────────────────────────────────────────────────
export const TESTIMONIAL_KEYS: Record<string, string> = {
  'Sarah Mohamed':  'daycare.testimonial.sarah-m',
  'Ahmed Hassan':   'daycare.testimonial.ahmed',
  'Noha Ibrahim':   'daycare.testimonial.noha',
  'Karim Ali':      'daycare.testimonial.karim',
  'Dina Youssef':   'daycare.testimonial.dina',
  'Hossam Farid':   'daycare.testimonial.hossam',
};

// ─── Alumni ───────────────────────────────────────────────────────────────────
export const ALUMNI_KEYS: Record<string, string> = {
  'Nour Abdel-Aziz': 'eduhub.alumni.nour',
  'Yasmine Mostafa': 'eduhub.alumni.yasmine',
  'Omar Khalil':     'eduhub.alumni.omar',
};

// ─── Full manifest ────────────────────────────────────────────────────────────
const ASSET_DEFINITIONS: Record<string, AssetEntry> = {

  // ── Daycare: Hero ──────────────────────────────────────────────────────────
  'daycare.hero': {
    key: 'daycare.hero',
    name: 'Daycare Hero',
    category: 'daycare-hero',
    fallbackUrl: 'https://images.unsplash.com/photo-1759772238042-3d95f8256381?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080',
    alt: 'Children learning at Early Years Daycare',
    usageLocations: ['Daycare Home – Hero section'],
  },
  'daycare.hero.family': {
    key: 'daycare.hero.family',
    name: 'Daycare Family CTA',
    category: 'daycare-hero',
    fallbackUrl: 'https://images.unsplash.com/photo-1564429238817-393bd4286b2d?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080',
    alt: 'Happy family at Early Years',
    usageLocations: ['Daycare Home – Bottom CTA'],
  },
  'daycare.section.family-play': {
    key: 'daycare.section.family-play',
    name: 'Family Play Section',
    category: 'daycare-hero',
    fallbackUrl: 'https://images.unsplash.com/photo-1767680148642-ac49a46543d3?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=600',
    alt: 'Family playing together',
    usageLocations: ['Daycare Home – Why EYC section'],
  },
  'daycare.section.classroom-2': {
    key: 'daycare.section.classroom-2',
    name: 'Classroom Activity',
    category: 'daycare-hero',
    fallbackUrl: 'https://images.unsplash.com/photo-1761208663763-c4d30657c910?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=600',
    alt: 'Children in classroom activity',
    usageLocations: ['Daycare Home – Why EYC section'],
  },

  // ── Daycare: About ─────────────────────────────────────────────────────────
  'daycare.about.hero': {
    key: 'daycare.about.hero',
    name: 'Daycare About Hero',
    category: 'daycare-about',
    fallbackUrl: 'https://images.unsplash.com/photo-1587654780291-39c9404d746b?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080',
    alt: 'Children playing at Early Years',
    usageLocations: ['Daycare About – Hero'],
  },
  'daycare.about.mission': {
    key: 'daycare.about.mission',
    name: 'Daycare Mission Image',
    category: 'daycare-about',
    fallbackUrl: 'https://images.unsplash.com/photo-1503454537195-1dcabb73ffb9?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080',
    alt: 'Children learning together',
    usageLocations: ['Daycare About – Mission section'],
  },

  // ── Daycare: Educators ─────────────────────────────────────────────────────
  'daycare.educator.nesrin': {
    key: 'daycare.educator.nesrin',
    name: 'Nesrin Hassanin Portrait',
    category: 'daycare-educators',
    fallbackUrl: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=400',
    alt: 'Nesrin Hassanin, Managing Director',
    usageLocations: ['Educators Carousel', 'Daycare Home – Team'],
  },
  'daycare.educator.lamia': {
    key: 'daycare.educator.lamia',
    name: 'Lamia Hassanin Portrait',
    category: 'daycare-educators',
    fallbackUrl: '/images/daycare/team/lamia-hassanin.jpg',
    alt: 'Lamia Hassanin, Educational Coordinator',
    usageLocations: ['Educators Carousel', 'Daycare Home – Team'],
  },
  'daycare.educator.sarah': {
    key: 'daycare.educator.sarah',
    name: 'Sarah Al-Masri Portrait',
    category: 'daycare-educators',
    fallbackUrl: 'https://images.unsplash.com/photo-1758685847967-c598c3b176b0?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=400',
    alt: 'Sarah Al-Masri, Lead Early Years Educator',
    usageLocations: ['Educators Carousel'],
  },
  'daycare.educator.nadia': {
    key: 'daycare.educator.nadia',
    name: 'Nadia Hassan Portrait',
    category: 'daycare-educators',
    fallbackUrl: 'https://images.unsplash.com/photo-1607746882042-944635dfe10e?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=400',
    alt: 'Nadia Hassan, Nursery Room Leader',
    usageLocations: ['Educators Carousel'],
  },
  'daycare.educator.reem': {
    key: 'daycare.educator.reem',
    name: 'Reem Fouad Portrait',
    category: 'daycare-educators',
    fallbackUrl: 'https://images.unsplash.com/photo-1761604478724-13fe879468cf?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=400',
    alt: 'Reem Fouad, Pre-K & School Readiness Lead',
    usageLocations: ['Educators Carousel'],
  },

  // ── Daycare: Testimonials ─────────────────────────────────────────────────
  'daycare.testimonial.sarah-m': {
    key: 'daycare.testimonial.sarah-m',
    name: 'Sarah Mohamed Avatar',
    category: 'daycare-testimonials',
    fallbackUrl: 'https://images.unsplash.com/photo-1628676348963-f88c671333f6?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=200',
    alt: 'Sarah Mohamed, parent',
    usageLocations: ['Testimonials Carousel'],
  },
  'daycare.testimonial.ahmed': {
    key: 'daycare.testimonial.ahmed',
    name: 'Ahmed Hassan Avatar',
    category: 'daycare-testimonials',
    fallbackUrl: 'https://images.unsplash.com/photo-1685580388390-576100ae9ce3?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=200',
    alt: 'Ahmed Hassan, parent',
    usageLocations: ['Testimonials Carousel'],
  },
  'daycare.testimonial.noha': {
    key: 'daycare.testimonial.noha',
    name: 'Noha Ibrahim Avatar',
    category: 'daycare-testimonials',
    fallbackUrl: 'https://images.unsplash.com/photo-1624272864537-8ecc72b67958?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=200',
    alt: 'Noha Ibrahim, parent',
    usageLocations: ['Testimonials Carousel'],
  },
  'daycare.testimonial.karim': {
    key: 'daycare.testimonial.karim',
    name: 'Karim Ali Avatar',
    category: 'daycare-testimonials',
    fallbackUrl: 'https://images.unsplash.com/photo-1774641374101-0c5a243b7e7e?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=200',
    alt: 'Karim Ali, parent',
    usageLocations: ['Testimonials Carousel'],
  },
  'daycare.testimonial.dina': {
    key: 'daycare.testimonial.dina',
    name: 'Dina Youssef Avatar',
    category: 'daycare-testimonials',
    fallbackUrl: 'https://images.unsplash.com/photo-1564429238817-393bd4286b2d?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=200',
    alt: 'Dina Youssef, parent',
    usageLocations: ['Testimonials Carousel'],
  },
  'daycare.testimonial.hossam': {
    key: 'daycare.testimonial.hossam',
    name: 'Hossam Farid Avatar',
    category: 'daycare-testimonials',
    fallbackUrl: 'https://images.unsplash.com/photo-1564429238817-393bd4286b2d?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=200',
    alt: 'Hossam Farid, parent',
    usageLocations: ['Testimonials Carousel'],
  },

  // ── Daycare: Gallery ──────────────────────────────────────────────────────
  'daycare.gallery.classroom': {
    key: 'daycare.gallery.classroom',
    name: 'Main Classroom',
    category: 'daycare-gallery',
    fallbackUrl: 'https://images.unsplash.com/photo-1761208663763-c4d30657c910?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=800',
    alt: 'Children playing in bright classroom',
    usageLocations: ['Campus Gallery'],
  },
  'daycare.gallery.sensory': {
    key: 'daycare.gallery.sensory',
    name: 'Sensory Play Area',
    category: 'daycare-gallery',
    fallbackUrl: 'https://images.unsplash.com/photo-1764786077942-40f305ebcd97?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=800',
    alt: 'Sensory water play activity',
    usageLocations: ['Campus Gallery'],
  },
  'daycare.gallery.playground': {
    key: 'daycare.gallery.playground',
    name: 'Outdoor Playground',
    category: 'daycare-gallery',
    fallbackUrl: 'https://images.unsplash.com/photo-1753488821008-10ebbe34e73e?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=800',
    alt: 'Outdoor playground area',
    usageLocations: ['Campus Gallery'],
  },
  'daycare.gallery.dining': {
    key: 'daycare.gallery.dining',
    name: 'Dining Area',
    category: 'daycare-gallery',
    fallbackUrl: 'https://images.unsplash.com/photo-1528960647731-ab4ec9b96a04?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=800',
    alt: 'Children eating lunch together',
    usageLocations: ['Campus Gallery'],
  },
  'daycare.gallery.reading': {
    key: 'daycare.gallery.reading',
    name: 'Reading Corner',
    category: 'daycare-gallery',
    fallbackUrl: 'https://images.unsplash.com/photo-1762475833776-fd57865db4d5?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=800',
    alt: 'Cozy reading corner',
    usageLocations: ['Campus Gallery'],
  },

  // ── EduHub: Hero ──────────────────────────────────────────────────────────
  'eduhub.hero': {
    key: 'eduhub.hero',
    name: 'EduHub Hero',
    category: 'eduhub-hero',
    fallbackUrl: 'https://images.unsplash.com/photo-1758270704021-361c165d68fd?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080',
    alt: 'Professional teacher training session',
    usageLocations: ['EduHub Home – Hero section'],
  },
  'eduhub.hero.graduates': {
    key: 'eduhub.hero.graduates',
    name: 'EduHub Graduates CTA',
    category: 'eduhub-hero',
    fallbackUrl: 'https://images.unsplash.com/photo-1593442808882-775dfcd90699?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080',
    alt: 'CACHE graduates celebrating',
    usageLocations: ['EduHub Home – CTA section'],
  },

  // ── EduHub: About ─────────────────────────────────────────────────────────
  'eduhub.about.hero': {
    key: 'eduhub.about.hero',
    name: 'EduHub About Hero',
    category: 'eduhub-about',
    fallbackUrl: 'https://images.unsplash.com/photo-1524178232363-1fb2b075b655?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080',
    alt: 'Teacher training classroom',
    usageLocations: ['EduHub About – Hero', 'EduHub Programs – Section'],
  },
  'eduhub.about.team': {
    key: 'eduhub.about.team',
    name: 'EduHub Team Photo',
    category: 'eduhub-about',
    fallbackUrl: 'https://images.unsplash.com/photo-1522071820081-009f0129c71c?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080',
    alt: 'EduHub training group',
    usageLocations: ['EduHub About – Team section', 'EduHub Programs'],
  },
  'eduhub.about.training': {
    key: 'eduhub.about.training',
    name: 'Professional Training',
    category: 'eduhub-about',
    fallbackUrl: 'https://images.unsplash.com/photo-1509062522246-3755977927d7?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080',
    alt: 'Professional development training',
    usageLocations: ['EduHub Programs – Section images'],
  },

  // ── EduHub: Alumni ────────────────────────────────────────────────────────
  'eduhub.alumni.nour': {
    key: 'eduhub.alumni.nour',
    name: 'Nour Abdel-Aziz Portrait',
    category: 'eduhub-alumni',
    fallbackUrl: 'https://images.unsplash.com/photo-1758691737605-69a0e78bd193?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=400',
    alt: 'Nour Abdel-Aziz, CACHE Level 3 Graduate',
    usageLocations: ['EduHub Alumni Spotlights'],
  },
  'eduhub.alumni.yasmine': {
    key: 'eduhub.alumni.yasmine',
    name: 'Yasmine Mostafa Portrait',
    category: 'eduhub-alumni',
    fallbackUrl: 'https://images.unsplash.com/photo-1691256257499-25b0717e3f57?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=400',
    alt: 'Yasmine Mostafa, CACHE Level 5 Graduate',
    usageLocations: ['EduHub Alumni Spotlights'],
  },
  'eduhub.alumni.omar': {
    key: 'eduhub.alumni.omar',
    name: 'Omar Khalil Portrait',
    category: 'eduhub-alumni',
    fallbackUrl: 'https://images.unsplash.com/photo-1755718669459-a8691dd613de?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=400',
    alt: 'Omar Khalil, CACHE Level 2 Graduate',
    usageLocations: ['EduHub Alumni Spotlights'],
  },
};

const localFallbackPath = (key: string) => `/images/${key.startsWith('eduhub.') ? 'eduhub' : 'daycare'}/${key}.jpg`;

/** Public static fallbacks are always bundled semantic slots. */
export const ASSET_MANIFEST: Record<string, AssetEntry> = Object.fromEntries(
  Object.entries(ASSET_DEFINITIONS).map(([key, entry]) => [
    key,
    { ...entry, fallbackUrl: localFallbackPath(key) },
  ]),
);

/** Resolve an asset key to its bundled fallback URL */
export function getFallbackUrl(key: string): string {
  return ASSET_MANIFEST[key]?.fallbackUrl ?? '';
}

/** Get alt text for an asset key */
export function getFallbackAlt(key: string): string {
  return ASSET_MANIFEST[key]?.alt ?? '';
}

/** All registered asset keys */
export const ALL_ASSET_KEYS = Object.keys(ASSET_MANIFEST);

/** All category values */
export const ASSET_CATEGORIES: AssetCategory[] = [
  'daycare-hero', 'daycare-educators', 'daycare-testimonials',
  'daycare-gallery', 'daycare-about', 'eduhub-hero', 'eduhub-alumni',
  'eduhub-about', 'brand',
];

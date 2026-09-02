// ─────────────────────────────────────────────────────────────────────────────
// Local Image Registry — the single source of truth for every public image.
//
// HOW TO REPLACE AN IMAGE
//   Replace the matching file in public/images/daycare or public/images/eduhub,
//   keeping its semantic filename. Rebuild and publish the website.
//
// Every component that displays a public image must import from this registry
// via ManagedImage (assetKey prop) — never hardcode image URLs in components.
//
// Images marked "Manual upload required" have no local file yet.
// Attach the original image in the Make conversation to embed it.
// ─────────────────────────────────────────────────────────────────────────────

export interface RegistryEntry {
  /** Imported image module or external URL. Used for desktop / default display. */
  desktop: string;
  /** Optional separate mobile image (≤800px wide). Falls back to desktop if omitted. */
  mobile?: string;
  alt: string;
  focalX: number;
  focalY: number;
  usageLocations: string[];
  /** Recommended desktop dimensions (width × height, aspect ratio) */
  desktopDimensions: string;
  /** Recommended mobile dimensions */
  mobileDimensions: string;
  /** Whether a real local file has been attached yet */
  embedded: boolean;
}

export const LOCAL_IMAGE_REGISTRY: Record<string, RegistryEntry> = {

  // ── Daycare: Hero ──────────────────────────────────────────────────────────

  'daycare.hero': {
    desktop: '/images/daycare/campus-original.jpg',
    alt: 'Children arriving happily at Early Years daycare',
    focalX: 0.5,
    focalY: 0.4,
    usageLocations: ['Daycare Home – Hero section (daycare/Home.tsx ~line 910)'],
    desktopDimensions: '1400 × 1050 px (4:3)',
    mobileDimensions: '800 × 800 px (1:1)',
    embedded: true,
  },

  'daycare.hero.family': {
    desktop: 'https://images.unsplash.com/photo-1564429238817-393bd4286b2d?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080',
    alt: 'Happy family at Early Years',
    focalX: 0.5,
    focalY: 0.4,
    usageLocations: ['Daycare Home – Bottom CTA section (daycare/Home.tsx ~line 1570)'],
    desktopDimensions: '1400 × 1050 px (4:3)',
    mobileDimensions: '800 × 600 px (4:3)',
    embedded: false,
  },

  'daycare.section.family-play': {
    desktop: 'https://images.unsplash.com/photo-1767680148642-ac49a46543d3?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=600',
    alt: 'Family playing together',
    focalX: 0.5,
    focalY: 0.5,
    usageLocations: ['Daycare Home – Why EYC section (daycare/Home.tsx ~line 1097)'],
    desktopDimensions: '800 × 600 px (4:3)',
    mobileDimensions: '600 × 600 px (1:1)',
    embedded: false,
  },

  'daycare.section.classroom-2': {
    desktop: 'https://images.unsplash.com/photo-1761208663763-c4d30657c910?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=600',
    alt: 'Children in classroom activity',
    focalX: 0.5,
    focalY: 0.5,
    usageLocations: ['Daycare Home – Why EYC section (daycare/Home.tsx ~line 1107)'],
    desktopDimensions: '800 × 600 px (4:3)',
    mobileDimensions: '600 × 600 px (1:1)',
    embedded: false,
  },

  // ── Daycare: About ─────────────────────────────────────────────────────────

  'daycare.about.hero': {
    desktop: 'https://images.unsplash.com/photo-1587654780291-39c9404d746b?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080',
    alt: 'Children playing at Early Years',
    focalX: 0.5,
    focalY: 0.4,
    usageLocations: ['Daycare About – Hero (daycare/About page)'],
    desktopDimensions: '1400 × 600 px (7:3)',
    mobileDimensions: '800 × 500 px',
    embedded: false,
  },

  'daycare.about.mission': {
    desktop: 'https://images.unsplash.com/photo-1503454537195-1dcabb73ffb9?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080',
    alt: 'Children learning together',
    focalX: 0.5,
    focalY: 0.5,
    usageLocations: ['Daycare About – Mission section'],
    desktopDimensions: '800 × 600 px (4:3)',
    mobileDimensions: '600 × 450 px (4:3)',
    embedded: false,
  },

  // ── Daycare: Educators ─────────────────────────────────────────────────────

  'daycare.educator.nesrin': {
    desktop: '/images/daycare/team/nesreen-hassanin.jpg',
    alt: 'Nesrin Hassanin, Managing Director',
    focalX: 0.5,
    focalY: 0.2,
    usageLocations: ['Educators Carousel (components/daycare/EducatorsCarousel.tsx)'],
    desktopDimensions: '400 × 500 px (4:5 portrait)',
    mobileDimensions: '300 × 375 px (4:5)',
    embedded: true,
  },

  'daycare.educator.lamia': {
    desktop: '/images/daycare/team/lamia-hassanin.jpg',
    alt: 'Lamia Hassanin, Educational Coordinator',
    focalX: 0.5,
    focalY: 0.2,
    usageLocations: ['Educators Carousel (components/daycare/EducatorsCarousel.tsx)'],
    desktopDimensions: '400 × 500 px (4:5 portrait)',
    mobileDimensions: '300 × 375 px (4:5)',
    embedded: true,
  },

  'daycare.educator.sarah': {
    desktop: 'https://images.unsplash.com/photo-1758685847967-c598c3b176b0?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=400',
    alt: 'Sarah Al-Masri, Lead Early Years Educator',
    focalX: 0.5,
    focalY: 0.2,
    usageLocations: ['Educators Carousel (components/daycare/EducatorsCarousel.tsx)'],
    desktopDimensions: '400 × 500 px (4:5 portrait)',
    mobileDimensions: '300 × 375 px (4:5)',
    embedded: false,
  },

  'daycare.educator.nadia': {
    desktop: 'https://images.unsplash.com/photo-1607746882042-944635dfe10e?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=400',
    alt: 'Nadia Hassan, Nursery Room Leader',
    focalX: 0.5,
    focalY: 0.2,
    usageLocations: ['Educators Carousel (components/daycare/EducatorsCarousel.tsx)'],
    desktopDimensions: '400 × 500 px (4:5 portrait)',
    mobileDimensions: '300 × 375 px (4:5)',
    embedded: false,
  },

  'daycare.educator.reem': {
    desktop: 'https://images.unsplash.com/photo-1761604478724-13fe879468cf?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=400',
    alt: 'Reem Fouad, Pre-K & School Readiness Lead',
    focalX: 0.5,
    focalY: 0.2,
    usageLocations: ['Educators Carousel (components/daycare/EducatorsCarousel.tsx)'],
    desktopDimensions: '400 × 500 px (4:5 portrait)',
    mobileDimensions: '300 × 375 px (4:5)',
    embedded: false,
  },

  // ── Daycare: Testimonials ─────────────────────────────────────────────────

  'daycare.testimonial.sarah-m': {
    desktop: 'https://images.unsplash.com/photo-1628676348963-f88c671333f6?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=200',
    alt: 'Sarah Mohamed, parent',
    focalX: 0.5,
    focalY: 0.2,
    usageLocations: ['Testimonials Carousel (components/daycare/Testimonials.tsx)'],
    desktopDimensions: '200 × 200 px (1:1)',
    mobileDimensions: '200 × 200 px (1:1)',
    embedded: false,
  },

  'daycare.testimonial.ahmed': {
    desktop: 'https://images.unsplash.com/photo-1685580388390-576100ae9ce3?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=200',
    alt: 'Ahmed Hassan, parent',
    focalX: 0.5,
    focalY: 0.2,
    usageLocations: ['Testimonials Carousel (components/daycare/Testimonials.tsx)'],
    desktopDimensions: '200 × 200 px (1:1)',
    mobileDimensions: '200 × 200 px (1:1)',
    embedded: false,
  },

  'daycare.testimonial.noha': {
    desktop: 'https://images.unsplash.com/photo-1624272864537-8ecc72b67958?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=200',
    alt: 'Noha Ibrahim, parent',
    focalX: 0.5,
    focalY: 0.2,
    usageLocations: ['Testimonials Carousel (components/daycare/Testimonials.tsx)'],
    desktopDimensions: '200 × 200 px (1:1)',
    mobileDimensions: '200 × 200 px (1:1)',
    embedded: false,
  },

  'daycare.testimonial.karim': {
    desktop: 'https://images.unsplash.com/photo-1774641374101-0c5a243b7e7e?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=200',
    alt: 'Karim Ali, parent',
    focalX: 0.5,
    focalY: 0.2,
    usageLocations: ['Testimonials Carousel (components/daycare/Testimonials.tsx)'],
    desktopDimensions: '200 × 200 px (1:1)',
    mobileDimensions: '200 × 200 px (1:1)',
    embedded: false,
  },

  'daycare.testimonial.dina': {
    desktop: 'https://images.unsplash.com/photo-1567680148642-ac49a46543d3?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=200',
    alt: 'Dina Youssef, parent',
    focalX: 0.5,
    focalY: 0.2,
    usageLocations: ['Testimonials Carousel (components/daycare/Testimonials.tsx)'],
    desktopDimensions: '200 × 200 px (1:1)',
    mobileDimensions: '200 × 200 px (1:1)',
    embedded: false,
  },

  'daycare.testimonial.hossam': {
    desktop: 'https://images.unsplash.com/photo-1564429238817-393bd4286b2d?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=200',
    alt: 'Hossam Farid, parent',
    focalX: 0.5,
    focalY: 0.2,
    usageLocations: ['Testimonials Carousel (components/daycare/Testimonials.tsx)'],
    desktopDimensions: '200 × 200 px (1:1)',
    mobileDimensions: '200 × 200 px (1:1)',
    embedded: false,
  },

  // ── Daycare: Gallery ──────────────────────────────────────────────────────

  'daycare.gallery.classroom': {
    desktop: 'https://images.unsplash.com/photo-1761208663763-c4d30657c910?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=800',
    alt: 'Children playing in bright classroom',
    focalX: 0.5,
    focalY: 0.5,
    usageLocations: ['Daycare Home – Campus Gallery (daycare/Home.tsx)', 'Daycare Home – Why EYC section'],
    desktopDimensions: '800 × 600 px (4:3)',
    mobileDimensions: '600 × 450 px (4:3)',
    embedded: false,
  },

  'daycare.gallery.sensory': {
    desktop: 'https://images.unsplash.com/photo-1764786077942-40f305ebcd97?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=800',
    alt: 'Sensory water play activity',
    focalX: 0.5,
    focalY: 0.5,
    usageLocations: ['Daycare Home – Campus Gallery (daycare/Home.tsx)'],
    desktopDimensions: '800 × 600 px (4:3)',
    mobileDimensions: '600 × 450 px (4:3)',
    embedded: false,
  },

  'daycare.gallery.playground': {
    desktop: 'https://images.unsplash.com/photo-1753488821008-10ebbe34e73e?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=800',
    alt: 'Outdoor playground area',
    focalX: 0.5,
    focalY: 0.5,
    usageLocations: ['Daycare Home – Campus Gallery (daycare/Home.tsx)'],
    desktopDimensions: '800 × 600 px (4:3)',
    mobileDimensions: '600 × 450 px (4:3)',
    embedded: false,
  },

  'daycare.gallery.dining': {
    desktop: 'https://images.unsplash.com/photo-1528960647731-ab4ec9b96a04?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=800',
    alt: 'Children eating lunch together',
    focalX: 0.5,
    focalY: 0.5,
    usageLocations: ['Daycare Home – Campus Gallery (daycare/Home.tsx)'],
    desktopDimensions: '800 × 600 px (4:3)',
    mobileDimensions: '600 × 450 px (4:3)',
    embedded: false,
  },

  'daycare.gallery.reading': {
    desktop: 'https://images.unsplash.com/photo-1762475833776-fd57865db4d5?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=800',
    alt: 'Cozy reading corner',
    focalX: 0.5,
    focalY: 0.5,
    usageLocations: ['Daycare Home – Campus Gallery (daycare/Home.tsx)'],
    desktopDimensions: '800 × 600 px (4:3)',
    mobileDimensions: '600 × 450 px (4:3)',
    embedded: false,
  },

  // ── EduHub: Hero ──────────────────────────────────────────────────────────

  'eduhub.hero': {
    desktop: 'https://images.unsplash.com/photo-1758270704021-361c165d68fd?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080',
    alt: 'Professional teacher training session',
    focalX: 0.5,
    focalY: 0.35,
    usageLocations: ['EduHub Home – Hero section (eduhub/Home.tsx ~line 208)'],
    desktopDimensions: '1400 × 900 px (14:9)',
    mobileDimensions: '800 × 600 px (4:3)',
    embedded: false,
  },

  'eduhub.hero.graduates': {
    desktop: 'https://images.unsplash.com/photo-1593442808882-775dfcd90699?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080',
    alt: 'CACHE graduates celebrating',
    focalX: 0.5,
    focalY: 0.4,
    usageLocations: ['EduHub Home – CTA/Graduates section (eduhub/Home.tsx ~line 474)'],
    desktopDimensions: '1400 × 900 px (14:9)',
    mobileDimensions: '800 × 600 px (4:3)',
    embedded: false,
  },

  // ── EduHub: About ─────────────────────────────────────────────────────────

  'eduhub.about.hero': {
    desktop: 'https://images.unsplash.com/photo-1524178232363-1fb2b075b655?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080',
    alt: 'Teacher training classroom',
    focalX: 0.5,
    focalY: 0.4,
    usageLocations: ['EduHub About – Hero', 'EduHub Programs – Section images'],
    desktopDimensions: '1400 × 600 px (7:3)',
    mobileDimensions: '800 × 500 px',
    embedded: false,
  },

  'eduhub.about.team': {
    desktop: 'https://images.unsplash.com/photo-1522071820081-009f0129c71c?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080',
    alt: 'EduHub training group',
    focalX: 0.5,
    focalY: 0.4,
    usageLocations: ['EduHub About – Team section', 'EduHub Programs page'],
    desktopDimensions: '1200 × 800 px (3:2)',
    mobileDimensions: '800 × 600 px (4:3)',
    embedded: false,
  },

  'eduhub.about.training': {
    desktop: 'https://images.unsplash.com/photo-1509062522246-3755977927d7?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080',
    alt: 'Professional development training',
    focalX: 0.5,
    focalY: 0.5,
    usageLocations: ['EduHub Programs – Section images'],
    desktopDimensions: '1200 × 800 px (3:2)',
    mobileDimensions: '800 × 600 px (4:3)',
    embedded: false,
  },

  // ── EduHub: Alumni ────────────────────────────────────────────────────────

  'eduhub.alumni.nour': {
    desktop: 'https://images.unsplash.com/photo-1758691737605-69a0e78bd193?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=400',
    alt: 'Nour Abdel-Aziz, CACHE Level 3 Graduate',
    focalX: 0.5,
    focalY: 0.2,
    usageLocations: ['EduHub Alumni Spotlights (eduhub/Home.tsx ~line 528)'],
    desktopDimensions: '400 × 400 px (1:1)',
    mobileDimensions: '300 × 300 px (1:1)',
    embedded: false,
  },

  'eduhub.alumni.yasmine': {
    desktop: 'https://images.unsplash.com/photo-1691256257499-25b0717e3f57?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=400',
    alt: 'Yasmine Mostafa, CACHE Level 5 Graduate',
    focalX: 0.5,
    focalY: 0.2,
    usageLocations: ['EduHub Alumni Spotlights (eduhub/Home.tsx ~line 528)'],
    desktopDimensions: '400 × 400 px (1:1)',
    mobileDimensions: '300 × 300 px (1:1)',
    embedded: false,
  },

  'eduhub.alumni.omar': {
    desktop: 'https://images.unsplash.com/photo-1755718669459-a8691dd613de?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=400',
    alt: 'Omar Khalil, CACHE Level 2 Graduate',
    focalX: 0.5,
    focalY: 0.2,
    usageLocations: ['EduHub Alumni Spotlights (eduhub/Home.tsx ~line 528)'],
    desktopDimensions: '400 × 400 px (1:1)',
    mobileDimensions: '300 × 300 px (1:1)',
    embedded: false,
  },
};

/** Resolve an asset key to its local registry entry, or null if not registered. */
export function getRegistryEntry(key: string): RegistryEntry | null {
  return LOCAL_IMAGE_REGISTRY[key] ?? null;
}

/** All registered asset keys */
export const ALL_REGISTRY_KEYS = Object.keys(LOCAL_IMAGE_REGISTRY);

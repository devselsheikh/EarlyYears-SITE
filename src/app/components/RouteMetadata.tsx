import { useEffect } from 'react';
import { useLocation } from 'react-router';

const SITE = 'https://theearlyyearscompany.com';
const DEFAULT_IMAGE = `${SITE}/images/daycare/daycare.hero.family.jpg`;

const pages: Record<string, { title: string; description: string; image?: string }> = {
  '/': { title: 'Early Years Company | Nursery & Teacher Training in Cairo', description: 'Early Years Company provides EYFS childcare at AUC New Cairo and CACHE-accredited educator training through EduHub.' },
  '/daycare': { title: 'Early Years Daycare | EYFS Nursery at AUC New Cairo', description: 'A nurturing EYFS nursery and preschool for children aged 1–5 at AUC New Cairo, with after-school care and seasonal camps.' },
  '/daycare/about': { title: 'About Early Years Daycare | 25+ Years in Cairo', description: 'Meet the team and discover the child-centred EYFS approach behind Early Years Daycare at AUC New Cairo.' },
  '/daycare/programs': { title: 'Nursery, Preschool & Camps | Early Years Daycare', description: 'Explore nursery, preschool, after-school care, summer camps, and winter programmes for children in New Cairo.' },
  '/daycare/parent-info': { title: 'Parent Information | Early Years Daycare', description: 'Practical information for Early Years families, including routines, meals, safety, clothing, and parent partnership.' },
  '/daycare/calendar': { title: 'Calendar & Menus | Early Years Daycare', description: 'View important term dates, upcoming events, and family information from Early Years Daycare.' },
  '/daycare/contact': { title: 'Book a Daycare Tour | Early Years AUC New Cairo', description: 'Contact Early Years Daycare to ask about enrolment or book a visit at the AUC New Cairo campus.' },
  '/eduhub': { title: 'EduHub Egypt | CACHE Early Years Qualifications', description: 'Train for a career in early childhood education with CACHE Level 2, 3, and 5 qualifications delivered in Egypt.' },
  '/eduhub/programs': { title: 'CACHE Qualifications in Egypt | EduHub Programmes', description: 'Compare CACHE-accredited early years qualifications and professional development programmes from EduHub Egypt.' },
  '/eduhub/about': { title: 'About EduHub | Early Years Educator Training Egypt', description: 'Meet the EduHub training team and learn about our UK-recognised early years qualifications and quality standards.' },
  '/eduhub/contact': { title: 'Register Your Interest | EduHub Egypt', description: 'Contact EduHub about CACHE early years qualifications, entry requirements, schedules, and enrolment in Egypt.' },
  '/blog': { title: 'Early Years Advice & Resources | Early Years Company', description: 'Practical guidance for parents and early years educators from the Early Years Company team in Cairo.' },
  '/contact': { title: 'Contact Early Years Company | Daycare & EduHub', description: 'Contact Early Years Daycare or EduHub educator training in New Cairo.' },
  '/privacy': { title: 'Privacy Policy | Early Years Company', description: 'How Early Years Company collects, uses, stores, and protects website and enquiry information.' },
  '/terms': { title: 'Website Terms | Early Years Company', description: 'Terms for using the Early Years Company website, Family Portal, and online resources.' },
  '/thank-you': { title: 'Thank You | Early Years Company', description: 'Your message has been received by the Early Years Company team.' },
};

function setMeta(selector: string, attr: 'name' | 'property', value: string) {
  let element = document.head.querySelector<HTMLMetaElement>(`meta[${attr}="${selector}"]`);
  if (!element) { element = document.createElement('meta'); element.setAttribute(attr, selector); document.head.appendChild(element); }
  element.content = value;
}

export default function RouteMetadata() {
  const { pathname } = useLocation();
  useEffect(() => {
    const base = pages[pathname] ?? (pathname.startsWith('/blog/') ? { title: 'Early Years Article | Early Years Company', description: 'Advice and practical guidance from the Early Years Company.' } : pathname.startsWith('/eduhub/programs/') ? pages['/eduhub/programs'] : pages['/']);
    const canonicalUrl = `${SITE}${pathname === '/' ? '' : pathname}`;
    document.title = base.title;
    setMeta('description', 'name', base.description);
    setMeta('og:title', 'property', base.title);
    setMeta('og:description', 'property', base.description);
    setMeta('og:image', 'property', base.image ?? DEFAULT_IMAGE);
    setMeta('og:url', 'property', canonicalUrl);
    setMeta('og:type', 'property', 'website');
    setMeta('twitter:card', 'name', 'summary_large_image');
    setMeta('twitter:title', 'name', base.title);
    setMeta('twitter:description', 'name', base.description);
    setMeta('twitter:image', 'name', base.image ?? DEFAULT_IMAGE);
    const privatePage = pathname === '/admin' || pathname === '/workspace' || pathname === '/daycare/parents';
    setMeta('robots', 'name', privatePage ? 'noindex, nofollow' : 'index, follow, max-image-preview:large');
    let canonical = document.head.querySelector<HTMLLinkElement>('link[rel="canonical"]');
    if (!canonical) { canonical = document.createElement('link'); canonical.rel = 'canonical'; document.head.appendChild(canonical); }
    canonical.href = canonicalUrl;
  }, [pathname]);
  return null;
}

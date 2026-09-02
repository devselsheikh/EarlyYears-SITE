import { ArrowLeft, ShieldCheck } from 'lucide-react';
import DaycareLogo from '../components/DaycareLogo';

const sections = {
  privacy: [
    ['Information we collect', 'We collect information you provide through enquiry, registration, and contact forms, such as your name, email address, telephone number, and the details you choose to share.'],
    ['How we use it', 'We use this information to respond to enquiries, arrange visits, provide requested services, maintain security, and improve our website when analytics consent is given.'],
    ['Children’s information', 'Do not submit sensitive information about a child through public website forms. Private child records belong only in the authenticated workspace and are restricted by account and classroom permissions.'],
    ['Storage and sharing', 'Information is stored using approved service providers and is not sold. We share it only when needed to operate the service, comply with law, or protect users and the organisation.'],
    ['Your choices', 'You may request access, correction, or deletion of personal information by emailing info@theearlyyearscompany.com. You can decline optional analytics from the cookie notice.'],
  ],
  terms: [
    ['Website use', 'This website provides general information about Early Years Daycare and EduHub. Content may change as programmes, calendars, availability, and requirements are updated.'],
    ['Enquiries and enrolment', 'Submitting a form does not guarantee a daycare place, course admission, price, or booking. The Early Years team will confirm all arrangements directly.'],
    ['Family and account access', 'Portal PINs and workspace credentials must be kept private. Access may be withdrawn when credentials are shared, misused, or no longer required.'],
    ['Downloads and content', 'Website materials are provided for personal or authorised family use. They may not be republished or commercially reused without permission.'],
    ['Liability and contact', 'We work to keep information accurate and the service available, but cannot guarantee uninterrupted access. Contact info@theearlyyearscompany.com with questions about these terms.'],
  ],
};

export default function Legal({ type }: { type: 'privacy' | 'terms' }) {
  const privacy = type === 'privacy';
  return <main className="legal-page"><header><a href="/"><DaycareLogo company /></a><a href="/"><ArrowLeft />Back to website</a></header><article><span><ShieldCheck /></span><p className="platform-eyebrow">Early Years Company</p><h1>{privacy ? 'Privacy policy' : 'Website terms'}</h1><p className="legal-page__intro">{privacy ? 'A clear explanation of what we collect, why we need it, and the choices you have.' : 'The practical terms that apply when using our public website, portals, and resources.'}</p><p className="legal-page__updated">Last updated: 1 September 2026</p>{sections[type].map(([heading, copy]) => <section key={heading}><h2>{heading}</h2><p>{copy}</p></section>)}<aside><strong>Contact</strong><p>Early Years Company, AUC New Cairo, Campus Center, Arnold Pavilion PO29, New Cairo 11835, Egypt · <a href="mailto:info@theearlyyearscompany.com">info@theearlyyearscompany.com</a></p></aside></article></main>;
}

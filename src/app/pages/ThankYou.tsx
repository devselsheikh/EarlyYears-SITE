import { ArrowRight, Check, MessageCircle } from 'lucide-react';
import DaycareLogo from '../components/DaycareLogo';

export default function ThankYou() {
  return <main className="app-error"><section className="app-error__card"><DaycareLogo className="app-error__logo" /><div className="app-error__illustration" aria-hidden="true"><span /><span /><span /></div><span className="thank-you__check"><Check /></span><p className="app-error__eyebrow">Message received</p><h1>Thank you—we’ll take it from here.</h1><p className="app-error__copy">The right Early Years team will review your message and follow up using the contact details you provided.</p><div className="app-error__actions"><a href="/"><ArrowRight />Return to website</a><a href="https://wa.me/201115004090" target="_blank" rel="noopener noreferrer"><MessageCircle />WhatsApp us</a></div></section></main>;
}

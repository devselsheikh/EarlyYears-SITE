import { useEffect, useState } from 'react';

const KEY = 'ey_cookie_choice';
type Choice = 'accepted' | 'essential';

function loadAnalytics() {
  const measurementId = import.meta.env.VITE_GA_MEASUREMENT_ID?.trim();
  if (!measurementId || document.querySelector(`script[data-ey-analytics]`)) return;
  const script = document.createElement('script');
  script.async = true; script.src = `https://www.googletagmanager.com/gtag/js?id=${encodeURIComponent(measurementId)}`; script.dataset.eyAnalytics = 'true';
  document.head.appendChild(script);
  window.dataLayer = window.dataLayer || [];
  window.gtag = (...args: unknown[]) => window.dataLayer.push(args);
  window.gtag('js', new Date()); window.gtag('config', measurementId, { anonymize_ip: true });
}

declare global { interface Window { dataLayer: unknown[]; gtag: (...args: unknown[]) => void; } }

export default function PrivacyControls() {
  const [choice, setChoice] = useState<Choice | null>(() => localStorage.getItem(KEY) as Choice | null);
  useEffect(() => { if (choice === 'accepted') loadAnalytics(); }, [choice]);
  if (choice) return null;
  const choose = (next: Choice) => { localStorage.setItem(KEY, next); setChoice(next); };
  return <aside className="cookie-banner" aria-labelledby="cookie-title"><div><strong id="cookie-title">Your privacy, your choice.</strong><p>We use essential storage to keep the website working. Optional analytics help us understand which pages are useful—only with your permission. <a href="/privacy">Privacy policy</a></p></div><div><button type="button" className="is-quiet" onClick={() => choose('essential')}>Essential only</button><button type="button" onClick={() => choose('accepted')}>Allow analytics</button></div></aside>;
}

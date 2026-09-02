import { useRef, useState, useEffect, useCallback } from 'react';
import { motion, useReducedMotion } from 'motion/react';
import { ChevronLeft, ChevronRight, Award } from 'lucide-react';
import { ImageWithFallback } from '../media/ImageWithFallback';
import { loadCMS } from '../../data/cms';
import ManagedImage from '../ManagedImage';
import { EDUCATOR_KEYS } from '../../data/assetManifest';

export interface Educator {
  name: string;
  title: string;
  cert: string;
  bio: string;
  img: string;
  badge: string;
  leadership?: boolean;
}

const CARD_W = 320;
const GAP = 20;

export default function EducatorsCarousel({ educators }: { educators: Educator[] }) {
  const trackRef = useRef<HTMLDivElement>(null);
  const [activeIndex, setActiveIndex] = useState(0);
  const [canLeft, setCanLeft] = useState(false);
  const [canRight, setCanRight] = useState(true);
  const reduced = useReducedMotion();

  const sync = useCallback(() => {
    const el = trackRef.current;
    if (!el) return;
    setCanLeft(el.scrollLeft > 8);
    setCanRight(el.scrollLeft < el.scrollWidth - el.clientWidth - 8);
    setActiveIndex(Math.min(
      Math.round(el.scrollLeft / (CARD_W + GAP)),
      educators.length - 1,
    ));
  }, [educators.length]);

  useEffect(() => {
    const el = trackRef.current;
    if (!el) return;
    el.addEventListener('scroll', sync, { passive: true });
    sync();
    return () => el.removeEventListener('scroll', sync);
  }, [sync]);

  const scroll = (dir: 'left' | 'right') => {
    trackRef.current?.scrollBy({
      left: dir === 'right' ? CARD_W + GAP : -(CARD_W + GAP),
      behavior: reduced ? 'instant' : 'smooth',
    });
  };

  const scrollTo = (i: number) => {
    trackRef.current?.scrollTo({
      left: i * (CARD_W + GAP),
      behavior: reduced ? 'instant' : 'smooth',
    });
  };

  return (
    <section className="py-20 lg:py-28 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* ── Header ── */}
        <motion.div
          initial={reduced ? false : { opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, ease: [0.25, 0.46, 0.45, 0.94] }}
          className="text-center mb-12"
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-peach-50 border border-peach-200 text-peach-700 text-sm font-semibold mb-5">
            <Award className="w-4 h-4" />
            CACHE-qualified team
          </div>
          <h2 className="text-4xl lg:text-5xl font-bold text-gray-900 mb-4">
            Meet Our Educators
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto leading-relaxed">
            Experienced early years specialists trusted by families and trained in child-centred EYFS practice.
          </p>
        </motion.div>

        {/* ── Carousel ── */}
        <div className="relative">
          {/* Left arrow — desktop only */}
          <button
            onClick={() => scroll('left')}
            disabled={!canLeft}
            aria-label="Previous educator"
            className={`
              hidden md:flex absolute left-0 top-[calc(50%-28px)] -translate-x-5 z-10
              w-11 h-11 rounded-full bg-white shadow-lg border border-gray-100
              items-center justify-center text-gray-500
              hover:text-gray-900 hover:shadow-xl hover:border-peach-200
              transition-all duration-200
              disabled:opacity-25 disabled:cursor-default disabled:hover:shadow-lg disabled:hover:border-gray-100
            `}
          >
            <ChevronLeft className="w-5 h-5" />
          </button>

          {/* Right arrow — desktop only */}
          <button
            onClick={() => scroll('right')}
            disabled={!canRight}
            aria-label="Next educator"
            className={`
              hidden md:flex absolute right-0 top-[calc(50%-28px)] translate-x-5 z-10
              w-11 h-11 rounded-full bg-white shadow-lg border border-gray-100
              items-center justify-center text-gray-500
              hover:text-gray-900 hover:shadow-xl hover:border-peach-200
              transition-all duration-200
              disabled:opacity-25 disabled:cursor-default disabled:hover:shadow-lg disabled:hover:border-gray-100
            `}
          >
            <ChevronRight className="w-5 h-5" />
          </button>

          {/* Track */}
          <div
            ref={trackRef}
            role="region"
            aria-label="Educators carousel"
            tabIndex={0}
            className="flex gap-5 overflow-x-auto py-4 px-1 [&::-webkit-scrollbar]:hidden outline-none focus-visible:ring-2 focus-visible:ring-peach-300 focus-visible:rounded-2xl"
            style={{
              scrollSnapType: 'x mandatory',
              scrollbarWidth: 'none',
              WebkitOverflowScrolling: 'touch' as React.CSSProperties['WebkitOverflowScrolling'],
            }}
          >
            {educators.map((ed, i) => {
              const senior = i < 2;
              return (
                <motion.article
                  key={i}
                  initial={reduced ? false : { opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: '0px -80px 0px 0px' }}
                  transition={{ duration: 0.5, delay: i * 0.07, ease: [0.25, 0.46, 0.45, 0.94] }}
                  whileHover={reduced ? {} : { y: -4, transition: { duration: 0.2, ease: 'easeOut' } }}
                  whileTap={reduced ? {} : { scale: 0.99 }}
                  aria-label={`${ed.name}, ${ed.title}`}
                  className={`
                    group flex-shrink-0 flex flex-col bg-white rounded-3xl overflow-hidden
                    transition-shadow duration-300
                    ${senior
                      ? 'border-2 border-peach-200 shadow-[0_4px_24px_-4px_rgba(251,146,60,0.18)] hover:shadow-[0_8px_32px_-4px_rgba(251,146,60,0.28)]'
                      : 'border border-gray-100 shadow-md hover:shadow-xl'
                    }
                  `}
                  style={{
                    width: 'min(82vw, 320px)',
                    scrollSnapAlign: 'start',
                  }}
                >
                  {/* Image */}
                  <div className="relative flex-shrink-0 overflow-hidden" style={{ height: '220px' }}>
                    <ManagedImage
                      assetKey={EDUCATOR_KEYS[ed.name]}
                      src={ed.img}
                      alt={ed.name}
                      className="w-full h-full object-cover object-top transition-transform duration-500 group-hover:scale-[1.04]"
                    />

                    {/* Gradient overlay */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent" />

                    {/* Leadership ribbon — senior only */}
                    {senior && (
                      <div className="absolute top-3 right-3 bg-gradient-to-r from-peach-400 to-orange-400 text-white text-[10px] font-bold px-2.5 py-1 rounded-full shadow-md tracking-wide uppercase">
                        Leadership
                      </div>
                    )}

                    {/* Specialty badge */}
                    <div className="absolute bottom-3 left-3 bg-white/95 backdrop-blur-sm rounded-xl px-3 py-1.5 shadow-sm">
                      <span className="text-xs font-bold text-gray-700">{ed.badge}</span>
                    </div>
                  </div>

                  {/* Content */}
                  <div className={`flex flex-col flex-1 p-5 ${senior ? 'bg-gradient-to-b from-peach-50/40 to-white' : 'bg-white'}`}>
                    <h3 className="font-bold text-gray-900 text-base leading-tight mb-0.5">{ed.name}</h3>
                    <p className={`text-sm font-semibold mb-2 ${senior ? 'text-peach-600' : 'text-orange-500'}`}>
                      {ed.title}
                    </p>

                    {/* Divider */}
                    <div className={`h-px mb-3 ${senior ? 'bg-peach-100' : 'bg-gray-100'}`} />

                    <p className="text-[11px] text-gray-400 mb-3 leading-snug">{ed.cert}</p>
                    <p className="text-sm text-gray-600 leading-relaxed italic flex-1">"{ed.bio}"</p>
                  </div>
                </motion.article>
              );
            })}

            {/* End spacer so last card shadow isn't clipped */}
            <div className="flex-shrink-0 w-1" aria-hidden="true" />
          </div>
        </div>

        {/* ── Dot indicators — mobile only ── */}
        <div className="flex md:hidden items-center justify-center gap-2 mt-4" role="tablist" aria-label="Educator slides">
          {educators.map((ed, i) => (
            <button
              key={i}
              role="tab"
              aria-selected={i === activeIndex}
              aria-label={`Go to ${ed.name}`}
              onClick={() => scrollTo(i)}
              className="grid h-11 w-11 place-items-center rounded-full"
            >
              <span aria-hidden="true" className={`block rounded-full transition-[width,background-color] duration-200 ${i === activeIndex ? 'w-6 h-2 bg-peach-500' : 'w-2 h-2 bg-gray-400'}`} />
            </button>
          ))}
        </div>

        {/* ── Mobile swipe hint ── */}
        <p className="md:hidden text-center text-xs text-gray-600 mt-1 select-none" aria-hidden="true">
          Swipe to explore →
        </p>
      </div>
    </section>
  );
}

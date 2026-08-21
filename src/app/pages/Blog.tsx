import { motion } from 'motion/react';
import { Link, useSearchParams } from 'react-router';
import { useState } from 'react';
import { ArrowRight, BookOpen, Clock, Search } from 'lucide-react';
import DaycareNav from '../components/DaycareNav';
import DaycareFooter from '../components/DaycareFooter';
import { getPostsByStream } from '../data/blogPosts';
import { useCMS } from '../hooks/useCMS';
import { useSEO } from '../hooks/useSEO';
import { isPublished, CMSBlogArticle } from '../data/cms';

type Stream = 'parents' | 'educators';

const CATEGORY_COLORS: Record<string, string> = {
  'Starting Nursery': 'bg-peach-100 text-peach-700',
  'Curriculum': 'bg-teal-100 text-teal-700',
  'Choosing Childcare': 'bg-mint-100 text-mint-700',
  'CACHE Courses': 'bg-blue-100 text-blue-700',
  'Career Paths': 'bg-indigo-100 text-indigo-700',
  'Teaching Practice': 'bg-violet-100 text-violet-700',
  'Professional Development': 'bg-cyan-100 text-cyan-700',
};

const CATEGORY_EMOJI: Record<string, string> = {
  'Starting Nursery': '🌱', 'Curriculum': '📚', 'Choosing Childcare': '🔍',
  'CACHE Courses': '🎓', 'Career Paths': '🚀', 'Teaching Practice': '✏️',
  'Professional Development': '💼', 'Parenting': '👶', 'EYFS': '🌟',
  'Nutrition': '🍎', 'School Readiness': '🏫', 'Activity Ideas': '🎨',
  'EduHub News': '📰',
};

export interface NormalizedPost {
  slug: string;
  title: string;
  excerpt: string;
  category: string;
  readTime: string;
  date: string;
  featured: boolean;
  emoji: string;
  audience: Stream;
  featuredImage?: string;
}

function normalizeFromCMS(a: CMSBlogArticle): NormalizedPost {
  return {
    slug: a.slug,
    title: a.title,
    excerpt: a.excerpt,
    category: a.category,
    readTime: a.readTime,
    date: a.publishDate,
    featured: a.featured,
    emoji: CATEGORY_EMOJI[a.category] ?? '📄',
    audience: a.audience === 'Parents' ? 'parents' : 'educators',
    featuredImage: a.featuredImage || undefined,
  };
}

function PostCard({ post, stream }: { post: NormalizedPost; stream: Stream }) {
  const accent = stream === 'parents' ? 'text-peach-600' : 'text-blue-600';
  const catColor = CATEGORY_COLORS[post.category] ?? 'bg-gray-100 text-gray-600';
  return (
    <Link to={`/blog/${post.slug}`}>
      <motion.article
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        whileHover={{ y: -6 }}
        className="bg-white rounded-3xl border border-gray-100 shadow-md hover:shadow-xl transition-all overflow-hidden group flex flex-col cursor-pointer h-full"
      >
        <div className={`h-2 w-full ${stream === 'parents' ? 'bg-gradient-to-r from-peach-400 to-coral-500' : 'bg-gradient-to-r from-blue-500 to-indigo-600'}`} />
        {post.featuredImage ? (
          <div className="h-44 overflow-hidden">
            <img src={post.featuredImage} alt={post.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
          </div>
        ) : null}
        <div className="p-7 flex flex-col flex-1">
          <div className="flex items-center justify-between mb-4">
            <span className={`text-xs font-bold px-2.5 py-1 rounded-full ${catColor}`}>{post.category}</span>
            <span className="text-xs text-gray-400 flex items-center gap-1">
              <Clock className="w-3 h-3" /> {post.readTime}
            </span>
          </div>
          {!post.featuredImage && <div className="text-4xl mb-4">{post.emoji}</div>}
          <h3 className={`text-lg font-bold text-gray-900 mb-2 group-hover:${accent} transition-colors`}>{post.title}</h3>
          <p className="text-sm text-gray-600 leading-relaxed flex-1">{post.excerpt}</p>
          <div className="mt-5 flex items-center justify-between">
            <span className="text-xs text-gray-400">{post.date}</span>
            <div className={`flex items-center gap-1.5 text-sm font-bold ${accent} group-hover:gap-3 transition-all`}>
              <span>Read More</span>
              <ArrowRight className="w-4 h-4" />
            </div>
          </div>
        </div>
      </motion.article>
    </Link>
  );
}

export default function Blog() {
  const [searchParams] = useSearchParams();
  const initialStream = searchParams.get('stream') === 'educators' ? 'educators' : 'parents';
  const [stream, setStream] = useState<Stream>(initialStream);
  const [search, setSearch] = useState('');
  const cms = useCMS();
  useSEO('blog', {}, cms);

  // Merge CMS blog with hardcoded posts — CMS takes precedence by slug
  const cmsBlogPosts = cms.blog.filter(isPublished);
  const cmsSlugSet = new Set(cmsBlogPosts.map(p => p.slug));

  const hardcodedParents = getPostsByStream('parents')
    .filter(p => !cmsSlugSet.has(p.slug))
    .map(p => ({ slug: p.slug, title: p.title, excerpt: p.excerpt, category: p.category, readTime: p.readTime, date: p.date, featured: p.featured, emoji: p.emoji, audience: 'parents' as Stream }));

  const hardcodedEducators = getPostsByStream('educators')
    .filter(p => !cmsSlugSet.has(p.slug))
    .map(p => ({ slug: p.slug, title: p.title, excerpt: p.excerpt, category: p.category, readTime: p.readTime, date: p.date, featured: p.featured, emoji: p.emoji, audience: 'educators' as Stream }));

  const allPosts: NormalizedPost[] = [...cmsBlogPosts.map(normalizeFromCMS), ...hardcodedParents, ...hardcodedEducators];

  const posts = allPosts.filter(p => p.audience === stream);
  const filtered = search
    ? posts.filter(p => p.title.toLowerCase().includes(search.toLowerCase()) || p.excerpt.toLowerCase().includes(search.toLowerCase()))
    : posts;

  const featured = filtered.find(p => p.featured);
  const rest = filtered.filter(p => !p.featured);

  return (
    <div className="min-h-screen bg-white">
      <DaycareNav />

      <main>

      {/* Hero */}
      <section className="relative bg-gradient-to-br from-peach-50 via-lemon-50 to-mint-50 py-16 sm:py-20 overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white shadow-md text-gray-700 text-sm mb-5">
              <BookOpen className="w-4 h-4" />
              <span className="font-semibold">Early Years Resource Hub</span>
            </div>
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-gray-900 mb-4">
              Guides, Insights &{' '}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-peach-500 to-blue-600">
                Expert Advice
              </span>
            </h1>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto mb-8">
              Two blogs in one place — practical reads for parents navigating childcare, and professional insights for educators building their careers.
            </p>

            {/* Stream Toggle */}
            <div className="inline-flex bg-white rounded-2xl p-1.5 shadow-lg border border-gray-100 mb-8">
              <button
                onClick={() => setStream('parents')}
                className={`flex items-center gap-2 px-6 py-3 rounded-xl text-sm font-bold transition-all ${stream === 'parents' ? 'bg-gradient-to-r from-peach-400 to-coral-500 text-white shadow-md' : 'text-gray-600 hover:text-gray-900'}`}
              >
                👶 For Parents
              </button>
              <button
                onClick={() => setStream('educators')}
                className={`flex items-center gap-2 px-6 py-3 rounded-xl text-sm font-bold transition-all ${stream === 'educators' ? 'bg-gradient-to-r from-blue-500 to-indigo-600 text-white shadow-md' : 'text-gray-600 hover:text-gray-900'}`}
              >
                🎓 For Educators
              </button>
            </div>

            {/* Search */}
            <div className="relative max-w-md mx-auto">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                placeholder="Search articles…"
                value={search}
                onChange={e => setSearch(e.target.value)}
                className="w-full pl-12 pr-4 py-3.5 rounded-2xl border-2 border-gray-200 focus:border-peach-400 focus:outline-none shadow-sm bg-white"
              />
            </div>
          </motion.div>
        </div>
      </section>

      {/* Content */}
      <section className="py-16 lg:py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

          {/* Stream label */}
          <div className="flex items-center justify-between mb-10">
            <div>
              <h2 className="text-2xl font-bold text-gray-900">
                {stream === 'parents' ? '👶 Parent Blog' : '🎓 Educator Blog'}
              </h2>
              <p className="text-sm text-gray-500 mt-0.5">
                {stream === 'parents'
                  ? 'Childcare advice, curriculum guides, and school-readiness tips for families.'
                  : 'CACHE qualifications, teaching strategies, and career development for early years professionals.'}
              </p>
            </div>
            <Link
              to={stream === 'parents' ? '/daycare/contact' : '/eduhub/contact'}
              className={`hidden sm:inline-flex items-center gap-2 px-5 py-3 rounded-2xl text-sm font-bold transition-all ${
                stream === 'parents'
                  ? 'bg-gradient-to-r from-peach-400 to-coral-500 text-white hover:shadow-lg'
                  : 'bg-gradient-to-r from-blue-500 to-indigo-600 text-white hover:shadow-lg'
              }`}
            >
              {stream === 'parents' ? 'Book a Visit' : 'Register Interest'}
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          {filtered.length === 0 && (
            <div className="text-center py-20 text-gray-400">
              <Search className="w-12 h-12 mx-auto mb-4 opacity-40" />
              {search
                ? <><p className="text-lg font-medium">No articles found for "{search}"</p><button onClick={() => setSearch('')} className="mt-3 text-peach-600 font-semibold hover:underline">Clear search</button></>
                : <p className="text-lg font-medium">No {stream === 'parents' ? 'parent' : 'educator'} articles published yet.</p>
              }
            </div>
          )}

          {/* Featured Article */}
          {featured && (
            <Link to={`/blog/${featured.slug}`}>
              <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
                className={`rounded-3xl overflow-hidden shadow-xl mb-10 cursor-pointer hover:shadow-2xl transition-shadow ${stream === 'parents' ? 'bg-gradient-to-br from-peach-50 to-orange-50 border border-peach-200' : 'bg-gradient-to-br from-blue-50 to-indigo-50 border border-blue-200'}`}>
                <div className="p-8 sm:p-10 grid md:grid-cols-2 gap-8 items-center">
                  <div>
                    <div className="flex items-center gap-3 mb-4">
                      <span className={`text-xs font-bold px-3 py-1.5 rounded-full ${stream === 'parents' ? 'bg-peach-200 text-peach-800' : 'bg-blue-200 text-blue-800'}`}>
                        ⭐ Featured
                      </span>
                      <span className="text-xs text-gray-400 flex items-center gap-1">
                        <Clock className="w-3 h-3" /> {featured.readTime}
                      </span>
                    </div>
                    <div className="text-5xl mb-4">{featured.emoji}</div>
                    <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-3">{featured.title}</h2>
                    <p className="text-gray-600 leading-relaxed mb-6">{featured.excerpt}</p>
                    <div className={`inline-flex items-center gap-2 px-6 py-3 rounded-2xl font-bold text-white ${stream === 'parents' ? 'bg-gradient-to-r from-peach-400 to-coral-500' : 'bg-gradient-to-r from-blue-500 to-indigo-600'} shadow-lg hover:shadow-xl transition-all`}>
                      Read Full Article
                      <ArrowRight className="w-5 h-5" />
                    </div>
                  </div>
                  {featured.featuredImage
                    ? <div className="hidden md:block rounded-2xl overflow-hidden h-56"><img src={featured.featuredImage} alt={featured.title} className="w-full h-full object-cover" /></div>
                    : <div className="hidden md:flex items-center justify-center text-9xl">{featured.emoji}</div>
                  }
                </div>
              </motion.div>
            </Link>
          )}

          {/* Post Grid */}
          {rest.length > 0 && (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {rest.map((post) => (
                <PostCard key={post.slug} post={post} stream={stream} />
              ))}
            </div>
          )}

          {/* Cross-promote the other stream */}
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
            className="mt-16 rounded-3xl p-8 sm:p-10 text-center border-2 border-dashed border-gray-200 bg-gray-50">
            <div className="text-4xl mb-4">{stream === 'parents' ? '🎓' : '👶'}</div>
            <h3 className="text-xl font-bold text-gray-900 mb-2">
              {stream === 'parents' ? 'Are you an educator?' : 'Looking for childcare advice?'}
            </h3>
            <p className="text-gray-600 mb-5">
              {stream === 'parents'
                ? 'Switch to our Educator Blog for CACHE qualification guides, teaching strategies, and career development.'
                : 'Switch to our Parent Blog for nursery guides, EYFS explanations, and school-readiness tips.'}
            </p>
            <button
              onClick={() => setStream(stream === 'parents' ? 'educators' : 'parents')}
              className="inline-flex items-center gap-2 px-6 py-3 rounded-2xl bg-white border-2 border-gray-200 text-gray-700 font-bold hover:border-gray-400 transition-all"
            >
              {stream === 'parents' ? 'View Educator Blog' : 'View Parent Blog'}
              <ArrowRight className="w-4 h-4" />
            </button>
          </motion.div>
        </div>
      </section>

      </main>
      <DaycareFooter />
    </div>
  );
}

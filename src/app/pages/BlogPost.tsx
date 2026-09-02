import { useParams, Link, Navigate } from 'react-router';
import { useEffect } from 'react';
import { motion } from 'motion/react';
import {
  ArrowLeft, ArrowRight, Clock, BookOpen, User, Calendar, Share2,
  CheckCircle2, Lightbulb, Quote, Star,
} from 'lucide-react';
import DaycareNav from '../components/DaycareNav';
import DaycareFooter from '../components/DaycareFooter';
import EduHubNav from '../components/EduHubNav';
import EduHubFooter from '../components/EduHubFooter';
import { getPostBySlug, getRelatedPosts, BlogSection } from '../data/blogPosts';
import { useCMS } from '../hooks/useCMS';
import { isPublished, isEditorialArticle, CMSBlogArticle } from '../data/cms';
import { JsonLd, articleSchema, breadcrumbSchema } from '../components/JsonLd';

// ─── Simple markdown body → BlogSection[] ────────────────
function parseBody(body: string): BlogSection[] {
  const blocks = body.split(/\n{2,}/);
  const sections: BlogSection[] = [];
  for (const block of blocks) {
    const t = block.trim();
    if (!t) continue;
    if (t.startsWith('## ')) { sections.push({ type: 'h2', content: t.slice(3).trim() }); continue; }
    if (t.startsWith('### ')) { sections.push({ type: 'h3', content: t.slice(4).trim() }); continue; }
    if (t.startsWith('> ')) { sections.push({ type: 'quote', content: t.slice(2).trim() }); continue; }
    if (t.startsWith('💡 ') || t.toLowerCase().startsWith('tip: ')) {
      sections.push({ type: 'tip', content: t.replace(/^💡\s*/, '').replace(/^[Tt]ip:\s*/, ''), label: 'Tip' });
      continue;
    }
    const lines = t.split('\n');
    if (lines.every(l => l.match(/^[-*•]\s/))) {
      sections.push({ type: 'ul', content: lines.map(l => l.replace(/^[-*•]\s/, '').trim()) });
      continue;
    }
    if (lines.every((l, i) => l.match(/^\d+[\.\)]\s/) || (i === 0 && l.match(/^\d+/)))) {
      sections.push({ type: 'ol', content: lines.map(l => l.replace(/^\d+[\.\)]\s/, '').trim()) });
      continue;
    }
    sections.push({ type: 'p', content: t });
  }
  return sections;
}

// ─── Section Renderer ─────────────────────────────────────
function RenderSection({ section, stream }: { section: BlogSection; stream: 'parents' | 'educators' }) {
  const accentText = stream === 'parents' ? 'text-coral-600' : 'text-blue-700';
  const accentBorder = stream === 'parents' ? 'border-coral-400' : 'border-blue-500';
  const accentBg = stream === 'parents' ? 'bg-peach-50 border-peach-200' : 'bg-blue-50 border-blue-200';
  const accentTipBg = stream === 'parents' ? 'bg-amber-50 border-amber-300' : 'bg-cyan-50 border-cyan-300';
  const bulletColor = stream === 'parents' ? 'bg-coral-400' : 'bg-blue-500';

  switch (section.type) {
    case 'h2':
      return <h2 className={`text-2xl font-bold text-gray-900 mt-10 mb-4 pb-2 border-b-2 ${accentBorder}`}>{section.content as string}</h2>;
    case 'h3':
      return <h3 className={`text-lg font-bold mt-6 mb-3 ${accentText}`}>{section.content as string}</h3>;
    case 'p':
      return <p className="text-gray-700 leading-relaxed mb-5 text-[1.05rem]">{section.content as string}</p>;
    case 'ul':
      return (
        <ul className="mb-6 space-y-2.5">
          {(section.content as string[]).map((item, i) => (
            <li key={i} className="flex items-start gap-3 text-gray-700">
              <span className={`mt-2 w-2 h-2 rounded-full flex-shrink-0 ${bulletColor}`} />
              <span className="leading-relaxed">{item}</span>
            </li>
          ))}
        </ul>
      );
    case 'ol':
      return (
        <ol className="mb-6 space-y-3">
          {(section.content as string[]).map((item, i) => (
            <li key={i} className="flex items-start gap-4 text-gray-700">
              <span className={`flex-shrink-0 w-7 h-7 rounded-full flex items-center justify-center text-white text-sm font-bold ${stream === 'parents' ? 'bg-coral-500' : 'bg-blue-600'}`}>{i + 1}</span>
              <span className="leading-relaxed pt-0.5">{item}</span>
            </li>
          ))}
        </ol>
      );
    case 'tip':
      return (
        <div className={`my-7 p-5 rounded-2xl border-2 ${accentTipBg} flex gap-4`}>
          <Lightbulb className={`w-6 h-6 flex-shrink-0 mt-0.5 ${stream === 'parents' ? 'text-amber-500' : 'text-cyan-600'}`} />
          <div>
            {section.label && <p className={`text-sm font-bold mb-1.5 ${stream === 'parents' ? 'text-amber-700' : 'text-cyan-700'}`}>{section.label}</p>}
            <p className="text-gray-700 leading-relaxed text-sm">{section.content as string}</p>
          </div>
        </div>
      );
    case 'quote':
      return (
        <blockquote className={`my-8 px-6 py-5 rounded-2xl border-l-4 ${accentBorder} ${accentBg}`}>
          <Quote className={`w-7 h-7 mb-3 opacity-40 ${accentText}`} />
          <p className="text-gray-800 italic leading-relaxed text-lg mb-2">{section.content as string}</p>
          {section.attribution && <cite className={`text-sm font-semibold not-italic ${accentText}`}>— {section.attribution}</cite>}
        </blockquote>
      );
    case 'takeaway':
      return (
        <div className={`my-8 p-6 rounded-2xl border-2 ${stream === 'parents' ? 'bg-gradient-to-br from-peach-50 to-orange-50 border-peach-200' : 'bg-gradient-to-br from-blue-50 to-indigo-50 border-blue-200'}`}>
          {section.label && <h3 className={`font-bold text-lg mb-4 ${accentText}`}>{section.label}</h3>}
          <ul className="space-y-2.5">
            {(section.content as string[]).map((item, i) => (
              <li key={i} className="flex items-start gap-3">
                <CheckCircle2 className={`w-5 h-5 flex-shrink-0 mt-0.5 ${stream === 'parents' ? 'text-coral-500' : 'text-blue-600'}`} />
                <span className="text-gray-700 leading-relaxed text-sm">{item}</span>
              </li>
            ))}
          </ul>
        </div>
      );
    case 'highlight':
      return <div className={`my-6 p-5 rounded-2xl ${accentBg} border`}><p className="text-gray-800 leading-relaxed">{section.content as string}</p></div>;
    case 'divider':
      return <hr className="my-8 border-gray-200" />;
    default:
      return null;
  }
}

const CATEGORY_COLORS: Record<string, string> = {
  'Starting Nursery': 'bg-peach-100 text-peach-700', Curriculum: 'bg-teal-100 text-teal-700',
  'Choosing Childcare': 'bg-mint-100 text-mint-700', 'CACHE Courses': 'bg-blue-100 text-blue-700',
  'Career Paths': 'bg-indigo-100 text-indigo-700', 'Teaching Practice': 'bg-violet-100 text-violet-700',
  'Professional Development': 'bg-cyan-100 text-cyan-700',
};

const CATEGORY_EMOJI: Record<string, string> = {
  'Starting Nursery': '🌱', 'Curriculum': '📚', 'Choosing Childcare': '🔍',
  'CACHE Courses': '🎓', 'Career Paths': '🚀', 'Teaching Practice': '✏️',
  'Professional Development': '💼', 'Parenting': '👶', 'EYFS': '🌟',
};

// Normalised shape used by this component
interface PostView {
  slug: string;
  title: string;
  excerpt: string;
  category: string;
  readTime: string;
  date: string;
  featured: boolean;
  emoji: string;
  stream: 'parents' | 'educators';
  author: string;
  authorRole: string;
  metaTitle: string;
  metaDescription: string;
  featuredImage?: string;
  sections: BlogSection[];
}

function cmsToView(a: CMSBlogArticle): PostView {
  return {
    slug: a.slug,
    title: a.title,
    excerpt: a.excerpt,
    category: a.category,
    readTime: a.readTime,
    date: a.publishDate,
    featured: a.featured,
    emoji: CATEGORY_EMOJI[a.category] ?? '📄',
    stream: a.audience === 'Parents' ? 'parents' : 'educators',
    author: a.authorName || 'Early Years Team',
    authorRole: a.authorTitle || '',
    metaTitle: a.seoTitle || a.title,
    metaDescription: a.seoDescription || a.excerpt,
    featuredImage: a.featuredImage || undefined,
    sections: parseBody(a.body),
  };
}

function hardcodedToView(post: NonNullable<ReturnType<typeof getPostBySlug>>): PostView {
  return {
    slug: post.slug,
    title: post.title,
    excerpt: post.excerpt,
    category: post.category,
    readTime: post.readTime,
    date: post.date,
    featured: post.featured,
    emoji: post.emoji,
    stream: post.stream,
    author: post.author,
    authorRole: post.authorRole,
    metaTitle: post.metaTitle,
    metaDescription: post.metaDescription,
    featuredImage: undefined,
    sections: post.content,
  };
}

// ─── Related Card ────────────────────────────────────────
function RelatedCard({ post, stream }: { post: PostView; stream: 'parents' | 'educators' }) {
  const accent = stream === 'parents' ? 'text-coral-600' : 'text-blue-700';
  return (
    <Link to={`/blog/${post.slug}`}>
      <motion.div whileHover={{ y: -4 }} className="bg-white rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition-all p-5 flex gap-4 cursor-pointer">
        <span className="text-3xl flex-shrink-0">{post.emoji}</span>
        <div className="min-w-0">
          <p className={`text-xs font-bold mb-1 ${accent}`}>{post.category}</p>
          <h4 className="text-sm font-bold text-gray-900 leading-snug line-clamp-2 mb-1">{post.title}</h4>
          <span className="text-xs text-gray-600 flex items-center gap-1"><Clock className="w-3 h-3" /> {post.readTime}</span>
        </div>
      </motion.div>
    </Link>
  );
}

// ─── Main Component ───────────────────────────────────────
export default function BlogPost() {
  const { slug } = useParams<{ slug: string }>();
  const cms = useCMS();
  const isLegacyNewsletter = slug?.startsWith('newsletter-') === true;

  // Try CMS blog first
  const cmsArticle = slug ? cms.blog.find(a => a.slug === slug && isPublished(a) && isEditorialArticle(a)) : undefined;
  // Fall back to hardcoded
  const hardcodedPost = !isLegacyNewsletter && !cmsArticle && slug ? getPostBySlug(slug) : undefined;

  const post: PostView | undefined = cmsArticle
    ? cmsToView(cmsArticle)
    : hardcodedPost
    ? hardcodedToView(hardcodedPost)
    : undefined;

  // Related posts from same source
  const related: PostView[] = cmsArticle
    ? cms.blog
        .filter(a => isPublished(a) && isEditorialArticle(a) && a.slug !== slug && a.audience === cmsArticle.audience)
        .slice(0, 3)
        .map(cmsToView)
    : hardcodedPost
    ? getRelatedPosts(slug!, 3).map(hardcodedToView)
    : [];

  useEffect(() => {
    if (post) {
      document.title = post.metaTitle;
      let metaDesc = document.querySelector('meta[name="description"]');
      if (!metaDesc) {
        metaDesc = document.createElement('meta');
        (metaDesc as HTMLMetaElement).name = 'description';
        document.head.appendChild(metaDesc);
      }
      metaDesc.setAttribute('content', post.metaDescription);
    }
  }, [post]);

  if (isLegacyNewsletter) return <Navigate to="/daycare/parents" replace />;

  if (!post) {
    return (
      <div className="min-h-screen bg-white flex flex-col items-center justify-center gap-4 px-4">
        <span className="text-6xl">📄</span>
        <h1 className="text-2xl font-bold text-gray-900">Article not found</h1>
        <p className="text-gray-500">This post doesn't exist or may have moved.</p>
        <Link to="/blog" className="px-5 py-2.5 rounded-xl bg-gray-900 text-white text-sm font-semibold hover:bg-gray-700 transition-colors">
          Back to Blog
        </Link>
      </div>
    );
  }

  const isParent = post.stream === 'parents';
  const heroGradient = isParent ? 'bg-gradient-to-br from-peach-50 via-orange-50 to-lemon-50' : 'bg-gradient-to-br from-blue-50 via-indigo-50 to-slate-50';
  const catColor = CATEGORY_COLORS[post.category] ?? 'bg-gray-100 text-gray-600';
  const ctaGradient = isParent ? 'bg-gradient-to-r from-peach-400 to-coral-500' : 'bg-gradient-to-r from-blue-500 to-indigo-600';
  const ctaLink = isParent ? '/daycare/contact' : '/eduhub/contact';
  const ctaLabel = isParent ? 'Book a Nursery Visit' : 'Register Interest in EduHub';

  const siteUrl = 'https://theearlyyearscompany.com';
  const s = cms.siteSettings;

  return (
    <div className={`${post.stream === 'parents' ? 'daycare-site' : 'eduhub-site'} editorial-hub min-h-screen bg-white`}>
      <JsonLd data={[
        articleSchema({ title: post.metaTitle, description: post.metaDescription, url: `${siteUrl}/blog/${post.slug}`, publishDate: post.date, image: post.featuredImage, publisherName: s.companyName }),
        breadcrumbSchema([
          { name: 'Home', url: siteUrl },
          { name: 'Blog', url: `${siteUrl}/blog` },
          { name: post.title, url: `${siteUrl}/blog/${post.slug}` },
        ]),
      ]} />
      {isParent ? <DaycareNav /> : <EduHubNav />}

      <main>

      {/* Hero */}
      <section className={`${heroGradient} py-14 sm:py-20`}>
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-2 text-sm text-gray-500 mb-8">
            <Link to="/blog" className="hover:text-gray-900 transition-colors flex items-center gap-1.5">
              <ArrowLeft className="w-4 h-4" /> Blog
            </Link>
            <span>/</span>
            <span className="text-gray-400">{post.category}</span>
          </div>

          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
            <div className="flex flex-wrap items-center gap-3 mb-5">
              <span className={`text-xs font-bold px-3 py-1.5 rounded-full ${catColor}`}>{post.category}</span>
              <span className="text-xs text-gray-500 flex items-center gap-1.5"><Clock className="w-3.5 h-3.5" /> {post.readTime}</span>
              <span className="text-xs text-gray-500 flex items-center gap-1.5"><Calendar className="w-3.5 h-3.5" /> {post.date}</span>
            </div>

            {post.featuredImage
              ? <div className="rounded-2xl overflow-hidden mb-6 h-56 sm:h-72"><img
                  src={post.featuredImage}
                  alt={post.title}
                  onError={event => {
                    const fallback = post.stream === 'parents' ? '/images/daycare/daycare.section.classroom-2.jpg' : '/images/eduhub/eduhub.about.training.jpg';
                    if (event.currentTarget.src.endsWith(fallback)) return;
                    event.currentTarget.src = fallback;
                  }}
                  className="w-full h-full object-cover"
                /></div>
              : <div className="text-6xl mb-5">{post.emoji}</div>
            }
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-900 leading-tight mb-5">{post.title}</h1>
            <p className="text-lg text-gray-600 leading-relaxed max-w-2xl mb-7">{post.excerpt}</p>

            <div className="flex flex-wrap items-center gap-4">
              <div className="flex items-center gap-2.5">
                <div className={`w-9 h-9 rounded-full flex items-center justify-center ${ctaGradient}`}>
                  <User className="w-4 h-4 text-white" />
                </div>
                <div>
                  <p className="text-sm font-bold text-gray-900">{post.author}</p>
                  {post.authorRole && <p className="text-xs text-gray-500">{post.authorRole}</p>}
                </div>
              </div>
              <button
                onClick={() => {
                  if (navigator.share) navigator.share({ title: post.title, url: window.location.href });
                  else navigator.clipboard.writeText(window.location.href);
                }}
                className="ml-auto flex items-center gap-1.5 px-4 py-2 rounded-xl border border-gray-200 bg-white text-sm text-gray-600 hover:bg-gray-50 transition-colors"
              >
                <Share2 className="w-4 h-4" /> Share
              </button>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Article Body */}
      <article className="py-12 lg:py-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-[1fr_280px] gap-12 items-start">

            {/* Main content */}
            <div className="min-w-0">
              {post.sections.map((section, i) => (
                <RenderSection key={i} section={section} stream={post.stream} />
              ))}

              {/* End CTA */}
              <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
                className={`mt-12 p-8 rounded-3xl text-white ${ctaGradient}`}>
                <div className="text-4xl mb-4">{isParent ? '🌸' : '🎓'}</div>
                <h3 className="text-xl font-bold mb-2">
                  {isParent ? 'Ready to see Early Years Daycare in person?' : 'Ready to take the next step in your early years career?'}
                </h3>
                <p className="text-white/90 text-sm leading-relaxed mb-5">
                  {isParent
                    ? 'Book a guided tour of our New Cairo nursery. Meet the team, see the rooms, and ask us anything.'
                    : 'Get in touch with the EduHub team to discuss which CACHE qualification is right for you — no obligation, just honest guidance.'}
                </p>
                <Link to={ctaLink} className="inline-flex items-center gap-2 px-6 py-3 rounded-2xl bg-white font-bold text-gray-900 hover:shadow-xl transition-all text-sm">
                  {ctaLabel}
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </motion.div>

              <div className="mt-8 flex items-center gap-4">
                <Link to="/blog" className="flex items-center gap-2 px-5 py-3 rounded-xl border-2 border-gray-200 text-gray-600 text-sm font-semibold hover:border-gray-400 transition-colors">
                  <ArrowLeft className="w-4 h-4" /> All Articles
                </Link>
              </div>
            </div>

            {/* Sticky sidebar */}
            <aside className="hidden lg:block">
              <div className="sticky top-28 space-y-6">
                {/* Quick info */}
                <div className="rounded-2xl border border-gray-100 bg-white shadow-sm p-5 space-y-3">
                  <p className="text-xs font-bold text-gray-500 uppercase tracking-wide">Article Info</p>
                  <div className="flex items-center gap-2 text-sm text-gray-600"><Clock className="w-4 h-4 text-gray-400" /> {post.readTime}</div>
                  <div className="flex items-center gap-2 text-sm text-gray-600"><Calendar className="w-4 h-4 text-gray-400" /> {post.date}</div>
                  <div className="flex items-center gap-2 text-sm text-gray-600"><BookOpen className="w-4 h-4 text-gray-400" /> {post.category}</div>
                  <div className="flex items-center gap-2 text-sm text-gray-600"><User className="w-4 h-4 text-gray-400" /> {post.author}</div>
                </div>

                {/* Related posts */}
                {related.length > 0 && (
                  <div className="space-y-3">
                    <p className="text-xs font-bold text-gray-500 uppercase tracking-wide px-1">
                      More {isParent ? 'Parent' : 'Educator'} Articles
                    </p>
                    {related.map((rp) => <RelatedCard key={rp.slug} post={rp} stream={post.stream} />)}
                  </div>
                )}

                {/* Stream switcher */}
                <div className="rounded-2xl border-2 border-dashed border-gray-200 bg-gray-50 p-5 text-center">
                  <div className="text-3xl mb-2">{isParent ? '🎓' : '👶'}</div>
                  <p className="text-sm font-bold text-gray-800 mb-1">
                    {isParent ? 'Are you an educator?' : 'Looking for parent advice?'}
                  </p>
                  <p className="text-xs text-gray-500 mb-3 leading-relaxed">
                    {isParent ? 'Read our Educator Blog for CACHE guides and teaching strategies.' : 'Read our Parent Blog for nursery guides and EYFS tips.'}
                  </p>
                  <Link to={`/blog?stream=${isParent ? 'educators' : 'parents'}`} className="inline-flex items-center gap-1.5 text-xs font-bold text-gray-700 hover:text-gray-900 transition-colors">
                    Switch stream <ArrowRight className="w-3 h-3" />
                  </Link>
                </div>
              </div>
            </aside>
          </div>
        </div>
      </article>

      {/* Mobile related posts */}
      {related.length > 0 && (
        <section className="lg:hidden py-10 bg-gray-50 border-t border-gray-100">
          <div className="max-w-4xl mx-auto px-4 sm:px-6">
            <h3 className="text-lg font-bold text-gray-900 mb-5 flex items-center gap-2">
              <Star className="w-5 h-5 text-yellow-500" /> More Articles
            </h3>
            <div className="grid sm:grid-cols-2 gap-4">
              {related.map((rp) => <RelatedCard key={rp.slug} post={rp} stream={post.stream} />)}
            </div>
          </div>
        </section>
      )}

      </main>
      {isParent ? <DaycareFooter /> : <EduHubFooter />}
    </div>
  );
}

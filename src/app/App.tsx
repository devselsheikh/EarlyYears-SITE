import React, { lazy, Suspense } from 'react';
import { MotionConfig } from 'motion/react';
import { Navigate, RouterProvider, createBrowserRouter } from 'react-router';
import ScrollToTop from './components/ScrollToTop';
import BackToTopButton from './components/BackToTopButton';
import PageTransition from './components/PageTransition';
import RouteErrorPage from './components/RouteErrorPage';
import RouteMetadata from './components/RouteMetadata';
import PrivacyControls from './components/PrivacyControls';
import Landing from './pages/Landing';

const StickyMobileCTA = lazy(() => import('./components/StickyMobileCTA'));
const DaycareHome = lazy(() => import('./pages/daycare/Home'));
const DaycareAbout = lazy(() => import('./pages/daycare/About'));
const DaycarePrograms = lazy(() => import('./pages/daycare/Programs'));
const DaycareContact = lazy(() => import('./pages/daycare/Contact'));
const ParentPortal = lazy(() => import('./pages/daycare/ParentPortal'));
const EduHubHome = lazy(() => import('./pages/eduhub/Home'));
const EduHubPrograms = lazy(() => import('./pages/eduhub/Programs'));
const EduHubProgramDetail = lazy(() => import('./pages/eduhub/ProgramDetail'));
const EduHubAbout = lazy(() => import('./pages/eduhub/About'));
const EduHubContact = lazy(() => import('./pages/eduhub/Contact'));
const Blog = lazy(() => import('./pages/Blog'));
const BlogPost = lazy(() => import('./pages/BlogPost'));
const ContactSplit = lazy(() => import('./pages/ContactSplit'));
const Admin = lazy(() => import('./pages/Admin'));
const Workspace = lazy(() => import('./pages/Workspace'));
const Legal = lazy(() => import('./pages/Legal'));
const ThankYou = lazy(() => import('./pages/ThankYou'));

function RouteFallback() {
  return (
    <div className="route-fallback" role="status" aria-live="polite">
      <span className="route-fallback__mark" aria-hidden="true" />
      <span>Loading page</span>
    </div>
  );
}

function AppLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <ScrollToTop />
      <RouteMetadata />
      <BackToTopButton />
      <PrivacyControls />
      <Suspense fallback={null}><StickyMobileCTA /></Suspense>
      <Suspense fallback={<RouteFallback />}>
        <PageTransition>{children}</PageTransition>
      </Suspense>
    </>
  );
}

const routes = [
  {
    path: '/',
    element: <AppLayout><Landing /></AppLayout>,
  },
  {
    path: '/daycare',
    element: <AppLayout><DaycareHome /></AppLayout>,
  },
  {
    path: '/daycare/about',
    element: <AppLayout><DaycareAbout /></AppLayout>,
  },
  {
    path: '/daycare/programs',
    element: <AppLayout><DaycarePrograms /></AppLayout>,
  },
  {
    path: '/daycare/parent-info',
    element: <Navigate to="/daycare/parents" replace />,
  },
  {
    path: '/daycare/calendar',
    element: <Navigate to="/daycare/parents" replace />,
  },
  {
    path: '/daycare/facilities',
    element: <Navigate to="/daycare/parents" replace />,
  },
  {
    path: '/daycare/meals',
    element: <Navigate to="/daycare/parents" replace />,
  },
  {
    path: '/daycare/parent-guide',
    element: <Navigate to="/daycare/parents" replace />,
  },
  {
    path: '/daycare/contact',
    element: <AppLayout><DaycareContact /></AppLayout>,
  },
  {
    path: '/daycare/parents',
    element: <AppLayout><ParentPortal /></AppLayout>,
  },
  {
    path: '/eduhub',
    element: <AppLayout><EduHubHome /></AppLayout>,
  },
  {
    path: '/eduhub/programs',
    element: <AppLayout><EduHubPrograms /></AppLayout>,
  },
  {
    path: '/eduhub/courses',
    element: <Navigate to="/eduhub/programs" replace />,
  },
  {
    path: '/eduhub/programs/:id',
    element: <AppLayout><EduHubProgramDetail /></AppLayout>,
  },
  {
    path: '/eduhub/about',
    element: <AppLayout><EduHubAbout /></AppLayout>,
  },
  {
    path: '/eduhub/contact',
    element: <AppLayout><EduHubContact /></AppLayout>,
  },
  {
    path: '/blog',
    element: <AppLayout><Blog /></AppLayout>,
  },
  {
    path: '/blog/:slug',
    element: <AppLayout><BlogPost /></AppLayout>,
  },
  {
    path: '/contact',
    element: <AppLayout><ContactSplit /></AppLayout>,
  },
  {
    path: '/thank-you',
    element: <AppLayout><ThankYou /></AppLayout>,
  },
  {
    path: '/privacy',
    element: <AppLayout><Legal type="privacy" /></AppLayout>,
  },
  {
    path: '/terms',
    element: <AppLayout><Legal type="terms" /></AppLayout>,
  },
  {
    path: '/admin',
    element: <Suspense fallback={<RouteFallback />}><Admin /></Suspense>,
  },
  {
    path: '/workspace',
    element: <Suspense fallback={<RouteFallback />}><Workspace /></Suspense>,
  },
  {
    path: '*',
    element: <RouteErrorPage notFound />,
  },
];

const router = createBrowserRouter(routes.map(route => ({
  ...route,
  errorElement: <RouteErrorPage />,
})));

export default function App() {
  return (
    <MotionConfig reducedMotion="user">
      <RouterProvider router={router} />
    </MotionConfig>
  );
}

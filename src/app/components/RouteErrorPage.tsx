import { useEffect } from 'react';
import { Home, RefreshCw } from 'lucide-react';
import { isRouteErrorResponse, useRouteError } from 'react-router';
import DaycareLogo from './DaycareLogo';

export default function RouteErrorPage({ notFound = false }: { notFound?: boolean }) {
  const routeError = useRouteError();
  const pageMissing = notFound || (isRouteErrorResponse(routeError) && routeError.status === 404);

  useEffect(() => {
    if (!pageMissing && routeError && import.meta.env.DEV) {
      console.error('[Early Years] Route error', routeError);
    }
  }, [pageMissing, routeError]);

  return (
    <main className="app-error" aria-labelledby="route-error-title">
      <section className="app-error__card">
        <DaycareLogo className="app-error__logo" />
        <div className="app-error__illustration" aria-hidden="true">
          <span />
          <span />
          <span />
        </div>
        <p className="app-error__eyebrow">{pageMissing ? 'Page not found' : 'We hit a small bump'}</p>
        <h1 id="route-error-title">
          {pageMissing ? 'This page has wandered off.' : 'We couldn’t open this page.'}
        </h1>
        <p className="app-error__copy">
          {pageMissing
            ? 'The link may be old or the page may have moved. Let’s get you back to somewhere familiar.'
            : 'No technical details or personal information have been shown. Try the page again or return home.'}
        </p>
        <div className="app-error__actions">
          {!pageMissing && (
            <button type="button" onClick={() => window.location.reload()}>
              <RefreshCw aria-hidden="true" />
              Try again
            </button>
          )}
          <a href="/">
            <Home aria-hidden="true" />
            Go to homepage
          </a>
          {pageMissing && <a className="app-error__text-link" href="/daycare">Visit the daycare</a>}
        </div>
      </section>
    </main>
  );
}

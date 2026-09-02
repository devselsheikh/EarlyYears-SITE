import { Component, type ErrorInfo, type ReactNode } from 'react';
import { Home, RefreshCw } from 'lucide-react';
import DaycareLogo from './DaycareLogo';

type Props = { children: ReactNode };
type State = { failed: boolean };

export default class AppErrorBoundary extends Component<Props, State> {
  state: State = { failed: false };

  static getDerivedStateFromError(): State {
    return { failed: true };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    if (import.meta.env.DEV) {
      console.error('[Early Years] Unhandled interface error', error, errorInfo);
      return;
    }

    // Keep production logs free of page content, personal data, and stack traces.
    console.error(`[Early Years] Interface error: ${error.name}`);
  }

  render() {
    if (!this.state.failed) return this.props.children;

    return (
      <main className="app-error" role="alert" aria-labelledby="app-error-title">
        <section className="app-error__card">
          <DaycareLogo className="app-error__logo" />
          <div className="app-error__illustration" aria-hidden="true">
            <span />
            <span />
            <span />
          </div>
          <p className="app-error__eyebrow">A little pause</p>
          <h1 id="app-error-title">Something didn’t load properly.</h1>
          <p className="app-error__copy">
            Your information is still safe. Refresh the page to try again, or return to the website.
          </p>
          <div className="app-error__actions">
            <button type="button" onClick={() => window.location.reload()}>
              <RefreshCw aria-hidden="true" />
              Refresh page
            </button>
            <a href="/">
              <Home aria-hidden="true" />
              Go to homepage
            </a>
          </div>
        </section>
      </main>
    );
  }
}

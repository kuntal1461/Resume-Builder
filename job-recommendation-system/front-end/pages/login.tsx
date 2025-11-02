import Link from 'next/link';
import { useState } from 'react';
import { useRouter } from 'next/router';
import { getEnvironmentConfig } from '../lib/runtimeConfig';

const normalizeDetail = (detail: unknown, fallback: string) => {
  if (!detail) {
    return fallback;
  }
  if (typeof detail === 'string') {
    return detail;
  }
  if (Array.isArray(detail)) {
    const first = detail[0];
    if (first && typeof first === 'object') {
      if ('msg' in first && first.msg) {
        return String(first.msg);
      }
      if ('message' in first && first.message) {
        return String(first.message);
      }
    }
    return detail.join(', ');
  }
  if (typeof detail === 'object') {
    const record = detail as Record<string, unknown>;
    if (record.message) {
      return String(record.message);
    }
    return JSON.stringify(detail);
  }
  return fallback;
};

const mapNetworkError = (error: unknown, fallback: string, apiBaseUrl?: string) => {
  if (error && typeof error === 'object' && 'name' in error && error.name === 'TypeError') {
    const message = String((error as Error).message || '').toLowerCase();
    if (
      message.includes('failed to fetch') ||
      message.includes('load failed') ||
      message.includes('network request failed')
    ) {
      if (apiBaseUrl) {
        return `Cannot reach API at ${apiBaseUrl}. Ensure the backend is running and accessible.`;
      }
      return 'Cannot reach the API. Ensure the backend is running and accessible.';
    }
  }
  if (error instanceof Error) {
    return error.message;
  }
  return fallback;
};

export default function LoginPage() {
  const router = useRouter();
  const [form, setForm] = useState({ email: '', password: '' });
  const [loading, setLoading] = useState(false);
  const [flash, setFlash] = useState<{ type: 'success' | 'error'; message: string } | null>(null);

  const highlights = [
    'AI resume rewrite insights in one click',
    'Curated job matches updated daily',
    'Interview prep workspace & outreach scripts',
  ];

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setLoading(true);
    setFlash(null);

    let apiBaseUrl = '';
    try {
      const config = await getEnvironmentConfig();
      apiBaseUrl = config.apiBaseUrl;

      const response = await fetch(`${apiBaseUrl}/auth/login/email`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });

      const payload = await response.json().catch(() => ({}));

      if (!response.ok) {
        const message = normalizeDetail(
          payload.detail,
          'Unable to log in. Please check your credentials and try again.'
        );
        throw new Error(message);
      }

      setFlash({
        type: 'success',
        message: `Welcome back, ${payload.username ?? payload.email ?? 'candidate'}!`,
      });

      // Navigate to the authenticated home after successful login
      router.push('/app/dashboard');
    } catch (error) {
      console.error('Login failed', error);
      setFlash({
        type: 'error',
        message: mapNetworkError(error, 'Unable to log in. Please try again later.', apiBaseUrl),
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-shell">
      <div className="auth-surface">
        <section className="auth-content">
          <div className="auth-brand">
            <span className="auth-brand-mark">JM</span>
            <div className="auth-brand-meta">
              <span className="auth-brand-label">JobMatch</span>
              <span className="auth-brand-tagline">Personal career co-pilot</span>
            </div>
          </div>

          <h1 className="auth-hero-title">Welcome back, we saved your progress.</h1>
          <p className="auth-hero-copy">
            Pick up where you left off with tailored job leads, recruiter-ready messaging, and automation that keeps your
            search moving.
          </p>

          <ul className="auth-highlight-list">
            {highlights.map((item) => (
              <li key={item} className="auth-highlight-item">
                <span aria-hidden="true">✓</span>
                <span>{item}</span>
              </li>
            ))}
          </ul>
        </section>

        <section className="auth-card" role="main" aria-labelledby="auth-card-title">
          <div className="auth-card-header">
            <h2 id="auth-card-title">Sign in</h2>
            <p>Use your JobMatch credentials to continue.</p>
          </div>

          {flash ? <div className={`auth-banner auth-banner-${flash.type}`}>{flash.message}</div> : null}

          <form className="auth-form" onSubmit={handleSubmit} noValidate>
            <div className="auth-field">
              <label className="auth-label" htmlFor="email">
                Email address
              </label>
              <input
                className="auth-input"
                id="email"
                type="email"
                name="email"
                value={form.email}
                onChange={handleChange}
                placeholder="you@email.com"
                autoComplete="email"
                required
              />
            </div>

            <div className="auth-field">
              <label className="auth-label" htmlFor="password">
                Password
              </label>
              <input
                className="auth-input"
                id="password"
                type="password"
                name="password"
                value={form.password}
                onChange={handleChange}
                placeholder="Enter your password"
                autoComplete="current-password"
                required
              />
            </div>

            <div className="auth-options-row">
              <label className="auth-checkbox">
                <input type="checkbox" />
                <span>Remember me</span>
              </label>
              <a href="#" className="auth-link">
                Forgot password?
              </a>
            </div>

            <button className="auth-primary-btn" type="submit" disabled={loading}>
              {loading ? 'Signing you in…' : 'Sign in'}
            </button>
          </form>

          <p className="auth-secondary-text">
            New to JobMatch?{' '}
            <Link href="/signup" className="auth-link">
              Create a free account
            </Link>
          </p>
        </section>
      </div>
    </div>
  );
}

import Link from 'next/link';
import { useState } from 'react';
import { useRouter } from 'next/router';
import { getEnvironmentConfig } from '../../lib/runtimeConfig';
import { describeNetworkError } from '../../lib/networkErrors';
import { persistWorkspaceProfile } from '../../lib/workspaceProfileStorage';
import { persistAccessToken } from '../../lib/authTokenStorage';

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

type LoginResponsePayload = {
  access_token?: string;
  token_type?: string;
  detail?: unknown;
  user?: {
    user_id?: number;
    email?: string | null;
    username?: string | null;
    first_name?: string | null;
    last_name?: string | null;
    is_admin?: boolean;
  };
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

      const response = await fetch(`${apiBaseUrl}/auth/token`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: new URLSearchParams({
          username: form.email,
          password: form.password,
        }).toString(),
      });

      const payload: LoginResponsePayload = await response.json().catch(() => ({} as LoginResponsePayload));

      if (!response.ok || !payload?.access_token || !payload.user) {
        const message = normalizeDetail(
          payload?.detail,
          'Unable to log in. Please check your credentials and try again.'
        );
        throw new Error(message);
      }

      persistAccessToken(payload.access_token);
      persistWorkspaceProfile({
        userId: payload.user.user_id ?? null,
        firstName: payload.user.first_name ?? null,
        lastName: payload.user.last_name ?? null,
        username: payload.user.username ?? null,
        email: payload.user.email ?? null,
      });

      setFlash({
        type: 'success',
        message: `Welcome back, ${payload.user.username ?? payload.user.email ?? 'candidate'}!`,
      });

      // Navigate to the authenticated home after successful login
      router.push('/workspace/overview');
    } catch (error) {
      console.error('Login failed', error);
      const { message } = describeNetworkError(error, 'Unable to log in. Please try again later.', {
        apiBaseUrl,
        networkMessage: apiBaseUrl
          ? `Cannot reach API at ${apiBaseUrl}. Ensure the backend is running and accessible.`
          : 'Cannot reach the API. Ensure the backend is running and accessible.',
      });
      setFlash({
        type: 'error',
        message,
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
            <Link href="/auth/signup" className="auth-link">
              Create a free account
            </Link>
          </p>
        </section>
      </div>
    </div>
  );
}

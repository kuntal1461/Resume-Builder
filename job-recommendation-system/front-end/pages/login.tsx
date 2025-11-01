import Link from 'next/link';
import { useState } from 'react';

const API_BASE =
  process.env.NEXT_PUBLIC_API_BASE_URL ?? 'http://localhost:8000';

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

const mapNetworkError = (error: unknown, fallback: string) => {
  if (error && typeof error === 'object' && 'name' in error && error.name === 'TypeError') {
    const message = String((error as Error).message || '').toLowerCase();
    if (
      message.includes('failed to fetch') ||
      message.includes('load failed') ||
      message.includes('network request failed')
    ) {
      return `Cannot reach API at ${API_BASE}. Ensure the backend is running and accessible.`;
    }
  }
  if (error instanceof Error) {
    return error.message;
  }
  return fallback;
};

export default function LoginPage() {
  const [form, setForm] = useState({ email: '', password: '' });
  const [loading, setLoading] = useState(false);
  const [flash, setFlash] = useState<{ type: 'success' | 'error'; message: string } | null>(null);

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setLoading(true);
    setFlash(null);

    try {
      const response = await fetch(`${API_BASE}/auth/login/email`, {
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
    } catch (error) {
      console.error('Login failed', error);
      setFlash({
        type: 'error',
        message: mapNetworkError(error, 'Unable to log in. Please try again later.'),
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-left">
        <div className="auth-logo">JM</div>
        <div>
          <div className="auth-welcome-title">Login to JobMatch</div>
          <div className="auth-welcome-desc">
            Resume Builder helps you discover curated roles, AI resume coaching, and recruiter-ready intros.
          </div>
        </div>
      </div>

      <div className="auth-form-wrapper" role="main">
        <h1 className="auth-form-title">Sign in to your account</h1>

        {flash && <div className={`auth-alert ${flash.type}`}>{flash.message}</div>}

        <form onSubmit={handleSubmit} noValidate>
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

          <div className="auth-options-row">
            <label className="auth-checkbox-label">
              <input type="checkbox" /> Remember me
            </label>
            <a href="#" className="auth-forgot">
              Forgot password?
            </a>
          </div>

          <button className="auth-primary-btn" type="submit" disabled={loading}>
            {loading ? 'Signing you in…' : 'Login'}
          </button>
        </form>

        <div className="auth-or-row">
          <hr />
          <span className="auth-or-text">or continue with</span>
          <hr />
        </div>

        <button className="auth-google-btn" type="button" disabled={loading}>
          <span aria-hidden="true" style={{ marginRight: 8 }}>
            🔐
          </span>
          Sign in with SSO
        </button>

        <p className="auth-footer-link">
          Don&apos;t have an account?{' '}
          <Link href="/signup" className="auth-forgot">
            Create one now
          </Link>
        </p>
      </div>
    </div>
  );
}

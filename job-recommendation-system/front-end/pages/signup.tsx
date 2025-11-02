import Link from 'next/link';
import { ChangeEvent, FormEvent, useState } from 'react';

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

type FlashState =
  | { type: 'success'; message: string }
  | { type: 'error'; message: string }
  | null;

export default function SignupPage() {
  const [form, setForm] = useState({
    username: '',
    firstName: '',
    lastName: '',
    email: '',
    phoneNumber: '',
    password: '',
  });
  const [loading, setLoading] = useState(false);
  const [flash, setFlash] = useState<FlashState>(null);

  const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setLoading(true);
    setFlash(null);

    const payload = {
      username: form.username.trim(),
      first_name: form.firstName.trim(),
      last_name: form.lastName.trim(),
      email: form.email.trim(),
      phone_number: form.phoneNumber.trim() === '' ? null : form.phoneNumber.trim(),
      password: form.password,
    };

    try {
      const response = await fetch(`${API_BASE}/auth/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      const body = await response.json().catch(() => ({}));

      if (!response.ok) {
        const message = normalizeDetail(body.detail, 'Unable to create the account. Please try again.');
        throw new Error(message);
      }

      setFlash({
        type: 'success',
        message: 'Account created successfully. You can now sign in with your credentials.',
      });
      setForm({
        username: '',
        firstName: '',
        lastName: '',
        email: '',
        phoneNumber: '',
        password: '',
      });
    } catch (error) {
      console.error('Registration failed', error);
      setFlash({
        type: 'error',
        message: mapNetworkError(error, 'Unable to create the account. Please try again later.'),
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
          <div className="auth-welcome-title">Let’s build your next chapter</div>
          <div className="auth-welcome-desc">
            Join JobMatch to unlock AI resume guidance, curated job matches, and recruiter-ready introductions.
          </div>
        </div>
      </div>

      <div className="auth-form-wrapper" role="main">
        <h1 className="auth-form-title">Create your JobMatch account</h1>

        {flash && <div className={`auth-alert ${flash.type}`}>{flash.message}</div>}

        <form onSubmit={handleSubmit} noValidate>
          <label className="auth-label" htmlFor="username">
            Username
          </label>
          <input
            className="auth-input"
            id="username"
            type="text"
            name="username"
            value={form.username}
            onChange={handleChange}
            placeholder="Choose a unique username"
            autoComplete="username"
            required
            minLength={3}
          />

          <label className="auth-label" htmlFor="firstName">
            First name
          </label>
          <input
            className="auth-input"
            id="firstName"
            type="text"
            name="firstName"
            value={form.firstName}
            onChange={handleChange}
            placeholder="First name"
            autoComplete="given-name"
            required
          />

          <label className="auth-label" htmlFor="lastName">
            Last name
          </label>
          <input
            className="auth-input"
            id="lastName"
            type="text"
            name="lastName"
            value={form.lastName}
            onChange={handleChange}
            placeholder="Last name"
            autoComplete="family-name"
            required
          />

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

          <label className="auth-label" htmlFor="phoneNumber">
            Phone (optional)
          </label>
          <input
            className="auth-input"
            id="phoneNumber"
            type="tel"
            name="phoneNumber"
            value={form.phoneNumber}
            onChange={handleChange}
            placeholder="+1 555 123 4567"
            autoComplete="tel"
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
            placeholder="Create a strong password"
            autoComplete="new-password"
            required
            minLength={6}
          />

          <button className="auth-primary-btn" type="submit" disabled={loading}>
            {loading ? 'Creating your account…' : 'Sign up'}
          </button>
        </form>

        

        <p className="auth-footer-link">
          Already have an account?{' '}
          <Link href="/login" className="auth-forgot">
            Log in here
          </Link>
        </p>
      </div>
    </div>
  );
}

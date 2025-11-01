import { useState } from 'react';

const API_BASE =
  process.env.NEXT_PUBLIC_API_BASE_URL ?? 'http://localhost:8000';

const normalizeDetail = (detail, fallback) => {
  if (!detail) {
    return fallback;
  }

  if (typeof detail === 'string') {
    return detail;
  }

  if (Array.isArray(detail)) {
    const first = detail[0];
    if (first && typeof first === 'object') {
      if (first.msg) {
        return first.msg;
      }
      if (first.message) {
        return first.message;
      }
    }
    return detail.join(', ');
  }

  if (typeof detail === 'object') {
    if (detail.message) {
      return detail.message;
    }
    return JSON.stringify(detail);
  }

  return fallback;
};

const mapNetworkError = (error, fallback) => {
  if (error?.name === 'TypeError') {
    const message = String(error.message || '').toLowerCase();
    if (
      message.includes('failed to fetch') ||
      message.includes('load failed') ||
      message.includes('network request failed')
    ) {
      return `Cannot reach API at ${API_BASE}. Ensure the backend is running and accessible.`;
    }
  }
  return error?.message || fallback;
};

export default function AuthPage() {
  const [tab, setTab] = useState('login');
  const [flash, setFlash] = useState(null);

  const handleSwitch = (targetTab) => {
    setFlash(null);
    setTab(targetTab);
  };

  return (
    <div className="auth-container">
      <div className="auth-left">
        <div className="auth-logo">A/K</div>
        <div>
          <div className="auth-welcome-title">We Welcome You For The BEST!</div>
          <div className="auth-welcome-desc">
            Resume Builder helps, boost and redefine your career
          </div>
        </div>
      </div>

      <div className="auth-form-wrapper">
        <div className="auth-tabs">
          <button
            className={`auth-tab-btn${tab === 'login' ? ' active' : ''}`}
            onClick={() => handleSwitch('login')}
            type="button"
          >
            Login
          </button>
          <button
            className={`auth-tab-btn${tab === 'register' ? ' active' : ''}`}
            onClick={() => handleSwitch('register')}
            type="button"
          >
            Register
          </button>
        </div>

        {flash && (
          <div className={`auth-alert ${flash.type}`}>{flash.message}</div>
        )}

        {tab === 'login' ? (
          <LoginForm
            onSuccess={(data) => {
              setFlash({
                type: 'success',
                message: `Welcome back, ${data.username ?? data.email}!`,
              });
            }}
            onError={(message) => setFlash({ type: 'error', message })}
          />
        ) : (
          <RegisterForm
            onSuccess={() => {
              setFlash({
                type: 'success',
                message: 'Account created successfully. Please log in.',
              });
              setTab('login');
            }}
            onError={(message) => setFlash({ type: 'error', message })}
          />
        )}
      </div>
    </div>
  );
}

function LoginForm({ onSuccess, onError }) {
  const [form, setForm] = useState({ email: '', password: '' });
  const [loading, setLoading] = useState(false);

  const handleChange = (event) => {
    const { name, value } = event.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setLoading(true);

    try {
      const response = await fetch(`${API_BASE}/auth/login/email`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });

      const payload = await response.json();

      if (!response.ok) {
        const message = normalizeDetail(
          payload.detail,
          'Unable to log in. Please try again.'
        );
        throw new Error(message);
      }

      onSuccess?.(payload);
    } catch (error) {
      console.error('Login failed', error);
      onError?.(
        mapNetworkError(error, 'Unable to log in. Please try again later.')
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <input
        className="auth-input"
        type="email"
        name="email"
        value={form.email}
        onChange={handleChange}
        placeholder="Please enter your email"
        required
      />
      <input
        className="auth-input"
        type="password"
        name="password"
        value={form.password}
        onChange={handleChange}
        placeholder="Please enter your password"
        required
      />

      <div className="auth-options-row">
        <label className="auth-checkbox-label">
          <input type="checkbox" /> Remember Me
        </label>
        <a href="#" className="auth-forgot">
          Forgot password?
        </a>
      </div>

      <button className="auth-primary-btn" type="submit" disabled={loading}>
        {loading ? 'Signing in…' : 'Login'}
      </button>
    </form>
  );
}

function RegisterForm({ onSuccess, onError }) {
  const [form, setForm] = useState({
    username: '',
    first_name: '',
    last_name: '',
    email: '',
    phone_number: '',
    password: '',
  });
  const [loading, setLoading] = useState(false);

  const handleChange = (event) => {
    const { name, value } = event.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setLoading(true);

    try {
      const requestPayload = {
        ...form,
        phone_number: form.phone_number.trim() === '' ? null : form.phone_number,
      };
      const response = await fetch(`${API_BASE}/auth/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(requestPayload),
      });

      const payload = await response.json();

      if (!response.ok) {
        const message = normalizeDetail(
          payload.detail,
          'Unable to create the account. Please try again.'
        );
        throw new Error(message);
      }

      onSuccess?.(payload);
      setForm({
        username: '',
        first_name: '',
        last_name: '',
        email: '',
        phone_number: '',
        password: '',
      });
    } catch (error) {
      console.error('Registration failed', error);
      onError?.(
        mapNetworkError(
          error,
          'Unable to create the account. Please try again later.'
        )
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <input
        className="auth-input"
        type="text"
        name="username"
        value={form.username}
        onChange={handleChange}
        placeholder="Username"
        required
        minLength={3}
      />
      <input
        className="auth-input"
        type="text"
        name="first_name"
        value={form.first_name}
        onChange={handleChange}
        placeholder="First Name"
        required
      />
      <input
        className="auth-input"
        type="text"
        name="last_name"
        value={form.last_name}
        onChange={handleChange}
        placeholder="Last Name"
        required
      />
      <input
        className="auth-input"
        type="email"
        name="email"
        value={form.email}
        onChange={handleChange}
        placeholder="Email"
        required
      />
      <input
        className="auth-input"
        type="tel"
        name="phone_number"
        value={form.phone_number}
        onChange={handleChange}
        placeholder="Phone (optional)"
      />
      <input
        className="auth-input"
        type="password"
        name="password"
        value={form.password}
        onChange={handleChange}
        placeholder="Password"
        required
        minLength={6}
      />
      <button className="auth-primary-btn" type="submit" disabled={loading}>
        {loading ? 'Creating account…' : 'Register'}
      </button>
    </form>
  );
}

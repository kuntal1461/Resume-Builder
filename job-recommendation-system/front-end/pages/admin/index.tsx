import Head from 'next/head';
import { ChangeEvent, FormEvent, useState } from 'react';
import { useRouter } from 'next/router';
import SiteHeader from '../../components/layout/SiteHeader';
import SiteFooter from '../../components/layout/SiteFooter';
import { getEnvironmentConfig } from '../../lib/runtimeConfig';
import { persistAdminProfile } from '../../lib/adminProfileStorage';
import { describeNetworkError } from '../../lib/networkErrors';
import styles from '../../styles/admin/Admin.module.css';

type AuthMode = 'login' | 'signup';
type BannerState = { type: 'success' | 'error'; message: string } | null;

type AdminLoginResponse = {
  access_token?: string;
  token_type?: string;
  success?: boolean;
  message?: string;
  user_id?: number;
  email?: string;
  username?: string;
  first_name?: string;
  last_name?: string;
  is_admin?: boolean;
  user?: {
    user_id?: number;
    email?: string;
    username?: string;
    first_name?: string;
    last_name?: string;
    is_admin?: boolean;
  };
};

const ADMIN_FEATURES = [
  {
    title: 'Unified resume workspace',
    description: 'Invite hiring managers, reviewers, and coordinators to comment on every candidate document in one view.',
  },
  {
    title: 'Job-matching intelligence',
    description: 'Compare candidate skills against open roles and push curated matches directly to interview pipelines.',
  },
  {
    title: 'Compliance-ready audit trail',
    description: 'Automatic logging + exports ensure every decision is documented for leadership reviews.',
  },
];

const ADMIN_STATS = [
  { label: 'Hiring teams onboarded', value: '42' },
  { label: 'Profiles reviewed / week', value: '1.2k' },
  { label: 'Avg. approval time', value: '4h' },
];

const extractDetailMessage = (payload: unknown, fallback: string) => {
  if (!payload) {
    return fallback;
  }

  if (typeof payload === 'string') {
    return payload;
  }

  if (typeof payload === 'object') {
    const record = payload as Record<string, unknown>;
    if (typeof record.detail === 'string') {
      return record.detail;
    }
    if (typeof record.message === 'string') {
      return record.message;
    }
  }

  return fallback;
};

export default function AdminAccessPage() {
  const [mode, setMode] = useState<AuthMode>('login');
  const [adminForm, setAdminForm] = useState({ email: '', password: '' });
  const [adminBanner, setAdminBanner] = useState<BannerState>(null);
  const [adminLoading, setAdminLoading] = useState(false);
  const currentYear = new Date().getFullYear();
  const router = useRouter();

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    // Placeholder for future signup handling
  };

  const handleAdminInputChange = (event: ChangeEvent<HTMLInputElement>) => {
    const { id, value } = event.target;
    const key = id === 'admin-login-password' ? 'password' : 'email';
    setAdminForm((prev) => ({ ...prev, [key]: key === 'email' ? value.trimStart() : value }));
  };

  const handleAdminLogin = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setAdminLoading(true);
    setAdminBanner(null);

    const fallbackMessage = 'Unable to verify your admin access. Please try again.';
    let apiBaseUrl = '';

    try {
      const config = await getEnvironmentConfig();
      apiBaseUrl = config.apiBaseUrl;

      const response = await fetch(`${apiBaseUrl}/auth/login/email`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: adminForm.email.trim(), password: adminForm.password }),
      });

      const payload: AdminLoginResponse = await response.json().catch(() => ({} as AdminLoginResponse));

      if (!response.ok) {
        const message = extractDetailMessage(payload, fallbackMessage);
        throw new Error(message);
      }

      const userPayload = payload?.user ?? payload;

      if (!userPayload?.is_admin) {
        throw new Error('You do not have access to the admin dashboard. Please contact support.');
      }

      persistAdminProfile({
        userId: userPayload.user_id ?? null,
        email: userPayload.email ?? null,
        username: userPayload.username ?? null,
        firstName: userPayload.first_name ?? null,
        lastName: userPayload.last_name ?? null,
        isAdmin: Boolean(userPayload.is_admin),
      });

      const displayName =
        [userPayload.first_name, userPayload.last_name]
          .map((part) => (typeof part === 'string' ? part.trim() : ''))
          .filter(Boolean)
          .join(' ')
          .trim() ||
        userPayload.username ||
        userPayload.email ||
        'admin';

      setAdminBanner({
        type: 'success',
        message: `Access granted. Redirecting you now, ${displayName}…`,
      });

      await router.push('/admin/view');
    } catch (error) {
      const { message } = describeNetworkError(error, fallbackMessage, {
        apiBaseUrl,
        networkMessage: apiBaseUrl
          ? `Cannot reach API at ${apiBaseUrl}. Ensure the backend is reachable.`
          : 'Cannot reach the API. Ensure the backend is running and accessible.',
      });
      setAdminBanner({
        type: 'error',
        message,
      });
    } finally {
      setAdminLoading(false);
    }
  };

  const renderLoginForm = () => (
    <form className={styles.form} onSubmit={handleAdminLogin}>
      {adminBanner ? (
        <div
          className={`${styles.statusBanner} ${
            adminBanner.type === 'error' ? styles.statusError : styles.statusSuccess
          }`}
        >
          {adminBanner.message}
        </div>
      ) : null}
      <div className={styles.formGroup}>
        <label htmlFor="admin-login-email" className={styles.labelRow}>
          <span>Email</span>
        </label>
        <input
          id="admin-login-email"
          type="email"
          className={styles.formInput}
          placeholder="you@company.com"
          value={adminForm.email}
          onChange={handleAdminInputChange}
          autoComplete="email"
          required
        />
      </div>
      <div className={styles.formGroup}>
        <div className={styles.labelRow}>
          <label htmlFor="admin-login-password">Password</label>
          <button type="button" className={styles.secondaryLink} aria-label="Forgot password">
            Forgot?
          </button>
        </div>
        <input
          id="admin-login-password"
          type="password"
          className={styles.formInput}
          placeholder="••••••••"
          value={adminForm.password}
          onChange={handleAdminInputChange}
          autoComplete="current-password"
          required
        />
      </div>
      <label className={styles.checkbox}>
        <input type="checkbox" defaultChecked />
        Keep me signed in
      </label>
      <div className={styles.formActions}>
        <button type="submit" className={styles.primaryButton} disabled={adminLoading}>
          {adminLoading ? 'Checking access…' : 'Access dashboard'}
        </button>
        <button type="button" className={styles.secondaryLink} onClick={() => setMode('signup')}>
          Need an account? Request access
        </button>
      </div>
    </form>
  );

  const renderSignupForm = () => (
    <form className={styles.form} onSubmit={handleSubmit}>
      <div className={styles.formGroup}>
        <div className={styles.labelRow}>
          <span>Admin details</span>
        </div>
        <div className={styles.formInputRow}>
          <input type="text" className={styles.formInput} placeholder="First name" required />
          <input type="text" className={styles.formInput} placeholder="Last name" required />
        </div>
      </div>
      <div className={styles.formGroup}>
        <label htmlFor="admin-signup-email" className={styles.labelRow}>
          <span>Work email</span>
        </label>
        <input id="admin-signup-email" type="email" className={styles.formInput} placeholder="talent@company.com" required />
      </div>
      <div className={styles.formGroup}>
        <label htmlFor="admin-signup-team" className={styles.labelRow}>
          <span>Team or workspace name</span>
        </label>
        <input id="admin-signup-team" type="text" className={styles.formInput} placeholder="Talent Ops · APAC" required />
      </div>
      <div className={styles.formGroup}>
        <div className={styles.labelRow}>
          <label htmlFor="admin-signup-password">Create password</label>
        </div>
        <input id="admin-signup-password" type="password" className={styles.formInput} placeholder="Minimum 8 characters" required />
      </div>
      <div className={styles.formActions}>
        <button type="submit" className={styles.primaryButton}>
          Create admin workspace
        </button>
        <button type="button" className={styles.secondaryLink} onClick={() => setMode('login')}>
          Already invited? Log in
        </button>
      </div>
    </form>
  );

  return (
    <>
      <Head>
        <title>JobMatch · Resume Admin Access</title>
        <meta name="description" content="Secure admin controls for reviewing resumes, assigning interview pipelines, and collaborating with hiring teams." />
      </Head>
      <SiteHeader />
      <main className={styles.wrapper}>
        <div className={styles.inner}>
          <section className={styles.hero}>
            <div className={styles.heroEyebrow}>
              <span>Resume admin</span>
              <span>·</span>
              <span>Secure workspace</span>
            </div>
            <h1 className={styles.heroTitle}>Control every resume workflow from one admin dashboard.</h1>
            <p className={styles.heroCopy}>
              Grant hiring partners access, monitor candidate progress, and keep approvals on schedule. Sign in to manage your workspace or request new admin credentials.
            </p>
            <div className={styles.statsGrid}>
              {ADMIN_STATS.map((stat) => (
                <article key={stat.label} className={styles.statCard}>
                  <strong>{stat.value}</strong>
                  <span>{stat.label}</span>
                </article>
              ))}
            </div>
          </section>

          <section className={styles.panelWrap}>
            <aside className={styles.infoPanel}>
              <span className={styles.infoBadge}>Admin toolkit</span>
              <h2>Purpose-built controls for resume reviewers.</h2>
              <p>Move faster with automated resume scoring, access controls, and instant collaboration utilities tailored for recruiting operations.</p>
              <ul className={styles.featureList}>
                {ADMIN_FEATURES.map((feature) => (
                  <li key={feature.title} className={styles.featureItem}>
                    <span className={styles.featureIcon}>•</span>
                    <div>
                      <strong>{feature.title}</strong>
                      <span>{feature.description}</span>
                    </div>
                  </li>
                ))}
              </ul>
            </aside>

            <div className={styles.authPanel}>
              <div className={styles.tabList} role="tablist" aria-label="Admin authentication modes">
                <button
                  type="button"
                  role="tab"
                  aria-selected={mode === 'login'}
                  className={`${styles.tabButton} ${mode === 'login' ? styles.tabButtonActive : ''}`}
                  onClick={() => setMode('login')}
                >
                  Log in
                </button>
                <button
                  type="button"
                  role="tab"
                  aria-selected={mode === 'signup'}
                  className={`${styles.tabButton} ${mode === 'signup' ? styles.tabButtonActive : ''}`}
                  onClick={() => setMode('signup')}
                >
                  Request access
                </button>
              </div>

              {mode === 'login' ? renderLoginForm() : renderSignupForm()}

              <div className={styles.divider} aria-hidden="true" />
              <p className={styles.disclaimer}>
                Admin access is restricted to authorized team members. By continuing you agree to the security policy and confidentiality terms outlined in your JobMatch contract.
              </p>
            </div>
          </section>
        </div>
      </main>
      <SiteFooter currentYear={currentYear} />
    </>
  );
}

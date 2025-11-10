import Head from 'next/head';
import { FormEvent, useState } from 'react';
import SiteHeader from '../../components/layout/SiteHeader';
import SiteFooter from '../../components/layout/SiteFooter';
import styles from '../../styles/admin/Admin.module.css';

type AuthMode = 'login' | 'signup';

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

export default function AdminAccessPage() {
  const [mode, setMode] = useState<AuthMode>('login');
  const currentYear = new Date().getFullYear();

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    // Placeholder for real auth integration.
  };

  const renderLoginForm = () => (
    <form className={styles.form} onSubmit={handleSubmit}>
      <div className={styles.formGroup}>
        <label htmlFor="admin-login-email" className={styles.labelRow}>
          <span>Email</span>
        </label>
        <input id="admin-login-email" type="email" className={styles.formInput} placeholder="you@company.com" required />
      </div>
      <div className={styles.formGroup}>
        <div className={styles.labelRow}>
          <label htmlFor="admin-login-password">Password</label>
          <button type="button" className={styles.secondaryLink} aria-label="Forgot password">
            Forgot?
          </button>
        </div>
        <input id="admin-login-password" type="password" className={styles.formInput} placeholder="••••••••" required />
      </div>
      <label className={styles.checkbox}>
        <input type="checkbox" defaultChecked />
        Keep me signed in
      </label>
      <div className={styles.formActions}>
        <button type="submit" className={styles.primaryButton}>
          Access dashboard
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

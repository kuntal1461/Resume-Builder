import Head from 'next/head';
import Link from 'next/link';
import { ChangeEvent, FormEvent, useState } from 'react';
import type { ReactElement } from 'react';
import AppShell from '../../../components/workspace/AppShell';
import { APP_MENU_ITEMS, DEFAULT_PROFILE_TASKS } from '../../../components/workspace/navigation';
import styles from '../../../styles/workspace/AccountSettings.module.css';

type FormState = {
  firstName: string;
  lastName: string;
  email: string;
  headline: string;
  location: string;
};

const INITIAL_FORM_STATE: FormState = {
  firstName: 'Kuntal',
  lastName: 'Maity',
  email: 'kuntal.1461@gmail.com',
  headline: 'Product Strategy Lead',
  location: 'Kolkata, India',
};

const FALLBACK_INITIALS = `${INITIAL_FORM_STATE.firstName.charAt(0)}${INITIAL_FORM_STATE.lastName.charAt(0)}`.toUpperCase();
const INITIAL_PROFILE_NAME = `${INITIAL_FORM_STATE.firstName} ${INITIAL_FORM_STATE.lastName}`.trim();
const PROFILE_TAGLINE = 'Set your target role';

const buildProfileCard = (data: FormState) => {
  const firstInitial = data.firstName.trim().charAt(0);
  const lastInitial = data.lastName.trim().charAt(0);
  const initials = `${firstInitial}${lastInitial}`.toUpperCase() || FALLBACK_INITIALS;

  return {
    name: `${data.firstName} ${data.lastName}`.trim() || INITIAL_PROFILE_NAME,
    tagline: PROFILE_TAGLINE,
    initials,
    progressLabel: '5%',
  };
};

type SocialProviderIcon = 'facebook' | 'linkedin' | 'google';

type SocialProvider = {
  id: string;
  name: string;
  description: string;
  icon: SocialProviderIcon;
  status: 'connected' | 'disconnected';
  connectedDetail?: string;
};

const SOCIAL_PROVIDERS: SocialProvider[] = [
  {
    id: 'facebook',
    name: 'Facebook',
    description: 'Keep your professional story consistent everywhere hiring teams discover you.',
    icon: 'facebook',
    status: 'disconnected',
  },
  {
    id: 'linkedin',
    name: 'LinkedIn',
    description: 'Sync your headline, featured projects, and open-to-work signal with a single click.',
    icon: 'linkedin',
    status: 'disconnected',
  },
  {
    id: 'google',
    name: 'Google',
    description: 'Use single sign-on and push resume exports to Drive without friction.',
    icon: 'google',
    status: 'connected',
    connectedDetail: 'kuntal.1461@gmail.com',
  },
];

type NotificationOption = {
  id: string;
  title: string;
  description: string;
  enabled: boolean;
};

const NOTIFICATION_OPTIONS: NotificationOption[] = [
  {
    id: 'updates',
    title: 'Updates and offers',
    description: 'Product drops, discounts, and feature spotlights tailored to your plan.',
    enabled: true,
  },
  {
    id: 'analytics',
    title: 'Resume analytics',
    description: 'Weekly views, downloads, and match rates for each resume you share.',
    enabled: true,
  },
  {
    id: 'newsletter',
    title: 'Career playbook newsletter',
    description: 'Every-other-week insights on landing offers faster with proven scripts.',
    enabled: false,
  },
  {
    id: 'careerPlans',
    title: 'Career plans',
    description: 'Get a heads-up when personalized career planning becomes available.',
    enabled: false,
  },
];

const HERO_HIGHLIGHTS = [
  { value: '92%', label: 'Profile power for curated matches' },
  { value: '18 / week', label: 'New roles handpicked for you' },
  { value: '3 of 5', label: 'Next actions to unlock autopilot' },
];

const PLAN = {
  name: 'Free account',
  description:
    'You can save resumes, track applications, and receive tailored job recommendations. Upgrade any time to unlock AI autopilot and PDF exports.',
  features: ['AI resume builder · 3 credits / month', 'Guided job tracker workspace', 'ATS insights and keyword prompts'],
};

const SOCIAL_ICON_ART: Record<SocialProviderIcon, ReactElement> = {
  facebook: (
    <svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
      <path
        fill="currentColor"
        d="M15.765 8.417h-2.03v-1.31c0-.62.412-.767.703-.767h1.267V4.01L13.757 4c-2.281 0-2.79 1.735-2.79 2.844v1.573H9v2.223h1.967V20h2.768v-7.36h1.984l.046-2.223z"
      />
    </svg>
  ),
  linkedin: (
    <svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
      <path
        fill="currentColor"
        d="M7.4 20.001H4.356V9.186H7.4zM5.878 7.748a1.776 1.776 0 1 1 0-3.553 1.776 1.776 0 0 1 0 3.553zM20 20.001h-3.043v-5.269c0-1.256-.024-2.869-1.748-2.869-1.748 0-2.017 1.366-2.017 2.778v5.36h-3.04V9.186h2.916v1.48h.042c.406-.768 1.397-1.58 2.876-1.58 3.074 0 3.645 2.025 3.645 4.656z"
      />
    </svg>
  ),
  google: (
    <svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
      <path
        fill="currentColor"
        d="M21 12.23c0-.7-.06-1.36-.18-2H12v3.79h5.06c-.22 1.13-.9 2.09-1.93 2.73v2.26h3.12c1.83-1.68 2.88-4.16 2.88-6.78z"
      />
      <path
        fill="currentColor"
        d="M12 22c2.61 0 4.8-.87 6.4-2.36l-3.12-2.26c-.87.58-1.98.92-3.28.92-2.52 0-4.66-1.7-5.43-3.98H3.3v2.47C4.88 19.98 8.15 22 12 22z"
      />
      <path
        fill="currentColor"
        d="M6.57 13.32c-.2-.59-.32-1.22-.32-1.87s.12-1.28.32-1.87V7.11H3.3C2.62 8.43 2.25 9.96 2.25 11.45s.37 3.02 1.05 4.34z"
      />
      <path
        fill="currentColor"
        d="M12 6.08c1.42 0 2.69.49 3.69 1.44l2.77-2.77C16.79 2.83 14.61 2 12 2 8.15 2 4.88 4.02 3.3 7.11l3.27 2.47C7.34 7.78 9.48 6.08 12 6.08z"
      />
    </svg>
  ),
};

export default function WorkspaceAccountSettingsPage() {
  const [formData, setFormData] = useState<FormState>(INITIAL_FORM_STATE);
  const [isSaving, setIsSaving] = useState(false);
  const [saveState, setSaveState] = useState<'idle' | 'saved'>('idle');
  const [socialConnections, setSocialConnections] = useState<SocialProvider[]>(SOCIAL_PROVIDERS);
  const [notificationSettings, setNotificationSettings] = useState<NotificationOption[]>(NOTIFICATION_OPTIONS);
  const [profileCard, setProfileCard] = useState(() => buildProfileCard(INITIAL_FORM_STATE));

  const handleFormChange =
    (field: keyof FormState) =>
    (event: ChangeEvent<HTMLInputElement>) => {
      setFormData((previous) => ({ ...previous, [field]: event.target.value }));
      setSaveState('idle');
    };

  const handleFormSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setIsSaving(true);
    setTimeout(() => {
      setIsSaving(false);
      setSaveState('saved');
      setProfileCard(buildProfileCard(formData));
    }, 900);
  };

  const handleNotificationToggle = (id: string) => {
    setNotificationSettings((previous) =>
      previous.map((option) => (option.id === id ? { ...option, enabled: !option.enabled } : option)),
    );
  };

  const handleSocialToggle = (id: string) => {
    setSocialConnections((previous) =>
      previous.map((provider) =>
        provider.id === id
          ? {
              ...provider,
              status: provider.status === 'connected' ? 'disconnected' : 'connected',
            }
          : provider,
      ),
    );
  };

  return (
    <>
      <Head>
        <title>JobMatch · Account Settings</title>
        <meta
          name="description"
          content="Personalize your JobMatch account, stay in control of notifications, and connect the platforms that fuel your job search."
        />
      </Head>
      <AppShell
        menuItems={APP_MENU_ITEMS}
        profileTasks={DEFAULT_PROFILE_TASKS}
        profile={profileCard}
      >
        <div className={styles.page}>
          <header className={styles.hero}>
            <div className={styles.heroContent}>
              <span className={styles.heroEyebrow}>Account hub</span>
              <h1 className={styles.heroTitle}>Your JobMatch identity, refreshed</h1>
              <p className={styles.heroSubtitle}>
                Shape how hiring teams experience your profile, sync your social proof, and stay in the loop on every insight that moves
                your search forward.
              </p>
              <div className={styles.heroHighlights}>
                {HERO_HIGHLIGHTS.map((highlight) => (
                  <div key={highlight.label} className={styles.heroHighlight}>
                    <span className={styles.heroHighlightValue}>{highlight.value}</span>
                    <span className={styles.heroHighlightLabel}>{highlight.label}</span>
                  </div>
                ))}
              </div>
            </div>
            <aside className={styles.planCard}>
              <span className={styles.planBadge}>Your plan</span>
              <h2 className={styles.planTitle}>{PLAN.name}</h2>
              <p className={styles.planDescription}>{PLAN.description}</p>
              <div className={styles.planFeatures}>
                {PLAN.features.map((feature) => (
                  <div key={feature} className={styles.planFeature}>
                    <span>✓</span>
                    {feature}
                  </div>
                ))}
              </div>
              <div className={styles.planActions}>
                <button type="button" className={styles.upgradeButton}>
                  Upgrade plan <span aria-hidden="true">→</span>
                </button>
                <button type="button" className={styles.secondaryButton}>
                  Compare plans
                </button>
              </div>
            </aside>
          </header>

          <div className={styles.contentGrid}>
            <div className={styles.columnStack}>
              <section className={styles.card} aria-labelledby="account-details-title">
                <div className={styles.cardHeader}>
                  <div>
                    <h2 id="account-details-title" className={styles.cardTitle}>
                      Account details
                    </h2>
                    <p className={styles.cardSubtitle}>
                      Keep your JobMatch profile polished so hiring managers and our AI both recognize your personal brand instantly.
                    </p>
                  </div>
                  <span className={styles.editBadge}>Profile</span>
                </div>

                <form onSubmit={handleFormSubmit} noValidate>
                  <div className={styles.formGrid}>
                    <div className={styles.inputGroup}>
                      <label htmlFor="account-first-name" className={styles.label}>
                        First name
                      </label>
                      <input
                        id="account-first-name"
                        name="firstName"
                        type="text"
                        value={formData.firstName}
                        onChange={handleFormChange('firstName')}
                        className={styles.input}
                        autoComplete="given-name"
                      />
                    </div>
                    <div className={styles.inputGroup}>
                      <label htmlFor="account-last-name" className={styles.label}>
                        Last name
                      </label>
                      <input
                        id="account-last-name"
                        name="lastName"
                        type="text"
                        value={formData.lastName}
                        onChange={handleFormChange('lastName')}
                        className={styles.input}
                        autoComplete="family-name"
                      />
                    </div>
                    <div className={styles.inputGroup}>
                      <label htmlFor="account-headline" className={styles.label}>
                        Headline
                      </label>
                      <input
                        id="account-headline"
                        name="headline"
                        type="text"
                        value={formData.headline}
                        onChange={handleFormChange('headline')}
                        className={styles.input}
                        placeholder="Your elevator pitch"
                        autoComplete="organization-title"
                      />
                    </div>
                    <div className={styles.inputGroup}>
                      <label htmlFor="account-location" className={styles.label}>
                        Location
                      </label>
                      <input
                        id="account-location"
                        name="location"
                        type="text"
                        value={formData.location}
                        onChange={handleFormChange('location')}
                        className={styles.input}
                        autoComplete="address-level2"
                      />
                    </div>
                    <div className={styles.inputGroup}>
                      <label htmlFor="account-email" className={styles.label}>
                        Email
                      </label>
                      <input
                        id="account-email"
                        name="email"
                        type="email"
                        value={formData.email}
                        onChange={handleFormChange('email')}
                        className={styles.input}
                        autoComplete="email"
                      />
                    </div>
                  </div>
                  <p className={styles.helperText}>
                    Use this email to sign in to JobMatch and receive status updates on your shortlisted roles.
                  </p>
                  <div className={styles.formFooter}>
                    {saveState === 'saved' ? (
                      <span className={styles.statusPill} role="status">
                        ✓ Changes saved
                      </span>
                    ) : null}
                    <button type="submit" className={styles.saveButton} disabled={isSaving}>
                      {isSaving ? 'Saving…' : 'Save changes'}
                    </button>
                  </div>
                </form>
              </section>

              <section className={styles.card} aria-labelledby="notification-preferences-title">
                <div className={styles.cardHeader}>
                  <div>
                    <h2 id="notification-preferences-title" className={styles.cardTitle}>
                      Email notifications
                    </h2>
                    <p className={styles.cardSubtitle}>
                      Decide what lands in your inbox so you only hear from us when it accelerates your search.
                    </p>
                  </div>
                </div>
                <div className={styles.notificationList}>
                  {notificationSettings.map((option) => (
                    <label key={option.id} className={styles.notificationItem} htmlFor={`notification-${option.id}`}>
                      <div className={styles.notificationCopy}>
                        <span className={styles.notificationTitle}>{option.title}</span>
                        <span className={styles.notificationDescription}>{option.description}</span>
                      </div>
                      <div className={styles.toggleWrapper}>
                        <input
                          id={`notification-${option.id}`}
                          className={styles.toggleInput}
                          type="checkbox"
                          checked={option.enabled}
                          onChange={() => handleNotificationToggle(option.id)}
                          aria-label={`Toggle ${option.title}`}
                        />
                        <span className={styles.toggle} aria-hidden="true" />
                      </div>
                    </label>
                  ))}
                </div>
              </section>
            </div>

            <div className={styles.columnStack}>
              <section className={styles.card} aria-labelledby="social-connections-title">
                <div className={styles.cardHeader}>
                  <div>
                    <h2 id="social-connections-title" className={styles.cardTitle}>
                      Social profile
                    </h2>
                    <p className={styles.cardSubtitle}>
                      Connect the platforms recruiters check first to strengthen trust in every outreach.
                    </p>
                  </div>
                </div>
                <div className={styles.socialList}>
                  {socialConnections.map((provider) => {
                    const isConnected = provider.status === 'connected';
                    const actionLabel = isConnected ? 'Disconnect' : 'Connect';

                    return (
                      <div key={provider.id} className={styles.socialItem}>
                        <div className={styles.socialMeta}>
                          <div className={`${styles.socialIcon} ${provider.icon}`}>
                            {SOCIAL_ICON_ART[provider.icon]}
                          </div>
                          <div className={styles.socialCopy}>
                            <span className={styles.socialTitle}>{provider.name}</span>
                            <span className={styles.socialDescription}>{provider.description}</span>
                            <span
                              className={`${styles.socialStatus} ${
                                isConnected ? styles.socialStatusConnected : styles.socialStatusDisconnected
                              }`}
                            >
                              {isConnected
                                ? `Connected${provider.connectedDetail ? ` - ${provider.connectedDetail}` : ''}`
                                : 'Not connected'}
                            </span>
                          </div>
                        </div>
                        <button
                          type="button"
                          className={`${styles.linkButton} ${isConnected ? styles.disconnectButton : ''}`}
                          onClick={() => handleSocialToggle(provider.id)}
                        >
                          {actionLabel}
                        </button>
                      </div>
                    );
                  })}
                </div>
              </section>

              <section className={`${styles.card} ${styles.supportCard}`} aria-labelledby="support-title">
                <div className={styles.cardHeader}>
                  <div>
                    <h2 id="support-title" className={styles.cardTitle}>
                      Need a hand?
                    </h2>
                    <p className={styles.cardSubtitle}>
                      We&apos;re on standby to help you polish your resume, decode feedback, and ship more confident applications.
                    </p>
                  </div>
                </div>
                <div className={styles.supportActions}>
                  <Link href="/workspace/help/faq" className={styles.supportLink}>
                    Browse the help center <span aria-hidden="true">→</span>
                  </Link>
                  <a className={styles.supportLink} href="mailto:support@jobmatch.ai">
                    Email support <span aria-hidden="true">↗</span>
                  </a>
                  <a className={styles.supportLink} href="/workspace/career-coaching">
                    Book a coach session <span aria-hidden="true">→</span>
                  </a>
                </div>
              </section>

              <section className={`${styles.card} ${styles.dangerCard}`} aria-labelledby="danger-zone-title">
                <div className={styles.cardHeader}>
                  <div>
                    <span className={styles.dangerBadge}>Danger zone</span>
                    <h2 id="danger-zone-title" className={styles.cardTitle}>
                      Delete account
                    </h2>
                  </div>
                </div>
                <p className={styles.dangerDescription}>
                  Deleting your account is permanent. All saved resumes, job matches, interview prep, and analytics will be removed. Make
                  sure you&apos;ve exported anything you want to keep first.
                </p>
                <button type="button" className={styles.deleteButton}>
                  Delete account
                </button>
              </section>
            </div>
          </div>
        </div>
      </AppShell>
    </>
  );
}

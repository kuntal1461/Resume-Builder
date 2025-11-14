import Link from 'next/link';
import { useEffect, useState } from 'react';
import AppDashboardAccountMenu from './AppDashboardAccountMenu';
import styles from '../../styles/workspace/WorkspaceLayout.module.css';
import { ArrowIcon, SparkIcon, UnlimitedLearningIcon } from './icons';
import {
  buildWorkspaceIdentity,
  getWorkspaceFirstName,
  loadWorkspaceProfile,
} from '../../lib/workspaceProfileStorage';

const HERO = {
  greeting: 'Good afternoon, Kuntal',
  badge: 'Fresh this week',
  title: 'Level up your JobMatch workspace',
  subtitle:
    'Upgrade to unlock autopilot applications, unlimited ATS scans, and guided learning journeys tailored to your target role.',
  primaryCta: {
    label: 'Upgrade now',
    href: '/workspace/billing/plans',
  },
  secondaryCta: {
    label: 'Explore learning catalog',
    href: '/workspace/unlimited-learning',
  },
};

const INSIGHT = {
  label: 'Profile completeness',
  value: '45%',
  description: 'Finish your checklist to boost match quality and outreach wins.',
  action: {
    label: 'Complete profile',
    href: '/workspace/career-profile/profile',
  },
};

const ACCOUNT_PROFILE = {
  name: 'Kuntal Maity',
  email: 'kuntal.1461@gmail.com',
  initials: 'KM',
};

const GREETING_PREFIX = HERO.greeting.includes(',')
  ? HERO.greeting.split(',')[0]?.trim() ?? HERO.greeting
  : HERO.greeting;

export default function AppDashboardHeader() {
  const [heroGreeting, setHeroGreeting] = useState(HERO.greeting);
  const [accountProfile, setAccountProfile] = useState(ACCOUNT_PROFILE);

  useEffect(() => {
    const snapshot = loadWorkspaceProfile();
    if (!snapshot) {
      return;
    }

    const resolvedIdentity = buildWorkspaceIdentity(ACCOUNT_PROFILE, snapshot);
    setAccountProfile(resolvedIdentity);

    const fallbackFirst = resolvedIdentity.name.split(' ')[0] ?? resolvedIdentity.name;
    const preferredFirstName = getWorkspaceFirstName(snapshot, fallbackFirst);
    const greetingName = preferredFirstName || resolvedIdentity.name;
    setHeroGreeting(`${GREETING_PREFIX}, ${greetingName}`.trim());
  }, []);

  return (
    <header className={styles.dashboardHeader} aria-label="Workspace spotlight">
      <div className={styles.dashboardHeaderLeft}>
        <span className={styles.dashboardGreeting}>{heroGreeting}</span>
        <span className={styles.dashboardHeaderBadge}>
          <SparkIcon aria-hidden="true" />
          {HERO.badge}
        </span>
        <h2 className={styles.dashboardHeaderTitle}>{HERO.title}</h2>
        <p className={styles.dashboardHeaderSubtitle}>{HERO.subtitle}</p>
        <div className={styles.dashboardHeaderCtas}>
          <Link href={HERO.primaryCta.href} className={styles.dashboardPrimaryAction}>
            <span>{HERO.primaryCta.label}</span>
            <ArrowIcon aria-hidden="true" />
          </Link>
          <Link href={HERO.secondaryCta.href} className={styles.dashboardSecondaryAction}>
            <UnlimitedLearningIcon aria-hidden="true" />
            <span>{HERO.secondaryCta.label}</span>
          </Link>
        </div>
      </div>

      <div className={styles.dashboardHeaderRight}>
        <article className={styles.dashboardInsightCard} aria-live="polite">
          <span className={styles.dashboardInsightLabel}>{INSIGHT.label}</span>
          <span className={styles.dashboardInsightValue}>{INSIGHT.value}</span>
          <span className={styles.dashboardInsightMeta}>{INSIGHT.description}</span>
          <Link className={styles.dashboardInsightLink} href={INSIGHT.action.href}>
            {INSIGHT.action.label}
          </Link>
        </article>
        <div className={styles.dashboardUtilities}>
          <AppDashboardAccountMenu profile={accountProfile} />
        </div>
      </div>
    </header>
  );
}

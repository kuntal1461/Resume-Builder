import Link from 'next/link';
import { useMemo } from 'react';
import AppDashboardAccountMenu from './AppDashboardAccountMenu';
import styles from '../../styles/workspace/WorkspaceLayout.module.css';
import { ArrowIcon, SparkIcon, UnlimitedLearningIcon } from './icons';
import {
  getWorkspaceFirstName,
} from '../../lib/workspaceProfileStorage';
import { useWorkspaceProfile } from './WorkspaceProfileProvider';

const HERO = {
  greeting: 'Good afternoon',
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

const GUEST_ACCOUNT_PROFILE = {
  name: 'Guest',
  email: '',
  initials: 'GU',
};

const GREETING_PREFIX = HERO.greeting.includes(',')
  ? HERO.greeting.split(',')[0]?.trim() ?? HERO.greeting
  : HERO.greeting;

export default function AppDashboardHeader() {
  const { identity, snapshot, isLoaded } = useWorkspaceProfile();

  const accountProfile = useMemo(
    () => ({
      name: identity.name || GUEST_ACCOUNT_PROFILE.name,
      email: identity.email || GUEST_ACCOUNT_PROFILE.email,
      initials: identity.initials || GUEST_ACCOUNT_PROFILE.initials,
    }),
    [identity.email, identity.initials, identity.name]
  );

  const heroGreeting = useMemo(() => {
    if (!isLoaded) {
      return '';
    }

    const fallbackFirst = accountProfile.name.split(' ')[0] ?? accountProfile.name;
    const preferredFirstName = getWorkspaceFirstName(snapshot, fallbackFirst);
    const greetingName = snapshot ? preferredFirstName || accountProfile.name : '';
    return greetingName ? `${GREETING_PREFIX}, ${greetingName}`.trim() : GREETING_PREFIX;
  }, [accountProfile.name, isLoaded, snapshot]);

  return (
    <header className={styles.dashboardHeader} aria-label="Workspace spotlight">
      <div className={styles.dashboardHeaderLeft}>
        {isLoaded ? (
          <span className={styles.dashboardGreeting}>{heroGreeting}</span>
        ) : (
          <span
            aria-hidden="true"
            className={`${styles.dashboardGreeting} ${styles.dashboardSkeleton} ${styles.dashboardSkeletonText}`}
            style={{ width: '160px' }}
          />
        )}
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
          {isLoaded ? (
            <AppDashboardAccountMenu profile={accountProfile} />
          ) : (
            <div
              aria-hidden="true"
              className={`${styles.dashboardSkeleton} ${styles.dashboardSkeletonIcon}`}
            />
          )}
        </div>
      </div>
    </header>
  );
}

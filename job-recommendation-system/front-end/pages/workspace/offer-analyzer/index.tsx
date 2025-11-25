import Head from 'next/head';
import Link from 'next/link';
import AppShell from '../../../components/workspace/AppShell';
import { CompensationIcon, ShareBoardIcon, WorkTypeIcon } from '../../../components/workspace/icons';
import { APP_MENU_ITEMS, DEFAULT_PROFILE_TASKS } from '../../../components/workspace/navigation';
import { createGuestWorkspaceProfile } from '../../../components/workspace/profileFallback';
import { useWorkspaceShellProfile } from '../../../components/workspace/useWorkspaceShellProfile';
import styles from '../../../styles/workspace/OfferAnalyzerLanding.module.css';

const PROFILE = createGuestWorkspaceProfile({
  tagline: 'Set your target role',
  progressLabel: '5%',
});

const HERO_HIGHLIGHTS = [
  { label: 'Geography & level-adjusted bands', Icon: WorkTypeIcon },
  { label: 'Multi-offer comparison board', Icon: ShareBoardIcon },
  { label: 'Tax & cost-of-living insights', Icon: CompensationIcon },
];

const HERO_CARD_STATS = [
  { label: 'Tracked roles', value: '24 jobs' },
  { label: 'Active offers', value: '3 offers' },
  { label: 'Ready to counter', value: '1 offer' },
];

export default function OfferAnalyzerIndex() {
  const shellProfile = useWorkspaceShellProfile(PROFILE);
  return (
    <>
      <Head>
        <title>JobMatch · Offer Analyzer</title>
        <meta name="description" content="Analyze offers and benchmark salary bands." />
      </Head>
      <AppShell menuItems={APP_MENU_ITEMS} profileTasks={DEFAULT_PROFILE_TASKS} profile={shellProfile}>
        <div className={styles.page}>
          <section className={styles.offerHeroSection} aria-label="Offer Analyzer hero">
            <div className={styles.offerHeroContent}>
              <p className={styles.offerHeroEyebrow}>Negotiation co-pilot</p>
              <h1>
                Bring <span className={styles.offerHeroHighlightText}>market proof</span> into every offer conversation.
              </h1>
              <p>
                Understand if your package is competitive before you counter. Blend salary benchmarks with full compensation
                modeling so you can respond with confidence.
              </p>
              <ul className={styles.offerHeroHighlights}>
                {HERO_HIGHLIGHTS.map(({ label, Icon }) => (
                  <li key={label}>
                    <Icon className={styles.offerHeroHighlightIcon} aria-hidden="true" />
                    {label}
                  </li>
                ))}
              </ul>
            </div>
            <div className={styles.offerHeroCard} aria-live="polite">
              <div className={styles.offerHeroBadge}>Your pipeline</div>
              <p className={styles.offerHeroLead}>
                You&rsquo;re tracking {HERO_CARD_STATS[0].value} with {HERO_CARD_STATS[1].value} ready for an Offer Analyzer deep
                dive.
              </p>
              <dl className={styles.offerHeroStats}>
                {HERO_CARD_STATS.map(({ label, value }) => (
                  <div key={label}>
                    <dt>{label}</dt>
                    <dd>{value}</dd>
                  </div>
                ))}
              </dl>
            </div>
          </section>

          <section aria-label="Offer Analyzer workflows" className={styles.workflowSection}>
            <div className={styles.workflowIntro}>
              <p className={styles.workflowEyebrow}>Offer Analyzer workflows</p>
              <h2>Redesigned to guide each stage of your negotiation.</h2>
              <p>
                Start with salary calibration, then move into total compensation modeling. Each workflow feeds context back into
                your negotiation plan so nothing is missed when you counter.
              </p>
            </div>
            <div className={styles.workflowGrid}>
              <article className={`${styles.workflowCard} ${styles.workflowPrimary}`}>
                <div className={styles.workflowCardHeader}>
                  <div>
                    <span className={styles.workflowStatusPill}>Start here</span>
                    <h3>Salary Analyzer</h3>
                    <p>Benchmark market pay by role, level, and geography before reacting to a number.</p>
                  </div>
                  <div className={styles.workflowIconBadge} role="presentation">
                    <CompensationIcon aria-hidden="true" />
                  </div>
                </div>
                <ul className={styles.workflowMeta} aria-label="Salary Analyzer highlights">
                  <li>
                    <strong>24</strong>
                    <span>Markets</span>
                  </li>
                  <li>
                    <strong>7</strong>
                    <span>Career levels</span>
                  </li>
                  <li>
                    <strong>Live</strong>
                    <span>Benchmark bands</span>
                  </li>
                </ul>
                <ol className={styles.workflowSteps}>
                  <li>
                    <span>Calibrate the market</span>
                    <p>Lock level, role, and location to see low/median/high salary targets.</p>
                  </li>
                  <li>
                    <span>Plug in your offer</span>
                    <p>Compare base, bonus, and equity to understand how far you are from target bands.</p>
                  </li>
                  <li>
                    <span>Save your benchmark</span>
                    <p>Create a baseline for the Offer Package Analyzer and negotiation briefs.</p>
                  </li>
                </ol>
                <Link href="/workspace/offer-analyzer/salary" className={styles.workflowLink}>
                  Launch Salary Analyzer →
                </Link>
              </article>
              <article className={`${styles.workflowCard} ${styles.workflowSecondary}`}>
                <div className={styles.workflowCardHeader}>
                  <div>
                    <span className={styles.workflowStatusPill}>Next up</span>
                    <h3>Offer Package Analyzer</h3>
                    <p>Bring in taxes, cost-of-living, and multi-offer comparisons to prep the negotiation.</p>
                  </div>
                  <div className={styles.workflowIconBadge} role="presentation">
                    <ShareBoardIcon aria-hidden="true" />
                  </div>
                </div>
                <div className={styles.workflowTagList}>
                  <span>Tax scenarios</span>
                  <span>Cost-of-living</span>
                  <span>Multi-offer board</span>
                </div>
                <ol className={styles.workflowSteps}>
                  <li>
                    <span>Model full compensation</span>
                    <p>Blend base, bonus, equity, and benefits with region-specific taxes.</p>
                  </li>
                  <li>
                    <span>Compare multiple offers</span>
                    <p>Stack rank each package and surface leverage talking points.</p>
                  </li>
                </ol>
                <Link href="/workspace/offer-analyzer/offer" className={styles.workflowLink}>
                  Launch Offer Package Analyzer →
                </Link>
              </article>
            </div>
          </section>
        </div>
      </AppShell>
    </>
  );
}

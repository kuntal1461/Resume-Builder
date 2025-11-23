import Head from 'next/head';
import Link from 'next/link';
import AppShell from '../../../components/workspace/AppShell';
import {
  CompensationIcon,
  ShareBoardIcon,
  WorkTypeIcon,
} from '../../../components/workspace/icons';
import { APP_MENU_ITEMS, DEFAULT_PROFILE_TASKS } from '../../../components/workspace/navigation';
import { createGuestWorkspaceProfile } from '../../../components/workspace/profileFallback';
import { useWorkspaceShellProfile } from '../../../components/workspace/useWorkspaceShellProfile';
import layout from '../../../styles/workspace/WorkspaceLayout.module.css';
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
                You're tracking {HERO_CARD_STATS[0].value} with {HERO_CARD_STATS[1].value} ready for an Offer Analyzer deep dive.
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

          <section aria-label="Offer Analyzer workflows" className={styles.tools}>
            <header className={`${layout.contentHeader} ${styles.toolsHeader}`}>
              <h2>Pick a workflow to get started</h2>
              <p>Benchmark compensation or compare entire packages—both feed insights into your negotiation plan.</p>
            </header>
            <div className={`${layout.contentBody} ${styles.toolGrid}`}>
              <article className={`${layout.contentCard} ${styles.toolCard}`}>
                <h3>Salary Analyzer</h3>
                <p>Estimate fair salary range by level and geography. Compare your offer to market.</p>
                <p>
                  <Link href="/workspace/offer-analyzer/salary">Open Salary Analyzer →</Link>
                </p>
              </article>
              <article className={`${layout.contentCard} ${styles.toolCard}`}>
                <h3>Offer Package Analyzer</h3>
                <p>Analyze total comp with taxes, cost of living, and multi-offer comparisons.</p>
                <p>
                  <Link href="/workspace/offer-analyzer/offer">Open Offer Package Analyzer →</Link>
                </p>
              </article>
            </div>
          </section>
        </div>
      </AppShell>
    </>
  );
}

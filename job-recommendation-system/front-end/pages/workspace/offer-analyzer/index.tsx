import Head from 'next/head';
import Link from 'next/link';
import AppShell from '../../../components/workspace/AppShell';
import { APP_MENU_ITEMS, DEFAULT_PROFILE_TASKS } from '../../../components/workspace/navigation';
import { createGuestWorkspaceProfile } from '../../../components/workspace/profileFallback';
import { useWorkspaceShellProfile } from '../../../components/workspace/useWorkspaceShellProfile';
import layout from '../../../styles/workspace/WorkspaceLayout.module.css';
import styles from '../../../styles/workspace/OfferAnalyzerLanding.module.css';

const PROFILE = createGuestWorkspaceProfile({
  tagline: 'Set your target role',
  progressLabel: '5%',
});

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
          <section className={styles.hero} aria-label="Offer Analyzer hero">
            <div className={styles.heroContent}>
              <p className={styles.heroEyebrow}>Negotiation co-pilot</p>
              <h1>Bring market proof into every offer conversation.</h1>
              <p>
                Understand if your package is competitive before you counter. Blend salary benchmarks with full compensation
                modeling so you can respond with confidence.
              </p>
              <ul className={styles.heroHighlights}>
                <li>Geography & level-adjusted bands</li>
                <li>Multi-offer comparison board</li>
                <li>Tax & cost-of-living insights</li>
              </ul>
            </div>
            <div className={styles.heroCard} aria-live="polite">
              <div className={styles.heroBadge}>Signal preview</div>
              <p className={styles.heroCardLead}>Offer B beats market by 12% after adjusting for COL and tax.</p>
              <dl className={styles.heroCardStats}>
                <div>
                  <dt>Benchmark</dt>
                  <dd>$187K target</dd>
                </div>
                <div>
                  <dt>Net take-home</dt>
                  <dd>$134K · top 25%</dd>
                </div>
                <div>
                  <dt>Negotiation angle</dt>
                  <dd>Ask for 3% signing uplift</dd>
                </div>
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

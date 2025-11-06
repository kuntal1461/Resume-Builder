import Head from 'next/head';
import Link from 'next/link';
import AppShell from '../../../components/workspace/AppShell';
import { APP_MENU_ITEMS, DEFAULT_PROFILE_TASKS } from '../../../components/workspace/navigation';
import layout from '../../../styles/workspace/WorkspaceLayout.module.css';

const PROFILE = {
  name: 'Kuntal Maity',
  tagline: 'Set your target role',
  initials: 'KM',
  progressLabel: '5%',
};

export default function OfferAnalyzerIndex() {
  return (
    <>
      <Head>
        <title>JobMatch · Offer Analyzer</title>
        <meta name="description" content="Analyze offers and benchmark salary bands." />
      </Head>
      <AppShell menuItems={APP_MENU_ITEMS} profileTasks={DEFAULT_PROFILE_TASKS} profile={PROFILE}>
        <header className={layout.contentHeader}>
          <h1>Offer Analyzer</h1>
          <p>Make data-informed decisions. Start by benchmarking compensation or assembling a full offer package.</p>
        </header>
        <div className={layout.contentBody}>
          <article className={layout.contentCard}>
            <h2>Salary Analyzer</h2>
            <p>Estimate fair salary range by level and geography. Compare your offer to market.</p>
            <p>
              <Link href="/workspace/offer-analyzer/salary">Open Salary Analyzer →</Link>
            </p>
          </article>
          <article className={layout.contentCard}>
            <h2>Offer Package Analyzer</h2>
            <p>Analyze total comp with taxes, cost of living, and multi-offer comparisons.</p>
            <p>
              <Link href="/workspace/offer-analyzer/offer">Open Offer Package Analyzer →</Link>
            </p>
          </article>
        </div>
      </AppShell>
    </>
  );
}

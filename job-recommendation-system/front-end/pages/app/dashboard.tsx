import Head from 'next/head';
import AppShell from '../../components/app/AppShell';
import AppDashboardHeader from '../../components/app/AppDashboardHeader';
import { APP_MENU_ITEMS, DEFAULT_PROFILE_TASKS } from '../../components/app/navigation';
import styles from '../../styles/AppLayout.module.css';

export default function AppDashboardPage() {
  return (
    <>
      <Head>
        <title>JobMatch · Dashboard</title>
        <meta name="description" content="Your personalized JobMatch workspace." />
      </Head>
      <AppShell
        menuItems={APP_MENU_ITEMS}
        profileTasks={DEFAULT_PROFILE_TASKS}
        profile={{
          name: 'Kuntal Maity',
          tagline: 'Set your target role',
          initials: 'KM',
          progressLabel: '5%',
        }}
      >
        <AppDashboardHeader />
        <header className={styles.contentHeader}>
          <h1>Keep your search momentum going</h1>
          <p>
            Pick a workspace module from the left navigation to keep building momentum on your job search journey.
            We&apos;ve queued up your next best actions below.
          </p>
        </header>
        <div className={styles.contentBody}>
          <article className={styles.contentCard}>
            <h2>Confirm your target role</h2>
            <p>
              Lock in the role you want so we can surface tailored resources, outreach scripts, and curated job matches
              that align with your goals.
            </p>
          </article>
          <article className={styles.contentCard}>
            <h2>Update your experience</h2>
            <p>
              Add your recent accomplishments to unlock smarter resume suggestions and highlight the wins recruiters are
              looking for first.
            </p>
          </article>
          <article className={styles.contentCard}>
            <h2>Preview job matches</h2>
            <p>
              Review the latest recommendations, bookmark promising roles, and trigger Auto Apply for openings that
              match 80%+ of your profile.
            </p>
          </article>
        </div>
      </AppShell>
    </>
  );
}

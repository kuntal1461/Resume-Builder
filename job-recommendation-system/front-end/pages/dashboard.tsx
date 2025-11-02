import Head from 'next/head';
import Link from 'next/link';
import SiteHeader from '../components/layout/SiteHeader';
import SiteFooter from '../components/layout/SiteFooter';
import styles from '../styles/Dashboard.module.css';

export default function DashboardPage() {
  return (
    <>
      <Head>
        <title>JobMatch · Dashboard</title>
        <meta name="description" content="Your JobMatch home: resume tools and matched roles." />
      </Head>
      <SiteHeader />
      <main className={styles.container}>
        <header className={styles.welcome}>
          <div>
            <h1>Welcome back</h1>
            <p>Pick up where you left off: refine your resume or explore fresh job matches tailored to your profile.</p>
          </div>
          <div className={styles.actions}>
            <Link href="/" className={styles.primaryCta}>Build/Refine Resume</Link>
            <Link href="#jobs" className={styles.secondaryCta}>View Matches</Link>
          </div>
        </header>

        <section className={styles.grid}>
          <article className={styles.card} aria-labelledby="resume-card-title">
            <h2 id="resume-card-title">Your resume</h2>
            <p className={styles.muted}>Create a new resume or import an existing one to unlock better matches.</p>
            <div className={styles.cardActions}>
              <Link href="/" className={styles.primaryBtn}>Open builder</Link>
              <Link href="#" className={styles.linkBtn}>Import from file</Link>
            </div>
          </article>

          <article id="jobs" className={styles.card} aria-labelledby="matches-card-title">
            <h2 id="matches-card-title">Recommended roles</h2>
            <ul className={styles.jobsList}>
              <li>
                <div>
                  <strong>Product Designer</strong>
                  <span> · Aurora Labs</span>
                </div>
                <span className={styles.fitTag}>87% fit</span>
              </li>
              <li>
                <div>
                  <strong>ML Engineer</strong>
                  <span> · ShiftWave</span>
                </div>
                <span className={styles.fitTag}>92% fit</span>
              </li>
              <li>
                <div>
                  <strong>Data Analyst</strong>
                  <span> · Northwind</span>
                </div>
                <span className={styles.fitTag}>81% fit</span>
              </li>
            </ul>
            <div className={styles.cardActions}>
              <Link href="#" className={styles.linkBtn}>See all matches</Link>
            </div>
          </article>

          <article className={styles.card} aria-labelledby="activity-card-title">
            <h2 id="activity-card-title">Recent activity</h2>
            <ul className={styles.activityList}>
              <li>Resume scan completed · 2 hours ago</li>
              <li>New match: Senior UI Engineer · 6 hours ago</li>
              <li>Saved role: Data Scientist (Platform) · yesterday</li>
            </ul>
          </article>
        </section>
      </main>
      <SiteFooter />
    </>
  );
}


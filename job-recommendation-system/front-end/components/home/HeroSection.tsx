import Link from 'next/link';
import styles from '../../styles/home/Home.module.css';

export default function HeroSection() {
  return (
    <section id="top" className={styles.hero}>
      <div className={styles.heroInner}>
        <div className={styles.heroCopy}>
          <p className={styles.badge}>New · AI-matched roles in seconds</p>
          <h1>
            Build a resume, get matched, <span>love Mondays again.</span>
          </h1>
          <p className={styles.heroLead}>
            JobMatch pairs a collaborative resume editor with a recommendation engine that reads your document,
            learns your goals, and surfaces roles that fit—before they hit the job boards.
          </p>
          <div className={styles.heroActions}>
            <Link href="/auth/signup" className={styles.heroPrimary}>
              Create my free account
            </Link>
            <a href="#upload" className={styles.heroSecondary}>
              Scan my resume
            </a>
          </div>
          <ul className={styles.heroStats}>
            <li>
              <strong>2M+</strong>
              <span>resumes optimized</span>
            </li>
            <li>
              <strong>9/10</strong>
              <span>matches lead to an interview</span>
            </li>
            <li>
              <strong>3x faster</strong>
              <span>from job search to offer</span>
            </li>
          </ul>
        </div>
        <aside className={styles.heroPanel}>
          <div className={styles.heroCard}>
            <header>
              <h3>Live match radar</h3>
              <p>Updated every hour</p>
            </header>
            <ul>
              <li>
                <span className={styles.cardCompany}>Product Designer · Aurora Labs</span>
                <span className={styles.cardTag}>87% fit</span>
              </li>
              <li>
                <span className={styles.cardCompany}>ML Engineer · ShiftWave</span>
                <span className={styles.cardTag}>92% fit</span>
              </li>
              <li>
                <span className={styles.cardCompany}>Data Analyst · Northwind</span>
                <span className={styles.cardTag}>81% fit</span>
              </li>
            </ul>
            <footer>
              <p>
                “Matched by experience, skill depth, and culture fit. Tap any role to tailor your resume in one click.”
              </p>
            </footer>
          </div>
          <div className={styles.heroBadge}>
            <strong>Trusted by 4,500+ hiring teams</strong>
            <p>We partner directly with top employers to surface hidden roles.</p>
          </div>
        </aside>
      </div>
    </section>
  );
}

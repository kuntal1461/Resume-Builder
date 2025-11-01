import Link from 'next/link';
import styles from '../../styles/Home.module.css';

export default function FinalCallToAction() {
  return (
    <section className={styles.finalCta} id="resources">
      <div className={styles.finalCtaInner}>
        <h2>Ready to meet the roles made for you?</h2>
        <p>
          Join JobMatch today and unlock AI-assisted resumes, curated job matches, and direct recruiter introductions in
          minutes.
        </p>
        <div className={styles.finalCtaActions}>
          <Link href="/signup" className={styles.heroPrimary}>
            Start for free
          </Link>
          <a href="#workflow" className={styles.heroSecondary}>
            See how it works
          </a>
        </div>
      </div>
    </section>
  );
}

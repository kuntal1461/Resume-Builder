import Link from 'next/link';
import styles from '../../styles/home/Home.module.css';

interface SiteFooterProps {
  currentYear: number;
}

const FOOTER_LINK_GROUPS = [
  {
    title: 'Platform',
    links: [
      { label: 'Features', href: '#features' },
      { label: 'Pricing', href: '#pricing' },
      { label: 'AI Resume Scan', href: '#upload' },
    ],
  },
  {
    title: 'Resources',
    links: [
      { label: 'Resume templates', href: '#resources' },
      { label: 'Job search guide', href: '#resources' },
      { label: 'Interview checklist', href: '#resources' },
    ],
  },
  {
    title: 'Company',
    links: [
      { label: 'About', href: '#top' },
      { label: 'Careers', href: '#top' },
      { label: 'Contact', href: '#faq' },
    ],
  },
];

export default function SiteFooter({ currentYear }: SiteFooterProps) {
  return (
    <footer className={styles.footer}>
      <div className={styles.footerGlow} aria-hidden="true" />
      <div className={styles.footerTop}>
        <div className={styles.footerContent}>
          <div className={styles.footerLinks}>
            {FOOTER_LINK_GROUPS.map((group) => (
              <div key={group.title} className={styles.footerCol}>
                <h4>{group.title}</h4>
                <ul>
                  {group.links.map((link) => (
                    <li key={link.label}>
                      <a href={link.href}>{link.label}</a>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>

          <div className={styles.footerNewsletter}>
            <h4>Stay in the loop</h4>
            <p className={styles.footerSmall}>One concise email each month with hiring trends and workflow tips.</p>
            <form className={styles.footerForm}>
              <label htmlFor="newsletter-email" className={styles.srOnly}>
                Email address
              </label>
              <div className={styles.footerInputGroup}>
                <input id="newsletter-email" type="email" name="email" placeholder="you@email.com" />
                <button type="submit">Subscribe</button>
              </div>
            </form>
            <p className={styles.footerDisclaimer}>No spam. Unsubscribe anytime.</p>
          </div>
        </div>

      </div>

      <div className={styles.footerBottom}>
        <p>© {currentYear} JobMatch. All rights reserved.</p>
        <div className={styles.footerLegal}>
          <a href="#top">Terms</a>
          <a href="#top">Privacy</a>
          <a href="#top">Cookies</a>
          <Link href="/admin">Admin</Link>
        </div>
      </div>
    </footer>
  );
}

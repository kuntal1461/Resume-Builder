import styles from '../../styles/Home.module.css';

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

export default function SiteFooter() {
  return (
    <footer className={styles.footer}>
      <div className={styles.footerTop}>
        <div className={styles.footerBrand}>
          <div className={styles.brandMark}>JR</div>
          <div>
            <h3 className={styles.footerTitle}>JobMatch</h3>
            <p className={styles.footerLead}>
              Built by recruiters to help you uncover the roles that fit your story—and land them faster.
            </p>
          </div>
        </div>
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
        <div className={styles.footerCta}>
          <h4>Subscribe for insider hiring trends</h4>
          <form className={styles.footerForm}>
            <label htmlFor="newsletter-email" className={styles.srOnly}>
              Email address
            </label>
            <input id="newsletter-email" type="email" name="email" placeholder="you@email.com" />
            <button type="submit">Keep me posted</button>
          </form>
          <p className={styles.footerSmall}>We curate one short email per month. No spam—ever.</p>
        </div>
      </div>
      <div className={styles.footerBottom}>
        <p>© {new Date().getFullYear()} JobMatch. All rights reserved.</p>
        <div className={styles.footerLegal}>
          <a href="#top">Terms</a>
          <a href="#top">Privacy</a>
          <a href="#top">Cookies</a>
        </div>
      </div>
    </footer>
  );
}

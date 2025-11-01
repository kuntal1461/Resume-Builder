import Link from 'next/link';
import { useEffect, useState } from 'react';
import styles from '../../styles/Home.module.css';

const NAV_LINKS = [
  { href: '#features', label: 'Features' },
  { href: '#workflow', label: 'How it works' },
  { href: '#testimonials', label: 'Success stories' },
  { href: '#pricing', label: 'Plans' },
  { href: '#faq', label: 'FAQ' },
];

export default function SiteHeader() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 12);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    if (!isMobileMenuOpen) {
      return;
    }
    const handleResize = () => {
      if (window.innerWidth > 960) {
        setIsMobileMenuOpen(false);
      }
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [isMobileMenuOpen]);

  const toggleMobileMenu = () => setIsMobileMenuOpen((prev) => !prev);
  const closeMobileMenu = () => setIsMobileMenuOpen(false);

  return (
    <header className={`${styles.header} ${isScrolled ? styles.headerScrolled : ''}`}>
      <div className={styles.headerInner}>
        <Link href="/" className={styles.brand} onClick={closeMobileMenu}>
          <span className={styles.brandMark}>JR</span>
          <span className={styles.brandText}>
            Job<span>Match</span>
          </span>
        </Link>

        <nav className={styles.navDesktop} aria-label="Primary">
          {NAV_LINKS.map((link) => (
            <a key={link.href} href={link.href} className={styles.navLink}>
              {link.label}
            </a>
          ))}
        </nav>

        <div className={styles.navCtas}>
          <Link href="/signup" className={styles.secondaryCta}>
            Sign in
          </Link>
          <Link href="/signup" className={styles.primaryCta}>
            Get started
          </Link>
        </div>

        <button
          type="button"
          onClick={toggleMobileMenu}
          className={styles.mobileToggle}
          aria-expanded={isMobileMenuOpen}
          aria-controls="mobile-nav"
        >
          <span />
          <span />
          <span />
        </button>
      </div>

      <nav
        id="mobile-nav"
        className={`${styles.navMobile} ${isMobileMenuOpen ? styles.navMobileOpen : ''}`}
        aria-label="Mobile primary"
      >
        <div className={styles.navMobileLinks}>
          {NAV_LINKS.map((link) => (
            <a key={link.href} href={link.href} className={styles.navMobileLink} onClick={closeMobileMenu}>
              {link.label}
            </a>
          ))}
        </div>
        <div className={styles.navMobileCtas}>
          <Link href="/signup" className={styles.secondaryCta} onClick={closeMobileMenu}>
            Sign in
          </Link>
          <Link href="/signup" className={styles.primaryCta} onClick={closeMobileMenu}>
            Create free account
          </Link>
        </div>
      </nav>
    </header>
  );
}

import Link from 'next/link';
import { useEffect, useRef, useState } from 'react';
import styles from '../../styles/workspace/WorkspaceLayout.module.css';
import { AccountSettingsIcon, FaqIcon, LogoutIcon } from './icons';
import { useLogout } from '../../lib/hooks/useLogout';

type AccountMenuProps = {
  profile: {
    name: string;
    email: string;
    initials: string;
  };
};

export default function AppDashboardAccountMenu({ profile }: AccountMenuProps) {
  const [isOpen, setIsOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement | null>(null);
  const { logout, isLoggingOut, error, resetError } = useLogout({ redirectTo: '/' });

  useEffect(() => {
    if (!isOpen) {
      return;
    }

    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    document.addEventListener('keydown', handleEscape);

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleEscape);
    };
  }, [isOpen]);

  useEffect(() => {
    if (!isOpen) {
      resetError();
    }
  }, [isOpen, resetError]);

  const handleToggle = () => setIsOpen((prev) => !prev);

  const handleLogout = async () => {
    const success = await logout();
    if (success) {
      setIsOpen(false);
    }
  };

  return (
    <div className={styles.accountMenuWrapper} ref={menuRef}>
      <button
        type="button"
        className={styles.dashboardHeaderIconButton}
        aria-haspopup="menu"
        aria-expanded={isOpen}
        aria-controls="dashboard-account-menu"
        onClick={handleToggle}
      >
        <AccountSettingsIcon aria-hidden="true" />
      </button>

      <div
        id="dashboard-account-menu"
        role="menu"
        className={`${styles.accountMenu} ${isOpen ? styles.accountMenuOpen : ''}`}
      >
        <div className={styles.accountMenuHeader}>
          <div className={styles.accountAvatar} aria-hidden="true">
            {profile.initials}
          </div>
          <div>
            <p className={styles.accountName}>{profile.name}</p>
            <p className={styles.accountEmail}>
              {profile.email || 'Sign in to personalize your workspace'}
            </p>
          </div>
        </div>

        <nav aria-label="Account">
          <Link href="/workspace/account-settings" role="menuitem" className={styles.accountMenuLink} onClick={() => setIsOpen(false)}>
            <AccountSettingsIcon aria-hidden="true" />
            <span>Account Settings</span>
          </Link>
          <Link href="/workspace/help/faq" role="menuitem" className={styles.accountMenuLink} onClick={() => setIsOpen(false)}>
            <FaqIcon aria-hidden="true" />
            <span>FAQ</span>
          </Link>
          <button
            type="button"
            role="menuitem"
            className={styles.accountMenuLink}
            onClick={handleLogout}
            disabled={isLoggingOut}
          >
            <LogoutIcon aria-hidden="true" />
            <span>{isLoggingOut ? 'Logging out…' : 'Log Out'}</span>
          </button>
        </nav>

        {error ? <p className={styles.accountMenuError}>{error}</p> : null}
      </div>
    </div>
  );
}

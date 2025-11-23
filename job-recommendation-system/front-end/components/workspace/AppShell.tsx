import Link from 'next/link';
import { useRouter } from 'next/router';
import { useState } from 'react';
import type { ReactNode } from 'react';
import styles from '../../styles/workspace/WorkspaceLayout.module.css';
import type { AppMenuItem, AppProfileTask } from './navigation';
import { CARET_ICON } from './navigation';

type AppShellProps = {
  children: ReactNode;
  menuItems: AppMenuItem[];
  profileTasks: AppProfileTask[];
  profile: {
    name: string;
    tagline: string;
    initials: string;
    progressLabel: string;
  };
  brandHref?: string;
  brandLabel?: string;
  brandMark?: string;
};

const DEFAULT_BRAND_LABEL = 'JobMatch App';
const DEFAULT_BRAND_MARK = 'JM';

export default function AppShell({
  children,
  menuItems,
  profileTasks,
  profile,
  brandHref = '/workspace/overview',
  brandLabel = DEFAULT_BRAND_LABEL,
  brandMark = DEFAULT_BRAND_MARK,
}: AppShellProps) {
  const router = useRouter();
  const [activeMenu, setActiveMenu] = useState<string | null>(null);

  const normalizePath = (path: string) => path.split('?')[0];
  const currentPath = normalizePath(router.asPath);
  const isRouteActive = (target?: string) => (target ? normalizePath(target) === currentPath : false);
  const itemHasActiveChild = (item: AppMenuItem) =>
    item.subItems?.some((subItem) => isRouteActive(subItem.href)) ?? false;

  return (
    <div className={styles.appShell}>
      <aside className={styles.sidebar}>
        <Link href={brandHref} className={styles.brandLink} aria-label="Workspace home">
          <span className={styles.brandMark}>{brandMark}</span>
          <span>{brandLabel}</span>
        </Link>

        <section className={styles.profileCard} aria-labelledby="profile-card-title">
          <div className={styles.profileHeader}>
            <span className={styles.profileAvatar} aria-hidden="true">
              {profile.initials}
            </span>
            <div className={styles.profileMeta}>
              <span className={styles.profileName} id="profile-card-title">
                {profile.name}
              </span>
              <span className={styles.profileTagline}>{profile.tagline}</span>
            </div>
            <span className={styles.progressBadge}>{profile.progressLabel}</span>
          </div>
          <div className={styles.profileDetails} role="tooltip" aria-label="Profile completion checklist">
            <p className={styles.profilePrompt}>
              Complete your profile and get the most out of your personalized experience.
            </p>
            <ul className={styles.progressList}>
              {profileTasks.map((task) => (
                <li key={task.label}>
                  <Link href={task.href} className={styles.progressItem}>
                    <span className={styles.progressDelta}>{task.delta}</span>
                    <span className={styles.progressLabel}>{task.label}</span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </section>

        <nav
          aria-label="Primary"
          onBlur={(event) => {
            if (!event.currentTarget.contains(event.relatedTarget as Node | null)) {
              setActiveMenu(null);
            }
          }}
        >
          <ul className={styles.menu}>
            {menuItems.map((item) => {
              const hasSubmenu = Boolean(item.subItems?.length);
              const isExpanded = hasSubmenu && (activeMenu === item.label || itemHasActiveChild(item));

              const linkClasses = `${styles.menuLink} ${
                isRouteActive(item.href) || itemHasActiveChild(item) ? styles.menuLinkActive : ''
              }`;
              const commonLinkProps = {
                className: linkClasses,
                'aria-haspopup': hasSubmenu ? true : undefined,
                'aria-expanded': hasSubmenu ? isExpanded : undefined,
                onFocus: () => (hasSubmenu ? setActiveMenu(item.label) : undefined),
              };
              const linkContent = (
                <>
                  {item.icon ? <span className={styles.menuIcon}>{item.icon}</span> : null}
                  <span>{item.label}</span>
                  {(item.badge || hasSubmenu) && (
                    <span className={styles.menuMeta}>
                      {item.badge ? <span className={styles.menuBadge}>{item.badge}</span> : null}
                      {hasSubmenu ? CARET_ICON : null}
                    </span>
                  )}
                </>
              );

              return (
                <li
                  key={item.label}
                  className={`${styles.menuItem} ${hasSubmenu ? styles.menuItemHasSubmenu : ''}`}
                  onMouseEnter={() => (hasSubmenu ? setActiveMenu(item.label) : undefined)}
                  onMouseLeave={() => (hasSubmenu ? setActiveMenu(null) : undefined)}
                >
                  {item.href ? (
                    <Link href={item.href} {...commonLinkProps}>
                      {linkContent}
                    </Link>
                  ) : (
                    <span
                      {...commonLinkProps}
                      role={hasSubmenu ? 'button' : 'text'}
                      tabIndex={hasSubmenu ? 0 : -1}
                    >
                      {linkContent}
                    </span>
                  )}
                  {hasSubmenu ? (
                    <ul className={`${styles.submenu} ${isExpanded ? styles.submenuOpen : ''}`}>
                      {item.subItems?.map((subItem) => (
                        <li key={subItem.label} className={styles.menuItem}>
                          {subItem.href ? (
                            <Link
                              href={subItem.href}
                              className={`${styles.menuLink} ${
                                isRouteActive(subItem.href) ? styles.menuLinkActive : ''
                              }`}
                              onFocus={() => setActiveMenu(item.label)}
                            >
                              <span>{subItem.label}</span>
                            </Link>
                          ) : (
                            <span className={styles.menuLink} role="text">
                              <span>{subItem.label}</span>
                            </span>
                          )}
                        </li>
                      ))}
                    </ul>
                  ) : null}
                </li>
              );
            })}
          </ul>
        </nav>
      </aside>

      <section className={styles.appContent}>{children}</section>
    </div>
  );
}

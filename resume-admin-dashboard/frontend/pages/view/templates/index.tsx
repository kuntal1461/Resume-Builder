import Head from 'next/head';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { type SidebarProfile } from '../../../lib/sidebarProfile';
import { useSidebarProfile } from '../../../lib/useSidebarProfile';
import styles from '../../../styles/admin/AdminView.module.css';

const TEMPLATE_ACTIONS = [
  {
    title: 'Launch a new template',
    description: 'Clone a proven layout, customize sections, and ship to hiring pods.',
    cta: 'Create template',
    href: '/view/templates/latex-upload',
  },
  {
    title: 'Review pending updates',
    description: 'Approve legal copy changes or reassign owners before publish.',
    cta: 'Open queue',
    href: '/view/templates/queue',
  },
  {
    title: 'Review saved templates',
    description: 'Jump into the templates you have drafted or archived and pick up right where you left off.',
    cta: 'Open saved space',
    href: '/view/templates/saved',
  },
];

const DEFAULT_SIDEBAR_PROFILE: SidebarProfile = {
  name: 'Admin User',
  initials: 'AU',
  tagline: 'Template Operations',
  email: 'admin@example.com',
};

const NAV_LINKS = [
  { label: 'Workspace overview', href: '/view', active: false },
  { label: 'Templates', href: '/view/templates', active: true },
  { label: 'Job tracker', href: '/workspace/job-tracker', active: false },
  { label: 'Interview prep', href: '/workspace/interview-prep', active: false },
];

export default function AdminTemplatesPage() {
  const sidebarProfile = useSidebarProfile(DEFAULT_SIDEBAR_PROFILE);
  const router = useRouter();

  return (
    <>
      <Head>
        <title>JobMatch · Admin Templates</title>
        <meta name="description" content="Oversee resume templates, approvals, and scoring automations for JobMatch." />
      </Head>
      <main className={styles.workspaceShell}>
        <div className={styles.workspaceLayout}>
          <aside className={styles.workspaceSidebar}>
            <Link href="/workspace/overview" className={styles.sidebarBrandLink} aria-label="Workspace home">
              <span className={styles.sidebarBrandMark}>JM</span>
              <span>JobMatch App</span>
            </Link>

            <section className={styles.sidebarProfileCard} aria-labelledby="profile-card-title">
              <div className={styles.sidebarProfileHeader}>
                <span className={styles.sidebarProfileAvatar} aria-hidden="true">
                  {sidebarProfile.initials}
                </span>
                <div className={styles.sidebarProfileMeta}>
                  <span className={styles.sidebarProfileName} id="profile-card-title">
                    {sidebarProfile.name}
                  </span>
                  <span className={styles.sidebarProfileTagline}>{sidebarProfile.tagline}</span>
                  <span className={styles.sidebarProfileEmail}>{sidebarProfile.email}</span>
                </div>
              </div>
            </section>

            <nav aria-label="Workspace">
              <ul className={styles.sidebarMenu}>
                {NAV_LINKS.map((link) => (
                  <li key={link.label} className={styles.sidebarMenuItem}>
                    <Link
                      href={link.href}
                      className={`${styles.sidebarMenuLink} ${link.active ? styles.sidebarMenuLinkActive : ''}`}
                    >
                      <span>{link.label}</span>
                    </Link>
                  </li>
                ))}
              </ul>
            </nav>
          </aside>

          <div className={styles.workspaceMain}>
            <section className={styles.dashboardHeader}>
              <div>
                <p className={styles.dashboardGreeting}>Templates command center</p>
                <h1>Ship polished resume templates faster</h1>
                <p>
                  Review ownership, approvals, and scoring signals in one place. Align every template drop with the
                  workspace overview experience.
                </p>
                <div className={styles.headerActions}>
                  <Link href="/view/templates/latex-upload" className={styles.primaryActionButton}>
                    New template
                  </Link>
                  <button type="button" className={styles.secondaryActionButton}>
                    Manage library
                  </button>
                </div>
              </div>
            </section>

            <section className={styles.sectionIntro}>
              <h2>Template playbooks</h2>
              <p>Mirror the workspace overview tone so admin tooling feels familiar to reviewers.</p>
            </section>

            <div className={styles.cardGrid}>
              {TEMPLATE_ACTIONS.map((action) => (
                <article key={action.title} className={styles.contentCard}>
                  <h3>{action.title}</h3>
                  <p>{action.description}</p>
                  <button
                    type="button"
                    className={styles.primaryActionButton}
                    onClick={() => {
                      if (action.href) {
                        void router.push(action.href);
                      }
                    }}
                  >
                    {action.cta}
                  </button>
                </article>
              ))}
            </div>

          </div>
        </div>
      </main>
    </>
  );
}

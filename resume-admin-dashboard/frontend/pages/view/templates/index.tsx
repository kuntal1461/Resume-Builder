import Head from 'next/head';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import { resolveSidebarProfile, type SidebarProfile } from '../../../lib/sidebarProfile';
import styles from '../../../styles/admin/AdminView.module.css';

const TEMPLATE_STATUS = [
  { name: 'Engineering Manager Kit', owner: 'Ops pod · NYC', status: 'Live', updated: '2 hours ago' },
  { name: 'Enterprise AE Pack', owner: 'Sales pod · Remote', status: 'Pending review', updated: 'Yesterday' },
  { name: 'AI Researcher Sprint', owner: 'Innovation pod · SF', status: 'Draft', updated: '3 days ago' },
];

const TEMPLATE_ACTIONS = [
  { title: 'Launch a new template', description: 'Clone a proven layout, customize sections, and ship to hiring pods.', cta: 'Create template' },
  { title: 'Review pending updates', description: 'Approve legal copy changes or reassign owners before publish.', cta: 'Open queue' },
  { title: 'Sync AI scoring', description: 'Map rubric tags so LLM scoring stays aligned with resume variants.', cta: 'Manage scoring' },
];

const DEFAULT_SIDEBAR_PROFILE: SidebarProfile = {
  name: 'Aditi Rao',
  initials: 'AR',
  tagline: 'Template Operations',
  email: 'aditi@jobmatch.io',
};

const NAV_LINKS = [
  { label: 'Workspace overview', href: '/view', active: false },
  { label: 'Templates', href: '/view/templates', active: true },
  { label: 'Job tracker', href: '/workspace/job-tracker', active: false },
  { label: 'Interview prep', href: '/workspace/interview-prep', active: false },
];

export default function AdminTemplatesPage() {
  const [sidebarProfile, setSidebarProfile] = useState<SidebarProfile>(DEFAULT_SIDEBAR_PROFILE);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setSidebarProfile(resolveSidebarProfile(DEFAULT_SIDEBAR_PROFILE));
  }, []);

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
                  <button type="button" className={styles.primaryActionButton}>
                    New template
                  </button>
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
                  <button type="button" className={styles.primaryActionButton}>
                    {action.cta}
                  </button>
                </article>
              ))}
            </div>

            <section className={styles.sectionIntro}>
              <h2>Recently touched templates</h2>
              <p>Track ownership, latest updates, and publishing status at a glance.</p>
            </section>

            <div className={styles.summaryGrid}>
              {TEMPLATE_STATUS.map((template) => (
                <article key={template.name} className={styles.summaryCard}>
                  <div>
                    <strong>{template.name}</strong>
                    <p>{template.owner}</p>
                    <p>Status: {template.status} · Updated {template.updated}</p>
                  </div>
                  <button type="button">Open</button>
                </article>
              ))}
            </div>
          </div>
        </div>
      </main>
    </>
  );
}

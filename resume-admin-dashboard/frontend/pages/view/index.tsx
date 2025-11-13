import Head from 'next/head';
import Link from 'next/link';
import styles from '../../styles/admin/AdminView.module.css';

const QUICK_ACTIONS = [
  { title: 'Resume templates', description: 'Curate and publish templates for hiring pods.', href: '#' },
  { title: 'Team permissions', description: 'Grant or revoke reviewer access in seconds.', href: '#' },
  { title: 'Job pipelines', description: 'Monitor candidate progress across roles.', href: '#' },
];

const HEALTH_METRICS = [
  { label: 'Templates live', value: '18' },
  { label: 'Admins online', value: '6' },
  { label: 'Pending approvals', value: '4' },
];

const PIPELINE_SUMMARY = [
  { title: 'LLM scoring', detail: 'Reconnect LangChain scoring for template v2.', action: 'Reconnect' },
  { title: 'Audit exports', detail: 'Generate CSVs for leadership reviews.', action: 'Export' },
];

const ADMIN_PROFILE = {
  name: 'Aditi Rao',
  role: 'Lead Admin',
  email: 'aditi@jobmatch.io',
};

const NAV_LINKS = [
  { label: 'Workspace overview', href: '/view', active: true },
  { label: 'Templates', href: '/view/templates', badge: 'New' },
  { label: 'Job tracker', href: '/workspace/job-tracker' },
  { label: 'Interview prep', href: '/workspace/interview-prep' },
];

export default function AdminViewPage() {
  return (
    <>
      <Head>
        <title>JobMatch · Admin Dashboard</title>
        <meta
          name="description"
          content="Central admin workspace for reviewing resume templates, workspace permissions, and recruiting automations."
        />
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
                  {ADMIN_PROFILE.name
                    .split(' ')
                    .map((part) => part[0])
                    .join('')}
                </span>
                <div className={styles.sidebarProfileMeta}>
                  <span className={styles.sidebarProfileName} id="profile-card-title">
                    {ADMIN_PROFILE.name}
                  </span>
                  <span className={styles.sidebarProfileTagline}>{ADMIN_PROFILE.role}</span>
                  <span className={styles.sidebarProfileEmail}>{ADMIN_PROFILE.email}</span>
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
                      {link.badge ? <span className={styles.sidebarMenuBadge}>{link.badge}</span> : null}
                    </Link>
                  </li>
                ))}
              </ul>
            </nav>
          </aside>

          <div className={styles.workspaceMain}>
            <section className={styles.dashboardHeader}>
              <div>
                <p className={styles.dashboardGreeting}>Admin workspace</p>
                <h1>Keep your review queue in flow</h1>
                <p>
                  Monitor template approvals, confirm access changes, and stay aligned with recruiting pods. These
                  insights mirror the workspace overview experience for admins.
                </p>
                <div className={styles.headerActions}>
                  <button type="button" className={styles.primaryActionButton}>
                    Publish template
                  </button>
                  <button type="button" className={styles.secondaryActionButton}>
                    View audit log
                  </button>
                </div>
              </div>
              <div className={styles.dashboardMetrics}>
                {HEALTH_METRICS.map((metric) => (
                  <article key={metric.label}>
                    <span>{metric.label}</span>
                    <strong>{metric.value}</strong>
                  </article>
                ))}
              </div>
            </section>

            <section className={styles.sectionIntro}>
              <h2>Recommended admin actions</h2>
              <p>Pick an action to keep the hiring pods aligned with workspace standards.</p>
            </section>

            <div className={styles.cardGrid}>
              {QUICK_ACTIONS.map((action) => (
                <article key={action.title} className={styles.contentCard}>
                  <h3>{action.title}</h3>
                  <p>{action.description}</p>
                  <Link href={action.href}>Open workspace</Link>
                </article>
              ))}
            </div>

            <section className={styles.sectionIntro}>
              <h2>Pipeline summary</h2>
              <p>These modules match the overview dashboard, so admins stay in sync with talent ops.</p>
            </section>

            <div className={styles.summaryGrid}>
              {PIPELINE_SUMMARY.map((item) => (
                <article key={item.title} className={styles.summaryCard}>
                  <div>
                    <strong>{item.title}</strong>
                    <p>{item.detail}</p>
                  </div>
                  <button type="button">{item.action}</button>
                </article>
              ))}
            </div>
          </div>
        </div>
      </main>
    </>
  );
}

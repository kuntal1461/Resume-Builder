import Head from 'next/head';
import Link from 'next/link';
import type { NextRouter } from 'next/router';
import { useRouter } from 'next/router';
import { useEffect, useMemo, useState } from 'react';
import { type SidebarProfile } from '../../../lib/sidebarProfile';
import { useSidebarProfile } from '../../../lib/useSidebarProfile';
import styles from '../../../styles/admin/AdminView.module.css';

type TemplateRecord = {
  id: number;
  title: string;
  owner_email: string | null;
  owner_name: string | null;
  status_code: number;
  status_label: string;
  last_update_time: string | null;
  preview_image_url: string | null;
};

type TemplateListResponse = {
  success: boolean;
  templates: TemplateRecord[];
};

const STATUS_TABS = [
  { label: 'Published', value: 'published', description: 'Live to pods' },
  { label: 'Archive', value: 'archive', description: 'Parked for later' },
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

export default function SavedTemplatesPage() {
  const sidebarProfile = useSidebarProfile(DEFAULT_SIDEBAR_PROFILE);
  const router = useRouter();
  const [statusFilter, setStatusFilter] = useState<(typeof STATUS_TABS)[number]['value']>('published');
  const [templates, setTemplates] = useState<TemplateRecord[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [lastRefreshed, setLastRefreshed] = useState<Date | null>(null);

  useEffect(() => {
    let isMounted = true;
    const controller = new AbortController();

    async function loadTemplates() {
      setIsLoading(true);
      setError(null);
      try {
        const basePath = process.env.NEXT_PUBLIC_BASE_PATH ?? '';
        const response = await fetch(`${basePath}/api/templates?status=${statusFilter}`, {
          headers: { Accept: 'application/json' },
          signal: controller.signal,
        });
        if (!response.ok) {
          const reason = await response.text();
          throw new Error(`Unable to load ${statusFilter} templates (status ${response.status}): ${reason || 'unknown error'}`);
        }
        const data = (await response.json()) as TemplateListResponse | { error?: string };
        if (!('templates' in data)) {
          const message = 'error' in data && data.error ? data.error : 'Unexpected response while loading templates.';
          throw new Error(message);
        }
        if (isMounted) {
          setTemplates(data.templates);
          setLastRefreshed(new Date());
        }
      } catch (loadError) {
        if (!isMounted) return;
        if (loadError instanceof DOMException && loadError.name === 'AbortError') {
          return;
        }
        const message = loadError instanceof Error ? loadError.message : 'Unable to load templates.';
        setError(message);
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    }

    void loadTemplates();
    return () => {
      isMounted = false;
      controller.abort();
    };
  }, [statusFilter]);

  const metrics = useMemo(() => {
    const total = templates.length;
    const synced = templates.filter((template) => Boolean(template.last_update_time)).length;
    const ownerSet = new Set(
      templates
        .map((template) => template.owner_email?.toLowerCase() || template.owner_name?.toLowerCase() || '')
        .filter(Boolean),
    );
    return { total, synced, owners: ownerSet.size };
  }, [templates]);

  const statusLabel = STATUS_TABS.find((tab) => tab.value === statusFilter)?.label ?? 'Drafts';

  return (
    <>
      <Head>
        <title>JobMatch · Saved Templates</title>
        <meta name="description" content="Review published and archived resume templates that live outside the draft queue." />
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
            <section className={styles.savedTemplatesHero}>
              <div>
                <p className={styles.dashboardGreeting}>Published & archive hub</p>
                <h1>Keep live and parked templates in sync</h1>
                <p>
                  This space focuses on templates already live to pods or intentionally archived. Review ownership,
                  gather approvals, or recycle layouts into new drafts without sifting through the draft queue.
                </p>
                <div className={styles.savedTemplatesHeroActions}>
                  <Link href="/view/templates/latex-upload" className={styles.primaryActionButton}>
                    Create another template
                  </Link>
                  <Link href="/view/templates/queue" className={styles.secondaryActionButton}>
                    View review queue
                  </Link>
                </div>
                <span className={styles.savedTemplatesRefresh}>
                  {lastRefreshed ? `Last refreshed ${lastRefreshed.toLocaleTimeString()}` : 'Loading activity…'}
                </span>
              </div>
              <div className={styles.savedTemplatesMetrics}>
                <article>
                  <span>Total {statusLabel.toLowerCase()}</span>
                  <strong>{metrics.total}</strong>
                </article>
                <article>
                  <span>Synced with updates</span>
                  <strong>{metrics.synced}</strong>
                </article>
                <article>
                  <span>Unique owners</span>
                  <strong>{metrics.owners}</strong>
                </article>
              </div>
            </section>

            <section className={styles.savedTemplatesPanel} aria-live="polite">
              <header className={styles.savedTemplatesPanelHeader}>
                <div>
                  <p className={styles.queuePanelEyebrow}>Filtered view</p>
                  <h2>{statusLabel} templates</h2>
                  <p>Switch statuses to review published resumes or revisit archived work.</p>
                </div>
                <div className={styles.savedTemplatesFilters} role="tablist" aria-label="Template status filter">
                  {STATUS_TABS.map((tab) => {
                    const isActive = tab.value === statusFilter;
                    return (
                      <button
                        key={tab.value}
                        type="button"
                        role="tab"
                        aria-selected={isActive}
                        className={`${styles.savedTemplatesFilterButton} ${isActive ? styles.savedTemplatesFilterButtonActive : ''}`}
                        onClick={() => setStatusFilter(tab.value)}
                      >
                        <strong>{tab.label}</strong>
                        <span>{tab.description}</span>
                      </button>
                    );
                  })}
                </div>
              </header>

              {isLoading ? (
                <div className={styles.savedTemplatesEmpty}>Crunching template activity…</div>
              ) : error ? (
                <div className={styles.savedTemplatesError} role="alert">
                  {error}
                </div>
              ) : templates.length === 0 ? (
                <div className={styles.savedTemplatesEmpty}>
                  <p>No templates in this status yet.</p>
                  <p>Try switching the filter or creating a new template to see it appear here.</p>
                </div>
              ) : (
                <div className={styles.savedTemplatesGrid}>
                  {templates.map((template) => (
                    <article key={template.id} className={styles.savedTemplateCard}>
                      <div className={styles.savedTemplateCardHeader}>
                        <div>
                          <p className={styles.savedTemplateCardEyebrow}>Template #{template.id}</p>
                          <h3>{template.title}</h3>
                        </div>
                        <span className={styles.savedTemplateStatus}>{template.status_label}</span>
                      </div>
                      <div className={styles.savedTemplateMeta}>
                        <div>
                          <span>Owner</span>
                          <strong>{template.owner_name || template.owner_email || 'Unassigned'}</strong>
                        </div>
                        <div>
                          <span>Last update</span>
                          <strong>{formatRelativeUpdatedAt(template.last_update_time)}</strong>
                        </div>
                      </div>
                      {template.preview_image_url ? (
                        <div className={styles.savedTemplatePreview}>
                          {/* eslint-disable-next-line @next/next/no-img-element */}
                          <img src={template.preview_image_url} alt={`Preview for ${template.title}`} loading="lazy" />
                        </div>
                      ) : null}
                      <div className={styles.savedTemplateActions}>
                        <button type="button" onClick={() => handleOpenTemplate(template.id, router)}>
                          Continue editing
                        </button>
                        <button type="button" className={styles.savedTemplateGhostButton}>
                          Share preview
                        </button>
                      </div>
                    </article>
                  ))}
                </div>
              )}
            </section>
          </div>
        </div>
      </main>
    </>
  );
}

function formatRelativeUpdatedAt(updatedAt: string | null): string {
  if (!updatedAt) return 'No updates yet';
  const date = new Date(updatedAt);
  if (Number.isNaN(date.getTime())) return 'No updates yet';
  const diffMs = Date.now() - date.getTime();
  const minute = 60 * 1000;
  const hour = 60 * minute;
  const day = 24 * hour;

  if (diffMs < minute) return 'Updated just now';
  if (diffMs < hour) {
    const minutes = Math.round(diffMs / minute);
    return `Updated ${minutes}m ago`;
  }
  if (diffMs < day) {
    const hours = Math.round(diffMs / hour);
    return `Updated ${hours}h ago`;
  }
  const days = Math.round(diffMs / day);
  return `Updated ${days}d ago`;
}

function handleOpenTemplate(templateId: number, router: NextRouter): void {
  void router.push({
    pathname: '/view/templates/latex-upload',
    query: { templateId },
  });
}

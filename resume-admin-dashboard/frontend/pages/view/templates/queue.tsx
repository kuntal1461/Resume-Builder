import Head from 'next/head';
import Link from 'next/link';
import type { NextRouter } from 'next/router';
import { useRouter } from 'next/router';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { type SidebarProfile } from '../../../lib/sidebarProfile';
import { useSidebarProfile } from '../../../lib/useSidebarProfile';
import styles from '../../../styles/admin/AdminView.module.css';

type DraftTemplateRecord = {
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
  templates: DraftTemplateRecord[];
};

type TemplateVersionRecord = {
  id: number;
  version_no: number;
  version_label: string | null;
  last_update_time: string | null;
};

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

const QUEUE_FILTERS = [
  { label: 'All drafts', value: 'all', description: 'Everything waiting in queue' },
  { label: 'Recently updated', value: 'recent', description: '< 24h' },
  { label: 'Stale', value: 'stale', description: 'No update in 72h' },
  { label: 'Needs owner', value: 'needs_owner', description: 'Unassigned' },
];

export default function DraftQueuePage() {
  const sidebarProfile = useSidebarProfile(DEFAULT_SIDEBAR_PROFILE);
  const router = useRouter();
  const [drafts, setDrafts] = useState<DraftTemplateRecord[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [copiedTemplateId, setCopiedTemplateId] = useState<number | null>(null);
  const [copyResetTimeout, setCopyResetTimeout] = useState<NodeJS.Timeout | null>(null);
  const [lastRefreshed, setLastRefreshed] = useState<Date | null>(null);
  const [activeFilter, setActiveFilter] = useState<(typeof QUEUE_FILTERS)[number]['value']>('all');
  const [versionOptions, setVersionOptions] = useState<Record<number, TemplateVersionRecord[]>>({});
  const [versionLoading, setVersionLoading] = useState<Record<number, boolean>>({});
  const [versionErrors, setVersionErrors] = useState<Record<number, string | null>>({});
  const [selectedVersions, setSelectedVersions] = useState<Record<number, number | null>>({});

  useEffect(() => {
    let isMounted = true;
    const loadDrafts = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const basePath = process.env.NEXT_PUBLIC_BASE_PATH ?? '';
        const response = await fetch(`${basePath}/api/templates?status=draft`, {
          headers: { Accept: 'application/json' },
        });
        if (!response.ok) {
          const reason = await response.text();
          throw new Error(
            `Unable to load draft templates (status ${response.status}): ${reason || 'unknown error'}`,
          );
        }
        const data = (await response.json()) as TemplateListResponse | { error?: string };
        if (!('templates' in data)) {
          const message = 'error' in data && data.error ? data.error : 'Unexpected response while loading templates.';
          throw new Error(message);
        }
        if (isMounted) {
          setDrafts(data.templates);
          setLastRefreshed(new Date());
        }
      } catch (loadError) {
        if (isMounted) {
          const message = loadError instanceof Error ? loadError.message : 'Unable to load draft templates.';
          setError(message);
        }
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    };

    void loadDrafts();
    return () => {
      isMounted = false;
    };
  }, []);

  useEffect(() => {
    return () => {
      if (copyResetTimeout) {
        clearTimeout(copyResetTimeout);
      }
    };
  }, [copyResetTimeout]);

  const metrics = useMemo(() => {
    const totalDrafts = drafts.length;
    const updatedRecently = drafts.filter((draft) => wasUpdatedWithinHours(draft.last_update_time, 24)).length;
    const staleDrafts = drafts.filter((draft) => !wasUpdatedWithinHours(draft.last_update_time, 72)).length;
    const assignedOwners = new Set(
      drafts
        .map((draft) => draft.owner_email?.toLowerCase() || draft.owner_name?.toLowerCase() || '')
        .filter(Boolean),
    ).size;
    const unassignedDrafts = drafts.filter((draft) => !draft.owner_email && !draft.owner_name).length;
    return { totalDrafts, updatedRecently, staleDrafts, assignedOwners, unassignedDrafts };
  }, [drafts]);

  const filteredDrafts = useMemo(() => {
    switch (activeFilter) {
      case 'recent':
        return drafts.filter((draft) => wasUpdatedWithinHours(draft.last_update_time, 24));
      case 'stale':
        return drafts.filter((draft) => !wasUpdatedWithinHours(draft.last_update_time, 72));
      case 'needs_owner':
        return drafts.filter((draft) => !draft.owner_email && !draft.owner_name);
      default:
        return drafts;
    }
  }, [activeFilter, drafts]);

  const ensureVersionOptions = useCallback(
    async (templateId: number) => {
      if (versionOptions[templateId] || versionLoading[templateId]) {
        return;
      }
      setVersionLoading((prev) => ({ ...prev, [templateId]: true }));
      setVersionErrors((prev) => ({ ...prev, [templateId]: null }));
      try {
        const basePath = process.env.NEXT_PUBLIC_BASE_PATH ?? '';
        const response = await fetch(`${basePath}/api/templates/${templateId}/versions`, {
          headers: { Accept: 'application/json' },
        });
        if (!response.ok) {
          const reason = await response.text();
          throw new Error(
            `Unable to load versions (status ${response.status}): ${reason || 'unknown error'}`,
          );
        }
        const data = (await response.json()) as { success?: boolean; versions?: TemplateVersionRecord[]; error?: string };
        if (!data || !Array.isArray(data.versions)) {
          const message = data?.error || 'Unexpected version response.';
          throw new Error(message);
        }
        setVersionOptions((prev) => ({ ...prev, [templateId]: data.versions ?? [] }));
        setSelectedVersions((prev) => ({
          ...prev,
          [templateId]: data.versions && data.versions.length ? data.versions[0].id : null,
        }));
      } catch (fetchError) {
        const message = fetchError instanceof Error ? fetchError.message : 'Unable to load versions.';
        setVersionErrors((prev) => ({ ...prev, [templateId]: message }));
      } finally {
        setVersionLoading((prev) => ({ ...prev, [templateId]: false }));
      }
    },
    [versionLoading, versionOptions],
  );

  const handleVersionChange = useCallback((templateId: number, versionId: number) => {
    setSelectedVersions((prev) => ({
      ...prev,
      [templateId]: Number.isFinite(versionId) ? versionId : null,
    }));
  }, []);

  const queueListContent = useMemo(() => {
    if (isLoading) {
      return <div className={styles.queueEmptyState}>Loading draft templates…</div>;
    }

    if (error) {
      return (
        <div className={styles.queueEmptyState} role="alert">
          {error}
        </div>
      );
    }

    if (drafts.length === 0) {
      return (
        <div className={styles.queueEmptyState}>
          <p>No draft templates are waiting for review.</p>
          <p>
            Try publishing a template or check back after contributors upload LaTeX sources in the builder
            workflow.
          </p>
        </div>
      );
    }

    if (filteredDrafts.length === 0) {
      const filterLabel = QUEUE_FILTERS.find((chip) => chip.value === activeFilter)?.label || 'selected';
      return (
        <div className={styles.queueEmptyState}>
          <p>No drafts match the {filterLabel.toLowerCase()} filter yet.</p>
          <p>Try another filter or clear it to see the entire queue.</p>
        </div>
      );
    }

    return (
      <div className={styles.savedTemplatesGrid} aria-live="polite">
        {filteredDrafts.map((draft) => {
          const ownerName = draft.owner_name?.trim() || null;
          const ownerEmail = draft.owner_email?.trim() || null;
          const ownerDisplay = ownerName || ownerEmail || 'Unassigned owner';
          const ownerSecondary = ownerName && ownerEmail ? ownerEmail : null;
          const statusText = draft.status_label || 'Draft';
          const relativeUpdatedAt = formatRelativeUpdatedAt(draft.last_update_time);
          const absoluteUpdatedAt = formatAbsoluteTimestamp(draft.last_update_time);
          const versions = versionOptions[draft.id];
          const isVersionLoading = Boolean(versionLoading[draft.id]);
          const versionError = versionErrors[draft.id] || null;
          const computedVersionValue =
            selectedVersions[draft.id] ?? (versions && versions.length ? versions[0].id : null);
          const versionSelectValue = computedVersionValue ? String(computedVersionValue) : '';
          const versionSelectId = `template-${draft.id}-version`;

          return (
            <article key={draft.id} className={`${styles.savedTemplateCard} ${styles.queueCardCompact}`}>
              <div className={styles.savedTemplateCardHeader}>
                <div>
                  <p className={styles.savedTemplateCardEyebrow}>Template #{draft.id}</p>
                  <h3>{draft.title}</h3>
                </div>
                <span className={styles.savedTemplateStatus}>{statusText}</span>
              </div>

              <div className={styles.savedTemplateMeta}>
                <div>
                  <span>Owner</span>
                  <strong>{ownerDisplay}</strong>
                  {ownerSecondary ? <small>{ownerSecondary}</small> : null}
                </div>
                <div>
                  <span>Status</span>
                  <strong>{statusText}</strong>
                </div>
                <div>
                  <span>Last touch</span>
                  <strong>{relativeUpdatedAt}</strong>
                  <small className={styles.queueCardTimestampModern}>{absoluteUpdatedAt}</small>
                </div>
              </div>

              <div className={styles.savedTemplateVersionPicker}>
                <label htmlFor={versionSelectId}>Version</label>
                <select
                  id={versionSelectId}
                  value={versionSelectValue}
                  onFocus={() => {
                    void ensureVersionOptions(draft.id);
                  }}
                  onMouseEnter={() => {
                    void ensureVersionOptions(draft.id);
                  }}
                  onChange={(event) => {
                    const value = Number(event.target.value);
                    handleVersionChange(draft.id, Number.isNaN(value) ? 0 : value);
                  }}
                  disabled={isVersionLoading || (versions !== undefined && versions.length === 0)}
                >
                  {isVersionLoading ? (
                    <option value="">Loading versions…</option>
                  ) : versions === undefined ? (
                    <option value="">Select to load versions</option>
                  ) : versions.length ? (
                    versions.map((version) => (
                      <option key={version.id} value={version.id}>
                        {version.version_label || `Version ${version.version_no}`}
                      </option>
                    ))
                  ) : (
                    <option value="">No versions found</option>
                  )}
                </select>
                <span className={styles.savedTemplateVersionStatus}>
                  {isVersionLoading
                    ? 'Syncing history…'
                    : versions === undefined
                      ? 'Focus to load history'
                      : versions.length
                        ? `${versions.length} version${versions.length > 1 ? 's' : ''}`
                        : 'No history'}
                </span>
              </div>
              {versionError ? (
                <p className={styles.savedTemplateVersionError} role="alert">
                  {versionError}
                </p>
              ) : null}

              {draft.preview_image_url ? (
                <div className={styles.savedTemplatePreview}>
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={draft.preview_image_url} alt={`Preview for ${draft.title}`} loading="lazy" />
                </div>
              ) : null}

              <div className={styles.savedTemplateActions}>
                <button type="button" onClick={() => handleReviewDraft(draft.id, router)}>
                  Review draft
                </button>
                <button
                  type="button"
                  className={`${styles.savedTemplateGhostButton} ${
                    copiedTemplateId === draft.id ? styles.queueGhostButtonCopied : ''
                  }`}
                  onClick={async () => {
                    const copied = await handleCopyTemplateId(draft.id);
                    if (copied) {
                      setCopiedTemplateId(draft.id);
                      if (copyResetTimeout) {
                        clearTimeout(copyResetTimeout);
                      }
                      const timeout = setTimeout(() => {
                        setCopiedTemplateId(null);
                        setCopyResetTimeout(null);
                      }, 1500);
                      setCopyResetTimeout(timeout);
                    }
                  }}
                >
                  {copiedTemplateId === draft.id ? 'Copied!' : 'Copy template ID'}
                </button>
              </div>
            </article>
          );
        })}
      </div>
    );
  }, [
    activeFilter,
    copyResetTimeout,
    copiedTemplateId,
    drafts,
    error,
    filteredDrafts,
    ensureVersionOptions,
    handleVersionChange,
    isLoading,
    router,
    selectedVersions,
    versionErrors,
    versionLoading,
    versionOptions,
  ]);

  return (
    <>
      <Head>
        <title>JobMatch · Draft Resume Queue</title>
        <meta name="description" content="Track draft resume templates, blockers, and reviewer assignments." />
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
                <p className={styles.dashboardGreeting}>Draft queue</p>
                <h1>Keep review-ready drafts moving</h1>
                <p>
                  This queue mirrors the workspace overview and surfaces the same signals reviewers already trust. Share
                  it with hiring pods to keep drafts moving toward publish.
                </p>
                <div className={styles.savedTemplatesHeroActions}>
                  <Link href="/view/templates/latex-upload" className={styles.primaryActionButton}>
                    Publish new template
                  </Link>
                  <Link href="/view/templates" className={styles.secondaryActionButton}>
                    Back to templates
                  </Link>
                </div>
                <span className={styles.savedTemplatesRefresh}>
                  {lastRefreshed
                    ? `Last refreshed ${lastRefreshed.toLocaleTimeString()}`
                    : isLoading
                      ? 'Loading queue activity…'
                      : error
                        ? 'Unable to refresh queue.'
                        : 'Waiting for first sync…'}
                </span>
              </div>
              <div className={styles.savedTemplatesMetrics}>
                <article>
                  <span>Total drafts</span>
                  <strong>{metrics.totalDrafts}</strong>
                </article>
                <article>
                  <span>Updated last 24h</span>
                  <strong>{metrics.updatedRecently}</strong>
                </article>
                <article>
                  <span>Needs assignment</span>
                  <strong>{metrics.unassignedDrafts}</strong>
                </article>
              </div>
            </section>

            <section
              className={styles.savedTemplatesPanel}
              aria-live="polite"
              aria-label="Draft resume templates queue"
            >
              <header className={styles.savedTemplatesPanelHeader}>
                <div>
                  <p className={styles.queuePanelEyebrow}>Draft workflow</p>
                  <h2>Draft resume templates</h2>
                  <p>Prioritize review-ready drafts, hand off blockers, and keep pods in sync.</p>
                </div>
                <div className={styles.savedTemplatesFilters} role="tablist" aria-label="Draft queue filters">
                  {QUEUE_FILTERS.map((chip) => {
                    const isActive = chip.value === activeFilter;
                    return (
                      <button
                        key={chip.value}
                        type="button"
                        role="tab"
                        aria-selected={isActive}
                        className={`${styles.savedTemplatesFilterButton} ${isActive ? styles.savedTemplatesFilterButtonActive : ''}`}
                        onClick={() => setActiveFilter(chip.value)}
                      >
                        <strong>{chip.label}</strong>
                        <span>{chip.description}</span>
                      </button>
                    );
                  })}
                </div>
              </header>

              <div className={styles.queueInsights}>
                <article>
                  <span>Owners assigned</span>
                  <strong>{metrics.assignedOwners}</strong>
                  <p>Unique reviewers in the queue.</p>
                </article>
                <article>
                  <span>Needs owners</span>
                  <strong>{metrics.unassignedDrafts}</strong>
                  <p>Drafts waiting for assignment.</p>
                </article>
                <article>
                  <span>Stale drafts</span>
                  <strong>{metrics.staleDrafts}</strong>
                  <p>No update in the last 72 hours.</p>
                </article>
              </div>

              {queueListContent}
            </section>
          </div>
        </div>
      </main>
    </>
  );
}

function wasUpdatedWithinHours(updatedAt: string | null, hours: number): boolean {
  if (!updatedAt) return false;
  const date = new Date(updatedAt);
  if (Number.isNaN(date.getTime())) return false;
  const diffMs = Date.now() - date.getTime();
  return diffMs <= hours * 60 * 60 * 1000;
}

function formatRelativeUpdatedAt(updatedAt: string | null): string {
  if (!updatedAt) return 'Updated timestamp unavailable';
  const date = new Date(updatedAt);
  if (Number.isNaN(date.getTime())) return 'Updated timestamp unavailable';
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

function formatAbsoluteTimestamp(updatedAt: string | null): string {
  if (!updatedAt) return 'No update timestamp available';
  const date = new Date(updatedAt);
  if (Number.isNaN(date.getTime())) return 'No update timestamp available';
  return date.toLocaleString(undefined, {
    dateStyle: 'medium',
    timeStyle: 'short',
  });
}

function handleReviewDraft(templateId: number, router: NextRouter): void {
  void router.push({
    pathname: '/view/templates/latex-upload',
    query: { templateId },
  });
}

async function handleCopyTemplateId(templateId: number): Promise<boolean> {
  if (typeof navigator === 'undefined' || !navigator.clipboard) {
    return false;
  }
  try {
    await navigator.clipboard.writeText(String(templateId));
    return true;
  } catch {
    return false;
  }
}

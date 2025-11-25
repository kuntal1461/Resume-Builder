import Head from 'next/head';
import Link from 'next/link';
import { ChangeEvent, FormEvent, useMemo, useRef, useState } from 'react';
import { type SidebarProfile } from '../../lib/sidebarProfile';
import { useSidebarProfile } from '../../lib/useSidebarProfile';
import layoutStyles from '../../styles/admin/AdminView.module.css';
import styles from '../../styles/admin/AdminJobTracker.module.css';

type CadenceOption = 'Hourly' | 'Daily' | 'Weekly';
type QueueStatus = 'running' | 'scheduled' | 'pending';
type BannerState = { type: 'success' | 'error'; message: string } | null;
type SourceType = 'LinkedIn' | 'Career page';

type QueueEntry = {
  id: string;
  company: string;
  sourceType: SourceType;
  url: string;
  cadence: CadenceOption;
  status: QueueStatus;
  nextRun: string;
  owner: string;
  submittedAt: string;
  jobCount: number;
};

const HERO_PILLS = ['Scrape approvals', 'Queue orchestration', 'Workspace integrations'];
const CADENCE_OPTIONS: CadenceOption[] = ['Hourly', 'Daily', 'Weekly'];
const SOURCE_OPTIONS: SourceType[] = ['LinkedIn', 'Career page'];

type LinkRow = {
  id: string;
  company: string;
  sourceType: SourceType;
  url: string;
  cadence: CadenceOption;
};

const createLinkRow = (id: string): LinkRow => ({
  id,
  company: '',
  sourceType: 'LinkedIn',
  url: '',
  cadence: 'Daily',
});

const DEFAULT_SIDEBAR_PROFILE: SidebarProfile = {
  name: 'Admin User',
  initials: 'AU',
  tagline: 'Job Operations',
  email: 'admin@example.com',
};

const NAV_LINKS = [
  { label: 'Workspace overview', href: '/view', active: false },
  { label: 'Templates', href: '/view/templates', active: false },
  { label: 'Job tracker', href: '/workspace/job-tracker', active: true },
  { label: 'Interview prep', href: '/workspace/interview-prep', active: false },
];

const DATE_WITH_TIME = new Intl.DateTimeFormat('en-US', {
  month: 'short',
  day: 'numeric',
  hour: 'numeric',
  minute: '2-digit',
  timeZone: 'UTC',
});

const buildNextRunLabel = (cadence: CadenceOption, baseDate = new Date()) => {
  const nextRun = new Date(baseDate);
  if (cadence === 'Hourly') {
    nextRun.setHours(nextRun.getHours() + 1);
  } else if (cadence === 'Daily') {
    nextRun.setDate(nextRun.getDate() + 1);
  } else {
    nextRun.setDate(nextRun.getDate() + 7);
  }
  return DATE_WITH_TIME.format(nextRun);
};

const INITIAL_QUEUE: QueueEntry[] = [
  {
    id: 'queue-001',
    company: 'Nimbus AI Lab',
    sourceType: 'LinkedIn',
    url: 'https://boards.greenhouse.io/example-ai',
    cadence: 'Hourly',
    status: 'running',
    owner: 'Automation bot',
    submittedAt: 'Synced 4m ago',
    nextRun: buildNextRunLabel('Hourly'),
    jobCount: 86,
  },
  {
    id: 'queue-002',
    company: 'Skyline Analytics',
    sourceType: 'Career page',
    url: 'https://jobs.lever.co/example-ml',
    cadence: 'Daily',
    status: 'scheduled',
    owner: 'N. Walton',
    submittedAt: 'Added today · 09:15',
    nextRun: buildNextRunLabel('Daily'),
    jobCount: 24,
  },
  {
    id: 'queue-003',
    company: 'CivicTech Labs',
    sourceType: 'Career page',
    url: 'https://careers.gov/apprenticeships',
    cadence: 'Weekly',
    status: 'pending',
    owner: 'Manual review',
    submittedAt: 'Awaiting compliance review',
    nextRun: buildNextRunLabel('Weekly'),
    jobCount: 12,
  },
  {
    id: 'queue-004',
    company: 'Nimbus AI Lab',
    sourceType: 'Career page',
    url: 'https://nimbus.ai/careers/research',
    cadence: 'Weekly',
    status: 'scheduled',
    owner: 'Automation bot',
    submittedAt: 'Added yesterday · 17:45',
    nextRun: buildNextRunLabel('Weekly'),
    jobCount: 18,
  },
];

const isValidUrl = (value: string) => {
  try {
    const parsed = new URL(value);
    return parsed.protocol === 'https:' || parsed.protocol === 'http:';
  } catch (error) {
    return false;
  }
};

export default function AdminJobTrackerPage() {
  const sidebarProfile = useSidebarProfile(DEFAULT_SIDEBAR_PROFILE);
  const [queue, setQueue] = useState<QueueEntry[]>(INITIAL_QUEUE);
  const [linkRows, setLinkRows] = useState<LinkRow[]>([createLinkRow('row-0')]);
  const [banner, setBanner] = useState<BannerState>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [expandedCompanies, setExpandedCompanies] = useState<Record<string, boolean>>({});
  const rowIdRef = useRef(1);

  const { runningCount, pendingCount } = useMemo(() => {
    const running = queue.filter((entry) => entry.status === 'running').length;
    const pending = queue.filter((entry) => entry.status === 'pending').length;
    return { runningCount: running, pendingCount: pending };
  }, [queue]);

  const groupedResults = useMemo(() => {
    const groups: Record<
      string,
      { company: string; totalJobs: number; totalSources: number; entries: QueueEntry[] }
    > = {};
    queue.forEach((entry) => {
      if (!groups[entry.company]) {
        groups[entry.company] = { company: entry.company, totalJobs: 0, totalSources: 0, entries: [] };
      }
      groups[entry.company].entries.push(entry);
      groups[entry.company].totalJobs += entry.jobCount;
      groups[entry.company].totalSources += 1;
    });

    return Object.values(groups).sort((a, b) => a.company.localeCompare(b.company));
  }, [queue]);

  const handleRowChange = (index: number, field: 'company' | 'url' | 'cadence' | 'sourceType', value: string) => {
    setLinkRows((previous) =>
      previous.map((row, rowIndex) =>
        rowIndex === index
          ? {
              ...row,
              [field]:
                field === 'cadence'
                  ? (value as CadenceOption)
                  : field === 'sourceType'
                  ? (value as SourceType)
                  : value,
            }
          : row,
      ),
    );
  };

  const addLinkRow = () => {
    const nextId = `row-${rowIdRef.current}`;
    rowIdRef.current += 1;
    setLinkRows((previous) => [...previous, createLinkRow(nextId)]);
  };

  const removeLinkRow = (index: number) => {
    setLinkRows((previous) => {
      if (previous.length === 1) {
        return previous;
      }
      return previous.filter((_, rowIndex) => rowIndex !== index);
    });
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setBanner(null);

    for (let index = 0; index < linkRows.length; index += 1) {
      const row = linkRows[index];
      if (!row.company.trim()) {
        setBanner({ type: 'error', message: `Add a company name on row ${index + 1}.` });
        return;
      }
      if (!isValidUrl(row.url.trim())) {
        setBanner({ type: 'error', message: `Enter a valid job board URL on row ${index + 1}.` });
        return;
      }
    }

    setIsSubmitting(true);

    await new Promise((resolve) => setTimeout(resolve, 600));

    const submissionTimestamp = Date.now();
    const newEntries = linkRows.map((row, index) => ({
      id: `queue-${submissionTimestamp}-${index}`,
      company: row.company.trim(),
      sourceType: row.sourceType,
      url: row.url.trim(),
      cadence: row.cadence,
      status: 'pending' as QueueStatus,
      owner: 'Manual review',
      submittedAt: 'Just added',
      nextRun: buildNextRunLabel(row.cadence),
      jobCount: 0,
    }));

    setQueue((previous) => [...newEntries, ...previous]);
    setExpandedCompanies((previous) => {
      const next = { ...previous };
      newEntries.forEach((entry) => {
        next[entry.company] = true;
      });
      return next;
    });
    setLinkRows(() => {
      const nextId = `row-${rowIdRef.current}`;
      rowIdRef.current += 1;
      return [createLinkRow(nextId)];
    });
    setBanner({
      type: 'success',
      message: `${newEntries.length} source${newEntries.length === 1 ? '' : 's'} queued. The ingestion worker will verify authentication before scraping.`,
    });
    setIsSubmitting(false);
  };

  const toggleCompanySection = (company: string) => {
    setExpandedCompanies((previous) => ({
      ...previous,
      [company]: !previous[company],
    }));
  };

  return (
    <>
      <Head>
        <title>JobMatch · Admin Job Tracker</title>
        <meta
          name="description"
          content="Queue job sources for scraping and monitor ingestion health across the admin workspace."
        />
      </Head>
      <main className={layoutStyles.workspaceShell}>
        <div className={layoutStyles.workspaceLayout}>
          <aside className={layoutStyles.workspaceSidebar}>
            <Link href="/workspace/overview" className={layoutStyles.sidebarBrandLink} aria-label="Workspace home">
              <span className={layoutStyles.sidebarBrandMark}>JM</span>
              <span>JobMatch App</span>
            </Link>

            <section className={layoutStyles.sidebarProfileCard} aria-labelledby="profile-card-title">
              <div className={layoutStyles.sidebarProfileHeader}>
                <span className={layoutStyles.sidebarProfileAvatar} aria-hidden="true">
                  {sidebarProfile.initials}
                </span>
                <div className={layoutStyles.sidebarProfileMeta}>
                  <span className={layoutStyles.sidebarProfileName} id="profile-card-title">
                    {sidebarProfile.name}
                  </span>
                  <span className={layoutStyles.sidebarProfileTagline}>{sidebarProfile.tagline}</span>
                  <span className={layoutStyles.sidebarProfileEmail}>{sidebarProfile.email}</span>
                </div>
              </div>
            </section>

            <nav aria-label="Workspace">
              <ul className={layoutStyles.sidebarMenu}>
                {NAV_LINKS.map((link) => (
                  <li key={link.label} className={layoutStyles.sidebarMenuItem}>
                    <Link
                      href={link.href}
                      className={`${layoutStyles.sidebarMenuLink} ${link.active ? layoutStyles.sidebarMenuLinkActive : ''}`}
                    >
                      <span>{link.label}</span>
                    </Link>
                  </li>
                ))}
              </ul>
            </nav>
          </aside>

          <div className={layoutStyles.workspaceMain}>
            <section className={styles.hero}>
              <div className={styles.heroEyebrow}>
                <span>Admin workspace</span>
                <span>·</span>
                <span>Job tracker</span>
              </div>
              <h1>Pipe fresh roles straight into the candidate workspace.</h1>
              <p>
                Drop approved job URLs, decide how often we scrape them, and keep a single view on ingestion status. Every
                source runs through compliance before it lands in the job-matching graph.
              </p>
              <div className={styles.heroPills}>
                {HERO_PILLS.map((pill) => (
                  <span key={pill}>{pill}</span>
                ))}
              </div>
              <div className={styles.metricsRow}>
                <article>
                  <strong>{queue.length}</strong>
                  <span>sources tracked</span>
                </article>
                <article>
                  <strong>{runningCount}</strong>
                  <span>active automations</span>
                </article>
                <article>
                  <strong>{pendingCount}</strong>
                  <span>awaiting review</span>
                </article>
              </div>
            </section>

            <section className={styles.formPanel}>
                <header className={styles.panelHeader}>
                  <div>
                    <p className={styles.panelEyebrow}>Intake console</p>
                    <h2>Submit a job source</h2>
                  </div>
                  <p className={styles.panelHint}>We&apos;ll validate schema, robots.txt, and attach it to the workspace automatically.</p>
                </header>
                <form className={styles.form} onSubmit={handleSubmit}>
                  {banner ? (
                    <div className={`${styles.banner} ${banner.type === 'error' ? styles.bannerError : styles.bannerSuccess}`}>
                      {banner.message}
                    </div>
                  ) : null}
                  <div className={styles.multiInput}>
                    {linkRows.map((row, index) => (
                      <div key={row.id} className={styles.linkRow}>
                        <label className={styles.linkField}>
                          <span>Company name</span>
                          <input
                            type="text"
                            placeholder="Example: Nimbus Labs"
                            value={row.company}
                            onChange={(event: ChangeEvent<HTMLInputElement>) =>
                              handleRowChange(index, 'company', event.target.value)
                            }
                            required
                          />
                        </label>
                        <label className={styles.linkFieldSmall}>
                          <span>Source</span>
                          <select
                            value={row.sourceType}
                            onChange={(event: ChangeEvent<HTMLSelectElement>) =>
                              handleRowChange(index, 'sourceType', event.target.value)
                            }
                          >
                            {SOURCE_OPTIONS.map((option) => (
                              <option key={option} value={option}>
                                {option}
                              </option>
                            ))}
                          </select>
                        </label>
                        <label className={styles.linkField}>
                          <span>Job board URL</span>
                          <input
                            type="url"
                            placeholder="https://jobs.example.com/open-roles"
                            value={row.url}
                            onChange={(event: ChangeEvent<HTMLInputElement>) =>
                              handleRowChange(index, 'url', event.target.value)
                            }
                            required
                          />
                        </label>
                        <label className={styles.linkFieldSmall}>
                          <span>Scrape cadence</span>
                          <select
                            value={row.cadence}
                            onChange={(event: ChangeEvent<HTMLSelectElement>) =>
                              handleRowChange(index, 'cadence', event.target.value)
                            }
                          >
                            {CADENCE_OPTIONS.map((option) => (
                              <option key={option} value={option}>
                                {option}
                              </option>
                            ))}
                          </select>
                        </label>
                        {linkRows.length > 1 ? (
                          <button
                            type="button"
                            className={styles.removeRowButton}
                            onClick={() => removeLinkRow(index)}
                            aria-label={`Remove row ${index + 1}`}
                          >
                            ×
                          </button>
                        ) : null}
                      </div>
                    ))}
                  </div>
                  <button type="button" className={styles.addRowButton} onClick={addLinkRow}>
                    + Add another link
                  </button>
                  <p className={styles.complianceCopy}>
                    By submitting you confirm the source allows programmatic access and that contracts cover candidate redistribution.
                  </p>
                  <div className={styles.actions}>
                    <button type="submit" disabled={isSubmitting}>
                      {isSubmitting ? 'Queueing source…' : 'Send to scraper'}
                    </button>
                  </div>
                </form>

                {groupedResults.length ? (
                  <div className={styles.queuePanel}>
                    <header className={styles.panelHeader}>
                      <div>
                        <p className={styles.panelEyebrow}>Result section</p>
                        <h2>Scrape status by company</h2>
                      </div>
                      <p className={styles.panelHint}>
                        Expand a company to see every URL we are monitoring and whether scraping is working or pending.
                      </p>
                    </header>
                    <ul className={styles.queueList}>
                      {groupedResults.map((group) => {
                        const isExpanded = Boolean(expandedCompanies[group.company]);
                        return (
                          <li key={group.company} className={styles.queueCard}>
                            <button
                              type="button"
                              className={styles.companyToggle}
                              onClick={() => toggleCompanySection(group.company)}
                              aria-expanded={isExpanded}
                            >
                              <div>
                                <strong>{group.company}</strong>
                                <span className={styles.companyMeta}>
                                  {group.totalSources} source{group.totalSources === 1 ? '' : 's'}
                                </span>
                              </div>
                              <div className={styles.companyStats}>
                                <span className={styles.jobCountBadge}>
                                  {group.totalJobs} job{group.totalJobs === 1 ? '' : 's'} scraped
                                </span>
                                <span className={styles.companyToggleIcon} aria-hidden="true">
                                  {isExpanded ? '−' : '+'}
                                </span>
                              </div>
                            </button>
                            {isExpanded ? (
                              <ul className={styles.queueListInner}>
                                {group.entries.map((entry) => (
                                  <li key={entry.id} className={styles.queueEntry}>
                                    <div className={styles.queueCardHeader}>
                                      <span
                                        className={`${styles.statusBadge} ${
                                          entry.status === 'running'
                                            ? styles.statusRunning
                                            : entry.status === 'scheduled'
                                            ? styles.statusScheduled
                                            : styles.statusPending
                                        }`}
                                      >
                                        {entry.status}
                                      </span>
                                      <span className={styles.cadencePill}>{entry.cadence}</span>
                                    </div>
                                    <p className={styles.entryMeta}>
                                      <span>{entry.sourceType}</span>
                                      <span>·</span>
                                      <span>{entry.jobCount} jobs captured</span>
                                    </p>
                                    <a href={entry.url} target="_blank" rel="noreferrer" className={styles.urlLink}>
                                      {entry.url}
                                    </a>
                                  </li>
                                ))}
                              </ul>
                            ) : null}
                          </li>
                        );
                      })}
                    </ul>
                  </div>
                ) : null}
            </section>
          </div>
        </div>
      </main>
    </>
  );
}

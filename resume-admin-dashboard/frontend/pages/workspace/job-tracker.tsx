import Head from 'next/head';
import Link from 'next/link';
import type { GetServerSideProps } from 'next';
import { ChangeEvent, FormEvent, useMemo, useRef, useState } from 'react';
import { type SidebarProfile } from '../../lib/sidebarProfile';
import { useSidebarProfile } from '../../lib/useSidebarProfile';
import type { EnumOptionRecord, JobSourceMetadataResponse } from '../../lib/types/jobSources';
import layoutStyles from '../../styles/admin/AdminView.module.css';
import styles from '../../styles/admin/AdminJobTracker.module.css';

type CadenceOption = string;
type QueueStatus = 'running' | 'scheduled' | 'pending';
type BannerState = { type: 'success' | 'error'; message: string } | null;
type SourceType = string;
type ScrapeTypeOption = string;

type AdminJobTrackerPageProps = JobSourceMetadataResponse;

type QueueEntry = {
  id: string;
  company: string;
  sourceType: SourceType;
  url: string;
  cadence: CadenceOption;
  scrapeType: ScrapeTypeOption;
  apiEndpoint: string;
  apiKey: string;
  enabledForScrapping: boolean;
  status: QueueStatus;
  nextRun: string;
  owner: string;
  submittedAt: string;
  jobCount: number;
};

type Job = {
  id: string;
  title: string;
  location: string;
  type: string;
  postedDate: string;
  description: string;
  requirements: string[];
  isRejected: boolean;
};

const HERO_PILLS = ['Scrape approvals', 'Queue orchestration', 'Workspace integrations'];
const FALLBACK_SOURCE_OPTIONS: EnumOptionRecord[] = [
  { code: 1000, label: 'LinkedIn' },
  { code: 1001, label: 'Career page' },
];
const FALLBACK_SCRAPE_TYPE_OPTIONS: EnumOptionRecord[] = [
  { code: 2000, label: 'HTML' },
  { code: 2001, label: 'API' },
];
const FALLBACK_CADENCE_OPTIONS: EnumOptionRecord[] = [
  { code: 3000, label: 'Daily' },
  { code: 3001, label: 'Weekly' },
  { code: 3002, label: 'Monthly' },
];

type LinkRow = {
  id: string;
  company: string;
  sourceType: SourceType;
  url: string;
  cadence: CadenceOption;
  scrapeType: ScrapeTypeOption;
  apiEndpoint: string;
  apiKey: string;
  enabledForScrapping: boolean;
};

type DefaultSelections = {
  sourceType: SourceType;
  cadence: CadenceOption;
  scrapeType: ScrapeTypeOption;
};

const createLinkRow = (id: string, defaults: DefaultSelections): LinkRow => ({
  id,
  company: '',
  sourceType: defaults.sourceType ?? '',
  url: '',
  cadence: defaults.cadence ?? '',
  scrapeType: defaults.scrapeType ?? '',
  apiEndpoint: '',
  apiKey: '',
  enabledForScrapping: true,
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
  const normalized = cadence?.toLowerCase?.() ?? '';
  if (normalized === 'hourly') {
    nextRun.setHours(nextRun.getHours() + 1);
  } else if (normalized === 'daily') {
    nextRun.setDate(nextRun.getDate() + 1);
  } else if (normalized === 'weekly') {
    nextRun.setDate(nextRun.getDate() + 7);
  } else if (normalized === 'monthly') {
    nextRun.setMonth(nextRun.getMonth() + 1);
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
    scrapeType: 'HTML',
    apiEndpoint: '',
    apiKey: '',
    enabledForScrapping: true,
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
    scrapeType: 'API',
    apiEndpoint: 'https://api.example.com/jobs',
    apiKey: 'sk_live_example',
    enabledForScrapping: true,
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
    scrapeType: 'HTML',
    apiEndpoint: '',
    apiKey: '',
    enabledForScrapping: true,
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
    scrapeType: 'HTML',
    apiEndpoint: '',
    apiKey: '',
    enabledForScrapping: false,
    owner: 'Automation bot',
    submittedAt: 'Added yesterday · 17:45',
    nextRun: buildNextRunLabel('Weekly'),
    jobCount: 18,
  },
];

const MOCK_JOBS: Record<string, Job[]> = {
  'Nimbus AI Lab': [
    {
      id: 'job-001',
      title: 'Senior ML Engineer',
      location: 'San Francisco, CA',
      type: 'Full-time',
      postedDate: '2 days ago',
      description: 'We are seeking a Senior ML Engineer to lead the development of our next-generation AI models. You will work on cutting-edge machine learning projects, collaborate with cross-functional teams, and mentor junior engineers.',
      requirements: ['5+ years ML experience', 'Python, TensorFlow, PyTorch', 'PhD or MS in CS/ML preferred', 'Experience with large-scale systems'],
      isRejected: false
    },
    {
      id: 'job-002',
      title: 'Product Designer',
      location: 'Remote',
      type: 'Full-time',
      postedDate: '1 week ago',
      description: 'Join our design team to create beautiful, intuitive user experiences for our AI-powered products. You will own the design process from research to final implementation.',
      requirements: ['3+ years product design', 'Figma expertise', 'Strong portfolio', 'UX research skills'],
      isRejected: false
    },
    {
      id: 'job-003',
      title: 'Data Scientist',
      location: 'New York, NY',
      type: 'Full-time',
      postedDate: '3 days ago',
      description: 'Analyze complex datasets to drive business insights and build predictive models. Work closely with product and engineering teams to implement data-driven solutions.',
      requirements: ['MS in Statistics/Data Science', 'SQL, Python, R', 'A/B testing experience', 'Strong communication skills'],
      isRejected: false
    },
    {
      id: 'job-004',
      title: 'Frontend Engineer',
      location: 'Austin, TX',
      type: 'Contract',
      postedDate: '5 days ago',
      description: 'Build responsive, performant web applications using modern JavaScript frameworks. Collaborate with designers and backend engineers to deliver exceptional user experiences.',
      requirements: ['React/Next.js expert', 'TypeScript proficiency', '3+ years frontend dev', 'CSS/Tailwind skills'],
      isRejected: false
    },
    {
      id: 'job-005',
      title: 'DevOps Engineer',
      location: 'Seattle, WA',
      type: 'Full-time',
      postedDate: '1 day ago',
      description: 'Manage and scale our cloud infrastructure, implement CI/CD pipelines, and ensure high availability of our services. Work with engineering teams to optimize deployment processes.',
      requirements: ['AWS/GCP experience', 'Kubernetes, Docker', 'Infrastructure as Code', 'Monitoring & alerting'],
      isRejected: false
    },
  ],
  'Skyline Analytics': [
    {
      id: 'job-006',
      title: 'Analytics Engineer',
      location: 'Boston, MA',
      type: 'Full-time',
      postedDate: '4 days ago',
      description: 'Build and maintain data pipelines and analytics infrastructure. Transform raw data into actionable insights for business stakeholders.',
      requirements: ['SQL mastery', 'dbt experience', 'Data warehousing', 'Python/R skills'],
      isRejected: false
    },
    {
      id: 'job-007',
      title: 'Business Analyst',
      location: 'Chicago, IL',
      type: 'Full-time',
      postedDate: '1 week ago',
      description: 'Partner with business leaders to identify opportunities, analyze data, and drive strategic decisions. Create dashboards and reports to track key metrics.',
      requirements: ['3+ years BA experience', 'Excel/Tableau expert', 'Strong analytical skills', 'Business acumen'],
      isRejected: false
    },
    {
      id: 'job-008',
      title: 'Data Engineer',
      location: 'Remote',
      type: 'Full-time',
      postedDate: '2 days ago',
      description: 'Design and build scalable data infrastructure to support analytics and ML workloads. Optimize data pipelines for performance and reliability.',
      requirements: ['Spark, Airflow', 'Cloud platforms', 'ETL/ELT expertise', 'Distributed systems'],
      isRejected: false
    },
  ],
  'CivicTech Labs': [
    {
      id: 'job-009',
      title: 'Software Engineer',
      location: 'Washington, DC',
      type: 'Full-time',
      postedDate: '3 days ago',
      description: 'Develop civic technology solutions that improve government services and citizen engagement. Work on impactful projects that serve the public good.',
      requirements: ['Full-stack development', 'Node.js, React', 'API design', 'Security best practices'],
      isRejected: false
    },
    {
      id: 'job-010',
      title: 'UX Researcher',
      location: 'Remote',
      type: 'Contract',
      postedDate: '1 week ago',
      description: 'Conduct user research to understand citizen needs and inform product decisions. Plan and execute usability studies, interviews, and surveys.',
      requirements: ['UX research methods', 'Qualitative analysis', 'Usability testing', 'Stakeholder management'],
      isRejected: false
    },
  ],
};

const isValidUrl = (value: string) => {
  try {
    const parsed = new URL(value);
    return parsed.protocol === 'https:' || parsed.protocol === 'http:';
  } catch (error) {
    return false;
  }
};

export default function AdminJobTrackerPage({
  sources,
  scrapeCadences,
  scrapeTypes,
}: AdminJobTrackerPageProps) {
  const sourceOptions = sources.length ? sources : FALLBACK_SOURCE_OPTIONS;
  const cadenceOptions = scrapeCadences.length ? scrapeCadences : FALLBACK_CADENCE_OPTIONS;
  const scrapeTypeOptions = scrapeTypes.length ? scrapeTypes : FALLBACK_SCRAPE_TYPE_OPTIONS;
  const sidebarProfile = useSidebarProfile(DEFAULT_SIDEBAR_PROFILE);
  const defaultSelections = useMemo<DefaultSelections>(
    () => ({
      sourceType: sourceOptions[0]?.label ?? '',
      cadence: cadenceOptions[0]?.label ?? '',
      scrapeType: scrapeTypeOptions[0]?.label ?? '',
    }),
    [sourceOptions, cadenceOptions, scrapeTypeOptions],
  );
  const [queue, setQueue] = useState<QueueEntry[]>(INITIAL_QUEUE);
  const [linkRows, setLinkRows] = useState<LinkRow[]>(() => [createLinkRow('row-0', defaultSelections)]);
  const [banner, setBanner] = useState<BannerState>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [expandedCompanies, setExpandedCompanies] = useState<Record<string, boolean>>({});
  const [expandedJobs, setExpandedJobs] = useState<Record<string, boolean>>({});
  const [expandedJobDetails, setExpandedJobDetails] = useState<Record<string, boolean>>({});
  const [jobs, setJobs] = useState<Record<string, Job[]>>(MOCK_JOBS);
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

  const updateLinkRow = <K extends keyof LinkRow>(index: number, field: K, value: LinkRow[K]) => {
    setLinkRows((previous) =>
      previous.map((row, rowIndex) => (rowIndex === index ? { ...row, [field]: value } : row)),
    );
  };

  const addLinkRow = () => {
    const nextId = `row-${rowIdRef.current}`;
    rowIdRef.current += 1;
    setLinkRows((previous) => [...previous, createLinkRow(nextId, defaultSelections)]);
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
      if (row.scrapeType === 'API') {
        if (!row.apiEndpoint.trim()) {
          setBanner({ type: 'error', message: `Provide an API endpoint on row ${index + 1}.` });
          return;
        }
        if (!isValidUrl(row.apiEndpoint.trim())) {
          setBanner({ type: 'error', message: `Enter a valid API endpoint URL on row ${index + 1}.` });
          return;
        }
        if (!row.apiKey.trim()) {
          setBanner({ type: 'error', message: `Provide an API key on row ${index + 1}.` });
          return;
        }
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
      scrapeType: row.scrapeType,
      apiEndpoint: row.scrapeType === 'API' ? row.apiEndpoint.trim() : '',
      apiKey: row.scrapeType === 'API' ? row.apiKey.trim() : '',
      enabledForScrapping: row.enabledForScrapping,
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
      return [createLinkRow(nextId, defaultSelections)];
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

  const toggleJobsView = (company: string, event: React.MouseEvent) => {
    event.stopPropagation();
    setExpandedJobs((previous) => ({
      ...previous,
      [company]: !previous[company],
    }));
  };

  const handleJobAction = (company: string, jobId: string, action: 'visible' | 'reject') => {
    if (action === 'reject') {
      setJobs((previous) => ({
        ...previous,
        [company]: previous[company].map((job) =>
          job.id === jobId ? { ...job, isRejected: true } : job
        ),
      }));
    }
  };

  const toggleJobDetails = (jobId: string) => {
    setExpandedJobDetails((previous) => ({
      ...previous,
      [jobId]: !previous[jobId],
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
                      <div className={styles.rowPrimary}>
                        <label className={styles.linkField}>
                          <span>Company name</span>
                          <input
                            type="text"
                            placeholder="Example: Nimbus Labs"
                            value={row.company}
                            onChange={(event: ChangeEvent<HTMLInputElement>) =>
                              updateLinkRow(index, 'company', event.target.value)
                            }
                            required
                          />
                        </label>
                        <label className={styles.linkField}>
                          <span>Job source URL</span>
                          <input
                            type="url"
                            placeholder="https://jobs.example.com/open-roles"
                            value={row.url}
                            onChange={(event: ChangeEvent<HTMLInputElement>) =>
                              updateLinkRow(index, 'url', event.target.value)
                            }
                            required
                          />
                        </label>
                      </div>
                      <div className={styles.rowMeta}>
                        <label className={styles.linkFieldSmall}>
                          <span>Source</span>
                          <select
                            value={row.sourceType}
                            onChange={(event: ChangeEvent<HTMLSelectElement>) =>
                              updateLinkRow(index, 'sourceType', event.target.value)
                            }
                          >
                            {sourceOptions.map((option) => (
                              <option key={option.code} value={option.label}>
                                {option.label}
                              </option>
                            ))}
                          </select>
                        </label>
                        <label className={styles.linkFieldSmall}>
                          <span>Scrape cadence</span>
                          <select
                            value={row.cadence}
                            onChange={(event: ChangeEvent<HTMLSelectElement>) =>
                              updateLinkRow(index, 'cadence', event.target.value)
                            }
                          >
                            {cadenceOptions.map((option) => (
                              <option key={option.code} value={option.label}>
                                {option.label}
                              </option>
                            ))}
                          </select>
                        </label>
                        <label className={styles.linkFieldSmall}>
                          <span>Scrape type</span>
                          <select
                            value={row.scrapeType}
                            onChange={(event: ChangeEvent<HTMLSelectElement>) =>
                              updateLinkRow(index, 'scrapeType', event.target.value)
                            }
                          >
                            {scrapeTypeOptions.map((option) => (
                              <option key={option.code} value={option.label}>
                                {option.label}
                              </option>
                            ))}
                          </select>
                        </label>
                        <label className={styles.checkboxField}>
                          <input
                            type="checkbox"
                            checked={row.enabledForScrapping}
                            onChange={(event: ChangeEvent<HTMLInputElement>) =>
                              updateLinkRow(index, 'enabledForScrapping', event.target.checked)
                            }
                          />
                          <span>Enabled for scraping</span>
                        </label>
                        {linkRows.length > 1 ? (
                          <button
                            type="button"
                            className={styles.removeRowButton}
                            onClick={() => removeLinkRow(index)}
                            aria-label={`Remove row ${index + 1}`}
                          >
                            Remove
                          </button>
                        ) : null}
                      </div>
                      {row.scrapeType === 'API' ? (
                        <div className={styles.apiCredentials}>
                          <label className={styles.linkField}>
                            <span>API endpoint</span>
                            <input
                              type="url"
                              placeholder="https://api.example.com/jobs"
                              value={row.apiEndpoint}
                              onChange={(event: ChangeEvent<HTMLInputElement>) =>
                                updateLinkRow(index, 'apiEndpoint', event.target.value)
                              }
                              required
                            />
                          </label>
                          <label className={styles.linkField}>
                            <span>API key</span>
                            <input
                              type="text"
                              placeholder="Provide a token with read scope"
                              value={row.apiKey}
                              onChange={(event: ChangeEvent<HTMLInputElement>) =>
                                updateLinkRow(index, 'apiKey', event.target.value)
                              }
                              required
                            />
                          </label>
                        </div>
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
                              <span
                                className={styles.jobCountBadge}
                                onClick={(e) => toggleJobsView(group.company, e)}
                                style={{ cursor: 'pointer' }}
                              >
                                {group.totalJobs} job{group.totalJobs === 1 ? '' : 's'} scraped
                              </span>
                              <span className={styles.companyToggleIcon} aria-hidden="true">
                                {isExpanded ? '−' : '+'}
                              </span>
                            </div>
                          </button>
                          {expandedJobs[group.company] && jobs[group.company] ? (
                            <div className={styles.jobsContainer}>
                              {jobs[group.company].map((job) => {
                                const isJobExpanded = Boolean(expandedJobDetails[job.id]);
                                return (
                                  <div
                                    key={job.id}
                                    className={`${styles.jobCard} ${job.isRejected ? styles.jobCardRejected : ''}`}
                                  >
                                    <div
                                      className={styles.jobCardHeader}
                                      onClick={() => toggleJobDetails(job.id)}
                                      style={{ cursor: 'pointer' }}
                                    >
                                      <div className={styles.jobCardMain}>
                                        <h4 className={styles.jobTitle}>{job.title}</h4>
                                        <p className={styles.jobLocation}>📍 {job.location}</p>
                                        <div className={styles.jobMeta}>
                                          <span>{job.type}</span>
                                          <span>·</span>
                                          <span>{job.postedDate}</span>
                                        </div>
                                      </div>
                                      <div className={styles.jobExpandIcon}>
                                        {isJobExpanded ? '−' : '+'}
                                      </div>
                                    </div>

                                    {isJobExpanded && (
                                      <div className={styles.jobDetails}>
                                        <div className={styles.jobDescription}>
                                          <h5>Description</h5>
                                          <p>{job.description}</p>
                                        </div>
                                        <div className={styles.jobRequirements}>
                                          <h5>Requirements</h5>
                                          <ul>
                                            {job.requirements.map((req, idx) => (
                                              <li key={idx}>{req}</li>
                                            ))}
                                          </ul>
                                        </div>
                                      </div>
                                    )}

                                    {!job.isRejected ? (
                                      <div className={styles.jobActions}>
                                        <button
                                          className={styles.jobActionVisible}
                                          onClick={() => handleJobAction(group.company, job.id, 'visible')}
                                        >
                                          ✓ Visible
                                        </button>
                                        <button
                                          className={styles.jobActionReject}
                                          onClick={() => handleJobAction(group.company, job.id, 'reject')}
                                        >
                                          × Reject
                                        </button>
                                      </div>
                                    ) : (
                                      <div className={styles.rejectedBadge}>Rejected</div>
                                    )}
                                  </div>
                                );
                              })}
                            </div>
                          ) : null}
                          {isExpanded ? (
                            <ul className={styles.queueListInner}>
                              {group.entries.map((entry) => (
                                <li key={entry.id} className={styles.queueEntry}>
                                  <div className={styles.queueCardHeader}>
                                    <span
                                      className={`${styles.statusBadge} ${entry.status === 'running'
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

export const getServerSideProps: GetServerSideProps<AdminJobTrackerPageProps> = async () => {
  try {
    const { fetchJobSourceMetadata } = await import('../../lib/server/jobSources');
    const metadata = await fetchJobSourceMetadata();
    return { props: metadata };
  } catch (error) {
    console.error('Failed to fetch job source metadata', error);
    return {
      props: {
        sources: FALLBACK_SOURCE_OPTIONS,
        scrapeCadences: FALLBACK_CADENCE_OPTIONS,
        scrapeTypes: FALLBACK_SCRAPE_TYPE_OPTIONS,
      },
    };
  }
};

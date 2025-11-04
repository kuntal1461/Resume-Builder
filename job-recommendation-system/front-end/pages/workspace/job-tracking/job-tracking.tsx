import Head from 'next/head';
import { useState } from 'react';
import type { CSSProperties, ReactNode } from 'react';
import AppShell from '../../../components/workspace/AppShell';
import {
  AutoApplyIcon,
  DocumentsIcon,
  OfferAnalyzerIcon,
  SparkIcon,
} from '../../../components/workspace/icons';
import AddJobModal from '../../../components/workspace/job-tracking/AddJobModal';
import type { AddJobSubmission, StageKey } from '../../../components/workspace/job-tracking/types';
import { APP_MENU_ITEMS, DEFAULT_PROFILE_TASKS } from '../../../components/workspace/navigation';
import styles from '../../../styles/workspace/JobTracking.module.css';

type PipelineJob = {
  id: string;
  title: string;
  company: string;
  location: string;
  salary?: string;
  updated: string;
  nextStep: string;
  tags?: string[];
  fit?: string;
  interviewDetails?: string;
  interviewDate?: string;
  interviewTime?: string;
  needsReminder?: boolean;
};

type StageConfig = {
  icon: () => ReactNode;
  accent: string;
  accentStrong: string;
  accentSoft: string;
  border: string;
  shadow: string;
  description: string;
  quickAction?: string;
  quickActionAria?: string;
};

const STAGE_CONFIG: Record<StageKey, StageConfig> = {
  Shortlist: {
    icon: () => <SparkIcon aria-hidden="true" />,
    accent: '#FF6B93',
    accentStrong: '#FF88AB',
    accentSoft: 'rgba(255, 107, 147, 0.14)',
    border: 'rgba(255, 107, 147, 0.32)',
    shadow: '0 12px 28px rgba(255, 107, 147, 0.28)',
    description: 'Roles you are still researching.',
    quickAction: 'Apply to all',
    quickActionAria: 'Trigger apply to all jobs in shortlist',
  },
  'Auto Apply': {
    icon: () => <AutoApplyIcon aria-hidden="true" />,
    accent: '#1A91F0',
    accentStrong: '#3AA0F7',
    accentSoft: 'rgba(26, 145, 240, 0.16)',
    border: 'rgba(26, 145, 240, 0.28)',
    shadow: '0 12px 28px rgba(26, 145, 240, 0.26)',
    description: 'Jobs queued for Auto Apply.',
    quickAction: 'Sync extension',
    quickActionAria: 'Sync auto apply extension',
  },
  Applied: {
    icon: () => <DocumentsIcon aria-hidden="true" />,
    accent: '#7C5DFA',
    accentStrong: '#8E74FF',
    accentSoft: 'rgba(124, 93, 250, 0.18)',
    border: 'rgba(124, 93, 250, 0.28)',
    shadow: '0 12px 28px rgba(124, 93, 250, 0.26)',
    description: 'Applications already submitted.',
    quickAction: 'Log follow-ups',
    quickActionAria: 'Log follow ups for applied jobs',
  },
  Interview: {
    icon: () => <ConversationIcon />,
    accent: '#4338CA',
    accentStrong: '#5B4BF2',
    accentSoft: 'rgba(67, 56, 202, 0.16)',
    border: 'rgba(67, 56, 202, 0.28)',
    shadow: '0 12px 28px rgba(67, 56, 202, 0.26)',
    description: 'Live interview loops currently underway.',
    quickAction: 'Capture notes',
    quickActionAria: 'Capture interview notes',
  },
  Offer: {
    icon: () => <OfferAnalyzerIcon aria-hidden="true" />,
    accent: '#F59E0B',
    accentStrong: '#FBBF24',
    accentSoft: 'rgba(245, 158, 11, 0.18)',
    border: 'rgba(245, 158, 11, 0.28)',
    shadow: '0 12px 28px rgba(245, 158, 11, 0.24)',
    description: 'Offers that need decision support.',
    quickAction: 'Run offer analysis',
    quickActionAria: 'Run offer analysis workflow',
  },
  Rejected: {
    icon: () => <RejectedIcon />,
    accent: '#64748B',
    accentStrong: '#7B8BA5',
    accentSoft: 'rgba(100, 116, 139, 0.16)',
    border: 'rgba(100, 116, 139, 0.26)',
    shadow: '0 12px 28px rgba(100, 116, 139, 0.2)',
    description: 'Closed applications to capture feedback.',
    quickAction: 'Archive feedback',
    quickActionAria: 'Archive feedback from rejected applications',
  },
};

const STAGE_ORDER: StageKey[] = [
  'Shortlist',
  'Auto Apply',
  'Applied',
  'Interview',
  'Offer',
  'Rejected',
];

type PipelineColumn = {
  key: StageKey;
  description: string;
  jobs: PipelineJob[];
};

const DATE_FORMATTER = new Intl.DateTimeFormat('en-US', { month: 'short', day: 'numeric' });

export default function WorkspaceJobTrackingPage() {
  const [trackedJobsByStage, setTrackedJobsByStage] = useState<Partial<Record<StageKey, PipelineJob[]>>>({});
  const [isAddJobOpen, setIsAddJobOpen] = useState(false);
  const [pendingStage, setPendingStage] = useState<StageKey>('Shortlist');

  const pipeline: PipelineColumn[] = STAGE_ORDER.map((key) => ({
    key,
    description: STAGE_CONFIG[key].description,
    jobs: trackedJobsByStage[key] ?? [],
  }));

  const handleOpenAddModal = (stage: StageKey) => {
    setPendingStage(stage);
    setIsAddJobOpen(true);
  };

  const handleCloseAddModal = () => {
    setIsAddJobOpen(false);
  };

  const handleAddJob = (job: AddJobSubmission) => {
    const id = `job-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
    const tags = job.tags?.length ? job.tags : undefined;
    const createdJob: PipelineJob = {
      id,
      title: job.title,
      company: job.company,
      location: job.location,
      salary: job.salary,
      updated: DATE_FORMATTER.format(new Date()),
      nextStep: job.nextStep,
      tags,
    };

    if (job.stage === 'Interview') {
      const formattedDate = job.interviewDate
        ? new Date(job.interviewDate).toLocaleDateString(undefined, {
            month: 'short',
            day: 'numeric',
            year: 'numeric',
          })
        : undefined;

      let formattedTime: string | undefined;
      if (job.interviewTime) {
        const [hourStr, minuteStr] = job.interviewTime.split(':');
        const hour = Number.parseInt(hourStr ?? '', 10);
        const minute = Number.parseInt(minuteStr ?? '', 10);
        if (!Number.isNaN(hour) && !Number.isNaN(minute)) {
          const temp = new Date();
          temp.setHours(hour, minute, 0, 0);
          formattedTime = temp.toLocaleTimeString([], { hour: 'numeric', minute: '2-digit' });
        }
      }

      const detailParts: string[] = [];
      if (formattedDate) {
        detailParts.push(`Scheduled for ${formattedDate}`);
      }
      if (formattedTime) {
        detailParts.push(`at ${formattedTime}`);
      }
      if (job.needsReminder) {
        detailParts.push('Reminder alert enabled');
      }

      createdJob.interviewDate = job.interviewDate;
      createdJob.interviewTime = job.interviewTime;
      createdJob.needsReminder = job.needsReminder;
      createdJob.interviewDetails = detailParts.length ? detailParts.join(' · ') : undefined;

      if (job.needsReminder) {
        const reminderTag = 'Reminder set';
        createdJob.tags = createdJob.tags?.includes(reminderTag)
          ? createdJob.tags
          : [...(createdJob.tags ?? []), reminderTag];
      }
    }

    setTrackedJobsByStage((previous) => {
      const stageJobs = previous[job.stage] ?? [];
      return {
        ...previous,
        [job.stage]: [createdJob, ...stageJobs],
      };
    });
    setIsAddJobOpen(false);
  };

  return (
    <>
      <Head>
        <title>JobMatch · Job Tracker</title>
        <meta
          name="description"
          content="Stay on top of every job application stage with a modern pipeline tracker."
        />
      </Head>
      <AppShell
        menuItems={APP_MENU_ITEMS}
        profileTasks={DEFAULT_PROFILE_TASKS}
        profile={{
          name: 'Kuntal Maity',
          tagline: 'Set your target role',
          initials: 'KM',
          progressLabel: '5%',
        }}
      >
        <div className={styles.pageWrapper}>
          <header className={styles.pageHeader}>
            <div>
              <h1>Job tracker</h1>
              <p>
                Monitor every opportunity from shortlist to offer. Use quick filters to stay focused and keep the next
                step visible for each role.
              </p>
            </div>
            <div className={styles.headerActions}>
              <button type="button" className={styles.ghostButton} aria-label="Export tracker as CSV">
                Export tracker
              </button>
              <button
                type="button"
                className={styles.primaryButton}
                aria-label="Add a new opportunity to the pipeline"
                onClick={() => handleOpenAddModal('Shortlist')}
              >
                Add opportunity
              </button>
            </div>
          </header>

          <section className={styles.filtersBar} aria-label="Pipeline filters">
            <div className={styles.filterGroup}>
              <span className={styles.filterLabel}>Focus</span>
              <button type="button" className={`${styles.filterPill} ${styles.filterPillActive}`}>
                This week
              </button>
              <button type="button" className={styles.filterPill}>
                Awaiting response
              </button>
              <button type="button" className={styles.filterPill}>
                Interviews only
              </button>
              <span className={`${styles.filterLabel} ${styles.filterLabelInline}`}>Sort by</span>
              <button type="button" className={styles.filterPill}>
                Last update
              </button>
              <button type="button" className={styles.filterPill}>
                Fit score
              </button>
            </div>
          </section>

          <section className={styles.board} aria-label="Job pipeline board">
            {pipeline.map((column) => {
              const config = STAGE_CONFIG[column.key];
              const columnStyles = {
                '--stage-accent': config.accent,
                '--stage-accent-strong': config.accentStrong,
              '--stage-accent-soft': config.accentSoft,
              '--stage-border': config.border,
              '--stage-shadow': config.shadow,
            } as CSSProperties;

            return (
              <article
                key={column.key}
                className={styles.column}
                style={columnStyles}
                aria-labelledby={`${column.key}-title`}
              >
                <header className={styles.columnHeader}>
                  <div className={styles.columnHeaderTop}>
                    <div className={styles.columnTitle}>
                      <span className={styles.columnIcon}>{config.icon()}</span>
                      <div>
                        <h2 id={`${column.key}-title`}>{column.key}</h2>
                        <p>{column.description}</p>
                      </div>
                    </div>
                    <span className={styles.columnCount}>{column.jobs.length}</span>
                  </div>
                  {config.quickAction ? (
                    <div className={styles.columnActions}>
                      <button
                        type="button"
                        className={styles.columnAction}
                        data-variant="primary"
                        aria-label={config.quickActionAria ?? config.quickAction}
                      >
                        {config.quickAction}
                      </button>
                      <button
                        type="button"
                        className={styles.columnAction}
                        data-variant="ghost"
                        aria-label={`Add a job to the ${column.key.toLowerCase()} stage`}
                        onClick={() => handleOpenAddModal(column.key)}
                      >
                        Add job
                      </button>
                    </div>
                  ) : null}
                </header>
                <div className={styles.columnBody}>
                  {column.jobs.length > 0 ? (
                    column.jobs.map((job) => (
                      <article key={job.id} className={styles.jobCard}>
                        <header className={styles.jobHeader}>
                          <div>
                            <h3>{job.title}</h3>
                            <span className={styles.jobCompany}>{job.company}</span>
                          </div>
                          {job.fit ? <span className={styles.jobFit}>{job.fit}</span> : null}
                        </header>
                        <ul className={styles.jobMeta}>
                          <li>{job.location}</li>
                          {job.salary ? <li>{job.salary}</li> : null}
                          <li>{job.updated}</li>
                        </ul>
                        <p className={styles.jobNextStep}>
                          <strong>Next step:</strong> {job.nextStep}
                        </p>
                        {job.interviewDetails ? (
                          <p className={styles.jobInterview}>{job.interviewDetails}</p>
                        ) : null}
                        {job.tags?.length ? (
                          <ul className={styles.jobTags}>
                            {job.tags.map((tag) => (
                              <li key={tag}>{tag}</li>
                            ))}
                          </ul>
                        ) : null}
                        <footer className={styles.jobFooter}>
                          <button type="button" className={styles.jobAction}>
                            Log activity
                          </button>
                          <button type="button" className={styles.jobAction}>
                            View details
                          </button>
                        </footer>
                      </article>
                    ))
                  ) : (
                    <div className={styles.emptyState}>
                      <div className={styles.emptyIcon}>{config.icon()}</div>
                      <div>
                        <p className={styles.emptyTitle}>No opportunities here yet</p>
                        <p className={styles.emptyText}>
                          Add a role when you discover it or sync from your tracking spreadsheet.
                        </p>
                      </div>
                    </div>
                  )}
                </div>
              </article>
            );
          })}
          </section>
          <AddJobModal
            open={isAddJobOpen}
            stage={pendingStage}
            stages={STAGE_ORDER}
            onClose={handleCloseAddModal}
            onSubmit={handleAddJob}
          />
        </div>
      </AppShell>
    </>
  );
}

function ConversationIcon() {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path
        d="M6 5h12a3 3 0 013 3v4a3 3 0 01-3 3h-3.5l-3.5 3-3.5-3H6a3 3 0 01-3-3V8a3 3 0 013-3z"
        stroke="currentColor"
        strokeWidth="1.4"
        fill="rgba(255, 255, 255, 0.8)"
      />
      <circle cx="9" cy="10" r="1" fill="currentColor" />
      <circle cx="12" cy="10" r="1" fill="currentColor" />
      <circle cx="15" cy="10" r="1" fill="currentColor" />
    </svg>
  );
}

function RejectedIcon() {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path
        d="M12 3.5a8.5 8.5 0 110 17 8.5 8.5 0 010-17z"
        stroke="currentColor"
        strokeWidth="1.4"
        fill="rgba(255, 255, 255, 0.88)"
      />
      <path
        d="M9 9l6 6M15 9l-6 6"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

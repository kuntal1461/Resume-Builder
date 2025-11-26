import Head from 'next/head';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import type { ChangeEvent, FormEvent, ReactElement, SVGProps } from 'react';
import AppShell from '../../../components/workspace/AppShell';
import {
  ContractIcon,
  FullTimeIcon,
  HybridIcon,
  InternshipIcon,
  AppliedIcon,
  ReportIcon,
  DislikeIcon,
  LikeIcon,
  LocationMiniIcon,
  WorkTypeIcon,
  CompensationIcon,
  RemoteModeIcon,
  SeniorityIcon,
  ExperienceIcon,
  OnsiteIcon,
  RemoteIcon,
} from '../../../components/workspace/icons';
import { APP_MENU_ITEMS, DEFAULT_PROFILE_TASKS } from '../../../components/workspace/navigation';
import { createGuestWorkspaceProfile } from '../../../components/workspace/profileFallback';
import { useWorkspaceShellProfile } from '../../../components/workspace/useWorkspaceShellProfile';
import type { LikedJobSnapshot } from '../../../components/workspace/job-tracking/types';
import styles from '../../../styles/workspace/JobSearch.module.css';

type PreferenceState = {
  role: string;
  location: string;
  experience: 'Fresher' | 'Junior' | 'Mid-level' | 'Senior';
  workModel: 'Remote' | 'Hybrid' | 'On-site';
  jobNature: 'Full-time' | 'Contract' | 'Internship';
};

const PROFILE = createGuestWorkspaceProfile({
  tagline: 'Update your target role',
  progressLabel: '12%',
});

const MATCH_STORAGE_KEY = 'jobSearchMatchState';
const LIKED_JOBS_STORAGE_KEY = 'jobTrackerLikedJobs';
type StoredMatchState = { mode: 'results' | 'empty'; preferences?: PreferenceState };

type CuratedJobTemplate = {
  id: string;
  jobId: string;
  baseTitle: string;
  company: string;
  posted: string;
  companyType: string;
  location: string;
  workType: string;
  salary: string;
  remoteLabel: string;
  seniority: string;
  experience: string;
  matchScore: number;
  matchBadge: string;
  jobTags: string[];
  highlightTemplate: string;
  chip: string;
  logoText: string;
  description: string;
  responsibilities: string[];
  qualifications: string[];
  required: string[];
  benefits: string[];
  companyInfo: {
    about: string;
    size: string;
    founded: string;
    culture: string[];
  };
};

type CuratedJob = Omit<CuratedJobTemplate, 'baseTitle' | 'highlightTemplate'> & { title: string; highlight: string };

const readLikedJobsStorage = (): LikedJobSnapshot[] => {
  if (typeof window === 'undefined') {
    return [];
  }
  const raw = window.localStorage.getItem(LIKED_JOBS_STORAGE_KEY);
  if (!raw) {
    return [];
  }
  try {
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? (parsed as LikedJobSnapshot[]) : [];
  } catch {
    window.localStorage.removeItem(LIKED_JOBS_STORAGE_KEY);
    return [];
  }
};

const writeLikedJobsStorage = (payload: LikedJobSnapshot[]) => {
  if (typeof window === 'undefined') {
    return;
  }
  if (!payload.length) {
    window.localStorage.removeItem(LIKED_JOBS_STORAGE_KEY);
  } else {
    window.localStorage.setItem(LIKED_JOBS_STORAGE_KEY, JSON.stringify(payload));
  }
};

const loadLikedJobSnapshots = (): LikedJobSnapshot[] => readLikedJobsStorage();

const upsertLikedJobSnapshot = (snapshot: LikedJobSnapshot) => {
  const existing = readLikedJobsStorage().filter((job) => job.id !== snapshot.id);
  writeLikedJobsStorage([...existing, snapshot]);
};

const removeLikedJobSnapshot = (jobId: string) => {
  const existing = readLikedJobsStorage().filter((job) => job.id !== jobId);
  writeLikedJobsStorage(existing);
};

const persistMatchState = (payload: StoredMatchState | null) => {
  if (typeof window === 'undefined') {
    return;
  }
  if (!payload) {
    window.localStorage.removeItem(MATCH_STORAGE_KEY);
  } else {
    window.localStorage.setItem(MATCH_STORAGE_KEY, JSON.stringify(payload));
  }
};

const loadMatchState = (): StoredMatchState | null => {
  if (typeof window === 'undefined') {
    return null;
  }
  const raw = window.localStorage.getItem(MATCH_STORAGE_KEY);
  if (!raw) {
    return null;
  }
  try {
    return JSON.parse(raw) as StoredMatchState;
  } catch {
    window.localStorage.removeItem(MATCH_STORAGE_KEY);
    return null;
  }
};

const EXPERIENCE_OPTIONS: { label: string; value: PreferenceState['experience']; helper: string }[] = [
  { label: 'Fresher / Entry', value: 'Fresher', helper: '0-1 year, ready to learn fast' },
  { label: 'Junior', value: 'Junior', helper: '2-3 years, building depth' },
  { label: 'Mid-level', value: 'Mid-level', helper: '4-7 years, independently driving work' },
  { label: 'Senior', value: 'Senior', helper: '8+ years, leading the mission' },
];

const WORK_OPTIONS: { label: PreferenceState['workModel']; Icon: (props: SVGProps<SVGSVGElement>) => ReactElement }[] = [
  { label: 'Remote', Icon: RemoteIcon },
  { label: 'Hybrid', Icon: HybridIcon },
  { label: 'On-site', Icon: OnsiteIcon },
];

const JOB_NATURE_OPTIONS: { label: PreferenceState['jobNature']; Icon: (props: SVGProps<SVGSVGElement>) => ReactElement }[] = [
  { label: 'Full-time', Icon: FullTimeIcon },
  { label: 'Contract', Icon: ContractIcon },
  { label: 'Internship', Icon: InternshipIcon },
];

const curatedBase: CuratedJobTemplate[] = [
  {
    id: 'card-1',
    jobId: 'cna-associate-software-engineer-2',
    baseTitle: 'Backend Software Engineer',
    company: 'Atlassian',
    posted: '10 hours ago',
    companyType: 'Collaboration · Enterprise Software · Public Company',
    location: 'Seattle, WA',
    workType: 'Full-time',
    salary: '$123K/yr - $193K/yr',
    remoteLabel: 'Remote',
    seniority: 'Entry · Mid level',
    experience: '2+ years exp',
    matchScore: 89,
    matchBadge: 'Strong match',
    jobTags: ['Comp. & Benefits', 'H1B Sponsor Likely'],
    highlightTemplate:
      'Atlassian teams are looking for {ROLE} to ship creative improvements and mentor peers inside their engineering pods.',
    chip: 'Design + PM pairing',
    logoText: 'AT',
    description: 'Join Atlassian\'s engineering team to build scalable backend systems that power collaboration tools used by millions worldwide. You\'ll work on distributed systems, APIs, and microservices while collaborating with cross-functional teams.',
    responsibilities: [
      'Design and implement scalable backend services and APIs',
      'Collaborate with product managers and designers to deliver features',
      'Write clean, maintainable code with comprehensive test coverage',
      'Participate in code reviews and mentor junior engineers',
      'Optimize system performance and troubleshoot production issues',
    ],
    qualifications: [
      'Bachelor\'s degree in Computer Science or related field',
      '2+ years of backend development experience',
      'Strong understanding of data structures and algorithms',
      'Experience with agile development methodologies',
    ],
    required: [
      'Proficiency in Java, Python, or Go',
      'Experience with RESTful API design',
      'Knowledge of SQL and NoSQL databases',
      'Familiarity with cloud platforms (AWS, GCP, or Azure)',
      'Strong problem-solving and communication skills',
    ],
    benefits: [
      'Comprehensive health, dental, and vision insurance',
      '$5,000 annual learning and development budget',
      'Flexible work arrangements and unlimited PTO',
      'Stock options and 401(k) matching',
      'H1B visa sponsorship available',
      'Wellness programs and gym membership',
    ],
    companyInfo: {
      about: 'Atlassian builds collaboration software that helps teams work better together. Our products include Jira, Confluence, Trello, and Bitbucket, serving over 250,000 customers worldwide.',
      size: '10,000+ employees',
      founded: '2002',
      culture: ['Remote-first', 'Innovation-driven', 'Inclusive', 'Collaborative'],
    },
  },
  {
    id: 'card-2',
    jobId: 'pulse-analytics-associate-growth-analyst',
    baseTitle: 'Associate Growth Analyst',
    company: 'Pulse Analytics',
    posted: '1 day ago',
    companyType: 'Analytics · YC W19 · Series B',
    location: 'Austin, TX',
    workType: 'Full-time',
    salary: '$98K/yr - $142K/yr',
    remoteLabel: 'Hybrid',
    seniority: 'Entry · Mid level',
    experience: '1-3 years exp',
    matchScore: 82,
    matchBadge: 'Great fit',
    jobTags: ['Training budget', 'Coaching pod'],
    highlightTemplate:
      'Pulse Analytics spins up micro teams so {ROLE} can own experiments, work cross-functionally, and get weekly product coaching.',
    chip: 'Coaching included',
    logoText: 'PA',
    description: 'Drive growth initiatives through data-driven insights at a fast-growing YC-backed analytics startup. You\'ll design experiments, analyze user behavior, and work directly with leadership to scale our product.',
    responsibilities: [
      'Design and execute growth experiments across acquisition and retention',
      'Analyze user data to identify opportunities and bottlenecks',
      'Build dashboards and reports to track key growth metrics',
      'Collaborate with product, engineering, and marketing teams',
      'Present findings and recommendations to stakeholders',
    ],
    qualifications: [
      'Bachelor\'s degree in Business, Economics, Statistics, or related field',
      '1-3 years of experience in growth, analytics, or product',
      'Strong analytical and problem-solving skills',
      'Excellent communication and presentation abilities',
    ],
    required: [
      'Proficiency in SQL and data visualization tools (Tableau, Looker)',
      'Experience with A/B testing and statistical analysis',
      'Knowledge of Python or R for data analysis',
      'Understanding of growth metrics and funnel optimization',
      'Ability to work in a fast-paced startup environment',
    ],
    benefits: [
      'Competitive salary with equity compensation',
      '$3,000 annual professional development budget',
      'Hybrid work model (3 days in office)',
      'Health, dental, and vision insurance',
      'Weekly 1:1 coaching sessions with growth leaders',
      'Catered lunches and snacks',
    ],
    companyInfo: {
      about: 'Pulse Analytics (YC W19) helps companies make better decisions through real-time analytics. We\'re a Series B startup backed by top-tier VCs, growing 300% year-over-year.',
      size: '50-100 employees',
      founded: '2019',
      culture: ['Data-driven', 'Fast-paced', 'Learning-focused', 'Transparent'],
    },
  },
  {
    id: 'card-3',
    jobId: 'orbit-systems-product-trainee-ai',
    baseTitle: 'Product Trainee (AI)',
    company: 'Orbit Systems',
    posted: '2 days ago',
    companyType: 'AI Research · Private',
    location: 'New York, NY',
    workType: 'Internship',
    salary: '$35/hr - $45/hr',
    remoteLabel: 'On-site',
    seniority: 'Fresher',
    experience: 'Final year or recent grad',
    matchScore: 75,
    matchBadge: 'Solid match',
    jobTags: ['Mentor pod', 'Portfolio boost'],
    highlightTemplate:
      'Orbit pairs every {ROLE} with a rotating mentor pod and a quarterly showcase so your work is visible.',
    chip: 'Mentorship pod',
    logoText: 'OS',
    description: 'Launch your product career in AI at Orbit Systems. This 6-month internship program pairs you with experienced product managers to work on cutting-edge AI products, with potential for full-time conversion.',
    responsibilities: [
      'Assist in product research and user interviews',
      'Help define product requirements and user stories',
      'Support product launches and feature rollouts',
      'Analyze product metrics and user feedback',
      'Participate in sprint planning and product reviews',
    ],
    qualifications: [
      'Currently pursuing or recently completed Bachelor\'s/Master\'s degree',
      'Strong interest in AI and product management',
      'Excellent written and verbal communication skills',
      'Ability to work full-time for 6 months',
    ],
    required: [
      'Basic understanding of AI/ML concepts',
      'Analytical mindset with attention to detail',
      'Proficiency in Google Workspace and collaboration tools',
      'Eagerness to learn and take initiative',
      'Strong organizational and time management skills',
    ],
    benefits: [
      'Competitive hourly compensation',
      'Rotating mentorship with senior PMs and engineers',
      'Quarterly showcase to present your work',
      'Networking opportunities with AI industry leaders',
      'Potential for full-time conversion',
      'Free lunch and commuter benefits',
    ],
    companyInfo: {
      about: 'Orbit Systems is building the next generation of AI-powered productivity tools. Our mission is to make AI accessible and useful for everyone, from students to enterprises.',
      size: '20-50 employees',
      founded: '2021',
      culture: ['Innovation-first', 'Mentorship-driven', 'Inclusive', 'Fast-growing'],
    },
  },
];

export default function WorkspaceJobSearchPage() {
  const router = useRouter();
  const shellProfile = useWorkspaceShellProfile(PROFILE);
  const [preferences, setPreferences] = useState<PreferenceState>({
    role: '',
    location: '',
    experience: 'Fresher',
    workModel: 'Remote',
    jobNature: 'Full-time',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [isFormVisible, setIsFormVisible] = useState(true);
  const [generatedJobs, setGeneratedJobs] = useState<CuratedJob[]>([]);
  const [expandedJobId, setExpandedJobId] = useState<string | null>(null);
  const [savedJobIds, setSavedJobIds] = useState<string[]>([]);
  const [activeActionMenu, setActiveActionMenu] = useState<string | null>(null);

  const buildCuratedJobs = (target: PreferenceState): CuratedJob[] => {
    return curatedBase.map((template, index) => {
      const title = target.role?.trim() ? target.role.trim() : template.baseTitle;
      const highlight = template.highlightTemplate.replace('{ROLE}', title);
      const chip = template.chip;
      let adjustedChip = chip;
      if (target.jobNature === 'Internship' && index === 0) {
        adjustedChip = 'Portfolio spotlight';
      }
      return {
        ...template,
        title,
        highlight,
        chip: adjustedChip,
      };
    });
  };

  const handleTextChange =
    (key: 'role' | 'location') =>
      (event: ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { value } = event.target;
        setPreferences((prev) => ({ ...prev, [key]: value }));
        setSubmitted(false);
      };

  const handlePreferenceChange = <Key extends keyof PreferenceState>(key: Key, value: PreferenceState[Key]) => {
    setPreferences((prev) => ({ ...prev, [key]: value }));
    setSubmitted(false);
  };

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const snapshot = { ...preferences };
    setIsSubmitting(true);
    window.setTimeout(() => {
      setIsSubmitting(false);
      setSubmitted(true);
      setIsFormVisible(false);
      const matches = buildCuratedJobs(snapshot);
      setGeneratedJobs(matches);
      persistMatchState({ mode: 'results', preferences: snapshot });
    }, 900);
  };

  const handleSkip = () => {
    setIsFormVisible(false);
    setSubmitted(false);
    setGeneratedJobs([]);
    persistMatchState({ mode: 'empty' });
  };

  const handleRestart = () => {
    setIsFormVisible(true);
    setSubmitted(false);
    setGeneratedJobs([]);
    persistMatchState(null);
    setActiveActionMenu(null);
  };

  const handleToggleSave = (jobId: string) => {
    setSavedJobIds((current) => {
      const isSaved = current.includes(jobId);
      if (isSaved) {
        removeLikedJobSnapshot(jobId);
        return current.filter((id) => id !== jobId);
      }

      const job = generatedJobs.find((match) => match.id === jobId);
      if (!job) {
        return current;
      }

      const snapshot: LikedJobSnapshot = {
        id: job.id,
        title: job.title,
        company: job.company,
        location: job.location,
        salary: job.salary,
        tags: job.jobTags,
        matchScore: job.matchScore,
        matchBadge: job.matchBadge,
        savedAt: Date.now(),
      };
      upsertLikedJobSnapshot(snapshot);
      return [...current, jobId];
    });
  };

  useEffect(() => {
    const parsed = loadMatchState();
    if (!parsed || !parsed.preferences) {
      return;
    }
    setPreferences(parsed.preferences);
  }, []);

  useEffect(() => {
    setSavedJobIds(loadLikedJobSnapshots().map((job) => job.id));
  }, []);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target;
      if (!(target instanceof Element)) {
        return;
      }
      if (target.closest('[data-job-action-area="true"]')) {
        return;
      }
      setActiveActionMenu(null);
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <>
      <Head>
        <title>JobMatch · Job Search Preferences</title>
        <meta name="description" content="Answer quick questions so we can personalize your job recommendations." />
      </Head>
      <AppShell menuItems={APP_MENU_ITEMS} profileTasks={DEFAULT_PROFILE_TASKS} profile={shellProfile}>
        <div className={styles.jobSearchPage}>
          <div className={styles.jobSearchHero}>
            <div className={styles.jobSearchHeroOrbit} aria-hidden="true" />
            <div className={styles.jobSearchHeroContent}>
              <p className={styles.jobSearchEyebrow}>Smart Job Matcher</p>
              <h1>
                Tell us the <span className={styles.jobSearchHighlight}>job you want</span> and we will craft a curated short list.
              </h1>
              <p className={styles.jobSearchHeroCopy}>
                Share your role, preferred location, and job style. Our AI blends employer demand, culture fit cues, and
                fresher friendly programs to surface the best opportunities.
              </p>
              <div className={styles.jobSearchHeroBadges}>
                <div className={styles.jobSearchHeroBadge}>
                  <span className={styles.jobSearchHeroIcon}>
                    <SparkIcon />
                  </span>
                  120+ fresher tracks monitored weekly
                </div>
                <div className={styles.jobSearchHeroBadge}>
                  <span className={styles.jobSearchHeroIcon}>
                    <PulseIcon />
                  </span>
                  Guided ramp plans & interview prep
                </div>
              </div>
            </div>
            <div className={styles.jobSearchFloatingCard} aria-live="polite">
              <div className={styles.jobSearchFloatingLabel}>Live pulse</div>
              <p>3 roles opened today that match your profile.</p>
              <div className={styles.jobSearchMotionDots} aria-hidden="true">
                <span />
                <span />
                <span />
              </div>
            </div>
          </div>

          <div className={styles.jobSearchLayout}>
            {isFormVisible ? (
              <form className={styles.jobSearchPreferenceForm} onSubmit={handleSubmit}>
                <div className={styles.jobSearchSectionTitle}>
                  <h2>Answer a few quick questions</h2>
                  <p>We will use these details to personalize your job board and alerts.</p>
                </div>

                <div className={styles.jobSearchFieldGroup}>
                  <label htmlFor="role-input" className={styles.jobSearchLabel}>
                    Which role are you targeting?
                  </label>
                  <div className={styles.jobSearchSelectWrap}>
                    <FieldIcon />
                    <select
                      id="role-input"
                      className={styles.jobSearchSelect}
                      value={preferences.role}
                      onChange={handleTextChange('role')}
                    >
                      <option value="">Select a role track</option>
                      {ROLE_SUGGESTIONS.map((role) => (
                        <option key={role} value={role}>
                          {role}
                        </option>
                      ))}
                      <option value="Other / custom">Other / custom</option>
                    </select>
                  </div>
                  <p className={styles.jobSearchHelperText}>Be specific so we can surface niche roles.</p>
                </div>

                <div className={styles.jobSearchFieldGroup}>
                  <label htmlFor="location-input" className={styles.jobSearchLabel}>
                    Preferred location
                  </label>
                  <div className={styles.jobSearchInputWrap}>
                    <LocationIcon />
                    <input
                      id="location-input"
                      type="text"
                      placeholder="Any city or remote preference"
                      className={styles.jobSearchInput}
                      value={preferences.location}
                      onChange={handleTextChange('location')}
                    />
                  </div>
                  <p className={styles.jobSearchHelperText}>We will mix local + remote matches if you leave this blank.</p>
                </div>

                <div className={styles.jobSearchFieldGroup}>
                  <span className={styles.jobSearchLabel}>Experience level</span>
                  <div className={styles.jobSearchCardGrid}>
                    {EXPERIENCE_OPTIONS.map((option) => (
                      <button
                        key={option.value}
                        type="button"
                        className={`${styles.jobSearchExperienceCard} ${option.value === preferences.experience ? styles.jobSearchExperienceCardActive : ''
                          }`}
                        onClick={() => handlePreferenceChange('experience', option.value)}
                        aria-pressed={option.value === preferences.experience}
                      >
                        <div className={styles.jobSearchCardHeading}>
                          <BadgeIcon />
                          <span>{option.label}</span>
                        </div>
                        <p>{option.helper}</p>
                      </button>
                    ))}
                  </div>
                </div>

                <div className={styles.jobSearchFieldGroup}>
                  <span className={styles.jobSearchLabel}>Work style</span>
                  <div className={styles.jobSearchToggleGroup}>
                    {WORK_OPTIONS.map((option) => (
                      <button
                        key={option.label}
                        type="button"
                        className={`${styles.jobSearchToggleButton} ${option.label === preferences.workModel ? styles.jobSearchToggleButtonActive : ''
                          }`}
                        onClick={() => handlePreferenceChange('workModel', option.label)}
                        aria-pressed={option.label === preferences.workModel}
                      >
                        <option.Icon />
                        {option.label}
                      </button>
                    ))}
                  </div>
                </div>

                <div className={styles.jobSearchFieldGroup}>
                  <span className={styles.jobSearchLabel}>Job type</span>
                  <div className={styles.jobSearchChips}>
                    {JOB_NATURE_OPTIONS.map((option) => (
                      <button
                        key={option.label}
                        type="button"
                        className={`${styles.jobSearchChip} ${option.label === preferences.jobNature ? styles.jobSearchChipActive : ''
                          }`}
                        onClick={() => handlePreferenceChange('jobNature', option.label)}
                        aria-pressed={option.label === preferences.jobNature}
                      >
                        <option.Icon />
                        {option.label}
                      </button>
                    ))}
                  </div>
                </div>

                <div className={styles.jobSearchActions}>
                  <button className={styles.jobSearchPrimaryButton} type="submit" disabled={isSubmitting}>
                    {isSubmitting ? 'Calibrating...' : 'Generate matches'}
                  </button>
                  <button className={styles.jobSearchSecondaryAction} type="button" onClick={handleSkip}>
                    Skip for now
                  </button>
                </div>
                {submitted ? (
                  <p className={styles.jobSearchConfirmation} role="status">
                    🎉 Preferences saved. Your job feed will reflect these filters.
                  </p>
                ) : null}
              </form>
            ) : generatedJobs.length ? (
              <div className={styles.jobSearchResults}>
                <div className={styles.jobSearchResultsHeader}>
                  <div>
                    <p className={styles.jobSearchEyebrow}>Matches ready</p>
                    <h2>Curated roles dialed to your targets</h2>
                    <p>These hot jobs blend your role, location, and work-style preferences for a perfect-fit short list.</p>
                  </div>
                  <button className={styles.jobSearchPrimaryButton} type="button" onClick={handleRestart}>
                    Start again
                  </button>
                </div>
                <div className={styles.jobSearchJobList}>
                  {generatedJobs.map((job) => (
                    <article key={job.id} className={styles.jobSearchJobCard}>
                      <div className={styles.jobSearchJobCardTop}>
                        <div className={styles.jobSearchCompanyLogo} aria-hidden="true">
                          {job.logoText}
                        </div>
                        <div className={styles.jobSearchJobDesc}>
                          <span className={styles.jobSearchPublishTag}>{job.posted}</span>
                          <h3
                            onClick={() => router.push(`/workspace/job-search/info/${job.jobId}`)}
                            style={{ cursor: 'pointer' }}
                            className={styles.jobSearchJobTitle}
                          >
                            {job.title}
                          </h3>
                          <div className={styles.jobSearchCompanyRow}>
                            <span>{job.company}</span>
                            <span>/</span>
                            <span>{job.companyType}</span>
                          </div>
                        </div>
                        <div className={styles.jobSearchMatchWidget} aria-label={`Match score ${job.matchScore}%`}>
                          <span className={styles.jobSearchMatchScore}>{job.matchScore}%</span>
                          <span className={styles.jobSearchMatchLabel}>{job.matchBadge}</span>
                        </div>
                      </div>
                      <div className={styles.jobSearchJobMetaGrid}>
                        {[
                          { label: 'Location', value: job.location, Icon: LocationMiniIcon },
                          { label: 'Work type', value: job.workType, Icon: WorkTypeIcon },
                          { label: 'Compensation', value: job.salary, Icon: CompensationIcon },
                          { label: 'Remote mode', value: job.remoteLabel, Icon: RemoteModeIcon },
                          { label: 'Seniority', value: job.seniority, Icon: SeniorityIcon },
                          { label: 'Experience', value: job.experience, Icon: ExperienceIcon },
                        ].map((item) => (
                          <div key={`${job.id}-${item.label}`} className={styles.jobSearchMetaItem}>
                            <item.Icon />
                            <div>
                              <strong>{item.value}</strong>
                            </div>
                          </div>
                        ))}
                      </div>
                      <div className={styles.jobSearchJobTags}>
                        {job.jobTags.map((tag) => (
                          <span key={`${job.id}-${tag}`}>{tag}</span>
                        ))}
                      </div>
                      <div className={styles.jobSearchJobActions}>
                        <div className={styles.jobSearchActionGroup}>
                          <div
                            className={`${styles.jobSearchDangerWrapper} ${activeActionMenu === job.id ? styles.jobSearchActionGroupActive : ''
                              }`}
                            data-job-action-area="true"
                            onMouseEnter={() => setActiveActionMenu(job.id)}
                            onMouseLeave={() => setActiveActionMenu(null)}
                          >
                            <button
                              className={`${styles.jobSearchIconButton} ${styles.jobSearchDangerButton}`}
                              type="button"
                              aria-label="Not interested"
                              aria-expanded={activeActionMenu === job.id}
                              onClick={() => setActiveActionMenu((current) => (current === job.id ? null : job.id))}
                            >
                              <DislikeIcon />
                            </button>
                            {activeActionMenu === job.id ? (
                              <div className={styles.jobSearchActionMenu} role="menu">
                                {[
                                  { label: 'Already applied', Icon: AppliedIcon },
                                  { label: 'Not interested', Icon: DislikeIcon },
                                  { label: 'Report issue', Icon: ReportIcon },
                                ].map((option) => (
                                  <button
                                    key={`${job.id}-${option.label}`}
                                    type="button"
                                    className={styles.jobSearchActionMenuItem}
                                    onClick={() => setActiveActionMenu(null)}
                                    aria-label={option.label}
                                  >
                                    <option.Icon />
                                    <span>{option.label}</span>
                                  </button>
                                ))}
                              </div>
                            ) : null}
                          </div>
                          <button
                            className={`${styles.jobSearchIconButton} ${styles.jobSearchSaveButton} ${savedJobIds.includes(job.id) ? styles.jobSearchSaveButtonActive : ''
                              }`}
                            type="button"
                            aria-label="Save this job"
                            aria-pressed={savedJobIds.includes(job.id)}
                            onClick={() => handleToggleSave(job.id)}
                          >
                            <LikeIcon />
                          </button>
                        </div>
                        <button className={styles.jobSearchApplyButton} type="button">
                          Apply now
                        </button>
                      </div>

                    </article>
                  ))}
                </div>
              </div>
            ) : (
              <div className={styles.jobSearchEmptyState}>
                <div className={styles.jobSearchEmptyTop}>
                  <span className={styles.jobSearchEmptyBadge}>Preferences paused</span>
                  <h2>Fill your preferences to unlock jobs</h2>
                  <p>We can’t show curated roles until you share the job type, location, and work style you want.</p>
                </div>
                <div className={styles.jobSearchEmptyHighlight}>
                  <span className={styles.jobSearchEmptyIcon}>
                    <SparkIcon />
                  </span>
                  <div>
                    <strong>Job feed on hold</strong>
                    <p>Your personalized matches stay hidden until we know your target role.</p>
                  </div>
                </div>
                <ul className={styles.jobSearchEmptyList}>
                  <li>Tell us the role + location so alerts stay relevant.</li>
                  <li>Choose work style and job type to unlock fresher-friendly tracks.</li>
                </ul>
                <div className={styles.jobSearchEmptyActions}>
                  <button className={styles.jobSearchPrimaryButton} type="button" onClick={handleRestart}>
                    Start again
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Job Details Modal */}
          {expandedJobId && (() => {
            const selectedJob = generatedJobs.find((job) => job.id === expandedJobId);
            if (!selectedJob) return null;

            return (
              <div className={styles.jobModal} onClick={() => setExpandedJobId(null)}>
                <div className={styles.jobModalContent} onClick={(e) => e.stopPropagation()}>
                  {/* Top Action Bar */}
                  <div className={styles.jobModalTopBar}>
                    <button
                      className={styles.jobModalClose}
                      onClick={() => setExpandedJobId(null)}
                      aria-label="Close"
                    >
                      ×
                    </button>
                    <div className={styles.jobModalBadges}>
                      <span className={styles.jobBadge}>Be an early applicant</span>
                      <span className={styles.jobBadge}>Less than 25 applicants</span>
                    </div>
                    <div className={styles.jobModalTopActions}>
                      <button className={styles.iconBtn} aria-label="Hide">🚫</button>
                      <button
                        className={styles.iconBtn}
                        onClick={() => handleToggleSave(selectedJob.id)}
                        aria-label="Save"
                      >
                        {savedJobIds.includes(selectedJob.id) ? '❤️' : '🤍'}
                      </button>
                      <button className={styles.applyNowBtn}>
                        APPLY NOW →
                      </button>
                    </div>
                  </div>

                  {/* Tabs */}
                  <div className={styles.jobModalTabs}>
                    <button className={`${styles.tabBtn} ${styles.tabBtnActive}`}>Overview</button>
                    <button className={styles.tabBtn}>Company</button>
                    <div className={styles.tabActions}>
                      <button className={styles.tabAction}>🔗 Share</button>
                      <button className={styles.tabAction}>🚩 Report Issue</button>
                      <button className={styles.tabAction}>📄 Original Job Post</button>
                    </div>
                  </div>

                  <div className={styles.jobModalBody}>
                    <div className={styles.jobModalMain}>
                      {/* Company Header */}
                      <div className={styles.companyHeader}>
                        <div className={styles.companyLogoSmall}>{selectedJob.logoText}</div>
                        <div>
                          <div className={styles.companyName}>
                            {selectedJob.company} · {selectedJob.posted}
                          </div>
                        </div>
                      </div>

                      {/* Job Title */}
                      <h1 className={styles.jobTitleLarge}>{selectedJob.title}</h1>

                      {/* Job Metadata */}
                      <div className={styles.jobMetadata}>
                        <div className={styles.metaRow}>
                          <span>📍 {selectedJob.location}</span>
                          <span>🕒 {selectedJob.workType}</span>
                        </div>
                        <div className={styles.metaRow}>
                          <span>🏢 {selectedJob.remoteLabel}</span>
                          <span>🎓 {selectedJob.seniority}</span>
                        </div>
                        <div className={styles.metaRow}>
                          <span>💰 {selectedJob.salary}</span>
                          <span>📅 {selectedJob.experience}</span>
                        </div>
                      </div>

                      {/* Resume Banner */}
                      <div className={styles.resumeBanner}>
                        <div className={styles.resumeBannerLeft}>
                          <span className={styles.resumeIcon}>🎯</span>
                          <span className={styles.resumeText}>Maximize your interview chances</span>
                        </div>
                        <button className={styles.resumeBtn}>✨ Generate Custom Resume</button>
                      </div>

                      {/* Description */}
                      <div className={styles.descriptionSection}>
                        <p className={styles.descriptionText}>
                          <strong>{selectedJob.company}</strong> {selectedJob.description}
                        </p>
                      </div>

                      {/* Responsibilities */}
                      <div className={styles.contentSection}>
                        <h3 className={styles.sectionTitle}>🎯 Key Responsibilities</h3>
                        <ul className={styles.bulletList}>
                          {selectedJob.responsibilities.map((item, idx) => (
                            <li key={idx}>{item}</li>
                          ))}
                        </ul>
                      </div>

                      {/* Qualifications */}
                      <div className={styles.contentSection}>
                        <h3 className={styles.sectionTitle}>🎓 Qualifications</h3>
                        <ul className={styles.bulletList}>
                          {selectedJob.qualifications.map((item, idx) => (
                            <li key={idx}>{item}</li>
                          ))}
                        </ul>
                      </div>

                      {/* Required Skills */}
                      <div className={styles.contentSection}>
                        <h3 className={styles.sectionTitle}>✅ Required Skills</h3>
                        <ul className={styles.bulletList}>
                          {selectedJob.required.map((item, idx) => (
                            <li key={idx}>{item}</li>
                          ))}
                        </ul>
                      </div>

                      {/* Benefits */}
                      <div className={styles.contentSection}>
                        <h3 className={styles.sectionTitle}>🎁 Benefits & Perks</h3>
                        <ul className={styles.bulletList}>
                          {selectedJob.benefits.map((item, idx) => (
                            <li key={idx}>{item}</li>
                          ))}
                        </ul>
                      </div>

                      {/* Industry Tags */}
                      <div className={styles.tagsSection}>
                        <div className={styles.industryTags}>
                          {selectedJob.jobTags.map((tag, idx) => (
                            <span key={idx} className={styles.industryTag}>{tag}</span>
                          ))}
                          {selectedJob.companyInfo.culture.map((tag, idx) => (
                            <span key={idx} className={styles.industryTag}>{tag}</span>
                          ))}
                        </div>
                        <div className={styles.sponsorBadge}>
                          ✅ H1B Sponsor Likely
                        </div>
                      </div>
                    </div>

                    {/* Right Sidebar - Match Score */}
                    <div className={styles.jobModalSidebar}>
                      <div className={styles.matchScoreCard}>
                        <div className={styles.mainMatchScore}>
                          <svg className={styles.scoreCircle} viewBox="0 0 100 100">
                            <circle cx="50" cy="50" r="45" fill="none" stroke="#e5e7eb" strokeWidth="8" />
                            <circle
                              cx="50" cy="50" r="45"
                              fill="none"
                              stroke="#10b981"
                              strokeWidth="8"
                              strokeDasharray={`${selectedJob.matchScore * 2.83} 283`}
                              strokeLinecap="round"
                              transform="rotate(-90 50 50)"
                            />
                          </svg>
                          <div className={styles.scoreValue}>{selectedJob.matchScore}%</div>
                        </div>
                        <div className={styles.matchLabel}>GOOD MATCH</div>
                      </div>

                      <div className={styles.subScores}>
                        <div className={styles.subScore}>
                          <svg className={styles.smallCircle} viewBox="0 0 100 100">
                            <circle cx="50" cy="50" r="45" fill="none" stroke="#e5e7eb" strokeWidth="10" />
                            <circle
                              cx="50" cy="50" r="45"
                              fill="none"
                              stroke="#10b981"
                              strokeWidth="10"
                              strokeDasharray="283 283"
                              strokeLinecap="round"
                              transform="rotate(-90 50 50)"
                            />
                          </svg>
                          <div className={styles.smallScoreValue}>100%</div>
                          <div className={styles.scoreLabel}>Exp. Level</div>
                        </div>
                        <div className={styles.subScore}>
                          <svg className={styles.smallCircle} viewBox="0 0 100 100">
                            <circle cx="50" cy="50" r="45" fill="none" stroke="#e5e7eb" strokeWidth="10" />
                            <circle
                              cx="50" cy="50" r="45"
                              fill="none"
                              stroke="#10b981"
                              strokeWidth="10"
                              strokeDasharray="209 283"
                              strokeLinecap="round"
                              transform="rotate(-90 50 50)"
                            />
                          </svg>
                          <div className={styles.smallScoreValue}>74%</div>
                          <div className={styles.scoreLabel}>Skill</div>
                        </div>
                        <div className={styles.subScore}>
                          <svg className={styles.smallCircle} viewBox="0 0 100 100">
                            <circle cx="50" cy="50" r="45" fill="none" stroke="#e5e7eb" strokeWidth="10" />
                            <circle
                              cx="50" cy="50" r="45"
                              fill="none"
                              stroke="#10b981"
                              strokeWidth="10"
                              strokeDasharray="130 283"
                              strokeLinecap="round"
                              transform="rotate(-90 50 50)"
                            />
                          </svg>
                          <div className={styles.smallScoreValue}>46%</div>
                          <div className={styles.scoreLabel}>Industry Exp.</div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            );
          })()}
        </div>
      </AppShell>
    </>
  );
}

function SparkIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 20 20" fill="none" aria-hidden="true">
      <path
        d="M10 1.5l1.8 4.8 4.7.4-3.6 3.1 1 4.9-3.9-2.3-3.9 2.3 1-4.9-3.6-3.1 4.7-.4L10 1.5z"
        fill="currentColor"
      />
    </svg>
  );
}

function PulseIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 20 20" fill="none" aria-hidden="true">
      <path
        d="M2 11h4l2-6 4 12 2-6h4"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function LocationIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path
        d="M12 3.5a6 6 0 016 6c0 4.5-6 11-6 11s-6-6.5-6-11a6 6 0 016-6z"
        stroke="currentColor"
        strokeWidth="1.4"
      />
      <circle cx="12" cy="9.5" r="2.2" stroke="currentColor" strokeWidth="1.4" />
    </svg>
  );
}

function FieldIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <rect x="3" y="4" width="18" height="16" rx="3" stroke="currentColor" strokeWidth="1.4" />
      <path d="M7 8h10M7 12h6M7 16h4" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" />
    </svg>
  );
}

function BadgeIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path
        d="M12 3l2.3 4.7 5.2.8-3.8 3.8.9 5.3L12 15.5l-4.6 2.1.9-5.3L4.5 8.5l5.2-.8L12 3z"
        stroke="currentColor"
        strokeWidth="1.3"
      />
    </svg>
  );
}

const ROLE_SUGGESTIONS = [
  'Product Manager',
  'Product Analyst',
  'Product Designer',
  'Marketing Associate',
  'Software Engineer',
  'Data Analyst',
  'Customer Success Associate',
  'Operations Analyst',
];

import Head from 'next/head';
import { useMemo, useState } from 'react';
import type { ChangeEvent, FormEvent, ReactElement, SVGProps } from 'react';
import AppShell from '../../../components/workspace/AppShell';
import {
  ContractIcon,
  FullTimeIcon,
  HybridIcon,
  InternshipIcon,
  OnsiteIcon,
  RemoteIcon,
} from '../../../components/workspace/icons';
import { APP_MENU_ITEMS, DEFAULT_PROFILE_TASKS } from '../../../components/workspace/navigation';
import styles from '../../../styles/workspace/JobSearch.module.css';

type PreferenceState = {
  role: string;
  location: string;
  experience: 'Fresher' | 'Junior' | 'Mid-level' | 'Senior';
  workModel: 'Remote' | 'Hybrid' | 'On-site';
  jobNature: 'Full-time' | 'Contract' | 'Internship';
};

const PROFILE = {
  name: 'Kuntal Maity',
  tagline: 'Update your target role',
  initials: 'KM',
  progressLabel: '12%',
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

const curatedBase = [
  {
    id: 'card-1',
    title: 'Junior Product Strategist',
    company: 'Nova Labs',
    meta: 'Remote · Entry level',
    chip: 'Design + PM pairing',
  },
  {
    id: 'card-2',
    title: 'Associate Growth Analyst',
    company: 'Pulse Analytics',
    meta: 'Hybrid · Training budget',
    chip: 'Coaching included',
  },
  {
    id: 'card-3',
    title: 'Product Trainee (AI)',
    company: 'Orbit Systems',
    meta: 'On-site · Rotational',
    chip: 'Mentorship pod',
  },
];

export default function WorkspaceJobSearchPage() {
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

  const matchScore = useMemo(() => {
    let score = 64;
    if (preferences.role.trim()) {
      score += 12;
    }
    if (preferences.location.trim()) {
      score += 8;
    }
    if (preferences.workModel === 'Remote') {
      score += 4;
    }
    if (preferences.experience === 'Fresher') {
      score += 6;
    } else if (preferences.experience === 'Junior') {
      score += 4;
    }
    if (preferences.jobNature === 'Internship') {
      score += 3;
    }
    return Math.min(96, score);
  }, [preferences]);

  const insightChips = useMemo(() => {
    const chips: string[] = [];
    if (preferences.experience === 'Fresher') {
      chips.push('Starter-friendly teams');
      chips.push('Upskilling budget');
    }
    if (preferences.workModel === 'Remote') {
      chips.push('Async collaboration');
    }
    if (preferences.role) {
      chips.push(`${preferences.role} community`);
    }
    if (!chips.length) {
      chips.push('Personalized ramp plan');
    }
    return chips.slice(0, 3);
  }, [preferences]);

  const curatedJobs = useMemo(() => {
    return curatedBase.map((item, index) => {
      const copy = { ...item };
      if (preferences.jobNature === 'Internship' && index === 0) {
        copy.title = 'Graduate Intern - Product Discovery';
        copy.meta = 'Remote · Mentorship ready';
        copy.chip = 'Portfolio spotlight';
      }
      if (preferences.role) {
        copy.title = copy.title.replace('Product', preferences.role);
      }
      return copy;
    });
  }, [preferences.jobNature, preferences.role]);

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
    setIsSubmitting(true);
    window.setTimeout(() => {
      setIsSubmitting(false);
      setSubmitted(true);
    }, 900);
  };

  const handleSkip = () => {
    setIsFormVisible(false);
    setSubmitted(false);
  };

  const handleRestart = () => {
    setIsFormVisible(true);
  };

  return (
    <>
      <Head>
        <title>JobMatch · Job Search Preferences</title>
        <meta name="description" content="Answer quick questions so we can personalize your job recommendations." />
      </Head>
      <AppShell menuItems={APP_MENU_ITEMS} profileTasks={DEFAULT_PROFILE_TASKS} profile={PROFILE}>
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
                      className={`${styles.jobSearchExperienceCard} ${
                        option.value === preferences.experience ? styles.jobSearchExperienceCardActive : ''
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
                      className={`${styles.jobSearchToggleButton} ${
                        option.label === preferences.workModel ? styles.jobSearchToggleButtonActive : ''
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
                      className={`${styles.jobSearchChip} ${
                        option.label === preferences.jobNature ? styles.jobSearchChipActive : ''
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
                  <button className={styles.jobSearchEmptyPrimary} type="button" onClick={handleRestart}>
                    Start again
                  </button>
                </div>
              </div>
            )}
          </div>
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

function ClockIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <circle cx="12" cy="12" r="8" stroke="currentColor" strokeWidth="1.4" />
      <path d="M12 8v4l3 2" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" />
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

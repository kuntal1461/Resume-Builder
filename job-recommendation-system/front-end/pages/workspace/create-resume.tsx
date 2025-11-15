import Head from 'next/head';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import AppShell from '../../components/workspace/AppShell';
import { APP_MENU_ITEMS, DEFAULT_PROFILE_TASKS } from '../../components/workspace/navigation';
import styles from '../../styles/workspace/CreateResume.module.css';

const PROFILE = {
  name: 'Kuntal Maity',
  tagline: 'Set your target role',
  initials: 'KM',
  progressLabel: '5%',
};

const FEATURE_CARDS = [
  {
    title: 'AI drafting partner',
    description: 'Drop in your experience and get bullet points rewritten with quantifiable impact.',
    detail: 'Auto-injects metrics, action verbs, and ATS keywords tailored to each target role.',
  },
  {
    title: 'Template switcher',
    description: 'Preview premium layouts without losing your content structure.',
    detail: 'One click swaps typography, spacing, and accent colors for any template style.',
  },
  {
    title: 'Collaboration threads',
    description: 'Invite a coach or mentor to comment directly on sections.',
    detail: 'Threaded feedback stays anchored to each bullet so revisions stay focused.',
  },
];

const WORKFLOW_STEPS = [
  {
    title: 'Calibrate your target',
    highlight: 'Set the role, seniority, and industries you want to pursue.',
    description:
      'We translate your target inputs into scoring criteria so every suggestion ladders up to the right audience.',
  },
  {
    title: 'Rewrite with AI guardrails',
    highlight: 'Use guided prompts to spin up fresh bullet points.',
    description:
      'Choose the accomplishments that matter most. The builder pairs them with measurable impact language automatically.',
  },
  {
    title: 'Design the layout',
    highlight: 'Pick a modern template, adjust brand colors, and reorder sections.',
    description:
      'Live preview updates instantly while smart spacing keeps everything perfectly aligned for ATS parsing.',
  },
  {
    title: 'Export and duplicate',
    highlight: 'Generate PDF + DOCX versions or clone for a new role.',
    description:
      'Need a variant for product vs. data roles? Duplicate in seconds and let AI refocus the language.',
  },
];

const BOOSTERS = [
  { title: 'ATS confidence score', description: 'See how your resume ranks before you apply.', pill: '+25 pts avg' },
  { title: 'Keyword heatmap', description: 'Surface the skills each job description cares about most.', pill: 'Live' },
  { title: 'Interview handoff', description: 'Auto-generate talking points aligned to each bullet.', pill: 'New' },
];

const DEFAULT_NUMBER_FORMAT = new Intl.NumberFormat('en-US');
const COMPACT_NUMBER_FORMAT = new Intl.NumberFormat('en-US', { notation: 'compact', maximumFractionDigits: 1 });

type HeroStat = {
  label: string;
  value: number;
  prefix?: string;
  suffix?: string;
  detail?: string;
  formatter?: (value: number) => string;
};

const HERO_STATS: HeroStat[] = [
  { label: 'Avg resume score boost', value: 27, prefix: '+', suffix: ' pts', detail: 'Across 2M+ submissions' },
  { label: 'Templates included', value: 18, suffix: ' premium', detail: 'Curated by hiring managers' },
  {
    label: 'Weekly exports',
    value: 12000,
    detail: 'PDF / DOCX sent last week',
    formatter: (value) => `${COMPACT_NUMBER_FORMAT.format(Math.max(value, 1))}+`,
  },
];

const TESTIMONIAL = {
  quote:
    '“The modern builder let me spin up three targeted resumes in one morning. I went from rewrites taking hours to minutes.”',
  author: 'Priya Desai',
  role: 'Sr. Product Manager · Driftwave',
};

export default function CreateResumePage() {
  const [statValues, setStatValues] = useState<number[]>(() => HERO_STATS.map(() => 0));

  useEffect(() => {
    if (typeof window === 'undefined') {
      return;
    }
    const prefersReducedMotion = window.matchMedia?.('(prefers-reduced-motion: reduce)').matches;
    if (prefersReducedMotion) {
      setStatValues(HERO_STATS.map((stat) => stat.value));
      return;
    }

    const duration = 1200;
    const start = performance.now();
    let raf: number;

    const step = (now: number) => {
      const progress = Math.min(1, (now - start) / duration);
      const eased = 1 - Math.pow(1 - progress, 3);
      setStatValues(HERO_STATS.map((stat) => Math.round(stat.value * eased)));
      if (progress < 1) {
        raf = requestAnimationFrame(step);
      }
    };

    raf = requestAnimationFrame(step);
    return () => cancelAnimationFrame(raf);
  }, []);

  const formatStatValue = (stat: HeroStat, animatedValue: number) => {
    const safeValue = Math.min(stat.value, animatedValue);
    const normalized = safeValue === 0 && stat.value > 0 ? 1 : safeValue;
    if (stat.formatter) {
      return stat.formatter(normalized);
    }
    const formatted =
      stat.value >= 1000 ? DEFAULT_NUMBER_FORMAT.format(normalized) : normalized.toString();
    return `${stat.prefix ?? ''}${formatted}${stat.suffix ?? ''}`;
  };

  return (
    <>
      <Head>
        <title>JobMatch · Create Resume</title>
        <meta name="description" content="Launch a modern, AI-assisted resume builder from your JobMatch workspace." />
      </Head>
      <AppShell menuItems={APP_MENU_ITEMS} profileTasks={DEFAULT_PROFILE_TASKS} profile={PROFILE}>
        <div className={styles.page}>
          <section className={styles.hero}>
            <p className={styles.heroTag}>Modern builder · Beta</p>
            <h1>Create a resume that rewrites itself for every role</h1>
            <p className={styles.heroLead}>
              Launch the new JobMatch resume experience with adaptive templates, AI drafting, and instant ATS scoring in
              a single flow.
            </p>
            <div className={styles.heroActions}>
              <Link href="/workspace/create-resume/resume-builder" className={styles.primaryAction}>
                Launch builder
              </Link>
              <button type="button" className={styles.secondaryAction} aria-label="Import an existing resume file">
                Import existing resume
              </button>
            </div>
            <ul className={styles.heroStats}>
              {HERO_STATS.map((stat, index) => (
                <li key={stat.label}>
                  <div className={styles.statBadge}>0{index + 1}</div>
                  <div>
                    <strong>{formatStatValue(stat, statValues[index] ?? 0)}</strong>
                    <span>{stat.label}</span>
                    {stat.detail ? <p>{stat.detail}</p> : null}
                  </div>
                </li>
              ))}
            </ul>
          </section>

          <section className={styles.featureGrid} aria-label="Builder highlights">
            {FEATURE_CARDS.map((card) => (
              <article key={card.title} className={styles.featureCard}>
                <p className={styles.cardEyebrow}>Feature</p>
                <h2>{card.title}</h2>
                <p>{card.description}</p>
                <p className={styles.cardDetail}>{card.detail}</p>
              </article>
            ))}
          </section>

          <section id="workflow" className={styles.workflow} aria-label="Resume creation workflow">
            <div className={styles.workflowIntro}>
              <p className={styles.sectionTag}>Guided workflow</p>
              <h2>Go from blank page to tailored resume in four stages</h2>
              <p>
                Each step locks in structure, writing, and polish. You can save progress at any point and pick up right
                where you left off.
              </p>
            </div>
            <ol className={styles.workflowSteps}>
              {WORKFLOW_STEPS.map((step) => (
                <li key={step.title} className={styles.workflowStep}>
                  <span className={styles.workflowStepTitle}>{step.title}</span>
                  <p className={styles.workflowHighlight}>{step.highlight}</p>
                  <p>{step.description}</p>
                </li>
              ))}
            </ol>
          </section>

          <section className={styles.boosters} aria-label="Product boosters">
            <div className={styles.sectionHeader}>
              <p className={styles.sectionTag}>Built-in boosters</p>
              <h2>Everything teams asked for in a modern resume flow</h2>
              <p>Stack insights, export-ready formats, and recruiter-friendly storytelling without extra tabs.</p>
            </div>
            <div className={styles.boosterGrid}>
              {BOOSTERS.map((item) => (
                <article key={item.title} className={styles.boosterCard}>
                  <span className={styles.boosterPill}>{item.pill}</span>
                  <h3>{item.title}</h3>
                  <p>{item.description}</p>
                </article>
              ))}
            </div>
          </section>

          <section className={styles.testimonial} aria-label="Customer testimonial">
            <div className={styles.testimonialContent}>
              <p className={styles.sectionTag}>Result highlight</p>
              <p className={styles.testimonialQuote}>{TESTIMONIAL.quote}</p>
              <p className={styles.testimonialAuthor}>{TESTIMONIAL.author}</p>
              <p className={styles.testimonialRole}>{TESTIMONIAL.role}</p>
            </div>
            <div className={styles.testimonialCta}>
              <h3>Ready to create?</h3>
              <p>Spin up your first modern resume in minutes.</p>
              <Link href="/workspace/create-resume/resume-builder" className={styles.primaryAction}>
                Start building
              </Link>
            </div>
          </section>
        </div>
      </AppShell>
    </>
  );
}

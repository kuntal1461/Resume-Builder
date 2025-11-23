import Head from 'next/head';
import Link from 'next/link';
import AppShell from '../../../components/workspace/AppShell';
import { APP_MENU_ITEMS, DEFAULT_PROFILE_TASKS } from '../../../components/workspace/navigation';
import { createGuestWorkspaceProfile } from '../../../components/workspace/profileFallback';
import { useWorkspaceShellProfile } from '../../../components/workspace/useWorkspaceShellProfile';
import styles from '../../../styles/workspace/CareerProfileInsights.module.css';

const PROFILE = createGuestWorkspaceProfile({
  tagline: 'Set your target role',
  progressLabel: '45%',
});

const INSIGHTS = [
  {
    title: 'Product Strategy & Discovery',
    description:
      'You excel at aligning customer insights with business goals. Stakeholders praise how you translate discovery into clear roadmaps.',
    tags: ['Discovery Workshops', 'Customer Voice', 'Roadmapping'],
    scoreLabel: 'Strength',
    scoreDelta: '+18% vs peers',
    updatedAt: 'Updated 3 days ago',
  },
  {
    title: 'Execution Velocity',
    description:
      'Hiring managers noted consistent delivery across complex launches. Reinforce this story with quantified impact and launch metrics.',
    tags: ['Delivery Excellence', 'Cross-functional Leadership'],
    scoreLabel: 'Opportunity',
    scoreDelta: 'Showcase 2 launches',
    updatedAt: 'Updated last week',
  },
  {
    title: 'Storytelling & Influence',
    description:
      'Interview feedback shows strong storytelling with executives. Build a narrative kit to reuse across panel interviews and outreach.',
    tags: ['Executive Briefs', 'Interview Narrative'],
    scoreLabel: 'Advantage',
    scoreDelta: 'Top 10%',
    updatedAt: 'Updated 5 days ago',
  },
];

const NEXT_STEPS = [
  {
    title: 'Refresh customer impact statements',
    description: 'Add quantified outcomes for the last two launches so ATS scoring highlights business impact automatically.',
    href: '/workspace/career-profile/insights?section=impact',
  },
  {
    title: 'Record a 90-second pitch',
    description: 'Use your storytelling strength to record a reusable elevator pitch. We\'ll surface it on matched roles and outreach scripts.',
    href: '/workspace/career-profile/pitch',
  },
  {
    title: 'Add two stakeholder quotes',
    description: 'Collect short testimonials from design and engineering leads to reinforce your collaborative leadership theme.',
    href: '/workspace/career-profile/cover-letter',
  },
];

export default function CareerProfileInsightsPage() {
  const shellProfile = useWorkspaceShellProfile(PROFILE);
  return (
    <>
      <Head>
        <title>JobMatch · My Career Insights</title>
        <meta
          name="description"
          content="Review your personalized career insights, strengths, and growth levers to refine your JobMatch profile."
        />
      </Head>
      <AppShell menuItems={APP_MENU_ITEMS} profileTasks={DEFAULT_PROFILE_TASKS} profile={shellProfile}>
        <div className={styles.page}>
          <section className={styles.hero}>
            <h1 className={styles.heroTitle}>My Career Insights</h1>
            <p className={styles.heroSubtitle}>
              Your profile analysis surfaces the strengths to double down on and the levers that will unlock the next role. Refresh these
              insights as you ship new wins, capture customer impact, and gather stakeholder feedback.
            </p>
          </section>

          <section>
            <div className={styles.sectionHeader}>
              <h2 className={styles.sectionTitle}>What hiring teams notice first</h2>
              <Link href="/workspace/career-profile/profile" className={styles.sectionAction}>
                Update profile <span aria-hidden="true">→</span>
              </Link>
            </div>
            <div className={styles.insightsGrid}>
              {INSIGHTS.map((insight) => (
                <article key={insight.title} className={styles.insightCard}>
                  <h3 className={styles.insightTitle}>{insight.title}</h3>
                  <p className={styles.insightCopy}>{insight.description}</p>
                  <ul className={styles.insightTags}>
                    {insight.tags.map((tag) => (
                      <li key={tag} className={styles.insightTag}>
                        {tag}
                      </li>
                    ))}
                  </ul>
                  <div className={styles.insightMeta}>
                    <span className={styles.insightScore}>
                      {insight.scoreLabel}
                      <span aria-hidden="true">•</span>
                      {insight.scoreDelta}
                    </span>
                    <span className={styles.insightUpdated}>{insight.updatedAt}</span>
                  </div>
                </article>
              ))}
            </div>
          </section>

          <section>
            <div className={styles.sectionHeader}>
              <h2 className={styles.sectionTitle}>Keep momentum going</h2>
            </div>
            <div className={styles.nextSteps}>
              {NEXT_STEPS.map((step) => (
                <article key={step.title} className={styles.nextStepCard}>
                  <h3 className={styles.nextStepTitle}>{step.title}</h3>
                  <p className={styles.nextStepCopy}>{step.description}</p>
                  <Link className={styles.ctaLink} href={step.href}>
                    View guidance <span aria-hidden="true">→</span>
                  </Link>
                </article>
              ))}
            </div>
          </section>
        </div>
      </AppShell>
    </>
  );
}

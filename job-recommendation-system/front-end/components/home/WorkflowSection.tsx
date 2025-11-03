import styles from '../../styles/home/Home.module.css';

const STEPS = [
  {
    title: 'Import & polish',
    description:
      'Upload your existing resume or start fresh. Smart suggestions help you highlight measurable wins and project impact.',
    metric: '7 min',
    metricLabel: 'avg. to first draft',
  },
  {
    title: 'Match intelligently',
    description:
      'Our graph pairs your profile with verified openings that align with your skills, values, and growth trajectory.',
    metric: '12 roles',
    metricLabel: 'average weekly matches',
  },
  {
    title: 'Connect & iterate',
    description:
      'Activate concierge intros or share tracked links. Built-in interview prep keeps feedback and coaching in one place.',
    metric: '3.4×',
    metricLabel: 'higher response rate',
  },
];

export default function WorkflowSection() {
  return (
    <section id="workflow" className={styles.workflowSection}>
      <div className={styles.workflowInner}>
        <div className={styles.workflowIntro}>
          <span className={styles.sectionEyebrow}>How it works</span>
          <h2>From upload to offer—an end-to-end job search co-pilot.</h2>
          <p>
            JobMatch orchestrates your search across research, applications, and networking. We keep progress visible so
            you always know your next best move.
          </p>
        </div>
        <div className={styles.workflowSteps}>
          {STEPS.map((step, index) => (
            <article key={step.title} className={styles.workflowCard}>
              <div className={styles.workflowIndex}>{index + 1}</div>
              <header>
                <h3>{step.title}</h3>
                <p>{step.description}</p>
              </header>
              <footer>
                <strong>{step.metric}</strong>
                <span>{step.metricLabel}</span>
              </footer>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

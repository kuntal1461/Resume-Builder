import styles from '../../styles/Home.module.css';

const FEATURES = [
  {
    title: 'Resume builder with AI guardrails',
    description:
      'Start from battle-tested templates, then let our AI tailor bullet points to your target role—always staying true to your experience.',
    icon: '🛠️',
  },
  {
    title: 'Real-time market insights',
    description:
      'See which skills recruiters flag as must-haves for every match, plus salary bands benchmarked by geography and seniority.',
    icon: '📊',
  },
  {
    title: 'Warm intros to hiring teams',
    description:
      'We collaborate with partner companies to route verified candidates directly to the recruiter’s desk—skipping the black box.',
    icon: '🤝',
  },
];

export default function FeatureHighlights() {
  return (
    <section id="features" className={styles.featuresSection}>
      <div className={styles.sectionHeading}>
        <span className={styles.sectionEyebrow}>Why candidates switch to JobMatch</span>
        <h2>A modern toolkit for landing the right role, faster.</h2>
        <p>
          Every feature is optimized for speed and clarity—so you can spend more time meeting teams and less time tweaking
          formatting.
        </p>
      </div>
      <div className={styles.featuresGrid}>
        {FEATURES.map((feature) => (
          <article key={feature.title} className={styles.featureCard}>
            <div className={styles.featureIcon} aria-hidden="true">
              {feature.icon}
            </div>
            <h3>{feature.title}</h3>
            <p>{feature.description}</p>
          </article>
        ))}
      </div>
    </section>
  );
}

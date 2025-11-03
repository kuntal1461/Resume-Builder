import styles from '../../styles/home/Home.module.css';

const PLANS = [
  {
    name: 'Starter',
    price: '$0',
    cadence: 'forever',
    highlights: ['Resume templates & AI suggestions', 'Weekly job matches', 'Application tracking dashboard'],
    badge: 'Most popular',
  },
  {
    name: 'Pro',
    price: '$19',
    cadence: 'per month',
    highlights: ['Unlimited tailored resumes', 'Recruiter introductions', 'Interview question bank & prep sprints'],
    badge: 'Best for active search',
  },
  {
    name: 'Executive',
    price: '$79',
    cadence: 'per month',
    highlights: ['Dedicated career strategist', 'Leadership peer network', 'Offer negotiation coaching'],
    badge: 'Limited spots',
  },
];

export default function PricingTeaser() {
  return (
    <section id="pricing" className={styles.pricingSection}>
      <div className={styles.sectionHeading}>
        <span className={styles.sectionEyebrow}>Flexible plans</span>
        <h2>Choose a plan that grows with your ambitions.</h2>
        <p>Start for free, upgrade anytime. Cancel in two clicks.</p>
      </div>
      <div className={styles.pricingGrid}>
        {PLANS.map((plan) => (
          <article key={plan.name} className={styles.pricingCard}>
            <header>
              <div className={styles.pricingBadge}>{plan.badge}</div>
              <h3>{plan.name}</h3>
              <div className={styles.pricingValue}>
                <span>{plan.price}</span>
                <small>{plan.cadence}</small>
              </div>
            </header>
            <ul>
              {plan.highlights.map((highlight) => (
                <li key={highlight}>{highlight}</li>
              ))}
            </ul>
            <button type="button">Choose plan</button>
          </article>
        ))}
      </div>
    </section>
  );
}

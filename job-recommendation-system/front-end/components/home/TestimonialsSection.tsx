import styles from '../../styles/Home.module.css';

const TESTIMONIALS = [
  {
    quote:
      'Within a week my resume score jumped from 63 to 92, and the matches I received were spot-on. Landed two onsite interviews in 10 days.',
    name: 'Priya Sharma',
    title: 'Senior Product Manager · HexaCloud',
  },
  {
    quote:
      'The recruiter handoff was seamless. JobMatch surfaced a role at a company I never would have found, then tailored my bullet points to the JD.',
    name: 'Luis Martinez',
    title: 'Staff ML Engineer · RedSky Robotics',
  },
  {
    quote:
      'I loved having personalized interview briefs fed from my resume. The insights turned a cold outreach into a signed offer.',
    name: 'Monica Allen',
    title: 'Revenue Operations Lead · Brightside',
  },
];

export default function TestimonialsSection() {
  return (
    <section id="testimonials" className={styles.testimonialsSection}>
      <div className={styles.sectionHeading}>
        <span className={styles.sectionEyebrow}>Success stories</span>
        <h2>Real candidates. Real offers. Happier Mondays.</h2>
        <p>
          Thousands of global professionals rely on JobMatch to navigate career pivots, promotions, and relocations with
          confidence.
        </p>
      </div>
      <div className={styles.testimonialsGrid}>
        {TESTIMONIALS.map((testimonial) => (
          <figure key={testimonial.name} className={styles.testimonialCard}>
            <blockquote>“{testimonial.quote}”</blockquote>
            <figcaption>
              <strong>{testimonial.name}</strong>
              <span>{testimonial.title}</span>
            </figcaption>
          </figure>
        ))}
      </div>
    </section>
  );
}

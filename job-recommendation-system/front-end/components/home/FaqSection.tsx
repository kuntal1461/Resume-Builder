import styles from '../../styles/Home.module.css';

const FAQS = [
  {
    question: 'How accurate are the job matches?',
    answer:
      'We partner directly with hiring teams to understand current openings. Our engine blends your resume, preferences, and behavioral signals to surface roles with an average 87% relevance score.',
  },
  {
    question: 'Will uploading my resume stay private?',
    answer:
      'Absolutely. Resumes are processed with bank-level encryption and never shared without your explicit permission. You can delete your data permanently at any time.',
  },
  {
    question: 'Can JobMatch rewrite my resume for every role?',
    answer:
      'Yes. With Pro plans and above, AI-assisted tailoring helps you spin up new versions aligned to each job description in minutes, including cover letter drafts.',
  },
  {
    question: 'Do you support international job searches?',
    answer:
      'We currently match candidates with employers across 25 countries and factor in hybrid, remote, and relocation preferences automatically.',
  },
];

export default function FaqSection() {
  return (
    <section id="faq" className={styles.faqSection}>
      <div className={styles.sectionHeading}>
        <span className={styles.sectionEyebrow}>FAQ</span>
        <h2>Answers before you hit apply.</h2>
        <p>If you need anything else, our concierge team replies in under 4 business hours.</p>
      </div>
      <div className={styles.faqList}>
        {FAQS.map((faq) => (
          <details key={faq.question} className={styles.faqItem}>
            <summary>{faq.question}</summary>
            <p>{faq.answer}</p>
          </details>
        ))}
      </div>
    </section>
  );
}

import Head from 'next/head';
import { useMemo, useState } from 'react';
import AppShell from '../../../components/workspace/AppShell';
import { CompensationIcon, RemoteModeIcon, WorkTypeIcon } from '../../../components/workspace/icons';
import { APP_MENU_ITEMS, DEFAULT_PROFILE_TASKS } from '../../../components/workspace/navigation';
import { createGuestWorkspaceProfile } from '../../../components/workspace/profileFallback';
import { useWorkspaceShellProfile } from '../../../components/workspace/useWorkspaceShellProfile';
import styles from '../../../styles/workspace/SalaryAnalyzer.module.css';

type Level = 'Intern' | 'Junior' | 'Mid' | 'Senior' | 'Lead/Staff' | 'Manager' | 'Director+';
type Period = 'Annual' | 'Hourly';
type WorkMode = 'Remote' | 'Hybrid' | 'Onsite';

const DEFAULT_PROFILE = createGuestWorkspaceProfile({
  tagline: 'Set your target role',
  progressLabel: '5%',
});

const HERO_HIGHLIGHTS = [
  { label: 'Level-calibrated bands', helper: 'Intern → Director+', Icon: WorkTypeIcon },
  { label: 'Remote, hybrid, onsite aware', helper: 'Location multipliers', Icon: RemoteModeIcon },
  { label: 'Offer-ready benchmarks', helper: 'Export to negotiation plan', Icon: CompensationIcon },
];

const HERO_STATS = [
  { label: 'Markets tracked', value: '24' },
  { label: 'Levels modeled', value: '7' },
  { label: 'Median uplift', value: '+12%' },
];

const LEVEL_BASELINES: Record<Level, [number, number]> = {
  Intern: [20000, 35000],
  Junior: [55000, 80000],
  Mid: [80000, 120000],
  Senior: [120000, 170000],
  'Lead/Staff': [160000, 220000],
  Manager: [140000, 220000],
  'Director+': [200000, 320000],
};

const LOCATION_MULTIPLIERS: Record<string, number> = {
  'San Francisco Bay Area': 1.3,
  'New York City': 1.2,
  Seattle: 1.18,
  Austin: 1.05,
  London: 1.05,
  Other: 0.92,
};

const HOURS_PER_YEAR = 2080; // 40h * 52w

function clamp(n: number, min: number, max: number) {
  return Math.min(max, Math.max(min, n));
}

export default function SalaryAnalyzerPage() {
  const shellProfile = useWorkspaceShellProfile(DEFAULT_PROFILE);
  const [title, setTitle] = useState('Software Engineer');
  const [company, setCompany] = useState('');
  const [level, setLevel] = useState<Level>('Mid');
  const [location, setLocation] = useState('Other');
  const [period, setPeriod] = useState<Period>('Annual');
  const [workMode, setWorkMode] = useState<WorkMode>('Remote');
  const [currency, setCurrency] = useState<'USD' | 'EUR' | 'GBP'>('USD');
  const [offerBase, setOfferBase] = useState<string>('');
  const [offerBonus, setOfferBonus] = useState<string>('');
  const [offerEquity, setOfferEquity] = useState<string>('');
  const [analyzed, setAnalyzed] = useState(false);

  const multiplier = useMemo(() => LOCATION_MULTIPLIERS[location] ?? 1.0, [location]);

  const market = useMemo(() => {
    const [low, high] = LEVEL_BASELINES[level];
    let min = Math.round(low * multiplier);
    let max = Math.round(high * multiplier);
    let mid = Math.round((min + max) / 2);

    if (period === 'Hourly') {
      min = Math.round(min / HOURS_PER_YEAR);
      mid = Math.round(mid / HOURS_PER_YEAR);
      max = Math.round(max / HOURS_PER_YEAR);
    }
    return { min, mid, max };
  }, [level, multiplier, period]);

  const offer = useMemo(() => {
    const base = Number.parseFloat(offerBase || '0');
    const bonus = Number.parseFloat(offerBonus || '0');
    const equity = Number.parseFloat(offerEquity || '0');
    const total = base + bonus + equity;
    return { base, bonus, equity, total };
  }, [offerBase, offerBonus, offerEquity]);

  const percentile = useMemo(() => {
    if (!offer.base) return 0;
    const p = ((offer.base - market.min) / (market.max - market.min)) * 100;
    return clamp(Math.round(p), 0, 100);
  }, [offer.base, market.min, market.max]);

  const currencySymbol = currency === 'USD' ? '$' : currency === 'EUR' ? '€' : '£';

  const fmt = (n: number) =>
    `${currencySymbol}${n.toLocaleString(undefined, {
      maximumFractionDigits: period === 'Annual' ? 0 : 2,
    })}${period === 'Hourly' ? '/hr' : ''}`;

  return (
    <>
      <Head>
        <title>JobMatch · Salary Analyzer</title>
        <meta name="description" content="Estimate fair salary ranges by role, level, and location." />
      </Head>
      <AppShell menuItems={APP_MENU_ITEMS} profileTasks={DEFAULT_PROFILE_TASKS} profile={shellProfile}>
        <div className={styles.page}>
          <section className={styles.salaryHeroSection} aria-label="Salary Analyzer hero">
            <div className={styles.salaryHeroCopy}>
              <p className={styles.salaryHeroEyebrow}>Salary Analyzer</p>
              <h1>
                Lead every salary conversation with <span className={styles.salaryHeroHighlight}>evidence.</span>
              </h1>
              <p>
                Calibrate the right range for your role before countering an offer. Blend level, geography, and work model data
                to chart a confident response.
              </p>
              <ul className={styles.salaryHeroHighlights}>
                {HERO_HIGHLIGHTS.map(({ label, helper, Icon }) => (
                  <li key={label}>
                    <div className={styles.salaryHeroHighlightIcon} role="presentation">
                      <Icon aria-hidden="true" />
                    </div>
                    <div>
                      <span>{label}</span>
                      <p>{helper}</p>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
            <div className={styles.salaryHeroPanel} aria-live="polite">
              <div className={styles.salaryHeroPanelHeader}>Live benchmark signals</div>
              <dl className={styles.salaryHeroStats}>
                {HERO_STATS.map(({ label, value }) => (
                  <div key={label}>
                    <dt>{label}</dt>
                    <dd>{value}</dd>
                  </div>
                ))}
              </dl>
              <div className={styles.salaryHeroPanelFoot}>
                <p>Use these signals to lock your negotiation guardrails before modeling a full offer.</p>
              </div>
            </div>
          </section>

          <section className={styles.card} aria-label="Inputs">
            <header className={styles.formHeader}>
              <div>
                <p className={styles.formEyebrow}>Comp target builder</p>
                <h2>Design your salary brief</h2>
                <p>Pair role context with offer details to generate a negotiation-ready band before you counter.</p>
              </div>
              <div className={styles.headerBadges} aria-label="Data coverage highlights">
                <span className={styles.headerBadge}>Level aware</span>
                <span className={styles.headerBadge}>Geo indexed</span>
                <span className={styles.headerBadge}>Offer ready</span>
              </div>
            </header>

            <div className={styles.formGrid}>
              <div className={styles.inputGroup}>
                <label className={styles.label} htmlFor="company-name">
                  Company name
                </label>
                <input
                  id="company-name"
                  className={styles.input}
                  value={company}
                  onChange={(e) => setCompany(e.target.value)}
                  placeholder="e.g., Acme Corp"
                />
              </div>
              <div className={styles.inputGroup}>
                <label className={styles.label} htmlFor="role-title">
                  Role title
                </label>
                <input id="role-title" className={styles.input} value={title} onChange={(e) => setTitle(e.target.value)} />
              </div>
              <div className={styles.inputGroup}>
                <label className={styles.label} htmlFor="level">
                  Level
                </label>
                <select id="level" className={styles.select} value={level} onChange={(e) => setLevel(e.target.value as Level)}>
                  {Object.keys(LEVEL_BASELINES).map((lvl) => (
                    <option key={lvl} value={lvl}>
                      {lvl}
                    </option>
                  ))}
                </select>
              </div>
              <div className={styles.inputGroup}>
                <label className={styles.label} htmlFor="location">
                  Location
                </label>
                <select
                  id="location"
                  className={styles.select}
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                >
                  {Object.keys(LOCATION_MULTIPLIERS).map((loc) => (
                    <option key={loc} value={loc}>
                      {loc}
                    </option>
                  ))}
                </select>
              </div>
              <div className={styles.inputGroup}>
                <label className={styles.label} htmlFor="workMode">
                  Work mode
                </label>
                <select
                  id="workMode"
                  className={styles.select}
                  value={workMode}
                  onChange={(e) => setWorkMode(e.target.value as WorkMode)}
                >
                  <option>Remote</option>
                  <option>Hybrid</option>
                  <option>Onsite</option>
                </select>
              </div>
              <div className={styles.inputGroup}>
                <label className={styles.label} htmlFor="period">
                  Pay period
                </label>
                <select id="period" className={styles.select} value={period} onChange={(e) => setPeriod(e.target.value as Period)}>
                  <option>Annual</option>
                  <option>Hourly</option>
                </select>
              </div>
              <div className={styles.inputGroup}>
                <label className={styles.label} htmlFor="currency">
                  Currency
                </label>
                <select id="currency" className={styles.select} value={currency} onChange={(e) => setCurrency(e.target.value as 'USD' | 'EUR' | 'GBP')}>
                  <option>USD</option>
                  <option>EUR</option>
                  <option>GBP</option>
                </select>
              </div>
            </div>

            <div className={styles.formGrid} style={{ marginTop: 16 }}>
              <div className={styles.inputGroup}>
                <label className={styles.label} htmlFor="offerBase">
                  Your offer base ({currency})
                </label>
                <input
                  id="offerBase"
                  className={styles.input}
                  type="number"
                  min={0}
                  placeholder={period === 'Annual' ? '120000' : '60'}
                  value={offerBase}
                  onChange={(e) => setOfferBase(e.target.value)}
                />
              </div>
              <div className={styles.inputGroup}>
                <label className={styles.label} htmlFor="offerBonus">
                  Target bonus ({currency})
                </label>
                <input id="offerBonus" className={styles.input} type="number" min={0} value={offerBonus} onChange={(e) => setOfferBonus(e.target.value)} />
              </div>
              <div className={styles.inputGroup}>
                <label className={styles.label} htmlFor="offerEquity">
                  Equity annualized ({currency})
                </label>
                <input id="offerEquity" className={styles.input} type="number" min={0} value={offerEquity} onChange={(e) => setOfferEquity(e.target.value)} />
              </div>
            </div>
            <div className={styles.actions}>
              <button
                type="button"
                className={styles.primaryButton}
                onClick={() => setAnalyzed(true)}
                aria-label="Analyze salary"
              >
                Analyze salary
              </button>
            </div>
          </section>

          {analyzed ? (
          <section className={styles.resultsGrid} aria-label="Results">
            <article className={styles.resultCard}>
              <span className={styles.metricLabel}>Estimated market range</span>
              <span className={styles.metricValue}>
                {fmt(market.min)} – {fmt(market.max)}
              </span>
              <div className={styles.rangeBar}>
                <div className={styles.rangeFill} style={{ width: '100%' }} />
              </div>
              <div className={styles.insights}>
                <div className={styles.insightItem}>
                  <span className={styles.pill}>Midpoint</span>
                  <span>{fmt(market.mid)}</span>
                </div>
                <div className={styles.insightItem}>
                  <span className={styles.pill}>Role</span>
                  <span>
                    {title} · {level} · {location} · {workMode}
                  </span>
                </div>
                {company ? (
                  <div className={styles.insightItem}>
                    <span className={styles.pill}>Company</span>
                    <span>{company}</span>
                  </div>
                ) : null}
              </div>
            </article>
            <article className={styles.resultCard}>
              <span className={styles.metricLabel}>Your offer position</span>
              <span className={styles.metricValue}>{offer.base ? `${percentile}th percentile` : '—'}</span>
              <div className={styles.rangeBar}>
                <div className={styles.rangeFill} style={{ width: `${percentile}%` }} />
              </div>
              <div className={styles.insights}>
                <div className={styles.insightItem}>
                  <span className={styles.pill}>Base</span>
                  <span>{offer.base ? fmt(offer.base) : 'Enter base to compare'}</span>
                </div>
                <div className={styles.insightItem}>
                  <span className={styles.pill}>Total comp</span>
                  <span>{offer.total ? fmt(offer.total) : 'Optional'}</span>
                </div>
              </div>
            </article>
            <article className={styles.resultCard}>
              <span className={styles.metricLabel}>Market spread</span>
              <span className={styles.metricValue}>{fmt(market.max - market.min)}</span>
              <div className={styles.insights}>
                <div className={styles.insightItem}>
                  <span className={styles.pill}>Tip</span>
                  <span>
                    Target {fmt(market.mid)}–{fmt(Math.round(market.mid * 1.1))} if your skills align with role must-haves.
                  </span>
                </div>
              </div>
            </article>
          </section>
          ) : null}
        </div>
      </AppShell>
    </>
  );
}

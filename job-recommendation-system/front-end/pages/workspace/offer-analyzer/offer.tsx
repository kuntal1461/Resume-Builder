import Head from 'next/head';
import { useMemo, useState } from 'react';
import type { ChangeEvent } from 'react';
import AppShell from '../../../components/workspace/AppShell';
import { APP_MENU_ITEMS, DEFAULT_PROFILE_TASKS } from '../../../components/workspace/navigation';
import styles from '../../../styles/workspace/OfferPackageAnalyzer.module.css';

type Offer = {
  id: string;
  name: string;
  company: string;
  base: string; // annual
  bonusPct: string; // % of base
  equity: string; // annualized value
  location: string;
  taxRate: string; // percent
  workMode: 'Remote' | 'Hybrid' | 'Onsite';
};

const PROFILE = {
  name: 'Kuntal Maity',
  tagline: 'Set your target role',
  initials: 'KM',
  progressLabel: '5%',
};

const COL_INDEX: Record<string, number> = {
  'San Francisco Bay Area': 1.30,
  'New York City': 1.22,
  Seattle: 1.15,
  Austin: 1.02,
  London: 1.05,
  Other: 0.92,
};

const TAX_PRESETS = [
  { label: '20% (low)', value: 20 },
  { label: '25% (typical)', value: 25 },
  { label: '30% (high)', value: 30 },
  { label: '35% (very high)', value: 35 },
];

function toNumber(v: string) {
  const n = Number.parseFloat(v || '0');
  return Number.isFinite(n) ? n : 0;
}

function formatCurrency(n: number, currency: 'USD' | 'EUR' | 'GBP' = 'USD') {
  return new Intl.NumberFormat(undefined, { style: 'currency', currency, maximumFractionDigits: 0 }).format(n);
}

export default function OfferPackageAnalyzerPage() {
  const [currency, setCurrency] = useState<'USD' | 'EUR' | 'GBP'>('USD');
  const [offers, setOffers] = useState<Offer[]>([
    {
      id: 'offer-1',
      name: 'Offer A',
      company: '',
      base: '',
      bonusPct: '10',
      equity: '',
      location: 'Other',
      taxRate: '25',
      workMode: 'Remote',
    },
    {
      id: 'offer-2',
      name: 'Offer B',
      company: '',
      base: '',
      bonusPct: '10',
      equity: '',
      location: 'Other',
      taxRate: '25',
      workMode: 'Remote',
    },
  ]);

  const addOffer = () => {
    const id = `offer-${Date.now().toString(36)}`;
    setOffers((prev) => [
      ...prev,
      {
        id,
        name: `Offer ${String.fromCharCode(65 + prev.length)}`,
        company: '',
        base: '',
        bonusPct: '10',
        equity: '',
        location: 'Other',
        taxRate: '25',
        workMode: 'Remote',
      },
    ]);
  };

  const removeOffer = (id: string) => setOffers((prev) => prev.filter((o) => o.id !== id));

  const update = (id: string, key: keyof Offer) => (e: ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const value = e.target.value;
    setOffers((prev) => prev.map((o) => (o.id === id ? { ...o, [key]: value } : o)));
  };

  const computed = useMemo(() => {
    return offers.map((o) => {
      const base = toNumber(o.base);
      const bonus = Math.max(0, Math.round((toNumber(o.bonusPct) / 100) * base));
      const equity = toNumber(o.equity);
      const total = base + bonus + equity;
      const tax = (toNumber(o.taxRate) / 100) * total;
      const net = Math.max(0, Math.round(total - tax));
      const col = COL_INDEX[o.location] ?? 1.0;
      const purchasingPower = Math.round(net / col);
      return { id: o.id, name: o.name, base, bonus, equity, total, net, purchasingPower };
    });
  }, [offers]);

  const bestNetId = useMemo(() => {
    const best = computed.reduce<{ id: string; net: number } | null>((accumulator, current) => {
      if (!accumulator || current.net > accumulator.net) {
        return { id: current.id, net: current.net };
      }
      return accumulator;
    }, null);
    return best ? best.id : undefined;
  }, [computed]);

  const bestPowerId = useMemo(() => {
    const best = computed.reduce<{ id: string; power: number } | null>((accumulator, current) => {
      if (!accumulator || current.purchasingPower > accumulator.power) {
        return { id: current.id, power: current.purchasingPower };
      }
      return accumulator;
    }, null);
    return best ? best.id : undefined;
  }, [computed]);

  return (
    <>
      <Head>
        <title>JobMatch · Offer Package Analyzer</title>
        <meta name="description" content="Compare full compensation packages with taxes and cost of living." />
      </Head>
      <AppShell menuItems={APP_MENU_ITEMS} profileTasks={DEFAULT_PROFILE_TASKS} profile={PROFILE}>
        <div className={styles.page}>
          <header className={styles.header}>
            <div>
              <h1>Offer Package Analyzer</h1>
              <p>Enter offers to compare total compensation, estimated after-tax take-home, and cost-of-living adjusted purchasing power.</p>
            </div>
            <div className={styles.actions}>
              <label className={styles.label} htmlFor="currency-select" style={{ alignSelf: 'center' }}>
                Currency
              </label>
              <select
                id="currency-select"
                className={styles.select}
                value={currency}
                onChange={(e) => setCurrency(e.target.value as 'USD' | 'EUR' | 'GBP')}
                aria-label="Select currency"
              >
                <option>USD</option>
                <option>EUR</option>
                <option>GBP</option>
              </select>
              <button type="button" className={styles.primaryButton} onClick={addOffer} aria-label="Add another offer to compare">
                Add offer
              </button>
            </div>
          </header>

          <section className={styles.card} aria-label="Offer details">
            <div className={styles.offersGrid}>
              {offers.map((o) => (
                <article key={o.id} className={styles.offerCard}>
                  <div className={styles.offerHeader}>
                    <input
                      className={styles.input}
                      aria-label="Offer name"
                      value={o.name}
                      onChange={update(o.id, 'name')}
                    />
                    <button type="button" className={styles.removeBtn} onClick={() => removeOffer(o.id)} aria-label={`Remove ${o.name}`}>
                      Remove
                    </button>
                  </div>
                  <div className={styles.formGrid}>
                    <div className={styles.inputGroup}>
                      <label className={styles.label}>Company name</label>
                      <input className={styles.input} value={o.company} onChange={update(o.id, 'company')} placeholder="e.g., Acme Corp" />
                    </div>
                    <div className={styles.inputGroup}>
                      <label className={styles.label}>Base salary ({currency})</label>
                      <input type="number" className={styles.input} value={o.base} onChange={update(o.id, 'base')} placeholder="120000" min={0} />
                    </div>
                    <div className={styles.inputGroup}>
                      <label className={styles.label}>Target bonus (%)</label>
                      <input type="number" className={styles.input} value={o.bonusPct} onChange={update(o.id, 'bonusPct')} min={0} max={100} />
                    </div>
                    <div className={styles.inputGroup}>
                      <label className={styles.label}>Equity annualized ({currency})</label>
                      <input type="number" className={styles.input} value={o.equity} onChange={update(o.id, 'equity')} min={0} />
                    </div>
                    <div className={styles.inputGroup}>
                      <label className={styles.label}>Location (CoL)</label>
                      <select className={styles.select} value={o.location} onChange={update(o.id, 'location')}>
                        {Object.keys(COL_INDEX).map((k) => (
                          <option key={k} value={k}>
                            {k}
                          </option>
                        ))}
                      </select>
                    </div>
                    <div className={styles.inputGroup}>
                      <label className={styles.label}>Work mode</label>
                      <select className={styles.select} value={o.workMode} onChange={update(o.id, 'workMode')}>
                        <option>Remote</option>
                        <option>Hybrid</option>
                        <option>Onsite</option>
                      </select>
                    </div>
                    <div className={styles.inputGroup}>
                      <label className={styles.label}>Estimated tax rate</label>
                      <select className={styles.select} value={o.taxRate} onChange={update(o.id, 'taxRate')}>
                        {TAX_PRESETS.map((t) => (
                          <option key={t.value} value={t.value}>{t.label}</option>
                        ))}
                      </select>
                    </div>
                  </div>
                </article>
              ))}
            </div>
          </section>

          <section className={styles.resultsGrid} aria-label="Comparison results">
            {computed.map((c) => (
              <article key={c.id} className={styles.resultCard}>
                <span className={styles.metricLabel}>{c.name}</span>
                <span className={styles.metricValue}>{formatCurrency(c.total, currency)} total</span>
                <div className={styles.insights}>
                  {/* Show optional company and work mode details if entered */}
                  {offers.find((o) => o.id === c.id)?.company ? (
                    <div className={styles.insightItem}>
                      <span className={styles.pill}>Company</span>
                      <span>{offers.find((o) => o.id === c.id)?.company}</span>
                    </div>
                  ) : null}
                  {offers.find((o) => o.id === c.id)?.workMode ? (
                    <div className={styles.insightItem}>
                      <span className={styles.pill}>Mode</span>
                      <span>{offers.find((o) => o.id === c.id)?.workMode}</span>
                    </div>
                  ) : null}
                  <div className={styles.insightItem}>
                    <span className={styles.pill}>Base</span>
                    <span>{formatCurrency(c.base, currency)}</span>
                  </div>
                  <div className={styles.insightItem}>
                    <span className={styles.pill}>Bonus</span>
                    <span>{formatCurrency(c.bonus, currency)}</span>
                  </div>
                  <div className={styles.insightItem}>
                    <span className={styles.pill}>Equity</span>
                    <span>{formatCurrency(c.equity, currency)}</span>
                  </div>
                </div>
                <hr />
                <span className={styles.metricLabel}>Estimated after-tax</span>
                <span className={styles.metricValue} style={{ color: c.id === bestNetId ? '#1f7f4c' : undefined }}>
                  {formatCurrency(c.net, currency)} {c.id === bestNetId ? '(best net)' : ''}
                </span>
                <div className={styles.insights}>
                  <div className={styles.insightItem}>
                    <span className={styles.pill}>Purchasing power</span>
                    <span style={{ fontWeight: c.id === bestPowerId ? 700 as const : 500 }}>
                      {formatCurrency(c.purchasingPower, currency)} {c.id === bestPowerId ? '(best CoL adj.)' : ''}
                    </span>
                  </div>
                </div>
              </article>
            ))}
          </section>
        </div>
      </AppShell>
    </>
  );
}

import Head from 'next/head';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import AppShell from '../../../../components/workspace/AppShell';
import { APP_MENU_ITEMS, DEFAULT_PROFILE_TASKS } from '../../../../components/workspace/navigation';
import { createGuestWorkspaceProfile } from '../../../../components/workspace/profileFallback';
import { useWorkspaceShellProfile } from '../../../../components/workspace/useWorkspaceShellProfile';
import styles from '../../../../styles/workspace/JobDetailsNew.module.css';

const PROFILE = createGuestWorkspaceProfile({
    tagline: 'Job Details',
    progressLabel: '12%',
});

// Mock job data
const MOCK_JOBS_DATA: Record<string, any> = {
    'cna-associate-software-engineer-2': {
        id: 'cna-associate-software-engineer-2',
        title: 'Associate Software Engineer-2',
        company: 'CNA Insurance',
        posted: '3 minutes ago',
        companyType: 'Finance · Insurance · Public Company',
        location: 'Chicago, IL, USA',
        workType: 'Full-time',
        salary: '$47K/yr - $78K/yr',
        remoteLabel: 'Onsite',
        seniority: 'New Grad, Entry Level',
        experience: '0+ years exp',
        matchScore: 85,
        matchBadge: 'GOOD MATCH',
        jobTags: ['Finance', 'Financial Services', 'Information Services', 'Information Technology', 'Insurance', 'Property Management', 'Real Estate', 'Risk Management'],
        logoUrl: 'https://media.licdn.com/dms/image/v2/D560BAQGJ_agjay4QBA/company-logo_200_200/company-logo_200_200/0/1719836711521/cna_insurance_logo?e=1764806400&v=beta&t=6L0FC4MlYoJUsxJAMxmcft_AjQBv-U5VQTL-kQTsSZY',
        description: 'CNA Insurance is dedicated to fostering a supportive work environment where employees can thrive. The Associate Software Engineer-2 role involves assisting in the development and maintenance of application programs, focusing on business applications and integration solutions.',
        responsibilities: [
            'Supports and prepares computer applications (e.g., codes new or modified programs, reuses existing code through the use of program development software alternatives or integrates purchased solutions).',
            'May create detailed designs of low complexity per solution requirements.',
            'Prepares program test data, unit tests and debugs programs.',
            'Documents all procedures used throughout the computer application when it is formally established.',
            'Supports operations area technical staff in the implementation of the application into production.',
            'Works with other IT staff as appropriate in systems and integration testing.',
            'May act as liaison between clients and applications areas.',
        ],
        qualifications: {
            required: [
                'Bachelor\'s degree in Computer Science, or related discipline, or equivalent work experience.',
                'Typically up to two years of application program development experience or other related IT experience.',
                'General understanding of system development life cycle, and system and application development alternatives.',
                'Basic understanding of client area\'s functions and systems.',
                'Good analytical and problem solving skills.',
                'Requires good communication and interpersonal skills and the ability to work effectively with peers, clients and IT management and staff.',
                'Ability to work in team environment.',
                'Advanced computer skills including Microsoft Office suite and other related business software systems or languages including, but not limited to Mainframe, DB2, UNIX, Oracle, Websphere J2EE Java, Peoplesoft, Business Objects, and ETL.',
            ],
            preferred: [
                'Completion of course work towards applicable certifications preferred.',
            ],
        },
        skills: [
            { name: 'Application development', matched: true },
            { name: 'System development life cycle', matched: true },
            { name: 'Mainframe', matched: false },
            { name: 'DB2', matched: true },
            { name: 'Java', matched: true },
            { name: 'Analytical skills', matched: false },
            { name: 'Problem solving', matched: true },
            { name: 'Communication skills', matched: true },
            { name: 'Interpersonal skills', matched: true },
            { name: 'Teamwork', matched: true },
        ],
        benefits: [
            'CNA offers a comprehensive and competitive benefits package to help our employees – and their family members – achieve their physical, financial, emotional and social wellbeing goals.',
        ],
        companyInfo: {
            name: 'CNA Insurance',
            about: 'CNA is one of the largest U.S. commercial property and casualty insurance companies.',
            logo: 'https://media.licdn.com/dms/image/v2/D560BAQGJ_agjay4QBA/company-logo_200_200/company-logo_200_200/0/1719836711521/cna_insurance_logo?e=1764806400&v=beta&t=6L0FC4MlYoJUsxJAMxmcft_AjQBv-U5VQTL-kQTsSZY',
            size: '5001-10000 employees',
            founded: '1897',
            location: 'Chicago, Illinois, USA',
            website: 'http://www.cna.com',
            glassdoorRating: 3.9,
            socialLinks: {
                twitter: 'https://www.twitter.com/cna_insurance',
                linkedin: 'https://www.linkedin.com/company/3246',
                crunchbase: 'https://www.crunchbase.com/organization/cna-insurance-company',
                glassdoor: 'https://www.glassdoor.com.au/Overview/Working-at-EI_IE121.htm',
            },
            h1bData: {
                years: [
                    { year: '2025', count: 23, percent: 53 },
                    { year: '2024', count: 32, percent: 74 },
                    { year: '2023', count: 25, percent: 58 },
                    { year: '2022', count: 43, percent: 100 },
                    { year: '2021', count: 32, percent: 74 },
                    { year: '2020', count: 14, percent: 33 },
                ],
            },
            funding: {
                stage: 'Public Company',
                total: '$0.88M',
                rounds: [
                    { date: '2016-09-12', type: 'Post IPO Equity', amount: '$0.88M' },
                    { date: '1978-01-13', type: 'IPO', amount: '' },
                ],
            },
            leadership: [
                {
                    name: 'Luke Mellors',
                    title: 'Vice President, Technology',
                    linkedin: 'https://www.linkedin.com/in/lukemellors',
                    image: 'https://images.crunchbase.com/image/upload/t_cb-default-original/bb0pq0sukxpxffx64vun',
                },
                {
                    name: 'Daniel Franzetti',
                    title: 'EVP of Worldwide Claim',
                    linkedin: 'https://www.linkedin.com/in/daniel-franzetti-56ab43103',
                    image: 'https://images.crunchbase.com/image/upload/t_cb-default-original/dhudabu6gnpqcuw3efsp',
                },
            ],
            news: [
                {
                    publisher: 'PR Newswire',
                    title: 'CNA FINANCIAL ANNOUNCES THIRD QUARTER 2025 NET INCOME OF $1.48 PER SHARE AND RECORD CORE INCOME OF $1.50 PER SHARE',
                    url: 'https://www.prnewswire.com/news-releases/cna-financial-announces-third-quarter-2025-net-income-of-1-48-per-share-and-record-core-income-of-1-50-per-share-302601556.html',
                    date: '2025-11-03',
                },
                {
                    publisher: 'PR Newswire',
                    title: 'LOEWS CORPORATION REPORTS NET INCOME OF $504 MILLION FOR THE THIRD QUARTER OF 2025',
                    url: 'https://www.prnewswire.com/news-releases/loews-corporation-reports-net-income-of-504-million-for-the-third-quarter-of-2025-302601650.html',
                    date: '2025-11-03',
                },
                {
                    publisher: 'MarketScreener',
                    title: 'CNA Financial Corporation Announces Board Changes',
                    url: 'https://www.marketscreener.com/news/cna-financial-corporation-announces-board-changes-ce7d5cd9dd8cf021',
                    date: '2025-11-03',
                },
            ],
        },
    },
};

export default function JobDetailsPage() {
    const router = useRouter();
    const { jobId } = router.query;
    const shellProfile = useWorkspaceShellProfile(PROFILE);
    const [job, setJob] = useState<any>(null);
    const [activeTab, setActiveTab] = useState<'overview' | 'company'>('overview');

    useEffect(() => {
        if (jobId && typeof jobId === 'string') {
            const jobData = MOCK_JOBS_DATA[jobId];
            if (jobData) {
                setJob(jobData);
            } else {
                router.push('/workspace/job-search');
            }
        }
    }, [jobId, router]);

    if (!job) {
        return (
            <AppShell menuItems={APP_MENU_ITEMS} profileTasks={DEFAULT_PROFILE_TASKS} profile={shellProfile}>
                <div className={styles.loading}>Loading job details...</div>
            </AppShell>
        );
    }

    return (
        <>
            <Head>
                <title>{job.title} at {job.company} · JobMatch</title>
                <meta name="description" content={job.description} />
            </Head>
            <AppShell menuItems={APP_MENU_ITEMS} profileTasks={DEFAULT_PROFILE_TASKS} profile={shellProfile}>
                <div className={styles.jobDetailPage}>
                    {/* Header */}
                    <div className={styles.header}>
                        <div className={styles.headerLeft}>
                            <button className={styles.closeBtn} onClick={() => router.back()}>×</button>
                            <div className={styles.badges}>
                                <span className={styles.badge}>Be an early applicant</span>
                                <span className={styles.badge}>Less than 25 applicants</span>
                            </div>
                        </div>
                        <div className={styles.headerRight}>
                            <button className={styles.iconBtn}>🚫</button>
                            <button className={styles.iconBtn}>🤍</button>
                            <button className={styles.applyBtn}>APPLY NOW →</button>
                        </div>
                    </div>

                    {/* Tabs */}
                    <div className={styles.tabs}>
                        <div className={styles.tabsLeft}>
                            <button
                                className={`${styles.tab} ${activeTab === 'overview' ? styles.tabActive : ''}`}
                                onClick={() => setActiveTab('overview')}
                            >
                                Overview
                            </button>
                            <button
                                className={`${styles.tab} ${activeTab === 'company' ? styles.tabActive : ''}`}
                                onClick={() => setActiveTab('company')}
                            >
                                Company
                            </button>
                        </div>
                        <div className={styles.tabsRight}>
                            <button className={styles.tabAction}>🔗 Share</button>
                            <button className={styles.tabAction}>🚩 Report Issue</button>
                            <button className={styles.tabAction}>📄 Original Job Post</button>
                        </div>
                    </div>

                    {/* Content */}
                    <div className={styles.content}>
                        {activeTab === 'overview' ? (
                            <div className={styles.overviewTab}>
                                <div className={styles.mainContent}>
                                    {/* Job Introduction */}
                                    <div className={styles.jobIntro}>
                                        <div className={styles.jobIntroLeft}>
                                            <div className={styles.companyHeader}>
                                                <img src={job.logoUrl} alt={job.company} className={styles.companyLogo} />
                                                <div>
                                                    <h2 className={styles.companyName}>{job.company} · {job.posted}</h2>
                                                </div>
                                            </div>
                                            <h1 className={styles.jobTitle}>{job.title}</h1>
                                            <div className={styles.metadata}>
                                                <div className={styles.metaItem}>📍 {job.location}</div>
                                                <div className={styles.metaItem}>🕒 {job.workType}</div>
                                                <div className={styles.metaItem}>🏢 {job.remoteLabel}</div>
                                                <div className={styles.metaItem}>🎓 {job.seniority}</div>
                                                <div className={styles.metaItem}>💰 {job.salary}</div>
                                                <div className={styles.metaItem}>📅 {job.experience}</div>
                                            </div>
                                        </div>
                                        <div className={styles.jobIntroRight}>
                                            <div className={styles.matchScore}>
                                                <svg className={styles.scoreCircle} viewBox="0 0 100 100">
                                                    <circle cx="50" cy="50" r="45" fill="none" stroke="#e5e7eb" strokeWidth="8" />
                                                    <circle
                                                        cx="50" cy="50" r="45"
                                                        fill="none"
                                                        stroke="url(#gradient)"
                                                        strokeWidth="8"
                                                        strokeDasharray={`${job.matchScore * 2.83} 283`}
                                                        strokeLinecap="round"
                                                        transform="rotate(-90 50 50)"
                                                    />
                                                    <defs>
                                                        <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="0%">
                                                            <stop offset="0%" stopColor="#50EBEB" />
                                                            <stop offset="100%" stopColor="#37F8B2" />
                                                        </linearGradient>
                                                    </defs>
                                                </svg>
                                                <div className={styles.scoreValue}>{job.matchScore}%</div>
                                            </div>
                                            <div className={styles.matchLabel}>{job.matchBadge}</div>
                                            <div className={styles.subScores}>
                                                <div className={styles.subScore}>
                                                    <svg className={styles.smallCircle} viewBox="0 0 100 100">
                                                        <circle cx="50" cy="50" r="45" fill="none" stroke="#e5e7eb" strokeWidth="10" />
                                                        <circle cx="50" cy="50" r="45" fill="none" stroke="#00F0A0" strokeWidth="10" strokeDasharray="283 283" strokeLinecap="round" transform="rotate(-90 50 50)" />
                                                    </svg>
                                                    <div className={styles.smallValue}>100%</div>
                                                    <div className={styles.smallLabel}>Exp. Level</div>
                                                </div>
                                                <div className={styles.subScore}>
                                                    <svg className={styles.smallCircle} viewBox="0 0 100 100">
                                                        <circle cx="50" cy="50" r="45" fill="none" stroke="#e5e7eb" strokeWidth="10" />
                                                        <circle cx="50" cy="50" r="45" fill="none" stroke="#00F0A0" strokeWidth="10" strokeDasharray="209 283" strokeLinecap="round" transform="rotate(-90 50 50)" />
                                                    </svg>
                                                    <div className={styles.smallValue}>74%</div>
                                                    <div className={styles.smallLabel}>Skill</div>
                                                </div>
                                                <div className={styles.subScore}>
                                                    <svg className={styles.smallCircle} viewBox="0 0 100 100">
                                                        <circle cx="50" cy="50" r="45" fill="none" stroke="#e5e7eb" strokeWidth="10" />
                                                        <circle cx="50" cy="50" r="45" fill="none" stroke="#00F0A0" strokeWidth="10" strokeDasharray="130 283" strokeLinecap="round" transform="rotate(-90 50 50)" />
                                                    </svg>
                                                    <div className={styles.smallValue}>46%</div>
                                                    <div className={styles.smallLabel}>Industry Exp.</div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Resume Banner */}
                                    <div className={styles.resumeBanner}>
                                        <span className={styles.resumeIcon}>🎯</span>
                                        <span>Maximize your interview chances</span>
                                        <button className={styles.resumeBtn}>✨ Generate Custom Resume</button>
                                    </div>

                                    {/* Description */}
                                    <div className={styles.section}>
                                        <p><strong>{job.company}</strong> {job.description}</p>
                                        <div className={styles.tags}>
                                            {job.jobTags.map((tag: string, idx: number) => (
                                                <span key={idx} className={styles.tag}>{tag}</span>
                                            ))}
                                        </div>
                                        <div className={styles.h1bBadge}>
                                            <span className={styles.checkIcon}>✓</span>
                                            H1B Sponsor Likely
                                        </div>
                                    </div>

                                    <div className={styles.divider} />

                                    {/* Find Any Email */}
                                    <div className={styles.section}>
                                        <h3 className={styles.sectionTitle}>Find Any Email</h3>
                                        <div className={styles.emailInput}>
                                            <input
                                                type="text"
                                                placeholder="Paste any LinkedIn profile URL (e.g., https://www.linkedin.com/in/xxxxx/) to find work emails instantly."
                                            />
                                            <button className={styles.searchBtn}>🔍</button>
                                        </div>
                                    </div>

                                    <div className={styles.divider} />

                                    {/* Responsibilities */}
                                    <div className={styles.section}>
                                        <div className={styles.sectionHeader}>
                                            <img src="/icons/resp.svg" alt="" className={styles.sectionIcon} />
                                            <h2>Responsibilities</h2>
                                        </div>
                                        <ul className={styles.bulletList}>
                                            {job.responsibilities.map((item: string, idx: number) => (
                                                <li key={idx}>{item}</li>
                                            ))}
                                        </ul>
                                    </div>

                                    <div className={styles.divider} />

                                    {/* Skills/Qualification */}
                                    <div className={styles.section}>
                                        <div className={styles.sectionHeader}>
                                            <img src="/icons/skills.svg" alt="" className={styles.sectionIcon} />
                                            <h2>Qualification</h2>
                                            <div className={styles.skillLegend}>
                                                <span className={styles.checkIcon}>✓</span>
                                                Represents the skills you have
                                            </div>
                                        </div>
                                        <p className={styles.skillHint}>
                                            Find out how your skills align with this job's requirements. If anything seems off, you can easily <strong>click on the tags</strong> to select or unselect skills to reflect your actual expertise.
                                        </p>
                                        <div className={styles.skillTags}>
                                            {job.skills.map((skill: any, idx: number) => (
                                                <span key={idx} className={`${styles.skillTag} ${skill.matched ? styles.matched : ''}`}>
                                                    {skill.matched && <span className={styles.checkIcon}>✓</span>}
                                                    {skill.name}
                                                </span>
                                            ))}
                                        </div>
                                        <div className={styles.qualSection}>
                                            <h4>Required</h4>
                                            <ul className={styles.bulletList}>
                                                {job.qualifications.required.map((item: string, idx: number) => (
                                                    <li key={idx}>{item}</li>
                                                ))}
                                            </ul>
                                        </div>
                                        <div className={styles.qualSection}>
                                            <h4>Preferred</h4>
                                            <ul className={styles.bulletList}>
                                                {job.qualifications.preferred.map((item: string, idx: number) => (
                                                    <li key={idx}>{item}</li>
                                                ))}
                                            </ul>
                                        </div>
                                    </div>

                                    <div className={styles.divider} />

                                    {/* Benefits */}
                                    <div className={styles.section}>
                                        <div className={styles.sectionHeader}>
                                            <img src="/icons/benefits.svg" alt="" className={styles.sectionIcon} />
                                            <h2>Benefits</h2>
                                        </div>
                                        <ul className={styles.bulletList}>
                                            {job.benefits.map((item: string, idx: number) => (
                                                <li key={idx}>{item}</li>
                                            ))}
                                        </ul>
                                    </div>
                                </div>
                            </div>
                        ) : (
                            <div className={styles.companyTab}>
                                {/* Company Tab Content - Will implement next */}
                                <div className={styles.companyContent}>
                                    <div className={styles.sectionHeader}>
                                        <h2>Company</h2>
                                    </div>
                                    <div className={styles.companyIntro}>
                                        <div className={styles.companyLeft}>
                                            <div className={styles.companyTop}>
                                                <div>
                                                    <h2>{job.companyInfo.name}</h2>
                                                    <div className={styles.socialLinks}>
                                                        <a href={job.companyInfo.socialLinks.twitter} target="_blank">🐦</a>
                                                        <a href={job.companyInfo.socialLinks.linkedin} target="_blank">💼</a>
                                                        <a href={job.companyInfo.socialLinks.crunchbase} target="_blank">📊</a>
                                                        <a href={job.companyInfo.socialLinks.glassdoor} target="_blank">
                                                            ⭐ {job.companyInfo.glassdoorRating}
                                                        </a>
                                                    </div>
                                                </div>
                                                <img src={job.companyInfo.logo} alt={job.companyInfo.name} className={styles.companyLogoBig} />
                                            </div>
                                            <p className={styles.companyAbout}>{job.companyInfo.about}</p>
                                        </div>
                                        <div className={styles.companyRight}>
                                            <div className={styles.companyMeta}>
                                                <div>📅 Founded in {job.companyInfo.founded}</div>
                                                <div>📍 {job.companyInfo.location}</div>
                                                <div>👥 {job.companyInfo.size}</div>
                                                <div>🌐 <a href={job.companyInfo.website} target="_blank">{job.companyInfo.website}</a></div>
                                            </div>
                                        </div>
                                    </div>

                                    {/* H1B Sponsorship */}
                                    <div className={styles.section}>
                                        <h3>H1B Sponsorship</h3>
                                        <p className={styles.h1bHint}>
                                            {job.company} has a track record of offering H1B sponsorships. Please note that this does not guarantee sponsorship for this specific role.
                                        </p>
                                        <div className={styles.h1bTrends}>
                                            <h4>Trends of Total Sponsorships</h4>
                                            {job.companyInfo.h1bData.years.map((year: any, idx: number) => (
                                                <div key={idx} className={styles.h1bYear}>
                                                    <span>{year.year} ({year.count})</span>
                                                    <div className={styles.progressBar}>
                                                        <div className={styles.progress} style={{ width: `${year.percent}%` }} />
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    </div>

                                    {/* Funding */}
                                    <div className={styles.section}>
                                        <h3>Funding</h3>
                                        <div className={styles.fundingInfo}>
                                            <div>
                                                <div className={styles.label}>Current Stage</div>
                                                <div className={styles.value}>{job.companyInfo.funding.stage}</div>
                                            </div>
                                            <div>
                                                <div className={styles.label}>Total Funding</div>
                                                <div className={styles.value}>{job.companyInfo.funding.total}</div>
                                            </div>
                                        </div>
                                        <div className={styles.fundingRounds}>
                                            {job.companyInfo.funding.rounds.map((round: any, idx: number) => (
                                                <div key={idx} className={styles.fundingRound}>
                                                    <span className={styles.date}>{round.date}</span>
                                                    <span className={styles.type}>{round.type}</span>
                                                    {round.amount && <span className={styles.amount}>{round.amount}</span>}
                                                </div>
                                            ))}
                                        </div>
                                    </div>

                                    {/* Leadership */}
                                    <div className={styles.section}>
                                        <h3>Leadership Team</h3>
                                        <div className={styles.leadershipGrid}>
                                            {job.companyInfo.leadership.map((leader: any, idx: number) => (
                                                <div key={idx} className={styles.leaderCard}>
                                                    <img src={leader.image} alt={leader.name} className={styles.leaderImg} />
                                                    <div className={styles.leaderInfo}>
                                                        <div className={styles.leaderName}>{leader.name}</div>
                                                        <div className={styles.leaderTitle}>{leader.title}</div>
                                                    </div>
                                                    <a href={leader.linkedin} target="_blank" className={styles.linkedinLink}>💼</a>
                                                </div>
                                            ))}
                                        </div>
                                    </div>

                                    {/* Recent News */}
                                    <div className={styles.section}>
                                        <h3>Recent News</h3>
                                        <div className={styles.newsGrid}>
                                            {job.companyInfo.news.map((article: any, idx: number) => (
                                                <div key={idx} className={styles.newsCard}>
                                                    <div className={styles.newsPublisher}>{article.publisher}</div>
                                                    <a href={article.url} target="_blank" className={styles.newsTitle}>{article.title}</a>
                                                    <div className={styles.newsDate}>{article.date}</div>
                                                </div>
                                            ))}
                                        </div>
                                    </div>

                                    <div className={styles.poweredBy}>
                                        Company data provided by crunchbase
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </AppShell>
        </>
    );
}

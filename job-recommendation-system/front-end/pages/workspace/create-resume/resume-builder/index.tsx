import Head from 'next/head';
import Link from 'next/link';
import { useEffect, useMemo, useState } from 'react';
import type { GetServerSideProps } from 'next';
import AppShell from '../../../../components/workspace/AppShell';
import { APP_MENU_ITEMS, DEFAULT_PROFILE_TASKS } from '../../../../components/workspace/navigation';
import { useWorkspaceShellProfile } from '../../../../components/workspace/useWorkspaceShellProfile';
import { createGuestWorkspaceProfile } from '../../../../components/workspace/profileFallback';
import styles from '../../../../styles/workspace/ResumeBuilder.module.css';
import {
  fetchPublishedResumeTemplates,
  fetchResumeTemplateParentCategories,
  type ResumeTemplateParentCategory,
  type ResumeTemplateRecord,
} from '../../../../lib/resumeTemplates';

const PROFILE = createGuestWorkspaceProfile({
  tagline: 'Set your target role',
  progressLabel: '5%',
});

const BUILDER_STATS = [
  { label: 'Avg score lift', value: '+27 pts' },
  { label: 'Templates ready', value: '18' },
  { label: 'Live drafts saved', value: '4' },
];

const TIMELINE_STEPS = [
  {
    label: '1. Calibrate',
    detail: 'Pick your target role, seniority, and tone. We pre-load summary and keyword emphasis.',
  },
  {
    label: '2. Draft',
    detail: 'Pair AI prompts with your wins. Drag blocks around the live preview.',
  },
  {
    label: '3. Polish',
    detail: 'Run ATS scan, recruiter readability, and typography checks in one panel.',
  },
  {
    label: '4. Publish',
    detail: 'Export PDF + DOCX or duplicate for a new role. All styles stay synced.',
  },
];

type ResumeBuilderPageProps = {
  templates: ResumeTemplateRecord[];
  parentCategories: ResumeTemplateParentCategory[];
  error?: string | null;
  categoryError?: string | null;
};

const DEFAULT_CATEGORY_SLUG = 'uncategorized';
const TEMPLATES_PER_PAGE = 10;

const slugToTitle = (value?: string | null) => {
  if (!value) {
    return 'General templates';
  }
  return value
    .split(/[-_]/)
    .filter(Boolean)
    .map((segment) => segment.charAt(0).toUpperCase() + segment.slice(1))
    .join(' ');
};

export const getServerSideProps: GetServerSideProps<ResumeBuilderPageProps> = async () => {
  const [templatesResult, parentCategoriesResult] = await Promise.allSettled([
    fetchPublishedResumeTemplates(),
    fetchResumeTemplateParentCategories(),
  ]);

  let templates: ResumeTemplateRecord[] = [];
  let parentCategories: ResumeTemplateParentCategory[] = [];
  let error: string | null = null;
  let categoryError: string | null = null;

  if (templatesResult.status === 'fulfilled') {
    templates = templatesResult.value.templates ?? [];
  } else {
    console.error('Failed to fetch published resume templates', templatesResult.reason);
    error = 'Unable to load templates right now.';
  }

  if (parentCategoriesResult.status === 'fulfilled') {
    parentCategories = parentCategoriesResult.value.categories ?? [];
  } else {
    console.error('Failed to fetch resume template parent categories', parentCategoriesResult.reason);
    categoryError = 'Parent categories are unavailable at the moment.';
  }

  return {
    props: {
      templates,
      parentCategories,
      error,
      categoryError,
    },
  };
};

export default function WorkspaceResumeBuilderPage({
  templates,
  parentCategories,
  error,
  categoryError,
}: ResumeBuilderPageProps) {
  const shellProfile = useWorkspaceShellProfile(PROFILE);
  const [selectedParent, setSelectedParent] = useState<string>('all');
  const [currentPage, setCurrentPage] = useState(1);
  const dateFormatter = new Intl.DateTimeFormat('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  const formatUpdateTime = (timestamp: string | null) => {
    if (!timestamp) {
      return 'No updates logged';
    }
    const date = new Date(timestamp);
    if (Number.isNaN(date.getTime())) {
      return 'Updated recently';
    }
    return dateFormatter.format(date);
  };

  const resolveOwner = (template: ResumeTemplateRecord) =>
    template.owner_name || template.owner_email || 'JobMatch Admin';

  const templateCountByParent = useMemo(() => {
    const counts = new Map<string, number>();
    templates.forEach((template) => {
      const slug = template.parent_category_slug ?? DEFAULT_CATEGORY_SLUG;
      counts.set(slug, (counts.get(slug) ?? 0) + 1);
    });
    return counts;
  }, [templates]);

  const parentOptions = useMemo(() => {
    const usedSlugs = new Set<string>();
    const options = parentCategories.map((category) => {
      usedSlugs.add(category.slug);
      return {
        slug: category.slug,
        label: category.name,
        count: templateCountByParent.get(category.slug) ?? 0,
        sortOrder: category.sort_order ?? 0,
      };
    });

    templateCountByParent.forEach((count, slug) => {
      if (slug === DEFAULT_CATEGORY_SLUG || usedSlugs.has(slug)) {
        return;
      }
      const templateWithSlug = templates.find(
        (template) => (template.parent_category_slug ?? DEFAULT_CATEGORY_SLUG) === slug,
      );
      options.push({
        slug,
        label: templateWithSlug?.parent_category_label ?? slugToTitle(slug),
        count,
        sortOrder: Number.MAX_SAFE_INTEGER - 1,
      });
      usedSlugs.add(slug);
    });

    const uncategorizedCount = templateCountByParent.get(DEFAULT_CATEGORY_SLUG);
    if (uncategorizedCount) {
      options.push({
        slug: DEFAULT_CATEGORY_SLUG,
        label: 'General templates',
        count: uncategorizedCount,
        sortOrder: Number.MAX_SAFE_INTEGER,
      });
    }

    return options.sort((a, b) => {
      if (a.sortOrder === b.sortOrder) {
        return a.label.localeCompare(b.label);
      }
      return a.sortOrder - b.sortOrder;
    });
  }, [parentCategories, templateCountByParent, templates]);

  const filteredTemplates = useMemo(() => {
    if (selectedParent === 'all') {
      return templates;
    }
    return templates.filter(
      (template) => (template.parent_category_slug ?? DEFAULT_CATEGORY_SLUG) === selectedParent,
    );
  }, [templates, selectedParent]);

  const totalPages = Math.max(1, Math.ceil(filteredTemplates.length / TEMPLATES_PER_PAGE));
  const pageStart = (currentPage - 1) * TEMPLATES_PER_PAGE;
  const paginatedTemplates = filteredTemplates.slice(pageStart, pageStart + TEMPLATES_PER_PAGE);
  const rangeStart = paginatedTemplates.length ? pageStart + 1 : 0;
  const rangeEnd = paginatedTemplates.length ? pageStart + paginatedTemplates.length : 0;
  const activeCategoryLabel =
    selectedParent === 'all'
      ? 'All templates'
      : parentOptions.find((option) => option.slug === selectedParent)?.label ?? 'General templates';
  const showFilters = parentOptions.length > 0;

  useEffect(() => {
    if (selectedParent === 'all') {
      return;
    }
    const hasSelected = parentOptions.some((option) => option.slug === selectedParent);
    if (!hasSelected) {
      setSelectedParent('all');
    }
  }, [parentOptions, selectedParent]);

  useEffect(() => {
    setCurrentPage(1);
  }, [selectedParent]);

  useEffect(() => {
    if (currentPage > totalPages) {
      setCurrentPage(totalPages);
    }
  }, [totalPages, currentPage]);

  return (
    <>
      <Head>
        <title>JobMatch · Resume Builder</title>
        <meta name="description" content="Launch the modern JobMatch resume builder with AI drafting and live preview." />
      </Head>
      <AppShell menuItems={APP_MENU_ITEMS} profileTasks={DEFAULT_PROFILE_TASKS} profile={shellProfile}>
        <div className={styles.page}>
          <section className={styles.hero}>
            <div>
              <p className={styles.heroTag}>Live builder · Beta</p>
              <h1>Spin up a role-ready resume in minutes</h1>
              <p>
                Start from a blank canvas or continue a saved draft. AI guardrails rewrite bullet points, templates stay
                synced, and ATS checks run as you edit.
              </p>
            </div>
            <ul className={styles.heroStats}>
              {BUILDER_STATS.map((stat) => (
                <li key={stat.label}>
                  <strong>{stat.value}</strong>
                  <span>{stat.label}</span>
                </li>
              ))}
            </ul>
          </section>

          <section className={styles.templateLibrary} aria-label="Admin published templates">
            <header>
              <p className={styles.sectionTag}>Admin template gallery</p>
              <h2>Pick a published template to jumpstart your resume</h2>
              <p>
                These layouts were curated by the JobMatch admin team. Preview the vibe, then click &ldquo;Use template&rdquo;
                to pull it into your workspace builder.
              </p>
            </header>
            {showFilters ? (
              <div className={styles.templateFilters}>
                <div className={styles.filterIntro}>
                  <p className={styles.sectionTag}>Browse faster</p>
                  <h3>Parent categories keep things tidy</h3>
                  <p>Choose a track to reveal up to ten templates per page with sleek pagination.</p>
                </div>
                <label className={styles.categorySelect}>
                  <span>Parent category</span>
                  <div className={styles.selectControl}>
                    <select
                      value={selectedParent}
                      onChange={(event) => setSelectedParent(event.target.value)}
                      aria-label="Filter templates by parent category"
                    >
                      <option value="all">All parent categories ({templates.length})</option>
                      {parentOptions.map((option) => (
                        <option key={option.slug} value={option.slug}>
                          {option.label} ({option.count})
                        </option>
                      ))}
                    </select>
                  </div>
                </label>
                <div className={styles.filterSummary}>
                  <strong>{activeCategoryLabel}</strong>
                  {paginatedTemplates.length ? (
                    <span>
                      Showing {rangeStart}&ndash;{rangeEnd} of {filteredTemplates.length} templates
                    </span>
                  ) : (
                    <span>No templates in this parent category yet</span>
                  )}
                </div>
              </div>
            ) : null}
            {categoryError ? <p className={styles.templatesError}>{categoryError}</p> : null}
            {error ? <p className={styles.templatesError}>{error}</p> : null}
            {templates.length ? (
              paginatedTemplates.length ? (
                <>
                  <div className={styles.templateGrid}>
                    {paginatedTemplates.map((template) => {
                      const categoryLabel =
                        template.child_category_label ??
                        template.parent_category_label ??
                        slugToTitle(template.child_category_slug ?? template.parent_category_slug);
                      const templateSummary = template.child_category_label
                        ? `Built for ${template.child_category_label} roles with ATS-friendly spacing.`
                        : 'Modern rhythm, bold accents, and ATS-optimized spacing.';
                      const ownerLabel = resolveOwner(template);
                      const lastUpdatedLabel = formatUpdateTime(template.last_update_time);
                      const moodChip = template.child_category_label ? `${template.child_category_label} ready` : 'Multi-role ready';

                      return (
                        <article key={template.id} className={styles.templateCard}>
                          <div className={styles.templateVisual}>
                            {template.preview_pdf_url ? (
                              <div className={styles.pdfPreview}>
                                <div className={styles.pdfHeader}>
                                  <span>{categoryLabel}</span>
                                  <Link
                                    href={template.preview_pdf_url}
                                    target="_blank"
                                    rel="noreferrer"
                                    className={styles.pdfLink}
                                  >
                                    Open PDF
                                  </Link>
                                </div>
                                <object
                                  data={`${template.preview_pdf_url}#toolbar=0&navpanes=0`}
                                  type="application/pdf"
                                  className={styles.pdfObject}
                                  aria-label={`${template.title} PDF preview`}
                                >
                                  <iframe
                                    src={`${template.preview_pdf_url}#toolbar=0&navpanes=0`}
                                    title={`${template.title} preview`}
                                    className={styles.pdfObject}
                                  />
                                  <p>
                                    PDF preview unavailable.{' '}
                                    <a href={template.preview_pdf_url} target="_blank" rel="noreferrer">
                                      Open the file
                                    </a>
                                    .
                                  </p>
                                </object>
                              </div>
                            ) : (
                              <div className={styles.previewStack}>
                                <span className={styles.stackCard} aria-hidden="true" />
                                <span className={styles.stackCardAlt} aria-hidden="true" />
                                <div className={styles.stackCardPrimary}>
                                  {template.preview_image_url ? (
                                    <img src={template.preview_image_url} alt={`${template.title} preview`} />
                                  ) : (
                                    <div className={styles.stackSkeleton}>
                                      <span />
                                      <span />
                                      <span />
                                      <span />
                                    </div>
                                  )}
                                  <span className={styles.stackBadge}>{categoryLabel}</span>
                                </div>
                              </div>
                            )}
                          </div>
                          <div className={styles.templateInfo}>
                            <header className={styles.templateHeading}>
                              <div>
                                <p className={styles.templateCategory}>{categoryLabel}</p>
                                <h3>{template.title}</h3>
                                <p className={styles.templateOwner}>{ownerLabel}</p>
                              </div>
                              <span className={styles.templateStatusBadge}>{template.status_label}</span>
                            </header>
                            <p className={styles.templateSummary}>{templateSummary}</p>
                            <div className={styles.templateMetaRow}>
                              <div>
                                <span>Last updated</span>
                                <strong>{lastUpdatedLabel}</strong>
                              </div>
                              <div>
                                <span>Owner</span>
                                <strong>{ownerLabel}</strong>
                              </div>
                            </div>
                            <div className={styles.templateActions}>
                              <Link
                                href={`/workspace/create-resume/resume-builder/${template.id}`}
                                className={styles.selectTemplate}
                              >
                                Use template
                              </Link>
                              <Link
                                href={`/workspace/create-resume/resume-builder/${template.id}`}
                                className={styles.previewButton}
                                aria-label={`Preview ${template.title}`}
                              >
                                Preview details
                              </Link>
                            </div>
                          </div>
                        </article>
                      );
                    })}
                  </div>
                  <div className={styles.templatePagination} role="navigation" aria-label="Template pagination">
                    <button
                      type="button"
                      className={styles.pageButton}
                      onClick={() => setCurrentPage((page) => Math.max(1, page - 1))}
                      disabled={currentPage === 1}
                    >
                      ← Previous
                    </button>
                    <div className={styles.pageIndicator}>
                      <strong>Page {currentPage}</strong>
                      <span>of {totalPages}</span>
                    </div>
                    <button
                      type="button"
                      className={styles.pageButton}
                      onClick={() => setCurrentPage((page) => Math.min(totalPages, page + 1))}
                      disabled={currentPage === totalPages}
                    >
                      Next →
                    </button>
                  </div>
                </>
              ) : (
                <div className={styles.templatesEmpty}>
                  <p>Nothing under {activeCategoryLabel} yet. Try a different parent category.</p>
                </div>
              )
            ) : (
              <div className={styles.templatesEmpty}>
                <p>No published templates found yet. Check back soon!</p>
              </div>
            )}
          </section>

          <section className={styles.timeline} aria-label="Builder workflow steps">
            <header>
              <p className={styles.sectionTag}>Workflow</p>
              <h2>The same four steps every power user follows</h2>
            </header>
            <div className={styles.timelineFlow}>
              {TIMELINE_STEPS.map((step, index) => {
                const stepNumber = index + 1;
                const stepTitle = step.label.replace(/^\d+\.\s*/, '');
                return (
                  <article key={step.label} className={styles.timelineNode}>
                    <div className={styles.nodeHeader}>
                      <span className={styles.nodeNumber}>{stepNumber}</span>
                      <p className={styles.nodeLabel}>{stepTitle}</p>
                    </div>
                    <p className={styles.nodeDetail}>{step.detail}</p>
                  </article>
                );
              })}
            </div>
          </section>
        </div>
      </AppShell>
    </>
  );
}

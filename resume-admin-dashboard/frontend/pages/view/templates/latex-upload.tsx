import Head from 'next/head';
import Link from 'next/link';
import { useEffect, useRef, useState } from 'react';
import type { UIEvent } from 'react';
import { requestLatexPreview } from '../../../lib/renderPreview';
import { resolveSidebarProfile, type SidebarProfile } from '../../../lib/sidebarProfile';
import styles from '../../../styles/admin/AdminView.module.css';

const DEFAULT_SIDEBAR_PROFILE: SidebarProfile = {
  name: 'Aditi Rao',
  initials: 'AR',
  tagline: 'Template Operations',
  email: 'aditi@jobmatch.io',
};

const NAV_LINKS = [
  { label: 'Workspace overview', href: '/view', active: false },
  { label: 'Templates', href: '/view/templates', active: true },
  { label: 'Job tracker', href: '/workspace/job-tracker', active: false },
  { label: 'Interview prep', href: '/workspace/interview-prep', active: false },
];

const UPLOAD_CHECKLIST = [
  {
    title: 'Compile-ready LaTeX',
    detail: 'Remove custom packages that are not part of TeX Live 2023 to avoid build failures in the renderer.',
  },
  {
    title: 'One resume per file',
    detail: 'Keep each résumé in its own .tex for easier versioning and to align with template approvals.',
  },
  {
    title: 'Placeholder tokens',
    detail: 'Use {{candidate_name}} and {{role_title}} tokens so downstream automations can hydrate content.',
  },
];

const PIPELINE_PHASES = [
  { name: 'Sanitization', owner: 'Template Ops', sla: '2 hrs', detail: 'Strip PII and enforce workspace typography.' },
  { name: 'Render preview', owner: 'Rendering pod', sla: '4 hrs', detail: 'Compile PDF + HTML mirrors for reviewers.' },
  {
    name: 'Admin approval',
    owner: 'Hiring pod',
    sla: '1 day',
    detail: 'Confirm alignment with active interview loops before publish.',
  },
];

const SUPPORTED_ATTACHMENTS = [
  { type: '.tex', purpose: 'LaTeX source', maxSize: '1 MB' },
  { type: '.cls', purpose: 'Supporting class files', maxSize: '250 KB' },
  { type: '.sty', purpose: 'Custom styles (optional)', maxSize: '250 KB' },
];

const SAMPLE_PREVIEW_DATA = {
  candidate: 'Elena Kapoor',
  role: 'LLM Operations Lead',
  workspace: 'Velocity Pod · SF',
};

const SAMPLE_LATEX = String.raw`
\documentclass{article}
\begin{document}
\textbf{{candidate_name}} -- {{role_title}}\\
\begin{itemize}
  \item Partnered with LLM ops pod to ship template refreshes in 48 hours.
  \item Automated ATS-ready PDF drops using {{workspace}} directives.
\end{itemize}
\end{document}
`;

type ParentCategoryOption = {
  id: number;
  name: string;
  slug: string;
  sort_order: number;
};
type ChildCategoryOption = {
  id: number;
  name: string;
  slug: string;
  sort_order: number;
};

export default function LatexUploadPage() {
  const [sidebarProfile, setSidebarProfile] = useState<SidebarProfile>(DEFAULT_SIDEBAR_PROFILE);
  const [latexSource, setLatexSource] = useState<string>(SAMPLE_LATEX.trim());
  const [childCategories, setChildCategories] = useState<string[]>([]);
  const [availableChildCategories, setAvailableChildCategories] = useState<ChildCategoryOption[]>([]);
  const [parentCategories, setParentCategories] = useState<ParentCategoryOption[]>([]);
  const [selectedParentCategory, setSelectedParentCategory] = useState('');
  const [isParentCategoryLoading, setIsParentCategoryLoading] = useState(true);
  const [parentCategoryError, setParentCategoryError] = useState<string | null>(null);
  const [isParentDropdownOpen, setIsParentDropdownOpen] = useState(false);
  const [isChildCategoryLoading, setIsChildCategoryLoading] = useState(false);
  const [childCategoryError, setChildCategoryError] = useState<string | null>(null);
  const [isRendering, setIsRendering] = useState(false);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [renderError, setRenderError] = useState<string | null>(null);
  const [previewExcerpt, setPreviewExcerpt] = useState('');
  const handleSave = () => {
    try {
      const payload = {
        latexSource,
        selectedParentCategory,
        childCategories,
        timestamp: new Date().toISOString(),
      };
      if (typeof window !== 'undefined') {
        window.localStorage.setItem('latexDraft', JSON.stringify(payload));
      }
    } catch (error) {
      console.error('Failed to save draft', error);
    }
  };
  const lineNumbersRef = useRef<HTMLDivElement | null>(null);
  const parentDropdownRef = useRef<HTMLDivElement | null>(null);
  const parentTriggerRef = useRef<HTMLButtonElement | null>(null);
  const childDropdownRef = useRef<HTMLDivElement | null>(null);
  const childTriggerRef = useRef<HTMLButtonElement | null>(null);
  const [isChildDropdownOpen, setIsChildDropdownOpen] = useState(false);
  const [childSearch, setChildSearch] = useState('');

  const toggleChildCategory = (value: string) => {
    setChildCategories((previous) =>
      previous.includes(value) ? previous.filter((item) => item !== value) : [...previous, value],
    );
  };

  const triggerRender = async () => {
    if (!latexSource.trim()) {
      setRenderError('Add LaTeX source before rendering a preview.');
      return;
    }

    setRenderError(null);
    setIsRendering(true);
    setPreviewUrl(null);
    try {
      const response = await requestLatexPreview({
        latexSource,
        tokens: SAMPLE_PREVIEW_DATA,
      });
      setPreviewUrl(response.pdfDataUrl);
      setPreviewExcerpt(response.excerpt);
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Failed to render preview.';
      setRenderError(message);
    } finally {
      setIsRendering(false);
    }
  };

  const downloadPreview = () => {
    if (!previewUrl) {
      return;
    }
    const link = document.createElement('a');
    link.href = previewUrl;
    link.download = 'resume-preview.pdf';
    link.click();
  };

  const openPreviewInNewTab = () => {
    if (!previewUrl) {
      return;
    }
    const [meta, base64Content] = previewUrl.split(',');
    const mimeMatch = meta.match(/data:(.*?);base64/);
    const mimeType = mimeMatch?.[1] ?? 'application/pdf';
    if (!base64Content) {
      window.open(previewUrl, '_blank', 'noopener,noreferrer');
      return;
    }
    try {
      const binary = window.atob(base64Content);
      const bytes = new Uint8Array(binary.length);
      for (let index = 0; index < binary.length; index += 1) {
        bytes[index] = binary.charCodeAt(index);
      }
      const blob = new Blob([bytes], { type: mimeType });
      const blobUrl = URL.createObjectURL(blob);
      window.open(blobUrl, '_blank', 'noopener,noreferrer');
      window.setTimeout(() => URL.revokeObjectURL(blobUrl), 10_000);
    } catch (error) {
      console.error('Unable to open preview in new tab', error);
    }
  };

  const syncLineNumbersScroll = (event: UIEvent<HTMLTextAreaElement>) => {
    if (lineNumbersRef.current) {
      lineNumbersRef.current.scrollTop = event.currentTarget.scrollTop;
    }
  };

  const lineNumberLabels = latexSource.split('\n');

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setSidebarProfile(resolveSidebarProfile(DEFAULT_SIDEBAR_PROFILE));

    let isMounted = true;

    const loadParentCategories = async () => {
      setIsParentCategoryLoading(true);
      setParentCategoryError(null);
      try {
        const basePath = process.env.NEXT_PUBLIC_BASE_PATH ?? '';
        const response = await fetch(`${basePath}/api/templates/parent-categories`);
        if (!response.ok) {
          throw new Error(`Unable to load parent categories (status ${response.status}).`);
        }
        const data = (await response.json()) as {
          success: boolean;
          categories: ParentCategoryOption[];
        };

        if (!data.success) {
          throw new Error('Parent category request failed.');
        }

        if (isMounted) {
          setParentCategories(data.categories);
          setSelectedParentCategory((previous) => {
            if (previous && data.categories.some((category) => category.slug === previous)) {
              return previous;
            }
            return data.categories[0]?.slug ?? '';
          });
          setIsParentDropdownOpen(false);
        }
      } catch (error) {
        if (isMounted) {
          const message = error instanceof Error ? error.message : 'Unable to load parent categories.';
          setParentCategoryError(message);
        }
      } finally {
        if (isMounted) {
          setIsParentCategoryLoading(false);
        }
      }
    };

    void loadParentCategories();

    return () => {
      isMounted = false;
    };
  }, []);

  // Load child categories when the selected parent changes
  useEffect(() => {
    let isMounted = true;
    const loadChildCategories = async () => {
      // Reset when no parent is selected
      if (!selectedParentCategory) {
        setAvailableChildCategories([]);
        setChildCategories([]);
        return;
      }

      const parent = parentCategories.find((c) => c.slug === selectedParentCategory);
      if (!parent) {
        setAvailableChildCategories([]);
        setChildCategories([]);
        return;
      }

      setIsChildCategoryLoading(true);
      setChildCategoryError(null);
      try {
        const basePath = process.env.NEXT_PUBLIC_BASE_PATH ?? '';
        const response = await fetch(`${basePath}/api/templates/child-categories?parentId=${parent.id}`);
        if (!response.ok) {
          throw new Error(`Unable to load child categories (status ${response.status}).`);
        }
        const data = (await response.json()) as {
          success: boolean;
          categories: ChildCategoryOption[];
        };

        if (!data.success) {
          throw new Error('Child category request failed.');
        }

        if (isMounted) {
          setAvailableChildCategories(data.categories);
          // Keep only selections that still exist under this parent
          setChildCategories((prev) => prev.filter((slug) => data.categories.some((c) => c.slug === slug)));
        }
      } catch (error) {
        if (isMounted) {
          const message = error instanceof Error ? error.message : 'Unable to load child categories.';
          setChildCategoryError(message);
          setAvailableChildCategories([]);
          setChildCategories([]);
        }
      } finally {
        if (isMounted) {
          setIsChildCategoryLoading(false);
        }
      }
    };

    void loadChildCategories();
    return () => {
      isMounted = false;
    };
  }, [selectedParentCategory, parentCategories]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (parentDropdownRef.current && !parentDropdownRef.current.contains(event.target as Node)) {
        setIsParentDropdownOpen(false);
      }
      if (childDropdownRef.current && !childDropdownRef.current.contains(event.target as Node)) {
        setIsChildDropdownOpen(false);
      }
    };
    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setIsParentDropdownOpen(false);
        parentTriggerRef.current?.focus();
        setIsChildDropdownOpen(false);
        childTriggerRef.current?.focus();
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    document.addEventListener('keydown', handleEscape);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleEscape);
    };
  }, []);

  useEffect(() => {
    if (isParentCategoryLoading || parentCategoryError) {
      setIsParentDropdownOpen(false);
    }
  }, [isParentCategoryLoading, parentCategoryError]);

  const disableParentSelect = isParentCategoryLoading || !!parentCategoryError;
  const selectedParentCategoryLabel =
    parentCategories.find((category) => category.slug === selectedParentCategory)?.name ?? 'Select parent category';

  const toggleParentDropdown = () => {
    if (disableParentSelect) {
      return;
    }
    setIsParentDropdownOpen((previous) => !previous);
  };

  const handleParentCategorySelect = (slug: string) => {
    setSelectedParentCategory(slug);
    setIsParentDropdownOpen(false);
    // Return focus to trigger for better UX/a11y
    window.setTimeout(() => parentTriggerRef.current?.focus(), 0);
  };

  const toggleChildDropdown = () => {
    if (isChildCategoryLoading || !!childCategoryError || availableChildCategories.length === 0) {
      return;
    }
    setIsChildDropdownOpen((prev) => {
      const next = !prev;
      if (!next) {
        setChildSearch('');
      }
      return next;
    });
  };

  return (
    <>
      <Head>
        <title>JobMatch · LaTeX Resume Upload</title>
        <meta name="description" content="Upload LaTeX resume sources so admins can publish templates to the JobMatch pods." />
      </Head>
      <main className={styles.workspaceShell}>
        <div className={styles.workspaceLayout}>
          <aside className={styles.workspaceSidebar}>
            <Link href="/workspace/overview" className={styles.sidebarBrandLink} aria-label="Workspace home">
              <span className={styles.sidebarBrandMark}>JM</span>
              <span>JobMatch App</span>
            </Link>

            <section className={styles.sidebarProfileCard} aria-labelledby="profile-card-title">
              <div className={styles.sidebarProfileHeader}>
                <span className={styles.sidebarProfileAvatar} aria-hidden="true">
                  {sidebarProfile.initials}
                </span>
                <div className={styles.sidebarProfileMeta}>
                  <span className={styles.sidebarProfileName} id="profile-card-title">
                    {sidebarProfile.name}
                  </span>
                  <span className={styles.sidebarProfileTagline}>{sidebarProfile.tagline}</span>
                  <span className={styles.sidebarProfileEmail}>{sidebarProfile.email}</span>
                </div>
              </div>
            </section>

            <nav aria-label="Workspace">
              <ul className={styles.sidebarMenu}>
                {NAV_LINKS.map((link) => (
                  <li key={link.label} className={styles.sidebarMenuItem}>
                    <Link
                      href={link.href}
                      className={`${styles.sidebarMenuLink} ${link.active ? styles.sidebarMenuLinkActive : ''}`}
                    >
                      <span>{link.label}</span>
                    </Link>
                  </li>
                ))}
              </ul>
            </nav>
          </aside>

          <div className={styles.workspaceMain}>
            <section className={styles.sectionIntro}>
              <h2>Upload &amp; edit resume source</h2>
              <p>Drop LaTeX files, tweak the raw source, and confirm the rendered view before publishing to pods.</p>
            </section>

            <div className={styles.editorLayout}>
              <div className={styles.latexEditorCard}>
                <div className={styles.latexFields}>
                  <label>
                    <span>Template name</span>
                    <input type="text" placeholder="e.g. AI Researcher Sprint" defaultValue="AI Researcher Sprint" />
                  </label>
                  <label>
                    <span>Owner pod</span>
                    <input type="text" placeholder="e.g. Innovation pod" defaultValue="Innovation pod · SF" />
                  </label>
                  <label>
                    <span>Parent category</span>
                    <div
                      className={`${styles.customSelect} ${disableParentSelect ? styles.customSelectDisabled : ''}`}
                      ref={parentDropdownRef}
                    >
                      <button
                        type="button"
                        className={styles.customSelectTrigger}
                        onClick={toggleParentDropdown}
                        aria-haspopup="listbox"
                        aria-expanded={isParentDropdownOpen}
                        disabled={disableParentSelect}
                        ref={parentTriggerRef}
                      >
                        <span>{selectedParentCategoryLabel}</span>
                        <span aria-hidden="true" className={styles.customSelectCaret}>
                          ▾
                        </span>
                      </button>
                      {isParentDropdownOpen ? (
                        <div className={styles.customSelectOptions} role="listbox" aria-label="Parent categories">
                          {parentCategories.length === 0 ? (
                            <p className={styles.customSelectEmpty}>No parent categories found.</p>
                          ) : null}
                          {parentCategories.map((category) => (
                            <button
                              type="button"
                              key={category.id}
                              className={`${styles.customSelectOption} ${
                                selectedParentCategory === category.slug ? styles.customSelectOptionActive : ''
                              }`}
                              role="option"
                              aria-selected={selectedParentCategory === category.slug}
                              onMouseDown={() => handleParentCategorySelect(category.slug)}
                              onClick={(event) => {
                                event.stopPropagation();
                                // Fallback close in case onMouseDown is prevented in some browsers
                                handleParentCategorySelect(category.slug);
                              }}
                            >
                              {category.name}
                            </button>
                          ))}
                        </div>
                      ) : null}
                    </div>
                    {isParentCategoryLoading ? (
                      <span className={styles.formHelperText}>Loading parent categories…</span>
                    ) : null}
                    {parentCategoryError ? (
                      <p className={styles.renderError} role="alert">
                        {parentCategoryError}
                      </p>
                    ) : null}
                  </label>
                  <div className={styles.categoryField}>
                    <span>Child categories</span>
                    <div className={styles.customSelect} ref={childDropdownRef}>
                      <button
                        type="button"
                        className={styles.customSelectTrigger}
                        onClick={toggleChildDropdown}
                        aria-haspopup="listbox"
                        aria-expanded={isChildDropdownOpen}
                        disabled={isChildCategoryLoading || !!childCategoryError || availableChildCategories.length === 0}
                        ref={childTriggerRef}
                      >
                        {(() => {
                          if (isChildCategoryLoading) return <span>Loading child categories…</span>;
                          if (childCategoryError) return <span>Child categories unavailable</span>;
                          if (availableChildCategories.length === 0) return <span>No child categories</span>;
                          const selectedNames = childCategories
                            .map((slug) => availableChildCategories.find((c) => c.slug === slug)?.name)
                            .filter(Boolean) as string[];
                          if (selectedNames.length === 0) return <span>Select child categories</span>;
                          const visible = selectedNames.slice(0, 2);
                          const extra = selectedNames.length - visible.length;
                          return (
                            <span className={styles.selectTriggerContent}>
                              {visible.map((name) => (
                                <span key={name} className={styles.selectedBadge}>{name}</span>
                              ))}
                              {extra > 0 ? <span className={styles.selectedBadgeMore}>+{extra}</span> : null}
                            </span>
                          );
                        })()}
                        <span aria-hidden="true" className={styles.customSelectCaret}>▾</span>
                      </button>

                      {isChildDropdownOpen ? (
                        <div
                          className={styles.customSelectOptions}
                          role="listbox"
                          aria-label="Child categories"
                        >
                          <div className={styles.customSelectHeader}>
                            <input
                              type="text"
                              value={childSearch}
                              onChange={(e) => setChildSearch(e.target.value)}
                              placeholder="Search categories…"
                              className={styles.customSelectSearch}
                              aria-label="Search child categories"
                              autoFocus
                            />
                          </div>

                          {availableChildCategories.length === 0 ? (
                            <p className={styles.customSelectEmpty}>No child categories found.</p>
                          ) : null}

                          {(() => {
                            const query = childSearch.trim().toLowerCase();
                            const list = query
                              ? availableChildCategories.filter((c) => c.name.toLowerCase().includes(query))
                              : availableChildCategories;
                            if (list.length === 0) {
                              return <p className={styles.customSelectEmpty}>No results for “{childSearch}”.</p>;
                            }
                            return (
                              <div className={styles.customSelectGrid}>
                                {list.map((option) => {
                                  const checked = childCategories.includes(option.slug);
                                  return (
                                    <label
                                      key={option.id}
                                      className={styles.customChipOption}
                                      role="option"
                                      aria-selected={checked}
                                    >
                                      <input
                                        type="checkbox"
                                        checked={checked}
                                        onChange={() => toggleChildCategory(option.slug)}
                                        aria-label={option.name}
                                      />
                                      <span>{option.name}</span>
                                    </label>
                                  );
                                })}
                              </div>
                            );
                          })()}

                          <div className={styles.customSelectActions}>
                            <button
                              type="button"
                              className={styles.secondaryActionButton}
                              onClick={() => setChildCategories([])}
                              disabled={childCategories.length === 0}
                            >
                              Clear
                            </button>
                            <button
                              type="button"
                              className={styles.primaryActionButton}
                              onMouseDown={() => setIsChildDropdownOpen(false)}
                              onClick={() => {
                                setIsChildDropdownOpen(false);
                                childTriggerRef.current?.focus();
                              }}
                            >
                              Done
                            </button>
                          </div>
                        </div>
                      ) : null}
                    </div>
                    {isChildCategoryLoading ? (
                      <span className={styles.formHelperText}>Loading child categories…</span>
                    ) : null}
                    {childCategoryError ? (
                      <p className={styles.renderError} role="alert">{childCategoryError}</p>
                    ) : null}
                  </div>
                  <label>
                    <span>Version</span>
                    <input type="text" placeholder="e.g. v1.2" defaultValue="v1.0" />
                  </label>
                </div>

                <label className={styles.latexTextareaLabel} htmlFor="latex-source">
                  <span>Raw LaTeX source</span>
                </label>
                <div className={styles.latexTextareaGroup}>
                  <div className={styles.latexLineNumbers} aria-hidden="true" ref={lineNumbersRef}>
                    {lineNumberLabels.map((_, index) => (
                      <span key={`line-${index}`}>{index + 1}</span>
                    ))}
                  </div>
                  <textarea
                    id="latex-source"
                    className={styles.latexTextarea}
                    value={latexSource}
                    onChange={(event) => setLatexSource(event.target.value)}
                    onScroll={syncLineNumbersScroll}
                    spellCheck={false}
                  />
                </div>

                <div className={styles.editorActions}>
                  <button
                    type="button"
                    className={styles.primaryActionButton}
                    onClick={() => {
                      void triggerRender();
                    }}
                    disabled={isRendering}
                  >
                    {isRendering ? 'Rendering…' : 'Render preview'}
                  </button>
                  <button type="button" className={styles.secondaryActionButton}>
                    Save draft
                  </button>
                  <button
                    type="button"
                    className={styles.primaryActionButton}
                    onClick={handleSave}
                  >
                    Save
                  </button>
                </div>
                {renderError ? (
                  <p className={styles.renderError} role="alert">
                    {renderError}
                  </p>
                ) : null}
              </div>

              <div className={styles.previewPanel}>
                <div className={styles.previewToolbar}>
                  <div>
                    <span className={styles.previewBadge}>Real-time</span>
                    <h3>Preview canvas</h3>
                    <p>Matches the PDF + HTML render pods see before publish.</p>
                  </div>
                  <button
                    type="button"
                    className={styles.secondaryActionButton}
                    disabled={!previewUrl || isRendering}
                    onClick={openPreviewInNewTab}
                  >
                    Open full view
                  </button>
                  <button
                    type="button"
                    className={styles.secondaryActionButton}
                    disabled={!previewUrl || isRendering}
                    onClick={downloadPreview}
                  >
                    Export PDF
                  </button>
                </div>

                <div className={styles.previewPdfStage} aria-live="polite">
                  {isRendering ? (
                    <div className={styles.previewPlaceholder}>Rendering PDF preview…</div>
                  ) : previewUrl ? (
                    <object data={previewUrl} type="application/pdf" className={styles.previewPdfFrame}>
                      <p>
                        PDF preview unavailable in this browser.
                        <button type="button" onClick={downloadPreview}>
                          Download preview
                        </button>
                      </p>
                    </object>
                  ) : (
                    <div className={styles.previewPlaceholder}>Click Render preview to view the PDF output.</div>
                  )}
                </div>

                <div className={styles.previewCodeBlock}>
                  <span>Source excerpt</span>
                  <pre>
                    {previewExcerpt || latexSource.slice(0, 340)}
                    {!previewExcerpt && latexSource.length > 340 ? '…' : ''}
                  </pre>
                </div>
              </div>
            </div>

            <section className={styles.sectionIntro}>
              <h2>Pre-flight checklist</h2>
              <p>Every upload runs through these guardrails before surfacing in the workspace.</p>
            </section>

            <div className={styles.uploadChecklist}>
              <h3>Review before publish</h3>
              <ul>
                {UPLOAD_CHECKLIST.map((item) => (
                  <li key={item.title}>
                    <strong>{item.title}</strong>
                    <p>{item.detail}</p>
                  </li>
                ))}
              </ul>
            </div>

            <section className={styles.sectionIntro}>
              <h2>Supported attachments</h2>
              <p>Keep packages lean so reviewers can compile the resume preview directly from this dashboard.</p>
            </section>

            <div className={styles.uploadMatrix}>
              {SUPPORTED_ATTACHMENTS.map((file) => (
                <article key={file.type}>
                  <strong>{file.type}</strong>
                  <p>{file.purpose}</p>
                  <span>Max {file.maxSize}</span>
                </article>
              ))}
            </div>

            <section className={styles.sectionIntro}>
              <h2>Pipeline overview</h2>
              <p>Admins see the same stages that surface in the workspace overview once a LaTeX resume is submitted.</p>
            </section>

            <div className={styles.summaryGrid}>
              {PIPELINE_PHASES.map((phase) => (
                <article key={phase.name} className={styles.summaryCard}>
                  <div>
                    <strong>{phase.name}</strong>
                    <p>{phase.detail}</p>
                    <p>Owner: {phase.owner}</p>
                  </div>
                  <button type="button">Track SLA</button>
                </article>
              ))}
            </div>
          </div>
        </div>
      </main>
    </>
  );
}

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

const CHILD_CATEGORY_OPTIONS = [
  { value: 'ai-specialist', label: 'AI specialist' },
  { value: 'ats-ready', label: 'ATS ready' },
  { value: 'campus-hiring', label: 'Campus hiring' },
  { value: 'leadership', label: 'Leadership' },
  { value: 'rev-ops', label: 'Revenue operations' },
  { value: 'global', label: 'Global template' },
  { value: 'design-system', label: 'Design system' },
  { value: 'executive-suite', label: 'Executive suite' },
  { value: 'university', label: 'University recruiting' },
];

export default function LatexUploadPage() {
  const [sidebarProfile, setSidebarProfile] = useState<SidebarProfile>(DEFAULT_SIDEBAR_PROFILE);
  const [latexSource, setLatexSource] = useState<string>(SAMPLE_LATEX.trim());
  const [childCategories, setChildCategories] = useState<string[]>(['ai-specialist', 'ats-ready']);
  const [isRendering, setIsRendering] = useState(false);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [renderError, setRenderError] = useState<string | null>(null);
  const [previewExcerpt, setPreviewExcerpt] = useState('');
  const lineNumbersRef = useRef<HTMLDivElement | null>(null);

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
    setSidebarProfile(resolveSidebarProfile(DEFAULT_SIDEBAR_PROFILE));
  }, []);

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
                    <select defaultValue="resume-ops">
                      <option value="">Select parent category</option>
                      <option value="resume-ops">Resume operations</option>
                      <option value="eng-toolkit">Engineering toolkit</option>
                      <option value="sales">Go-to-market</option>
                    </select>
                  </label>
                  <div className={styles.categoryField}>
                    <span>Child categories</span>
                    <div className={styles.categoryChecklist} role="group" aria-label="Child categories">
                      {CHILD_CATEGORY_OPTIONS.map((option) => (
                        <label key={option.value} className={styles.categoryChecklistOption}>
                          <input
                            type="checkbox"
                            value={option.value}
                            checked={childCategories.includes(option.value)}
                            onChange={() => toggleChildCategory(option.value)}
                          />
                          <span>{option.label}</span>
                        </label>
                      ))}
                    </div>
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
                  <button type="button" className={styles.secondaryActionButton}>
                    Save draft
                  </button>
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

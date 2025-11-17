import Head from 'next/head';
import Link from 'next/link';
import { useEffect, useState, type FormEvent } from 'react';
import type { GetServerSideProps } from 'next';
import AppShell from '../../../../components/workspace/AppShell';
import { APP_MENU_ITEMS, DEFAULT_PROFILE_TASKS } from '../../../../components/workspace/navigation';
import styles from '../../../../styles/workspace/ResumeBuilder.module.css';
import { fetchResumeTemplateDetail, type ResumeTemplateDetailResponse } from '../../../../lib/resumeTemplates';
import { requestLatexPreview } from '../../../../lib/renderPreview';
import { fetchResumeDraft, saveResumeDraft } from '../../../../lib/resumeDrafts';
import { loadAccessToken } from '../../../../lib/authTokenStorage';

const PROFILE = {
  name: 'Kuntal Maity',
  tagline: 'Set your target role',
  initials: 'KM',
  progressLabel: '5%',
};

type TemplateEditorProps = {
  template: ResumeTemplateDetailResponse;
};

const toTitle = (value?: string | null) => {
  if (!value) {
    return 'Workspace template';
  }
  return value
    .split(/[-_]/)
    .map((segment) => segment.charAt(0).toUpperCase() + segment.slice(1))
    .join(' ');
};

export const getServerSideProps: GetServerSideProps<TemplateEditorProps> = async ({ params }) => {
  const rawId = params?.templateId;
  const idNumber = Number(Array.isArray(rawId) ? rawId[0] : rawId);

  if (!Number.isFinite(idNumber)) {
    return { notFound: true };
  }

  try {
    const template = await fetchResumeTemplateDetail(idNumber);
    return { props: { template } };
  } catch (error) {
    console.error('Failed to fetch template detail', error);
    return { notFound: true };
  }
};

export default function TemplateEditorPage({ template }: TemplateEditorProps) {
  const [draftTitle, setDraftTitle] = useState(`${template.title} Resume`);
  const [draftRole, setDraftRole] = useState('');
  const [draftSummary, setDraftSummary] = useState('');
  const [draftNotes, setDraftNotes] = useState('');
  const [latexDraft, setLatexDraft] = useState(template.latex_source ?? '');
  const [editorMessage, setEditorMessage] = useState<string | null>(null);
  const [editorError, setEditorError] = useState<string | null>(null);
  const [renderingPreview, setRenderingPreview] = useState(false);
  const [previewError, setPreviewError] = useState<string | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [previewExcerpt, setPreviewExcerpt] = useState<string | null>(null);
  const categoryLabel = toTitle(template.child_category_slug ?? template.parent_category_slug);
  const templateId = template.template_id;
  const [accessToken, setAccessToken] = useState<string | null>(null);
  const [loadingDraft, setLoadingDraft] = useState(false);
  const [savingDraft, setSavingDraft] = useState(false);

  useEffect(() => {
    const token = loadAccessToken();
    setAccessToken(token);
    if (!token) {
      setEditorMessage('Sign in to your workspace to save resume progress.');
    } else {
      setEditorMessage(null);
    }
  }, []);

  useEffect(() => {
    if (!accessToken) {
      setLoadingDraft(false);
      return;
    }

    let cancelled = false;
    const loadDraft = async () => {
      setLoadingDraft(true);
      try {
        const draft = await fetchResumeDraft(templateId, accessToken);
        if (cancelled) {
          return;
        }

        if (!draft) {
          setEditorMessage('No saved draft yet. Start customizing to create one.');
          setEditorError(null);
          return;
        }

        setDraftTitle(draft.title || `${template.title} Resume`);
        setDraftRole(draft.targetRole || '');
        setDraftSummary(draft.summary || '');
        setDraftNotes(draft.notes || '');
        setLatexDraft(draft.latexSource || template.latex_source || '');
        setEditorMessage('Restored your last saved draft from your workspace.');
        setEditorError(null);
      } catch (error) {
        if (cancelled) {
          return;
        }
        const message = error instanceof Error ? error.message : 'Unable to load your saved draft.';
        setEditorError(message);
      } finally {
        if (!cancelled) {
          setLoadingDraft(false);
        }
      }
    };

    loadDraft();
    return () => {
      cancelled = true;
    };
  }, [accessToken, templateId, template.latex_source, template.title]);

  const handleSave = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!accessToken) {
      setEditorError('Sign in to your workspace to save changes.');
      return;
    }

    setSavingDraft(true);
    setEditorError(null);
    try {
      const response = await saveResumeDraft(
        {
          templateId,
          title: draftTitle,
          latexSource: latexDraft,
          targetRole: draftRole,
          summary: draftSummary,
          notes: draftNotes,
          templateVersionId: null,
          templateVersionLabel: template.version_label ?? null,
          templateVersionNumber: template.version_number ?? null,
        },
        accessToken
      );
      const savedTime = response.savedAt
        ? new Date(response.savedAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        : null;
      setEditorMessage(
        savedTime
          ? `Draft saved to your workspace at ${savedTime}. Download or copy the LaTeX when you are ready.`
          : 'Draft saved to your workspace.'
      );
    } catch (saveError) {
      const message = saveError instanceof Error ? saveError.message : 'Unable to save your changes.';
      setEditorError(message);
    } finally {
      setSavingDraft(false);
    }
  };

  const handleDownloadLatex = () => {
    if (!latexDraft.trim()) {
      setEditorError('Nothing to download yet. Try editing the LaTeX first.');
      return;
    }

    const blob = new Blob([latexDraft], { type: 'text/plain;charset=utf-8' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = `${template.title}.tex`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(link.href);
    setEditorMessage('Downloaded a fresh .tex file with your changes.');
  };

  const handleCopyLatex = async () => {
    try {
      await navigator.clipboard.writeText(latexDraft);
      setEditorMessage('LaTeX copied to clipboard.');
      setEditorError(null);
    } catch (copyError) {
      console.error('Unable to copy LaTeX source', copyError);
      setEditorError('Unable to copy text. Please copy manually.');
    }
  };

  const handleRenderPreview = async () => {
    if (!latexDraft.trim()) {
      setPreviewError('Add LaTeX content before rendering a preview.');
      return;
    }

    setRenderingPreview(true);
    setPreviewError(null);
    setPreviewUrl(null);
    setPreviewExcerpt(null);
    try {
      const preview = await requestLatexPreview({
        latexSource: latexDraft,
        tokens: {
          candidate: draftTitle || template.title,
          role: draftRole || template.child_category_slug || template.parent_category_slug || 'Target Role',
          workspace: 'JobMatch Workspace',
        },
      });
      setPreviewUrl(preview.pdfDataUrl);
      setPreviewExcerpt(preview.excerpt);
      setEditorMessage('Preview refreshed.');
    } catch (renderError) {
      const message = renderError instanceof Error ? renderError.message : 'Unable to render preview.';
      setPreviewError(message);
    } finally {
      setRenderingPreview(false);
    }
  };

  return (
    <>
      <Head>
        <title>JobMatch · Edit {template.title}</title>
      </Head>
      <AppShell menuItems={APP_MENU_ITEMS} profileTasks={DEFAULT_PROFILE_TASKS} profile={PROFILE}>
        <div className={styles.page}>
          <section className={styles.templateHero}>
            <div className={styles.templateHeroContent}>
              <p className={styles.heroTag}>{categoryLabel}</p>
              <h1>{template.title}</h1>
              <p>
                Customize the LaTeX blueprint curated by the JobMatch admin team. Edit copy, add your own metrics, and
                render a pixel-perfect PDF before you export.
              </p>
              <div className={styles.heroMeta}>
                <div>
                  <span>Owner</span>
                  <strong>{template.owner_name || template.owner_email || 'JobMatch Admin'}</strong>
                </div>
                <div>
                  <span>Version</span>
                  <strong>{template.version_label ?? `v${template.version_number ?? 1}`}</strong>
                </div>
                <div>
                  <span>Status</span>
                  <strong>{template.status_label}</strong>
                </div>
              </div>
            </div>
            <div className={styles.heroActionsStack}>
              <Link href="/workspace/create-resume/resume-builder" className={styles.secondaryAction}>
                ← Back to gallery
              </Link>
              <button type="button" className={styles.primaryAction} onClick={handleRenderPreview} disabled={renderingPreview}>
                {renderingPreview ? 'Rendering preview…' : 'Render preview'}
              </button>
            </div>
          </section>

          <div className={styles.templateLayout}>
            <section className={styles.templateEditorCard}>
              <header className={styles.editorHeader}>
                <div>
                  <p className={styles.sectionTag}>Content editor</p>
                  <h3>Fine-tune before exporting</h3>
                </div>
              </header>
              <p className={styles.editorIntro}>
                Update metadata, jot notes for AI rewrites, and edit the raw LaTeX source. Changes stay local until you download or copy the template.
              </p>
              {editorError ? (
                <p className={styles.templatesError} role="alert">
                  {editorError}
                </p>
              ) : null}
              <form className={styles.editorForm} onSubmit={handleSave}>
                <label>
                  Resume title
                  <input
                    type="text"
                    value={draftTitle}
                    onChange={(event) => setDraftTitle(event.target.value)}
                    placeholder="e.g. Staff Product Designer Resume"
                    required
                  />
                </label>
                <label>
                  Target role
                  <input
                    type="text"
                    value={draftRole}
                    onChange={(event) => setDraftRole(event.target.value)}
                    placeholder="Role, level, or company focus"
                  />
                </label>
                <label>
                  Summary / top section
                  <textarea
                    value={draftSummary}
                    onChange={(event) => setDraftSummary(event.target.value)}
                    rows={4}
                    placeholder="Highlight measurable wins you want the template to emphasize."
                  />
                </label>
                <label>
                  Quick notes for AI rewrite
                  <textarea
                    value={draftNotes}
                    onChange={(event) => setDraftNotes(event.target.value)}
                    rows={3}
                    placeholder="List keywords, new metrics, or storytelling cues."
                  />
                </label>
                <label>
                  LaTeX source
                  <textarea
                    value={latexDraft}
                    onChange={(event) => setLatexDraft(event.target.value)}
                    rows={16}
                    className={styles.latexTextarea}
                    placeholder="Full LaTeX template pulled from the admin system."
                    required
                  />
                </label>
                <div className={styles.editorActions}>
                  <button
                    type="submit"
                    className={styles.primaryAction}
                    disabled={savingDraft || loadingDraft || !accessToken}
                  >
                    {savingDraft ? 'Saving…' : 'Save changes'}
                  </button>
                  <button type="button" className={styles.editorButton} onClick={handleDownloadLatex}>
                    Download .tex
                  </button>
                  <button type="button" className={styles.editorButton} onClick={handleCopyLatex}>
                    Copy LaTeX
                  </button>
                </div>
                {editorMessage ? <p className={styles.editorMessage}>{editorMessage}</p> : null}
              </form>
            </section>

            <aside className={styles.previewSidebar}>
              <div className={styles.previewSidebarHeader}>
                <p className={styles.sectionTag}>Live PDF preview</p>
                <p>
                  Render your LaTeX to a PDF to confirm spacing and typography before exporting. We&apos;ll show a quick excerpt for reference.
                </p>
              </div>
              {previewError ? (
                <p className={styles.templatesError} role="alert">
                  {previewError}
                </p>
              ) : null}
              {previewUrl ? (
                <>
                  {previewExcerpt ? <p className={styles.previewExcerpt}>{previewExcerpt}</p> : null}
                  <iframe title="Resume PDF preview" src={previewUrl} className={styles.previewFrame} />
                </>
              ) : (
                <div className={styles.previewPlaceholder}>
                  <p>Render the PDF preview to visualize your template instantly.</p>
                  <button type="button" className={styles.primaryAction} onClick={handleRenderPreview} disabled={renderingPreview}>
                    {renderingPreview ? 'Rendering preview…' : 'Render preview'}
                  </button>
                </div>
              )}
            </aside>
          </div>
        </div>
      </AppShell>
    </>
  );
}

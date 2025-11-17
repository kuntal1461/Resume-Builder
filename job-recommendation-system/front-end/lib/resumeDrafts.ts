import { getEnvironmentConfig } from './runtimeConfig';
import { describeNetworkError } from './networkErrors';

export type SaveResumeDraftPayload = {
  templateId: number;
  title: string;
  latexSource: string;
  targetRole?: string;
  summary?: string;
  notes?: string;
  templateVersionId?: number | null;
  templateVersionLabel?: string | null;
  templateVersionNumber?: number | null;
};

export type SaveResumeDraftResult = {
  success: boolean;
  message: string;
  resumeId: number;
  resumeVersionId: number;
  savedAt: string;
};

export type ResumeDraftSnapshot = {
  resumeId: number;
  resumeVersionId: number;
  templateId: number;
  title: string;
  latexSource: string;
  targetRole?: string | null;
  summary?: string | null;
  notes?: string | null;
  savedAt: string;
};

export async function saveResumeDraft(
  payload: SaveResumeDraftPayload,
  accessToken: string
): Promise<SaveResumeDraftResult> {
  if (!accessToken) {
    throw new Error('Sign in to your workspace to save a draft.');
  }

  const config = await getEnvironmentConfig();
  const apiBaseUrl = config.apiBaseUrl;

  try {
    const response = await fetch(`${apiBaseUrl}/workspace/resumes/draft`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${accessToken}`,
      },
      body: JSON.stringify({
        templateId: payload.templateId,
        title: payload.title,
        latexSource: payload.latexSource,
        targetRole: payload.targetRole ?? null,
        summary: payload.summary ?? null,
        notes: payload.notes ?? null,
        templateVersionId: payload.templateVersionId ?? null,
        templateVersionNumber: payload.templateVersionNumber ?? null,
        templateVersionLabel: payload.templateVersionLabel ?? null,
      }),
    });

    if (!response.ok) {
      const detail = await response.text();
      throw new Error(detail || 'Unable to save your resume draft.');
    }

    return (await response.json()) as SaveResumeDraftResult;
  } catch (error) {
    const { message } = describeNetworkError(error, 'Unable to save your resume draft. Please try again.', {
      apiBaseUrl,
    });
    throw new Error(message);
  }
}

export async function fetchResumeDraft(
  templateId: number,
  accessToken: string
): Promise<ResumeDraftSnapshot | null> {
  if (!accessToken) {
    throw new Error('Sign in to your workspace to load drafts.');
  }

  const config = await getEnvironmentConfig();
  const apiBaseUrl = config.apiBaseUrl;

  try {
    const response = await fetch(`${apiBaseUrl}/workspace/resumes/draft?templateId=${encodeURIComponent(templateId)}`, {
      headers: { Authorization: `Bearer ${accessToken}` },
    });

    if (response.status === 404) {
      return null;
    }

    if (!response.ok) {
      const detail = await response.text();
      throw new Error(detail || 'Unable to load your saved resume draft.');
    }

    return (await response.json()) as ResumeDraftSnapshot;
  } catch (error) {
    const { message } = describeNetworkError(error, 'Unable to load your saved resume draft.', { apiBaseUrl });
    throw new Error(message);
  }
}

import { generateLocalPreview } from './localPreview';
import { getEnvironmentConfig } from './runtimeConfig';

type RenderPreviewPayload = {
  latexSource: string;
  tokens?: {
    candidate?: string;
    role?: string;
    workspace?: string;
  };
};

type RenderPreviewResponse = {
  pdfDataUrl: string;
  excerpt: string;
  tokens: {
    candidate?: string;
    role?: string;
    workspace?: string;
  };
  log?: string;
};

export async function requestLatexPreview(payload: RenderPreviewPayload): Promise<RenderPreviewResponse> {
  try {
    const { renderServiceBaseUrl } = await getEnvironmentConfig();
    const response = await fetch(`${renderServiceBaseUrl}/render`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
    });

    if (!response.ok) {
      const data = await response.json().catch(() => ({}));
      const reason = typeof data.error === 'string' ? data.error : 'Render service error';
      throw new Error(reason);
    }

    return (await response.json()) as RenderPreviewResponse;
  } catch (error) {
    if (error instanceof TypeError) {
      console.warn('Render service unreachable, falling back to local generator', error);
      return generateLocalPreview(payload.latexSource, payload.tokens);
    }
    throw error;
  }
}

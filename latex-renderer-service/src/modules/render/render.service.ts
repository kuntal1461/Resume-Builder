import { buildPreviewMetadata, type PreviewTokens } from './pdfPreview';
import { compileLatexToPdf } from './latexCompiler';

export type RenderRequest = {
  latexSource: string;
  templateName?: string | undefined;
  tokens?: PreviewTokens | undefined;
  attachments?: Array<{ filename: string; contentType: string; size: number }> | undefined;
};

export type RenderResponse = {
  pdfDataUrl: string;
  excerpt: string;
  tokens: PreviewTokens;
  log: string;
};

export class RenderService {
  async renderPreview(request: RenderRequest): Promise<RenderResponse> {
    const { pdfBuffer, log } = await compileLatexToPdf(request.latexSource);
    const preview = buildPreviewMetadata(request.latexSource, request.tokens);
    return {
      pdfDataUrl: `data:application/pdf;base64,${pdfBuffer.toString('base64')}`,
      excerpt: preview.excerpt,
      tokens: preview.tokens,
      log,
    };
  }
}

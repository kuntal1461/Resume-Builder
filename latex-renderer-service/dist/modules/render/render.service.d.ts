import { type PreviewTokens } from './pdfPreview';
export type RenderRequest = {
    latexSource: string;
    templateName?: string | undefined;
    tokens?: PreviewTokens | undefined;
    attachments?: Array<{
        filename: string;
        contentType: string;
        size: number;
    }> | undefined;
};
export type RenderResponse = {
    pdfDataUrl: string;
    excerpt: string;
    tokens: PreviewTokens;
    log: string;
};
export declare class RenderService {
    renderPreview(request: RenderRequest): Promise<RenderResponse>;
}
//# sourceMappingURL=render.service.d.ts.map
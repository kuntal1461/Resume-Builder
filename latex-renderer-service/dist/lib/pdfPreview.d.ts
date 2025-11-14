export type PreviewTokens = {
    candidate?: string | undefined;
    role?: string | undefined;
    workspace?: string | undefined;
};
export declare const buildPreviewMetadata: (latexSource: string, tokens?: PreviewTokens) => {
    excerpt: string;
    tokens: {
        candidate: string;
        role: string;
        workspace: string;
    };
};
//# sourceMappingURL=pdfPreview.d.ts.map
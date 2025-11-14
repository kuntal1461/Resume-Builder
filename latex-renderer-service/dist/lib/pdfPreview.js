"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.buildPreviewMetadata = void 0;
const DEFAULT_TOKENS = {
    candidate: 'Elena Kapoor',
    role: 'LLM Operations Lead',
    workspace: 'Velocity Pod · SF',
};
const sanitizeLine = (value) => {
    return value.replace(/[^\x20-\x7E]/g, ' ').replace(/\s+/g, ' ').trim();
};
const buildExcerpt = (latex) => {
    const documentStart = latex.indexOf('\\begin{document}');
    const documentEnd = latex.indexOf('\\end{document}');
    const body = documentStart >= 0
        ? latex.slice(documentStart + '\\begin{document}'.length, documentEnd >= 0 ? documentEnd : undefined)
        : latex;
    return (body
        .replace(/%.*/g, ' ')
        .replace(/\\definecolor\{[^}]+}\{[^}]+}\{[^}]+}/g, ' ')
        .replace(/\bHTML\s+[0-9A-Fa-f]{4,}\b/g, ' ')
        .replace(/\\[a-zA-Z]+\*?(?:\[[^\]]*])?(?:\{[^}]*})?/g, ' ')
        .replace(/[{}]/g, ' ')
        .replace(/\s+/g, ' ')
        .trim() || 'No LaTeX content provided.');
};
const buildPreviewMetadata = (latexSource, tokens = {}) => {
    const hydratedTokens = {
        candidate: tokens.candidate ?? DEFAULT_TOKENS.candidate,
        role: tokens.role ?? DEFAULT_TOKENS.role,
        workspace: tokens.workspace ?? DEFAULT_TOKENS.workspace,
    };
    const rawExcerpt = buildExcerpt(latexSource);
    const excerpt = sanitizeLine(rawExcerpt).slice(0, 240);
    return {
        excerpt,
        tokens: {
            candidate: sanitizeLine(hydratedTokens.candidate),
            role: sanitizeLine(hydratedTokens.role),
            workspace: sanitizeLine(hydratedTokens.workspace),
        },
    };
};
exports.buildPreviewMetadata = buildPreviewMetadata;
//# sourceMappingURL=pdfPreview.js.map
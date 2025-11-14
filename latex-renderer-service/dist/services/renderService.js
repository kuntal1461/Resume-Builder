"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.RenderService = void 0;
const pdfPreview_1 = require("../lib/pdfPreview");
const latexCompiler_1 = require("./latexCompiler");
class RenderService {
    async renderPreview(request) {
        const { pdfBuffer, log } = await (0, latexCompiler_1.compileLatexToPdf)(request.latexSource);
        const preview = (0, pdfPreview_1.buildPreviewMetadata)(request.latexSource, request.tokens);
        return {
            pdfDataUrl: `data:application/pdf;base64,${pdfBuffer.toString('base64')}`,
            excerpt: preview.excerpt,
            tokens: preview.tokens,
            log,
        };
    }
}
exports.RenderService = RenderService;
//# sourceMappingURL=renderService.js.map
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.renderRouter = void 0;
const express_1 = require("express");
const zod_1 = require("zod");
const renderService_1 = require("../services/renderService");
const renderService = new renderService_1.RenderService();
const renderRequestSchema = zod_1.z.object({
    latexSource: zod_1.z.string().min(1, 'LaTeX source is required'),
    templateName: zod_1.z.string().optional(),
    tokens: zod_1.z
        .object({
        candidate: zod_1.z.string().optional(),
        role: zod_1.z.string().optional(),
        workspace: zod_1.z.string().optional(),
    })
        .optional(),
    attachments: zod_1.z
        .array(zod_1.z.object({
        filename: zod_1.z.string(),
        contentType: zod_1.z.string(),
        size: zod_1.z.number().nonnegative(),
    }))
        .optional(),
});
exports.renderRouter = (0, express_1.Router)();
exports.renderRouter.post('/', async (req, res) => {
    const parsed = renderRequestSchema.safeParse(req.body);
    if (!parsed.success) {
        return res.status(422).json({ error: 'Invalid request payload', details: parsed.error.flatten() });
    }
    try {
        const result = await renderService.renderPreview(parsed.data);
        return res.status(200).json(result);
    }
    catch (error) {
        const message = error instanceof Error ? error.message : 'Failed to render LaTeX source.';
        return res.status(500).json({ error: message });
    }
});
//# sourceMappingURL=renderRouter.js.map
import { Router } from 'express';
import { z } from 'zod';
import { RenderService } from './render.service';

const renderService = new RenderService();

const renderRequestSchema = z.object({
  latexSource: z.string().min(1, 'LaTeX source is required'),
  templateName: z.string().optional(),
  tokens: z
    .object({
      candidate: z.string().optional(),
      role: z.string().optional(),
      workspace: z.string().optional(),
    })
    .optional(),
  attachments: z
    .array(
      z.object({
        filename: z.string(),
        contentType: z.string(),
        size: z.number().nonnegative(),
      }),
    )
    .optional(),
});

export const renderRouter = Router();

renderRouter.post('/', async (req, res) => {
  const parsed = renderRequestSchema.safeParse(req.body);

  if (!parsed.success) {
    return res.status(422).json({ error: 'Invalid request payload', details: parsed.error.flatten() });
  }

  try {
    const result = await renderService.renderPreview(parsed.data);
    return res.status(200).json(result);
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Failed to render LaTeX source.';
    return res.status(500).json({ error: message });
  }
});

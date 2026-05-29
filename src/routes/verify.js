import { Router } from 'express';
import sharp from 'sharp';
import { z } from 'zod';
import { upload } from '../middleware/upload.js';
import { getProvider, listProviders } from '../providers/index.js';
import { config } from '../config/index.js';

const router = Router();

const querySchema = z.object({
  provider: z.string().optional(),
});

/**
 * POST /api/verify
 * Accepts multipart/form-data with an `image` field.
 * Optional query param: ?provider=openai|anthropic
 */
router.post('/', upload.single('image'), async (req, res, next) => {
  try {
    if (!req.file) {
      console.log("req", req);
      return res.status(400).json({ error: 'No image file provided. Use field name "image".' });
    }

    const query = querySchema.safeParse(req.query);
    if (!query.success) {
      return res.status(400).json({ error: query.error.issues });
    }

    // Normalize image to JPEG via sharp to reduce token usage and ensure compatibility
    const normalized = await sharp(req.file.buffer)
      .resize({ width: 1024, withoutEnlargement: true })
      .jpeg({ quality: 85 })
      .toBuffer();

    const imageBase64 = normalized.toString('base64');
    const mimeType = 'image/jpeg';

    const provider = getProvider(query.data.provider);
    const result = await provider.verifyImage(imageBase64, mimeType);

    const verified = result.confidence >= config.verification.confidenceThreshold;

    return res.json({
      verified,
      threshold: config.verification.confidenceThreshold,
      ...result,
    });
  } catch (err) {
    next(err);
  }
});

/**
 * GET /api/verify/providers
 * Lists available LLM providers.
 */
router.get('/providers', (_req, res) => {
  res.json({
    available: listProviders(),
    active: config.llmProvider,
  });
});

export default router;

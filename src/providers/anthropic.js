import { BaseProvider } from './base.js';
import { buildVerificationPrompt, parseProviderResponse } from './prompt.js';

export class AnthropicProvider extends BaseProvider {
  constructor(config) {
    super(config);
    if (!config.apiKey) throw new Error('ANTHROPIC_API_KEY is required.');
    this.model = config.model;
    this.apiKey = config.apiKey;
  }

  get name() {
    return 'anthropic';
  }

  async verifyImage(imageBase64, mimeType) {
    // Lazy import so the package is optional
    const Anthropic = (await import('@anthropic-ai/sdk')).default;
    const client = new Anthropic({ apiKey: this.apiKey });

    const response = await client.messages.create({
      model: this.model,
      max_tokens: 1024,
      messages: [
        {
          role: 'user',
          content: [
            {
              type: 'image',
              source: { type: 'base64', media_type: mimeType, data: imageBase64 },
            },
            { type: 'text', text: buildVerificationPrompt(new Date().toISOString()) },
          ],
        },
      ],
    });

    const raw = response.content[0].text;
    return parseProviderResponse(raw, this.name, this.model);
  }
}

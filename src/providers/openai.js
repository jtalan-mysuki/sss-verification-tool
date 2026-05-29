import OpenAI from 'openai';
import { BaseProvider } from './base.js';
import { buildVerificationPrompt, parseProviderResponse } from './prompt.js';

export class OpenAIProvider extends BaseProvider {
  constructor(config) {
    super(config);
    if (!config.apiKey) throw new Error('OPENAI_API_KEY is required.');
    this.client = new OpenAI({ apiKey: config.apiKey });
    this.model = config.model;
  }

  get name() {
    return 'openai';
  }

  async verifyImage(imageBase64, mimeType) {
    const response = await this.client.chat.completions.create({
      model: this.model,
      max_tokens: 1024,
      messages: [
        {
          role: 'user',
          content: [
            { type: 'text', text: buildVerificationPrompt(new Date().toISOString()) },
            {
              type: 'image_url',
              image_url: { url: `data:${mimeType};base64,${imageBase64}`, detail: 'high' },
            },
          ],
        },
      ],
      response_format: { type: 'json_object' },
    });

    const raw = response.choices[0].message.content;
    return parseProviderResponse(raw, this.name, this.model);
  }
}

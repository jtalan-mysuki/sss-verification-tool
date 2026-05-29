import { GoogleGenerativeAI } from '@google/generative-ai';
import { BaseProvider } from './base.js';
import { buildVerificationPrompt, parseProviderResponse } from './prompt.js';

export class GeminiProvider extends BaseProvider {
  constructor(config) {
    super(config);
    if (!config.apiKey) throw new Error('GEMINI_API_KEY is required.');
    this.client = new GoogleGenerativeAI(config.apiKey);
    this.model = config.model;
  }

  get name() {
    return 'gemini';
  }

  async verifyImage(imageBase64, mimeType) {
    const model = this.client.getGenerativeModel({
      model: this.model,
      generationConfig: { responseMimeType: 'application/json' },
    });

    const result = await model.generateContent([
      buildVerificationPrompt(new Date().toISOString()),
      { inlineData: { mimeType, data: imageBase64 } },
    ]);

    const raw = result.response.text();
    return parseProviderResponse(raw, this.name, this.model);
  }
}

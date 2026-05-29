import { config } from '../config/index.js';
import { OpenAIProvider } from './openai.js';
import { AnthropicProvider } from './anthropic.js';
import { GeminiProvider } from './gemini.js';

const registry = {
  openai: () => new OpenAIProvider(config.openai),
  anthropic: () => new AnthropicProvider(config.anthropic),
  gemini: () => new GeminiProvider(config.gemini),
};

let _instance = null;

/**
 * Returns the singleton LLM provider instance based on LLM_PROVIDER env var.
 * Defaults to OpenAI.
 */
export function getProvider(providerName) {
  const key = providerName || config.llmProvider;
  if (!registry[key]) {
    throw new Error(
      `Unknown LLM provider "${key}". Available: ${Object.keys(registry).join(', ')}`
    );
  }
  if (!_instance || _instance.name !== key) {
    _instance = registry[key]();
  }
  return _instance;
}

export function listProviders() {
  return Object.keys(registry);
}

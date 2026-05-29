export const VERIFICATION_PROMPT = `You are an expert at identifying sari-sari stores — small neighborhood convenience stores common in the Philippines.

Analyze the provided image and determine whether it shows a sari-sari store.

Key characteristics of a sari-sari store:
- Small retail stall or room, often attached to or part of a residential home
- Merchandise displayed behind a window/grille or on shelves visible from outside
- Common products: snacks, beverages, toiletries, condiments, candies, cigarettes
- Sachet/single-serve products (tingi culture)
- Hand-painted signage or tarpaulin banners
- Common in Filipino neighborhoods (barangay)
- May have a small window counter or opening

Respond ONLY with a valid JSON object in this exact format:
{
  "isSariSariStore": boolean,
  "confidence": number between 0 and 1,
  "reasoning": "brief explanation of your decision",
  "detectedFeatures": ["list", "of", "observed", "features"]
}`;

export function parseProviderResponse(raw, providerName, model) {
  let parsed;
  try {
    // Strip markdown code fences if present
    const json = raw.replace(/^```(?:json)?\n?/i, '').replace(/\n?```$/i, '').trim();
    parsed = JSON.parse(json);
  } catch {
    throw new Error(`Provider "${providerName}" returned non-JSON response: ${raw}`);
  }

  return {
    isSariSariStore: Boolean(parsed.isSariSariStore),
    confidence: Number(parsed.confidence ?? 0),
    reasoning: parsed.reasoning ?? '',
    detectedFeatures: Array.isArray(parsed.detectedFeatures) ? parsed.detectedFeatures : [],
    provider: providerName,
    model,
  };
}

export function buildVerificationPrompt(currentDateTime) {
  return `You are an expert image analyst verifying photos submitted for a sari-sari store verification program.

Analyze the provided image and answer all four questions below.

Current date/time (UTC): ${currentDateTime}

---

**1. SARI-SARI STORE IDENTIFICATION**
Key characteristics of a sari-sari store:
- Small retail stall or room, often attached to or part of a residential home
- Merchandise displayed behind a window/grille or on shelves visible from outside
- Common products: snacks, beverages, toiletries, condiments, candies, cigarettes
- Sachet/single-serve products (tingi culture)
- Hand-painted signage or tarpaulin banners
- Common in Filipino neighborhoods (barangay)
- May have a small window counter or opening

**2. SCREENSHOT DETECTION**
Flag as a screenshot if ANY of these indicators are visible:
- Device status bars (battery icon, signal/WiFi bars, clock at the top edge of a screen)
- Browser address/URL bar, navigation buttons, or browser chrome
- Desktop taskbar, OS dock, or window title bar / close/minimize/maximize buttons
- On-screen mouse cursor or touch UI affordances
- Notification banners, system pop-ups, or overlaid UI dialogs
- Scroll bars or web/app UI control elements
- Screen glare, reflection, or moiré pattern from photographing a display
- Pixelated or aliased text rendering characteristic of screen fonts

**3. INTERNET/DOWNLOADED IMAGE DETECTION**
Flag as downloaded from the internet if ANY of these are present:
- Watermarks from stock agencies (Getty Images, Shutterstock, iStock, Adobe Stock, Alamy, Depositphotos, etc.)
- Website URLs, domain names, or brand logos overlaid on the image
- Social media post chrome (like/share/comment buttons, usernames, follower counts, platform UI)
- Obvious staged, studio-lit, or commercial-quality photography inconsistent with a genuine neighborhood store
- Copyright notices, photo credit text, or attribution strings embedded in the image
- News outlet branding, article headers, or web-page screenshot elements

**4. RECENCY — TAKEN WITHIN 24 HOURS**
Assess whether the photo was taken within the past 24 hours relative to the current date/time above:
- Look for visible date/time indicators: digital clocks, phone screen dates, receipts, newspapers, dated signage, or timestamps burned into the image
- If a visible date/time is found, compare it against the current date/time provided
- If no explicit date/time is visible, use contextual clues: lighting and shadows consistent with the current time of day, seasonal foliage or weather, recent product packaging or promotional signage, etc.
- Set isRecentPhoto to null only when there is genuinely no evidence either way

---

Respond ONLY with a valid JSON object in this exact format (no markdown, no extra keys):
{
  "isSariSariStore": boolean,
  "confidence": number between 0 and 1,
  "reasoning": "brief explanation of your sari-sari store decision",
  "detectedFeatures": ["list", "of", "observed", "store features"],
  "isScreenshot": boolean,
  "screenshotIndicators": ["list of screenshot clues found, or empty array if none"],
  "isDownloadedFromInternet": boolean,
  "internetIndicators": ["list of internet/download clues found, or empty array if none"],
  "isRecentPhoto": true | false | null,
  "recencyEvidence": "what visual evidence supports or contradicts that the photo was taken within 24 hours, or 'no evidence found'"
}`;
}

export function parseProviderResponse(raw, providerName, model) {
  let parsed;
  try {
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
    isScreenshot: Boolean(parsed.isScreenshot),
    screenshotIndicators: Array.isArray(parsed.screenshotIndicators) ? parsed.screenshotIndicators : [],
    isDownloadedFromInternet: Boolean(parsed.isDownloadedFromInternet),
    internetIndicators: Array.isArray(parsed.internetIndicators) ? parsed.internetIndicators : [],
    isRecentPhoto: parsed.isRecentPhoto === null || parsed.isRecentPhoto === undefined
      ? null
      : Boolean(parsed.isRecentPhoto),
    recencyEvidence: parsed.recencyEvidence ?? '',
    provider: providerName,
    model,
  };
}
